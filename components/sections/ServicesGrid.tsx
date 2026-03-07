import { SERVICES } from '@/lib/constants';
import ServiceCard from './ServiceCard';
import type { ServiceCardData } from '@/lib/types';

export default function ServicesGrid() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
            Nuestros Servicios de Fumigación y Control de Plagas
          </h2>
          <p className="text-brand-gray text-body-lg mt-4 max-w-2xl mx-auto">
            Soluciones profesionales para cada sector en Bucaramanga y el Área Metropolitana
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <ServiceCard key={service.slug} service={service as unknown as ServiceCardData} />
          ))}
        </div>
      </div>
    </section>
  );
}
