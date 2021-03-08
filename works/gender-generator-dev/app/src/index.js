import "./index.css";

import {
  Application,
  Container,
  Graphics,
  Loader,
  filters,
  Ticker,
  Spritesheet,
  settings,
  utils,
} from "pixi.js";
import { DotFilter } from "@pixi/filter-dot";
import { MultiColorReplaceFilter } from "@pixi/filter-multi-color-replace";

import seedrandom from "seedrandom";

import GooeyFilter from "./GooeyFilter.js";
import { drawFace, getFaceFromMedia, redrawFace } from "./faceDrawing.js";
import { contrast } from "./utils.js";
import { startWebcam } from "./mediaSource.js";
import { generateFaceCanvas } from "./generateFace.js";

import { downloadCanvasAsPNG } from "./downloadFrame.js";
import spritesheetJSON from "./spritesheet.json";

// Pixi.js settings
settings.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = false;
settings.FILTER_RESOLUTION = 2;

const whiteTextureUrl = `${process.env.PUBLIC_URL}/sprite-sheet-white.png`;

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Reference ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////
// http://bl.ocks.org/nbremer/0e98c72b043590769facc5e829ebf43f
// http://bl.ocks.org/syntagmatic/6a921aed54be2a2bea5e56cf2157768b
// https://www.visualcinnamon.com/2016/06/fun-data-visualizations-svg-gooey-effect

///////////////////////////////////////////////////////////////////////////
/////////////////////////////// Set-up ////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

// Set our random seed based on the "seed" query parameter supplied
const queryParams = new URLSearchParams(window.location.search);
const seed = parseInt(queryParams.get("seed"));
const page = parseInt(queryParams.get("page"));
const seededRandom = seed && page ? seedrandom(seed + page) : seedrandom();

const isDownload = queryParams.has("page");

// Use the w and h parameters to set a specfic height and width for the canvas (useful for generating and downloading images)
// magic numbers are provided resolution
const width = page ? 2412 : Number(queryParams.get("w")) || window.innerWidth;
const height = page ? 3074 : Number(queryParams.get("h")) || window.innerHeight;

const bgColorArray = [seededRandom(), seededRandom(), seededRandom()];
// Ensure the FG color has at least a contrast ratio of 4.5: 1 for legibility
// https://www.w3.org/TR/WCAG20-TECHS/G18.html
let isContrastRatioAcceptable = false;
let fgColorArray;
while (!isContrastRatioAcceptable) {
  fgColorArray = [seededRandom(), seededRandom(), seededRandom()];
  isContrastRatioAcceptable = contrast(bgColorArray, fgColorArray) >= 4.8;
}

const bgColor = utils.rgb2hex(bgColorArray);
const fgColor = utils.rgb2hex(fgColorArray);

// Setup the pixi application
const app = new Application({
  width,
  height,
  antialias: true,
  backgroundColor: bgColor,
  sharedTicker: true,
  sharedLoader: true,
  // Only resize if we are not downloading
  resizeTo: !isDownload ? window : undefined,
});
window.app = app;

// Currently not using this, but it's an optimization that is available!
// let applicationScale = 1;
// const setScale = (scale) => {
//   const { width, height } = app.renderer.view;
//   const scaleChange = scale / applicationScale;
//   // You need to set the resolution before resize as it factors into the resizing logic
//   app.renderer.resize(width * scaleChange, height * scaleChange);
//   app.stage.scale.set(scale, scale);
//   app.render();
//   applicationScale = scale;
// }
// if (!utils.isMobile.phone) {
//   setScale(.7)
// }

// ==============
// Loading Spinner
// ==============

const spinner = new Graphics()
  .beginFill(fgColor)
  .drawCircle(0, 0, 20)
  .endFill();
