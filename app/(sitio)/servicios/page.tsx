import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios: página del prototipo aprobado (servicios.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios';
const ARCHIVO = 'servicios.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
