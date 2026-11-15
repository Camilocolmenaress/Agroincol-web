import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /precios: página del prototipo aprobado (precios.html). Metadatos y JSON-LD de producción.
const RUTA = '/precios';
const ARCHIVO = 'precios.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function PreciosPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
