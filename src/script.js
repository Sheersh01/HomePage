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

document.addEventListener("DOMContentLoaded", () => {
  const scrollBox = document.querySelector(".scroll-box");
  const steps = document.querySelectorAll(".animated-main, .animated-step");

  function updateFadeOnScroll() {
    const scrollTop = scrollBox.scrollTop;
    const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
    const scrollPercent = scrollTop / maxScroll;

    const sectionCount = steps.length;
    const sectionSize = 1 / sectionCount;

   steps.forEach((step, i) => {
     const start = i * sectionSize;
     const end = (i + 1) * sectionSize;
     const isMain = step.classList.contains("animated-main");

     if (isMain) {
       // Find the first animated-step
       const firstStep = Array.from(steps).find((s) =>
         s.classList.contains("animated-step")
       );
       const firstStepIndex = Array.from(steps).indexOf(firstStep);
       const fadeStart = firstStepIndex * sectionSize;
       const fadeEnd = fadeStart * sectionSize; // fade only over first step section

       if (scrollPercent < fadeStart) {
         step.style.opacity = 1;
         step.style.filter = "blur(0px)";
       } else if (scrollPercent >= fadeStart && scrollPercent <= fadeEnd) {
         const fadeProgress =
           (scrollPercent - fadeStart) / (fadeEnd - fadeStart);
         step.style.opacity = 1 - fadeProgress;
         step.style.filter = `blur(${fadeProgress * 5}px)`;
       } else {
         step.style.opacity = 0;
         step.style.filter = "blur(5px)";
       }
     } else {
       // Existing fade in/out for animated-step
       if (scrollPercent >= start && scrollPercent <= end) {
         const localProgress = (scrollPercent - start) / sectionSize;
         let opacity = 0;
         let blur = 5;

         if (localProgress <= 0.15) {
           opacity = localProgress / 0.15;
           blur = 5 - opacity * 5;
         } else if (localProgress <= 0.85 || i === steps.length - 1) {
           opacity = 1;
           blur = 0;
         } else {
           opacity = 1 - (localProgress - 0.85) / 0.15;
           blur = (1 - opacity) * 5;
         }

         step.style.opacity = opacity;
         step.style.filter = `blur(${blur}px)`;
       } else {
         step.style.opacity =
           i === steps.length - 1 && scrollPercent > end ? 1 : 0;
         step.style.filter =
           i === steps.length - 1 && scrollPercent > end
             ? "blur(0px)"
             : "blur(5px)";
       }
     }
   });

  }

  scrollBox.addEventListener("scroll", updateFadeOnScroll);
  updateFadeOnScroll(); // run once on load
});

// Init everything
function init() {
  resetScrollOnReload();
  initSwiper();
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
const button = document.querySelector(".sound-toggle");
const audio = document.getElementById("myAudio");

let isPlaying = false;
let fadeInterval;

// Function to fade in audio
function fadeIn(audio, duration = 1000) {
  clearInterval(fadeInterval);
  audio.volume = 0;
  audio.play();
  const step = 0.05;
  const intervalTime = duration * step;
  fadeInterval = setInterval(() => {
    if (audio.volume < 1) {
      audio.volume = Math.min(audio.volume + step, 1);
    } else {
      clearInterval(fadeInterval);
    }
  }, intervalTime);
}

// Function to fade out audio
function fadeOut(audio, duration = 1000) {
  clearInterval(fadeInterval);
  const step = 0.05;
  const intervalTime = duration * step;
  fadeInterval = setInterval(() => {
    if (audio.volume > 0) {
      audio.volume = Math.max(audio.volume - step, 0);
    } else {
      audio.pause();
      clearInterval(fadeInterval);
    }
  }, intervalTime);
}

// Toggle button click
button.addEventListener("click", () => {
  if (isPlaying) {
    fadeOut(audio, 1000); // fade out over 1 sec
    button.textContent = "Sound OFF";
  } else {
    fadeIn(audio, 1000); // fade in over 1 sec
    button.textContent = "Sound ON";
  }
  isPlaying = !isPlaying;
});

const scrollBox = document.querySelector(".scroll-box");

// Map section IDs to their corresponding animated-step indexes
const sections = [
  { id: "about", stepIndex: 0 },
  { id: "sponsors", stepIndex: 1 },
  { id: "speakers", stepIndex: 2 },
];

function getVisibleSection() {
  const steps = document.querySelectorAll(".animated-step");
  let visibleSection = null;

  sections.forEach((section) => {
    const step = steps[section.stepIndex];
    if (!step) return;

    const opacity = parseFloat(window.getComputedStyle(step).opacity);

    if (opacity > 0.5) {
      visibleSection = section.id;
    }
  });

  return visibleSection;
}

// Click handler for all three buttons
sections.forEach((section) => {
  const element = document.getElementById(section.id);
  element.addEventListener("click", () => {
    const visibleSection = getVisibleSection();

    if (visibleSection === section.id) {
      alert(
        `${
          section.id.charAt(0).toUpperCase() + section.id.slice(1)
        } clicked and visible!`
      );
    } else {
      console.log(`${section.id} clicked but not visible enough.`);
    }
  });
});
const steps = document.querySelectorAll(".animated-step");

function updatePointerEvents() {
  steps.forEach((step) => {
    const opacity = parseFloat(window.getComputedStyle(step).opacity);
    if (opacity > 0.5) {
      step.style.pointerEvents = "auto"; // clickable
    } else {
      step.style.pointerEvents = "none"; // won't block clicks
    }
  });
}

// Run once on load
updatePointerEvents();

// Update on scroll
scrollBox.addEventListener("scroll", updatePointerEvents);
