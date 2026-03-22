import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import ArticleLayout from '@/components/blog/ArticleLayout';

export const metadata: Metadata = {
  title: 'Vi una Cucaracha en mi Casa: ¿Significa que Hay Más? | AGROINCOL',
  description: 'Qué hacer cuando encuentra una cucaracha en su hogar. Por qué aparecen, dónde se esconden y cuándo es momento de llamar a un profesional.',
  alternates: {
    canonical: 'https://agroincol.com/blog/vi-cucaracha-en-mi-casa-que-hacer',
  },
  openGraph: {
    title: 'Vi una Cucaracha en mi Casa: ¿Significa que Hay Más? | AGROINCOL',
    description: 'Qué hacer cuando encuentra una cucaracha en su hogar en Bucaramanga.',
    url: 'https://agroincol.com/blog/vi-cucaracha-en-mi-casa-que-hacer',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'article',
    images: [{ url: 'https://agroincol.com/images/servicios/fumigacion-interior.jpg', width: 1200, height: 630, alt: 'Control de cucarachas — AGROINCOL' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vi una Cucaracha en mi Casa: ¿Significa que Hay Más? | AGROINCOL',
    description: 'Qué hacer cuando encuentra una cucaracha en su hogar en Bucaramanga.',
  },
};

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '¿Vi una Cucaracha en mi Casa: Significa que Hay Más?',
  author: { '@type': 'Organization', name: 'AGROINCOL', '@id': 'https://agroincol.com/#organization' },
  publisher: { '@id': 'https://agroincol.com/#organization' },
  datePublished: '2026-03-14',
  dateModified: '2026-03-14',
  image: 'https://agroincol.com/images/servicios/fumigacion-interior.jpg',
  description: 'Qué hacer cuando ve una cucaracha en su hogar en Bucaramanga. Por qué aparecen, dónde se esconden y cuándo llamar a un profesional.',
  mainEntityOfPage: 'https://agroincol.com/blog/vi-cucaracha-en-mi-casa-que-hacer',
};

export default function CucarachaEnCasaPage() {
  return (
    <>
      <SchemaMarkup schema={articleSchema} />
      <Breadcrumbs items={[
        { name: 'Inicio', href: '/' },
        { name: 'Blog', href: '/blog' },
        { name: '¿Vi una Cucaracha en mi Casa?' },
      ]} />
      <ArticleLayout
        withBreadcrumbs
        title="¿Vi una Cucaracha en mi Casa: Significa que Hay Más?"
        description="Qué hacer cuando ve una cucaracha en su hogar en Bucaramanga."
        publishDate="2026-03-14"
        category="Hogares"
        readTime="6 min"
        currentSlug="vi-cucaracha-en-mi-casa-que-hacer"
      >
        {/* Introduction */}
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          La respuesta corta es: probablemente sí. Las cucarachas son insectos nocturnos y cautelosos por naturaleza. Si usted ve una durante el día, caminando abiertamente por su cocina o baño, generalmente es una señal de que la población dentro de su vivienda es lo suficientemente grande como para que algunas sean empujadas fuera de sus escondites habituales por falta de espacio o competencia por recursos.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          En Bucaramanga y el Área Metropolitana, las cucarachas encuentran condiciones ideales para reproducirse: el clima cálido y húmedo de Santander, con temperaturas constantes entre 23 °C y 28 °C durante todo el año, acelera su ciclo reproductivo. A diferencia de ciudades con inviernos fríos donde las plagas se reducen naturalmente, en nuestra región las cucarachas están activas los 365 días del año.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Pero no se asuste todavía. Entender por qué aparecen, dónde se esconden y qué puede hacer le dará el control de la situación. Vamos paso a paso.
        </p>

        {/* Por Qué Aparecen */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Por Qué Aparecen Cucarachas en su Casa?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Las cucarachas necesitan tres cosas para sobrevivir: agua, alimento y refugio. Si su casa les provee estas tres, se quedarán y se reproducirán. Entender las fuentes de atracción es el primer paso para controlarlas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Acceso a agua:</strong> Esta es la necesidad más crítica. Una cucaracha puede sobrevivir semanas sin comer, pero apenas unos días sin agua. Las goteras debajo del lavaplatos, la condensación en tuberías, los baños húmedos y las plantas con exceso de riego son fuentes de agua constantes. Incluso un charco pequeño debajo de la nevera es suficiente para mantener una colonia.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Acceso a alimentos:</strong> Las cucarachas son omnívoras y poco exigentes. Migajas en el piso, restos de comida en la estufa, basura sin sellar, comida de mascotas dejada durante la noche, e incluso grasa acumulada detrás de la estufa son banquetes para ellas. Son capaces de sobrevivir con cantidades mínimas de alimento, así que lo que a usted le parece limpio puede ser suficiente para ellas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Puntos de entrada y refugio:</strong> Las cucarachas entran por grietas en paredes y pisos, espacios alrededor de tuberías, marcos de puertas y ventanas sin sello, y a través de desagües y sifones. También llegan dentro de cajas de cartón, bolsas de supermercado y paquetes de domicilios. Una vez adentro, se refugian en espacios oscuros, cálidos y con acceso a humedad.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          En las zonas residenciales del Área Metropolitana de Bucaramanga — Floridablanca, Piedecuesta y Girón — las condiciones tropicales constantes hacen que estos factores se amplifiquen. No hay una temporada en la que las cucarachas disminuyan naturalmente, por eso la prevención es continua.
        </p>

        {/* Dónde se Esconden */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Dónde se Esconden las Cucarachas?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Si sabe dónde buscar, puede confirmar la magnitud del problema. Las cucarachas prefieren espacios estrechos, oscuros y cálidos. Estos son sus escondites favoritos dentro de una vivienda:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            'Detrás de electrodomésticos: nevera, estufa, microondas y lavaplatos. El calor del motor y la presencia de residuos de comida los hacen perfectos.',
            'Debajo de lavaplatos y fregaderos: la combinación de humedad, oscuridad y acceso a residuos es ideal.',
            'Dentro de cajas de cartón y acumulaciones: el cartón les provee alimento (celulosa) y refugio.',
            'En grietas de paredes, marcos de puertas y zócalos: especialmente en construcciones más antiguas con acabados deteriorados.',
            'Dentro de aparatos electrónicos: consolas de videojuegos, routers y tableros eléctricos les ofrecen calor constante.',
            'En sifones y desagües: las cucarachas pueden subir por las tuberías con facilidad, especialmente si los sifones están secos.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Cuándo Llamar a un Profesional */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          ¿Cuándo es Momento de Llamar a un Profesional?
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          No todas las situaciones requieren control profesional. Si encontró una sola cucaracha grande (probablemente una cucaracha americana que entró desde afuera), puede tratarse de un visitante aislado. Pero hay señales claras de que la situación requiere intervención profesional:
        </p>
        <ul className="space-y-2 mb-4">
          {[
            'Ver cucarachas durante el día: indica que la población es grande y los escondites están saturados.',
            'Encontrar excrementos: puntos oscuros pequeños en cajones, estantes, esquinas de gabinetes o detrás de electrodomésticos.',
            'Detectar un olor particular: las cucarachas alemanas producen un olor aceitoso y almizclado que es detectable cuando la infestación es significativa.',
            'Encontrar ootecas (cápsulas de huevos): pequeñas cápsulas marrones o rojizas, ovaladas, que contienen entre 15 y 40 huevos cada una.',
            'Los remedios caseros o insecticidas de supermercado no funcionaron: si ya probó sprays comerciales y el problema persiste, la infestación probablemente es mayor de lo que parece.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">•</span>
              {item}
            </li>
          ))}
        </ul>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          Si reconoce dos o más de estas señales, es momento de actuar con un servicio profesional de control de plagas. Los productos comerciales solo eliminan las cucarachas que están expuestas, pero no alcanzan las colonias escondidas dentro de paredes, bajo pisos y dentro de aparatos.
        </p>

        {/* Medidas Inmediatas */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Qué Puede Hacer Mientras Tanto (Medidas Inmediatas)
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Mientras programa el servicio profesional, estas medidas ayudarán a reducir la actividad de cucarachas en su hogar:
        </p>
        <ul className="space-y-2 mb-6">
          {[
            'Selle la basura siempre con tapa y saque los residuos orgánicos diariamente.',
            'Limpie migajas y derrames inmediatamente, especialmente en la cocina antes de dormir.',
            'Repare todas las goteras y elimine fuentes de agua estancada.',
            'Selle grietas y hendiduras visibles en paredes, pisos y zócalos con silicona.',
            'No deje comida de mascotas expuesta durante la noche.',
            'Vierta agua con cloro por los sifones de baños y cocinas poco utilizados (evita que se sequen y sirvan de entrada).',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-brand-black text-body-lg leading-relaxed">
              <span className="text-brand-orange mt-1 shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>

        {/* Callout */}
        <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-5 mb-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Dato importante:</strong> Una sola cucaracha alemana hembra puede producir hasta 300 crías durante su vida. Cada ooteca contiene entre 30 y 40 huevos, y una hembra puede producir entre 4 y 8 ootecas. Por eso actuar rápido es fundamental: en cuestión de semanas, una pareja puede convertirse en cientos.
          </p>
        </div>

        {/* Control Profesional */}
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mt-12 mb-4">
          Cómo Funciona el Control Profesional de Cucarachas
        </h2>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          Un servicio profesional de control de cucarachas es muy diferente a aplicar un spray comercial. El proceso que seguimos en AGROINCOL incluye tres fases fundamentales:
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Inspección diagnóstica:</strong> Nuestros técnicos realizan una inspección detallada para identificar la especie de cucaracha (alemana, americana, u otra), los puntos críticos de actividad, las fuentes de agua y alimento, y los puntos de entrada. Esta información determina el tratamiento más efectivo para su caso específico.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-4">
          <strong>Aplicación del tratamiento:</strong> Utilizamos productos registrados ante el ICA y aprobados por la OMS, seguros para familias y mascotas cuando se aplican correctamente. Los métodos incluyen gel insecticida en puntos estratégicos, aspersión en áreas de tránsito, y tratamiento de grietas y hendiduras. A diferencia de los sprays comerciales, estos productos tienen efecto residual que sigue actuando durante semanas.
        </p>
        <p className="text-brand-black text-body-lg leading-relaxed mb-6">
          <strong>Seguimiento:</strong> Verificamos la efectividad del tratamiento y ajustamos si es necesario. Le indicamos cada cuánto debe programar el control preventivo según las condiciones de su vivienda. Use nuestra{' '}
          <Link href="/herramientas/calculadora-fumigacion" className="text-brand-orange underline hover:text-brand-orange-dark">
            calculadora de frecuencia de fumigación
          </Link>{' '}
          para obtener una recomendación personalizada.
        </p>

        {/* CTA */}
        <div className="bg-brand-light rounded-2xl p-6 mt-8">
          <p className="text-brand-black text-body-lg leading-relaxed">
            <strong>Si está viendo cucarachas en su casa</strong> en Bucaramanga, Floridablanca, Piedecuesta o Girón, contáctenos. Diagnosticamos su situación sin costo y le damos una cotización para resolver el problema de forma definitiva. Respuesta en menos de 2 horas.
          </p>
        </div>
      </ArticleLayout>
    </>
  );
}
