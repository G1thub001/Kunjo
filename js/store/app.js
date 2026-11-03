
import {
  getCatalog,
  getCatalogPage,
  categories,
  getCategoryCounts
} from "./catalog.js";

import {
  getState,
  subscribe,
  addToCart,
  removeFromCart,
  updateQuantity,
  getCartItems,
  getCartCount,
  getCartSubtotal,
  toggleWishlist,
  getWishlistItems
} from "./store.js";

import {
  renderProductGrid,
  renderToast,
  escapeHTML,
  formatItemCount
} from "./components.js";

import { formatPrice } from "./products.js";

// --------------------------------------------------
// APPLICATION CONFIGURATION
// --------------------------------------------------

const CONFIG = {
  pageSize: 6,
  toastDuration: 3000
};

const filters = {
  query: "",
  category: "All",
  minPrice: null,
  maxPrice: null,
  inStockOnly: false,
  sortBy: "featured"
};

let currentPage = 1;
let toastTimer = null;

// --------------------------------------------------
// DOM REFERENCES
// --------------------------------------------------

const elements = {
  productGrid: document.querySelector("#product-grid"),
  searchInput: document.querySelector("#search-input"),
  categoryFilter: document.querySelector("#category-filter"),
  sortSelect: document.querySelector("#sort-select"),
  minPrice: document.querySelector("#min-price"),
  maxPrice: document.querySelector("#max-price"),
  inStockOnly: document.querySelector("#in-stock-only"),
  loadMore: document.querySelector("#load-more"),
  cartCount: document.querySelector("#cart-count"),
  wishlistCount: document.querySelector("#wishlist-count"),
  toastContainer: document.querySelector("#toast-container"),
  cartSubtotal: document.querySelector("#cart-subtotal")
};

// --------------------------------------------------
// INITIALISE CATEGORY FILTER
// --------------------------------------------------

function initialiseCategories() {
  const select = elements.categoryFilter;

  if (!select) return;

  const counts = getCategoryCounts();

  select.innerHTML = categories.map((category) => {
    const count = counts[category] ?? 0;

    return `
      <option value="${escapeHTML(category)}">
        ${escapeHTML(category)} (${count})
      </option>
    `;
  }).join("");

  select.value = filters.category;
}

// --------------------------------------------------
// CATALOGUE RENDERING
// --------------------------------------------------

function renderCatalogue() {
  if (!elements.productGrid) {
    console.warn("AuraGems: Product grid element not found.");
    return;
  }

  const result = getCatalogPage(
    filters,
    currentPage,
    CONFIG.pageSize
  );

  elements.productGrid.innerHTML = renderProductGrid(result.items);

  if (elements.loadMore) {
    elements.loadMore.hidden =
      currentPage >= result.pagination.totalPages;

    elements.loadMore.disabled =
      currentPage >= result.pagination.totalPages;
  }

  const resultCount = document.querySelector("#result-count");

  if (resultCount) {
    resultCount.textContent =
      `${result.pagination.totalItems} pieces found`;
  }
}

// --------------------------------------------------
// STORE SUMMARY
// --------------------------------------------------

function renderStoreSummary() {
  if (elements.cartCount) {
    elements.cartCount.textContent = getCartCount();
  }

  if (elements.wishlistCount) {
    elements.wishlistCount.textContent =
      getWishlistItems().length;
  }

  if (elements.cartSubtotal) {
    elements.cartSubtotal.textContent =
      formatPrice(getCartSubtotal());
  }

  // Keep the current wishlist buttons synchronised.
  document.querySelectorAll(
    '[data-action="wishlist"]'
  ).forEach((button) => {
    const productId = button.dataset.productId;

    const active = getWishlistItems().some(
      (product) => product.id === productId
    );

    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));

    button.setAttribute(
      "aria-label",
      active ? "Remove from wishlist" : "Add to wishlist"
    );

    const icon = button.querySelector("span");

    if (icon) {
      icon.textContent = active ? "♥" : "♡";
    }
  });
}

// --------------------------------------------------
// TOAST NOTIFICATIONS
// --------------------------------------------------

function showToast(message, type = "success") {
  if (!elements.toastContainer) {
    console.info(`[AuraGems] ${message}`);
    return;
  }

  elements.toastContainer.innerHTML =
    renderToast(message, type);

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    elements.toastContainer.innerHTML = "";
  }, CONFIG.toastDuration);
}

// --------------------------------------------------
// SEARCH AND FILTER HANDLERS
// --------------------------------------------------

