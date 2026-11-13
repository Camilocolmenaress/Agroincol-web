'use client';

import { useEffect } from 'react';
import { profundidad, PASO_DESFILE } from './objetos';

// Capa de movimiento del recorrido: mejora progresiva. Se carga cuando la página ya pintó y el
// navegador está libre; sin JS o con reduce-motion la página se lee completa y quieta.
// GSAP + ScrollTrigger para el desfile y la caída; Lenis (solo con mouse) para el desplazamiento
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
        const lenis = new Lenis({ lerp: 0.1 });
        lenis.on('scroll', ScrollTrigger.update);
        const tic = (t: number) => lenis.raf(t * 1000);
        gsap.ticker.add(tic);
        gsap.ticker.lagSmoothing(0);
        quitarLenis = () => {
          gsap.ticker.remove(tic);
          lenis.destroy();
        };
      }

      const ctx = gsap.context(() => {
        const mm = gsap.matchMedia();

        // Desfile (como la referencia): el hero queda fijo mientras los objetos recorren el arco;
        // el del centro, grande y nítido; los de los lados, chicos y borrosos.
        mm.add('(min-width: 1024px)', () => {
          const objetos = gsap.utils.toArray<HTMLElement>('.desfile-objeto');
          if (!objetos.length) return;
          const base = objetos.map((o) => parseFloat(getComputedStyle(o).getPropertyValue('--a')) || 0);
          const recorrido = PASO_DESFILE * Math.max(objetos.length, 2);
          const st = ScrollTrigger.create({
            trigger: '.hero-recorrido',
            start: 'top top',
            end: `+=${Math.min(45 * objetos.length + 45, 260)}%`,
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              objetos.forEach((o, i) => {
                const a = base[i] - recorrido * self.progress;
                const { escala, desenfoque } = profundidad(a);
                o.style.setProperty('--a', `${a}deg`);
                o.style.setProperty('--s', String(escala));
                o.style.setProperty('--b', `${desenfoque}px`);
              });
            },
          });
          return () => st.kill();
        });

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

        // El lema del aro acelera un poco con la velocidad del scroll y vuelve a su paso.
        const giro = document.querySelector<HTMLElement>('.aro-giro')?.getAnimations()[0];
        if (giro) {
          ScrollTrigger.create({
            start: 0,
            end: 'max',
            onUpdate: (self) => {
              const extra = Math.min(Math.abs(self.getVelocity()) / 350, 5);
              if (extra < 0.2) return;
              giro.playbackRate = 1 + extra;
              gsap.to(giro, { playbackRate: 1, duration: 1.4, ease: 'power3.out', overwrite: true });
            },
          });
        }
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
