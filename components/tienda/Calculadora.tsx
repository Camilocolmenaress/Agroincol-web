'use client';

import { useState } from 'react';
import { Calculator } from 'lucide-react';
import { MAXIMO, MINIMO } from '@/lib/laminas';
import { useCantidad } from './Cantidad';

// Regla de la página 5 de la guía: 1 lámina cada 3 m de pared + 1 por puerta.
// Reemplaza el video A mientras no exista: se lee en 10 segundos.
export function recomendadas(metrosPared: number, puertas: number): number {
  const n = Math.ceil(Math.max(0, metrosPared) / 3) + Math.max(0, Math.floor(puertas));
  return Math.min(MAXIMO, Math.max(MINIMO, n));
}

export default function Calculadora() {
  const { setCantidad } = useCantidad();
  const [metros, setMetros] = useState('');
  const [puertas, setPuertas] = useState('');
  const m = Number(metros.replace(',', '.'));
  const p = Number(puertas);
  const listo = metros !== '' && Number.isFinite(m) && m > 0 && Number.isFinite(p);
  const n = listo ? recomendadas(m, p) : 0;
  const campo =
    'mt-1 w-full rounded-lg border border-brand-black/15 bg-white px-3 py-2.5 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25';

  return (
    <details className="group rounded-2xl border border-brand-green/20 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-2.5 px-4 py-3 font-heading text-body font-bold text-brand-green [&::-webkit-details-marker]:hidden">
        <Calculator size={20} className="text-brand-orange" aria-hidden />
        <span className="flex-1">¿Cuántas necesito? Calcúlelo aquí</span>
        <span className="text-xl leading-none transition-transform group-open:rotate-45" aria-hidden>+</span>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-body-sm text-brand-black/70">
          Cuente paredes, no metros cuadrados: <strong>1 lámina cada 3 m de pared + 1 por puerta.</strong> Una cocina de 4 × 5 m tiene 18 m de pared.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <label className="text-body-sm font-medium text-brand-black">
            Metros de pared
            <input type="number" inputMode="decimal" min={0} value={metros} onChange={(e) => setMetros(e.target.value)} placeholder="18" className={campo} />
          </label>
          <label className="text-body-sm font-medium text-brand-black">
            Puertas
            <input type="number" inputMode="numeric" min={0} value={puertas} onChange={(e) => setPuertas(e.target.value)} placeholder="2" className={campo} />
          </label>
        </div>
        {listo && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-brand-mint px-3.5 py-3">
            <p className="text-body-sm text-brand-black">
              Necesita <strong className="font-heading text-body text-brand-green">{n} láminas</strong>
            </p>
            <button type="button" onClick={() => setCantidad(n)} className="rounded-full bg-brand-green px-3.5 py-1.5 text-[13px] font-bold text-white">
              Usar {n}
            </button>
          </div>
        )}
      </div>
    </details>
  );
}
