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
