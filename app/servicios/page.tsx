import type { Metadata } from 'next';
import Link from 'next/link';
import { Home, Building2, UtensilsCrossed, MousePointer2, Bug, Factory, type LucideIcon } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { SERVICES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Servicios de Fumigación y Control de Plagas | AGROINCOL Bucaramanga',
  description:
    'Control profesional de cucarachas, termitas, roedores, moscas e insectos. Certificados INVIMA para restaurantes. Servicio en Bucaramanga y área metropolitana.',
  alternates: {
    canonical: 'https://agroincol.com/servicios',
  },
  openGraph: {
    title: 'Servicios de Fumigación y Control de Plagas | AGROINCOL Bucaramanga',
    description:
      'Control profesional de cucarachas, termitas, roedores, moscas e insectos. Certificados INVIMA para restaurantes. Servicio en Bucaramanga y área metropolitana.',
    url: 'https://agroincol.com/servicios',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Servicios de Fumigación y Control de Plagas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servicios de Fumigación y Control de Plagas | AGROINCOL Bucaramanga',
    description:
      'Control profesional de cucarachas, termitas, roedores, moscas e insectos. Certificados INVIMA para restaurantes.',
  },
};

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  UtensilsCrossed,
  MousePointer2,
  Bug,
  Factory,
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://agroincol.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Servicios',
      item: 'https://agroincol.com/servicios',
    },
  ],
};

const itemListSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Servicios de Fumigación y Control de Plagas — AGROINCOL',
  url: 'https://agroincol.com/servicios',
  numberOfItems: 6,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Fumigación para Restaurantes',
      url: 'https://agroincol.com/servicios/fumigacion-restaurantes',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Fumigación Residencial',
      url: 'https://agroincol.com/servicios/fumigacion-residencial',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Fumigación Industrial',
      url: 'https://agroincol.com/servicios/fumigacion-industrial',
    },
    {
      '@type': 'ListItem',
      position: 4,
      name: 'Control de Plagas Comercial',
      url: 'https://agroincol.com/servicios/control-plagas-comercial',
    },
    {
      '@type': 'ListItem',
      position: 5,
      name: 'Desratización',
      url: 'https://agroincol.com/servicios/desratizacion',
    },
    {
      '@type': 'ListItem',
      position: 6,
      name: 'Control de Insectos Voladores',
      url: 'https://agroincol.com/servicios/control-insectos-voladores',
    },
  ],
};

export default function ServiciosPage() {
  return (
    <>
      {/* JSON-LD Schemas */}
      <SchemaMarkup schema={breadcrumbSchema} />
      <SchemaMarkup schema={itemListSchema} />

      {/* Breadcrumb visual */}
      <Breadcrumbs
        items={[
          { name: 'Inicio', href: '/' },
          { name: 'Servicios' },
        ]}
      />

      {/* Hero */}
      <section className="bg-brand-green section-padding">
        <div className="container-custom text-center">
          <h1 className="font-heading text-h1-mobile md:text-h1 text-white">
            Nuestros Servicios de Control de Plagas
          </h1>
          <p className="text-gray-300 text-body-lg mt-4 max-w-2xl mx-auto">
            Soluciones profesionales y certificadas para hogares, restaurantes e industrias en
            Bucaramanga y el Área Metropolitana.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service) => {
              const IconComponent = iconMap[service.icon] || Bug;
              return (
                <div
                  key={service.slug}
                  className="border border-brand-gray-light rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="bg-brand-orange/10 w-14 h-14 rounded-lg flex items-center justify-center">
                    <IconComponent size={40} className="text-brand-orange" />
                  </div>
                  <h2 className="font-heading font-semibold text-h3 text-brand-green mt-4">
                    {service.title}
                  </h2>
                  <p className="text-brand-gray text-body mt-2">{service.shortDescription}</p>
                  {service.hasPage && service.href && (
                    <Link
                      href={service.href}
                      className="text-brand-orange font-semibold hover:underline mt-4 inline-block"
                    >
                      Más información →
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
