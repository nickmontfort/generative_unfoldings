// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ HTML OUTPUT ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
/*
    This is the file that builds the map on the wepage
    A trace. Un residuo o testimonio.
*/


// This is the <div> that will hold everything
// (easier to erase upon any window resizing event)
const theMap = document.getElementById('theMap');
const thePage = document.getElementById('bookPageText');
const thePage2 = document.getElementById('bookPageSaverPage2');
const thePage3 = document.getElementById('bookPageSaverPage3');
const thePage4 = document.getElementById('bookPageSaverPage4');
const thePage5 = document.getElementById('bookPageSaverPage5');
const thePage6 = document.getElementById('bookPageSaverPage6');
const thePage7 = document.getElementById('bookPageSaverPage7');
const thePage8 = document.getElementById('bookPageSaverPage8');
const naveganteCrossA = document.getElementById('naveganteCrossA');
const naveganteCrossB = document.getElementById('naveganteCrossB');
const naveganteCrossC = document.getElementById('naveganteCrossC');
const lowerIndicator1 = document.getElementById('lowerIndicator1');
const lowerIndicator2 = document.getElementById('lowerIndicator2');
const lowerIndicator3 = document.getElementById('lowerIndicator3');
const humanCounter = document.getElementById('humanCount'); 
const humanCifraActual = document.getElementById('cifra'); 
const humanCifraTotal = document.getElementById('cifraTotal'); 
const lowerSquareIndicator = document.getElementById('lowerSquareIndicator');
const loadingRuler = document.getElementById('loadingRuler');
const loadingMessageText = document.getElementById('loadingMessage');
const bookMessageText = document.getElementById('bookMessageText');
const bookPageMainContainer = document.getElementById('bookPageMainContainer');
const canvasBookPageIn = document.getElementById('canvasBookPageIn');
const bookPageSaverPage = document.getElementById('bookPageSaverPage');
const bookPageInfoContainer = document.getElementById('bookPageInfoContainer');
const bookPageIntel = document.getElementById('bookPageIntel');
const bookSeedIntel = document.getElementById('bookSeedIntel');
const bookProgressIntel = document.getElementById('bookProgressIntel');
const bookPageTopRightElement = document.getElementById('bookPageTopRightElement');
const bookPageTopLeftElement = document.getElementById('bookPageTopLeftElement');
const bookPageBottomRightElement = document.getElementById('bookPageBottomRightElement');
const bookPageBottomLeftElement = document.getElementById('bookPageBottomLeftElement');
const flexButtons = document.getElementById('flexButtons');
const soundButtonNo = document.getElementById('soundButtonNo');
const soundButtonYes = document.getElementById('soundButtonYes');
const canvasTopLayerContainer = document.getElementById('canvasTopLayerContainer');
const canvasDivContainer = document.getElementById('canvasDivContainer');
const virilioMainContainer = document.getElementById('centerPoetry');
const centerPoetryInnerContainer =document.getElementById('centerPoetryInnerContainer');
const virilioContainer = document.getElementById('centerPoetryText');
const closeButton = document.getElementById('closeButton');
const aboutContainer = document.getElementById('aboutContainer');
const aboutButton = document.getElementById('aboutButton');
const scrollButton = document.getElementById('scrollButton');
const navDiv = document.getElementById('navDiv');
const fixedContador = document.getElementById('contadorIntel');
const fixedContadorContainer = document.getElementById('contadorIntelContainer');


let currentIndicator = 1;
const outputTipos = ["S", "A"];
/*
    S   =   Single just the dots
    A   =   Traditional Ascii
    
    */
let outputActual = 0;
let htmlCount = 0;

let humanCountCounterLimit = 250;
let humanCountCounter = humanCountCounterLimit;

// Inner outputClock
let currentCycleOutputs = 0;
const innerHTMLClockEnabled = true;
let innerHTMLClockLimit = 175;
let innerHTMLClock = 0;

// Scrolling related variables
let userWindowHeight = 0;
let webPageHeight = 2500; // Tmeporary starting value
let currentScrollY = 0;

//HTML Animations
let naveganteStartX = 50;// A percentage
let naveganteStartY = 50;// A percentage
let naveganteStartXDeseo = 50;// A percentage
let naveganteStartYDeseo = 50;// A percentage
let naveganteCuadranteActual = 1;
let topCrossDeseoX = 0;
let topCrossX = 0;
const topCrossElement = document.getElementById('topCross');

// HTML Output
let posibilidadDeVictimMarker = 99.9;
const singleBoxWMin = 45;
let singleBoxWMax = 450; // This changes accordingly to the browser window
let singleBoxW, singleBoxH;
let singleDate;

// VIRILIO POETRY
let virilioLoaded = false;
let virilioLoading = false;
let currentGlobalVirilio = 0;
let totalGlobalVirilio = 61;
let virilioWords = [];
let virilioInLines = [];
let virilioWordsTotal = 0;
let virilioBlinkTotalLimit = 1850;
let virilioBlinkLimit = 450;
let virilioBlink = 0;
let counterVirilioLimit = 100; // 50 seems to work
let counterVirilio = 0;
let currentVirilioText = "P.S.A.A.";
let virilioCurrentArrayPoint = 2;
let wordsPerPhraseMin = 5;
let wordsPerPhraseMax = 8;

// Auto Scroll
let autoScrollActive = true; // GLobal Variable that allows the Auto-Scrolling
let canIAutoScroll = false;
let animatedScroll = true; // Controls whether there will be friction on the scrolling
const scaleToAllowScroll = 1.5; // This means that once the page is X times the innerHeight, then we AutoSCROLL!
let autoScrollTimerLimit = 170;
let autoScrollTimer = 0;
let scrollYCurrent = 0;
let scrollYDeseo = 0;
let scrollFriction = 22;

