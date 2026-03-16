import React, { useState, useEffect } from 'react';
import Cart from './Cart.jsx';
import OrderList from './OrderList.jsx';

const API_URL = 'http://localhost:5000';

function App() {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('products'); // options: 'products', 'orders', 'cart'

    // Fetch initial data
    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(`${API_URL}/products`);
            const data = await response.json();
            setProducts(data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching products:', err);
            // Fallback for development if backend is not running
            setProducts([
                { id: 1, name: 'Laptop', price: 999 },
                { id: 2, name: 'Wireless Mouse', price: 25 },
                { id: 3, name: 'Mechanical Keyboard', price: 75 },
                { id: 4, name: 'Headphones', price: 100 },
                { id: 5, name: 'Monitor', price: 300 },
                { id: 6, name: 'USB-C Hub', price: 40 },
                { id: 7, name: 'Ergonomic Chair', price: 200 },
                { id: 8, name: 'Webcam', price: 60 },
                { id: 9, name: 'Desk Lamp', price: 35 },
                { id: 10, name: 'Microphone', price: 120 },
                { id: 11, name: 'Speakers', price: 85 },
                { id: 12, name: 'External Hard Drive', price: 120 },
                { id: 13, name: 'Smartphone Stand', price: 15 },
                { id: 14, name: 'Wireless Charger', price: 30 },
                { id: 15, name: 'Tablet', price: 450 },
                { id: 16, name: 'Smartwatch', price: 199 },
                { id: 17, name: 'Gaming Controller', price: 65 },
                { id: 18, name: 'Router', price: 150 },
                { id: 19, name: 'Printer', price: 250 },
                { id: 20, name: 'Desk Mat', price: 22 },
                { id: 21, name: 'Drawing Tablet', price: 110 },
                { id: 22, name: 'Earbuds', price: 150 },
                { id: 23, name: 'Network Switch', price: 45 },
                { id: 24, name: 'Flash Drive', price: 20 },
                { id: 25, name: 'SD Card Reader', price: 18 }
            ]);
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

        const totalStr = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
        const total = parseFloat(totalStr);

        try {
            const response = await fetch(`${API_URL}/order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cart, total })
            });

            if (response.ok) {
                setCart([]); // Clear cart
                fetchOrders(); // Refresh order list
                setCurrentView('orders'); // Jump to orders view
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
                        <span className={`nav-link ${currentView === 'products' ? 'active' : ''}`} onClick={() => setCurrentView('products')}>Products</span>
                        <span className={`nav-link ${currentView === 'orders' ? 'active' : ''}`} onClick={() => setCurrentView('orders')}>Orders</span>
                        <span className={`nav-badge ${currentView === 'cart' ? 'active' : ''}`} onClick={() => setCurrentView('cart')} style={{ cursor: 'pointer', opacity: currentView === 'cart' ? 0.8 : 1 }}>🛒 Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                    </div>
                </div>
            </nav>
            <div className="container" style={{ paddingTop: '2rem' }}>
                {currentView === 'products' && (
                    <div className="card">
                        <h2 className="section-title">🛍️ Available Products</h2>
                        <div className="product-list">
                            {products.map((product) => (
                                <div key={product.id} className="card product-item">
                                    <div className="product-icon">{getIcon(product.name)}</div>
                                    <h3 className="product-name">{product.name}</h3>
                                    <p className="product-price">${product.price.toFixed(2)}</p>
                                    <button onClick={() => addToCart(product)}>Add to Cart</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentView === 'orders' && (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <OrderList orders={orders} />
                    </div>
                )}

                {currentView === 'cart' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Cart
                            cart={cart}
                            updateQuantity={updateQuantity}
                            placeOrder={placeOrder}
                            removeCompletely={removeCompletely}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
