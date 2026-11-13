'use client';

import { useEffect, useRef, useState } from 'react';

// Cursor de la marca: un punto naranja que sigue al mouse y crece con su etiqueta
// ("Ver servicio", "Arrastre", "WhatsApp") sobre los elementos con data-cursor.
// Solo con mouse (pointer: fine). El cursor nativo se queda: esto lo acompaña, no lo reemplaza.
export default function Cursor() {
  const [activo, setActivo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLSpanElement>(null);

  useEffect(() => setActivo(window.matchMedia('(pointer: fine)').matches), []);

  useEffect(() => {
    const el = ref.current;
    if (!activo || !el) return;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = -100, y = -100, tx = x, ty = y, raf = 0;

    const mover = (e: PointerEvent) => {
      tx = e.clientX + 14;
      ty = e.clientY + 14;
      const destino = (e.target as Element | null)?.closest?.('[data-cursor]');
      const etiqueta = destino?.getAttribute('data-cursor');
      if (etiqueta) {
        el.dataset.etiqueta = '';
        if (texto.current && texto.current.textContent !== etiqueta) texto.current.textContent = etiqueta;
      } else {
        delete el.dataset.etiqueta;
      }
    };
    const paso = () => {
      x += (tx - x) * (quieto ? 1 : 0.22);
      y += (ty - y) * (quieto ? 1 : 0.22);
      el.style.setProperty('--cx', `${x}px`);
      el.style.setProperty('--cy', `${y}px`);
      raf = requestAnimationFrame(paso);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    raf = requestAnimationFrame(paso);
    return () => {
      window.removeEventListener('pointermove', mover);
      cancelAnimationFrame(raf);
    };
  }, [activo]);

  if (!activo) return null;
  return (
    <div ref={ref} className="cursor-marca" aria-hidden>
      <span className="cursor-marca-punto">
        <span ref={texto} className="cursor-marca-texto" />
      </span>
    </div>
  );
}
