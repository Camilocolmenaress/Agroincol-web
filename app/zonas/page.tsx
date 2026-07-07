import type { Metadata } from 'next';
import Link from 'next/link';
import { MapPin, ArrowRight, Clock } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

// Hub de zonas: arregla el breadcrumb que apuntaba a "/" (404 conceptual) y
// concentra autoridad temática sobre la cobertura en el Área Metropolitana.

const ZONAS = [
  {
    name: 'Bucaramanga',
    href: '/zonas/fumigacion-bucaramanga',
    blurb: 'Cobertura barrio por barrio: Cabecera, Centro, Provenza, Real de Minas y zona norte.',
  },
  {
    name: 'Floridablanca',
    href: '/zonas/fumigacion-floridablanca',
    blurb: 'Sede principal en Cra. 36 #197-30. Respuesta en menos de 1 hora.',
  },
  {
    name: 'Piedecuesta',
    href: '/zonas/fumigacion-piedecuesta',
    blurb: 'Cobertura en todo el municipio. Respondemos por WhatsApp en menos de 5 minutos.',
  },
  {
    name: 'Girón',
    href: '/zonas/fumigacion-giron',
    blurb: 'Incluye la zona industrial de Chimitá y el casco urbano.',
  },
];

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Zonas de cobertura AGROINCOL',
  itemListElement: ZONAS.map((z, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: `Fumigación y control de plagas en ${z.name}`,
    url: `https://agroincol.com${z.href}`,
  })),
};

export const metadata: Metadata = {
  title: 'Cobertura en Bucaramanga y el Área Metropolitana',
  description:
    'AGROINCOL presta servicio de fumigación y control de plagas en Bucaramanga, Floridablanca, Piedecuesta y Girón. 40+ años de experiencia y certificación INVIMA en toda el Área Metropolitana.',
  alternates: {
    canonical: 'https://agroincol.com/zonas',
  },
  openGraph: {
    title: 'Zonas de Cobertura | AGROINCOL',
    description:
      'Fumigación y control de plagas en Bucaramanga, Floridablanca, Piedecuesta y Girón. Certificación INVIMA en toda el Área Metropolitana.',
    url: 'https://agroincol.com/zonas',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Cobertura en el Área Metropolitana de Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zonas de Cobertura | AGROINCOL',
    description:
      'Fumigación y control de plagas en Bucaramanga, Floridablanca, Piedecuesta y Girón. Certificación INVIMA.',
  },
};

export default function ZonasHubPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Zonas' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Cobertura en Bucaramanga y el Área Metropolitana"
        subtitle="Llevamos más de 40 años protegiendo hogares, restaurantes y empresas en los cuatro municipios del Área Metropolitana de Bucaramanga. Elija su zona y conozca nuestra cobertura."
        primaryCta={{ text: 'Cotizar gratis', href: '#contacto' }}
        secondaryCta={{ text: 'WhatsApp', href: BUSINESS.whatsappLink }}
        centeredText
      />

      {/* 2. Intro de cobertura */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Servicio en toda el Área Metropolitana
          </h2>
          <p className="text-brand-gray text-body-lg leading-relaxed">
            AGROINCOL atiende control de plagas, fumigación, desratización y control de comején en
            Bucaramanga, Floridablanca, Piedecuesta y Girón. Desde nuestra sede en Floridablanca
            coordinamos visitas a los cuatro municipios con técnicos certificados, productos registrados
            ante el ICA y certificado válido ante el INVIMA entregado el mismo día.
          </p>
        </div>
      </section>

      {/* 3. Grid de zonas */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {ZONAS.map((zona) => (
              <li key={zona.href}>
                <Link
                  href={zona.href}
                  className="group flex h-full flex-col rounded-2xl bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-brand-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-green/10">
                      <MapPin size={22} className="text-brand-green" />
                    </span>
                    <h3 className="font-heading text-h3 font-semibold text-brand-green">{zona.name}</h3>
                  </div>
                  <p className="text-brand-gray text-body mt-4 leading-relaxed flex-1">{zona.blurb}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 font-heading text-body-sm font-semibold text-brand-orange">
                    Ver cobertura en {zona.name}
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4. CTA */}
      <section className="section-padding bg-brand-green">
        <div className="container-custom max-w-3xl text-center">
          <Clock size={36} className="text-brand-orange mx-auto mb-4" />
          <h2 id="contacto" className="font-heading text-h2-mobile md:text-h2 text-white mb-4">
            ¿No encuentra su zona? Escríbanos
          </h2>
          <p className="text-gray-200 text-body-lg leading-relaxed mb-8">
            También atendemos sectores cercanos del Área Metropolitana. Cuéntenos dónde está y le
            confirmamos cobertura y cotización el mismo día.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">Escríbanos por WhatsApp</Button>
          </div>
        </div>
      </section>

      <SchemaMarkup schema={itemListSchema} />
    </>
  );
}
