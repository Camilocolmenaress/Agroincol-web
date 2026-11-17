import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /servicios/control-cucarachas: página nueva (17-nov-2026), en lib/rediseno/paginas-nuevas.ts con las piezas del prototipo.
const RUTA = '/servicios/control-cucarachas';
const ARCHIVO = 'servicio-control-cucarachas.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function ServiciosControlCucarachasPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
