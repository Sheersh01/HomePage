import * as THREE from "three";
import vertex from "../src/shaders/vertex.glsl?raw";
import fragment from "../src/shaders/fragment.glsl?raw";
import gsap from "gsap";

// ----- SCENE & CAMERA -----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 5;

// ----- RENDERER -----
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 3));
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("words").appendChild(renderer.domElement);

// ----- TEXT DATA -----
const texts = ["Explore", "The", "Unexplored"];
const textMaterials = [];
const textMeshes = [];
let fontSize;
let positionsX;
if (window.innerWidth >= 768) {
    positionsX = [-0.8, 0.0, 1.0]; // X positions
    fontSize=50
} else {
    positionsX = [-0.7, -0.13, 0.6]; // X positions
    fontSize=40
}

// ----- CREATE TEXT -----
function createTextMesh(text, xPos, color = "white") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 512;
  canvas.height = 128;
  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Philosopher`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const geometry = new THREE.PlaneGeometry(2.5, 0.625);
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uTime: { value: 0 },
      uTextTexture: { value: texture },
      uIsRedWord: { value: text === "Explore" },
      uOpacity: { value: 0 }, // fade in/out
    },
    transparent: true,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = xPos;
  mesh.position.y = 0;
  scene.add(mesh);

  textMaterials.push(material);
  textMeshes.push(mesh);
}

// Create all text meshes
texts.forEach((txt, i) => {
  createTextMesh(txt, positionsX[i]);
});

// ----- GSAP FADE TIMELINE -----
const timeline = gsap.timeline({
  onComplete: () => {
    // Fade out #words layer and hide it
    gsap.to("#words", {
      opacity: 0,
      duration: 1.5,
      onComplete: () => {
        const wordsLayer = document.getElementById("words");
        if (wordsLayer) wordsLayer.style.display = "none";
      },
    });
  },
});

timeline.to(
  textMaterials.map((m) => m.uniforms.uOpacity),
  { value: 1, duration: 1.5, ease: "power2.inOut", stagger: 0.2 }
);
timeline.to(
  textMaterials.map((m) => m.uniforms.uOpacity),
  { value: 0, duration: 1.5, ease: "power2.inOut", delay: 1 }
);

// ----- ANIMATE LOOP -----
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const elapsed = clock.getElapsedTime();
  textMaterials.forEach((mat) => {
    mat.uniforms.uTime.value = elapsed;
  });
  renderer.render(scene, camera);
}

animate();

// ----- RESIZE -----
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ----- CLEANUP -----
window.addEventListener("beforeunload", () => {
  textMaterials.forEach((mat) => {
    if (mat.uniforms.uTextTexture.value)
      mat.uniforms.uTextTexture.value.dispose();
    mat.dispose();
  });
  textMeshes.forEach((mesh) => mesh.geometry.dispose());
  renderer.dispose();
});
