'use client';

import Image from 'next/image';
import { Star } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import type { GoogleReview } from '@/lib/reviews';

// Carrusel continuo de derecha a izquierda. La pista se duplica para que el bucle no
// tenga salto. Se pausa al pasar el mouse y se detiene si el usuario pidió menos
// movimiento (ver .animate-marquee en globals.css).
//
// Por defecto muestra las CAPTURAS de Google: la interfaz de Google es justamente lo
// que prueba que las reseñas son reales y no redactadas por nosotros. Si todavía no
// hay capturas en /public, cae de vuelta a las tarjetas de texto sin romper la página.

export default function ReviewsMarquee({
  reviews,
  images,
}: {
  reviews: GoogleReview[];
  /** Capturas reales de Google. Si viene vacío, se usan las tarjetas de texto. */
  images: string[];
}) {
  const items: (string | GoogleReview)[] = images.length > 0 ? images : reviews;
  const track = [...items, ...items];

  return (
    <section className="overflow-hidden bg-brand-cream py-8 md:py-10">
      <div className="container-custom">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <span className="font-heading text-3xl font-bold text-brand-green">4,9</span>
            <span className="flex text-brand-amber" role="img" aria-label="4,9 de 5 estrellas">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} size={18} fill="currentColor" strokeWidth={0} aria-hidden />
              ))}
            </span>
          </div>
          <p className="text-brand-black/70 text-body-sm">
            33 reseñas en Google · más de 300 servicios este año
          </p>
        </div>
      </div>

      <div className="marquee-wrap group relative mt-5">
        <div className="animate-marquee flex w-max items-center gap-4 group-hover:[animation-play-state:paused]">
          {track.map((item, i) => {
            const hidden = i >= items.length;

            if (typeof item === 'string') {
              return (
                <div key={`${item}-${i}`} className="w-[330px] flex-none sm:w-[480px]" aria-hidden={hidden}>
                  <Image
                    src={item}
                    alt={hidden ? '' : 'Reseña verificada de un cliente en Google'}
                    width={1280}
                    height={320}
                    sizes="(max-width: 640px) 330px, 480px"
                    className="h-auto w-full rounded-xl shadow-soft"
                  />
                </div>
              );
            }

            return (
              <article
                key={`${item.name}-${i}`}
                className="flex w-[300px] flex-none flex-col rounded-2xl bg-white p-5 shadow-soft sm:w-[360px]"
                aria-hidden={hidden}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-brand-green font-heading font-bold text-white">
                    {item.initial}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-brand-black text-body-sm">{item.name}</p>
                    <p className="text-brand-gray text-body-sm">{item.date}</p>
                  </div>
                </div>
                <div className="mt-3 flex text-brand-amber" aria-hidden>
                  {[0, 1, 2, 3, 4].map((s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-2.5 text-brand-black/75 text-body-sm">{item.text}</p>
              </article>
            );
          })}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-brand-cream to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-cream to-transparent" aria-hidden />
      </div>

      <div className="container-custom mt-5 text-center">
        <a
          href={BUSINESS.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-body-sm font-semibold text-brand-green underline underline-offset-4"
        >
          Ver todas las reseñas en Google
        </a>
      </div>
    </section>
  );
}
