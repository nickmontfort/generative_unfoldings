/*

▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

        ███      ██     ████    ████
        █  █    █  █    █  █    █  █
        █  █    █       █  █    █  █
        ███      ██     ████    ████
        █          █    █  █    █  █
        █          █    █  █    █  █
        █ █     ███ █   █  █ █  █  █ █

▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

POST-SURVEILLANCE ALTERNATIVE ATLAS v.1.0
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃

by: JM Escalante | www.jmescalante.info
▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃▃



LICENSE:

PSAA is distributed under an MIT License

Copyright (c) [year] [fullname]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

/*
Version history (MMXX): 

    v01     10/19   Loads an image and does the object detection. 
                    YOLO method was abandonded due to x/y inacuracies,
                    using COCOSSD instead.
    v02     10/20   COCO detection results looks cleaner
                    COCO detection  converted to <HTML>
    v03     10/20   Ascii conversion to HTML in different ways
                    WIP TODO:
                        - A nicer way to output or figuring out ascii text size
                        - Perhaps exploring a lower-res object for HTML OUTPUT
                            and the original hi-res for the p5js canvas... ?
    v04     10/21   The HTML ascii output now works as <p> to save browser memory
                    The funtion still needs serious re-work (placement)
    v05     10/21   Added a bit of sound 
    v06     10/21   Canvas is now a small square fixed on the Low-Left corner
                    The "About" button appears
                    Early Sci-Fi UI in a different file (temp_interface.js) 
    v07     10/24   Todo comienza a dialogar:
                        - ML Object Recognition
                        - ASCII generation
                        - UI  
                    Cycle starts to work too!
    v08     10/24   CharRNN Model is now brought to the mix
    v09     10/25   An attempt to run multiple threads (web workers) to avoid the
                    window freeze that the ml5js library creates with every cycle :[
                        (this part of the process might fail, because it requires
                        to move all the Object Detection Functions to a different JS,
                        we start with the image one.)
                        *Several hours latesr: it failed
    v10     10/25   We are taking over what v08 had going on.
                    A new file appears! --> html_output ... so we can have a clean file to work with
                        in an organized way. This is the file that populates the browser screen.
                    The HTML is an important component of this project, since it
                    generates the alternative map of surveillance and opperssion that we are pursuing.
                    This file starts to talk with the entire browser window.
                    Current error: WebGL: CONTEXT_LOST_WEBGL: loseContext: context lost : [
    v11     10/31   What a week! v11 takes off seven days later. The main aim is to get us to the first prototype.
                    This version now adds sound to the 'id' operations (but still crashes, should I use tone.js?)
                    This version now outputs a distorted ascii version of the original photo into the HTML
                    Morse-code markers added
                    Loading Screens generated (no design yet)
    v12     11/01   Finally, we add a selection of 183 images.
                    Ideally these would be dynamically loaded from elsewhere 
                    New color scheme! (socialist green and comrade red, inspired by "Papers Please")
                    Canvas now is on the center (might be a final layout choice)
                    Loading Screens !
                    Virilio's Wisdom also incorporated.
    v13     11/03   About page (overlay) now appears
    v14     11/06   Auto-Scrolling function implemented now 
    v15     12/26   Different sounds for different events with attention to panning.
                    Local WebFonts now work, no more Google Fonts calls.
                    Auto-Scroll ON/OFF button implemented to prevent interaction frustration.
                    Total images are now 238 (183 before)
    v16     12/27   This version exports TXT files for:
                        - Object Detection,
                        - CharRNN Comments,
                        - Ascii Results (in preparation of offline mode)
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
    v17     12/27   From now on, no ML / AI happens in the browser,
                        all CharRNN and Object Detection data loads from txt files. 
                        This allows the project to be run without an internet connection and age gracefully.
    v18     12/27   The webpage now loads completely offline (no external library calls)
                    BOOK MODE activated! (if seed and page are received, an image downloads automatically)
            12/28   'doubleCanvasMode' mode for screen-recording purposes (this was later abandoned)
    v19     12/29   BOOK MODE has been totally restructured, now it lives in its own JS file
                            - it randomly generates a page based on pageNo and Seed (up to 5 pages).
                            - it has a simple UI and re-configures how everything is being drawn.
                            - took two days to complete.
                            - usually hidden to the viewer, available for testing here:
                                            index.html?seed=19842020&page=1
    v20     12/31   Final details and overall cleanup:
    (1.0)                   - A cruz appears if we have no results
                            - Code is better organized, some testing functions have disappeared.
                            - v20 is not v1.0
*/

//
let sF = true; // sF = secondary console feedback
let readyForNewCycle = true;
let asciiModelReady = false;
let charRNNLoaded = false;
let asciiDisplayReady = false;
let readyToDraw = false;
let cicloHaTerminado = false;
let tiempoCiclo = 150; // 500 seems to work , 250 faster, 25 crazy!
let tiempoCicloCont = 0;
let charRNNStarterWords = "Control, a mechanism";
// Sound activation variables
let userSelectedSound = false;
let soundIsOn = false;
let cnvs;
// Image cycle
const totalImgs = 237;
let currentImg;
// Human Count
let currentHumanCount = 0;
let totalHumanCount = 0;
// Color
let green;
const greenT = '#dee1d0'; // Green color AS Text
// TXT exports:
const commentExport = false; // CharRNN lateStage Comment generator
const cocoExport = false; // Object detection results
const asciiExport = false;
// For screen-recording and documentation purposes only
const doubleCanvasMode = false;
const backgroundOnlyMode = false;



// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ CORE P5.JS FUNCTIONS ▉▉▉▉▉▉▉

