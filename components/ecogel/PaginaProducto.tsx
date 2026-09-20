import type { EcogelConfig } from '@/lib/ecogel';
import { CASOS_ECOGEL, RESENAS_ECOGEL } from '@/lib/ecogel-resenas';
import LandingContactTracker from '@/components/landing/LandingContactTracker';
import { TierProvider } from './TierContext';
import BarraPromo from './BarraPromo';
import CabeceraEcogel from './CabeceraEcogel';
import Galeria, { type FotosEcogel } from './Galeria';
import MarqueeResenas from './MarqueeResenas';
import CajaCompra from './CajaCompra';
import BarraSticky from './BarraSticky';
import BloqueGarantia from './BloqueGarantia';
import AprendeAUsarlo from './AprendeAUsarlo';
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
import WhatsAppFlotante from './WhatsAppFlotante';

// Orden = página de producto de Lummia, sección por sección (spec §3, iteración 2 §7).
export default function PaginaProducto({ config, fotos, video }: { config: EcogelConfig; fotos: FotosEcogel; video?: string }) {
  return (
    <TierProvider>
      <BarraPromo />
      <CabeceraEcogel segmento={config.segmento} />
      <Galeria fotos={fotos} />
      <MarqueeResenas />
      <CajaCompra config={config} />
      <BloqueGarantia />
      <AprendeAUsarlo />
      <Objeciones objeciones={config.objeciones} video={video} />
      <AntesDespues antes={fotos.antes} despues={fotos.despues} resena={RESENAS_ECOGEL[0]} />
      <Autoridad />
      <Beneficios bloques={config.beneficiosLargos} />
      <Casos casos={CASOS_ECOGEL[config.segmento]} />
      <Comparativa />
      <SinRiesgo />
      <PreguntasEcogel preguntas={config.preguntas} />
      <Resenas />
      <PieEcogel />
      <BarraSticky segmento={config.segmento} />
      <WhatsAppFlotante texto={config.whatsappTexto} />
      <RastreoVista segmento={config.segmento} />
      <LandingContactTracker categoria={`ecogel-${config.segmento}`} />
    </TierProvider>
  );
}
