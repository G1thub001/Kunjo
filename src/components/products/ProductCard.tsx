
import { Link } from "react-router-dom";
import { formatPrice } from "../../data/products";
import { useStore } from "../../store/useStore";
import { selectIsWishlisted } from "../../store/selectors";
import type { Product } from "../../types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isWishlisted = useStore(selectIsWishlisted(product.id));

  return (
    <article className="product-card">
      <div className="product-card-image">
        <Link to={`/product/${product.id}`} aria-label={`View ${product.name}`}>
          <img src={product.image} alt={product.name} loading="lazy" />
        </Link>

        {product.badge && (
          <span className="product-badge">{product.badge}</span>
        )}

        <button
          type="button"
          className={`wishlist-button ${isWishlisted ? "is-active" : ""}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label={
            isWishlisted
              ? `Remove ${product.name} from wishlist`
              : `Add ${product.name} to wishlist`
          }
          aria-pressed={isWishlisted}
        >
          {isWishlisted ? "♥" : "♡"}
        </button>

        <button
          type="button"
          className="quick-add-button"
          disabled={!product.inStock}
          onClick={() => addToCart(product.id)}
        >
          {product.inStock ? "ADD TO BAG" : "OUT OF STOCK"}
        </button>
      </div>

      <div className="product-card-details">
        <span className="product-category">{product.category}</span>

        <Link
          to={`/product/${product.id}`}
          className="product-name"
        >
          {product.name}
        </Link>

        <div className="product-card-meta">
          <span className="product-price">
            {formatPrice(product.price, product.currency)}
          </span>

          <span className="product-rating">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}
