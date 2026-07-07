import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, FileCheck, MessageCircle, ShieldCheck, Store } from 'lucide-react';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';
import ContactForm from '@/components/forms/ContactForm';
import Button from '@/components/ui/Button';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import { BUSINESS } from '@/lib/constants';

// Landing TRANSACCIONAL para el cluster "certificado de fumigación" (GSC pos 17-34, 0 clics).
// Intención: alguien que necesita el documento YA para pasar una inspección INVIMA / Secretaría de Salud.
// La página /certificaciones-y-normativa cubre el ángulo normativo institucional (Decreto 1843, Res. 2674).

const FAQS = [
  {
    question: '¿Cuánto cuesta el certificado de fumigación?',
    answer:
      'El certificado no tiene costo adicional: va incluido en el servicio de fumigación o control de plagas que contrate con AGROINCOL. El precio depende del tamaño y tipo del establecimiento. Solicite una cotización gratuita y le confirmamos el valor el mismo día.',
  },
  {
    question: '¿Cuándo me entregan el certificado?',
    answer:
      'El mismo día del servicio. Al finalizar la fumigación, nuestro técnico le entrega el certificado firmado, junto con las fichas técnicas de los productos si su establecimiento las necesita para auditorías.',
  },
  {
    question: '¿El certificado sirve ante el INVIMA y la Secretaría de Salud?',
    answer:
      'Sí. El certificado de AGROINCOL cumple con el Decreto 1843 de 1991 y la Resolución 2674 de 2013, y es válido como soporte documental ante inspecciones del INVIMA y de la Secretaría de Salud de Santander para restaurantes, establecimientos de alimentos, comercios e industrias.',
  },
  {
    question: '¿Qué necesito para que me emitan el certificado?',
    answer:
      'Solo programar el servicio de control de plagas. No requiere trámites previos: agendamos la visita, realizamos la fumigación con productos registrados ante el ICA y emitimos el certificado al terminar.',
  },
  {
    question: 'Tengo una inspección pronto, ¿pueden ir hoy?',
    answer:
      'En la mayoría de los casos sí atendemos el mismo día o al día siguiente según disponibilidad. Escríbanos por WhatsApp explicando su urgencia y le confirmamos el horario más cercano.',
  },
];

const incluye = [
  'Fecha y hora del servicio',
  'Productos utilizados con sus registros ICA',
  'Concentraciones y métodos de aplicación',
  'Áreas tratadas y plagas objetivo',
  'Recomendaciones post-servicio',
  'Firma del técnico responsable',
  'Datos de la empresa: NIT, dirección y teléfono',
];

const quienes = [
  { icon: Store, title: 'Restaurantes y cafeterías', text: 'Obligatorio para el plan de saneamiento exigido por la Resolución 2674.' },
  { icon: ShieldCheck, title: 'Establecimientos de alimentos', text: 'Panaderías, supermercados, plazas y plantas de procesamiento.' },
  { icon: FileCheck, title: 'Comercios e industrias', text: 'Bodegas, oficinas, hoteles, colegios y conjuntos residenciales.' },
];

const pasos = [
  { n: '1', title: 'Nos escribes', text: 'Por WhatsApp. Te respondemos en menos de 5 minutos y cotizamos gratis el mismo día según tu establecimiento.' },
  { n: '2', title: 'Hacemos el servicio', text: 'Técnicos certificados, productos registrados ante el ICA y protocolos de seguridad.' },
  { n: '3', title: 'Recibes el certificado', text: 'Firmado y válido ante INVIMA, en mano el mismo día del servicio.' },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })),
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Certificado de Fumigación',
  serviceType: 'Certificado de fumigación y control de plagas',
  description:
    'Certificado de fumigación válido ante INVIMA y Secretaría de Salud en Bucaramanga, entregado el mismo día del servicio. Cumple el Decreto 1843 de 1991 y la Resolución 2674 de 2013.',
  url: 'https://agroincol.com/certificado-de-fumigacion',
  provider: { '@id': 'https://agroincol.com/#organization' },
  areaServed: [
    { '@type': 'City', name: 'Bucaramanga', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Floridablanca', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Piedecuesta', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
    { '@type': 'City', name: 'Girón', containedInPlace: { '@type': 'AdministrativeArea', name: 'Santander' } },
  ],
};

export const metadata: Metadata = {
  title: 'Certificado de Fumigación Bucaramanga: El Mismo Día',
  description:
    'Certificado de fumigación válido ante INVIMA y Secretaría de Salud en Bucaramanga ✓ Entregado el mismo día ✓ Incluido en el servicio, sin costo extra ✓ Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com/certificado-de-fumigacion',
  },
  openGraph: {
    title: 'Certificado de Fumigación en Bucaramanga el Mismo Día | AGROINCOL',
    description:
      'Certificado de fumigación válido ante INVIMA, entregado el mismo día del servicio. Para restaurantes, comercios e industrias en Bucaramanga y el Área Metropolitana.',
    url: 'https://agroincol.com/certificado-de-fumigacion',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/certificaciones/entrega-certificado.jpg',
        width: 1200,
        height: 630,
        alt: 'Entrega de certificado de fumigación AGROINCOL en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificado de Fumigación en Bucaramanga el Mismo Día | AGROINCOL',
    description:
      'Certificado de fumigación válido ante INVIMA y Secretaría de Salud, entregado el mismo día. Cotice gratis.',
  },
};

