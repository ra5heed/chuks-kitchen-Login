/**
 * main.js
 * -------
 * Entry point. Initialises all UI interactions after the DOM
 * is ready:
 *   - Render dynamic content (categories, specials)
 *   - Navbar scroll shadow
 *   - Hamburger mobile menu toggle
 *   - Scroll-to-top button
 *   - "Add to cart" toast notification
 *
 * All selectors use IDs defined in index.html so this file
 * stays tightly coupled to the markup structure but easy to
 * follow.
 */

document.addEventListener("DOMContentLoaded", () => {

  /* -------------------------------------------------------
     1. RENDER DYNAMIC CONTENT
     Calls functions from render.js with data from data.js
  ------------------------------------------------------- */
  const categoriesGrid = document.getElementById("categoriesGrid");
  const specialsGrid   = document.getElementById("specialsGrid");

  if (categoriesGrid) renderCategories(categoriesGrid, CATEGORIES);
  if (specialsGrid)   renderSpecials(specialsGrid, SPECIALS);


  /* -------------------------------------------------------
     2. NAVBAR – add shadow when page is scrolled
  ------------------------------------------------------- */
  const navbar = document.getElementById("navbar");

  const handleNavbarScroll = () => {
    if (window.scrollY > 10) {
      navbar.classList.add("navbar--scrolled");
    } else {
      navbar.classList.remove("navbar--scrolled");
    }
  };

  window.addEventListener("scroll", handleNavbarScroll, { passive: true });


  /* -------------------------------------------------------
     3. HAMBURGER – toggle mobile nav menu
  ------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const navLinks  = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    const isOpen = hamburger.classList.toggle("open");
    navLinks.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
  });

  // Close menu when a nav link is clicked (smooth UX on mobile)
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", false);
    });
  });


  /* -------------------------------------------------------
     4. SCROLL-TO-TOP BUTTON – show after 400px scroll
  ------------------------------------------------------- */
  const scrollTopBtn = document.getElementById("scrollTop");

  const handleScrollTopVisibility = () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add("visible");
    } else {
      scrollTopBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", handleScrollTopVisibility, { passive: true });

  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });


  /* -------------------------------------------------------
     5. ADD-TO-CART – toast notification
     Uses event delegation on the specials grid so we don't
     need to attach listeners to each button individually.
  ------------------------------------------------------- */

  /**
   * Creates and animates a brief toast notification.
   * @param {string} message - Text to display in the toast.
   */
  function showToast(message) {
    // Reuse existing toast if it's already in the DOM
    let toast = document.getElementById("toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.id = "toast";
      applyToastStyles(toast);
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("toast--visible");

    // Hide after 2.5 s
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
      toast.classList.remove("toast--visible");
    }, 2500);
  }

  /**
   * Applies inline styles to the toast element.
   * Keeping toast styles here avoids polluting the CSS files
   * with one-off, JS-only styles.
   * @param {HTMLElement} el
   */
  function applyToastStyles(el) {
    Object.assign(el.style, {
      position:        "fixed",
      bottom:          "80px",
      left:            "50%",
      transform:       "translateX(-50%) translateY(20px)",
      background:      "#1a1a1a",
      color:           "#fff",
      padding:         "0.75rem 1.5rem",
      borderRadius:    "9999px",
      fontSize:        "0.88rem",
      fontWeight:      "600",
      opacity:         "0",
      transition:      "opacity 0.3s ease, transform 0.3s ease",
      zIndex:          "1000",
      pointerEvents:   "none",
      whiteSpace:      "nowrap",
    });

    // Add visible class styles via a <style> tag (one-time)
    if (!document.getElementById("toastStyle")) {
      const style = document.createElement("style");
      style.id = "toastStyle";
      style.textContent = `
        #toast.toast--visible {
          opacity: 1 !important;
          transform: translateX(-50%) translateY(0) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }

  // Delegate click events on the specials section
  if (specialsGrid) {
    specialsGrid.addEventListener("click", (e) => {
      const btn = e.target.closest(".btn--primary");
      if (!btn) return;

      const card  = btn.closest(".specials-card");
      const title = card?.querySelector(".specials-card__title")?.textContent ?? "Item";

      showToast(`"${title}" added to cart! 🛒`);
    });
  }


  /* -------------------------------------------------------
     6. SEARCH BAR – basic UX (focus ring + enter key)
  ------------------------------------------------------- */
  const searchInput = document.querySelector(".search-bar__input");

  if (searchInput) {
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) {
          // In a real app: navigate to search results page.
          // For this static demo we just show an alert.
          alert(`Searching for: "${query}"`);
        }
      }
    });
  }


  /* -------------------------------------------------------
     7. KEYBOARD ACCESSIBILITY – category cards
     Allow Enter / Space to "click" category cards.
  ------------------------------------------------------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      const card = e.target.closest(".category-card");
      if (card) {
        e.preventDefault();
        card.click();
      }
    }
  });

}); // end DOMContentLoaded
