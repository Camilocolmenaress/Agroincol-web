import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog: página del prototipo aprobado (blog.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog';
const ARCHIVO = 'blog.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
