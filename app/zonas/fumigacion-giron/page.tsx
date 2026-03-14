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
  Warehouse,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación en Girón | Control de Plagas — AGROINCOL',
  description:
    'Servicio de fumigación y control de plagas en Girón, Santander. Cobertura en zona industrial de Chimitá. 40+ años de experiencia. Certificación INVIMA.',
  alternates: {
    canonical: 'https://agroincol.com/zonas/fumigacion-giron',
  },
  openGraph: {
    title: 'Fumigación en Girón | Control de Plagas — AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Girón, Santander. Cobertura en zona industrial de Chimitá. 40+ años de experiencia.',
    url: 'https://agroincol.com/zonas/fumigacion-giron',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación en Girón, Santander',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación en Girón | Control de Plagas — AGROINCOL',
    description:
      'Servicio de fumigación y control de plagas en Girón, Santander. Cobertura en zona industrial de Chimitá. 40+ años de experiencia.',
  },
};

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'PestControlService',
  name: 'AGROINCOL — Fumigación en Girón',
  description:
    'Empresa de fumigación y control de plagas con cobertura completa en Girón y zona industrial de Chimitá, Santander. Más de 40 años de experiencia.',
  url: 'https://agroincol.com/zonas/fumigacion-giron',
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
    latitude: 7.0686,
    longitude: -73.1714,
  },
  areaServed: {
    '@type': 'City',
    name: 'Girón',
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
      'Proteja su hogar en Girón de cucarachas, hormigas y roedores. Servicio seguro para familias en conjuntos como Rincón de Girón y Portal de los Santos.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Fumigación para Restaurantes',
    description:
      'Certificado de fumigación válido ante INVIMA para restaurantes y establecimientos de alimentos en Girón y el Malecón.',
  },
  {
    icon: Building2,
    title: 'Control de Plagas Comercial',
    description:
      'Soluciones para locales comerciales, bodegas y oficinas en Girón, incluyendo el centro histórico y zonas comerciales.',
  },
  {
    icon: Factory,
    title: 'Fumigación Industrial',
    description:
      'Servicio especializado para la zona industrial de Chimitá: bodegas, plantas de producción, centros logísticos y áreas de almacenamiento.',
  },
];

const plagas = [
  {
    name: 'Roedores',
    detail:
      'Girón tiene alta incidencia de ratas y ratones, particularmente en la zona industrial de Chimitá y en el casco antiguo. Las bodegas, centros de distribución y el río de Oro crean un ecosistema ideal para roedores que buscan alimento y refugio.',
  },
  {
    name: 'Cucarachas',
    detail:
      'Las temperaturas cálidas de Girón (25-28°C) y la humedad del río de Oro favorecen las poblaciones de cucarachas americanas. Son especialmente problemáticas en restaurantes del centro histórico y en bodegas industriales.',
  },
  {
    name: 'Mosquitos y dengue',
    detail:
      'La presencia del río de Oro, las quebradas y las zonas de inundación periódica de Girón generan criaderos ideales para el mosquito Aedes aegypti. Las urbanizaciones cercanas al río son las más afectadas.',
  },
  {
    name: 'Polillas y gorgojos',
    detail:
      'Las bodegas de almacenamiento y centros de distribución en Chimitá son vulnerables a polillas, gorgojos y otros insectos que atacan productos almacenados como granos, textiles y materiales orgánicos.',
  },
];

