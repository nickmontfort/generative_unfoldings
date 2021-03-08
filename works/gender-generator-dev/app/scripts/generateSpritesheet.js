const fs = require("fs");

// Builds a spritesheet.json file from our list of sprites
// Run using `node generateSpritesheet.js`

const SPRITE_SIZE = 200;
const SPRITES = [
  ["shoe", "robot", "lips", "ear", "phone", "computer", "clouds", "flowers"],
  ["tie", "tree", "purse", "mail", "fire", "snail", "house", "frog"],
  ["mushroom", "butterfly", "crown", "wave", "bra", "binder", "bone", "mouse"],
  [
    "leftEarring",
    "pet",
    "leo",
    "pisces",
    "scorpio",
    "virgo",
    "libra",
    "capricorn",
  ],
  [
    "bunny",
    "chicken",
    "gemini",
    "sagittaruis",
    "aquarius",
    "aries",
    "cancer",
    "hourglass",
  ],
  ["bubble", "sun", "heart", "ghost", "skull", "sparkles", "dolphin", "moon"],
  [
    "tv",
    "coffee",
    "rightEar",
    "rightEarring",
    "chat",
    "plus",
    "trash",
    "document",
  ],
  [
    "folder",
    "floppy",
    "calendar",
    "cursor",
    "rightEyebrow",
    "eyeOpen",
    "eyePartial",
    "eyelashes",
  ],
  ["cacti", "hand", "leftEyebroe", "equal", "down", "at", "share", "download"],
  ["notEqual", "x", "clock", "dialog", "scissors", "wrench", "door", "target"],
];

const output = {
  frames: {},
  meta: {
    scale: 1,
  },
};

for (let rowIndex = 0; rowIndex < SPRITES.length; rowIndex += 1) {
  const row = SPRITES[rowIndex];
  for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
    output.frames[row[columnIndex]] = {
      frame: {
        x: columnIndex * SPRITE_SIZE,
        y: rowIndex * SPRITE_SIZE,
        w: SPRITE_SIZE,
        h: SPRITE_SIZE,
      },
      spriteSourceSize: {
        x: 0,
        y: 0,
        w: SPRITE_SIZE,
        h: SPRITE_SIZE,
      },
      rotated: false,
      trimmed: false,
      sourceSize: {
        w: SPRITE_SIZE,
        h: SPRITE_SIZE,
      },
    };
  }
}

fs.writeFile("../src/spritesheet.json", JSON.stringify(output), (error) => {
  if (error) {
    console.error("Unable to write file", error);
  } else {
    console.log("File written to app/src/spritesheet.json");
  }
});