function handleSearch(event) {
  filters.query = event.target.value;
  currentPage = 1;
  renderCatalogue();
}

function handleCategoryChange(event) {
  filters.category = event.target.value;
  currentPage = 1;
  renderCatalogue();
}

function handleSortChange(event) {
  filters.sortBy = event.target.value;
  currentPage = 1;
  renderCatalogue();
}

function handlePriceChange() {
  filters.minPrice =
    elements.minPrice?.value === ""
      ? null
      : Number(elements.minPrice?.value);

  filters.maxPrice =
    elements.maxPrice?.value === ""
      ? null
      : Number(elements.maxPrice?.value);

  currentPage = 1;
  renderCatalogue();
}

function handleAvailabilityChange(event) {
  filters.inStockOnly = event.target.checked;
  currentPage = 1;
  renderCatalogue();
}

// --------------------------------------------------
// PRODUCT ACTIONS
// --------------------------------------------------

function handleProductAction(event) {
  const button = event.target.closest("[data-action]");

  if (!button) return;

  const { action, productId } = button.dataset;

  if (!productId) return;

  switch (action) {
    case "add-to-cart": {
      const result = addToCart(productId);

      if (result) {
        showToast("Added to your shopping bag.");
      } else {
        showToast("Unable to add this piece.", "error");
      }

      break;
    }

    case "wishlist": {
      const added = toggleWishlist(productId);

      showToast(
        added
          ? "Added to your wishlist."
          : "Removed from your wishlist."
      );

      break;
    }

    case "quick-view": {
      document.dispatchEvent(
        new CustomEvent("auragems:quick-view", {
          detail: { productId }
        })
      );

      break;
    }

    default:
      break;
  }
}

// --------------------------------------------------
// SHOPPING BAG ACTIONS
// --------------------------------------------------

function handleCartAction(event) {
  const button = event.target.closest("[data-cart-action]");

  if (!button) return;

  const { cartAction, productId, quantity } = button.dataset;

  if (!productId) return;

  switch (cartAction) {
    case "remove":
      removeFromCart(productId);
      showToast("Item removed from your bag.");
      break;

    case "increase":
      updateQuantity(
        productId,
        Number(quantity) + 1
      );
      break;

    case "decrease":
      updateQuantity(
        productId,
        Number(quantity) - 1
      );
      break;

    default:
      break;
  }
}

// --------------------------------------------------
// PAGINATION
// --------------------------------------------------

function handleLoadMore() {
  const result = getCatalogPage(
    filters,
    currentPage,
    CONFIG.pageSize
  );

  if (currentPage < result.pagination.totalPages) {
    currentPage += 1;

    // Append the next page instead of replacing existing cards.
    const nextResult = getCatalogPage(
      filters,
      currentPage,
      CONFIG.pageSize
    );

    elements.productGrid.insertAdjacentHTML(
      "beforeend",
      renderProductGrid(nextResult.items)
    );

    elements.loadMore.hidden =
      currentPage >= nextResult.pagination.totalPages;
  }
}

// --------------------------------------------------
// EVENT LISTENERS
// --------------------------------------------------

function bindEvents() {
  elements.searchInput?.addEventListener(
    "input",
    handleSearch
  );

  elements.categoryFilter?.addEventListener(
    "change",
    handleCategoryChange
  );

  elements.sortSelect?.addEventListener(
    "change",
    handleSortChange
  );

  elements.minPrice?.addEventListener(
    "change",
    handlePriceChange
  );

  elements.maxPrice?.addEventListener(
    "change",
    handlePriceChange
  );

  elements.inStockOnly?.addEventListener(
    "change",
    handleAvailabilityChange
  );

  elements.productGrid?.addEventListener(
    "click",
    handleProductAction
  );

  elements.loadMore?.addEventListener(
    "click",
    handleLoadMore
  );

  document.addEventListener(
    "click",
    handleCartAction
  );
}

// --------------------------------------------------
// APPLICATION STARTUP
// --------------------------------------------------

function initialiseApplication() {
  initialiseCategories();
  bindEvents();

  renderCatalogue();
  renderStoreSummary();

  // Re-render store information whenever state changes.
  subscribe(() => {
    renderStoreSummary();
    renderCatalogue();
  });

  console.info("KUNJO by AuraGems initialised successfully.");
}

// Start the application once the DOM is ready.
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initialiseApplication,
    { once: true }
  );
} else {
  initialiseApplication();
}
