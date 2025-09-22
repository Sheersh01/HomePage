 // Varyings
varying vec2 vUv;

            // Uniforms: Common
uniform float uOpacity;
uniform float uThreshold;
uniform float uAlphaTest;
uniform vec3 uColor;
uniform sampler2D uMap;

            // Uniforms: Strokes
uniform vec3 uStrokeColor;
uniform float uStrokeOutsetWidth;
uniform float uStrokeInsetWidth;

            //uniform vars

uniform float uProgress1;
uniform float uTime;
uniform float uProgress2;
uniform float uProgress3;
uniform float uProgress4;
uniform float uProgress5;

uniform vec3 uColor1;

            //varying 

varying vec2 vLayoutUv;

            // Utils: Median
float median(float r, float g, float b) {
    return max(min(r, g), min(max(r, g), b));
}

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
                // Common
                // Texture sample
    vec3 s = texture2D(uMap, vUv).rgb;

                // Signed distance
    float sigDist = median(s.r, s.g, s.b) - 0.5;

    float afwidth = 1.4142135623730951 / 2.0;

                #ifdef IS_SMALL
    float alpha = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDist);
                #else
    float alpha = clamp(sigDist / fwidth(sigDist) + 0.5, 0.0, 1.0);
                #endif

                // Strokes
                // Outset
    float sigDistOutset = sigDist + uStrokeOutsetWidth * 0.5;

                // Inset
    float sigDistInset = sigDist - uStrokeInsetWidth * 0.5;

                #ifdef IS_SMALL
    float outset = smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistOutset);
    float inset = 1.0 - smoothstep(uThreshold - afwidth, uThreshold + afwidth, sigDistInset);
                #else
    float outset = clamp(sigDistOutset / fwidth(sigDistOutset) + 0.5, 0.0, 1.0);
    float inset = 1.0 - clamp(sigDistInset / fwidth(sigDistInset) + 0.5, 0.0, 1.0);
                #endif

                // Border
    float border = outset * inset;

                // Alpha Test
    if(alpha < uAlphaTest)
        discard;

                // Output: Common
    vec4 filledFragColor = vec4(uColor, uOpacity * alpha);

                // Output: Strokes
    vec4 strokedFragColor = vec4(uStrokeColor, uOpacity * border);

    vec3 newColor = uColor1;

    vec4 l1 = vec4(0., 0., 0., border * 8.972);
    vec4 l2 = vec4(0.0, 0.129, 0.369, border * 5.);
    vec4 l3 = vec4(1., 0., 0., outset);
    vec4 l4 = vec4(vec3(0.), outset);
    vec4 l5 = vec4(vec3(0.976), outset);

    float x = floor(vLayoutUv.x * 14.0 * 8.972);
    float y = floor(vLayoutUv.y * 14.0);

    float noise = noise(vec2(x, y)) ;

    float w = .4;
    float p1 = uProgress1;
    p1 = map(p1, 0., 1., -w, 1.);
    p1 = smoothstep(p1, p1 + w, vLayoutUv.x);

    float mix1 = 2. * p1 - noise;
    mix1 = clamp(mix1, 0., 1.);

                //p2 

    float p2 = uProgress2;
    p2 = map(p2, 0., 1., -w, 1.);
    p2 = smoothstep(p2, p2 + w, vLayoutUv.x);

    float mix2 = 2. * p2 - noise;
    mix2 = clamp(mix2, 0., 1.);

                //p3

    float p3 = uProgress3;
    p3 = map(p3, 0., 1., -w, 1.);
    p3 = smoothstep(p3, p3 + w, vLayoutUv.x);

    float mix3 = 2. * p3 - noise;
    mix3 = clamp(mix3, 0., 1.);

                //p4
    float p4 = uProgress4;
    p4 = map(p4, 0., 1., -w, 1.);
    p4 = smoothstep(p4, p4 + w, vLayoutUv.x);

    float mix4 = 2. * p4 - noise;
    mix4 = clamp(mix4, 0., 1.);

                //p5

    float p5 = uProgress5;
    p5 = map(p5, 0., 1., -w, 1.);
    p5 = smoothstep(p5, p5 + w, vLayoutUv.x);

    float mix5 = 2. * p5 - noise;
    mix5 = clamp(mix5, 0., 1.);

                  //mix  layers

    vec4 layer1 = mix(vec4(0.), l1, 1. - mix1);
    vec4 layer2 = mix(layer1, l2, 1. - mix2);
    vec4 layer3 = mix(layer2, l3, 1. - mix3);
    vec4 layer4 = mix(layer3, l4, 1. - mix4);
    vec4 layer5 = mix(layer4, l5, 1. - mix5);

    gl_FragColor = strokedFragColor;
                // gl_FragColor = vec4(uProgress1*1.0, 0.0, 0.0, 1.0);

    gl_FragColor = layer5;
}