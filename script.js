const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const previewImages = document.querySelectorAll(".certificate-card img, .portfolio-project-card:not([data-category='web-design']) img");
const webDesignStacks = document.querySelectorAll(".card-stack");
const seePhotosButtons = document.querySelectorAll(".see-photos-btn");
const imageViewer = document.querySelector("#imageViewer");
const viewerImage = document.querySelector("#viewerImage");
const viewerCounter = document.querySelector("#viewerCounter");
const closeViewer = document.querySelector(".image-viewer-close");
const viewerPrev = document.querySelector(".image-viewer-prev");
const viewerNext = document.querySelector(".image-viewer-next");
const filterButtons = document.querySelectorAll(".project-filter button");
const projectCards = document.querySelectorAll(".portfolio-project-card");
const emptyState = document.querySelector(".empty-project-state");

function rotateStack(stack) {
  const first = stack.firstElementChild;
  stack.appendChild(first);
  updateStack(stack);
}

function updateStack(stack) {
  const cards = [...stack.children];

  cards.forEach((card, index) => {
    card.style.zIndex = cards.length - index;
    card.style.transform = `
      translate(${-15 * index}px,${15 * index}px)
      rotate(${-4 * index}deg)
      scale(${1 - index * 0.04})
    `;
    card.style.opacity = 1 - index * 0.1;
  });
}

webDesignStacks.forEach((stack) => {
  updateStack(stack);

  stack.addEventListener("click", () => {
    rotateStack(stack);
  });
});

/* ===========================
   IMAGE VIEWER (single photos + galleries)
   =========================== */

let currentGallery = [];
let currentGalleryIndex = 0;

function showGalleryImage(index) {
  if (!currentGallery.length) return;

  currentGalleryIndex = (index + currentGallery.length) % currentGallery.length;
  const item = currentGallery[currentGalleryIndex];

  viewerImage.src = item.src;
  viewerImage.alt = item.alt;

  const isGallery = currentGallery.length > 1;
  viewerPrev.style.display = isGallery ? "flex" : "none";
  viewerNext.style.display = isGallery ? "flex" : "none";

  if (isGallery) {
    viewerCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    viewerCounter.style.display = "inline-flex";
  } else {
    viewerCounter.style.display = "none";
  }
}

function openImageViewer(images, startIndex = 0) {
  currentGallery = images;
  showGalleryImage(startIndex);
  imageViewer.classList.add("show");
  imageViewer.setAttribute("aria-hidden", "false");
}

function hideImageViewer() {
  imageViewer.classList.remove("show");
  imageViewer.setAttribute("aria-hidden", "true");
  viewerImage.src = "";
  currentGallery = [];
  currentGalleryIndex = 0;
}

// Single-image preview (embedded system project shots + certificates)
previewImages.forEach((image) => {
  image.addEventListener("click", () => {
    openImageViewer([{ src: image.src, alt: image.alt }], 0);
  });
});

// "See Photos" button on web design cards opens the full gallery for that project
seePhotosButtons.forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const projectImageCard = button.closest(".project-image-card");
    const stackImages = Array.from(projectImageCard.querySelectorAll(".stack-item"));
    const images = stackImages.map((img) => ({ src: img.src, alt: img.alt }));
    openImageViewer(images, 0);
  });
});

viewerPrev.addEventListener("click", (event) => {
  event.stopPropagation();
  showGalleryImage(currentGalleryIndex - 1);
});

viewerNext.addEventListener("click", (event) => {
  event.stopPropagation();
  showGalleryImage(currentGalleryIndex + 1);
});

closeViewer.addEventListener("click", hideImageViewer);

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    hideImageViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (!imageViewer.classList.contains("show")) return;

  if (event.key === "Escape") {
    hideImageViewer();
  } else if (event.key === "ArrowLeft") {
    showGalleryImage(currentGalleryIndex - 1);
  } else if (event.key === "ArrowRight") {
    showGalleryImage(currentGalleryIndex + 1);
  }
});

/* ===========================
   PROJECT FILTER
   =========================== */

function applyProjectFilter(filter) {
  let visibleCount = 0;

  projectCards.forEach((card) => {
    const category = card.dataset.category;
    const isVisible = category === filter;
    card.classList.toggle("hidden", !isVisible);
    if (isVisible) {
      visibleCount += 1;
    }
  });

  emptyState.classList.toggle("show", visibleCount === 0);
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.toggle("active", btn === button));
    applyProjectFilter(button.dataset.filter);
  });
});

applyProjectFilter("embedded-system");

/* ===========================
   NAV + SCROLL
   =========================== */

function updateActiveNavLink() {
  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 120;

    if (window.scrollY >= sectionTop) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
}

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

function resetScrollOnLoad() {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }
}

window.addEventListener("pageshow", () => {
  if (!window.location.hash) {
    resetScrollOnLoad();
    setTimeout(resetScrollOnLoad, 0);
    requestAnimationFrame(resetScrollOnLoad);
    setTimeout(resetScrollOnLoad, 100);
  }
});

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", () => {
  if (!window.location.hash) {
    resetScrollOnLoad();
    setTimeout(resetScrollOnLoad, 0);
    requestAnimationFrame(resetScrollOnLoad);
    setTimeout(resetScrollOnLoad, 100);
  }
  updateActiveNavLink();
});

/* ===========================
   3D TILT EFFECT FOR PROJECT CARDS
   =========================== */

const tiltCards = document.querySelectorAll(".portfolio-project-card");
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (supportsHover) {
  const maxTilt = 10; // degrees
  const maxLift = -8; // px
  const resetTransition = "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)";

  tiltCards.forEach((card) => {
    const cardImage = card.querySelector("img");

    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });

    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((centerY - y) / centerY) * maxTilt;
      const rotateY = ((x - centerX) / centerX) * maxTilt;

      card.style.transform =
        `perspective(1000px) translateY(${maxLift}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      if (cardImage) {
        cardImage.style.transform = `translateZ(24px) scale(1.05)`;
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.transition = resetTransition;
      card.style.transform = "";
      if (cardImage) {
        cardImage.style.transform = "";
      }
    });
  });
}
