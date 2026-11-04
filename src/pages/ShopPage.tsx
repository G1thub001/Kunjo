
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/products/ProductCard";
import { getCatalogPage } from "../services/catalogService";
import type { CatalogFilters } from "../types/product";

const validCategories = ["All", "Earrings", "Rings", "Gemstones"];

const validSortOptions = [
  "featured",
  "priceLow",
  "priceHigh",
  "nameAsc",
  "rating",
];

function readFilters(params: URLSearchParams): CatalogFilters {
  const category = params.get("category");
  const sortBy = params.get("sortBy");
  const minPrice = params.get("minPrice");
  const maxPrice = params.get("maxPrice");

  return {
    query: params.get("q") ?? "",
    category: validCategories.includes(category ?? "")
      ? (category as CatalogFilters["category"])
      : "All",
    sortBy: validSortOptions.includes(sortBy ?? "")
      ? (sortBy as CatalogFilters["sortBy"])
      : "featured",
    minPrice:
      minPrice !== null && minPrice !== ""
        ? Math.max(0, Number(minPrice))
        : null,
    maxPrice:
      maxPrice !== null && maxPrice !== ""
        ? Math.max(0, Number(maxPrice))
        : null,
    inStockOnly: params.get("inStockOnly") === "true",
  };
}

function writeFilters(
  params: URLSearchParams,
  filters: CatalogFilters,
): URLSearchParams {
  const updated = new URLSearchParams(params);

  const values: Record<string, string | null> = {
    q: filters.query?.trim() || null,
    category:
      filters.category && filters.category !== "All"
        ? filters.category
        : null,
    sortBy:
      filters.sortBy && filters.sortBy !== "featured"
        ? filters.sortBy
        : null,
    minPrice:
      filters.minPrice !== null && filters.minPrice !== undefined
        ? String(filters.minPrice)
        : null,
    maxPrice:
      filters.maxPrice !== null && filters.maxPrice !== undefined
        ? String(filters.maxPrice)
        : null,
    inStockOnly: filters.inStockOnly ? "true" : null,
  };

  Object.entries(values).forEach(([key, value]) => {
    if (value === null) {
      updated.delete(key);
    } else {
      updated.set(key, value);
    }
  });

  return updated;
}

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState<CatalogFilters>(() =>
    readFilters(searchParams),
  );

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("q") ?? "",
  );

  const [page, setPage] = useState(1);

  // Restore filters when the URL changes, including browser Back/Forward.
  useEffect(() => {
    const restoredFilters = readFilters(searchParams);

    setFilters(restoredFilters);
    setSearchTerm(restoredFilters.query ?? "");
    setPage(1);
  }, [searchParams]);

  // Debounce search input and synchronise it with the URL.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((current) => {
        if (current.query === searchTerm) return current;

        const updated = { ...current, query: searchTerm };

        setSearchParams(
          (params) => writeFilters(params, updated),
          { replace: true },
        );

        return updated;
      });

      setPage(1);
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchTerm, setSearchParams]);

  const catalog = useMemo(
    () => getCatalogPage(filters, page, 6),
    [filters, page],
  );

  function updateFilters(updates: Partial<CatalogFilters>) {
    setFilters((current) => {
      const updated = { ...current, ...updates };

      setSearchParams(
        (params) => writeFilters(params, updated),
        { replace: true },
      );

      return updated;
    });

    setPage(1);
  }

  function clearFilters() {
    const defaults: CatalogFilters = {
      query: "",
      category: "All",
      sortBy: "featured",
      minPrice: null,
      maxPrice: null,
      inStockOnly: false,
    };

    setFilters(defaults);
    setSearchTerm("");
    setPage(1);

    setSearchParams(
      (params) => writeFilters(params, defaults),
      { replace: true },
    );
  }

  return (
    <section className="shop-page">
      <div className="shop-heading">
        <span className="eyebrow">THE KUNJO COLLECTION</span>
        <h1>Discover your signature.</h1>
        <p>
          Explore thoughtfully selected pieces designed to
          become part of your story.
        </p>
      </div>

      <div className="shop-toolbar">
        <div className="shop-search">
          <input
            type="search"
            placeholder="Search jewellery..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search products"
          />
        </div>

        <div className="shop-controls">
          <label>
            Category
            <select
              value={filters.category ?? "All"}
              onChange={(event) =>
                updateFilters({
                  category: event.target.value as CatalogFilters["category"],
                })
              }
            >
              <option value="All">All pieces</option>
              <option value="Earrings">Earrings</option>
              <option value="Rings">Rings</option>
              <option value="Gemstones">Gemstones</option>
            </select>
          </label>

          <label>
            Sort by
            <select
              value={filters.sortBy ?? "featured"}
              onChange={(event) =>
                updateFilters({
                  sortBy: event.target.value as CatalogFilters["sortBy"],
                })
              }
            >
              <option value="featured">Featured</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="nameAsc">Name: A to Z</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>
        </div>
      </div>

      <div className="shop-advanced-filters">
        <div className="price-filter">
          <span>PRICE RANGE (€)</span>

          <div className="price-inputs">
            <input
              type="number"
              min="0"
              placeholder="Min"
              aria-label="Minimum price"
              value={filters.minPrice ?? ""}
              onChange={(event) =>
                updateFilters({
                  minPrice:
                    event.target.value === ""
                      ? null
                      : Math.max(0, Number(event.target.value)),
                })
              }
            />

            <span>—</span>

            <input
              type="number"
              min="0"
              placeholder="Max"
              aria-label="Maximum price"
              value={filters.maxPrice ?? ""}
              onChange={(event) =>
                updateFilters({
                  maxPrice:
                    event.target.value === ""
                      ? null
                      : Math.max(0, Number(event.target.value)),
                })
              }
            />
          </div>
        </div>

        <label className="stock-filter">
          <input
            type="checkbox"
            checked={filters.inStockOnly ?? false}
            onChange={(event) =>
              updateFilters({ inStockOnly: event.target.checked })
            }
          />
          In-stock pieces only
        </label>

        <button
          type="button"
          className="clear-filters-button"
          onClick={clearFilters}
        >
          Clear all filters
        </button>
      </div>

      <div className="shop-results-info">
        <span>{catalog.pagination.totalItems} pieces</span>
        <span>
          Showing page {catalog.pagination.currentPage} of{" "}
          {catalog.pagination.totalPages || 1}
        </span>
      </div>

      {catalog.items.length > 0 ? (
        <div className="product-grid">
          {catalog.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="empty-catalog">
          <h2>No pieces found</h2>
          <p>
            Try changing your search, price range or selected filters.
          </p>
          <button type="button" onClick={clearFilters}>
            CLEAR FILTERS
          </button>
        </div>
      )}

      {catalog.pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={!catalog.pagination.hasPreviousPage}
            onClick={() => setPage((current) => current - 1)}
          >
            Previous
          </button>

          <span>
            {catalog.pagination.currentPage} /{" "}
            {catalog.pagination.totalPages}
          </span>

          <button
            type="button"
            disabled={!catalog.pagination.hasNextPage}
            onClick={() => setPage((current) => current + 1)}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