// Auto Erase
let autoErase = true;
let eraseSizeLimit = 4.5; // This means X times the Window Height
let eraseTimerActive = false;
let eraseCounter = 0;
let eraseCounterMax = 451;

// Place HTML in Page (book Mode)
let pageLayer = 1;
let pageLayerTotals = 7;
let placedInLayer = 0;
let placedInLayerTotals = 0;
let placeInLayerLimit = 70; // The maximum items per layer

// console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  JS file loaded");

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function newHTMLOutput(){
    // 0. Feedback
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  New output requested");
    currentCycleOutputs++;
    console.log("▒▒▒▒▒ Current CYCLE ▒▒▒▒ >>", currentCycleOutputs);
    
    // 1. Choosing a new output
    outputActual = floor(random(outputTipos.length));
    // outputActual = 2; // BORRAR --- temporal para probar alguno en específico
    
    // 2. Generating the output
    if(outputActual == 0){ // -------- S = Single
        singleHTMLOutput();
    }else if(outputActual == 1){ //--- A = Traditional
        traditionalHTMLOutput();
    }
    
    // 3. Huge Subtle Map
    if(random(10)>7){
       hugeSubtleMap();
    }
    
    // 4. We scroll to the bottom ONLY IF IT IS THE FIRST OUTPUT:
    // window.scrollTo(0,document.body.scrollHeight); // Original version, now replaced with our AutoScroll system
    if(currentCycleOutputs < 2) getNewScrollingPoint(true);
    
    // 5. Update Indicador (fixed) contador
    updateFixedContador();
    
    // 6. Increasing the lower indicator
    currentIndicator++;
    if(currentIndicator>3) currentIndicator = 1;
    
    // 7. We increase the HTML count
    htmlCount++;
    
    // 8. We reset the Inner HTML Clock (For if the flies)
    innerHTMLClock = 0;
    
    // 9. PLaying a sound
    playNotonTone( "html" );
}

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

/* This is an important function that will control the HTML animation flow,
    constantly called during the draw */

function updateHTML(){
    updateHTMLTopCross();
    updateHTMLNaveganteCross();
    updateLowerIndicators();
    morseCodeMarker();
    updateHTMLHumanCounter();
    lowerSquareIndicatorDisplay();
    if(systemON) checkInnerHTMLClock();
    if(autoErase) checkEraseTimer();
    updateVirilio();
    if(autoScrollActive && !bookMode) checkAutoScroll();
}

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

/*
This function was later implemented to allow for a faster HTML page population...
*/
function checkInnerHTMLClock(){

    if(innerHTMLClock >= innerHTMLClockLimit && cicloHaTerminado){
        
        // ----- New Cycle!!!! ---- 
        // 1. Time operations
        innerHTMLClock = 0;
        autoScrollTimer = 0;
        
        // 2. HTML Output
        
        if(bookMode){
            // A. Multiple Page filling files
            for(let i=0; i<5 && page<4; i++){
                newHTMLOutput();
            }
        }else{
            // B. Classic
           newHTMLOutput(); 
        }
        
    }else if(cicloHaTerminado){
        
        // 3. The HTML clock keeps increasing
        innerHTMLClock++;
    }
    
}

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ SOUND SELECTION AND OTHER BUTTONS (and others)
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

// SOUND SELECTION BUTTONS
soundButtonNo.addEventListener("click", function(){
    console.log(">> No Sound thanks!!! :(");
    
    // startSoundEngineForReals(); // No need to start the sound engine if sound is OFF
    soundStarted = false;
    soundIsOn = false;
    userSelectedSound = true;  
    canvasTopLayerContainer.style.display = "none";
});

soundButtonYes.addEventListener("click", function(){
    console.log(">> Sound ON! :) :)");
    
    startSoundEngineForReals();
    soundStarted = true;
    soundIsOn = true;
    userSelectedSound = true;  
    canvasTopLayerContainer.style.display = "none";
});

closeButton.addEventListener("click", function(){
    aboutContainer.style.display = "none";
});

aboutButton.addEventListener("click", function(){
    aboutContainer.style.display = "block";
});

scrollButton.addEventListener("click", function(){
    if(autoScrollActive){
        // It is active, we switch it off
        autoScrollActive = false;
        scrollButton.innerHTML = "AutoScroll: OFF";
    }else{
        // It is off, we switch it back ON!
        autoScrollActive = true;
        scrollButton.innerHTML = "AutoScroll: ON";
    }
})

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ HTML ANIMATIONS
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

/*
const tiempoCiclo = 500;
let tiempoCicloCont = 0;
*/
function resetNavegante(){
    naveganteStartX = floor(random(100));
    naveganteStartY = floor(random(100));
    if(naveganteStartX<50 && naveganteStartY<50) naveganteCuadranteActual = 1;
    if(naveganteStartX>50 && naveganteStartY<50) naveganteCuadranteActual = 2;
    if(naveganteStartX<50 && naveganteStartY>50) naveganteCuadranteActual = 3;
    if(naveganteStartX>50 && naveganteStartY>50) naveganteCuadranteActual = 4;
    naveganteStartXDeseo = naveganteStartX;
    naveganteStartYDeseo = naveganteStartY;
}

