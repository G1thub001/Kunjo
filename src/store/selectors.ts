
import type { CartLineItem } from "../types/product";
import { products, formatPrice } from "../data/products";
import type { StoreState } from "./useStore";

export const selectCartCount = (state: StoreState): number =>
  state.cart.reduce((total, item) => total + item.quantity, 0);

export const selectCartSubtotal = (state: StoreState): number =>
  state.cart.reduce((total, item) => {
    const product = products.find(
      (product) => product.id === item.productId,
    );

    return total + (product ? product.price * item.quantity : 0);
  }, 0);

export const selectCartItems = (state: StoreState): CartLineItem[] =>
  state.cart.flatMap((item) => {
    const product = products.find(
      (product) => product.id === item.productId,
    );

    if (!product) return [];

    return [{
      ...product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    }];
  });

export const selectWishlistCount = (state: StoreState): number =>
  state.wishlist.length;

export const selectIsWishlisted =
  (productId: string) =>
  (state: StoreState): boolean =>
    state.wishlist.includes(productId);

export const selectCartSummary = (state: StoreState) => {
  const items = selectCartItems(state);
  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  return {
    items,
    itemCount: selectCartCount(state),
    subtotal,
    formattedSubtotal: formatPrice(subtotal),
  };
};
