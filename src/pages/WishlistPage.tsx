
import { Link } from "react-router-dom";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";
import { useStore } from "../store/useStore";

export default function WishlistPage() {
  const wishlist = useStore((state) => state.wishlist);

  const savedProducts = products.filter((product) =>
    wishlist.includes(product.id),
  );

  return (
    <section className="wishlist-page">
      <div className="wishlist-heading">
        <span className="wishlist-eyebrow">YOUR PERSONAL COLLECTION</span>
        <h1>Your Wishlist</h1>
        <p>
          A collection of pieces you've fallen in love with.
        </p>
        <span className="wishlist-count">
          {savedProducts.length}{" "}
          {savedProducts.length === 1 ? "piece" : "pieces"} saved
        </span>
      </div>

      {savedProducts.length === 0 ? (
        <div className="wishlist-empty">
          <span className="wishlist-heart">♡</span>
          <h2>Nothing saved just yet.</h2>
          <p>
            When a piece catches your eye, save it here and come back
            whenever you're ready.
          </p>
          <Link to="/shop" className="primary-button">
            Discover the collection
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {savedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
