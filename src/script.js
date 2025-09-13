import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper"; // assuming you import Swiper via module

// ✅ Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// ✅ Always start page at top on reload
function resetScrollOnReload() {
  window.history.scrollRestoration = "manual";
  window.onbeforeunload = () => window.scrollTo(0, 0);
}

// ✅ Initialize Swiper
function initSwiper() {
  return new Swiper(".mySwiper", {
    slidesPerView: 3,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });
}

// ✅ Fade in/out sections with ScrollTrigger
function initFadeSections() {
  const sections = gsap.utils.toArray(".fade");
  gsap.set(sections, { autoAlpha: 0 }); // hide at start

  sections.forEach((el, i) => {
    ScrollTrigger.create({
      trigger: el,
      start: () => `${i * 700}vh`,
      end: () => `${(i + 1) * 620}vh`,
      onEnter: () => fadeIn(el),
      onLeave: () => fadeOut(el),
      onEnterBack: () => fadeIn(el),
      onLeaveBack: () => fadeOut(el),
      // markers: true,
    });
  });
}

function fadeIn(el) {
  gsap.to(el, { autoAlpha: 1, duration: 0.8, ease: "power2.out" });
}

function fadeOut(el) {
  gsap.to(el, { autoAlpha: 0, duration: 0.6, ease: "power2.in" });
}

// ✅ Blinking element animation
function initBlinkEffect() {
  const blinkElement = document.querySelector(".blink");
  if (!blinkElement) return;

  gsap.to(blinkElement, {
    opacity: 0,
    duration: 0.8,
    delay: 0.5,
    scrollTrigger: {
      trigger: blinkElement,
      start: "top top",
      end: "bottom 50%",
      scrub: true,
      // markers: true,
    },
  });
}

// ✅ Init everything
function init() {
  // resetScrollOnReload();
  initSwiper();
  initFadeSections();
  initBlinkEffect();
}

init();
