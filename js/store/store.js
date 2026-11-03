
/**
 * KUNJO by AuraGems
 * Client-side shopping state engine
 *
 * Responsibilities:
 * - Shopping cart management
 * - Wishlist management
 * - Persistent browser storage
 * - State subscriptions
 *
 * This is a frontend prototype, not a server-side
 * order or inventory management system.
 */

import { getProductById } from "./products.js";

const STORAGE_KEYS = {
  cart: "kunjo_aura_cart_v1",
  wishlist: "kunjo_aura_wishlist_v1"
};

const state = {
  cart: loadState(STORAGE_KEYS.cart, []),
  wishlist: loadState(STORAGE_KEYS.wishlist, [])
};

const listeners = new Set();

/**
 * Safely retrieve persisted state.
 */
function loadState(key, fallback) {
  try {
    const stored = localStorage.getItem(key);

    if (!stored) return fallback;

    const parsed = JSON.parse(stored);

    return Array.isArray(parsed) ? parsed : fallback;
  } catch (error) {
    console.warn(`Unable to load ${key}:`, error);
    return fallback;
  }
}

/**
 * Persist a state value in browser storage.
 */
function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Unable to persist ${key}:`, error);
    return false;
  }
}

/**
 * Notify subscribers whenever application state changes.
 */
function notify() {
  const snapshot = getState();

  listeners.forEach(listener => {
    try {
      listener(snapshot);
    } catch (error) {
      console.error("State subscriber failed:", error);
    }
  });
}

/**
 * Save cart and wishlist changes.
 */
function commit() {
  persist(STORAGE_KEYS.cart, state.cart);
  persist(STORAGE_KEYS.wishlist, state.wishlist);

  notify();
}

/**
 * Return a safe snapshot of the current state.
 */
export function getState() {
  return {
    cart: state.cart.map(item => ({ ...item })),
    wishlist: [...state.wishlist]
  };
}

/**
 * Subscribe to application state updates.
 */
export function subscribe(listener) {
  if (typeof listener !== "function") {
    throw new TypeError("Subscriber must be a function.");
  }

  listeners.add(listener);

  return () => listeners.delete(listener);
}

/* =========================
   SHOPPING CART OPERATIONS
========================= */

/**
 * Add a product to the cart.
 */
export function addToCart(productId, quantity = 1) {
  const product = getProductById(productId);

  if (!product) {
    return { success: false, message: "Product not found." };
  }

  if (!product.inStock) {
    return { success: false, message: "Product is unavailable." };
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
    return { success: false, message: "Invalid quantity." };
  }

  const existingItem = state.cart.find(
    item => item.productId === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    state.cart.push({
      productId,
      quantity
    });
  }

  commit();

  return {
    success: true,
    message: `${product.name} added to your bag.`
  };
}

/**
 * Remove a product completely from the cart.
 */
export function removeFromCart(productId) {
  const previousLength = state.cart.length;

  state.cart = state.cart.filter(
    item => item.productId !== productId
  );

  if (state.cart.length === previousLength) {
    return { success: false, message: "Product was not in your bag." };
  }

  commit();

  return { success: true, message: "Product removed from your bag." };
}

/**
 * Change the quantity of an existing cart item.
 */
export function updateQuantity(productId, quantity) {
  if (!Number.isInteger(quantity)) {
    return { success: false, message: "Quantity must be a whole number." };
  }

  if (quantity <= 0) {
    return removeFromCart(productId);
  }

  const item = state.cart.find(
    entry => entry.productId === productId
  );

  if (!item) {
    return { success: false, message: "Cart item not found." };
  }

  item.quantity = quantity;

  commit();

  return { success: true, message: "Quantity updated." };
}

/**
 * Empty the shopping cart.
 */
export function clearCart() {
  if (state.cart.length === 0) return;

  state.cart = [];

  commit();
}

/**
 * Return detailed cart items with product information.
 */
export function getCartItems() {
  return state.cart
    .map(item => {
      const product = getProductById(item.productId);

      if (!product) return null;

      return {
        ...product,
        quantity: item.quantity,
        lineTotal: product.price * item.quantity
      };
    })
    .filter(Boolean);
}

/**
 * Calculate the total number of items.
 */
export function getCartCount() {
  return state.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}

/**
 * Calculate the cart subtotal.
 */
export function getCartSubtotal() {
  return getCartItems().reduce(
    (total, item) => total + item.lineTotal,
    0
  );
}

/* =========================
   WISHLIST OPERATIONS
========================= */

/**
 * Add a product to the wishlist.
 */
export function addToWishlist(productId) {
  const product = getProductById(productId);

  if (!product) {
    return { success: false, message: "Product not found." };
  }

  if (state.wishlist.includes(productId)) {
    return { success: false, message: "Already in your wishlist." };
  }

  state.wishlist.push(productId);

  commit();

  return { success: true, message: "Added to your wishlist." };
}

/**
 * Remove a product from the wishlist.
 */
export function removeFromWishlist(productId) {
  const previousLength = state.wishlist.length;

  state.wishlist = state.wishlist.filter(
    id => id !== productId
  );

  if (state.wishlist.length === previousLength) {
    return { success: false, message: "Product was not in your wishlist." };
  }

  commit();

  return { success: true, message: "Removed from your wishlist." };
}

/**
 * Toggle wishlist status.
 */
export function toggleWishlist(productId) {
  return state.wishlist.includes(productId)
    ? removeFromWishlist(productId)
    : addToWishlist(productId);
}

/**
 * Check whether a product is wishlisted.
 */
export function isWishlisted(productId) {
  return state.wishlist.includes(productId);
}

/**
 * Return complete wishlist product information.
 */
export function getWishlistItems() {
  return state.wishlist
    .map(getProductById)
    .filter(Boolean);
}

/* =========================
   CROSS-TAB SYNCHRONISATION
========================= */

/**
 * Listen for changes made in another browser tab.
 */
window.addEventListener("storage", event => {
  if (event.key === STORAGE_KEYS.cart) {
    state.cart = loadState(STORAGE_KEYS.cart, []);
    notify();
  }

  if (event.key === STORAGE_KEYS.wishlist) {
    state.wishlist = loadState(STORAGE_KEYS.wishlist, []);
    notify();
  }
});
