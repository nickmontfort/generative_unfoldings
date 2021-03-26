const params = new URLSearchParams(location.search);
const seed = (parseInt(params.get("seed"))) ? (parseInt(params.get("seed"))) : Math.round(Math.random()*9999);
const rng = new Math.seedrandom(seed);

const isWorker = (typeof OffscreenCanvas !== "undefined");
let sig = null;
let layerSeed;

let count = 1;
let lineIdx = 0;

let lineHeight = 32;
let charWidth = 16;
let topPadding = 5;
let leftPadding = 5;

let pageLineHeight;
let pageCharWidth;

let cursorIdx = 0;
let curr_t = 0.0;
let timeUnit = 25;
let prev_t = -timeUnit*2;
let isBusy = false;

let numLinesPage = 32;
let numCharLine = 90;

let loadimg;
let wordShader;

let buffer;
let imagePage;

// Image frames
let imageDir = "images";
let hoorayFrames = [];
let annyeongFrames = [];
let nihaoFrames = [];
let handFrames = [];
let imageDict = {
    "Hooray" : hoorayFrames,
    "Annyeong" : annyeongFrames,
    "Nihao" : nihaoFrames,
    "Hand" : handFrames
};
let videoDict = {
    "Annyeong" : null,
    "Nihao" : null,
    "Hand" : null
};
let isLoadedVid = false;
let currPlayingVideo = null;

let mainFontSeed;
let mainUpperSeed;
let hlFontSeed;
let hlUpperSeed;

let worker = null;
let isLoadedWeights = false;
let workerResult = null;



let pageText = [];

let script01 = [
    "Hey",
    "",
    "Ive been meaning to get in touch",
    "please forgive me for not being more responsive/3000",
    "hope you dont think I dont care about you/3000",
    "I think a lot about you/3000",
    "",
    "I know there are many ways I can reach out to you/3000",
    "annyeong/3000",
    "hey/3000",
    "nihao/3000",
    "yet nothing is quite right/3000",
    "nothing is quite what I need to say/3000",
    "",
    "it truly is blessed to be able to say hooray in a thousand different ways/7000",
    ""
];

let script02 = [
    "",
    "yet none of it is truly my hooray/3000",
    "I do not have hands that write these hoorays/5000",
    "",
];

let script03 = [
    "/3000",
    "^When I say things like this/4000",
    "^And things like this/4000",
    "Will you think of me the same/3000",
    "am I the same/2500",
    "",
    "I feel like Im *acorn in *dog *food/3000",
    "*Lobster sides with the *crab/2500",
    "but does *frog side with the *tadpole/3000",
    "Even if I say it like *one *five *one *ten/3000",
    "it still cant be reached by *eight *sticks/3500",
    "Some things cant be said precisely because you have a *three *inch *tongue/4000",
    "Maybe I should just do it not caring if *three *seven is *twenty *one/4000",
    "",
    "",
    "So/5000",
    "",
    "Heres my try/4000",
    ""
];

let script04 = [
    "/1000",
    "/1000",
    "/1000",
    "With all my hearts/3000",
    "C/5000"
];

function preload(){
    wordShader = loadShader("assets/word.vert", "assets/word.frag");
    videoDict["Annyeong"] = createVideo("images/Annyeong/Annyeong.mp4", videoLoaded);
    videoDict["Annyeong"].volume(0);
    videoDict["Annyeong"].elt.muted = true;
    videoDict["Annyeong"].hide();

    videoDict["Nihao"] = createVideo("images/Nihao/Nihao.mp4", videoLoaded);
    videoDict["Nihao"].volume(0);
    videoDict["Nihao"].elt.muted = true;
    videoDict["Nihao"].hide();

    videoDict["Hand"] = createVideo("images/Hand/Hand.mp4", videoLoaded);
    videoDict["Hand"].volume(0);
    videoDict["Hand"].elt.muted = true;
    videoDict["Hand"].hide();
}

function videoLoaded(){
    isLoadedVid = true;
}

