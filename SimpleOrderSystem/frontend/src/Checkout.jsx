import React, { useState } from 'react';
import { formatPrice, calcTotal } from './utils.js';

const initialForm = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
};

function Checkout({ cart, onContinueToPayment, onBack }) {
    const [form, setForm] = useState(initialForm);
    const [errors, setErrors] = useState({});
    const total = calcTotal(cart);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Name is required';
        if (!form.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email';
        if (!form.phone.trim()) newErrors.phone = 'Phone is required';
        if (!form.address.trim()) newErrors.address = 'Address is required';
        if (!form.city.trim()) newErrors.city = 'City is required';
        if (!form.state.trim()) newErrors.state = 'State is required';
        if (!form.zip.trim()) newErrors.zip = 'ZIP is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;
        onContinueToPayment(form);
    };

    if (cart.length === 0) {
        return (
            <div className="card checkout-section">
                <h2 className="section-title">✅ Checkout</h2>
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
                    Your cart is empty. Add items from Products, then return here to checkout.
                </p>
                <button onClick={onBack}>Back to Cart</button>
            </div>
        );
    }

    return (
        <div className="card checkout-section">
            <h2 className="section-title">✅ Checkout — Your Information</h2>

            <div className="checkout-summary">
                <h3>Order summary</h3>
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

            <form className="checkout-form" onSubmit={handleSubmit}>
                <h3 className="checkout-form-title">Shipping & contact</h3>
                <div className="form-row">
                    <label>Full name *</label>
                    <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="John Doe" />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-row">
                    <label>Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-row">
                    <label>Phone *</label>
                    <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
                <div className="form-row">
                    <label>Address *</label>
                    <input type="text" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St" />
                    {errors.address && <span className="form-error">{errors.address}</span>}
                </div>
                <div className="form-row form-row-inline">
                    <div className="form-group">
                        <label>City *</label>
                        <input type="text" name="city" value={form.city} onChange={handleChange} placeholder="City" />
                        {errors.city && <span className="form-error">{errors.city}</span>}
                    </div>
                    <div className="form-group">
                        <label>State *</label>
                        <input type="text" name="state" value={form.state} onChange={handleChange} placeholder="State" />
                        {errors.state && <span className="form-error">{errors.state}</span>}
                    </div>
                    <div className="form-group">
                        <label>ZIP *</label>
                        <input type="text" name="zip" value={form.zip} onChange={handleChange} placeholder="ZIP" />
                        {errors.zip && <span className="form-error">{errors.zip}</span>}
                    </div>
                </div>
                <div className="checkout-form-actions">
                    <button type="button" className="btn-secondary" onClick={onBack}>Back to Cart</button>
                    <button type="submit" className="checkout-place-btn">Continue to Payment</button>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
