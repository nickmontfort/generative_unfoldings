import { Filter } from "pixi.js";

import fragment from "./GooeyShader.frag";

class GooeyFilter extends Filter {
  constructor(threshold = 0.2) {
    super(Filter.defaulVertexSrc, fragment);
    this._threshold = threshold;
    this.uniforms.uThreshold = this._threshold;
  }

  /**
   * Sets the threshold for the amount of goooooo
   *
   * @member {Number}
   * @default 0
   */
  set threshold(value) {
    this._threshold = value;
    this.uniforms.uThreshold = value;
  }
  get threshold() {
    return this._threshold;
  }
}

export default GooeyFilter;