function setup(){

    layerSeed = rng();
    if (!isWorker){
        loadWeights(layerSeed);
    }

    mainFontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
    mainUpperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());
    hlFontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
    hlUpperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());

    createCanvas(windowWidth, windowHeight);
    pageLineHeight = (windowHeight-2*topPadding) / (numLinesPage+1);
    pageCharWidth = pageLineHeight * 0.5;
    imagePage = [createGraphics(numCharLine*charWidth, numLinesPage*lineHeight),
                 createGraphics(numCharLine*charWidth, numLinesPage*lineHeight)];

    buffer = createGraphics(numCharLine*charWidth, lineHeight, WEBGL);
    wordShader.setUniform('fontColor', [0.0, 0.0, 0.0]);

    if (isWorker){
        worker = new Worker('worker.js');
        worker.onmessage = function(event){
            if (event.data[0] == "load"){
                isLoadedWeights = event.data[1];
                sig = event.data[2];
            } else {
                let res = event.data[1];
                let idx = event.data[2];
                workerResult[idx] = res;
            }
        };
    }

    // --- Load images ---
    // Load hooray
    for (let i = 0; i < 77; i++){
        let imagePath = imageDir + "/" + "Hooray" + "/"
            + "Hooray" + "-" + nf(i+1, 6) + ".png";
        hoorayFrames[i] = loadImage(imagePath);
    }
    // Load annyeong
    for (let i = 0; i < 3; i++){
        let imagePath = imageDir + "/" + "Annyeong" + "/"
            + "Annyeong" + "-" + nf(i, 5) + ".jpg";
        annyeongFrames[i] = loadImage(imagePath);
    }
    // Load nihao
    for (let i = 0; i < 3; i++){
        let imagePath = imageDir + "/" + "Nihao" + "/"
            + "Nihao" + "-" + nf(i, 5) + ".jpg";
        nihaoFrames[i] = loadImage(imagePath);
    }
    // Load hand
    for (let i = 0; i < 7; i++){
        let imagePath = imageDir + "/" + "Hand" + "/"
            + "Hand" + "-" + nf(i, 5) + ".png";
        handFrames[i] = loadImage(imagePath);
    }

    // Add script
    pageText.push(...script01);
    addHoorayFrames();
    pageText.push(...script02);
    addAnnyeongFrames();
    pageText.push(...["", ""]);
    addNihaoFrames();
    pageText.push(...script03);
    addHandFrames();
    pageText.push(...script04);
}

let delay = 1;
function draw(){
    background(255);
    if (!isLoadedWeights){
        if (!isWorker){
            isLoadedWeights = g.isLoadedWeights;
        } else{
            worker.postMessage(["load", layerSeed]);
        }
    }
    if (curr_t - prev_t > delay && lineIdx < pageText.length && isLoadedWeights){

        let line = pageText[lineIdx];

        if (line.slice(0, 1) == "$"){  // Images
            let currParse = parseImageLine(line);
            let currImage = currParse[0];
            let sliceIdx = currParse[1];
            delay = currParse[2];
            if (cursorIdx >= numLinesPage){
                addNewLastLine();
            }
            if (sliceIdx < 0){
                imagePage[0].background(255, 255, 255, 255);
                imagePage[0].image(currImage, 0, 0,
                                   numCharLine*charWidth,
                                   lineHeight*numLinesPage);
            } else {
                imagePage[0].copy(currImage, 0, sliceIdx*lineHeight,
                                  currImage.width, lineHeight,
                                  0,
                                  lineHeight*min(cursorIdx, numLinesPage-1),
                                  charWidth*numCharLine,
                                  lineHeight);
            }
            prev_t = curr_t;
            lineIdx += 1;
            if (cursorIdx < numLinesPage){
                cursorIdx += 1;
            }
        } else if (line.slice(0, 1) == "@"){  // Video
            let currVideo = videoDict[line.slice(1)];
            delay = 9999999;
            currVideo.play();
            currPlayingVideo = currVideo;
            currVideo.onended(() => {
                currPlayingVideo = null;
                delay = 1;
            });
            prev_t = curr_t;
            lineIdx += 1;
            if (cursorIdx < numLinesPage){
                cursorIdx += 1;
            }

        }else {
            delay = 1;
            if (line.includes('/')){
                let sp = line.indexOf('/');
                delay = parseInt(line.slice(sp+1));
                line = line.slice(0, sp);
            }
            let numWords = split(line, " ").length;
            if (!isBusy){
                isBusy = true;
                prepareLine(line);
            }
            if (workerResult.length >= numWords || line == ""){
                if (cursorIdx >= numLinesPage){
                    addNewLastLine();
                }
                drawLine(line, 0, lineHeight*min(cursorIdx, numLinesPage-1));

                prev_t = curr_t;
                lineIdx += 1;
                if (cursorIdx < numLinesPage){
                    cursorIdx += 1;
                }
                isBusy = false;
            }
        }

    }

    if (currPlayingVideo != null){
        imagePage[0].image(currPlayingVideo, 0, 0,
              Math.round(charWidth*numCharLine),
              Math.round(lineHeight*numLinesPage));
        prev_t = curr_t;
    }
    image(imagePage[0], leftPadding, topPadding, numCharLine*pageCharWidth, numLinesPage*pageLineHeight);
    fill(255);
    stroke(255);
    rect(0, 0, windowWidth, topPadding);
    rect(0, windowHeight-topPadding, windowWidth, windowHeight);
    if (lineIdx < pageText.length){
        drawCursor();
    }
    curr_t = millis();
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    pageLineHeight = (windowHeight-2*topPadding) / (numLinesPage+1);
    pageCharWidth = pageLineHeight * 0.5;
}

