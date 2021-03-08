require("array-flat-polyfill");
const query = require("./util/query");
const canvasSketch = require("canvas-sketch");
const { sketch, settings } = require("./util/sketch");
const shouldDownload = query.download !== false;

(async () => {
  const manager = await canvasSketch(sketch, settings);

  if (shouldDownload) manager.sketch.download();
})();
