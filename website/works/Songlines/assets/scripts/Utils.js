function initStrings(scaleSelect) {
  activestrings = [];

  let scales = [
                [1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0, 1,0,0,1,0,1,0,1,0,0,1,0],
                [1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0, 1,0,1,1,0,0,0,1,0,0,1,0],
                [1,0,0,0,0,0,1,0,0,0,0,0, 1,0,0,1,0,1,0,1,0,0,1,0, 1,1,1,1,1,1,1,1,1,1,1,1],
                [1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0, 1,0,1,1,0,1,0,1,0,0,1,0],
                [0,0,1,0,0,1,0,0,1,0,0,1, 0,0,1,0,0,1,0,0,1,0,0,1, 0,0,1,0,0,1,0,0,1,0,0,1],
                [0,0,0,0,0,0,0,0,0,0,0,0, 1,0,0,1,0,1,0,1,0,0,1,0, 0,0,0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1,1,1,1,1],
  ]

  for(let i=0; i<scales[scaleSelect].length; i++) {
    activestrings.push(scales[scaleSelect][i]);
  }
}

const colors = {
  bg: [0, 8, 10],
  wires: [255,20],
  agent: [218, 90, 51],
  positive_food: [255, 255, 255],
  negative_food: [46, 42, 21],
  type: [64, 80, 85, 220],
  type_contrast: [164,180,185,220],
  touch: [255, 150, 150, 100]
}


// Tonejs components

let r1 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.06
}).toDestination();

let r2 = new Tone.Reverb({
  decay: 10.5,
  preDelay: 0.01
}).toDestination();

const drone = new Tone.Player("assets/data/drone-bg-constant-bit.mp3").toDestination();
drone.loop = true;
drone.autostart = true;
drone.fadeOut = 3;


var feedbackDelay1 = new Tone.FeedbackDelay(0.2, 0.8).connect(r1);
let fm1 = new Tone.PolySynth(Tone.FMSynth).toDestination();
  fm1.set({"harmonicity": 10,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.01,
    "decay": 0.02,
    "sustain": 0.05,
    "release": 0.8
  },
  "modulation": {
    "type": "sine"
  },
  "modulationEnvelope": {
    "attack": 0.001,
    "decay": 0.02,
    "sustain": 0.03,
    "release": 0.6
  }

}).toDestination();
fm1.connect(feedbackDelay1);
fm1.volume.value = -8;

var feedbackDelay2 = new Tone.FeedbackDelay(0.2, 0.8).connect(r2);
let fm2 = new Tone.PolySynth(Tone.FMSynth).toDestination();
fm2.set({
  "harmonicity": 10,
  "modulationIndex": 30,
  "detune": 0,
  "oscillator": {
    "type": "sine"
  },
  "envelope": {
    "attack": 0.1,
    "decay": 0.2,
    "sustain": 0.3,
    "release": 0.4
  },
  "modulation": {
    "type": "square"
  },
  "modulationEnvelope": {
    "attack": 0.01,
    "decay": 0.1,
    "sustain": 0.2,
    "release": 0.4
  }});
fm2.connect(feedbackDelay2);
fm2.volume.value = -20;

let poisonSynth = new Tone.MembraneSynth().toDestination();
poisonSynth.volume.value = -28;

// app utilities
function addItem(p) {
  var newitx = p.x - (width - ww) / 2.0;
  var newity = p.y - (height - wh) / 3.0;
  var index = floor(newity / wh * stringnum + 1);
  var newitt = 1; // food or poison (1 and 2)
  if (activestrings[index] == 1) {
    var newit = new Item(newitx, index * wh / stringnum + wh / stringnum * 2, newitt, index);
    w.items.push(newit);
  }
}

function generateItems() {
  randomSeed(seed);
            
  for(let i=0; i<stringnum; i++) {
        for (let j=0;j<2;j++) {
          if (activestrings[i] == 1) {
            var nx = (random(ww)+width/2) - (width - ww) / 2.0;
            var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 1, i);
            w.items.push(newit);
          } 
    }    
  }
}

function generateRandomPoisons() {
    randomSeed(seed);
      for(let i=0; i<stringnum; i++) {
        for (let j=0;j<2;j++) {
          let p = map(random(i*j),0,i*j,width/2-ww/2,width/2+ww/2);
          var nx = p - (width - ww) / 2.0;
          var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
          if(activestrings[i]==0)w.items.push(newit);
          
        }    
      }
    }

