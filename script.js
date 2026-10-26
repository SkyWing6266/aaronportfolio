document.documentElement.classList.add("js");

const backgroundVideo = document.querySelector(".site-background video");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

if (reducedMotionPreference.matches) {
  backgroundVideo.pause();
}

reducedMotionPreference.addEventListener("change", (event) => {
  if (event.matches) {
    backgroundVideo.pause();
  } else {
    backgroundVideo.play().catch((error) => {
      if (error.name !== "NotAllowedError") {
        console.error("Unable to play the background video.", error);
      }
    });
  }
});

const cursorSphere = document.querySelector(".cursor-sphere");
const finePointer = window.matchMedia("(pointer: fine)");

if (finePointer.matches) {
  document.addEventListener("pointermove", (event) => {
    if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
      return;
    }

    cursorSphere.style.transform =
      `translate3d(${event.clientX - cursorSphere.offsetWidth / 2}px, ${event.clientY - cursorSphere.offsetHeight / 2}px, 0)`;
    cursorSphere.classList.add("is-visible");
  });

  document.addEventListener("pointerleave", () => {
    cursorSphere.classList.remove("is-visible");
  });

  document.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") {
      cursorSphere.classList.add("is-visible");
    }
  });

  document.addEventListener("click", (event) => {
    if (event.detail === 0 || event.pointerType === "touch") {
      return;
    }

    cursorSphere.classList.remove("is-rippling");
    void cursorSphere.offsetWidth;
    cursorSphere.classList.add("is-rippling");
    window.setTimeout(() => cursorSphere.classList.remove("is-rippling"), 850);
  });
}

const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

function setMenuOpen(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  siteNavigation.classList.toggle("is-open", isOpen);
  document.body.classList.toggle("menu-open", isOpen);
}

menuToggle.addEventListener("click", () => {
  setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
});

siteNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
    setMenuOpen(false);
    menuToggle.focus();
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document
    .querySelectorAll(".about-section, .languages-section, .skills-section, .contact-section")
    .forEach((section) => {
      section.classList.add("reveal");
      revealObserver.observe(section);
    });
}
