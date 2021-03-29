#ifdef GL_ES
precision mediump float;
precision mediump int;
// precision highp float;
// precision highp int;
#endif

uniform sampler2D texture;
uniform vec3 fontColor;
uniform float lengthRatio;

varying vec2 vertTexCoord;

void main() {
  float u = (vertTexCoord.s)/lengthRatio;
  vec2 uv = vec2(u, 1.0 - vertTexCoord.t);
  vec4 col = texture2D(texture, uv.st);

  float alpha = (1.0-col.r)/0.6*0.9;
  alpha = alpha * (1.0 - step(1.0, uv.x));
  gl_FragColor = vec4(fontColor, alpha);
}
