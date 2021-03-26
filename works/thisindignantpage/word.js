class Word{
  constructor(l, word, rWord, syll, pos, sentVal, ID){
    this.listID=l;
    this.sentVal = sentVal;
    this.word=word;
    this.played=false;
    this.syll=syll;
    this.pos1=pos[0];
    this.pos2=pos[1];
    if (pos[2]>""){this.pos3=pos[2];} else {this.pos3="";}
    this.played=false;
    this.ID=ID;
    this.timer=ID*5;
    this.show=true;
    this.fadey=0;
  }
  place(columns, pages, baseFontSize, sentence){
    this.topMargin=topMargin;
    if (toPrint==true){right=width-300;columns=4;baseFontSize=120;} //re: print
    let bottom=height-50+(baseFontSize*2);
    textSize(baseFontSize);
    this.wWidth=textWidth(this.word);
    if (left + this.wWidth < right){ //&& this.listID<=sentence
      this.left=left;
      this.topMargin=topMargin;
      this.show=true;
      if(this.topMargin<height-baseFontSize*3){shownWords++;}
      upTo+=1;
      sentSent+=this.sentVal;
      left+=this.wWidth+baseFontSize/3;
      if (this.word =='"') { left-=baseFontSize/3;}
    }
    else if(topMargin + 2.5*baseFontSize < bottom && this.topMargin<bottom) {
      topMargin+=2.5*baseFontSize;
      this.topMargin=topMargin;
      if (columns==1) {
        left = 40;}
      else if (columns==2 || pages==2) {
        left = middle+40;}
      if (columns==4 || left + this.wWidth > width-100) {
        left = random(40,width-200);}
      if (left + this.wWidth > width-100) {
        left = random(40,width-200);}
      this.left=left;
      left+=this.wWidth + baseFontSize/3;
      this.show=true;
      if(this.topMargin<height-baseFontSize*3){shownWords++;}
      upTo+=1;
      sentSent+=this.sentVal;
      sentence=this.listID;
    }
    else {this.topMargin=height+20;this.show=false;}
  }
  build(){
    fill(0);
    if (frameCount > this.timer || toPrint==true ) {
      if(this.topMargin<height-baseFontSize*3){
       makeShape(this.pos1, this.pos2, this.pos3, this.left, this.topMargin, this.syll, this.sentVal, this.wWidth, this.ID, this.listID, this.word[0]);
       if (read==true && toPrint==false){if (this.fadey<255){this.fadey++;}if (this.fadey<255){this.fadey++;}fill(0, 0, 0, this.fadey);text(this.word, this.left, this.topMargin);} //console.log(this);
       if (this.sentVal>0){
        noStroke();
        fill(0,0,255,35);
        ellipse(this.left+this.wWidth/2,this.topMargin+baseFontSize*5/8,75*this.sentVal, 75*this.sentVal);
        for (var q=75*this.sentVal; q<100*this.sentVal; q++){
          fill(0,0,255,8);
          if (this.played!==true){
            playSynth(2, int(this.sentVal), 1);
          }
          this.played=true;
          ellipse(this.left+this.wWidth/2,this.topMargin+baseFontSize*5/8,q, q);
        }
      }
    else if (this.sentVal<0){
      noStroke();
      fill(255,0,0,25);
      let min=75*abs(this.sentVal);
      rect(this.left,this.topMargin+baseFontSize/6, min, min);
      for (let m=min; m<100*abs(this.sentVal); m++){
        fill(255, 0, 0, 8);
        rect(this.left, this.topMargin+baseFontSize/6, m, m);
      }
      if (this.played!==true){
      playSynth(1, abs(this.sentVal), 1);
      }
      this.played=true;
    }
    else if (this.played!==true){
      //"normal letters"
    }
    this.played=true;
    }
  }
}
update(ID){
  this.ID=ID;
  this.timer=ID*5;
}
}
class Dot{
  constructor(ID, x, y, listID){
    this.x=x;
    this.y=y;
    this.listID=listID;
    this.ID=ID;
    this.others=[];
  }
  move(){}
  display(){
    fill(0);
    ellipse(this.x, this.y, 15, 15);
  }
}