function updateHTMLNaveganteCross(){
    let descuentoX = map(tiempoCicloCont, 0, tiempoCiclo, 0, 40); // 40% max
    let descuentoY = map(tiempoCicloCont, 0, tiempoCiclo, 0, 40); // 40% max
    if(naveganteCuadranteActual == 1){
        naveganteStartX = naveganteStartXDeseo+descuentoX;
        naveganteStartY = naveganteStartYDeseo+descuentoY;
    }else if(naveganteCuadranteActual == 2){
        naveganteStartX = naveganteStartXDeseo-descuentoX;
        naveganteStartY = naveganteStartYDeseo+descuentoY;
             
    }else if(naveganteCuadranteActual == 3){
        naveganteStartX = naveganteStartXDeseo+descuentoX;
        naveganteStartY = naveganteStartYDeseo-descuentoY;
        
    }else if(naveganteCuadranteActual == 4){
        naveganteStartX = naveganteStartXDeseo-descuentoX;
        naveganteStartY = naveganteStartYDeseo-descuentoY;
             
    }
    naveganteCrossA.style.left = naveganteStartX+"%";
    naveganteCrossA.style.top = naveganteStartY+"%";
    naveganteCrossB.style.left = naveganteStartY/2+"%";
    naveganteCrossB.style.top = naveganteStartX+"%";
    naveganteCrossC.style.left = naveganteStartX/2+"%";
    naveganteCrossC.style.top = naveganteStartY/10+"%";
    
}

function updateFixedContador(){
    let newText = ". ";
    for(let i=0; i<htmlCount; i++){
        newText += ". ";
    }
    fixedContador.innerHTML = newText;
}

// ******************************************  


function updateHTMLTopCross(){
    topCrossX = friccion(topCrossX, topCrossDeseoX, 7, true);
    topCrossElement.style.left = floor(topCrossX)+'px';
}

function updateLowerIndicators(){
    
    // Changing the indicators' position
    if(currentIndicator == 1) lowerIndicator1.style.left = floor(topCrossDeseoX)+'px';
    if(currentIndicator == 2) lowerIndicator2.style.left = floor(topCrossDeseoX)+'px';
    if(currentIndicator == 3) lowerIndicator3.style.left = floor(topCrossDeseoX)+'px';
    
}

function updateHTMLHumanCounter(){
    // 1. Counter operations
    humanCountCounter++;
    
    // 2. Content OPerations
    humanCifraActual.innerHTML = currentHumanCount;
    humanCifraTotal.innerHTML = totalHumanCount;
    
    // 3. Display OPerations
    if(humanCountCounter < humanCountCounterLimit || bookMode){
        humanCounter.style.visibility = "visible";
        humanCounter.style.opacity = "1";
    }else{
        //humanCounter.style.visibility = "hidden";
        humanCounter.style.opacity = "0";
    }  
}

function lowerSquareIndicatorDisplay(){
    if(!intermitenciaOn){
        lowerSquareIndicator.style.display = "block";
    }else{
        lowerSquareIndicator.style.display = "none";
    }
    
}
    

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ MINI HTML OUTPUT ----> x Morse Code Markers
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
/*
This function adds randomly a new Morse Code marker
It follows the model below:

        <div class='victimMarker'>
            <h3>x</h3>
            <marquee>.--. .... --- - --- --. .-. .- .--. .... . .-.</marquee>
        </div>

*/

