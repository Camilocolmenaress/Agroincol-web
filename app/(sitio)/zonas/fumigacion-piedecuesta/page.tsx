import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /zonas/fumigacion-piedecuesta: página del prototipo aprobado (zona-fumigacion-piedecuesta.html). Metadatos y JSON-LD de producción.
const RUTA = '/zonas/fumigacion-piedecuesta';
const ARCHIVO = 'zona-fumigacion-piedecuesta.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ZonasFumigacionPiedecuestaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
