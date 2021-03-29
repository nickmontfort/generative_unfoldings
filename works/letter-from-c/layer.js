let n = new npyjs();

/*!
 * Following ScrabbleGAN components:
 *
 * ConditionalBatchNorm, ResNetBlockUp, NonLocalBlock,
 * SpatialEmbedding, makeGenerator
 *
 * were ported into tensorflow.js from their origial implementation
 * https://github.com/Nikolai10/scrabble-gan
 *
 * @license  MIT
 */
class ConditionalBatchNorm extends tf.layers.Layer{

    constructor(config){
        super({name:'CBN_'+config.name+'_'+config.cbn_idx});
        this.conditioning_vector = config.conditioning_vector;
        this.k_reg = config.k_reg;

        let d = config.cbn_idx - 1 + parseInt(config.name.slice(-1)) - 1;
        this.num_channels = 512;
        for (let i = 0; i < d; i ++){
            this.num_channels /= 2;
        }
    }

    build(input_shape){
        this.bn = tf.layers.batchNormalization({scale:false, center:false});
        this.dense1 = tf.layers.dense({units:this.num_channels, useBias:false,
                                       activation:'linear',
                                       kernelRegularizer:tf.regularizers.l2({}),
                                       kernelInitializer:tf.initializers.zeros()});
        this.dense2 = tf.layers.dense({units:this.num_channels, useBias:false,
                                       activation:'linear', kernelRegularizer:tf.regularizers.l2({}),
                                       kernelInitializer:tf.initializers.zeros()});
    }

    call(inputs, conditioning_vector, kwargs){
        let net = this.bn.apply(inputs);

        let gamma = this.dense1.apply(conditioning_vector);
        gamma = gamma.reshape([-1, 1, 1, this.num_channels]);
        gamma = tf.tile(gamma, [1, net.shape[1], net.shape[2], 1]);
        net = net.mul(gamma);

        let beta = this.dense2.apply(conditioning_vector);
        beta = beta.reshape([-1, 1, 1, this.num_channels]);
        net = net.add(beta);
        return net;
    }

    computeOutputShape(inputShape){
        return inputShape;
    }

    getClassName() { return 'ConditionalBatchNorm';}
}

class ResNetBlockUp extends tf.layers.Layer{
    constructor(config){
        super({name:'ResNetBlockUp' + '_' + config.name});
        this.nm = config.name;
        this.output_dim = config.output_dim;
        this.is_last_block = config.is_last_block;
        this.k_reg = config.k_reg;
    }

    build(inputShape){
        let up_stride = [2, 2];
        if (this.is_last_block){
            up_stride = [2, 1];
        }
        this.cbn = new ConditionalBatchNorm({name:this.nm, cbn_idx:1,
                                             k_reg:this.k_reg});
        this.conv2dT1 = tf.layers.conv2dTranspose({filters:this.output_dim,
                                                   kernelSize:(3, 3), strides:up_stride,
                                                   kernelRegularizer:tf.regularizers.l2(),
                                                   kernelInitializer:
                                                   tf.initializers.zeros(),
                                                   padding:'same', useBias:true});
        this.cbn2 = new ConditionalBatchNorm({name:this.nm, cbn_idx:2,
                                              k_reg:this.k_reg});
        this.conv2d = tf.layers.conv2d({filters:this.output_dim, kernelSize:(3, 3),
                                        strides:(1, 1),
                                        kernelInitializer:
                                        tf.initializers.zeros(),
                                        kernelRegularizer:tf.regularizers.l2(),
                                        padding:'same', useBias:true});
        this.conv2dT2 = tf.layers.conv2dTranspose({filters:this.output_dim,
                                                   kernelSize:(1, 1), strides:up_stride,
                                                   kernelInitializer:
                                                   tf.initializers.zeros(),
                                                   kernelRegularizer:tf.regularizers.l2(),
                                                   padding:'same', useBias:true});
    }

