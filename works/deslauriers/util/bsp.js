class Partition {
  constructor(bounds, parent, depth = 0) {
    this.bounds = copyBounds(bounds);
    this.depth = depth;
    this.children = [];
    this.parent = parent;
  }

  get x() {
    const [min] = this.bounds;
    return min[0];
  }

  set x(v) {
    this.bounds[0][0] = v;
  }

  get y() {
    const [min] = this.bounds;
    return min[1];
  }

  set y(v) {
    this.bounds[0][1] = v;
  }

  get cx() {
    return this.x + this.width / 2;
  }

  get cy() {
    return this.y + this.height / 2;
  }

  get width() {
    const [min, max] = this.bounds;
    return max[0] - min[0];
  }

  get height() {
    const [min, max] = this.bounds;
    return max[1] - min[1];
  }

  get leaf() {
    return this.parent && this.children.length === 0;
  }

  detach() {
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      this.parent.children.splice(idx, 1);
    }
  }
}

function bsp({
  cellWidth,
  cellHeight,
  offset,
  rows,
  columns,
  maxDepth = 3,
  minDimension,
  splitter,
  round = true,
  filter = () => true,
  shouldSplit = () => true,
  random = () => Math.random(),
  variance = 0.5,
  squariness = 0.5,
}) {
  const randomChoice = (bias = 1, exp = 1) => {
    return random() / Math.pow(bias, exp) < 0.5;
  };

  function randomRange(min, max) {
    return random() * (max - min) + min;
  }

  function defaultSplitter(part) {
    const [min, max] = part.bounds;
    const w = max[0] - min[0];
    const h = max[1] - min[1];
    const v = variance * 0.5;
    const fract = randomRange(0.5 - v, 0.5 + v);
    const horizontal = randomChoice(w / h, squariness);
    const inverse = random() > 0.5;
    return splitBounds(part.bounds, fract, horizontal, inverse).map((bounds) =>
      roundBoundsToGrid(bounds)
    );
  }

  function roundToGrid([x, y]) {
    x -= offset[0];
    y -= offset[1];
    x = Math.floor(x / cellWidth) * cellWidth;
    y = Math.floor(y / cellHeight) * cellHeight;
    x += offset[0];
    y += offset[1];
    return [x, y];
  }

  function roundBoundsToGrid([min, max]) {
    return [roundToGrid(min), roundToGrid(max)];
  }

  function splitPart(part) {
    if (part.depth < maxDepth && shouldSplit(part)) {
      const childBounds = splitter(part) || [];
      part.children = childBounds
        .filter(largeEnough)
        .map((bound) => {
          return new Partition(bound, part, part.depth + 1);
        })
        .filter(filter);
      part.children.forEach(splitPart);
    }
  }

  function largeEnough(bounds) {
    if (!isFinite(minDimension)) return true;
    const [min, max] = bounds;
    const w = max[0] - min[0];
    const h = max[1] - min[1];
    return w >= minDimension && h >= minDimension;
  }

  function splitBounds(
    bounds,
    fract = 0.5,
    horizontal = true,
    inverse = false
  ) {
    const [min, max] = bounds;
    const [x1, y1] = min;
    const [x2, y2] = max;
    const width = x2 - x1;
    const height = y2 - y1;

    fract = Math.max(0, Math.min(1, fract));
    fract = inverse ? 1 - fract : fract;

    const dim = horizontal ? width : height;
    let off = dim * fract;
    // if (round) off = Math.floor(off);

    let a, b;
    if (horizontal) {
      a = [
        [x1, y1],
        [x1 + off, y2],
      ];
      b = [
        [x1 + off, y1],
        [x2, y2],
      ];
    } else {
      a = [
        [x1, y1],
        [x2, y1 + off],
      ];
      b = [
        [x1, y1 + off],
        [x2, y2],
      ];
    }
    return [a, b];
  }

  splitter = splitter || defaultSplitter;
  const [x, y] = offset;
  const graph = new Partition([
    [x, y],
    [x + cellWidth * columns, y + cellHeight * rows],
  ]);
  splitPart(graph);
  return graph;
}

function walk(part, cb = () => {}) {
  function walkNode(part) {
    cb(part);
    part.children.forEach(walkNode);
  }
  walkNode(part);
}

function walkAll(part, cb = () => {}) {
  const stack = [part];
  while (stack.length > 0) {
    const next = stack.pop();
    cb(next);
    const children = [...next.children];
    if (children.length > 0) {
      stack.push(...children);
    }
  }
}

function list(part, { leafOnly = false, maxDepth = Infinity } = {}) {
  const stack = [{ depth: 0, node: part }];
  const res = [];
  while (stack.length > 0) {
    const { node, depth = 0 } = stack.pop();
    if (depth >= maxDepth) continue;

    if (!leafOnly || node.leaf) {
      res.push(node);
    }

    if (depth < maxDepth) {
      const children = [...node.children].map((c) => {
        return { node: c, depth: depth + 1 };
      });
      if (children.length > 0) {
        stack.push(...children);
      }
    }
  }
  return res.reverse();
}

function copyBounds(bounds) {
  return bounds.map((b) => b.slice());
}

module.exports = bsp;
module.exports.walk = walk;
module.exports.walkAll = walkAll;
module.exports.list = list;
module.exports.bsp = bsp;
module.exports.Partition = Partition;
module.exports.copyBounds = copyBounds;
