import Link from 'next/link';
import { MapPin } from 'lucide-react';

const areas = [
  { name: 'Bucaramanga', description: 'Capital de Santander', href: '/' },
  { name: 'Floridablanca', description: 'Sede principal — Cra 9 #3-34', href: '/zonas/fumigacion-floridablanca' },
  { name: 'Piedecuesta', description: 'Cobertura completa', href: '/zonas/fumigacion-piedecuesta' },
  { name: 'Girón', description: 'Cobertura completa', href: '/zonas/fumigacion-giron' },
];

export default function ServiceAreas() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
            Cobertura en el Área Metropolitana de Bucaramanga
          </h2>
          <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
            Llevamos más de 40 años ofreciendo servicios de fumigación y control de plagas en los 4 municipios del
            Área Metropolitana de Bucaramanga. Nuestra ubicación en Floridablanca nos permite garantizar tiempos de
            respuesta menores a 2 horas.
          </p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {areas.map((area) => (
            <Link key={area.name} href={area.href} className="bg-white rounded-xl p-6 shadow-sm text-center hover:shadow-md transition-shadow group">
              <MapPin size={32} className="text-brand-orange mx-auto" />
              <h3 className="font-heading font-semibold text-brand-green mt-3 group-hover:text-brand-orange transition-colors">{area.name}</h3>
              <p className="text-brand-gray text-body-sm mt-1">{area.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
