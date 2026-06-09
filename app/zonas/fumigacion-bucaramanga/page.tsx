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
  Star,
} from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Fumigación en Bucaramanga: Cobertura en Todos los Barrios',
  description:
    'Fumigación y control de plagas en Bucaramanga, sector por sector: Cabecera, Centro, Provenza, Real de Minas, zona norte y más. 40+ años, certificación INVIMA, respuesta el mismo día.',
  alternates: {
    canonical: 'https://agroincol.com/zonas/fumigacion-bucaramanga',
  },
  openGraph: {
    title: 'Fumigación en Bucaramanga: Cobertura en Todos los Barrios | AGROINCOL',
    description:
      'Control de plagas en toda Bucaramanga: cucarachas, roedores, zancudos y comején. Cobertura en Cabecera, Centro, Provenza, Real de Minas y zona norte. Certificación INVIMA.',
    url: 'https://agroincol.com/zonas/fumigacion-bucaramanga',
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
    title: 'Fumigación en Bucaramanga: Cobertura en Todos los Barrios | AGROINCOL',
    description:
      'Control de plagas en toda Bucaramanga: cucarachas, roedores, zancudos y comején. Certificación INVIMA y respuesta el mismo día.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'Fumigación y control de plagas',
  name: 'Fumigación y Control de Plagas en Bucaramanga',
  description:
    'Servicio profesional de fumigación y control de plagas en Bucaramanga, Santander, con cobertura en todos los sectores de la ciudad: cucarachas, roedores, zancudos, comején y más. Más de 40 años de experiencia y certificación conforme al Decreto 1843 de 1991 y la Resolución 2674 de 2013.',
  url: 'https://agroincol.com/zonas/fumigacion-bucaramanga',
  provider: {
    '@type': 'LocalBusiness',
    '@id': 'https://agroincol.com/#organization',
    name: 'AGROINCOL',
    telephone: BUSINESS.phoneRaw,
  },
  areaServed: {
    '@type': 'City',
    name: 'Bucaramanga',
  },
};

const services = [
  {
    icon: Home,
    title: 'Fumigación Residencial',
    description:
      'Casas y apartamentos en sectores como Cabecera, Sotomayor, Provenza y Real de Minas. Productos de baja toxicidad, seguros para niños y mascotas.',
  },
  {
    icon: UtensilsCrossed,
    title: 'Fumigación para Restaurantes',
    description:
      'Restaurantes y cafeterías del Centro, Cabecera y Cuadra Play. Certificado válido para inspecciones del INVIMA y la Secretaría de Salud.',
  },
  {
    icon: Building2,
    title: 'Control de Plagas Comercial',
    description:
      'Locales, oficinas y centros comerciales de la ciudad. Programas de control integrado para edificios y conjuntos con zonas comunes.',
  },
  {
    icon: Factory,
    title: 'Desratización y Control Industrial',
    description:
      'Bodegas, plazas de mercado y depósitos del centro y la zona norte, donde la presión de roedores es alta. Cebado seguro y seguimiento.',
  },
];

// Barrios y sectores reales de Bucaramanga, agrupados por zona de la ciudad.
const sectores = [
  {
    zona: 'Cuadrante sur (meseta alta)',
    detalle:
      'Cabecera del Llano, Sotomayor, El Prado, Nuevo Sotomayor, La Floresta y Terrazas. Sector de edificios altos y conjuntos cerrados, donde las cucarachas se desplazan por ductos de basura y shafts entre apartamentos.',
    barrios: ['Cabecera del Llano', 'Sotomayor', 'El Prado', 'La Floresta', 'Terrazas', 'Nuevo Sotomayor'],
  },
  {
    zona: 'Centro y comercio',
    detalle:
      'Centro, San Francisco, La Aurora, García Rovira y Girardot. Alta densidad de locales, restaurantes y plazas de mercado: la zona de mayor presión de roedores y cucarachas de la ciudad.',
    barrios: ['Centro', 'San Francisco', 'La Aurora', 'García Rovira', 'Girardot', 'Alarcón'],
  },
  {
    zona: 'Occidente y suroccidente',
    detalle:
      'Provenza, La Victoria, Real de Minas, Ciudadela y Mutis. Mezcla de vivienda y comercio en expansión, con quebradas cercanas que favorecen zancudos en temporada de lluvias.',
    barrios: ['Provenza', 'La Victoria', 'Real de Minas', 'Ciudadela Real de Minas', 'Mutis', 'La Concordia'],
  },
  {
    zona: 'Zona norte',
    detalle:
      'Café Madrid, Kennedy, Colorados, Villa Rosa y Regadero Norte. Sector con quebradas, vivienda popular y bodegas; requiere control reforzado de roedores y vectores.',
    barrios: ['Café Madrid', 'Kennedy', 'Colorados', 'Villa Rosa', 'Regadero Norte'],
  },
];

