// Global variables
let club_list = [];
let event_list = [];
let currentCategory = "All";

// DOM elements
const clubListContainer = document.getElementById("club-list-container");
const eventListContainer = document.getElementById("event-list-container");

// Load data from JSON file
async function loadData() {
  try {
    const response = await fetch("../json/data.json");
    const data = await response.json();
    
    // Set Tailwind config
    tailwind.config = data.tailwindConfig;
    
    // Set global variables
    club_list = data.clubs;
    event_list = data.events;
    
    // Initialize the app
    init();
  } catch (error) {
    console.error('Error loading data:', error);
  }
}

function renderClubs() {
  clubListContainer.innerHTML = "";
  clubListContainer.classList.add("flex-nowrap", "gap-8", "justify-between", "items-center", "overflow-hidden", "w-full", "relative");

  const clubWrapper = document.createElement("div");
  clubWrapper.className = "flex flex-nowrap overflow-x-auto scroll-smooth snap-x snap-mandatory px-8 md:px-12 lg:px-16";

  club_list.forEach((item) => {
    const div = document.createElement("div");
    const isSelected = item.club_name === currentCategory;
    div.className = `flex flex-col items-center flex-shrink-0 cursor-pointer snap-center w-1/3 md:w-1/4 lg:w-auto px-2 md:px-4 transition-all duration-300 ${isSelected ? "shadow-glow-primary" : ""}`;
    div.dataset.category = item.club_name;
    div.innerHTML = `
      <img src="${item.club_image}" alt="${item.club_name}" class="w-16 h-16 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-cover rounded-full transition-all duration-200 border-2 ${isSelected ? "border-primary" : "border-transparent"}" />
      <p class="mt-2.5 text-sm lg:text-base cursor-pointer text-center ${isSelected ? "text-primary" : "text-gray-400"}">${item.club_name}</p>
    `;
    clubWrapper.appendChild(div);
  });
  
  clubListContainer.appendChild(clubWrapper);

  const prevArrow = createArrow("left");
  const nextArrow = createArrow("right");
  clubListContainer.appendChild(prevArrow);
  clubListContainer.appendChild(nextArrow);

  if (currentCategory !== "All") {
    setTimeout(() => {
      const selectedItem = clubListContainer.querySelector(`[data-category="${currentCategory}"]`);
      if (selectedItem) {
        const wrapper = clubListContainer.querySelector('.flex.overflow-x-auto');
        const itemLeft = selectedItem.offsetLeft;
        const itemWidth = selectedItem.offsetWidth;
        const wrapperWidth = wrapper.offsetWidth;
        const scrollPosition = itemLeft - (wrapperWidth / 2) + (itemWidth / 2);
        wrapper.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }, 0);
  }
}

function createArrow(direction) {
  const arrow = document.createElement("div");
  arrow.className = `absolute top-1/2 -translate-y-1/2 p-2 lg:p-4 cursor-pointer z-10 transition-transform duration-300 transform hover:scale-125 ${direction === 'left' ? 'left-0' : 'right-0'}`;
  const icon = direction === 'left'
    ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lg:w-8 lg:h-8 animate-pulse text-white"><path d="M15 19L8 12L15 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`
    : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 lg:w-8 lg:h-8 animate-pulse text-white"><path d="M9 5L16 12L9 19" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrow.innerHTML = icon;
  arrow.addEventListener("click", () => scrollClubs(direction));
  return arrow;
}

function scrollClubs(direction) {
  const wrapper = clubListContainer.querySelector('.flex.overflow-x-auto');
  if (wrapper) {
    const scrollAmount = wrapper.offsetWidth / 2;
    wrapper.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  }
}

function renderEvents(category) {
  eventListContainer.innerHTML = "";
  const filteredEvents = category === "All" ? event_list : event_list.filter((item) => category === item.club);
  
  if (filteredEvents.length === 0) {
    eventListContainer.innerHTML = `<li class="w-full text-center text-gray-400 py-16">No events found for this club.</li>`;
    return;
  }
  
  filteredEvents.forEach((item) => {
    const li = document.createElement("li");
    li.className = "border-t border-white/10 opacity-0 transform translate-y-5 last:border-b last:border-white/10";
    li.innerHTML = `
      <a href="#" class="flex flex-col lg:flex-row p-9 lg:py-9 lg:px-0 text-inherit no-underline overflow-hidden transition-all duration-300 ease-in-out">
        <div class="w-full lg:w-[30rem] lg:flex-shrink-0 aspect-[56/36] relative rounded-lg rounded-tr-none rounded-bl-[3rem] rounded-br-none overflow-hidden">
          <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover object-center transition-transform duration-500 cubic-bezier(0.165, 0.84, 0.44, 1)" />
        </div>
        <div class="relative ml-0 lg:ml-32 mt-4 lg:mt-0 flex flex-col items-start px-6 lg:px-0">
          <div class="opacity-0 transform -translate-x-10">
            <div class="border border-primary rounded-full text-primary text-sm lg:text-xl mb-3 py-1 px-3 inline-block font-medium">
              ${item.club}
            </div>
            <div class="text-white text-sm lg:text-base font-medium">
              Price Pool: $${item.pricePool}
            </div>
            <h2 class="text-[40px] lg:text-[50px] font-bold text-white mt-0">
              ${item.name}
            </h2>
            <p class="text-base lg:text-lg font-normal leading-6 text-white mt-4">
              ${item.description}
            </p>
          </div>
          <div class="flex items-center gap-2 py-3 px-6 font-medium relative overflow-hidden cursor-pointer bg-primary rounded-md transition-all duration-300 mt-6 hover:bg-primary-dark hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/40 group">
            <span class="text-base text-white transition-transform duration-500 group-hover:-translate-x-1">Register</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="transition-transform duration-500 group-hover:translate-x-1">
              <path d="M6 18L18 6M18 6H10M18 6V14" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div class="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-all duration-700 group-hover:left-full"></div>
          </div>
          <span class="block text-primary mt-8 lg:mt-12 text-sm lg:text-base font-medium"></span>
        </div>
      </a>
    `;
    eventListContainer.appendChild(li);
  });
  setupAnimations();
}

function setupAnimations() {
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const listItems = document.querySelectorAll("li");
    if (listItems.length > 0) {
      listItems.forEach((item) => {
        const contentElements = item.querySelectorAll("div[class*='opacity-0']");
        gsap.set(item, { opacity: 0, y: 20 });
        gsap.set(contentElements, { opacity: 0, x: -40 });
        ScrollTrigger.create({
          trigger: item,
          start: "top 85%",
          end: "bottom top",
          onEnter: () => {
            gsap.to(item, { duration: 0.6, opacity: 1, y: 0, ease: "power2.out" });
            gsap.to(contentElements, { duration: 0.6, opacity: 1, x: 0, stagger: 0.05, ease: "power2.out", delay: 0.2 });
          },
          onLeaveBack: () => {
            gsap.to(item, { duration: 0.6, opacity: 0, y: 20, ease: "power2.out" });
            gsap.to(contentElements, { duration: 0.6, opacity: 0, x: -40, stagger: 0.05, ease: "power2.out" });
          },
        });
      });
    }
  } else {
    console.error("GSAP and/or ScrollTrigger not loaded.");
  }
}

function init() {
  clubListContainer.addEventListener("click", (event) => {
    const item = event.target.closest("[data-category]");
    if (item) {
      const selectedCategory = item.dataset.category;
      if (selectedCategory === currentCategory) {
        currentCategory = "All";
      } else {
        currentCategory = selectedCategory;
      }
      renderClubs();
      renderEvents(currentCategory);
    }
  });

  renderClubs();
  renderEvents(currentCategory);
}

// Load data when DOM is ready
document.addEventListener("DOMContentLoaded", loadData);