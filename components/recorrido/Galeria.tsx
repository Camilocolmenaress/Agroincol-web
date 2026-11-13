'use client';

import { useEffect, useRef } from 'react';

// Galería "Arrastre" para el antes y después y el equipo trabajando. No hay fotos reales todavía
// y no se usan fotos de IA con personas: los marcos van en blanco hasta que lleguen.
// Sin contenido que leer: aria-hidden. Se arrastra con el mouse y se desliza con el dedo.
const MARCOS = [
  'aspect-[4/3] w-[72vw] md:w-[34vw]',
  'aspect-[3/4] w-[54vw] md:w-[20vw]',
  'aspect-[4/3] w-[72vw] md:w-[30vw]',
  'aspect-square w-[60vw] md:w-[24vw]',
  'aspect-[4/3] w-[72vw] md:w-[32vw]',
];

export default function Galeria() {
  const ref = useRef<HTMLDivElement>(null);

  // Arrastre con el mouse (en táctil ya lo hace el scroll nativo).
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(pointer: fine)').matches) return;
    let x0 = 0, s0 = 0, activo = false;
    const abajo = (e: PointerEvent) => { activo = true; x0 = e.clientX; s0 = el.scrollLeft; el.setPointerCapture(e.pointerId); el.dataset.arrastrando = ''; };
    const mueve = (e: PointerEvent) => { if (activo) el.scrollLeft = s0 - (e.clientX - x0); };
    const arriba = (e: PointerEvent) => { activo = false; delete el.dataset.arrastrando; if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId); };
    el.addEventListener('pointerdown', abajo);
    el.addEventListener('pointermove', mueve);
    el.addEventListener('pointerup', arriba);
    el.addEventListener('pointercancel', arriba);
    return () => {
      el.removeEventListener('pointerdown', abajo);
      el.removeEventListener('pointermove', mueve);
      el.removeEventListener('pointerup', arriba);
      el.removeEventListener('pointercancel', arriba);
    };
  }, []);

  return (
    <section className="bg-white py-16 md:py-24" aria-hidden>
      <div
        ref={ref}
        data-cursor="Arrastre"
        className="galeria flex cursor-grab snap-x snap-mandatory gap-4 md:snap-none overflow-x-auto px-4 [scrollbar-width:none] data-[arrastrando]:cursor-grabbing md:gap-6 md:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {MARCOS.map((c, i) => (
          <div key={i} className={`galeria-marco shrink-0 snap-center rounded-[28px] bg-marca-menta ${c}`} />
        ))}
      </div>
    </section>
  );
}