const plagas = [
  {
    name: 'Cucarachas',
    detail:
      'La plaga más reportada en Bucaramanga. El clima cálido de la meseta (24 °C promedio) y los edificios de Cabecera y el Centro permiten que la cucaracha alemana se mueva entre apartamentos por ductos y tuberías. El control efectivo exige tratar todo el edificio, no solo un apartamento.',
  },
  {
    name: 'Roedores (ratas y ratones)',
    detail:
      'Concentrados en el Centro, las plazas de mercado y las bodegas de la zona norte. Las ratas se desplazan por redes de alcantarillado y entran a locales y restaurantes en busca de alimento. Combinamos cebado en estaciones seguras con sellado de accesos.',
  },
  {
    name: 'Zancudos y dengue',
    detail:
      'Bucaramanga es zona endémica de dengue. Las quebradas urbanas y el agua estancada en temporada de lluvias (marzo–junio y septiembre–noviembre) disparan la población del Aedes aegypti. Aplicamos larvicidas en criaderos además del control de adultos.',
  },
  {
    name: 'Comején y termitas',
    detail:
      'Frecuente en casas antiguas del Centro y García Rovira, y en construcciones nuevas con maderas sin tratar. El daño estructural avanza en silencio: actuar temprano evita reparaciones costosas.',
  },
  {
    name: 'Hormigas',
    detail:
      'Hormigas locas y arrieras comunes en conjuntos residenciales y zonas verdes de Provenza, Real de Minas y la zona norte. Invaden cocinas y jardines y son difíciles de erradicar sin tratamiento profesional del nido.',
  },
  {
    name: 'Moscas y otros insectos',
    detail:
      'Problema crítico para restaurantes y negocios de alimentos del Centro y Cabecera. Controlamos focos de reproducción y aplicamos barreras para mantener el cumplimiento sanitario.',
  },
];

