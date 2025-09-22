varying vec2 vUv;
varying float vTime;
varying vec3 vPosition;

varying vec3 vbaseFirst;
varying vec3 vaccent;
varying vec3 vbaseSecond;
varying vec3 vbaseThird;

float mod289(float x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 perm(vec4 x) {
    return mod289(((x * 34.0) + 1.0) * x);
}

float noise(vec3 p) {
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

mat2 rotate2D(float angle) {
    return mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
}

float lines(vec2 uv, float offset) {
    return smoothstep(.0, .5 + offset * 0.5, abs(.5 * (sin(uv.x * 2.) + offset * 2.)));
}

void main() {

    // vec3 baseFirst = vec3(120. / 255., 158. / 255., 113. / 255.);
    // vec3 accent = vec3(0. / 255., 0. / 255., 0. / 255.);
    // vec3 baseSecond = vec3( 0.9922,0.9412,0.8353);

    // vec3 baseFirst = vec3(0.8627, 0.0784 ,0.2353 );
    // vec3 accent = vec3(.0000, .1, 	0.1);
    // vec3 baseSecond =vec3(1.0,0.3019 ,0.4275 );

    // vec3 baseSecond = vec3(224. / 255., 148. / 255., 66. / 255.);

    // vec3 baseFirst = vec3(120. / 255., 158. / 255., 113. / 255.);


    
    vec3 baseFirst = vec3(1.0000,0.3569,0.3804);
    vec3 accent = vec3(0. / 255., 0. / 255., 0. / 255.);
    vec3 baseSecond = vec3(0.9804, 0.9766, 0.9647);

    float n = noise(vPosition + vTime);

    vec2 baseUV = rotate2D(n) * vPosition.xy;
    float basePattern = lines(baseUV, .5);
    float secondBasePattern = lines(baseUV, .1);

    // vec3 vbaseColor = mix(vec3(vbaseSecond), vec3(vbaseFirst), basePattern);
    // vec3 secondBaseColor = mix(vec3(vbaseColor), vec3(vaccent), secondBasePattern);

    vec3 baseColor = mix(baseSecond, baseFirst, basePattern);
    vec3 secondBaseColor = mix(baseColor, accent, secondBasePattern);

    gl_FragColor = vec4(vec3(secondBaseColor), 1.0);
}