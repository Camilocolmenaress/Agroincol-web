import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Shield, Users, FileCheck, Heart } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Certificaciones y Normativa de Fumigación en Colombia | AGROINCOL',
  description: 'AGROINCOL cumple con el Decreto 1843 de 1991 y la Resolución 2674 de 2013. Certificación de fumigación válida ante INVIMA y Secretaría de Salud en Santander.',
  alternates: {
    canonical: 'https://agroincol.com/certificaciones-y-normativa',
  },
  openGraph: {
    title: 'Certificaciones y Normativa de Fumigación en Colombia | AGROINCOL',
    description: 'AGROINCOL cumple con el Decreto 1843 de 1991 y la Resolución 2674 de 2013. Certificación válida ante INVIMA y Secretaría de Salud.',
    url: 'https://agroincol.com/certificaciones-y-normativa',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificaciones y Normativa de Fumigación en Colombia | AGROINCOL',
    description: 'AGROINCOL cumple con el Decreto 1843 de 1991 y la Resolución 2674 de 2013. Certificación válida ante INVIMA y Secretaría de Salud en Santander.',
  },
};

const decretoItems = [
  'Nuestros técnicos están capacitados y certificados en el manejo seguro de plaguicidas',
  'Utilizamos exclusivamente productos registrados ante el ICA (Instituto Colombiano Agropecuario)',
  'Seguimos protocolos estrictos de seguridad en cada aplicación: elementos de protección personal (EPP), señalización de áreas tratadas y tiempos de reingreso',
  'Almacenamos y transportamos productos según las fichas técnicas y hojas de seguridad (MSDS)',
  'Mantenemos documentación completa de cada servicio: productos utilizados, concentraciones, áreas tratadas y recomendaciones',
];

const certificadoItems = [
  'Fecha y hora del servicio',
  'Productos utilizados con sus registros ICA',
  'Concentraciones y métodos de aplicación',
  'Áreas tratadas',
  'Plagas objetivo',
  'Recomendaciones post-servicio',
  'Firma del técnico responsable',
  'Datos de la empresa (NIT, dirección, teléfono)',
];

const compromisos = [
  { icon: Shield, title: 'Productos Aprobados', text: 'Solo utilizamos productos registrados ante el ICA y aprobados por la OMS' },
  { icon: Users, title: 'Técnicos Capacitados', text: 'Personal certificado con formación continua en control de plagas' },
  { icon: FileCheck, title: 'Documentación Completa', text: 'Certificados, fichas técnicas y reportes de cada servicio' },
  { icon: Heart, title: 'Responsabilidad Ambiental', text: 'Protocolos de aplicación que minimizan el impacto ambiental' },
];

export default function CertificacionesPage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero
        title="Certificaciones y Normativa de Fumigación en Colombia"
        subtitle="En AGROINCOL cumplimos con toda la normativa colombiana vigente en materia de control de plagas y manejo de plaguicidas. Más de 40 años operando bajo los más altos estándares de calidad y seguridad."
        primaryCta={{ text: 'Solicitar Cotización', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        centeredText
      />

      {/* 2. Decreto 1843 */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Decreto 1843 de 1991 — Uso y Manejo de Plaguicidas
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            El Decreto 1843 de 1991 del Ministerio de Salud de Colombia regula el uso, manejo, almacenamiento,
            transporte y aplicación de plaguicidas en el territorio nacional. Este decreto establece que la aplicación
            de plaguicidas debe ser realizada por personal idóneo y debidamente capacitado.
          </p>
          <h3 className="font-heading font-semibold text-h3 text-brand-green mb-4">
            ¿Cómo cumple AGROINCOL?
          </h3>
          <ul className="space-y-3">
            {decretoItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="text-brand-black text-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Resolución 2674 */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Resolución 2674 de 2013 — Establecimientos de Alimentos
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            La Resolución 2674 de 2013 del Ministerio de Salud y Protección Social establece los requisitos
            sanitarios para los establecimientos que realizan actividades de fabricación, procesamiento, preparación,
            envase, almacenamiento, transporte, distribución y comercialización de alimentos.
          </p>
          <h3 className="font-heading font-semibold text-h3 text-brand-green mb-4">
            Obligaciones para establecimientos de alimentos
          </h3>
          <ul className="space-y-3 mb-8">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
              <span className="text-brand-black text-body">
                Todo establecimiento de alimentos debe contar con un Plan de Saneamiento que incluya tres programas:
                limpieza y desinfección, manejo de residuos sólidos, y control de plagas.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
              <span className="text-brand-black text-body">
                El programa de control de plagas debe ser ejecutado por una empresa especializada que emita
                certificación válida.
              </span>
            </li>
          </ul>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                AGROINCOL emite certificados de fumigación que cumplen con los requisitos de la Resolución 2674 y son
                válidos como soporte documental ante inspecciones del INVIMA y la Secretaría de Salud de Santander.
              </p>
            </div>
          </div>
          <Link
            href="/servicios/fumigacion-restaurantes"
            className="text-brand-orange font-semibold hover:underline inline-block"
          >
            ¿Tiene un restaurante? Conozca nuestro servicio especializado →
          </Link>
        </div>
      </section>

      {/* 4. Certificado */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Certificado de Fumigación y Concepto Sanitario
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            Al contratar los servicios de AGROINCOL, usted recibe un certificado de fumigación que incluye:
          </p>
          <ul className="space-y-3 mb-8">
            {certificadoItems.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="text-brand-black text-body">{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-brand-gray text-body mb-8">
            Este certificado es válido como soporte ante la Secretaría de Salud de Santander y el INVIMA para visitas
            de inspección sanitaria.
          </p>
          <div className="relative w-full h-64 md:h-96 max-w-2xl rounded-2xl overflow-hidden">
            <Image
              src="/images/certificaciones/entrega-certificado.jpg"
              alt="Entrega de certificado de fumigación AGROINCOL a cliente en Bucaramanga"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 672px"
            />
          </div>
        </div>
      </section>

      {/* 5. Compromiso */}
      <section className="section-padding bg-brand-green">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-white text-center mb-12">
            Nuestro Compromiso con la Calidad
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compromisos.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="bg-white/10 rounded-xl p-6">
                  <Icon size={32} className="text-brand-orange mb-4" />
                  <h3 className="font-heading font-semibold text-white text-h3">{item.title}</h3>
                  <p className="text-gray-300 text-body mt-2">{item.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              ¿Necesita Certificación de Fumigación?
            </h2>
            <p className="text-brand-gray text-body-lg mt-4">
              Contáctenos para programar su servicio. Emitimos certificado el mismo día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button variant="primary" href="#contacto">
                Solicitar Cotización
              </Button>
              <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                WhatsApp
              </Button>
            </div>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm formId="normativa-contact" />
          </div>
        </div>
      </section>
    </>
  );
}
