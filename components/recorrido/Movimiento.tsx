'use client';

import { useEffect } from 'react';

// Capa de movimiento del recorrido: mejora progresiva. Se carga cuando la página ya pintó y el
// navegador está libre; sin JS o con reduce-motion la página se lee completa y quieta.
// GSAP + ScrollTrigger para la caída del foco (el selector tiene su propio motor); Lenis (solo con mouse) para el desplazamiento
// inercial. En táctil queda el scroll nativo.
export default function Movimiento() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let limpiar: (() => void) | undefined;
    let cancelado = false;

    const iniciar = async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
      if (cancelado) return;
      gsap.registerPlugin(ScrollTrigger);

      let quitarLenis = () => {};
      if (window.matchMedia('(pointer: fine)').matches) {
        const { default: Lenis } = await import('lenis');
        if (cancelado) return;
        // Como la referencia: 1,2 s con easeOutExpo (el selector lee targetScroll).
        const lenis = new Lenis({ duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        // La cabecera lo detiene con el menú abierto (si no, la página de atrás se desplaza).
        (window as Window & { __lenis?: { stop: () => void; start: () => void } }).__lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tic = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tic);
        gsap.ticker.lagSmoothing(0);
        quitarLenis = () => {
          gsap.ticker.remove(tic);
          lenis.destroy();
          delete (window as Window & { __lenis?: unknown }).__lenis;
        };
      }

      const ctx = gsap.context(() => {
        // Foco: el objeto cae y queda cruzado entre las dos líneas del titular.
        gsap.fromTo(
          '.foco-caida',
          { yPercent: -170, rotate: -38 },
          {
            yPercent: 0,
            rotate: -10,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.foco', start: 'top 85%', end: 'center 60%', scrub: 0.6 },
          }
        );

      });

      limpiar = () => {
        ctx.revert();
        quitarLenis();
      };
    };

    // Después del primer pintado y con el hilo libre: no compite con el LCP ni con el INP.
    const ric = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number })
      .requestIdleCallback;
    const programar = () => (ric ? ric(() => void iniciar(), { timeout: 2500 }) : window.setTimeout(() => void iniciar(), 1200));
    if (document.readyState === 'complete') programar();
    else window.addEventListener('load', programar, { once: true });

    return () => {
      cancelado = true;
      window.removeEventListener('load', programar);
      limpiar?.();
    };
  }, []);

  return null;
}
