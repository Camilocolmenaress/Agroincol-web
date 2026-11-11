'use client';

import { Minus, Plus } from 'lucide-react';
import { MAXIMO, MINIMO } from '@/lib/laminas';

// − 12 + como el carrito de Grüns. Sin campo de texto: con el mínimo de 6,
// escribir "12" pasaría por "1" y saltaría a 6 a mitad de la escritura.
export default function Stepper({ valor, onChange, tamano = 'md' }: { valor: number; onChange: (n: number) => void; tamano?: 'sm' | 'md' }) {
  const alto = tamano === 'sm' ? 'h-9' : 'h-11';
  const boton = `flex ${alto} w-10 items-center justify-center rounded-full text-brand-green disabled:text-brand-black/25`;
  return (
    <div className={`inline-flex ${alto} items-center rounded-full border-[1.5px] border-brand-green/40 bg-white`}>
      <button type="button" className={boton} onClick={() => onChange(valor - 1)} disabled={valor <= MINIMO} aria-label="Una lámina menos">
        <Minus size={16} aria-hidden />
      </button>
      <span className="w-9 text-center font-heading text-body font-bold tabular-nums text-brand-black" aria-live="polite" aria-label={`${valor} láminas`}>
        {valor}
      </span>
      <button type="button" className={boton} onClick={() => onChange(valor + 1)} disabled={valor >= MAXIMO} aria-label="Una lámina más">
        <Plus size={16} aria-hidden />
      </button>
    </div>
  );
}
