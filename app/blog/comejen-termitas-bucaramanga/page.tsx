import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ArticleLayout from '@/components/blog/ArticleLayout';

export const metadata: Metadata = {
  title: 'Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar | AGROINCOL',
  description: 'Guía para identificar y eliminar comején y termitas en Bucaramanga. Señales de daño, tipos de termitas en Santander y cuándo actuar antes de que sea tarde.',
  alternates: {
    canonical: 'https://agroincol.com/blog/comejen-termitas-bucaramanga',
  },
  openGraph: {
    title: 'Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar | AGROINCOL',
    description: 'Guía para identificar y eliminar comején y termitas en Bucaramanga. Señales de daño, tipos y tratamiento profesional.',
    url: 'https://agroincol.com/blog/comejen-termitas-bucaramanga',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'article',
    images: [{ url: 'https://agroincol.com/images/hero/hero-home.jpg', width: 1200, height: 630, alt: 'Comején y termitas en Bucaramanga — AGROINCOL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar | AGROINCOL',
    description: 'Guía para identificar y eliminar comején y termitas en Bucaramanga. Señales de daño, tipos y tratamiento profesional.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar',
  author: { '@type': 'Organization', name: 'AGROINCOL', '@id': 'https://agroincol.com/#organization' },
  publisher: { '@id': 'https://agroincol.com/#organization' },
  datePublished: '2026-03-21',
  dateModified: '2026-03-21',
  image: 'https://agroincol.com/images/hero/hero-home.jpg',
  description: 'Guía para identificar y eliminar comején y termitas en Bucaramanga. Señales de daño, tipos de termitas en Santander y cuándo actuar antes de que sea tarde.',
  mainEntityOfPage: 'https://agroincol.com/blog/comejen-termitas-bucaramanga',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Cuánto cuesta el tratamiento de comején en Bucaramanga?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El costo depende de la extensión del daño y el tipo de termita. Un tratamiento localizado puede ir desde $200.000, mientras que un tratamiento completo con barrera perimetral puede costar entre $500.000 y $1.500.000 dependiendo del tamaño de la propiedad. La inspección diagnóstica es sin costo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo toma eliminar el comején?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El tratamiento inicial se aplica en una sola visita (2-4 horas). Los productos actúan durante varias semanas eliminando la colonia progresivamente. Se recomienda una inspección de seguimiento a los 30-60 días para verificar la eliminación completa.',
      },
    },
    {
      '@type': 'Question',
      name: '¿El comején puede volver después del tratamiento?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sí, especialmente las termitas subterráneas si las condiciones de humedad persisten. Por eso recomendamos, además del tratamiento, implementar medidas preventivas y realizar inspecciones anuales. En AGROINCOL ofrecemos programas de monitoreo continuo.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cómo diferencio el comején de otros insectos de madera?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Las termitas se diferencian de los gorgojos y carcoma porque producen tubos de barro (subterráneas) o polvo muy fino como arena (madera seca). Los gorgojos dejan agujeros redondos pequeños con polvo más grueso. Si no está seguro, una inspección profesional le da el diagnóstico exacto sin costo.',
      },
    },
  ],
};

