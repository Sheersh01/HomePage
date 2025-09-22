// Timeline and Gallery Scroll Animation
document.addEventListener("DOMContentLoaded", function () {
  // Initial setup - hide elements that will be animated
  const setupInitialState = () => {
    // Timeline checkpoints
    const checkpoints = document.querySelectorAll(".checkpoint");
    checkpoints.forEach((checkpoint, index) => {
      checkpoint.style.opacity = "0";
      checkpoint.style.transform =
        index % 2 === 0
          ? "translateX(-15.37em) translateY(50px)"
          : "translateX(15.37em) translateY(50px)";
      checkpoint.style.transition =
        "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });

    // Gallery items
    const galleryItems = document.querySelectorAll(".item");
    galleryItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(50px) scale(0.95)";
      item.style.transition = "all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    });

    // Gallery title
    const galleryTitle = document.querySelector(".section h1");
    if (galleryTitle) {
      galleryTitle.style.opacity = "0";
      galleryTitle.style.transform = "translateY(30px)";
      galleryTitle.style.transition = "all 0.6s ease-out";
    }

    // Timeline title
    const timelineTitle = document.querySelector("h2.text-4xl");
    if (timelineTitle) {
      timelineTitle.style.opacity = "0";
      timelineTitle.style.transform = "translateY(30px)";
      timelineTitle.style.transition = "all 0.6s ease-out";
    }
  };

  // Animation function for elements coming into view
  const animateElement = (element, delay = 0) => {
    setTimeout(() => {
      if (element.classList.contains("checkpoint")) {
        const index = Array.from(element.parentNode.children).indexOf(element);
        element.style.opacity = "1";
        element.style.transform =
          index % 2 === 0
            ? "translateX(-15.37em) translateY(0)"
            : "translateX(15.37em) translateY(0)";

        // Animate the logo with a slight delay
        const logo = element.querySelector(".checkpoint-logo");
        if (logo) {
          logo.style.opacity = "0";
          logo.style.transform += " scale(0)";
          logo.style.transition = "all 0.4s ease-out";
          setTimeout(() => {
            logo.style.opacity = "1";
            logo.style.transform = logo.style.transform.replace(
              "scale(0)",
              "scale(1)"
            );
          }, 200);
        }
      } else if (element.classList.contains("item")) {
        element.style.opacity = "1";
        element.style.transform = "translateY(0) scale(1)";
      } else {
        // For titles and other elements
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }
    }, delay);
  };

  // Intersection Observer for scroll-based animations
  const observerOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (
        entry.isIntersecting &&
        !entry.target.classList.contains("animated")
      ) {
        entry.target.classList.add("animated");

        if (entry.target.classList.contains("checkpoint")) {
          animateElement(entry.target);
        } else if (entry.target.classList.contains("item")) {
          // Staggered animation for gallery items
          const items = Array.from(document.querySelectorAll(".item"));
          const index = items.indexOf(entry.target);
          const delay = (index % 4) * 100; // Stagger based on position
          animateElement(entry.target, delay);
        } else {
          animateElement(entry.target);
        }
      }
    });
  }, observerOptions);

  // Special observer for mobile responsiveness
  const mobileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          entry.target.classList.contains("checkpoint")
        ) {
          const checkpoint = entry.target;
          if (window.innerWidth <= 1150) {
            // Mobile animation - simpler transform
            checkpoint.style.transform = "translateY(0)";
          } else {
            // Desktop animation - maintain alternating pattern
            const index = Array.from(checkpoint.parentNode.children).indexOf(
              checkpoint
            );
            checkpoint.style.transform =
              index % 2 === 0
                ? "translateX(-15.37em) translateY(0)"
                : "translateX(15.37em) translateY(0)";
          }
        }
      });
    },
    { threshold: 0.15 }
  );

  // Initialize and observe elements
  const init = () => {
    setupInitialState();

    // Observe timeline checkpoints
    const checkpoints = document.querySelectorAll(".checkpoint");
    checkpoints.forEach((checkpoint) => {
      observer.observe(checkpoint);
      if (window.innerWidth <= 1150) {
        mobileObserver.observe(checkpoint);
      }
    });

    // Observe gallery items
    const galleryItems = document.querySelectorAll(".item");
    galleryItems.forEach((item) => {
      observer.observe(item);
    });

    // Observe titles
    const galleryTitle = document.querySelector(".section h1");
    const timelineTitle = document.querySelector("h2.text-4xl");

    if (galleryTitle) observer.observe(galleryTitle);
    if (timelineTitle) observer.observe(timelineTitle);
  };

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // Reset animations on resize
      const checkpoints = document.querySelectorAll(".checkpoint");
      checkpoints.forEach((checkpoint) => {
        if (checkpoint.classList.contains("animated")) {
          const index = Array.from(checkpoint.parentNode.children).indexOf(
            checkpoint
          );
          if (window.innerWidth <= 1150) {
            checkpoint.style.transform = "translateY(0)";
          } else {
            checkpoint.style.transform =
              index % 2 === 0
                ? "translateX(-15.37em) translateY(0)"
                : "translateX(15.37em) translateY(0)";
          }
        }
      });
    }, 250);
  });

  // Parallax effect for timeline (optional enhancement)
  const addParallaxEffect = () => {
    let ticking = false;

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".checkpoint-logo");

      parallaxElements.forEach((element, index) => {
        const rate = scrolled * -0.1;
        element.style.transform += ` translateY(${rate}px)`;
      });

      ticking = false;
    };

    const requestParallax = () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    // Uncomment the line below to enable parallax effect
    // window.addEventListener('scroll', requestParallax);
  };

  // Initialize everything
  init();
  addParallaxEffect();

  // Smooth reveal animation for elements already in viewport
  setTimeout(() => {
    const elementsInView = document.querySelectorAll(
      ".checkpoint, .item, h1, h2"
    );
    elementsInView.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight;

      if (isInViewport && !element.classList.contains("animated")) {
        element.classList.add("animated");
        animateElement(element);
      }
    });
  }, 100);
});
