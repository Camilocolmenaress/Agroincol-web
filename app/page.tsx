import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Award, Clock, MapPin } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import WhyUs from '@/components/sections/WhyUs';
import ServiceAreas from '@/components/sections/ServiceAreas';
import Testimonials from '@/components/sections/Testimonials';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
  description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com',
  },
  openGraph: {
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
    url: 'https://agroincol.com',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  },
};

const trustItems = [
  { icon: Shield, text: '40+ Años de Experiencia' },
  { icon: Award, text: 'Certificación Vigente' },
  { icon: Clock, text: 'Respuesta < 2 Horas' },
  { icon: MapPin, text: 'Área Metropolitana de Bucaramanga' },
];

export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero
        title="Fumigación y Control de Plagas en Bucaramanga"
        subtitle="Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón."
        badgeText="Respuesta en menos de 2 horas"
        primaryCta={{ text: 'Solicitar Cotización', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Técnico de AGROINCOL realizando fumigación profesional en Bucaramanga"
      />

      {/* 2. Trust Bar */}
      <section className="bg-brand-light py-6 md:py-8">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-center gap-3">
                  <Icon size={24} className="text-brand-orange shrink-0" />
                  <span className="text-brand-green font-semibold text-body-sm">{item.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Calculator & Pricing CTAs */}
      <section className="bg-white py-6">
        <div className="container-custom text-center space-y-2">
          <Link
            href="/herramientas/calculadora-fumigacion"
            className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body transition-colors"
          >
            ¿No sabe cada cuánto fumigar? Use nuestra calculadora gratuita →
          </Link>
          <br />
          <Link
            href="/precios"
            className="inline-flex items-center gap-2 text-brand-green hover:text-brand-orange font-body font-semibold text-body-sm transition-colors"
          >
            Conozca nuestros precios →
          </Link>
        </div>
      </section>

      {/* 3. Services */}
      <ServicesGrid />

      {/* 4. Why Us */}
      <WhyUs />

      {/* 5. Service Areas */}
      <ServiceAreas />

      {/* 6. Testimonials */}
      <Testimonials />

      {/* 7. CTA + Contact Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            {/* Left column — 40% */}
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Proteja su Hogar o Negocio Hoy
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

            {/* Right column — 60% */}
            <div className="lg:col-span-3">
              <ContactForm formId="home-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
