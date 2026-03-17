import React from 'react';
import { formatPrice } from './utils.js';

const DEFAULT_ICONS = {
    'Laptop': '💻', 'Wireless Mouse': '🖱️', 'Mechanical Keyboard': '⌨️', 'Headphones': '🎧', 'Monitor': '🖥️',
    'USB-C Hub': '🔌', 'Ergonomic Chair': '🪑', 'Webcam': '📷', 'Desk Lamp': '💡', 'Microphone': '🎤',
    'Speakers': '🔊', 'External Hard Drive': '💾', 'Smartphone Stand': '📱', 'Wireless Charger': '⚡',
    'Tablet': '📱', 'Smartwatch': '⌚', 'Gaming Controller': '🎮', 'Router': '📡', 'Printer': '🖨️',
    'Desk Mat': '🖱️', 'Drawing Tablet': '✒️', 'Earbuds': '🎧', 'Network Switch': '🖧', 'Flash Drive': '🖊️',
    'SD Card Reader': '📇'
};

function getOrderIcon(itemName, getIcon) {
    if (typeof getIcon === 'function') return getIcon(itemName);
    return DEFAULT_ICONS[itemName] || '📦';
}

function OrderList({ orders, getIcon }) {
    if (orders.length === 0) return null;

    const reversedOrders = [...orders].reverse();

    return (
        <div className="card orders-section">
            <h2 className="section-title">📦 Order History</h2>
            <div className="order-list-grid">
                {reversedOrders.map((order) => {
                    const firstItemName = order.items && order.items[0] ? order.items[0].name : null;
                    const orderIcon = getOrderIcon(firstItemName, getIcon);
                    return (
                        <div key={order.id} className="order-item">
                            <div className="order-card-image" aria-hidden="true">
                                {orderIcon}
                            </div>
                            <div className="order-header">
                                <span className="order-id">Order #{order.id}</span>
                                <span className="order-date">{new Date(order.date).toLocaleString('en-IN')}</span>
                            </div>
                            <ul className="order-items-list">
                                {order.items.map((item, idx) => (
                                    <li key={idx}>
                                        {item.name} – {item.quantity} × {formatPrice(item.price)}
                                    </li>
                                ))}
                            </ul>
                            <div className="order-total">
                                Total: {formatPrice(order.total)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default OrderList;
