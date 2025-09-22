import * as THREE from 'three';
import { MSDFTextGeometry, uniforms } from "three-msdf-text-utils";

import MSDFFragment from './shaders/msdfText/fragment.glsl'
import MSDFVertex from './shaders/msdfText/vertex.glsl'
import ImgFrag from './shaders/ImageEffects/imgFrag.glsl'
import ImgVert from './shaders/ImageEffects/imgVert.glsl'
import GoofyFrag from './shaders/goofy/fragment.glsl'
import GoofyVert from './shaders/goofy/vertex.glsl'

import t1 from './Assets/images/works/cosmos-1.webp'
import t2 from './Assets/images/works/energy-park-1.webp'
import t3 from './Assets/images/works/trionnn.webp'
import t4 from './Assets/images/works/pave-1.webp'
import t5 from './Assets/images/works/rejouice-4.webp'
import t6 from './Assets/images/works/two-good-co-1.webp'
import goofy1 from './Assets/images/goofy/michle.jpg'
import fnt from './fonts/Dirtline/dirt_fnt.json?url'
import png from './fonts/Dirtline/dirt_png.png?url'
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import ScrollToPlugin from 'gsap/ScrollToPlugin';
import { fit } from 'object-fit-math';
import LocomotiveScroll from 'locomotive-scroll';
import './js2.js'

const locomotiveScroll = new LocomotiveScroll();

gsap.registerPlugin(ScrollTrigger, CustomEase, ScrollToPlugin);

splt({})

let isTriggered = false;
let isTriggered2 = false;


CustomEase.create("favEase", ".785,.135,.15,.86");

function selectAll(elem) {
  return document.querySelectorAll(elem);
}

function select(elem) {
  return document.querySelector(elem);
}

if (window.innerWidth > 768) {
  window.addEventListener('resize', function () {
    location.reload();
  });
}

window.onload = loader;

let isMobile = window.matchMedia("only screen and (max-width: 760px)").matches;
let hamTl = gsap.timeline({ paused: true });
let toggle;
function hamburgerAnimation() {
  toggle = true;

  let hamburger = select(".hamburger-icon");

  hamTl.to(".ham-1", {
    top: "40%",
    transform: "rotate(10deg)",
  }, "A")
  hamTl.to(".ham-2", {
    top: "40%",
    transform: "rotate(-10deg)",
  }, "A");
  hamTl.from("#ham-contents", {
    clipPath: "inset(0% 0% 100% 0%)",
    ease: "favEase",
    duration: 1,
  }, "A");
  hamTl.from(".video-cont video", {
    scale: 1.5,
    clipPath: isMobile ? "inset(0 49.999% 0 50%)" : "inset(0% 0% 100% 0%)",
    ease: "favEase",
    duration: 1.1,
    delay: .2,
  }, "A")
  hamTl.from("#ham-contents ul li a", {
    yPercent: 100,
    stagger: 0.1,
    duration: .5,
    ease: "circ"
  }, "A+=0.5")

  hamburger.addEventListener('click', () => {
    if (toggle === true) {
      hamTl.play();
    }
    else {
      hamTl.reverse();
    }
    toggle = !toggle
  });
}

hamburgerAnimation()
document.addEventListener('DOMContentLoaded', () => {
  const tl = gsap.timeline({ paused: true });
  tl.to(window, {
    scrollTo: "#page4",
    duration: 2,
    ease: "expo.inOut",
  });

  selectAll('.work-link').forEach(val => {
    val.addEventListener('click', () => {
      if (!toggle) {
        hamTl.reverse();
      }
      tl.restart();
    });
  });

  const tl2 = gsap.timeline({ paused: true });

  tl2.to(window, {
    duration: 2,
    scrollTo: "#page5",
    ease: "expo.inOut",
  })

  selectAll(".goofy-me-link").forEach((val) => {
    val.addEventListener('click', () => {
      if (!toggle) {
        hamTl.reverse();
      }
      tl2.restart();
    })
  })

  const tl3 = gsap.timeline({ paused: true });

  tl3.to(window, {
    duration: 2,
    scrollTo: "#page6",
    ease: "expo.inOut",
  })

  select('.gallery-link').addEventListener('click', () => {
    if (!toggle) {
      hamTl.reverse();
    }
    tl3.restart();
  })

  const tl4 = gsap.timeline({ paused: true });

  tl4.to(window, {
    duration: 2,
    scrollTo: "footer",
    ease: "expo.inOut",
  })

  select(".socials-link").addEventListener('click', () => {
    tl4.restart()
  })

  const tl5 = gsap.timeline({ paused: true });

  tl5.to(window, {
    duration: 2,
    scrollTo: "#page1",
    ease: "expo.inOut",
  })

  select(".home-link").addEventListener('click', () => {
    if (!toggle) {
      hamTl.reverse();
    }
    tl5.restart();
  })

});

