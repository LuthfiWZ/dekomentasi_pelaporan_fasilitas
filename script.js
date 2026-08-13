(() => {
  "use strict";

  /* ---- Mobile hamburger menu ---- */
  const burger = document.getElementById("burgerBtn");
  const navLinks = document.getElementById("navLinks");

  function closeMenu() {
    navLinks.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = navLinks.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(isOpen));
  }

  if (burger && navLinks) {
    burger.addEventListener("click", toggleMenu);

    // Close menu after a nav link is tapped (mobile smooth-scroll UX)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close on Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ---- Navbar shadow once page is scrolled ---- */
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.style.boxShadow = window.scrollY > 8
      ? "0 4px 0 var(--color-ink)"
      : "none";
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Scroll-triggered reveal (Intersection Observer, no library) ---- */
  const revealTargets = document.querySelectorAll("[data-reveal]");

  if ("IntersectionObserver" in window && revealTargets.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // small stagger so grouped elements don't pop in all at once
            setTimeout(() => entry.target.classList.add("is-visible"), i * 60);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    // Fallback: no IO support — just show everything
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---- Active nav link on scroll ----
     Navbar only links to a subset of sections (Tentang, Keunggulan, Fitur,
     Screenshot, Teknologi, Kontak). Sections without their own nav link
     (Alur, Role, Modul, Arsitektur, Database, Kebutuhan, Keamanan, FAQ)
     should keep the closest preceding linked section highlighted, rather
     than showing no active state at all while scrolling through them. */
  const navAnchors = Array.from(document.querySelectorAll(".navbar__link"));
  const navTargets = navAnchors
    .map((a) => {
      const el = document.querySelector(a.getAttribute("href"));
      return el ? { anchor: a, el } : null;
    })
    .filter(Boolean);

  if (navTargets.length) {
    let ticking = false;

    const updateActiveNav = () => {
      const line = window.scrollY + 140; // matches sticky navbar height + margin
      let current = navTargets[0];
      navTargets.forEach((target) => {
        if (target.el.offsetTop <= line) current = target;
      });
      navAnchors.forEach((a) => a.classList.remove("is-active"));
      current.anchor.classList.add("is-active");
      ticking = false;
    };

    document.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          window.requestAnimationFrame(updateActiveNav);
          ticking = true;
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", updateActiveNav);
    updateActiveNav();
  }
  /* ---- FAQ accordion ---- */
  const accordionTriggers = document.querySelectorAll(".accordion__trigger");
  accordionTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const panel = trigger.parentElement.querySelector(".accordion__panel");
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
      if (panel) panel.classList.toggle("is-open", !isOpen);
    });
  });
})();