function preload(){
    green = color('#dee1d0'); /* Socialist Green ¡*/
}

/*
function bookPageSaverTest(){
    
    // AutoScroll Issues
    console.log("Book page Saver mode: ACTIVE");
    
    // HTML CLock (pages populates quick!)
    innerHTMLClockLimit = 25;
    
    // Scale back to 1
    bookPageSaverPage.style.transform = "scale(1)";
    
    // Somewhere in book mode I need to de-activate autoScroll
    autoScrollActive = false;
    window.scrollTo(0,scrollYCurrent);
    
    
    let theHtmlPage = document.getElementById("bookPageSaverPage");
    let pTest = document.createElement('p');
    pTest.innerHTML = "bookPageSaverTest() P auto-generated tag on click";
    pTest.style.fontSize = "50px"; 
    thePage.appendChild(pTest);

    // We increase the size of the Canvas ? Maybe not necessary here, since it already happens in dary
//    tripleCanvas();
    
    
    // Adding the canvas to the new container
//    canvas.parent('bookPageSaverPage');
    cnvs.parent('canvasBookPageIn');
    
    // Centering the Canvas
    
    //Saving Routine
    html2canvas(theHtmlPage, { // turn it into a canvas object
        width:2412,
        height: 3074,
        scrollY: 0
    }).then(function(canvas) {

        // create a link to a png version of our canvas object, then automatically start downloading it
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/png");
        //a.download = seed + '_' + page + '.png';
        a.download = 'please.png';
        a.click();
    });
    
    // 
    // Scale back to 0.2 (for browser display)
    bookPageSaverPage.style.transform = "scale(0.2)";
    
}
*/
function setup(){
    // 1. Canvas placement and background
    cnvs = createCanvas(320, 200); // 360 in h originally
    cnvs.parent('canvasDivCentered'); // will change to canvasDiv later
    cnvs.id('p5jsCanvas');
    background(green);
    
    // 2. Setting the initial image
    currentImg = floor(random(1,totalImgs-10));
    if(bookMode && page == 1 ) currentImg = 16;
    // currentImg = 15; // Start from a certain point
    
    // 3. Cleaning console output
    console.clear();
    
    // 4. Loading Screen
    loadingMessage();
    
    // 5. ML functions
    asciiSetup();
    startCharRNNEngine();
    
    // 6. Sound:
    
    startSoundEngine();
    // 7. UI y otros
    startUICoordinates();
    iniciarTops();
    resetSquareCells();
    
    // 8. Book Mode and Documentation
    checkBookMode();
    checkBackgroundOnlyMode();

}

