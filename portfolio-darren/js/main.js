function initPortfolio() {
try {
document.body.classList.add("js-enabled");

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const targetId = anchor.getAttribute("href");
    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "auto", block: "start" });
  });
});

const modalButtons = document.querySelectorAll("[data-modal-target]");
const modals = document.querySelectorAll(".modal");
let activeModal = null;
let lastFocusedElement = null;

function openModal(modal) {
  if (!modal) return;

  lastFocusedElement = document.activeElement;
  activeModal = modal;
  modal.hidden = false;
  document.body.classList.add("modal-open");

  const closeButton = modal.querySelector(".modal-close");
  if (closeButton) closeButton.focus();
}

function closeModal(modal = activeModal) {
  if (!modal) return;

  modal.hidden = true;
  activeModal = null;
  document.body.classList.remove("modal-open");

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

modalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    openModal(document.getElementById(button.dataset.modalTarget));
  });

  button.addEventListener("keydown", (event) => {
    if (button.tagName === "BUTTON") return;
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    openModal(document.getElementById(button.dataset.modalTarget));
  });
});

modals.forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal || event.target.classList.contains("modal-close")) {
      closeModal(modal);
    }
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});

const urlParams = new URLSearchParams(window.location.search);
const requestedPopup = urlParams.get("popup");
const requestedTarget = urlParams.get("target") || window.location.hash.slice(1);

if (requestedPopup === "concevoir" || requestedPopup === "verifier") {
  const competencesSection = requestedTarget === "competences" ? document.getElementById("competences") : null;
  const requestedModal = document.getElementById(`modal-${requestedPopup}`);

  const previousScrollBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = "auto";

  if (requestedModal) {
    openModal(requestedModal);
  }

  if (competencesSection) {
    const targetTop = competencesSection.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, targetTop);
  }

  document.documentElement.style.scrollBehavior = previousScrollBehavior;
}

document.querySelectorAll(".reveal, .reveal-section, .reveal-card, .about-timeline").forEach((element) => {
  element.classList.add("is-visible");
  element.style.removeProperty("--reveal-delay");
  element.style.transitionDelay = "0ms";
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const note = contactForm.querySelector(".form-note");
    if (note) {
      note.textContent = "Formulaire statique pour l’instant : aucun message n’est envoyé.";
    }
  });
}

document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const frame = carousel.closest(".kart-carousel-frame") || carousel.closest(".kart-section");
  const previousButton = frame ? frame.querySelector("[data-carousel-prev]") : null;
  const nextButton = frame ? frame.querySelector("[data-carousel-next]") : null;
  const dots = frame ? Array.from(frame.querySelectorAll(".kart-carousel-dots span")) : [];

  const getScrollAmount = () => {
    const firstCard = carousel.querySelector(".kart-step-card, .kart-intro-slide");
    if (!firstCard) return Math.max(carousel.clientWidth * 0.85, 280);

    const styles = window.getComputedStyle(carousel);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateDots = () => {
    if (!dots.length) return;

    const amount = getScrollAmount();
    const activeIndex = Math.round(carousel.scrollLeft / amount);

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === Math.max(0, Math.min(activeIndex, dots.length - 1)));
    });
  };

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      carousel.scrollBy({ left: -getScrollAmount(), behavior: "auto" });
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      carousel.scrollBy({ left: getScrollAmount(), behavior: "auto" });
    });
  }

  carousel.addEventListener("scroll", () => {
    window.requestAnimationFrame(updateDots);
  }, { passive: true });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      carousel.scrollTo({ left: getScrollAmount() * index, behavior: "auto" });
    });
  });

  updateDots();
});

document.querySelectorAll("[data-project-slider]").forEach((slider) => {
  const track = slider.querySelector(".slider-track");
  const slides = track ? Array.from(track.children) : [];
  const previousButton = slider.querySelector(".slider-prev");
  const nextButton = slider.querySelector(".slider-next");
  let currentIndex = 0;
  let touchStartX = 0;

  if (!track || slides.length === 0) return;

  const updateSlider = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    slides.forEach((slide, index) => {
      slide.setAttribute("aria-hidden", String(index !== currentIndex));
    });

    if (previousButton) previousButton.disabled = currentIndex === 0;
    if (nextButton) nextButton.disabled = currentIndex === slides.length - 1;
  };

  const goToSlide = (nextIndex) => {
    currentIndex = Math.max(0, Math.min(nextIndex, slides.length - 1));
    updateSlider();
  };

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      goToSlide(currentIndex + 1);
    });
  }

  slider.addEventListener("touchstart", (event) => {
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  slider.addEventListener("touchend", (event) => {
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistance = touchEndX - touchStartX;

    if (Math.abs(swipeDistance) < 42) return;

    goToSlide(currentIndex + (swipeDistance < 0 ? 1 : -1));
  }, { passive: true });

  updateSlider();
});

document.querySelectorAll("[data-c1-tabs]").forEach((tabsRoot) => {
  const tabs = Array.from(tabsRoot.querySelectorAll("[data-c1-tab]"));
  const panels = Array.from(tabsRoot.querySelectorAll("[data-c1-panel]"));

  if (!tabs.length || !panels.length) return;

  const activateTab = (targetId) => {
    tabs.forEach((tab) => {
      const isActive = tab.dataset.c1Tab === targetId;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.c1Panel === targetId;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => activateTab(tab.dataset.c1Tab));
  });

  activateTab(tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.c1Tab || tabs[0].dataset.c1Tab);
});
} catch (error) {
  document.body.classList.remove("js-enabled");
  console.error("Portfolio scripts failed to initialize.", error);
}
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initPortfolio);
} else {
  initPortfolio();
}
