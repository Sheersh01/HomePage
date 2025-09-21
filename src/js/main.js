import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import background from "../assets/background.webp";
import planet from "../assets/planet.webp";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import GUI from "lil-gui";

/* -----------------------
   Godrays Shader
----------------------- */
const GodraysShader = {
  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    exposure: { value: 0.18 },
    decay: { value: 0.95 },
    density: { value: 0.8 },
    weight: { value: 0.4 },
    sunRadius: { value: 0.35 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 lightPosition;
    uniform float exposure;
    uniform float decay;
    uniform float density;
    uniform float weight;
    uniform float sunRadius;
    varying vec2 vUv;
    const int NUM_SAMPLES = 60;
    void main() {
      vec4 original = texture2D(tDiffuse, vUv);
      float distToSun = distance(vUv, lightPosition);
      if(distToSun > sunRadius) {
        gl_FragColor = original;
        return;
      }
      vec2 deltaTextCoord = (vUv - lightPosition.xy);
      vec2 textCoo = vUv;
      deltaTextCoord *= 1.0 / float(NUM_SAMPLES) * density;
      float illuminationDecay = 1.0;
      vec4 godRays = vec4(0.0);
      for(int i = 0; i < NUM_SAMPLES; i++) {
        textCoo -= deltaTextCoord;
        if(textCoo.x < 0.0 || textCoo.x > 1.0 || textCoo.y < 0.0 || textCoo.y > 1.0) break;
        vec4 texSample = texture2D(tDiffuse, textCoo);
        float brightness = dot(texSample.rgb, vec3(0.299,0.587,0.114));
        if(brightness > 0.5) {
          texSample *= illuminationDecay * weight;
          godRays += texSample;
        }
        illuminationDecay *= decay;
      }
      godRays *= exposure;
      gl_FragColor = original + godRays;
    }
  `,
};

/* -----------------------
   Scene / Camera / Renderer
----------------------- */
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const fov = window.innerWidth < 768 ? 100 : 75;
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2.5);

const canvas = document.querySelector("#canvas");

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
renderer.outputEncoding = THREE.sRGBEncoding;

/* -----------------------
   Controls
----------------------- */
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;

/* -----------------------
   Postprocessing
----------------------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.0,
  0.8,
  0.95
);
composer.addPass(bloomPass);

const godraysPass = new ShaderPass(GodraysShader);
composer.addPass(godraysPass);

/* -----------------------
   Textures & Meshes
----------------------- */
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(background);
const planetTexture = textureLoader.load(planet);
planetTexture.colorSpace = THREE.SRGBColorSpace;

let innerSphereMesh;
let sunSphereMesh;
let bgSphereMesh;

if (window.innerWidth >= 768) {
  innerSphereMesh = 32;
  sunSphereMesh = 32;
  bgSphereMesh = 32;
} else {
  innerSphereMesh = 32;
  sunSphereMesh = 16;
  bgSphereMesh = 16;
}

const bgSphere = new THREE.Mesh(
  new THREE.SphereGeometry(120, bgSphereMesh, bgSphereMesh),
  new THREE.MeshBasicMaterial({ map: bgTexture, side: THREE.BackSide })
);
scene.add(bgSphere);
bgSphere.rotateY(1.3);

const innerSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, innerSphereMesh, innerSphereMesh),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 1.0,
    metalness: 0.1,
  })
);
scene.add(innerSphere);

const sunSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3.5, sunSphereMesh, sunSphereMesh),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffffff,
    emissiveIntensity: 0.8,
    roughness: 1.0,
    metalness: 0.1,
  })
);
sunSphere.position.set(0, 15, 15);
scene.add(sunSphere);

const sunLight = new THREE.DirectionalLight(0xffffff, 8.5);
sunLight.position.copy(sunSphere.position);
scene.add(sunLight);

/* -----------------------
   Camera Arc Path
----------------------- */
const pathPoints = [
  new THREE.Vector3(0.0, 0.0, 2.5),
  new THREE.Vector3(0.4, -0.2, 2.9),
  new THREE.Vector3(0.8, -0.4, 3.3),
  new THREE.Vector3(1.2, -0.6, 3.7),
  new THREE.Vector3(1.6, -0.9, 4.0),
  new THREE.Vector3(2.0, -1.2, 4.3),
  new THREE.Vector3(2.4, -1.5, 4.6),
  new THREE.Vector3(2.8, -1.8, 4.8),
  new THREE.Vector3(3.2, -2.1, 5.0),
  new THREE.Vector3(3.6, -2.4, 5.2),
  new THREE.Vector3(4.0, -2.7, 5.3),
  new THREE.Vector3(4.5, -3.0, 5.3),
  new THREE.Vector3(5.0, -3.3, 5.2),
  new THREE.Vector3(5.5, -3.6, 5.0),
  new THREE.Vector3(6.0, -3.9, 4.8),
  new THREE.Vector3(6.4, -4.3, 4.4),
  new THREE.Vector3(6.8, -4.7, 3.9),
  new THREE.Vector3(7.2, -5.1, 3.3),
  new THREE.Vector3(7.6, -5.5, 2.6),
  new THREE.Vector3(8.0, -5.9, 1.8),
  new THREE.Vector3(8.3, -6.2, 1.0),
  new THREE.Vector3(8.5, -6.5, 0.0),
  new THREE.Vector3(8.4, -6.8, -1.0),
  new THREE.Vector3(8.2, -7.0, -2.0),
  new THREE.Vector3(7.9, -7.2, -3.0),
  new THREE.Vector3(7.5, -7.4, -4.0),
  new THREE.Vector3(7.0, -7.6, -5.0),
  new THREE.Vector3(6.5, -7.8, -5.8),
  new THREE.Vector3(6.0, -8.0, -6.5),
  new THREE.Vector3(5.4, -8.1, -7.1),
  new THREE.Vector3(4.8, -8.2, -7.6),
  new THREE.Vector3(4.2, -8.3, -8.0),
  new THREE.Vector3(3.6, -8.4, -8.3),
  new THREE.Vector3(3.0, -8.5, -8.5),
  new THREE.Vector3(2.5, -8.6, -8.7),
  new THREE.Vector3(2.0, -8.7, -8.8),
  new THREE.Vector3(1.6, -8.75, -8.9),
  new THREE.Vector3(1.2, -8.8, -8.95),
  new THREE.Vector3(0.9, -8.85, -9.0),
  new THREE.Vector3(0.7, -8.87, -9.0),
  new THREE.Vector3(0.5, -8.88, -9.0),
  new THREE.Vector3(0.4, -8.89, -9.0),
  new THREE.Vector3(0.3, -8.9, -9.0),
  new THREE.Vector3(0.25, -8.92, -9.0),
  new THREE.Vector3(0.2, -8.94, -9.0),
  new THREE.Vector3(0.15, -8.96, -9.0),
  new THREE.Vector3(0.1, -8.98, -9.0),
  new THREE.Vector3(0.05, -8.99, -9.0),
  new THREE.Vector3(0.02, -9.0, -9.0),
  new THREE.Vector3(0.0, -9.0, -9.0),
  new THREE.Vector3(-0.29, -8.76, -8.71),
  new THREE.Vector3(-0.57, -8.52, -8.43),
  new THREE.Vector3(-0.86, -8.29, -8.14),
  new THREE.Vector3(-1.14, -8.05, -7.86),
  new THREE.Vector3(-1.43, -7.81, -7.57),
  new THREE.Vector3(-1.71, -7.57, -7.29),
  new THREE.Vector3(-2.0, -7.33, -7.0),
  new THREE.Vector3(-2.29, -7.1, -6.71),
  new THREE.Vector3(-2.57, -6.86, -6.43),
  new THREE.Vector3(-2.86, -6.62, -6.14),
  new THREE.Vector3(-3.14, -6.38, -5.86),
  new THREE.Vector3(-3.43, -6.14, -5.57),
  new THREE.Vector3(-3.71, -5.9, -5.29),
  new THREE.Vector3(-4.0, -5.67, -5.0),
  new THREE.Vector3(-4.29, -5.43, -4.71),
  new THREE.Vector3(-4.57, -5.19, -4.43),
  new THREE.Vector3(-4.86, -4.95, -4.14),
  new THREE.Vector3(-5.14, -4.71, -3.86),
  new THREE.Vector3(-5.43, -4.48, -3.57),
  new THREE.Vector3(-5.71, -4.24, -3.29),
  new THREE.Vector3(-6.0, -4.0, -3.0),

  // 🔹 New points to curve upward and reconnect
  new THREE.Vector3(-5.5, -3.2, -1.5),
  new THREE.Vector3(-4.5, -2.4, 0.0),
  // new THREE.Vector3(-3.0, -1.5, 1.2),
  // new THREE.Vector3(-1.5, -0.8, 2.0),
  // new THREE.Vector3(-0.5, -0.3, 2.4),
  // new THREE.Vector3(0.0, 0.0, 2.5), // back to start
];

const arcCurve = new THREE.CatmullRomCurve3(pathPoints);

/* -----------------------
   Lenis Smooth Scroll
----------------------- */
const scrollContainer = document.querySelector(".scroll-box");
const lenis = new Lenis({
  wrapper: scrollContainer,
  content: document.querySelector(".content"),
  duration: 1.2,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 0.35,
  touchMultiplier: 0.01,
  infinite: false,
});

let scrollProgress = 0;
let targetProgress = 0;

lenis.on("scroll", ({ scroll }) => {
  const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  targetProgress = Math.min(Math.max(scroll / maxScroll, 0), 1);
});

/* -----------------------
   Helpers & Interpolation
----------------------- */
function updateProgress() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  const lerpSpeed = isMobile ? 0.03 : 0.2;
  scrollProgress = gsap.utils.interpolate(
    scrollProgress,
    targetProgress,
    lerpSpeed
  );
}

function getArcPoint(t) {
  return arcCurve.getPoint(t);
}

function worldToScreen(worldPos, camera) {
  const vector = worldPos.clone();
  vector.project(camera);
  return new THREE.Vector2(vector.x * 0.5 + 0.5, vector.y * 0.5 + 0.5);
}

/* -----------------------
   Mouse Parallax (Desktop only)
----------------------- */
let mouse = new THREE.Vector2(0, 0);
let smoothedMouse = new THREE.Vector2(0, 0);
let parallaxStrength = 0.3;
let isDesktop = !/Mobi|Android/i.test(navigator.userAgent);

if (isDesktop) {
  window.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });
}

/* -----------------------
   Clock & Animation Loop
----------------------- */
const clock = new THREE.Clock();
let lastTime = 0;
const mobileFPS = 30; // cap FPS for mobile
const mobileInterval = 1000 / mobileFPS;

function animate(time) {
  requestAnimationFrame(animate);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile && time - lastTime < mobileInterval) return;
  lastTime = time;

  lenis.raf(time);

  const delta = clock.getDelta();
  innerSphere.rotation.y += delta * 0.01;
  bgSphere.rotation.y += delta * 0.005;

  updateProgress();

  const arcPos = getArcPoint(scrollProgress);

  if (isDesktop) {
    smoothedMouse.lerp(mouse, 0.05);
    camera.position.set(
      arcPos.x - smoothedMouse.x * parallaxStrength,
      arcPos.y + smoothedMouse.y * parallaxStrength,
      arcPos.z
    );
  } else {
    camera.position.copy(arcPos);
  }

  camera.lookAt(innerSphere.position);

  const sunScreenPos = worldToScreen(sunSphere.position, camera);
  godraysPass.uniforms.lightPosition.value.set(
    Math.max(0, Math.min(1, sunScreenPos.x)),
    Math.max(0, Math.min(1, sunScreenPos.y))
  );

  composer.render();
}


requestAnimationFrame(animate);

/* -----------------------
   Resize Handling
----------------------- */
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

window.addEventListener("resize", onResize);

/* -----------------------
   Optional GUI (commented out by default)
----------------------- */
// const gui = new GUI();
// const bloomFolder = gui.addFolder("Bloom");
// bloomFolder.add(bloomPass, "strength", 0, 3, 0.01).name("Strength");
// bloomFolder.add(bloomPass, "radius", 0, 1, 0.01).name("Radius");
// bloomFolder.add(bloomPass, "threshold", 0, 1, 0.01).name("Threshold");

// const godraysFolder = gui.addFolder("Godrays");
// godraysFolder.add(godraysPass.uniforms.exposure, "value", 0, 1, 0.01).name("Exposure");
// godraysFolder.add(godraysPass.uniforms.decay, "value", 0.8, 1, 0.001).name("Decay");
// godraysFolder.add(godraysPass.uniforms.density, "value", 0, 2, 0.01).name("Density");
// godraysFolder.add(godraysPass.uniforms.weight, "value", 0, 1, 0.01).name("Weight");
// godraysFolder.add(godraysPass.uniforms.sunRadius, "value", 0, 1, 0.01).name("Sun Radius");

// const lightFolder = gui.addFolder("Sun Light");
// lightFolder.add(sunLight, "intensity", 0, 10, 0.1).name("Intensity");
// lightFolder.addColor({ color: sunLight.color.getHex() }, "color")
//   .onChange((val) => sunLight.color.set(val))
//   .name("Color");
