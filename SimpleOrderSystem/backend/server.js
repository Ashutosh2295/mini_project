const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory array to store orders
const orders = [];

// Product List
const products = [
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
];

// GET /products -> return product list
app.get('/products', (req, res) => {
    res.json(products);
});

// POST /order -> create new order
app.post('/order', (req, res) => {
    const { items, total } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const newOrder = {
        id: orders.length + 1,
        items,
        total,
        date: new Date().toISOString()
    };

    orders.push(newOrder);
    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
});

// GET /orders -> return all orders
app.get('/orders', (req, res) => {
    res.json(orders);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});
