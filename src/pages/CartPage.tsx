import { Link } from "react-router-dom";
import { products, formatPrice } from "../data/products";
import { useStore } from "../store/useStore";

export default function CartPage() {
  const cart = useStore((state) => state.cart);

  const items = cart.flatMap((item) => {
    const product = products.find(
      (product) => product.id === item.productId,
    );

    if (!product) return [];

    return [{
      ...product,
      quantity: item.quantity,
      lineTotal: product.price * item.quantity,
    }];
  });

  const subtotal = items.reduce(
    (total, item) => total + item.lineTotal,
    0,
  );

  const updateQuantity = useStore((state) => state.updateQuantity);
  const removeFromCart = useStore((state) => state.removeFromCart);
  const clearCart = useStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <section className="cart-page">
        <div className="cart-empty">
          <span className="cart-eyebrow">YOUR KUNJO BAG</span>
          <h1>Your bag is waiting.</h1>
          <p>Discover something beautiful to make it yours.</p>
          <Link to="/shop" className="primary-button">
            Explore the collection
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page">
      <div className="cart-heading">
        <div>
          <span className="cart-eyebrow">YOUR KUNJO BAG</span>
          <h1>Shopping Bag</h1>
          <p>
            {items.reduce((total, item) => total + item.quantity, 0)} items
            selected
          </p>
        </div>

        <button
          type="button"
          className="cart-clear-button"
          onClick={clearCart}
        >
          Clear bag
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {items.map((item) => (
            <article className="cart-item" key={item.id}>
              <Link to={`/product/${item.id}`} className="cart-item-image">
                <img src={item.image} alt={item.name} />
              </Link>

              <div className="cart-item-details">
                <span>{item.collection}</span>
                <h2>
                  <Link to={`/product/${item.id}`}>{item.name}</Link>
                </h2>
                <p>{formatPrice(item.price, item.currency)}</p>

                <div className="cart-item-actions">
                  <div className="quantity-selector">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name} quantity`}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity - 1)
                      }
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.name} quantity`}
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    className="cart-remove-button"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="cart-item-total">
                {formatPrice(item.lineTotal, item.currency)}
              </div>
            </article>
          ))}
        </div>

        <aside className="cart-summary">
          <span className="cart-eyebrow">ORDER SUMMARY</span>
          <h2>Your selection</h2>

          <div className="cart-summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>

          <div className="cart-summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div className="cart-summary-total">
            <span>Total</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <button
            type="button"
            className="primary-button cart-checkout-button"
            disabled
          >
            Checkout coming soon
          </button>

          <Link to="/shop" className="cart-continue-shopping">
            Continue shopping
          </Link>

          <p className="cart-summary-note">
            Shipping, taxes and payment options will be confirmed during
            checkout.
          </p>
        </aside>
      </div>
    </section>
  );
}