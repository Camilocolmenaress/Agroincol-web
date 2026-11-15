import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/control-comejen-termitas: página del prototipo aprobado (servicio-control-comejen-termitas.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/control-comejen-termitas';
const ARCHIVO = 'servicio-control-comejen-termitas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosControlComejenTermitasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
