import type { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Bug, ShieldAlert, Home } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import HeroServicio from '@/components/recorrido/HeroServicio';
import Galeria from '@/components/recorrido/Galeria';
import OtrosServicios from '@/components/recorrido/OtrosServicios';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_RESIDENCIAL } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Fumigación Residencial en Bucaramanga',
  description:
    'Fumigación residencial en Bucaramanga y Área Metropolitana. Productos seguros aprobados OMS/ICA, sin riesgo para niños ni mascotas. 40+ años de experiencia. Cotización gratis.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/fumigacion-residencial',
  },
  openGraph: {
    title: 'Fumigación Residencial en Bucaramanga | AGROINCOL',
    description:
      'Fumigación residencial en Bucaramanga y Área Metropolitana. Productos seguros aprobados OMS/ICA, sin riesgo para niños ni mascotas. 40+ años de experiencia. Cotización gratis.',
    url: 'https://agroincol.com/servicios/fumigacion-residencial',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación Residencial en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación Residencial en Bucaramanga | AGROINCOL',
    description:
      'Fumigación residencial en Bucaramanga y Área Metropolitana. Productos seguros aprobados OMS/ICA, sin riesgo para niños ni mascotas. 40+ años de experiencia. Cotización gratis.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Fumigación Residencial',
  serviceType: 'Fumigación Residencial',
  provider: {
    '@id': 'https://agroincol.com/#organization',
  },
  areaServed: [
    {
      '@type': 'City',
      name: 'Bucaramanga',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' },
    },
    {
      '@type': 'City',
      name: 'Floridablanca',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' },
    },
    {
      '@type': 'City',
      name: 'Piedecuesta',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' },
    },
    {
      '@type': 'City',
      name: 'Girón',
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' },
    },
  ],
  description:
    'Servicio de fumigación residencial en Bucaramanga y Área Metropolitana. Productos aprobados por OMS e ICA, seguros para niños y mascotas.',
  url: 'https://agroincol.com/servicios/fumigacion-residencial',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_RESIDENCIAL.map((faq) => ({
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
    icon: Heart,
    text: 'Enfermedades transmitidas por plagas: dengue, leptospirosis, salmonelosis y alergias respiratorias que afectan especialmente a niños y adultos mayores',
  },
  {
    icon: Bug,
    text: 'Contaminación de alimentos en la cocina: cucarachas, hormigas y roedores depositan bacterias en superficies y alimentos almacenados',
  },
  {
    icon: ShieldAlert,
    text: 'Riesgo para mascotas y niños: plagas como pulgas, garrapatas y chinches afectan directamente a los miembros más vulnerables del hogar',
  },
  {
    icon: Home,
    text: 'Daño estructural: roedores que roen cables eléctricos y tuberías, termitas que destruyen madera y estructuras del inmueble',
  },
];

export default function ResidencialPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs tono="claro" items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Fumigación Residencial' },
      ]} />

      {/* 1. Hero */}
      <HeroServicio
        title="Fumigación Residencial en Bucaramanga y Área Metropolitana"
        subtitle="Proteja su hogar y familia con productos seguros aprobados por la OMS y el ICA. Sin riesgo para niños ni mascotas. Más de 40 años de experiencia en Bucaramanga, Floridablanca, Piedecuesta y Girón."
        badgeText="Productos seguros para niños y mascotas"
        primaryCta={{ text: 'Proteja su Hogar', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        objeto="casa"
        etiqueta="Hogar · Familia"
      />

      {/* 2. The Problem */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance mb-6">
            ¿Por Qué Su Hogar Necesita Fumigación Profesional?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Las plagas en el hogar van mucho más allá de ser una molestia. En Bucaramanga y el Área Metropolitana, el
            clima cálido y húmedo durante todo el año crea condiciones ideales para su proliferación. Los riesgos para
            su familia son reales:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {risks.map((risk, index) => {
              const Icon = risk.icon;
              return (
                <div key={index} className="flex items-start gap-4 bg-white rounded-[24px] p-6 border border-marca-verde/15">
                  <div className="bg-marca-menta w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-marca-verde" />
                  </div>
                  <p className="text-brand-black text-body">{risk.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Productos Seguros */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance mb-6">
            Productos Seguros para su Familia
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            En AGROINCOL utilizamos exclusivamente productos registrados ante el ICA (Instituto Colombiano
            Agropecuario) y aprobados por la OMS para uso en zonas residenciales. Esto significa que son efectivos
            contra las plagas pero seguros para las personas, animales domésticos y el medio ambiente cuando se aplican
            correctamente.
          </p>
          <div className="bg-white border-l-4 border-marca-naranja rounded-r-[20px] p-6 mb-8">
            <p className="text-brand-black text-body">
              <strong>¿Sabía que...?</strong> Los productos de fumigación que vendemos en tiendas solo atacan los
              adultos visibles. El tratamiento profesional de AGROINCOL incluye productos que eliminan también larvas y
              huevos, interrumpiendo el ciclo reproductivo de la plaga.
            </p>
          </div>
          <Button variant="primary" href="#contacto">
            Solicitar Fumigación Segura
          </Button>
          <p className="mt-4">
            <Link
              href="/herramientas/calculadora-fumigacion"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              Calcule la frecuencia ideal para su hogar con nuestra herramienta gratuita →
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
          <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance text-center mb-12">
            Preguntas Frecuentes sobre Fumigación Residencial
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_RESIDENCIAL as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* Galería "Arrastre": marcos en blanco hasta tener fotos reales */}
      <Galeria />

      {/* Otros servicios (rediseño v2) */}
      <OtrosServicios excluir="/servicios/fumigacion-residencial" />

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-display text-[clamp(2rem,4.6vw,3.6rem)] uppercase leading-[0.95] tracking-[-0.025em] text-marca-verde text-balance">
                Proteja su Hogar Hoy
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Le respondemos por WhatsApp en menos de
                5 minutos para programar su servicio de fumigación.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Productos seguros para niños y mascotas',
                  'Respuesta por WhatsApp en menos de 5 minutos',
                  '40+ años de experiencia',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-brand-black text-body">
                    <span className="punto-gel" aria-hidden /> {item}
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
              <ContactForm formId="residencial-contact" preselectedService="Fumigación Residencial" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
