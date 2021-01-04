import { Container, Graphics, Sprite } from "pixi.js";
import { UV_COORDS } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/uv_coords.js";
import { MESH_ANNOTATIONS } from "@tensorflow-models/face-landmarks-detection/dist/mediapipe-facemesh/keypoints.js";

// Tensorflow JS Facial Landmark Detection:
// https://github.com/tensorflow/tfjs-models/tree/master/face-landmarks-detection
// Import @tensorflow/tfjs-core
import "@tensorflow/tfjs-core";
// Because we are using the WebGL backend:
import "@tensorflow/tfjs-backend-webgl";
// Require face-landmarks-detection itself
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";

// We're downloading and storing the original models for off-network access
// The original models are located at: 'https://tfhub.dev/mediapipe/tfjs-model/facemesh/1/default/1'
const FACEMESH_GRAPHMODEL_PATH = `${process.env.PUBLIC_URL}/tjfs-facemesh_1_default_1/model.json`;
// and 'https://tfhub.dev/mediapipe/tfjs-model/iris/1/default/2'
const IRIS_GRAPHMODEL_PATH = `${process.env.PUBLIC_URL}/tfjs-model_iris_1_default_2/model.json`;

// Add default UVs for Irises (they are not currently provided)
const irisUVCoords = {
  // Left Iris
  468: [0.576, 0.426],
  469: [0.567, 0.425],
  470: [0.578, 0.416],
  471: [0.586, 0.427],
  472: [0.574, 0.436],
  // Right Iris
  473: [0.418, 0.427],
  474: [0.432, 0.426],
  475: [0.417, 0.414],
  476: [0.404, 0.429],
  477: [0.42, 0.44],
};
for (const index in irisUVCoords) {
  UV_COORDS[index] = irisUVCoords[index];
}

/**
 * Gets the size from out tensor flow bounding box
 *
 * @param {Object} boundingBox
 * @param {Number} boundingBox.topLeft The top left coordinate of the container
 * @param {Number} boundingBox.bottomRight The bottom right coordinate of the container
 */
export function getSizeFromBoundingBox({ topLeft, bottomRight }) {
  return {
    width: bottomRight[0] - topLeft[0],
    height: bottomRight[1] - topLeft[1],
  };
}

/**
 * The UV coords are normalized in terms of 0 -> 1 of the container
 * Convert the relative values to pixels in the container
 *
 * @param {Array} point
 * @param {Number} point[0] The x value of the point
 * @param {Number} point[1] The y value of the point
 * @param {Array} containerSize
 * @param {Number} containerSize[0] The width value of the container
 * @param {Number} containerSize[1] The height value of the container
 */
function convertUVToContainer([x, y], [width, height]) {
  return [x * width, y * height];
}

/**
 * Converts the tensor flow mesh to a relative (0->1) position
 *
 * @param {Array} point
 * @param {Number} point[0] The x value of the point
 * @param {Number} point[1] The y value of the point
 * @param {Object} boundingBox
 * @param {Number} boundingBox.topLeft The top left coordinate of the container
 * @param {Number} boundingBox.bottomRight The bottom right coordinate of the container
 */
function convertMeshToRelative([x, y], boundingBox) {
  const { width, height } = getSizeFromBoundingBox(boundingBox);
  return [
    (x - boundingBox.topLeft[0]) / width,
    (y - boundingBox.topLeft[1]) / height,
  ];
}

function getContainerSize(app, prediction) {
  let container = [];
  if (prediction) {
    const { width, height } = getSizeFromBoundingBox(prediction.boundingBox);
    const scale = Math.max(
      app.renderer.width / width,
      app.renderer.height / height
    );
    container = [width * scale, height * scale];
  } else {
    container = [app.renderer.width, app.renderer.height];
  }

  return container;
}

function getCirclePosition(point, prediction, container) {
  // If the point is an array it's xyz coords, otherwise it's an index reference to UV_COORDS
  let relativeCoords = [];
  if (prediction) {
    relativeCoords = convertMeshToRelative(
      prediction.scaledMesh[point],
      prediction.boundingBox
    );
  } else {
    relativeCoords = UV_COORDS[point];
  }
  return convertUVToContainer(relativeCoords, container);
}

/**
 * Add a point on the face mesh
 */
