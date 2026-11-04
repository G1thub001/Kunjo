import type { Product, ProductCategory } from "../types/product";

export const products: Product[] = [
  {
    id: "AG-001",
    name: "The Bluebell Earrings",
    category: "Earrings",
    collection: "The Classics",
    description:
      "Elegant gemstone earrings designed for effortless sophistication.",
    price: 129,
    currency: "EUR",
    image: "/images/beimg.png",
    badge: "Bestseller",
    featured: true,
    inStock: true,
    rating: 4.8,
  },
  {
    id: "AG-002",
    name: "The Solstice Ring",
    category: "Rings",
    collection: "The Signatures",
    description:
      "A refined statement piece with a contemporary finish.",
    price: 189,
    currency: "EUR",
    image: "/images/beimg3.png",
    badge: "New Arrival",
    featured: true,
    inStock: true,
    rating: 4.9,
  },
  {
    id: "AG-003",
    name: "The Azure Collection",
    category: "Gemstones",
    collection: "The Gem Edit",
    description:
      "A distinctive gemstone selection inspired by colour and character.",
    price: 149,
    currency: "EUR",
    image: "/images/cac.png",
    badge: "Editor's Pick",
    featured: true,
    inStock: true,
    rating: 4.7,
  },
  {
    id: "AG-004",
    name: "The Golden Hour",
    category: "Rings",
    collection: "The Signatures",
    description:
      "Warm golden tones meet delicate jewellery design.",
    price: 169,
    currency: "EUR",
    image: "/images/imgg.png",
    featured: false,
    inStock: true,
    rating: 4.6,
  },
  {
    id: "AG-005",
    name: "The Amber Muse",
    category: "Gemstones",
    collection: "The Gem Edit",
    description:
      "An expressive gemstone piece with rich amber character.",
    price: 159,
    currency: "EUR",
    image: "/images/beimg2.png",
    badge: "Limited Edit",
    featured: false,
    inStock: true,
    rating: 4.8,
  },
];

export const categories: ("All" | ProductCategory)[] = [
  "All",
  "Earrings",
  "Rings",
  "Gemstones",
];

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function formatPrice(
  price: number,
  currency: string = "EUR",
): string {
  return new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(price);
}