    call(inputs, conditioning_vector, kwargs){
        let net = inputs;

        net = this.cbn.apply(net, conditioning_vector);
        net = tf.relu(net);


        net = this.conv2dT1.apply(net);

        net = this.cbn2.apply(net, conditioning_vector);
        net = tf.relu(net);
        net = this.conv2d.apply(net);

        let shortcut = this.conv2dT2.apply(inputs);
        net = net.add(shortcut);
        return net;
    }

    computeOutputShape(inputShape){
        return [inputShape[0], inputShape[1]*2, inputShape[2]*2, inputShape[3]/2];
    }

    getClassName() { return 'ResNetBlockUp';}
}

class NonLocalBlock extends tf.layers.Layer{
    constructor(config){
        super({name:'NonLocalBlock' + '_' + config.name});
        this.k_reg = config.k_reg;
        this.num_channels = 64;
        this.num_channels_attn = Math.floor(this.num_channels / 8);
        this.num_channels_g = Math.floor(this.num_channels / 2);

    }

    build(input_shape){
        this.sigma = this.addWeight("sigma",
                                    [],
                                    'float32',
                                    tf.initializers.zeros(),
                                    undefined,
                                    true);
        this.conv2d1 = tf.layers.conv2d({filters:this.num_channels_attn,
                                       kernelSize:(1, 1), useBias:false,
                                       strides:(1, 1),
                                       padding:'same',
                                       kernelInitializer:tf.initializers.zeros(),
                                       kernelRegularizer:tf.regularizers.l2(),
                                       name:"conv2d_1"});
        this.conv2d2 = tf.layers.conv2d({filters:this.num_channels_attn,
                                         kernelSize:(1, 1), useBias:false,
                                         strides:(1, 1),
                                         padding:'same',
                                         kernelInitializer:tf.initializers.zeros(),
                                         kernelIegularizer:tf.regularizers.l2(),
                                         name:"conv2d_2"});
        this.maxpool = tf.layers.maxPooling2d({poolSize:[2, 2], strides:2});
        this.conv2d3 = tf.layers.conv2d({filters:this.num_channels_g,
                                         kernelSize:(1, 1), useBias:false,
                                         strides:(1, 1),
                                         padding:'same',
                                         kernelInitializer:tf.initializers.zeros(),
                                         kernelRegularizer:tf.regularizers.l2(),
                                         name:"conv2d_3"});
        this.conv2d4 = tf.layers.conv2d({filters:this.num_channels, kernelSize:(1, 1),
                                         useBias:false, strides:(1, 1),
                                         padding:'same',
                                         kernelInitializer:tf.initializers.zeros(),
                                         kernelRegularizer:tf.regularizers.l2(),
                                         name:"conv2d_4"});
    }

    _spatial_flatten(inputs){
        let shape = inputs.shape;
        return inputs.reshape([inputs.shape[0], -1, shape[3]]);
    }


    call(input){
        let h = input.shape[1];
        let w = input.shape[2];


        let theta = this.conv2d1.apply(input);
        theta = this._spatial_flatten(theta);

        let phi = this.conv2d2.apply(input);
        phi = this.maxpool.apply(phi);
        phi = this._spatial_flatten(phi);

        let attn = theta.matMul(phi, false, true);
        attn = attn.softmax();

        let g = this.conv2d3.apply(input);
        g = tf.layers.maxPooling2d({poolSize:[2, 2], strides:2}).apply(g);
        g = this._spatial_flatten(g);

        let attn_g = attn.matMul(g);
        attn_g = attn_g.reshape([attn_g.shape[0], h, -1, this.num_channels_g]);
        attn_g = this.conv2d4.apply(attn_g);

        let result = this.sigma.val.mul(attn_g).add(input);
        return result;
    }

    computeOutputShape(inputShape){
        return inputShape;
    }

    getClassName() { return 'NonLocalBlock'; }

}

class SpatialEmbedding extends tf.layers.Layer{
    constructor(config){
        super({name:'SpatialEmbedding'});
        this.vocab_size = config.vocab_size;
        this.filter_dim = config.filter_dim;
    }

    build(inputShape){
        this.kernel = this.addWeight("filter_bank",
                                     [this.vocab_size, this.filter_dim[0], this.filter_dim[1]],
                                     null, tf.initializers.zeros(), null, true);
    }

