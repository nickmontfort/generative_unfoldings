// ▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉▉
// ▉▉▉▉▉▉▉▉▉▉▉ BOOK MODE (?seed + ?page)  ▉▉▉▉▉▉▉
/*
    Seed and Page functions taken from the following GitHub by Brent Bialey:
        https://github.com/brondle/generative_unfoldings
        
*/

// Standard requirements
const params = new URLSearchParams(location.search);
const seed = parseInt(params.get("seed"));
const page = parseInt(params.get("page"));

// Switches
const tripleCanvasMode = false;
const manualPageSaving = true;

let contPNG = 0;
let contPNGMax = 100;
let haveISavedPNG = false;
let bookMode = false;
let bookDownloadActive = true;
let pageFileName = "";
let systemON = true;

// Book Clock
let bookProgress = 0; // Goes from 0 to 100
const elementsForPage1Min = 50;
const elementsForPage1Max = 200; 
let elementsForPage1 = 50; // Once we write this amount of elements, we will save
let elementsForPage2 = 400;
let elementsForPage3 = 500;
let blinkingProgress = 0;

let staticLoaded = false;
let img;

// Page 4 and 5 Saving Variables
let finishedFillingPage5 = false;
const flexRows = 12;
const flexCols = 7;
let flexRowCurrent = 1;
let flexColCurrent = 1;
let flexCells = 0;
let flexCellsTotals = 84;
let currentFlexImgNo = 0;
let flexImgNoChosen = [];
let flexImgsChosen = 0;
let flexImgsMax = 237;
let setPosibles = [5,13,15,24,37,42,57,76,147,149,155,158,167,186,187,208,211];
let page4TotalImgs = 7; 
let page4TotalImgsPlaced = 0;
let currentlyLoadingAPage4Image = false;

// -------------------------------------------------------------

