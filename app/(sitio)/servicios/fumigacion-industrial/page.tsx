import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/fumigacion-industrial: página del prototipo aprobado (servicio-fumigacion-industrial.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/fumigacion-industrial';
const ARCHIVO = 'servicio-fumigacion-industrial.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosFumigacionIndustrialPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
