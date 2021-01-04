const params = new URLSearchParams(location.search);
const test = parseInt(params.get("test"));
const seed = parseInt(params.get("seed"));
let page = parseInt(params.get("page"));
let pngMode = false;
const w = page != 1 ? 2412 : 3074;
const h = page != 1 ? 3074 : 2412;

$(document).ready(function() {
  if (test){
    testSingularize();
    return;
  }
  // replace seed
  if (seed) {
    Math.seedrandom(seed);
    noise.seed(seed);
  } else {
    noise.seed(Math.random());
  }
  // if page
  if (page) {
    pngMode = true;
    let textIdx = page;
    $(".content").addClass("print");
    $("#aboutButton").hide();
    ANIME = false;
    //margin before init canvas
    margin.left = 200;
    if (page == 1) {
      margin.left = 50;
      textIdx = 5 // switch horizontal page to first page
    } else if (page == 5) {
      margin.left = 250;
      textIdx = 1;
    } else if (page == 3) {
      textIdx = 6;
    } else if (page == 6) {
      textIdx = 3;
    }
    initSvgCanvas(w, h, 28);
    // if(page==1) $('#svg').css("transform", "rotate(-90deg)");
    initializeSoil(textIdx, true, function() {
      // plant specific plants without animation
      switch (textIdx) {
        case 1:
          plantByList({
            0: "pine",
            19: "plant",
            37: "bamboo",
            46: "ginkgo",
          })
          break;
        case 2:
          plantByList({
            1: "ivy",
            6: "ivy",
            11: "ivy",
            20: "ivy",
            23: "ivy",
            27: "ivy",
            35: "ivy",
            41: "ivy",
            46: "ivy"
          })
          break;
        case 3:
          plantByList({
            0: "pine",
            3: "dandelion",
            21: "ginkgo",
            46: "bamboo",
            55: "bamboo",
            64: "pine",
            68: "ginkgo"
          })
          break;
        case 4:
          let flags = {
            1: true,
            2: true,
            3: true
          };
          for (let i = 0; i < 20; i++) {
            const idx = getRandomInt(soilOder.length);
            const id = soilOder[idx];
            const s = soil[id];
            const newX = s.x + getRandomIntInclusive(-50, 50),
              newY = s.y + getRandomIntInclusive(500, 1500);
            s.updatePos(newX, newY)
            if (newX > 300 && newX < 500 && flags[1]) {
              plantByIdx(idx, "plant");
              flags[1] = false;
            } else if (newX > 900 && newX < 1200 && flags[2]) {
              plantByIdx(idx, "plant");
              flags[2] = false;
            } else if (newX > 1600 && flags[3]) {
              plantByIdx(idx, "plant");
              flags[3] = false;
            }
          }
          break;
        case 5:
          plantByList({
            14: "pine",
            28: "pine",
            30: "pine",
            32: "bamboo",
            33: "bamboo",
            41: "pine",
            44: "pine",
            46: "pine",
            47: "bamboo",
            51: "bamboo",
            53: "bamboo",
            55: "bamboo"
          })
          break;
        case 6:
          plantByList({
            0: "dandelion",
            4: "ginkgo",
            13: "ginkgo",
            20: "ivy",
            33: "ivy",
            46: "ginkgo",
            49: "ivy",
            53: "pine"
          })
          break;

        default:
      }
      setTimeout(exportPNG, 2000);
    });
  } else {
    const textIdx = getRandomIntInclusive(1, 5);
    if (textIdx == 2 && WIDTH > 1000) margin.left = 200;
    initSvgCanvas(WIDTH, HEIGHT);
    initializeSoil(textIdx, false, function() {
      const targetIdx = getRandomInt(10);
      clickSoilWordByIdx(targetIdx);
    });
    adjustView(Y_OFFSET + 300, 2000);
  }
});

function plantByList(list) {
  for (const key in list) {
    plantByIdx(key, list[key]);
  }
}

function plantByIdx(idx, type) {
  const target = soil[soilOder[idx]];
  //console.log("Init:", target.text)
  if (target != undefined) {
    const domain = getClosestSoilText(target);
    plant(target.text, domain, type, Math.floor(target.x) - 200, Math.floor(target.y));
  } else {
    console.log("target undefined", idx);
  }

}

function clickSoilWordByIdx(idx) {
  const target = soil[soilOder[idx]];
  //console.log("Init:", target.text)
  target.dblclick();
}

function exportPNG() {
  console.log("Prepare PNG Export")
  // Pages: export page w/h; Sketch : svg w/h
  html2canvas(document.body, { // turn it into a canvas object
    width: isNaN(page) ? $('svg').width() : w,
    height: isNaN(page) ? $('svg').height() : h
  }).then(function(canvas) {
    // create a link to a png version of our canvas object, then automatically start downloading it
    let a = document.createElement('a');
    a.href = canvas.toDataURL("image/png");
    a.download = isNaN(page) ? "seedlings_FromHumus.png" : seed + '_' + page + '.png';
    a.click();
  });
}

document.body.onkeyup = function(e) {
  if (e.keyCode == 32) {
    exportPNG();
  }
}
