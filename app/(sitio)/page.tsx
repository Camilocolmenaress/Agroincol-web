import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /: página del prototipo aprobado (index.html). Metadatos y JSON-LD de producción.
const RUTA = '/';
const ARCHIVO = 'index.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function InicioPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
