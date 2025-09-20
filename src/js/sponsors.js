tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        background: '#0f0f23',
                        foreground: '#e2e8f0',
                        primary: '#40e0d0',
                        sponsorHeading: '#c3073f',
                    },
                },
            },
        }
gsap.registerPlugin(ScrollTrigger);

const sponsorLogos = [
    { name: "Abhibus", image: "./assets/sponsors/abhibus.png" },
    { name: "BenQ", image: "./assets/sponsors/benq.png" },
    { name: "BSNL", image: "./assets/sponsors/bsnl.jpg" },
    { name: "Canara Bank", image: "./assets/sponsors/canara.png" },
    { name: "Coca Cola", image: "./assets/sponsors/cocaCola.png" },
    { name: "Decathlon", image: "./assets/sponsors/decathlon.png" },
    { name: "EaseMyTrip", image: "./assets/sponsors/easeMyTrip.png" },
    { name: "GeeksforGeeks", image: "./assets/sponsors/gfg.png" },
    {
        name: "GiveMyCertificate",
        image: "./assets/sponsors/giveMyCertificate.png",
    },
    {
        name: "Harley Davidson",
        image: "./assets/sponsors/harleyDavidson.jpg",
    },
    { name: "Hitavada", image: "./assets/sponsors/hitavada.jpg" },
    {
        name: "IIITIans Network",
        image: "./assets/sponsors/iiitiansNetwork.png",
    },
    { name: "Ixigo", image: "./assets/sponsors/ixigo.png" },
    { name: "Kazo", image: "./assets/sponsors/kazo.png" },
    { name: "Kolourfly", image: "./assets/sponsors/kolourfly.png" },
    {
        name: "Korean Maggi Noodles",
        image: "./assets/sponsors/koreanMaggiNoodles.png",
    },
    { name: "LaVie", image: "./assets/sponsors/lavie.jpg" },
    { name: "Nvidia", image: "./assets/sponsors/nvidia.jpg" },
    { name: "ONGC", image: "./assets/sponsors/ongc.jpg" },
    { name: "SBI", image: "./assets/sponsors/sbi.png" },
    {
        name: "Shree Comp Systems",
        image: "./assets/sponsors/shreeCompSystems.jpg",
    },
    { name: "Skechers", image: "./assets/sponsors/skechers.png" },
    { name: "Trends", image: "./assets/sponsors/trends.jpeg" },
];

function generateSponsorCards() {
    const grid = document.getElementById("sponsorGrid");

    sponsorLogos.forEach((sponsor) => {
        const card = document.createElement("div");
        card.className = "sponsor-card relative rounded-3xl flex items-center justify-center overflow-hidden p-4 bg-white bg-opacity-5 transition-transform duration-300 ease-in-out backdrop-blur-sm opacity-0 -translate-x-24 m-5 md:m-3 hover:scale-105";
        card.style.width = "320px";
        card.style.height = "200px";

        const img = document.createElement("img");
        img.src = sponsor.image;
        img.alt = sponsor.name;
        img.loading = "lazy";
        img.className = "relative z-10 w-full h-full object-contain rounded-2xl";
        img.style.maxWidth = "280px";
        img.style.maxHeight = "160px";

        card.appendChild(img);
        grid.appendChild(card);
    });

    // Apply responsive styles
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    function handleMediaQuery(e) {
        const cards = document.querySelectorAll('.sponsor-card');
        cards.forEach(card => {
            if (e.matches) {
                card.style.width = "280px";
                card.style.height = "180px";
            } else {
                card.style.width = "320px";
                card.style.height = "200px";
            }
        });
    }
    
    mediaQuery.addListener(handleMediaQuery);
    handleMediaQuery(mediaQuery);

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