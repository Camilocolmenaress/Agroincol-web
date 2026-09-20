import { Play } from 'lucide-react';
import Marcador from './Marcador';

// Tres videos verticales de 20 s, como el bloque "Aprende a usarlo" de Lummia.
// Van entre la garantía y las objeciones: quien ya cree que funciona quiere ver
// que también es fácil. Mientras no existan los videos se ven los marcadores.

const PASOS = [
  { titulo: 'Dónde aplicar', etiqueta: '1 · Dónde aplicar (video 20 s)' },
  { titulo: 'Cuánto poner', etiqueta: '2 · Cuánto poner (video 20 s)' },
  { titulo: 'Qué esperar los primeros días', etiqueta: '3 · Qué esperar los primeros días (video 20 s)' },
];

export default function AprendeAUsarlo() {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">Aprende a usarlo con AGROINCOL</h2>
      <p className="mt-1 text-body text-brand-black/70">Spoiler: son diez minutos</p>
      <div
        className="mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-3"
        style={{ scrollbarWidth: 'none' }}
      >
        {PASOS.map((p, i) => (
          <div key={p.etiqueta} className="relative w-[calc((100%-1.5rem)/3)] min-w-[6rem] flex-none snap-start md:w-auto">
            <Marcador etiqueta={p.etiqueta} medidas="1080×1350" ratio="portrait" className="!justify-end !p-2 [&>p]:text-[11px] [&>p]:leading-tight [&>p:last-child]:hidden [&>svg]:hidden" />
            <span
              className="pointer-events-none absolute left-1/2 top-[32%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand-green/90 text-white shadow-soft"
              aria-hidden
            >
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </span>
            <p className="mt-2 text-center text-body-sm font-semibold leading-tight text-brand-green">
              {i + 1}. {p.titulo}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
