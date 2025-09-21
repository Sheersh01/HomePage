import gsap from "gsap";

const tl = gsap.timeline();

tl.to("#words", {
  delay:1,
  opacity: 1,
  duration:1.5,
  ease: "power2.out",
})
  .to("#explore", {
    color: "#c3073f", // red
    duration: 1.2,
  })
  .to(
    ["#the", "#unexplored"],
    {
      color: "#000000", // black
      duration: 1.2,
    },
    "-=1.0"
  ) // overlap a little
  .to("#words", {
    opacity: 0,
    duration:1.5,
    ease: "power2.inOut",
  })
  .set("#words", { display: "none" });
