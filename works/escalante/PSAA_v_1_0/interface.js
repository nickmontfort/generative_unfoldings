// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉PSAA ▉▉▉▉ INTERFACE ▉▉▉▉▉▉▉▉▉▉▉▉

/*

Un reducido cuadro en la pantalla.
El resultado de la lectura. 
La interpretación,
hermenéutica y duda...

 - - - - - - - - - - - -
 
    All positions of this interface will be relative,
    just in case we need to resize it in the future

*/

//Visor
const globalMargin = 10;
let visorH = 65; // A percetange of the total height
let visorX, visorY, visorW;

//Intermitencia
const intermitenciaSize = 5;
const intermitenciaFreq = 150; // Modulo
let intermitenciaCont = 0;
let intermitenciaOn = false;

// Radar:
let radarSize;
let radarX, radarY, radarTLX;
let radarAngle, radarLimitAngle, radarAngleDeseo, radarLimitAngleDeseo;

// Text Bar
const textBarW = 4;
let textBarX, textBarY, textBarH;

// Squares
let squaresSize, squaresY, squaresW;
const sqRows = 2;
const sqCols = 5;
let sqCellW, sqCellH, sqCount;
let sqCellX = [];
let sqCellY = [];
let sqCellScale = [];
let sqCellFricc = [];
let squareCellStart = 0;

// Model Status
let modelY1, modelY2, modelW;
let modelAngle1 = 0;
let modelAngle2 = 0;

// Tops
let topsTotal = 10;
let topsX =[];
let topsRuido =[];
let topsVar =[];
let topsXDeseo =[];
let topsActivo = [];
let topsFixedTimer = 200;
let topsFixedTimerCont = 0;

// Horizontal Bar
let horzBarYTDeseo = 0;
let horzBarYT = 0;

// -------------------------------------------------------------
// -------------------------------------------------------------

function mostrarUI(){
    mostrarVisor();
    mostrarIntermitencia();
    mostrarRadar();
    mostrarTextModelBar();
    mostrarSquareGrid();
    mostrarSquareType();
    mostrarModelStatus();
    mostrarTops();
    mostrarEraseMarker();
    mostrarCruz();
}

// -------------------------------------------------------------
// -------------------------------------------------------------

function startUICoordinates(){
    
    // Como todo es relativo,
    // Iniciamos coordenadas en este sitio.
    
    //Visor
    visorX = globalMargin;
    visorY = globalMargin*2;
    visorW = width-globalMargin*2;
    visorH = height*(visorH/100);
    // Radar
    radarSize = height-(visorH+(globalMargin*4));
    radarX = width/2.4;
    radarY = height-globalMargin-(radarSize/2);
    radarTLX = radarSize/2;
    // Text Bar
    textBarX = radarX+(radarSize/2)+(globalMargin*2);
    textBarY = radarY;
    textBarH = radarSize;
    // Squares
    squaresSize = radarSize;
    squaresY = radarY-(radarSize/2);
    squaresW = width-(globalMargin*2.5)-squaresSize-textBarX-textBarW;
    // Square Grid
    sqCellW = squaresW/sqCols;
    sqCellH = squaresSize/sqRows;
    // Model
    modelY1 = radarY - radarSize/4;
    modelY2 = radarY + radarSize/4;
    modelW = radarX-(globalMargin*4);
    
    console.log("VISOR W: ", visorW);
    console.log("VISOR H: ", visorH);
    
} //- - - - - - - - - - - - -

function mostrarVisor(){
    noFill();
    stroke(0);
    strokeWeight(1);
    rectMode(CORNER);
    rect(visorX, visorY, visorW, visorH);
} //- - - - - - - - - - - - - - - - 

