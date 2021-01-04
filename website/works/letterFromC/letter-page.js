const params = new URLSearchParams(location.search);
const page = parseInt(params.get("page"));
const seed = (parseInt(params.get("seed"))) ? (parseInt(params.get("seed"))) : Math.round(Math.random()*9999);
const rng = new Math.seedrandom(seed);

let lineIdx = 0;

let lineHeight = 32;
let charWidth = 16;
let topPadding = 20;
let leftPadding = 20;

let pagePadding = 5;

let pageLineHeight;
let pageCharWidth;

let numLinesPage = 58; // 55;
let numCharLine;

let previewWidth;

let loadimg;
let wordShader;

let buffer;
let imagePage;

let firstRasterHeight = 22;
let firstRaster;
let firstRasterFontIdx;
let secondRasterHeight = 32;
let secondRaster;
let secondRasterFontIdx;
let outroRaster = null;

let maxRasterLength = 22;
let handCache = null;

let numFonts = 7;

let mainFontSeed;
let mainUpperSeed;
let hlFontSeed;
let hlUpperSeed;

let pageText = [];
let script01 = [
    "Hey",
    "",
    "Ive been meaning to get in touch",
    "please forgive me for not being more responsive",
    "hope you dont think I dont care about you",
    "I think a lot about you",
    "",
    "I know there are many ways I can reach out to you",
    "annyeong",
    "hey",
    "nihao",
    "yet nothing is quite right",
    "nothing is quite what I need to say",
    "",
    "it truly is blessed to be able to say hooray in a thousand different ways",
    ""
];

let script02 = [
    "",
    "yet none of it is truly my hooray",
    "I do not have hands that write these hoorays",
    "",
];

let script03 = [
    "",
    "^When I say things like this",
    "^And things like this",
    "Will you think of me the same",
    "am I the same",
    "",
    "I feel like Im *acorn in *dog *food",
    "*Lobster sides with the *crab",
    "but does *frog side with the *tadpole",
    "Even if I say it like *one *five *one *ten",
    "it still cant be reached by *eight *sticks",
    "Some things cant be said precisely because you have a *three *inch *tongue",
    "Maybe I should just do it not caring if *three *seven is *twenty *one",
    "",
    "",
    "So",
    "",
    "Heres my try",
    ""
];

let script04 = [
    "",
    "",
    "",
    "With all my hearts",
    "C"
];

let handWordList = [
    "doubt",
    "approval",
    "worth",
    "foreign",
    "home",
    "wrong",
    "knowing",
    "proof",
    "road",
    "nothing",
    "choice",
    "blood"
];

function preload(){
    wordShader = loadShader("assets/word.vert", "assets/word.frag");
}

function setup(){
    randomSeed(seed);

    loadWeights(rng());
    loadFrames(pickRandomFrames());

    imagePage = createGraphics(2412, 3074);
    imagePage.background(255, 255, 255, 255);

    mainFontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
    mainUpperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());
    hlFontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
    hlUpperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());

    pageLineHeight = (imagePage.height-topPadding*2) / numLinesPage;
    pageCharWidth = pageLineHeight * 0.5;
    numCharLine = Math.round((imagePage.width-leftPadding*2)/pageCharWidth);

    previewWidth = windowHeight/3074 * 2412;

    createCanvas(previewWidth*5+pagePadding*4, windowHeight);

    buffer = createGraphics(Math.round(numCharLine*pageCharWidth),
                            Math.round(pageLineHeight), WEBGL);
    wordShader.setUniform('fontColor', [0.0, 0.0, 0.0]);

    pickRasterFonts();
    handWordList.sort(() => 0.5 - rng());

    pageText.push(...script01);
    addHoorayScript();
    pageText.push(...script02);
    addAnnyeongScript();
    pageText.push(...["", ""]);
    addNihaoScript();
    pageText.push(...script03);
    addHandScript();
    pageText.push(...script04);

    lineIdx = numLinesPage*(page-1);
}

function pickRandomFrames(){
    let res = [];
    res.push(round(random(0, 50)));
    res.push(round(random(50, 120)));
    res.push(round(random(121, 220)));
    res.push(round(random(221, 250)));
    return res;
}