export default function ComejenTermitasPage() {
  return (
    <>
      <SchemaMarkup schema={articleSchema} />
      <SchemaMarkup schema={faqSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: 'Comején y Termitas en Bucaramanga' },
      ]} />
      <ArticleLayout
        withBreadcrumbs
        title="Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar"
        description="Guía para identificar y eliminar comején y termitas en Bucaramanga."
        publishDate="2026-03-21"
        category="Plagas"
        readTime="7 min"
        currentSlug="comejen-termitas-bucaramanga"
      >
        {/* Introduction */}
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El comején — como se conoce popularmente a las termitas en Colombia — es una de las plagas más destructivas y silenciosas que puede afectar su propiedad en Bucaramanga. A diferencia de las cucarachas o los roedores, las termitas causan daño estructural progresivo que puede comprometer la integridad de techos, marcos de puertas, muebles y cualquier estructura de madera.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Lo peligroso es que el daño ocurre desde adentro — cuando se hace visible externamente, la colonia lleva meses o incluso años activa. En esta guía le explicamos cómo identificar si tiene termitas, qué tipos son comunes en Santander, y por qué actuar rápido es fundamental para proteger su patrimonio.
        </p>

        {/* Qué es el Comején */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Qué es el Comején y Por Qué es tan Peligroso?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Las termitas son insectos sociales que se alimentan de celulosa — el componente principal de la madera, el papel y el cartón. Viven en colonias organizadas que pueden tener desde miles hasta millones de individuos, con una estructura de castas que incluye obreras, soldados y reproductoras. Las obreras son las que causan el daño: trabajan las 24 horas del día, los 7 días de la semana, consumiendo madera desde el interior hacia afuera.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Esta alimentación desde adentro es lo que hace al comején tan peligroso. Una viga de techo, un marco de puerta o una pieza de mobiliario pueden verse perfectamente normales por fuera mientras están completamente huecas por dentro. Cuando el daño se hace visible — la madera se hunde, se agrieta o se deshace al presionarla — la estructura ya está seriamente comprometida y la reparación es costosa.
        </p>

        <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-5 mb-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Dato importante:</strong> Una colonia madura de termitas subterráneas puede consumir hasta 5 kg de madera por año. En una casa con estructura de madera en Bucaramanga, eso puede significar daño significativo en cuestión de meses. El clima cálido y húmedo de la ciudad permite que las colonias se mantengan activas todo el año, a diferencia de climas fríos donde la actividad se reduce en invierno.
          </p>
        </div>

        {/* Tipos de Termitas */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Tipos de Termitas Comunes en Santander
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Termitas subterráneas:</strong> Son las más comunes y destructivas en el Área Metropolitana de Bucaramanga. Viven en el suelo y construyen túneles de barro (también llamados &quot;caminos de tierra&quot;) para desplazarse desde el suelo hasta la madera de las estructuras sin exponerse al aire libre. Se identifican fácilmente por estos tubos de barro visibles en cimientos, paredes y columnas. Necesitan contacto constante con el suelo húmedo para sobrevivir, lo que significa que las propiedades con problemas de humedad en los cimientos son las más vulnerables.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Termitas de madera seca:</strong> No necesitan contacto con el suelo. Infestan directamente la madera de muebles, marcos de ventanas, closets, puertas y techos. Se identifican por pequeñas pilas de polvo fino (llamado frass) que aparecen debajo de la madera infectada. Este polvo tiene una textura similar a la arena fina y un color que varía entre el marrón claro y el oscuro según el tipo de madera. Son más comunes en muebles y estructuras de madera expuestas al clima cálido.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          <strong>Termitas voladoras (aladas):</strong> No son una especie diferente — son las termitas reproductoras que salen de colonias maduras para establecer nuevas colonias. En Bucaramanga aparecen especialmente durante la{' '}
          <Link href="/blog/plagas-temporada-lluvias-bucaramanga" className="text-brand-orange underline hover:text-brand-orange-dark">
            temporada de lluvias
          </Link>{' '}
          (abril-mayo y septiembre-noviembre). Si ve una nube de insectos alados cerca de una luz por la noche durante esta temporada, probablemente son termitas buscando dónde establecer una nueva colonia. Encontrar alas transparentes en el piso cerca de ventanas o lámparas es una señal inequívoca.
        </p>

        {/* Señales */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Señales de que Tiene Comején en su Propiedad
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Estas son las señales que debe buscar para detectar una infestación de termitas a tiempo:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            'Madera que suena hueca al golpearla con los nudillos',
            'Tubos de barro en cimientos, paredes o columnas (termitas subterráneas)',
            'Polvo fino debajo de muebles o marcos de madera (termitas de madera seca)',
            'Pintura que se ampolla o burbujea sin causa aparente de humedad',
            'Puertas o ventanas de madera que se atascan (la madera se deforma internamente)',
            'Alas transparentes en el piso cerca de ventanas o luces (restos de vuelo nupcial)',
            'Madera que se deshace al presionarla con un destornillador',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Actuar Rápido */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Por Qué Actuar Rápido es Fundamental
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          A diferencia de las{' '}
          <Link href="/blog/vi-cucaracha-en-mi-casa-que-hacer" className="text-brand-orange underline hover:text-brand-orange-dark">
            cucarachas
          </Link>{' '}
          (que son un problema de higiene), las termitas causan daño patrimonial real y progresivo. Pueden comprometer vigas de techo, marcos de puertas, closets de madera, muebles de valor, e incluso la estructura de una vivienda. El costo de reparación de daño por termitas puede superar fácilmente los millones de pesos, especialmente cuando se trata de elementos estructurales como vigas o columnas.
        </p>

        <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-5 mb-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Experiencia real:</strong> En AGROINCOL hemos atendido casos en Bucaramanga donde el propietario descubrió el daño por termitas al renovar una habitación y encontrar vigas completamente huecas por dentro. La colonia llevaba años activa sin ser detectada. Una inspección profesional a tiempo habría evitado un costo de reparación de varios millones de pesos.
          </p>
        </div>

        {/* Tratamiento Profesional */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Tratamiento Profesional de Termitas
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El tratamiento profesional depende del tipo de termita identificada durante la inspección diagnóstica. Para termitas subterráneas, se aplica un tratamiento del suelo con termiticida de larga duración y se establece una barrera química perimetral que impide a las termitas acceder desde el suelo hacia la estructura. Para termitas de madera seca, se realiza inyección de producto directamente en la madera afectada, alcanzando las galerías internas donde la colonia se alimenta.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          En ambos casos, el protocolo incluye una inspección completa para determinar la extensión real del daño (que suele ser mayor de lo visible), y un monitoreo posterior para verificar la eliminación de la colonia. Todos los productos utilizados por AGROINCOL están registrados ante el ICA y son seguros para familias con niños y mascotas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Los remedios caseros como vinagre, ácido bórico o gasolina no funcionan contra colonias establecidas de termitas. Pueden matar algunos individuos en la superficie, pero la colonia se encuentra en el interior de la madera o en el suelo, fuera del alcance de estos productos. Además, aplicar gasolina u otros combustibles en estructuras de madera es extremadamente peligroso. El control profesional es la única solución efectiva y segura.
        </p>

        {/* Prevención */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Prevención de Termitas en Bucaramanga
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Para reducir el riesgo de infestación por termitas en su propiedad, considere estas medidas preventivas: mantener la madera alejada del contacto directo con el suelo húmedo, ventilar adecuadamente espacios cerrados como sótanos y entrepisos, reparar goteras y fugas de agua (la humedad atrae especialmente a las termitas subterráneas), inspeccionar periódicamente marcos de puertas, closets y techos en busca de señales tempranas, no acumular cartón, papel periódico ni leña en contacto con el suelo, y solicitar una inspección profesional al menos una vez al año si su propiedad tiene estructura de madera.{' '}
          <Link href="/herramientas/calculadora-fumigacion" className="text-brand-orange underline hover:text-brand-orange-dark">
            Use nuestra calculadora para determinar la frecuencia ideal de control para su propiedad
          </Link>.
        </p>

        {/* FAQ */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Preguntas Frecuentes sobre Comején en Bucaramanga
        </h2>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Cuánto cuesta el tratamiento de comején en Bucaramanga?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El costo depende de la extensión del daño y el tipo de termita. Un tratamiento localizado puede ir desde $200.000, mientras que un tratamiento completo con barrera perimetral puede costar entre $500.000 y $1.500.000 dependiendo del tamaño de la propiedad. La inspección diagnóstica es sin costo.{' '}
          <Link href="/precios" className="text-brand-orange underline hover:text-brand-orange-dark">
            Conozca nuestros precios
          </Link>.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Cuánto tiempo toma eliminar el comején?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          El tratamiento inicial se aplica en una sola visita (2-4 horas dependiendo del tamaño de la propiedad). Los productos actúan durante varias semanas, eliminando la colonia progresivamente a medida que las termitas entran en contacto con la barrera química. Se recomienda una inspección de seguimiento a los 30-60 días para verificar la eliminación completa.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿El comején puede volver después del tratamiento?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Sí, especialmente las termitas subterráneas si las condiciones de humedad en el suelo persisten. Por eso recomendamos, además del tratamiento activo, implementar las medidas preventivas mencionadas y realizar inspecciones anuales. En AGROINCOL ofrecemos programas de monitoreo continuo para propiedades con historial de termitas.
        </p>

        <h3 className="font-heading text-lg text-brand-green font-bold mt-6 mb-2">
          ¿Cómo diferencio el comején de otros insectos de madera?
        </h3>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Las termitas se diferencian de los gorgojos y la carcoma porque producen tubos de barro visibles (subterráneas) o polvo muy fino como arena (madera seca). Los gorgojos dejan agujeros redondos pequeños con polvo más grueso y granular. Las termitas también tienen el cuerpo más ancho y uniforme que las hormigas voladoras, con las que a veces se confunden. Si no está seguro, solicite una inspección profesional — el diagnóstico es sin costo.
        </p>

        {/* CTA */}
        <div className="bg-brand-light rounded-2xl p-6 mt-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>¿Sospecha de comején en su propiedad?</strong> No espere a que el daño sea visible. Solicite una inspección diagnóstica sin costo con AGROINCOL. Más de 40 años de experiencia en control de plagas en Bucaramanga y el Área Metropolitana. Productos certificados por INVIMA, seguros para familias y mascotas.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
