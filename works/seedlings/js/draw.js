
/************** Parameters  *****************/

// The margin of the svg canvas
let margin = {
    top: 20,
    right: 50,
    bottom: 20,
    left: 50
  };

  // if it's in iframe,check width
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  }
  // window.alert("current size:" + myWidth + " " + myHeight);

// Canvas parameters
const WIDTH = window.innerWidth > 900 ? window.innerWidth : 900,
  HEIGHT = 1000,
  MAX_PLANTS = 13;

let X_OFFSET = 50,
  Y_OFFSET = 700, // offset values for the soil
  PARA_MARGIN = X_OFFSET + margin.left,
  LINE_HEIGHT = FONT_SIZE * 2, // line height for soil layout
  PARA_WIDTH = 820, // max width of the paragraph
  SPACE_WIDTH = 10, // the width of a space
  RIGHT_EDGE = window.innerWidth - PARA_MARGIN > PARA_MARGIN + PARA_WIDTH ?
  PARA_MARGIN + PARA_WIDTH : window.innerWidth - PARA_MARGIN;

/************** End of Parameters  *****************/
// global data
let plants = {}; // All the plants
let soil = {}; // The soil object
let soilOder = []; // A list of soil id
/**********************************/

function initSvgCanvas(w, h, fontSize) {
  if (fontSize) {
    FONT_SIZE =  fontSize;
    DASH_STYLE = FONT_SIZE / 2 + ", " + FONT_SIZE / 2;
    LINE_HEIGHT = FONT_SIZE * 2;
    PARA_WIDTH = 1510; // max width of the paragraph
    SPACE_WIDTH = FONT_SIZE * 0.57;
    PARA_MARGIN = X_OFFSET + margin.left,
      RIGHT_EDGE = PARA_MARGIN + PARA_WIDTH;
    // update fontsize for test & vertical test
    $("#Test, #verticalTest").css("font-size", fontSize + "px");
  }

  const svg = d3.select(".content").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("transform", "translate(" + margin.left + "," + 0 + ")")
    .attr("class", "wrapper")
    .attr("font-size", FONT_SIZE + "px");

  const soilSVG = svg.append("g")
    .attr("id", "soil");
}

function checkIntersections(r) {
  const rootId = r.id,
    x = r.currentPos.x,
    y = r.currentPos.y,
    x1 = r.nextPos.x,
    y1 = r.nextPos.y;
  // RootID - "_root" = plantID
  const plantId = rootId.split("_")[0];
  for (let i = 0; i < soilOder.length; i++) {
    const s = soil[soilOder[i]];
    let b = s.boundingBox;
    const collid = lineRect(x, y, x1, y1, b.x, b.y, b.width, b.height);
    // only true if the plant if it is a new domain
    if (!r.plant.collision && collid) {
      r.plant.collision = true;
      //console.log("collid", r.plant.collision)
      const newW = singularize(s.text).toLowerCase();
      const pos = RiTa.pos(newW)[0];
      if (newW.indexOf("’") > 0) return;
      if (r.plant.lookFor && pos.indexOf(r.plant.lookFor) < 0) {
        console.log("The word is not what the plant looks for.", newW, pos);
        return;
      }
      const plant = plants["" + plantId];

      if (plant == undefined) {
        // TODO: fix
        // console.log("plant undefined")
        return;
      }
      if (plant.domainHistory.indexOf(newW) > -1 || newW == plant.word) {
        //console.log("Duplicate domain or domain is same as seed, skip");
        r.plant.collision = false;
        return;
      }
      plant && plant.updateDomain(newW, RiTa.LANCASTER);
      // clear root
      clearInterval(r.timer);
      // keep the same seed if it is on localServer
      r.plant.next = destination == "localStorage" ? r.plant.word : r.plant.endWord;
      //console.log("regenerate");
      setTimeout(r.plant.reGenerate(), 2000);
    }
  }
  return false;
}

function lineRect(x1, y1, x2, y2, rx, ry, rw, rh) {
  // Modified from: http://www.jeffreythompson.org/collision-detection/line-rect.php

  function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
    // calculate the direction of the lines
    const uA = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));
    const uB = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // if uA and uB are between 0-1, lines are colliding
    if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
      // const intersectionX = x1 + (uA * (x2-x1));
      // const intersectionY = y1 + (uA * (y2-y1));
      return true;
    }
    return false;
  }
  // check if the line has hit any of the rectangle's sides
  // uses the Line/Line function below
  const left = lineLine(x1, y1, x2, y2, rx, ry, rx, ry + rh),
    right = lineLine(x1, y1, x2, y2, rx + rw, ry, rx + rw, ry + rh),
    top = lineLine(x1, y1, x2, y2, rx, ry, rx + rw, ry),
    bottom = lineLine(x1, y1, x2, y2, rx, ry + rh, rx + rw, ry + rh);

  // if ANY of the above are true, the line
  // has hit the rectangle
  if (left || right || top || bottom) {
    return true;
  }
  return false;
}

