const findFocusWords = require("./findFocusWords");

async function loadLines(url) {
  const resp = await fetch(url);
  return (await resp.text()).split("\n").filter(Boolean);
}

const tokenize = (line) =>
  line
    .replace(/\'[a-z]+/g, "")
    .replace(/\-/g, " ")
    .split(/\s+/g)
    .filter(Boolean);

module.exports = loadData;
module.exports.tokenize = tokenize;
async function loadData(random) {
  const [haikusRaw, rawAssociations] = await Promise.all([
    loadLines("./assets/haiku-best.txt"),
    loadLines("./assets/associations.txt"),
  ]);

  // TODO "fall" word is a bit messy
  const seasons = ["spring", "summer", "winter", "autumn"];
  const cuesToTargets = new Map();
  const targetsToCues = new Map();
  rawAssociations.forEach((a) => {
    const list = a.split(",");
    const cue = list[0];
    const targets = list.slice(1);
    const seasonCue = seasons.includes(cue);
    targets.forEach((target) => {
      const seasonTarget = seasons.includes(target);
      if (seasonCue && seasonTarget) return;

      if (!cuesToTargets.has(cue)) cuesToTargets.set(cue, new Set());
      if (!targetsToCues.has(target)) targetsToCues.set(target, new Set());
      cuesToTargets.get(cue).add(target);
      targetsToCues.get(target).add(cue);
    });
  });

  // const removeFromFall = 'wind,summer,spring,snow,season,leaf,frost,autumn,'

  const cues = [...cuesToTargets.keys()];

  // fix specific issue with 'spring' being a VB instead of NN
  const cleanPOS = (text, pattern) => {
    const tokens = tokenize(text);
    const tags = pattern.split(" ");
    const idx = tokens.indexOf("spring");
    if (tokens.length === tags.length && idx >= 0) {
      tags[idx] = "NN";
      pattern = tags.join(" ");
    }
    const tokenSet = new Set(tokens);
    const key = [text, pattern].join("/");
    return [text, pattern, tokenSet, key];
  };

  const settings = [];
  const phrases = [];
  haikusRaw.forEach((h) => {
    const items = h.split("/");
    if (items.length === 2) {
      settings.push(cleanPOS(items[0], items[1]));
    } else {
      const verses = items.slice(0, 2);
      const patterns = items.slice(2);
      phrases.push([
        cleanPOS(verses[0], patterns[0]),
        cleanPOS(verses[1], patterns[1]),
      ]);
    }
  });

  const wordToTag = {};
  const allKeywords = [];
  // phrases
  const allVerses = [...settings, ...phrases.flat()];
  allVerses.forEach(([verse, pattern, tokenSet]) => {
    const tokens = [...tokenSet];
    const tags = pattern.split(" ");
    if (tokens.length === tags.length) {
      tokens.forEach((t, i) => {
        if (!(t in wordToTag)) {
          wordToTag[t] = tags[i];
          if (
            tags[i] === "NN" &&
            !allKeywords.includes(t) &&
            (cuesToTargets.has(t) || targetsToCues.has(t))
          ) {
            allKeywords.push(t);
          }
        }
      });
    }
  });

  const seasonToSeasonalWords = new Map();
  const seasonalWordsToSeasons = new Map();
  seasons.forEach((season) => {
    const seasonKey = season;
    // const seasonKey = season === "fall" ? "autumn" : season;
    const others = neighbours(season);
    if (seasonToSeasonalWords.has(seasonKey)) {
      const prev = seasonToSeasonalWords.get(seasonKey);
      others.forEach((e) => prev.push(e));
    } else {
      seasonToSeasonalWords.set(seasonKey, others);
    }
    others.forEach((other) => {
      if (!seasonalWordsToSeasons.has(other))
        seasonalWordsToSeasons.set(other, []);
      seasonalWordsToSeasons.get(other).push(seasonKey);
    });
  });

  // console.log(seasonToSeasonalWords);
  // console.log(seasonalWordsToSeasons);

  // printHaiku(random.shuffle(allKeywords).slice(0, 4));
  // console.log(haiku(["summer"], 100).slice(0, 10));
  // console.log(haiku(["winter"], 100).slice(0, 10));
  // console.log(haiku(["typewriter"], 100).slice(0, 10));
  // console.log(countRelationship(["spring"], ["blossom"], ["ice", "cream"]));

  return {
    haikusRaw,
    cuesToTargets,
    targetsToCues,
    neighbours,
    associated,
    randomWord,
    gatherThemes,
    haiku,
    findSeason,
    // versesFromThemes,
    walkAssociations,
  };

  function findSeason(words) {
    let sums = {
      winter: 0,
      autumn: 0,
      spring: 0,
      summer: 0,
    };

    let exactMatches = new Set();
    words.forEach((w) => {
      if (w === "fall") w = "autumn";
      if (seasons.includes(w)) {
        exactMatches.add(w);
      }
    });

    // if only one season is present in input, make that the result
    // so e.g. "winter sun" -> winter, not winter + summer
    // but "cool sun" can be both winter and summer
    if (exactMatches.size === 1) {
      const m = [...exactMatches][0];
      sums[m]++;
    } else {
      words.forEach((w) => {
        if (w === "fall") w = "autumn";
        if (seasons.includes(w)) {
          sums[w]++;
        } else if (seasonalWordsToSeasons.has(w)) {
          seasonalWordsToSeasons.get(w).forEach((s) => {
            if (s === "fall") s = "autumn";
            if (s in sums) {
              sums[s]++;
            }
          });
        }
      });
    }

    const matches = Object.entries(sums).sort((a, b) => b[1] - a[1]);
    const seasonResults = matches.filter((t) => t[1] > 0).map((s) => s[0]);
    return {
      seasons: seasonResults,
      season: seasonResults.length === 1 ? seasonResults[0] : null,
      matches,
    };
  }

  function printHaiku(inputs) {
    const h = haiku(inputs);
    const txt = `${inputs.join(",")}--\n${h
      .slice(0, 10)
      .map((n) => n.value.join(" / "))
      .join("\n")}`;
    console.log(txt);
    console.log("\n");
  }

  function getFocusWords(tokens) {
    return findFocusWords(tokens, wordToTag);
  }

  function excludeClashingSeasonalWords(curSeasons, words) {
    if (!curSeasons || curSeasons.length === 0) return words.slice();

    const result = [];
    words.forEach((w) => {
      const key = w === "fall" ? "autumn" : w;
      if (seasons.includes(key)) {
        if (curSeasons.includes(key) || curSeasons.includes(w)) {
          result.push(w);
        }
      } else {
        result.push(w);
      }
    });
    return result;

    // const result = [];
    // words.forEach((w) => {
    //   const key = w === "fall" ? "autumn" : w;
    //   if (seasons.includes(key)) {
    //     if (curSeasons.includes(key) || curSeasons.includes(w)) {
    //       result.push(w);
    //     }
    //   } else if (seasonalWordsToSeasons.has(key)) {
    //     const targetSeasons = seasonalWordsToSeasons.get(key);
    //     if (targetSeasons.some((s) => curSeasons.includes(s))) {
    //       result.push(w);
    //     }
    //   } else {
    //     result.push(w);
    //   }
    // });
    // return result;
  }

  function haiku(inputWords, maxIterations = 25, minHaikus = 10) {
    const curSeasons = findSeason(inputWords).seasons;
    let otherSeasons = [];
    if (curSeasons.length > 0) {
      otherSeasons = seasons.filter((s) => {
        const k = s === "autumn" ? "fall" : s;
        return !curSeasons.includes(s) && !curSeasons.includes(k);
      });
    }

    const associatedWithInput = excludeClashingSeasonalWords(curSeasons, [
      ...new Set([...inputWords, ...associated(inputWords)]),
    ]);
    const allInputWords = excludeClashingSeasonalWords(curSeasons, [
      ...new Set([
        ...inputWords,
        ...inputWords.map((w) => neighbours(w)).flat(),
      ]),
    ]);
    const poems = [];
    const input = [...new Set([...inputWords])];
    const settingList = filterHaiku(associatedWithInput, {
      stanza: 0,
      minAttempts: 0,
      exclude: [...otherSeasons],
    });
    if (settingList.length <= 3) return [];

    for (let i = 0; poems.length < minHaikus && i < maxIterations; i++) {
      const [verse0, pattern0] = random.pick(settingList);
      const focus = getFocusWords(tokenize(verse0)).filter(
        (w) => !input.includes(w)
      );
      if (focus.length === 0) continue;
      const closest = excludeClashingSeasonalWords(
        curSeasons,
        associated([...focus])
          .filter((w) => !focus.includes(w) && !input.includes(w))
          .slice(0, 10)
      );
      if (closest.length === 0) continue;

      const verse1s = filterHaiku(closest, {
        stanza: 1,
        minAttempts: 0,
        minSize: 5,
        exclude: [...tokenize(verse0), ...otherSeasons],
      });
      if (verse1s.length <= 3) continue;
      const [verse1, pattern1] = random.pick(verse1s);

      const validPatterns = [];
      phrases.forEach((chunk) => {
        const [second, third] = chunk;
        if (second[1] === pattern1) {
          validPatterns.push(third[1]);
        }
      });

      const farthest = excludeClashingSeasonalWords(curSeasons, [
        ...new Set(
          closest
            .slice(0, 5)
            .map((w) => gatherThemes(w))
            .flat()
            .filter(
              (w) =>
                !input.includes(w) && !focus.includes(w) && !closest.includes(w)
            )
        ),
      ]);
      const verse2s = filterHaiku(farthest, {
        stanza: 2,
        minSize: 5,
        minAttempts: 0,
        patterns: validPatterns,
        exclude: [
          ...tokenize(verse0),
          ...tokenize(verse1),
          ...otherSeasons,
          ...focus,
          ...closest,
        ],
      });
      if (verse2s.length <= 3) continue;
      const [verse2, pattern2] = random.pick(verse2s);

      const poem = [verse0, verse1, verse2];
      poems.push({
        poem,
        patterns: [pattern0, pattern1, pattern2],
        themesClose: closest,
        themesFar: farthest,
      });
    }

    poems.forEach((p) => {
      const lineTokens = p.poem.map((line) => tokenize(line));
      // const line0 = lineTokens[0];
      // const line12 = [...lineTokens[1], ...lineTokens[2]];
      const relations = countRelationshipLines(
        associatedWithInput,
        lineTokens[0],
        lineTokens[1],
        lineTokens[2]
      );
      p.debug = [p.poem.join("/"), "---", relations].join(" ");
      p.weight = relations;
      p.value = p.poem;
    });
    // poems.sort((a, b) => a.relations - b.relations);
    poems.sort((a, b) => b.weight - a.weight);
    // poems.forEach((p) => console.log(p.debug));
    const result = poems.map((p) => {
      return { value: p.poem, weight: p.weight };
    });
    return result;
  }

  function intersections(na, nb) {
    let hits = 0;
    for (let i = 0; i < na.length; i++) {
      for (let j = 0; j < nb.length; j++) {
        if (na[i] === nb[j]) {
          hits++;
        }
      }
    }
    return hits;
  }

  function countRelationshipLines(inputs, a, b, c) {
    const assoc = countAssociations([...a, ...b, ...c]);
    let avg = assoc.reduce((sum, a) => sum + a, 0) / 3;
    let len = Math.sqrt(assoc[0] * assoc[0] + assoc[1] * assoc[1]);
    let mlen = Math.abs(assoc[0]) + Math.abs(assoc[1]);

    let norm = assoc.slice();
    // if (len !== 0) {
    //   norm[0] /= len;
    //   norm[1] /= len;
    //   norm[0] *= 5;
    //   norm[1] *= 5;
    // }

    const na = [
      ...new Set([...a, ...a.map((w) => neighbours(w, true)).flat()]),
    ];
    const nb = [
      ...new Set([...b, ...b.map((w) => neighbours(w, true)).flat()]),
    ];
    const nc = [
      ...new Set([...c, ...c.map((w) => neighbours(w, true)).flat()]),
    ];

    const i0 = intersections(na, nb);
    const i1 = intersections(nb, nc);
    const i2 = intersections(na, nc);
    const nonZeroSum = [i0, i1, i2].reduce((sum, a) => {
      return sum + (a > 0 ? 1 : 0);
    }, 0);
    const score = nonZeroSum >= 2 ? 1 : 0; //nonZeroSum > 1 ? 1 : 0;

    const allNeighbors = [...new Set([...na, ...nb, ...nc])];

    const iz0 = intersections(na, inputs);
    const iz1 = intersections(nb, inputs);
    const iz2 = intersections(nc, inputs);
    const inputNonZeroSum = [iz0, iz1, iz2].reduce((sum, a) => {
      return sum + (a > 0 ? 1 : 0);
    }, 0);
    const inputNonZeroScore = inputNonZeroSum >= 1 ? 1 : 0;

    return inputNonZeroScore * score * (norm[0] * -1 + norm[1]);
    // (norm[0] * 1 + norm[1] > 0 ? 1 : 0);
    // return inputNonZeroScore + score * (norm[0] * -1 + norm[1] > 0 ? 1 : 0);
    // let score = nonZeros + assoc[0] * 0.5 + assoc[1] * 1;
    // const score = (norm[0] > 0 ? 1 : 0) * (norm[1] > 0 ? 1 : 0);
    // return score * norm[0] * nonZeros;
    // return Math.abs(score - 7);

    // return [assoc, "-", avg.toFixed(2), len.toFixed(2), mlen];

    // // let score = 0;
    // const vec = [i0, i1, i2];

    // const len = Math.sqrt(i0 * i0 + i1 * i1 + i2 * i2);

    // let sum = 0;
    // if (len !== 0) {
    //   for (let i = 0; i < vec.length; i++) {
    //     sum += (1 / 3) * (vec[i] / len);
    //   }
    // }

    // sum += nonZeros;

    // return [sum, ];
    // return sum;
    // return [Math.sqrt(lenSq), "-", vec];
  }

  function countRelationship(a, b) {
    a = Array.isArray(a) ? a : [a];
    b = Array.isArray(b) ? b : [b];

    let hits0 = intersections(a, b);

    const na = [...new Set([...a, ...a.map((w) => neighbours(w)).flat()])];
    const nb = [...new Set([...b, ...b.map((w) => neighbours(w)).flat()])];

    let hits1 = intersections(na, nb);

    const na2 = [...new Set([...na, ...na.map((w) => neighbours(w)).flat()])];
    const nb2 = [...new Set([...nb, ...nb.map((w) => neighbours(w)).flat()])];

    let hits2 = intersections(na2, nb2);

    return [hits0, hits1, hits2];
  }

  function distance(a, b, depth = 0, maxDepth = 2) {
    a = Array.isArray(a) ? a : [a];
    b = Array.isArray(b) ? b : [b];

    const na = [
      ...new Set([...a, ...a.map((w) => neighbours(w, true)).flat()]),
    ];
    const nb = [
      ...new Set([...b, ...b.map((w) => neighbours(w, true)).flat()]),
    ];

    let intersect = false;
    outer: for (let i = 0; i < na.length; i++) {
      for (let j = 0; j < nb.length; j++) {
        if (na[i] === nb[j]) {
          intersect = true;
          break outer;
        }
      }
    }

    console.log(depth);
    console.log(a, b);
    console.log(na, nb);
    console.log(intersect);
    console.log("--");

    if (intersect) {
      return depth;
    } else if (depth < maxDepth) {
      return distance(na, nb, depth + 1, maxDepth);
    } else {
      return depth;
    }
  }

  function countAssociations(tokens) {
    const relations1 = new Set();
    const relations2 = new Set();
    tokens.forEach((token) => {
      const related = neighbours(token);
      tokens.forEach((other) => {
        if (token === other) return;
        const relation = [token, other];
        relation.sort();
        const r = relation.join(":");
        if (related.includes(other)) {
          if (!relations1.has(r)) {
            relations1.add(r);
          }
        } else {
          const otherRelated = neighbours(other);
          if (otherRelated.some((o) => related.includes(o))) {
            if (!relations2.has(r)) {
              relations2.add(r);
            }
          }
        }
      });
    });
    return [relations1.size, relations2.size];
  }

  function filterHaiku(
    context = "",
    {
      stanza = 0,
      include = [],
      exclude = [],
      attempts = 0,
      maxAttempts = 3,
      minAttempts = 0,
      minSize = 10,
      patterns = null,
    } = {}
  ) {
    context = (Array.isArray(context) ? context : [context]).filter(Boolean);
    patterns = (Array.isArray(patterns) ? patterns : [patterns]).filter(
      Boolean
    );
    if (context.length <= 0) return [];
    const map = {};
    include.forEach((chunk) => {
      const [verse, pattern, _, key] = chunk;
      if (!(key in map)) {
        map[key] = chunk;
      }
    });
    if (stanza === 0) {
      settings.forEach((chunk) => {
        checkChunk(chunk);
      });
    } else {
      const idx = stanza - 1;
      if (idx !== 0 && idx !== 1) {
        throw new Error(`Stanza must be 0, 1, or 2`);
      }
      phrases.forEach((set) => {
        const chunk = set[idx];
        checkChunk(chunk);
      });
    }
    const nextChunks = Object.values(map);
    if (
      attempts < minAttempts ||
      (nextChunks.length < minSize && attempts < maxAttempts)
    ) {
      let newContext = context.map((c) => neighbours(c)).flat();
      return filterHaiku(newContext, {
        include: nextChunks,
        attempts: attempts + 1,
        maxAttempts,
        minAttempts,
        minSize,
        patterns,
        stanza,
      });
    }
    return nextChunks;

    function checkChunk(chunk) {
      const [verse, curPattern, tokens, key] = chunk;
      if (!(key in map)) {
        if (!exclude.some((e) => tokens.has(e))) {
          let validPattern =
            patterns.length === 0 || patterns.includes(curPattern);
          if (validPattern && context.some((c) => tokens.has(c))) {
            map[key] = chunk;
          }
        }
      }
    }
  }

  function associated(words) {
    words = Array.isArray(words) ? words : [words];
    const sets = [];
    words.forEach((w) => {
      sets.push(neighbours(w));
    });

    const associatedWords = [
      ...new Set(sets.flat().filter((w) => !words.includes(w))),
    ];

    const scored = associatedWords
      .map((w) => {
        // how many sets this word appears in
        let score = 0;
        sets.forEach((s) => {
          if (s.includes(w)) score++;
        });
        words.forEach((cue) => {
          if (cuesToTargets.has(cue) && cuesToTargets.get(cue).has(w))
            score += 1;
          // if (targetsToCues.has(cue) && targetsToCues.get(cue).has(w))
          //   score += 1;
        });
        if (score <= 1) return false;
        return {
          word: w,
          score,
        };
      })
      .filter(Boolean);

    scored.sort((a, b) => b.score - a.score);
    return scored.map((w) => w.word);
  }

  function randomWord() {
    return random.pick(cues);
  }

  // function versesFromThemes(stanza, themes, ignore = []) {
  //   return haikus
  //     .filter((h) => {
  //       if (themes.includes(h.lines[stanza])) return false;
  //       if (
  //         ignore.length &&
  //         h.tokenized[stanza].some((t) => ignore.includes(t))
  //       )
  //         return false;
  //       if (h.tokenized[stanza].some((t) => themes.includes(t))) return true;
  //       return false;
  //     })
  //     .map((t) => t.lines[stanza]);
  // }

  function neighbours(word, direct = false) {
    word = word.toLowerCase();
    const a = new Set(cuesToTargets.get(word) || []);
    const b = direct ? [] : new Set(targetsToCues.get(word) || []);
    const neighbs = [...new Set([...a, ...b])].filter((w) => w !== word);
    return neighbs;
  }

  function gatherThemes(seed) {
    return Array.from(
      new Set([
        ...walkAssociations(seed.toLowerCase(), 1, 10, 1, 4),
        ...walkAssociations(seed.toLowerCase(), 5, 10, 1, 1),
      ])
    );
  }

  function walkAssociations(
    seed,
    epochs = 1,
    iterations = 8,
    minSteps = 1,
    maxSteps = 4
  ) {
    const words = new Set();
    seed = seed.toLowerCase();
    words.add(seed);
    for (let e = 0; e < epochs; e++) {
      let start = random.pick(Array.from(words));
      for (let i = 0; i < iterations; i++) {
        let current = start;
        const steps = random.rangeFloor(minSteps, maxSteps);
        innerLoop: for (let j = 0; j < steps; j++) {
          const isCueToTarget = random.boolean();
          const set = Array.from(
            (isCueToTarget
              ? cuesToTargets.get(current)
              : targetsToCues.get(current)) || []
          );
          if (set.length === 0) break innerLoop;
          current = random.pick(set);
        }
        words.add(current);
      }
    }
    return Array.from(words);
  }
}
