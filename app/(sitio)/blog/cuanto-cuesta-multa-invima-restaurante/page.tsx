import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/cuanto-cuesta-multa-invima-restaurante: página del prototipo aprobado (articulo-multa-invima.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/cuanto-cuesta-multa-invima-restaurante';
const ARCHIVO = 'articulo-multa-invima.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogCuantoCuestaMultaInvimaRestaurantePage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
