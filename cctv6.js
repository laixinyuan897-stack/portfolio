const progressBar = document.querySelector(".reading-progress span");
let scrollPending = false;

function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const value = max > 0 ? window.scrollY / max : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${value})`;
  scrollPending = false;
}

window.addEventListener("scroll", () => {
  if (scrollPending) return;
  window.requestAnimationFrame(updateProgress);
  scrollPending = true;
}, { passive: true });
updateProgress();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(".section-heading, .work-story-grid, .moment, .video-card");
if ("IntersectionObserver" in window && !reduceMotion) {
  revealItems.forEach((item) => item.classList.add("reveal"));
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  revealItems.forEach((item) => observer.observe(item));
}