    computeOutputShape(inputShape){
        return [inputShape[0], this.filter_dim[0], this.filter_dim[1]];
    }

    call(inputs, kwargs){
        let gat = tf.gather(this.kernel.val, inputs, 0);
        return gat;
    }

    getClassName() { return 'SpatialEmbedding'; }

}

class GeneratorPrep extends tf.layers.Layer{
    constructor(config){
        super({name:'GeneratorPrep'});
        this.y = config.y;
        this.num_blocks = config.num_blocks;
        this.vocab_size = config.vocab_size;
        this.seed_size_h = config.seed_size_h;
        this.seed_size_w = config.seed_size_w;
        this.embed_y = config.embed_y;
        this.out_channels = config.out_channels;
        this.kernel_reg = config.kernel_reg;
        this.blocks_with_attention = config.blocks_with_attention;
        this.c = config.c;
    }

    build(input_shape){
        this.spatial_embedding = new SpatialEmbedding({vocab_size:this.vocab_size, filter_dim:this.embed_y});
        this.bn = tf.layers.batchNormalization();
        this.conv2d = tf.layers.conv2d({filters:this.c, kernelSize:(3, 3),
                                        strides:(1, 1),
                                        kernelInitializer:
                                        tf.initializers.randomNormal({ mean: 0.0, stddev: 1.0 }),
                                        kernelInitializer:tf.initializers.zeros(),
                                        padding:'same'});
        this.B_list = [];
        for (let block_idx = 0; block_idx < this.num_blocks; block_idx++){
            let name = "B"+(block_idx + 1).toString();
            let is_last_block = block_idx == this.num_blocks - 1;
            let res = new ResNetBlockUp({name:name,
                                         output_dim:this.out_channels[block_idx],
                                         is_last_block:is_last_block,
                                         k_reg:this.kernel_reg});
            this.B_list.push(res);
            if (this.blocks_with_attention.includes(name)){
                let nlb = new NonLocalBlock({name:name, k_reg:this.kernel_reg});
                this.B_list.push(nlb);
            }
        }
    }

    call(inputs, kwargs){

        let z = inputs[0];
        let x = inputs[1];
        let y = inputs[2].asType('int32');
        let se_layer = this.spatial_embedding.apply(y);

        let z0 = z.reshape([-1, z.shape[1], 1, z.shape[2]]);

        let x_per_block = tf.split(x, this.num_blocks, 1);

        let net = z0.matMul(se_layer);
        net = tf.squeeze(net, 2);

        net = net.reshape([net.shape[0], 512, this.seed_size_h, this.seed_size_w, -1]);
        net = net.reshape([net.shape[0], -1, 512, this.seed_size_h]);
        net = net.transpose([0, 3, 1, 2]);

        let blist_idx = 0;
        for (let block_idx = 0; block_idx < this.num_blocks; block_idx++){
            let name = "B"+(block_idx + 1).toString();
            let is_last_block = block_idx == this.num_blocks - 1;
            let res = this.B_list[blist_idx];
            blist_idx += 1;
            net = res.apply(net, x_per_block[block_idx]);
            if (this.blocks_with_attention.includes(name)){
                let nlb = this.B_list[blist_idx];
                blist_idx += 1;
                net = nlb.apply(net);
            }
        }
        net = this.bn.apply(net);
        net = tf.relu(net);
        net = this.conv2d.apply(net);

        net = tf.tanh(net);
        return net;
    }

    computeOutputShape(inputShape){
        return [1, 32, 16*inputShape[1][0], 1];
    }

    getClassName() { return 'GeneratorPrep';}
}


