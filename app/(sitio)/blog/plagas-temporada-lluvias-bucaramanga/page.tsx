import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/plagas-temporada-lluvias-bucaramanga: página del prototipo aprobado (articulo-plagas-temporada-lluvias.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/plagas-temporada-lluvias-bucaramanga';
const ARCHIVO = 'articulo-plagas-temporada-lluvias.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogPlagasTemporadaLluviasBucaramangaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
