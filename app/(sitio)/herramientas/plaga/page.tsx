import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /herramientas/plaga: página del prototipo aprobado (herramienta-plaga.html). Metadatos y JSON-LD de producción.
const RUTA = '/herramientas/plaga';
const ARCHIVO = 'herramienta-plaga.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function HerramientasPlagaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
