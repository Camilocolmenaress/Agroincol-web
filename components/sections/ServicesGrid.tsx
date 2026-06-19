import { SERVICES } from '@/lib/constants';
import ServiceCard from './ServiceCard';
import Carousel from '@/components/ui/Carousel';
import type { ServiceCardData } from '@/lib/types';

export default function ServicesGrid() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <div className="reveal text-center mb-12">
          <span className="eyebrow">Servicios</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
            Nuestros Servicios de Fumigación y Control de Plagas
          </h2>
          <p className="text-brand-gray text-body-lg mt-4 max-w-2xl mx-auto text-pretty">
            Soluciones profesionales para cada sector en Bucaramanga y el Área Metropolitana
          </p>
        </div>
        {/* Móvil: carrusel deslizable (sin auto) para escanear y elegir. */}
        <div className="reveal md:hidden">
          <Carousel
            align="start"
            controls="dots"
            itemClassName="basis-[84%] sm:basis-[55%]"
            ariaLabel="Nuestros servicios"
          >
            {SERVICES.map((service) => (
              <ServiceCard key={service.slug} service={service as unknown as ServiceCardData} />
            ))}
          </Carousel>
        </div>

        {/* Desktop: grilla completa para escaneo rápido. */}
        <div className="reveal hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service as unknown as ServiceCardData} />
          ))}
        </div>
      </div>
    </section>
  );
}
