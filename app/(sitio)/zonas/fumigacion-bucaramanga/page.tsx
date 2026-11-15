import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /zonas/fumigacion-bucaramanga: página del prototipo aprobado (zona-fumigacion-bucaramanga.html). Metadatos y JSON-LD de producción.
const RUTA = '/zonas/fumigacion-bucaramanga';
const ARCHIVO = 'zona-fumigacion-bucaramanga.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ZonasFumigacionBucaramangaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
