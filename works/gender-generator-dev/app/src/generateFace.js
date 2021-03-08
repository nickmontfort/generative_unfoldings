import { Application, Graphics, Point, Ticker, UPDATE_PRIORITY } from "pixi.js";

/**
 * Sets up transform properties used for animations on each tick
 *
 * @param {PIXI.DisplayObject} displayObject
 */
function setUpMoveOnTick(displayObject) {
  displayObject.scaleTo = new Point(
    displayObject.scale.x,
    displayObject.scale.y
  );
  displayObject.positionTo = new Point(
    displayObject.position.x,
    displayObject.position.y
  );
  displayObject.rotationTo = displayObject.rotation;
}

/**
 * The function that processes that animations and moves on each tick
 *
 * @param {PIXI.DisplayObject} displayObject
 * @param {Object} rateOverrides The object of various rates of change for each transform
 * @param {Number} rateOverrides.positionX The rate of change for the position X property
 * @param {Number} rateOverrides.positionY The rate of change for the position Y property
 * @param {Number} rateOverrides.scaleX The rate of change for the scale X property
 * @param {Number} rateOverrides.scaleY The rate of change for the scale Y property
 * @param {Number} rateOverrides.rotation The rate of change for the rotation property
 */
function moveOnTick(displayObject, rateOverrides = {}) {
  const rates = {
    positionX: 0.1,
    positionY: 0.1,
    scaleX: 0.1,
    scaleY: 0.1,
    rotation: 0.1,
    ...rateOverrides,
  };
  displayObject.position.set(
    displayObject.position.x -
      (displayObject.position.x - displayObject.positionTo.x) * rates.positionX,
    displayObject.position.y -
      (displayObject.position.y - displayObject.positionTo.y) * rates.positionY
  );
  displayObject.scale.set(
    displayObject.scale.x -
      (displayObject.scale.x - displayObject.scaleTo.x) * rates.scaleX,
    displayObject.scale.y -
      (displayObject.scale.y - displayObject.scaleTo.y) * rates.scaleY
  );
  displayObject.rotation =
    displayObject.rotation -
    (displayObject.rotation - displayObject.rotationTo) * rates.rotation;
}

/**
 * Sets the *To values instantly instead of over time
 *
 * @param {PIXI.DisplayObject} displayObject
 */
function moveInstantly(displayObject) {
  displayObject.position.set(
    displayObject.positionTo.x,
    displayObject.positionTo.y
  );
  displayObject.scale.set(displayObject.scaleTo.x, displayObject.scaleTo.y);
  displayObject.rotation = displayObject.rotationTo;
}

/**
 * Creates a fake eye object with an iris
 *
 * @param {Number} x The X position of the eye
 * @param {Number} y The Y position of the eye
 * @param {Number} rotation The rotation of the eye (in radians)
 */
function createEye(x, y, rotation) {
  const eye = new Graphics();
  eye.beginFill(0xffffff).drawEllipse(0, 0, 60, 30).endFill();

  eye.position.set(x, y);
  eye.rotation = rotation;
  setUpMoveOnTick(eye);

  const outline = new Graphics();
  outline
    .lineStyle({ width: 2, color: 0x000000, alignment: 0 })
    .drawEllipse(0, 0, 60, 30);

  const eyeMask = new Graphics();
  eyeMask.beginFill(0x000000).drawEllipse(0, 0, 60, 30);

  const iris = new Graphics();
  iris.beginFill(0x005555).drawCircle(0, 0, 15).endFill();

  setUpMoveOnTick(iris);

  eye.addChild(outline, iris, eyeMask);
  eye.mask = eyeMask;
  eye.iris = iris;
  eye.outline = outline;

  return eye;
}

/**
 * Rotate the face randomly
 *
 * @param {PIXI.Container} faceContainer
 * @param {function} seededRandom
 */
function rotateFace(faceContainer, seededRandom) {
  faceContainer.rotationTo = (Math.PI / 3) * seededRandom() - Math.PI / 6;
}

/**
 * Turn the face from side to side randomly
 *
 * @param {PIXI.Container} faceContainer
 * @param {PIXI.Graphics} mouth
 * @param {PIXI.Graphics} nose
 * @param {PIXI.Graphics} leftEye
 * @param {PIXI.Graphics} rightEye
 * @param {function} seededRandom
 */
function turnFace(faceContainer, mouth, nose, leftEye, rightEye, seededRandom) {
  // Between -.2 and .2
  const direction = 0.4 * seededRandom() - 0.2;

  // Between .8 and 1
  faceContainer.scaleTo.x = 1 + Math.abs(direction);
  // Because we don't have 3d drawing in pixi, we're just going to modify the eye and mouth positions/scales
  // Between .8 and 1.2
  mouth.scaleTo.x = 1 + direction;
  mouth.positionTo.x = direction * 300;

  nose.scaleTo.x = 1 - direction;
  nose.positionTo.x = direction * 300;

  leftEye.positionTo.x = direction * 300 - 80;
  leftEye.scaleTo.x = Math.min(1 + direction * 2, 1.05);
  rightEye.positionTo.x = direction * 300 + 80;
  rightEye.scaleTo.x = Math.min(1 + direction * -2, 1.05);
}

