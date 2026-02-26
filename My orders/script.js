/**
 * CHUKS KITCHEN – ORDER SUMMARY PAGE
 * File: script.js
 *
 * Responsibilities:
 *  1. Mobile navigation toggle (hamburger menu)
 *  2. Delivery / Pick-up toggle (updates fee + recalculates total)
 *  3. Promo code application (demo validation)
 *  4. Checkout button click handler
 *  5. Scroll-to-top button visibility & behaviour
 */

/* ============================================================
   UTILITY: Format a number as a Nigerian Naira string
   e.g. formatNaira(9900) → "₦9,900"
============================================================ */
function formatNaira(amount) {
  return '\u20A6' + amount.toLocaleString('en-NG');
}


/* ============================================================
   CONFIGURATION
   Centralised order data so values are easy to change.
============================================================ */
const ORDER = {
  subtotal:    9200,   // base subtotal in Naira
  deliveryFee: 500,    // fee charged when "Delivery" is selected
  serviceFee:  200,
  tax:         0,

  // Valid promo codes: key = code, value = discount amount in Naira
  promoCodes: {
    'CHUKS10':  500,
    'WELCOME':  200,
    'NIGERIA2024': 1000
  }
};

// Tracks the currently applied promo discount (0 = none)
let appliedDiscount = 0;


/* ============================================================
   1. MOBILE NAVIGATION TOGGLE
============================================================ */
(function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navLinks     = document.getElementById('navLinks');

  if (!hamburgerBtn || !navLinks) return;

  hamburgerBtn.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburgerBtn.classList.toggle('is-open', isOpen);
    // Update aria attribute for screen readers
    hamburgerBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when the user clicks a link (prevents stale open state)
  navLinks.querySelectorAll('.navbar__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('is-open');
      hamburgerBtn.classList.remove('is-open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   2. PRICE CALCULATION
   Updates all price display elements based on ORDER state
   and the currently selected fulfilment mode.
============================================================ */

/**
 * Recalculates and re-renders the total.
 * @param {boolean} isDelivery - true if "Delivery" is selected, false for "Pick up"
 */
function updatePrices(isDelivery) {
  const fee   = isDelivery ? ORDER.deliveryFee : 0;
  const total = ORDER.subtotal + fee + ORDER.serviceFee + ORDER.tax - appliedDiscount;

  // Update individual line items
  document.getElementById('subtotal').textContent   = formatNaira(ORDER.subtotal);
  document.getElementById('deliveryFee').textContent = formatNaira(fee);
  document.getElementById('serviceFee').textContent  = formatNaira(ORDER.serviceFee);
  document.getElementById('tax').textContent         = formatNaira(ORDER.tax);

  // Update total (always show at least ₦0)
  document.getElementById('total').textContent = formatNaira(Math.max(0, total));
}


/* ============================================================
   3. DELIVERY / PICK-UP TOGGLE
============================================================ */
(function initDeliveryToggle() {
  const deliveryBtn = document.getElementById('deliveryBtn');
  const pickupBtn   = document.getElementById('pickupBtn');

  if (!deliveryBtn || !pickupBtn) return;

  // Track current mode so updatePrices() knows which fee to use
  let isDelivery = true;

  function setMode(delivery) {
    isDelivery = delivery;

    // Toggle active class on both buttons
    deliveryBtn.classList.toggle('delivery-toggle__btn--active', delivery);
    pickupBtn.classList.toggle('delivery-toggle__btn--active', !delivery);

    // Recalculate prices with updated fee
    updatePrices(isDelivery);
  }

  deliveryBtn.addEventListener('click', function () { setMode(true);  });
  pickupBtn.addEventListener('click',   function () { setMode(false); });

  // Initialise to delivery mode on page load
  updatePrices(true);
})();


/* ============================================================
   4. PROMO CODE APPLICATION
   Validates the entered code against ORDER.promoCodes
   and updates the total accordingly.
============================================================ */
(function initPromoCode() {
  const applyBtn = document.getElementById('applyPromoBtn');
  const input    = document.getElementById('promoInput');
  const feedback = document.getElementById('promoFeedback');

  if (!applyBtn || !input || !feedback) return;

  applyBtn.addEventListener('click', function () {
    const code    = input.value.trim().toUpperCase();
    const discount = ORDER.promoCodes[code];

    // Clear any previous feedback classes
    feedback.classList.remove('promo__feedback--success', 'promo__feedback--error');

    if (!code) {
      // Empty input – prompt the user
      feedback.textContent = 'Please enter a promo code.';
      feedback.classList.add('promo__feedback--error');
      return;
    }

    if (discount) {
      // Valid code found
      appliedDiscount = discount;
      feedback.textContent = 'Promo code applied! You saved ' + formatNaira(discount) + '.';
      feedback.classList.add('promo__feedback--success');
      input.disabled = true; // Prevent applying another code on top
    } else {
      // Invalid code
      appliedDiscount = 0;
      feedback.textContent = 'Invalid promo code. Please try again.';
      feedback.classList.add('promo__feedback--error');
    }

    // Recalculate prices with or without discount
    const isDelivery = document.getElementById('deliveryBtn')
      .classList.contains('delivery-toggle__btn--active');
    updatePrices(isDelivery);
  });

  // Allow pressing Enter inside the input to apply the code
  input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      applyBtn.click();
    }
  });
})();


/* ============================================================
   5. CHECKOUT BUTTON
   In a real app this would trigger a navigation / API call.
   Here it gathers the order data and logs / alerts a summary.
============================================================ */
(function initCheckout() {
  const checkoutBtn = document.getElementById('checkoutBtn');
  if (!checkoutBtn) return;

  checkoutBtn.addEventListener('click', function () {
    const instructions = document.getElementById('specialInstructions').value.trim();
    const isDelivery   = document.getElementById('deliveryBtn')
      .classList.contains('delivery-toggle__btn--active');
    const mode         = isDelivery ? 'Delivery' : 'Pick up';
    const totalText    = document.getElementById('total').textContent;

    // In production, replace this with a real checkout flow
    alert(
      'Order Summary\n' +
      '--------------\n' +
      'Mode: ' + mode + '\n' +
      'Total: ' + totalText + '\n' +
      (instructions ? 'Instructions: ' + instructions : 'No special instructions') + '\n\n' +
      'Proceeding to checkout...'
    );
  });
})();


/* ============================================================
   6. SCROLL-TO-TOP BUTTON
   Appears once the user scrolls more than 200px down the page.
============================================================ */
(function initScrollTop() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (!scrollTopBtn) return;

  // Show or hide based on scroll position
  function handleScroll() {
    if (window.scrollY > 200) {
      scrollTopBtn.classList.add('is-visible');
    } else {
      scrollTopBtn.classList.remove('is-visible');
    }
  }

  // Smooth scroll back to the top when clicked
  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Listen for scroll events (passive for performance)
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Run once on load in case the page is already scrolled
  handleScroll();
})();
