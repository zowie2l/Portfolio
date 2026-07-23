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
