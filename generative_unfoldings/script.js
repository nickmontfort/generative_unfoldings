const params = new URLSearchParams(location.search)
let page = params.get('page');
let seed = params.get('seed');

function getRandomInt(min, max) {
  const rng = new Math.seedrandom(seed/page)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min) + min);
}
function genPoem() {
  const poem = ["the", "fog", "comes", "in", "on", "little", "cat", "feet"];
  const index = getRandomInt(0, 8);
  return poem[index]
}

const word = genPoem();

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
