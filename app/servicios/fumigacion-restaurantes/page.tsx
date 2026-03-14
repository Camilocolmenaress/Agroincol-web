import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Bug, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_RESTAURANTES } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Fumigación para Restaurantes en Bucaramanga | AGROINCOL',
  description: 'Servicio especializado de control de plagas para restaurantes en Bucaramanga. Cumpla con la Resolución 2674 del INVIMA. Certificación válida. Cotización gratis.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/fumigacion-restaurantes',
  },
  openGraph: {
    title: 'Fumigación para Restaurantes en Bucaramanga | AGROINCOL',
    description: 'Servicio especializado de control de plagas para restaurantes en Bucaramanga. Cumpla con la Resolución 2674 del INVIMA.',
    url: 'https://agroincol.com/servicios/fumigacion-restaurantes',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-restaurantes.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Control de Plagas para Restaurantes en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación para Restaurantes en Bucaramanga | AGROINCOL',
    description: 'Servicio especializado de control de plagas para restaurantes en Bucaramanga. Cumpla con la Resolución 2674 del INVIMA.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Fumigación para Restaurantes',
  serviceType: 'Fumigación para Restaurantes',
  provider: {
    '@id': 'https://agroincol.com/#organization',
  },
  areaServed: {
    '@type': 'City',
    name: 'Bucaramanga',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Santander',
    },
  },
  description: 'Servicio especializado de control de plagas para restaurantes en Bucaramanga. Certificación válida ante INVIMA y Secretaría de Salud de Santander.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_RESTAURANTES.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const risks = [
  {
    icon: AlertTriangle,
    text: 'Sanciones del INVIMA que pueden llevar al cierre temporal o definitivo de su establecimiento',
  },
  {
    icon: Bug,
    text: 'Contaminación de alimentos que pone en riesgo la salud de sus clientes',
  },
  {
    icon: TrendingDown,
    text: 'Daño a la reputación de su negocio por quejas de clientes o calificaciones negativas',
  },
  {
    icon: DollarSign,
    text: 'Pérdidas económicas por desperdicio de alimentos contaminados y multas',
  },
];

export default function RestaurantesPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />

      {/* 1. Hero */}
      <Hero
        title="Control de Plagas para Restaurantes en Bucaramanga"
        subtitle="Cumpla con la Resolución 2674 del INVIMA y proteja su establecimiento. Servicio certificado con más de 40 años de experiencia en el sector de alimentos."
        badgeText="Certificado válido ante INVIMA y Secretaría de Salud"
        primaryCta={{ text: 'Proteja su Restaurante', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-restaurantes.jpg"
        imageAlt="Técnico de AGROINCOL inspeccionando cocina de restaurante en Bucaramanga"
      />

      {/* 2. The Problem */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Por Qué los Restaurantes son Vulnerables a las Plagas?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Los establecimientos de alimentos en Bucaramanga y Santander enfrentan condiciones ideales para la
            proliferación de plagas: temperaturas cálidas durante todo el año, alta humedad, y la constante presencia
            de alimentos y residuos orgánicos. Sin un programa profesional de control de plagas, su restaurante está
            en riesgo de:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-red-500" />
                  </div>
                  <p className="text-brand-black text-body">{risk.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Normativa INVIMA */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Cumpla con la Resolución 2674 de 2013 del INVIMA
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            La Resolución 2674 de 2013 del Ministerio de Salud (supervisada por el INVIMA) obliga a todos los
            establecimientos que manipulan alimentos en Colombia a implementar un Plan de Saneamiento que incluya un
            programa de control de plagas. Este programa debe ser ejecutado por una empresa especializada que emita
            certificación válida.
          </p>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>¿Sabía que...?</strong> Las visitas de inspección del INVIMA y la Secretaría de Salud de
                Santander pueden resultar en cierre temporal si su restaurante no cuenta con certificado de fumigación
                vigente.
              </p>
            </div>
          </div>
          <Button variant="primary" href="#contacto">
            Evite sanciones — Cotice ahora
          </Button>
          <p className="mt-4">
            <Link
              href="/herramientas/calculadora-fumigacion"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              Calcule la frecuencia ideal para su restaurante con nuestra herramienta gratuita →
            </Link>
          </p>
        </div>
      </section>

      {/* 4. Process */}
      <ProcessTimeline />

      {/* 5. Pest Cards */}
      <PestCards />

      {/* 6. FAQ */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            Preguntas Frecuentes sobre Fumigación de Restaurantes
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_RESTAURANTES as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Proteja su Restaurante Hoy Mismo
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Nuestro equipo se pondrá en contacto con usted en menos de
                2 horas para programar su servicio de fumigación.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Respuesta en menos de 2 horas',
                  'Certificado válido ante INVIMA',
                  '40+ años de experiencia',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-brand-black text-body">
                    <span className="text-brand-orange">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  O escríbanos por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="restaurantes-contact" preselectedService="Fumigación para Restaurantes" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
