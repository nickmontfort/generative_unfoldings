const fs = require("fs");
const path = require("path");

const associationLines = fs
  .readFileSync(path.resolve(__dirname, "./data/free_association.txt"), "utf8")
  .split("\n")
  .slice(1);
const usedWords = new Set(
  fs
    .readFileSync(path.resolve(__dirname, "./data/all-keywords.txt"), "utf8")
    .split("\n")
);

const cuesToTargets = new Map();
const targetsToCues = new Map();
const associations = associationLines.map((line) => {
  return line
    .split(",")
    .slice(0, 2)
    .map((w) => w.trim().toLowerCase());
});
associations.forEach((e) => {
  const [cue, target] = e;
  if (!cuesToTargets.has(cue)) cuesToTargets.set(cue, new Set());
  if (!targetsToCues.has(target)) targetsToCues.set(target, new Set());
  cuesToTargets.get(cue).add(target);
  targetsToCues.get(target).add(cue);
});

// associations.forEach((line) => {
//   if (usedWords.has(cue) || usedWords.has(target)) {
//     if (!map.has(cue)) map.set(cue, new Set());
//     map.get(cue).add(target);
//     usedTargets.add(target);
//   }
// });

const possibleWords = new Set();
associations.forEach((e) => {
  if (usedWords.has(e[0]) || usedWords.has(e[1])) possibleWords.add(e[0]);
});

const lines = [];
possibleWords.forEach((word) => {
  const a = new Set(cuesToTargets.get(word) || []);
  const b = [];
  // const b = new Set(targetsToCues.get(word) || []);
  const neighbors = [...new Set([...a, ...b])].filter((w) => w !== word);
  lines.push([word, ...neighbors].join(","));
});

// [...map.entries()].forEach((e) => {
//   const [k, v] = e;
//   lines.push([k, ...v].join(","));
// });
fs.writeFileSync(
  path.resolve(__dirname, "../public/associations.txt"),
  lines.join("\n")
);
