export default function About() {
    return (
        <section className="about-section" id="about">
            <div className="about-inner">
                <div className="about-text-block">
                    <span className="about-eyebrow reveal" data-delay="0">Our Philosophy</span>
                    <h2 className="about-title reveal" data-delay="80">GROWN WITH<br />INTENTION.</h2>
                    <p className="about-body reveal" data-delay="160">
                        Fruit Fusion partners with family farms across 14 countries to source the rarest and
                        most flavourful botanical specimens on earth. Each selection is flash-cooled after harvest
                        to lock in peak enzymatic activity and maximum nutrient density.
                    </p>
                    <div className="about-stats">
                        <div className="stat reveal" data-delay="200">
                            <span className="stat-num">14</span>
                            <span className="stat-label">Countries</span>
                        </div>
                        <div className="stat reveal" data-delay="260">
                            <span className="stat-num">48h</span>
                            <span className="stat-label">Farm to Door</span>
                        </div>
                        <div className="stat reveal" data-delay="320">
                            <span className="stat-num">100%</span>
                            <span className="stat-label">Organic</span>
                        </div>
                        <div className="stat reveal" data-delay="380">
                            <span className="stat-num">0</span>
                            <span className="stat-label">Preservatives</span>
                        </div>
                    </div>
                </div>
                <div className="about-visual reveal reveal-right" data-delay="100">
                    <div className="about-glow-ring" />
                    <div className="about-emoji-stack">
                        <span>🍉</span><span>🥝</span><span>🍊</span><span>🍇</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
