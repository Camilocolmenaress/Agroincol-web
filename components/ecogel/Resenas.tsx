import { Star } from 'lucide-react';
import { RESENAS_ECOGEL, resumenResenas } from '@/lib/ecogel-resenas';

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
      <div className="mt-4 flex items-center gap-5">
        <div className="text-center">
          <p className="font-heading text-5xl font-bold text-brand-green">{r.promedio}</p>
          <p className="text-body-sm text-brand-black/60">{r.total} opiniones</p>
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
      <div className="mt-5 space-y-3">
        {RESENAS_ECOGEL.map((res, i) => (
          <article key={i} className={`rounded-2xl p-4 ${res.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-soft'}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-heading text-body-sm font-bold text-brand-green">
                {res.nombre} · {res.ciudad}
              </p>
              <span className="flex text-brand-amber" aria-label={`${res.estrellas} de 5`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= res.estrellas ? 'currentColor' : 'none'} />
                ))}
              </span>
            </div>
            <p className="text-brand-black/80 text-body-sm mt-2">{res.texto}</p>
            {res.placeholder && <p className="mt-2 text-[11px] font-bold uppercase text-brand-orange-dark">Ejemplo — reemplazar por reseña real</p>}
          </article>
        ))}
      </div>
      <p className="mt-4 text-body-sm text-brand-black/55">Reseñas recogidas por WhatsApp después de la entrega.</p>
    </section>
  );
}
