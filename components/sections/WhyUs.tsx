import Image from 'next/image';
import { CheckCircle, Shield, Leaf, Clock, MapPin, FileCheck } from 'lucide-react';

const benefits = [
  { icon: CheckCircle, text: 'Más de 40 años de experiencia comprobada en Santander' },
  { icon: Shield, text: 'Técnicos certificados y capacitados constantemente' },
  { icon: Leaf, text: 'Productos seguros aprobados por la OMS y registrados ante el ICA' },
  { icon: Clock, text: 'Respuesta por WhatsApp en menos de 5 minutos en el Área Metropolitana' },
  { icon: MapPin, text: 'Cobertura completa: Bucaramanga, Floridablanca, Piedecuesta y Girón' },
  { icon: FileCheck, text: 'Certificado de fumigación válido ante Secretaría de Salud e INVIMA' },
];

export default function WhyUs() {
  return (
    <section className="section-padding bg-brand-light">
      <div className="container-custom">
        <div className="reveal text-center mb-12">
          <span className="eyebrow">Por qué AGROINCOL</span>
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-3">
            ¿Por Qué Elegir AGROINCOL para su Fumigación?
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="reveal relative aspect-square rounded-3xl overflow-hidden ring-1 ring-brand-green/10 shadow-premium">
            <Image
              src="/images/equipo/equipo-agroincol.webp"
              alt="Equipo completo de AGROINCOL con uniformes y equipos de bioseguridad"
              width={800}
              height={800}
              loading="lazy"
              className="object-cover w-full h-full"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-green-dark/30 to-transparent" aria-hidden />
          </div>

          {/* Benefits — las 6 visibles: en un carrusel quedaban 5 de 6 escondidas */}
          <ul className="reveal grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li
                  key={benefit.text}
                  className="flex h-full items-center gap-4 rounded-2xl bg-white p-5 shadow-card sm:flex-col sm:items-start sm:p-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-soft">
                    <Icon size={24} className="text-brand-orange" />
                  </span>
                  <p className="text-brand-black text-body text-pretty">{benefit.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
