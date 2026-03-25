import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ArticleLayout from '@/components/blog/ArticleLayout';

export const metadata: Metadata = {
  title: 'Auditoría INVIMA: Preparar Restaurante | AGROINCOL',
  description: 'Guía paso a paso para preparar su restaurante en Bucaramanga ante una auditoría del INVIMA. Checklist completo, normativa y cómo evitar sanciones.',
  alternates: {
    canonical: 'https://agroincol.com/blog/auditoria-invima-como-preparar-restaurante',
  },
  openGraph: {
    title: 'Auditoría INVIMA: Preparar Restaurante | AGROINCOL',
    description: 'Guía paso a paso para preparar su restaurante en Bucaramanga ante una auditoría del INVIMA.',
    url: 'https://agroincol.com/blog/auditoria-invima-como-preparar-restaurante',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'article',
    images: [{ url: 'https://agroincol.com/images/hero/hero-restaurantes.jpg', width: 1200, height: 630, alt: 'Auditoría del INVIMA — AGROINCOL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Auditoría INVIMA: Preparar Restaurante | AGROINCOL',
    description: 'Guía paso a paso para preparar su restaurante en Bucaramanga ante una auditoría del INVIMA.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Auditoría del INVIMA: Cómo Preparar su Restaurante para Pasar sin Problemas',
  author: { '@type': 'Organization', name: 'AGROINCOL', '@id': 'https://agroincol.com/#organization' },
  publisher: { '@id': 'https://agroincol.com/#organization' },
  datePublished: '2026-03-14',
  dateModified: '2026-03-14',
  image: 'https://agroincol.com/images/hero/hero-restaurantes.jpg',
  description: 'Guía paso a paso para preparar su restaurante en Bucaramanga ante una auditoría del INVIMA. Checklist completo, normativa y cómo evitar sanciones.',
  mainEntityOfPage: 'https://agroincol.com/blog/auditoria-invima-como-preparar-restaurante',
};

export default function AuditoriaInvimaPage() {
  return (
    <>
      <SchemaMarkup schema={articleSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Auditoría del INVIMA: Cómo Preparar su Restaurante' },
      ]} />
      <ArticleLayout
        withBreadcrumbs
        title="Auditoría del INVIMA: Cómo Preparar su Restaurante para Pasar sin Problemas"
        description="Guía completa para que su restaurante en Bucaramanga pase la auditoría del INVIMA sin sanciones."
        publishDate="2026-03-14"
        category="Restaurantes"
        readTime="8 min"
        currentSlug="auditoria-invima-como-preparar-restaurante"
      >
        {/* Introduction */}
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Las auditorías del INVIMA y de la Secretaría de Salud de Santander son una realidad que todo restaurante en Bucaramanga y el Área Metropolitana debe enfrentar. Estas visitas pueden llegar sin previo aviso, y los inspectores evalúan rigurosamente las condiciones sanitarias de su establecimiento en una sola jornada. No hay segunda oportunidad: si su restaurante no cumple, las consecuencias son inmediatas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Los establecimientos de alimentos en Colombia están obligados a cumplir con la Resolución 2674 de 2013, que exige condiciones sanitarias estrictas, documentación completa y un programa activo de control de plagas. Las sanciones por incumplimiento van desde multas económicas de 5 a 1,000 SMMLV hasta el cierre temporal o definitivo del negocio.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          En AGROINCOL hemos acompañado a cientos de restaurantes del Área Metropolitana de Bucaramanga a prepararse para estas auditorías durante más de 40 años. Esta guía reúne todo lo que necesita saber para que su establecimiento pase la inspección sin problemas. No se trata de improvisar el día anterior: se trata de mantener un estándar constante que le permita operar con tranquilidad.
        </p>

        {/* Qué Revisa el INVIMA */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Qué Revisa el INVIMA en una Auditoría a Restaurantes?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Los inspectores del INVIMA y de la Secretaría de Salud de Santander utilizan un acta de inspección estandarizada que evalúa múltiples aspectos de su operación. Estos son los puntos principales que revisan:
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El <strong>Plan de Saneamiento</strong> es quizás el documento más importante. Debe incluir tres programas: control de plagas, limpieza y desinfección, y manejo de residuos sólidos. Cada programa debe estar documentado, con registros actualizados y evidencia de ejecución. No basta con tenerlo escrito: debe demostrar que se implementa activamente.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Los <strong>certificados de fumigación vigentes</strong> son revisados de forma obligatoria. El inspector verificará que el certificado no esté vencido, que haya sido emitido por una empresa de{' '}
          <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange underline hover:text-brand-orange-dark">
            control de plagas certificada
          </Link>{' '}
          y que los productos utilizados estén registrados ante el ICA. También revisará si hay evidencia de un programa periódico o si la fumigación fue un evento aislado.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Las <strong>condiciones de almacenamiento de alimentos</strong> se evalúan con detalle: separación entre alimentos crudos y cocidos, temperaturas de refrigeración y congelación, rotulación con fechas, y almacenamiento elevado del piso. El <strong>estado de la infraestructura</strong> también es clave: pisos sin grietas, paredes lisas y lavables, techos sin filtraciones, mallas en ventanas y burletes en puertas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Finalmente, revisan la <strong>documentación del personal</strong>: todos los manipuladores de alimentos deben tener su carnet de manipulación vigente y evidencia de capacitación en buenas prácticas de manufactura.
        </p>

        {/* Checklist */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Checklist: 10 Puntos para Preparar su Restaurante
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Use esta lista de verificación para asegurarse de que su restaurante esté listo ante cualquier visita de inspección:
        </p>
        <ol className="space-y-3 mb-6">
          {[
            'Verificar que el certificado de fumigación esté vigente (no mayor a 3 meses para restaurantes)',
            'Tener documentado el Plan de Saneamiento completo (control de plagas, limpieza y desinfección, residuos sólidos)',
            'Revisar que no haya evidencia visible de plagas: excrementos, roeduras, insectos vivos o muertos',
            'Verificar el estado de trampas y estaciones de monitoreo si su programa las incluye',
            'Confirmar que los productos de limpieza estén almacenados separados de los alimentos',
            'Revisar sellos en puertas, ventanas y todos los puntos de entrada potenciales de plagas',
            'Verificar registros de temperatura de refrigeradores y congeladores (deben estar al día)',
            'Confirmar que los carnets de manipulación de alimentos de todo el personal estén vigentes',
            'Revisar la disposición de residuos sólidos: contenedores con tapa, área de acopio limpia',
            'Tener a la mano todos los certificados y fichas técnicas de los productos utilizados en fumigación',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-brand-black text-body-lg leading-relaxed">
              <span className="bg-brand-orange text-white font-heading font-bold text-sm w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>

        {/* Resolución 2674 */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          La Resolución 2674 de 2013 y el Control de Plagas
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          La Resolución 2674 de 2013 del Ministerio de Salud y Protección Social, supervisada por el INVIMA, es la norma que regula las condiciones sanitarias que deben cumplir los establecimientos que manipulan, procesan, envasan, almacenan, transportan, distribuyen y comercializan alimentos en Colombia. Es la norma base que utilizan los inspectores durante las auditorías.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          En lo que respecta al control de plagas, la resolución exige que los establecimientos cuenten con un programa documentado que incluya: identificación de plagas objetivo, métodos de control utilizados, frecuencia de aplicación, productos empleados con sus registros sanitarios, y un cronograma de actividades. Este programa debe ser ejecutado por personal idóneo o por una empresa especializada en{' '}
          <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange underline hover:text-brand-orange-dark">
            control de plagas para restaurantes
          </Link>.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          El certificado de fumigación debe incluir los productos utilizados con sus números de registro ICA, las concentraciones aplicadas, las áreas tratadas y las recomendaciones post-servicio. Para una descripción completa de los requisitos normativos, visite nuestra página de{' '}
          <Link href="/certificaciones-y-normativa" className="text-brand-orange underline hover:text-brand-orange-dark">
            certificaciones y normativa
          </Link>.
        </p>

        {/* Errores Comunes */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Errores Comunes que Causan Sanciones
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          En nuestra experiencia de más de cuatro décadas trabajando con restaurantes en Bucaramanga, estos son los cinco errores que más frecuentemente resultan en sanciones durante las auditorías:
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-3">
          <strong>1. Certificado de fumigación vencido.</strong> Es el hallazgo más común y el más fácil de evitar. Si su certificado tiene más de tres meses, el inspector lo reportará como incumplimiento. Muchos restaurantes fumigan una vez y se olvidan; la clave es mantener un programa periódico con certificados actualizados.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-3">
          <strong>2. No tener el Plan de Saneamiento documentado.</strong> Algunos establecimientos realizan las actividades de limpieza y control de plagas pero no las documentan. Sin el documento físico o digital con los registros de ejecución, ante el inspector es como si no existiera.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-3">
          <strong>3. Evidencia de plagas durante la inspección.</strong> Ver excrementos de roedores, cucarachas vivas, hormigas en las áreas de preparación o cualquier señal de actividad de plagas es una falta grave. Esto indica que el programa de control de plagas no está funcionando.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-3">
          <strong>4. Productos de control de plagas sin registro ICA.</strong> Si la empresa que le presta el servicio utiliza productos no registrados ante el Instituto Colombiano Agropecuario, usted como establecimiento también es responsable. Siempre exija las fichas técnicas y verifique los números de registro.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          <strong>5. No poder demostrar la frecuencia de fumigación.</strong> El inspector puede pedir los certificados de los últimos 12 meses para verificar que existe un programa continuo. Si solo tiene un certificado aislado, se interpretará como una acción reactiva y no preventiva.
        </p>

        {/* Callout */}
        <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-5 mb-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>¿Sabía que...?</strong> Las multas del INVIMA por incumplimiento sanitario pueden ir de 5 a 1,000 SMMLV (entre $6.5 millones y $1,300 millones de pesos en 2026). Un programa de control de plagas profesional cuesta una fracción de una sola multa.
          </p>
        </div>

        {/* Cómo ayuda AGROINCOL */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Cómo AGROINCOL Ayuda a su Restaurante a Estar Siempre Preparado
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Nuestro servicio de{' '}
          <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange underline hover:text-brand-orange-dark">
            control de plagas para restaurantes
          </Link>{' '}
          está diseñado específicamente para que su establecimiento cumpla con la normativa de forma continua, no solo cuando hay una auditoría próxima. Incluye:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            'Programa de control periódico (trimestral, bimestral o mensual según sus necesidades)',
            'Certificado de fumigación válido ante INVIMA y Secretaría de Salud de Santander, emitido el mismo día del servicio',
            'Reportes técnicos detallados después de cada visita con hallazgos y recomendaciones',
            'Soporte documental completo para auditorías: fichas técnicas, hojas de seguridad, registros ICA',
            'Respuesta en menos de 2 horas ante emergencias en el Área Metropolitana de Bucaramanga',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* CTA final */}
        <div className="bg-brand-light rounded-2xl p-6 mt-8">
          <p className="text-brand-black text-body-lg leading-relaxed mb-3">
            <strong>¿Tiene una auditoría próxima?</strong> Contáctenos hoy y le ayudamos a preparar su restaurante. Si su certificado está vencido, podemos programar el servicio en las próximas 24 horas.
          </p>
          <p className="text-brand-black text-body leading-relaxed">
            Además, use nuestra{' '}
            <Link href="/herramientas/calculadora-fumigacion" className="text-brand-orange underline hover:text-brand-orange-dark">
              calculadora gratuita de frecuencia de fumigación
            </Link>{' '}
            para determinar cada cuánto debe fumigar su restaurante según las condiciones específicas de su establecimiento.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
