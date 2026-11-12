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

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealItems = document.querySelectorAll(
  ".about-layout, .feature, .charity-feature, .commentary-feature, .section-title"
);
if ("IntersectionObserver" in window && !reducedMotion) {
  document.body.classList.add("has-reveal");
  revealItems.forEach((item) => item.classList.add("js-reveal"));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -4% 0px" });
  revealItems.forEach((item) => revealObserver.observe(item));
}
