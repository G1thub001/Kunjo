
export type ProductCategory = 
  | "Earrings"
  | "Rings"
  | "Gemstones";

export type ProductBadge =
  | "Bestseller"
  | "New Arrival"
  | "Editor's Pick"
  | "Limited Edit";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  collection: string;
  description: string;
  price: number;
  currency: "EUR";
  image: string;
  badge?: ProductBadge | null;
  featured: boolean;
  inStock: boolean;
  rating: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CartLineItem extends Product {
  quantity: number;
  lineTotal: number;
}

export interface CatalogFilters {
  query?: string;
  category?: "All" | ProductCategory;
  minPrice?: number | null;
  maxPrice?: number | null;
  inStockOnly?: boolean;
  sortBy?:
    | "featured"
    | "priceLow"
    | "priceHigh"
    | "nameAsc"
    | "rating";
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
