import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Zap, Bug, AlertCircle, Building2 } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import PestCards from '@/components/sections/PestCards';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS, FAQS_DESRATIZACION } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Desratización en Bucaramanga',
  description: 'Desratización profesional en Bucaramanga y Área Metropolitana. Diagnóstico de puntos de entrada, sellado de vías de acceso y seguimiento post-servicio. 40+ años de experiencia.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/desratizacion',
  },
  openGraph: {
    title: 'Desratización en Bucaramanga | AGROINCOL',
    description: 'Desratización profesional en Bucaramanga y Área Metropolitana. Diagnóstico de puntos de entrada, sellado de vías de acceso y seguimiento post-servicio. 40+ años de experiencia.',
    url: 'https://agroincol.com/servicios/desratizacion',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Desratización en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Desratización en Bucaramanga | AGROINCOL',
    description: 'Desratización profesional en Bucaramanga y Área Metropolitana. Diagnóstico de puntos de entrada, sellado de vías de acceso y seguimiento post-servicio. 40+ años de experiencia.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Desratización',
  serviceType: 'Desratización',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  description: 'Servicio profesional de desratización en Bucaramanga. Diagnóstico de puntos de entrada, eliminación de roedores y sellado de accesos con seguimiento post-servicio.',
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '28', bestRating: '5', worstRating: '1' },
  url: 'https://agroincol.com/servicios/desratizacion',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_DESRATIZACION.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const risks = [
  { icon: Zap, text: 'Daño eléctrico por mordeduras: las ratas roen cables eléctricos causando cortocircuitos que pueden generar incendios estructurales' },
  { icon: Bug, text: 'Contaminación de alimentos: los roedores depositan heces, orina y pelos en cocinas, bodegas y áreas de almacenamiento de alimentos' },
  { icon: AlertTriangle, text: 'Enfermedades graves: leptospirosis, hantavirus y salmonelosis son enfermedades transmitidas por roedores que pueden ser mortales' },
  { icon: Building2, text: 'Daño estructural: ratas y ratones roen tuberías, aislamientos y estructuras de madera debilitando su propiedad gradualmente' },
];

export default function DesratizacionPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Desratización' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Desratización Profesional en Bucaramanga y Área Metropolitana"
        subtitle="Eliminamos ratas y ratones identificando y sellando sus vías de entrada. Diagnóstico profesional, tratamiento efectivo y seguimiento para garantizar que no regresen."
        badgeText="Diagnóstico + eliminación + sellado de accesos"
        primaryCta={{ text: 'Solicitar Diagnóstico Gratis', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Desratización profesional en Bucaramanga — AGROINCOL"
      />

      {/* 2. The Problem */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Los Peligros Reales de los Roedores en su Propiedad
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Los roedores no son solo una molestia: son una amenaza seria para la salud, la seguridad y la estructura de su propiedad. En Bucaramanga, la presencia de alcantarillados, mercados y zonas con alta densidad urbana favorece su proliferación:
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
            Nuestro Método: Eliminar la Causa, No Solo los Síntomas
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            La mayoría de los tratamientos de desratización solo eliminan los roedores visibles. El problema regresa porque las vías de entrada siguen abiertas. En AGROINCOL aplicamos un método de tres pasos que resuelve el problema de raíz.
          </p>
          <ul className="mt-6 space-y-3 mb-8">
            {[
              'Diagnóstico: identificamos todos los puntos de entrada, rutas de tránsito y zonas de anidación de los roedores en su propiedad',
              'Eliminación: aplicamos el tratamiento apropiado (venenos, trampas o combinación) según el nivel de infestación y el tipo de propiedad',
              'Sellado y seguimiento: cerramos las vías de acceso identificadas y hacemos visitas de seguimiento para garantizar que la infestación no regrese',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-brand-black text-body">
                <span className="text-brand-orange">✓</span> {item}
              </li>
            ))}
          </ul>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>¿Sabía que...?</strong> Una pareja de ratas puede producir hasta 2.000 descendientes en un año. Actuar rápido es fundamental para evitar que una infestación pequeña se convierta en un problema mayor.
              </p>
            </div>
          </div>
          <Button variant="primary" href="#contacto">
            Solicitar Diagnóstico Gratis
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
            Preguntas Frecuentes sobre Desratización
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_DESRATIZACION as unknown as Array<{ question: string; answer: string }>} />
          </div>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Solucione el Problema Hoy
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Nuestro equipo se pondrá en contacto con usted en menos de
                2 horas para programar su servicio de desratización.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Diagnóstico gratis y sin compromiso',
                  'Sellado de puntos de entrada incluido',
                  'Seguimiento post-servicio',
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
              <ContactForm formId="desratizacion-contact" preselectedService="Desratización" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
