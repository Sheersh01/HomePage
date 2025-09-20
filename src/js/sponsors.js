import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: "#0f0f23",
        foreground: "#e2e8f0",
        primary: "#40e0d0",
        sponsorHeading: "#c3073f",
      },
    },
  },
};

// Import images as modules
import abhibusImg from "../assets/sponsors/abhibus.png";
import benqImg from "../assets/sponsors/benq.png";
import bsnlImg from "../assets/sponsors/bsnl.jpg";
import canaraImg from "../assets/sponsors/canara.png";
import cocaColaImg from "../assets/sponsors/cocaCola.png";
import decathlonImg from "../assets/sponsors/decathlon.png";
import easeMyTripImg from "../assets/sponsors/easeMyTrip.png";
import gfgImg from "../assets/sponsors/gfg.png";
import giveMyCertificateImg from "../assets/sponsors/giveMyCertificate.png";
import harleyDavidsonImg from "../assets/sponsors/harleyDavidson.jpg";
import hitavadaImg from "../assets/sponsors/hitavada.jpg";
import iiitiansNetworkImg from "../assets/sponsors/iiitiansNetwork.png";
import ixigoImg from "../assets/sponsors/ixigo.png";
import kazoImg from "../assets/sponsors/kazo.png";
import kolourflyImg from "../assets/sponsors/kolourfly.png";
import koreanMaggiImg from "../assets/sponsors/koreanMaggiNoodles.png";
import lavieImg from "../assets/sponsors/lavie.jpg";
import nvidiaImg from "../assets/sponsors/nvidia.jpg";
import ongcImg from "../assets/sponsors/ongc.jpg";
import sbiImg from "../assets/sponsors/sbi.png";
import shreeCompSystemsImg from "../assets/sponsors/shreeCompSystems.jpg";
import skechersImg from "../assets/sponsors/skechers.png";
import trendsImg from "../assets/sponsors/trends.jpeg";

const sponsorLogos = [
  { name: "Abhibus", image: abhibusImg },
  { name: "BenQ", image: benqImg },
  { name: "BSNL", image: bsnlImg },
  { name: "Canara Bank", image: canaraImg },
  { name: "Coca Cola", image: cocaColaImg },
  { name: "Decathlon", image: decathlonImg },
  { name: "EaseMyTrip", image: easeMyTripImg },
  { name: "GeeksforGeeks", image: gfgImg },
  { name: "GiveMyCertificate", image: giveMyCertificateImg },
  { name: "Harley Davidson", image: harleyDavidsonImg },
  { name: "Hitavada", image: hitavadaImg },
  { name: "IIITIans Network", image: iiitiansNetworkImg },
  { name: "Ixigo", image: ixigoImg },
  { name: "Kazo", image: kazoImg },
  { name: "Kolourfly", image: kolourflyImg },
  { name: "Korean Maggi Noodles", image: koreanMaggiImg },
  { name: "LaVie", image: lavieImg },
  { name: "Nvidia", image: nvidiaImg },
  { name: "ONGC", image: ongcImg },
  { name: "SBI", image: sbiImg },
  { name: "Shree Comp Systems", image: shreeCompSystemsImg },
  { name: "Skechers", image: skechersImg },
  { name: "Trends", image: trendsImg },
];

function generateSponsorCards() {
  const grid = document.getElementById("sponsorGrid");

  sponsorLogos.forEach((sponsor) => {
    const card = document.createElement("div");
    card.className =
      "sponsor-card relative rounded-3xl flex items-center justify-center overflow-hidden p-4 bg-white bg-opacity-5 transition-transform duration-300 ease-in-out backdrop-blur-sm opacity-0 -translate-x-24 m-5 md:m-3 hover:scale-105";
    card.style.width = "320px";
    card.style.height = "200px";

    const img = document.createElement("img");
    img.src = sponsor.image;
    img.alt = sponsor.name;
    img.loading = "lazy";
    img.className = "relative z-10 w-full h-full object-contain rounded-2xl";

    card.appendChild(img);
    grid.appendChild(card);
  });

  animateSponsorCards();
}

function animateSponsorCards() {
  const cards = document.querySelectorAll(".sponsor-card");

  cards.forEach((card) => {
    gsap.fromTo(
      card,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateSponsorCards();
});
