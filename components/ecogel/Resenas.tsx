import { RESENAS_ECOGEL, resumenResenas } from '@/lib/ecogel-resenas';
import Marcador from './Marcador';
import { Estrellas, NombreVerificado } from './Estrellas';

// Bloque de reseñas al final, estilo Lummia: resumen con distribución, fotos de
// clientes (UGC), chips de palabras y la lista con fecha, sello y foto enviada.
// Las reseñas placeholder siguen con borde punteado y etiqueta visible.

const CHIPS = ['Excelente', 'Recomendado', 'Sin olor', 'Fácil', 'Funciona', 'Rápido'];

const OCULTAR_SCROLL = 'flex snap-x gap-3 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden';

function fechaLegible(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function Resenas() {
  const r = resumenResenas();
  const niveles: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];
  return (
    <section id="resenas" className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Lo que dicen quienes ya lo usaron</h2>
      {r.esEjemplo && (
        <p className="mt-2 inline-block rounded bg-brand-orange/15 px-2 py-1 text-body-sm font-semibold text-brand-orange-dark">
          Reseñas de ejemplo: reemplazar por reseñas reales antes de pautar
        </p>
      )}

      {/* (a) Resumen */}
      <div className="mt-4 flex items-center gap-5 rounded-2xl bg-brand-light p-4">
        <div className="text-center">
          <p className="font-heading text-5xl font-bold leading-none text-brand-green">{r.promedio}</p>
          <div className="mt-1.5 flex justify-center">
            <Estrellas n={Math.round(r.promedio)} size={14} />
          </div>
          <p className="mt-1 text-body-sm text-brand-black/60">{r.total} opiniones</p>
        </div>
        <ul className="flex-1 space-y-1">
          {niveles.map((n) => (
            <li key={n} className="flex items-center gap-2 text-body-sm">
              <span className="w-8">{n} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded bg-brand-gray-light">
                <span className="block h-full bg-brand-amber" style={{ width: `${r.total ? (r.distribucion[n] / r.total) * 100 : 0}%` }} />
              </span>
              <span className="w-6 text-right text-brand-black/60">{r.distribucion[n]}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* (b) Fotos de clientes */}
      <div className={`mt-4 ${OCULTAR_SCROLL}`} style={{ scrollbarWidth: 'none' }} aria-label="Fotos enviadas por clientes">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-28 flex-none snap-start">
            <Marcador etiqueta={`Foto de cliente ${i} · UGC`} medidas="600×600" className="!rounded-xl !p-2 [&>p]:text-[11px] [&>p]:leading-tight" />
          </div>
        ))}
      </div>

      {/* (c) Chips */}
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Lo que más se repite">
        {CHIPS.map((c) => (
          <li key={c} className="rounded-full border border-brand-green/25 bg-white px-3 py-1 text-body-sm font-semibold text-brand-green">
            {c}
          </li>
        ))}
      </ul>

      {/* (d) Lista */}
      <div className="mt-5 space-y-3">
        {RESENAS_ECOGEL.map((res, i) => (
          <article key={i} className={`rounded-2xl p-4 ${res.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-soft'}`}>
            <div className="flex items-center justify-between gap-2">
              <time dateTime={res.fecha} className="text-[11px] font-semibold uppercase tracking-wide text-brand-black/50">
                {fechaLegible(res.fecha)}
              </time>
              {res.placeholder && (
                <span className="rounded bg-brand-orange/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange-dark">Ejemplo</span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <NombreVerificado nombre={res.nombre} ciudad={res.ciudad} />
              <Estrellas n={res.estrellas} size={14} />
            </div>
            <p className="mt-2 text-body-sm text-brand-black/80">“{res.texto}”</p>
            <div className="mt-3 w-60 max-w-full">
              <Marcador etiqueta="Foto enviada por el cliente" medidas="600×600" className="!rounded-xl" />
            </div>
          </article>
        ))}
      </div>

      {/* (e) */}
      <p className="mt-4 text-body-sm text-brand-black/55">Reseñas recogidas por WhatsApp después de la entrega.</p>
    </section>
  );
}
