'use client';

import { TIERS, money } from '@/lib/ecogel';
import { useTier } from './TierContext';

// Reemplaza la caja de cuotas Addi de Lummia. Es el elemento más importante de
// la página: mueve el pedido promedio de 1 a 1,8 unidades. El 3 va preseleccionado.

export default function SelectorTier({ compacto = false }: { compacto?: boolean }) {
  const { unidades, setUnidades } = useTier();
  return (
    <fieldset>
      <legend className="text-body-sm font-semibold text-brand-black">Cantidad</legend>
      <div className={`mt-2 grid gap-2 ${compacto ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {TIERS.map((t) => {
          const activo = t.unidades === unidades;
          return (
            <button
              key={t.unidades}
              type="button"
              aria-pressed={activo}
              onClick={() => setUnidades(t.unidades)}
              className={`relative rounded-xl border-2 px-3 py-3 text-left transition-colors ${
                activo ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light hover:border-brand-green/50'
              }`}
            >
              {t.masVendido && (
                <span className="absolute -top-2.5 left-3 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Más vendido
                </span>
              )}
              <span className="block font-heading text-body font-bold text-brand-green">
                {t.unidades} {t.unidades === 1 ? 'unidad' : 'unidades'}
              </span>
              {!compacto && <span className="block text-body-sm text-brand-black/65">{t.etiqueta}</span>}
              <span className="mt-1 flex flex-wrap items-center gap-1.5 text-body-sm font-semibold text-brand-black">
                {t.precioTachado && (
                  <span className="text-brand-black/45 line-through">{money(t.precioTachado)}</span>
                )}
                {money(t.producto)}
                <span className="font-normal text-brand-black/55">
                  · envío {t.envio === 0 ? 'gratis' : money(t.envio)}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
