import { Clock, Phone, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import Selector from './Selector';

// Arranque del home: el selector (primera pantalla, fijada mientras se recorren los objetos) y,
// justo después, sobre el verde, lo que antes iba dentro del hero con el mismo texto: la promesa
// de respuesta, el párrafo, WhatsApp, Llamar y las reseñas. WhatsApp además está en la cabecera
// desde el primer pintado (decisión del 14-nov).
export default function HeroRecorrido() {
  return (
    <>
      <Selector />
      <div className="bg-marca-verde pb-16 pt-14 md:pb-24 md:pt-20">
        <div className="container-custom flex flex-col items-center gap-6 text-center">
          <Badge icon={<Clock size={16} />}>Respondemos por WhatsApp en menos de 5 minutos</Badge>
          <p className="max-w-2xl text-pretty text-body-lg text-white/80">
            Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-2.5 sm:w-auto sm:flex-row sm:gap-3">
            <span data-cursor="WhatsApp" className="w-full sm:w-auto">
              <Button variant="primary" href={BUSINESS.whatsappLink} fullWidth>
                Cotizar por WhatsApp
              </Button>
            </span>
            <a
              href={`tel:${BUSINESS.phoneRaw}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading font-semibold text-white ring-2 ring-white/40 transition-colors hover:bg-white hover:text-marca-verde sm:w-auto"
            >
              <Phone size={18} aria-hidden /> Llamar ahora
            </a>
          </div>
          <a
            href={BUSINESS.googleMapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 transition-colors hover:bg-white/10"
          >
            <span className="flex items-center gap-0.5 text-marca-naranja">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className="fill-current" aria-hidden />
              ))}
            </span>
            <span className="text-body-sm font-semibold text-white">{BUSINESS.googleRating}</span>
            <span className="text-body-sm text-white/75">· {BUSINESS.googleReviewCount} reseñas en Google</span>
          </a>
        </div>
      </div>
    </>
  );
}
