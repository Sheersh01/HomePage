import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Import JSON
import data from "../assets/json/data.json";

// Import club images
import crisprLogo from "../assets/clubsLogo/crispr_logo.webp";
import elevateLogo from "../assets/clubsLogo/elevate_logo.webp";
import ioticsLogo from "../assets/clubsLogo/iotics.png";
import dotslashLogo from "../assets/clubsLogo/dotslash.png";
import dimensionsLogo from "../assets/clubsLogo/dimensions_logo.webp";
import strokesLogo from "../assets/clubsLogo/strokes_logo.webp";
import probeLogo from "../assets/clubsLogo/probe.png";
import tfLogo from "../assets/clubsLogo/tf logo.webp";
import synergyLogo from "../assets/clubsLogo/synergy.png";

// Import event images
import claudeSolvathonImg from "../assets/events/claude.webp";
import analyticaImg from "../assets/events/analytica.webp";
import trailTracerImg from "../assets/events/Trail-Tracer.webp";
import robowarsImg from "../assets/events/RoboWars.webp";
import algorithmiaImg from "../assets/events/algorithmia.webp";
import codefiestaImg from "../assets/events/codefiesta.webp";
import quantQuestImg from "../assets/events/quant-quest.webp";
import renderRiotImg from "../assets/events/render-riot.webp";
import designAThonImg from "../assets/events/design.webp";
import brandXperienceImg from "../assets/events/brandx.webp";
import womenOnlyHackathonImg from "../assets/events/women's-only.webp";
import enigmaXploreImg from "../assets/events/enigma.webp";
import circuitDesignImg from "../assets/events/circuit-design.webp";
// import vlsiImg from "../assets/events/analytica.webp"; // placeholder
import atalTinkeringImg from "../assets/events/atal.webp";
import bioinformaticsImg from "../assets/events/bioinfo.webp";
import fintechImg from "../assets/events/finix.webp";
import quantumImg from "../assets/events/quant.webp";
import web3Img from "../assets/events/web-3.webp";
import codedualzImg from "../assets/events/codeduelz.webp";
import valorantImg from "../assets/events/valorant.webp";
import bgmiImg from "../assets/events/bgmi.webp";
import freeFireImg from "../assets/events/freeFire.webp"; // now matches JSON
import callOfDutyImg from "../assets/events/codm.webp";
// import clashOfClansImg from "../assets/events/freeFire.webp"; // placeholder
// import clashRoyaleImg from "../assets/events/analytica.webp"; // placeholder
import chessImg from "../assets/events/chess.webp";
import mazex from "../assets/events/mazex.webp";
import gameJam from "../assets/events/game-jam.webp";
import subway from "../assets/events/subway.webp";

// Map club names to imported images
const clubImagesMap = {
  All: tfLogo, // Add a logo for the "All" category if needed
  "Central TantraFiesta": tfLogo,
  CRISPR: crisprLogo,
  Elevate: elevateLogo,
  IOTICS: ioticsLogo,
  Dotslash: dotslashLogo,
  Dimensions: dimensionsLogo,
  Strokes: strokesLogo,
  Probe: probeLogo,
  Synergy: synergyLogo,
};
// Map event names to imported images
const eventImagesMap = {
  "Finance Case study comp": fintechImg,
  "Claude Solvathon": claudeSolvathonImg,
  Analytica: analyticaImg,
  Genathon: analyticaImg, // Using same image as Analytica as per your JSON
  "Bug Bounty Blitz": analyticaImg, // Using same image as Analytica as per your JSON
  "Trail Tracer": trailTracerImg,
  Micromouse: mazex, // Using same image as Analytica as per your JSON
  Robowars: robowarsImg,
  Algorithmia: algorithmiaImg,
  Codefiesta: codefiestaImg,
  "Quant Quest": quantQuestImg,
  "IIITN Game Jam": gameJam,
  "Render Riot": renderRiotImg,
  "Design-a-thon": designAThonImg,
  BrandXperience: brandXperienceImg,
  "Women's Only Hackathon": womenOnlyHackathonImg,
  "Enigma Xplore 3.0": enigmaXploreImg,
  "Circuit Design": circuitDesignImg,
  VLSI: analyticaImg, // Using same image as Analytica as per your JSON
  "Atal Tinkering": atalTinkeringImg,
  BioInformatics: bioinformaticsImg,
  Fintech: fintechImg,
  Quantum: quantumImg,
  "Web 3": web3Img,
  CodeDuelz: codedualzImg,
  Valorant: valorantImg,
  BGMI: bgmiImg,
  FreeFire: freeFireImg, // Using same image as BGMI as per your JSON
  "Call of Duty": callOfDutyImg,
  "Clash of Clans": analyticaImg, // Using same image as Analytica as per your JSON
  "Clash Royale": analyticaImg, // Using same image as Analytica as per your JSON
  Chess: chessImg,
  "Subway Surfers": subway,
};

