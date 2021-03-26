/*

	CURSE OF DIMENSIONALITY
	Philipp Schmitt, 2020

*/

// Get n randomly selected elements from an array
// Reference: https://stackoverflow.com/a/7159251
const getRandomArrayElements = (arr, n) => {
  var shuffled = arr.slice(0), i = arr.length, min = i - n, temp, index;
  while (i-- > min) {
      index = Math.floor((i + 1) * Math.random());
      temp = shuffled[index];
      shuffled[index] = shuffled[i];
      shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

// Custom random function to get more of a gaussian distribution
// Reference: https://riptutorial.com/javascript/example/8330/random--with-gaussian-distribution
const random = (min,max) => {
	let n = (Math.random() + Math.random() + Math.random()) / 3;
	if(min && max) {
		return n * (max - min) + min;
	} else {
		return n;
	}
}

// PARSE URL
let url = new URL(window.location.href.replace(',page', '&page'));
let seed = url.searchParams.get("seed"),
		page = url.searchParams.get("page");

// VARS / SETTINGS
let captions,
		resolution,
		// Select Print or Screen Mode
		print = (seed!=null&&page!=null) ? true : false,
		// Canvas-specific settings
		canvas = document.querySelector('#canvas'),
		ctx = canvas.getContext('2d'),
		fontSize = 42,
		trim = 37, // ~ 3mm page trim
		marginBottom = 150, // 1/2 inch bottom margin
		typeface = 'Computer Modern';

// PRINT-SPECIFIC SETTINGS
if(print) {
	resolution = [2412, 3074]; // [x, y]
	// Seed random from URL
	// First, only primary seed to select 5 captions from same seed
	Math.seedrandom(seed);
	captions = getRandomArrayElements(quotes, 5);
	// then seed with seed + page combination
	Math.seedrandom([seed,page].join(''));
	// Set canvas size
	canvas.width = resolution[0];
	canvas.height = resolution[1];
	// set canvas background
	ctx.fillStyle = '#fff';
	ctx.fillRect(0, 0, resolution[0], resolution[1]);

// SCREEN-SPECIFIC SETTINGS
} else {
	// get window size
	resolution = [
		window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
		window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
	]
	// Don't need that canvas...
	document.querySelector('canvas').remove();
	// Set a page number for collage caption
	if(page==null) page = 1;
}

// DIAGRAMS
// How many diagrams will be collaged
const nDiagrams = 3+ Math.floor(Math.random()*3);
// Select random diagrams from image-list.js
let diagrams = getRandomArrayElements(images, nDiagrams);


// GENERATE COLLAGE
Promise.all(
	// generate a Promise for each image process
	diagrams.map(img => {
		return new Promise((resolve, reject) => {
			// Create new HTML image
			let diagram = new Image();
			diagram.src = 'diagrams/' + img;
			// Generate position, dimensions, transformation
			// Using the non-gaussian random() here, which makes for more interesting variations
			diagram.style.left = -(resolution[0]/3)+(resolution[0]/4*3)*Math.random() + 'px';
			diagram.style.top = -(resolution[1]/3) + (resolution[1]/4*3)*Math.random() + 'px';
			// Use height or width for scaling depending on screen orientation
			let scale = .2 + Math.random();
			if(resolution[1] < resolution[0]) {
				diagram.style.width = resolution[0] * scale + 'px';
			} else {
				diagram.style.height = resolution[1] * scale + 'px';
			}
			// Apply transform to certain elements by chance
			if(Math.random() > 0.5) {
				setTimeout(() => {
					diagram.style.transitionDuration = random(30,120) + 's';
					diagram.style.transitionDelay = random(0,15) + 's';
					diagram.style.transform = `
						scale3D(${random(1,1.3)}, ${random(1,1.3)}, ${random(1,1.3)})
						rotate3D(${random(-1,1)}, ${random(-1,1)}, ${random(-1,1)}, ${random(-100,100)}deg)
					`;
				}, 1000);
			}
			// append to document after diagram image is loaded
			diagram.onload = () => {
				// Screen Mode: Render to DOM
				if(!print) {
					document.querySelector('#diagrams').appendChild(diagram);
				// Print Mode: Render to canvas (for PNG export)
				} else {
					// apply scaling to 2nd dimension (HTML does this automatically, but here we need to.)
					let scaleFactor;
					if(resolution[0] < resolution[1]) {
						scaleFactor = Number(diagram.style.height.slice(0,-2)) / diagram.naturalHeight;
					} else {
						scaleFactor = Number(diagram.style.width.slice(0,-2)) / diagram.naturalWidth;
					}
					// Place on canvas
					ctx.globalCompositeOperation = 'multiply';
					ctx.drawImage(
						diagram,
						Number(diagram.style.left.slice(0,-2)),
						Number(diagram.style.top.slice(0,-2)),
						diagram.naturalWidth * scaleFactor,
						diagram.naturalHeight * scaleFactor
					);
				}
				resolve();
			}
		});
	})

// GENERATE CAPTION
).then(() =>{
	// find random text passage from quotes.js and format as caption
	// select pre-defined passage from prepared 5 quotes in print mode
	let passage = (print) ? captions[page-1] : quotes[Math.floor(Math.random()*quotes.length)];
	let caption = `fig.${Number(page)}  ${passage}`;
	// Screen Mode: Render caption as HTML element
	if(!print) {
		// Put caption in <h2> HTML tag
		let captionEl = document.createElement('h2');
		// Wrap in a link that leads to new image
		let captionLink = document.createElement('a');
		captionLink.innerHTML = caption;
    captionLink.href = './index.html?page=' + (Number(page)+1);
		captionEl.appendChild(captionLink);
		// Append to DOM
		document.querySelector('#caption').appendChild(captionEl);
	// Print Mode: Render caption to Canvas
	} else {
		ctx.font = `${fontSize}px ${typeface}`;
		// Split text into lines, bc. canvas can't ...
		caption = caption.match(/.{1,70}(\s|$)/g);
		// calculate height of that text block
		let captionHeight = caption.length * 1.3 * fontSize;
		// find widest line of text, i.e. define box width
		let textWidth = caption.map(line => ctx.measureText(line).width).reduce((a,b) => Math.max(a,b));
		// calculate x position for text box
		let textX = (resolution[0] - textWidth) / 2;
		// translate on canvas to text box y position
		ctx.translate(0, resolution[1] - captionHeight - marginBottom - trim - fontSize);
		// draw background rectangle for caption
		ctx.globalCompositeOperation = 'source-over';
		ctx.fillStyle = '#fff';
		ctx.fillRect(textX-fontSize, -fontSize, textWidth+2*fontSize, captionHeight+2*fontSize);
		// Draw Text
		ctx.fillStyle = '#000';
		caption.forEach((line, n) => {
			ctx.fillText(line, textX, fontSize + fontSize *1.3*n);
		});
		// Save PNG
		canvas.toBlob(function(blob) {
		  saveAs(blob, `${seed}_${page}.png`);
		});
	}
});
