export default function Hero() {
    return (
        <section className="hero-section" id="heroSection">
            <div className="hero-pill">Harvested at peak perfection</div>
            <div className="hero-title-block">
                <h1 className="hero-title">
                    NATURE'S<br />
                    <span className="hero-title-accent">FINEST</span>
                </h1>
                <p className="hero-subtitle">Premium botanicals. Delivered.</p>
            </div>
            <div className="hero-scroll-hint">
                <span>Scroll to experience</span>
                <div className="scroll-arrow">
                    <svg width="16" height="24" viewBox="0 0 16 24">
                        <path d="M8 0v20M1 14l7 8 7-8" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                    </svg>
                </div>
            </div>
        </section>
    );
}
