import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import WishlistPage from "../WishlistPage";
import { products } from "../../data/products";
import { useStore } from "../../store/useStore";

const product = products[0];
const secondProduct = products[1];

function renderWishlistPage() {
  return render(
    <MemoryRouter>
      <WishlistPage />
    </MemoryRouter>,
  );
}

describe("WishlistPage", () => {
  beforeEach(() => {
    localStorage.clear();

    useStore.setState({
      cart: [],
      wishlist: [],
    });
  });

  it("renders the wishlist heading", () => {
    renderWishlistPage();

    expect(
      screen.getByRole("heading", { name: "Your Wishlist" }),
    ).toBeInTheDocument();
  });

  it("displays the empty wishlist message", () => {
    renderWishlistPage();

    expect(
      screen.getByRole("heading", {
        name: "Nothing saved just yet.",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(/When a piece catches your eye/i),
    ).toBeInTheDocument();
  });

  it("provides a link to the shop when the wishlist is empty", () => {
    renderWishlistPage();

    expect(
      screen.getByRole("link", {
        name: "Discover the collection",
      }),
    ).toHaveAttribute("href", "/shop");
  });

  it("displays zero pieces saved when the wishlist is empty", () => {
    renderWishlistPage();

    expect(
      screen.getByText("0 pieces saved"),
    ).toBeInTheDocument();
  });

  it("renders a saved product", () => {
    useStore.getState().addToWishlist(product.id);

    renderWishlistPage();

    expect(
      screen.getByRole("link", { name: product.name }),
    ).toBeInTheDocument();
  });

  it("displays the correct singular count for one saved product", () => {
    useStore.getState().addToWishlist(product.id);

    renderWishlistPage();

    expect(
      screen.getByText("1 piece saved"),
    ).toBeInTheDocument();
  });

  it("displays the correct plural count for multiple saved products", () => {
    useStore.getState().addToWishlist(product.id);
    useStore.getState().addToWishlist(secondProduct.id);

    renderWishlistPage();

    expect(
      screen.getByText("2 pieces saved"),
    ).toBeInTheDocument();
  });

  it("renders only products saved to the wishlist", () => {
    useStore.getState().addToWishlist(product.id);

    renderWishlistPage();

    expect(
      screen.getByRole("link", { name: product.name }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("link", { name: secondProduct.name }),
    ).not.toBeInTheDocument();
  });

  it("removes a product when its wishlist button is clicked", () => {
    useStore.getState().addToWishlist(product.id);

    renderWishlistPage();

    const wishlistButton = screen.getByRole("button", {
      name: `Remove ${product.name} from wishlist`,
    });

    fireEvent.click(wishlistButton);

    expect(
      screen.queryByRole("heading", { name: product.name }),
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole("heading", {
        name: "Nothing saved just yet.",
      }),
    ).toBeInTheDocument();
  });

  it("adds a saved product to the cart", () => {
    useStore.getState().addToWishlist(product.id);

    renderWishlistPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "ADD TO BAG",
      }),
    );

    expect(useStore.getState().cart).toEqual([
      {
        productId: product.id,
        quantity: 1,
      },
    ]);
  });
});