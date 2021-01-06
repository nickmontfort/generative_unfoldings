var randf = function(lo, hi) { return Math.random() * (hi - lo) + lo; }
var randi = function(lo, hi) { return Math.floor(randf(lo, hi)); }

var lastAppleY = 0;
var stringnum = 36.0; // two octaves made of semitones

// A 2D vector utility
var Vec = function(x, y) {
  this.x = x;
  this.y = y;
}

Vec.prototype = {
  dist_from: function(v) { return Math.sqrt(Math.pow(this.x - v.x, 2) + Math.pow(this.y - v.y, 2)); },
  length: function() { return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)); },
  add: function(v) { return new Vec(this.x + v.x, this.y + v.y); },
  sub: function(v) { return new Vec(this.x - v.x, this.y - v.y); },
  rotate: function(a) { // CLOCKWISE
    return new Vec(this.x * Math.cos(a) + this.y * Math.sin(a),
      -this.x * Math.sin(a) + this.y * Math.cos(a));
  },
  scale: function(s) {
    this.x *= s;
    this.y *= s;
  },
  normalize: function() {
    var d = this.length();
    this.scale(1.0 / d);
  }
}

var line_intersect = function(p1, p2, p3, p4) {
  var denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
  if (denom === 0.0) { return false; } // parallel lines
  var ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
  var ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;
  if (ua > 0.0 && ua < 1.0 && ub > 0.0 && ub < 1.0) {
    var up = new Vec(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
    return { ua: ua, ub: ub, up: up }; // up is intersection point
  }
  return false;
}


var line_point_intersect = function(p1, p2, p0, rad) {
  var v = new Vec(p2.y - p1.y, -(p2.x - p1.x)); // perpendicular vector
  var d = Math.abs((p2.x - p1.x) * (p1.y - p0.y) - (p1.x - p0.x) * (p2.y - p1.y));
  d = d / v.length();
  if (d > rad) { return false; }

  v.normalize();
  v.scale(d);
  var up = p0.add(v);
  if (Math.abs(p2.x - p1.x) > Math.abs(p2.y - p1.y)) {
    var ua = (up.x - p1.x) / (p2.x - p1.x);
  } else {
    var ua = (up.y - p1.y) / (p2.y - p1.y);
  }
  if (ua > 0.0 && ua < 1.0) {
    return { ua: ua, up: up };
  }
  return false;
}

var Wall = function(p1, p2) {
  this.p1 = p1;
  this.p2 = p2;
}

var util_add_box = function(lst, x, y, w, h) {
  lst.push(new Wall(new Vec(x, y), new Vec(x + w, y)));
  lst.push(new Wall(new Vec(x + w, y), new Vec(x + w, y + h)));
  lst.push(new Wall(new Vec(x + w, y + h), new Vec(x, y + h)));
  lst.push(new Wall(new Vec(x, y + h), new Vec(x, y)));
}

var Item = function(x, y, type, index) {
  this.p = new Vec(x, y); // position
  this.v = new Vec((Math.random() - 0.5) * 2, 0);
  this.index = index;
  this.type = type;
  this.rad = 10; // default radius
  this.age = 0;
  this.cleanup_ = false;
}

var World = function(w, h) {
  this.agents = [];
  this.W = w;
  this.H = h;
  this.clock = 0;
  this.walls = [];
  var pad = 0;
  util_add_box(this.walls, pad, pad, this.W - pad * 2 - 1, this.H - pad * 2 - 1);
  this.items = [];
}

World.prototype = {
  stuff_collide_: function(p1, p2, check_walls, check_items) {
    var minres = false;

    if (check_walls) {
      for (var i = 0, n = this.walls.length; i < n; i++) {
        var wall = this.walls[i];
        var res = line_intersect(p1, p2, wall.p1, wall.p2);
        if (res) {
          res.type = 0; // 0 is wall
          if (!minres) { minres = res; } else {
            // check if its closer
            if (res.ua < minres.ua) {
              // if yes replace it
              minres = res;
            }
          }
        }
      }
    }

    if (check_items) {
      for (var i = 0, n = this.items.length; i < n; i++) {
        var it = this.items[i];
        var res = line_point_intersect(p1, p2, it.p, it.rad);
        if (res) {
          res.type = it.type; // store type of item
          res.vx = it.v.x; // velocty information
          res.vy = it.v.y;
          if (!minres) { minres = res; } else {
            if (res.ua < minres.ua) { minres = res; }
          }
        }
      }
    }

    return minres;
  },
  tick: function() {
    // tick the environment
    this.clock++;

    // process eyes
    this.collpoints = [];
    for (var i = 0, n = this.agents.length; i < n; i++) {
      var a = this.agents[i];
      for (var ei = 0, ne = a.eyes.length; ei < ne; ei++) {
        var e = a.eyes[ei];
        // we have a line from p to p->eyep
        var eyep = new Vec(a.p.x + e.max_range * Math.sin(a.angle + e.angle),
          a.p.y + e.max_range * Math.cos(a.angle + e.angle));
        var res = this.stuff_collide_(a.p, eyep, true, true);
        if (res) {
          // eye collided with wall
          e.sensed_proximity = res.up.dist_from(a.p);
          e.sensed_type = res.type;
          if ('vx' in res) {
            e.vx = res.vx;
            e.vy = res.vy;
          } else {
            e.vx = 0;
            e.vy = 0;
          }
        } else {
          e.sensed_proximity = e.max_range;
          e.sensed_type = -1;
          e.vx = 0;
          e.vy = 0;
        }
      }
    }

    // let the agents behave in the world based on their input
    for (var i = 0, n = this.agents.length; i < n; i++) {
      this.agents[i].forward();
    }

    // apply outputs of agents on evironment
    for (var i = 0, n = this.agents.length; i < n; i++) {
      var a = this.agents[i];
      a.op = a.p; // back up old position
      a.oangle = a.angle; // and angle

      // execute agent's desired action
      if (a.action === 0) {
        a.v.x += -a.speed;
      }
      if (a.action === 1) {
        a.v.x += a.speed;
      }
      if (a.action === 2) {
        a.v.y += -a.speed;
      }
      if (a.action === 3) {
        a.v.y += a.speed;
      }

      var tmpv = createVector(a.v.x, a.v.y);
      a.heading = tmpv.heading();

      // forward the agent by velocity
      a.v.x *= 0.95; //a.speed;
      a.v.y *= 0.95; //a.speed;
      a.p.x += a.v.x;
      a.p.y += a.v.y;

      // handle boundary conditions.. bounce agent
      if (a.p.x < 1) {
        a.p.x = 1;
        a.v.x = 0;
        a.v.y = 0;
      }
      if (a.p.x > this.W - 1) {
        a.p.x = this.W - 1;
        a.v.x = 0;
        a.v.y = 0;
      }
      if (a.p.y < 1) {
        a.p.y = 1;
        a.v.x = 0;
        a.v.y = 0;
      }
      if (a.p.y > this.H - 1) {
        a.p.y = this.H - 1;
        a.v.x = 0;
        a.v.y = 0;
      }
    }

    // tick all items
    var update_items = false;
    for (var j = 0, m = this.agents.length; j < m; j++) {
      var a = this.agents[j];
      a.digestion_signal = 0; // important - reset this!
    }
    for (var i = 0, n = this.items.length; i < n; i++) {
      var it = this.items[i];
      it.age += 1;

      // see if some agent gets lunch
      for (var j = 0, m = this.agents.length; j < m; j++) {
        var a = this.agents[j];
        var d = a.p.dist_from(it.p);
        if (d < it.rad + a.rad) {

          // wait lets just make sure that this isn't through a wall
          var rescheck = false;
          if (!rescheck) {
            // ding! nom nom nom
            if (it.type === 1) {
              a.digestion_signal += 1.0; // mmm delicious apple
              a.apples++;
              lastAppleY = it.index;
            }
            if (it.type === 2) {
              a.digestion_signal += -1.0; // ewww poison
              a.poison++;
            }
            it.cleanup_ = true;
            update_items = true;
            break; // break out of loop, item was consumed
          }
        }
      }

      // move the items
      it.p.x += it.v.x;
      if (it.p.x <= 1) {
        it.cleanup_ = true;
        update_items = true;
      }
      if (it.p.x > this.W - 1) {
        it.cleanup_ = true;
        update_items = true;
      }

      if (it.age > 5000 && this.clock % 100 === 0 && randf(0, 1) < 0.1) {
        it.cleanup_ = true; // replace this one, has been around too long
        update_items = true;
      }
    }
    if (update_items) {
      var nt = [];
      for (var i = 0, n = this.items.length; i < n; i++) {
        var it = this.items[i];
        if (!it.cleanup_) nt.push(it);
      }
      this.items = nt; // swap
    }
    if (this.items.length < 60 && this.clock % 4 === 0 && randf(0, 1) < 0.5) {
      var rnd = int(random(stringnum));
      var newitx = random(this.W);
      var newity = rnd * this.H / stringnum + this.H / stringnum * 2; //randf(20, this.H-20);
      var newitt; // food or poison (1 and 2)
      if (activestrings[rnd] == 1) {
        // do not add active note in itemlist
      } else {
        newitt = 2;
        var newit = new Item(newitx, newity, newitt, rnd);
        this.items.push(newit);
      }
    }

    // agents are given the opportunity to learn based on feedback of their action on environment
    for (var i = 0, n = this.agents.length; i < n; i++) {
      this.agents[i].backward();
    }
  }
}

// Eye sensor has a maximum range and senses walls
var Eye = function(angle) {
  this.angle = angle; // angle relative to agent its on
  this.max_range = Math.random() * 100 + 80; // between 80-180
  this.sensed_proximity = 120; // what the eye is seeing. will be set in world.tick()
  this.sensed_type = -1; // what does the eye see?
  this.vx = 0; // sensed velocity
  this.vy = 0;
}

// A single agent
var Agent = function(id) {
  this.id = id;

  // positional information
  this.p = new Vec(0, 0);
  this.v = new Vec(0, 0);
  this.speed = Math.random() * 0.1 + 0.05; // between 0.1 - 0.15
  this.op = this.p; // old position
  this.angle = 0; // direction facing
  this.heading = 0;

  this.actions = [];
  this.actions.push(0);
  this.actions.push(1);
  this.actions.push(2);
  this.actions.push(3);

  // properties
  this.rad = 10;
  this.eyes = [];
  for (var k = 0; k < 30; k++) { this.eyes.push(new Eye(k * 0.21)); }

  this.brain = null; // set from outside

  this.reward_bonus = 0.0;
  this.digestion_signal = 0.0;

  this.apples = 0;
  this.poison = 0;

  // outputs on world
  this.action = 0;

  this.prevactionix = -1;
  this.num_states = this.eyes.length * 5 + 2;
}

Agent.prototype = {
  getNumStates: function() {
    return this.num_states;
  },
  getMaxNumActions: function() {
    return this.actions.length;
  },
  forward: function() {
    // in forward pass the agent simply behaves in the environment
    // create input to brain
    var num_eyes = this.eyes.length;
    var ne = num_eyes * 5;
    var input_array = new Array(this.num_states);
    for (var i = 0; i < num_eyes; i++) {
      var e = this.eyes[i];
      input_array[i * 5] = 1.0;
      input_array[i * 5 + 1] = 1.0;
      input_array[i * 5 + 2] = 1.0;
      input_array[i * 5 + 3] = e.vx; // velocity information of the sensed target
      input_array[i * 5 + 4] = e.vy;
      if (e.sensed_type !== -1) {
        // sensed_type is 0 for wall, 1 for food and 2 for poison.
        // lets do a 1-of-k encoding into the input array
        input_array[i * 5 + e.sensed_type] = e.sensed_proximity / e.max_range; // normalize to [0,1]
      }
    }
    // proprioception and orientation
    input_array[ne + 0] = this.v.x;
    input_array[ne + 1] = this.v.y;
    this.action = this.brain.act(input_array);
  },
  backward: function() {
    var reward = this.digestion_signal;
    this.last_reward = reward; // for vis
    this.brain.learn(reward);
  }
}