export default function CertificadoFumigacionPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Certificado de Fumigación' },
      ]} />

      {/* 1. Hero */}
      <Hero
        withBreadcrumbs
        badgeText="Entrega el mismo día"
        title="Certificado de Fumigación en Bucaramanga"
        subtitle="¿Tiene una inspección del INVIMA o de la Secretaría de Salud? Le entregamos el certificado de fumigación el mismo día, válido como soporte documental y sin costo adicional sobre el servicio."
        primaryCta={{ text: 'Cotizar gratis', href: '#contacto' }}
        secondaryCta={{ text: 'WhatsApp ahora', href: BUSINESS.whatsappLink }}
        centeredText
      />

      {/* 2. Respuesta directa (citable) */}
      <section className="section-padding bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Qué es el certificado de fumigación y para qué sirve?
          </h2>
          <p className="text-brand-gray text-body-lg leading-relaxed mb-4">
            El certificado de fumigación es el documento que acredita que un establecimiento realizó un
            servicio profesional de control de plagas. En Colombia es el soporte que exigen los inspectores
            del INVIMA y de la Secretaría de Salud durante una visita sanitaria, especialmente en
            restaurantes y establecimientos de alimentos.
          </p>
          <p className="text-brand-gray text-body-lg leading-relaxed">
            Para que sea válido debe ser emitido por una empresa especializada, con productos registrados
            ante el ICA, y cumplir el <strong>Decreto 1843 de 1991</strong> y la{' '}
            <strong>Resolución 2674 de 2013</strong>. En AGROINCOL lo entregamos firmado el mismo día del
            servicio, con más de 40 años respaldando cada certificado en Bucaramanga.
          </p>
        </div>
      </section>

      {/* 3. Cómo obtenerlo (3 pasos) */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            Cómo obtener su certificado en 3 pasos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pasos.map((p) => (
              <div key={p.n} className="bg-white rounded-2xl p-6 shadow-soft">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-gradient font-heading text-lg font-bold text-white">
                  {p.n}
                </div>
                <h3 className="font-heading font-semibold text-brand-green text-h3 mt-4">{p.title}</h3>
                <p className="text-brand-gray text-body mt-2 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Qué incluye + imagen */}
      <section className="section-padding bg-white">
        <div className="container-custom grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
              Qué incluye nuestro certificado
            </h2>
            <ul className="space-y-3">
              {incluye.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
                  <span className="text-brand-black text-body">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-brand-gray text-body mt-6">
              ¿Quiere conocer el detalle normativo?{' '}
              <Link href="/certificaciones-y-normativa" className="text-brand-orange font-semibold hover:underline">
                Vea el Decreto 1843 y la Resolución 2674 →
              </Link>
            </p>
          </div>
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-soft">
            <Image
              src="/images/certificaciones/entrega-certificado.jpg"
              alt="Entrega de certificado de fumigación AGROINCOL a cliente en Bucaramanga"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>
        </div>
      </section>

      {/* 5. Quién lo necesita */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-12">
            ¿Quién necesita certificado de fumigación?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quienes.map((q) => {
              const Icon = q.icon;
              return (
                <div key={q.title} className="bg-white rounded-2xl p-6 shadow-soft">
                  <Icon size={32} className="text-brand-orange mb-4" />
                  <h3 className="font-heading font-semibold text-brand-green text-h3">{q.title}</h3>
                  <p className="text-brand-gray text-body mt-2 leading-relaxed">{q.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Banda de costo / urgencia */}
      <section className="section-padding bg-brand-green">
        <div className="container-custom max-w-3xl text-center">
          <Clock size={36} className="text-brand-orange mx-auto mb-4" />
          <h2 className="font-heading text-h2-mobile md:text-h2 text-white mb-4">
            El certificado va incluido en el servicio
          </h2>
          <p className="text-gray-200 text-body-lg leading-relaxed mb-8">
            No cobramos el certificado aparte. Usted paga la fumigación según el tamaño de su establecimiento
            y recibe el documento firmado el mismo día. Cotización gratis y sin compromiso.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="primary" href="#contacto">Cotizar gratis</Button>
            <Button variant="whatsapp" href={BUSINESS.whatsappLink} target="_blank">
              <MessageCircle size={18} /> Escribir por WhatsApp
            </Button>
          </div>
        </div>
      </section>

      {/* 7. FAQ visible */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green text-center mb-10">
            Preguntas frecuentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {FAQS.map((faq) => (
              <div key={faq.question} className="bg-brand-light rounded-2xl p-6">
                <h3 className="font-heading font-bold text-brand-green text-lg">{faq.question}</h3>
                <p className="text-brand-gray text-body mt-2 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. CTA + Form */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green">
              Solicite su certificado de fumigación
            </h2>
            <p className="text-brand-gray text-body-lg mt-4">
              Déjenos sus datos y le cotizamos hoy mismo. Emitimos el certificado el mismo día del servicio.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <ContactForm formId="certificado-contact" />
          </div>
        </div>
      </section>

      <SchemaMarkup schema={serviceSchema} />
      <SchemaMarkup schema={faqSchema} />
    </>
  );
}