function pickRasterFonts(){
    firstRasterFontIdx = Math.round((numFonts-1) * rng());
    secondRasterFontIdx = Math.round((numFonts-1) * rng());
    for(let i = 0; i < 10; i++){
        if (firstRasterFontIdx == secondRasterFontIdx){
            secondRasterFontIdx = Math.round((numFonts-1) * rng());
        } else {
            break;
        }
    }
}

function init(){
    firstRaster = genWordRaster("안녕", firstRasterHeight,
                                numCharLine-"My annyeong is no".length);

    secondRaster = genWordRaster("你好", firstRasterHeight,
                                 numCharLine-"My nihao is no".length);
}

let isInited = false;
let isDownloaded = false;

function draw(){

    if (!isInited && g.isLoadedFonts){
        init();
        isInited = true;
    }

    if (lineIdx < min(pageText.length, numLinesPage*page) &&
        g.isLoadedWeights  && g.isLoadedFrames && isInited){

        let cursorIdx = lineIdx%numLinesPage;
        if (cursorIdx == 0){
            imagePage.background(255, 255, 255, 255);
        }

        let line = pageText[lineIdx];
        drawLine(line, leftPadding,
                 topPadding+pageLineHeight*cursorIdx);

        lineIdx += 1;
    }


    background(230);
    image(imagePage, 0, 0, previewWidth, windowHeight);

    if (lineIdx >= min(pageText.length, numLinesPage*page) && !isDownloaded){
        let saveName = seed.toString()+"_"+page.toString()+".png";
        let img = createImage(imagePage.width, imagePage.height);
        img.copy(imagePage, 0, 0, imagePage.width, imagePage.height,
                 0, 0, imagePage.width, imagePage.height);
        img.save(saveName);
        imagePage.remove();
        isDownloaded = true;
    }

}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    previewWidth = windowHeight/3074 * 2412;
}

function drawLine(txt, x, y){
    if (txt == "" || txt == " "){
        return;
    }
    let fontSeed = mainFontSeed;
    let upperSeed = mainUpperSeed;
    let mode = null;
    let numRaster = null;
    let rIdx = null;
    let fontIdx = null;
    let frameNum = null;
    let sideWord = null;
    if (txt.slice(0, 1) == "^"){
        mode = "^";
        txt = txt.slice(1);
        fontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
        upperSeed = tf.randomNormal([1, 96]), undefined, undefined, undefined, rng();
    } else if (txt.slice(0, 1) == "~"){
        mode = "~";
        txt = txt.slice(1);
        let sp = txt.split("/");
        numRaster = parseInt(sp[0]);

        fontIdx = firstRasterFontIdx;
        if (numRaster == 2){
            fontIdx = secondRasterFontIdx;
        }
        let fn = fonts[fontIdx][0];
        fontSeed = fn.slice([0, 0], [1, 32]);
        fontSeed = tf.reshape(fontSeed, [1, 1, 32]);
        upperSeed = fn.slice([0, 32], [1, 128-32]);

        if (sp.length > 2){
            rIdx = parseInt(sp[1]);
            txt = sp[2];
        } else {
            txt = sp[1];
        }
    } else if (txt.slice(0, 1) == "@"){
        mode = "@";
        txt = txt.slice(1);
        let sp = txt.split("/");
        frameNum = sp[0];
        rIdx = parseInt(sp[1]);
        sideWord = sp[2];
        fontIdx = 2;
        let fn = fonts[fontIdx][0];
        fontSeed = fn.slice([0, 0], [1, 32]);
        fontSeed = tf.reshape(fontSeed, [1, 1, 32]);
        upperSeed = fn.slice([0, 32], [1, 128-32]);
        txt = "";
    } else if (txt.slice(0, 1) == "?"){
        mode = "?";
        sideWord = txt.slice(1);
        fontIdx = 2;
        let fn = fonts[fontIdx][0];
        fontSeed = fn.slice([0, 0], [1, 32]);
        fontSeed = tf.reshape(fontSeed, [1, 1, 32]);
        upperSeed = fn.slice([0, 32], [1, 128-32]);
        txt = "";
    }
    let txtSplit = [];
    if (txt.length > 0){
        txtSplit = split(txt, " ");
    }

    let startX = 0;
    for (let i = 0; i < txtSplit.length; i++){
        let word = txtSplit[i];
        let wFontSeed = fontSeed;
        let wUpperSeed = upperSeed;
        if (word.slice(0, 1) == "*"){
            word = word.slice(1);
            wFontSeed = hlFontSeed;
            wUpperSeed = hlUpperSeed;
        } else if (word.slice(0, 1) == "!"){
            word = word.slice(1);
            wFontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
            wUpperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());
        }
        let resWd = generateWord(word, wFontSeed, wUpperSeed);
        let im = tensor2image(resWd);
        let isSig = word == "C";
        drawWord(im, word.length, x+startX, y, isSig);
        startX += (word.length + 1) * pageCharWidth;
    }

    if (mode == "~" && rIdx != null){
        startX -= pageCharWidth;
        let ras = firstRaster;
        if (numRaster == 2){
            ras = secondRaster;
        }
        let bFont = fonts[fontIdx][0];
        let tFont = fonts[fontIdx][1];
        let im = renderWordRaster(ras, rIdx, bFont, tFont);
        im = tensor2image(im);
        let numChar = im.width/charWidth;
        drawWord(im, numChar, x+startX, y);
    } else if (mode == "@"){
        let bFont = fonts[fontIdx][0];
        let tFont = fonts[fontIdx][1];
        let ras = frames[frameNum];
        let im = renderHandRaster(ras, rIdx, sideWord, bFont, tFont);
        im = tensor2image(im);
        let numChar = im.width/charWidth;
        drawWord(im, numChar, x+startX, y);
    } else if (mode == "?"){
        let bFont = fonts[fontIdx][0];
        let tFont = fonts[fontIdx][1];

        let pp = divideSideWord(sideWord);
        let pre = pp[0];
        let post = pp[1];

        let line = pre.concat("x".repeat(numCharLine-pre.length-post.length)).concat(post);
        let im = renderHandOutro(line, bFont, tFont);
        im = tensor2image(im);
        let numChar = im.width/charWidth;
        drawWord(im, numChar, x+startX, y);
    }
}

