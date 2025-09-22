uniform sampler2D uGoofy1;
uniform float uTime;
uniform float uMousex;
uniform float uMousey;

uniform sampler2D uGlass;

varying vec2 vUv;

void main() {

    vec2 uv = vUv;

    float wave1 = sin(uv.x * 10.0 + uTime * 0.5 + uMousex * 5.0) * .009;
    float wave2 = sin(uv.y * 12.0 + uTime * 0.8 + uMousey * 4.0) * .009;
    float wave3 = cos(uv.x * 8.0 + uTime * 0.5 + uMousex * 3.0) * .009;
    float wave4 = cos(uv.y * 9.0 + uTime * 0.7 + uMousey * 3.5) * .009;

    uv.y += wave1 - wave2;
    uv.x += wave3 - wave4;

    vec4 displacement = texture2D(uGlass, uv);


    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
    gl_FragColor = texture2D(uGoofy1, uv);

}