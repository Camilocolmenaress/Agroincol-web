import { ExternalLink, Star } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

// Prueba social verificable: rating real del Google Business Profile.
// No mostrar testimonios individuales que no provengan de reseñas reales
// (los anteriores eran inventados — riesgo legal y de penalización de Google).
export default function Testimonials() {
  return (
    <section className="section-padding bg-brand-green">
      <div className="container-custom">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-white text-center mb-10">
          Lo Que Dicen Nuestros Clientes
        </h2>
        <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-8 md:p-10 text-center">
          <div role="img" aria-label="Calificación: 4.9 de 5 estrellas" className="text-[#F59E0B] text-3xl tracking-wider">
            ★★★★★
          </div>
          <p className="font-heading text-white text-3xl md:text-4xl font-bold mt-4">4.9 / 5</p>
          <p className="text-gray-200 text-body mt-2">
            Calificación de nuestros clientes en Google, basada en reseñas verificadas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
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
