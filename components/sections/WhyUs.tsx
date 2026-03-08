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
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
          ¿Por Qué Elegir AGROINCOL para su Fumigación?
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-square rounded-2xl overflow-hidden">
            <Image
              src="/images/equipo/equipo-agroincol.jpg"
              alt="Equipo completo de AGROINCOL con uniformes y equipos de bioseguridad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Benefits */}
          <div className="flex flex-col gap-4">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="flex items-start gap-4">
                  <Icon size={24} className="text-brand-orange shrink-0 mt-0.5" />
                  <p className="text-brand-black text-body">{benefit.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