function makeGenerator(latent_dim, input_dim, embed_y, gen_path, kernel_reg, blocks_with_attention,
                       vocab_size, vis_model){

    let h = input_dim[0];
    let c = input_dim[2];

    let ch = 64;
    let in_channels = [ch*8, ch*4, ch*2];
    let out_channels = [ch*4, ch*2, ch*1];
    let num_blocks = 3;

    let seed_size_h = Math.round(h / 2 ** num_blocks);
    let seed_size_w = seed_size_h;

    let z = tf.input({shape:[null, latent_dim/(num_blocks+1)]});
    let x = tf.input({shape:[latent_dim/(num_blocks+1)*num_blocks]});
    let y = tf.input({shape:[null], dtype:tf.int32});

    let genPrep = new GeneratorPrep({y:y, num_blocks:num_blocks, vocab_size:vocab_size,
                                     seed_size_h:seed_size_h, seed_size_w:seed_size_w,
                                     out_channels:out_channels,
                                     kernel_reg:kernel_reg,
                                     blocks_with_attention:blocks_with_attention,
                                     c:c,
                                     embed_y:embed_y});
    let net = genPrep.apply([z, x, y]);


    let model = tf.model({inputs:[z, x, y], outputs:net});

    return model;
}

function alpha2idx(text){
    let alphav = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNPOQRSTUVWXYZ";
    let result = [];
    for (let i = 0; i < text.length; i++){
        result.push(alphav.indexOf(text[i]));
    }
    return result;
}

let toLoadWeights = [
    "SpatialEmbedding_1-filter_bank.npy",
    "CBN_B1_1_dense_1-kernel.npy",
    "CBN_B1_1_batchNormalization-moving_mean.npy",
    "CBN_B1_1_batchNormalization-moving_variance.npy",
    "CBN_B1_1_dense_2-kernel.npy", // 4
    "B1_conv2dTranspose_1-kernel.npy",
    "B1_conv2dTranspose_1-bias.npy", // 6
    "CBN_B1_2_dense_1-kernel.npy",
    "CBN_B1_2_batchNormalization-moving_mean.npy",
    "CBN_B1_2_batchNormalization-moving_variance.npy",
    "CBN_B1_2_dense_2-kernel.npy", // 10
    "B1_conv2d-kernel.npy",
    "B1_conv2d-bias.npy", // 12
    "B1_conv2dTranspose_2-kernel.npy",
    "B1_conv2dTranspose_2-bias.npy", // 14
    "CBN_B2_1_dense_1-kernel.npy",
    "CBN_B2_1_batchNormalization-moving_mean.npy",
    "CBN_B2_1_batchNormalization-moving_variance.npy",
    "CBN_B2_1_dense_2-kernel.npy",
    "B2_conv2dTranspose_1-kernel.npy",
    "B2_conv2dTranspose_1-bias.npy",
    "CBN_B2_2_dense_1-kernel.npy",
    "CBN_B2_2_batchNormalization-moving_mean.npy",
    "CBN_B2_2_batchNormalization-moving_variance.npy",
    "CBN_B2_2_dense_2-kernel.npy",
    "B2_conv2d-kernel.npy",
    "B2_conv2d-bias.npy",
    "B2_conv2dTranspose_2-kernel.npy",
    "B2_conv2dTranspose_2-bias.npy", // 28
    "CBN_B3_1_dense_1-kernel.npy",
    "CBN_B3_1_batchNormalization-moving_mean.npy",
    "CBN_B3_1_batchNormalization-moving_variance.npy",
    "CBN_B3_1_dense_2-kernel.npy",
    "B3_conv2dTranspose_1-kernel.npy",
    "B3_conv2dTranspose_1-bias.npy",
    "CBN_B3_2_dense_1-kernel.npy",
    "CBN_B3_2_batchNormalization-moving_mean.npy",
    "CBN_B3_2_batchNormalization-moving_variance.npy",
    "CBN_B3_2_dense_2-kernel.npy",
    "B3_conv2d-kernel.npy",
    "B3_conv2d-bias.npy",
    "B3_conv2dTranspose_2-kernel.npy",
    "B3_conv2dTranspose_2-bias.npy", // 42
    "NonLocalBlock_B3_1-NonLocalBlock_B3_sigma.npy",
    "generatorPrep_batchNormalization-gamma.npy",
    "generatorPrep_batchNormalization-beta.npy",
    "generatorPrep_batchNormalization-moving_mean.npy",
    "generatorPrep_batchNormalization-moving_variance.npy",
    "generatorPrep_cond2d-kernel.npy",
    "generatorPrep_cond2d-bias.npy"
];

