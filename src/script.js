document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.9) {
          entry.target.classList.add("active");
          sections.forEach((sec) => {
            if (sec !== entry.target) {
              sec.classList.remove("active");
            }
          });
        }
      });
    },
    { threshold: [0.9] }
  );
  sections.forEach((section) => observer.observe(section));
});