// Global variables
let club_list = data.clubs;
let event_list = data.events;
let currentCategory = "All";

// DOM elements
const clubListContainer = document.getElementById("club-list-container");
const eventListContainer = document.getElementById("event-list-container");

// Render Clubs
function renderClubs() {
  clubListContainer.innerHTML = "";
  clubListContainer.classList.add(
    "flex-nowrap",
    "gap-8",
    "justify-between",
    "items-center",
    "overflow-hidden",
    "w-full",
    "relative"
  );

  const clubWrapper = document.createElement("div");
  clubWrapper.className =
    "flex flex-nowrap overflow-x-auto scroll-smooth snap-x snap-mandatory md:px-12 lg:px-16";

  club_list.forEach((item) => {
    const div = document.createElement("div");
    const isSelected = item.club_name === currentCategory;
    const imgSrc = clubImagesMap[item.club_name];

    div.className = `flex flex-col items-center flex-shrink-0 cursor-pointer snap-center w-1/3 md:w-1/4 lg:w-auto px-2 md:px-4 transition-all duration-300 ${
      isSelected ? "shadow-glow-[#c3073f]" : ""
    }`;
    div.dataset.category = item.club_name;
    div.innerHTML = `
      <img src="${imgSrc}" alt="${item.club_name}" 
        class="w-16 h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain rounded-full transition-all duration-200 border-2 ${
          isSelected ? "border-[#c3073f]" : "border-transparent"
        }" />
      <p class="mt-2.5 text-sm lg:text-base cursor-pointer text-center ${
        isSelected ? "text-[#c3073f]" : "text-gray-400"
      }">${item.club_name}</p>
    `;
    clubWrapper.appendChild(div);
  });

  clubListContainer.appendChild(clubWrapper);

  if (currentCategory !== "All") {
    setTimeout(() => {
      const selectedItem = clubListContainer.querySelector(
        `[data-category="${currentCategory}"]`
      );
      if (selectedItem) {
        const wrapper = clubListContainer.querySelector(
          ".flex.overflow-x-auto"
        );
        const itemLeft = selectedItem.offsetLeft;
        const itemWidth = selectedItem.offsetWidth;
        const wrapperWidth = wrapper.offsetWidth;
        const scrollPosition = itemLeft - wrapperWidth / 2 + itemWidth / 2;
        wrapper.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }, 0);
  }
}

// Create arrows for club scroll
function createArrow(direction) {
  const arrow = document.createElement("div");
  arrow.className = `absolute top-1/2 -translate-y-1/2 p-2 lg:p-4 cursor-pointer z-10 transition-transform duration-300 transform hover:scale-125 ${
    direction === "left" ? "left-0" : "right-0"
  }`;
  const icon =
    direction === "left"
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 lg:w-8 lg:h-8 animate-pulse text-white">
          <path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 lg:w-8 lg:h-8 animate-pulse text-white">
          <path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrow.innerHTML = icon;
  arrow.addEventListener("click", () => scrollClubs(direction));
  return arrow;
}

function scrollClubs(direction) {
  const wrapper = clubListContainer.querySelector(".flex.overflow-x-auto");
  if (wrapper) {
    const scrollAmount = wrapper.offsetWidth / 2;
    wrapper.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }
}

// Render Events
function renderEvents(category) {
  eventListContainer.innerHTML = "";
  const filteredEvents =
    category === "All"
      ? event_list
      : event_list.filter((item) => category === item.club);

  if (filteredEvents.length === 0) {
    eventListContainer.innerHTML = `<li class="w-full text-center text-gray-400 py-16">No events found for this club.</li>`;
    return;
  }

  filteredEvents.forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "border-t border-white/10 opacity-0 transform translate-y-5 last:border-b last:border-white/10";

    const imgSrc = eventImagesMap[item.name];

    li.innerHTML = `
    <div class="flex flex-col lg:flex-row lg:py-9 lg:px-0 text-inherit no-underline overflow-hidden  transition-all duration-300 ease-in-out">
        <div class=" w-full lg:w-[30rem] lg:flex-shrink-0 aspect-[56/36] relative rounded-lg rounded-tr-none rounded-bl-[3rem] rounded-br-none overflow-hidden">
          <img src="${imgSrc}" alt="${item.name}" 
            class="w-full h-full object-contain object-center transition-transform duration-500 cubic-bezier(0.165, 0.84, 0.44, 1)" />
        </div>
        <div class="backdrop-blur-xl relative ml-0 lg:ml-32 mt-4 lg:mt-0 flex flex-col items-start px-6 lg:px-0 md:mb-0 mb-6">
          <div class="opacity-0 transform -translate-x-10">
            <div class="border border-[#c3073f] rounded-full text-[#c3073f] text-sm lg:text-xl mb-3 py-1 px-3 inline-block font-medium">
              ${item.club}
            </div>
            <div class="text-white text-sm lg:text-base font-medium">
              Price Pool: ₹${item.pricePool}
            </div>
            <h2 class="text-[40px] lg:text-[50px] font-bold text-white mt-0">
              ${item.name}
            </h2>
            <p class="text-base lg:text-lg font-normal leading-6 text-white mt-4">
              ${item.description}
            </p>
          </div>
          <div onclick="window.open('${item.url}', '_blank')" class="flex items-center gap-2 py-3 px-6 font-medium relative overflow-hidden cursor-pointer bg-[#c3073f] rounded-md transition-all duration-300 mt-6 hover:bg-[#c3073f]-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#c3073f]/40 group">
            <span class="text-base text-white transition-transform duration-500 group-hover:-translate-x-1">Register</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              class="transition-transform duration-500 group-hover:translate-x-1">
              <path d="M6 18L18 6M18 6H10M18 6V14" stroke="white" 
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full"></div>
          </div>
        </div>
        </div>
    `;
    eventListContainer.appendChild(li);
  });

  setupAnimations();
}