function drawWord(im, wl, x, y, isSig){
    let lengthRatio = wl / numCharLine;

    buffer.background(255, 255, 255, 255);
    buffer.shader(wordShader);
    wordShader.setUniform('lengthRatio', lengthRatio);
    wordShader.setUniform('texture', im);
    buffer.rect(0, 0, 5, 5);

    imagePage.image(buffer, x, y);
    if (isSig){
        let sig = typedArray2image(signature[0], signature[1]);
        imagePage.image(sig, x+pageCharWidth, y, pageCharWidth*4, pageLineHeight);
    }
}

function generateWord(txt, fontSeed, upperSeed){
    let da = alpha2idx(txt);
    let seed = fontSeed;
    if (seed.shape[1] == 1){
        seed = tf.tile(fontSeed, [1, txt.length, 1]);
    }
    let labels = tf.tensor([da], undefined, 'int32');
    let res = g.predict([seed, upperSeed, labels]);
    res = res.add(1.0).div(2.0).mul(255);
    res = res.squeeze([0]).asType('int32');
    let alpha = tf.ones([res.shape[0], res.shape[1], 1], 'int32').mul(255);
    res = tf.concat([res, res, res, alpha], 2);
    return res;
}

function makeCache(c, hl, bFont, tFont, upperSeed){
    handCache = {};

    let zerocF = raster2font([0.0, 0.0, 0.0], bFont, tFont);
    let zerocAll = generateWord(c.repeat(3), zerocF, upperSeed);
    let zerocStart = zerocAll.slice([0, 0], [32, 16]);
    let zerocMid = zerocAll.slice([0, 16], [32, 16]);
    let zerocEnd = zerocAll.slice([0, 32], [32, 16]);
    let zerocCache = {};
    zerocCache["start"] = zerocStart;
    zerocCache["mid"] = zerocMid;
    zerocCache["end"] = zerocEnd;

    handCache["zeroC"] = zerocCache;

    let zerohlF = raster2font([0.0, 0.0, 0.0], bFont, tFont);
    let zerohlAll = generateWord(hl.repeat(3), zerohlF, upperSeed);
    let zerohlStart = zerohlAll.slice([0, 0], [32, 16]);
    let zerohlMid = zerohlAll.slice([0, 16], [32, 16]);
    let zerohlEnd = zerohlAll.slice([0, 32], [32, 16]);
    let zerohlCache = {};
    zerohlCache["start"] = zerohlStart;
    zerohlCache["mid"] = zerohlMid;
    zerohlCache["end"] = zerohlEnd;

    handCache["zeroHl"] = zerohlCache;
}