export function createPoint(point, size, spritesheet, seededRandom) {
  const circle = new Graphics()
    .beginFill(0xffffff * seededRandom())
    .drawCircle(0, 0, size)
    .endFill();
  // TODO: reposition on window resize
  circle.position.set(...point);

  const textureKey =
    spritesheet._frameKeys[
      Math.round((spritesheet._frameKeys.length - 1) * seededRandom())
    ];
  const iconTexture = spritesheet.textures[textureKey];
  const icon = new Sprite(iconTexture);
  icon.anchor.set(0.5, 0.5);
  icon.position.set(circle.x, circle.y);
  icon.finalScale =
    (size * 1.1) / Math.min(iconTexture.width, iconTexture.height);
  icon.scale.set(icon.finalScale);

  // Store the circle so we can reference it in the animation
  icon.circle = circle;
  circle.icon = icon;

  return [circle, icon];
}

export function redrawFace({
  app,
  faceContainer,
  featureContainer,
  prediction,
}) {
  const container = getContainerSize(app, prediction);

  // Center the face in the window, but move it slowly to reduce jitter
  faceContainer.pivot.set(
    faceContainer.pivot.x - (faceContainer.pivot.x - container[0] / 2) * 0.1,
    faceContainer.pivot.y - (faceContainer.pivot.y - container[1] / 2) * 0.1
  );
  faceContainer.position.set(
    faceContainer.position.x -
      (faceContainer.position.x - app.renderer.width / 2) * 0.1,
    faceContainer.position.y -
      (faceContainer.position.y - app.renderer.height / 2) * 0.1
  );

  for (const key in MESH_ANNOTATIONS) {
    const feature = featureContainer.getChildByName(key);
    // Don't draw the silhouette
    if (!key.includes("silhouette")) {
      MESH_ANNOTATIONS[key].forEach((point, pointIndex) => {
        const featurePoint = feature.getChildAt(pointIndex);

        const position = getCirclePosition(point, prediction, container);

        // Move slowly to the point to reduce jitter
        featurePoint.position.set(
          featurePoint.position.x -
            (featurePoint.position.x - position[0]) * 0.1,
          featurePoint.position.y -
            (featurePoint.position.y - position[1]) * 0.1
        );
        featurePoint.icon.position.set(featurePoint.x, featurePoint.y);
      });
    }
  }

  const { width, height } = faceContainer.getLocalBounds();
  // Set the scale so at least some of the edges touch the sides
  const scale =
    Math.min(app.renderer.width / width, app.renderer.height / height) * 1.05;
  // Scale it slowly to reduce jitter
  faceContainer.scale.set(
    faceContainer.scale.x - (faceContainer.scale.x - scale) * 0.1
  );
}

export function drawFace({
  app,
  seededRandom,
  sizeFactor,
  spritesheet,
  faceContainer,
  featureContainer,
  iconContainer,
  prediction,
}) {
  const container = getContainerSize(app, prediction);

  // Center the face in the window
  faceContainer.pivot.set(container[0] / 2, container[1] / 2);
  faceContainer.position.set(app.renderer.width / 2, app.renderer.height / 2);

  // Add all of the important points
  for (const key in MESH_ANNOTATIONS) {
    // Don't draw the silhouette
    if (!key.includes("silhouette")) {
      const feature = new Container();
      feature.name = key;
      const featureIcons = new Container();
      featureIcons.name = `${key}_icons`;

      MESH_ANNOTATIONS[key].forEach((point, pointIndex) => {
        const circlePosition = getCirclePosition(point, prediction, container);

        // Grow size proportional to the page size
        const size = seededRandom() * sizeFactor;

        const [circle, icon] = createPoint(
          circlePosition,
          size,
          spritesheet,
          seededRandom
        );

        // Hide icon if the size is smaller than 1/3rd of the sizeFactor for visual fidelity
        if (size < sizeFactor / 3) {
          icon.visible = false;
        }

        circle.name = pointIndex;
        icon.name = pointIndex;
        feature.addChild(circle);
        featureIcons.addChild(icon);
      });

      featureIcons.position = feature.position;
      featureIcons.pivot = feature.pivot;
      featureIcons.scale = feature.scale;
      featureIcons.rotation = feature.rotation;

      featureContainer.addChild(feature);
      iconContainer.addChild(featureIcons);
    }
  }

  const { width, height } = faceContainer.getLocalBounds();
  // Set the scale so at least some of the edges touch the sides
  const scale =
    Math.min(app.renderer.width / width, app.renderer.height / height) * 1.05;
  // Scale it slowly to reduce jitter
  faceContainer.scale.set(scale);
}

let modelSingleton = null;
export async function getFaceFromMedia(video) {
  if (!modelSingleton) {
    modelSingleton = await faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      {
        shouldLoadIrisModel: true,
        maxFaces: 1,
        modelUrl: FACEMESH_GRAPHMODEL_PATH,
        irisModelUrl: IRIS_GRAPHMODEL_PATH,
      }
    );
  }

  return modelSingleton.estimateFaces({
    input: video,
    predictIrises: true,
  });
}