function time() {
  let a = 0;
  setInterval(() => {
    a = a + Math.floor(Math.random() * 15);
    if (a < 100) {
      document.querySelector(".cont-2 h2").innerHTML = a + "%"
    }
    else {
      a = 100
      document.querySelector(".cont-2 h2").innerHTML = a + "%"
    }
  }, 100)
}

let tl5 = gsap.timeline({ paused: true })
tl5.from("#i1 span", {
  yPercent: -100,
  stagger: .1,
  ease: "back.out",
})

function loader() {
  let tl = gsap.timeline({
    onStart: time(),
    onComplete: () => {
      tl5.play()
      LoadingTl.play()
      select('#loader').style.display = "none";
    }
  });
  tl.from(".fade", {
    opacity: 0,
    duration: 1,
  })
  tl.to(".cont-2", {
    clipPath: isMobile? "inset(16% 15% 20% 15%)" : "inset(16% 15% 12% 15%)", 
    duration: 1.3,
    ease: "expo.inOut",
  }, ">")
  tl.to(".loader-cont", {
    "--clip": "inset(0% 0 0 0)",
    duration: 1.5,
    ease: "expo.inOut",
    delay: -.6,
  },);
  tl.to(".fade", {
    y: -100,
    opacity: 0,
    stagger: .1,
    duration: 1,
    filter: 'blur(1rem)',
    ease: "expo.inOut",
  }, 1.8)
  tl.to(".loader-cont", {
    clipPath: "inset(0 0 85% 0)",
    duration: 1.3,
    ease: "expo.inOut",
  }, 2)
  tl.to(".loader-vid", {
    clipPath: "inset(0 0 100% 0)",
    duration: 2,
    ease: "expo.inOut",
  }, 1.3);
  tl.eventCallback("onUpdate", function () {
    if (tl.progress() >= 0.7 && !isTriggered2) {
      main();
      isTriggered2 = true;
    }
  });
}
function buttonAnimation() {
  selectAll(".nav-btn").forEach(val => {
    val.addEventListener("mouseenter", () => {
      gsap.to(val, {
        "--btn": "0",
        duration: .4,
        ease: "power4.out"
      })
    })
    val.addEventListener("mouseleave", () => {
      gsap.to(val, {
        "--btn": "100%",
        duration: .3,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(".nav-btn", {
            "--btn": "-100%",
          })
        }
      })
    })
  });
}
buttonAnimation()

function splitText() {
  let tl = gsap.timeline({ loop: true, repeat: -1 });
  const forward = {
    y: 20,
    opacity: 0,
    rotateX: 90,
    stagger: { amount: .1 },
    ease: 'power3'
  };
  const reverse = {
    y: -20,
    opacity: 0,
    rotateX: -90,
    stagger: { amount: .2 },
    delay: 1,
  }
  tl.from("#i2 span", forward, ">")
    .to("#i2 span", reverse)
    .from("#i3 span", forward, "-=.6")
    .to("#i3 span", reverse)
    .from("#i4 span", forward, "-=.6")
    .to("#i4 span", reverse)
    .from("#i5 span", forward, "-=.6")
    .to("#i5 span", reverse, "-=1")
    .from("#i6 span", forward, "-=.6")
    .to("#i6 span", reverse, "-=1")
}
splitText();

