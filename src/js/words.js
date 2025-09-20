import * as THREE from "three";
import vertex from "../shaders/vertex.glsl?raw";
import fragment from "../shaders/fragment.glsl?raw";
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // limit to 2 for mobile perf
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("words").appendChild(renderer.domElement);

// ----- TEXT DATA -----
const texts = ["Explore", "The", "Unexplored"];
const textMaterials = [];
const textMeshes = [];
let fontSize;
let positionsX;

// responsive positions & font size
function getResponsiveSettings() {
  if (window.innerWidth >= 1200) {
    return { positions: [-1.0, 0.0, 1.2], font: 60 };
  } else if (window.innerWidth >= 768) {
    return { positions: [-0.8, 0.0, 1.0], font: 50 };
  } else {
    return { positions: [-0.7, -0.13, 0.6], font: 32 }; // smaller for phones
  }
}
({ positions: positionsX, font: fontSize } = getResponsiveSettings());

// ----- CREATE TEXT -----
function createTextMesh(text, xPos, color = "white") {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  // reduce resolution for mobile (faster uploads to GPU)
  canvas.width = window.innerWidth < 768 ? 256 : 512;
  canvas.height = window.innerWidth < 768 ? 64 : 128;

  ctx.fillStyle = color;
  ctx.font = `bold ${fontSize}px Philosopher`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;

  // Scale geometry based on text size & screen width
  const aspect = canvas.width / canvas.height;
  const geoWidth = window.innerWidth < 768 ? 1.6 : 2.5;
  const geometry = new THREE.PlaneGeometry(geoWidth, geoWidth / aspect);

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
    gsap.to("#words", {
      opacity: 0,
      duration: 1.2,
      onComplete: () => {
        const wordsLayer = document.getElementById("words");
        if (wordsLayer) wordsLayer.style.display = "none";
      },
    });
  },
});

timeline.to(
  textMaterials.map((m) => m.uniforms.uOpacity),
  { value: 1, duration: 1.2, ease: "power2.inOut", stagger: 0.15 }
);
timeline.to(
  textMaterials.map((m) => m.uniforms.uOpacity),
  { value: 0, duration: 1.2, ease: "power2.inOut", delay: 0.8 }
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

  // Update responsive values
  ({ positions: positionsX, font: fontSize } = getResponsiveSettings());
  textMeshes.forEach((mesh, i) => {
    mesh.position.x = positionsX[i];
  });
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
