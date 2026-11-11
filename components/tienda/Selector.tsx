'use client';

import { Check, Tag } from 'lucide-react';
import { DESDE_ENVIO_GRATIS, ENVIO_AM, GARANTIA, PAQUETES, PRECIO_UNIDAD, RECOMENDADO, cotizar, money } from '@/lib/laminas';
import { useCantidad } from './Cantidad';
import Stepper from './Stepper';

// Las tarjetas de Grüns ("Subscribe & Save" / "One time"): la elegida se pinta
// y abre por dentro lo que trae. Los usos salen de la página 5 de la guía.
const USO: Record<number, string> = {
  6: 'Cocina pequeña o local pequeño',
  12: 'Restaurante: cocina y bodega pequeña',
  24: 'Bodega grande o local con varias áreas',
};

function Incluye({ cantidad }: { cantidad: number }) {
  const { envio } = cotizar(cantidad, 'am');
  const items = [
    envio === 0 ? 'Envío gratis en el área metropolitana' : `Envío ${money(ENVIO_AM)} en el área metropolitana`,
    'Guía de ubicación y uso incluida',
    GARANTIA,
  ];
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
          const lista = n * PRECIO_UNIDAD;
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
                  Recomendado · envío gratis en el área
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
                  <p className="mt-0.5 text-body-sm leading-snug text-brand-black/70">{USO[n]}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-[1.15rem] font-bold leading-tight text-brand-black">
                    {c.precioUnidad < PRECIO_UNIDAD && <s className="mr-1.5 text-body-sm font-normal text-brand-black/70">{money(lista)}</s>}
                    {money(c.producto)}
                  </p>
                  <p className={`text-[12px] ${c.precioUnidad < PRECIO_UNIDAD ? 'font-bold text-brand-green' : 'text-brand-black/70'}`}>
                    {money(c.precioUnidad)} c/u
                  </p>
                </div>
              </div>
              {activo && <Incluye cantidad={n} />}
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
              Mínimo 6 · {cantidad >= DESDE_ENVIO_GRATIS ? 'envío gratis en el área' : `envío ${money(ENVIO_AM)}`}
            </p>
          </div>
          <Stepper valor={cantidad} onChange={setCantidad} />
        </div>
      </div>
    </fieldset>
  );
}
