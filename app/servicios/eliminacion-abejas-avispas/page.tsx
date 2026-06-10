import type { Metadata } from 'next';
import Link from 'next/link';
import { AlertTriangle, ShieldAlert, Flame, Wind, Phone, Leaf, Bug, Eye } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ProcessTimeline from '@/components/sections/ProcessTimeline';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';
import FAQAccordion from './FAQAccordion';

export const metadata: Metadata = {
  title: 'Retiro de Nidos de Abejas y Avispas en Bucaramanga',
  description: '¿Encontró un nido de abejas o avispas? No lo toque. AGROINCOL hace el retiro seguro en Bucaramanga con equipos de protección especializados. Llame ya.',
  alternates: {
    canonical: 'https://agroincol.com/servicios/eliminacion-abejas-avispas',
  },
  openGraph: {
    title: 'Retiro de Nidos de Abejas y Avispas en Bucaramanga | AGROINCOL',
    description: '¿Encontró un nido de abejas o avispas? No lo toque. AGROINCOL hace el retiro seguro en Bucaramanga con equipos de protección especializados.',
    url: 'https://agroincol.com/servicios/eliminacion-abejas-avispas',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Retiro de Nidos de Abejas y Avispas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Retiro de Nidos de Abejas y Avispas en Bucaramanga | AGROINCOL',
    description: '¿Encontró un nido de abejas o avispas? No lo toque. AGROINCOL hace el retiro seguro en Bucaramanga con equipos de protección especializados.',
  },
};

const FAQS_ABEJAS = [
  {
    question: '¿Qué hago si encuentro un nido de abejas o avispas en mi casa?',
    answer:
      'Aléjese del nido sin movimientos bruscos, mantenga a niños y mascotas dentro de la casa, cierre puertas y ventanas cercanas, y llame a AGROINCOL. No intente retirarlo, golpearlo ni rociarle nada: las abejas y avispas atacan en grupo cuando sienten el nido amenazado.',
  },
  {
    question: '¿Las abejas se exterminan o se reubican?',
    answer:
      'Las abejas son polinizadores esenciales, por eso, cuando el nido es accesible y la colmena lo permite, AGROINCOL coordina su reubicación con apicultores en lugar de exterminarlas. Esto depende de cada caso: la ubicación del nido, su accesibilidad y el nivel de riesgo para las personas. Las avispas, en cambio, no se reubican y el nido se elimina de forma controlada.',
  },
  {
    question: '¿Qué tan peligrosas son las abejas africanizadas?',
    answer:
      'Las abejas africanizadas están presentes en Santander y son mucho más defensivas que las abejas comunes: ante una amenaza pueden atacar en enjambre, perseguir a la persona por cientos de metros y causar decenas de picaduras. Por eso un nido cerca de viviendas, colegios o negocios debe ser manejado únicamente por personal con equipos de protección especializados.',
  },
  {
    question: '¿Puedo retirar el nido yo mismo con humo, agua o insecticida?',
    answer:
      'No. El humo, el agua a presión, los golpes o los insecticidas caseros alteran la colmena y provocan un ataque masivo. La mayoría de los accidentes graves por picaduras ocurren cuando alguien intenta retirar el nido por su cuenta. AGROINCOL realiza el retiro seguro de nidos de abejas y avispas con equipos de protección especializados.',
  },
  {
    question: '¿Cómo sé si tengo abejas o avispas?',
    answer:
      'Las abejas tienen el cuerpo robusto y velloso, de tonos café y dorado, y forman panales de cera. Las avispas tienen el cuerpo alargado y liso, con cintura marcada y colores amarillo y negro intensos, y construyen nidos grises de aspecto de papel. Si no está seguro, no se acerque: envíenos una foto por WhatsApp desde una distancia segura y nuestro equipo la identifica.',
  },
  {
    question: '¿Cuánto cuesta el retiro de un nido de abejas o avispas?',
    answer:
      'El costo depende de la ubicación del nido, su altura, accesibilidad y tamaño de la colmena. Contáctenos por teléfono o WhatsApp con una foto del nido y le damos una cotización sin compromiso. También puede consultar nuestra página de precios para conocer los rangos de nuestros servicios.',
  },
];

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Retiro de Nidos de Abejas y Avispas',
  serviceType: 'Retiro de Nidos de Abejas y Avispas',
  provider: {
    '@type': 'LocalBusiness',
    '@id': 'https://agroincol.com/#organization',
    name: 'AGROINCOL',
    telephone: BUSINESS.phoneRaw,
  },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
  description:
    'Retiro seguro de nidos de abejas y avispas en Bucaramanga y Área Metropolitana con equipos de protección especializados. Reubicación con apicultores cuando es viable.',
  url: 'https://agroincol.com/servicios/eliminacion-abejas-avispas',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS_ABEJAS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
};

