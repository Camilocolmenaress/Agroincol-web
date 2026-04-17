import type { Metadata } from 'next';
import Link from 'next/link';
import { Bug, AlertTriangle, AlertCircle, Droplets, Users } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_INSECTOS_VOLADORES } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Control de Insectos Voladores en Bucaramanga',
  description: 'Control profesional de mosquitos, moscas, zancudos, abejas y avispas en Bucaramanga. Prevención de dengue, zika y chikungunya. Tratamiento que elimina huevos y larvas.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/control-insectos-voladores',
  },
  openGraph: {
    title: 'Control de Insectos Voladores en Bucaramanga | AGROINCOL',
    description: 'Control profesional de mosquitos, moscas, zancudos, abejas y avispas en Bucaramanga. Prevención de dengue, zika y chikungunya. Tratamiento que elimina huevos y larvas.',
    url: 'https://agroincol.com/servicios/control-insectos-voladores',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Control de Insectos Voladores en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Control de Insectos Voladores en Bucaramanga | AGROINCOL',
    description: 'Control profesional de mosquitos, moscas, zancudos, abejas y avispas en Bucaramanga. Prevención de dengue, zika y chikungunya. Tratamiento que elimina huevos y larvas.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Control de Insectos Voladores',
  serviceType: 'Control de Insectos Voladores',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  description: 'Control de mosquitos, moscas, zancudos, abejas y avispas en Bucaramanga y Área Metropolitana. Tratamiento que elimina adultos, huevos y larvas.',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '28', bestRating: '5', worstRating: '1' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_INSECTOS_VOLADORES.map((faq) => ({
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
    text: 'Dengue, zika y chikungunya: el mosquito Aedes aegypti, presente en toda el Área Metropolitana, transmite estas enfermedades que pueden requerir hospitalización',
  },
  {
    icon: Bug,
    text: 'Contaminación de alimentos: moscas y otras especies depositan bacterias patógenas en alimentos expuestos en cocinas, restaurantes y mercados',
  },
  {
    icon: Users,
    text: 'Molestia para clientes en negocios: la presencia de moscas o zancudos en establecimientos comerciales genera quejas y afecta directamente las ventas',
  },
  {
    icon: Droplets,
    text: 'Temporada de lluvias (mar-jun, sep-oct): las lluvias crean criaderos en recipientes, canales y zonas con agua estancada, multiplicando la población en pocas semanas',
  },
];

export default function ControlInsectosVoladoresPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/' },
        { name: 'Control de Insectos Voladores' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Control de Mosquitos, Moscas y Zancudos en Bucaramanga"
        subtitle="Prevención de dengue, zika y chikungunya en el Área Metropolitana. Tratamiento profesional que elimina adultos, huevos y larvas. Especialmente efectivo en temporada de lluvias (mar-jun, sep-oct)."
        badgeText="Prevención de dengue, zika y chikungunya"
        primaryCta={{ text: 'Solicitar Control Urgente', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Control de mosquitos y zancudos en Bucaramanga — AGROINCOL"
      />

      {/* 2. The Problem */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Por Qué los Insectos Voladores son una Amenaza Seria?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            En Bucaramanga y el Área Metropolitana, el clima cálido y la presencia de fuentes de agua favorecen la reproducción de insectos voladores durante todo el año. Los riesgos van más allá de la molestia:
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

      {/* 3. Temporada de Lluvias */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Temporada de Lluvias en Bucaramanga: El Pico de Reproducción
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            Las dos temporadas de lluvias en Santander (marzo-junio y septiembre-octubre) generan un aumento explosivo en la población de mosquitos y zancudos. El agua estancada en recipientes, canales de desagüe y zonas sin drenar se convierte en criadero del mosquito Aedes aegypti en tan solo 7 días.
          </p>
          <p className="text-brand-gray text-body-lg mb-8">
            El tratamiento profesional de AGROINCOL no solo elimina los adultos visibles: incluye la aplicación de larvicidas y el tratamiento de posibles criaderos, interrumpiendo el ciclo de reproducción antes de que el problema escale.
          </p>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>¿Tiene un nido de abejas o avispas?</strong> No intente eliminarlo por su cuenta. El retiro de nidos de abejas o avispas requiere equipos de protección especializado. AGROINCOL realiza retiro seguro sin poner en riesgo a su familia o empleados.
              </p>
            </div>
          </div>
          <Button variant="primary" href="#contacto">
            Solicitar Control Urgente
          </Button>
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
            Preguntas Frecuentes sobre Control de Insectos Voladores
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_INSECTOS_VOLADORES as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Protéjase Antes de la Próxima Temporada de Lluvias
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Nuestro equipo se pondrá en contacto con usted en menos de
                2 horas para programar su servicio de control de insectos voladores.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Elimina adultos, huevos y larvas',
                  'Tratamiento seguro cerca de alimentos',
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
              <ContactForm formId="insectos-voladores-contact" preselectedService="Control de Insectos Voladores" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
