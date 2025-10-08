import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin();

document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const videoContainer = document.getElementById("video-container");
  const video = document.getElementById("main-video");
  const playButton = document.getElementById("play-button");
  setTimeout(() => {
    if (video.paused)
      video.play().catch((e) => console.error("Autoplay failed:", e));
  }, 100);
  video.addEventListener("play", () => videoContainer.classList.add("playing"));
  video.addEventListener("pause", () =>
    videoContainer.classList.remove("playing")
  );
  videoContainer.addEventListener("mouseenter", () =>
    gsap.to(playButton, { opacity: 1, scale: 1, duration: 0.3 })
  );
  videoContainer.addEventListener("mouseleave", () =>
    gsap.to(playButton, { opacity: 0, scale: 0, duration: 0.3 })
  );
  videoContainer.addEventListener("mousemove", (e) => {
    const rect = videoContainer.getBoundingClientRect();
    gsap.to(playButton, {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      duration: 0.4,
      ease: "power2.out",
    });
  });
  gsap.set("#video-container", { scale: 0.5, y: "60vh" });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: "#scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    })
    .to("#scene1", { opacity: 0, duration: 1 })
    .to("#video-container", { scale: 1.2, y: "0vh", duration: 2 }, "<");

  videoContainer.addEventListener("click", () => {
    // Replace the URL below with your desired link
    window.location.href =
      "https://www.instagram.com/reel/DPEc3wAgk5w/?utm_source=ig_web_button_share_sheet";
  });
  const colorizerSection = document.querySelector(".quem-somos-color-text");
  const words = colorizerSection.querySelectorAll(".text-colorizer .word");
  ScrollTrigger.matchMedia({
    "(min-width: 769px)": function () {
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: colorizerSection,
          start: "top top",
          end: "+=300%",
          scrub: true,
          pin: true,
        },
      });
      tl2.to(words, { opacity: 1, stagger: 0.1, ease: "power1.inOut" });
    },
    "(max-width: 768px)": function () {
      const tl2 = gsap.timeline({
        scrollTrigger: {
          trigger: colorizerSection,
          start: "top 5%",
          end: "+=300%",
          scrub: true,
          pin: true,
        },
      });
      tl2.to(words, { opacity: 1, stagger: 0.1, ease: "power1.inOut" });
    },
  });
  gsap.to(".our-history > *", {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
    stagger: 0.2,
    scrollTrigger: {
      trigger: ".our-history",
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });
  gsap.set(".timeline-event > *", { opacity: 0, y: 10 });
  gsap.to(".timeline-line-progress", {
    height: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: ".timeline-container",
      start: "top 20%",
      end: "bottom 80%",
      scrub: true,
    },
  });
  const events = gsap.utils.toArray(".timeline-event");
  events.forEach((event) => {
    const children = gsap.utils.toArray(event.children);
    gsap
      .timeline({
        scrollTrigger: {
          trigger: event,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      })
      .to(
        children,
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", stagger: 0.1 },
        0.2
      );
  });
  const articles = document.querySelectorAll(".timer-grid article");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          animateCount(entry.target.querySelector("h3"));
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  articles.forEach((article) => observer.observe(article));
  function animateCount(el) {
    const target = +el.getAttribute("data-target");
    const step = +el.getAttribute("data-step");
    const format = el.getAttribute("data-format");
    let current = 0;
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = formatNumber(current, format);
    }, 80);
  }
  function formatNumber(num, format) {
    if (format === "k") return Math.floor(num / 1000) + "K+";
    if (format === "lakh")
      return (num / 100000).toFixed(1).replace(".0", "") + " Lakh+";
    return num;
  }
});
// --- Dynamic Star Generation Script ---
document.addEventListener("DOMContentLoaded", () => {
  function generateStars(numberOfStars) {
    let shadow = [];
    for (let i = 0; i < numberOfStars; i++) {
      const x = Math.floor(Math.random() * 2000);
      const y = Math.floor(Math.random() * 2000);
      shadow.push(`${x}px ${y}px #FFF`);
    }
    return shadow.join(", ");
  }

  // --- 🚀 CHANGE THESE NUMBERS TO ADD/REMOVE STARS ---
  const smallStarsCount = 700;
  const mediumStarsCount = 200;
  const bigStarsCount = 100;
  // ----------------------------------------------------

  const shadowsSmall = generateStars(smallStarsCount);
  const shadowsMedium = generateStars(mediumStarsCount);
  const shadowsBig = generateStars(bigStarsCount);

  const starsSmall = document.getElementById("stars");
  const starsMedium = document.getElementById("stars2");
  const starsBig = document.getElementById("stars3");

  starsSmall.style.boxShadow = shadowsSmall;
  starsMedium.style.boxShadow = shadowsMedium;
  starsBig.style.boxShadow = shadowsBig;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
                #stars:after { box-shadow: ${shadowsSmall}; }
                #stars2:after { box-shadow: ${shadowsMedium}; }
                #stars3:after { box-shadow: ${shadowsBig}; }
            `;
  document.head.appendChild(styleSheet);
});
