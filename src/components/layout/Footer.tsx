
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="brand footer-logo">
            <span className="brand-name">KUNJO</span>
            <span className="brand-subtitle">BY AURAGEMS</span>
          </Link>

          <p>
            Jewellery that celebrates individuality,
            timeless elegance, and meaningful moments.
          </p>
        </div>

        <div className="footer-column">
          <h3>Explore</h3>
          <Link to="/shop">Shop All</Link>
          <Link to="/collections">Collections</Link>
          <Link to="/our-story">Our Story</Link>
        </div>

        <div className="footer-column">
          <h3>Customer Care</h3>
          <Link to="/contact">Contact Us</Link>
          <Link to="/shipping">Shipping Information</Link>
          <Link to="/returns">Returns Policy</Link>
        </div>

        <div className="footer-column">
          <h3>Follow Along</h3>
          <p>Discover the world of KUNJO.</p>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            Instagram ↗
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} KUNJO by AuraGems.</p>
        <p>Crafted with intention.</p>
      </div>
    </footer>
  );
}
