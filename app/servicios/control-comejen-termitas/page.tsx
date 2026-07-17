import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, Home, Droplets, Search, Syringe, ClipboardCheck, XCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Comején y Termitas en Bucaramanga: Colonia Completa',
  description:
    'Eliminamos comején y termitas en Bucaramanga con inspección, inyección y barreras químicas. 40+ años de experiencia. Certificación INVIMA. Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/control-comejen-termitas',
  },
  openGraph: {
    title: 'Comején y Termitas en Bucaramanga: Colonia Completa | AGROINCOL',
    description:
      'Eliminamos comején y termitas en Bucaramanga con inspección, inyección y barreras químicas. 40+ años de experiencia y certificación INVIMA.',
    url: 'https://agroincol.com/servicios/control-comejen-termitas',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Control de Comején y Termitas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comején y Termitas en Bucaramanga: Colonia Completa | AGROINCOL',
    description:
      'Eliminamos comején y termitas en Bucaramanga con inspección, inyección y barreras químicas. 40+ años de experiencia y certificación INVIMA.',
  },
};

const FAQS_COMEJEN = [
  {
    question: '¿Cómo sé si tengo comején en mi casa?',
    answer:
      'Las señales más comunes son: alas descartadas cerca de ventanas o lámparas (los reproductores las pierden tras el vuelo nupcial), túneles de barro en paredes o cimientos, madera que suena hueca al golpearla, pequeños montículos de polvo similar al aserrín y puertas o ventanas que de repente cierran mal. Si detecta cualquiera de estas señales, solicite una inspección profesional cuanto antes: el daño avanza aunque no vea insectos.',
  },
  {
    question: '¿El comején es lo mismo que las termitas?',
    answer:
      'En Colombia "comején" es el nombre popular de las termitas. En Bucaramanga encontramos principalmente dos tipos: las termitas subterráneas, que viven en el suelo y entran por cimientos construyendo túneles de barro, y las termitas de madera seca, que viven dentro de muebles, puertas y estructuras de madera sin necesidad de contacto con el suelo. Cada tipo requiere un tratamiento diferente, por eso la inspección inicial es fundamental.',
  },
  {
    question: '¿Cuánto cuesta eliminar el comején en Bucaramanga?',
    answer:
      'El costo depende del tipo de termita, la extensión de la infestación y el tamaño del inmueble. Por eso realizamos primero una inspección para diagnosticar el problema y entregarle una cotización exacta sin compromiso. Puede consultar nuestra página de precios para conocer los rangos de nuestros servicios o contactarnos directamente para una cotización personalizada.',
  },
  {
    question: '¿Los remedios caseros o insecticidas de supermercado funcionan contra el comején?',
    answer:
      'No. Los aerosoles y remedios caseros solo eliminan los individuos visibles en la superficie, pero la colonia (que puede tener cientos de miles de termitas) permanece intacta dentro de la madera o bajo el suelo. Peor aún: la aplicación superficial puede hacer que la colonia se reubique a zonas menos visibles de la estructura, donde el daño continúa sin que usted lo note. El control efectivo requiere productos profesionales de transferencia y técnicas de inyección que alcancen el corazón de la colonia.',
  },
  {
    question: '¿Cuánto dura el tratamiento y cuándo veo resultados?',
    answer:
      'La aplicación inicial toma entre 2 y 4 horas para una vivienda promedio, según la extensión de la infestación. Los productos profesionales de transferencia actúan de forma progresiva: las termitas contaminadas llevan el producto al resto de la colonia, lo que elimina la infestación completa en un período de 2 a 6 semanas. Incluimos visitas de seguimiento para verificar la eliminación total y revisar que no haya actividad nueva.',
  },
  {
    question: '¿El tratamiento daña los muebles o es tóxico para mi familia?',
    answer:
      'No daña los muebles: la inyección se realiza con perforaciones mínimas que luego se sellan, y las barreras químicas se aplican en el suelo y los cimientos, no sobre las superficies visibles. Utilizamos productos registrados ante el ICA, de baja toxicidad para personas y mascotas. Le indicamos los tiempos de ventilación y reingreso seguros para cada área tratada.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Control de Comején y Termitas',
  serviceType: 'Control de Comején y Termitas',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: {
    '@type': 'City',
    name: 'Bucaramanga',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Santander',
    },
  },
  description:
    'Servicio profesional de control y eliminación de comején y termitas en Bucaramanga y el Área Metropolitana. Inspección, inyección directa, barreras químicas y seguimiento con certificación INVIMA.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_COMEJEN.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const signals = [
  {
    icon: AlertTriangle,
    title: 'Alas descartadas',
    text: 'Pequeñas alas transparentes acumuladas cerca de ventanas, lámparas o rincones. Son el rastro del vuelo nupcial de los reproductores que buscan fundar una nueva colonia dentro de su casa.',
  },
  {
    icon: Droplets,
    title: 'Túneles de barro',
    text: 'Cordones de tierra del grosor de un lápiz que suben por paredes, cimientos o muros. Son las autopistas protegidas que construyen las termitas subterráneas para llegar a la madera.',
  },
  {
    icon: Home,
    title: 'Madera hueca',
    text: 'Puertas, marcos, zócalos o vigas que suenan huecos al golpearlos, se hunden con presión leve o muestran pequeños orificios con polvo similar al aserrín en la base.',
  },
];