let LoadingTl = gsap.timeline({ paused: true });
function JS() {
  let startingTime = 3.5;
  LoadingTl.from(".sub-text-up", {
    opacity: 0,
    duration: 1,
    delay: startingTime,
    y: -40,
    rotateX: 90,
  }, "a")
    .to(".sub-text-up", {
      "--strike-through": "90%",
      duration: 2,
      delay: 1,
      ease: "expo.inOut",
      onComplete: () => {
        gsap.to(".overlay-txt", {
          opacity: 1,
          duration: 1,
          ease: "favEase",
        })}
    })
    .from(".p1-mid-txt", {
      opacity: 0,
      delay: startingTime + .4,
      duration: 1,
      y: 20,
      rotateX: -90,

    }, "a")
}
let tl3 = gsap.timeline();
let tl2 = gsap.timeline();
function BeautifulDesign() {
  tl3.from("#i7 span", {
    xPercent: 60,
    stagger: .1,
    ease: "power2",
    scrollTrigger: {
      trigger: "#i7",
      start: "top 100%",
      end: "center 13%",
      scrub: 1,
      once: true,
    }
  })
  tl3.from("#i8 span", {
    clipPath: "inset(0 100% 0 0)",
    stagger: 1,
    duration: 4,
    scrollTrigger: {
      trigger: "#i7",
      start: "top 68%",
      end: "bottom 50%",
      scrub: 1,
    }
  })
  tl3.from("#i9 span", {
    clipPath: "inset(0 100% 0 0)",
    stagger: 1,
    duration: 4,
    scrollTrigger: {
      trigger: "#i7",
      start: "top 28%",
      end: "bottom 40%",
      scrub: 1,
    }
  }, 3)
}
function BeautifulAnswer() {
  tl2.from("#i10 span", {
    xPercent: -100,
    stagger: .1,
    ease: "power2",
    scrollTrigger: {
      trigger: "#i7",
      start: "top 88%",
      end: "center 30%",
      scrub: 2,
      once: true,
    }
  })
  tl2.from("#i11 span", {
    clipPath: "inset(0 0% 0 100%)",
    stagger: 1,
    duration: 4,
    scrollTrigger: {
      trigger: "#i7",
      start: "top 58%",
      end: "bottom 10%",
      scrub: 1,
    }
  })
  tl2.from("#i12 span", {
    clipPath: "inset(0 0% 0 100%)",
    stagger: 1,
    duration: 4,
    scrollTrigger: {
      trigger: "#i7",
      start: "top 28%",
      end: "bottom 0%",
      scrub: 1,
    }
  })
}
BeautifulDesign();
BeautifulAnswer();

function FeaturedWorks() {
  let container = selectAll('.information-card span h2');
  let information_1 = [
    "Cosmos ",
    "Energy Park ",
    "Trionn ",
    "pave ai ",
    "Rejouice  ",
    "Twogood co",
  ]
  let information_2 = [
    'clone',
    'Clone',
    'clone',
    'clone',
    'clone',
    'clone',
  ]
  let workContainer = selectAll('.works-card');
  let span1 = select('.featured-content-1 h2')
  let span2 = select('.featured-content-2 h2')
  workContainer.forEach((val, index) => {
    let tl = gsap.timeline()
    val.addEventListener('mouseenter', () => {
      if (!isTriggered) {
        isTriggered = true;
        span1.textContent = information_1[index];
        span2.textContent = information_2[index];
        tl.fromTo(container, { yPercent: 100, skewY: 20, ease: "power3" },
          { yPercent: 0, skewY: 0, ease: "power3", onComplete: () => { isTriggered = false; } }
        );
      }
    });
    val.addEventListener('mouseleave', () => {
      tl.fromTo(container, { yPercent: 0, skewY: 0, ease: "power3" },
        { yPercent: -100, skewY: -10, ease: "power3" }
      );
    });
  });
}
FeaturedWorks()
JS();

function textGsap(elem, delay, trigger, start, end, markers) {
  let tl = gsap.timeline({
    ease: "favEase", delay,
    scrollTrigger: {
      trigger: trigger,
      start: start,
      end: end,
      scrub: 1,
      markers,
    }
  })
  let duration = 1;
  let stagger = .3;
  tl.to(elem.uniforms.uProgress1, {
    value: 1,
    duration,
  })
    .to(elem.uniforms.uProgress2, {
      value: 1,
      duration,
    }, stagger)
    .to(elem.uniforms.uProgress3, {
      value: 1,
      duration,
    }, stagger * 2)
    .to(elem.uniforms.uProgress4, {
      value: 1,
      duration,
    }, stagger * 2.3)
}

