// Import JSON (Vite supports importing JSON directly)
import speakersData from "../assets/json/speakers.json";
import linkIcon from "../assets/linkedin-box-fill.svg"
// DOM element
const cardsContainer = document.getElementById("speaker-cards-container");

document.addEventListener("DOMContentLoaded", () => {
  if (!speakersData || speakersData.length === 0) return;

  speakersData.forEach((speaker) => {
    // Prepare social icons
    const socialIconsHTML = `
      <ul class="flex justify-center gap-6 absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-16 opacity-0 transition-all duration-1000 group-hover:opacity-100 group-hover:translate-y-0 z-10">
        ${
          speaker.linkedin
            ? `
          <li>
            <a href="${speaker.linkedin}" rel="noreferrer" target="_blank">
              <img
                alt="LinkedIn profile link"
                src=${linkIcon}
                class="w-8 h-8 rounded-md transition-transform duration-300 hover:scale-110"
              />
            </a>
          </li>`
            : ""
        }
        ${
          speaker.instagram
            ? `
          <li>
            <a href="${speaker.instagram}" rel="noreferrer" target="_blank">
              <img
                alt="Instagram profile link"
                src="../assets/instagram-line.svg"
                class="w-8 h-8 rounded-md transition-transform duration-300 hover:scale-110"
              />
            </a>
          </li>`
            : ""
        }
        ${
          speaker.website
            ? `
          <li>
            <a href="${speaker.website}" rel="noreferrer" target="_blank">
              <img
                alt="Website link"
                src="../assets/website-icon.svg"
                class="w-8 h-8 rounded-md transition-transform duration-300 hover:scale-110"
              />
            </a>
          </li>`
            : ""
        }
      </ul>
    `;

    // Create card element
    const card = document.createElement("div");
    card.className =
      "relative w-80 h-[440px] bg-white rounded-2xl overflow-hidden shadow-xl cursor-pointer group transition-all duration-1000";

    card.innerHTML = `
      <div class="absolute top-0 left-0 right-0 h-24 bg-gradient-to-br from-[#c3073f] to-[#950740] rounded-bl-[50%] rounded-br-[50%] transform -translate-y-24 transition-transform duration-1000 group-hover:translate-y-0"></div>
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-br from-[#c3073f] to-[#950740] rounded-b-2xl transform translate-y-16 transition-transform duration-1000 group-hover:translate-y-0"></div>
      
      <div class="relative z-10 p-6 flex flex-col items-center text-center h-full">
        <div class="relative w-36 h-36 rounded-full mt-2 mb-4 transition-all duration-1000 group-hover:scale-105">
          <img src="${speaker.imageSrc}" alt="${speaker.name}" class="w-full h-full object-cover rounded-full transition-all duration-1000 group-hover:filter group-hover:brightness-110 group-hover:contrast-110" />
          <div class="absolute top-[-8px] left-[-8px] right-[-8px] bottom-[-8px] border-4 border-white border-solid rounded-full opacity-0 transition-opacity duration-1000 group-hover:opacity-100"></div>
        </div>
        <h2 class="text-2xl font-bold text-[#2c2c2c] mb-2 tracking-wide">${speaker.name}</h2>
        <p class="text-sm text-gray-600 mb-5 leading-relaxed">${speaker.title}</p>
        <h3 class="text-lg font-bold text-[#2c2c2c] mb-2 self-start">Achievements:</h3>
        <p class="text-sm text-gray-600 leading-relaxed text-left flex-grow">${speaker.achievements}</p>
      </div>
      ${socialIconsHTML}
    `;

    cardsContainer.appendChild(card);
  });
});
