import gsap from "gsap";

const tl = gsap.timeline();

tl.to("#words", {
  delay: 1,
  opacity: 1,
  duration: 1.5,
  ease: "power2.out",
})
  .to("#explore", {
    color: "#c3073f", // red
    duration: 1.5,
  })
  .to(
    ["#the", "#unexplored"],
    {
      color: "#000000", // black
      duration: 1.5,
    },
    "-=1.0"
  ) // overlap a little
  .to("#explore", {
    color: "#000", // red
    duration: 1.5,
  })
  .to("#words", {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut",
  })
  .set("#words", { display: "none" });
