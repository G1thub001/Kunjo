import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CartPage from "../CartPage";
import { products, formatPrice } from "../../data/products";
import { useStore } from "../../store/useStore";

const product = products[0];
const secondProduct = products[1];

function renderCartPage() {
  return render(
    <MemoryRouter>
      <CartPage />
    </MemoryRouter>,
  );
}

describe("CartPage Component", () => {
  beforeEach(() => {
    localStorage.clear();

    useStore.setState({
      cart: [],
      wishlist: [],
    });
  });

  it("displays the empty cart state when no products exist", () => {
    renderCartPage();

    expect(
      screen.getByRole("heading", {
        name: "Your bag is waiting.",
      }),
    ).toBeInTheDocument();
  });

  it("provides a link to explore the collection", () => {
    renderCartPage();

    expect(
      screen.getByRole("link", {
        name: "Explore the collection",
      }),
    ).toHaveAttribute("href", "/shop");
  });

  it("renders products added to the cart", () => {
    useStore.getState().addToCart(product.id, 2);

    renderCartPage();

    expect(
      screen.getByRole("heading", {
        name: product.name,
      }),
    ).toBeInTheDocument();

    expect(screen.getByText(product.collection)).toBeInTheDocument();
  });

  it("displays the correct quantity", () => {
    useStore.getState().addToCart(product.id, 3);

    renderCartPage();

    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("calculates the subtotal correctly", () => {
    useStore.getState().addToCart(product.id, 2);
    useStore.getState().addToCart(secondProduct.id, 1);

    renderCartPage();

    const expectedSubtotal =
      product.price * 2 + secondProduct.price;

    const subtotalElements = screen.getAllByText(
      formatPrice(expectedSubtotal),
    );

    expect(subtotalElements).toHaveLength(2);
  });

  it("increases product quantity when the plus button is clicked", () => {
    useStore.getState().addToCart(product.id, 1);

    renderCartPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: `Increase ${product.name} quantity`,
      }),
    );

    expect(useStore.getState().cart[0].quantity).toBe(2);
  });

  it("decreases product quantity when the minus button is clicked", () => {
    useStore.getState().addToCart(product.id, 2);

    renderCartPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: `Decrease ${product.name} quantity`,
      }),
    );

    expect(useStore.getState().cart[0].quantity).toBe(1);
  });

  it("removes a product when Remove is clicked", () => {
    useStore.getState().addToCart(product.id);

    renderCartPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove",
      }),
    );

    expect(useStore.getState().cart).toHaveLength(0);
  });

  it("clears all products when Clear bag is clicked", () => {
    useStore.getState().addToCart(product.id);
    useStore.getState().addToCart(secondProduct.id);

    renderCartPage();

    fireEvent.click(
      screen.getByRole("button", {
        name: "Clear bag",
      }),
    );

    expect(useStore.getState().cart).toHaveLength(0);
  });

  it("keeps checkout disabled while payment functionality is unavailable", () => {
    useStore.getState().addToCart(product.id);

    renderCartPage();

    expect(
      screen.getByRole("button", {
        name: "Checkout coming soon",
      }),
    ).toBeDisabled();
  });
});