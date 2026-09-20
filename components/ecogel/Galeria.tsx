'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Marcador from './Marcador';
import { GARANTIA } from '@/lib/ecogel';
import { useCarrusel } from './useCarrusel';

// Sección 3 de Lummia: carrusel de 12 encuadres a ancho completo, con scroll-snap
// nativo (sin librería). Punto activo y flechas: useCarrusel.

export interface FotosEcogel {
  enUso?: string;
  producto?: string;
  antes?: string;
  despues?: string;
  equipo?: string;
}

interface Slide {
  etiqueta: string;
  alt: string;
  foto?: keyof FotosEcogel;
}

const SLIDES: Slide[] = [
  { etiqueta: 'Gel aplicándose en la rendija de una cocina', alt: 'Aplicación de EcoGel en una rendija de cocina', foto: 'enUso' },
  { etiqueta: 'Jeringa sobre fondo neutro', alt: 'Jeringa de EcoGel', foto: 'producto' },
  { etiqueta: 'Detrás de la nevera', alt: 'Aplicación de EcoGel detrás de la nevera' },
  { etiqueta: 'Bajo el lavaplatos', alt: 'Aplicación de EcoGel bajo el lavaplatos' },
  { etiqueta: 'Esquina de gabinete', alt: 'Aplicación de EcoGel en la esquina de un gabinete' },
  { etiqueta: 'Zócalo de cocina de restaurante', alt: 'Aplicación de EcoGel en el zócalo de una cocina de restaurante' },
  { etiqueta: 'Antes (cocina)', alt: 'Cocina con cucarachas, antes', foto: 'antes' },
  { etiqueta: 'Después · día 7', alt: 'La misma cocina, día 7', foto: 'despues' },
  { etiqueta: 'Técnico de AGROINCOL aplicando', alt: 'Técnico de AGROINCOL aplicando EcoGel', foto: 'equipo' },
  { etiqueta: 'Caja / kit con la guía', alt: 'Kit de EcoGel con la guía de aplicación' },
  { etiqueta: 'Puntos del tamaño de un grano de arroz (macro)', alt: 'Puntos de gel del tamaño de un grano de arroz' },
  { etiqueta: 'Cliente mostrando la jeringa (UGC)', alt: 'Cliente mostrando la jeringa de EcoGel' },
];

export default function Galeria({ fotos }: { fotos: FotosEcogel }) {
  const { pista, activo, irA } = useCarrusel(SLIDES.length);

  return (
    <section className="container-custom pt-4" aria-roledescription="carrusel" aria-label="Fotos de EcoGel">
      <div className="relative">
        <div
          ref={pista}
          className="relative flex snap-x snap-mandatory overflow-x-auto rounded-2xl [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {SLIDES.map((s, i) => (
            <div key={s.etiqueta} className="relative w-full flex-none snap-start" aria-roledescription="diapositiva" aria-label={`${i + 1} de ${SLIDES.length}`}>
              <Marcador
                etiqueta={s.etiqueta}
                medidas="1200×1200"
                src={s.foto ? fotos[s.foto] : undefined}
                alt={s.alt}
                prioridad={i === 0}
              />
              {i === 0 && (
                <div className="absolute right-3 top-3 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-brand-orange text-center text-white shadow-brand">
                  <span className="font-heading text-2xl font-bold leading-none">{GARANTIA.dias}</span>
                  <span className="text-[10px] font-semibold uppercase leading-tight">días de garantía</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => irA(activo - 1)}
          aria-label="Foto anterior"
          className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-soft"
        >
          <ChevronLeft size={22} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => irA(activo + 1)}
          aria-label="Foto siguiente"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-soft"
        >
          <ChevronRight size={22} aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Ir a la foto">
        {SLIDES.map((s, i) => (
          <button
            key={s.etiqueta}
            type="button"
            role="tab"
            aria-selected={i === activo}
            aria-label={`Foto ${i + 1}`}
            onClick={() => irA(i)}
            className={`h-2 rounded-full transition-all ${i === activo ? 'w-5 bg-brand-green' : 'w-2 bg-brand-gray-light'}`}
          />
        ))}
      </div>
    </section>
  );
}
