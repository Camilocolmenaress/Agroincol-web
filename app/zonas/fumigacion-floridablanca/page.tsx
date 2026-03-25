import type { Metadata } from 'next';
import Link from 'next/link';
import {
  MapPin,
  Shield,
  Clock,
  Award,
  Bug,
  Home,
  Building2,
  UtensilsCrossed,
  Factory,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación en Floridablanca | AGROINCOL',
  description:
    'Servicio de fumigación y control de plagas en Floridablanca, Santander. Sede principal en Cra 9 #3-34. Certificación INVIMA. Respuesta en menos de 1 hora.',
  alternates: {
    canonical: 'https://agroincol.com/zonas/fumigacion-floridablanca',
  },
  openGraph: {
    title: 'Fumigación en Floridablanca | AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Floridablanca, Santander. Sede principal en Cra 9 #3-34. Certificación INVIMA.',
    url: 'https://agroincol.com/zonas/fumigacion-floridablanca',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación en Floridablanca, Santander',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación en Floridablanca | AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Floridablanca, Santander. Sede principal en Cra 9 #3-34. Certificación INVIMA.',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'PestControlService',
  name: 'AGROINCOL — Fumigación en Floridablanca',
  description:
    'Empresa de fumigación y control de plagas con sede principal en Floridablanca, Santander. Más de 40 años de experiencia.',
  url: 'https://agroincol.com/zonas/fumigacion-floridablanca',
  telephone: BUSINESS.phoneRaw,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Cra 9 #3-34',
    addressLocality: 'Floridablanca',
    addressRegion: 'Santander',
    addressCountry: 'CO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 7.0636,
    longitude: -73.0897,
  },
  areaServed: {
    '@type': 'City',
    name: 'Floridablanca',
  },
  foundingDate: '1985',
  priceRange: '$$',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '07:00',
      closes: '12:00',
    },
  ],
};

const services = [
  {
    icon: Home,
    title: 'Fumigación Residencial',
    description:
      'Proteja su casa o apartamento en Floridablanca de cucarachas, hormigas y plagas comunes con productos seguros para su familia.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Fumigación para Restaurantes',
    description:
      'Cumpla con la Resolución 2674 del INVIMA en su restaurante de Floridablanca. Certificado válido ante inspecciones sanitarias.',
  },
  {
    icon: Building2,
    title: 'Control de Plagas Comercial',
    description:
      'Soluciones para locales, oficinas y centros comerciales de Floridablanca como Cañaveral y la zona de La Cumbre.',
  },
  {
    icon: Factory,
    title: 'Fumigación Industrial',
    description:
      'Servicio especializado para bodegas y plantas de producción en la zona industrial de Floridablanca.',
  },
];

const plagas = [
  {
    name: 'Cucarachas',
    detail:
      'El clima cálido de Floridablanca (24°C promedio) y la cercanía a zonas verdes como el Jardín Botánico favorecen la proliferación de cucarachas americanas y alemanas, especialmente en cocinas y baños.',
  },
  {
    name: 'Hormigas',
    detail:
      'Las colonias de hormigas son comunes en los conjuntos residenciales de Cañaveral, Lagos del Cacique y La Cumbre, donde la vegetación abundante les proporciona hábitat ideal.',
  },
  {
    name: 'Mosquitos y zancudos',
    detail:
      'La humedad y las lluvias frecuentes en Floridablanca generan criaderos de mosquitos Aedes aegypti, vector del dengue. Las zonas cercanas a quebradas como La Cascada son especialmente vulnerables.',
  },
  {
    name: 'Roedores',
    detail:
      'Ratas y ratones afectan tanto viviendas como negocios, especialmente en sectores con mayor densidad comercial como el centro de Floridablanca y la vía al Anillo Vial.',
  },
];

