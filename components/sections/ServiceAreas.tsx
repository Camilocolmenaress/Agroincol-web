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
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="reveal text-center mb-12">
          <span className="eyebrow">Cobertura</span>
          <h2 className="mt-5 font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance">
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
              data-cursor="Ver zona"
              className="group rounded-[28px] border border-marca-verde/15 bg-marca-menta/50 p-6 text-center transition-[transform,background-color] duration-500 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] hover:-translate-y-1.5 hover:bg-marca-menta"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-marca-verde transition-transform duration-300 group-hover:scale-110">
                <MapPin size={22} className="text-white" aria-hidden />
              </span>
              <h3 className="mt-4 font-display text-xl uppercase tracking-[0.01em] text-marca-verde">{area.name}</h3>
              <p className="text-brand-gray text-body-sm mt-1">{area.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
