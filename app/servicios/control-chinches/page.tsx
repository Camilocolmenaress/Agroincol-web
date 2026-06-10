import type { Metadata } from 'next';
import Link from 'next/link';
import { Search, Bed, Droplets, Wind, Plane, Hotel, Sofa, Building2, SprayCan, RotateCcw, ShieldCheck, AlertCircle } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Control de Chinches de Cama en Bucaramanga',
  description:
    'Eliminación profesional de chinches de cama en Bucaramanga: inspección minuciosa, tratamiento certificado INVIMA y segunda visita para romper el ciclo. Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/control-chinches',
  },
  openGraph: {
    title: 'Control de Chinches de Cama en Bucaramanga | AGROINCOL',
    description:
      'Eliminación profesional de chinches de cama en Bucaramanga: inspección minuciosa, tratamiento certificado y segunda visita para romper el ciclo.',
    url: 'https://agroincol.com/servicios/control-chinches',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Control de Chinches de Cama en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Control de Chinches de Cama en Bucaramanga | AGROINCOL',
    description:
      'Eliminación profesional de chinches de cama en Bucaramanga: inspección minuciosa, tratamiento certificado y segunda visita para romper el ciclo.',
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Control de Chinches de Cama',
  serviceType: 'Control de Chinches de Cama',
  provider: {
    '@type': 'LocalBusiness',
    '@id': 'https://agroincol.com/#organization',
    name: 'AGROINCOL',
    telephone: BUSINESS.phoneRaw,
  },
  areaServed: {
    '@type': 'City',
    name: 'Bucaramanga',
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Santander',
    },
  },
  description:
    'Servicio profesional de eliminación de chinches de cama en Bucaramanga y el área metropolitana. Inspección minuciosa, tratamiento de colchones, zócalos y grietas, y segunda visita para romper el ciclo de huevos. Certificación INVIMA.',
};