let toLoadFonts = [
    "font-00066.npy",
    "font-00046.npy",
    "font-00023.npy",
    "font-00010.npy",
    "font-00043.npy",
    "font-00036.npy",

    "font-00049.npy",
    "font-00087.npy",
    "font-00066.npy",
    "font-00046.npy",
    "font-00085.npy",
    "font-00045.npy",
    "font-00021.npy",
    "font-00036.npy"
];

let toLoadFrames = [];

let g = makeGenerator(128, [32, 160, 1], [32, 8192], '', 'spectral_norm', 'B3', 52, false);
g.isLoadedWeights = false;
g.startedLoadWeights = false;

let promises = [];
let fontPromises = [];
let framePromises = [];
let fonts = [];
let frames = [];
let signature = null;

function loadFrames(arr){
    for (let i = 0; i < arr.length; i++){
        let frName = "frame-".concat(arr[i].toString().padStart(5, '0')).concat(".npy");
        toLoadFrames.push(frName);
    }
    toLoadFrames.map((fn) => {
        let fullPath = "frames/"+fn;
        framePromises.push(n.load(fullPath).then(res => {return res.data;}).then(value => new Promise(resolve => {
                setTimeout(() => {
                    resolve(value);
                }, 20)})));
    });
    Promise.all(framePromises).then((v) => {
        for (let i = 0; i < v.length; i++){
            frames.push(v[i]);
        }
        // frames.push(v[0]);
        // frames.push(v[1]);
        // frames.push(v[2]);
        // frames.push(v[3]);
        g.isLoadedFrames = true;

    });
}

toLoadFonts.map((fn) => {
    let fullPath = "fonts/"+fn;
    fontPromises.push(n.load(fullPath).then(res => {
        console.log(fullPath);
        let t = tf.tensor(res.data, res.shape);
        return t;
    }).then(value => new Promise(resolve => {
                setTimeout(() => {
                    resolve(value);
                }, 20)})));
});

Promise.all(fontPromises).then((v) => {
    fonts.push([v[0], v[1]]);
    fonts.push([v[2], v[3]]);
    fonts.push([v[4], v[5]]);
    fonts.push([v[6], v[7]]);
    fonts.push([v[8], v[9]]);
    fonts.push([v[10], v[11]]);
    fonts.push([v[12], v[13]]);
    g.isLoadedFonts = true;

});

