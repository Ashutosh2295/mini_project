const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory array to store orders
const orders = [];

// Product List – prices in Indian Rupees (INR)
const products = [
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
