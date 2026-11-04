
export default function HomePage() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <span className="eyebrow">THE ART OF TIMELESS BEAUTY</span>

          <h1>
            Elegance is
            <br />
            in the details.
          </h1>

          <p>
            Discover thoughtfully curated jewellery that
            celebrates individuality, beauty, and the moments
            that make life meaningful.
          </p>

          <a href="/shop" className="primary-button">
            EXPLORE THE COLLECTION
          </a>
        </div>

        <div className="hero-image">
          <img
            src="/images/imgg.png"
            alt="KUNJO jewellery collection"
          />
        </div>
      </div>
    </section>
  );
}
