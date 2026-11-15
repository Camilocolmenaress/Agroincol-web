import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /zonas/fumigacion-giron: página del prototipo aprobado (zona-fumigacion-giron.html). Metadatos y JSON-LD de producción.
const RUTA = '/zonas/fumigacion-giron';
const ARCHIVO = 'zona-fumigacion-giron.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ZonasFumigacionGironPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
