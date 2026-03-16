import React from 'react';

function Cart({ cart, updateQuantity, placeOrder, removeCompletely }) {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
                                <p>${item.price.toFixed(2)} x {item.quantity}</p>
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
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={placeOrder}
                        style={{
                            marginTop: '1rem',
                            background: 'linear-gradient(to right, #10b981, #059669)',
                            padding: '1rem',
                            fontSize: '1.1rem'
                        }}
                    >
                        Place Order
                    </button>
                </>
            )}
        </div>
    );
}

export default Cart;