function checkBookMode(){
    /*
    This function gets called on the setup() 
    */
    
    if (page && seed) {
        // BOOK MODE: ON
        
        // 1. Turning BOOK MODE ON
        bookMode = true;
        console.log("⊞ ⊞ ⊞ ⊞ WE ARE IN BOOK MODE ⊞ ⊞ ⊞ ", bookMode);
        console.log("⊞ ⊞ ⊞ ⊞ seed: ", seed);
        console.log("⊞ ⊞ ⊞ ⊞ page: ", page);
        
        // 2. Automatically starting the system without sound
        soundStarted = false;
        soundIsOn = false;
        userSelectedSound = true;
        
        // 3. We hide the Navigation, Cover Screen and switch autoscroll to off
        navDiv.style.display = "none";
        loadingMessageText.style.display = "none";
        canvasTopLayerContainer.style.display = "none";
        autoScrollActive = false;
        window.scrollTo(0,0);
        
        // 4. We show the proper containers
        bookPageInfoContainer.style.display = "block";
        bookPageMainContainer.style.display = "block";
        
        // 5. Quick HTML CLock (the page populates quickly!)
        tiempoCiclo = 50; // Experimental
        innerHTMLClockLimit = 5; //25 in test mode
        
        // 6. We move the canvas to a new <div>
        cnvs.parent('canvasBookPageIn');
        
        // 7. HTML UPDATE
        if(page >= 1 && page <= 5){
            bookPageIntel.innerHTML = "PAGE: "+page;
            bookSeedIntel.innerHTML = "SEED: "+seed;
        }else{
            // INVALID PAGE ACTION
            bookPageIntel.innerHTML = "THE PAGE "+page+" IS NOT A VALID PAGE NUMBER";
            bookSeedIntel.innerHTML = "NO IMAGE WILL BE GENERATED :[";
        }
        
        // INDIVIDUAL ACTIONS PER PAGE CHOICE -  - - - - - - - - - - - - - - - - 
        // Generative Editorial Design
        
        // 8. Page 1, 2 and 3 (maps and ascii)
        if(page == 1 || page == 2 || page == 3){
           
            // 8(a) We moved the Fixed Contador
            fixedContadorContainer.style.right = '15%';
            fixedContadorContainer.style.top = '15%';
            bookPageSaverPage.appendChild(fixedContadorContainer);
            fixedContadorContainer.style.position = "inherit";
            
            // 8(b) Navegantes moved to the Page
            naveganteCrossA.style.position = "relative";
            naveganteCrossB.style.position = "relative";
            naveganteCrossC.style.position = "relative";
            bookPageSaverPage.appendChild(naveganteCrossA);
            bookPageSaverPage.appendChild(naveganteCrossB);
            bookPageSaverPage.appendChild(naveganteCrossC);
            
            // 8(c) Top Cross
            bookPageSaverPage.appendChild(topCrossElement);
            topCrossElement.style.position = "absolute";
            topCrossElement.style.marginTop = "55px";

            // 8(d) Lower Indicators
            bookPageSaverPage.appendChild(lowerIndicator1);
            bookPageSaverPage.appendChild(lowerIndicator2);
            bookPageSaverPage.appendChild(lowerIndicator3);
            lowerIndicator1.style.position = "absolute";
            lowerIndicator1.style.height = "80px";
            lowerIndicator2.style.position = "absolute";
            lowerIndicator2.style.height = "80px";
            lowerIndicator3.style.position = "absolute";
            lowerIndicator3.style.height = "80px";
            
            // 8(e) Square Indicator
            bookPageSaverPage.appendChild(lowerSquareIndicator);
            lowerSquareIndicator.style.position = "absolute";
            lowerSquareIndicator.style.width = "10px";
            lowerSquareIndicator.style.height = "10px";
            lowerSquareIndicator.style.bottom = "250px";
            if(page == 2 ) lowerSquareIndicator.style.left = "150px";
            if(page == 3 || page == 1) lowerSquareIndicator.style.left = "2150px";
            
            // 8 (f) Human Counter
            bookPageSaverPage.appendChild(humanCounter);
            humanCounter.style.position = "absolute";
            humanCounter.style.left = "150px";
            humanCounter.style.top = "150px";
            if(page == 3) humanCounter.style.display = "none";

        }
        if(page == 1){ // [recto]
            
            // 9 (a) Virilio Center Poetry Position and Scaling
            bookPageSaverPage.appendChild(virilioMainContainer);
            virilioMainContainer.style.position = "absolute";
            virilioMainContainer.style.transformOrigin = "center";
            virilioMainContainer.style.width = "660px";
            virilioMainContainer.style.height = "60px";
            centerPoetryInnerContainer.style.left = "-330px";
            virilioContainer.style.fontSize = "26px";
            
            // 9 (b) Total Elements
            elementsForPage1 = floor(random(elementsForPage1Min, elementsForPage1Max));

        }
        if(page == 3 || page == 4 || page == 5 ){ // [Pure Atlas]
            // 10 (a) No P5JS Canvas
            canvasBookPageIn.style.display = "none";
            
            // 11 (b) No Virilio Centered Poetry
            centerPoetryInnerContainer.style.opacity = "0";
        }
        if(page == 3) document.getElementById('bookVirilio').style.display = "block";
        if(page == 4 || page == 5){
            // 12 (a) NO ATLAS
            thePage.style.display = "none";
            thePage.style.opacity = "0";
        }
        if(page == 4){
            // 13 (a) Activating the container
            document.getElementById('page4FlexContainer').style.display = "block";
        }
        if(page == 5){
            // 14 (a) Actucating the container
            document.getElementById('page5FlexContainer').style.display = "block";
        }
          
    }else{
        // BOOK MODE: OFF
        // 1. We hide the book mode interface
        bookPageInfoContainer.style.display = "none";
        bookPageMainContainer.style.display = "none";
        console.log("⊞ NO BOOK MODE DETECTED ⊞ > System will proceed as usual");
    }
}

// -------------------------------------------------------------

function savePage(){
    
    // 1. Scale back to 1
    bookPageSaverPage.style.transform = "scale(1)";
    console.log("⊞ ⊞ ⊞ ⊞ STARTING TO EXPORT PAGE ", page);
    console.log("⊞ ⊞ TOTAL ELEMENTS IN ALL LAYERS: ", placedInLayerTotals);
    
    
    // 2. Turning the border OFF and other CSS
    bookPageSaverPage.style.borderStyle = "none";
    bookPageTopRightElement.style.display = "none";
    bookPageTopLeftElement.style.display = "none";
    bookPageBottomRightElement.style.display = "none";
    bookPageBottomLeftElement.style.display = "none";
    if(random(2)>1 || page == 3) humanCounter.style.opacity = "0";
    
    // 3. Updating the center container on page 1
    if(page == 1){
        virilioContainer.innerHTML = "I REPLACED THE TWENTIETH CENTURY";
        virilioContainer.style.color = "white";
        virilioContainer.style.backgroundColor = "black"; 
    }
    
    // 2. Saving Routine
    // We will save everything inside the <div bookPageSaverPage> container
    html2canvas(bookPageSaverPage, { // turn it into a canvas object
        width:2412,
        height: 3074,
        scrollY: 0
    }).then(function(canvas) {

        // create a link to a png version of our canvas object, then automatically start downloading it
        let a = document.createElement('a');
        a.href = canvas.toDataURL("image/png");
        a.download = seed + '_' + page + '.png';
        a.click();
    });
    console.log("⊞ ⊞ ⊞ ⊞ PAGE EXPORTED SUCCESFULLY ");
    
    // 3. HTML PAGE UPDATE (feedback)
    bookPageIntel.style.backgroundColor = "white";
    bookSeedIntel.style.backgroundColor = "white";
    bookPageIntel.innerHTML = "THE FILE "+seed + '_' + page + '.png'+" HAS BEEN CREATED,";
    bookSeedIntel.innerHTML = "PLEASE CHECK YOUR DOWNLOAD FOLDER.";
    
    // 3. Scale back to 0.2 (for browser display) and other visual style properties
    bookPageSaverPage.style.transform = "scale(0.2)";
    bookPageSaverPage.style.borderStyle = "solid";
    bookPageTopRightElement.style.display = "block";
    bookPageTopLeftElement.style.display = "block";
    bookPageBottomRightElement.style.display = "block";
    bookPageBottomLeftElement.style.display = "block";
    
    // 4. We stop all the system for good
    systemON = false;
    
    //
}

