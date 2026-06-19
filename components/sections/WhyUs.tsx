import Image from 'next/image';
import { CheckCircle, Shield, Leaf, Clock, MapPin, FileCheck } from 'lucide-react';

const benefits = [
  { icon: CheckCircle, text: 'Más de 40 años de experiencia comprobada en Santander' },
  { icon: Shield, text: 'Técnicos certificados y capacitados constantemente' },
  { icon: Leaf, text: 'Productos seguros aprobados por la OMS y registrados ante el ICA' },
  { icon: Clock, text: 'Tiempo de respuesta menor a 2 horas en el Área Metropolitana' },
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

          {/* Benefits */}
          <div className="reveal flex flex-col gap-3">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-soft">
                    <Icon size={22} className="text-brand-orange" />
                  </span>
                  <p className="text-brand-black text-body self-center text-pretty">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
