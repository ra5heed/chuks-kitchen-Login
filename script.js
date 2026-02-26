/* ------------------------------------------------------------------
   UTILITY – toggle a CSS class on an element
------------------------------------------------------------------ */
const toggleClass = (el, cls, force) => el.classList.toggle(cls, force);

/* ------------------------------------------------------------------
   AUTH PANEL SWITCHING
   Swap `is-active` between the login and sign-up panels.
------------------------------------------------------------------ */
const panelLogin  = document.getElementById('panel-login');
const panelSignup = document.getElementById('panel-signup');

function showPanel(show, hide) {
  hide.classList.remove('is-active');
  show.classList.add('is-active');
  // Scroll the card back to the top when switching panels
  show.closest('.auth-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('go-signup').addEventListener('click', (e) => {
  e.preventDefault();
  showPanel(panelSignup, panelLogin);
});

document.getElementById('go-login').addEventListener('click', (e) => {
  e.preventDefault();
  showPanel(panelLogin, panelSignup);
});

/* ------------------------------------------------------------------
   PASSWORD VISIBILITY TOGGLE
   Targets the input whose id matches [data-target] on the button.
   Swaps between the eye-open and eye-off SVG icons accordingly.
------------------------------------------------------------------ */
const EYE_OPEN = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>`;

const EYE_OFF = `
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>`;

document.querySelectorAll('.btn-toggle-pw').forEach((btn) => {
  btn.addEventListener('click', () => {
    const input    = document.getElementById(btn.dataset.target);
    if (!input) return;

    const isHidden = input.type === 'password';
    input.type     = isHidden ? 'text' : 'password';
    btn.innerHTML  = isHidden ? EYE_OFF : EYE_OPEN;
    btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
});

/* ------------------------------------------------------------------
   FORM VALIDATION HELPERS
------------------------------------------------------------------ */
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/* ------------------------------------------------------------------
   LOGIN FORM SUBMISSION
   Replace the console.log with your real API call.
------------------------------------------------------------------ */
document.getElementById('form-login').addEventListener('submit', (e) => {
  e.preventDefault();

  const email    = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Please fill in all fields.');
    return;
  }

  // TODO: call your authentication API here
  console.log('[Login] Submitting:', { email });
});

/* ------------------------------------------------------------------
   SIGN-UP FORM SUBMISSION
   Replace the console.log with your real API call.
------------------------------------------------------------------ */
document.getElementById('form-signup').addEventListener('submit', (e) => {
  e.preventDefault();

  const email    = document.getElementById('signup-email').value.trim();
  const phone    = document.getElementById('signup-phone').value.trim();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;
  const terms    = e.currentTarget.querySelector('[name="terms"]').checked;

  if (!email || !phone || !password || !confirm) {
    alert('Please fill in all fields.');
    return;
  }

  if (!isEmail(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  if (password !== confirm) {
    alert('Passwords do not match.');
    return;
  }

  if (!terms) {
    alert('You must agree to the Terms & Conditions to continue.');
    return;
  }

  // TODO: call your registration API here
  console.log('[Sign-up] Submitting:', { email, phone });
});

/* ------------------------------------------------------------------
   SCROLL-TO-TOP BUTTON
   Appears after scrolling 200 px; clicks scroll smoothly to top.
------------------------------------------------------------------ */
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  toggleClass(scrollTopBtn, 'visible', window.scrollY > 200);
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
