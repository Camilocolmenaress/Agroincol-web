import { ExternalLink, Star } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

// Prueba social verificable: rating real del Google Business Profile.
// No mostrar testimonios individuales que no provengan de reseñas reales
// (los anteriores eran inventados — riesgo legal y de penalización de Google).
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
        </div>
        <div className="reveal max-w-2xl mx-auto rounded-3xl border border-white/15 bg-white/10 p-8 md:p-12 text-center shadow-premium backdrop-blur-md">
          <div role="img" aria-label="Calificación: 4.9 de 5 estrellas" className="text-brand-amber text-4xl tracking-wider drop-shadow">
            ★★★★★
          </div>
          <p className="font-heading text-white text-5xl md:text-6xl font-bold mt-5">4.9<span className="text-white/50 text-3xl md:text-4xl"> / 5</span></p>
          <p className="text-white/75 text-body mt-3 text-pretty">
            Calificación de nuestros clientes en Google, basada en 28 reseñas verificadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-7">
            <a
              href={BUSINESS.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-brand-green font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Star size={18} className="text-[#F59E0B]" /> Leer reseñas en Google
            </a>
            <a
              href={BUSINESS.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 border border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ExternalLink size={18} /> Dejar una reseña
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
