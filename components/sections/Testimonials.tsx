import { ExternalLink, Star } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { GOOGLE_REVIEWS } from '@/lib/reviews';

// Prueba social verificable: rating real del Google Business Profile + reseñas copiadas
// textualmente de Google (lib/reviews.ts). Nunca testimonios redactados por nosotros
// (los anteriores eran inventados — riesgo legal y de penalización de Google).
// Sin la fecha relativa de Google ("hace 2 meses"): en una página que no se reescribe
// cada mes, quedaría desactualizada.
const DESTACADAS = ['karen T', 'Lorena Mueguez', 'andres carvajal'];
const reviews = GOOGLE_REVIEWS.filter((r) => DESTACADAS.includes(r.name));

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden section-padding bg-hero-radial">
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-50" aria-hidden />
      <div className="glow-pulse pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-orange/25 blur-[120px]" aria-hidden />
      <div className="container-custom relative">
        <div className="reveal text-center mb-10">
          <span className="eyebrow">Reseñas reales</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-white mt-3">
            Lo Que Dicen Nuestros Clientes
          </h2>
          <div className="mt-5 inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2.5 ring-1 ring-white/15 backdrop-blur-sm">
            <span className="font-heading text-2xl font-bold text-white">{BUSINESS.googleRating}</span>
            <span role="img" aria-label={`Calificación: ${BUSINESS.googleRating} de 5 estrellas`} className="flex text-brand-amber">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} aria-hidden />
              ))}
            </span>
            <span className="text-white/75 text-body-sm">{BUSINESS.googleReviewCount} reseñas en Google</span>
          </div>
        </div>

        <div className="reveal grid grid-cols-1 md:grid-cols-3 gap-5">
          {reviews.map((r) => (
            <figure
              key={r.name}
              className="flex flex-col rounded-2xl border border-white/15 bg-white/10 p-6 shadow-premium backdrop-blur-md"
            >
              <div className="flex text-brand-amber" aria-hidden>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <blockquote className="mt-4 flex-1 text-white/85 text-body text-pretty">“{r.text}”</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-orange font-heading font-bold text-white">
                  {r.initial}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-semibold text-white text-body-sm capitalize">{r.name}</span>
                  <span className="block text-white/55 text-body-sm">Reseña en Google</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="reveal flex flex-col sm:flex-row gap-3 justify-center mt-10">
          <a
            href={BUSINESS.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-white text-brand-green font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Star size={18} className="text-[#F59E0B]" /> Leer todas las reseñas
          </a>
          <a
            href={BUSINESS.reviewLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <ExternalLink size={18} /> Dejar una reseña
          </a>
        </div>
      </div>
    </section>
  );
}
