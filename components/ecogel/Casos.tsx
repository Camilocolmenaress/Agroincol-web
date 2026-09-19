import type { Caso } from '@/lib/ecogel';

export default function Casos({ casos }: { casos: Caso[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Casos reales</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {casos.map((c, i) => (
          <article
            key={i}
            className={`rounded-2xl p-5 ${c.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-card'}`}
          >
            {c.placeholder && (
              <p className="mb-2 inline-block rounded bg-brand-orange/15 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-orange-dark">
                Ejemplo — reemplazar por caso real
              </p>
            )}
            <p className="font-heading text-body font-bold text-brand-green">
              {c.nombre}, {c.ciudad}
            </p>
            <p className="text-body-sm text-brand-black/60">
              <span className="font-semibold">Problema:</span> {c.problema}
            </p>
            <p className="mt-3 text-body-sm italic text-brand-black/80">“{c.cita}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
