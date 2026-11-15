import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /certificado-de-fumigacion: página del prototipo aprobado (certificado-de-fumigacion.html). Metadatos y JSON-LD de producción.
const RUTA = '/certificado-de-fumigacion';
const ARCHIVO = 'certificado-de-fumigacion.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function CertificadoDeFumigacionPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
