'use client';

import Image from 'next/image';
import { ShoppingBag } from 'lucide-react';
import type { Segmento } from '@/lib/ecogel';
import { urlPedido, useTier } from './TierContext';

// Logo centrado y grande + carrito a la derecha que lleva al pedido con el tier
// actual. Sin menú ni buscador: en una landing de pauta cada enlace es una fuga.
// El WhatsApp ya no vive aquí: es el botón flotante (WhatsAppFlotante).
//
// `segmento` es opcional: en /gracias el pedido ya está hecho y el carrito no
// tiene sentido, así que sin segmento se pinta solo el logo.
export default function CabeceraEcogel({ segmento }: { segmento?: Segmento }) {
  const { unidades } = useTier();
  return (
    <header className="bg-brand-mint py-5">
      <div className="container-custom grid grid-cols-[2.75rem_1fr_2.75rem] items-center">
        <span aria-hidden />
        <Image
          src="/images/logos/logo-horizontal.png"
          alt="AGROINCOL"
          width={420}
          height={140}
          priority
          className="mx-auto h-14 w-auto md:h-16"
        />
        {segmento ? (
          <a
            href={urlPedido(unidades, segmento)}
            aria-label={`Ir al pedido (${unidades} ${unidades === 1 ? 'unidad' : 'unidades'})`}
            className="relative inline-flex h-11 w-11 items-center justify-center justify-self-end rounded-full bg-white text-brand-green shadow-soft"
          >
            <ShoppingBag size={22} aria-hidden />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-orange px-1 font-heading text-[11px] font-bold leading-none text-white">
              {unidades}
            </span>
          </a>
        ) : (
          <span aria-hidden />
        )}
      </div>
    </header>
  );
}