export default function FumigacionGironPage() {
  return (
    <>
      <SchemaMarkup schema={localBusinessSchema} />

      {/* Hero */}
      <Hero
        title="Fumigación y Control de Plagas en Girón"
        subtitle="Cobertura completa en Girón y zona industrial de Chimitá. 40+ años protegiendo hogares, restaurantes e industrias en Santander."
        badgeText="Cobertura en Girón y Chimitá"
        primaryCta={{ text: 'Cotizar Gratis', href: '#contacto-zona' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Fumigación profesional en Girón, Santander — AGROINCOL"
      />

      {/* Cobertura */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Fumigación Profesional en Girón
              </h2>
              <p className="text-brand-gray text-body mt-4 leading-relaxed">
                Girón combina un patrimonio histórico colonial con una de las zonas industriales más importantes de
                Santander: <strong>Chimitá</strong>. Esta dualidad crea necesidades de control de plagas muy diversas:
                desde el cuidado del centro histórico con sus construcciones centenarias hasta la fumigación industrial
                de bodegas y plantas de producción.
              </p>
              <p className="text-brand-gray text-body mt-3 leading-relaxed">
                Con más de 200.000 habitantes y un crecimiento urbano constante en sectores como Rincón de Girón,
                Portal de los Santos y la vía al aeropuerto, Girón requiere servicios de fumigación que se adapten tanto
                a las viviendas familiares como a los grandes complejos industriales. AGROINCOL ofrece cobertura total
                en el municipio con tiempos de respuesta menores a 2 horas.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'Girón completo', sublabel: 'Urbano + Chimitá' },
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

      {/* Zona Industrial Chimitá */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="bg-brand-orange/10 rounded-lg p-3 shrink-0">
                  <Warehouse size={28} className="text-brand-orange" />
                </div>
                <div>
                  <h2 className="font-heading text-xl md:text-2xl font-bold text-brand-green">
                    Fumigación Industrial en Chimitá
                  </h2>
                  <p className="text-brand-gray text-body mt-3 leading-relaxed">
                    La <strong>zona industrial de Chimitá</strong> es el principal corredor logístico e industrial del
                    Área Metropolitana de Bucaramanga. Con decenas de bodegas, plantas de producción, centros de
                    distribución y parques empresariales, la fumigación industrial no es opcional: es un requisito
                    sanitario y legal.
                  </p>
                  <p className="text-brand-gray text-body mt-3 leading-relaxed">
                    AGROINCOL ofrece servicios especializados para la zona de Chimitá que incluyen:
                  </p>
                  <ul className="mt-4 space-y-2">
                    {[
                      'Control de roedores con estaciones de cebado permanentes y monitoreo periódico',
                      'Fumigación de bodegas de almacenamiento contra polillas, gorgojos e insectos de productos almacenados',
                      'Control de insectos voladores con trampas UV y nebulización para plantas de alimentos',
                      'Desinfección de áreas de producción conforme a normas de BPM (Buenas Prácticas de Manufactura)',
                      'Planes de manejo integrado de plagas (MIP) con documentación para auditorías y certificaciones',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-brand-black text-body-sm">
                        <CheckCircle size={16} className="text-brand-orange mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Servicios de Fumigación en Girón
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Soluciones de control de plagas para cada necesidad en Girón: desde hogares y restaurantes hasta las
              grandes bodegas de Chimitá.
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
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Plagas Comunes en Girón
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              La cercanía al río de Oro, el clima cálido y la actividad industrial de Girón crean condiciones
              específicas para ciertas plagas. La identificación temprana es clave para un control efectivo.
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
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-8">
              ¿Por Qué Elegir AGROINCOL en Girón?
            </h2>
            <div className="space-y-4">
              {[
                'Experiencia comprobada en fumigación industrial para bodegas y plantas de producción en Chimitá',
                'Más de 40 años atendiendo el Área Metropolitana de Bucaramanga incluyendo todo Girón',
                'Conocemos cada sector: centro histórico, Rincón de Girón, Portal de los Santos, Chimitá y zona rural',
                'Productos registrados ante el ICA y aprobados por la OMS, seguros para áreas de producción',
                'Certificados de fumigación válidos ante INVIMA, Secretaría de Salud y auditorías de calidad',
                'Planes de Manejo Integrado de Plagas (MIP) con documentación completa para certificaciones ISO',
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
                Calcule cada cuánto debe fumigar su propiedad en Girón
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
              href="/zonas/fumigacion-piedecuesta"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors"
            >
              Piedecuesta
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
                Cotice Fumigación en Girón
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Cobertura completa en Girón: centro histórico, urbanizaciones,
                zona industrial de Chimitá y alrededores.
              </p>
              <div className="mt-6">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="giron-contact" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
