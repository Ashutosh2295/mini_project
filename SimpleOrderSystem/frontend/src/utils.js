/**
 * Format amount as Indian Rupees (INR). Use this everywhere so the true price is always correct.
 */
export function formatPrice(amount) {
    const value = Number(amount);
    if (Number.isNaN(value)) return '₹0.00';
    return '₹' + value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Calculate cart/order total from items (price × quantity). */
export function calcTotal(items) {
    return items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0);
}

/**
 * Merge cart items with current product data (price, name, description) from API.
 * When backend updates price/description, cart display and order use latest values.
 */
export function getCartWithCurrentPrices(cart, products) {
    if (!Array.isArray(products) || products.length === 0) return cart;
    const byId = Object.fromEntries(products.map((p) => [p.id, p]));
    return cart.map((item) => {
        const current = byId[item.id];
        if (current) {
            return { ...item, price: current.price, name: current.name, description: current.description };
        }
        return item;
    });
}
