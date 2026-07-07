import Link from 'next/link';
import { MapPin } from 'lucide-react';

const areas = [
  { name: 'Bucaramanga', description: 'Capital de Santander', href: '/zonas/fumigacion-bucaramanga' },
  { name: 'Floridablanca', description: 'Sede principal — Cra. 36 #197-30', href: '/zonas/fumigacion-floridablanca' },
  { name: 'Piedecuesta', description: 'Cobertura completa', href: '/zonas/fumigacion-piedecuesta' },
  { name: 'Girón', description: 'Cobertura completa', href: '/zonas/fumigacion-giron' },
];

export default function ServiceAreas() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-custom">
        <div className="reveal text-center mb-12">
          <span className="eyebrow">Cobertura</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
            Cobertura en el Área Metropolitana de Bucaramanga
          </h2>
          <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto text-pretty">
            Llevamos más de 40 años ofreciendo servicios de fumigación y control de plagas en los 4 municipios del
            Área Metropolitana de Bucaramanga. Escríbanos por WhatsApp: respondemos en menos de 5 minutos y, desde
            nuestra sede en Floridablanca, coordinamos la visita el mismo día.
          </p>
        </div>
        <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {areas.map((area) => (
            <Link
              key={area.name}
              href={area.href}
              className="group rounded-2xl border border-brand-gray-light/70 bg-white p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-orange/30 hover:shadow-card-hover"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-soft transition-transform duration-300 group-hover:scale-110">
                <MapPin size={26} className="text-brand-orange" />
              </span>
              <h3 className="font-heading font-semibold text-brand-green mt-4 group-hover:text-brand-orange transition-colors">{area.name}</h3>
              <p className="text-brand-gray text-body-sm mt-1">{area.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
