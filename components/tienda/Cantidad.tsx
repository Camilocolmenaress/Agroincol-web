'use client';

import { createContext, useCallback, useContext, useState } from 'react';
import { MAXIMO, MINIMO, RECOMENDADO, datosMetaLaminas } from '@/lib/laminas';
import { rastrear } from '@/lib/meta/pixel';

// La caja de compra, el carrito lateral, la barra fija y la cabecera muestran
// la misma cantidad. Un contexto pequeño evita pasarla por props a todo el árbol.

interface Estado {
  cantidad: number;
  setCantidad: (n: number) => void;
  carritoAbierto: boolean;
  /** "Agregar al carrito": abre el carrito lateral y cuenta el AddToCart (una vez por sesión). */
  abrirCarrito: () => void;
  cerrarCarrito: () => void;
}

const Ctx = createContext<Estado | null>(null);

export function CantidadProvider({ children, inicial = RECOMENDADO }: { children: React.ReactNode; inicial?: number }) {
  const [cantidad, setCantidadCruda] = useState(inicial);
  const [carritoAbierto, setCarritoAbierto] = useState(false);
  const setCantidad = useCallback((n: number) => setCantidadCruda(Math.min(MAXIMO, Math.max(MINIMO, Math.floor(n)))), []);
  const abrirCarrito = useCallback(() => {
    setCarritoAbierto(true);
    rastrear('AddToCart', datosMetaLaminas(cantidad));
  }, [cantidad]);
  const cerrarCarrito = useCallback(() => setCarritoAbierto(false), []);
  return <Ctx.Provider value={{ cantidad, setCantidad, carritoAbierto, abrirCarrito, cerrarCarrito }}>{children}</Ctx.Provider>;
}

export function useCantidad(): Estado {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCantidad fuera de CantidadProvider');
  return v;
}
