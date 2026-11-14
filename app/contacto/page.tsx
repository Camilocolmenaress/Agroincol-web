import type { Metadata } from 'next';
import { Clock, Phone, Star } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ContactForm from '@/components/forms/ContactForm';
import LazyMap from '@/components/ui/LazyMap';
import { BUSINESS } from '@/lib/constants';

// /contacto (14-nov, opción B): el formulario y el mapa que estaban en el home, con el mismo texto
// y la misma lógica (formId "home-contact" para no cortar la medición de leads), más la promesa de
// respuesta, WhatsApp, Llamar y las reseñas que iban en el hero del home.
export const metadata: Metadata = {
  title: 'Contacto: Cotice su Fumigación en Bucaramanga',
  description:
    'Cotice gratis su fumigación o control de plagas en Bucaramanga, Floridablanca, Piedecuesta y Girón. Respondemos por WhatsApp en menos de 5 minutos.',
  alternates: { canonical: 'https://agroincol.com/contacto' },
  openGraph: {
    title: 'Contacto | AGROINCOL',
    description: 'Cotice gratis su fumigación en Bucaramanga. Respondemos por WhatsApp en menos de 5 minutos.',
    url: 'https://agroincol.com/contacto',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function ContactoPage() {
  return (
    <>
      <section className="bg-marca-verde pb-16 pt-28 md:pb-20 md:pt-36">
        <div className="container-custom flex flex-col items-center gap-6 text-center">
          <div className="self-start">
            <Breadcrumbs items={[{ name: 'Inicio', href: '/' }, { name: 'Contacto' }]} />
          </div>
          <h1 className="font-display text-[clamp(3rem,13vw,12rem)] uppercase leading-[0.9] tracking-[-0.03em] text-white">Contacto</h1>
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
      </section>

      {/* 12. Banda de contacto inmediato por WhatsApp */}
      <section className="bg-white pt-section-mobile md:pt-section">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-[32px] bg-marca-verde px-6 py-12 md:px-14 md:py-16">
            <div
              className="pointer-events-none absolute inset-0 bg-[url('/images/patrones/patron-gel-oscuro.webp')] bg-[length:420px] opacity-25"
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
              <div className="max-w-2xl">
                <h2 className="font-display text-[clamp(1.9rem,3.6vw,3rem)] uppercase leading-[0.95] tracking-[-0.02em] text-white text-balance">
                  ¿Tiene una plaga ahora? Respondemos por WhatsApp en menos de 5 minutos
                </h2>
                <p className="mt-4 text-body-lg text-white/80 text-pretty">
                  Atención en Bucaramanga, Floridablanca, Piedecuesta y Girón. Cotización gratis y sin compromiso.
                </p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row" data-cursor="WhatsApp">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-heading font-semibold text-white ring-2 ring-white/40 transition-colors hover:bg-white hover:text-marca-verde"
                >
                  <Phone size={18} aria-hidden /> Llamar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 13. Formulario de contacto (sin cambios de lógica) */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5 lg:gap-12">
            <div className="lg:col-span-2">
              <h2 className="font-display text-[clamp(2rem,4vw,3.2rem)] uppercase leading-[0.95] tracking-[-0.02em] text-marca-verde">
                Proteja su Hogar o Negocio Hoy
              </h2>
              <p className="mt-4 text-body text-brand-gray">
                Solicite una cotización sin compromiso. Le respondemos por WhatsApp en menos de
                5 minutos para programar su servicio de fumigación.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Respuesta por WhatsApp en menos de 5 minutos',
                  'Certificado válido ante INVIMA',
                  '40+ años de experiencia',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-body text-marca-letra">
                    <span className="punto-gel" aria-hidden /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8" data-cursor="WhatsApp">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  O escríbanos por WhatsApp
                </Button>
              </div>
            </div>

            <div className="lg:col-span-3">
              <ContactForm formId="home-contact" compact />
            </div>
          </div>

          {/* Google Maps — diferido 5 s para proteger el INP */}
          <LazyMap />
        </div>
      </section>

    </>
  );
}
