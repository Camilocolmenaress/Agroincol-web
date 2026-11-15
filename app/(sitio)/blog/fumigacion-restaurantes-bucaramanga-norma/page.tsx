import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/fumigacion-restaurantes-bucaramanga-norma: página del prototipo aprobado (articulo-fumigacion-restaurantes-norma.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/fumigacion-restaurantes-bucaramanga-norma';
const ARCHIVO = 'articulo-fumigacion-restaurantes-norma.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogFumigacionRestaurantesBucaramangaNormaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