function mostrarIntermitencia(){
    
    // 1. Calculamos si mostramos o no
    intermitenciaCont++;
    if(intermitenciaCont > intermitenciaFreq/2){
        intermitenciaOn = true;
    }
    if(intermitenciaCont > intermitenciaFreq){
        intermitenciaCont = 0;
        intermitenciaOn = false;
    }
    // 2. Mostramos
    if(intermitenciaOn){
        stroke(0);
        strokeWeight(random(1, 1.5));
        // Top Left
        line(0, 0, 0+intermitenciaSize, 0);
        line(0, 0, 0, 0+intermitenciaSize);
        // Bottom Left
        line(0, height, 0+intermitenciaSize, height);
        line(0, height, 0, height-intermitenciaSize);
        // Top Right
        line(width, 0, width, 0+intermitenciaSize);
        line(width, 0, width-intermitenciaSize, 0);
        // Bottom Right
        line(width, height, width, height-intermitenciaSize);
        line(width, height, width-intermitenciaSize, height);
    }
    
} //- - - - - - - - - - - - 

function mostrarRadar(){

    // Center
    noFill();
    stroke(0);
    strokeWeight(random(1,2));
    ellipseMode(CENTER);
    ellipse(radarX, radarY, 1.5, 1.5);
    
    // Radar Perimeter
    strokeWeight(1);
    ellipse(radarX, radarY, radarSize, radarSize);
    
    // The Actual Counter
    radarAngle = friccion(radarAngle, radarAngleDeseo, 15, true);
    radarLimitAngle = friccion(radarLimitAngle, radarLimitAngleDeseo, 15, true);
    push();
        translate(radarX, radarY);
        rotate(radians(radarAngle));
        // Limit Angle
        push();
            rotate(radians(radarLimitAngle));
            stroke(0);
            strokeWeight(1);
            line(0, 0, radarSize/2, 0);
        pop();
        // The counter representation
        push();
            rotate(radians(map(tiempoCicloCont, 0, tiempoCiclo, 0, radarLimitAngle)));
            if(tiempoCicloCont==0){
                stroke(0);
                strokeWeight(0.5);
                drawX(radarSize/4, 0, 1.9)
            }else{
                fill(0);
                noStroke();
                ellipse(radarSize/4, 0, 2.3, 2.3);
            }
        pop();
    
    pop();
    
    // Lower indicator bar
    push();
        strokeWeight(0.1);
        translate(radarX-radarSize/2, height-globalMargin/2);
        //line(0, 0, radarSize, 0);
        strokeWeight(1);
        point(0,0);
        point(radarSize, 0);
        push();
            let vertIndicatorX = map(tiempoCicloCont, 0, tiempoCiclo, 0, radarSize);
            translate(vertIndicatorX, 0);
            line(0, -1.5, 0, 1.5);
        pop();
    pop();
    
} //- - - - - - - - - - - - - - - - 

function getNewRadarAngle(){
    radarAngleDeseo = random(360);
    radarLimitAngleDeseo = random(180,360);
} // - - - - - - - - - - - - - 

function mostrarTextModelBar(){
    
    // The Bar
    strokeWeight(1);
    stroke(0);
    rectMode(CENTER);
    rect(textBarX, textBarY, textBarW, textBarH);    
    
    // The Filling
    /*
    // At half, should be animated (the -10 value)
    noStroke();
    fill(255,0,0);
    rectMode(CORNER);
    rect(textBarX-textBarW/2, textBarY+textBarH/2, textBarW, -10);
    */
    
    // The Horizontal Bar Indicator
    horzBarYTDeseo = map(innerHTMLClock, 0, innerHTMLClockLimit, textBarY+textBarH/2, textBarY-textBarH/2);
    horzBarYT = friccion(horzBarYT, horzBarYTDeseo, 7, false);
    horzBarYT = friccion(horzBarYT, horzBarYTDeseo, 7, false);
    fill(255,0,0);
    fill(0);
    rectMode(CORNER);
    rect(textBarX-textBarW/2, horzBarYT, textBarW, 2);
    
    // THe Bottom Square
    rectMode(CENTER);
    stroke(0);
    point(textBarX, height-globalMargin/2);
    
    // The AutoScroll Timer (if Activated)
    let scrollYIndicator = map(autoScrollTimer, 0, autoScrollTimerLimit, 0, textBarH/2);
    stroke(0);
    fill(0);
    strokeWeight(1);
    push();
        translate(textBarX, textBarY);
        if(canIAutoScroll){
            point(-15, scrollYIndicator);
            ellipse(+7, -scrollYIndicator, 1.5, 1.5);
        }else{
            point(+10, -textBarH/2);
        }
        // THe Current outputs:
        for(let i=0; i<currentCycleOutputs; i++){
            point(-10, textBarH/2 - 5*i);
        }
    
    pop();
        
} //- - - - - - - - - - - - -

