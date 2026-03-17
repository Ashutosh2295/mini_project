import React from 'react';

function Footer({ onNavigate }) {
    return (
        <footer className="site-footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="footer-logo">🛍️ SimpleOrder</span>
                    <p className="footer-tagline">Your one-stop shop for tech & office essentials.</p>
                </div>
                <div className="footer-links">
                    <span className="footer-link" onClick={() => onNavigate('products')}>Products</span>
                    <span className="footer-link" onClick={() => onNavigate('orders')}>Orders</span>
                    <span className="footer-link" onClick={() => onNavigate('cart')}>Cart</span>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} SimpleOrder. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