export default function FumigacionFloridablancaPage() {
  return (
    <>
      <SchemaMarkup schema={localBusinessSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Zonas', href: '/' },
        { name: 'Fumigación en Floridablanca' },
      ]} />

      {/* Hero */}
      <Hero
        withBreadcrumbs
        title="Fumigación y Control de Plagas en Floridablanca"
        subtitle="Sede principal de AGROINCOL. Más de 40 años protegiendo hogares, restaurantes y empresas en Floridablanca, Santander."
        badgeText="Respuesta en menos de 1 hora"
        primaryCta={{ text: 'Cotizar Gratis', href: '#contacto-zona' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Fumigación profesional en Floridablanca, Santander — AGROINCOL"
      />

      {/* Sede y Cobertura */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Nuestra Sede en Floridablanca
              </h2>
              <p className="text-brand-gray text-body mt-4 leading-relaxed">
                AGROINCOL tiene su <strong>sede principal en la Cra 9 #3-34, Floridablanca</strong>, lo que nos permite
                ofrecer el tiempo de respuesta más rápido del Área Metropolitana de Bucaramanga. Desde aquí coordinamos
                todos nuestros servicios de fumigación y control de plagas para el municipio y sus alrededores.
              </p>
              <p className="text-brand-gray text-body mt-3 leading-relaxed">
                Floridablanca es el segundo municipio más poblado de Santander con más de 270.000 habitantes. Su clima
                cálido, la expansión urbanística en zonas como Cañaveral, Lagos del Cacique y La Cumbre, y la cercanía
                a zonas rurales hacen que el control profesional de plagas sea fundamental tanto para hogares como para
                establecimientos comerciales.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'Cra 9 #3-34', sublabel: 'Sede Principal' },
                { icon: Clock, label: '< 1 Hora', sublabel: 'Tiempo de respuesta' },
                { icon: Shield, label: '40+ Años', sublabel: 'De experiencia' },
                { icon: Award, label: 'Certificados', sublabel: 'INVIMA y Sec. Salud' },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white rounded-xl p-5 text-center shadow-sm">
                    <Icon size={28} className="text-brand-orange mx-auto" />
                    <p className="font-heading font-semibold text-brand-green mt-2 text-sm">{item.label}</p>
                    <p className="text-brand-gray text-xs mt-0.5">{item.sublabel}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Servicios en Floridablanca */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Servicios de Fumigación en Floridablanca
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Ofrecemos soluciones completas de control de plagas adaptadas a las necesidades específicas de
              Floridablanca: desde conjuntos residenciales hasta restaurantes y zonas comerciales.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div key={service.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="bg-brand-orange/10 rounded-lg p-3 shrink-0">
                      <Icon size={24} className="text-brand-orange" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-brand-green text-lg">{service.title}</h3>
                      <p className="text-brand-gray text-body-sm mt-1 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plagas comunes */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Plagas Comunes en Floridablanca
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              El clima y la geografía de Floridablanca favorecen la aparición de ciertas plagas. Conozca cuáles son las
              más frecuentes y por qué es importante actuar a tiempo.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plagas.map((plaga) => (
              <div key={plaga.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start gap-3">
                  <Bug size={20} className="text-brand-orange mt-1 shrink-0" />
                  <div>
                    <h3 className="font-heading font-bold text-brand-green">{plaga.name}</h3>
                    <p className="text-brand-gray text-body-sm mt-1 leading-relaxed">{plaga.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué AGROINCOL en Floridablanca */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-8">
              ¿Por Qué Elegir AGROINCOL en Floridablanca?
            </h2>
            <div className="space-y-4">
              {[
                'Sede principal ubicada en Floridablanca — el tiempo de respuesta más rápido del Área Metropolitana',
                'Más de 40 años de experiencia atendiendo hogares y negocios del municipio',
                'Conocemos cada sector: Cañaveral, Lagos del Cacique, La Cumbre, El Bosque, Centro y más',
                'Productos registrados ante el ICA y aprobados por la OMS, seguros para familias y mascotas',
                'Certificados de fumigación válidos ante INVIMA y Secretaría de Salud de Santander',
                'Planes de mantenimiento preventivo con frecuencia trimestral, bimestral o mensual',
              ].map((benefit) => (
                <div key={benefit} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-orange mt-0.5 shrink-0" />
                  <p className="text-brand-black text-body leading-relaxed">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Normativa y Herramientas */}
      <section className="bg-brand-green py-10">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <Link
              href="/certificaciones-y-normativa"
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors group"
            >
              <Award size={28} className="text-white mx-auto" />
              <h3 className="font-heading font-bold text-white mt-3">Certificaciones y Normativa</h3>
              <p className="text-gray-300 text-body-sm mt-1">
                Decreto 1843 de 1991 y Resolución 2674 de 2013
              </p>
              <span className="inline-flex items-center gap-1 text-brand-orange text-body-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Ver más <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              href="/herramientas/calculadora-fumigacion"
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors group"
            >
              <Clock size={28} className="text-white mx-auto" />
              <h3 className="font-heading font-bold text-white mt-3">Calculadora de Fumigación</h3>
              <p className="text-gray-300 text-body-sm mt-1">
                Calcule cada cuánto debe fumigar su propiedad en Floridablanca
              </p>
              <span className="inline-flex items-center gap-1 text-brand-orange text-body-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Usar calculadora <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              href="/blog"
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors group"
            >
              <Shield size={28} className="text-white mx-auto" />
              <h3 className="font-heading font-bold text-white mt-3">Blog de Control de Plagas</h3>
              <p className="text-gray-300 text-body-sm mt-1">
                Consejos de expertos para proteger su hogar y negocio
              </p>
              <span className="inline-flex items-center gap-1 text-brand-orange text-body-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Leer artículos <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* También atendemos */}
      <section className="py-8 bg-white">
        <div className="container-custom text-center">
          <p className="text-brand-gray text-body">
            También atendemos en:{' '}
            <Link href="/" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
              Bucaramanga
            </Link>
            {', '}
            <Link
              href="/zonas/fumigacion-piedecuesta"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors"
            >
              Piedecuesta
            </Link>
            {' y '}
            <Link
              href="/zonas/fumigacion-giron"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors"
            >
              Girón
            </Link>
          </p>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-brand-light" id="contacto-zona">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Cotice Fumigación en Floridablanca
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Estamos en Floridablanca y llegamos en menos de 1 hora a
                cualquier sector del municipio.
              </p>
              <div className="mt-6">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="floridablanca-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
