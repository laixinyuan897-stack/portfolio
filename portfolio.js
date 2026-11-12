const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.add("motion-ready");

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "关闭导航" : "打开导航");
  navigation?.classList.toggle("is-open", open);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "打开导航");
    navigation.classList.remove("is-open");
  });
});

const progress = document.querySelector(".scroll-progress span");
let scrollQueued = false;
const updateScrollState = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const amount = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  if (progress) progress.style.transform = `scaleX(${amount})`;
  scrollQueued = false;
};
window.addEventListener("scroll", () => {
  if (!scrollQueued) {
    window.requestAnimationFrame(updateScrollState);
    scrollQueued = true;
  }
}, { passive: true });
updateScrollState();

const revealTargets = document.querySelectorAll(
  ".section-heading, .work-card, .internship-card, .recognition-card, .timeline article, .hobby-board"
);
revealTargets.forEach((target) => target.classList.add("reveal"));

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: "0px 0px -5% 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const sectionLinks = [...document.querySelectorAll(".main-nav a")];
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        if (link.getAttribute("href") === `#${entry.target.id}`) {
          link.setAttribute("aria-current", "location");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    });
  }, { rootMargin: "-25% 0px -65% 0px" });
  sections.forEach((section) => navObserver.observe(section));
}

const workContent = {
  plan: {
    index: "01",
    title: "创意策划与内容表达",
    copy: "这里可以展开一个完整策划项目：从议题与受众出发，呈现你的创意、执行过程和最终影响。"
  },
  voice: {
    index: "02",
    title: "让文字抵达听众",
    copy: "这里可以收录播音、主持、朗诵或配音片段，并补充作品背景、声音定位与录制方式。"
  },
  film: {
    index: "03",
    title: "镜头里的叙事",
    copy: "这里可以展示短片、纪录影像或栏目作品，并说明你在导演、拍摄、剪辑中的具体职责。"
  }
};
const workDialog = document.querySelector(".work-dialog");
const dialogTitle = workDialog?.querySelector("#dialog-title");
const dialogCopy = workDialog?.querySelector(".dialog-copy");
const dialogIndex = workDialog?.querySelector(".dialog-index");
const closeDialog = () => workDialog?.close();

document.querySelectorAll(".work-card[data-work]").forEach((card) => {
  const open = () => {
    const item = workContent[card.dataset.work];
    if (!item || !workDialog || !dialogTitle || !dialogCopy || !dialogIndex) return;
    dialogTitle.textContent = item.title;
    dialogCopy.textContent = item.copy;
    dialogIndex.textContent = item.index;
    workDialog.showModal();
  };
  card.addEventListener("click", open);
  card.addEventListener("pointermove", (event) => {
    if (!window.matchMedia("(pointer:fine)").matches || reduceMotion) return;
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.setProperty("--tilt-x", `${x * 5}deg`);
    card.style.setProperty("--tilt-y", `${-y * 5}deg`);
  });
  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});
workDialog?.querySelector(".dialog-close")?.addEventListener("click", closeDialog);
workDialog?.addEventListener("click", (event) => {
  if (event.target === workDialog) closeDialog();
});

const portraitStage = document.querySelector(".portrait-stage");
const introCopy = document.querySelector(".intro-copy");
if (portraitStage && introCopy && !reduceMotion && window.matchMedia("(pointer:fine)").matches) {
  document.querySelector(".intro")?.addEventListener("pointermove", (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portraitStage.style.transform = `translate(${x * 12}px, ${y * 10}px) rotate(${2 + x * 1.5}deg)`;
    introCopy.style.transform = `translate(${x * -5}px, ${y * -4}px)`;
  });
  document.querySelector(".intro")?.addEventListener("pointerleave", () => {
    portraitStage.style.transform = "";
    introCopy.style.transform = "";
  });
}

const filterButtons = document.querySelectorAll(".filter-chip");
const workGrid = document.querySelector(".work-grid");
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    workGrid?.classList.toggle("is-filtering", filter !== "all");
    document.querySelectorAll(".work-card[data-category]").forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("is-hidden", !show);
      card.setAttribute("aria-hidden", String(!show));
      card.tabIndex = show ? 0 : -1;
    });
  });
});

