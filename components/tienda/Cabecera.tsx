'use client';

import { ShoppingBag } from 'lucide-react';
import { useCantidad } from './Cantidad';
import { Logo } from './Marca';

// Barra de anuncio + cabecera compacta como Grüns: logo, botón "Comprar" y
// bolsa con la cantidad. Sin menú: en una página de pauta cada enlace es una fuga.
export default function Cabecera() {
  const { cantidad, abrirCarrito } = useCantidad();
  return (
    <>
      <p className="bg-brand-green px-4 py-2 text-center text-[13px] font-semibold leading-snug text-white">
        Envío gratis desde 12 láminas en Bucaramanga, Floridablanca, Girón y Piedecuesta
      </p>
      <header className="sticky top-0 z-30 border-b border-brand-green/10 bg-[#FBFBF7]/95 backdrop-blur">
        <div className="container-custom flex h-16 items-center justify-between gap-3">
          <Logo prioridad className="-ml-2 h-[60px] w-auto" />
          <div className="flex items-center gap-2">
            <a href="#comprar" className="rounded-full bg-brand-orange px-5 py-2.5 font-heading text-[1.2rem] font-bold leading-none text-white">
              Comprar
            </a>
            <button
              type="button"
              onClick={abrirCarrito}
              aria-label={`Abrir carrito (${cantidad} láminas)`}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-brand-green"
            >
              <ShoppingBag size={22} aria-hidden />
              <span className="absolute -right-1 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green px-1 font-heading text-[12px] font-bold leading-none text-white">
                {cantidad}
              </span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
