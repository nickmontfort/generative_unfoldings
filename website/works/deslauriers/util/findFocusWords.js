const stemmer = require("stemmer");
const stopwords = require("./stopwords-en.json");
const stopwordStems = new Set(stopwords.map((w) => stemmer(w)));
const stopwordSet = new Set(stopwords);

// const pos = require("pos");
// const tagger = new pos.Tagger();

const excludePOSFromFocus = [
  "CC",
  "CD",
  "DT",
  "EX",
  "IN",
  "LS",
  "MD",
  "PRP",
  "SYM",
  "TO",
  "UH",
  "WDT",
  "WP",
  "WP$",
  "WRB",
];

module.exports = function findFocusWords(tokens, tagMap) {
  const matchFocusOnly = true;
  const nonStops = tokens.filter((t) => {
    return !stopwordSet.has(t);
  });
  if (!nonStops.length) return matchFocusOnly ? [] : tokens;
  const tagged = tokens.map((token) => {
    const t = token in tagMap ? tagMap[token] : "NN";
    return [token, t];
  });
  const best = tagged.filter((w) => {
    return !excludePOSFromFocus.includes(w[1]);
  });
  if (!best.length) return matchFocusOnly ? [] : nonStops;
  const nonVerbs = best.filter((w) => {
    return !w[1].startsWith("VB");
  });
  if (!nonVerbs.length && matchFocusOnly) return [];
  const result = nonVerbs.length ? nonVerbs : best;
  return result.map((w) => w[0]);
};
