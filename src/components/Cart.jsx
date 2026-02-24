import { useEffect } from 'react';

export default function Cart({ cart, cartOpen, onClose, onChangeQty, onRemove, subtotal, onCheckout }) {
    useEffect(() => {
        const handler = (e) => { if (e.key === 'Escape' && cartOpen) onClose(); };
        document.addEventListener('keydown', handler);
        document.body.style.overflow = cartOpen ? 'hidden' : '';
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = ''; };
    }, [cartOpen, onClose]);

    return (
        <>
            <div className={`cart-overlay ${cartOpen ? 'active' : ''}`} onClick={onClose} />
            <aside className={`cart-panel ${cartOpen ? 'open' : ''}`} role="dialog" aria-label="Shopping cart">
                <div className="cart-panel-header">
                    <h3>Your Cart</h3>
                    <button className="cart-close" onClick={onClose} aria-label="Close cart">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                <div className="cart-items">
                    {cart.length === 0 ? (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛒</div>
                            <p>Your cart is empty.</p>
                            <span>Add some premium fruits!</span>
                        </div>
                    ) : (
                        cart.map(item => (
                            <div className="cart-item" key={item.id}>
                                {item.img ? (
                                    <img
                                        className="cart-item-img" src={item.img} alt={item.name}
                                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                    />
                                ) : null}
                                <div className="cart-item-emoji" style={{ display: item.img ? 'none' : 'flex' }}>{item.emoji}</div>
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-price">${(item.price * item.qty).toFixed(2)}</div>
                                </div>
                                <div className="cart-item-controls">
                                    <button className="qty-btn" onClick={() => onChangeQty(item.id, -1)}>−</button>
                                    <span className="qty-display">{item.qty}</span>
                                    <button className="qty-btn" onClick={() => onChangeQty(item.id, +1)}>+</button>
                                </div>
                                <button className="cart-item-remove" onClick={() => onRemove(item.id)} aria-label={`Remove ${item.name}`}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                        <polyline points="3 6 5 6 21 6" />
                                        <path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-row"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                        <div className="cart-row"><span>Shipping</span><span className="cart-free">FREE</span></div>
                        <div className="cart-total-row"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
                        <button className="checkout-btn" onClick={onCheckout}>
                            Proceed to Checkout
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </aside>
        </>
    );
}