function loadWeights(seed){
    g.startedLoadWeights = true;

    let interval = 30;
    toLoadWeights.map((fn) => {
        let fullPath = "weights/"+fn;
        promises.push(new Promise(resolve => {
                setTimeout(() => {
                    resolve();
                }, interval)}).then(() => n.load(fullPath).then(res => {
            console.log(fullPath);
            let t = tf.tensor(res.data, res.shape);
            return t;
        }).catch(e => {
          console.log('error: ', e)
        })));
      interval += 50;
    });

    function setRandom(ly, seed){
        let ws = ly.getWeights();
        let rs = [];
        for (let i = 0; i < ws.length; i++){
            rs.push(tf.randomNormal(ws[i].shape, undefined, undefined, undefined, seed));
        }
        ly.setWeights(rs);
        return seed + 0.0425;
    }

    Promise.all(promises).then((v) => {
        let fontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, seed);
        fontSeed = tf.tile(fontSeed, [1, 4, 1]);
        let upperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, seed);
        let labels = tf.tensor([[0, 1, 2, 3]], undefined, 'int32');
        let res = g.predict([fontSeed, upperSeed, labels]);

        let genPrep = g.layers[3];
        let B1 = genPrep.B_list[0];
        let B2 = genPrep.B_list[1];
        let B3 = genPrep.B_list[2];
        let NLB = genPrep.B_list[3];

        // Set random weights to get signature
        seed = setRandom(B1.cbn.dense1, seed);
        seed = setRandom(B1.cbn.bn, seed);
        seed = setRandom(B1.cbn.dense2, seed);
        seed = setRandom(B1.conv2dT1, seed);
        seed = setRandom(B1.cbn2.dense1, seed);
        seed = setRandom(B1.cbn2.bn, seed);
        seed = setRandom(B1.cbn2.dense2, seed);
        seed = setRandom(B1.conv2d, seed);
        seed = setRandom(B1.conv2dT2, seed);

        seed = setRandom(B2.cbn.dense1, seed);
        seed = setRandom(B2.cbn.bn, seed);
        seed = setRandom(B2.cbn.dense2, seed);
        seed = setRandom(B2.conv2dT1, seed);
        seed = setRandom(B2.cbn2.dense1, seed);
        seed = setRandom(B2.cbn2.bn, seed);
        seed = setRandom(B2.cbn2.dense2, seed);
        seed = setRandom(B2.conv2d, seed);
        seed = setRandom(B2.conv2dT2, seed);

        seed = setRandom(B3.cbn.dense1, seed);
        seed = setRandom(B3.cbn.bn, seed);
        seed = setRandom(B3.cbn.dense2, seed);
        seed = setRandom(B3.conv2dT1, seed);
        seed = setRandom(B3.cbn2.dense1, seed);
        seed = setRandom(B3.cbn2.bn, seed);
        seed = setRandom(B3.cbn2.dense2, seed);
        seed = setRandom(B3.conv2d, seed);
        seed = setRandom(B3.conv2dT2, seed);

        seed = setRandom(NLB, seed);
        seed = setRandom(genPrep.bn, seed);
        seed = setRandom(genPrep.conv2d, seed);

        // Generate Signature
        res = g.predict([fontSeed, upperSeed, labels]);
        res = res.add(1.0).div(2.0).mul(255);
        res = res.squeeze([0]).asType('int32');
        let alpha = tf.ones([res.shape[0], res.shape[1], 1], 'int32').mul(255);
        res = tf.concat([res, res, res, alpha], 2);
        signature = [res.dataSync(), res.shape];


        genPrep.spatial_embedding.setWeights([v[0]]);

        B1.cbn.dense1.setWeights([v[1]]);
        B1.cbn.bn.setWeights([v[2], v[3]]);
        B1.cbn.dense2.setWeights([v[4]]);
        B1.conv2dT1.setWeights([v[5], v[6]]);
        B1.cbn2.dense1.setWeights([v[7]]);
        B1.cbn2.bn.setWeights([v[8], v[9]]);
        B1.cbn2.dense2.setWeights([v[10]]);
        B1.conv2d.setWeights([v[11], v[12]]);
        B1.conv2dT2.setWeights([v[13], v[14]]);

        let s = 14;
        B2.cbn.dense1.setWeights([v[s+1]]);
        B2.cbn.bn.setWeights([v[s+2], v[s+3]]);
        B2.cbn.dense2.setWeights([v[s+4]]);
        B2.conv2dT1.setWeights([v[s+5], v[s+6]]);
        B2.cbn2.dense1.setWeights([v[s+7]]);
        B2.cbn2.bn.setWeights([v[s+8], v[s+9]]);
        B2.cbn2.dense2.setWeights([v[s+10]]);
        B2.conv2d.setWeights([v[s+11], v[s+12]]);
        B2.conv2dT2.setWeights([v[s+13], v[s+14]]);

        s = 28;
        B3.cbn.dense1.setWeights([v[s+1]]);
        B3.cbn.bn.setWeights([v[s+2], v[s+3]]);
        B3.cbn.dense2.setWeights([v[s+4]]);
        B3.conv2dT1.setWeights([v[s+5], v[s+6]]);
        B3.cbn2.dense1.setWeights([v[s+7]]);
        B3.cbn2.bn.setWeights([v[s+8], v[s+9]]);
        B3.cbn2.dense2.setWeights([v[s+10]]);
        B3.conv2d.setWeights([v[s+11], v[s+12]]);
        B3.conv2dT2.setWeights([v[s+13], v[s+14]]);

        s = 42;
        NLB.setWeights([v[s+1]]);
        genPrep.bn.setWeights([v[s+2], v[s+3], v[s+4], v[s+5]]);
        genPrep.conv2d.setWeights([v[s+6], v[s+7]]);

        g.isLoadedWeights = true;
    });
}