function openMouth(mouth, seededRandom) {
  // Between .45 and .55
  mouth.scaleTo.y = 0.1 * seededRandom() + 0.5;
}

/**
 * Moves the irises of the eyes randomly
 *
 * @param {PIXI.Graphics} leftIris
 * @param {PIXI.Graphics} rightIris
 * @param {function} seededRandom
 */
function moveIris(leftIris, rightIris, seededRandom) {
  // Between -50 and 50
  const xPosition = 100 * seededRandom() - 50;
  // Between -25 and 25
  const yPosition = 50 * seededRandom() - 25;

  leftIris.positionTo.x = xPosition;
  rightIris.positionTo.x = xPosition;
  leftIris.positionTo.y = yPosition;
  rightIris.positionTo.y = yPosition;
}

// if the face is currently blinking
let isBlinking = false;

/**
 * Make the eyes blink
 *
 * @param {PIXI.Graphics} leftEye
 * @param {PIXI.Graphics} rightEye
 */
function blink(leftEye, rightEye) {
  leftEye.scaleTo.y = 0.1;
  rightEye.scaleTo.y = 0.1;
  isBlinking = true;

  // unblink after 300ms
  window.setTimeout(() => {
    leftEye.scaleTo.y = 1;
    rightEye.scaleTo.y = 1;
    isBlinking = false;
  }, 400);
}

/**
 * Generates a canvas with a fake face to feed into the tensor flow model
 */
export function generateFaceCanvas(seededRandom) {
  // Setup the pixi application
  const app = new Application({
    width: 1000,
    height: 1000,
    backgroundColor: 0xffffff,
    sharedTicker: true,
    antialias: true,
  });
  app.start();
  Ticker.shared.remove(app.render, app);

  const faceContainer = new Graphics();
  faceContainer.beginFill(0xcccccc).drawEllipse(0, 0, 200, 250).endFill();
  faceContainer.position.set(app.renderer.width / 2, app.renderer.height / 2);
  setUpMoveOnTick(faceContainer);

  const leftEye = createEye(-80, -75, Math.PI / -12);
  const rightEye = createEye(80, -75, Math.PI / 12);

  const nose = new Graphics();
  nose.beginFill(0xeeeeee).drawEllipse(0, 20, 20, 40).endFill();
  setUpMoveOnTick(nose);

  const mouth = new Graphics();
  mouth.beginFill(0xdd3344).arc(0, 0, 100, 0, Math.PI);

  mouth.position.set(0, 100);
  mouth.scale.set(1, 0.5);
  setUpMoveOnTick(mouth);

  faceContainer.addChild(mouth, nose, leftEye, rightEye);
  faceContainer.position.set(500, 500);
  setUpMoveOnTick(mouth);

  app.stage.addChild(faceContainer);

  // Start with a random expression and position based on the seed
  rotateFace(faceContainer, seededRandom);
  turnFace(faceContainer, mouth, nose, leftEye, rightEye, seededRandom);
  openMouth(mouth, seededRandom);
  moveIris(leftEye.iris, rightEye.iris, seededRandom);

  // Move them right before our first render
  moveInstantly(faceContainer);
  moveInstantly(mouth);
  moveInstantly(nose);
  moveInstantly(rightEye, { scaleY: 0.3 });
  moveInstantly(rightEye.iris);
  moveInstantly(leftEye, { scaleY: 0.3 });
  moveInstantly(leftEye.iris);

  app.render();

  let frameCount = 0;

  // Sets up an animation ticker for various ambient head movements and
  Ticker.shared.add(
    () => {
      frameCount += 1;
      // Only attempt to predict face position every 4 frames to up performance
      if (frameCount % 3) {
        return;
      }
      frameCount = 0;

      const tickSeed = seededRandom();
      // There's a 3% chance on every tick the face will rotate a different direction
      if (tickSeed >= 0.98) {
        rotateFace(faceContainer, seededRandom);
      }
      // There's a 5% chance on every tick the face will turn a different direction
      // This is overlapping with rotation for smoother head movement
      if (tickSeed >= 0.96) {
        turnFace(faceContainer, mouth, nose, leftEye, rightEye, seededRandom);
      }

      // Change the mouth size occasionally (4%)
      if (tickSeed >= 0.93 && tickSeed < 0.96) {
        openMouth(mouth, seededRandom);
      }
      // Move the eyes occasionally (5%)
      if (tickSeed >= 0.89 && tickSeed < 0.93) {
        moveIris(leftEye.iris, rightEye.iris, seededRandom);
      }
      // Blink occasionally (1%)
      if (tickSeed >= 0.88 && tickSeed < 0.89 && !isBlinking) {
        blink(leftEye, rightEye);
      }

      // Change the scaling, rotation, and positions slowly (.1)
      moveOnTick(faceContainer);
      moveOnTick(mouth);
      moveOnTick(nose);

      // Blinking occurs faster
      moveOnTick(rightEye, { scaleY: 0.3 });
      moveOnTick(rightEye.iris);

      // Blinking occurs faster
      moveOnTick(leftEye, { scaleY: 0.3 });
      moveOnTick(leftEye.iris);
      app.render();
    },
    null,
    UPDATE_PRIORITY.HIGH
  );

  return app.view;
}
