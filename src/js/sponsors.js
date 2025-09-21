import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin();

// Import images as modules
import abhibusImg from "../assets/sponsors/abhibus.webp";
import benqImg from "../assets/sponsors/benq.webp";
import bsnlImg from "../assets/sponsors/bsnl.webp";
import canaraImg from "../assets/sponsors/canara.webp";
import cocaColaImg from "../assets/sponsors/cocaCola.webp";
import decathlonImg from "../assets/sponsors/decathlon.webp";
import easeMyTripImg from "../assets/sponsors/easeMyTrip.webp";
// import gfgImg from "../assets/sponsors/gfg.webp";
import giveMyCertificateImg from "../assets/sponsors/giveMyCertificate.webp";
import harleyDavidsonImg from "../assets/sponsors/harleyDavidson.webp";
import hitavadaImg from "../assets/sponsors/hitavada.webp";
import iiitiansNetworkImg from "../assets/sponsors/iiitiansNetwork.webp";
import ixigoImg from "../assets/sponsors/ixigo.webp";
import kazoImg from "../assets/sponsors/kazo.webp";
import kolourflyImg from "../assets/sponsors/kolourfly.webp";
import koreanMaggiImg from "../assets/sponsors/koreanMaggiNoodles.webp";
import lavieImg from "../assets/sponsors/lavie.webp";
import nvidiaImg from "../assets/sponsors/nvidia.webp";
import ongcImg from "../assets/sponsors/ongc.webp";
import sbiImg from "../assets/sponsors/sbi.webp";
import shreeCompSystemsImg from "../assets/sponsors/shreeCompSystems.webp";
import skechersImg from "../assets/sponsors/skechers.webp";
import trendsImg from "../assets/sponsors/trends.webp";

const sponsorLogos = [
  { name: "Abhibus", image: abhibusImg },
  { name: "BenQ", image: benqImg },
  { name: "BSNL", image: bsnlImg },
  { name: "Canara Bank", image: canaraImg },
  { name: "Coca Cola", image: cocaColaImg },
  { name: "Decathlon", image: decathlonImg },
  { name: "EaseMyTrip", image: easeMyTripImg },
  // { name: "GeeksforGeeks", image: gfgImg },
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
      "sponsor-card relative rounded-3xl flex items-center justify-center overflow-hidden p-4 bg-opacity-5 transition-transform duration-300 ease-in-out backdrop-blur-sm opacity-0 -translate-x-24 m-5 md:m-3 hover:scale-105";
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
          start: "top 65%",
          toggleActions: "play none none none",
        },
      }
    );
  });
}

document.addEventListener("DOMContentLoaded", () => {
  generateSponsorCards();
});
