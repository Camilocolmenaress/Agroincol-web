'use client';

import { createContext, useContext, useState } from 'react';
import { TIER_POR_DEFECTO, type Segmento, type Unidades } from '@/lib/ecogel';

// El selector, la caja de compra y la barra sticky muestran el mismo tier. Un
// contexto pequeño evita pasar el estado por props a través del árbol entero.

interface TierState {
  unidades: Unidades;
  setUnidades: (u: Unidades) => void;
}

const TierCtx = createContext<TierState>({ unidades: TIER_POR_DEFECTO, setUnidades: () => {} });

export function TierProvider({ children, inicial = TIER_POR_DEFECTO }: { children: React.ReactNode; inicial?: Unidades }) {
  const [unidades, setUnidades] = useState<Unidades>(inicial);
  return <TierCtx.Provider value={{ unidades, setUnidades }}>{children}</TierCtx.Provider>;
}

export function useTier() {
  return useContext(TierCtx);
}

export function urlPedido(unidades: Unidades, segmento: Segmento): string {
  return `/ecogel/pedido?u=${unidades}&de=${segmento}`;
}
