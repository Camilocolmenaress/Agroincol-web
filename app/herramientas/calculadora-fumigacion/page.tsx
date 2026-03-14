import type { Metadata } from 'next';
import Link from 'next/link';
import Hero from '@/components/sections/Hero';
import SchemaMarkup from '@/components/seo/SchemaMarkup';
import FumigationCalculator from '@/components/tools/FumigationCalculator';

export const metadata: Metadata = {
  title: 'Calculadora de Frecuencia de Fumigación en Colombia | AGROINCOL',
  description: 'Calcule gratis cada cuánto debe fumigar su hogar, restaurante o negocio según la normativa colombiana. Herramienta basada en el Decreto 1843 y la Resolución 2674.',
  alternates: {
    canonical: 'https://agroincol.com/herramientas/calculadora-fumigacion',
  },
  openGraph: {
    title: 'Calculadora de Frecuencia de Fumigación en Colombia | AGROINCOL',
    description: 'Calcule gratis cada cuánto debe fumigar su hogar, restaurante o negocio según la normativa colombiana. Herramienta basada en el Decreto 1843 y la Resolución 2674.',
    url: 'https://agroincol.com/herramientas/calculadora-fumigacion',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Calculadora de Frecuencia de Fumigación',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Calculadora de Frecuencia de Fumigación en Colombia | AGROINCOL',
    description: 'Calcule gratis cada cuánto debe fumigar su hogar, restaurante o negocio según la normativa colombiana.',
  },
};

const appSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Calculadora de Frecuencia de Fumigación',
  url: 'https://agroincol.com/herramientas/calculadora-fumigacion',
  applicationCategory: 'HealthApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'COP',
  },
  provider: {
    '@id': 'https://agroincol.com/#organization',
  },
  description: 'Herramienta gratuita para calcular la frecuencia recomendada de fumigación según tipo de propiedad, ubicación y normativa colombiana.',
};

export default function CalculadoraFumigacionPage() {
  return (
    <>
      <SchemaMarkup schema={appSchema} />

      {/* Hero */}
      <Hero
        title="Calculadora de Frecuencia de Fumigación"
        subtitle="Descubra cada cuánto debe fumigar su propiedad según la normativa colombiana y las condiciones de su zona. Herramienta 100% gratuita."
        primaryCta={{ text: 'Comenzar Cálculo', href: '#calculadora' }}
        centeredText
      />

      {/* Calculator */}
      <section id="calculadora" className="section-padding bg-brand-light">
        <div className="container-custom max-w-3xl">
          <FumigationCalculator />
        </div>
      </section>

      {/* SEO Content: ¿Cada cuánto se debe fumigar? */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Cada Cuánto se Debe Fumigar en Colombia?
          </h2>
          <div className="prose-brand space-y-4">
            <p className="text-brand-black text-body leading-relaxed">
              La frecuencia ideal de fumigación en Colombia depende del tipo de propiedad, su ubicación geográfica, el historial de plagas y el entorno circundante. La normativa colombiana no establece una periodicidad fija universal, pero sí exige que los establecimientos mantengan condiciones higiénicas y libres de plagas.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              Para restaurantes y establecimientos de alimentos, la Resolución 2674 de 2013 del Ministerio de Salud obliga a contar con un Plan de Saneamiento que incluya control de plagas ejecutado por una empresa certificada. La recomendación general para estos establecimientos es fumigar cada 1 a 3 meses, dependiendo de las condiciones específicas. Conozca más sobre nuestro{' '}
              <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange hover:text-brand-orange-dark underline font-semibold">
                servicio especializado de fumigación para restaurantes
              </Link>.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              Para viviendas, se recomienda realizar control preventivo de plagas cada 3 a 6 meses. En zonas de clima cálido y húmedo como Bucaramanga y el Área Metropolitana, las plagas se reproducen con mayor facilidad debido a las temperaturas constantes durante todo el año, lo que puede requerir una frecuencia mayor.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              Para oficinas y locales comerciales, la frecuencia recomendada es cada 3 meses. Las bodegas e instalaciones industriales requieren programas más frecuentes, especialmente si almacenan alimentos o materias primas susceptibles a plagas.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              El Decreto 1843 de 1991 regula el uso y manejo de plaguicidas en Colombia y establece que la aplicación debe ser realizada por personal idóneo y debidamente capacitado, utilizando productos registrados ante el ICA. Consulte nuestra página de{' '}
              <Link href="/certificaciones-y-normativa" className="text-brand-orange hover:text-brand-orange-dark underline font-semibold">
                certificaciones y normativa
              </Link>{' '}
              para más información.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content: Factores */}
      <section className="section-padding bg-brand-light">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            Factores que Influyen en la Frecuencia de Fumigación
          </h2>
          <div className="space-y-4">
            <p className="text-brand-black text-body leading-relaxed">
              El clima de Bucaramanga y el Área Metropolitana es un factor determinante: con temperaturas tropicales constantes entre 23 °C y 28 °C durante todo el año, las condiciones son ideales para la reproducción de plagas como cucarachas, mosquitos, roedores y hormigas. A diferencia de ciudades con estaciones marcadas, en Santander las plagas están activas los 365 días del año.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              La proximidad a fuentes de agua, alcantarillas, mercados públicos y zonas con acumulación de residuos orgánicos incrementa significativamente el riesgo de infestación. Las propiedades ubicadas en zonas urbanas densas de Bucaramanga, como el centro de la ciudad o cerca de plazas de mercado, requieren una frecuencia de fumigación mayor que las ubicadas en zonas residenciales tranquilas.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              El tipo de construcción también influye: edificaciones antiguas con grietas, tubería expuesta y espacios húmedos son más vulnerables. El almacenamiento de alimentos sin sellado adecuado y la acumulación de cajas de cartón o materiales orgánicos son factores que atraen plagas. Finalmente, la temporada de lluvias en Santander (abril-mayo y septiembre-noviembre) suele generar migración de insectos y roedores hacia el interior de las propiedades.
            </p>
          </div>
        </div>
      </section>

      {/* SEO Content: Consecuencias */}
      <section className="section-padding">
        <div className="container-custom max-w-3xl">
          <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">
            ¿Qué Pasa si No Fumigo a Tiempo?
          </h2>
          <div className="space-y-4">
            <p className="text-brand-black text-body leading-relaxed">
              No mantener un programa de control de plagas tiene consecuencias serias tanto para la salud como para el bolsillo. Desde el punto de vista sanitario, las plagas son vectores de enfermedades como salmonelosis, leptospirosis, dengue y alergias respiratorias. Una infestación no controlada puede poner en riesgo a su familia, empleados o clientes.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              Para establecimientos comerciales y{' '}
              <Link href="/servicios/fumigacion-restaurantes" className="text-brand-orange hover:text-brand-orange-dark underline font-semibold">
                restaurantes
              </Link>, las consecuencias legales son aún más graves. El INVIMA puede imponer multas que van desde 5 hasta 1000 SMMLV (salarios mínimos legales mensuales vigentes) y ordenar el cierre temporal o definitivo del establecimiento. Una sola visita de inspección sin certificado de fumigación vigente puede resultar en sanciones inmediatas.
            </p>
            <p className="text-brand-black text-body leading-relaxed">
              El daño reputacional es otro factor importante: en la era de las redes sociales y las reseñas en Google, un avistamiento de plaga reportado por un cliente puede afectar significativamente la imagen de su negocio. Además, las plagas como termitas y roedores pueden causar daño estructural a su propiedad, deteriorando cables eléctricos, tuberías, madera y otros materiales, generando costos de reparación muy superiores al costo de la fumigación preventiva.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
