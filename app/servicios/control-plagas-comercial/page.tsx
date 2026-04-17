import type { Metadata } from 'next';
import Link from 'next/link';
import { Building2, TrendingDown, DollarSign, AlertTriangle, Users, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_COMERCIAL } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Control de Plagas Comercial en Bucaramanga',
  description:
    'Control de plagas para negocios en Bucaramanga. Programa MIP (Manejo Integrado de Plagas), visitas periódicas y certificado para inspecciones. 40+ años de experiencia.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/control-plagas-comercial',
  },
  openGraph: {
    title: 'Control de Plagas Comercial en Bucaramanga | AGROINCOL',
    description:
      'Control de plagas para negocios en Bucaramanga. Programa MIP (Manejo Integrado de Plagas), visitas periódicas y certificado para inspecciones. 40+ años de experiencia.',
    url: 'https://agroincol.com/servicios/control-plagas-comercial',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Control de Plagas Comercial en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Control de Plagas Comercial en Bucaramanga | AGROINCOL',
    description:
      'Control de plagas para negocios en Bucaramanga. Programa MIP (Manejo Integrado de Plagas), visitas periódicas y certificado para inspecciones. 40+ años de experiencia.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Control de Plagas Comercial',
  serviceType: 'Control de Plagas Comercial',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  description:
    'Control de plagas para negocios, locales y establecimientos comerciales en Bucaramanga. Programa MIP documentado, visitas periódicas y certificados para inspecciones.',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '28',
    bestRating: '5',
    worstRating: '1',
  },
  url: 'https://agroincol.com/servicios/control-plagas-comercial',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_COMERCIAL.map((faq) => ({
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
    icon: Users,
    text: 'Pérdida de clientes: una sola reseña negativa mencionando plagas puede destruir años de reputación construida',
  },
  {
    icon: Building2,
    text: 'Daño a mercancía e inventario: roedores y plagas rastreras contaminan y destruyen productos almacenados causando pérdidas directas',
  },
  {
    icon: TrendingDown,
    text: 'Imagen del negocio deteriorada: clientes que detectan plagas rara vez regresan y comparten su experiencia negativa',
  },
  {
    icon: DollarSign,
    text: 'Multas y cierres por inspecciones sanitarias: la Secretaría de Salud puede sancionar negocios con presencia de plagas',
  },
];

export default function ControlPlagasComercialPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Control de Plagas Comercial' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Control de Plagas para Negocios en Bucaramanga"
        subtitle="Proteja la imagen y operación de su negocio. Programa MIP documentado, visitas periódicas y certificado válido para inspecciones sanitarias. Más de 40 años de experiencia en el Área Metropolitana."
        badgeText="Certificado válido para inspecciones sanitarias"
        primaryCta={{ text: 'Cotizar Plan Comercial', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Control de plagas comercial en Bucaramanga — AGROINCOL"
      />

      {/* 2. Riesgos */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Qué Arriesga su Negocio Sin Control de Plagas?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Un solo avistamiento de plagas en su establecimiento puede costarle mucho más que la fumigación. En
            Bucaramanga, los negocios que no implementan un programa profesional de control de plagas enfrentan
            consecuencias serias:
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

      {/* 3. Programa MIP */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Programa MIP: Control Inteligente, No Solo Fumigación
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            El Manejo Integrado de Plagas (MIP) es el estándar profesional para negocios. A diferencia de la
            fumigación puntual, el MIP combina inspección diagnóstica, tratamientos preventivos y correctivos,
            monitoreo periódico y documentación completa.
          </p>
          <p className="text-brand-gray text-body-lg mb-8">
            Para su negocio, esto significa: menos interrupciones operativas, costos más predecibles, y siempre estar
            listo para una inspección sanitaria.
          </p>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>Para inspecciones sanitarias:</strong> AGROINCOL emite certificados que cumplen con el Decreto
                1843 de 1991, válidos ante visitas de la Secretaría de Salud de Santander y el INVIMA.
              </p>
            </div>
          </div>
          <Button variant="primary" href="#contacto">
            Cotizar Plan Comercial
          </Button>
          <p className="mt-4">
            <Link
              href="/herramientas/calculadora-fumigacion"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              Calcule la frecuencia ideal para su negocio con nuestra herramienta gratuita →
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
            Preguntas Frecuentes sobre Control de Plagas Comercial
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_COMERCIAL as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Proteja su Negocio Hoy
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Nuestro equipo se pondrá en contacto con usted en menos de
                2 horas para programar su servicio.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Programa MIP documentado',
                  'Certificado para inspecciones sanitarias',
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
              <ContactForm formId="comercial-contact" preselectedService="Control de Plagas Comercial" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
