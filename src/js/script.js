import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ------------------------------
   Reset scroll position
------------------------------ */
function resetScrollOnReload() {
  window.history.scrollRestoration = "manual";
  window.onbeforeunload = () => window.scrollTo(0, 0);
}

/* ------------------------------
   Fade Animation on Scroll
------------------------------ */
function initFadeScroll() {
  const scrollBox = document.querySelector(".scroll-box");
  const steps = document.querySelectorAll(".animated-main, .animated-step");

  const MAX_SCROLL_MOBILE = 4800; // max scroll for mobile
  const MOBILE_WIDTH = 768;

  function clampScroll() {
    if (
      window.innerWidth < MOBILE_WIDTH &&
      scrollBox.scrollTop > MAX_SCROLL_MOBILE
    ) {
      scrollBox.scrollTop = MAX_SCROLL_MOBILE;
    }
  }

  function updateFadeOnScroll() {
    clampScroll(); // clamp scroll first

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
        const firstStep = Array.from(steps).find((s) =>
          s.classList.contains("animated-step")
        );
        const firstStepIndex = Array.from(steps).indexOf(firstStep);
        const fadeStart = firstStepIndex * sectionSize;
        const fadeEnd = fadeStart * sectionSize;

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

  // Scroll event
  scrollBox.addEventListener("scroll", updateFadeOnScroll);

  // Touch scroll prevention for mobile (smooth stop)
  scrollBox.addEventListener(
    "touchmove",
    (e) => {
      if (
        window.innerWidth < MOBILE_WIDTH &&
        scrollBox.scrollTop >= MAX_SCROLL_MOBILE
      ) {
        scrollBox.scrollTop = MAX_SCROLL_MOBILE;
        e.preventDefault(); // prevent further scroll
      }
    },
    { passive: false }
  );

  // Wheel scroll prevention for mobile
  scrollBox.addEventListener(
    "wheel",
    (e) => {
      if (
        window.innerWidth < MOBILE_WIDTH &&
        scrollBox.scrollTop >= MAX_SCROLL_MOBILE &&
        e.deltaY > 0
      ) {
        e.preventDefault();
        scrollBox.scrollTop = MAX_SCROLL_MOBILE;
      }
    },
    { passive: false }
  );

  // Initial fade
  updateFadeOnScroll();
}


/* ------------------------------
   Menu Toggle
------------------------------ */
function initMenuToggle() {
  if (window.innerWidth >= 768) return; // only run on mobile

  const openBtn = document.querySelector(".toggle");
  const closeBtn = document.querySelector(".toggle2");
  const menu = document.querySelector(".menu.overlay");

  if (!openBtn || !closeBtn || !menu) return;

  openBtn.addEventListener("click", () => {
    menu.classList.remove("translate-x-full");
    menu.classList.add("translate-x-0");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("translate-x-0");
    menu.classList.add("translate-x-full");
  });
}


/* ------------------------------
   Sound Toggle with Fade
------------------------------ */
function initSoundToggle() {
  const button = document.querySelector(".sound-toggle");
  const audio = document.getElementById("myAudio");

  let isPlaying = false;
  let fadeInterval;

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

  button.addEventListener("click", () => {
    if (isPlaying) {
      fadeOut(audio, 1000);
      button.textContent = "Sound OFF";
    } else {
      fadeIn(audio, 1000);
      button.textContent = "Sound ON";
    }
    isPlaying = !isPlaying;
  });
}

/* ------------------------------
   About Button -> Section Links
------------------------------ */
function initAboutClick() {
  const about = document.getElementById("about");
  const steps = document.querySelectorAll(".animated-step");

  function getVisibleSection() {
    let visibleIndex = -1;
    steps.forEach((step, i) => {
      const opacity = parseFloat(window.getComputedStyle(step).opacity);
      if (opacity > 0.5) visibleIndex = i;
    });
    return visibleIndex;
  }

  about.addEventListener("click", () => {
    const index = getVisibleSection();

    if (index === 0) {
      window.location.href = "about.html";
    } else if (index === 1) {
      window.location.href = "sponsors.html";
    } else if (index === 2) {
      window.location.href = "speakers.html";
    } else {
      console.log("No section visible enough.");
    }
  });
}

/* ------------------------------
   Init
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  resetScrollOnReload();
  initFadeScroll();
  initMenuToggle();
  initSoundToggle();
  initAboutClick();
    // Fade in #root after 5 seconds
  setTimeout(() => {
    gsap.to("#root", { duration: 1, opacity: 1 });
  }, 5000);
});
