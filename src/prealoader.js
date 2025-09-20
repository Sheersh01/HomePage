import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

// ----- MAIN SCENE (unchanged) -----

const canvas = document.querySelector("canvas");
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: canvas,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);

// ----- WHITE MASK QUAD -----
const maskScene = new THREE.Scene();
const maskCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

const maskMaterial = new THREE.ShaderMaterial({
  uniforms: {
    u_progress: { value: 0.0 },
    u_time: { value: 0.0 },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    u_noiseStrength: { value: 3.0 },
    u_distortionStrength: { value: 3.0 },
    u_edgeSoftness: { value: 0.6 },
    u_fadeEdges: { value: 0.3 },
    u_maskColor: { value: new THREE.Color("#000") },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    uniform float u_progress;
    uniform float u_time;
    uniform vec2 u_resolution;

    uniform float u_noiseStrength;
    uniform float u_distortionStrength;
    uniform float u_edgeSoftness;
    uniform float u_fadeEdges;
    uniform vec3 u_maskColor;

    const float F3 = 0.3333333;
    const float G3 = 0.1666667;

    vec3 random3(vec3 c) {
        float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
        vec3 r;
        r.z = fract(512.0*j);
        j *= .125;
        r.x = fract(512.0*j);
        j *= .125;
        r.y = fract(512.0*j);
        return r-0.5;
    }

    float simplex3d(vec3 p) {
        vec3 s = floor(p + dot(p, vec3(F3)));
        vec3 x = p - s + dot(s, vec3(G3));
        
        vec3 e = step(vec3(0.0), x - x.yzx);
        vec3 i1 = e*(1.0 - e.zxy);
        vec3 i2 = 1.0 - e.zxy*(1.0 - e);
        
        vec3 x1 = x - i1 + G3;
        vec3 x2 = x - i2 + 2.0*G3;
        vec3 x3 = x - 1.0 + 3.0*G3;
        
        vec4 w, d;
        
        w.x = dot(x, x);
        w.y = dot(x1, x1);
        w.z = dot(x2, x2);
        w.w = dot(x3, x3);
        
        w = max(0.6 - w, 0.0);
        
        d.x = dot(random3(s), x);
        d.y = dot(random3(s + i1), x1);
        d.z = dot(random3(s + i2), x2);
        d.w = dot(random3(s + 1.0), x3);
        
        w *= w;
        w *= w;
        d *= w;
        
        return dot(d, vec4(52.0));
    }

    float fbm(vec3 p) {
        float f = 0.0;	
        float frequency = 1.0;
        float amplitude = 0.5;
        for (int i = 0; i < 4; i++) {
            f += simplex3d(p * frequency) * amplitude;
            amplitude *= 0.5;
            frequency *= 2.0 + float(i) / 100.0;
        }
        return min(f, 1.0);
    }

    vec2 rectToPolar(vec2 p, vec2 ms) {
        p -= ms / 2.0;
        const float PI = 3.1415926534;
        float r = length(p);
        float a = ((atan(p.y, p.x) / PI) * 0.5 + 0.5) * ms.x;
        return vec2(a, r);	
    }

    float effect(vec2 p, float o) {
        p *= 2.0;
        float f1 = simplex3d(vec3(p * vec2(1.0, 5.0), u_time * 0.05)) * 0.5 + 0.5;
        float e = fbm(vec3(p * vec2(15.0, 1.0) + vec2(f1 * 0.85, o), u_time * .005));
        e = abs(e) * sqrt(p.y / 5.0);
        float c2 = simplex3d(vec3(p * vec2(6.0, 2.0), u_time * 0.05));
        c2 = (c2 * 0.5) + 0.5;
        c2 *= 0.5;
        e += c2;
        return e * 0.5 * u_noiseStrength;
    }

    float sw(vec2 p, vec2 ms) {
        p = rectToPolar(p, ms);
        p.x = mod(p.x + 0.5, ms.x);

        float seem = 1.0;

        float s1 = effect(p, 0.0);
        float s2 = effect(p, -1020.0);
        float s = mix(s1, s2, seem);

        float f1 = u_progress * 0.25;
        float f2 = u_progress * u_distortionStrength;
        float m = smoothstep(0.0, f1 + s * f2, p.y);

        return smoothstep(u_fadeEdges, u_edgeSoftness, m);
    }

    void main() {
        vec2 p = vUv * u_resolution / u_resolution.yy;
        float m = u_resolution.x / u_resolution.y;
        vec2 ms = vec2(m, 1.0);
        float mask = sw(p, ms);

        float alpha = mask;
        gl_FragColor = vec4(u_maskColor, alpha);
    }
  `,
  transparent: true,
});

const maskQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), maskMaterial);
maskScene.add(maskQuad);

// Animation settings (no GUI now)
const settings = {
  progress: 0.0,
};

// Transition
function playTransition() {
  gsap.fromTo(
    settings,
    { progress: 0 },
    {
      duration: 3.0,
      ease: "power2.in",
      progress: 2.0,
      onUpdate: () => {
        maskMaterial.uniforms.u_progress.value = settings.progress;
      },
      onComplete: () => {
        document.querySelector("#preloader").parentElement.style.display =
          "none";
      },
    }
  );
}
setTimeout(() => {
  playTransition();
}, 5500);

// ----- ANIMATION LOOP -----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsedTime = clock.getElapsedTime();

  maskMaterial.uniforms.u_progress.value = settings.progress;
  maskMaterial.uniforms.u_time.value = elapsedTime;

  renderer.autoClear = false;
  renderer.render(maskScene, maskCamera);
}
animate();

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  maskMaterial.uniforms.u_resolution.value.set(
    window.innerWidth,
    window.innerHeight
  );
});


