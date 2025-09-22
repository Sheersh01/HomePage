 // Varyings
varying vec2 vUv;

uniform vec2 u_resolution;
uniform float uProgress1;
uniform float uTime;
uniform float uProgress2;
uniform float uProgress3;
uniform float uProgress4;
uniform float uProgress5;

uniform sampler2D uImage1;
uniform sampler2D uImage2;

#define NUM_OCTAVES 5

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);

    float res = mix(mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x), mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

float fbm(vec2 x) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
    for(int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = rot * x * 2.0 + shift;
        a *= 0.5;
    }
    return v;
}
float map(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {

    // float x = tan(floor(vUv.x * 12.));
    // float y = tan(floor(vUv.y * 12.));
    float x = cos(ceil(vUv.x * 12.));
    float y = sin(ceil(vUv.y * 12.));
    float n = fbm(3.5 * vUv + 0.1 * uTime);
    // float n = noise(vec2(x, y));

    float w = .5;
    float p0 = uProgress1;
    p0 = map(p0, 1.0, 0., -1., w);
    p0 = smoothstep(p0, p0 - w, -vUv.y);
    float mix0 = 2. * p0 - n;
    mix0 = clamp(mix0, 0., 1.);

    float p1 = uProgress2;
    p1 = map(p1, 1.0, 0., -1., w);
    p1 = smoothstep(p1, p1 - w, -vUv.y);
    float mix1 = 2. * p1 - n;
    mix1 = clamp(mix1, 0., 1.);

    float p2 = uProgress3;
    p2 = map(p2, 1.0, 0., -1., w);
    p2 = smoothstep(p2, p2 - w, -vUv.y);
    float mix2 = 2. * p2 - n;
    mix2 = clamp(mix2, 0., 1.);

    float p3 = uProgress4;
    p3 = map(p3, 1.0, 0., -1., w);
    p3 = smoothstep(p3, p3 - w, -vUv.y);
    float mix3 = 2. * p3 - n;
    mix3 = clamp(mix3, 0., 1.);

    vec4 l1 = vec4(vec3(.0), 1.);
    vec4 l2 = vec4(0.862, 0.078, 0.235, 1.);
    vec4 l3 = texture2D(uImage2, vUv);
    vec4 l4 = texture2D(uImage1, vUv);

    l3.r = 1.0 / l3.r ;
    l3.g = 1. - l3.g;
    l3.b = 1.0 - l3.b;

    l3.rgb *= .1;

    vec4 layer0 = mix(vec4(0.), l1, 1. - mix0);
    vec4 layer1 = mix(layer0, l2, 1. - mix1);
    vec4 layer2 = mix(layer1, l3, 1. - mix2);
    vec4 layer3 = mix(layer2, l4, 1. - mix3);


    gl_FragColor = vec4(vec3(mix0), 1.0);
    gl_FragColor = layer3;



}