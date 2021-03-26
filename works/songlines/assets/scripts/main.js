// world ticking
var w; // global world object
var ww, wh;
var smooth_reward_history = []; // [][];
var smooth_reward = [];

// agent parameters for finetuning
var spec = {};

// display
var font;
var stats = {};

var activestrings = [];

var pApples = [0, 0];
var pPoison = [0, 0];

// interact
var myCursor;
var down = false;
let t1, t2;

// game states
var GAME_STATE = ["intro", "play", "outro"];

var maxScore = 80; // 80 is ideal
let winnerID = 0;

var trace0 = { x: 0, y: 0 };
var trace1 = { x: 0, y: 0 };
var ptrace0 = { x: 0, y: 0 };
var ptrace1 = { x: 0, y: 0 };
var gfx1, gfx2;

let x = 1;
let y = 1;
let easing = 0.1;

let pngSaved = false;

let gfxAlpha = 0;
let pSec = 0;

let textSelect = 0;
let titleSelect = 0;

let pitchSelect = 0;

let yoff = 0.0;

// generate gfx on end
let pts1=[];
let pts2=[];
let col1 = [150,150,150,100];
let col2 = [218, 90, 51,100];


function preload() {
  font = loadFont("assets/data/Lekton-Italic.ttf");
  myCursor = createVector(0,0);
}

function setup() {
  var canvas = createCanvas(windowWidth, windowHeight);

  spec.update = 'qlearn'; // qlearn | sarsa
  spec.gamma = 0.9; // discount factor, [0, 1)
  spec.epsilon = 0.2; // initial epsilon for epsilon-greedy policy, [0, 1)
  spec.alpha = 0.0001; // value function learning rate
  spec.experience_add_every = 5; // number of time steps before we add another experience to replay memory
  spec.experience_size = 10000; // size of experience
  spec.learning_steps_per_iteration = 5;
  spec.tderror_clamp = 0.5; // for robustness
  spec.num_hidden_units = 300 // number of neurons in hidden layer

  ww = floor(canvas.height * 0.7);
  wh = floor(canvas.height * 0.7);
  w = new World(ww, wh);

  trace0.x = 0;
  ptrace0.x = 0;
  trace1.x = ww;
  ptrace1.x = ww;

  trace0.y = wh/2;
  ptrace0.y = wh/2;
  trace1.y = wh/2;
  ptrace1.y = wh/2;

  if(seed) randomSeed(seed);
  initStrings(floor(random(4)));
  pitchSelect = floor(random(pitches.length));
  drone.set({
          playbackRate: pitches[pitchSelect][floor(random(4))]
  });
  fm1.set({"harmonicity": harmonicities[floor(random(harmonicities.length))]});
  fm2.set({"harmonicity": harmonicities[floor(random(harmonicities.length))]});

  generatePoisons();

  t1 = new Triangulum(width/2 - ww/2 - 200, height/3, 100, 0);
  t2 = new Triangulum(width/2 + ww/2 + 200, height/3, 100, 1);

  loadAgents();

  gfx1 = createGraphics(ww / 4, wh / 4);
  gfx2 = createGraphics(ww / 4, wh / 4);
  gfx1.pixelDensity(2);
  gfx2.pixelDensity(2);

  gfx1.clear();
  gfx2.clear();

  // select & generate events for saving page
  if (page && seed) {
    if(page < 5) {
      w.agents[0].apples = map(page,1,4,10,maxScore-1);
      w.agents[1].apples = map(page,1,4,10,maxScore-40);

      GAME_STATE = "play";
      randomSeed(seed);
      gen(gfx1,pts1,10,random(0.2,0.4),2,11,col1);
      randomSeed(seed);
      gen(gfx2,pts2,2000,random(0.5,1),1.2,9,col2);
      if(page==1) {
        //...
      }
      if(page==2) {
        generateItems();
      }
      if(page==3) {
        generateRandomPoisons();
      }
      if(page==4) {
        generateItems();
        generateRandomPoisons();
      }
    } else {
      GAME_STATE = "outro";
      randomSeed(seed);
      textSelect = floor(random(texts.length));
      randomSeed(seed);
      titleSelect = floor(random(titles.length));
      gen(gfx1,pts1,10,0.4,2,11,col1);
      gen(gfx2,pts2,2000,1,1.2,9,col2);
      gfxAlpha = 255;
    }
  } else {
    GAME_STATE = "intro";
  }
}

