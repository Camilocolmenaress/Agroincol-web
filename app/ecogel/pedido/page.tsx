import type { Metadata } from 'next';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import FormularioPedido from '@/components/ecogel/FormularioPedido';
import PieEcogel from '@/components/ecogel/PieEcogel';
import { TierProvider } from '@/components/ecogel/TierContext';
import { TIER_POR_DEFECTO, configDe, esSegmento, esUnidades } from '@/lib/ecogel';

export const metadata: Metadata = {
  title: 'Tu pedido de EcoGel | AGROINCOL',
  robots: { index: false, follow: false },
};

export default function PedidoPage({ searchParams }: { searchParams: { u?: string; de?: string } }) {
  const u = Number(searchParams.u);
  const unidades = esUnidades(u) ? u : TIER_POR_DEFECTO;
  const segmento = esSegmento(searchParams.de) ? searchParams.de : 'hogar';
  return (
    <TierProvider>
      <CabeceraEcogel whatsappTexto={configDe(segmento).whatsappTexto} />
      <FormularioPedido segmento={segmento} unidadesIniciales={unidades} />
      <PieEcogel />
    </TierProvider>
  );
}
