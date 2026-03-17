import React, { useState, useEffect } from 'react';
import Cart from './Cart.jsx';
import OrderList from './OrderList.jsx';
import Checkout from './Checkout.jsx';
import Payment from './Payment.jsx';
import Footer from './Footer.jsx';
import { formatPrice, calcTotal, getCartWithCurrentPrices } from './utils.js';

const API_URL = 'http://localhost:5000';

// Fallback products – prices in Indian Rupees (INR), same as backend
const FALLBACK_PRODUCTS = [
    { id: 1, name: 'Laptop', price: 82917, description: 'High-performance laptop with fast processor, ample RAM, and long battery life. Perfect for work and study.' },
    { id: 2, name: 'Wireless Mouse', price: 2075, description: 'Ergonomic wireless mouse with precise tracking and comfortable grip. USB receiver included.' },
    { id: 3, name: 'Mechanical Keyboard', price: 6225, description: 'Tactile mechanical keyboard with RGB backlight. Durable switches for typing and gaming.' },
    { id: 4, name: 'Headphones', price: 8300, description: 'Over-ear headphones with noise cancellation and rich sound. Foldable design for portability.' },
    { id: 5, name: 'Monitor', price: 24900, description: '27" Full HD monitor with IPS panel. Great for productivity and entertainment.' },
    { id: 6, name: 'USB-C Hub', price: 3320, description: 'Multi-port USB-C hub with HDMI, USB 3.0, and SD card slot. Expand your laptop connectivity.' },
    { id: 7, name: 'Ergonomic Chair', price: 16600, description: 'Office chair with lumbar support and adjustable armrests. Breathable mesh back.' },
    { id: 8, name: 'Webcam', price: 4980, description: '1080p webcam with built-in microphone. Ideal for video calls and streaming.' },
    { id: 9, name: 'Desk Lamp', price: 2905, description: 'LED desk lamp with adjustable brightness and color temperature. USB charging port.' },
    { id: 10, name: 'Microphone', price: 9960, description: 'Studio-quality condenser microphone for streaming, podcasts, and voiceovers.' },
    { id: 11, name: 'Speakers', price: 7055, description: 'Stereo desktop speakers with clear mids and deep bass. Bluetooth and aux input.' },
    { id: 12, name: 'External Hard Drive', price: 9960, description: '1TB portable external HDD. Fast transfer speeds and durable design.' },
    { id: 13, name: 'Smartphone Stand', price: 1245, description: 'Adjustable phone stand for desk or bedside. Works in portrait and landscape.' },
    { id: 14, name: 'Wireless Charger', price: 2490, description: 'Qi-compatible wireless charging pad. Fast charge supported for compatible devices.' },
    { id: 15, name: 'Tablet', price: 37350, description: '10" tablet with sharp display and long battery. Great for reading and light work.' },
    { id: 16, name: 'Smartwatch', price: 16517, description: 'Fitness and health tracking smartwatch. Notifications, GPS, and water-resistant.' },
    { id: 17, name: 'Gaming Controller', price: 5395, description: 'Wireless gaming controller with precise sticks and triggers. Compatible with PC and consoles.' },
    { id: 18, name: 'Router', price: 12450, description: 'Dual-band Wi-Fi 6 router. Wide coverage and stable connection for home or office.' },
    { id: 19, name: 'Printer', price: 20750, description: 'All-in-one printer with scan and copy. Wireless connectivity and compact footprint.' },
    { id: 20, name: 'Desk Mat', price: 1826, description: 'Large desk mat that fits keyboard and mouse. Smooth surface and edge stitching.' },
    { id: 21, name: 'Drawing Tablet', price: 9130, description: 'Pressure-sensitive drawing tablet for digital art and note-taking. Works with major software.' },
    { id: 22, name: 'Earbuds', price: 12450, description: 'True wireless earbuds with active noise cancellation. Long battery and premium sound.' },
    { id: 23, name: 'Network Switch', price: 3735, description: '5-port gigabit Ethernet switch. Plug-and-play for expanding wired network.' },
    { id: 24, name: 'Flash Drive', price: 1660, description: '64GB USB 3.0 flash drive. Fast read/write and compact metal body.' },
    { id: 25, name: 'SD Card Reader', price: 1494, description: 'Multi-format card reader for SD, microSD, and more. USB 3.0 compatible.' }
];

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('home'); // 'home' | 'products' | 'orders' | 'cart' | 'checkout' | 'payment'
    const [checkoutInfo, setCheckoutInfo] = useState(null); // shipping/contact info from checkout form
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch initial data
    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    // Refetch products when viewing products or cart so frontend shows backend price/description updates
    useEffect(() => {
        if (currentView === 'products' || currentView === 'cart') {
            fetchProducts();
        }
    }, [currentView]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`, { cache: 'no-store' });
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : FALLBACK_PRODUCTS);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            setProducts(FALLBACK_PRODUCTS);
            setLoading(false);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch(`${API_URL}/orders`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            }
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (id, change) => {
        setCart((prevCart) => {
            return prevCart.map(item => {
                if (item.id === id) {
                    const newQty = item.quantity + change;
                    return newQty > 0 ? { ...item, quantity: newQty } : item;
                }
                return item;
            }).filter(item => item.quantity > 0);
        });
    };

    const removeCompletely = (id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    }

    const placeOrder = async () => {
        if (cart.length === 0) return;

        const resolvedCart = getCartWithCurrentPrices(cart, products);
        const total = Math.round(calcTotal(resolvedCart) * 100) / 100;

        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: resolvedCart, total })
            });

            if (response.ok) {
                setCart([]);
                fetchOrders();
                setCurrentView('orders');
                alert('Order placed successfully!');
            } else {
                alert('Failed to place order. Check backend connection.');
            }
        } catch (err) {
            console.error('Error placing order:', err);
            alert('Error connecting to backend!');
        }
    };

    if (loading) {
        return <div className="container"><h2 className="header">Loading Products...</h2></div>;
    }

    // Map product names to icons for premium flair
    const getIcon = (name) => {
        const icons = {
            'Laptop': '💻',
            'Wireless Mouse': '🖱️',
            'Mechanical Keyboard': '⌨️',
            'Headphones': '🎧',
            'Monitor': '🖥️',
            'USB-C Hub': '🔌',
            'Ergonomic Chair': '🪑',
            'Webcam': '📷',
            'Desk Lamp': '💡',
            'Microphone': '🎤',
            'Speakers': '🔊',
            'External Hard Drive': '💾',
            'Smartphone Stand': '📱',
            'Wireless Charger': '⚡',
            'Tablet': '📱',
            'Smartwatch': '⌚',
            'Gaming Controller': '🎮',
            'Router': '📡',
            'Printer': '🖨️',
            'Desk Mat': '🖱️',
            'Drawing Tablet': '✒️',
            'Earbuds': '🎧',
            'Network Switch': '🖧',
            'Flash Drive': '🖊️',
            'SD Card Reader': '📇'
        };
        return icons[name] || '📦';
    };

    return (
        <>
            <nav className="nav-bar">
                <div className="nav-container">
                    <div className="nav-logo">🛍️ SimpleOrder</div>
                    <div className="nav-links">
                        <span className={`nav-link ${currentView === 'home' ? 'active' : ''}`} onClick={() => setCurrentView('home')}>Home</span>
                        <span className={`nav-link ${currentView === 'products' ? 'active' : ''}`} onClick={() => setCurrentView('products')}>Products</span>
                        <span className={`nav-link ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>Orders</span>
                        <span className={`nav-link ${currentView === 'checkout' ? 'active' : ''}`} onClick={() => setCurrentView('checkout')}>Checkout</span>
                        <span className={`nav-badge ${currentView === 'cart' ? 'active' : ''}`} onClick={() => setCurrentView('cart')} style={{ cursor: 'pointer', opacity: currentView === 'cart' ? 0.8 : 1 }}>🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    </div>
                </div>
            </nav>
            <div className="container" style={{ paddingTop: '2rem', flex: 1 }}>
                {currentView === 'home' && (
                    <div className="card">
                        <div className="home-hero">
                            <h1>Welcome to SimpleOrder</h1>
                            <p>Browse tech and office essentials, add to cart, and checkout in one place. Track your orders and manage your purchases easily.</p>
                            <div className="home-actions">
                                <button className="home-action-btn primary" onClick={() => setCurrentView('products')}>Browse Products</button>
                                <button className="home-action-btn secondary" onClick={() => setCurrentView('cart')}>View Cart</button>
                                <button className="home-action-btn secondary" onClick={() => setCurrentView('orders')}>Order History</button>
                            </div>
                        </div>
                        <div className="home-featured">
                            <h2>Quick links</h2>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Jump to products, cart, or checkout from the menu above—or use the buttons below.</p>
                            <div className="home-actions">
                                <button className="home-action-btn secondary" onClick={() => setCurrentView('checkout')}>Go to Checkout</button>
                            </div>
                        </div>
                    </div>
                )}

                {currentView === 'products' && (
                    <div className="card">
                        <h2 className="section-title">🛍️ Available Products</h2>
                        <div className="search-bar-wrap" style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Search by name or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search products"
                            />
                        </div>
                        <div className="product-list">
                            {products
                                .filter((p) => {
                                    const q = searchQuery.trim().toLowerCase();
                                    if (!q) return true;
                                    const matchName = p.name && p.name.toLowerCase().includes(q);
                                    const matchDesc = p.description && p.description.toLowerCase().includes(q);
                                    return matchName || matchDesc;
                                })
                                .map((product) => (
                                <div key={product.id} className="card product-item">
                                    <div className="product-icon">{getIcon(product.name)}</div>
                                    <h3 className="product-name">{product.name}</h3>
                                    {product.description && (
                                        <p className="product-description">{product.description}</p>
                                    )}
                                    <p className="product-price">{formatPrice(product.price)}</p>
                                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentView === 'orders' && (
                    <div style={{ width: '100%' }}>
                        <OrderList orders={orders} getIcon={getIcon} />
                    </div>
                )}

                {currentView === 'cart' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Cart
                            cart={cart}
                            products={products}
                            updateQuantity={updateQuantity}
                            removeCompletely={removeCompletely}
                            onProceedToCheckout={() => setCurrentView('checkout')}
                        />
                    </div>
                )}

                {currentView === 'checkout' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Checkout
                            cart={cart}
                            products={products}
                            onContinueToPayment={(info) => { setCheckoutInfo(info); setCurrentView('payment'); }}
                            onBack={() => setCurrentView('cart')}
                        />
                    </div>
                )}

                {currentView === 'payment' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Payment
                            cart={cart}
                            products={products}
                            checkoutInfo={checkoutInfo}
                            placeOrder={placeOrder}
                            onBack={() => setCurrentView('checkout')}
                        />
                    </div>
                )}
            </div>
            <Footer onNavigate={setCurrentView} />
        </>
    );
}

export default App;
