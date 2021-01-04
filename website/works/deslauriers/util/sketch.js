// const createInput = require("./util/createInput");
const SimplexNoise = require("simplex-noise");
const Random = require("./Random");
const MathUtil = require("canvas-sketch-util/math");
const objectFit = require("./objectFit");
const loadData = require("./load-data");
const easeFlip = require("eases/sine-in");
const bsp = require("./bsp");
const treeUtil = require("./tree-util");
const wordWrap = require("word-wrap");
const query = require("./query");

const isFrame = query.page != null;
const pageNum = query.page != null ? parseInt(query.page, 10) : 0;
const isPrint = query.print;
const isStatic = isFrame || isPrint;
const showText = !isPrint;

const shouldCoverBackground = !query.nohighlight;
let seed = typeof query.seed === "number" ? query.seed : Random.pureSeed();
console.log("Random seed: %d", seed);

const settings = {
  dimensions: isFrame ? [2412, 3074] : undefined,
  pixelRatio: isFrame ? 1 : undefined,
  hotkeys: false,
  animate: !isStatic,
};

settings.suffix = seed;
// if (isStatic) {
//   settings.exportPixelRatio = 4;
// }

const sketch = async (props) => {
  const fonts = {
    bold: {
      url: "assets/fonts/SilkaMono-Semibold.otf",
      name: "SilkaMono-Bold",
    },
    regular: {
      url: "assets/fonts/SilkaMono-Regular.otf",
      name: "SilkaMono-Light",
    },
  };
  // We can use Browser's "FontFace" API to load fonts from JavaScript
  // This will ensure the font is renderable before first drawing to Canvas
  await Promise.all(
    Object.values(fonts).map(async (def) => {
      const font = new window.FontFace(def.name, `url(${def.url})`);

      // We use async/await ES6 syntax to wait for the font to load
      await font.load();

      // Add the loaded font to the document
      document.fonts.add(font);
    })
  );

  const { data = {} } = props;
  const isSVG = data.svg;

  const canvas = props.canvas;
  const defaultFontFamily = fonts.regular.name;
  const drawDirectToCanvas = false;
  const desiredAspect = 2412 / 3074;
  const desiredWidth = 600;
  const desiredHeight = desiredWidth / desiredAspect;
  const targetScale = props.width / desiredWidth;
  // good dimensions [600,714]

  const random = Random(seed);

  const fontSize = 8 * (isFrame ? targetScale : 1);
  const lineHeightSize = 1.15;
  const shrink = 1.15;
  let textMeasuredWidth;
  const textWidth = fontSize;
  const textHeight = fontSize;
  const foreground = "black";
  const gray = "hsl(0, 0%, 50%)";
  const background = "hsl(0, 0%, 95%)";
  const corpus = await loadData(random);

  const jitterNoise = new SimplexNoise(random.value);
  // const inputEl = createInput(onUserInput);

  let lastUserText = "";
  let caretVisible = true;
  const caretTickDelay = 530 / 1 / 1000;
  let caretElapsed = 0;

  const defaultInputs = ["winter", "bloom", "moon", "october", "mist"];
  let staticInput = typeof query.input === "string" ? query.input : undefined;
  if (!staticInput && typeof pageNum === "number" && isFrame) {
    staticInput =
      defaultInputs[MathUtil.wrap(pageNum - 1, 0, defaultInputs.length)];
  }

  const defaultText = staticInput || "spring";

  const inputEl = isStatic
    ? { value: "", selectionStart: 0 }
    : createInput({
        submit: () => {
          clearUserTextTimeout();
          textInputEnded();
        },
        changed: () => {
          if (!lastUserText && inputEl.value) {
            caretVisible = true;
            caretElapsed = 0;
          }
          lastUserText = inputEl.value;
          // console.log("changed!", inputEl.value);
          clearUserTextTimeout();
          resetTextTimeout();
        },
      });

  if (staticInput) inputEl.value = staticInput;
  let steps = 0;
  let frameTickElapsed = 0;

  let textInputTimer = null;
  const textInputDelay = 1000;

  const frameTickFPS = 24;
  const defaultTriggerDelay = 25;
  const frameTickDelay = 1 / frameTickFPS;
  let leafs = [];
  let leafsToProcess = [];
  let particles = [];
  let particlesLeftToDraw = [];

  let infoText = "type in a prompt (winter, flower, moon...)";

  let words, haikus, remainingHaikus;

  const userPosition = [0, 0];
  const canvas2 = document.createElement("canvas");
  const context2 = canvas2.getContext("2d");

  let needsReset = false;
  let hasDrawn = false;
  let showGrid = false;
  setFont(context2);
  setFont(props.context);

  const grid = {
    columns: 60,
    rows: 40,
    x: 0,
    y: 0,
    cellWidth: textMeasuredWidth * shrink,
    cellHeight: fontSize * lineHeightSize,
  };
  resize(props);
  textInputEnded();
  // console.log(
  //   "Font",
  //   textMeasuredWidth,
  //   fontSize,
  //   grid.cellWidth,
  //   grid.cellHeight
  // );
  // console.log(grid.cellWidth / 2 - textMeasuredWidth / 2);
  // console.log(grid.cellHeight / 2 - fontSize / 2);

  // words.forEach(w => {
  //   for (let j = 0; j < w.length; j++) {
  //     const symbol = w.charAt(i);
  //     const position =
  //   }
  // })

  return { render, resize, download };

  function download() {
    if (isFrame && seed != null && typeof pageNum === "number") {
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = seed + "_" + pageNum + ".png";
      a.click();
    }
  }

  // function onUserInput(data) {
  //   const { event } = data;
  //   if (data.type === "action") {
  //     if (data.name === "h") {
  //     } else if (data.name === "g") {
  //       showGrid = !showGrid;
  //       event.preventDefault();
  //     } else if (data.name === "c") {
  //     }
  //   } else if (data.type === "arrow") {
  //     const step = event.shiftKey ? 5 : 1;
  //     moveCaret(data.direction[0] * step, data.direction[1] * step * 0);
  //   } else if (data.type === "char") {
  //     // const g = placeUserChar(userPosition, data.char);
  //     userText += data.char;
  //     moveCaret(1, 0);
  //   } else if (data.type === "delete") {
  //     const idx = xyToIndex(userPosition);
  //     removeCell(idx);
  //   } else if (data.type === "backspace") {
  //     if (!event.shiftKey) {
  //       moveCaret(-1, 0);
  //     }
  //     const idx = xyToIndex(userPosition);
  //     removeCell(idx);
  //   } else if (data.type === "enter") {
  //     clearUserTextTimeout();
  //     textInputEnded();
  //     moveCaret(0, 1);
  //   } else if (data.type === "escape") {
  //   }
  // }

  function textInputEnded() {
    needsReset = true;
    const inputs = loadData.tokenize(inputEl.value || defaultText);
    if (inputs.length === 0) inputs.push(defaultText);
    words = corpus.gatherThemes(inputs[0]);
    haikus = corpus.haiku(inputs, 50, 50).slice(0, 20);
    remainingHaikus = haikus.slice();
  }

  function resetTextTimeout() {
    textInputTimer = setTimeout(textInputEnded, textInputDelay);
  }

  function clearUserTextTimeout() {
    clearTimeout(textInputTimer);
    textInputTimer = null;
  }

  function removeCell() {}

  function moveCaret(tx = 0, ty = 0) {
    userPosition[0] += tx;
    // userPosition[1] += ty;
    clampUserPosition();
  }

  function clampUserPosition() {
    userPosition[0] = MathUtil.clamp(userPosition[0], 0, grid.columns - 1);
    // userPosition[1] = MathUtil.clamp(userPosition[1], 0, grid.rows - 1);
  }

  function setFont(context, fontFamily = defaultFontFamily) {
    setFontFamily(context, fontFamily);
    context.textAlign = "left";
    context.textBaseline = "middle";
    textMeasuredWidth = context.measureText("M").width;
  }

  function setFontFamily(context, fontFamily, size = fontSize) {
    context.font = `${size}px "${fontFamily}", "Andale Mono", "Courier New", monospace`;
  }

  function resize(props) {
    const { width, height } = props;
    const aspect = width / height;
    const dim = Math.min(width, height);
    const margin = dim * 0.075;
    const paddingX = margin;
    const paddingY = margin;
    const paddingOffset = isPrint ? 0 : grid.cellHeight * 5;
    // const paddingOffset = isFrame ? 0 : grid.cellHeight * 5;
    grid.columns = Math.ceil((width - paddingX * 2) / grid.cellWidth);
    grid.rows = Math.ceil(
      (height - paddingY * 2 - paddingOffset) / grid.cellHeight
    );

    // grid.columns = 80;
    // grid.rows = 60;

    // const maxCols = 80;
    // if (grid.columns >= maxCols) {
    //   grid.columns = maxCols;
    //   grid.rows = Math.floor(maxCols / aspect);
    // }
    // const maxRows = 80;
    // if (grid.rows >= maxRows) {
    //   grid.rows = maxRows;
    //   grid.columns = Math.floor(maxRows * aspect);
    // }

    grid.x = (width - grid.columns * grid.cellWidth) / 2;
    grid.y = (height - grid.rows * grid.cellHeight) / 2;

    canvas2.width = props.canvasWidth;
    canvas2.height = props.canvasHeight;
    needsReset = true;
    if (isPrint || isFrame) random.seed = seed;
  }

  function generate() {
    particles.length = 0;
    particlesLeftToDraw.length = 0;
    leafs = [];
    leafsToProcess = [];
    remainingHaikus = haikus.slice();

    let i = 0;
    const tree = bsp({
      // filter: (d) => d.depth > 0 && random.gaussian() > -1,
      // random = () => Math.random(),
      cellWidth: grid.cellWidth,
      cellHeight: grid.cellHeight,
      offset: [grid.x, grid.y],
      rows: grid.rows,
      columns: grid.columns,
      variance: 0.5,
      squariness: 0.5,
      // bounds: [
      //   [grid.x, grid.y],
      //   [
      //     grid.x + grid.columns * grid.cellWidth,
      //     grid.y + grid.rows * grid.cellHeight,
      //   ],
      // ],
      maxDepth: 12,
      minDimension: grid.cellWidth * 2,
      shouldSplit: (node) =>
        node.width > grid.cellWidth * 6 && node.height > grid.cellHeight * 2,
      random: random.value,
    });

    const removals = 1;
    // const detached = [];
    for (let i = 0; i < removals; i++) {
      treeUtil.traverse(tree, (p) => {
        if (p.leaf && p.parent && random.gaussian() > 0) {
          // detached.push(p.parent);
          const parent = p.parent;
          p.parent.detach();
          // p.parent.children.length = 0;
          // console.log();
        }
      });
    }

    // treeUtil.traverse(tree, (n) => {
    //   n.bounds.forEach((b) => {
    // b[0] += grid.x;
    // b[1] += grid.x;
    //   });
    // });
    leafs = treeUtil.getLeafNodes(tree);
    // leafs = leafs
    //   .map((node) => {
    //     // const newBounds = [node.bounds[0].slice(), node.bounds[1].slice()];
    //     // newBounds[1][0] -= 2;
    //     const newBounds = shrinkBounds(
    //       node.bounds,
    //       grid.cellWidth * 2,
    //       grid.cellWidth * 0
    //     );
    //     if (!newBounds) return null;
    //     node.innerBounds = newBounds;
    //     return node;
    //   })
    //   .filter(Boolean);

    // sort by area
    leafs.sort((a, b) => b.width * b.height - a.width * a.height);
    leafsToProcess = leafs.slice();
    generateLeafs();
  }

  function generateLeafs() {
    const labels = [];
    let maxHaikus = 10;
    let haikuCount = 0;

    const haikuCellSpots = new Set();

    for (let n = 0; n < leafsToProcess.length; n++) {
      const node = leafsToProcess[n];
      const [minGrid, maxGrid, columns, rows] = pixelBoundsToGridBounds(
        node.bounds
      );
      const [minCol, minRow] = minGrid;
      let [maxCol, maxRow] = maxGrid;

      let colSpace = columns;
      let rowSpace = rows;
      if (colSpace <= 3 || rowSpace <= 3) continue;
      const space = colSpace;

      // this leaf is now "processed" and removed from the list
      // leafsToProcess.shift();

      const rowLabels = new Array(rowSpace).fill(0).map(() => []);
      // let curWords = words.filter((f) => f.length >= 3 && Math.abs(f.length - space) < 20);
      let curWords = words.filter((f) => f.length >= 3 && f.length <= space);
      if (curWords.length > 0) {
        // curWords.sort((a, b) => b.length - a.length);
        // curWords.sort((a, b) => a.length - b.length);
        curWords = random.shuffle(curWords);
        for (let j = 0; j < curWords.length && j < rowSpace; j++) {
          const word = curWords[j];
          const label = [];
          const color = foreground;

          for (let i = 0; i < word.length; i++) {
            const c = word.charAt(i);
            let row, col;
            col = Math.round(
              MathUtil.mapRange(i, 0, word.length - 1, minCol, maxCol - 1, true)
            );
            row = minRow + j;
            if (c === " ") continue;
            label.push(createCell(col, row, c, foreground));
          }
          if (label.length) rowLabels[j] = label;
        }
      }

      if (remainingHaikus.length && haikuCount < maxHaikus) {
        let haikuIndexToSplice = -1;
        haikuLoop: for (let hi = 0; hi < remainingHaikus.length; hi++) {
          const haiku = remainingHaikus[hi];
          let lines = justified(haiku.value, colSpace, rowSpace);
          if (lines.length < rowSpace) {
            // const color = `hsl(${random.range(0, 360)}, 70%, 50%)`;
            const maxLines = Math.min(lines.length, rowSpace);
            const remainingLines = Math.max(0, rowSpace - lines.length);
            const lineOff = random.rangeFloor(1, remainingLines);
            // rowLabels[lineOff - 1] = [];
            // rowLabels[lineOff + maxLines] = [];

            const colStart = minCol;
            const rowStart = minRow + lineOff;

            // first we check to see if this haiku will collide with another
            if (willCollide(haikuCellSpots, lines, colStart, rowStart)) {
              continue haikuLoop;
            }

            for (let j = 0; j < lines.length; j++) {
              const line = lines[j];
              const label = [];
              inner: for (let i = 0; i < line.length; i++) {
                const [char, offset] = line[i];
                const col = colStart + offset;
                const row = rowStart + j;
                label.push(
                  createCell(col, row, char, foreground, fonts.bold.name, true)
                );
                haikuCellSpots.add([col, row].join(":"));
              }
              if (label.length) rowLabels[lineOff + j] = label;
            }
            haikuIndexToSplice = hi;
            node.haiku = true;
            node.rowspan = Math.min(lines.length, rowSpace);
            break haikuLoop;
          }
        }
        if (haikuIndexToSplice >= 0) {
          remainingHaikus.splice(haikuIndexToSplice, 1);
          haikuCount++;
        }
      }

      rowLabels.forEach((l) => labels.push(l));
    }

    const consumedCells = [];

    const allParticles = labels.flat();
    const haikuParticles = allParticles.filter((h) => h.coverBackground);

    allParticles.forEach((w) => {
      if (!w.coverBackground) {
        const key = w.position.join(":");
        if (haikuCellSpots.has(key)) {
          return;
        }
      }
      particles.push(w);
      particlesLeftToDraw.unshift(w);
    });
  }

  function willCollide(currentSet, lines, colStart, rowStart) {
    for (let j = 0; j < lines.length; j++) {
      const line = lines[j];
      for (let i = 0; i < line.length; i++) {
        const [char, offset] = line[i];
        const col = colStart + offset;
        const row = rowStart + j;
        const key = [col, row].join(":");
        if (currentSet.has(key)) return true;
      }
    }
    return false;
  }

  function shrinkBounds(bounds, amountX = 0, amountY = 0) {
    const [min, max] = bounds.map((b) => b.slice());
    const halfX = amountX / 2;
    const halfY = amountY / 2;
    const min2 = [min[0] + halfX, min[1] + halfY];
    const max2 = [max[0] - halfX, max[1] - halfY];
    if (min2[0] >= max2[0] || min2[1] >= max2[1]) return null;
    return [min2, max2];
  }

  function justified(poem, columns) {
    return wordWrap(poem.join("\n"), {
      width: columns,
      // cut: true,
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const result = [];
        // const result = new Array(columns).fill(" ");
        for (let c = 0; c < line.length; c++) {
          const char = line.charAt(c);
          let offset = c;
          // let offset = Math.round(
          //   MathUtil.mapRange(c, 0, line.length - 1, 0, columns - 1, true)
          // );
          result.push([char, offset]);
          // result[offset] = char;
        }
        return result;
        // return result.map((s, i) => {
        //   return [s, i];
        // });
      });
    // const lines = [];
    // for (let p = 0; p < poem.length; p++) {
    //   const poemLine = poem[p];
    //   const tokens = loadData.tokenize(poemLine);
    //   const line = [];
    //   for (let t = 0; t < tokens.length; t++) {
    //     line.push()
    //   }
    // }
    // return lines;
  }

  function createCell(
    col,
    row,
    c,
    color = foreground,
    fontFamily = defaultFontFamily,
    coverBackground = false
  ) {
    return {
      coverBackground,
      fontFamily,
      drawn: false,
      drawCount: 0,
      time: 0,
      duration: 0,
      durationIn: 1,
      durationOut: 0,
      started: true,
      active: true,
      delay: 0,
      alpha: 1,
      color,
      symbol: c,
      sort: gridToPixel([col, row])[0] + random.gaussian(0, 80),
      position: [col, row],
    };
  }

  function render(props) {
    renderFrame(props);
    if (props.exporting && isSVG) {
      return [
        props.canvas,
        data.svgSerialize(props, {
          background,
          foreground,
          fontSize,
          cellWidth: grid.cellWidth,
          cellHeight: grid.cellHeight,
          textWidth: textMeasuredWidth,
          texts: particles.map((p) => {
            const [cx, cy] = gridToPixel(p.position);

            const jitterStrength = 0.5;
            const f = 1;
            const tx = jitterNoise.noise3D(cx * f, cy * f, -1) * jitterStrength;
            const ty = jitterNoise.noise3D(cx * f, cy * f, 1) * jitterStrength;

            const x = cx + tx;
            const y = cy + ty;
            return {
              x,
              y,
              symbol: p.symbol,
            };
          }),
        }),
      ];
    }
  }

  function renderFrame(props) {
    const { width, height, data = {} } = props;
    const altContext = drawDirectToCanvas ? props.context : context2;

    altContext.save();
    if (!drawDirectToCanvas) altContext.scale(props.scaleX, props.scaleY);
    if (needsReset) {
      if (isSVG) {
        altContext.clearRect(0, 0, width, height);
      } else {
        altContext.fillStyle = background;
        altContext.fillRect(0, 0, width, height);
      }
      generate();
      needsReset = false;
      // particlesLeftToDraw = particles.slice();
      // particlesLeftToDraw.reverse();
    }
    const dt = Math.min(1 / 10, props.deltaTime);

    let didStep = false;
    caretElapsed += dt;
    if (caretElapsed >= caretTickDelay) {
      caretElapsed %= caretTickDelay;
      caretVisible = !caretVisible;
    }

    frameTickElapsed += dt;
    if (frameTickElapsed > frameTickDelay) {
      frameTickElapsed %= frameTickDelay;
      steps++;
      didStep = true;
      // if (steps % 30 === 0) {
      //   clearBackground();
      //   generate();
      // }
    }

    setFont(altContext);

    const gridWidth = grid.cellWidth * grid.columns;
    const gridHeight = grid.cellHeight * grid.rows;

    const [tx, ty, tw, th] = objectFit({
      parentWidth: width,
      parentHeight: height,
      childWidth: gridWidth,
      childHeight: gridHeight,
      fit: "scale-down",
      padding: 20,
      scale: 1,
      offsetX: 0.5,
      offsetY: 0.5,
    });

    const sx = tw / gridWidth;
    const sy = th / gridHeight;

    altContext.save();
    // altContext.translate(tx, ty);
    // altContext.scale(sx, sy);
    // if (didStep) {

    // }

    altContext.save();
    if (showText && isFrame) altContext.translate(0, grid.cellHeight * 1.5);
    if (didStep || isStatic) {
      const totalCount = particles.length;
      const totalDuration = 1;
      const totalToProcessPerFrame = isStatic ? Infinity : 100; //Math.round(totalCount / 60 / (totalDuration / 2));
      for (
        let i = particlesLeftToDraw.length - 1, c = 0;
        i >= 0 && c < totalToProcessPerFrame;
        i--, c++
      ) {
        const p = particlesLeftToDraw[i];
        if (isStatic) {
          p.slice = null;
          particlesLeftToDraw.splice(i, 1);
        } else {
          if (p.drawCount === 0) {
            p.slice = 0;
          } else if (p.drawCount === 1) {
            p.slice = 1;
          } else {
            particlesLeftToDraw.splice(i, 1);
          }
        }
        drawText(altContext, p);
        p.drawCount++;
      }
    }
    altContext.restore();

    // context.save();
    // context.translate(tx, ty);
    // context.scale(sx, sy);
    altContext.restore();

    altContext.restore();
    const context = props.context;

    if (showGrid) {
      context.strokeStyle = "black";
      context.fillStyle = "black";
      context.globalAlpha = 0.5;
      context.beginPath();
      for (let y = 0; y < grid.rows; y++) {
        for (let x = 0; x < grid.columns; x++) {
          // if (userPosition[0] === x && userPosition[1] === y) continue;
          const px = grid.x + x * grid.cellWidth;
          const py = grid.y + y * grid.cellHeight;

          const radius = 0.25;
          context.rect(px, py, grid.cellWidth, grid.cellHeight);
          const ax = px + grid.cellWidth / 2;
          const ay = py + grid.cellHeight / 2;
          context.moveTo(ax, ay);
          context.arc(ax, ay, radius, 0, Math.PI * 2, false);
        }
      }
      context.stroke();
      // context.fill();
      context.globalAlpha = 1;
    }

    if (!drawDirectToCanvas) {
      context.clearRect(0, 0, width, height);
      context.drawImage(canvas2, 0, 0, width, height);

      setFont(context);

      // const ix = grid.x;
      // const iy = grid.y - fontSize * 2;
      // const [ipx, ipy] = gridToPixel([0, 0]);
      // const showText = !isPrint;
      if (showText) {
        context.save();
        const s = 2;
        context.scale(s, s);
        context.translate(-grid.x / s, -grid.y / s);
        const foff = isFrame ? 1 : 2;
        context.translate(0, -grid.cellHeight * foff);
        // context.translate(grid.x, grid.y);
        // context.translate(grid.x, grid.y);
        // context.translate(grid.x, grid.y);

        const infoGrid = [0, 0];
        setFontFamily(context, defaultFontFamily, fontSize * 3);
        const userText = inputEl.value;
        const curText = userText.length ? userText : infoText;
        for (let i = 0; i < curText.length; i++) {
          drawText(context, {
            symbol: curText.charAt(i),
            position: [infoGrid[0] + i, infoGrid[1]],
            coverBackgroundColor: "#cecece",
            coverBackground: true,
          });
        }

        if (userText.length && caretVisible && !isFrame && !isPrint) {
          context.globalAlpha = 1;
          // const idx = xyToIndex(userPosition);
          const caretW = 1;
          const caretH = 1.25;
          context.globalCompositeOperation = "difference";
          context.fillStyle = "white";
          const userPosition = [inputEl.selectionStart, 0];
          const pos = gridToPixel([
            userPosition[0] + infoGrid[0],
            userPosition[1] + infoGrid[1],
          ]);
          const [px, py] = pos;
          const cx = px + (grid.cellWidth / 2 - (grid.cellWidth * caretW) / 2);
          const cy =
            py + (grid.cellHeight / 2 - (grid.cellHeight * caretH) / 2);
          context.fillRect(
            cx,
            cy,
            grid.cellWidth * caretW,
            grid.cellHeight * caretH
          );
          context.globalCompositeOperation = "source-over";
        }

        context.restore();
      }
    }
  }

  function pixelBoundsToGridBounds([minPx, maxPx]) {
    const minGrid = pixelToGridUnclamped(minPx);
    const maxGrid = pixelToGridUnclamped(maxPx);
    const cols = maxGrid[0] - minGrid[0];
    const rows = maxGrid[1] - minGrid[1];
    return [minGrid, maxGrid, cols, rows];
  }

  function updateParticleTime(p) {
    p.time += dt;
    if (p.time > p.delay && !p.started) {
      p.started = true;
    }
    if (p.started) {
      const curTime = Math.max(0, p.time - p.delay);
      if (curTime < p.durationIn) {
        p.alpha = easeFlip(MathUtil.clamp01(curTime / p.durationIn));
      }

      const totalDur = p.duration + p.durationIn + p.durationOut;
      if (curTime < p.durationIn) {
        // p.alpha = easeFlip(MathUtil.clamp01(curTime / p.durationIn));
      } else if (curTime >= p.durationIn + p.duration) {
        const start = Math.max(0, curTime - (p.durationIn + p.duration));
        p.alpha = 1 - easeFlip(MathUtil.clamp01(start / p.durationOut));
      } else {
        p.alpha = 1;
      }

      if (curTime >= totalDur) {
        p.active = false;
      }
    }
  }

  function xyToIndex(x, y) {
    if (Array.isArray(x)) {
      const a = x;
      x = a[0];
      y = a[1];
    }
    return Math.floor(x) + Math.floor(y) * grid.columns;
  }

  function indexToXY(index) {
    const x = Math.floor(index % grid.columns);
    const y = Math.floor(index / grid.columns);
    return [x, y];
  }

  function pixelToGrid([x, y], [cx, cy] = [0, 0]) {
    x -= grid.x;
    y -= grid.y;
    x -= grid.cellWidth * cx;
    y -= grid.cellHeight * cy;
    return [
      Math.max(0, Math.min(grid.columns - 1, Math.floor(x / grid.cellWidth))),
      Math.max(0, Math.min(grid.rows - 1, Math.floor(y / grid.cellHeight))),
    ];
  }

  function pixelToGridUnclamped([x, y], [cx, cy] = [0, 0]) {
    x -= grid.x;
    y -= grid.y;
    x -= grid.cellWidth * cx;
    y -= grid.cellHeight * cy;
    return [Math.floor(x / grid.cellWidth), Math.floor(y / grid.cellHeight)];
  }

  function gridToPixel([x, y], [cx, cy] = [0, 0]) {
    return [
      grid.x + x * grid.cellWidth + grid.cellWidth * cx,
      grid.y + y * grid.cellHeight + grid.cellHeight * cy,
    ];
  }

  function snapPixelToGrid(pixel, [cx, cy] = [0, 0]) {
    const gridCoord = pixelToGrid(pixel, [cx, cy]);
    const pixelCoord = gridToPixel(gridCoord, [cx, cy]);
    return pixelCoord;
  }

  function frameFloor(n) {
    return isFrame ? Math.floor(n) : n;
  }

  function drawText(
    context,
    {
      alpha = 1,
      slice = null,
      color = foreground,
      position = [0, 0],
      symbol = "?",
      fontFamily = defaultFontFamily,
      coverBackground = false,
      coverBackgroundColor = "#f2c615",
    }
  ) {
    const { width, height } = props;
    const [cx, cy] = gridToPixel(position);
    const x = frameFloor(cx);
    const y = frameFloor(cy);

    context.save();

    const jitterStrength = 0.5;

    const txtWidth = textMeasuredWidth;
    const ox = grid.cellWidth / 2 - txtWidth / 2;
    const oy = grid.cellHeight / 2;

    const px = frameFloor(x + ox);
    const py = frameFloor(y + oy);
    const f = 1;
    const sx = cx;
    const sy = cy;
    const tx = jitterNoise.noise3D(sx * f, sy * f, -1) * jitterStrength;
    const ty = jitterNoise.noise3D(sx * f, sy * f, 1) * jitterStrength;

    // context.beginPath();
    const fx = frameFloor(px + tx);
    const fy = frameFloor(py + ty);

    const doCover = shouldCoverBackground && coverBackground;

    if (slice != null) {
      const slices = 2;
      const sliceHeight = grid.cellHeight / slices;
      context.beginPath();
      context.rect(x, y + sliceHeight * slice, grid.cellWidth, sliceHeight);
      context.clip();
    }

    // context.fillStyle = background;
    // context.fillRect(x, y, grid.cellWidth, grid.cellHeight * p.alpha);
    if (doCover) {
      const foff = isFrame ? 1 : 0;
      // context.beginPath();
      context.globalAlpha = 1;
      context.fillStyle = coverBackgroundColor;
      context.fillRect(
        frameFloor(x) - foff,
        frameFloor(y) - foff,
        frameFloor(grid.cellWidth) + foff * 2,
        frameFloor(grid.cellHeight) + foff * 2
      );
      context.globalAlpha = 1;
      // context.clip();
    }

    // context.fillStyle = foreground;
    setFontFamily(context, fontFamily);
    context.fillStyle = color;
    if (!doCover) {
      context.strokeStyle = background;
      context.lineWidth = Math.min(width, height) * 0.001;
      context.strokeText(symbol, fx, fy);
    }
    context.globalAlpha = 0.95;
    context.fillText(symbol, fx, fy);
    // context.globalAlpha = 0.05;
    // context.fillText(
    //   symbol,
    //   fx + random.gaussian(0, 0.1),
    //   fy + random.gaussian(0, 0.1)
    // );
    context.globalAlpha = 1;
    context.restore();
  }

  function mapParticleToData(
    p,
    {
      alpha = 1,
      slice = null,
      color = foreground,
      position = [0, 0],
      symbol = "?",
      fontFamily = defaultFontFamily,
      coverBackground = false,
      coverBackgroundColor = "#f2c615",
    }
  ) {
    const { width, height } = props;
    const [cx, cy] = gridToPixel(position);
    const x = cx;
    const y = cy;

    return {
      alpha,
      color,
      position,
      symbol,
      fontFamily,
      coverBackground,
      coverBackgroundColor,
    };
  }
};

function createInput(opt = {}) {
  const inputEl = document.createElement("input");
  document.body.appendChild(inputEl);
  Object.assign(inputEl.style, {
    position: "absolute",
    opacity: "0",
    left: "0",
    top: "0",
  });
  inputEl.focus();
  inputEl.addEventListener("input", inputChanged);
  inputEl.addEventListener(
    "focus",
    (ev) => {
      inputEl.value = inputEl.value;
      forceInputEnd();
    },
    false
  );
  inputEl.addEventListener("keydown", (ev) => {
    if (ev.keyCode === 13) {
      // enter
      ev.preventDefault();
      opt.submit(ev);
      return false;
    }
  });
  window.addEventListener("click", () => inputEl.focus());
  return inputEl;

  function forceInputEnd() {}

  function inputChanged(ev) {
    opt.changed(ev);
  }
}

module.exports.sketch = sketch;
module.exports.settings = settings;
