import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /herramientas/checklist: página del prototipo aprobado (herramienta-checklist.html). Metadatos y JSON-LD de producción.
const RUTA = '/herramientas/checklist';
const ARCHIVO = 'herramienta-checklist.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function HerramientasChecklistPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
