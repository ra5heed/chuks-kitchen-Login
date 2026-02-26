/**
 * render.js
 * ---------
 * Pure rendering functions that take data (from data.js) and
 * inject HTML into the DOM. Keeping rendering separate from
 * data and UI logic makes each file easier to read and test.
 */

/**
 * Builds a single category card element.
 * @param {Object} category - Category data object.
 * @returns {HTMLElement}
 */
function buildCategoryCard(category) {
  const card = document.createElement("article");
  card.className = "category-card";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Browse ${category.label}`);

  card.innerHTML = `
    <div class="category-card__img-wrap">
      <img
        src="${category.img}"
        alt="${category.alt}"
        loading="lazy"
        decoding="async"
      />
    </div>
    <p class="category-card__label">${category.label}</p>
  `;

  return card;
}

/**
 * Builds a single chef's special card element.
 * @param {Object} special - Special item data object.
 * @returns {HTMLElement}
 */
function buildSpecialCard(special) {
  const card = document.createElement("article");
  card.className = "specials-card";

  card.innerHTML = `
    <div class="specials-card__img-wrap">
      <img
        src="${special.img}"
        alt="${special.alt}"
        loading="lazy"
        decoding="async"
      />
    </div>
    <div class="specials-card__body">
      <h3 class="specials-card__title">${special.title}</h3>
      <p class="specials-card__desc">${special.desc}</p>
      <div class="specials-card__footer">
        <span class="specials-card__price">${special.price}</span>
        <button
          class="btn btn--primary btn--sm"
          aria-label="Add ${special.title} to cart"
        >
          Add to cart
        </button>
      </div>
    </div>
  `;

  return card;
}

/**
 * Populates the categories grid with cards built from CATEGORIES data.
 * @param {HTMLElement} container - The grid container element.
 * @param {Array}       data      - Array of category objects.
 */
function renderCategories(container, data) {
  const fragment = document.createDocumentFragment();
  data.forEach((category) => fragment.appendChild(buildCategoryCard(category)));
  container.appendChild(fragment);
}

/**
 * Populates the specials grid with cards built from SPECIALS data.
 * @param {HTMLElement} container - The grid container element.
 * @param {Array}       data      - Array of special item objects.
 */
function renderSpecials(container, data) {
  const fragment = document.createDocumentFragment();
  data.forEach((special) => fragment.appendChild(buildSpecialCard(special)));
  container.appendChild(fragment);
}