function draw(){
    
    if(!userSelectedSound && detectionModelStatus && charRNNLoaded && !bookMode){
        // 1. SOUND SELECTION SCREEN
        // All models have loaded, we just need the user's input
        // to execute the page with or without sound
        loadingMessageSoundSelection();
        
    }else if(userSelectedSound){
        
        // 2. MAIN SCREEN (MAP GENERATION)    
        
        // Documentation
        if(doubleCanvasMode) doubleCanvas();
        
        // Book Mode Operations
        if(bookMode) tripleCanvas();
        if(bookMode && systemON) bookClock();
        
        // MAIN LOOP 
        background(green);
        if(systemON) monitorDeCiclos();
        mostrarUI();
        if(asciiDisplayReady) mostrarAsciiImage();
        if(readyToDraw) cocoDrawResults();
        if(readyToDraw) updateHTML();
        if(soundIsOn) brownNoiseEvolution();
        
    }
    
    // BORRAR: 
    // if(staticLoaded) image(img, 300, 300, width, height);
   
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ CYCLE / FLOW CONTROL  ▉▉▉▉▉▉▉

function monitorDeCiclos(){
    
    if(readyForNewCycle && detectionModelStatus && asciiModelReady && charRNNLoaded){
        // We start the new Cycle
        nuevoCiclo();
    }
    
    // Countdown mode to new cycle...
    if(cicloHaTerminado){
        
        if(tiempoCicloCont == 0) newHTMLOutput();
        tiempoCicloCont++;
        if(tiempoCicloCont >= tiempoCiclo){
           cicloTermina();
        }
        
    } 
}

function nuevoCiclo(){
    //
    readyForNewCycle = false;
    cicloHaTerminado = false;
    
    // Loading Image for object detection
    startYOLO();
    /* flow (legacy):
        --> cocoImageReady()
            --> cocoGotResult()
                --> cocoDrawResults()
    */
    
    // Reset switches
    resetAscii();
    cocoCounter = 0;
    cocoTLX = globalMargin;
    tiempoCicloCont = 0;
    getNewRadarAngle();
    resetSquareCells();
    
    // Reset HTML Anims
    resetNavegante();
    currentCycleOutputs = 0;
    
    // New LateStageCapitalism text generation: 
    generateNewText();
        
}

function cicloTermina(){

    // We reset all variables in here and we get ready for a new 
    // cycle, (depending on the global timer)
    readyForNewCycle = true;
    readyToDraw = false;
    // 
    // We reset the last word: (Maybe not necessary anymore)
    let lastWord = currentCharRNN.split(" ").pop();
    if(lastWord == " " || lastWord == null){
        lastWord = "CONTROL, ";
    }
    charRNNStarterWords = lastWord;
    
}

function loadingMessage(){
    
    // This function just runs once (called in setup) used to be yellow....
    //background(255,255,0);
    
    // 1. Small >> indicators
    background(green);
    fill(0, 40);
    textSize(10);
    textAlign(LEFT);
    text(">> ...", 15, height-10);
    
    // We Draw 4 crosses at the perimeter
    strokeWeight(1.5);
    stroke(0);
    drawCross(0, 0, 5);
    drawCross(width, 0, 5);
    drawCross(0, height, 5);
    drawCross(width, height, 5);
    
}


let loadingRulerW = 15; // This is how it starts

function loadingMessageSoundSelection(){
    
    // 1. Bottom text subtle indication
    background(green);
    fill(255,0,0);
    fill(0, 40);
    noStroke();
    text(">> Ready!", 15, height-10);
    
    // 2. Resizing the Main Ruler
    if(loadingRulerW < 290){
        loadingRulerW = friccion(loadingRulerW, 390, 25, true);
        loadingRuler.style.width = loadingRulerW+"px";
    } 
    
    // 3. Setting the text
    loadingMessageText.style.display = "none";
    
    // 4. Showing the Buttons:
    flexButtons.style.display = "flex";
     
}



// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ OBJECT DETECTION ▉▉▉▉▉▉▉
/* 

This portion of the code builds upon
the YOLO/COCOSSD example from the ML5JS website:
https://learn.ml5js.org/#/reference/yolo
by Cristobal Valenzuela

*/

// const coco = ml5.objectDetector('cocossd', cocoModelReady); // (legacy)
let cocoImg;
let cocoObjects = [];
let cocoTotals = 0;

// Crucial booleans for the system to start:
let cocoImgLoaded = false;
let detectionModelStatus = true;

// 
let cocoObjectsTxt = [];
let cocoTLX = globalMargin;
const cocoTLStartsAt = 90; // 
let cocoCounter = 0;
let cocoTLSpeed = 7;
let cocoActivados = [];

// I. IMG LOADING * * * * * * * * * * * * * 
function startYOLO(){
    // Console feedback
    if(sF) console.log("▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ NEW CYCLE ! ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉");
    if(sF) console.log(">> Image loading starts now");
    
    // Increasing the currentImg
    currentImg++;
    if(currentImg > totalImgs) currentImg = 0;
    if(bookMode && page == 1) currentImg = 15;
    
    // Loading it
    cocoImg = loadImage("_data/imgs/"+currentImg+".jpeg", cocoImageReady);
    cocoImgLoaded = false;
    
}

// II. ML OBJECT DETECTION  * * * * * * * * 
function cocoImageReady(){
    // Once the image has loaded, we get a predicition for that image
    if(sF) console.log(">> Object detection starts now... IMG No.: ", currentImg);
    if(sF) console.log(">> cocoImg w: ", cocoImg.width);
    if(sF) console.log(">> cocoImg h: ", cocoImg.height);
    // OFFLINE MODE DETECTION (txt file instead of in-browser ML)
    //coco.detect(cocoImg, cocoGotResult);
    cocoObjectsTxt = loadStrings("_data/txts/detection_results/detection_"+currentImg+".txt", offlineCocoDetect, offlineCocoDetectError);
    cocoImgLoaded = true;
}

function offlineCocoDetect(){
    
    console.log("····························································");
    console.log(">> Offline Detection (TXT), totals: ", cocoObjectsTxt.length);
    console.log(">>IMG NO: ", currentImg);
    
    // 1. Setting the new totals
    cocoTotals = cocoObjectsTxt.length;
    
    // 2. Verifying there is a detection or whether the array is empty
    if(cocoObjectsTxt[0].length <= 1){
        // Option A. No objects, total is zero, end of story
        console.log("·······  NO OBJECTS DETECTED ····");
        console.log("·······  Corrected total:", cocoTotals);
        cocoTotals = 0;
    }else{
        // Option B. We proceed to remove the last element (usually a blank line)
        cocoObjectsTxt.pop();
        cocoTotals = cocoObjectsTxt.length;
        console.log("·······  Adjusted totals: ", cocoTotals);
    }
    
    // 3. Replacing the STring array with a JS Object in each position
    for(let i=0; i<cocoTotals; i++){
        console.log("·······  LENGTH:", cocoObjectsTxt[i].length);
        let temporarySplit = split(cocoObjectsTxt[i], ",");
        cocoObjectsTxt[i] = {label:temporarySplit[0], x:temporarySplit[1], y:temporarySplit[2], width:temporarySplit[3], height:temporarySplit[4] };
        console.log("·······  i:", i, "-->", cocoObjectsTxt[i]);
        // console.log("·······  width -->", cocoObjectsTxt[i].width);
        // console.log("·······  height -->", cocoObjectsTxt[i].height);
    }
    console.log("····························································");
    
    // 4. We are ready to draw and start the Ascii Image Conversion
    readyToDraw = true;
    asciiConversion(cocoImg);
    
    
    // 5. UI Top indicators timer:
    topsFixedTimerCont = 0;
    
    // 6. Reseting the CocoActivados Array
    for(let i=0; i<cocoTotals; i++){
        cocoActivados[i] = false;
    } 
    
    // 7. Updating the Human Count
    currentHumanCount = 0;
    for(let i=0; i<cocoTotals; i++){
        if(cocoObjectsTxt[0].label == "person") currentHumanCount += 1;
    }
    // Note: we should implement an aggressor and victim count ... ?
    totalHumanCount += currentHumanCount;
    humanCountCounter = 0;
    
}

function offlineCocoDetectError(cocoErr){
    console.log(">> Detection error: ", cocoErr);
}

// III. We got the results / error handling
function cocoGotResult(cocoErr, cocoResults) {
  if (cocoErr) {
    if(sF) console.log(">> Detection error: ", cocoErr);
  }else{
      
    cocoObjects = cocoResults; // An Array
    cocoTotals = cocoObjects.length;
    readyToDraw = true;
    asciiConversion(cocoImg);
      
      
    // cocoDrawResults(); // Temporary Draw Function:
    // UI Top indicators timer:
    topsFixedTimerCont = 0;
      
    // TXT Export
    if(cocoExport){
        let detectionExports = [];
        for(let i=0; i<cocoTotals; i++){
            detectionExports[i] = cocoObjects[i].label;
            detectionExports[i] += ","+cocoObjects[i].x;
            detectionExports[i] += ","+cocoObjects[i].y;
        }
        saveStrings(detectionExports, "detection_"+currentImg+".txt");
    }
      
    //Feedback below:
    if(sF) console.log(">> Detection Ready! Results:", cocoObjects);
    if(sF) console.log(cocoObjects);
    if(sF) console.log(">> Length: ", cocoTotals);
    if(sF && cocoTotals > 0){
        console.log(">> Label[0] = ", cocoObjects[0].label); 
        // console.log(">> x: ", cocoObjects[0].x); 
        // console.log(">> normalizedx: ", cocoObjects[0].normalized.x); 
    }
    // cocoActivados
      for(let i=0; i<cocoTotals; i++){
          cocoActivados[i] = false;
      }
      
    // HumanCount
    currentHumanCount = 0;
    for(let i=0; i<cocoTotals; i++){
        if(cocoObjects[0].label == "person") currentHumanCount += 1;
    }
    totalHumanCount += currentHumanCount;
    humanCountCounter = 0;
      
  }
}

// IV. We draw the detection results in the "visor"
function cocoDrawResults(){

    // 1. We check if we can actually draw the results
    if(cocoCounter > cocoTLStartsAt){
        // We draw the Timeline
        
        if(cocoTLX < width-globalMargin){
            cocoTLX += cocoTLSpeed;
            stroke(255,0,0);
            strokeWeight(2);
            line(cocoTLX, globalMargin*2, cocoTLX, (globalMargin*2)+visorH);    
        }else{
            /*
            This Boolean allows to start the countdown for the next cycle.
                The current circle has finished,
                    Now it is time for something new.
                    
                                Contrast.
                                
            As in life, such an essential fuel
                for the creative process.
                
                * * * * * * * * * * * 
                
            It MIGHT need to be after the TXT CharRNN data has loaded...
                But that can be later, 
                for now, it starts here...
            
            */
            
            //
            cicloHaTerminado = true;
            
        } 
        
    
        // 2. We Draw
        for(let i = 0; i < cocoTotals; i++){
            
            // We set the main coordinate system
            // Temporary (T) coordinate variables
            let xT = parseFloat(cocoObjectsTxt[i].x);
            let yT = parseFloat(cocoObjectsTxt[i].y);
            let xTcentered = parseFloat(cocoObjectsTxt[i].x) + parseFloat(cocoObjectsTxt[i].width)/2;
            let yTcentered = parseFloat(cocoObjectsTxt[i].y) + parseFloat(cocoObjectsTxt[i].height)/2;
            xT = map(xT, 0, cocoImg.width, 0, visorW)+globalMargin;
            yT = map(yT, 0, cocoImg.height, 0, visorH)+globalMargin;
            xTcentered = map(xTcentered, 0, cocoImg.width, 0, visorW)+globalMargin;
            yTcentered = map(yTcentered, 0, cocoImg.height, 0, visorH)+globalMargin;
            // console.log(i, " -- > xT: ", xT, "yT: ", yT);
            // console.log(i, " -- > xTcentered: ", xTcentered, "yTcentered: ", yTcentered)
            
            if(xTcentered < cocoTLX){
                // Dot: 
                rectMode(CENTER);
                noStroke();
                fill(255);
                fill(green);
                fill(0);
                rect(xTcentered, yTcentered, 15.5, 15.5);
                fill(255,0,0);
                push();
                    translate(xTcentered, yTcentered);
                    rotate(radians(45));
                    rect(0, 0, 1.5, 6.5);
                    rect(0, 0, 6.5, 1.5);
                pop();
                
                // Sound Dot: 
                if(!cocoActivados[i] && soundIsOn){
                    // We trigger the sound, just once
                    let panValue = map(xT-globalMargin, 0, cocoImg.width, -1, 1);
                    panValue = constrain(panValue, -1, 1);
                    playTone("dot", panValue);
                    cocoActivados[i] = true;
                }
                

                // Back Label:
                fill(255);// temp length
                fill(0);
                let labelLength = map(cocoObjectsTxt[i].label.length, 3, 8, 20, 30);
                rect(xTcentered, yTcentered +7.5, labelLength, 9);

                // Label: 
                fill(255);
                noStroke();
                textAlign(CENTER, TOP);
                textFont("Share Tech Mono");
                textSize(6.5);
                let theLabel = cocoObjectsTxt[i].label;
                if(theLabel == "person") theLabel = "human";
                text(theLabel.toUpperCase(), xTcentered, yTcentered +5);
                      
            }

            //UI Top indicator / new deseo
            if(i < topsTotal){
                topsXDeseo[i] = xT;
                topsActivo[i] = true;
            }
        }
    }else{
        cocoCounter++;
    }

}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ ASCII Conversion ▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

/*
    This portion of the code builds from the ASCII Library
        implementation example by Paweł Janicki,
        his 'typeArray2dLocal' function is left untouched.
        
        >> https://www.tetoki.eu/asciiart/asciiart_stillimage.html
*/

let myAsciiArt;
// Ascii graphics size:
const asciiart_width = 64; 
const asciiart_height = 40;
const asciiTotals =  asciiart_width*asciiart_height;
let gfx; // Buffer for processed graphics
let ascii_arr; // A 2D array storing ASCII Codes
let asciiActivos = [];

function asciiSetup(){
    
    gfx = createGraphics(asciiart_width, asciiart_height);
    gfx.pixelDensity(1);
    /*
        A new object derived from from the p5.asciiart library.
            new AsciiArt(_sketch);
            new AsciiArt(_sketch, _fontName);
            new AsciiArt(_sketch, _fontName, _fontSize);
            new AsciiArt(_sketch, _fontName, _fontSize, _textStyle);
    */
    myAsciiArt = new AsciiArt(this);
    asciiModelReady = true;
    apagarAsciis();
    
    
}

function apagarAsciis(){
    for(let i=0; i<asciiTotals; i++){
        asciiActivos[i] = false;
    }
}

function resetAscii(){
    asciiDisplayReady = false;
    apagarAsciis();
}

function asciiConversion(theImage){
    // 0. Feedback
    console.log("Ascii conversion started");
    
    // 1. We prepare the image for conversion
    gfx.image(theImage, 0, 0, gfx.width, gfx.height);
    gfx.filter(POSTERIZE, 3);
    //    gfx.filter(INVERT, 3);
    
    // 2. The Conversion
    // convert returns a 2D array same resolution as the image
    // To pich a different resolution fore the glyph table,
    // use a 2nd and 3rd value, covert(gfx, new width, new height)
    ascii_arr = myAsciiArt.convert(gfx, 64, 25);
    asciiDisplayReady = true;
    
    // Here I would need an HTML function    
    // Or Here????? --->  // TXT Export
    if(asciiExport){
        
        // 1. Temporary Array
        let asciiT = [];
        
        // 2. Filling the Arrays
        for(let i=0; i<ascii_arr.length; i++){
            for(let j=0; j<ascii_arr[i].length; j++){
                if(i == 0){
                    asciiT[j] = ascii_arr[i][j];
                }else{
                    asciiT[j] += ascii_arr[i][j];
                }
            } 
        }
        
        // 3. Saving the Strings
        saveStrings(asciiT, currentImg+".txt");
        
    }
    
}

function mostrarAsciiImage(){
    // This function might need to be somewhere else:
    // or in the ascii Display ...
    // The function below places the characters on the screen.
    //   typeArray2d(the Glyph, _destination (canvas), x,y,w,h)
    fill(0, 250);
    noStroke();
    textAlign(CENTER, CENTER);
    textFont('monospace', 8);
    textStyle(NORMAL);
    //myAsciiArt.typeArray2dLocal(ascii_arr, this, globalMargin, globalMargin*2, visorW, visorH);
    typeArray2dLocal(ascii_arr, this, globalMargin, globalMargin*2, visorW, visorH);
    
    // Mostramos gradualmente los caracteres
    for(let i=0; i<asciiTotals; i++){
        if(random(100)>92.7) asciiActivos[i] = true;
        if(random(100)>99.9) asciiActivos[i] = false;
    }
    
    // 

}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Testing different HTML outputs, the main code does not use them anymore. 
// They remain here for documentation purposes.

function asciiToHTML( theGlyphs ){
    // The Array goes row by row
    // CODE could break here if a null array is received
    let glyphsCols = theGlyphs.length;
    let glyphsRows = theGlyphs[0].length;
    
    if (sF) console.log("Col:", glyphsCols);
    if (sF) console.log("Rows:", glyphsRows);
    for(let i = 0; i < glyphsCols; i++){
        let glyphRowT = document.createElement("P"); 
        glyphRowT.innerText = i+" ";
        for(let j = 0; j < glyphsRows; j++){
            glyphRowT.innerText += theGlyphs[i][j];
        }
        document.body.appendChild(glyphRowT); 
    }
    
}

function asciiToHTMLDiv( theGlyphs ){
    console.log("Ascii to html in here, just a test.");
    // Main Data from the Glyph Array
    let glyphsCols = theGlyphs.length;
    let glyphsRows = theGlyphs[0].length;
    
    // The html object (this might need to change)
    let theBox = document.getElementById('box1'); // Main container
    let destinationWidth = 250; // This must be dynamically calculated ...
    let destinationHeight = 150; // This must be dynamically calculated ...
    
    
     let theAsciiArt = document.createElement('div'); // Creating the SET of Grids 
    // For loop starts: 
    for(let i = 0; i < glyphsRows; i++){
        // Row by Row 
        //        theRow.className = 'flexRow';
        
        // Temporary top
        //        let rowHeightT = map(i, 0, glyphsRows, 0, destinationHeight);
        //        theRow.style.top = rowHeightT +'px';
        let cssY = map(i, 0, glyphsRows, 0, destinationHeight);
        

        for(let j = 0; j < glyphsCols; j++){
            // Column by Colum
            let glyphDiv = document.createElement('div'); // Creating the <div>
            let glyphDivIdName = "glyph"+i+"_"+j;
            let glyphClassName = 'flexCell';
            glyphDiv.className = glyphClassName;
            glyphDiv.id = glyphDivIdName;
            
            // Glyph Character coordinates
            let cssX = map(j, 0, glyphsCols, 0, destinationWidth);
            
            glyphDiv.style.left = cssX+"px";
            glyphDiv.style.top = cssY+"px";

            // The Glyph Character
            let glyphChar = document.createElement("P"); 
            glyphChar.innerText = theGlyphs[j][i];
  

            // The proper append
            glyphDiv.appendChild(glyphChar);
            theAsciiArt.appendChild(glyphDiv);
        }    
        
    }
    theBox.appendChild(theAsciiArt);
    
}

/*
This approach generates a <div> flex row for each line
Inside there are also a lot of <div> cells
Might demand too much of the browser
*/

function asciiToHTMLDivFlex( theGlyphs, glyphsCols, glyphsRows ){
    
    // The html object (this might need to change)
    let theBox = document.getElementById('box1'); // Main container
    console.log(">> Starting the FLEX!!! ", glyphsCols, glyphsRows);
    
    // For loop, we convert each ascii to a flex grid: 
    for(let i = 0; i < glyphsRows ; i++){
        
        // Row by Row 
        let flexRow = document.createElement('div'); // Creating the ROW 
        flexRow.className = 'flexRow';
        
        for(let j = 0; j < glyphsCols ; j++){
            
            // The flex cell <div>
            let glyphDiv = document.createElement('div');
            glyphDiv.className = 'flexCell';
            glyphDiv.style.width = 250+'px';
            
            // The Glyph Character on a <p> tag
            let glyphChar = document.createElement("P"); 
            glyphChar.innerText = theGlyphs[j][i];

            // We join them together
            glyphDiv.appendChild(glyphChar);
            flexRow.appendChild(glyphDiv);
        }
        
        // Adding the row to the html
        theBox.appendChild(flexRow);
        
    }  
    
}

/*
This approach attempts to use less browser resources
by treating each row as a <p>
line-height (leading) and letter-spacing control de grid in CSS.
*/

function asciiToHTMLDivP( theGlyphs, glyphsCols, glyphsRows ){
    console.log("Placing HTML content to the box <p> style");
    
    // We get the HTML object / box (this might need to change)
    let theBox = document.getElementById('box1'); // Main container

    // Creating the <div>
    let glyphDiv = document.createElement('div'); // Creating the <div>
    glyphDiv.className = 'flexCell';

    // For loop starts: 
    for(let i = 0; i < glyphsRows; i++){
        
        let glyphChar = document.createElement("P");
        //  glyphChar.style.width = 250+'px';
        let rowText = "";
        
        for(let j = 0; j < glyphsCols; j++){
            // We add the Glyph Character
           rowText += theGlyphs[j][i];
        }

        // Appending content
        glyphChar.innerText = rowText;
        glyphDiv.appendChild(glyphChar);
    }
    // The Final append
    theBox.appendChild(glyphDiv);
    
}

function asciiDisplay(){
    /*
    textAlign(CENTER, CENTER); textFont('monospace', 8); textStyle(NORMAL);
  noStroke(); fill(255);
  */
    let asciiTextT = "";
    
    
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function typeArray2dLocal (_arr2d, _dst, _x, _y, _w, _h) {
  if(_arr2d === null) {
    console.log('[typeArray2d] _arr2d === null');
    return;
  }
  if(_arr2d === undefined) {
    console.log('[typeArray2d] _arr2d === undefined');
    return;
  }
  switch(arguments.length) {
    case 2: _x = 0; _y = 0; _w = width; _h = height; break;
    case 4: _w = width; _h = height; break;
    case 6: /* nothing to do */ break;
    default:
      console.log(
        '[typeArray2d] bad number of arguments: ' + arguments.length
      );
      return;
  }
  /*
    Because Safari in macOS seems to behave strangely in the case of multiple
    calls to the p5js text(_str, _x, _y) method for now I decided to refer
    directly to the mechanism for handling the canvas tag through the "pure"
    JavaScript.
  */
  if(_dst.canvas === null) {
    console.log('[typeArray2d] _dst.canvas === null');
    return;
  }
  if(_dst.canvas === undefined) {
    console.log('[typeArray2d] _dst.canvas === undefined');
    return;
  }
  var temp_ctx2d = _dst.canvas.getContext('2d');
  if(temp_ctx2d === null) {
    console.log('[typeArray2d] _dst canvas 2d context is null');
    return;
  }
  if(temp_ctx2d === undefined) {
    console.log('[typeArray2d] _dst canvas 2d context is undefined');
    return;
  }
  var dist_hor = _w / _arr2d.length;
  var dist_ver = _h / _arr2d[0].length;
  var offset_x = _x + dist_hor * 0.5;
  var offset_y = _y + dist_ver * 0.5;
  let contT = 0;
  for(var temp_y = 0; temp_y < _arr2d[0].length; temp_y++){
    for(var temp_x = 0; temp_x < _arr2d.length; temp_x++){
        if(asciiActivos[contT]){
      /*text*/
            
            temp_ctx2d.fillText(
        _arr2d[temp_x][temp_y],
        offset_x + temp_x * dist_hor,
        offset_y + temp_y * dist_ver
      );
      
        }
      contT++;
        
    }
  }
    
 
    
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉ S O U N D ▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

let env;
let osc;
let amp;
let delay;
let soundStarted = false;
let notonEnv;
let notonOsc;
let notonFreq;
let eraseEnv;
let eraseOsc;
let eraseFreq;
//
let backgroundNoise, filterNoise;
let brownFreq = 20; // Brown Noise Cut-off LP frequency
let brownVar = 0;
const brownNoiseSeed = 0.0002;
const brownFreqMin = 100;
const brownFreqMax = 400; // 400-700 seems to work as max value
let soundFBChars = ["▀", "▃", "█", "▎", "▐", "▕", "▗", "▖", "▘", "▚", "▜", "▞", "▟", "▔"];
let soundFBCharMsg = "";

function startSoundEngine(){
    // By default the Audio Engine is off
    getAudioContext().suspend();
    
}

function startSoundEngineForReals(){
    // 
    userStartAudio(); 
    
    // 1. Result detected Noise
    osc = new p5.Noise('brown');
    delay = new p5.Delay();
    osc.amp(0);
    osc.start();
    
    // 2. Background Noise
    backgroundNoise = new p5.Noise('brown');
    backgroundNoise.start();
    backgroundNoise.amp(0.25);
    filterNoise = new p5.LowPass();
    filterNoise.freq(10); // 400 originally
    backgroundNoise.disconnect();
    backgroundNoise.connect(filterNoise);
    
    // 3. Noton Note (for small interface events, short short envelopes)
    //          (attackTime, attackLvl, decayTime, decayLevel)
    notonEnv = new p5.Envelope(0.001, 0.7, 0.000001, 0.01);
    notonFreq = 1200; 
    notonOsc = new p5.Oscillator('triangle', notonFreq);
    
    // 4. Sound Erase Tone
    eraseEnv = new p5.Envelope(0.00751, 0.4, 0.000001, 0.3);
    eraseFreq = 1800; 
    eraseOsc = new p5.Oscillator('square', eraseFreq);
}

function brownNoiseEvolution(){ 
    /*
        This function uses perlin noise to set the filter's LowPass frequency
    */
    brownVar += brownNoiseSeed;
    brownFreq = map(noise(brownVar), 0.1, 1, brownFreqMin, brownFreqMax);
    if(brownFreq < brownFreqMin) brownFreq = brownFreqMin+0.5; // failswitch
    if(brownFreq > brownFreqMax) brownFreq = brownFreqMax-0.5; // failswitch
    brownFreq = floor(brownFreq);
    filterNoise.freq(brownFreq);
}

function playTone( soundType , panVal){
    if(soundIsOn){
        
        // FEEDBACK
        let totalFeedBackNotes = floor(random(3, 425));
        soundFBCharMsg = "";
        for(let i=0; i<totalFeedBackNotes; i++){
            soundFBCharMsg += soundFBChars[floor(random(soundFBChars.length))];
        }
        console.log("Playing sound, type: ", soundType, soundFBCharMsg);

        // Frequencies
        // Numbers I like:
        /*
            5125
            freq: 2601.1904761904
        */

        let minFreq = 2600;
        let maxFreq = 6000;
        let freq = constrain(random(minFreq, maxFreq), minFreq, maxFreq);

        // AMP and PAN
        osc.amp(0.15);
        osc.pan(panVal);

        // DELAY
        delay.process(osc, 0.05, .25, 10700);

        // ENV
        let decayTime = 0.001;
        env = new p5.Envelope(0.0, 0.5, decayTime, 0.5);
        
        // PLAY
        env.play(osc);
    
    }
}

function playNotonTone( notonType ){
    
    /*
    Possible Noton Types:   (a) html ---->   Sound of HTML output   1200 - 1800 Hz
                            (b) scroll -->  Scroll execution    --  5500 - 10000 Hz
                            (c) uix  ---->   Interface deets
                            (d) eraseWarning --->  Warning          1780 - 1810 Hz
    */
    
    if(soundIsOn){
        // --------------------------- (a) html sound
        if(notonType == "html"){
            notonFreq = random(1200, 1800);
            notonEnv.mult(random(0.2, 0.8));
            notonOsc.pan(random(-1, 1));
        }
        if(notonType == "scroll"){
            notonFreq = random(5500, 10000);
            notonEnv.mult(random(0.2, 0.61));
            notonOsc.pan(random(-1, 1));
        }
        if(notonType == "eraseWarning"){
            eraseFreq = random(1790, 1800);
            eraseEnv.mult(random(0.1, 0.31));
            eraseOsc.pan(0);
            eraseOsc.freq(eraseFreq);
            eraseOsc.start();
            eraseEnv.play(eraseOsc);
        }
        
        notonOsc.freq(notonFreq);
        notonOsc.start();
        notonEnv.play(notonOsc);

    } 
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ CHARRNN  ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
/*
The CharRNN portion of this project builds upon the ML5JS example found at:
    https://learn.ml5js.org/#/reference/charrnn
    by: Cristobal Valenzuela and Memo Atken
    
Original versions of the code exectued the ML in the browser.
However, this created an awkward pause that broke the overall flow. (see 10/25)
For this reason, this version of the code, loads pre-machine-learning-generated data

    - We now use startCharRNNEngine() instead of startCharRNNEnginePrev()
    
Sin embargo, decidimos dejar esta función del mismo modo que al restaurar un
viejo edificio, fragmentos de muros anteriores se dejan intactos para mostrar
los materiales de construcción y estructura previa.

*/
let charRNN;
let charRNNModelName = 'lateStage3/';
let charRNNModelAtWork = false; // This will prevent from doubling instance loading
let currentCharRNN = '';
let currentCharRNNComment = 0;
let totalCharRNNComments = 560;
const commentPrefix = "lateStage_";
let commentCount = 421;
// =(
let censoredTerms = ["ass", "trump", "fuck", "fucker", "fucking", "fucky", "chink", "beaner", "brown", "nigger", "niggaz", "nigg", "ice", "fucked", "police", "hispanic", "nigro", "kike", "shit", "cia", "fbi", "ice", "marx", "marxism", "american", "American", "german", "black", "America", "cunt", "pussy", "dick", "colored"];


function startCharRNNEngine(){
    charRNNLoaded = true;
}

function startCharRNNEnginePrev(){
    // We start the LSTM Generator with our model of choice
    charRNN = ml5.charRNN('_data/models/'+charRNNModelName, charRNNModelReady);
}

function charRNNModelReady(){
    charRNNLoaded = true;
    console.log(">> CharRNN Model is ready! >> ", charRNNModelName);
    console.log(">> charRNNLoaded = ", charRNNLoaded);
    
}

function generateNewTextPrev(inputText, theTemperature, theLength) {
    
    
  if(!charRNNModelAtWork) {
      
      charRNNModelAtWork = true;

      console.log(">> CHARRNN ... getting new text... ");
      
      // Grab the original text
      // Make it to lower case
      const textToSend = inputText.toLowerCase();
      
      // The LSTM generator needs:  
      // Seed text, temperature, length to outputs
      const dataToSend = {
            seed: textToSend,
            temperature: theTemperature /* NUmber from 0 to 1 */,
            length: theLength
      };

      // Generate text with the charRNN
      charRNN.generate(dataToSend, gotCHARRNNData);

      // We got data:
      function gotCHARRNNData(err, result) {
          console.log(">> New CHARNN generated.");
          //console.log(result.sample);
          //console.log(result);
          charRNNModelAtWork = false;
          // Temp:
          //tempMainTag.innerText = "Health care is "+result.sample;
          censorship(result.sample);
      }
    
  }
}

function generateNewText(){
    
    if(!charRNNModelAtWork) {
        // 0. We are working
        charRNNModelAtWork = true;

        // 1. Increasing the current comment (TXT File)
        currentCharRNNComment++;
        if(currentCharRNNComment > totalCharRNNComments) currentCharRNNComment = 0;
        console.log("RNNNNNN >> Getting new texto, no: ", currentCharRNNComment);
        
        // 2. Variation in the prefix >> ++ .. -- –– // || [...] ...
        let tipoCharElegido = floor(random(10)+1)
        if(tipoCharElegido == 1) currentCharRNN = "&#62;&#62; ";
        if(tipoCharElegido == 2) currentCharRNN = "++ ";
        if(tipoCharElegido == 3) currentCharRNN = "-- ";
        if(tipoCharElegido == 4) currentCharRNN = "// ";
        if(tipoCharElegido == 5) currentCharRNN = "[...] ";
        if(tipoCharElegido == 6) currentCharRNN = "|| ";  
        if(tipoCharElegido == 7) currentCharRNN = "... ";
        if(tipoCharElegido == 8) currentCharRNN = currentImg+".- ";
        if(tipoCharElegido == 9) currentCharRNN = "("+currentImg+") ";
        if(tipoCharElegido == 10) currentCharRNN = "* ";
        if(tipoCharElegido == 11) currentCharRNN = "SAVED POST [User: "+currentImg+"].";  


        // 3. Loading the TXT into a temporary Array
        let currenCommentT = loadStrings("_data/txts/lateStage_CharRNN/lateStage_"+currentCharRNNComment+".txt", updateCharRNNComment);

        function updateCharRNNComment(){
            // 4. Saving the Array into one single set of Strings
            for(let i=0; i<currenCommentT.length; i++) currentCharRNN += currenCommentT[i];
            charRNNModelAtWork = false;
            console.log("RNNNNNN >> New comment >>", currentCharRNN);
        }
    }
    
}

function censorship(charRNNResult){
    // We parse the text by words
    let currentText = charRNNResult.split(" ");
    palabrasTotales = currentText.length;
    currentCharRNN = "";
    
    // Censorship filter
    for(let i=0; i<palabrasTotales; i++){
        if(isCensored(currentText[i])){
            currentText[i] = getNewWord(currentText[i].length);
        }else if(random(100)>80 && currentText[i].length > 5){
            currentText[i] = getNewWord(currentText[i].length);
        }
        currentCharRNN += currentText[i];
        if(i<palabrasTotales-1) currentCharRNN += " ";
    }
    
    // TXT Output
    if(commentExport){
        let currentCharRNNT = [];
        currentCharRNNT[0] = currentCharRNN;
        let commentExportFileName = commentPrefix+commentCount+".txt";
        saveStrings(currentCharRNNT, commentExportFileName);
        console.log(" >> >> CHARRNN DATA SAVED AS TXT in file: ", commentExportFileName);
        commentCount++;
    }
    
}

function isCensored(palabra){
    let isIt = false;
    for(let i=0; i<censoredTerms.length; i++){
        if(palabra == censoredTerms[i]){
            isIt = true;
            // console.log("Uh Oh, found a censored word: ", palabra);
        } 
    }
    return isIt;
}

function getNewWord(longitud){
    let palabraT = "";
    for(let i=0; i<longitud; i++){
       palabraT += "▉"; 
    }
    return palabraT;
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ DOCUMENTATION FUNCTIONS  ▉▉▉▉▉▉▉

function doubleCanvas(){
    // A resized canvas will allow us to screencapture bigger print-quality images
    // 1. P5JS Scale
    resizeCanvas(640, 400);
    scale(2);
    
    // 2. Resizing the canvas container (experimental)
    //    canvasDivCentered.style.width = "640px";
    
}

function tripleCanvas(){
    // A function for BOOKMODE
    // A resized canvas will allow us to screencapture bigger print-quality images
    // 1. P5JS Scale
    // Scale 4 = 320 * 4, 200 *4
    resizeCanvas(1280, 800);
    scale(4);

}

function checkBackgroundOnlyMode(){
    
    if(backgroundOnlyMode){
        // Background only mode is used to screencapture the background
        // NO: p5JS canvas , navigation buttons, Virilio's AI poetry
        canvasDivContainer.style.display = "none";
        navDiv.style.display = "none";
        centerPoetryInnerContainer.style.display = "none";
    }
    
}




