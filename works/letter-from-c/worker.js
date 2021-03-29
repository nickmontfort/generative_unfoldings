self.importScripts('tf.min.js');
self.importScripts('npy.js');
self.importScripts('layer.js');

self.onmessage = function(event) {
    if (event.data[0] == "load"){
        if (!g.startedLoadWeights){
            loadWeights(event.data[1]);
        }
        self.postMessage(["load", g.isLoadedWeights, signature]);
        return;
    }
    let idx = event.data[1];
    let txt = event.data[2];
    let fontSeed = event.data[3];
    let upperSeed = event.data[4];

    fontSeed = tf.tensor(fontSeed);
    fontSeed = tf.reshape(fontSeed, [1, 1, 32]);
    upperSeed = tf.tensor(upperSeed);
    upperSeed = tf.reshape(upperSeed, [1, 96]);


    let da = alpha2idx(txt);
    let seed = tf.tile(fontSeed, [1, txt.length, 1]);
    let labels = tf.tensor([da], undefined, 'int32');
    let res = g.predict([seed, upperSeed, labels]);
    res = res.add(1.0).div(2.0).mul(255);
    res = res.squeeze([0]);
    res = tf.round(res);
    res = res.asType('int32');
    let alpha = tf.ones([res.shape[0], res.shape[1], 1], 'int32').mul(255);
    res = tf.concat([res, res, res, alpha], 2);
    self.postMessage(["eval", [res.dataSync(), res.shape], idx]);
};