function generatePoisons() {
  if(seed) randomSeed(seed);
  let sel = floor(random(7));
  switch(sel){
    case 0: // curve, triple
      if(seed) randomSeed(seed);
      let rnd3 = random(5,10);
      if(seed) randomSeed(seed);
      let rnd4 = random(0.05,0.2);
      if(seed) randomSeed(seed);
      let rnd5 = random(-ww/3,ww/3)
      for(let i=0; i<stringnum; i++) {
        for (let j=0;j<4;j++) {
          let p = map(j,0,4,width/2-ww/2,width/2+ww/2) + sin(i*rnd4) * rnd5;
          var nx = p - (width - ww) / 2.0;
          var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
          newit.v = new Vec(0, 0);
          newit.rad = 5;
          if(i>rnd3 && i<stringnum-rnd3) {
              if(j>0) w.items.push(newit);
          }
        }    
      }
      break;
    case 1: // curve, single
      if(seed) randomSeed(seed);
      let rnd1 = random(-0.1,0.1);
      if(seed) randomSeed(seed);
      let rnd2 = random(-ww/2.5,ww/2.5);
      for(let i=0; i<stringnum; i++) {
        let p = width/2 + sin(i*rnd1) * rnd2;
        var nx = p - (width - ww) / 2.0;
        var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
        newit.v = new Vec(0, 0);
        newit.rad = 5;
        w.items.push(newit); 
      }   
      break;
    case 2: // curve, double  
      if(seed) randomSeed(seed);
      let rnd0 = random(0.1,0.3);
      for(let i=0; i<stringnum; i++) {
        let p = width/2 + sin(i*rnd0) * ww/4;
        var nx = p - (width - ww) / 2.0;
        var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
        newit.v = new Vec(0, 0);
        newit.rad = 5;
        w.items.push(newit);   
      } 
      for(let i=0; i<stringnum; i++) {
        let p = width/2 + cos(i*0.1) * ww/4;
        var nx = p - (width - ww) / 2.0;
        var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
        newit.v = new Vec(0, 0);
        newit.rad = 5;
        w.items.push(newit);   
      } 
      break;
    case 3: // vertical, single 
      if(seed) randomSeed(seed);
      let rnd = random(10,20);
      for(let i=0; i<stringnum; i++) {
        let p = width/2;
        var nx = p - (width - ww) / 2.0;
        var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
        newit.v = new Vec(0, 0);
        newit.rad = 5;
        if(i>rnd && i<stringnum-rnd) {
          w.items.push(newit);
        }    
      }
      break;
    case 4: // vertical, multi
      if(seed) randomSeed(seed);
      let rnnd = random(10,20);
      for(let i=0; i<stringnum; i++) {
        for (let j=0;j<4;j++) {
          let p = map(j,0,4,width/2-ww/2,width/2+ww/2);
          var nx = p - (width - ww) / 2.0;
          var newit = new Item(nx, i * wh / stringnum + wh / stringnum * 2, 2, i);
          newit.v = new Vec(0, 0);
          newit.rad = 5;
          if(i>rnnd && i<stringnum-rnnd) {
            w.items.push(newit);
          }
        }    
      }
      break;
    case 5: // horizontal  
      for(let i=0; i<40; i++) {
        let p = map(i,0,40,width/2-ww/2,width/2+ww/2);
        var nx = p - (width - ww) / 2.0;
        var newit = new Item(nx, stringnum/2 * wh / stringnum + wh / stringnum * 2, 2, i);
        newit.v = new Vec(0, 0);
        newit.rad = 5;
        w.items.push(newit);   
      } 
      break;
    default:
      // add no items
  }
}

function resetAgents() {
  var brain = new RL.DQNAgent(env, spec);
  for (var i = 0; i < w.agents.length; i++) {
    w.agents[i].brain = brain;
  }
}

function loadAgents() {
  w.agents = [];

  for (var k = 0; k < 2; k++) {
    var a = new Agent(k);
    env = a;
    a.brain = new RL.DQNAgent(env, spec); // give agent a TD brain
    a.epsilon = 0.0002;
    if(k==0) {
      if(seed & page) {
        randomSeed(seed);
        a.p.x = random(0,ww);
        randomSeed(seed+163);
        a.p.y = random(0,wh);
      } else {
        a.p = new Vec(0, wh/2);
      }
      if(firsttime){
        t1.setPerception(a.eyes[0].max_range);
        t1.setReflex(a.speed);
      }
    } else {
      if(seed & page) {
        randomSeed(seed+2883);
        a.p.x = random(0,ww);
        randomSeed(seed+3333);
        a.p.y = random(0,wh);
      } else {
        a.p = new Vec(ww,wh/2);
      }
      ptrace0.x = 0;
      ptrace1.x = ww;
      if(firsttime){
        t2.setPerception(a.eyes[0].max_range);
        t2.setReflex(a.speed);
      }
    }
    w.agents.push(a);
    
    smooth_reward_history = []; // [][];
    smooth_reward = [];
    smooth_reward_history.push([]);
  }

  loadJSON("assets/data/agent_trained.json", function(data) {
    for (var i = 0; i < w.agents.length; i++) {
      var agent = w.agents[i].brain;
      agent.fromJSON(data); 
    }
  });
}

// generate lines for gfx saving

function gen(g,pts,a,b,c,d,...col) {
  noiseSeed(seed);
  randomSeed(seed);
  
  if(page<5) {  
    for(let i=0; i<maxScore*page/d; i++) {
      let x = map(i/random(b,c),0,maxScore/d,0,g.width);
      let y = noise(i*a);
      pts.push(createVector(x,map(y,0,1,0,g.height)));
    }
  } else {
    for(let i=0; i<maxScore/d; i++) {
      let x = map(i/random(b,c),0,maxScore/d,0,g.width);
      let y = noise(i*a);
      pts.push(createVector(x,map(y,0,1,0,g.height)));
    }
  }
  
  g.stroke(col[0],col[1],col[2],col[3]);
  g.noFill();
  
  g.line(pts[0].x,pts[0].y,pts[1].x,pts[1].y);
  g.line(pts[pts.length-1].x,pts[pts.length-1].y,pts[pts.length-2].x,pts[pts.length-2].y);
  
  for(let i=0; i<pts.length; i++) {
    g.fill(255);
    g.noStroke();
    g.ellipse(pts[i].x,pts[i].y,2,2);
    
    g.stroke(col[0],col[1],col[2],col[3]);
    g.noFill();
    
    if(i>3){
      g.strokeWeight(0.5);
      g.bezier(pts[i-3].x,pts[i-3].y,pts[i-2].x,pts[i-2].y,
                pts[i-1].x,pts[i-1].y,pts[i-2].x,pts[i-2].y);
    }
  }
}

function saveAgent() {
  var brain = w.agents[0].brain;
  // write out agent state to json here
  //let s = JSON.stringify(brain);
  //download(s, 'agent-state.json', 'text/plain');
}

function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(a.href);
}
