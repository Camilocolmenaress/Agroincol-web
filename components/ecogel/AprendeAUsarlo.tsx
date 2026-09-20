'use client';

import { useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import Marcador from './Marcador';
import { useCarrusel } from './useCarrusel';
import type { VideoAprender } from '@/app/ecogel/fotos';

// Tres videos verticales (9:16, no se recortan) como el bloque "Aprende a
// usarlo" de Lummia. Rotan solos cada 6s, como un carrusel de a uno, y se
// detienen mientras el usuario esté viendo uno (no le quitan el video de
// encima a media reproducción). Mientras no exista un video se ve el
// marcador de esa posición.

const PASOS = [
  { titulo: 'Dónde aplicar', etiqueta: '1 · Dónde aplicar (video 20 s)' },
  { titulo: 'Cuánto poner', etiqueta: '2 · Cuánto poner (video 20 s)' },
  { titulo: 'Qué esperar los primeros días', etiqueta: '3 · Qué esperar los primeros días (video 20 s)' },
];

export default function AprendeAUsarlo({ videos }: { videos: (VideoAprender | undefined)[] }) {
  const { pista, activo, irA } = useCarrusel(PASOS.length);
  const reproduciendo = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (!reproduciendo.current) irA((activo + 1) % PASOS.length);
    }, 6000);
    return () => clearInterval(id);
  }, [activo, irA]);

  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">Aprende a usarlo con AGROINCOL</h2>
      <p className="mt-1 text-body text-brand-black/70">Spoiler: son diez minutos</p>

      <div className="relative mt-4 mx-auto max-w-[280px]">
        <div
          ref={pista}
          className="relative flex snap-x snap-mandatory overflow-x-auto rounded-2xl [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {PASOS.map((p, i) => {
            const video = videos[i];
            return (
              <div key={p.etiqueta} className="relative w-full flex-none snap-start">
                {video ? (
                  <video
                    src={video.src}
                    poster={video.poster}
                    controls
                    playsInline
                    preload="metadata"
                    className="aspect-[9/16] w-full rounded-2xl bg-black object-contain"
                    onPlay={() => (reproduciendo.current = true)}
                    onPause={() => (reproduciendo.current = false)}
                    onEnded={() => (reproduciendo.current = false)}
                  />
                ) : (
                  <div className="relative">
                    <Marcador etiqueta={p.etiqueta} medidas="1080×1920" ratio="portrait" className="!justify-end !p-2 [&>p]:text-[11px] [&>p]:leading-tight [&>p:last-child]:hidden [&>svg]:hidden" />
                    <span
                      className="pointer-events-none absolute left-1/2 top-[32%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-green/90 text-white shadow-soft"
                      aria-hidden
                    >
                      <Play size={20} fill="currentColor" className="ml-0.5" />
                    </span>
                  </div>
                )}
                <p className="mt-2 text-center text-body-sm font-semibold leading-tight text-brand-green">
                  {i + 1}. {p.titulo}
                </p>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => irA(activo - 1)}
          aria-label="Video anterior"
          className="absolute left-2 top-[38%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-soft"
        >
          <ChevronLeft size={20} aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => irA(activo + 1)}
          aria-label="Video siguiente"
          className="absolute right-2 top-[38%] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-brand-green shadow-soft"
        >
          <ChevronRight size={20} aria-hidden />
        </button>
      </div>

      <div className="mt-3 flex justify-center gap-1.5" role="tablist" aria-label="Ir al video">
        {PASOS.map((p, i) => (
          <button
            key={p.etiqueta}
            type="button"
            role="tab"
            aria-selected={i === activo}
            aria-label={`Video ${i + 1}`}
            onClick={() => irA(i)}
            className={`h-2 rounded-full transition-all ${i === activo ? 'w-5 bg-brand-green' : 'w-2 bg-brand-gray-light'}`}
          />
        ))}
      </div>
    </section>
  );
}
