import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/como-eliminar-cucarachas-bucaramanga: página del prototipo aprobado (articulo-eliminar-cucarachas.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/como-eliminar-cucarachas-bucaramanga';
const ARCHIVO = 'articulo-eliminar-cucarachas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogComoEliminarCucarachasBucaramangaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
