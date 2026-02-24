import { useEffect, useRef } from 'react';
import { PRODUCTS, BADGE_LABEL } from '../data/products';

export default function Shop({ onAddToCart }) {
    const cardRefs = useRef([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
            { threshold: 0.1 }
        );
        cardRefs.current.forEach(c => c && observer.observe(c));
        return () => observer.disconnect();
    }, []);

    return (
        <section className="shop-section" id="shop">
            <div className="shop-inner">
                <div className="shop-header">
                    <span className="shop-eyebrow reveal" data-delay="0">Curated Selection</span>
                    <h2 className="shop-title reveal" data-delay="80">PREMIUM BOTANICALS</h2>
                    <p className="shop-desc reveal" data-delay="160">Each fruit is hand-selected and delivered within 24 hours of peak ripeness.</p>
                </div>
                <div className="product-grid">
                    {PRODUCTS.map((product, idx) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={onAddToCart}
                            ref={el => cardRefs.current[idx] = el}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

import { forwardRef, useState } from 'react';

const ProductCard = forwardRef(({ product, onAddToCart }, ref) => {
    const [added, setAdded] = useState(false);

    const handleAdd = (e) => {
        e.stopPropagation();
        onAddToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1400);
    };

    return (
        <div className="product-card" ref={ref} id={`product-${product.id}`}>
            <div className="product-img-wrap">
                {product.img ? (
                    <img
                        src={product.img}
                        alt={product.name}
                        loading="lazy"
                        onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                <div className="product-emoji" style={{ display: product.img ? 'none' : 'block' }}>
                    {product.emoji}
                </div>
                <div className={`product-badge badge-${product.badge}`}>{BADGE_LABEL[product.badge]}</div>
            </div>
            <div className="product-body">
                <div className="product-origin">{product.origin}</div>
                <div className="product-name">{product.name}</div>
                <div className="product-desc">{product.desc}</div>
                <div className="product-footer">
                    <div className="product-price">
                        ${product.price.toFixed(2)}
                        <span className="product-price-unit">/ {product.unit}</span>
                    </div>
                    <button
                        className="add-to-cart-btn"
                        onClick={handleAdd}
                        style={added ? { background: 'var(--accent-green)' } : {}}
                    >
                        {added ? (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Added
                            </>
                        ) : (
                            <>
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                Add
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
});
ProductCard.displayName = 'ProductCard';