const FAQS_CHINCHES = [
  {
    question: '¿Cómo sé si tengo chinches de cama y no pulgas o zancudos?',
    answer:
      'Las picaduras de chinches suelen aparecer en línea o en grupos de tres al despertar, en zonas expuestas como brazos, cuello y piernas. Además, revise las sábanas y las costuras del colchón: manchas pequeñas de sangre, puntos negros (excremento) o un olor dulzón en la habitación son señales típicas de infestación. Si tiene dudas, nuestra inspección lo confirma.',
  },
  {
    question: '¿Por qué los insecticidas de supermercado no eliminan las chinches?',
    answer:
      'Las chinches de cama han desarrollado resistencia a muchos insecticidas de venta libre, se esconden en grietas, costuras y zócalos donde el aerosol no llega, y sus huevos sobreviven a la mayoría de productos caseros. Por eso una aplicación casera suele dispersar la infestación en lugar de eliminarla.',
  },
  {
    question: '¿Cuántas visitas se necesitan para eliminar las chinches por completo?',
    answer:
      'El tratamiento profesional incluye una primera visita de inspección y aplicación, y una segunda visita de refuerzo programada para eliminar las ninfas que nacen de los huevos que sobreviven al primer tratamiento. Esa segunda visita es la que rompe el ciclo y evita la reinfestación.',
  },
  {
    question: '¿Tengo que botar el colchón si hay chinches?',
    answer:
      'En la mayoría de los casos no es necesario. El tratamiento profesional incluye el colchón, el somier y la base de la cama, además de zócalos, grietas y muebles cercanos. Botar el colchón sin tratar la habitación no resuelve el problema, porque las chinches también viven fuera de la cama.',
  },
  {
    question: '¿Cuánto cuesta el control de chinches en Bucaramanga?',
    answer:
      'El costo depende del número de habitaciones afectadas y del nivel de infestación. La cotización es gratuita y sin compromiso. Puede consultar nuestra página de precios o escribirnos por WhatsApp para recibir una cotización el mismo día.',
  },
  {
    question: '¿El tratamiento es seguro para niños y mascotas?',
    answer:
      'Sí. Utilizamos productos con registro sanitario aplicados por técnicos capacitados, siguiendo los protocolos de reingreso recomendados. Le indicamos cuánto tiempo debe ventilar la habitación antes de volver a usarla, generalmente unas pocas horas.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_CHINCHES.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const signs = [
  {
    icon: Bed,
    title: 'Picaduras en línea al despertar',
    text: 'Ronchas rojas que aparecen en hilera o en grupos de tres, generalmente en brazos, cuello, espalda y piernas — las zonas expuestas mientras duerme.',
  },
  {
    icon: Droplets,
    title: 'Manchas en sábanas y colchón',
    text: 'Pequeñas manchas de sangre en las sábanas y puntos negros (excremento de chinche) concentrados en las costuras del colchón, el somier y las esquinas de la cama.',
  },
  {
    icon: Wind,
    title: 'Olor dulzón en la habitación',
    text: 'En infestaciones avanzadas, las chinches liberan un olor dulzón característico, similar a almendra o cilantro, perceptible al acercarse a la cama.',
  },
  {
    icon: Search,
    title: 'Insectos visibles en grietas y costuras',
    text: 'Adultos del tamaño de una semilla de manzana, color café rojizo, escondidos en costuras, cabeceras, zócalos y grietas cercanas a la cama.',
  },
];

const spreadCauses = [
  {
    icon: Plane,
    text: 'Viajes: las chinches se transportan en maletas, ropa y mochilas desde hoteles, buses y aeropuertos sin que usted lo note.',
  },
  {
    icon: Hotel,
    text: 'Hoteles y hospedajes: una sola habitación infestada puede contaminar el equipaje de decenas de huéspedes que luego llevan el problema a casa.',
  },
  {
    icon: Sofa,
    text: 'Muebles usados: colchones, sofás y camas de segunda mano son una de las vías de entrada más comunes de chinches a los hogares.',
  },
  {
    icon: Building2,
    text: 'Alta rotación urbana: en apartamentos, residencias y arriendos por días, el movimiento constante de personas multiplica el riesgo de propagación entre unidades vecinas.',
  },
];

const treatmentSteps = [
  {
    icon: Search,
    title: '1. Inspección minuciosa',
    text: 'Revisamos colchones, somieres, cabeceras, zócalos, grietas, muebles y tomas eléctricas para mapear todos los focos de la infestación, no solo la cama.',
  },
  {
    icon: SprayCan,
    title: '2. Tratamiento dirigido',
    text: 'Aplicamos productos con registro sanitario en colchones, costuras, zócalos, grietas y todos los escondites identificados, con técnicas que alcanzan donde los aerosoles caseros no llegan.',
  },
  {
    icon: RotateCcw,
    title: '3. Segunda visita de refuerzo',
    text: 'Los huevos de chinche resisten la mayoría de tratamientos. Programamos una segunda visita para eliminar las ninfas recién nacidas y romper el ciclo de reproducción definitivamente.',
  },
];

const travelTips = [
  'Al llegar a un hotel, revise las costuras del colchón y la cabecera antes de deshacer la maleta.',
  'Mantenga la maleta sobre el portaequipajes o en el baño, nunca sobre la cama o el piso alfombrado.',
  'Al regresar de viaje, lave toda la ropa con agua caliente, incluso la que no usó.',
  'Inspeccione la maleta vacía y aspírela antes de guardarla.',
  'Si compra muebles o colchones usados, inspecciónelos minuciosamente antes de entrarlos a su casa.',
];

export default function ControlChinchesPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Control de Chinches de Cama' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        title="Control de Chinches de Cama en Bucaramanga"
        subtitle="Eliminación profesional con inspección minuciosa, tratamiento certificado y segunda visita para romper el ciclo de huevos. Más de 40 años protegiendo hogares y hoteles en Santander."
        badgeText="Servicio certificado INVIMA — 40+ años de experiencia"
        primaryCta={{ text: 'Elimine las Chinches Hoy', href: '#contacto' }}
        secondaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Técnico de AGROINCOL realizando control de chinches de cama en Bucaramanga"
      />

      {/* 2. Cómo identificar chinches */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Cómo Saber si Tiene Chinches de Cama?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Las chinches de cama son expertas en esconderse: salen de noche, se alimentan mientras usted duerme y
            vuelven a sus refugios antes del amanecer. Por eso la mayoría de las personas descubre la infestación
            por las señales que dejan, no por ver los insectos. Estas son las cuatro señales más confiables:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {signs.map((sign, index) => {
              const Icon = sign.icon;
              return (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-brand-black mb-1">{sign.title}</h3>
                    <p className="text-brand-gray text-body">{sign.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Por qué se propagan */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Por Qué las Chinches Llegan a su Casa o Negocio?
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Tener chinches no es señal de falta de aseo. A diferencia de las cucarachas, las chinches no buscan
            comida ni basura: buscan personas. Se propagan viajando como polizones, y Bucaramanga — con su flujo
            constante de viajeros, hospedajes y arriendos de corta estadía — ofrece las condiciones ideales:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spreadCauses.map((cause, index) => {
              const Icon = cause.icon;
              return (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-brand-orange/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-brand-orange" />
                  </div>
                  <p className="text-brand-black text-body">{cause.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Por qué los insecticidas caseros fallan */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Por Qué los Insecticidas Caseros No Funcionan Contra las Chinches
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            Si ya intentó con aerosoles de supermercado y las chinches volvieron, no es casualidad. Hay tres
            razones por las que el tratamiento casero falla casi siempre:
          </p>
          <ul className="space-y-4 mb-8 max-w-3xl">
            <li className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm">
              <span className="text-brand-orange font-bold shrink-0">1.</span>
              <p className="text-brand-black text-body">
                <strong>Resistencia a insecticidas:</strong> las poblaciones actuales de chinches han desarrollado
                resistencia a muchos de los ingredientes activos de los productos de venta libre.
              </p>
            </li>
            <li className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm">
              <span className="text-brand-orange font-bold shrink-0">2.</span>
              <p className="text-brand-black text-body">
                <strong>Se esconden donde el aerosol no llega:</strong> grietas, costuras del colchón, zócalos,
                cabeceras y hasta tomas eléctricas. El producto casero solo alcanza las superficies visibles.
              </p>
            </li>
            <li className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm">
              <span className="text-brand-orange font-bold shrink-0">3.</span>
              <p className="text-brand-black text-body">
                <strong>Los huevos sobreviven:</strong> aunque elimine los adultos, los huevos eclosionan días
                después y la infestación reaparece — a menudo más dispersa que antes.
              </p>
            </li>
          </ul>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>Importante:</strong> aplicar insecticida casero suele empeorar el problema, porque las
                chinches sobrevivientes se dispersan hacia otras habitaciones huyendo del producto.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Tratamiento profesional */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Nuestro Tratamiento Profesional Contra Chinches
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            El control efectivo de chinches no es una aplicación, es un protocolo. Así trabajamos en AGROINCOL:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {treatmentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-brand-green/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-brand-green" />
                  </div>
                  <h3 className="font-heading font-semibold text-brand-black mb-2">{step.title}</h3>
                  <p className="text-brand-gray text-body">{step.text}</p>
                </div>
              );
            })}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" href="#contacto">
              Solicite su inspección
            </Button>
            <Link
              href="/precios"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              Consulte nuestros precios de fumigación →
            </Link>
          </div>
          <p className="text-brand-gray text-body mt-6">
            ¿La infestación viene acompañada de otras plagas? Conozca nuestro servicio de{' '}
            <Link
              href="/servicios/fumigacion-residencial"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              fumigación residencial
            </Link>{' '}
            o explore todos nuestros{' '}
            <Link
              href="/servicios"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              servicios de control de plagas
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 6. Hoteles y hospedajes */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Hoteles y Hospedajes en Bucaramanga: el Riesgo es su Reputación
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            Para un hotel, hostal o apartamento turístico, las chinches no son solo un problema sanitario: son un
            problema de reputación. Una sola reseña en Google o Booking mencionando chinches puede frenar reservas
            durante meses, y eliminarla es prácticamente imposible. La alta rotación de huéspedes hace que ningún
            hospedaje — por limpio que sea — esté exento del riesgo.
          </p>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <ShieldCheck size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>Programa preventivo para hospedajes:</strong> inspecciones periódicas de habitaciones,
                tratamiento inmediato ante cualquier sospecha y certificado de control de plagas válido ante las
                autoridades sanitarias. Detectar un foco a tiempo cuesta mucho menos que una reseña negativa.
              </p>
            </div>
          </div>
          <p className="text-brand-gray text-body">
            Conozca los requisitos sanitarios que aplican a su establecimiento en nuestra página de{' '}
            <Link
              href="/certificaciones-y-normativa"
              className="text-brand-orange hover:text-brand-orange-dark font-semibold underline transition-colors"
            >
              certificaciones y normativa
            </Link>
            .
          </p>
        </div>
      </section>

      {/* 7. Prevención al viajar */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Cómo Evitar Traer Chinches de un Viaje
          </h2>
          <p className="text-brand-gray text-body-lg mb-6">
            La mayoría de las infestaciones domésticas empiezan con una maleta. Estos hábitos sencillos reducen
            drásticamente el riesgo:
          </p>
          <ul className="space-y-3 max-w-3xl">
            {travelTips.map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-brand-black text-body">
                <span className="text-brand-orange shrink-0">✓</span> {tip}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 8. FAQ */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            Preguntas Frecuentes sobre Control de Chinches
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_CHINCHES} />
          </div>
        </div>
      </section>

      {/* 9. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                Recupere su Descanso — Elimine las Chinches de Raíz
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Cada noche que pasa, la infestación crece. Solicite una cotización sin compromiso y nuestro equipo
                se pondrá en contacto con usted en menos de 2 horas.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Cotización gratis y sin compromiso',
                  'Respuesta en menos de 2 horas',
                  'Segunda visita incluida en el protocolo',
                  'Certificación INVIMA — 40+ años de experiencia',
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
              <ContactForm formId="chinches-contact" preselectedService="Fumigación Residencial" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
