
/**
 * KUNJO by AuraGems
 * Product catalogue query engine
 *
 * Responsibilities:
 * - Full-text product search
 * - Category filtering
 * - Price range filtering
 * - Availability filtering
 * - Product sorting
 *
 * This module is intentionally stateless.
 */

import { products } from "./products.js";

/**
 * Normalise text for consistent search.
 */
function normaliseText(value = "") {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Search across relevant product fields.
 */
function matchesSearch(product, query) {
  if (!query) return true;

  const searchableFields = [
    product.id,
    product.name,
    product.category,
    product.collection,
    product.description,
    product.badge
  ];

  const searchableText = normaliseText(
    searchableFields.filter(Boolean).join(" ")
  );

  const terms = normaliseText(query).split(/\s+/).filter(Boolean);

  return terms.every(term => searchableText.includes(term));
}

/**
 * Apply category filtering.
 */
function matchesCategory(product, category) {
  if (!category || category === "All") return true;

  return normaliseText(product.category) === normaliseText(category);
}

/**
 * Apply price filtering.
 */
function matchesPrice(product, minPrice, maxPrice) {
  return (
    product.price >= minPrice &&
    product.price <= maxPrice
  );
}

/**
 * Apply stock availability filtering.
 */
function matchesAvailability(product, inStockOnly) {
  if (!inStockOnly) return true;

  return product.inStock === true;
}

/**
 * Sorting strategies.
 */
const SORTERS = {
  featured: (a, b) => Number(b.featured) - Number(a.featured),

  priceLow: (a, b) => a.price - b.price,

  priceHigh: (a, b) => b.price - a.price,

  nameAsc: (a, b) => a.name.localeCompare(b.name),

  rating: (a, b) => b.rating - a.rating,

  newest: (a, b) => b.id.localeCompare(a.id)
};

/**
 * Validate and normalise incoming filters.
 */
function normaliseFilters(filters = {}) {
  const minPrice = Number(filters.minPrice ?? 0);
  const maxPrice = Number(filters.maxPrice ?? Infinity);

  return {
    query: String(filters.query ?? ""),
    category: filters.category ?? "All",
    minPrice: Number.isFinite(minPrice) ? Math.max(0, minPrice) : 0,
    maxPrice: maxPrice === Infinity
      ? Infinity
      : Number.isFinite(maxPrice) ? Math.max(0, maxPrice) : Infinity,
    inStockOnly: filters.inStockOnly === true,
    sortBy: SORTERS[filters.sortBy] ? filters.sortBy : "featured"
  };
}

/**
 * Retrieve products using combined filters and sorting.
 *
 * Example:
 *
 * getCatalog({
 *   query: "gold ring",
 *   category: "Rings",
 *   minPrice: 10000,
 *   maxPrice: 20000,
 *   inStockOnly: true,
 *   sortBy: "priceLow"
 * });
 */
export function getCatalog(filters = {}) {
  const options = normaliseFilters(filters);

  if (options.minPrice > options.maxPrice) {
    return [];
  }

  return products
    .filter(product =>
      matchesSearch(product, options.query) &&
      matchesCategory(product, options.category) &&
      matchesPrice(product, options.minPrice, options.maxPrice) &&
      matchesAvailability(product, options.inStockOnly)
    )
    .sort(SORTERS[options.sortBy]);
}

/**
 * Get the available price boundaries.
 */
export function getPriceBounds() {
  if (products.length === 0) {
    return { min: 0, max: 0 };
  }

  const prices = products.map(product => product.price);

  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}

/**
 * Get product counts grouped by category.
 */
export function getCategoryCounts() {
  return products.reduce((counts, product) => {
    counts[product.category] = (counts[product.category] || 0) + 1;

    return counts;
  }, {});
}

/**
 * Get the number of products matching a filter.
 */
export function getCatalogCount(filters = {}) {
  return getCatalog(filters).length;
}

/**
 * Get a paginated catalogue result.
 */
export function getCatalogPage(filters = {}, page = 1, pageSize = 6) {
  const safePage = Math.max(1, Math.floor(Number(page) || 1));
  const safePageSize = Math.max(1, Math.floor(Number(pageSize) || 6));

  const results = getCatalog(filters);
  const totalItems = results.length;
  const totalPages = Math.ceil(totalItems / safePageSize);

  const startIndex = (safePage - 1) * safePageSize;

  return {
    items: results.slice(startIndex, startIndex + safePageSize),
    pagination: {
      currentPage: safePage,
      pageSize: safePageSize,
      totalItems,
      totalPages,
      hasNextPage: safePage < totalPages,
      hasPreviousPage: safePage > 1 && totalPages > 0
    }
  };
}
