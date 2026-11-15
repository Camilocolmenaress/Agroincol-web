import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/fumigacion-residencial: página del prototipo aprobado (servicio-fumigacion-residencial.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/fumigacion-residencial';
const ARCHIVO = 'servicio-fumigacion-residencial.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosFumigacionResidencialPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
