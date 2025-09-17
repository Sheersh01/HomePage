import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import Swiper from "swiper";

// Reset scroll position
function resetScrollOnReload() {
  window.history.scrollRestoration = "manual";
  window.onbeforeunload = () => window.scrollTo(0, 0);
}

// Init Swiper
function initSwiper() {
  return new Swiper(".mySwiper", {
    slidesPerView: 2,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    observer: true,
    observeParents: true,
    breakpoints: {
      640: { slidesPerView: 2, spaceBetween: 20 },
      768: { slidesPerView: 3, spaceBetween: 20 },
      1024: { slidesPerView: 3, spaceBetween: 30 },
    },
  });
}

function initFadeSections() {
  const sections = gsap.utils.toArray(".fade");
  let current = 0;
  let isAnimating = false;
  const threshold = 2000; // pixels needed to trigger next section
  let scrollDelta = 0;

  function showSection(index) {
    if (
      isAnimating ||
      index === current ||
      index < 0 ||
      index >= sections.length
    )
      return;

    isAnimating = true;

    const prev = sections[current];
    const next = sections[index];

    gsap.to(prev, {
      autoAlpha: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => prev.classList.remove("active"),
    });

    gsap.to(next, {
      autoAlpha: 1,
      duration: 0.8,
      ease: "power2.inOut",
      onStart: () => next.classList.add("active"),
      onComplete: () => {
        current = index;
        isAnimating = false;
        scrollDelta = 0; // reset after transition
      },
    });
  }

  // Init state
  gsap.set(sections, { autoAlpha: 0 });
  sections[0].classList.add("active");
  gsap.set(sections[0], { autoAlpha: 1 });

  // Wheel navigation (desktop)
  window.addEventListener("wheel", (e) => {
    if (isAnimating) return;

    scrollDelta += e.deltaY;

    if (scrollDelta > threshold) {
      showSection(current + 1);
    } else if (scrollDelta < -threshold) {
      showSection(current - 1);
    }
  });

  // Touch navigation (mobile)
  let startY = 0;
  window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", (e) => {
    if (isAnimating) return;

    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    if (diff > threshold / 2) {
      showSection(current + 1);
    } else if (diff < -threshold / 2) {
      showSection(current - 1);
    }
  });
}


// Blink effect
function initBlinkEffect() {
  const blinkElement = document.querySelector(".blink");
  if (!blinkElement) return;

  // GSAP blinking loop
  gsap.to(blinkElement, {
    opacity: 0,
    duration: 1.2,
    repeat: -1,
    yoyo: true,
    ease: "power1.inOut",
  });

  let scrollDelta = 0;
  const threshold = 800; // pixels needed to hide/show blink
  let isHidden = false;

  // Wheel navigation (desktop)
  window.addEventListener("wheel", (e) => {
    scrollDelta += e.deltaY;

    if (!isHidden && scrollDelta > threshold) {
      gsap.to(blinkElement, { autoAlpha: 0, duration: 0.4 });
      isHidden = true;
      scrollDelta = 0;
    } else if (isHidden && scrollDelta < -threshold) {
      gsap.to(blinkElement, { autoAlpha: 1, duration: 0.4 });
      isHidden = false;
      scrollDelta = 0;
    }
  });

  // Touch navigation (mobile)
  let startY = 0;
  window.addEventListener("touchstart", (e) => {
    startY = e.touches[0].clientY;
  });

  window.addEventListener("touchend", (e) => {
    let endY = e.changedTouches[0].clientY;
    let diff = startY - endY;

    if (!isHidden && diff > threshold / 2) {
      gsap.to(blinkElement, { autoAlpha: 0, duration: 0.4 });
      isHidden = true;
    } else if (isHidden && diff < -threshold / 2) {
      gsap.to(blinkElement, { autoAlpha: 1, duration: 0.4 });
      isHidden = false;
    }
  });
}

// Init everything
function init() {
  resetScrollOnReload();
  // initSwiper();
  // initFadeSections();
  // initBlinkEffect();
}

init();

// Menu toggle
document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".toggle");
  const closeBtn = document.querySelector(".toggle2");
  const menu = document.querySelector(".menu.overlay");

  openBtn.addEventListener("click", () => {
    menu.classList.remove("translate-x-full");
    menu.classList.add("translate-x-0");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("translate-x-0");
    menu.classList.add("translate-x-full");
  });
});
