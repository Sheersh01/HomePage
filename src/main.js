import "./script.js";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import background from "./assets/background.jpg";
import planet from "./assets/planet.jpg";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";

// ------------------ GODRAYS SHADER ------------------
const GodraysShader = {
  uniforms: {
    tDiffuse: { value: null },
    lightPosition: { value: new THREE.Vector2(0.5, 0.5) },
    exposure: { value: 0.18 },
    decay: { value: 0.95 },
    density: { value: 0.8 },
    weight: { value: 0.4 },
    sunRadius: { value: 0.4 },
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
        if(brightness > 0.5) texSample *= illuminationDecay * weight, godRays += texSample;
        illuminationDecay *= decay;
      }
      godRays *= exposure;
      gl_FragColor = original + godRays;
    }
  `,
};

// ----- SCENE -----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// ----- CAMERA -----
const fov = window.innerWidth < 768 ? 100 : 75;
const camera = new THREE.PerspectiveCamera(
  fov,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 2.5);

// ----- RENDERER -----
const canvas =
  document.querySelector("canvas") ||
  (() => {
    const c = document.createElement("canvas");
    document.body.appendChild(c);
    return c;
  })();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 2.0;
renderer.outputEncoding = THREE.sRGBEncoding;

// ----- CONTROLS -----
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// ----- POSTPROCESSING -----
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8,
  0.8,
  0.95
);
composer.addPass(bloomPass);
const godraysPass = new ShaderPass(GodraysShader);
composer.addPass(godraysPass);

// ----- TEXTURES -----
const textureLoader = new THREE.TextureLoader();
const bgTexture = textureLoader.load(background);
const planetTexture = textureLoader.load(planet);
planetTexture.colorSpace = THREE.SRGBColorSpace;

// ----- BACKGROUND SPHERE -----
const bgSphere = new THREE.Mesh(
  new THREE.SphereGeometry(100, 64, 64),
  new THREE.MeshBasicMaterial({ map: bgTexture, side: THREE.BackSide })
);
scene.add(bgSphere);
bgSphere.rotateY(1.3);

// ----- INNER SPHERE -----
const innerSphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({
    map: planetTexture,
    roughness: 1.0,
    metalness: 0.0,
  })
);
scene.add(innerSphere);

// ----- SUN SPHERE -----
const sunSphere = new THREE.Mesh(
  new THREE.SphereGeometry(3.5, 64, 64),
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

// ----- SUN LIGHT -----
const sunLight = new THREE.DirectionalLight(0xffffff, 6.5);
sunLight.position.copy(sunSphere.position);
scene.add(sunLight);

// ----- CAMERA ARC PATH -----
const pathPoints = [
  new THREE.Vector3(0.0, 0.0, 2.8),
  new THREE.Vector3(8.0, -5.9, 1.8),
  new THREE.Vector3(0.0, -9.0, -9.0),
  new THREE.Vector3(-6.0, -4.0, -3.0),
];
const arcCurve = new THREE.CatmullRomCurve3(pathPoints);

// ----- LENIS SCROLL -----
const scrollContainer = document.querySelector(".scroll-box");
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => 1 - Math.pow(1 - t, 4),
  smoothWheel: true,
  smoothTouch: true,
  wheelMultiplier: 0.25,
  touchMultiplier: 0.15,
  infinite: false,
  wrapper: scrollContainer,
  content: document.querySelector(".content"),
});

let scrollProgress = 0;
let targetProgress = 0;

lenis.on("scroll", ({ scroll }) => {
  const maxScroll = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  targetProgress = Math.min(Math.max(scroll / maxScroll, 0), 1);
  gsap.to(
    {},
    {
      duration: 0.5,
      onUpdate: () => {
        scrollProgress = gsap.utils.interpolate(
          scrollProgress,
          targetProgress,
          0.1
        );
      },
    }
  );
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ----- HELPERS -----
function getArcPoint(t) {
  return arcCurve.getPoint(t);
}
function worldToScreen(worldPos, camera) {
  const vector = worldPos.clone();
  vector.project(camera);
  return new THREE.Vector2(vector.x * 0.5 + 0.5, vector.y * 0.5 + 0.5);
}

// ----- CLOCK -----
const clock = new THREE.Clock();

// ----- ANIMATION LOOP -----
function animate() {
  const delta = clock.getDelta();
  innerSphere.rotation.y += delta * 0.03;
  bgSphere.rotation.y += delta * -0.008;

  const arcPos = getArcPoint(scrollProgress);
  camera.position.copy(arcPos);
  camera.lookAt(innerSphere.position);

  const sunScreenPos = worldToScreen(sunSphere.position, camera);
  godraysPass.uniforms.lightPosition.value = new THREE.Vector2(
    Math.max(0, Math.min(1, sunScreenPos.x)),
    Math.max(0, Math.min(1, sunScreenPos.y))
  );

  controls.update();
  composer.render();
  requestAnimationFrame(animate);
}
animate();

// ----- RESIZE -----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
