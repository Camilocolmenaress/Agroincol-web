import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /herramientas: página del prototipo aprobado (herramientas.html). Metadatos y JSON-LD de producción.
const RUTA = '/herramientas';
const ARCHIVO = 'herramientas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function HerramientasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
