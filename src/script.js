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

    // Each section gets equal scroll range
    const sectionCount = steps.length;
    const sectionSize = 1 / sectionCount;

    steps.forEach((step, i) => {
      const start = i * sectionSize;
      const end = (i + 1) * sectionSize;

      if (scrollPercent >= start && scrollPercent <= end) {
        // Normalized 0 → 1 fade within section
        const localProgress = (scrollPercent - start) / sectionSize;
        step.style.opacity = 1 - Math.abs(localProgress - 0.5) * 2; // fade in/out
      } else {
        step.style.opacity = 0;
      }
    });
  }

  scrollBox.addEventListener("scroll", updateFadeOnScroll);
  updateFadeOnScroll();
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
