
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductById } from "../data/products";
import { formatPrice } from "../data/products";
import { useStore } from "../store/useStore";
import { selectIsWishlisted } from "../store/selectors";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProductById(id) : undefined;

  const [quantity, setQuantity] = useState(1);

  const addToCart = useStore((state) => state.addToCart);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const isWishlisted = useStore(
    product ? selectIsWishlisted(product.id) : () => false,
  );

  if (!product) {
    return (
      <section className="product-not-found">
        <h1>Piece not found</h1>
        <p>We couldn't find the jewellery piece you're looking for.</p>
        <Link to="/shop" className="primary-button">
          Return to the collection
        </Link>
      </section>
    );
  }

  return (
    <section className="product-detail-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-detail-info">
          <span className="product-detail-category">
            {product.collection}
          </span>

          <h1>{product.name}</h1>

          <p className="product-detail-rating">
            ★ {product.rating.toFixed(1)} / 5
          </p>

          <p className="product-detail-price">
            {formatPrice(product.price, product.currency)}
          </p>

          <p className="product-detail-description">
            {product.description}
          </p>

          <div className="product-detail-stock">
            <span className={product.inStock ? "stock-available" : "stock-unavailable"}>
              {product.inStock ? "In stock" : "Currently unavailable"}
            </span>
          </div>

          {product.inStock && (
            <>
              <div className="product-detail-actions">
                <div className="quantity-selector">
                  <button
                    type="button"
                    onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={() => setQuantity((current) => current + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="primary-button product-add-button"
                  onClick={() => addToCart(product.id, quantity)}
                >
                  Add to bag
                </button>
              </div>
            </>
          )}

          <button
            type="button"
            className="product-wishlist-action"
            onClick={() => toggleWishlist(product.id)}
          >
            {isWishlisted ? "♥ Remove from wishlist" : "♡ Add to wishlist"}
          </button>

          <div className="product-detail-meta">
            <p>Product reference: {product.id}</p>
            <p>Category: {product.category}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