const dangers = [
  {
    icon: AlertTriangle,
    text: 'Atacan en enjambre: cuando una abeja pica, libera una feromona de alarma que llama a cientos más a atacar',
  },
  {
    icon: ShieldAlert,
    text: 'Pueden perseguir a una persona por cientos de metros y picar a través de la ropa delgada',
  },
  {
    icon: Bug,
    text: 'Decenas de picaduras simultáneas pueden causar reacciones graves incluso en personas no alérgicas',
  },
  {
    icon: Eye,
    text: 'Defienden un perímetro amplio alrededor del nido: pasar cerca, podar o hacer ruido puede detonar el ataque',
  },
];

const errors = [
  {
    icon: Flame,
    title: 'Humo o fuego',
    text: 'El humo casero no las "duerme": las altera y dispersa el enjambre hacia las personas. Además genera riesgo de incendio en techos y fachadas.',
  },
  {
    icon: Wind,
    title: 'Agua a presión o golpes',
    text: 'Mojar el nido con manguera o golpearlo con palos destruye parte de la estructura y desata un ataque masivo inmediato de toda la colmena.',
  },
  {
    icon: Bug,
    title: 'Insecticida de aerosol',
    text: 'Los aerosoles domésticos solo alcanzan a las que están en la superficie. El resto de la colmena sale a defenderse y usted queda a pocos metros sin protección.',
  },
];

const whileYouWait = [
  'Aléjese del nido caminando despacio, sin manotear ni correr en zigzag cerca de él',
  'Mantenga a niños, adultos mayores y mascotas dentro de la casa',
  'Cierre puertas y ventanas de las habitaciones cercanas al nido',
  'No use perfumes, lociones ni productos con olores dulces o florales: las atraen',
  'No apunte luces ni cámaras con flash directamente al nido',
  'Si alguien presenta muchas picaduras, dificultad para respirar o hinchazón, acuda de inmediato a urgencias',
];

