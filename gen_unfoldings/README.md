## Technical Support:
Starting December 16th, technical support will be available to help you ensure your project will work on the Generative Unfoldings website and meets the technical requirements for the browser-based exhibition and the book.

## Technical Requirements:


Commissioned works will generate a bitmap image file in PNG format when parameters of the following form are added to the commissioned work’s URL: ?seed=5460891&page=1. Here’s a quick guide to go about how to meeting them:

### Seeding

The goal of these URL parameters is to create the same 5 unique pages every time they are entered. 

So, if your work was randomly selecting elements from a JavaScript array and printing them: 

```
let poem = [“the”, “fog”, “comes”, “in”, “on”, “little”, “cat”, “feet”];
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

let index = getRandomInt(0, 8);
document.write(poem[index])
```

We would want our result to be something like:

?seed=12345&page=1
“Fog”
?seed=12345&page=2
“Cat”
?seed=12345&page=3
“Feet”
?seed=12345&page=4
“Little”
?seed=12345&page=5
“The”

To do this, we use a random seed, an integer value passed to our random number generator that “seeds” it so it will always produce the same set of values. A good example of random seeding is David Bau’s seedrandom, or p5.js’s built in randomSeed() function, which we could use like the following code snippet:

```
const params = new URLSearchParams(location.search)
const seed = parseInt(params.get("seed"));
const page = parseInt(params.get("page"));
function getRandomInt(min, max) {
  rng = new Math.seedrandom(seed/page)
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(rng() * (max - min) + min);
}
function genPoem() {
  const poem = ["the", "fog", "comes", "in", "on", "little", "cat", "feet"];
  const index = getRandomInt(0, 8);
  return poem[index]
}

word = genPoem();
document.write(word);
```

### PNG generation

To generate a PNG, we can use a tool like HTML2canvas to turn our existing HTML into a canvas object, then convert it to a png and automatically download it using JavaScript. Assuming you’re already using a canvas, you can simply skip the HTML2canvas step.

```
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
```
