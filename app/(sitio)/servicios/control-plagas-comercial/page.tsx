import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/control-plagas-comercial: página del prototipo aprobado (servicio-control-plagas-comercial.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/control-plagas-comercial';
const ARCHIVO = 'servicio-control-plagas-comercial.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosControlPlagasComercialPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
