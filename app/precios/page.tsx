import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CreditCard,
  CalendarCheck,
  Percent,
  CheckCircle,
  MessageSquare,
  Search,
  SprayCan,
  Sparkles,
  Users,
  FileText,
} from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import PricingTabs from '@/components/pricing/PricingTabs';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Precios Fumigación Bucaramanga 2026 | AGROINCOL',
  description:
    'Precios reales de fumigación en Bucaramanga para restaurantes y hogares. Desde $90.000. Programas mensuales desde $80.000/mes. Cotización gratis.',
  alternates: {
    canonical: 'https://agroincol.com/precios',
  },
  robots: 'index, follow',
  openGraph: {
    title: 'Precios Fumigación Bucaramanga 2026 | AGROINCOL',
    description:
      'Precios reales de fumigación en Bucaramanga para restaurantes y hogares. Desde $90.000. Programas mensuales desde $80.000/mes.',
    url: 'https://agroincol.com/precios',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Precios de Fumigación en Bucaramanga 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Precios Fumigación Bucaramanga 2026 | AGROINCOL',
    description:
      'Precios reales de fumigación en Bucaramanga para restaurantes y hogares. Desde $90.000. Programas mensuales desde $80.000/mes.',
  },
};

const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Precios de Fumigación en Bucaramanga 2026',
  description:
    'Guía completa de precios de fumigación y control de plagas en Bucaramanga para restaurantes y hogares.',
  provider: {
    '@id': 'https://agroincol.com/#organization',
  },
};

const serviceSteps = [
  {
    icon: MessageSquare,
    title: 'Confirmación previa',
    description: 'Mensaje con fecha, hora y técnico asignado',
  },
  {
    icon: Search,
    title: 'Inspección diagnóstica',
    description: 'Revisión de puntos críticos con fotos',
  },
  {
    icon: SprayCan,
    title: 'Tratamiento profesional',
    description: 'Aspersión + gel con productos INVIMA',
  },
  {
    icon: Sparkles,
    title: 'Limpieza y orden',
    description: 'Dejamos el espacio igual o mejor',
  },
  {
    icon: Users,
    title: 'Cierre presencial',
    description: 'Resumen de hallazgos y recomendaciones',
  },
  {
    icon: FileText,
    title: 'Reporte digital',
    description: 'En menos de 2 horas por WhatsApp',
  },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: 'Contado / Mensual',
    description: 'Pago antes del servicio, precio estándar.',
  },
  {
    icon: CalendarCheck,
    title: '50/50',
    description: '50% al agendar, 50% al finalizar (requiere contrato).',
  },
  {
    icon: Percent,
    title: 'Prepago anual',
    description: '10% de descuento (requiere contrato).',
  },
];