spinner.pivot.set(0, 80);
spinner.position.set(width / 2, height / 2);
spinner.filters = [new filters.BlurFilter(4)];
const spinnerAnimate = () => {
  spinner.angle += 10;
  const scaleChangeX = seededRandom() + 1;
  const scaleChangeY = seededRandom() + 1;
  spinner.scale.set(
    spinner.scale.x - (spinner.scale.x + scaleChangeX) * 0.1,
    spinner.scale.y - (spinner.scale.y + scaleChangeY) * 0.1
  );
  app.render();
};
Ticker.shared.add(spinnerAnimate);
app.stage.addChild(spinner);

app.start();

// We don't need the default pixi application render on tick call.
// We will be managing our own render calls elsewhere
Ticker.shared.remove(app.render, app);
Ticker.shared.fps = 30;

Ticker.shared.start();
// Add it to the body
document.body.appendChild(app.view);

async function setup() {
  let faceSource = null;

  // If we're downloading the image, use our generated face
  if (isDownload) {
    faceSource = generateFaceCanvas(seededRandom);
    // Otherwise attempt to get a webcam feed
  } else {
    try {
      faceSource = await startWebcam();
      // Try to get the face at least once to check that it works
      await getFaceFromMedia(faceSource);
    } catch (error) {
      console.info(
        "Cannot use webcam for source, falling back to default",
        error
      );
      // If this doesn't work, fallback to the generated face
      faceSource = generateFaceCanvas(seededRandom);
    }
  }

  // Grow circle and effect size proportional to the page size
  const sizeFactor = 0.03 * Math.min(app.renderer.width, app.renderer.height);

  const whiteTexture = Loader.shared.resources[whiteTextureUrl].texture;
  const whiteSpriteSheet = new Spritesheet(whiteTexture, spritesheetJSON);

  await Promise.all([
    new Promise((resolve) => {
      whiteSpriteSheet.parse(resolve);
    }),
  ]);

  // Set a container for where all of the objects will be (so we can center and scale it on resize)
  const faceContainer = new Container();
  app.stage.addChild(faceContainer);
  const featureContainer = new Container();
  const iconContainer = new Container();
  faceContainer.addChild(featureContainer, iconContainer);

  // Add visual filters
  const blurFilter = new filters.BlurFilter();
  blurFilter.blur = sizeFactor;
  blurFilter.quality = 7;

  const gooeyFilter = new GooeyFilter();

  const dotFilter = new DotFilter(1.05, 0);
  const colorReplace = new MultiColorReplaceFilter(
    [
      [0xffffff, bgColor],
      [0x000000, fgColor],
    ],
    0.1
  );

  featureContainer.filters = [blurFilter, gooeyFilter, dotFilter, colorReplace];
  iconContainer.filters = [colorReplace];

  // `predictions` is an array of objects describing each detected face
  let predictions = [];
  if (faceSource) {
    predictions = await getFaceFromMedia(faceSource);
  }

  drawFace({
    app,
    seededRandom,
    sizeFactor,
    spritesheet: whiteSpriteSheet,
    faceContainer,
    featureContainer,
    iconContainer,
    prediction: predictions[0],
  });

  spinner.renderable = false;
  Ticker.shared.remove(spinnerAnimate);

  app.render();

  // Now that we're loaded we can download if requested
  if (isDownload) {
    downloadCanvasAsPNG(app.view, seed + "_" + page);
  } else if (faceSource) {
    // The current store of the predictions for drawing
    let predictions = [];
    // The current promise, which resolves when TF is done predicting
    let predictingPromise = null;

    // Once prediction is complete, then update the current predictions we are using for drawing
    const predictionComplete = (predictionResponse) => {
      predictions = predictionResponse;
      predictingPromise = null;
    };

    // Ticker for redrawing
    Ticker.shared.add((time) => {
      console.log("tick", time);
      // Only attempt to predict face position when it has completed the last prediction
      if (!predictingPromise) {
        // Don't block animation by waiting for the TF prediction
        predictingPromise = getFaceFromMedia(faceSource).then(
          predictionComplete
        );
      }

      if (predictions.length) {
        redrawFace({
          app,
          faceContainer,
          featureContainer,
          prediction: predictions[0],
        });
      }
      app.render();
    }, null);
  }
}

// load our assets
Loader.shared.add(whiteTextureUrl).load(setup);
