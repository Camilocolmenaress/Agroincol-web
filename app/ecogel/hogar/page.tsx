import type { Metadata } from 'next';
import PaginaProducto from '@/components/ecogel/PaginaProducto';
import { HOGAR } from '@/lib/ecogel';
import { fotosEcogel, videosAprenderAUsarlo } from '../fotos';

export const metadata: Metadata = {
  title: HOGAR.metaTitle,
  description: HOGAR.metaDescription,
  // Landing de pauta: no debe competir con el sitio orgánico ni indexarse.
  robots: { index: false, follow: false },
};

export default function EcogelHogarPage() {
  return (
    <PaginaProducto
      config={HOGAR}
      fotos={fotosEcogel('hogar')}
      videosAprender={videosAprenderAUsarlo()}
    />
  );
}
