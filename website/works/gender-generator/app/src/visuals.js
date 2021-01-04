///////////////////////////////////////////////////////////////////////////
///////////////////////////// Create filter ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

export function createGooeyFilter(svg) {
  //SVG filter for the gooey effect
  //Code taken from http://tympanus.net/codrops/2015/03/10/creative-gooey-effects/
  var defs = svg.append("defs");
  var filter = defs.append("filter").attr("id", "gooeyCodeFilter");
  filter
    .append("feGaussianBlur")
    .attr("in", "SourceGraphic")
    .attr("stdDeviation", "5")
    //to fix safari: http://stackoverflow.com/questions/24295043/svg-gaussian-blur-in-safari-unexpectedly-lightens-image
    .attr("color-interpolation-filters", "sRGB")
    .attr("result", "blur");
  filter
    .append("feColorMatrix")
    .attr("in", "blur")
    .attr("mode", "matrix")
    .attr("values", "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7")
    .attr("result", "gooey");
  //If you want the end shapes to be exactly the same size as without the filter
  //add the feComposite below. However this will result in a less beautiful gooey effect
  //filter.append("feBlend")
  //  .attr("in","SourceGraphic")
  //  .attr("in2","gooey");
  //Instead of the feBlend, you can do feComposite. This will also place a sharp image on top
  //But it will result in smaller circles
  //filter.append("feComposite") //feBlend
  //  .attr("in","SourceGraphic")
  //  .attr("in2","gooey")
  //  .attr("operator","atop");
}

// temporary pastel scheme
export const COLORS = [
  "#fce9f1",
  "#FEC8D8",
  "#FFDFD3",
  "#e9fcf4",
  "#feece8",
  "#e8fafe",
  "#ece8fe",
  "#efbbcf",
  "#ffd5cd",
  "#FFCCDD",
  "#FFFFCC",
  "#FFDDCC",
  "#CCDDEE",
  "#FFCCCC",
  "#CCDDCC",
  "#CCFFCC",
  "#FFEEFF",
  "#CCCCFF",
  "#CAEEFE",
  "#FFFCE7",
  "E1FFD4",
  "#FCE1F8",
  "DACBFE",
];
