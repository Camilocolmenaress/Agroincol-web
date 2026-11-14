import type { Metadata } from 'next';
import Breadcrumbs from '@/components/seo/Breadcrumbs';
import Cinta from '@/components/recorrido/Cinta';
import Segmentos from '@/components/recorrido/Segmentos';
import Metodo from '@/components/recorrido/Metodo';
import Galeria from '@/components/recorrido/Galeria';
import Lema from '@/components/recorrido/Lema';
import OtrosServicios from '@/components/recorrido/OtrosServicios';
import Movimiento from '@/components/recorrido/Movimiento';
import AlivioTeaser from '@/components/sections/AlivioTeaser';
import WhyUs from '@/components/sections/WhyUs';
import ServiceAreas from '@/components/sections/ServiceAreas';
import Testimonials from '@/components/sections/Testimonials';
import HomeFAQ from '@/components/sections/HomeFAQ';

// /nosotros (14-nov, opción B): el home pasó a ser una sola pantalla (el selector, como
// agrumeafarm.it) y su contenido vive aquí con el mismo texto, como el "About" de la referencia.
// Pendiente: rehacerla con el sistema de la referencia (docs/rediseno/descomposicion-agrumea).
export const metadata: Metadata = {
  title: 'Nosotros: Control de Plagas en Bucaramanga desde 1985',
  description:
    'Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón. Cómo trabajamos, zonas, reseñas y preguntas frecuentes.',
  alternates: { canonical: 'https://agroincol.com/nosotros' },
  openGraph: {
    title: 'Nosotros | AGROINCOL',
    description:
      'Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.',
    url: 'https://agroincol.com/nosotros',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
  },
};

export default function NosotrosPage() {
  return (
    <>
      <section className="bg-marca-menta pb-12 pt-28 md:pb-16 md:pt-36">
        <div className="container-custom">
          <Breadcrumbs tono="claro" items={[{ name: 'Inicio', href: '/' }, { name: 'Nosotros' }]} />
          <h1 className="mt-8 text-center font-display text-[clamp(3rem,13vw,12rem)] uppercase leading-[0.9] tracking-[-0.03em] text-marca-verde">
            Nosotros
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-center text-body-lg text-brand-gray text-pretty">
            Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.
          </p>
        </div>
      </section>
      <Cinta />
      <Segmentos />
      <Metodo />
      <Galeria />
      <Lema />
      <OtrosServicios />
      {/* Alivio — sin cambios hasta que se decida (viene del home tal cual). */}
      <AlivioTeaser />
      <WhyUs />
      <ServiceAreas />
      <Testimonials />
      <HomeFAQ />
      <Movimiento />
    </>
  );
}