// GSAP animations
function setupAnimations() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const listItems = document.querySelectorAll("li");
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        const contentElements = item.querySelectorAll(
          "div[class*='opacity-0']"
        );
        gsap.set(item, { opacity: 0, y: 20 });
        gsap.set(contentElements, { opacity: 0, x: -40 });
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          end: "bottom top",
          onEnter: () => {
            gsap.to(item, {
              duration: 0.6,
              opacity: 1,
              y: 0,
              ease: "power2.out",
            });
            gsap.to(contentElements, {
              duration: 0.6,
              opacity: 1,
              x: 0,
              stagger: 0.05,
              ease: "power2.out",
              delay: 0.2,
            });
          },
          onLeaveBack: () => {
            gsap.to(item, {
              duration: 0.6,
              opacity: 0,
              y: 20,
              ease: "power2.out",
            });
            gsap.to(contentElements, {
              duration: 0.6,
              opacity: 0,
              x: -40,
              stagger: 0.05,
              ease: "power2.out",
            });
          },
        });
      });
    }
  } else {
    console.error("GSAP and/or ScrollTrigger not loaded.");
  }
}

// Initialize
function init() {
  clubListContainer.addEventListener("click", (event) => {
    const item = event.target.closest("[data-category]");
    if (item) {
      const selectedCategory = item.dataset.category;
      currentCategory =
        selectedCategory === currentCategory ? "All" : selectedCategory;
      renderClubs();
      renderEvents(currentCategory);
    }
  });

  renderClubs();
  renderEvents(currentCategory);
}

// DOM ready
document.addEventListener("DOMContentLoaded", init);