const treatmentSteps = [
  {
    icon: Search,
    step: '1',
    title: 'Inspección y diagnóstico',
    text: 'Revisamos toda la estructura: vigas, marcos, zócalos, closets, cielos rasos y cimientos. Identificamos el tipo de termita (subterránea o de madera seca), la extensión de la infestación y los puntos de acceso. Con ese diagnóstico le entregamos una cotización exacta sin compromiso.',
  },
  {
    icon: Syringe,
    step: '2',
    title: 'Inyección y barreras químicas',
    text: 'Para termitas de madera seca, inyectamos producto directamente en las galerías internas de la madera afectada. Para termitas subterráneas, aplicamos barreras químicas en el suelo y los cimientos que interceptan a la colonia. Los productos de transferencia hacen que las propias termitas propaguen el tratamiento hasta el corazón del nido.',
  },
  {
    icon: ClipboardCheck,
    step: '3',
    title: 'Seguimiento y verificación',
    text: 'Programamos visitas de control para confirmar la eliminación completa de la colonia, revisar puntos críticos y aplicar refuerzos preventivos si es necesario. Le entregamos recomendaciones para evitar reinfestaciones y un certificado del servicio realizado.',
  },
];

const homeRemedyFails = [
  'Los aerosoles solo matan las termitas visibles: la colonia, con cientos de miles de individuos, sigue intacta dentro de la madera o bajo el suelo.',
  'El ACPM, el petróleo o el vinagre no penetran las galerías internas donde vive y se reproduce la colonia.',
  'Aplicar producto en la superficie puede hacer que la colonia se reubique a zonas ocultas de la estructura, donde el daño continúa sin señales visibles.',
  'Pintar o barnizar la madera afectada solo tapa el problema: las termitas siguen comiendo por dentro.',
];

