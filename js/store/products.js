
/**
 * KUNJO by AuraGems
 * Product catalogue
 *
 * Prototype catalogue data.
 * Prices and stock values are illustrative.
 */

export const products = [
  {
    id: "AG-001",
    name: "The Bluebell Earrings",
    category: "Earrings",
    collection: "The Classics",
    description: "Elegant gemstone earrings designed for effortless sophistication.",
    price: 12500,
    currency: "KES",
    image: "images/beimg.png",
    badge: "Bestseller",
    featured: true,
    inStock: true,
    rating: 4.8
  },
  {
    id: "AG-002",
    name: "The Solstice Ring",
    category: "Rings",
    collection: "The Signatures",
    description: "A refined statement piece with a beautiful contemporary finish.",
    price: 18900,
    currency: "KES",
    image: "images/beimg3.png",
    badge: "New Arrival",
    featured: true,
    inStock: true,
    rating: 4.9
  },
  {
    id: "AG-003",
    name: "The Azure Collection",
    category: "Gemstones",
    collection: "The Gem Edit",
    description: "A distinctive gemstone selection inspired by colour and character.",
    price: 15700,
    currency: "KES",
    image: "images/cac.png",
    badge: "Editor's Pick",
    featured: true,
    inStock: true,
    rating: 4.7
  },
  {
    id: "AG-004",
    name: "The Golden Hour",
    category: "Rings",
    collection: "The Signatures",
    description: "Warm golden tones meet delicate jewellery craftsmanship.",
    price: 14200,
    currency: "KES",
    image: "images/imgg.png",
    badge: null,
    featured: false,
    inStock: true,
    rating: 4.6
  },
  {
    id: "AG-005",
    name: "The Amber Muse",
    category: "Gemstones",
    collection: "The Gem Edit",
    description: "An expressive gemstone piece with rich amber character.",
    price: 16900,
    currency: "KES",
    image: "images/beimg2.png",
    badge: "Limited Edit",
    featured: false,
    inStock: true,
    rating: 4.8
  }
];

export const categories = [
  "All",
  "Earrings",
  "Rings",
  "Gemstones"
];

export function getProductById(id) {
  return products.find(product => product.id === id) ?? null;
}

export function getFeaturedProducts() {
  return products.filter(product => product.featured);
}

export function formatPrice(price, currency = "KES") {
  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(price);
}
