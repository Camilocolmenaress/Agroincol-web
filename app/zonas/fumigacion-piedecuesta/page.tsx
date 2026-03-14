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
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación en Piedecuesta | Control de Plagas — AGROINCOL',
  description:
    'Servicio de fumigación y control de plagas en Piedecuesta, Santander. 40+ años de experiencia. Certificación INVIMA. Respuesta en menos de 2 horas.',
  alternates: {
    canonical: 'https://agroincol.com/zonas/fumigacion-piedecuesta',
  },
  openGraph: {
    title: 'Fumigación en Piedecuesta | Control de Plagas — AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Piedecuesta, Santander. 40+ años de experiencia. Certificación INVIMA.',
    url: 'https://agroincol.com/zonas/fumigacion-piedecuesta',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación en Piedecuesta, Santander',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación en Piedecuesta | Control de Plagas — AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Piedecuesta, Santander. 40+ años de experiencia. Certificación INVIMA.',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'PestControlService',
  name: 'AGROINCOL — Fumigación en Piedecuesta',
  description:
    'Empresa de fumigación y control de plagas con cobertura completa en Piedecuesta, Santander. Más de 40 años de experiencia.',
  url: 'https://agroincol.com/zonas/fumigacion-piedecuesta',
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
    latitude: 6.9908,
    longitude: -73.0522,
  },
  areaServed: {
    '@type': 'City',
    name: 'Piedecuesta',
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
      'Proteja su hogar en Piedecuesta de cucarachas, hormigas y termitas. Servicio seguro para familias con niños y mascotas.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Fumigación para Restaurantes',
    description:
      'Certificado de fumigación válido ante INVIMA para restaurantes, panaderías y establecimientos de alimentos en Piedecuesta.',
  },
  {
    icon: Building2,
    title: 'Control de Plagas Comercial',
    description:
      'Soluciones para locales comerciales, oficinas y establecimientos en el centro de Piedecuesta y zonas en desarrollo.',
  },
  {
    icon: Factory,
    title: 'Fumigación para Fincas y Galpones',
    description:
      'Servicio especializado para la zona rural de Piedecuesta: fincas, galpones avícolas y áreas agroindustriales en la Mesa de los Santos.',
  },
];

const plagas = [
  {
    name: 'Termitas',
    detail:
      'Piedecuesta presenta alta incidencia de termitas subterráneas y de madera seca, especialmente en las construcciones más antiguas del centro y en casas campestres de la vía a la Mesa de los Santos. El suelo arcilloso del municipio favorece las colonias subterráneas.',
  },
  {
    name: 'Cucarachas',
    detail:
      'Las temperaturas cálidas (23-26°C) de Piedecuesta son ideales para las cucarachas americanas y alemanas. Son especialmente frecuentes en zonas con alcantarillado antiguo y en establecimientos comerciales del centro.',
  },
  {
    name: 'Mosquitos y dengue',
    detail:
      'Las zonas bajas de Piedecuesta, cercanas a las quebradas y con terrenos sin urbanizar, presentan altos índices de reproducción del mosquito Aedes aegypti, vector del dengue, zika y chikungunya.',
  },
  {
    name: 'Garrapatas y pulgas',
    detail:
      'En las zonas rurales y semirrurales de Piedecuesta (veredas, fincas y la vía a Mensulí), las garrapatas y pulgas son plagas frecuentes que afectan tanto animales como personas en propiedades con áreas verdes extensas.',
  },
];

export default function FumigacionPiedecuestaPage() {
  return (
    <>
      <SchemaMarkup schema={localBusinessSchema} />

      {/* Hero */}
      <Hero
        title="Fumigación y Control de Plagas en Piedecuesta"
        subtitle="Cobertura completa en Piedecuesta: desde el casco urbano hasta la Mesa de los Santos. 40+ años de experiencia en control de plagas."
        badgeText="Cobertura completa en Piedecuesta"
        primaryCta={{ text: 'Cotizar Gratis', href: '#contacto-zona' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Fumigación profesional en Piedecuesta, Santander — AGROINCOL"
      />

      {/* Cobertura */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Fumigación Profesional en Piedecuesta
              </h2>
              <p className="text-brand-gray text-body mt-4 leading-relaxed">
                Piedecuesta es el tercer municipio del Área Metropolitana de Bucaramanga con más de 180.000 habitantes y
                un crecimiento urbano acelerado. Nuevos conjuntos residenciales, centros comerciales y la expansión
                hacia zonas como Tablanca y la vía a la Mesa de los Santos generan condiciones propicias para la
                aparición de plagas.
              </p>
              <p className="text-brand-gray text-body mt-3 leading-relaxed">
                AGROINCOL atiende todo Piedecuesta desde su sede en Floridablanca, a solo 15 minutos del centro del
                municipio. Nuestros técnicos conocen las particularidades de cada sector: la zona histórica con sus
                construcciones en madera vulnerables a termitas, las urbanizaciones nuevas con problemas de hormigas y
                cucarachas, y las fincas rurales con plagas propias del campo.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'Piedecuesta', sublabel: 'Cobertura total' },
                { icon: Clock, label: '< 2 Horas', sublabel: 'Tiempo de respuesta' },
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

      {/* Servicios */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Servicios de Fumigación en Piedecuesta
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Soluciones de control de plagas para cada tipo de propiedad en Piedecuesta: hogares, restaurantes,
              comercios y fincas rurales.
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
              Plagas Comunes en Piedecuesta
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              El clima templado-cálido de Piedecuesta y su mezcla de zonas urbanas y rurales crean un ecosistema donde
              ciertas plagas prosperan. Identificar la plaga correcta es el primer paso para un control efectivo.
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

      {/* Por qué AGROINCOL */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-8">
              ¿Por Qué Elegir AGROINCOL en Piedecuesta?
            </h2>
            <div className="space-y-4">
              {[
                'A solo 15 minutos de Piedecuesta — respuesta rápida desde nuestra sede en Floridablanca',
                'Experiencia con las plagas específicas del municipio: termitas, garrapatas y plagas rurales',
                'Cobertura completa: centro histórico, Tablanca, vía Mesa de los Santos, zonas rurales',
                'Productos registrados ante el ICA, seguros para familias, mascotas y animales de granja',
                'Certificados válidos ante INVIMA y Secretaría de Salud para establecimientos de alimentos',
                'Planes de mantenimiento preventivo adaptados a fincas, galpones y zonas rurales',
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
                Calcule cada cuánto debe fumigar su propiedad en Piedecuesta
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
              href="/zonas/fumigacion-floridablanca"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors"
            >
              Floridablanca
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
                Cotice Fumigación en Piedecuesta
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Atendemos todo Piedecuesta incluyendo zona rural, veredas y vía
                a la Mesa de los Santos.
              </p>
              <div className="mt-6">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="piedecuesta-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