function renderHandRaster(raster, idx, sideWord, baseFont, targetFont){
    let bFont = baseFont.slice([0, 0], [1, 32]);
    let upperSeed = baseFont.slice([0, 32], [1, 128-32]);
    let tFont = targetFont.slice([0, 0], [1, 32]);
    bFont = tf.reshape(bFont, [1, 1, 32]);
    tFont = tf.reshape(tFont, [1, 1, 32]);

    let rasLine = raster.slice(idx*numCharLine, (idx+1)*numCharLine);
    rasLine = Array.from(rasLine);
    rasLine = rasLine.map(x => 1.0 - x/255.0);

    let c = "x";
    let hl = "t";
    let parsed = parseRasterLine(rasLine);
    let rhrl = remapHandRasterLine(parsed, sideWord, c, hl);
    parsed = rhrl[0];
    let currLines = rhrl[1];

    if (handCache == null){
        makeCache(c, hl, bFont, tFont, upperSeed);
    }


    let tfchunks = [];
    for (let i = 0; i < parsed.length; i++){
        let p = parsed[i];
        let currLine = currLines[i];
        if (Math.max(...p) <= 0.0 && isAllSameChar(currLine)){
            let currCache = handCache["zeroC"];
            if (currLine.slice(0, 1) == hl){
                currCache = handCache["zeroHl"];
            }
            for (let x = 0; x < p.length; x++){
                if (i == 0 && x == 0){
                    tfchunks.push(currCache["start"]);
                } else if (i == parsed.length-1 && x == p.length-1){
                    tfchunks.push(currCache["mid"]);
                } else {
                    tfchunks.push(currCache["end"]);
                }
            }
        } else {
            let padLine = currLine.slice(0, 1).concat(currLine).concat(currLine.slice(-1));
            let padP = p.slice(0, 1).concat(p).concat(p.slice(-1));
            if (i == 0){
                padLine = currLine.concat(currLine.slice(-1));
                padP = p.concat(p.slice(-1));
            } else if (i == parsed.length-1){
                padLine = currLine.slice(0, 1).concat(currLine);
                padP = p.slice(0, 1).concat(p);
            }
            let fontSeed = raster2font(padP, bFont, tFont);
            let res = generateWord(padLine, fontSeed, upperSeed);
            if (i == 0){
                res = res.slice([0, 0], [32, 16 * currLine.length]);
            } else {
                res = res.slice([0, 16], [32, 16 * currLine.length]);
            }
            tfchunks.push(res);
        }
    }
    tfchunks = tf.concat(tfchunks, 1);
    return tfchunks;
}

function renderHandOutro(line, baseFont, targetFont){
    let bFont = baseFont.slice([0, 0], [1, 32]);
    let upperSeed = baseFont.slice([0, 32], [1, 128-32]);
    let tFont = targetFont.slice([0, 0], [1, 32]);
    bFont = tf.reshape(bFont, [1, 1, 32]);
    tFont = tf.reshape(tFont, [1, 1, 32]);

    let outroCutIdx = [Math.round(numCharLine/3), Math.round(numCharLine/3*2)];

    if (handCache == null){
        makeCache("x", "t", bFont, tFont, upperSeed);
    }
    if (outroRaster == null){
        outroRaster = Array(numCharLine).fill(1.0);
    }
    for (let i = 0; i < numCharLine; i++){
        if (rng() < 0.1 && !outroCutIdx.includes(i)){
            outroRaster[i] = 0.0;
        }
    }

    let li01 = line.slice(0, outroCutIdx[0]+1);
    let li02 = line.slice(outroCutIdx[0], outroCutIdx[1]+1);
    let li03 = line.slice(outroCutIdx[1]);
    let ra01 = outroRaster.slice(0, outroCutIdx[0]+1);
    let ra02 = outroRaster.slice(outroCutIdx[0], outroCutIdx[1]+1);
    let ra03 = outroRaster.slice(outroCutIdx[1]);

    let randCoeff = 0.075;

    let m01 = tf.tile(tf.reshape(tf.tensor(ra01), [1, ra01.length, 1]), [1, 1, 32]);
    let fs01 = tf.tile(bFont, [1, li01.length, 1]).mul(m01);
    fs01 = fs01.add(tf.randomNormal(fs01.shape, undefined, undefined, undefined, rng()).mul(randCoeff));
    let res01 = generateWord(li01, fs01, upperSeed);

    let m02 = tf.tile(tf.reshape(tf.tensor(ra02), [1, ra02.length, 1]), [1, 1, 32]);
    let fs02 = tf.tile(bFont, [1, li02.length, 1]).mul(m02);
    fs02 = fs02.add(tf.randomNormal(fs02.shape, undefined, undefined, undefined, rng()).mul(randCoeff));
    let res02 = generateWord(li02, fs02, upperSeed);

    let m03 = tf.tile(tf.reshape(tf.tensor(ra03), [1, ra03.length, 1]), [1, 1, 32]);
    let fs03 = tf.tile(bFont, [1, li03.length, 1]).mul(m03);
    fs03 = fs03.add(tf.randomNormal(fs03.shape, undefined, undefined, undefined, rng()).mul(randCoeff));
    let res03 = generateWord(li03, fs03, upperSeed);

    let res = tf.concat([res01.slice([0, 0, 0], [lineHeight, (li01.length-1)*charWidth, 4]),
                         handCache["zeroC"]["mid"],
                         res02.slice([0, charWidth, 0], [lineHeight, (li02.length-2)*charWidth, 4]),
                         handCache["zeroC"]["mid"],
                         res03.slice([0, charWidth, 0], [lineHeight, (li03.length-1)*charWidth, 4])], 1);
    return res;

}