function testSingularize() {
  jQuery.get('text.txt', function(data) {
    const allContexts = data.split("________________");
    for (let i = 0; i < allContexts.length; i++) {
      let soil = allContexts[i];
      const words = RiTa.tokenize(soil);
      for (let j = 0; j < words.length; j++) {
        if (!punctuations.includes(w) && !stopWords.includes(w)) {
          const w = words[j];
          console.log(w, singularize(w),RiTa.stem(w))
        }
      }
    }

    });
}

function initializeSoil(page, pageMode, callback) {
  const initialY = Y_OFFSET,
    initialX = margin.left + X_OFFSET;
  let xPos = initialX,
    yPos = initialY;
  let rightMostXPos = xPos;

  if(pageMode) PAGE_MODE = true;

  console.log("Initialize Text:", page)
  $("#pages ul li:eq(" + (page-1) + ")") .addClass("current");

  jQuery.get('text.txt', function(data) {
    const allContexts = data.split("________________");
    const textIdx = page != undefined ? (page - 1) : getRandomInt(allContexts.length);
    let soil = allContexts[textIdx];
    const lines = soil.split("\n").length;
    soil = soil.replace(/\n/g, " _lineBreak_ ");
    soil = soil.replace(/\s{2,}/g, function(match) {
      match = match.replace(/ /g, "+")
      return " " + match + " ";
    });
    const words = RiTa.tokenize(soil);
    for (let i = 0; i < words.length; i++) {
      const w = words[i],
        nextW = (i != words.length - 1) ? words[i + 1] : "";

      function lineBreak() {
        yPos += LINE_HEIGHT;
        xPos = initialX;
      }
      if (w == "_lineBreak_") {
        lineBreak();
      } else if (w.indexOf('+') > -1) {
        xPos += w.length * SPACE_WIDTH;
      } else {
        if (punctuations.includes(w)) xPos -= SPACE_WIDTH;
        const t = new SoilWord(w, xPos, yPos, true);
        // console.log(t.text, t.boundingBox.width);
        xPos += (t.boundingBox.width + SPACE_WIDTH);
        if (xPos > WIDTH && xPos > rightMostXPos) rightMostXPos = xPos;

        if (textIdx != 4 && xPos > RIGHT_EDGE &&
          !punctuations.includes(nextW) && nextW != "+") lineBreak();
      }
    }
    // update HEIGHT
    if (!pageMode) {
      updateD3CanvasHeight(yPos + PARA_MARGIN);
      if (rightMostXPos > WIDTH) {
        updateD3CanvasWidth(rightMostXPos + PARA_MARGIN + margin.right);
      }
    }
    callback();
  })


}

function updateD3CanvasHeight(newH) {
  if (newH < HEIGHT || pngMode) return;
  d3.select("svg").attr("height", newH);
}

function updateD3CanvasWidth(newW) {
  d3.select("svg").attr("width", newW);
}


function guid() {
  // Reference: https://slavik.meltser.info/the-efficient-way-to-create-guid-uuid-in-javascript-with-explanation/
  function _random_letter() {
    return String.fromCharCode(97 + Math.floor(Math.random() * 26));
  }

  function _p8(s) {
    const p = (Math.random().toString(16) + "000000000").substr(2, 8);
    return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : _random_letter() + p.substr(0, 7);
  }
  return _p8() + _p8(true) + _p8(true) + _p8();
}

function plant(word, domain, p, x, y, delay = 0) {

  if (Object.keys(plants).length >= MAX_PLANTS) {
    alert("Too many plants on this page! Please remove some plants or refresh the page to start again.")
    return;
  }

  // singularize & lowercase
  word = singularize(word).toLowerCase();
  domain = singularize(domain).toLowerCase();

  const data = {
    "id": guid(),
    "type": p,
    "seed": word,
    "domain": domain,
    "x": x + LEFT_MARGIN,
    "y": y,
  };

  setTimeout(function() {
    const plant = new PLANTS[p](data);
    plant.draw();
    plant.grow();
    plant.animate();
  }, delay)

  console.log("Plant", word, "in", domain, "as", p, Object.keys(plants).length);
}

