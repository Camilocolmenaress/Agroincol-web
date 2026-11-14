import type { Metadata } from 'next';
import Selector from '@/components/recorrido/Selector';

export const metadata: Metadata = {
  title: 'Fumigación y Control de Plagas en Bucaramanga',
  description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  alternates: {
    canonical: 'https://agroincol.com',
  },
  openGraph: {
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
    url: 'https://agroincol.com',
    siteName: 'AGROINCOL',
    locale: 'es_CO',
    type: 'website',
    images: [
      {
        url: 'https://agroincol.com/images/hero/hero-home.jpg',
        width: 1200,
        height: 630,
        alt: 'AGROINCOL — Fumigación y Control de Plagas en Bucaramanga',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fumigación y Control de Plagas en Bucaramanga | AGROINCOL',
    description: '40+ años en fumigación y control de plagas en Bucaramanga. Servicio certificado para hogares, restaurantes e industrias. Cotice gratis.',
  },
};

// Home (14-nov, opción B): una sola pantalla, el selector de servicios, como agrumeafarm.it
// (docs/rediseno/descomposicion-agrumea). La página no baja: la rueda, el dedo y el arrastre
// recorren los objetos. El contenido que antes iba aquí vive en /nosotros y /contacto.
export default function HomePage() {
  return <Selector />;
}
