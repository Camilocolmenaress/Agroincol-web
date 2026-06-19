import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Award, Clock, MapPin, Phone } from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ServicesGrid from '@/components/sections/ServicesGrid';
import WhyUs from '@/components/sections/WhyUs';
import ServiceAreas from '@/components/sections/ServiceAreas';
import Testimonials from '@/components/sections/Testimonials';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import LazyMap from '@/components/ui/LazyMap';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación y Control de Plagas en Bucaramanga',
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
      <section className="bg-brand-light py-8 md:py-10">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {trustItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-soft">
                    <Icon size={20} className="text-brand-orange" />
                  </span>
                  <span className="text-brand-green font-semibold text-body-sm leading-tight">{item.text}</span>
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

      {/* 6.5 Gradient CTA Band — impulsa llamadas inmediatas */}
      <section className="bg-brand-light pt-section-mobile md:pt-section">
        <div className="container-custom">
          <div className="reveal relative overflow-hidden rounded-3xl bg-orange-gradient px-6 py-10 md:px-12 md:py-14 shadow-premium">
            <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-30" aria-hidden />
            <div className="relative flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
              <div>
                <h2 className="font-heading text-h2-mobile md:text-h2 text-white text-balance">
                  ¿Tiene una plaga ahora? Respondemos en menos de 2 horas
                </h2>
                <p className="text-white/85 text-body-lg mt-3 text-pretty">
                  Atención en Bucaramanga, Floridablanca, Piedecuesta y Girón. Cotización gratis y sin compromiso.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href={`tel:${BUSINESS.phoneRaw}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 font-heading font-semibold text-brand-orange shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover"
                >
                  <Phone size={18} /> Llamar ahora
                </a>
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

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
              <ContactForm formId="home-contact" compact />
            </div>
          </div>

          {/* Google Maps — deferred 5s to protect INP */}
          <LazyMap />
        </div>
      </section>
    </>
  );
}
