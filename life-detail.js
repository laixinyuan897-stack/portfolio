const lifeProgress = document.querySelector(".scroll-progress span");
const updateLifeProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (lifeProgress) lifeProgress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener("scroll", updateLifeProgress, { passive: true });
updateLifeProgress();