function main() {
  const canvas = document.querySelector('.webgl');
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, alpha: true });
  let controls, camera, scene;
  let planeMaterial, shaderPlane, geometryShader, goofyMaterial, goofyMaterial2, goofyMaterial3, goofyMaterial4;
  let mouseX, mouseY;
  let duration = 3;
  let stagger = .1;
  let shaderPlane2, shaderPlane3, shaderPlane4, shaderPlane5, shaderPlane6;
  const sceneElements = [];
  const mobile = (window.innerWidth < 768);
  const tablet = (window.innerWidth < 1024 && window.innerWidth > 768);
  const TextureLoader = new THREE.TextureLoader();

  let GalleryImage1 = TextureLoader.load(t1);
  let GalleryImage2 = TextureLoader.load(t2);
  let GalleryImage3 = TextureLoader.load(t3);
  let GalleryImage4 = TextureLoader.load(t4);
  let GalleryImage5 = TextureLoader.load(t5);
  let GalleryImage6 = TextureLoader.load(t6);

  let setting = {
    progress: 0,
    progress2: 0,
    progress3: 0,
    progress4: 0,
    progress5: 0,
    time: 0,
    frequency: 0,
    rotation: 0,
    offset: 0,
    color: new THREE.Color(0xffffff)
  }

  function handleMousemove(e) {
    const x = e.clientX / window.innerWidth;
    const y = 1 - e.clientY / window.innerHeight;
    mouseX = x;
    mouseY = y;
    goofyMaterial3.uniforms.uMouse.value = new THREE.Vector2(mouseX, mouseY);
  }

  select(".goofy-3").addEventListener('mousemove', handleMousemove, false);

  function loadFontAtlas(path) {
    const promise = new Promise((resolve, reject) => {
      const loader = new THREE.TextureLoader();
      loader.load(path, resolve);
    });
    return promise;
  }

  function addScene(elem, fn) {
    sceneElements.push({ elem, fn });
  }

  function makeScene() {
    scene = new THREE.Scene();
    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight; // the canvas default
    const near = 0.01;
    const far = 10;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);
    camera.lookAt(0, 0, 0);

    {
      const color = 0xFFFFFF;
      const intensity = 3;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(- 1, 2, 4);
      scene.add(light);

    }
    return { scene, camera };
  }

  {
    const elem = document.querySelector('.page1-mid');
    const { scene, camera } = makeScene();

    const Socials = mobile ?
      [
        'creaTive - \n Developer',
        'Is',
        'a'
      ]
      : [
        'CreaTive weB DevelOpeR',
        'Is',
        'a'
      ];

    let material = new THREE.ShaderMaterial({
      side: THREE.DoubleSide,
      transparent: true,
      defines: {
        IS_SMALL: false,
      },
      extensions: {
        derivatives: true,
      },
      uniforms: {
        ...uniforms.common,
        uOpacity: { value: 1 },
        uColor: { value: new THREE.Color("#ffffff") },
        uMap: { value: null },
        uThreshold: { value: 0.05 },
        uAlphaTest: { value: 0.01 },
        uStrokeColor: { value: new THREE.Color("#0e0e0e") },
        uStrokeOutsetWidth: { value: 0. },
        uStrokeInsetWidth: { value: 0.3 },
        uProgress1: { value: 0 },
        uProgress2: { value: 0 },
        uProgress3: { value: 0 },
        uProgress4: { value: 0 },
        uProgress5: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: MSDFVertex,
      fragmentShader: MSDFFragment,
    });

    Promise.all([
      loadFontAtlas(png),
    ]).then(([atlas, font]) => {
      material.uniforms.uMap.value = atlas;
      const geometry = new MSDFTextGeometry({
        text: Socials[0],
        font: fnt,
        width: window.innerWidth,
      });
      geometry.computeBoundingBox();

      const mesh = new THREE.Mesh(geometry, material);

      let s, sis, is, sa, a;
      let x;
      if (tablet) {
        s = .005;
        x = -.85;
        //mesh2
        sis = .008;
        a = -1
        //mesh3 
        sa = .008;
        is = 0;
      } else if (mobile) {
        s = .005;
        x = 0;
        //mesh2
        sis = .005;
        a = -.5;
        //mesh3 
        sa = .005;
        is = -.15;
      } else {
        s = .01;
        x = -2.8;
        //mesh2
        sis = .01;
        a = -3.3;
        //mesh3 
        sa = .01;
        is = -1;
      }

      mesh.scale.set(s * 1.4, -s * 1.4, s * 1.4);
      mesh.position.x = x - .7;
      const geometry2 = new MSDFTextGeometry({
        text: Socials[1],
        font: fnt,
        width: window.innerWidth,
      });

      let material2 = material.clone();
      const mesh2 = new THREE.Mesh(geometry2, material2);
      mesh2.scale.set(sis * 1.4, -sis * 1.4, sis * 1.4);
      mesh2.position.x = a;
      mesh2.position.y = 1;
      mesh2.rotation.z = -.2;

      const geometry3 = new MSDFTextGeometry({
        text: Socials[2],
        font: fnt,
        width: window.innerWidth,
      });

      let material3 = material.clone();
      const mesh3 = new THREE.Mesh(geometry3, material3);

      mesh3.scale.set(sa * 1.4, -sa * 1.4, sa * 1.4);
      mesh3.position.x = is;
      mesh3.position.y = .6;
      mesh3.rotation.z = .2;

      function textGsap2(elem, delay) {
        let tl = gsap.timeline({ ease: "circ", paused: false, delay })
        duration = 4;
        tl.to(elem.uniforms.uProgress1, {
          value: 1,
          duration,
        })
          .to(elem.uniforms.uProgress2, {
            value: 1,
            duration,
          }, stagger)
          .to(elem.uniforms.uProgress3, {
            value: 1,
            duration,
          }, stagger * 1.2)
          .to(elem.uniforms.uProgress4, {
            value: 1,
            duration,
          }, stagger * 4)
      }
      function textDisappear(elem, delay) {
        let tl = gsap.timeline({ ease: "expo.out", paused: false, delay })
        tl.to(elem.uniforms.uProgress5, {
          value: .5,
          duration,
        },)
      }

      textGsap2(material, 1);
      textGsap2(material2, 0);
      textGsap2(material3, .5);
      textDisappear(material2, 2);
      textDisappear(material3, 2.2);
      scene.add(mesh, mesh2, mesh3);

      addScene(elem, (time, rect) => {
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      });
    });
  }

  {
    const elem = document.querySelector('.work-1');
    let dimension = document.querySelector('.work-1 img').getBoundingClientRect();

    const { scene, camera } = makeScene();

    camera.fov = 2 * Math.atan(window.innerHeight / (2 * 200)) * (180 / Math.PI);
    camera.near = 100;
    camera.far = 2000;
    camera.position.z = 200;

    let parent = {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    }
    let child = {
      width: dimension.width,
      height: dimension.height
    }
    let size = new THREE.Vector2();
    renderer.getSize(size);

    let cover = fit(parent, child, 'contain');

    geometryShader = new THREE.PlaneGeometry(cover.width, cover.height);

    shaderPlane = new THREE.ShaderMaterial({
      fragmentShader: ImgFrag,
      vertexShader: ImgVert,
      uniforms: {
        uProgress1: { value: 0 },
        uProgress2: { value: 0 },
        uProgress3: { value: 0 },
        uProgress4: { value: 0 },
        uProgress5: { value: 0 },
        uTime: { value: 0 },
        uColor1: { value: 0 },
        uImage1: { value: GalleryImage1 },
        uImage2: { value: GalleryImage1 },
        uResolution: { value: size },
        eResolution: { value: new THREE.Vector2(cover.width, cover.height) },
      }
    });
    const mesh = new THREE.Mesh(geometryShader, shaderPlane);
    mesh.scale.set(1.8, 1.8, 1.8);
    scene.add(mesh);

    shaderPlane2 = shaderPlane.clone();
    shaderPlane3 = shaderPlane.clone();
    shaderPlane4 = shaderPlane.clone();
    shaderPlane5 = shaderPlane.clone();
    shaderPlane6 = shaderPlane.clone();

    textGsap(shaderPlane, 0, '.work-1', 'top 100%', 'bottom 60%', false);

    addScene(elem, (time, rect) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
  }

  {
    function GalleryScenes(element, materialName, image, scale) {
      const elem = document.querySelector(element);
      let dimension = document.querySelector(`${element} img`).getBoundingClientRect();
      const { scene, camera } = makeScene();

      let parent = {
        width: elem.offsetWidth,
        height: elem.offsetHeight
      }
      let child = {
        width: dimension.width,
        height: dimension.height
      }
      const cover = fit(parent, child, 'cover');

      const geometry = new THREE.PlaneGeometry(cover.width, cover.height);

      camera.fov = 2 * Math.atan(window.innerHeight / (2 * 200)) * (180 / Math.PI);
      camera.near = 100;
      camera.far = 2000;
      camera.position.z = 200;

      const mesh = new THREE.Mesh(geometry, materialName);
      materialName.uniforms.uImage1.value = image
      materialName.uniforms.uImage2.value = image
      mesh.scale.set(scale, scale, scale);
      scene.add(mesh);

      textGsap(materialName, 0, element, 'top 90%', 'bottom 70%', false);

      addScene(elem, (time, rect) => {
        camera.aspect = rect.width / rect.height;
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      });
    }
    GalleryScenes('.work-2', shaderPlane2, GalleryImage2, 1.7);
    GalleryScenes('.work-3', shaderPlane3, GalleryImage3, 1.7);
    GalleryScenes('.work-4', shaderPlane4, GalleryImage4, 1.7);
    GalleryScenes('.work-5', shaderPlane5, GalleryImage5, 1.7);
    GalleryScenes('.work-6', shaderPlane6, GalleryImage6, 1.7);
  }

  {
    const elem = document.querySelector('.goofy-1');
    const { scene, camera } = makeScene();
    camera.fov = 2 * Math.atan(window.innerHeight / (2 * 200)) * (180 / Math.PI);
    camera.near = 100;
    camera.far = 2000;
    camera.position.z = 200;
    let size = new THREE.Vector2();
    renderer.getSize(size);
    elem.addEventListener('mousemove', (e) => {
      const speed = 0.05; // Adjust this value to control the speed of value changes
      const targetX = e.clientX / 100;
      const targetY = e.clientY / 100;
      const deltaX = (targetX - goofyMaterial.uniforms.uMousex.value) * speed;
      const deltaY = (targetY - goofyMaterial.uniforms.uMousey.value) * speed;
      goofyMaterial.uniforms.uMousex.value += deltaX;
      goofyMaterial.uniforms.uMousey.value += deltaY;
    });
    let parent = {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    }
    let child = {
      width: 200,
      height: 300
    }
    const cover = fit(parent, child, 'cover');
    goofyMaterial = new THREE.ShaderMaterial({
      fragmentShader: GoofyFrag,
      vertexShader: GoofyVert,
      uniforms: {
        uGoofy1: { value: TextureLoader.load(goofy1) },
        uTime: { value: 0 },
        uMousex: { value: 0 },
        uMousey: { value: 0 },
        uResolution: { value: size },
        eResolution: { value: new THREE.Vector2(cover.width, cover.height) },
      }
    })
    const geometry = new THREE.PlaneGeometry(cover.width, cover.height);
    const mesh = new THREE.Mesh(geometry, goofyMaterial);
    scene.add(mesh);
    addScene(elem, (time, rect) => {
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    });
  }
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  const clearColor = new THREE.Color('#000');

  function render(time) {
    time *= 0.001;
    setting.time = time;
    goofyMaterial.uniforms.uTime.value += .03;
    resizeRendererToDisplaySize(renderer);
    renderer.setScissorTest(false);
    renderer.setClearColor(clearColor, 0);
    renderer.clear(true, true);
    renderer.setScissorTest(true);
    const transform = `translateY(${window.scrollY}px)`;
    renderer.domElement.style.transform = transform;
    for (const { elem, fn } of sceneElements) {
      const rect = elem.getBoundingClientRect();
      const { left, right, top, bottom, width, height } = rect;
      const isOffscreen =
        bottom < 0 ||
        top > renderer.domElement.clientHeight ||
        right < 0 ||
        left > renderer.domElement.clientWidth;
      if (!isOffscreen) {
        const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);
        fn(time, rect);
      }
    }
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


