const canvasSketch = require("canvas-sketch");
const { sketch, settings } = require("./util/sketch");
const svgSerialize = require("./util/svg-serialize");

canvasSketch(sketch, {
  ...settings,
  data: {
    svg: true,
    svgSerialize,
  },
});