export default function PreciosPage() {
  return (
    <>
      <SchemaMarkup schema={pageSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Precios' },
      ]} />

      {/* Hero */}
      <Hero
        withBreadcrumbs
        title="¿Cuánto Cuesta Fumigar en Bucaramanga?"
        subtitle="Precios transparentes para restaurantes y hogares. Todos nuestros precios incluyen IVA, productos certificados INVIMA y técnicos profesionales."
        badgeText="Precios actualizados — Marzo 2026"
        primaryCta={{ text: 'Cotizar Ahora', href: '#contacto' }}
        secondaryCta={{ text: 'WhatsApp', href: BUSINESS.whatsappLink }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Precios de fumigación en Bucaramanga — AGROINCOL"
      />

      {/* Pricing Tabs (Client Component) */}
      <PricingTabs />

      {/* Qué Incluye Cada Visita */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Qué Incluye Cada Visita
            </h2>
            <p className="text-brand-gray text-body-lg mt-4 max-w-3xl mx-auto">
              Cada servicio de AGROINCOL sigue un protocolo profesional de 6 pasos para garantizar resultados efectivos
              y una experiencia impecable.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-0">
              {serviceSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.title} className="flex gap-4 md:gap-6">
                    {/* Timeline line + circle */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-brand-orange flex items-center justify-center shrink-0 z-10">
                        <Icon size={20} className="text-white" />
                      </div>
                      {index < serviceSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-brand-orange/20 min-h-[3rem]" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="pb-8">
                      <div className="flex items-center gap-2">
                        <span className="text-brand-orange font-heading font-bold text-sm">Paso {index + 1}</span>
                      </div>
                      <h3 className="font-heading font-bold text-brand-green text-lg mt-1">{step.title}</h3>
                      <p className="text-brand-gray text-body-sm mt-1">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Formas de Pago */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">Formas de Pago</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <div key={method.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                  <Icon size={32} className="text-brand-orange mx-auto" />
                  <h3 className="font-heading font-bold text-brand-green mt-3">{method.title}</h3>
                  <p className="text-brand-gray text-body-sm mt-2">{method.description}</p>
                </div>
              );
            })}
          </div>
          <p className="text-center text-brand-gray text-body-sm mt-6">
            Todos los precios incluyen IVA. Factura electrónica disponible.
          </p>
        </div>
      </section>

      {/* Contenido SEO */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
              ¿Cuánto Cuesta Fumigar en Bucaramanga en 2026?
            </h2>

            <div className="prose-brand space-y-4">
              <p className="text-brand-black text-body leading-relaxed">
                El costo de fumigación en Bucaramanga depende de varios factores clave: el tipo de propiedad
                (restaurante, hogar, bodega u oficina), el tamaño del espacio a tratar, el tipo de plaga que necesita
                controlar, si se trata de un servicio único o un programa recurrente, y el nivel de protección
                requerido. No existe un precio único porque cada propiedad tiene condiciones diferentes, y un
                tratamiento efectivo debe adaptarse a esas condiciones para garantizar resultados duraderos.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                En el Área Metropolitana de Bucaramanga — que incluye Bucaramanga, Floridablanca, Piedecuesta y Girón
                — los servicios de fumigación residencial tienen precios de referencia que van desde <strong>$90.000
                para tratamientos básicos</strong> enfocados en un solo espacio y una sola plaga, hasta{' '}
                <strong>$250.000 para tratamientos integrales</strong> que cubren toda la vivienda, incluyen diagnóstico
                completo, reporte digital y garantía. Las familias que prefieren un programa preventivo continuo pueden
                acceder a planes recurrentes con visitas cada dos meses por aproximadamente $67.500 mensuales,
                lo que equivale a menos de $2.250 diarios para mantener su hogar libre de plagas durante todo el año.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                Para restaurantes y negocios de alimentos, los precios están determinados por los requerimientos de la
                normativa colombiana. La Resolución 2674 de 2013 exige un programa continuo de control de plagas con
                certificación vigente, no un servicio esporádico. Los programas mensuales para restaurantes en
                Bucaramanga van desde <strong>$80.000/mes para el plan básico trimestral</strong> (Control) hasta{' '}
                <strong>$180.000/mes para el plan premium mensual</strong> (Blindaje), que incluye visitas cada mes,
                reportes detallados, acompañamiento en auditorías y garantía ilimitada entre visitas. El plan más
                elegido por restaurantes en Bucaramanga es el plan Protección a $105.000/mes, que ofrece el mejor
                equilibrio entre precio, cobertura y tranquilidad.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                Un error común es pensar que contratar servicios sueltos de fumigación es más económico que un programa
                recurrente. La realidad es lo contrario: un restaurante que contrata fumigación solo cuando ve una
                plaga termina pagando más por cada visita individual, además de asumir riesgos significativos. Sin un
                programa preventivo, las plagas se establecen entre tratamientos, lo que requiere aplicaciones más
                intensivas y costosas. Pero lo más importante es que sin un programa documentado, el restaurante queda
                expuesto a sanciones del INVIMA. Un programa recurrente no solo es más económico por visita, sino que
                incluye certificación, documentación y soporte — todo lo que necesita para operar tranquilo y cumplir
                la normativa.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                ¿Y cuánto cuesta <em>no</em> fumigar? Mucho más de lo que imagina. Las multas del INVIMA por problemas
                sanitarios van de 5 a 1,000 SMMLV, lo que en 2026 puede significar desde $6.5 millones hasta $1,300
                millones de pesos. Pero la multa es solo el inicio: un cierre temporal implica días sin facturar con
                costos fijos corriendo, pérdida de empleados, fumigación de emergencia a precios más altos, y un daño
                reputacional que puede perseguir su negocio durante meses. Si quiere dimensionar el impacto real,
                lea nuestro artículo{' '}
                <Link
                  href="/blog/cuanto-cuesta-multa-invima-restaurante"
                  className="text-brand-orange underline hover:text-brand-orange-dark"
                >
                  ¿Cuánto cuesta una multa del INVIMA por plagas?
                </Link>
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                Todos los precios de AGROINCOL incluyen IVA, productos certificados INVIMA registrados ante el ICA y
                aprobados por la OMS, y técnicos profesionales capacitados. El valor final puede variar según el tamaño
                específico de su propiedad, el tipo de plaga, las condiciones del entorno y el nivel de infestación.
                Por eso, siempre recomendamos solicitar una cotización personalizada: es gratis, sin compromiso, y le
                respondemos en menos de 2 horas.
              </p>
            </div>

            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-6">
              ¿Cómo Elegir el Plan Correcto?
            </h2>

            <div className="space-y-4">
              <p className="text-brand-black text-body leading-relaxed">
                Si tiene un <strong>restaurante o negocio de alimentos</strong> y necesita cumplir con la normativa
                INVIMA, el mínimo es el plan <strong>Control</strong> (trimestral). Sin embargo, recomendamos el plan{' '}
                <strong>Protección</strong> porque incluye garantía entre visitas, reportes técnicos y soporte
                documental en auditorías — por solo $25.000/mes más. Si opera un restaurante grande, una cadena o un
                hotel con cero tolerancia a incidentes, el plan <strong>Blindaje</strong> le da cobertura mensual
                completa con acompañamiento en auditorías.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                Si tiene un <strong>problema puntual en casa</strong> — una cucaracha en la cocina, hormigas en el baño
                — el plan <strong>Esencial</strong> resuelve con una sola visita e incluye garantía básica. Si quiere
                resolver de raíz y cubrir toda la casa, el plan <strong>Integral</strong> es la mejor inversión: incluye
                diagnóstico, tratamiento completo, reporte digital y garantía de 30 días. Y si prefiere no volver a
                preocuparse nunca más, el plan <strong>Hogar Protegido</strong> le da protección continua durante todo
                el año con visitas bimestrales y garantía ilimitada.
              </p>

              <p className="text-brand-black text-body leading-relaxed">
                ¿No está seguro de la frecuencia ideal para su propiedad?{' '}
                <Link
                  href="/herramientas/calculadora-fumigacion"
                  className="text-brand-orange underline hover:text-brand-orange-dark font-semibold"
                >
                  Use nuestra calculadora gratuita para determinar la frecuencia ideal de fumigación para su propiedad →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA + ContactForm */}
      <section className="section-padding bg-white" id="contacto">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Solicite su Cotización Personalizada
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Los precios mostrados son de referencia. El valor final depende del tamaño de su propiedad y tipo de
                plaga. Contáctenos para una cotización sin compromiso.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Respuesta en menos de 2 horas',
                  'Precios con IVA incluido',
                  'Certificado INVIMA incluido (programas)',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-brand-black text-body">
                    <CheckCircle size={18} className="text-brand-orange shrink-0" />
                    {item}
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
              <ContactForm formId="precios-contact" />
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="bg-gray-50 py-6">
        <div className="container-custom">
          <p className="text-gray-400 text-xs text-center max-w-4xl mx-auto leading-relaxed">
            Precios válidos para Bucaramanga y Área Metropolitana (Floridablanca, Girón, Piedecuesta). Todos los precios
            incluyen IVA. El valor final puede variar según el tamaño del establecimiento, tipo de plaga y condiciones
            específicas. Precios actualizados a marzo 2026. Consulte condiciones con nuestro equipo comercial.
          </p>
        </div>
      </section>
    </>
  );
}
