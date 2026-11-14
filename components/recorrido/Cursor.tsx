'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

// Cursor con texto, como el de agrumeafarm.it: una píldora blanca con el punto de gel que aparece
// solo sobre los elementos con data-cursor ("Ver servicio", "Arrastre", "WhatsApp"), sigue al
// mouse con retraso (lerp 0,12) desplazada 18 px y entra creciendo de 0,4 a 1 en 0,5 s.
// Solo con mouse; el cursor nativo se queda.
export default function Cursor() {
  const [activo, setActivo] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const texto = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  // Al cambiar de página la píldora se va aunque el mouse no se haya movido.
  useEffect(() => {
    if (ref.current) delete ref.current.dataset.visible;
  }, [pathname]);

  useEffect(() => setActivo(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);

  useEffect(() => {
    const el = ref.current;
    if (!activo || !el) return;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let x = -100, y = -100, tx = x, ty = y, raf = 0, ocultar = 0;
    let visible = false;

    const mover = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      const etiqueta = (e.target as Element | null)?.closest?.('[data-cursor]')?.getAttribute('data-cursor');
      if (etiqueta && !document.documentElement.hasAttribute('data-vuelo')) {
        window.clearTimeout(ocultar);
        if (!visible && Math.hypot(tx - x, ty - y) > 80) {
          x = tx;
          y = ty;
        }
        visible = true;
        el.dataset.visible = '';
        if (texto.current && texto.current.textContent !== etiqueta) texto.current.textContent = etiqueta;
      } else if (visible) {
        visible = false;
        window.clearTimeout(ocultar);
        ocultar = window.setTimeout(() => delete el.dataset.visible, 90);
      }
    };
    const paso = () => {
      x += (tx - x) * (quieto ? 1 : 0.12);
      y += (ty - y) * (quieto ? 1 : 0.12);
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      raf = requestAnimationFrame(paso);
    };
    window.addEventListener('pointermove', mover, { passive: true });
    raf = requestAnimationFrame(paso);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.clearTimeout(ocultar);
      cancelAnimationFrame(raf);
    };
  }, [activo]);

  if (!activo) return null;
  return (
    <div ref={ref} className="cursor-marca" aria-hidden>
      <span className="cursor-marca-pildora">
        <span className="punto-gel" />
        <span ref={texto} />
      </span>
    </div>
  );
}