export default function ComejenTermitasPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Control de Comején y Termitas' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Control de Comején y Termitas en Bucaramanga"
        subtitle="Eliminamos la colonia completa, no solo los insectos visibles. Inspección, inyección directa y barreras químicas con más de 40 años de experiencia en Santander."
        badgeText="Empresa certificada ante INVIMA — 40+ años en Santander"
        primaryCta={{ text: 'Solicitar Inspección', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Técnico de AGROINCOL inspeccionando madera afectada por comején en Bucaramanga"
      />

      {/* 2. The Problem in Bucaramanga */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Por Qué el Comején es tan Común en Bucaramanga?
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            El clima cálido y húmedo de la meseta de Bucaramanga crea las condiciones perfectas para las termitas
            durante todo el año: las subterráneas prosperan en suelos húmedos y entran por los cimientos, mientras
            que las de madera seca colonizan muebles, puertas y estructuras sin necesidad de tocar el suelo.
          </p>
          <p className="text-brand-gray text-body-lg mb-6">
            El problema es especialmente frecuente en las casas antiguas del Centro y de García Rovira, construidas
            con vigas, marcos y cielos rasos de madera sin tratamiento previo. También afecta construcciones más
            recientes que incorporan madera sin inmunizar en closets, puertas y acabados.
          </p>
          <p className="text-brand-gray text-body-lg mb-8">
            Lo más peligroso del comején es que trabaja en silencio: una colonia puede consumir la estructura interna
            de vigas y marcos durante años sin dar señales visibles. Cuando el daño aparece en la superficie, el
            deterioro estructural suele estar avanzado y la reparación cuesta mucho más que el tratamiento a tiempo.
          </p>
          <p className="text-brand-gray text-body">
            <Link
              href="/blog/comejen-termitas-bucaramanga"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold underline transition-colors"
            >
              Lea nuestra guía completa: Comején y Termitas en Bucaramanga — Cómo Identificar y Eliminar →
            </Link>
          </p>
        </div>
      </section>

      {/* 3. Warning Signs */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Señales de que Hay Comején en su Casa
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Detectar la infestación a tiempo marca la diferencia entre un tratamiento puntual y una reparación
            estructural costosa. Estas son las tres señales que debe revisar hoy mismo:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.map((signal, index) => {
              const Icon = signal.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-brand-orange/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-brand-orange" />
                  </div>
                  <h3 className="font-heading font-semibold text-brand-black text-h3 mb-2">
                    {signal.title}
                  </h3>
                  <p className="text-brand-gray text-body">{signal.text}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8">
            <Button variant="primary" href="#contacto">
              Detecté alguna señal — Quiero una inspección
            </Button>
          </div>
        </div>
      </section>

      {/* 4. Why Home Remedies Fail */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Por Qué los Remedios Caseros No Eliminan el Comején
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Aerosoles de supermercado, ACPM, vinagre o agua caliente: ninguno funciona contra el comején, y algunos
            empeoran el problema. La razón es simple: usted solo ve una fracción mínima de la colonia.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {homeRemedyFails.map((item, index) => (
              <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <XCircle size={24} className="text-red-500" />
                </div>
                <p className="text-brand-black text-body">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-brand-gray text-body">
            El control efectivo requiere productos profesionales de transferencia, equipos de inyección y el
            conocimiento técnico para localizar y eliminar la colonia completa. Conozca{' '}
            <Link
              href="/certificaciones-y-normativa"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              nuestras certificaciones y el marco normativo
            </Link>{' '}
            que respalda cada aplicación.
          </p>
        </div>
      </section>

      {/* 5. Professional Treatment Process */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Nuestro Tratamiento Profesional contra el Comején
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Cada infestación es diferente. Por eso nuestro servicio comienza siempre con un diagnóstico técnico que
            determina el tipo de termita y el tratamiento adecuado:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treatmentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-brand-green w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="font-heading font-bold text-white">{step.step}</span>
                    </div>
                    <Icon size={24} className="text-brand-orange" />
                  </div>
                  <h3 className="font-heading font-semibold text-brand-black text-h3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-brand-gray text-body">{step.text}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-brand-gray text-body">
            ¿Quiere conocer los rangos de costos de nuestros servicios?{' '}
            <Link
              href="/precios"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              Consulte nuestra página de precios →
            </Link>
          </p>
        </div>
      </section>

      {/* 6. FAQ */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            Preguntas Frecuentes sobre Comején y Termitas
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_COMEJEN} />
          </div>
          <p className="text-center mt-10 text-brand-gray text-body">
            ¿Busca otro servicio?{' '}
            <Link
              href="/servicios"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              Vea todos nuestros servicios de control de plagas →
            </Link>
          </p>
        </div>
      </section>

      {/* 7. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Detenga el Daño Antes de que Avance
              </h2>
              <p className="text-brand-gray text-body mt-4">
                El comején no se detiene solo. Solicite una inspección y reciba un diagnóstico claro con cotización
                sin compromiso. Le respondemos por WhatsApp en menos de 5 minutos.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Inspección y diagnóstico del tipo de termita',
                  'Cotización gratis y sin compromiso',
                  'Respuesta por WhatsApp en menos de 5 minutos',
                  '40+ años de experiencia en Santander',
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
              <ContactForm formId="comejen-contact" preselectedService="Otro" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
