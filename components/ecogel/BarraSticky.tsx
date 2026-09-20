'use client';

import { TIERS, money, totalPedido, type Segmento } from '@/lib/ecogel';
import { urlPedido, useTier } from './TierContext';

// Sección 4 de Lummia: CTA fijo abajo desde el primer píxel. Solo en móvil; en
// escritorio la caja de compra siempre está a la vista. Las tres pastillas
// cambian el tier igual que el selector: comparten el contexto.
export default function BarraSticky({ segmento }: { segmento: Segmento }) {
  const { unidades, setUnidades } = useTier();
  const { total } = totalPedido(unidades, 'contraentrega');
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gray-light bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+8px)] pt-2 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="flex flex-none gap-1.5" role="group" aria-label="Cantidad">
          {TIERS.map((t) => {
            const activo = t.unidades === unidades;
            return (
              <button
                key={t.unidades}
                type="button"
                aria-pressed={activo}
                aria-label={`${t.unidades} ${t.unidades === 1 ? 'unidad' : 'unidades'}`}
                onClick={() => setUnidades(t.unidades)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 font-heading text-body font-bold transition-colors ${
                  activo ? 'border-brand-green bg-brand-green/10 text-brand-green' : 'border-brand-gray-light bg-white text-brand-black/60'
                }`}
              >
                {t.unidades}
              </button>
            );
          })}
        </div>
        <div className="min-w-0 flex-1">
          <a
            href={urlPedido(unidades, segmento)}
            className="flex w-full items-center justify-center rounded-full bg-brand-orange px-4 py-4 font-heading text-body font-bold leading-none text-white shadow-brand"
          >
            Comprar ahora
          </a>
          <p className="mt-1 text-center text-[11px] leading-tight text-brand-black/60">
            {unidades} {unidades === 1 ? 'unidad' : 'unidades'} · {money(total)}
          </p>
        </div>
      </div>
    </div>
  );
}
