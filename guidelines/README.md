## Technical Support:
Starting December 16th, [technical support](mailto:brentlbailey@gmail.com) will be available to help you ensure your project will work on the Generative Unfoldings website and meets the technical requirements for the browser-based exhibition and the book.

## Technical Requirements:

Commissioned works will generate a bitmap image file in PNG format when parameters of the following form are added to the commissioned work’s URL: ?seed=5460891&page=1. Here’s a quick guide to go about how to meeting them - a working code example is in `script.js`, which can be viewed by opening `index.html` in your browser:

### Seeding

The goal of these URL parameters is to create the same 5 unique pages every time they are entered. 

So, if your work is randomly selecting elements from a JavaScript array and writing them to a page:

```
const poem = ["the", "fog", "comes", "in", "on", "little", "cat", "feet"];
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}

const index = getRandomInt(0, 8);
document.write(poem[index]);
```

You would want your result when the parameters are supplied to be something like:

?seed=12345&page=1

"Fog"


?seed=12345&page=2

"Cat"


?seed=12345&page=3

"Feet"

Where *every time* those seeds and page numbers are put into the URL, you get the same outcome.

To do this, you use a random seed, an integer value passed to a random number generator that "seeds" it so it will always produce the same set of values in order (this is actually [how most random number generators work](https://www.freecodecamp.org/news/random-number-generator/)). Unfortunately, JavaScript doesn’t have a built in seeding method, but some examples random seeding built on top of JavaScript are David Bau’s [seedrandom](https://github.com/davidbau/seedrandom) and p5.js’s built in [randomSeed()](https://p5js.org/reference/#/p5/randomSeed) function. So to get the desired outcome of unique, but repeatable pages on the project above, we can do change it to look like this:

```
const params = new URLSearchParams(location.search);
const seed = parseInt(params.get("seed"));
const page = parseInt(params.get("page"));
//create a random number generator with our designated seed
const rng = new Math.seedrandom(seed);

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  //call our seeded random number generator
  return Math.floor(rng() * (max - min) + min);
  }

function genPoem() {
  const poem = ["the", "fog", "comes", "in", "on", "little", "cat", "feet"];

  // this will produce a number sequence that is always the same based on the seed
  // so, if we use the seed 12345, the page 1 index will always be 7, the page 2 will always be 0, and so on ad infinitum
  for (var i = 1; i <= page - 1; i++) {
    // every time this is called, it hits our random number generator inside the getRandomInt function
      getRandomInt(0, 8);
    }
  const index = getRandomInt(0, 8);
  return poem[index];
}

word = genPoem();
document.write(word);
```

### PNG generation

To generate a PNG, you can use a tool like [HTML2canvas](https://html2canvas.hertzen.com) to turn your existing HTML into a canvas object, then convert it to a png and automatically download it using JavaScript. Assuming you’re already using a canvas, you can simply skip the HTML2canvas step. An example is below:

```
const params = new URLSearchParams(location.search)
const seed = parseInt(params.get("seed"));
const page = parseInt(params.get("page"));

if (page && seed) {
  let container = document.body; // take our full page

  html2canvas(container, { // turn it into a canvas object
    width:2412,
    height: 3074
  }).then(function(canvas) {

    // create a link to a png version of our canvas object, then automatically start downloading it
    let a = document.createElement('a');
    a.href = canvas.toDataURL("image/png");
    a.download = seed + '_' + page + '.png';
    a.click();
  });

}
```
