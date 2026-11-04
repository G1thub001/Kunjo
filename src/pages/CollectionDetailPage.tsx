
import { Link, Navigate, useParams } from "react-router-dom";
import { collections } from "../data/collections";
import { products } from "../data/products";
import ProductCard from "../components/products/ProductCard";

export default function CollectionDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const collection = collections.find(
    (item) => item.slug === slug,
  );

  if (!collection) {
    return <Navigate to="/collections" replace />;
  }

  const collectionProducts = products.filter(
    (product) => product.collection === collection.name,
  );

  return (
    <main className="collection-detail-page">
      <nav className="collection-breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/collections">Collections</Link>
        <span>/</span>
        <span>{collection.name}</span>
      </nav>

      <section className="collection-detail-hero">
        <div className="collection-detail-image">
          <img
            src={collection.image}
            alt={collection.name}
          />
        </div>

        <div className="collection-detail-copy">
          <span>THE KUNJO EDIT</span>
          <h1>{collection.name}</h1>
          <h3>{collection.tagline}</h3>
          <p>{collection.description}</p>

          <a href="#collection-products">
            Discover the collection
          </a>
        </div>
      </section>

      <section
        className="collection-products-section"
        id="collection-products"
      >
        <div className="collection-products-heading">
          <div>
            <span>CURATED FOR YOU</span>
            <h2>{collection.name}</h2>
          </div>

          <p>
            {collectionProducts.length}{" "}
            {collectionProducts.length === 1
              ? "piece"
              : "pieces"}
          </p>
        </div>

        {collectionProducts.length > 0 ? (
          <div className="product-grid">
            {collectionProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="collection-empty-state">
            <h3>Something beautiful is coming.</h3>
            <p>
              We're currently curating pieces for this
              collection. Please check back soon.
            </p>
          </div>
        )}
      </section>

      <div className="back-to-collections">
        <Link to="/collections">
          ← Explore all collections
        </Link>
      </div>
    </main>
  );
}