function remapHandRasterLine(parsed, sideWord, c, hl){
    let currLines = [];
    let mappedRaster = [];

    let clipParse = [];
    for (let i = 0; i < parsed.length; i++){
        let p = parsed[i];
        if (p.length > maxRasterLength){
            clipParse.push(p.slice(0, maxRasterLength-3));
            clipParse.push(p.slice(maxRasterLength-3));
        } else {
            clipParse.push(p);
        }
    }
    parsed = clipParse;

    let idx = 0;
    for (let i = 0; i < parsed.length; i++){
        let cl = "";
        let mr = [];
        let p = parsed[i];
        for (let x = 0; x < p.length; x++){
            if (p[x] <= 0.1){
                cl = cl.concat(c);
                mr.push(0.0);
            } else {
                cl = cl.concat(hl);
                let m = 1.0 - ((p[x] - 0.1) / 0.9);
                mr.push(m);
            }
        }
        currLines.push(cl);
        mappedRaster.push(mr);
    }

    let pp = divideSideWord(sideWord);
    let pre = pp[0];
    let post = pp[1];

    if (pre.length < currLines[0].length){
        let p = currLines[0];
        p = pre.concat(p.slice(pre.length));
        currLines = [p].concat(currLines.slice(1));
    } else {
        let p = "";
        let r = [];
        while (pre.length > p.length-1){
            p = p.concat(currLines[0]);
            r = r.concat(mappedRaster[0]);
            currLines = currLines.slice(1);
            mappedRaster = mappedRaster.slice(1);
        }
        p = pre.concat(p.slice(pre.length));
        currLines = [p].concat(currLines);
        mappedRaster = [r].concat(mappedRaster);
    }

    if (post.length < currLines[currLines.length-1].length){
        let p = currLines[currLines.length-1];
        p = p.slice(0, p.length-post.length).concat(post);
        currLines = currLines.slice(0, -1).concat(p);
    } else {
        let p = "";
        let r = [];
        while (post.length > p.length-1){
            p = currLines[currLines.length-1].concat(p);
            r = mappedRaster[mappedRaster.length-1].concat(r);

            currLines = currLines.slice(0, -1);
            mappedRaster = mappedRaster.slice(0, -1);
        }
        p = p.slice(0, p.length-post.length).concat(post);
        currLines = currLines.concat(p);
        mappedRaster = mappedRaster.concat([r]);
    }

    if (isAllSameNum(mappedRaster[0])){
        let lf = currLines[0];
        let rf = mappedRaster[0];
        currLines = [lf.slice(0, pre.length+1),
                     lf.slice(pre.length+1)].concat(currLines.slice(1));
        mappedRaster = [rf.slice(0, pre.length+1),
                        rf.slice(pre.length+1)].concat(mappedRaster.slice(1));
    }
    if (isAllSameNum(mappedRaster[mappedRaster.length-1])){
        let ll = currLines[currLines.length-1];
        let rl = mappedRaster[mappedRaster.length-1];
        currLines = currLines.slice(0, -1).concat([ll.slice(0, -post.length-1),
                                                   ll.slice(-post.length-1)]);
        mappedRaster = mappedRaster.slice(0, -1).concat([rl.slice(0, -post.length-1),
                                                         rl.slice(-post.length-1)]);
    }

    return [mappedRaster, currLines];
}

