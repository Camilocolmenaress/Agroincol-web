import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /zonas: página del prototipo aprobado (zonas.html). Metadatos y JSON-LD de producción.
const RUTA = '/zonas';
const ARCHIVO = 'zonas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ZonasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
