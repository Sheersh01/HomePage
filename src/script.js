document.addEventListener("DOMContentLoaded", () => {
  const scrollBox = document.querySelector(".scroll-box");
  const steps = document.querySelectorAll(".animated-main, .animated-step");

  function updateFadeOnScroll() {
    const scrollTop = scrollBox.scrollTop;
    const maxScroll = scrollBox.scrollHeight - scrollBox.clientHeight;
    const scrollPercent = scrollTop / maxScroll;

    // Each section gets equal scroll range
    const sectionCount = steps.length;
    const sectionSize = 1 / sectionCount;

    steps.forEach((step, i) => {
      const start = i * sectionSize;
      const end = (i + 1) * sectionSize;

      if (scrollPercent >= start && scrollPercent <= end) {
        // Normalized 0 → 1 fade within section
        const localProgress = (scrollPercent - start) / sectionSize;
        step.style.opacity = 1 - Math.abs(localProgress - 0.5) * 2; // fade in/out
      } else {
        step.style.opacity = 0;
      }
    });
  }

  scrollBox.addEventListener("scroll", updateFadeOnScroll);
  updateFadeOnScroll();
});