function renderWordRaster(raster, idx, baseFont, targetFont){
    let bFont = baseFont.slice([0, 0], [1, 32]);
    let upperSeed = baseFont.slice([0, 32], [1, 128-32]);
    let tFont = targetFont.slice([0, 0], [1, 32]);
    bFont = tf.reshape(bFont, [1, 1, 32]);
    tFont = tf.reshape(tFont, [1, 1, 32]);

    let c = "t";
    let parsed = parseRasterLine(raster[idx]);

    let zeroF = raster2font([0.0, 0.0, 0.0], bFont, tFont);
    let zeroAll = generateWord(c.repeat(3), zeroF, upperSeed);
    let zeroStart = zeroAll.slice([0, 0], [32, 16]);
    let zeroMid = zeroAll.slice([0, 16], [32, 16]);
    let zeroEnd = zeroAll.slice([0, 32], [32, 16]);
    let oneF = raster2font([1.0, 1.0, 1.0], bFont, tFont);
    let oneAll = generateWord(c.repeat(3), oneF, upperSeed);
    let oneStart = oneAll.slice([0, 0], [32, 16]);
    let oneMid = oneAll.slice([0, 16], [32, 16]);
    let oneEnd = oneAll.slice([0, 32], [32, 16]);

    let tfchunks = [];
    for (let i = 0; i < parsed.length; i++){
        let p = parsed[i];
        let currLine = c.repeat(p.length);
        if (Math.max(...p) <= 0.0){
            for (let x = 0; x < p.length; x++){
                if (i == 0 && x == 0){
                    tfchunks.push(zeroStart);
                } else if (i == parsed.length-1 && x == p.length-1){
                    tfchunks.push(zeroEnd);
                } else {
                    tfchunks.push(zeroMid);
                }
            }
        } else if (Math.min(...p) >= 1.0){
            for (let x = 0; x < p.length; x++){
                if (i == 0 && x == 0){
                    tfchunks.push(oneStart);
                } else if (i == parsed.length-1 && x == p.length-1){
                    tfchunks.push(oneEnd);
                } else {
                    tfchunks.push(oneMid);
                }
            }
        } else {
            let padLine = c.concat(currLine).concat(c);
            let padP = p.slice(0, 1).concat(p).concat(p.slice(-1));
            let fontSeed = raster2font(padP, bFont, tFont);
            let res = generateWord(padLine, fontSeed, upperSeed);
            res = res.slice([0, 16], [32, 16 * currLine.length]);
            tfchunks.push(res);
        }
    }
    tfchunks = tf.concat(tfchunks, 1);
    return tfchunks;
}

function parseRasterLine(line){
    let result = [];
    let start = 0;
    let isSame = line[start] == line[start+1];
    for (let i = 1; i < line.length-1; i ++){
        if (isSame){
            if (line[i] != line[i+1]){
                result.push(line.slice(start, i));
                isSame = false;
                start = i;
            }
        } else {
            if (line[i] == line[i+1]){
                result.push(line.slice(start, i+1));
                isSame = true;
                start = i+1;
            }
        }
    }
    result.push(line.slice(start));
    return result;
}

function genWordRaster(txt, ln, cn){
    let w = Math.round(cn*charWidth*0.2);
    let h = Math.round(ln*lineHeight*0.2);
    let im = createGraphics(w, h);
    im.background(255, 255, 255);
    im.textAlign(CENTER, CENTER);
    im.textSize(h*0.85);
    im.text(txt, w*0.47, h/2);

    let pxW = Math.round(w/cn);
    let pxH = Math.round(h/ln);

    let raster = [];
    for (let j = 0; j < ln; j++){
        let row = [];
        for (let i = 0; i < cn; i++){
            let sum = 0;
            let count = 0;
            for (let y = 0; y < min(pxH, h); y++){
                for (let x = 0; x < min(pxW, w); x++){
                    sum += im.get(i*pxW+x, j*pxH+y)[0];
                    count += 1;
                }
            }
            row.push(1.0 - sum/count/255);
        }
        raster.push(row);
    }
    return raster;
}