const galleryGate = document.querySelector(".gallery-gate");
const workGallery = document.querySelector(".work-gallery");
const openGalleryButton = document.querySelector(".open-gallery");
const closeGalleryButton = document.querySelector(".gallery-close");
openGalleryButton?.addEventListener("click", () => {
  if (!galleryGate || !workGallery) return;
  galleryGate.hidden = true;
  workGallery.hidden = false;
  workGallery.classList.add("is-open");
  openGalleryButton.setAttribute("aria-expanded", "true");
  window.setTimeout(() => workGallery.querySelector(".filter-chip")?.focus(), 120);
});

const campusGate = document.querySelector(".campus-gate");
const campusEntries = document.querySelector(".campus-entries");
const campusOpen = document.querySelector(".campus-open");
const campusClose = document.querySelector(".campus-close");
campusOpen?.addEventListener("click", () => {
  if (!campusGate || !campusEntries) return;
  campusGate.hidden = true;
  campusEntries.hidden = false;
  campusEntries.classList.add("is-open");
  campusOpen.setAttribute("aria-expanded", "true");
  campusEntries.querySelectorAll(".campus-card").forEach((card) => card.classList.add("is-visible"));
});
campusClose?.addEventListener("click", () => {
  if (!campusGate || !campusEntries) return;
  campusEntries.hidden = true;
  campusEntries.classList.remove("is-open");
  campusGate.hidden = false;
  campusOpen?.setAttribute("aria-expanded", "false");
  campusGate.querySelector(".campus-open")?.focus();
});

const honorsGate = document.querySelector(".honors-gate");
const honorsList = document.querySelector(".honors-list");
const honorsOpen = document.querySelector(".honors-open");
const honorsClose = document.querySelector(".honors-close");
honorsOpen?.addEventListener("click", () => {
  if (!honorsGate || !honorsList) return;
  honorsGate.hidden = true;
  honorsList.hidden = false;
  honorsList.classList.add("is-open");
  honorsOpen.setAttribute("aria-expanded", "true");
});
honorsClose?.addEventListener("click", () => {
  if (!honorsGate || !honorsList) return;
  honorsList.hidden = true;
  honorsList.classList.remove("is-open");
  honorsGate.hidden = false;
  honorsOpen?.setAttribute("aria-expanded", "false");
  honorsGate.querySelector(".honors-open")?.focus();
});
closeGalleryButton?.addEventListener("click", () => {
  if (!galleryGate || !workGallery) return;
  workGallery.hidden = true;
  workGallery.classList.remove("is-open");
  galleryGate.hidden = false;
  openGalleryButton?.setAttribute("aria-expanded", "false");
  galleryGate.querySelector(".open-gallery")?.focus();
});

const cursorFollower = document.querySelector(".cursor-follower");
if (cursorFollower && window.matchMedia("(pointer:fine)").matches && !reduceMotion) {
  let cursorFrame = 0;
  let cursorX = 0;
  let cursorY = 0;
  document.addEventListener("pointermove", (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    if (cursorFrame) return;
    cursorFrame = window.requestAnimationFrame(() => {
      cursorFollower.style.left = `${cursorX}px`;
      cursorFollower.style.top = `${cursorY}px`;
      cursorFrame = 0;
    });
  }, { passive: true });
  document.querySelectorAll("[data-cursor]").forEach((target) => {
    target.addEventListener("pointerenter", () => {
      cursorFollower.querySelector("span").textContent = target.dataset.cursor;
      cursorFollower.classList.add("is-active");
    });
    target.addEventListener("pointerleave", () => cursorFollower.classList.remove("is-active"));
  });
  document.querySelectorAll(".empty-entry").forEach((entry) => {
    entry.addEventListener("toggle", () => {
      entry.querySelector("summary")?.setAttribute("data-cursor", entry.open ? "收起" : "展开");
    });
  });
  document.addEventListener("pointerdown", () => cursorFollower.classList.add("is-pressed"));
  document.addEventListener("pointerup", () => cursorFollower.classList.remove("is-pressed"));
}
