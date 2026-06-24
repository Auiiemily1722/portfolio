const revealItems = document.querySelectorAll("[data-reveal]");
const mediaFrames = document.querySelectorAll(".media-frame");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function revealNow(item) {
  item.classList.add("is-visible");

  const tags = item.querySelectorAll(".tech-list li");
  tags.forEach((tag, index) => {
    tag.style.transitionDelay = `${index * 45}ms`;
    tag.classList.add("tag-visible");
  });
}

function setupReveal() {
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach(revealNow);
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealNow(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.16 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function closeLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.removeAttribute("src");
  lightboxImage.removeAttribute("alt");
}

function setupLightbox() {
  if (!lightbox || !lightboxImage) return;

  mediaFrames.forEach((frame) => {
    frame.setAttribute("tabindex", "0");
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", "打开项目截图大图");

    const open = () => {
      const image = frame.querySelector("img");
      if (!image) return;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt;
      lightbox.hidden = false;
    };

    frame.addEventListener("click", open);
    frame.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    });
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  lightboxClose?.addEventListener("click", closeLightbox);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });
}

setupReveal();
setupLightbox();
