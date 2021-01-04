const noop = () => {};
const finite = (n) => isFinite(n) && typeof n === "number";

const dimsFromCount = (count, opt) => {
  if (finite(opt.rows) && finite(opt.columns)) {
    return {
      columns: opt.columns,
      rows: opt.rows,
    };
  } else if (!finite(opt.rows) && !finite(opt.columns)) {
    // square grid
    const s = Math.floor(Math.sqrt(count));
    return { rows: s, columns: s };
  } else if (finite(opt.columns)) {
    const columns = opt.columns;
    return {
      columns,
      rows: Math.ceil(count / columns),
    };
  } else {
    const rows = opt.rows;
    return {
      columns: Math.ceil(count / rows),
      rows,
    };
  }
};

module.exports = gridVisitor;
function gridVisitor(opts = {}, cb = noop) {
  const {
    width,
    height,
    childWidth = width,
    childHeight = height,
    squareRatio = true,
    everyCell = false,
    padding = 0,
  } = opts;

  let columns, rows, count;
  if (finite(opts.count)) {
    // count is given, count from it
    count = opts.count;
    const ret = dimsFromCount(count, opts);
    columns = ret.columns;
    rows = ret.rows;
  } else {
    if (!finite(opts.rows) || !finite(opts.columns)) {
      throw new Error(
        "If { count } is not specified, must provide both rows and columns"
      );
    }
    columns = opts.columns;
    rows = opts.rows;
    count = rows * columns;
  }

  // const rows = Math.ceil(count / columns);
  let scale = opts.scale != null ? opts.scale : 1;
  let cellWidth = (1 / columns) * childWidth;
  let cellHeight = (1 / rows) * childHeight;

  let tx = (width - childWidth) * 0.5;
  let ty = (height - childHeight) * 0.5;
  if (squareRatio) {
    cellHeight = cellWidth;
  }

  const cw = cellWidth;
  const ch = cellHeight;
  let padScaled, padXSize, padYSize, innerWidth, innerHeight;

  padScaled = padding * scale;
  cellWidth = Math.max(0, cellWidth * scale - padScaled);
  cellHeight = Math.max(0, cellHeight * scale - padScaled);
  padXSize = Math.max(0, (columns - 1) * padScaled);
  padYSize = Math.max(0, (rows - 1) * padScaled);
  innerWidth = cellWidth * columns + padXSize;
  innerHeight = cellHeight * rows + padYSize;

  let sc = 1;
  if (innerHeight > childHeight) sc *= childHeight / innerHeight;
  if (innerWidth > childWidth) sc *= childWidth / innerWidth;

  if (sc !== 1) {
    scale *= sc;
    padScaled = padding * scale;
    cellWidth = Math.max(0, cellWidth * scale - padScaled);
    cellHeight = Math.max(0, cellHeight * scale - padScaled);
    padXSize = Math.max(0, (columns - 1) * padScaled);
    padYSize = Math.max(0, (rows - 1) * padScaled);
    innerWidth = cellWidth * columns + padXSize;
    innerHeight = cellHeight * rows + padYSize;
  }
  tx = (width - innerWidth) * 0.5;
  ty = (height - innerHeight) * 0.5;

  const cells = [];
  for (let y = 0, c = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++, c++) {
      if (!everyCell && c >= count) break;
      const px = tx + x * (cellWidth + padScaled);
      const py = ty + y * (cellHeight + padScaled);
      const cell = {
        row: y,
        column: x,
        rows,
        columns,
        cx: px + cellWidth / 2,
        cy: py + cellHeight / 2,
        x: px,
        y: py,
        u: columns <= 1 ? 0.5 : x / (columns - 1),
        v: rows <= 1 ? 0.5 : y / (rows - 1),
        width: cellWidth,
        height: cellHeight,
        radius: Math.min(cellWidth, cellHeight) / 2,
        filled: c < count,
        index: c,
      };
      cb(cell);
      cells.push(cell);
    }
  }
  return {
    count,
    rows,
    columns,
    cells,
    x: tx,
    y: ty,
    width: innerWidth,
    height: innerHeight,
  };
}
