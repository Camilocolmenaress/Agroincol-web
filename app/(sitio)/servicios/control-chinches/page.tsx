import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/control-chinches: página del prototipo aprobado (servicio-control-chinches.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/control-chinches';
const ARCHIVO = 'servicio-control-chinches.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosControlChinchesPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
