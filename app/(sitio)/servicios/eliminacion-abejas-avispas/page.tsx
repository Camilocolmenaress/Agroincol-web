import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/eliminacion-abejas-avispas: página del prototipo aprobado (servicio-eliminacion-abejas-avispas.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/eliminacion-abejas-avispas';
const ARCHIVO = 'servicio-eliminacion-abejas-avispas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosEliminacionAbejasAvispasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
