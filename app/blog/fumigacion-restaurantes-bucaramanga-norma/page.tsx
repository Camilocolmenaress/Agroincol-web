import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ArticleLayout from '@/components/blog/ArticleLayout';

export const metadata: Metadata = {
  title: 'Fumigación Restaurantes: Norma 2026 | AGROINCOL',
  description: 'Todo lo que un restaurante en Bucaramanga necesita saber sobre fumigación: Resolución 2674, certificado INVIMA, frecuencia, costos y cómo cumplir.',
  alternates: {
    canonical: 'https://agroincol.com/blog/fumigacion-restaurantes-bucaramanga-norma',
  },
  openGraph: {
    title: 'Fumigación Restaurantes: Norma 2026 | AGROINCOL',
    description: 'Todo sobre fumigación para restaurantes en Bucaramanga: Resolución 2674, certificado INVIMA, frecuencia y costos.',
    url: 'https://agroincol.com/blog/fumigacion-restaurantes-bucaramanga-norma',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'article',
    images: [{ url: 'https://agroincol.com/images/hero/hero-restaurantes.jpg', width: 1200, height: 630, alt: 'Fumigación para restaurantes en Bucaramanga — AGROINCOL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación Restaurantes: Norma 2026 | AGROINCOL',
    description: 'Todo sobre fumigación para restaurantes en Bucaramanga: Resolución 2674, certificado INVIMA, frecuencia y costos.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Fumigación para Restaurantes en Bucaramanga: Qué Exige la Norma y Cuánto Cuesta',
  author: { '@type': 'Organization', name: 'AGROINCOL', '@id': 'https://agroincol.com/#organization' },
  publisher: { '@id': 'https://agroincol.com/#organization' },
  datePublished: '2026-03-21',
  dateModified: '2026-03-21',
  image: 'https://agroincol.com/images/hero/hero-restaurantes.jpg',
  description: 'Todo lo que un restaurante en Bucaramanga necesita saber sobre fumigación: Resolución 2674, certificado INVIMA, frecuencia, costos y cómo cumplir.',
  mainEntityOfPage: 'https://agroincol.com/blog/fumigacion-restaurantes-bucaramanga-norma',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿El certificado de AGROINCOL es válido ante el INVIMA?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí. Nuestro certificado cumple con los requisitos del Decreto 1843 de 1991 y es válido como soporte documental ante inspecciones del INVIMA y la Secretaría de Salud de Santander.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Necesito cerrar mi restaurante durante la fumigación?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No necesariamente. Coordinamos el servicio en horarios de baja actividad (antes de la apertura o después del cierre) para no interrumpir su operación.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Los productos son seguros para áreas de alimentos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Todos nuestros productos están registrados ante el ICA y certificados por INVIMA para uso en establecimientos de alimentos. Son de baja toxicidad y no dejan residuos en superficies de preparación.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué incluye el reporte técnico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Cada reporte incluye: fotos de hallazgos, productos utilizados con registros ICA, áreas tratadas, nivel de infestación detectado, recomendaciones de mejora, y plan de acción para la siguiente visita.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Puedo cambiarme a AGROINCOL si ya tengo otro proveedor?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, el cambio es inmediato. Realizamos una inspección diagnóstica inicial sin costo para evaluar el estado actual de su establecimiento y diseñar el programa que mejor se adapte a su operación.',
      },
    },
  ],
};

