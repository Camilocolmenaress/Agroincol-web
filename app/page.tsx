import type { Metadata } from 'next';
import { Phone } from 'lucide-react';
import HeroRecorrido from '@/components/recorrido/HeroRecorrido';
import Cinta from '@/components/recorrido/Cinta';
import Segmentos from '@/components/recorrido/Segmentos';
import Metodo from '@/components/recorrido/Metodo';
import Galeria from '@/components/recorrido/Galeria';
import Lema from '@/components/recorrido/Lema';
import OtrosServicios from '@/components/recorrido/OtrosServicios';
import Movimiento from '@/components/recorrido/Movimiento';
import AlivioTeaser from '@/components/sections/AlivioTeaser';
import WhyUs from '@/components/sections/WhyUs';
import ServiceAreas from '@/components/sections/ServiceAreas';
import Testimonials from '@/components/sections/Testimonials';
import HomeFAQ from '@/components/sections/HomeFAQ';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import LazyMap from '@/components/ui/LazyMap';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación y Control de Plagas en Bucaramanga',
  description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com',
  },
  openGraph: {
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
    url: 'https://agroincol.com',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  },
};

// Home: el recorrido (rediseño v2, docs/rediseno/plan-fases.md). Todas las secciones de antes siguen
// con su texto; cambia la forma. Todo sale del servidor: sin JS se lee completo y en orden, y el
// movimiento (Movimiento, Cursor) es una capa que llega después del primer pintado.
export default function HomePage() {
  return (
    <>
      {/* 1. Hero: el aro, el H1 y WhatsApp desde el primer pintado; los objetos 3D desfilan */}
      <HeroRecorrido />

      {/* 2. Confianza, como cinta continua sobre el verde */}
      <Cinta />

      {/* 3. ¿Qué necesita proteger? — foco de servicio y segmentos */}
      <Segmentos />

      {/* 4. Cómo trabajamos */}
      <Metodo />

      {/* 5. Galería "Arrastre": marcos en blanco hasta tener fotos reales */}
      <Galeria />

      {/* 6. El lema (Caveat Brush: única vez en la página) */}
      <Lema />

      {/* 7. Servicios */}
      <OtrosServicios />

      {/* 7.5 Alivio — línea hermana (zona /alivio, Multi-Zones). Sin cambios hasta que se decida. */}
      <AlivioTeaser />

      {/* 8. Por qué AGROINCOL */}
      <WhyUs />

      {/* 9. Zonas */}
      <ServiceAreas />

      {/* 10. Prueba social — reseñas reales de Google */}
      <Testimonials />

      {/* 11. FAQ — resuelve objeciones que frenan la conversión */}
      <HomeFAQ />

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

      <Movimiento />
    </>
  );
}
