'use client';

import { useEffect, useState } from 'react';
import { cotizar, money } from '@/lib/laminas';
import { useCantidad } from './Cantidad';

// Botón fijo abajo, como el "Save 25% + Free Shipping" de Grüns. En celular
// siempre; en escritorio solo cuando la caja de compra (#comprar) salió de la
// pantalla, para no duplicar el botón que ya está a la vista. Se esconde con el
// carrito abierto para no tapar su propio botón.
export default function BarraSticky() {
  const { cantidad, abrirCarrito, carritoAbierto } = useCantidad();
  const [cajaVisible, setCajaVisible] = useState(true);
  useEffect(() => {
    const caja = document.getElementById('comprar');
    if (!caja || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(([e]) => setCajaVisible(e.isIntersecting));
    obs.observe(caja);
    return () => obs.disconnect();
  }, []);
  if (carritoAbierto) return null;
  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 bg-gradient-to-t from-white via-white/95 to-white/0 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-5 lg:flex lg:justify-center ${
        cajaVisible ? 'lg:hidden' : ''
      }`}
    >
      <button
        type="button"
        onClick={abrirCarrito}
        className="flex w-full items-center justify-center rounded-full bg-brand-orange px-5 py-3.5 font-heading text-[1.2rem] font-bold leading-none text-white shadow-brand lg:w-auto lg:px-12"
      >
        Agregar {cantidad} láminas · {money(cotizar(cantidad, 'am').total)}
      </button>
    </div>
  );
}
