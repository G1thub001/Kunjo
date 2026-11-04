
import { describe, expect, it } from "vitest";

import {
  selectCartCount,
  selectCartSubtotal,
  selectCartItems,
  selectWishlistCount,
  selectIsWishlisted,
  selectCartSummary,
} from "../selectors";

import { products, formatPrice } from "../../data/products";
import type { StoreState } from "../useStore";

const product = products[0];
const secondProduct = products[1];

function createState(
  overrides: Partial<StoreState> = {},
): StoreState {
  return {
    cart: [],
    wishlist: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    toggleWishlist: () => {},
    addToWishlist: () => {},
    removeFromWishlist: () => {},
    ...overrides,
  };
}

describe("Store selectors", () => {
  describe("selectCartCount", () => {
    it("returns zero for an empty cart", () => {
      const state = createState();

      expect(selectCartCount(state)).toBe(0);
    });

    it("returns the total quantity of all cart items", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: secondProduct.id, quantity: 3 },
        ],
      });

      expect(selectCartCount(state)).toBe(5);
    });
  });

  describe("selectCartSubtotal", () => {
    it("returns zero for an empty cart", () => {
      const state = createState();

      expect(selectCartSubtotal(state)).toBe(0);
    });

    it("calculates the subtotal correctly", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: secondProduct.id, quantity: 1 },
        ],
      });

      const expected =
        product.price * 2 + secondProduct.price;

      expect(selectCartSubtotal(state)).toBe(expected);
    });

    it("ignores cart items whose products no longer exist", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: "INVALID-ID", quantity: 5 },
        ],
      });

      expect(selectCartSubtotal(state)).toBe(product.price * 2);
    });
  });

  describe("selectCartItems", () => {
    it("returns an empty array for an empty cart", () => {
      const state = createState();

      expect(selectCartItems(state)).toEqual([]);
    });

    it("returns complete product information for cart items", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
        ],
      });

      const result = selectCartItems(state);

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ...product,
        quantity: 2,
        lineTotal: product.price * 2,
      });
    });

    it("calculates line totals for multiple products", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: secondProduct.id, quantity: 3 },
        ],
      });

      const result = selectCartItems(state);

      expect(result).toHaveLength(2);
      expect(result[0].lineTotal).toBe(product.price * 2);
      expect(result[1].lineTotal).toBe(secondProduct.price * 3);
    });

    it("excludes products that no longer exist", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 1 },
          { productId: "INVALID-ID", quantity: 2 },
        ],
      });

      const result = selectCartItems(state);

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(product.id);
    });
  });

  describe("selectWishlistCount", () => {
    it("returns zero for an empty wishlist", () => {
      const state = createState();

      expect(selectWishlistCount(state)).toBe(0);
    });

    it("returns the number of saved products", () => {
      const state = createState({
        wishlist: [product.id, secondProduct.id],
      });

      expect(selectWishlistCount(state)).toBe(2);
    });
  });

  describe("selectIsWishlisted", () => {
    it("returns true when a product is in the wishlist", () => {
      const state = createState({
        wishlist: [product.id],
      });

      expect(
        selectIsWishlisted(product.id)(state),
      ).toBe(true);
    });

    it("returns false when a product is not in the wishlist", () => {
      const state = createState({
        wishlist: [product.id],
      });

      expect(
        selectIsWishlisted(secondProduct.id)(state),
      ).toBe(false);
    });

    it("returns false for an empty wishlist", () => {
      const state = createState();

      expect(
        selectIsWishlisted(product.id)(state),
      ).toBe(false);
    });
  });

  describe("selectCartSummary", () => {
    it("returns a complete summary for an empty cart", () => {
      const state = createState();

      expect(selectCartSummary(state)).toEqual({
        items: [],
        itemCount: 0,
        subtotal: 0,
        formattedSubtotal: formatPrice(0),
      });
    });

    it("returns the correct cart summary", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: secondProduct.id, quantity: 1 },
        ],
      });

      const summary = selectCartSummary(state);

      const expectedSubtotal =
        product.price * 2 + secondProduct.price;

      expect(summary.items).toHaveLength(2);
      expect(summary.itemCount).toBe(3);
      expect(summary.subtotal).toBe(expectedSubtotal);
      expect(summary.formattedSubtotal).toBe(
        formatPrice(expectedSubtotal),
      );
    });

    it("excludes invalid products from the summary", () => {
      const state = createState({
        cart: [
          { productId: product.id, quantity: 2 },
          { productId: "INVALID-ID", quantity: 4 },
        ],
      });

      const summary = selectCartSummary(state);

      expect(summary.items).toHaveLength(1);
      expect(summary.subtotal).toBe(product.price * 2);
    });
  });
});
