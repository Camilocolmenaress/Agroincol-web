import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/desratizacion: página del prototipo aprobado (servicio-desratizacion.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/desratizacion';
const ARCHIVO = 'servicio-desratizacion.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosDesratizacionPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
