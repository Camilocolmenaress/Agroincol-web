import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /blog/vi-cucaracha-en-mi-casa-que-hacer: página del prototipo aprobado (articulo-vi-una-cucaracha.html). Metadatos y JSON-LD de producción.
const RUTA = '/blog/vi-cucaracha-en-mi-casa-que-hacer';
const ARCHIVO = 'articulo-vi-una-cucaracha.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function BlogViCucarachaEnMiCasaQueHacerPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
