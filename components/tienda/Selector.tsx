'use client';

import { Check, Tag } from 'lucide-react';
import { ENVIO_AM, ETIQUETA_PAQUETE, GARANTIA, MINIMO, PAQUETES, RECOMENDADO, ahorroPorLamina, cotizar, money } from '@/lib/laminas';
import { useCantidad } from './Cantidad';
import Stepper from './Stepper';

// Las tarjetas de Grüns ("Subscribe & Save" / "One time"): la elegida se pinta
// y abre por dentro lo que trae. Protagonista: el precio por lámina; el
// paquete de 3 va primero como ancla y el ahorro se mide contra él (17-nov).

/** El envío va en cada tarjeta, elegida o no: en la de 24 evita que alguien de una finca crea que el suyo es gratis. */
function envioTexto(cantidad: number): string {
  return cotizar(cantidad, 'am').envio === 0 ? 'Envío gratis en el área metropolitana' : `Envío ${money(ENVIO_AM)} en el área metropolitana`;
}

function Incluye() {
  const items = ['Guía de ubicación y uso incluida', GARANTIA];
  return (
    <ul className="mt-3 space-y-1.5 border-t border-brand-green/15 pt-3">
      {items.map((t) => (
        <li key={t} className="flex gap-2 text-body-sm leading-snug text-brand-black/80">
          <Check size={16} className="mt-0.5 flex-none text-brand-green" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function Selector() {
  const { cantidad, setCantidad } = useCantidad();
  const esPaquete = (PAQUETES as readonly number[]).includes(cantidad);

  return (
    <fieldset>
      <div className="flex items-center justify-between gap-3">
        <legend className="font-heading text-body font-bold text-brand-black">¿Cuántas láminas?</legend>
        <span className="inline-flex items-center gap-1 rounded-md border border-dashed border-brand-black/30 px-2 py-0.5 text-[12px] font-semibold text-brand-black/70">
          <Tag size={12} aria-hidden /> Más láminas, mejor precio
        </span>
      </div>

      <div className="mt-3 space-y-2.5" role="radiogroup" aria-label="Paquetes">
        {PAQUETES.map((n) => {
          const c = cotizar(n, 'am');
          const activo = cantidad === n;
          const ahorro = ahorroPorLamina(n);
          return (
            <div
              key={n}
              role="radio"
              aria-checked={activo}
              tabIndex={0}
              onClick={() => setCantidad(n)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setCantidad(n);
                }
              }}
              className={`relative cursor-pointer overflow-hidden rounded-2xl border-2 px-4 pb-3.5 pt-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green/40 ${
                activo ? 'border-brand-green bg-brand-mint/70' : 'border-brand-black/10 bg-white hover:border-brand-green/40'
              }`}
            >
              {n === RECOMENDADO && (
                <p className="-mx-4 -mt-4 mb-3 bg-brand-green py-1.5 text-center text-[12px] font-bold uppercase tracking-wide text-white">
                  Recomendado
                </p>
              )}
              <div className="flex items-start gap-3">
                <span
                  className={`mt-1 flex h-5 w-5 flex-none items-center justify-center rounded-full border-2 ${activo ? 'border-brand-green' : 'border-brand-black/30'}`}
                  aria-hidden
                >
                  {activo && <span className="h-2.5 w-2.5 rounded-full bg-brand-green" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-[1.15rem] font-bold leading-tight text-brand-black">{n} láminas</p>
                  <p className="mt-0.5 text-body-sm leading-snug text-brand-black/70">{ETIQUETA_PAQUETE[n]}</p>
                  {ahorro > 0 && (
                    <p className="mt-1.5 inline-block rounded-md bg-brand-green px-1.5 py-0.5 text-[12px] font-bold leading-tight text-white">
                      Ahorra {money(ahorro)} por lámina
                    </p>
                  )}
                  <p className="mt-1 text-[12px] leading-snug text-brand-black/70">{envioTexto(n)}</p>
                </div>
                <div className="flex-none text-right">
                  <p className="font-heading text-[1.6rem] font-bold leading-none text-brand-black">
                    {money(c.precioUnidad)}
                    <span className="ml-0.5 text-body-sm font-semibold text-brand-black/70">c/u</span>
                  </p>
                  <p className="mt-1 text-[13px] text-brand-black/70">Total {money(c.producto)}</p>
                </div>
              </div>
              {activo && <Incluye />}
            </div>
          );
        })}

        <div
          className={`flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3 ${
            esPaquete ? 'border-brand-black/10 bg-white' : 'border-brand-green bg-brand-mint/70'
          }`}
        >
          <div>
            <p className="font-heading text-body font-bold text-brand-black">Otra cantidad</p>
            <p className="text-[12px] text-brand-black/70">
              Mínimo {MINIMO} · {money(cotizar(cantidad, 'am').precioUnidad)} c/u ·{' '}
              {cotizar(cantidad, 'am').envio === 0 ? 'envío gratis en el área' : `envío ${money(ENVIO_AM)}`}
            </p>
          </div>
          <Stepper valor={cantidad} onChange={setCantidad} />
        </div>
      </div>
    </fieldset>
  );
}
