import React, { useState } from 'react';
import { formatPrice, calcTotal } from './utils.js';

function Payment({ cart, checkoutInfo, placeOrder, onBack }) {
    const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [errors, setErrors] = useState({});
    const total = calcTotal(cart);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCard((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!card.number.trim() || card.number.replace(/\s/g, '').length < 13) newErrors.number = 'Enter a valid card number';
        if (!card.expiry.trim()) newErrors.expiry = 'Expiry required';
        if (!card.cvv.trim() || card.cvv.length < 3) newErrors.cvv = 'CVV required';
        if (!card.name.trim()) newErrors.name = 'Name on card required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePay = (e) => {
        e.preventDefault();
        if (!validate()) return;
        placeOrder();
    };

    if (cart.length === 0) {
        return (
            <div className="card payment-section">
                <h2 className="section-title">💳 Payment</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    No items in cart. Add products and complete checkout first.
                </p>
                <button onClick={onBack}>Back to Checkout</button>
            </div>
        );
    }

    return (
        <div className="card payment-section">
            <h2 className="section-title">💳 Payment</h2>

            {checkoutInfo && (
                <div className="payment-shipping-summary">
                    <h3>Shipping to</h3>
                    <p><strong>{checkoutInfo.fullName}</strong></p>
                    <p>{checkoutInfo.address}, {checkoutInfo.city}, {checkoutInfo.state} {checkoutInfo.zip}</p>
                    <p>{checkoutInfo.email} · {checkoutInfo.phone}</p>
                </div>
            )}

            <div className="checkout-summary">
                <h3>Order total</h3>
                {cart.map((item) => (
                    <div key={item.id} className="checkout-item">
                        <span className="name">{item.name} × {item.quantity}</span>
                        <span className="subtotal">{formatPrice(Number(item.price) * item.quantity)}</span>
                    </div>
                ))}
                <div className="checkout-total-row">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            <form className="payment-form" onSubmit={handlePay}>
                <h3 className="checkout-form-title">Card details (demo only)</h3>
                <div className="form-row">
                    <label>Name on card *</label>
                    <input type="text" name="name" value={card.name} onChange={handleChange} placeholder="John Doe" />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                </div>
                <div className="form-row">
                    <label>Card number *</label>
                    <input type="text" name="number" value={card.number} onChange={handleChange} placeholder="4242 4242 4242 4242" maxLength="19" />
                    {errors.number && <span className="form-error">{errors.number}</span>}
                </div>
                <div className="form-row form-row-inline">
                    <div className="form-group">
                        <label>Expiry (MM/YY) *</label>
                        <input type="text" name="expiry" value={card.expiry} onChange={handleChange} placeholder="12/25" maxLength="5" />
                        {errors.expiry && <span className="form-error">{errors.expiry}</span>}
                    </div>
                    <div className="form-group">
                        <label>CVV *</label>
                        <input type="text" name="cvv" value={card.cvv} onChange={handleChange} placeholder="123" maxLength="4" />
                        {errors.cvv && <span className="form-error">{errors.cvv}</span>}
                    </div>
                </div>
                <p className="payment-demo-note">This is a demo. No real payment is processed.</p>
                <div className="checkout-form-actions">
                    <button type="button" className="btn-secondary" onClick={onBack}>Back to Checkout</button>
                    <button type="submit" className="checkout-place-btn">Place Order</button>
                </div>
            </form>
        </div>
    );
}

export default Payment;