// This is a square with rows, one per item (max of 10)

function resetSquareCells(){
    // New starting position (for the cocoResults)
    squareCellStart = floor(random(sqRows*sqCols));
    
    // Resetting Scale
    for(let i = 0; i < sqRows*sqCols; i++){
        sqCellScale[i] = 0;
        sqCellFricc[i] = random(5, 25);
    }
    
    // Calculating the X and Y
    sqCount = 0;
    for(let i = 0; i < sqRows; i++){
        for(let j = 0; j < sqCols; j++){            
            //
            sqCellY[sqCount] = ( sqCellH * i )+ sqCellH/2;
            sqCellX[sqCount] = ( sqCellW * j )+sqCellW/2;
            //showSquareCell(sqCount, sqCellX, sqCellY);
            sqCount++;
        }
    }
} //- - - - - - - - - - - - - - -

function mostrarSquareGrid(){
    // 1. Origin Change to the TL corner
    push();
    translate(textBarX+(textBarW/2)+globalMargin, squaresY);
    
    // 2. Showing the Square
    noFill();
    stroke(0);
    rectMode(CORNER);
    //rect(0, 0, squaresW, squaresSize);
    
    // 3. Showing the Cells
    for(let i = 0; i < sqCount; i++){
        showSquareCell(i, sqCellX[i], sqCellY[i]);
    }
    
    // 4. We go one by one 
    if(cicloHaTerminado){
        let posT = squareCellStart;
        for(let j = 0; j < sqRows*sqCols; j++){
            
            // We only draw something if we have a result
            if(j < cocoTotals){
                sqCellScale[posT] = friccion(sqCellScale[posT],1,sqCellFricc[posT],false);
                // Drawing the ellipse or a Cross
                let circSizeT = 0;
                if(cocoObjectsTxt[j].label == "person"){
                   circSizeT = 3 * sqCellScale[posT]; 
                    stroke(0);
                    strokeWeight(1);
                    noFill();
                    drawX(sqCellX[posT], sqCellY[posT], circSizeT);
                }else{
                    fill(0);
                    noStroke();
                    circSizeT = 4.5 * sqCellScale[posT];
                    ellipse(sqCellX[posT], sqCellY[posT], circSizeT, circSizeT);
                }
                
                //ellipse(0, 0, 25, 25);
            }

            // Increasing the Array position
            posT++;
            if(posT >= sqRows*sqCols) posT= 0;
        }
    }
    pop();
    
} //- - - - - - - - - - - - - -

function showSquareCell(pos, sqX, sqY){
        
    // We draw the center
    push();
        translate(sqX, sqY);
        stroke(0);
        strokeWeight(1);
        point(0, 0);
    pop();
    
    
} //- - - - - - - - -

// This is the square that says which type of drawing is sent
// to the Atlas, el mapa, el registro, testimonio

function mostrarSquareType(){
    
    // 1. Origin Change to the TL corner
    push();
    translate(globalMargin+visorW-squaresSize, squaresY);
    
    // 2. Showing the Square
    noFill();
    stroke(0);
    rectMode(CORNER);
    //rect(0, 0, squaresSize, squaresSize);
    
    // 3. Showing the corners
    strokeWeight(0.5);
    if(random(100)>93.8) ellipse(0, 0, 1.5, 1.5);
    if(random(100)>93.8) ellipse(0, squaresSize, 1.01, 1.01);
    if(random(100)>93.8) ellipse(squaresSize, 0, 1.01, 1.01);
    if(random(100)>93.8) ellipse(squaresSize, squaresSize, 1.01, 1.01);
    
    // 4. Showing cross 
    if(!cicloHaTerminado){
        stroke(0);
        strokeWeight(1);
        push();
        translate(squaresSize/2, squaresSize/2);
        scale(0.5);
        rotate(radians(45));
        line(-squaresSize/2, 0, squaresSize/2, 0);
        rotate(radians(-90));
        line(-squaresSize/2, 0, squaresSize/2, 0);
        pop();
    }
    // 5. Showing Text Data
    if(cicloHaTerminado){
        /*Here the text information/label
        Must be replaced with whatever
        <HTML> model the program chose to output
        */
        push();
            translate(squaresSize/2, squaresSize/2);
            noStroke();
            fill(0);
            textAlign(CENTER, CENTER);
            textFont("Share Tech Mono");
            textSize(17);
            //text("A", 0, 0);
            text(outputTipos[outputActual], 0, 0);
        pop();
    }
    
    pop();
    
} //- - - - - - - - - - - - - -

