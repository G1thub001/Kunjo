
import type {
  CatalogFilters,
  PaginationResult,
  Product,
} from "../types/product";

import { products } from "../data/products";

const DEFAULT_PAGE_SIZE = 6;

export function getAllProducts(): Product[] {
  return [...products];
}

export function getProductBySlugOrId(identifier: string): Product | undefined {
  return products.find(
    (product) =>
      product.id === identifier ||
      product.name.toLowerCase().replace(/\s+/g, "-") ===
        identifier.toLowerCase(),
  );
}

export function filterProducts(
  items: Product[],
  filters: CatalogFilters = {},
): Product[] {
  const {
    query = "",
    category = "All",
    minPrice,
    maxPrice,
    inStockOnly = false,
  } = filters;

  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((product) => {
    const matchesQuery =
      !normalizedQuery ||
      [
        product.name,
        product.category,
        product.collection,
        product.description,
      ].some((value) => value.toLowerCase().includes(normalizedQuery));

    const matchesCategory =
      category === "All" || product.category === category;

    const matchesMinPrice =
      minPrice == null || product.price >= minPrice;

    const matchesMaxPrice =
      maxPrice == null || product.price <= maxPrice;

    const matchesStock = !inStockOnly || product.inStock;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesStock
    );
  });
}

export function sortProducts(
  items: Product[],
  sortBy: CatalogFilters["sortBy"] = "featured",
): Product[] {
  const sorted = [...items];

  switch (sortBy) {
    case "priceLow":
      return sorted.sort((a, b) => a.price - b.price);

    case "priceHigh":
      return sorted.sort((a, b) => b.price - a.price);

    case "nameAsc":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));

    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);

    case "featured":
    default:
      return sorted.sort(
        (a, b) => Number(b.featured) - Number(a.featured),
      );
  }
}

export function paginateProducts(
  items: Product[],
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginationResult<Product> {
  const safePageSize = Math.max(1, Math.floor(pageSize));
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / safePageSize);
  const currentPage =
    totalPages === 0
      ? 1
      : Math.min(Math.max(1, Math.floor(page)), totalPages);

  const startIndex = (currentPage - 1) * safePageSize;

  return {
    items: items.slice(startIndex, startIndex + safePageSize),
    pagination: {
      currentPage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    },
  };
}

export function getCatalogPage(
  filters: CatalogFilters = {},
  page = 1,
  pageSize = DEFAULT_PAGE_SIZE,
): PaginationResult<Product> {
  const filtered = filterProducts(products, filters);
  const sorted = sortProducts(filtered, filters.sortBy);

  return paginateProducts(sorted, page, pageSize);
}
