const detailProgress = document.querySelector(".scroll-progress span");
const updateDetailProgress = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (detailProgress) detailProgress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
};
window.addEventListener("scroll", updateDetailProgress, { passive: true });
updateDetailProgress();
