const params = new URLSearchParams(location.search)
const seed = parseInt(params.get("seed"));
const page = parseInt(params.get("page"));
const rng = new Math.seedrandom(seed);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min) + min);
}
function genPoem() {
  const poem = ["the", "fog", "comes", "in", "on", "little", "cat", "feet"];
  // this will produce a number sequence that is always the same based on the seed, but uses a different number for each page
  for (var i = 1; i <= page - 1; i++) {
    console.log(getRandomInt(0, 8));
  }
  const index = getRandomInt(0, 8)
  return poem[index];
}

word = genPoem();
document.write(word);

if (page && seed) {
  let container = document.body; // full page

  html2canvas(container, {
    width:2412,
    height: 3074
  }).then(function(canvas) {
    let a = document.createElement('a');
    a.href = canvas.toDataURL("image/png");
    a.download = seed + '_' + page + '.png';
    a.click();
  });

}