export default function AbejasAvispasPage() {
  return (
    <>
      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Servicios', href: '/servicios' },
        { name: 'Retiro de Abejas y Avispas' },
      ]} />

      {/* 1. Hero — urgencia */}
      <Hero
        withBreadcrumbs
        title="Retiro de Abejas y Avispas en Bucaramanga"
        subtitle="¿Encontró un nido en su casa o negocio? No intente retirarlo: aléjese y llámenos. Retiro seguro con equipos de protección especializados y reubicación con apicultores cuando es viable. Más de 40 años protegiendo Santander."
        badgeText="Atención prioritaria en Bucaramanga y Área Metropolitana"
        primaryCta={{ text: 'Llamar Ahora', href: `tel:${BUSINESS.phoneRaw}` }}
        secondaryCta={{ text: 'WhatsApp con foto del nido', href: BUSINESS.whatsappLink }}
        imageSrc="/images/hero/hero-home.jpg"
        imageAlt="Técnico de AGROINCOL con equipo de protección retirando nido de abejas en Bucaramanga"
      />

      {/* 2. Barra de urgencia */}
      <section className="bg-brand-orange/10 border-y border-brand-orange/30">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Phone size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>¿Tiene el nido frente a usted en este momento?</strong> Aléjese a una distancia segura y
                contáctenos. Le indicamos qué hacer mientras llega el técnico.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <Button variant="primary" href={`tel:${BUSINESS.phoneRaw}`}>
                {BUSINESS.phone}
              </Button>
              <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Peligro: abejas africanizadas */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Abejas Africanizadas en Santander: por Qué un Nido es una Emergencia
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            En Santander gran parte de las colmenas silvestres corresponden a abejas africanizadas, un híbrido mucho
            más defensivo que la abeja común. No buscan atacar a las personas, pero cuando sienten su nido amenazado
            reaccionan en masa. Un nido en un techo, un árbol del antejardín o el ducto de un edificio representa un
            riesgo real para su familia y sus vecinos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dangers.map((danger, index) => {
              const Icon = danger.icon;
              return (
                <div key={index} className="flex items-start gap-4 bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                    <Icon size={24} className="text-red-500" />
                  </div>
                  <p className="text-brand-black text-body">{danger.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Por qué NO retirarlo usted mismo */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Por Qué NO Debe Intentar Retirar el Nido Usted Mismo
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Los métodos caseros que circulan en internet son la principal causa de ataques masivos. Estos son los
            tres errores más comunes y por qué son tan peligrosos:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {errors.map((error, index) => {
              const Icon = error.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={24} className="text-red-500" />
                  </div>
                  <h3 className="font-heading font-semibold text-brand-black text-h3 mb-2">
                    {error.title}
                  </h3>
                  <p className="text-brand-gray text-body">{error.text}</p>
                </div>
              );
            })}
          </div>
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6">
            <div className="flex items-start gap-3">
              <ShieldAlert size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">
                <strong>Nuestros técnicos trabajan con equipos de protección especializados:</strong> trajes de
                apicultor completos, guantes reforzados y herramientas para retirar el panal sin provocar el ataque
                de la colmena, incluso en alturas y espacios confinados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Qué hacer mientras llega el técnico */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Qué Hacer Mientras Llega el Técnico
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Desde el momento en que nos contacta hasta que el técnico llega a su casa o negocio, siga estas
            recomendaciones para mantener a todos seguros:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl">
            {whileYouWait.map((item) => (
              <li key={item} className="flex items-start gap-3 bg-white rounded-xl p-5 shadow-sm">
                <span className="text-brand-orange font-bold shrink-0">✓</span>
                <span className="text-brand-black text-body">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Abejas vs Avispas */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Abejas o Avispas? Cómo Diferenciarlas a Distancia Segura
          </h2>
          <p className="text-brand-gray text-body-lg mb-8">
            Identificar el insecto nos ayuda a llegar con el procedimiento correcto. Obsérvelas desde lejos o
            envíenos una foto por WhatsApp — nunca se acerque al nido para mirar de cerca.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-brand-black text-h3 mb-4">Abejas</h3>
              <ul className="space-y-3">
                {[
                  'Cuerpo robusto y velloso, tonos café y dorado',
                  'Construyen panales de cera con celdas hexagonales visibles',
                  'Suelen anidar en huecos de árboles, techos, muros y ductos',
                  'Pican una sola vez (la abeja muere al picar), pero atacan en grupo',
                  'Son polinizadores: cuando es viable, se reubican en lugar de exterminarse',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-brand-gray text-body">
                    <span className="text-brand-orange shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-brand-black text-h3 mb-4">Avispas</h3>
              <ul className="space-y-3">
                {[
                  'Cuerpo alargado y liso, cintura marcada, amarillo y negro intensos',
                  'Nidos grises con aspecto de papel o barro, a menudo colgantes',
                  'Anidan en aleros, marcos de ventanas, lámparas y ramas',
                  'Pueden picar varias veces sin morir, y también atacan en grupo',
                  'No se reubican: el nido se elimina de forma controlada',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-brand-gray text-body">
                    <span className="text-brand-orange shrink-0">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Retiro responsable */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-brand-green/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
              <Leaf size={24} className="text-brand-green" />
            </div>
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Retiro Responsable: las Abejas se Reubican Cuando es Posible
            </h2>
          </div>
          <p className="text-brand-gray text-body-lg mb-6">
            Las abejas son polinizadores esenciales para los cultivos y los ecosistemas de Santander. Por eso, antes
            de cualquier intervención, evaluamos si la colmena puede rescatarse: cuando el nido es accesible y las
            condiciones lo permiten, coordinamos su reubicación con apicultores en lugar de exterminarlas.
          </p>
          <p className="text-brand-gray text-body-lg mb-8">
            Seamos honestos: no siempre es viable. Nidos dentro de muros, ductos o estructuras de difícil acceso, o
            colmenas demasiado agresivas en zonas con alto tránsito de personas, pueden requerir eliminación
            controlada para proteger la vida de quienes están alrededor. En cada caso le explicamos las opciones y
            por qué recomendamos una u otra. Con las avispas no aplica la reubicación: el nido se elimina de forma
            segura y se trata la zona para evitar que vuelvan a anidar.
          </p>
          <p>
            <Link
              href="/servicios/control-insectos-voladores"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              ¿Problemas con mosquitos, moscas o zancudos? Conozca nuestro control de insectos voladores →
            </Link>
          </p>
        </div>
      </section>

      {/* 8. Process */}
      <ProcessTimeline />

      {/* 9. FAQ */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            Preguntas Frecuentes sobre Retiro de Abejas y Avispas
          </h2>
          <div className="max-w-3xl mx-auto">
            <FAQAccordion faqs={FAQS_ABEJAS} />
          </div>
          <p className="text-center mt-8">
            <Link
              href="/precios"
              className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
            >
              Consulte los rangos de precios de nuestros servicios →
            </Link>
          </p>
        </div>
      </section>

      {/* 10. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
                No se Arriesgue: Solicite el Retiro Profesional
              </h2>
              <p className="text-brand-gray text-body mt-4">
                Cuéntenos dónde está el nido y envíenos una foto si puede tomarla desde una distancia segura.
                Nuestro equipo lo contacta para coordinar la visita.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  'Retiro seguro con equipos de protección especializados',
                  'Reubicación con apicultores cuando es viable',
                  'Cotización gratis y sin compromiso',
                  '40+ años de experiencia en Santander',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-brand-black text-body">
                    <span className="text-brand-orange">✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Button variant="primary" href={`tel:${BUSINESS.phoneRaw}`}>
                  Llamar: {BUSINESS.phone}
                </Button>
                <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
                  Escribir por WhatsApp
                </Button>
              </div>
              <p className="mt-6">
                <Link
                  href="/servicios"
                  className="text-brand-orange hover:text-brand-orange-dark font-body font-semibold text-body-sm underline transition-colors"
                >
                  Ver todos nuestros servicios de control de plagas →
                </Link>
              </p>
            </div>
            <div className="lg:col-span-3">
              <ContactForm formId="abejas-contact" preselectedService="Retiro de Abejas y Avispas" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
