'use client';

import { useCantidad } from './Cantidad';

// Botón de las tarjetas 6 / 12 / 24 de "Cuántas necesita": fija la cantidad y
// sube a la caja de compra.
export default function ElegirPaquete({ cantidad }: { cantidad: number }) {
  const { setCantidad } = useCantidad();
  return (
    <a
      href="#comprar"
      onClick={() => setCantidad(cantidad)}
      className="mt-2.5 rounded-full border-[1.5px] border-brand-green px-2 py-1.5 text-[13px] font-bold text-brand-green"
    >
      Elegir {cantidad}
    </a>
  );
}