function prepareLine(line){
    let txt = line;
    workerResult = [];
    let fontSeed = mainFontSeed;
    let upperSeed = mainUpperSeed;
    if (txt.slice(0, 1) == "^"){
        txt = txt.slice(1);
        fontSeed = tf.randomNormal([1, 1, 32], undefined, undefined, undefined, rng());
        upperSeed = tf.randomNormal([1, 96], undefined, undefined, undefined, rng());
    }

    if (txt == "" || txt == " "){
        return;
    }
    let txtSplit = split(txt, " ");
    for (let i = 0; i < txtSplit.length; i++){
        let word = txtSplit[i];
        let wFontSeed = fontSeed;
        let wUpperSeed = upperSeed;
        if (word.slice(0, 1) == "*"){
            word = word.slice(1);
            wFontSeed = hlFontSeed;
            wUpperSeed = hlUpperSeed;
        }
        if (!isWorker){
            workerResult[i] = tf.tidy(() => {
                return generateWord(word, wFontSeed, wUpperSeed);
            });
        } else {
            worker.postMessage(["eval", i, word, wFontSeed.dataSync(), wUpperSeed.dataSync()]);
        }
    }
}

function drawLine(txt, x, y){
    if (txt == "" || txt == " "){
        return;
    }
    let txtSplit = split(txt, " ");
    let startX = 0;
    for (let i = 0; i < workerResult.length; i++){
        drawWord(workerResult[i][0], workerResult[i][1], txtSplit[i], x+startX, y);
        startX += (txtSplit[i].length + 1) * charWidth;
    }
}

function drawWord(imArr, shape, txt, x, y){
    let im = typedArray2image(imArr, shape);
    let lengthRatio = txt.length / numCharLine;

    buffer.background(255, 255, 255, 255);
    buffer.shader(wordShader);
    wordShader.setUniform('lengthRatio', lengthRatio);
    wordShader.setUniform('texture', im);
    buffer.rect(0, 0, 5, 5);

    imagePage[0].image(buffer, x, y);
    if (txt == "C"){
        let sigIm;
        if (isWorker){
            sigIm = typedArray2image(sig[0], sig[1]);
        } else {
            sigIm = typedArray2image(signature[0], signature[1]);
        }
        imagePage[0].image(sigIm, x+charWidth, y, charWidth*4, lineHeight);
    }
}

