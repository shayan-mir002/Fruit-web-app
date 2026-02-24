import { useNavScroll } from '../hooks/useNavScroll';

export default function Navbar({ totalItems, onCartOpen }) {
    useNavScroll();

    return (
        <nav className="navbar" id="navbar">
            <div className="nav-inner">
                <a href="#" className="nav-logo">
                    <span className="nav-logo-icon">🍉</span>
                    FRUIT<span className="nav-logo-accent">FUSION</span>
                </a>
                <div className="nav-links">
                    <a href="#story" className="nav-link">Story</a>
                    <a href="#shop" className="nav-link">Shop</a>
                    <a href="#about" className="nav-link">About</a>
                </div>
                <button className="cart-trigger" onClick={onCartOpen} aria-label="Open cart">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    <span className={`cart-badge ${totalItems > 0 ? 'visible' : ''}`}>{totalItems}</span>
                </button>
            </div>
        </nav>
    );
}