// -------------------------------------------------------------

function bookClock(){
    
    // 1. We Update the Progress
    updateBookProgress();
    
    // 1. We Check the progress for all page modalities
    if(page == 1){
        
        if(placedInLayerTotals >= elementsForPage1 && cocoTLX >= visorW) fakeClick();
        bookProgress = map(placedInLayerTotals, 0, elementsForPage1, 0, 100);
        
    }else if(page == 2){
        
        if(placedInLayerTotals >= elementsForPage2) fakeClick();
        bookProgress = map(placedInLayerTotals, 0, elementsForPage2, 0, 100);
             
    }else if( page == 3){
        
        if(placedInLayerTotals >= elementsForPage3) fakeClick(); 
        bookProgress = map(placedInLayerTotals, 0, elementsForPage3, 0, 100);
    
    }else if(page == 4){
        
        generatePage4();
        bookProgress = map(page4TotalImgs, 0, page4TotalImgsPlaced, 0, 100);
        if(page4TotalImgsPlaced >= page4TotalImgs) savePage();
        
    }else if(page == 5){
        
        bookProgress = map(flexCells, 0, flexCellsTotals-1, 0, 100);
        if(finishedFillingPage5){
            savePage();
        }else{
            generatePage5();
        } 
    }
    
}

// -------------------------------------------------------------

function updateBookProgress(){
    
    //  This function writes on the HTML the current progress
    // 1. Initial Values
    let longitudProgress = 30;
    let progressMessage = "PROGRESS:";
    progressMessage += " ";
    
    // 2. We add the ascii progress bar
    for(let i=0; i<=longitudProgress; i++){
        let iAPorcentaje = map(i, 0, longitudProgress, 0, 95);
        if(iAPorcentaje < bookProgress){
            progressMessage += "▓";
        }else{
            if(blinkingProgress%100>50) progressMessage += "·";
        }
    }
    
    // 3. We update it
    bookProgressIntel.innerHTML = progressMessage;
    
    // 4. Blinking effect
    blinkingProgress++;
    
}

function fakeClick(){
        /*
            I had to implement this 'fake click, since the html2 canvas 
            function only saved the p5js canvas when clicking with the mouse.
            
            Therefore, this function is a simulation of a mouse click
            and then, after this happens, it triggers the REAL save function >>> savePage()
        */
    
        html2canvas(cnvs.elt, { // turn the p5js canvas into an image
            width: 340,
            height: 200
        }).then(function(canvas) {
    
        var myImage = canvas.toDataURL("image/png");
        var imgDiv = document.getElementById('theimage');
        imgDiv.style.opacity = "0";
        imgDiv.src = myImage;
        imgDiv.addEventListener("click", function(){
             console.log("FAKE CLICK!!!!!");
             if(systemON) savePage();
         });
        console.log("Fake click functionality: ");
        imgDiv.click();
            
        });
}

function generatePage5(){
    /*
    Page 5 is a thumbnail view of all the AI-generated analysis 
    */
    // 0. Feedback
    console.log(">> PAGE 5 GENERATION, ROW: ", flexRowCurrent);
    console.log(">> PAGE 5 GENERATION, COL: ", flexColCurrent);
    
    // 1. We get a random image
    getANewFlexImgNo("todas");
    
    // 2. Loading/Placing the Image on the grid
    loadFlexImage(currentFlexImgNo+".jpg", 'page5Row'+flexRowCurrent, "page5Cell");
    
    
    // 3. Increasing the COL and ROW count
    flexColCurrent++;
    if(flexColCurrent > flexCols){
        if(flexRowCurrent == flexRows){
           // The filling operation has ended
            finishedFillingPage5 = true;
        }else{
            flexColCurrent = 1;
            flexRowCurrent++;
        }
    }

}