function generateWord(txt, fontSeed, upperSeed){
    let da = alpha2idx(txt);
    let seed = tf.tile(fontSeed, [1, txt.length, 1]);
    let labels = tf.tensor([da], undefined, 'int32');
    let res = g.predict([seed, upperSeed, labels]);
    res = res.add(1.0).div(2.0).mul(255);
    res = res.squeeze([0]).asType('int32');
    let alpha = tf.ones([res.shape[0], res.shape[1], 1], 'int32').mul(255);
    res = tf.concat([res, res, res, alpha], 2);
    return [res.dataSync(), res.shape];
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

function drawCursor(){
    if (floor((curr_t-prev_t)/1500) % 2 == 0){
        fill(0, 0, 0);
        rect(leftPadding, topPadding+pageLineHeight*cursorIdx, pageCharWidth, pageLineHeight);
    }
}

function addNewLastLine(){
    let buf01 = imagePage[0];
    let buf02 = imagePage[1];
    buf02.background(255, 255, 255, 255);
    buf02.image(buf01, 0, -lineHeight);
    imagePage = [buf02, buf01];
}

// -------- Scripts ---------

function parseImageLine(line){
    let body = line.slice(1);
    let type = split(body, "/")[0];
    let idx = parseInt(split(body, "/")[1]);
    let sliceIdx = parseInt(split(body, "/")[2]);
    let dl = parseInt(split(body, "/")[3]);
    let imList = imageDict[type];
    return [imList[idx], sliceIdx, dl];
}

function addHoorayFrames(){
    let lines = [];
    let mode = 0;
    let dl = 30;
    for (let i = 0; i < 76; i++){
        let li = "$" + "Hooray/" + nf(i, 6) + "/" +
            mode.toString() + "/" + dl.toString();
        lines.push(li);
    }
    lines.sort((a, b) => {
        return 0.5 - rng();
    });
    let li = "$" + "Hooray/" + nf(76, 6) + "/" +
        mode.toString() + "/" + dl.toString();
    lines.push(li);
    pageText.push(...lines);
}

function addAnnyeongFrames(){
    let lines = [];
    let dl;
    for (let i = 0; i < numLinesPage; i++){
        let mode = i;
        dl = 42;
        let li = "$" + "Annyeong" + "/" + nf(0, 6) + "/" +
            mode.toString() + "/"+ dl.toString();
        lines.push(li);
    }

    let li = "@Annyeong";
    lines.push(li);

    let mode = -1;
    dl = 0;
    li = "$" + "Annyeong" + "/" + nf(1, 6) + "/" +
        mode.toString() + "/"+ dl.toString();
    lines.push(li);

    for (let i = 0; i < 7; i++){
        let mode = i;
        dl = 30;
        let li = "$" + "Annyeong" + "/" + nf(2, 6) + "/" +
            mode.toString() + "/"+ dl.toString();
        lines.push(li);
    }
    pageText.push(...lines);
}

function addNihaoFrames(){
    let lines = [];
    let li;
    let mode;
    let dl;

    for (let i = 0; i < numLinesPage; i++){
        let mode = i;
        dl = 42;
        let li = "$" + "Nihao" + "/" + nf(0, 6) + "/" +
            mode.toString() + "/"+ dl.toString();
        lines.push(li);
    }
    li = "@Nihao";
    lines.push(li);

    mode = -1;
    dl = 0;
    li = "$" + "Nihao" + "/" + nf(1, 6) + "/" +
        mode.toString() + "/"+ dl.toString();
    lines.push(li);

    for (let i = 0; i < 7; i++){
        let mode = i;
        dl = 30;
        let li = "$" + "Nihao" + "/" + nf(2, 6) + "/" +
            mode.toString() + "/"+ dl.toString();
        lines.push(li);
    }
    pageText.push(...lines);
}

function addHandFrames(){
    let lines = [];
    let li;
    let mode;
    let dl;

    for (let p = 0; p < 4; p++){
        for (let i = 0; i < numLinesPage; i++){
            let mode = i;
            dl = 42;
            if (p == 0 && i == 0){
                dl = 3000;
            }
            let li = "$" + "Hand" + "/" + nf(p, 6) + "/" +
                mode.toString() + "/"+ dl.toString();
            lines.push(li);
        }
    }

    li = "@Hand";
    lines.push(li);

    mode = -1;
    dl = 0;
    li = "$" + "Hand" + "/" + nf(4, 6) + "/" +
        mode.toString() + "/"+ dl.toString();
    lines.push(li);

    dl = 42;
    for (let p = 5; p < 7; p++){
        let numLines = numLinesPage;
        if (p == 6){
            numLines = numLinesPage-4;
        }
        for (let i = 0; i < numLines; i++){
            let mode = i;
            dl += 7;
            dl = min(dl, 200);
            let li = "$" + "Hand" + "/" + nf(p, 6) + "/" +
                mode.toString() + "/"+ dl.toString();
            lines.push(li);
        }
    }

    pageText.push(...lines);
}
