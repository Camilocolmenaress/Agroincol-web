import type { EcogelConfig } from '@/lib/ecogel';
import { CASOS_ECOGEL } from '@/lib/ecogel-resenas';
import LandingContactTracker from '@/components/landing/LandingContactTracker';
import { TierProvider } from './TierContext';
import BarraPromo from './BarraPromo';
import CabeceraEcogel from './CabeceraEcogel';
import Galeria, { type FotosEcogel } from './Galeria';
import CajaCompra from './CajaCompra';
import BarraSticky from './BarraSticky';
import BloqueGarantia from './BloqueGarantia';
import AntesDespues from './AntesDespues';
import Objeciones from './Objeciones';
import Autoridad from './Autoridad';
import Beneficios from './Beneficios';
import Casos from './Casos';
import Comparativa from './Comparativa';
import SinRiesgo from './SinRiesgo';
import PreguntasEcogel from './PreguntasEcogel';
import Resenas from './Resenas';
import PieEcogel from './PieEcogel';
import RastreoVista from './RastreoVista';

// Orden = página de producto de Lummia, sección por sección (ver spec §3).
export default function PaginaProducto({ config, fotos, video }: { config: EcogelConfig; fotos: FotosEcogel; video?: string }) {
  return (
    <TierProvider>
      <BarraPromo />
      <CabeceraEcogel whatsappTexto={config.whatsappTexto} />
      <Galeria fotos={fotos} />
      <CajaCompra config={config} />
      <BloqueGarantia />
      <AntesDespues antes={fotos.antes} despues={fotos.despues} />
      <Objeciones objeciones={config.objeciones} video={video} />
      <Autoridad equipo={fotos.equipo} />
      <Beneficios bloques={config.beneficiosLargos} />
      <Casos casos={CASOS_ECOGEL[config.segmento]} />
      <Comparativa />
      <SinRiesgo />
      <PreguntasEcogel preguntas={config.preguntas} />
      <Resenas />
      <PieEcogel />
      <BarraSticky segmento={config.segmento} />
      <RastreoVista segmento={config.segmento} />
      <LandingContactTracker categoria={`ecogel-${config.segmento}`} />
    </TierProvider>
  );
}
