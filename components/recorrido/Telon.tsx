'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Telón entre páginas, como el de agrumeafarm.it: un panel verde sube desde abajo y cubre
// (0,9 s), la página cambia por debajo y el panel sigue subiendo y destapa (0,975 s), con una
// línea menta que barre. Solo en navegación interna del sitio v2 con clic normal.
// No interviene en: clics con modificador o _blank, enlaces a la misma página o solo con #,
// /alivio y las landings, el vuelo del objeto del home, Atrás/Adelante, ni con reduce-motion.
const CUBRIR = 900;
const LEVANTAR = 975;
const CURVA = 'cubic-bezier(.645,.045,.355,1)';
const TOPE = 3500; // si la página nueva no llega, el telón se levanta igual

const FUERA = /^\/(alivio|lp|ecogel|tienda)(\/|$)/;

export default function Telon() {
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const linea = useRef<HTMLSpanElement>(null);
  const estado = useRef<{ fase: 'libre' | 'cubriendo' | 'cubierto'; destino: string; tope: number }>({ fase: 'libre', destino: '', tope: 0 });

  const levantar = () => {
    const el = panel.current;
    if (!el) return;
    window.clearTimeout(estado.current.tope);
    // Dos cuadros: la página nueva ya pintó debajo.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const a = el.animate([{ transform: 'translateY(-100%)' }, { transform: 'translateY(-205%)' }], {
          duration: LEVANTAR,
          easing: CURVA,
          fill: 'forwards',
        });
        a.onfinish = () => {
          el.style.visibility = 'hidden';
          a.cancel();
          estado.current.fase = 'libre';
          document.body.removeAttribute('data-telon');
        };
      })
    );
  };

  useEffect(() => {
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const clic = (e: MouseEvent) => {
      if (quieto || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (estado.current.fase !== 'libre' || document.documentElement.hasAttribute('data-vuelo')) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.href || a.hasAttribute('download') || a.hasAttribute('data-sin-telon')) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || FUERA.test(url.pathname)) return;
      // Navegación nuestra: el Link de Next ve defaultPrevented y no navega por su cuenta.
      e.preventDefault();
      const el = panel.current;
      if (!el) return;
      const destino = url.pathname + url.search + url.hash;
      estado.current = { fase: 'cubriendo', destino, tope: 0 };
      document.body.setAttribute('data-telon', '');
      el.style.visibility = 'visible';
      linea.current?.animate([{ transform: 'scaleX(0)', opacity: 0 }, { opacity: 1, offset: 0.12 }, { transform: 'scaleX(1)', opacity: 0 }], {
        duration: 1250,
        easing: 'cubic-bezier(.165,.84,.44,1)',
      });
      const a1 = el.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], {
        duration: CUBRIR,
        easing: CURVA,
        fill: 'forwards',
      });
      a1.onfinish = () => {
        estado.current.fase = 'cubierto';
        router.push(destino);
        estado.current.tope = window.setTimeout(levantar, TOPE);
      };
    };
    // Captura en window: corre antes que el onClick de los <Link>.
    window.addEventListener('click', clic, true);
    return () => window.removeEventListener('click', clic, true);
  }, [router]);

  // La página nueva llegó: se levanta el telón.
  useEffect(() => {
    if (estado.current.fase === 'cubierto' && estado.current.destino.split(/[?#]/)[0] === pathname) levantar();
  }, [pathname]);

  return (
    <div ref={panel} className="telon" aria-hidden>
      <span ref={linea} className="telon-linea" />
    </div>
  );
}
