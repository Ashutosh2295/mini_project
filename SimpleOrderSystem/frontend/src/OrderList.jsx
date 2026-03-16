import React from 'react';

function OrderList({ orders }) {
    if (orders.length === 0) return null;

    // Render orders in descending order (newest first)
    const reversedOrders = [...orders].reverse();

    return (
        <div className="card orders-section">
            <h2 className="section-title">📦 Order History</h2>

            {reversedOrders.map((order) => (
                <div key={order.id} className="order-item">
                    <div className="order-header">
                        <span style={{ fontWeight: 'bold', color: 'var(--text-color)' }}>Order #{order.id}</span>
                        <span>{new Date(order.date).toLocaleString()}</span>
                    </div>
                    <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
                        {order.items.map((item, idx) => (
                            <li key={idx}>
                                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                            </li>
                        ))}
                    </ul>
                    <div className="order-total">
                        Total Paid: ${order.total.toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default OrderList;