function morseCodeMarker(){
    if(random(100)>posibilidadDeVictimMarker){
        // 1. Initial Settings
        let victimCharacters = ["x", "-", "!", "^"];
        let victimCharacter = victimCharacters[floor(random(victimCharacters.length))];

        let includeMorseCode = true;
        if(random(10)>8) includeMorseCode = false;
        let availableMorseCodes = [
            /* Victim */"...- .. -.-. - .. --",
            /* Student */"... - ..- -.. . -. -",
            /* Civilian */"-.-. .. ...- .. .-.. .. .- -.",
            /* Innocent */".. -. -. --- -.-. . -. -",
            /* Journalist */".--- --- ..- .-. -. .- .-.. .. ... -",
            /* Photographer*/".--. .... --- - --- --. .-. .- .--. .... . .-."  
        ];
        let morseCodeCharacters = availableMorseCodes[floor(random(availableMorseCodes.length))];

        // 2. Main Container
        let victimDiv = document.createElement("div"); 
        victimDiv.className = 'victimMarker';
        victimDiv.style.width = floor(random(10, 100));
        
        // 3. Random Position
        victimDiv.style.left = floor(random(windowWidth))+"px";
        victimDiv.style.top = floor(random(-250, 250))+"px";

        // 4. H3 Container
        let markerDiv = document.createElement("h3");
        markerDiv.innerHTML = victimCharacter;
        victimDiv.appendChild(markerDiv);

        // 5. Morse Code
        if(includeMorseCode){
            let morseTag = document.createElement("marquee");
            morseTag.innerHTML = morseCodeCharacters;
            victimDiv.appendChild(morseTag);
        }
        
        // 6. Optional Bottom Containeer
        if(random(10)<9){
            let markerDivB = document.createElement("h3");
            markerDivB.innerHTML = "–";
            victimDiv.appendChild(markerDivB);
        }

        placeInPage(victimDiv);

    } 
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ HTML OUTPUT ----> S (single dots)
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉


function singleHTMLOutput(){
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  SINGLE output chosen");
    
    // 0. The "_" character on the right
    let leftSlash = document.createElement("P"); 
    leftSlash.className = 'annotation';
    singleDate = new Date();
    let seconds = singleDate.getSeconds();
    let minutes = singleDate.getMinutes();
    let hour = singleDate.getHours();
    leftSlash.innerHTML = "_ "+hour+':'+minutes+":"+seconds;
    
    // 1. Append
    if(bookMode) leftSlash.style.marginLeft = "350px";
    placeInPage(leftSlash);
    
    // 2. The "_" character on the left
    let rightSlash = document.createElement("P"); 
    rightSlash.className = 'annotation';
    rightSlash.innerHTML = htmlCount+ "– ";
    rightSlash.style.position = 'absolute';
    rightSlash.style.right = 0+'px';
    rightSlash.textAlign = 'right';
    
    // 3. Append
    if(bookMode){
        rightSlash.style.textAlign = "right";
        rightSlash.style.position = 'relative';
        rightSlash.style.right = "350px"; 
    }
    placeInPage(rightSlash);

    
    // 4. We pick a new size for our box
    singleBoxWMax = windowWidth/3;
    singleBoxW = floor(random(singleBoxWMin, singleBoxWMax));
    singleBoxH = floor(cocoImg.height*singleBoxW/cocoImg.width);
    
    
    // 5. We create the new Box object
    let newBox = document.createElement("div"); 
    newBox.className = 'lilCircleBox';
    newBox.style.width = singleBoxW+'px';
    newBox.style.height = singleBoxH+'px';
    if(random(10)>8){
      newBox.style.borderColor = greenT;  
    } else{
        if(random(10>5)){
            newBox.style.borderLeftColor = greenT;  
            newBox.style.borderRightColor = greenT;
            if(random(10)>7)newBox.style.borderTopColor = greenT;  
            if(random(10)>7)newBox.style.borderBottomColor = greenT;  
        }
    }
    if(random(10)>7){
        newBox.style.backgroundColor = greenT;
    }
    
    // 6. We set the margin randomly
    let despLeft = floor(random(25, windowWidth/3*2));
    if(bookMode) despLeft = floor(random(25, 2412/3*2));
    topCrossDeseoX = despLeft;
    newBox.style.left = despLeft+'px';
    let despTop = 0;
    if(htmlCount > 5){
        despTop = floor(random(-150, 50))+'px';
    }else{
        despTop = floor(random(0, 150))+'px';
    }
    newBox.style.top = despTop;
    
    // 7. Creating the detected objects
    for(let i=0; i<cocoTotals; i++){
        //let aDot = document.createElement("div"); 
        let aDot = document.createElement("p"); 
        aDot.innerHTML = ".";
        aDot.className = 'lilCircle';
        let xT = map(cocoObjectsTxt[i].x, 0, cocoImg.width, 0, singleBoxW);
        let yT = map(cocoObjectsTxt[i].y, 0, cocoImg.height, 0, singleBoxH);
        if(cocoObjectsTxt[i].label != "person"){
            aDot.style.backgroundColor = 'black';
            aDot.style.width = random(2,25)+'px';
        }else{
            aDot.style.backgroundColor = 'white';
        } 
        aDot.style.marginLeft = xT+'px';
        aDot.style.top = yT+'px';
        newBox.appendChild(aDot);
    }
    
        
    // 8. We append it to the final document
    placeInPage(newBox);

    
    // 9. The Comment Box: creation and coordinates
    let commentBox = document.createElement("div"); 
    commentBox.className = 'lilCircleBoxComments'; // .id = "someID";
    commentBox.style.width = singleBoxW*1.25+'px';
    commentBox.style.left = despLeft+'px';
    commentBox.style.top = despTop;
    
    // 10. The comments
    let commentsInTheBox = document.createElement("div"); 
    commentsInTheBox.className =  'commentsInTheBox';
    
    // 11. The CommentBox Info: Title
    let resultsTitle = document.createElement("h1");
    resultsTitle.innerHTML= "RESULTS: ";
    commentsInTheBox.appendChild(resultsTitle);
    
    if(random(10)>5){
        // The CommentBox Info: Text
        let commentText = document.createElement("p");
        commentText.className = 'charTextComment';
        // commentText.innerHTML = charRNNStarterWords+currentCharRNN;
        commentText.innerHTML = currentCharRNN;
        commentsInTheBox.appendChild(commentText);
        // Since we already used this comment, we get a new text: 
        generateNewText();
    }else{
        for(let i=0; i<cocoTotals; i++){
            let commentText = document.createElement("p");
            commentText.className = 'charTextComment';
            commentText.style.fontSize = '3px';
            commentText.style.marginLeft = singleBoxW/2 + 'px';
            commentText.innerHTML = "subject #"+i+" x["+floor(cocoObjectsTxt[i].x)+'] y: '+floor(cocoObjectsTxt[i].y)+']';
            commentsInTheBox.appendChild(commentText);
        }
    }
    
    // 12. The Comment Box: append
    commentBox.appendChild(commentsInTheBox);
    placeInPage(commentBox);
    
    if(bookMode){
       // Mensaje to the right (bonus)
        let morseTestTest = document.createElement("p");
        morseTestTest.className = "bookPageTextAnnotation";
        let morseMensajeBook  = "-----";
        let randomSlashes = random(5, 20);
        for(let i=0; i<randomSlashes; i++) morseMensajeBook += "-";
        morseMensajeBook += "Location {x} = "+random(int(seed));
        morseTestTest.innerHTML = morseMensajeBook;
        morseTestTest.style.fontSize = "10px"; 
        placeInPage(morseTestTest); 
    }
    
    // 13. Horizontal Ruler at random
    if(random(100)>90){
        let theHr = document.createElement("div"); 
        theHr.className = 'mapSubtleHr';
        
        placeInPage(theHr);

    }
    
    
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ HTML OUTPUT ----> A (traditional Asciii pic)
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function traditionalHTMLOutput(){
    // -1. Feedback
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  TRADITIONAL ascii output chosen");
    
    // 0. Boolean switches
    let distorsionAscii = false;
    if(random(10)>3) distorsionAscii = true;
    let sustitucionDeDots = false;
    if(random(10)>7) sustitucionDeDots = true;
    let availableDots = ["·", ".", "-", "/", "`"];
    let theDotThisTime = availableDots[floor(random(availableDots.length))];
    let invertedWhites = false;
    if(random(10)>8) invertedWhites = true;
    let lineaFinalAscii = true;
    
    // 1. Main Data from the Glyph Array
    let glyphsCols = ascii_arr.length;
    let glyphsRows = ascii_arr[0].length;
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Glyphs cols: ", glyphsCols);
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Glyphs cols: ", glyphsRows);
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Windowdidth: ", windowWidth);
    
    
    // 2. Height and Width
    let destinationWMax = 250;
    let destinationHMax = 150;
    let destinationWMin = 35;
    let destinationHMin = 21;
    let colsMax = 64;
    let colsMin = 11;
    let rowsMax = 29;
    let rowsMin = 6;
    
    let textSizeMax = 7.5;
    let textSizeMin = 6.5;
    let lineHeightMax = 85;
    let lineHeightMin = 62;
    
    let desplazamientoLeft = floor(random(windowWidth/10, windowWidth/3 * 2));
    if(bookMode) desplazamientoLeft = floor(random(2412/10, 2412/3 * 2));
    topCrossDeseoX = desplazamientoLeft;
    
    // 3. Getting a new random size
    let destinationWidth = random(destinationWMin, destinationWMax); // This must be dynamically calculated ...
    let destinationHeight = destinationWidth*150/250; // This must be dynamically calculated ...

    
    // 4. The main HTML Container
    let theBox = document.createElement("div"); 
    theBox.className = "lilCircleBox";
    theBox.style.width = destinationWidth+"px";
    theBox.style.height = destinationHeight+"px";
    theBox.style.left = desplazamientoLeft+"px";
    if(random(100)>20) theBox.style.borderColor = greenT;

    
    // 5. Creating the <div> that will hold all the <p class="flexRow"> rows
    let glyphDiv = document.createElement('div'); // Creating the <div>
    glyphDiv.className = 'flexCell';
    
    
    // 6. Setting the Paragraph Tag size
    let newTextSize = map(destinationWidth, destinationWMin, destinationWMax, textSizeMin, textSizeMax);
    let newLineHeight = map(destinationWidth, destinationWMin, destinationWMax, lineHeightMin, lineHeightMax);
    
    // 7. New row calculation
    let newCols = floor(map(destinationWidth, destinationWMin, destinationWMax, colsMin, colsMax));
    let newRows = floor(map(destinationHeight, destinationHMin, destinationHMax, rowsMin, rowsMax));
    
    
    for(let i = 0; i < newRows; i++){
        
        let glyphChar = document.createElement("P");
        glyphChar.style.lineHeight = newLineHeight+"%";
        glyphChar.style.fontSize = newTextSize+"px";
        let rowText = "";
        
        for(let j = 0; j < newCols; j++){
             
            // We add the Glyph Character (need to do some magic here)
            let desiredCol  = floor(map(j, 0, newCols, 0, glyphsCols));
            let desiredRow  = floor(map(i, 0, newRows, 0, glyphsRows));
            let characterToPlace = ascii_arr[desiredCol][desiredRow];  
            
            
            // Sustitucion de Dots
            if(sustitucionDeDots && characterToPlace != " " && !invertedWhites){
               characterToPlace = theDotThisTime; 
            }
            
            // Inverted Whites
            if(invertedWhites){
                if(characterToPlace == " "){
                   characterToPlace = "o"; 
                }else{
                   characterToPlace = " "; 
                }    
            }
            
            // Probabilidad orilla
            if(j < newCols/4 && distorsionAscii){
               if(random(10)>4) characterToPlace = " "; 
            }else if(j > (newCols/4 * 3) && distorsionAscii){
                if(random(10)>4) characterToPlace = " "; 
            }else if(i < newRows/4){
                if(random(10)>3) characterToPlace = " ";     
            }else if(i > newRows/4 * 3){
                if(random(10)>4) characterToPlace = " ";     
            }
            
            //Checar si hay un invidivuo ahi
            if(checarIndividuo(j, i, newCols, newRows)){
                characterToPlace = "▉";
            }
            
            rowText += characterToPlace;
            
        }
        
        // Appending content
        glyphChar.innerText = rowText;
        glyphDiv.appendChild(glyphChar);
        
    }
    
    // 8. A final Ascii line
    if(lineaFinalAscii){
        
        let caracterDivisorioLinea = ["_", ".", "_", "-", "|", "~"]
        let caracterDivisorioT = caracterDivisorioLinea[floor(random(caracterDivisorioLinea.length))];
        
        let glyphChar = document.createElement("P");
        glyphChar.style.lineHeight = newLineHeight+"%";
        glyphChar.style.fontSize = newTextSize+"px";
        let rowText = "";
        for(let j = 0; j < newCols; j++){
            if(random(10)<9.5){
                rowText += caracterDivisorioT;  
            }else{
                rowText += " "; 
            }
        }
        glyphChar.innerText = rowText;
        glyphDiv.appendChild(glyphChar);
    }

    // 9. The Final append
    theBox.appendChild(glyphDiv);
    placeInPage(theBox);
    
    if(bookMode){
            // Bonus right Coordinate:
            let morseTestTest = document.createElement("p");
            morseTestTest.className = "bookPageTextAnnotation";
            morseTestTest.style.position = "relative";
            morseTestTest.style.width = "2412px";
            morseTestTest.style.textAlign = "right";
            let morseMensajeBook  = "";
            morseMensajeBook += random(int(seed)/2)+" - - - Location {y} ";
            let randomSlashes = random(5, 20);
            for(let i=0; i<randomSlashes; i++) morseMensajeBook += "-";
            morseTestTest.innerHTML = morseMensajeBook;
            morseTestTest.style.fontSize = "10px"; 
            placeInPage(morseTestTest);
    }
    
}

function checarIndividuo(xT, yT, wT, hT){
    // Esta función revisa si existe un individuo en esta celula
    let hayIndividuo = false;
    
     for(let i=0; i<cocoTotals; i++){
         if(cocoObjectsTxt[i].label == "person"){
             // We only check if it is a person
            let columnaTransformada = floor(map(cocoObjectsTxt[i].x, 0, cocoImg.width, 0, wT));
            let rowTransformada = floor(map(cocoObjectsTxt[i].y, 0, cocoImg.height, 0, hT));
            if(columnaTransformada == xT){
                if(rowTransformada == yT){
                   hayIndividuo = true;
                }
            }
        }
    }
            
    return hayIndividuo;
    
}

// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ HTML OUTPUT ----> H Huge (but subtle ascii map)
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function hugeSubtleMap(){
    // -1. Feedback
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  TRADITIONAL ascii output chosen");
    
    // 0. Boolean switches
    let distorsionAscii = false;
    if(random(10)>3) distorsionAscii = true;
    let sustitucionDeDots = true;
    let availableDots = ["·", ".", "-", "`", "*"];
    let canIchangeDotOnTheGo = true;
    if(random(10)>7.5) canIchangeDotOnTheGo = false;
    let theDotThisTime = availableDots[floor(random(availableDots.length))];
    let invertedWhites = true;
    if(random(10)>5) invertedWhites = true;
    let oSActivas = false;
    if(random(10)>9) oSActivas = true;
    
    // 1. Main Data from the Glyph Array
    let glyphsCols = ascii_arr.length;
    let glyphsRows = ascii_arr[0].length;
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Glyphs cols: ", glyphsCols);
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Glyphs cols: ", glyphsRows);
    console.log("▒▒▒▒▒ HTML ▒▒▒▒ >>  Windowdidth: ", windowWidth);
    
    // 2. Height and Width
    let destinationWMax = 250;
    let destinationHMax = 150;
    let destinationWMin = 35;
    let destinationHMin = 21;
    let colsMax = 64;
    let colsMin = 11;
    let rowsMax = 29;
    let rowsMin = 6;
    
    let textSizeMax = 7.5;
    let textSizeMin = 6.5;
    let lineHeightMax = 85;
    let lineHeightMin = 62;
    if(random(10)>5) lineHeightMin = 32;
    
    let desplazamientoLeft = floor(random(windowWidth/10, windowWidth/3 * 2));
    if(bookMode) desplazamientoLeft = floor(random(2412/10, 2412/3 * 2));
    topCrossDeseoX = desplazamientoLeft;
    
    // 3. Getting a new random size
    let destinationWidth = random(destinationWMin, destinationWMax); // This must be dynamically calculated ...
    destinationWidth = floor(random(windowWidth/4*3, windowWidth));
    let destinationHeight = destinationWidth*150/250; // This must be dynamically calculated ...
    destinationHeight /= 20;
    
    
    // 4. The main HTML Container
    let theBox = document.createElement("div"); 
    theBox.className = "lilCircleBox";
    theBox.style.width = destinationWidth+"px";
    theBox.style.height = destinationHeight+"px";
    theBox.style.borderColor = greenT; // Should be white

    
    // 5. Creating the <div> that will hold all the <p class="flexRow"> rows
    let glyphDiv = document.createElement('div'); // Creating the <div>
    glyphDiv.className = 'flexCell';
    
    
    // 6. Setting the Paragraph Tag size
    let newTextSize = map(destinationWidth, destinationWMin, destinationWMax, textSizeMin, textSizeMax);
    let newLineHeight = map(destinationWidth, destinationWMin, destinationWMax, lineHeightMin, lineHeightMax);
    
    // 7. New row calculation
    let newCols = floor(map(destinationWidth, destinationWMin, destinationWMax, colsMin, colsMax));
    let newRows = floor(map(destinationHeight, destinationHMin, destinationHMax, rowsMin, rowsMax));
    
    
    for(let i = 0; i < newRows; i++){
        
        let glyphChar = document.createElement("P");
        glyphChar.style.lineHeight = newLineHeight+"%";
        glyphChar.style.fontSize = newTextSize+"px";
        let rowText = "";
        
        for(let j = 0; j < newCols; j++){
             
            // We add the Glyph Character (need to do some magic here)
            let desiredCol  = floor(map(j, 0, newCols, 0, glyphsCols));
            let desiredRow  = floor(map(i, 0, newRows, 0, glyphsRows));
            let characterToPlace = ascii_arr[desiredCol][desiredRow];  
            

            // Random character just in case
            if(random(100)>98 && canIchangeDotOnTheGo){
               theDotThisTime = availableDots[floor(random(availableDots.length))];   
            } 
            
            // Sustitucion de Dots
            if(sustitucionDeDots && characterToPlace != " " && !invertedWhites){
               characterToPlace = theDotThisTime; 
            }
            
            // Inverted Whites
            if(invertedWhites){
                if(characterToPlace == " "){
                   //characterToPlace = "."; 
                   characterToPlace = theDotThisTime;
                }else{
                   characterToPlace = " "; 
                }    
            }
            
            // Os activas (extreme look)
            if(oSActivas){
                characterToPlace = "o"; 
            }

            // Probabilidad orilla
            if(j < newCols/3 && distorsionAscii){
               if(random(10)>4) characterToPlace = " "; 
            }else if(j > (newCols/3 * 2) && distorsionAscii){
                if(random(10)>4) characterToPlace = " "; 
            }else if(i < newRows/3){
                if(random(10)>3) characterToPlace = " ";     
            }else if(i > newRows/3 * 2){
                if(random(10)>4) characterToPlace = " ";     
            }

            rowText += characterToPlace;
            
        }
        
        // Appending content
        glyphChar.innerText = rowText;
        glyphDiv.appendChild(glyphChar);
        
    }

    // 8. The Final append
    theBox.appendChild(glyphDiv);
    placeInPage(theBox);
    
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉  V  I  R  I  L  I  O ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function updateVirilio(){
    
    // 1. Where we are in the data?
    if(!virilioLoaded && !virilioLoading){
        // We need to load a new Virilio Text
        virilioMainContainer.style.display = "none";
        currentGlobalVirilio = floor(random(1, totalGlobalVirilio+1));
        let virilioFileName = "_data/txts/virilio/virilioWisdom_-"+currentGlobalVirilio+".txt";
        console.log(" VVVVVVVVVV NEW VIRILIO FILENAME", virilioFileName);
        // Now we load the text
        virilioLoading = true;
        loadStrings(virilioFileName, gotVirilio);
        // We reset all counters
        counterVirilio = 0;
        virilioCurrentArrayPoint = 2;
        
    }
    
    // 2. Checking the Blinking
    virilioBlink++;
    if(virilioBlink >= virilioBlinkTotalLimit) virilioBlink = 0;
    
    // 3. Showing Virilio
    
    if(virilioBlink < virilioBlinkLimit &&  virilioLoaded && !virilioLoading){
        virilioContainer.style.color = "white";
        virilioContainer.style.backgroundColor = "black"; 
    } else{
        virilioContainer.style.color = "black";
        virilioContainer.style.backgroundColor = "#dee1d0";
        //virilioMainContainer.style.display = "none";
    }
    
    showVirilio(); 
    
}

function gotVirilio(vResults){
    // 0. FEEDBACK
    console.log(">>>>> VVVVVV >>> GOT VIRILIO RESULTS (length): ", vResults.length);
    
    // 1. We organize the results in one single String First
    virilioInLines = vResults;
    let virilioSingleString = "";
    for(let i=0; i<vResults.length; i++){
        if(vResults[i] != "" || vResults[i] != " "){
            
            if(isCensored(vResults[i]) || random(100)>95){
                virilioSingleString += getNewWord(floor(random(4,7)));
            }else{
                virilioSingleString += vResults[i];
            }
            
        } 
    }
    
    // 2. We break them into an Array of word that we will later place in the HTML
    virilioWords = split(virilioSingleString, " ");
    virilioWordsTotal = virilioWords.length;
    console.log("VVVVV New Array of Single Virilio Words created!");
    console.log("VVVVV LENGTH: ", virilioWordsTotal);
    console.log("VVVVV First: ", virilioWords[2]);
    
    // We stop loading:
    virilioLoaded = true;
    virilioLoading = false;
    
    // Page 3 (bookMode only)
    if(bookMode && page == 3) placeVirilioPage3();
}

function showVirilio(){
    
    // 1. We Grab the Container and turn on the main one
    virilioMainContainer.style.display = "block";
    //let virilioContainer = document.getElementById('centerPoetryText');
    
    // 2. We get new words or increase the counter
    if(counterVirilio >= counterVirilioLimit){
        if(virilioCurrentArrayPoint > virilioWordsTotal-wordsPerPhraseMax){
            virilioLoaded = false; // (VVVVwe get a new Virilio File!)
        }else{
            currentVirilioText = getNewVirilioPlaceHolderText();
        }
        
        counterVirilio = 0;
    }else{
       counterVirilio++; 
    }
    
    // 3. We show the text
    if(virilioLoaded && !virilioLoading){
        virilioContainer.innerHTML = currentVirilioText;
    }
    
}

function getNewVirilioPlaceHolderText(){
    let theText = "";
    
    let newWordsToGet = floor(random(wordsPerPhraseMin, wordsPerPhraseMax));
    
    for(let i=0; i<newWordsToGet && virilioCurrentArrayPoint<virilioWordsTotal; i++ ){
        if(virilioWords[virilioCurrentArrayPoint] == "cinema"){
            theText += "virus ";
        }else{
            theText += virilioWords[virilioCurrentArrayPoint]+" ";
        }
        
        virilioCurrentArrayPoint++;
    }

    return theText;
}

function placeVirilioPage3(){
    /*
    This function places A.I. Virilio poetry on page no.03
    */
    for(let i=0; i<3; i++){
        let virilioPageLine = document.getElementById('virilioLine'+(i+1));
        if(i < virilioInLines.length-1){
            virilioPageLine.innerHTML =  getNewVirilioPlaceHolderText();
        }
    }
}



// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ AUTO SCROLLING FUNCTION
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function checkAutoScroll(){
    
    // 0. We update the window status
    updateWindowValues();
    
    // 1. First we check the AutoScroll status
    checkIfICanAutoScroll();
    
    // 2. Updating and resetting the Scrolling timer 
    checkAutoScrollTimer();
    
    // 4. Setting the actual scroll
    // only if animated, otherwise, the scroll is set whenever we get a New SCrolling Point
    if(animatedScroll) setTheScrollPosition(); 
    
}

function setTheScrollPosition(){
    
    // 1. We do our friction calculations
    if(scrollYCurrent != scrollYDeseo){
        scrollYCurrent = friccion(scrollYCurrent, scrollYDeseo, scrollFriction, true);
    }
    
    // 2. We finally set it
    if(!bookMode) window.scrollTo(0,scrollYCurrent);
    
    // 3. Sound execution
    //playNotonTone( "scroll" );
}

function getNewScrollingPoint( directlyToTheBottom ){
    /*
    This function receives two states:
        Either we go directly to the bottom (without any friction) or we go friction wise:
    */
    if(directlyToTheBottom && !bookMode){
        // Directly to the bottom, (a.k.a.) after a new HTML output
        // window.scrollTo(0,document.body.scrollHeight); // OLD REFERENCE
        scrollYCurrent = document.body.scrollHeight-1;
        scrollYDeseo = document.body.scrollHeight-1;
        window.scrollTo(0,scrollYDeseo); // Maybe not here
        playNotonTone( "scroll" ); // Sound
        
    }else if(autoScrollActive && !bookMode){
        // Friction 
        
        // We get a new 'desired' scrolling location (only in Y)
        scrollYCurrent = currentScrollY;
        scrollYDeseo = random(0, webPageHeight-userWindowHeight -userWindowHeight/4); // New scrolling position (-150) as a safety value
        scrollYDeseo = constrain(scrollYDeseo, 0, document.body.scrollHeight); // Watching for out of bound values
        scrollYDeseo = floor(scrollYDeseo); // ony integers
        if(random(10)>3.5){
            // To introduce variation, randomly we won't friction scroll, even when activated
            scrollYCurrent = document.body.scrollHeight-1;
            scrollYDeseo = document.body.scrollHeight-1;
            window.scrollTo(0,scrollYDeseo); // Maybe not here
            playNotonTone( "scroll" ); // Sound
        }
        console.log("New random scroll position, current ", scrollYCurrent, " deseo:", scrollYDeseo);
        
    }
    
    if(!animatedScroll && !bookMode){
        // (a) Scrolling to a point
        window.scrollTo(0,scrollYDeseo);
        
    }
    
}

function checkAutoScrollTimer(){
    autoScrollTimer++;
    if(autoScrollTimer >= autoScrollTimerLimit){
        // We Reset and get a new scrolling position
        autoScrollTimer = 0;
        getNewScrollingPoint();
        // Bear in mind that the autoScrollTimer also resets every new HTML output
    }
}

function checkIfICanAutoScroll(){
    if(!canIAutoScroll){
       if(webPageHeight >= userWindowHeight*scaleToAllowScroll){
           canIAutoScroll = true;
           console.log("○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○");
           console.log(" ○○○○○○○○○○ WEBPAGE IS NOW "+scaleToAllowScroll+" TIMES THE SIZE OF THE WINDOW, AUTOSCROLL BEGINS!");
           console.log("userWindowHeight: ", userWindowHeight, "webPageHeight: ", webPageHeight);
           console.log(" >> canIAutoScroll: ", canIAutoScroll);
           console.log("○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○○");
       } 
    }
    
}

function updateWindowValues(){
    userWindowHeight = window.innerHeight;
    webPageHeight = document.documentElement.scrollHeight;
    currentScrollY = window.pageYOffset;
    
    // getSizeReport();
}

/*
// TEST FUNCTION
window.onscroll = function (){
    //    console.log("SCROLLING!", random(100));
    // scrollYCurrent = currentScrollY;
}
*/


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ AUTO ERASE
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
/*
    This portion checks if the pageHeight is greater than a certain number,
    If so... erases everything!
*/

function checkEraseTimer(){
    
    updateWindowValues();

    if(webPageHeight > (userWindowHeight*eraseSizeLimit) && !eraseTimerActive){
        // The HTML is bigger.. therefore, we reset:
        eraseTimerActive = true;
        eraseCounter = 0;
    }
    if(eraseTimerActive) checkEraseCountDown();
}

function checkEraseCountDown(){
    
    // 1. Counter Increase
    eraseCounter++;
    
    // 2. Sound
    if(eraseCounter%65 == 0) playNotonTone( "eraseWarning" );
    
    // 3. Reset check
    if(eraseCounter >= eraseCounterMax){
        // This is the TRUE RESET
        // theMap.innerHTML = "<h2> "+webPageHeight+" / "+userWindowHeight+"</h2>"; 
        theMap.innerHTML = "<h1> :: LOG STORED AND ERASED </h1>";
        htmlCount = 0;
        //  TEMP Temp!
        // SOME DIV SHOULD APPEAR HERE... ?
        eraseTimerActive = false;
        eraseCounter = 0;
        
        // Another sound Action?
    }
    
}


// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉ PLACE IN PAGE 
// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉

function placeInPage(elObjecto){
    /*
    This function is meant to organize layer placement
        while using book Mode, otherwise it all goes
        to theMap
    */
    
    if(!bookMode){
       theMap.appendChild(elObjecto);
    }else{
        if(pageLayer == 1) thePage.appendChild(elObjecto);
        if(pageLayer == 2) thePage2.appendChild(elObjecto);
        if(pageLayer == 3) thePage3.appendChild(elObjecto);
        if(pageLayer == 4) thePage4.appendChild(elObjecto);
        if(pageLayer == 5) thePage5.appendChild(elObjecto);
        if(pageLayer == 6) thePage6.appendChild(elObjecto);
        if(pageLayer == 7) thePage7.appendChild(elObjecto);
        if(pageLayer == 8) thePage8.appendChild(elObjecto);
        
        pageLayerClock();
    }
}

function pageLayerClock(){
    /*
    This function keeps track in which page should we place the map items (book Mode) 
    */
    // 1. We Increase the Layer count
    placedInLayer++;
    placedInLayerTotals++;
    
    // 2. We reset if the limit has been reached
    if(placedInLayer >= placeInLayerLimit){
        // Layer rotation operations
        pageLayer++;
        if(pageLayer > pageLayerTotals) pageLayer = 1;
        placedInLayer = 0;
    }

}


