import { useEffect, useRef } from 'react';

const SECTIONS = [
    { id: 'heroSection', label: 'Home' },
    { id: 'sequenceSection', label: 'Story' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
];

export default function JourneyRail() {
    const dotRefs = useRef([]);

    useEffect(() => {
        // Scroll-reveal: observe every .reveal element on the page
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    // stagger child reveals
                    const delay = e.target.dataset.delay || 0;
                    setTimeout(() => e.target.classList.add('revealed'), Number(delay));
                    revealObserver.unobserve(e.target);
                }
            });
        }, { threshold: 0.12 });

        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

        // Active dot: track which section is in view
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                const idx = SECTIONS.findIndex(s => s.id === e.target.id);
                if (idx === -1) return;
                dotRefs.current.forEach((d, i) => d?.classList.toggle('active', i === idx));
            });
        }, { threshold: 0.3 });

        SECTIONS.forEach(s => {
            const el = document.getElementById(s.id);
            if (el) sectionObserver.observe(el);
        });

        return () => { revealObserver.disconnect(); sectionObserver.disconnect(); };
    }, []);

    const scrollTo = (id) => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <nav className="journey-rail" aria-label="Page navigation">
            {SECTIONS.map((s, i) => (
                <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {i > 0 && <div className="journey-rail-line" />}
                    <button
                        className="journey-dot"
                        ref={el => dotRefs.current[i] = el}
                        onClick={() => scrollTo(s.id)}
                        aria-label={`Go to ${s.label}`}
                        title={s.label}
                    />
                </div>
            ))}
        </nav>
    );
}
