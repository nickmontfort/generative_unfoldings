/*
  THIS INDIGNANT PAGE: Politics of the Paratextual, 2021
  by Karen ann Donachie and Andy Simionato 
  http://karenandy.com
  This generative work has been created for the 2021 MIT CAST Symposium exhibition, 
  "Generative Unfoldings", curated by Nick Montfort.
 *
  The work will auto-advance through illuminations of excerpts of texts from the Gutenberg Library.
  KeyStroke Commands:
    -  tap/click will toggle text on/off
    -  'spacebar' will force next text snippet
    -  'n' will print a high-res single page
    -  'm' will print a high-res double page
 *
  All p5js code and design is claimed as original by the authors, including Page, Paratext & Word classes, 
  In addition, this work leverages the following libraries:
    -  Processing / P5js / p5 Sound / RiTajs — http://p5js.org
    -  Project Gutenberg texts — http://gutenberg.org
    -  Sentiment analysis dictionaries [MIT_affin165 and Vader]
  The authors are grateful to the administrators, coders, and designers of these resources & libraries.
 */
var para="", title="";
var upTo=0;
var pd, shownWords, fadey, first, sentSent, sentence, middle, right, left, columns
    , pages, ID, polySynth, tone, size, rParams, sentVal, sentimentRef, sentimentRef2, l, word
    , rWord, syll, pos1, pos2, sentVal, boxh, boxw, currfreq, played, format;
var fontSizes = [36, 72, 96];
var baseFontSize=36, topMargin=30;
var list=[], which=[], allsentences=[], dots=[], words=[], allwords=[];
var debug=false, sent=false, read=false, toPrint=false, go=false; 
function preload() {
  font=loadFont('data/fonts/HelveticaNowDisplay.otf');
  sentimentRef = loadJSON('data/sentiment/MIT_afinn_165.json');
  sentimentRef2 = loadJSON('data/sentiment/vader.json');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  pd=pixelDensity();
  if (pd!==2){pixelDensity(2);}
  pd=pixelDensity();
  fontSizes=[int(width/11)/pd, int(width/9)/pd, int(width/6)/pd, int(width/4)/pd];
  bgcol=[210];
  boxh=height/8;
  boxw=height/8;
  textFont(font);
  textSize(baseFontSize);
  textAlign(LEFT, TOP);
  polySynth = new p5.PolySynth();
  frameRate(30);
  right=width-50;
  left=50;
  middle=width/2;
  rParams = {
    ignoreStopWords: true, 
    ignoreCase: true, 
    ignorePunctuation: true
  };
  loadStrings(random(corpus), newText);
  columns = random([1, 1, 2, 4, 4]);
  if (height>width) {
    columns=random([1, 4, 4, 4]);
    baseFontSize=18;}
}
function draw() {
  background(bgcol); 
  fill(0);
  if (go==false){
        greeting();
  } else {
    if (frameCount== (shownWords*4)+120){read=true;}
    thisIndignantPage();
  }
}
