const corpus = ["data/books/blake-poems.txt", "data/books/austen-emma.txt", "data/books/austen-persuasion.txt", "data/books/austen-sense.txt", "data/books/bible-kjv.txt", "data/books/blake-poems.txt", "data/books/bryant-stories.txt", "data/books/burgess-busterbrown.txt", "data/books/carroll-alice.txt", "data/books/chesterton-brown.txt", "data/books/chesterton-thursday.txt", "data/books/edgeworth-parents.txt", "data/books/melville-moby_dick.txt", "data/books/milton-paradise.txt", "data/books/moby_short.txt", "data/books/shakespeare-hamlet.txt", "data/books/shakespeare-macbeth.txt", "data/books/whitman-leaves.txt"];
/****** PARSE STRINGS ******/
function newText(result) {
  allwords=[];
  dots=[];
  sentSent=0;
  para="";
  frameCount=0;
  bgcol=[210];
  list=[];
  // IF NOT ENOUGH TEXT HAS LOADED
  if (result.length<300) {
    list=[]; 
    para="";
    background(bgcol);
    loadStrings(random(corpus), newText);
  } else {
    let randomselection = round(random(result.length-1000));
    let numsent=1;
    list = result.slice(randomselection, randomselection+numsent);
    while (list.toString().length < 1000) { 
      numsent+= 1;
      list = result.slice(randomselection, randomselection+numsent);
    }
    console.log(randomselection+', '+ list.length+', '+list.toString().length);
  }
  // GRAB TITLE BEFORE CLEARING VARIABLE
  title=result[0];
  let tmp = title.split(''); 
  tmp.splice(0, 1);
  tmp.pop(); 
  while (tmp[tmp.length-1]==' '){tmp.pop(); }
  if (tmp[tmp.length-1]==']'){tmp.pop(); }
  //console.log(tmp[-1]);
  title=tmp.join('');
  console.log(title);
  result=[];
  paraParse(list)
}
  // RITA PARSE KNOWN WORDS
