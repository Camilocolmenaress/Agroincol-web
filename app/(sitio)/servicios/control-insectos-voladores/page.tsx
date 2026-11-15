import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/control-insectos-voladores: página del prototipo aprobado (servicio-control-insectos-voladores.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/control-insectos-voladores';
const ARCHIVO = 'servicio-control-insectos-voladores.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosControlInsectosVoladoresPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
