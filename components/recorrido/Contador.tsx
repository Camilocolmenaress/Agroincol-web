'use client';

import { useEffect, useRef } from 'react';

// Número que cuenta hasta su valor al aparecer en pantalla. El servidor ya entrega el valor final:
// sin JS (o con reduce-motion) se lee igual.
export default function Contador({ valor, decimales = 0 }: { valor: number; decimales?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const final = valor.toFixed(decimales);
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const inicio = performance.now();
        const paso = (t: number) => {
          const p = Math.min(1, (t - inicio) / 1200);
          const curva = 1 - Math.pow(1 - p, 3);
          el.textContent = p < 1 ? (valor * curva).toFixed(decimales) : final;
          if (p < 1) raf = requestAnimationFrame(paso);
        };
        raf = requestAnimationFrame(paso);
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = final;
    };
  }, [valor, decimales]);

  return (
    <span ref={ref} className="tabular-nums">
      {valor.toFixed(decimales)}
    </span>
  );
}
