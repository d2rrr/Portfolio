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
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const modalButtons = document.querySelectorAll("[data-modal-target]");
const modals = document.querySelectorAll(".modal");
let activeModal = null;
let lastFocusedElement = null;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
  element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 4) * 80}ms`);
});

if (prefersReducedMotion) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

const typewriter = document.querySelector("[data-typewriter]");

if (typewriter) {
  const typewriterText = typewriter.dataset.typewriter || typewriter.textContent.trim();
  const target = typewriter.querySelector("span") || typewriter;
  typewriter.setAttribute("aria-label", typewriterText);

  if (prefersReducedMotion) {
    target.textContent = typewriterText;
  } else {
    target.textContent = "";

    let characterIndex = 0;
    const typeNextCharacter = () => {
      target.textContent = typewriterText.slice(0, characterIndex + 1);
      characterIndex += 1;

      if (characterIndex < typewriterText.length) {
        window.setTimeout(typeNextCharacter, 42);
      }
    };

    window.requestAnimationFrame(() => {
      window.setTimeout(typeNextCharacter, 260);
    });
  }
}

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
