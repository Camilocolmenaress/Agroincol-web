import type { Metadata } from 'next';
import PaginaProducto from '@/components/ecogel/PaginaProducto';
import { RESTAURANTES } from '@/lib/ecogel';
import { fotosEcogel, videosAprenderAUsarlo } from '../fotos';

export const metadata: Metadata = {
  title: RESTAURANTES.metaTitle,
  description: RESTAURANTES.metaDescription,
  // Landing de pauta: no debe competir con el sitio orgánico ni indexarse.
  robots: { index: false, follow: false },
};

export default function EcogelRestaurantesPage() {
  return (
    <PaginaProducto
      config={RESTAURANTES}
      fotos={fotosEcogel('restaurantes')}
      videosAprender={videosAprenderAUsarlo()}
    />
  );
}
