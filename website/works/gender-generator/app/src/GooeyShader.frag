// Based on Waterdrop shader from https://codepen.io/stefanweck/pen/Vbgeax
precision highp float;
varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform float uThreshold;

void main(void) {
    vec4 color = texture2D(uSampler, vTextureCoord);
    color.a = step(uThreshold, color.a);
    gl_FragColor = color;
}