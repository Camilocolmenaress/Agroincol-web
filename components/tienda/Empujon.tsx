'use client';

import { ArrowRight } from 'lucide-react';
import { empujon, type Zona } from '@/lib/laminas';
import { useCantidad } from './Cantidad';

// Aviso cuando el paquete siguiente sale casi igual o más barato (11 → 12,
// 21-23 → 24). Con un toque se cambia la cantidad.
export default function Empujon({ zona = 'am', className = '' }: { zona?: Zona; className?: string }) {
  const { cantidad, setCantidad } = useCantidad();
  const e = empujon(cantidad, zona);
  if (!e) return null;
  return (
    <div role="status" className={`flex items-center gap-3 rounded-xl border border-brand-orange/40 bg-brand-orange/10 px-3.5 py-2.5 ${className}`}>
      <p className="flex-1 text-body-sm font-semibold leading-snug text-brand-black">{e.texto}</p>
      <button
        type="button"
        onClick={() => setCantidad(e.objetivo)}
        className="inline-flex flex-none items-center gap-1 rounded-full bg-brand-green px-3.5 py-2 text-body-sm font-bold text-white"
      >
        Llevar {e.objetivo} <ArrowRight size={14} aria-hidden />
      </button>
    </div>
  );
}
