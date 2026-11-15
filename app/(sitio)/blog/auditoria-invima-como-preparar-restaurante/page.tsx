import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/auditoria-invima-como-preparar-restaurante: página del prototipo aprobado (articulo-auditoria-invima.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/auditoria-invima-como-preparar-restaurante';
const ARCHIVO = 'articulo-auditoria-invima.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogAuditoriaInvimaComoPrepararRestaurantePage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
