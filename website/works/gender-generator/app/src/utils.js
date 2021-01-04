/**
 * Calculate the luminance (the intensity of light or brightness) of a color
 * https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
 *
 * @param {Number} r The Red value from 0.0 to 1.0
 * @param {Number} g The Green value from 0.0 to 1.0
 * @param {Number} b The Blue value from 0.0 to 1.0
 */
export function luminanace(r, g, b) {
  const a = [r * 255, g * 255, b * 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculate the contrast ratio of two color arrays
 * https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors
 * @param {Number[]} rgb1 A color array in a [r,g,b] format from 0.0 to 1.0
 * @param {Number[]} rgb2 A color array in a [r,g,b] format from 0.0 to 1.0
 */
export function contrast(rgb1, rgb2) {
  const lum1 = luminanace(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = luminanace(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}
