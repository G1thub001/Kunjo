
import { describe, it, expect } from "vitest";

import { products } from "../../data/products";

import {
  getAllProducts,
  getProductBySlugOrId,
  filterProducts,
  sortProducts,
  paginateProducts,
  getCatalogPage,
} from "../catalogService";

describe("catalogService", () => {
  describe("getAllProducts", () => {
    it("returns all products", () => {
      expect(getAllProducts()).toHaveLength(products.length);
    });

    it("returns a copy rather than the original products array", () => {
      expect(getAllProducts()).not.toBe(products);
    });
  });

  describe("getProductBySlugOrId", () => {
    it("finds a product using its ID", () => {
      expect(getProductBySlugOrId(products[0].id)).toEqual(products[0]);
    });

    it("finds a product using its slug", () => {
      expect(getProductBySlugOrId("the-bluebell-earrings")).toEqual(
        products[0],
      );
    });

    it("matches slugs without case sensitivity", () => {
      expect(getProductBySlugOrId("THE-BLUEBELL-EARRINGS")).toEqual(
        products[0],
      );
    });

    it("returns undefined for an unknown identifier", () => {
      expect(getProductBySlugOrId("non-existent-product")).toBeUndefined();
    });
  });

  describe("filterProducts", () => {
    it("returns all products when no filters are supplied", () => {
      expect(filterProducts(products)).toHaveLength(products.length);
    });

    it("filters products by category", () => {
      const result = filterProducts(products, {
        category: "Earrings",
      });

      expect(result.every((product) => product.category === "Earrings")).toBe(
        true,
      );
    });

    it("filters products using a search query", () => {
      const result = filterProducts(products, {
        query: "bluebell",
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("The Bluebell Earrings");
    });

    it("matches searches against product descriptions", () => {
      const target = products[0];
      const searchTerm = target.description.split(" ")[0];

      expect(
        filterProducts(products, { query: searchTerm }),
      ).toContainEqual(target);
    });

    it("ignores leading and trailing spaces in search queries", () => {
      expect(
        filterProducts(products, { query: "  bluebell  " }),
      ).toHaveLength(1);
    });

    it("filters products using a minimum price", () => {
      const result = filterProducts(products, {
        minPrice: 150,
      });

      expect(result.every((product) => product.price >= 150)).toBe(true);
    });

    it("filters products using a maximum price", () => {
      const result = filterProducts(products, {
        maxPrice: 150,
      });

      expect(result.every((product) => product.price <= 150)).toBe(true);
    });

    it("filters products using both minimum and maximum prices", () => {
      const result = filterProducts(products, {
        minPrice: 130,
        maxPrice: 170,
      });

      expect(
        result.every(
          (product) => product.price >= 130 && product.price <= 170,
        ),
      ).toBe(true);
    });

    it("filters out products that are out of stock when requested", () => {
      const result = filterProducts(products, {
        inStockOnly: true,
      });

      expect(result.every((product) => product.inStock)).toBe(true);
    });

    it("returns no products when the filters have no matches", () => {
      expect(
        filterProducts(products, {
          minPrice: 10000,
        }),
      ).toHaveLength(0);
    });

    it("supports combining multiple filters", () => {
      const result = filterProducts(products, {
        category: "Rings",
        minPrice: 150,
        maxPrice: 200,
        inStockOnly: true,
      });

      expect(
        result.every(
          (product) =>
            product.category === "Rings" &&
            product.price >= 150 &&
            product.price <= 200 &&
            product.inStock,
        ),
      ).toBe(true);
    });
  });

  describe("sortProducts", () => {
    it("sorts products from lowest to highest price", () => {
      const result = sortProducts(products, "priceLow");

      expect(result[0].price).toBeLessThanOrEqual(result[1].price);
    });

    it("sorts products from highest to lowest price", () => {
      const result = sortProducts(products, "priceHigh");

      expect(result[0].price).toBeGreaterThanOrEqual(result[1].price);
    });

    it("sorts products alphabetically by name", () => {
      const result = sortProducts(products, "nameAsc");
      const names = result.map((product) => product.name);

      expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it("sorts products by highest rating", () => {
      const result = sortProducts(products, "rating");

      expect(result[0].rating).toBeGreaterThanOrEqual(result[1].rating);
    });

    it("sorts featured products first", () => {
      const result = sortProducts(products, "featured");

      expect(result[0].featured).toBe(true);
    });

    it("uses featured sorting by default", () => {
      const result = sortProducts(products);

      expect(result[0].featured).toBe(true);
    });

    it("does not mutate the original products array", () => {
      const original = [...products];

      sortProducts(products, "priceLow");

      expect(products).toEqual(original);
    });
  });

  describe("paginateProducts", () => {
    it("returns the requested page of products", () => {
      const result = paginateProducts(products, 1, 2);

      expect(result.items).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
    });

    it("calculates pagination metadata correctly", () => {
      const result = paginateProducts(products, 1, 2);

      expect(result.pagination).toEqual({
        currentPage: 1,
        pageSize: 2,
        totalItems: products.length,
        totalPages: Math.ceil(products.length / 2),
        hasNextPage: true,
        hasPreviousPage: false,
      });
    });

    it("returns the correct products on the second page", () => {
      const result = paginateProducts(products, 2, 2);

      expect(result.items).toEqual(products.slice(2, 4));
      expect(result.pagination.hasPreviousPage).toBe(true);
    });

    it("returns the remaining products on the last page", () => {
      const result = paginateProducts(products, 3, 2);

      expect(result.items).toEqual(products.slice(4, 6));
      expect(result.pagination.hasNextPage).toBe(false);
    });

    it("uses the default page and page size", () => {
      const result = paginateProducts(products);

      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(6);
      expect(result.items).toHaveLength(products.length);
    });

    it("clamps a page number below one to page one", () => {
      const result = paginateProducts(products, 0, 2);

      expect(result.pagination.currentPage).toBe(1);
    });

    it("clamps a page number above the available pages to the last page", () => {
      const result = paginateProducts(products, 100, 2);

      expect(result.pagination.currentPage).toBe(3);
      expect(result.pagination.hasNextPage).toBe(false);
    });

    it("floors decimal page numbers", () => {
      const result = paginateProducts(products, 2.8, 2);

      expect(result.pagination.currentPage).toBe(2);
    });

    it("floors decimal page sizes", () => {
      const result = paginateProducts(products, 1, 2.8);

      expect(result.pagination.pageSize).toBe(2);
      expect(result.items).toHaveLength(2);
    });

    it("uses a minimum page size of one when page size is zero", () => {
      const result = paginateProducts(products, 1, 0);

      expect(result.pagination.pageSize).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it("uses a minimum page size of one for negative page sizes", () => {
      const result = paginateProducts(products, 1, -5);

      expect(result.pagination.pageSize).toBe(1);
      expect(result.items).toHaveLength(1);
    });

    it("handles an empty product list", () => {
      const result = paginateProducts([], 1, 2);

      expect(result.items).toEqual([]);
      expect(result.pagination).toEqual({
        currentPage: 1,
        pageSize: 2,
        totalItems: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
    });
  });

  describe("getCatalogPage", () => {
    it("returns the first page of the catalog", () => {
      const result = getCatalogPage({}, 1, 2);

      expect(result.items).toHaveLength(2);
      expect(result.pagination.currentPage).toBe(1);
    });

    it("applies filters before pagination", () => {
      const result = getCatalogPage(
        { category: "Rings" },
        1,
        2,
      );

      expect(
        result.items.every((product) => product.category === "Rings"),
      ).toBe(true);
    });

    it("applies sorting before pagination", () => {
      const result = getCatalogPage(
        { sortBy: "priceLow" },
        1,
        2,
      );

      expect(result.items[0].price).toBeLessThanOrEqual(
        result.items[1].price,
      );
    });

    it("combines filtering, sorting, and pagination", () => {
      const result = getCatalogPage(
        {
          category: "Rings",
          sortBy: "priceHigh",
        },
        1,
        1,
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].category).toBe("Rings");
      expect(result.pagination.pageSize).toBe(1);
    });

    it("returns an empty page when no products match", () => {
      const result = getCatalogPage(
        { minPrice: 10000 },
        1,
        2,
      );

      expect(result.items).toEqual([]);
      expect(result.pagination.totalItems).toBe(0);
    });

    it("uses default filters, page, and page size", () => {
      const result = getCatalogPage();

      expect(result.pagination.currentPage).toBe(1);
      expect(result.pagination.pageSize).toBe(6);
      expect(result.items).toHaveLength(products.length);
    });
  });
});
