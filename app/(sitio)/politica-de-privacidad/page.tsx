import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /politica-de-privacidad: página del prototipo aprobado (politica-de-privacidad.html). Metadatos y JSON-LD de producción.
const RUTA = '/politica-de-privacidad';
const ARCHIVO = 'politica-de-privacidad.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function PoliticaDePrivacidadPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
