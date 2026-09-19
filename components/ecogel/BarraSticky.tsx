'use client';

import { money, totalPedido, type Segmento } from '@/lib/ecogel';
import { urlPedido, useTier } from './TierContext';

// Sección 4 de Lummia: CTA fijo abajo desde el primer píxel. Solo en móvil; en
// escritorio la caja de compra siempre está a la vista.
export default function BarraSticky({ segmento }: { segmento: Segmento }) {
  const { unidades } = useTier();
  const { total } = totalPedido(unidades, 'contraentrega');
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gray-light bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-brand-black">
            {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
          </p>
          <p className="text-body-sm text-brand-black/60">{money(total)} · garantía 30 días</p>
        </div>
        <a
          href={urlPedido(unidades, segmento)}
          className="flex-none rounded-full bg-brand-orange px-5 py-3 font-heading text-body-sm font-bold text-white shadow-brand"
        >
          Pedir {unidades}
        </a>
      </div>
    </div>
  );
}