function generateSequence(word, domain, x, y) {
  const id = 0;
  const LIMIT = 5;
  let lastEndPos, lastWord;

  function f(id) {
    const p = randomPlant();
    // var p = "plant";
   const data = {
      "id": id,
      "type": p,
      "seed": lastWord ? lastWord : word,
      "domain": domain,
      "x": lastEndPos ? lastEndPos.x + Math.random() * 400 - 200 : WIDTH / 2,
      "y": lastEndPos ? lastEndPos.y - 200 : HEIGHT - 20,
    }
    const plant = new PLANTS[p](data);
    plant.getResult(function() {
      adjustView(plant.y);
      plant.draw();
      plant.animate();
      lastAnimationTime = plant.totalAnimation;
      console.log(plant.endPos);
      lastEndPos = plant.endPos;
      lastWord = plant.endWord;
      console.log(plant.endWord);

      if (id < LIMIT) {
        id += 1;
        setTimeout(function() {
          f(id);
        }, lastAnimationTime);
      }
    })
  }

  if (id == 0) f(id);
}

function anime(g) {
  if (ANIME) {
    setTimeout(function() {
      g.classed("show", true);
    }, 100);
  }
}

/******* Randomness *******/
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}


function getRandomItem(obj) {
  const keys = Object.keys(obj);
  return obj[keys[keys.length * Math.random() << 0]];
};

function randomPlant(w) {
  let keys = Object.keys(PLANTS);
  if (w && w.length <=3) {
     removeItemOnce(keys, "pine");
  }
  // !!! text specific
  if (w && w == "cisgender") {
    removeItemOnce(keys, "plant");
    console.log("no plant", keys)
  }
  return keys[keys.length * Math.random() << 0];
};

/******* Randomness *******/
function removeItemOnce(arr, value) {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function getTextWidth(text, isVertical) {
  let test = isVertical ? document.getElementById("verticalTest") : document.getElementById("Test");
  test.innerHTML = text;
  return isVertical ? test.clientHeight : test.clientWidth;
}

function adjustView(y, time) {
  y = y - window.innerHeight + 200;
  $('html,body').animate({
    scrollTop: y + "px"
  }, time != undefined ? time : 3000);
}

function removePlantById(id) {
  $('#' + id).remove();
  delete plants[id];
  console.log("Total Plants:", Object.keys(plants).length);
}

function singularize(word) {
  // !!! text specific
  let w = RiTa.singularize(word.toLowerCase());
  // fixes
  if (w == "waf" && word == "waves") w = "wave"
  if (w == "knif" && word == "knives") w = "knife"
  if (word == "senses") w = "sense"
  // remove es
  const removeEs = ["dishes", "goes", "potatoes", "paradoxes", "ashes"];
  if (removeEs.includes(word.toLowerCase())) w = word.slice(0, -2)

  // stay the same
  const noChange = ["bottomless", "mindless", "glass", "undress", "miss", "hypothesis",
  "unconscious", "superstitious",  "autonomous", "caress","carcass", "ludicrous", "perhaps"];
  if (noChange.includes(word.toLowerCase())) w = word;

  return w;
}

function shuffle(array) {
  let currentIndex = array.length,
    temporaryValue, randomIndex;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function clearCanvas() {
  $("#pages li").removeClass("current");
  $("#soil" ).empty();
  $("svg g.seedling").remove();
  plants = {}; // All the plants
  soil = {}; // The soil object
  soilOder = []; // A list of soil id
}

$(document).ready(function() {
  $(".content").click(function() {
    $('.contextMenu').hide();
    $('body').removeClass("rightClicked");
  })

  $("#closeButton").click(function() {
    $('#about').hide();
  })

  $("#aboutButton").click(function() {
    $('#about').toggle();
  })

  $("#pages ul li" ).click(function() {
    const textIdx = $(this).attr("idx");
    clearCanvas();
    initializeSoilWithRandomPlant(textIdx);
    adjustView(Y_OFFSET + 300, 2500);
  });

});

// $(window).on('resize', function(){
//   // if window.innerWidth changes, adjustcanvas
//  console.log("resize");
//  window.alert("current size:" + window.innerWidth + " " + window.innerHeight);
//   var win = $(this); //this = window
//   // if (win.width() >= 900 ) {
//   //   updateD3CanvasWidth(win.width());
//   // }
// });

