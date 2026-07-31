const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const previewImages = document.querySelectorAll(".certificate-card img, .portfolio-project-card img");
const imageViewer = document.querySelector("#imageViewer");
const viewerImage = document.querySelector("#viewerImage");
const closeViewer = document.querySelector(".image-viewer-close");

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

function openImageViewer(image) {
  viewerImage.src = image.src;
  viewerImage.alt = image.alt;
  imageViewer.classList.add("show");
  imageViewer.setAttribute("aria-hidden", "false");
}

function hideImageViewer() {
  imageViewer.classList.remove("show");
  imageViewer.setAttribute("aria-hidden", "true");
  viewerImage.src = "";
}

window.addEventListener("scroll", updateActiveNavLink);
window.addEventListener("load", updateActiveNavLink);

previewImages.forEach((image) => {
  image.addEventListener("click", () => openImageViewer(image));
});

closeViewer.addEventListener("click", hideImageViewer);

imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) {
    hideImageViewer();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideImageViewer();
  }
});

// 3D tilt effect for project cards
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
