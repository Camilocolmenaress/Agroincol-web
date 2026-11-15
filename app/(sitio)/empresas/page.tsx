import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /empresas: página del prototipo aprobado (empresas.html). Metadatos y JSON-LD de producción.
const RUTA = '/empresas';
const ARCHIVO = 'empresas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function EmpresasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