export default function FumigacionBucaramangaPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Zonas', href: '/' },
        { name: 'Fumigación en Bucaramanga' },
      ]} />

      {/* Hero */}
      <Hero
        withBreadcrumbs
        title="Fumigación y Control de Plagas en Bucaramanga"
        subtitle="Cobertura en toda la ciudad — del Centro a Cabecera, de Provenza a la zona norte. Más de 40 años eliminando plagas en la capital de Santander."
        badgeText="Atención el mismo día en toda Bucaramanga"
        primaryCta={{ text: 'Cotizar Gratis', href: '#contacto-zona' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Fumigación profesional en Bucaramanga, Santander — AGROINCOL"
      />

      {/* Cobertura en la ciudad */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Control de Plagas en Toda Bucaramanga
              </h2>
              <p className="text-brand-gray text-body mt-4 leading-relaxed">
                Bucaramanga es la ciudad más poblada de Santander, con más de 600.000 habitantes sobre una meseta de
                clima cálido. Esa combinación de <strong>temperatura templada todo el año, comercio denso en el Centro
                y edificios altos en Cabecera</strong> crea condiciones ideales para cucarachas, roedores y zancudos.
              </p>
              <p className="text-brand-gray text-body mt-3 leading-relaxed">
                AGROINCOL opera desde su sede en Floridablanca, a pocos minutos de Bucaramanga, lo que nos permite
                <strong> llegar el mismo día</strong> a cualquier sector de la ciudad. Conocemos las diferencias entre
                la zona norte, el centro comercial y los barrios residenciales del sur, y adaptamos el tratamiento a
                cada uno.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: MapPin, label: 'Toda la ciudad', sublabel: 'Norte, centro y sur' },
                { icon: Clock, label: 'Mismo día', sublabel: 'Tiempo de respuesta' },
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

      {/* Servicios en Bucaramanga */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Servicios de Fumigación en Bucaramanga
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Soluciones de control de plagas para cada tipo de propiedad de la ciudad: desde apartamentos en Cabecera
              hasta restaurantes del Centro y bodegas de la zona norte.
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
          <p className="text-center text-brand-gray text-body-sm mt-8">
            ¿Busca un servicio específico? Vea{' '}
            <Link href="/servicios" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
              todos nuestros servicios
            </Link>{' '}
            o consulte{' '}
            <Link href="/precios" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
              precios de fumigación
            </Link>.
          </p>
        </div>
      </section>

      {/* Sectores de la ciudad */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Cobertura por Sectores de Bucaramanga
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Cada zona de la ciudad tiene un perfil de plagas distinto. Así trabajamos en cada una.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sectores.map((sector) => (
              <div key={sector.zona} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-brand-orange shrink-0" />
                  <h3 className="font-heading font-bold text-brand-green text-lg">{sector.zona}</h3>
                </div>
                <p className="text-brand-gray text-body-sm mt-3 leading-relaxed">{sector.detalle}</p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {sector.barrios.map((barrio) => (
                    <span key={barrio} className="bg-brand-light text-brand-green font-semibold px-3 py-1 rounded-full text-xs border border-brand-green/20">
                      {barrio}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-brand-gray text-body-sm mt-6">
            ¿No ve su barrio? Atendemos toda Bucaramanga — escríbanos y confirmamos su sector.
          </p>
        </div>
      </section>

      {/* Plagas comunes */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Plagas Más Comunes en Bucaramanga
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              El clima cálido de la meseta y la geografía de la ciudad favorecen plagas específicas. Estas son las que
              más atendemos.
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

      {/* Por qué AGROINCOL en Bucaramanga */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-8">
              ¿Por Qué Elegir AGROINCOL en Bucaramanga?
            </h2>
            <div className="space-y-4">
              {[
                'Más de 40 años de experiencia atendiendo hogares, restaurantes y empresas de la ciudad',
                'Respuesta el mismo día en toda Bucaramanga, desde nuestra sede en Floridablanca',
                'Conocemos el perfil de plagas de cada zona: el comercio del Centro, los edificios de Cabecera y la zona norte',
                'Productos registrados ante el ICA y aprobados por la OMS, seguros para familias y mascotas',
                'Certificados de fumigación válidos ante INVIMA y la Secretaría de Salud de Santander',
                'Planes de mantenimiento preventivo trimestral, bimestral o mensual según su necesidad',
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

      {/* Reseñas reales en Google */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div role="img" aria-label="Calificación: 4.9 de 5 estrellas" className="text-[#F59E0B] text-2xl">
              ★★★★★
            </div>
            <p className="font-heading text-h3 text-brand-green mt-3">4.9 / 5 en Google</p>
            <p className="text-brand-gray text-body mt-2">
              Basado en las reseñas verificadas de clientes de AGROINCOL en Google Business Profile.
            </p>
            <a
              href={BUSINESS.googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-orange hover:text-brand-orange-dark font-semibold mt-4 transition-colors"
            >
              <Star size={16} /> Ver reseñas en Google <ArrowRight size={14} />
            </a>
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
                Calcule cada cuánto debe fumigar su propiedad en Bucaramanga
              </p>
              <span className="inline-flex items-center gap-1 text-brand-orange text-body-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Usar calculadora <ArrowRight size={14} />
              </span>
            </Link>
            <Link
              href="/blog/como-eliminar-cucarachas-bucaramanga"
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-6 transition-colors group"
            >
              <Shield size={28} className="text-white mx-auto" />
              <h3 className="font-heading font-bold text-white mt-3">Cómo Eliminar Cucarachas</h3>
              <p className="text-gray-300 text-body-sm mt-1">
                Guía profesional para el clima de Bucaramanga
              </p>
              <span className="inline-flex items-center gap-1 text-brand-orange text-body-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                Leer guía <ArrowRight size={14} />
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
            <Link href="/zonas/fumigacion-floridablanca" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
              Floridablanca
            </Link>
            {', '}
            <Link href="/zonas/fumigacion-piedecuesta" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
              Piedecuesta
            </Link>
            {' y '}
            <Link href="/zonas/fumigacion-giron" className="text-brand-orange hover:text-brand-orange-dark font-semibold transition-colors">
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
                Cotice Fumigación en Bucaramanga
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Solicite una cotización sin compromiso. Atendemos toda la ciudad y llegamos el mismo día a su sector.
              </p>
              <div className="mt-6">
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="bucaramanga-contact" />
            </div>
          </div>
        </div>
      </section>

      <SchemaMarkup schema={serviceSchema} />
    </>
  );
}
