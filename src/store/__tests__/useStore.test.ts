
import { beforeEach, describe, expect, it } from "vitest";
import { products } from "../../data/products";
import { useStore } from "../useStore";

const productId = products[0].id;
const secondProductId = products[1].id;
const invalidProductId = "INVALID-PRODUCT";

describe("Zustand Store", () => {
  beforeEach(() => {
    localStorage.clear();

    useStore.setState({
      cart: [],
      wishlist: [],
    });
  });

  describe("Cart operations", () => {
    it("adds a product to the cart", () => {
      useStore.getState().addToCart(productId);

      expect(useStore.getState().cart).toEqual([
        { productId, quantity: 1 },
      ]);
    });

    it("adds a product with a specified quantity", () => {
      useStore.getState().addToCart(productId, 3);

      expect(useStore.getState().cart[0].quantity).toBe(3);
    });

    it("increases quantity when adding an existing product", () => {
      useStore.getState().addToCart(productId, 2);
      useStore.getState().addToCart(productId, 3);

      expect(useStore.getState().cart).toHaveLength(1);
      expect(useStore.getState().cart[0].quantity).toBe(5);
    });

    it("does not add an invalid product", () => {
      useStore.getState().addToCart(invalidProductId);

      expect(useStore.getState().cart).toHaveLength(0);
    });

    it("does not add a product with a non-positive quantity", () => {
      useStore.getState().addToCart(productId, 0);
      useStore.getState().addToCart(productId, -2);

      expect(useStore.getState().cart).toHaveLength(0);
    });

    it("updates the quantity of an existing cart item", () => {
      useStore.getState().addToCart(productId, 2);
      useStore.getState().updateQuantity(productId, 5);

      expect(useStore.getState().cart[0].quantity).toBe(5);
    });

    it("rounds updated quantities down to whole numbers", () => {
      useStore.getState().addToCart(productId, 2);
      useStore.getState().updateQuantity(productId, 3.8);

      expect(useStore.getState().cart[0].quantity).toBe(3);
    });

    it("removes an item when its updated quantity is zero", () => {
      useStore.getState().addToCart(productId, 2);
      useStore.getState().updateQuantity(productId, 0);

      expect(useStore.getState().cart).toHaveLength(0);
    });

    it("removes a product from the cart", () => {
      useStore.getState().addToCart(productId);
      useStore.getState().addToCart(secondProductId);

      useStore.getState().removeFromCart(productId);

      expect(useStore.getState().cart).toHaveLength(1);
      expect(useStore.getState().cart[0].productId).toBe(secondProductId);
    });

    it("clears the entire cart", () => {
      useStore.getState().addToCart(productId);
      useStore.getState().addToCart(secondProductId);

      useStore.getState().clearCart();

      expect(useStore.getState().cart).toHaveLength(0);
    });
  });

  describe("Wishlist operations", () => {
    it("adds a product to the wishlist", () => {
      useStore.getState().addToWishlist(productId);

      expect(useStore.getState().wishlist).toContain(productId);
    });

    it("prevents duplicate wishlist entries", () => {
      useStore.getState().addToWishlist(productId);
      useStore.getState().addToWishlist(productId);

      expect(useStore.getState().wishlist).toHaveLength(1);
    });

    it("toggles a product into the wishlist", () => {
      useStore.getState().toggleWishlist(productId);

      expect(useStore.getState().wishlist).toContain(productId);
    });

    it("toggles an existing product out of the wishlist", () => {
      useStore.getState().addToWishlist(productId);
      useStore.getState().toggleWishlist(productId);

      expect(useStore.getState().wishlist).not.toContain(productId);
    });

    it("removes a product from the wishlist", () => {
      useStore.getState().addToWishlist(productId);
      useStore.getState().removeFromWishlist(productId);

      expect(useStore.getState().wishlist).not.toContain(productId);
    });

    it("does not add invalid products to the wishlist", () => {
      useStore.getState().addToWishlist(invalidProductId);
      useStore.getState().toggleWishlist(invalidProductId);

      expect(useStore.getState().wishlist).toHaveLength(0);
    });
  });
});
