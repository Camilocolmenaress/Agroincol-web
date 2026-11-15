import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/comejen-termitas-bucaramanga: página del prototipo aprobado (articulo-comejen-termitas.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/comejen-termitas-bucaramanga';
const ARCHIVO = 'articulo-comejen-termitas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogComejenTermitasBucaramangaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
