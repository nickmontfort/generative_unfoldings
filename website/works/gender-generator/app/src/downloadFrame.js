/**
 * Downloads the passed Canvas as a png.
 *
 * @param      {Canvas}   The Canvas
 * @return     {Promise}  { description_of_the_return_value }
 */
export async function downloadCanvasAsPNG(canvas, filename) {
  const url = await new Promise((resolve) => {
    // toBlob(callback, mimeType, qualityArgument);
    canvas.toBlob(function (blob) {
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });

  var a = document.createElement("a");
  document.body.appendChild(a); // This line makes it work in Firefox.
  a.setAttribute("download", filename + ".png");
  a.setAttribute("href", url);
  a.setAttribute("target", "_blank");
  a.click();
  // We don't need it anymore, remove it
  a.remove();
}