function mostrarModelStatus(){
    // Coordinate operations
    push();
    translate(globalMargin, 0);
    
    // Model A. (Image-related)
    stroke(0);
    strokeWeight(0.15);
    line(modelW/2, modelY1, modelW, modelY1);
    // Model A. Loading Model Data
    if(readyToDraw){
       push();
            strokeWeight(1.5);
            strokeCap(SQUARE);
            translate(modelW, modelY1);
            modelAngle1 += 5;
            if(!cicloHaTerminado) rotate(radians(modelAngle1));
            line(-2.5, 0, 2.5, 0);
        pop();
    }else{
        stroke(0);
        strokeWeight(1);
        drawX(modelW, modelY1, 2.5, 2.5); 
    }
    
    // Model A. Model Loaded
    if(detectionModelStatus){
        fill(0);
        ellipse(modelW-modelW/4, modelY1, 2.5, 2.5);
    }else{
        noFill();
        stroke(0);
        strokeWeight(1);
        drawX(modelW-modelW/4, modelY1, 2.5, 2.5);    
    }

    // Model A. Text
    fill(0);
    noStroke();
    textFont("Share Tech Mono");
    textSize(6);
    textAlign(LEFT, CENTER);
    text("SURVEILLANCE:", 0, modelY1);
    
    
    // Model B. (Text-related)
    stroke(0);
    strokeWeight(0.15);
    line(modelW/2, modelY2, modelW, modelY2);
    // Model B. Loading Model Data
    if(charRNNLoaded){
        push();
        strokeWeight(1.5);
        translate(modelW, modelY2);
        modelAngle2 += 6.1;
        if(charRNNModelAtWork) rotate(radians(modelAngle2));
        line(-2.5, 0, 2.5, 0);
        pop();
    }else{
        noFill();
        stroke(0);
        strokeWeight(1);
        drawX(modelW, modelY2, 2.5, 2.5);
    }
    // Model B. Model Loaded
    if(charRNNLoaded){
        fill(0);
        ellipse(modelW-modelW/4, modelY2, 2.5, 2.5);
    }else{
        noFill();
        stroke(0);
        strokeWeight(1);
        drawX(modelW-modelW/4, modelY2, 2.5, 2.5); 
    }
    
    // Model B. Text
    fill(0);
    noStroke();
    text("TXT DATA SET:", 0, modelY2);
    
    // Now the image indicator
    
    pop();
    
    
} //- - - - - - - - - - - - - -

function iniciarTops(){
    for(let i = 0; i < topsTotal; i++){
        topsX[i] = 0;
        topsRuido[i] = random(0.0001, 0.001);
        topsVar[i] = random(100);
        topsXDeseo[i] = 0;
        topsActivo[i] = false;
    }
} //- - - - - - - - - - - - - - - - - 