function draw() {
  background(colors.bg);
  frameRate(60);

  if (GAME_STATE == "intro") {
    noStroke();

    textFont(font);
    textAlign(CENTER);
    textSize(48);
    fill(colors.agent);
    text("TOUCH TO START", width / 2, height / 3);

    fill(colors.type);
    textSize(26);
    text("TURN ON AUDIO", width / 2, height / 2 + 50);

    textAlign(LEFT);

    stroke(255, 20);
    line(width / 4, height / 2, width / 2 + width / 4, height / 2)

    push();
    translate((width - ww) / 2.0, (height - wh) / 3);

    noStroke();
    fill(colors.type);
    textFont(font);
    textAlign(CENTER);
    textSize(20);
    text("Feed the agents & listen to their Songlines", ww/2, wh/2.5);
    fill(colors.agent);
    ellipse(ww / 2, wh / 9.5, 20, 20);
    noFill();
    stroke(colors.agent);
    ellipse(ww / 2, wh / 6, 20, 20);
    pop();
  }

  if (GAME_STATE == "play") {
    noStroke();
    fill(255,30);
    rect(t1.xp,0,1,t1.yp + gfx1.height/1.5);
    rect(t2.xp,0,1,t2.yp + gfx2.height/1.5);
    t1.draw();
    t2.draw();

    var mappedCursor = createVector(myCursor.x - (width - ww) / 2.0, myCursor.y - (height - wh) / 4);
    if (down) {
      if(dist(mouseX,mouseY,pmouseX,pmouseY)>4) {
        addItem(myCursor);
      }

      fill(255, 20);
      noStroke();
      ellipse(myCursor.x, myCursor.y, 100, 100);
    }

    if(second()!=pSec) {
      if(second()%2==0) {
        let v = createVector(random(width), random(height));
        addItem(v);
      }
    }
    pSec = second();

    var agents = w.agents;

    w.tick();

    push();
    translate((width - ww) / 2.0, wh/20);

    // draw agents
    for (var i = 0; i < agents.length; i++) {
      var a = agents[i];
      // body
      noStroke();

      push();
      if (a.id == 0) {
        strokeWeight(1)
        fill(colors.agent);
        stroke(colors.agent);
      } else {
        fill(colors.agent);
        stroke(colors.agent)
        fill(colors.bg)
      }
      translate(a.op.x, a.op.y);
      if (i == 0) {
        trace0.x = a.op.x;
        trace0.y = a.op.y;
      }
      if (i == 1) {
        trace1.x = a.op.x;
        trace1.y = a.op.y;
      }
      rotate(a.heading);
      let ms = a.rad / 2

      strokeCap(ROUND)
      strokeJoin(ROUND)

      translate(-a.rad * 2, 0);
      beginShape()
      vertex(ms * 6, 0)
      vertex(ms * 6 - ms, -ms)
      vertex(0, 0)
      vertex(ms * 6 - ms, ms)
      vertex(ms * 6, 0)
      endShape()

      pop();

      // sight
      for (var j = 0; j < a.eyes.length; j++) {
        var e = a.eyes[j];
        var sr = e.sensed_proximity;
        if (e.sensed_type === -1 || e.sensed_type === 0) {
          strokeWeight(1);
          stroke(180, 30); // wall or nothing
          line(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
        }
        if (e.sensed_type === 1) { // food
          stroke(255, 100);
          linedash(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle), 3, "-");
        }
        if (e.sensed_type === 2) { // poison
          stroke(255, 50);
          line(a.op.x, a.op.y, a.op.x + sr * sin(a.oangle + e.angle), a.op.y + sr * cos(a.oangle + e.angle));
        }
      }
    }

    // draw strings
    for (var i = 0; i < stringnum; i++) {
      if (activestrings[i] == 1) {
        fill(255, 100);
        noStroke();
        ellipse(-10, i * (wh / stringnum) + wh / stringnum * 2.0, 5, 5);
        ellipse(ww + 10, i * (wh / stringnum) + wh / stringnum * 2.0, 5, 5);
        stroke(255, 20);
        strokeWeight(4);
      } else {
        stroke(255, 20);
        strokeWeight(1);
      }
      line(0, i * (wh / stringnum) + wh / stringnum * 2.0, ww, i * (wh / stringnum) + wh / stringnum * 2);
    }

    // draw items (food)
    for (var i = 0; i < w.items.length; i++) {
      var it = w.items[i];
      var coloralpha;
      if(seed&&page) {
        coloralpha = 255;
      }else{
        coloralpha = it.age;
      }

      let s = it.rad / 2;
      strokeWeight(4)
      if (it.type === 1) {
        stroke(255)
      }
      if (it.type === 2) {
        stroke(84, 101, 97, coloralpha);
      }
      line(it.p.x, it.p.y, it.p.x + it.rad, it.p.y)

    }

    pop();

    // make sound
    for (var i = 0; i < w.agents.length; i++) {
      if (w.agents[i].apples != pApples[i]) {

        if (i == 0) { // first agent
          feedbackDelay1.set({
            delayTime: random(0.01, 0.1),
            feedback: random(0.1, 0.96)
          });
          fm1.triggerAttackRelease(Tone.Midi(36 - lastAppleY + 50).toFrequency(), "8n");

          gfx1.noStroke();
          gfx1.fill(255);
          gfx1.ellipse(trace0.x / 4, trace0.y / 4,2,2);
        } else if (i == 1) { // second agent
          feedbackDelay2.set({
            delayTime: random(0.1, 0.5),
            feedback: random(0.1, 0.96)
          });
          fm2.triggerAttackRelease(Tone.Midi(36 - lastAppleY + 48).toFrequency(), "8n");
          gfx2.fill(255);
          gfx2.noStroke();
          gfx2.ellipse(trace1.x / 4, trace1.y / 4,2,2);
        }

        let rnd = floor(random(4));
        drone.set({
          playbackRate: pitches[pitchSelect][rnd]
        });

      }
      if (w.agents[i].poison != pPoison[i]) {
        let rnd = floor(random(3));
        if (rnd == 0) {
          poisonSynth.triggerAttackRelease("C8", "8n");
        }
        if (rnd == 1) {
          poisonSynth.triggerAttackRelease("C9", "8n");
        }
        if (rnd == 2) {
          poisonSynth.triggerAttackRelease("C7", "8n");
        }
      }
      pApples[i] = w.agents[i].apples;
      pPoison[i] = w.agents[i].poison;
    }

    // draw songlines
    tint(255);
    let targetX = map(dist(ptrace0.x / 4, ptrace0.y / 4, trace0.x / 4, trace0.y / 4),1,0.1,0.1,1);
    let dx = targetX - x;
    x += dx * easing;

    gfx1.strokeWeight(x);
    gfx1.stroke(150,100);
    gfx1.line(ptrace0.x / 4, ptrace0.y / 4, trace0.x / 4, trace0.y / 4);
    image(gfx1, t1.xp - gfx1.width/2, t1.yp + gfx1.height/1.5);

    strokeWeight(2);
    stroke(30, 38, 40);
    noFill();
    rect(t1.xp - gfx1.width/2, t1.yp + gfx1.height/1.5, gfx1.width - 1, gfx1.height - 1);

    let targetY = map(dist(ptrace1.x / 4, ptrace1.y / 4, trace1.x / 4, trace1.y / 4),1,0.1,0.1,1);
    let dy = targetY - y;
    y += dy * easing;
    gfx2.strokeWeight(y);
    gfx2.stroke(218, 90, 51,100);
    gfx2.line(ptrace1.x / 4, ptrace1.y / 4, trace1.x / 4, trace1.y / 4);
    image(gfx2, t2.xp - gfx2.width/2, t2.yp + gfx2.height/1.5);

    strokeWeight(2);
    stroke(30, 38, 40);
    noFill();
    rect(t2.xp - gfx2.width/2, t2.yp + gfx2.height/1.5, gfx2.width - 1, gfx2.height - 1);

    ptrace0.x = trace0.x;
    ptrace0.y = trace0.y;
    ptrace1.x = trace1.x;
    ptrace1.y = trace1.y;

    gfxAlpha = 0;
  }

  if (GAME_STATE == "outro") {
    textFont(font);
    textSize(48);

    fill(colors.type_contrast);
    noStroke();
    textFont(font);
    textAlign(CENTER);
    textSize(24);
    text(titles[titleSelect], width / 2 - width/8, height / 8, width/4);
    fill(colors.agent);
    textSize(18);
    text("TOUCH TO PLAY AGAIN", width / 2, height - height/12)
    fill(colors.type);
    textSize(16);
    text(texts[textSelect], width/2-width/8,height-height/3.5,width/4);

    noStroke();
    fill(255,gfxAlpha/20);
    triangle(width/3,height-height/3,width/2,height/5,width/3+width/3,height-height/3);

    fill(255,gfxAlpha/60);
    noStroke();
    rect(width/3,0,width/3,height);

    fill(255,gfxAlpha/30);
    arc(width/2,height-height/3,width/3,width/3,PI,0);
    stroke(255,10);
    strokeWeight(1);
    line(0,height-height/3,width,height-height/3);


    noFill();
    stroke(255,50);
    beginShape();
    let xoff = 0;
    noiseSeed(seed);
    for (let x = 0; x <= width/3; x += 10) {
      let y = map(noise(xoff, yoff), 0, 1, 200, 300);
      vertex(x + width/3, y + height/2-gfx1.height);
      xoff += 0.008;
    }
    yoff += 0.001;
    endShape();

    stroke(218, 90, 51,60);
    beginShape();
    noiseSeed(seed);
    for (let x = 0; x <= width/3; x += 10) {
      let y = map(noise(xoff, yoff), 0, 1, 200, 300);
      vertex(x + width/3, y + height/2-gfx1.height);
      //xoff += 0.001;
    }
    yoff += 0.001;
    endShape();

    tint(255,gfxAlpha);
    image(gfx1, width/2 - gfx2.width, height/2-gfx1.height, gfx1.width*2,gfx1.height*2);
    image(gfx2, width/2 - gfx2.width, height/2-gfx2.height, gfx2.width*2,gfx2.height*2);

    if(gfxAlpha<255) {
      gfxAlpha+=4;
    }

    // indicate winner ..?
    if (winnerID == 0) {} else {}
  }

  // check scores
  for (var i = 0; i < w.agents.length; i++) {
    if (w.agents[i].apples >= maxScore) {
      winnerID = i;
      loadAgents();
      w.items = [];
      GAME_STATE = "outro";
      drone.stop();

      fm2.triggerAttackRelease(Tone.Midi((random(6)+12) * 2).toFrequency(), "36n");

      textSelect = floor(random(texts.length));
      titleSelect = floor(random(titles.length));
    }
  }

  // save a static image based on URL queries
  if(!pngSaved) {
    if(saveStill) {
      saveCanvas(canvas, `frame`, 'png');
      saveStill = false;
    }
    if (page && seed) {
      saveCanvas(canvas, `${seed}_${page}`, 'png');
      pngSaved = true;
    }
  }
}

