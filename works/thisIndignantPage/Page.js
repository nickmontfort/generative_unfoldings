function touchStarted(){
  if (go==true){
    read=!read;
  }
  else {
    go=true;
    frameCount=0;
    toNormal();
  }
}
function mousePressed() {
  if (go==true){
    read=!read;
  }
  else {
    go=true;
    frameCount=0;
    background(bgcol); 
  fill(0);
  dots.forEach(each => {
    each.move();
    each.display();
  } ); 
  push();
  for (let p=0;p<dots.length-1; p++){
    stroke(0);
    line(dots[p].x, dots[p].y, dots[p+1].x, dots[p+1].y);
    }
  pop();
  allwords.forEach(each => {
    each.build();
  } );
  }
}
function keyTyped() {
  go=true;
  switch(key) {
  case ' ':
    bgcol=[0];
    title="";
    upTo=0;
    para="";
    sentence=0;
    if (height>width){columns=random([1, 4, 4, 4]);}
    else{columns=random([1, 1, 2, 4, 4]);}
    background(bgcol);
    loadStrings(random(corpus), newText);
    break;
  case 'b':
    debug=true;
    writeDida();
    debug=false;
    break;
  case 'x':
    debug=!debug;
    break;
  case 'n':
    toPrint=true;
    format="single";
    printPage(format);   
    break;
  case 'm':
    toPrint=true;
    format="doublePage";
    printPage(format);
    break ;
  }
}
function printPage(format){
  fontSizes=[96, 120, 150];
  pixelDensity(2);
  if (format=="single"){
    resizeCanvas(1206, 1537);
  } else if (format=="doublePage"){resizeCanvas(2412, 1537);}
  console.log(format);
  sentence=0;
  right=width-200;
  topMargin=200;
  baseFontSize=random(fontSizes);
  columns=random([1, 4, 4]);
  allwords.forEach(each => {
    each.place(columns, pages, baseFontSize, sentence);
    }); 
  background(bgcol); 
  fill(0);
  dots.forEach(each => {
    each.move();
    each.display();
  } ); 
  push();
  for (let p=0;p<dots.length-1; p++){
    stroke(0);
    line(dots[p].x, dots[p].y, dots[p+1].x, dots[p+1].y);
    }
  pop();
  allwords.forEach(each => {
    each.build();
  } );
  if(sent==false){console.log(width+':'+height);setTimeout(saveCanvas('ThisIndignantPage_Donnachie_Simionato_'+month()+'-'+day()+'-'+year()+'_'+hour()+minute()+'_'+seed+'pg'+pageNum,'png'), 6000);
    writeDida();
    sent=true; 
    setTimeout(toNormal(), 6000);
  } 
}
function toNormal() {
  toPrint=false;
  resizeCanvas(windowWidth, windowHeight);
  right=width-50;
  left=50;
  middle=width/2;
  topMargin=30;
  if (height>width){columns=random([1, 4, 4, 4]);}
  else{columns=random([1, 1, 2, 4, 4]);}
  sentence=0;
  fontSizes=[int(width/15)/pd, int(width/12)/pd, int(width/8)/pd, int(width/6)/pd];  baseFontSize=random(fontSizes);
  textSize(baseFontSize);
  allwords.forEach(each => {
  each.place(columns, pages, baseFontSize, sentence);
  } );
  sent=false;
}
function windowResized() {
  toNormal();
}
function thisIndignantPage(){
  if (shownWords>0){
    if (frameCount < (shownWords*8)+240) {
      allwords.forEach(each => {
      each.build();
      if (debug==true) {
        console.log(each); 
        } } ); 
      dots.forEach(each => {
        each.move();
        each.display();
      } ); 
      push();
      for (let p=0;p<dots.length-1; p++){
        stroke(0);
        line(dots[p].x, dots[p].y, dots[p+1].x, dots[p+1].y);
       }
      pop();
    if (read==true || frameCount > shownWords*7+180) {
      push();
      textSize(14);
      fill(0);
      textAlign(CENTER,CENTER);
      text(title, width/2, height-45);
      pop();
      console.log('shownWords: '+shownWords);
      } 
    if (toPrint==true && sent==false){
      printPage(format);read=false;
    }
  }
  else {
    title="";
    upTo=0;
    para="";
    sentence=0;
    if (height>width){columns=random([1, 4, 4, 4]);}
    else{columns=random([1, 1, 2, 4, 4]);}
    background(bgcol);
    read=false;
    loadStrings(random(corpus), newText);
    }
  } else {
    frameCount=0;
    toNormal();
    }
  }
function greeting(){
  push();
  if (height>width){baseFontSize=18;}
  else{baseFontSize=24;}
  textSize(baseFontSize);
  textAlign(CENTER, TOP);
  stroke(0);
  text ("This Indignant Page, 2021", width/2, height/2 - (3*baseFontSize));
  noStroke();
  text ("Karen ann Donnachie & Andy Simionato", width/2, height/2 - (1.5*baseFontSize));
  text ("", width/2, height/2);
  text ("Click to start audio and toggle text", width/2, height/2 + (1.5*baseFontSize));
  pop();
}