function mostrarTops(){
    // 1. Translation operations
    push();
    translate(globalMargin, globalMargin);
    
    // 2. We show the Top Indicators
    for(let i = 0; i < topsTotal; i++){
        // Here I would need to choose to go to the noise Psition
        // or to a desired fixed location (ML results)
        // Noise Calculations
        if(topsFixedTimerCont > topsFixedTimer){
            topsVar[i] += topsRuido[i];
            topsXDeseo[i] = noise(topsVar[i]) * visorW; 
            resetTopActivos();
        }
        topsX[i] = topsXDeseo[i]; // Sustituir por una friccion function

        // We show the line
        stroke(0);
        strokeWeight(random(0.6));
        if(topsActivo[i]){
          //line(topsX[i], globalMargin/2, topsX[i], globalMargin);  
            rect(topsX[i], globalMargin, 2.5, 2.5);
        } 
        strokeWeight(1);
        point(topsX[i], globalMargin/2);
        // point(topsX[i], 0);
        
        // We shoe the ellipse
        fill(0);
        noStroke();
        // rect(topsX[i], globalMargin, 0.5, 0.5);
      
    }
    pop();
    
    topsFixedTimerCont++;
} //- - - - - - - - - - - - - - - - - 

function resetTopActivos(){
     for(let i = 0; i < topsTotal; i++){
         topsActivo[i] = false;
     }
} //- - - - - - - - - - - - - - - 

function drawX(xX, xY, xSize){
    push();
        translate(xX, xY);
        line(-xSize, -xSize, +xSize, +xSize);
        line(+xSize, -xSize, -xSize, +xSize);
    pop();
} //- - - - - - - - - - - - - - 

function mostrarEraseMarker(){
    
    // The record-like button marker on Top:
    
    if(eraseTimerActive && eraseCounter%65 > 32.5){
        
        if(eraseCounter > eraseCounterMax/2){
            fill(255,0,0);
        }else{
            fill(0);
        }
        noStroke();
        rectMode(CENTER);
        //ellipse(width -globalMargin -2, 12, 5, 5);
        ellipse(globalMargin+visorW -2, 12, 5, 5);
        
    }
    
    // The Short Lines
    let htmlCountAjustado = constrain(htmlCount, 2, 35);
    if(eraseTimerActive){
        for(let i=0; i<htmlCountAjustado; i++){
            let j = map(eraseCounter, 0, eraseCounterMax, 0, htmlCountAjustado);
            
                let yT = (visorH/(htmlCountAjustado+1)) * (i+1);
                yT = visorY+visorH-yT;
                stroke(0);
                strokeCap(SQUARE);
                if(i < j){
                    strokeWeight(2.5);
                }else{
                    strokeWeight(0.25);
                }
                line(globalMargin/2, yT, globalMargin, yT);
                line(globalMargin+visorW, yT, globalMargin+visorW+(globalMargin/2), yT);
        }
    }
    
} //- - - - - - - - - - - - - -

function mostrarCruz(){
        /*
        No results? Show Cruz X (tache)
        */
    if(cocoTotals <= 0 && cocoTLX >= visorW){
        stroke(0);
        strokeWeight(random(0.25, 1));
        line(visorX, visorY, visorX+visorW, visorY+visorH);
        line(visorX, visorY+visorH, visorX+visorW, visorY);
    }
} //- - - - - - - - - - - - - - - - -

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// - - - UTILITIES - - - - - - - - - - - - - - - - - - - - - - - 

function friccion(val1, val2, coeficiente, igualar){
    /*
    val1 = current
    val2 = desired
    coeficiente = friction value / 
    igualar = 
    */
    // A. Interval check
    let interval = 0;
    if(val1 > val2) interval = val1-val2;
    if(val2 > val1) interval = val2-val1;
    // 
    //
    // B. New point
    interval /= coeficiente;
    
    let newVal = 0.0;
    if(val1 > val2) newVal = val1-interval;
    if(val2 > val1) newVal = val1+interval;
    
    // C. Exception when too small
    if(interval < 0.01 && igualar) newVal = val2; 
    
    return newVal;
}

// ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓
// Taken from the Radical Listening Project
// http://www.jmescalante.info/?&projectNo=radical_listening

function drawCross(x1, y1, cSize){
    
    push();
    translate(x1, y1);

        if(random(10)>1){ // Horizontal Line
            line(0, 0, -cSize, 0);
            line(0, 0, cSize, 0);      
        }
        if(random(10)>1){ // Top Line
            line(0, 0, 0, -cSize);
            line(0, 0, 0, cSize);
        }
    
    pop();
    
}