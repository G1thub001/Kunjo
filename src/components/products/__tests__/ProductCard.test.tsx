
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProductCard from "../ProductCard";
import { products } from "../../../data/products";
import { useStore } from "../../../store/useStore";

const product = products[0];

function renderProductCard() {
  return render(
    <MemoryRouter>
      <ProductCard product={product} />
    </MemoryRouter>,
  );
}

describe("ProductCard Component", () => {
  beforeEach(() => {
    useStore.setState({
      cart: [],
      wishlist: [],
    });
  });

  it("renders the product name", () => {
    renderProductCard();

    expect(
      screen.getByRole("link", {
        name: product.name,
      }),
    ).toBeInTheDocument();
  });

  it("renders the product image with descriptive alt text", () => {
    renderProductCard();

    const image = screen.getByRole("img", {
      name: product.name,
    });

    expect(image).toHaveAttribute("src", product.image);
    expect(image).toHaveAttribute("loading", "lazy");
  });

  it("displays the product category and price", () => {
    renderProductCard();

    expect(screen.getByText(product.category)).toBeInTheDocument();
    expect(screen.getByText(/€/)).toBeInTheDocument();
  });

  it("displays the product rating", () => {
    renderProductCard();

    expect(
      screen.getByText(`★ ${product.rating.toFixed(1)}`),
    ).toBeInTheDocument();
  });

  it("displays the product badge when available", () => {
    renderProductCard();

    if (product.badge) {
      expect(screen.getByText(product.badge)).toBeInTheDocument();
    } else {
      expect(screen.queryByText(/Bestseller|New Arrival|Editor's Pick|Limited Edit/))
        .not.toBeInTheDocument();
    }
  });

  it("adds the product to the cart when Add to Bag is clicked", () => {
    renderProductCard();

    fireEvent.click(
      screen.getByRole("button", { name: "ADD TO BAG" }),
    );

    expect(useStore.getState().cart).toEqual([
      { productId: product.id, quantity: 1 },
    ]);
  });

  it("adds the product to the wishlist when the wishlist button is clicked", () => {
    renderProductCard();

    fireEvent.click(
      screen.getByRole("button", {
        name: `Add ${product.name} to wishlist`,
      }),
    );

    expect(useStore.getState().wishlist).toContain(product.id);
  });

  it("updates wishlist accessibility state after clicking", () => {
    renderProductCard();

    const wishlistButton = screen.getByRole("button", {
      name: `Add ${product.name} to wishlist`,
    });

    fireEvent.click(wishlistButton);

    expect(wishlistButton).toHaveAttribute("aria-pressed", "true");
    expect(wishlistButton).toHaveAttribute(
      "aria-label",
      `Remove ${product.name} from wishlist`,
    );
  });

  it("links to the correct product detail page", () => {
    renderProductCard();

    expect(
      screen.getByRole("link", {
        name: `View ${product.name}`,
      }),
    ).toHaveAttribute("href", `/product/${product.id}`);
  });

  it("disables Add to Bag for out-of-stock products", () => {
    const outOfStockProduct = {
      ...product,
      inStock: false,
    };

    render(
      <MemoryRouter>
        <ProductCard product={outOfStockProduct} />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "OUT OF STOCK" }),
    ).toBeDisabled();
  });
});