function paraParse(list){
  allwords=[];
  ID=0;
  shownWords=0;
  for (let l=0; l<list.length; l++) {
    let i;
    para = list[l].toString();
    para = para.replace(/,, /g, ', ');
    para = para.replace(/  /g, ' ');
    let test=new RiString(para);
    words = test.words();
    for (i=0; i<words.length; i++) {
      ID++;
      let rWord = RiTa.stripPunctuation(words[i]);
      if (sentimentRef.hasOwnProperty(rWord.toLowerCase())) {
        sentVal=sentimentRef[rWord.toLowerCase()];
      } else if (sentimentRef2.hasOwnProperty(rWord.toLowerCase())) {
        sentVal=sentimentRef2[rWord.toLowerCase()];
      } else {
        sentVal=0;
      }
      if (RiTa.getSyllables(rWord, rParams)>"") {
        let syll=RiTa.getSyllables(rWord, rParams);
        let lex = new RiString(rWord.toLowerCase());
        let flex = lex.features();
        if (words[i+1]==',' || words[i]=='.') {
          words[i]=join([words[i], words[i+1]], '');
          allwords.push(new Word(l, words[i], rWord, syll, flex.pos, sentVal, ID));
          i++;
        } else { 
          allwords.push(new Word(l, words[i], rWord, syll, flex.pos, sentVal, ID));
        }
      } else if (words[i]!==',' && words[i]!=='.') { 
          allwords.push(new Word(l, words[i], rWord, [""], [""], sentVal, ID));
        }
        else{ allwords.push(new Word(l, words[i], rWord, [""], ['..'], sentVal, ID));}
      }
    }
  sentence=0;
  baseFontSize = random(fontSizes);
  textSize(baseFontSize);
  topMargin=baseFontSize;
  frameCount=0;
  allwords.forEach(each => {
    each.place(columns, pages, baseFontSize, sentence);
  }  );
  frameCount=0;
  para = join(list, ' ');
}
function makeShape(pos1, pos2, pos3, x, y, syll, sentVal, wWidth, ID, listID, first) {
  switch(pos1) {
  case 'p':
    push();
    //noStroke();
    stroke(0);
    translate(x, y);
    fill(120, 120, 120, 2 );
    let min=boxw-wWidth/2;
    stroke(0, 0, 0, 100);
    rotate(QUARTER_PI*sin(ID));
    quad(0, wWidth, wWidth*cos(listID), boxw*(sentVal+1), (unchar(pos2)-65)*2, wWidth, syll.length, 0);
    for (let m=min; m<boxw; m++){
       fill(currfreq,100,100,0.1);
       quad(0, wWidth, wWidth*cos(listID), boxw*(sentVal+1), unchar(first)-65, wWidth, syll.length, 0) ;
      }
    pop();   
    break;
  case 'v':
    push();
    translate(x, y);
    stroke(0);
    line(-boxw, boxh/2, 2*boxw, boxh/2);
    line(boxw/2, -boxh, boxw/2, 2*boxh);
    let cx, cy;
    let secondsRadius= wWidth;
    stroke(255, 0, 0);
    translate(boxw/2, boxw/2);
    cx = 0;
    cy = 0;
    let arm = map(unchar(pos3), 65, 115, 1, 12);
       rotate(sin(frameCount/wWidth-ID));
      //let rot = syll.length;
      let s = map(arm, 0, 12, 0, TWO_PI) - QUARTER_PI; 
    line(cx, cy, cx + cos(s) * secondsRadius, cy + sin(s) * secondsRadius);   
    pop();
    break;
  case 'w':
    push();
    translate(x, y);
    stroke(0, 0, 255);
    line(0, -boxh, boxw/2, -boxh/2);
    line(boxw/2, -boxh/2, 0, 0);
    line(0, 0, boxw/2, boxh/2);
    line(boxw/2, boxh/2, 0, boxh);
    pop();
    break;
  case 'n':
    push();
    translate(x+wWidth/2, y+baseFontSize/2);
    rotate(syll.length/2*PI);
    noFill();
    if (first>95){first-=30;}
    first-=65;
    //currFreq=map(first, 0, 25, 0, 100);
    //colorMode(HSB, 20);
    
    let closed=[OPEN, OPEN, PIE, PIE, CHORD, CHORD];
    for (let c=0; c<20; c++){
      stroke(c*10);
      //fill(c, 100, 100, 2);
      arc(c, c, wWidth, wWidth, syll.length*QUARTER_PI, sentVal*QUARTER_PI, closed[abs(sentVal)]);
    }
    pop();
    break;
  case 'j':
    push();
    translate(x, y);
    first=(unchar(first));
    if (first>95){first-=30;}
    first-=65;
    currFreq=map(first, 0, 25, 0, 100);
    colorMode(HSB, 100);
    fill(currFreq, 100, 100, 50);
    noStroke();
    rotate(sentVal*QUARTER_PI);
    rect(0, 5*boxw/12, wWidth, boxw/6);
    colorMode(RGB);
    pop();
    break;
  case 'i':
  case 'c':
    let fresh=true;
    for (let d=0;d<dots.length;d++){
      if (ID <= dots[d].ID){ 
        fresh=false; }
      }
    if (fresh==true){ dots.push(new Dot(ID, x, y, listID));}
    break;
  case 't':
    push();
    translate(int(x+wWidth/2), int(y+baseFontSize/2));
    stroke(0); 
    star(0, 0, wWidth, words.length, sentVal);
    pop();
    break;
   case 'r':
     push();
     translate(x-wWidth,y-wWidth);
     for (let g=0; g<wWidth; g+= 5){
       //stroke(255,5);
       fill(10, 10, 10, 1);
       noStroke();
     rect(g,g,2*wWidth, 2*wWidth+2);
     }
    pop();
    break;
   case 'd':
    push();
    translate(x-wWidth/4,y);
     //for (let g=0; g<wWidth; g+= 5){
       //stroke(255,5);
       //fill(10, 10, 10, 1);
    stroke(0,255,0);
    noFill();
    line(0, 1.5*baseFontSize, 1.5*baseFontSize, 0);
    line(0, 0, 1.5*baseFontSize, 1.5*baseFontSize);
     //}
    pop();
    break;
    case 'm':
    push();
    translate(x,y+baseFontSize);
    noFill();
    let sec = map(second(),0,59, 0, 100); 
    colorMode(HSB, 100);
    stroke(sec*listID, 100, 100);
    line(-wWidth/3, 0, wWidth/3, 0);line(2*wWidth/3, 0, 4*wWidth/3, 0);
    //line(0, 0, 1.5*baseFontSize, 1.5*baseFontSize);
     //}
    pop();
    break;
    case '.':
    push();
    translate(x,y+baseFontSize);
    noFill();
    colorMode(HSB, 100);
    stroke(1, 100, 100);
    ellipse(10,10,10,10);
    pop();
    break;
  }
}
function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}
function playSynth(tone, size, syll) {
  userStartAudio();
  // note duration (in seconds)
  let dur = 3.0 * size;
  // time from now (in seconds)
  let time = 0;
  // velocity (volume, from 0 to 1)
  let vel = 0.1;
  // notes can overlap with each other
  if (tone==1) {
    polySynth.play('G2', vel*3, 0, dur);
    polySynth.play('C3', vel*3, time += 1/4, dur);
    polySynth.play('G3', vel*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==2) {
    polySynth.play('B4', vel*3, 0, dur);
    polySynth.play('C5', vel*3, time += 1/4, dur);
    polySynth.play('A4', vel*3, time += 1/4, dur);
    //currfreq=60;
  } else if (tone==3) {
    polySynth.play(midiToFreq(64-syll.length), 0.2, 0, syll.length/8 );
  }
}
function writeDida() {
  let dida = createWriter('IndignantPage_dida_'+hour()+':'+minute()+' '+month()+'/'+day()+'/'+year()+'.txt');
  dida.write(['This Indignant Page, 2021\nKaren ann Donnachie & Andy Simionato\nA generative reading of: '+ title+'\nDownloaded @ '+hour()+':'+minute()+' '+month()+'/'+day()+'/'+year()+'\n\nText Excerpt : '+ para+'\n']);
  console.log(baseFontSize);
  if (debug==true){
  for (d=0;d<allwords.length;d++){
    dida.write([allwords[d].ID,'\t', allwords[d].word,'\t', allwords[d].pos1, '\n']);
  }}
  dida.close();
}