function getANewFlexImgNo(tipoDeDisponibilidad){
    
    /*
        This function avoids us to repeat images.
        Hay dos tipos de disponibilidad:
            "todas" ---> all images from the 237 (flex Imgs Max)
            "set" -----> para la Page 4, usualmente un numero fijo de imagenes (preferidas)
    */
    
    let foundANewFlex = false;
    // This cycle won't end until we have a unique image
    while (!foundANewFlex) {
        
        // We get a random Image No
        if(tipoDeDisponibilidad == "todas") currentFlexImgNo = floor(random(flexImgsMax));
        if(tipoDeDisponibilidad == "set"){
            currentFlexImgNo = setPosibles[floor(random(setPosibles.length))]
        }
        let foundInPrevs = false;
        for(let i=0; i<flexImgsChosen; i++){
            if(currentFlexImgNo == flexImgNoChosen[i]) foundInPrevs = true;
        }
        
        if(!foundInPrevs){
            foundANewFlex = true;
            flexImgNoChosen[flexImgsChosen] = currentFlexImgNo;
        } 
    }
    //
    console.log("The "+flexImgNoChosen.length+"Chosen Images are now: ", flexImgNoChosen);
    
    // We increase the chosen tutorial
    flexImgsChosen++;
}

function loadFlexImage(theName, theContainerId, cellClassName){
    
    // 1. A new image
    var flexImage = new Image();
    
    // 2. The function once the image loads
    flexImage.onload = function(){
        console.log("FLEX Img loaded!", theName);
        
        // New Cell Creation
        let flexCell = document.createElement("div");
        flexCell.classList.add(cellClassName);
        
        // Random (Seed) text creation and appending it to the cell
        let seedText = document.createElement("p");
        seedText.innerHTML = ":: "+random(seed);
        flexCell.appendChild(seedText);
        
        // Adding the image to the CEll
        flexCell.appendChild(flexImage);
        
        
        
        // Adding the Cell to the Container Row
        document.getElementById(theContainerId).appendChild(flexCell);
        
        // Increasing the total cell count (page 5 && 4) and other complete status
        flexCells++;
        page4TotalImgsPlaced++;
        currentlyLoadingAPage4Image = false;
        
    };
    
    // 3. We give the instruction to load the image
    flexImage.src = "_data/imgs_detection/"+theName;
    
    // 4. Loading status
    currentlyLoadingAPage4Image = true;
}

function generatePage4(){
    
    
    if(page4TotalImgsPlaced <= 0 && !currentlyLoadingAPage4Image){
        
        // A. COVER PLACEMENT
        loadPage4CoverImg();
        console.log(">> >> PAGE 4 CONSTRUCTION, IMG: ", page4TotalImgsPlaced);
        
    }else if(page4TotalImgsPlaced > 0 && !currentlyLoadingAPage4Image){
        
        // B. THUMBS PLACEMENT
        // B1 NEW IMAGE NUMBER
        getANewFlexImgNo("set");
        
        // B2 NEW CONTAINER
        let currentPage4ContainerName = 'page4Row1';
        if(page4TotalImgsPlaced == 3 || page4TotalImgsPlaced == 4) currentPage4ContainerName = 'page4Row2';
        if(page4TotalImgsPlaced == 5 || page4TotalImgsPlaced == 6) currentPage4ContainerName = 'page4Row3';
        
        // B4 LOADING THE IMAGE
        if(page4TotalImgsPlaced < page4TotalImgs){
           loadFlexImage(currentFlexImgNo+".jpg", currentPage4ContainerName, 'page4Cell');
        }
        
        console.log(">> >> PAGE 4 CONSTRUCTION--IMG: ", page4TotalImgsPlaced);
        console.log(">> >> CONTAINER NAME", currentPage4ContainerName);
    }
    
    
}

function loadPage4CoverImg(){
    
    // 1. A new image
    var coverImage = new Image();
    
    // 2. Listener Action
    coverImage.onload = function(){
        
        // A. New Cell Creation
        let coverImgContainer = document.getElementById('page4CellHeader');
        
        // B. Random (Seed) text creation and appending it to the cell
        let seedText = document.createElement("p");
        seedText.innerHTML = ":: "+random(seed);
        coverImgContainer.appendChild(seedText);
        
        // C. Adding the image to the CEll
        coverImgContainer.appendChild(coverImage);
        
        
        // D. Increasing the total cell count (page 5 && 4) and other complete status
        page4TotalImgsPlaced++;
        currentlyLoadingAPage4Image = false;
        
    };
    
    // 3. We give the instruction to load the image
    coverImage.src = "_data/imgs_detection/197_cover.jpg";
    
    // 4. Loading status
    currentlyLoadingAPage4Image = true;

    
}
