import type { Metadata } from 'next';
import { normalizarCantidad } from '@/lib/laminas';
import { CantidadProvider } from '@/components/tienda/Cantidad';
import Checkout from '@/components/tienda/Checkout';

export const metadata: Metadata = {
  title: 'Pagar | Láminas de Captura AGROINCOL',
  robots: { index: false, follow: false },
};

export default function PedidoLaminasPage({ searchParams }: { searchParams: { n?: string } }) {
  return (
    <CantidadProvider inicial={normalizarCantidad(searchParams.n)}>
      <Checkout />
    </CantidadProvider>
  );
}
