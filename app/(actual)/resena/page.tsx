import type { Metadata } from 'next';
import { Star } from 'lucide-react';
import ReviewButton from '@/components/ui/ReviewButton';
import { BUSINESS } from '@/lib/constants';

// Página de captación de reseñas (destino del QR físico de los técnicos).
// noindex: es una utilidad operativa, no debe indexarse ni diluir el SEO.
export const metadata: Metadata = {
  title: 'Deja tu reseña | AGROINCOL',
  description: 'Cuéntanos cómo te fue con nuestro servicio de control de plagas. Tu opinión nos ayuda muchísimo.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://agroincol.com/resena' },
};

export default function ResenaPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-brand-cream px-5 py-16">
      <div className="w-full max-w-md text-center">
        {/* Marca */}
        <p className="font-heading text-sm font-semibold tracking-widest text-brand-green/60 uppercase">
          AGROINCOL
        </p>

        {/* Estrellas */}
        <div className="mt-6 mb-2 flex justify-center gap-1.5" role="img" aria-label="Calificación de 5 estrellas">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-8 w-8 fill-brand-amber text-brand-amber" strokeWidth={1.5} />
          ))}
        </div>

        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-brand-green leading-tight">
          ¿Quedaste satisfecho con el servicio?
        </h1>
        <p className="mt-4 text-base text-brand-gray leading-relaxed">
          Tu reseña en Google nos ayuda a llegar a más familias y negocios de
          Bucaramanga. Toma menos de <span className="font-semibold text-brand-black">30 segundos</span>.
        </p>

        {/* CTA principal */}
        <div className="mt-8">
          <ReviewButton href={BUSINESS.reviewLink} className="w-full text-lg px-8 py-5">
            <Star className="h-5 w-5 fill-current" strokeWidth={0} />
            Dejar mi reseña
          </ReviewButton>
          <p className="mt-3 text-xs text-brand-gray">
            Se abre directo en Google. Solo necesitas tu cuenta (la del celular ya sirve).
          </p>
        </div>

        {/* Pasos rápidos */}
        <div className="mt-10 rounded-2xl bg-white p-6 text-left shadow-soft">
          <p className="font-heading text-sm font-semibold text-brand-green mb-3">Así de fácil:</p>
          <ol className="space-y-2.5 text-sm text-brand-gray">
            <li className="flex gap-3"><span className="font-heading font-bold text-brand-orange">1.</span> Toca el botón de arriba</li>
            <li className="flex gap-3"><span className="font-heading font-bold text-brand-orange">2.</span> Elige las estrellas y escribe una línea</li>
            <li className="flex gap-3"><span className="font-heading font-bold text-brand-orange">3.</span> Publica. ¡Listo, mil gracias!</li>
          </ol>
        </div>

        {/* Canal alterno (neutral, no condicionado) */}
        <p className="mt-8 text-sm text-brand-gray">
          ¿Necesitas algo más?{' '}
          <a
            href={BUSINESS.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-brand-green underline underline-offset-2"
          >
            Escríbenos por WhatsApp
          </a>
        </p>
      </div>
    </div>
  );
}
