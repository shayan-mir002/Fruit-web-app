import { useEffect } from 'react';

export function useNavScroll() {
    useEffect(() => {
        const nav = document.getElementById('navbar');
        const handler = () => nav?.classList.toggle('scrolled', window.scrollY > 80);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);
}
