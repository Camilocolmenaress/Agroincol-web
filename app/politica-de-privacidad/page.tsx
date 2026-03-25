import type { Metadata } from 'next';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Hero from '@/components/sections/Hero';

export const metadata: Metadata = {
  title: 'Política de Privacidad | AGROINCOL',
  description: 'Política de tratamiento de datos personales de AGROINCOL conforme a la Ley 1581 de 2012.',
  alternates: {
    canonical: 'https://agroincol.com/politica-de-privacidad',
  },
  robots: {
    index: false,
    follow: true,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Política de Privacidad | AGROINCOL',
    description: 'Política de tratamiento de datos personales de AGROINCOL conforme a la Ley 1581 de 2012.',
  },
};

const sections = [
  {
    title: '1. Responsable del Tratamiento',
    content: (
      <>
        <p className="text-brand-black text-body leading-relaxed">
          <strong>AGROINCOL</strong>
        </p>
        <ul className="list-none space-y-1 text-brand-black text-body leading-relaxed mt-2">
          <li><strong>NIT:</strong> 1.095.786.836-1</li>
          <li><strong>Dirección:</strong> Cra 9 #3-34, Floridablanca, Santander, Colombia</li>
          <li><strong>Teléfono:</strong> +57 310 789 1948</li>
          <li><strong>Correo electrónico:</strong> agroincol.1985@gmail.com</li>
          <li><strong>Correo para PQRS de datos personales:</strong> agroincol.1985@gmail.com</li>
        </ul>
      </>
    ),
  },
  {
    title: '2. Finalidad del Tratamiento',
    content: (
      <>
        <p className="text-brand-black text-body leading-relaxed">
          AGROINCOL recopila y trata datos personales con las siguientes finalidades:
        </p>
        <ul className="list-disc list-inside space-y-2 text-brand-black text-body leading-relaxed mt-3">
          <li>Enviar cotizaciones de servicios de fumigación y control de plagas</li>
          <li>Contactar al titular vía telefónica, WhatsApp o correo electrónico para seguimiento comercial</li>
          <li>Agendar y coordinar servicios de fumigación</li>
          <li>Enviar información sobre promociones, descuentos y servicios nuevos</li>
          <li>Emitir certificados de fumigación</li>
          <li>Cumplir con obligaciones legales y regulatorias</li>
          <li>Realizar encuestas de satisfacción del servicio</li>
        </ul>
      </>
    ),
  },
  {
    title: '3. Datos que Recopilamos',
    content: (
      <p className="text-brand-black text-body leading-relaxed">
        A través de nuestros formularios web recopilamos: nombre completo, número de teléfono/WhatsApp,
        correo electrónico (opcional), dirección del servicio (opcional), tipo de servicio requerido,
        y descripción de la situación de plagas.
      </p>
    ),
  },
  {
    title: '4. Derechos del Titular',
    content: (
      <>
        <p className="text-brand-black text-body leading-relaxed">
          De acuerdo con la Ley 1581 de 2012, usted como titular de los datos tiene derecho a:
        </p>
        <ul className="list-disc list-inside space-y-2 text-brand-black text-body leading-relaxed mt-3">
          <li>Conocer, actualizar y rectificar sus datos personales</li>
          <li>Solicitar prueba de la autorización otorgada</li>
          <li>Ser informado sobre el uso que se ha dado a sus datos</li>
          <li>Revocar la autorización y/o solicitar la supresión de sus datos cuando considere que no se han respetado los principios, derechos y garantías constitucionales y legales</li>
          <li>Acceder de forma gratuita a sus datos personales que hayan sido tratados</li>
        </ul>
      </>
    ),
  },
  {
    title: '5. Canal de PQRS',
    content: (
      <>
        <p className="text-brand-black text-body leading-relaxed">
          Para ejercer cualquiera de sus derechos, puede comunicarse a través de:
        </p>
        <ul className="list-disc list-inside space-y-2 text-brand-black text-body leading-relaxed mt-3">
          <li><strong>Correo electrónico:</strong> agroincol.1985@gmail.com (asunto: &ldquo;PQRS Datos Personales&rdquo;)</li>
          <li><strong>WhatsApp:</strong> +57 310 789 1948 (mensaje: &ldquo;BAJA&rdquo; para solicitar eliminación)</li>
          <li><strong>Dirección física:</strong> Cra 9 #3-34, Floridablanca, Santander</li>
        </ul>
        <p className="text-brand-black text-body leading-relaxed mt-3">
          AGROINCOL dará respuesta en un plazo máximo de quince (15) días hábiles.
        </p>
      </>
    ),
  },
  {
    title: '6. Vigencia',
    content: (
      <p className="text-brand-black text-body leading-relaxed">
        Esta política entra en vigencia a partir del 7 de marzo de 2026. Última actualización: 7 de marzo de 2026.
      </p>
    ),
  },
];

export default function PoliticaPrivacidadPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Política de Privacidad' },
      ]} />
      <Hero
        withBreadcrumbs
        title="Política de Tratamiento de Datos Personales"
        subtitle="Conforme a la Ley 1581 de 2012 y el Decreto 1377 de 2013"
        primaryCta={{ text: 'Volver al Inicio', href: '/' }}
        centeredText
      />

      {sections.map((section, index) => (
        <section
          key={section.title}
          className={`section-padding ${index % 2 === 0 ? 'bg-white' : 'bg-brand-light'}`}
        >
          <div className="container-custom max-w-3xl">
            <h2 className="font-heading text-h3 md:text-h2-mobile text-brand-green mb-4">
              {section.title}
            </h2>
            {section.content}
          </div>
        </section>
      ))}
    </>
  );
}
