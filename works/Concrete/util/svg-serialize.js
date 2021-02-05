module.exports = function serialize(
  props,
  { texts, background, foreground, fontSize, cellWidth, cellHeight, textWidth }
) {
  const textEls = texts
    .map((t) => {
      return `<text x="${t.x - 0.5}" y="${t.y + fontSize + 1}">${
        t.symbol
      }</text>`;
    })
    .join("\n");
  const svg = `<svg viewBox="0 0 ${props.width} ${props.height}" xmlns="http://www.w3.org/2000/svg">
    <g font-family="Silka Mono" font-style="normal" font-size="${fontSize}" fill="${foreground}">
<rect x="0" y="0" width="${props.width}" height="${props.height}" fill="white" stroke="none" />
${textEls}
    </g>
  </svg>`;
  return {
    data: svg,
    extension: ".svg",
  };
};

/*<rect x="${t.x}" y="${
        t.y
      }" width="${cellWidth}" height="${cellHeight}" fill="none" stroke="red" />*/
