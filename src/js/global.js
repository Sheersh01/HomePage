import "remixicon/fonts/remixicon.css";

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
   Init
------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initSoundToggle();
});
