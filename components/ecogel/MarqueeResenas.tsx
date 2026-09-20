import { RESENAS_ECOGEL } from '@/lib/ecogel-resenas';
import { Avatar, Estrellas, NombreVerificado } from './Estrellas';

// Franja de reseñas que rota de derecha a izquierda justo bajo la galería, como
// en Lummia. La pista va duplicada para que el bucle no salte (.animate-marquee
// en globals.css: se detiene con prefers-reduced-motion). Las copias van
// aria-hidden para que un lector de pantalla no lea todo dos veces.
//
// Las reseñas con `placeholder` llevan borde punteado y la etiqueta "Ejemplo":
// no se quita con un flag, se quita reemplazando la reseña por una real.

export default function MarqueeResenas() {
  const pista = [...RESENAS_ECOGEL, ...RESENAS_ECOGEL];
  return (
    <section className="mt-6 overflow-hidden" aria-label="Reseñas de clientes">
      <div className="marquee-wrap group relative">
        <div className="animate-marquee flex w-max items-stretch gap-3 px-4 group-hover:[animation-play-state:paused]">
          {pista.map((r, i) => {
            const copia = i >= RESENAS_ECOGEL.length;
            return (
              <article
                key={i}
                aria-hidden={copia}
                className={`relative flex w-[300px] flex-none flex-col justify-between rounded-2xl p-5 ${
                  r.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-soft'
                }`}
              >
                {r.placeholder && (
                  <span className="absolute right-3 top-3 rounded bg-brand-orange/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange-dark">
                    Ejemplo
                  </span>
                )}
                <div>
                  <Estrellas n={r.estrellas} />
                  <p className="mt-3 text-body-sm text-brand-black/85">“{r.texto}”</p>
                </div>
                <div className="mt-4 flex items-center gap-2.5">
                  <Avatar nombre={r.nombre} />
                  <NombreVerificado nombre={r.nombre} />
                </div>
              </article>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-brand-white to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-brand-white to-transparent" aria-hidden />
      </div>
    </section>
  );
}
