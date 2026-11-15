import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/fumigacion-restaurantes: página del prototipo aprobado (servicio-fumigacion-restaurantes.html). Metadatos y JSON-LD de producción.
const RUTA = '/servicios/fumigacion-restaurantes';
const ARCHIVO = 'servicio-fumigacion-restaurantes.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosFumigacionRestaurantesPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
