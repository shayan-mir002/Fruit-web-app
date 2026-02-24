import { useState, useCallback } from 'react';

export function useCart() {
    const [cart, setCart] = useState([]);
    const [cartOpen, setCartOpen] = useState(false);

    const addToCart = useCallback((product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
            return [...prev, { ...product, qty: 1 }];
        });
    }, []);

    const removeFromCart = useCallback((id) => {
        setCart(prev => prev.filter(i => i.id !== id));
    }, []);

    const changeQty = useCallback((id, delta) => {
        setCart(prev => {
            const item = prev.find(i => i.id === id);
            if (!item) return prev;
            if (item.qty + delta <= 0) return prev.filter(i => i.id !== id);
            return prev.map(i => i.id === id ? { ...i, qty: i.qty + delta } : i);
        });
    }, []);

    const clearCart = useCallback(() => {
        setCart([]);
    }, []);

    const totalItems = cart.reduce((s, i) => s + i.qty, 0);
    const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);

    return { cart, cartOpen, setCartOpen, addToCart, removeFromCart, changeQty, totalItems, subtotal, clearCart };
}
