'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';

export default function BotonCopiar({ valor, etiqueta }: { valor: string; etiqueta: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(valor);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // Sin permiso de portapapeles el dato sigue visible para copiarlo a mano.
    }
  };
  return (
    <button
      type="button"
      onClick={copiar}
      aria-label={`Copiar ${etiqueta}`}
      className="inline-flex h-9 flex-none items-center gap-1.5 rounded-full border border-brand-green/20 bg-white px-3 text-[13px] font-semibold text-brand-green transition-colors hover:bg-brand-mint"
    >
      {copiado ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      <span aria-live="polite">{copiado ? 'Copiado' : 'Copiar'}</span>
    </button>
  );
}
