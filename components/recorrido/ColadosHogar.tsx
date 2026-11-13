'use client';

import { useEffect, useRef } from 'react';

// Los Colados (manual v2) solo en contexto de hogar: se asoman junto a "Mi hogar" y se van
// volando al pasar el cursor (escritorio) o cuando la fila entra en pantalla (celular: el toque
// navega y no alcanzaría a verse). Siempre pierden y se van; cierre fijo de la marca.
// Decorativos: imágenes de fondo, sin alt, nada que leer dos veces.
const COLADOS = [
  { img: '/images/colados/dona-cuca-cucaracha.webp', clase: 'left-[62%] top-1 w-12 md:left-[45%] md:top-10 md:w-16', d: '0s' },
  { img: '/images/colados/el-pillo-roedor.webp', clase: 'left-[75%] -top-2 w-12 md:left-[50%] md:top-4 md:w-16', d: '0.08s' },
  { img: '/images/colados/don-serenata-zancudo.webp', clase: 'left-[87%] top-0 w-10 md:left-[55%] md:top-9 md:w-14', d: '0.16s' },
];

export default function ColadosHogar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(pointer: fine)').matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.intersectionRatio > 0.9) {
          el.dataset.visto = '';
          io.disconnect();
        }
      },
      { threshold: [0.9] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="colados pointer-events-none absolute inset-0" aria-hidden>
      {COLADOS.map((c) => (
        <span
          key={c.img}
          className={`colado absolute aspect-[3/4] bg-contain bg-bottom bg-no-repeat ${c.clase}`}
          style={{ backgroundImage: `url(${c.img})`, animationDelay: c.d, transitionDelay: c.d }}
        />
      ))}
      <span className="colados-remate absolute right-0 top-1 whitespace-nowrap md:left-[44%] md:right-auto md:top-12 rounded-full bg-marca-verde px-4 py-2 font-display text-sm uppercase tracking-[0.06em] text-white">
        Llegó AGROINCOL. Nos vamos.
      </span>
    </div>
  );
}
