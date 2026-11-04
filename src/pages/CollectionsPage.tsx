
import { Link } from "react-router-dom";
import { collections } from "../data/collections";

export default function CollectionsPage() {
  return (
    <section className="collections-page">
      <div className="collections-intro">
        <span>THE KUNJO EDIT</span>
        <h1>Collections</h1>
        <p>
          Thoughtfully curated pieces. Distinctive expressions of
          elegance. Discover the world of KUNJO.
        </p>
      </div>

      <div className="collections-grid">
        {collections.map((collection, index) => (
          <article
            className={`collection-card collection-card-${index + 1}`}
            key={collection.id}
          >
            <Link
              to={`/collections/${collection.slug}`}
              className="collection-image"
            >
              <img
                src={collection.image}
                alt={collection.name}
              />
            </Link>

            <div className="collection-content">
              <span>{collection.tagline}</span>
              <h2>{collection.name}</h2>
              <p>{collection.description}</p>

              <Link
                to={`/collections/${collection.slug}`}
                className="collection-link"
              >
                Explore collection →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
