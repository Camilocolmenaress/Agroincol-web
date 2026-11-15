import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /certificaciones-y-normativa: página del prototipo aprobado (certificaciones-y-normativa.html). Metadatos y JSON-LD de producción.
const RUTA = '/certificaciones-y-normativa';
const ARCHIVO = 'certificaciones-y-normativa.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function CertificacionesYNormativaPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
