import { Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import Objeto from './Objeto';
import { objetoPorId } from './objetos';
import HeroFichaMotor from './HeroFichaMotor';

type Props = {
  title: string;
  subtitle: string;
  badgeText?: string;
  primaryCta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  objeto?: string;
  // Etiqueta lateral izquierda (adorno), como "Savoury" en la referencia.
  etiqueta: string;
};

// Hero de servicio con la ficha de producto de agrumeafarm.it (docs/rediseno/descomposicion-agrumea
// §4.10): el H1 gigante (mismo texto) y el objeto asomando por abajo a escala 1,25. Con los primeros
// 40 % de pantalla de scroll el objeto sube, baja a 0,8, gira 20° y termina cruzando el título,
// que casi no se mueve. Debajo, la introducción entre puntos de gel (con espacio para que el
// objeto caiga) y los mismos botones y reseñas de antes. Todo sale del servidor en su sitio.
export default function HeroFicha({ title, subtitle, badgeText, primaryCta, secondaryCta, objeto, etiqueta }: Props) {
  const o = objeto ? objetoPorId(objeto) : undefined;
  const largo = title.length > 52;
  return (
    <>
      <section className="ficha-hero" data-ficha-hero>
        <h1 className={`ficha-titulo ${largo ? 'ficha-titulo-largo' : ''}`}>{title}</h1>
        <span className="ficha-lado ficha-lado-izq" aria-hidden>
          {etiqueta}
        </span>
        <span className="ficha-lado ficha-lado-der" aria-hidden>
          Desde 1985 · Santander
        </span>
        {o && (
          <div className="ficha-objeto" data-destino-vuelo>
            <Objeto objeto={o} decorativo prioridad="alta" sizes="(max-width: 1024px) 70vw, 30vw" className="h-auto w-full" />
          </div>
        )}
        <HeroFichaMotor />
      </section>

      <section className="ficha-intro">
        <span className="punto-gel ficha-rombo" aria-hidden />
        <p className="ficha-intro-texto" data-revelar="lineas">
          {subtitle}
        </p>
        <span className="punto-gel ficha-rombo" aria-hidden />
        {badgeText && <p className="ficha-nota">{badgeText}</p>}
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
      </section>
    </>
  );
}
