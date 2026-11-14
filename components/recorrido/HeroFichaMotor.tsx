'use client';

import { useEffect } from 'react';

// Liga el hero de la ficha al scroll (como el ScrollTrigger con scrub de la referencia): --ph va
// de 0 a 1 en el primer 40 % de pantalla de scroll. El CSS hace el resto (objeto y título).
// Con reduce-motion se queda en 0 (el objeto asomando, quieto).
export default function HeroFichaMotor() {
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>('[data-ficha-hero]');
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const actualizar = () => {
      raf = 0;
      const recorrido = window.innerHeight * 0.4;
      const ph = Math.min(1, Math.max(0, window.scrollY / recorrido));
      hero.style.setProperty('--ph', ph.toFixed(4));
    };
    const alDesplazar = () => {
      if (!raf) raf = requestAnimationFrame(actualizar);
    };
    actualizar();
    window.addEventListener('scroll', alDesplazar, { passive: true });
    window.addEventListener('resize', alDesplazar);
    return () => {
      window.removeEventListener('scroll', alDesplazar);
      window.removeEventListener('resize', alDesplazar);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
