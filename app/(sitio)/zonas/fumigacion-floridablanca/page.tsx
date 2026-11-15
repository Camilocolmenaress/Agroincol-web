import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /zonas/fumigacion-floridablanca: página del prototipo aprobado (zona-fumigacion-floridablanca.html). Metadatos y JSON-LD de producción.
const RUTA = '/zonas/fumigacion-floridablanca';
const ARCHIVO = 'zona-fumigacion-floridablanca.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ZonasFumigacionFloridablancaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
