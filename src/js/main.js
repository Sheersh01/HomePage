import * as THREE from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import background from "../assets/bg4.png";
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
  new THREE.Vector3(0.8, -0.4, 3.3),
  new THREE.Vector3(2.0, -1.2, 4.3),
  new THREE.Vector3(3.2, -2.1, 5.0),
  new THREE.Vector3(4.5, -3.0, 5.3),
  new THREE.Vector3(6.0, -3.9, 4.8),
  new THREE.Vector3(7.2, -5.1, 3.25),
  new THREE.Vector3(8.5, -6.5, 0.0),
  new THREE.Vector3(7.85, -7.2, -3.0),
  new THREE.Vector3(6.0, -8.0, -6.5),
  new THREE.Vector3(3.1, -8.5, -8.4),
  new THREE.Vector3(0.0, -9.0, -9.0),
  new THREE.Vector3(-3.0, -6.5, -6.0),
  new THREE.Vector3(-5.0, -4.83, -4.0),
  new THREE.Vector3(-5.5, -3.2, -1.5),
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
  wheelMultiplier: 0.5,
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
const mobileFPS = 30;
const mobileInterval = 1000 / mobileFPS;

function animate(time) {
  requestAnimationFrame(animate);

  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile && time - lastTime < mobileInterval) return;
  lastTime = time;

  lenis.raf(time);

  const delta = clock.getDelta();

  // Frame-rate independent scroll progress
  const scrollLerpSpeed = isMobile ? 4 : 12;
  scrollProgress += (targetProgress - scrollProgress) * (1 - Math.exp(-scrollLerpSpeed * delta));

  innerSphere.rotation.y += delta * 0.03;
  bgSphere.rotation.y += delta * 0.005;

  const arcPos = getArcPoint(scrollProgress);

  if (isDesktop) {
    const mouseLerpSpeed = 10;
    smoothedMouse.lerp(mouse, 1 - Math.exp(-mouseLerpSpeed * delta));

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
