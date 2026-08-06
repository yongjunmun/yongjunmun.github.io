const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".primary-navigation");
const navigationLinks = [...document.querySelectorAll(".primary-navigation a[href^='#']")];
const sections = [...document.querySelectorAll("main section[id]")];
const siteHeader = document.querySelector(".site-header");
const printCvButton = document.querySelector(".print-cv");

if (printCvButton) {
  printCvButton.addEventListener("click", () => window.print());
}

const closeMenu = () => {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
};

menuButton.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuButton.focus();
  }
});

const setActiveNavigation = (sectionId) => {
  navigationLinks.forEach((link) => {
    const isCurrent = link.getAttribute("href") === `#${sectionId}`;
    if (isCurrent) {
      link.setAttribute("aria-current", "true");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible) {
      setActiveNavigation(visible.target.id);
    }
  },
  {
    rootMargin: "-18% 0px -65% 0px",
    threshold: [0.05, 0.25, 0.5],
  },
);

sections.forEach((section) => sectionObserver.observe(section));

const updateHeaderState = () => {
  siteHeader.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const revealItems = [
  ...document.querySelectorAll(
    ".section-heading, .workstream, .earlier-experience article, .project-row, .skill-matrix > div, .education-list article, .credentials-list li",
  ),
];

if ("IntersectionObserver" in window && revealItems.length > 0) {
  document.documentElement.classList.add("reveal-ready");
  revealItems.forEach((item) => item.classList.add("reveal-item"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -8% 0px",
      threshold: 0.08,
    },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
}

window.addEventListener("resize", () => {
  if (window.innerWidth > 992) {
    closeMenu();
  }
});

const currentYear = document.querySelector("#current-year");
if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}