export default function FumigacionRestaurantesNormaPage() {
  return (
    <>
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Fumigación para Restaurantes en Bucaramanga' },
      ]} />
      <ArticleLayout
        withBreadcrumbs
        title="Fumigación para Restaurantes en Bucaramanga: Qué Exige la Norma y Cuánto Cuesta"
        description="Todo lo que un restaurante en Bucaramanga necesita saber sobre fumigación."
        publishDate="2026-03-21"
        category="Restaurantes"
        readTime="9 min"
        currentSlug="fumigacion-restaurantes-bucaramanga-norma"
      >
        {/* Introduction */}
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Si tiene un restaurante en Bucaramanga o el Área Metropolitana, la fumigación no es opcional — es una obligación legal. La Resolución 2674 de 2013 del Ministerio de Salud exige que todo establecimiento que manipule alimentos cuente con un programa documentado de control de plagas ejecutado por una empresa certificada. No cumplir puede resultar en multas de hasta 1,000 SMMLV o el cierre temporal de su negocio.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          En esta guía le explicamos exactamente qué exige la norma, con qué frecuencia debe fumigar, cuánto cuesta, y cómo elegir un proveedor que realmente lo proteja. Si quiere conocer nuestro servicio especializado en detalle, visite nuestra página de{' '}
          <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange underline hover:text-brand-orange-dark">
            fumigación para restaurantes
          </Link>.
        </p>

        {/* Qué Exige la Resolución 2674 */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Qué Exige la Resolución 2674 de 2013?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          La Resolución 2674 de 2013 del Ministerio de Salud y Protección Social establece que todos los establecimientos que fabriquen, procesen, preparen, envasen, almacenen, transporten, distribuyan y comercialicen alimentos deben contar con un Plan de Saneamiento. Este plan incluye tres programas obligatorios: limpieza y desinfección, manejo de residuos sólidos, y control de plagas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El programa de control de plagas no es un documento decorativo. Debe ser un programa activo, documentado y con frecuencia definida, ejecutado por personal idóneo con productos registrados ante el ICA, y respaldado con certificados después de cada servicio. La Secretaría de Salud puede solicitar en cualquier momento ver el historial completo: registros de cada visita, productos utilizados con sus registros ICA, fichas técnicas, hallazgos, recomendaciones, y plan de acción.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          En pocas palabras: no basta con tener un certificado anual. La norma exige evidencia de un programa continuo de prevención y control. Puede conocer todos los detalles de la normativa en nuestra página de{' '}
          <Link href="/certificaciones-y-normativa" className="text-brand-orange underline hover:text-brand-orange-dark">
            certificaciones y normativa
          </Link>.
        </p>

        {/* Frecuencia */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Cada Cuánto Debe Fumigar un Restaurante en Colombia?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          La norma no establece una frecuencia fija expresada en meses, pero las recomendaciones de expertos y la práctica del sector en Colombia indican frecuencias claras según el nivel de riesgo y operación del establecimiento:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Mínimo cada 3 meses (trimestral): para cumplir con el estándar básico de la norma',
            'Cada 2 meses (bimestral): frecuencia recomendada para la mayoría de restaurantes en Bucaramanga',
            'Mensual: para restaurantes grandes, cadenas, hoteles, o establecimientos con alto volumen de operación',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Factores que pueden requerir mayor frecuencia: ubicación en zona con alta actividad comercial (centro de Bucaramanga, zona de restaurantes de Cabecera), proximidad a mercados o plazas de abasto, historial previo de plagas, y la temporada de lluvias que intensifica la aparición de cucarachas y roedores.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          ¿No está seguro de la frecuencia ideal para su restaurante?{' '}
          <Link href="/herramientas/calculadora-fumigacion" className="text-brand-orange underline hover:text-brand-orange-dark">
            Use nuestra herramienta gratuita para calcular la frecuencia recomendada →
          </Link>
        </p>

        {/* Costos */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Cuánto Cuesta la Fumigación para Restaurantes en Bucaramanga?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          En el Área Metropolitana de Bucaramanga, los precios de fumigación para restaurantes varían según la modalidad de servicio. Estos son los rangos de referencia de AGROINCOL para 2026:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Servicio único (una visita): desde $150.000 — para problemas puntuales sin programa continuo',
            'Programa trimestral (Control): desde $80.000/mes — cumple el mínimo legal con 4 visitas anuales',
            'Programa bimestral (Protección): desde $105.000/mes — incluye reportes técnicos, garantía entre visitas y soporte en auditorías',
            'Programa mensual (Blindaje): desde $180.000/mes — cobertura completa con mapa de riesgo e informes trimestrales de tendencias',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Un programa recurrente siempre es más económico que servicios sueltos: previene infestaciones (más baratas de prevenir que de tratar), mantiene la certificación vigente todo el año, incluye garantía de re-servicio entre visitas, y reduce drásticamente el riesgo de sanciones.
        </p>

        <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-5 mb-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Perspectiva:</strong> El costo de un programa anual de Protección ($1.260.000/año) es una fracción del costo de un solo día de cierre por sanción sanitaria. Si su restaurante factura $3 millones diarios, 5 días cerrado son $15 millones perdidos — más la multa. Conozca el impacto real en nuestro artículo sobre{' '}
            <Link href="/blog/cuanto-cuesta-multa-invima-restaurante" className="text-brand-orange underline hover:text-brand-orange-dark">
              cuánto cuestan las multas del INVIMA
            </Link>.
          </p>
        </div>

        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          <Link href="/precios" className="text-brand-orange underline hover:text-brand-orange-dark">
            Vea nuestros planes y precios detallados para restaurantes →
          </Link>
        </p>

        {/* Certificado vs Programa */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Diferencia entre Certificado Anual y Programa de Prevención
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Muchos restaurantes en Bucaramanga creen que con un &quot;certificado anual&quot; de fumigación están cubiertos ante el INVIMA. La realidad es diferente: un certificado de una sola fumigación anual no cumple con el espíritu de la Resolución 2674, que exige un programa continuo de control de plagas, no un evento aislado.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Cuando un inspector llega a su restaurante, puede preguntar: ¿cuándo fue la última fumigación? ¿Cada cuánto fumigan? ¿Dónde están los reportes de las últimas visitas? Si la respuesta es &quot;hace 8 meses&quot; y solo tiene un certificado desactualizado, ese documento no lo protege. Lo que lo protege es un programa con registros recientes, reportes técnicos, y un calendario de visitas cumplido. Si quiere saber exactamente qué revisan los inspectores, lea nuestra{' '}
          <Link href="/blog/auditoria-invima-como-preparar-restaurante" className="text-brand-orange underline hover:text-brand-orange-dark">
            guía completa para preparar su restaurante ante una auditoría del INVIMA
          </Link>.
        </p>

        {/* Cómo Elegir Empresa */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Cómo Elegir una Empresa de Fumigación para su Restaurante
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          No todas las empresas de fumigación están preparadas para atender el sector de alimentos. Estos son los criterios que debe verificar antes de contratar:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Que use productos registrados ante el ICA y certificados por INVIMA para áreas de alimentos',
            'Que emita certificado válido después de cada visita, no solo una vez al año',
            'Que entregue reporte técnico con fotos y hallazgos después de cada servicio',
            'Que ofrezca garantía de re-servicio entre visitas programadas',
            'Que tenga experiencia comprobable en el sector de alimentos',
            'Que pueda acompañarlo en auditorías si es necesario',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          En AGROINCOL llevamos más de 40 años trabajando con restaurantes en Bucaramanga y el Área Metropolitana. Nuestros programas de{' '}
          <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange underline hover:text-brand-orange-dark">
            protección para restaurantes
          </Link>{' '}
          están diseñados específicamente para que su restaurante cumpla la normativa sin que usted tenga que preocuparse por la documentación, los reportes ni las auditorías.
        </p>

        {/* Sanciones */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Qué Pasa si la Secretaría de Salud Encuentra Plagas?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          La escala de sanciones por incumplimiento de las normas sanitarias en Colombia es severa y va desde una amonestación escrita (primera vez, falta menor), pasando por multas económicas de 5 a 1,000 SMMLV según la gravedad del hallazgo, hasta el cierre temporal del establecimiento cuando los hallazgos representan un riesgo inminente para la salud pública, y en casos extremos de reincidencia, el cierre definitivo.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Pero la sanción económica y el cierre son solo el inicio. Los costos ocultos incluyen días sin facturar con gastos fijos corriendo, pérdida de empleados, fumigación de emergencia a precios superiores, y un daño reputacional que puede perseguir su negocio durante meses. Para dimensionar el impacto real, le recomendamos leer nuestro artículo sobre{' '}
          <Link href="/blog/cuanto-cuesta-multa-invima-restaurante" className="text-brand-orange underline hover:text-brand-orange-dark">
            cuánto cuestan las multas del INVIMA por plagas
          </Link>.
        </p>

        {/* FAQ */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Preguntas Frecuentes
        </h2>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿El certificado de AGROINCOL es válido ante el INVIMA?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Sí. Nuestro certificado cumple con los requisitos del Decreto 1843 de 1991 y es válido como soporte documental ante inspecciones del INVIMA y la Secretaría de Salud de Santander.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Necesito cerrar mi restaurante durante la fumigación?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          No necesariamente. Coordinamos el servicio en horarios de baja actividad (antes de la apertura o después del cierre) para no interrumpir su operación. El tratamiento con gel cucarachicida no requiere evacuar el área.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Los productos son seguros para áreas de alimentos?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Todos nuestros productos están registrados ante el ICA y certificados por INVIMA para uso en establecimientos de alimentos. Son de baja toxicidad para humanos y animales, y no dejan residuos en superficies de preparación.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Qué incluye el reporte técnico?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Cada reporte incluye: fotos de hallazgos, productos utilizados con registros ICA, áreas tratadas, nivel de infestación detectado, recomendaciones de mejora, y plan de acción para la siguiente visita. Este reporte es su principal evidencia en auditorías.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Puedo cambiarme a AGROINCOL si ya tengo otro proveedor?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Sí, el cambio es inmediato. Realizamos una inspección diagnóstica inicial sin costo para evaluar el estado actual de su establecimiento y diseñar el programa que mejor se adapte a su operación. No requiere esperar a que termine su contrato anterior.
        </p>

        {/* CTA */}
        <div className="bg-brand-light rounded-2xl p-6 mt-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Proteja su restaurante.</strong> Cotice un programa de control de plagas con certificación INVIMA incluida. Le respondemos en menos de 2 horas y podemos programar su primer servicio en las próximas 24 horas. Más de 40 años protegiendo restaurantes en Bucaramanga y el Área Metropolitana.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
