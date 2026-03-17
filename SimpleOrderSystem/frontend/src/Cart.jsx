import React from 'react';
import { formatPrice, calcTotal } from './utils.js';

function Cart({ cart, updateQuantity, removeCompletely, onProceedToCheckout }) {
    const total = calcTotal(cart);

    return (
        <div className="card cart-section">
            <h2 className="section-title">🛒 Your Cart</h2>

            {cart.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    Your cart is empty. Add some items!
                </p>
            ) : (
                <>
                    {cart.map((item) => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-info">
                                <h4>{item.name}</h4>
                                <p>{formatPrice(item.price)} × {item.quantity}</p>
                            </div>
                            <div className="cart-actions">
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                                <span style={{ margin: '0 0.5rem', fontWeight: 'bold' }}>{item.quantity}</span>
                                <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                                <button
                                    className="qty-btn"
                                    style={{ backgroundColor: '#ef4444', marginLeft: '0.5rem' }}
                                    onClick={() => removeCompletely(item.id)}
                                    title="Remove from cart"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-total">
                        <span>Total:</span>
                        <span>{formatPrice(total)}</span>
                    </div>

                    <button
                        onClick={onProceedToCheckout}
                        className="cart-checkout-btn"
                    >
                        Proceed to Checkout
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;
