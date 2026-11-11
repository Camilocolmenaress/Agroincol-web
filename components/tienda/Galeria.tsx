'use client';

import Image from 'next/image';
import { BookOpen, FoldVertical, Hand, Ruler } from 'lucide-react';
import { useCarrusel } from '@/components/ecogel/useCarrusel';

// Galería de Grüns: foto grande con los beneficios escritos encima en la
// primera, y fila de miniaturas debajo. Deslizar con el dedo es scroll-snap
// nativo; useCarrusel solo sincroniza la miniatura activa.

export interface Foto {
  src: string;
  alt: string;
  /** Diagramas de la guía: se muestran enteros sobre fondo menta, sin recorte. */
  diagrama?: boolean;
}

const LLAMADOS = [
  { Icono: FoldVertical, texto: 'Se dobla en L contra la pared' },
  { Icono: Ruler, texto: 'Abierta: 31 × 21 cm' },
  { Icono: Hand, texto: 'Se agarra por el borde verde' },
  { Icono: BookOpen, texto: 'Guía de ubicación incluida' },
];

export default function Galeria({ fotos }: { fotos: Foto[] }) {
  const { pista, activo, irA } = useCarrusel(fotos.length);
  return (
    // Escritorio: miniaturas en columna a la izquierda de la foto, como Grüns.
    <section aria-roledescription="carrusel" aria-label="Fotos de las Láminas de Captura" className="lg:flex lg:flex-row-reverse lg:items-start lg:gap-3">
      <div
        ref={pista}
        tabIndex={0}
        aria-label="Fotos: deslice o use las flechas"
        className="flex snap-x snap-mandatory overflow-x-auto rounded-2xl lg:min-w-0 lg:flex-1 border border-brand-green/10 bg-brand-mint [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green"
        style={{ scrollbarWidth: 'none' }}
      >
        {fotos.map((f, i) => (
          <div key={f.src} className="relative aspect-square w-full flex-none snap-start" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${fotos.length}`}>
            <Image
              src={f.src}
              alt={f.alt}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              priority={i === 0}
              className={f.diagrama ? 'object-contain p-3' : 'object-cover'}
            />
            {i === 0 && (
              <ul className="absolute left-3 top-3 w-[46%] space-y-1.5 rounded-xl bg-white/90 p-2.5 shadow-soft backdrop-blur-sm sm:w-[40%]">
                {LLAMADOS.map(({ Icono, texto }) => (
                  <li key={texto} className="flex items-center gap-2 text-[12px] font-semibold leading-tight text-brand-green">
                    <Icono size={16} className="flex-none text-brand-orange" aria-hidden />
                    {texto}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1 lg:mt-0 lg:flex-none lg:flex-col lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }} role="tablist" aria-label="Ir a la foto">
        {fotos.map((f, i) => (
          <button
            key={f.src}
            type="button"
            role="tab"
            aria-selected={i === activo}
            aria-label={`Foto ${i + 1}: ${f.alt}`}
            onClick={() => irA(i)}
            className={`relative h-14 w-14 flex-none overflow-hidden rounded-lg border-2 bg-brand-mint transition-colors ${
              i === activo ? 'border-brand-green' : 'border-transparent opacity-70'
            }`}
          >
            <Image src={f.src} alt="" fill sizes="56px" className={f.diagrama ? 'object-contain p-0.5' : 'object-cover'} />
          </button>
        ))}
      </div>
    </section>
  );
}
