
import { formatPrice } from "./products.js";
import { isWishlisted } from "./store.js";

/**
 * Escape HTML-sensitive characters before inserting dynamic values.
 */
export function escapeHTML(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

/**
 * Render a reusable product card.
 */
export function renderProductCard(product) {
  if (!product) return "";

  const safeId = escapeHTML(product.id);
  const safeName = escapeHTML(product.name);
  const safeCategory = escapeHTML(product.category);
  const safeImage = escapeHTML(product.image);
  const safeDescription = escapeHTML(product.description);
  const safeBadge = product.badge
    ? `<span class="product-badge">${escapeHTML(product.badge)}</span>`
    : "";

  const wishlistActive = isWishlisted(product.id);

  return `
    <article class="product-card" data-product-id="${safeId}">
      <div class="product-card__image">
        <img
          src="${safeImage}"
          alt="${safeName}"
          loading="lazy"
        />

        ${safeBadge}

        <button
          class="product-card__wishlist ${wishlistActive ? "is-active" : ""}"
          type="button"
          data-action="wishlist"
          data-product-id="${safeId}"
          aria-label="${wishlistActive ? "Remove from" : "Add to"} wishlist"
          aria-pressed="${wishlistActive}"
        >
          <span aria-hidden="true">${wishlistActive ? "♥" : "♡"}</span>
        </button>

        <button
          class="product-card__quick-view"
          type="button"
          data-action="quick-view"
          data-product-id="${safeId}"
        >
          Quick view
        </button>
      </div>

      <div class="product-card__details">
        <span class="product-card__category">${safeCategory}</span>

        <h3 class="product-card__name">${safeName}</h3>

        <p class="product-card__description">${safeDescription}</p>

        <div class="product-card__bottom">
          <span class="product-card__price">
            ${formatPrice(product.price, product.currency)}
          </span>

          <button
            class="product-card__add"
            type="button"
            data-action="add-to-cart"
            data-product-id="${safeId}"
            ${product.inStock ? "" : "disabled"}
          >
            ${product.inStock ? "Add to bag +" : "Out of stock"}
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render a collection of product cards.
 */
export function renderProductGrid(productList = []) {
  if (!productList.length) {
    return `
      <div class="catalog-empty">
        <h3>No pieces found</h3>
        <p>Try adjusting your search or filters.</p>
      </div>
    `;
  }

  return productList.map(renderProductCard).join("");
}

/**
 * Render a toast notification.
 */
export function renderToast(message, type = "success") {
  const safeMessage = escapeHTML(message);
  const safeType = ["success", "error", "info"].includes(type)
    ? type
    : "info";

  return `
    <div
      class="toast toast--${safeType}"
      role="status"
      aria-live="polite"
    >
      <span class="toast__message">${safeMessage}</span>
    </div>
  `;
}

/**
 * Format the product quantity label.
 */
export function formatItemCount(count) {
  const safeCount = Math.max(0, Number(count) || 0);

  return `${safeCount} ${safeCount === 1 ? "item" : "items"}`;
}