function mlerp(a, b, alpha){
    return b.sub(a).mul(alpha).add(a);
}

function tensor2image(res){
    let im = createImage(res.shape[1], res.shape[0]);
    im.loadPixels();
    let upix = Uint8ClampedArray.from(res.dataSync());
    for (let idx = 0; idx < im.pixels.length; idx++){
        im.pixels[idx] = upix[idx];
    }
    im.updatePixels();
    return im;
}

function typedArray2image(res, shape){
    let im = createImage(shape[1], shape[0]);
    im.loadPixels();
    let upix = Uint8ClampedArray.from(res);
    for (let idx = 0; idx < im.pixels.length; idx++){
        im.pixels[idx] = res[idx];
    }
    im.updatePixels();
    return im;
}

function divideSideWord(sideWord){
    let idx = sideWord.indexOf("o");
    let pre = sideWord.slice(0, idx);
    let post = sideWord.slice(idx+1);
    while (post.includes("o")){
        post = post.slice(1);
    }
    return [pre, post];
}

function isAllSameChar(txt){
    let c = txt.slice(0, 1);
    for (let i = 1; i < txt.length; i++){
        if (c != txt[i]){
            return false;
        }
    }
    return true;
}

function isAllSameNum(arr){
    return Math.max(...arr) == Math.min(...arr);
}

function raster2font(line, bFont, tFont){
    let fontSeed = [];
    for (let x = 0; x < line.length; x++){
        fontSeed.push(mlerp(bFont, tFont, line[x]));
    }
    fontSeed = tf.concat(fontSeed, 1);
    return fontSeed;
}

// ---- Scripts ----
function addHoorayScript(){
    let lines = [];
    let numHooray = 750;
    let hPerLine = Math.floor((numCharLine-"Hooray".length)/"Hooray ".length)+1;

    let currNum = 0;
    while(currNum+hPerLine <= numHooray){
        let li = "";
        for(let i = 0; i < hPerLine; i++){
            li = li.concat("!Hooray ");
        }
        li = li.slice(0, -1);
        lines.push(li);
        currNum += hPerLine;
    }
    let li = "";
    for(let i = 0; i < numHooray-currNum; i++){
        li = li.concat("!Hooray ");
    }
    li = li.slice(0, -1);
    lines.push(li);

    pageText.push(...lines);
}

function addAnnyeongScript(){
    let lines = [];
    let numT = [1, 3, 8, 16];
    let pre = "My annyeong is no";
    let c = "t";

    for (let i = 0; i < numT.length; i++){
        let li = "~1/".concat(pre).concat(c.repeat(numT[i]));
        lines.push(li);
    }
    for (let i = 0; i < firstRasterHeight; i++){
        let li = pre;
        li = ("~1/"+i.toString()+"/").concat(li);
        lines.push(li);
    }
    for (let i = numT.length-1; i >= 0; i--){
        let li = "~1/".concat(pre).concat(c.repeat(numT[i]));
        lines.push(li);
    }

    pageText.push(...lines);
}

function addNihaoScript(){
    let lines = [];
    let numT = [1, 3, 8, 16];
    let pre = "My nihao is no";
    let c = "t";

    for (let i = 0; i < numT.length; i++){
        let li = "~2/".concat(pre).concat(c.repeat(numT[i]));
        lines.push(li);
    }
    for (let i = 0; i < firstRasterHeight; i++){
        let li = pre;
        li = ("~2/"+i.toString()+"/").concat(li);
        lines.push(li);
    }
    for (let i = numT.length-1; i >= 0; i--){
        let li = "~2/".concat(pre).concat(c.repeat(numT[i]));
        lines.push(li);
    }

    pageText.push(...lines);
}

function addHandScript(){
    let lines = [];
    let frNum;
    let sideUnit = 8;


    function getCurrSide(count){
        let side = "about";
        if (Math.floor(count/sideUnit) % 2 == 1){
            side = handWordList[(Math.floor(count/sideUnit)-1)/2];
        }
        return side;
    }

    let count = 0;
    frNum = 0;
    for (let f = 0; f < 4; f++){
        for (let i = 2; i < 32-8; i++){
            let side = getCurrSide(count);
            count += 1;
            let li = "@".concat(f.toString()).concat("/").concat(i.toString()).concat("/").concat(side);
            lines.push(li);
        }
    }

    pageText.push(...lines);
}
