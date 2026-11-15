import Pagina from '@/components/rediseno/Pagina';
import { metadataDe } from '@/lib/rediseno/seo';

// /herramientas/calculadora-fumigacion: página del prototipo aprobado (herramienta-calculadora.html). Metadatos y JSON-LD de producción.
const RUTA = '/herramientas/calculadora-fumigacion';
const ARCHIVO = 'herramienta-calculadora.html';

export const metadata = metadataDe(RUTA, ARCHIVO);

export default function HerramientasCalculadoraFumigacionPage() {
  return <Pagina archivo={ARCHIVO} ruta={RUTA} />;
}
