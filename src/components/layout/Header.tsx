
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store/useStore";
import {
  selectCartCount,
  selectWishlistCount,
} from "../../store/selectors";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const cartCount = useStore(selectCartCount);
  const wishlistCount = useStore(selectWishlistCount);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = searchQuery.trim();

    if (!query) return;

    navigate(`/shop?q=${encodeURIComponent(query)}`);
    setSearchQuery("");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <Link
          to="/"
          className="brand"
          aria-label="KUNJO by AuraGems home"
          onClick={closeMenu}
        >
          <span className="brand-name">KUNJO</span>
          <span className="brand-subtitle">BY AURAGEMS</span>
        </Link>

        <nav
          className={`main-navigation ${menuOpen ? "is-open" : ""}`}
          aria-label="Main navigation"
        >
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/shop" onClick={closeMenu}>Shop</Link>
          <Link to="/collections" onClick={closeMenu}>Collections</Link>
          <Link to="/our-story" onClick={closeMenu}>Our Story</Link>
        </nav>

        <div className="header-actions">
          <form className="header-search" onSubmit={handleSearch}>
            <input
              type="search"
              placeholder="Search pieces..."
              aria-label="Search jewellery"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
            <button type="submit" aria-label="Submit search">
              ⌕
            </button>
          </form>

          <Link
            to="/wishlist"
            className="header-icon-link"
            aria-label={`Wishlist, ${wishlistCount} items`}
          >
            <span aria-hidden="true">♡</span>
            {wishlistCount > 0 && (
              <span className="header-count">{wishlistCount}</span>
            )}
          </Link>

          <Link
            to="/cart"
            className="header-icon-link"
            aria-label={`Shopping bag, ${cartCount} items`}
          >
            <span aria-hidden="true">♧</span>
            {cartCount > 0 && (
              <span className="header-count">{cartCount}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
