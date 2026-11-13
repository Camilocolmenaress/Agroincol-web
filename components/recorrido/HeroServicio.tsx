import { Clock, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import Objeto from './Objeto';
import { objetoPorId } from './objetos';

type Props = {
  title: string;
  subtitle: string;
  badgeText?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  // Objeto 3D del servicio (components/recorrido/objetos.ts). Si aún no existe, el hero va sin él.
  objeto?: string;
  // Etiqueta lateral corta (adorno, aria-hidden), p. ej. "Hogar · Santander".
  etiqueta: string;
};

// Hero de página de servicio (rediseño v2), como la ficha de producto de la referencia: el H1 de
// siempre (mismo texto) gigante en mayúsculas, el objeto 3D cruzando su última línea y etiquetas
// a los lados. Debajo, el mismo texto y los mismos botones que antes.
export default function HeroServicio({ title, subtitle, badgeText, primaryCta, secondaryCta, objeto, etiqueta }: Props) {
  const o = objeto ? objetoPorId(objeto) : undefined;
  // Los H1 largos (hasta 10 palabras) bajan de tamaño para no pasar de 4 líneas.
  const largo = title.length > 52;
  return (
    <section className="relative overflow-hidden bg-marca-menta pb-16 pt-6 md:pb-24 md:pt-10">
      <div className="container-custom flex flex-col items-center text-center">
        {badgeText && (
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-body-sm font-semibold text-marca-verde">
            <Clock size={15} className="text-marca-naranja" aria-hidden />
            {badgeText}
          </span>
        )}
        <h1
          className={`relative z-10 mt-6 max-w-[22ch] text-balance font-display uppercase leading-[0.9] tracking-[-0.03em] text-marca-verde ${
            largo ? 'text-[clamp(2.1rem,5.6vw,5rem)]' : 'text-[clamp(2.4rem,7.4vw,6.6rem)]'
          }`}
        >
          {title}
        </h1>

        {/* Fila del objeto: cruza la última línea del título, con las etiquetas a los lados. */}
        <div className={`relative z-20 flex w-full items-center justify-center ${o ? '-mt-[5vw] md:-mt-[3.5vw]' : 'mt-8'}`}>
          <span className="absolute left-0 top-1/2 hidden -translate-y-1/2 font-display text-sm uppercase tracking-[0.18em] text-marca-letra/70 lg:block" aria-hidden>
            {etiqueta}
          </span>
          {o ? (
            <div className="foco-caida w-[min(56vw,360px)] -rotate-[8deg]">
              <Objeto objeto={o} decorativo sizes="(min-width: 768px) 360px, 56vw" className="h-auto w-full" />
            </div>
          ) : (
            <span className="block h-10" aria-hidden />
          )}
          <span className="absolute right-0 top-1/2 hidden -translate-y-1/2 text-right font-display text-sm uppercase tracking-[0.18em] text-marca-letra/70 lg:block" aria-hidden>
            Desde 1985 · Santander
          </span>
        </div>

        <span className="punto-gel mt-2" aria-hidden />
        <p className="mt-6 max-w-2xl text-pretty text-body-lg text-brand-gray">{subtitle}</p>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button variant="primary" href={primaryCta.href}>
            {primaryCta.text}
          </Button>
          {secondaryCta && (
            <Button variant="secondary" href={secondaryCta.href}>
              {secondaryCta.text}
            </Button>
          )}
        </div>
        <a
          href={BUSINESS.googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 transition-colors hover:bg-white/70"
        >
          <span className="flex items-center gap-0.5 text-marca-naranja">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={14} className="fill-current" aria-hidden />
            ))}
          </span>
          <span className="text-body-sm font-semibold text-marca-letra">{BUSINESS.googleRating}</span>
          <span className="text-body-sm text-brand-gray">· {BUSINESS.googleReviewCount} reseñas en Google</span>
        </a>
      </div>
    </section>
  );
}
