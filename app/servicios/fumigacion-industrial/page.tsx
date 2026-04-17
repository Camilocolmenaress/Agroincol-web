import type { Metadata } from 'next';
import Link from 'next/link';
import { Factory, ClipboardList, AlertTriangle, TrendingDown, DollarSign, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_INDUSTRIAL } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Fumigación Industrial en Bucaramanga',
  description: 'Fumigación industrial y control de plagas para empresas en Bucaramanga. Protocolo MIP documentado, certificados para auditorías INVIMA y Secretaría de Salud. Experiencia en plantas de producción y bodegas.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/fumigacion-industrial',
  },
  openGraph: {
    title: 'Fumigación Industrial en Bucaramanga | AGROINCOL',
    description: 'Fumigación industrial y control de plagas para empresas en Bucaramanga. Protocolo MIP documentado, certificados para auditorías INVIMA y Secretaría de Salud. Experiencia en plantas de producción y bodegas.',
    url: 'https://agroincol.com/servicios/fumigacion-industrial',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación Industrial en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación Industrial en Bucaramanga | AGROINCOL',
    description: 'Fumigación industrial y control de plagas para empresas en Bucaramanga. Protocolo MIP documentado, certificados para auditorías INVIMA y Secretaría de Salud. Experiencia en plantas de producción y bodegas.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Fumigación Industrial',
  serviceType: 'Fumigación Industrial',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  description: 'Fumigación industrial y control de plagas para plantas de producción y bodegas en Bucaramanga. Protocolo MIP con registros para auditorías.',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '28', bestRating: '5', worstRating: '1' },
  url: 'https://agroincol.com/servicios/fumigacion-industrial',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_INDUSTRIAL.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const risks = [
  { icon: TrendingDown, text: 'Pérdida de producto: roedores y plagas rastreras contaminan materias primas, productos terminados y materiales de empaque generando pérdidas directas' },
  { icon: ClipboardList, text: 'Fallas en auditorías: una auditoría sanitaria sin programa de control de plagas documentado puede resultar en suspensión de certificaciones y contratos' },
  { icon: AlertTriangle, text: 'Incumplimiento normativo: el Decreto 1843 de 1991 obliga a todas las empresas que manejan alimentos o productos de consumo a tener un programa activo de control de plagas' },
  { icon: DollarSign, text: 'Daño a maquinaria: roedores que roen cables de equipos industriales generan paradas de producción y reparaciones costosas' },
];

export default function FumigacionIndustrialPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Fumigación Industrial' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Fumigación Industrial y Control de Plagas para Empresas en Bucaramanga"
        subtitle="Protocolo MIP documentado para plantas de producción, bodegas y zonas industriales. Certificados válidos ante INVIMA y Secretaría de Salud. Registros para auditorías de calidad."
        badgeText="Documentación completa para auditorías"
        primaryCta={{ text: 'Solicitar Diagnóstico Industrial', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Fumigación industrial en Bucaramanga — AGROINCOL"
      />

      {/* 2. Risks */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Qué Arriesga su Empresa Sin Control Profesional de Plagas?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            En el entorno industrial, las plagas no son un problema menor. Para plantas de producción, bodegas y
            empresas agroindustriales en Bucaramanga, las consecuencias pueden ser devastadoras:
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

      {/* 3. Differentiator */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Protocolo MIP Industrial: Documentado y Auditable
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            El sector industrial requiere más que fumigación: necesita un programa documentado que resista el
            escrutinio de auditores. El protocolo MIP (Manejo Integrado de Plagas) de AGROINCOL para industria
            incluye diagnóstico inicial, plan de control adaptado a su proceso productivo, aplicaciones programadas
            y registros completos.
          </p>
          <p className="text-brand-gray text-body-lg mb-8">
            Entregamos a cada cliente un expediente con: fichas técnicas de productos utilizados, registros de cada
            intervención firmados por técnico certificado, mapas de ubicación de trampas y estaciones, e informes
            de seguimiento periódicos.
          </p>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>Sector agroindustrial:</strong> AGROINCOL tiene más de 40 años de experiencia atendiendo
                empresas del sector agroindustrial en Santander. Conocemos los requisitos de INVIMA, BPM e ISO 22000
                para el control de plagas en producción de alimentos.
              </p>
            </div>
          </div>
          <Button variant="primary" href="#contacto">
            Solicitar Diagnóstico Industrial
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
            Preguntas Frecuentes sobre Fumigación Industrial
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_INDUSTRIAL as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Proteja su Empresa Hoy
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite un diagnóstico sin compromiso. Nuestro equipo se pondrá en contacto con usted en menos de
                2 horas para programar la evaluación de sus instalaciones.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Diagnóstico gratis y sin compromiso',
                  'Documentación para auditorías incluida',
                  'Certificados INVIMA y Sec. Salud',
                  '40+ años de experiencia industrial',
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
              <ContactForm formId="industrial-contact" preselectedService="Fumigación Industrial" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
