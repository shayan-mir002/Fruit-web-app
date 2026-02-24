import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TOTAL_FRAMES, frameUrl } from '../data/products';

gsap.registerPlugin(ScrollTrigger);

const BEAT_ZONES = [
    { fadeIn: 0.02, peak: 0.20, fadeOut: 0.22 },
    { fadeIn: 0.25, peak: 0.43, fadeOut: 0.47 },
    { fadeIn: 0.50, peak: 0.68, fadeOut: 0.72 },
    { fadeIn: 0.75, peak: 0.92, fadeOut: 0.98 },
];

function mapRange(val, inMin, inMax, outMin, outMax) {
    return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}
function clamp(v, mn, mx) { return Math.min(mx, Math.max(mn, v)); }

function calcBeatOpacity(p, fadeIn, peak, fadeOut) {
    if (p < fadeIn) return 0;
    if (p < peak) return clamp((p - fadeIn) / (peak - fadeIn), 0, 1);
    if (p < fadeOut) return 1;
    return clamp(1 - (p - fadeOut) / 0.06, 0, 1);
}

export default function SequenceSection({ onShopClick }) {
    const canvasRef = useRef(null);
    const particleRef = useRef(null);
    const progressRef = useRef(null);
    const glintRef = useRef(null);
    const beatRefs = useRef([]);
    const imagesRef = useRef([]);
    const loadingRef = useRef(null);
    const loadingBarRef = useRef(null);
    const loadingPercRef = useRef(null);
    const particlesRef = useRef([]);
    const pendingLinesRef = useRef(0);
    const speedLinesTRef = useRef(-1);

    /* ── Draw frame ── */
    function drawFrame(index) {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const i = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(index)));
        const img = imagesRef.current[i];
        if (!img || !img.complete) return;
        const cw = canvas.width, ch = canvas.height;
        const iw = img.naturalWidth, ih = img.naturalHeight;
        if (!iw || !ih) return;
        const scale = Math.max(cw / iw, ch / ih);
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, (cw - iw * scale) / 2, (ch - ih * scale) / 2, iw * scale, ih * scale);
    }

    /* ── Draw speed lines (canvas) ── */
    function drawSpeedLines(t, pctx, canvas) {
        if (t <= 0) return;
        const alpha = Math.sin(t * Math.PI);
        const count = Math.round(t * 14);
        pctx.save();
        pctx.globalAlpha = alpha;
        for (let i = 0; i < count; i++) {
            const angle = (-40 + (Math.random() * 10 - 5)) * (Math.PI / 180);
            const tx = canvas.width * (0.05 + Math.random() * 0.9);
            const ty = canvas.height * (0.10 + Math.random() * 0.8);
            const len = 40 + Math.random() * 180;
            const opacity = (0.10 + Math.random() * 0.14) * t;
            const grd = pctx.createLinearGradient(tx, ty, tx + Math.cos(angle) * len, ty + Math.sin(angle) * len);
            grd.addColorStop(0, 'transparent');
            grd.addColorStop(0.5, `rgba(247,160,114,${opacity * 2})`);
            grd.addColorStop(1, 'transparent');
            pctx.strokeStyle = grd;
            pctx.lineWidth = 0.8;
            pctx.beginPath();
            pctx.moveTo(tx, ty);
            pctx.lineTo(tx + Math.cos(angle) * len, ty + Math.sin(angle) * len);
            pctx.stroke();
        }
        pctx.restore();
    }

    /* ── Update particles ── */
    function updateParticles(t) {
        const canvas = particleRef.current;
        if (!canvas) return;
        const pctx = canvas.getContext('2d');
        pctx.clearRect(0, 0, canvas.width, canvas.height);
        if (t === 0) { particlesRef.current = []; return; }

        if (t < 0.85 && particlesRef.current.length < 130) {
            const cx = canvas.width * 0.5, cy = canvas.height * 0.5;
            for (let i = 0; i < 4; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 4;
                particlesRef.current.push({
                    x: cx + (Math.random() - 0.5) * 80,
                    y: cy + (Math.random() - 0.5) * 80,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    r: 1.5 + Math.random() * 4,
                    life: 1,
                    decay: 0.008 + Math.random() * 0.015,
                    color: Math.random() > 0.4 ? '#F7A072' : (Math.random() > 0.5 ? '#4A7C59' : '#ff7a73'),
                    type: Math.random() > 0.85 ? 'seed' : 'drop',
                });
            }
        }

        drawSpeedLines(pendingLinesRef.current, pctx, canvas);

        particlesRef.current = particlesRef.current.filter(p => p.life > 0);
        for (const p of particlesRef.current) {
            pctx.save();
            pctx.globalAlpha = p.life * 0.85;
            if (p.type === 'seed') {
                pctx.fillStyle = '#2D2D2D';
                pctx.beginPath();
                pctx.ellipse(p.x, p.y, p.r * 0.5, p.r, -0.3, 0, Math.PI * 2);
                pctx.fill();
            } else {
                const g = pctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
                g.addColorStop(0, p.color); g.addColorStop(1, 'transparent');
                pctx.fillStyle = g;
                pctx.beginPath(); pctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2); pctx.fill();
                pctx.fillStyle = p.color;
                pctx.beginPath(); pctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); pctx.fill();
            }
            pctx.restore();
            p.x += p.vx; p.y += p.vy; p.vy += 0.045; p.life -= p.decay;
        }
    }

    useEffect(() => {
        const canvas = canvasRef.current;
        const pCanvas = particleRef.current;
        const loading = loadingRef.current;
        const bar = loadingBarRef.current;
        const perc = loadingPercRef.current;

        function resize() {
            canvas.width = pCanvas.width = window.innerWidth;
            canvas.height = pCanvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        /* Pre-build quickSetters with safety */
        const beatEls = beatRefs.current.filter(el => el !== null);
        const setOpacity = beatEls.map(el => gsap.quickSetter(el, 'opacity'));
        const setY = beatEls.map(el => gsap.quickSetter(el, 'y', 'px'));

        const setGlint = glintRef.current ? gsap.quickSetter(glintRef.current, 'opacity') : () => { };
        const setProgress = progressRef.current ? gsap.quickSetter(progressRef.current, 'width', '%') : () => { };

        /* Preload frames */
        let loaded = 0;
        imagesRef.current = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
            const img = new Image();
            img.onload = img.onerror = () => {
                loaded++;
                const pct = Math.round((loaded / TOTAL_FRAMES) * 100);
                if (bar) bar.style.width = pct + '%';
                if (perc) perc.textContent = pct + '%';
                if (loaded === TOTAL_FRAMES) {
                    drawFrame(0);
                    setTimeout(() => loading?.classList.add('hidden'), 600);
                    initScrollTriggers();
                }
            };
            img.src = frameUrl(i + 1);
            return img;
        });

        function initScrollTriggers() {
            const section = document.getElementById('sequenceSection');

            /* ST1: Canvas frames (scrub:1) */
            ScrollTrigger.create({
                trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1,
                onUpdate(self) { drawFrame(self.progress * (TOTAL_FRAMES - 1)); },
            });

            /* ST2: Beats + overlays (instant) */
            ScrollTrigger.create({
                trigger: section, start: 'top top', end: 'bottom bottom', scrub: true,
                onUpdate(self) {
                    const p = self.progress;
                    setProgress(p * 100);
                    BEAT_ZONES.forEach((z, i) => {
                        const o = calcBeatOpacity(p, z.fadeIn, z.peak, z.fadeOut);
                        if (setOpacity[i]) setOpacity[i](o);
                        if (setY[i]) setY[i]((1 - o) * 22);
                    });
                    setGlint(p < 0.2 ? Math.sin((p / 0.2) * Math.PI) * 0.8 : 0);

                    const lt = mapRange(p, 0.25, 0.55, 0, 1);
                    if (Math.abs(lt - speedLinesTRef.current) >= 0.02) {
                        speedLinesTRef.current = lt;
                        pendingLinesRef.current = (lt > 0 && lt < 1) ? lt : 0;
                    }

                    if (p >= 0.5 && p <= 0.8) {
                        updateParticles(mapRange(p, 0.5, 0.8, 0, 1));
                    } else {
                        const pc = particleRef.current;
                        pc?.getContext('2d').clearRect(0, 0, pc.width, pc.height);
                        if (p < 0.5) particlesRef.current = [];
                    }
                },
            });
        }

        return () => {
            window.removeEventListener('resize', resize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <>
            {/* Loading screen */}
            <div className="loading-screen" ref={loadingRef}>
                <div className="loading-logo">FRUIT<span>FUSION</span></div>
                <div className="loading-bar-track">
                    <div className="loading-bar-fill" ref={loadingBarRef} />
                </div>
                <div className="loading-perc" ref={loadingPercRef}>0%</div>
            </div>

            <section className="sequence-section" id="sequenceSection">
                <div className="sequence-sticky">
                    <canvas ref={canvasRef} id="sequenceCanvas" />
                    <canvas ref={particleRef} className="particle-overlay" />
                    <div className="glint-overlay" ref={glintRef} />

                    <div className="seq-progress-bar">
                        <div className="seq-progress-fill" ref={progressRef} />
                    </div>

                    {/* Beat A */}
                    <div className="beat" ref={el => beatRefs.current[0] = el}>
                        <div className="beat-inner">
                            <div className="beat-label">01 / Origin</div>
                            <h2 className="beat-title">ORGANIC<br />ARCHITECTURE.</h2>
                            <p className="beat-sub">The perfect geometry of the<br />Crimson Sweet variety.</p>
                        </div>
                    </div>

                    {/* Beat B */}
                    <div className="beat" ref={el => beatRefs.current[1] = el}>
                        <div className="beat-inner beat-right">
                            <div className="beat-label">02 / Action</div>
                            <h2 className="beat-title">THE KINETIC<br />STRIKE.</h2>
                            <p className="beat-sub">Precision-sliced at the<br />peak of hydration.</p>
                        </div>
                    </div>

                    {/* Beat C */}
                    <div className="beat" ref={el => beatRefs.current[2] = el}>
                        <div className="beat-inner">
                            <div className="beat-label">03 / Physics</div>
                            <h2 className="beat-title">HYDRATION<br />IN ORBIT.</h2>
                            <p className="beat-sub">A zero-gravity explosion of<br />92% alkaline water &amp; lycopene.</p>
                        </div>
                    </div>

                    {/* Beat D */}
                    <div className="beat" ref={el => beatRefs.current[3] = el}>
                        <div className="beat-inner beat-right">
                            <div className="beat-label">04 / Future</div>
                            <h2 className="beat-title">HARVEST<br />THE FUTURE.</h2>
                            <p className="beat-sub">Premium botanicals delivered<br />to your door.</p>
                            <a href="#shop" className="beat-cta" onClick={onShopClick}>Shop the Collection</a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