// URL Params
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const saveStill = urlParams.has('frame');
const seed = parseInt(urlParams.get("seed"));
const page = parseInt(urlParams.get("page"));

let firsttime = true;

function mousePressed() {
  down = true;
  myCursor = createVector(mouseX, mouseY);
  if (firsttime) {
    Tone.context.resume();
    firsttime = false;
  }

  if (GAME_STATE == "intro") {
    GAME_STATE = "play";
  }
  if (GAME_STATE == "outro") {
    gfx1.clear();
    gfx2.clear();
    pApples = [0, 0];
    pPoison = [0, 0];
    loadAgents();
    initStrings(floor(random(4)));
    GAME_STATE = "play";
    drone.start();
    w.items = [];
    generatePoisons();
    fm1.set({"harmonicity": harmonicities[floor(random(harmonicities.length))]});
    fm2.set({"harmonicity": harmonicities[floor(random(harmonicities.length))]});
  }

  if(GAME_STATE == "play") {
    if (typeof(t1) != "undefined") {
      t1.press();
    }
    if (typeof(t2) != "undefined") {
      t2.press();
    }
  }
}

function mouseReleased() {
  myCursor = createVector(mouseX, mouseY);
  down = false;

  if(GAME_STATE == "play") {
    t1.release();
    t2.release();
  }
}

function mouseMoved() {
  myCursor.x = mouseX;
  myCursor.y = mouseY;
}

function mouseDragged() {
  myCursor.x = mouseX;
  myCursor.y = mouseY;
}

function keyPressed() {}

function linedash(x1, y1, x2, y2, delta, style = '-') {
  // delta is both the length of a dash, the distance between 2 dots/dashes, and the diameter of a round
  let distance = dist(x1, y1, x2, y2);
  let dashNumber = distance / delta;
  let xDelta = (x2 - x1) / dashNumber;
  let yDelta = (y2 - y1) / dashNumber;

  for (let i = 0; i < dashNumber; i += 2) {
    let xi1 = i * xDelta + x1;
    let yi1 = i * yDelta + y1;
    let xi2 = (i + 1) * xDelta + x1;
    let yi2 = (i + 1) * yDelta + y1;

    if (style == '-') { line(xi1, yi1, xi2, yi2); } else if (style == '.') { point(xi1, yi1); } else if (style == 'o') { ellipse(xi1, yi1, delta / 2); }
  }
}

function windowResized() {
  setup()
}
