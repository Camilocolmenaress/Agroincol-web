'use client';

import { useEffect } from 'react';
import { rastrear } from '@/lib/meta/pixel';
import { TIER_POR_DEFECTO, datosMetaEcogel, type Segmento } from '@/lib/ecogel';

/** Id del selector de cantidad en CajaCompra: lo que cuenta como "ver la oferta". */
export const ID_OFERTA = 'oferta-ecogel';

/**
 * ViewContent cuando la oferta (precio y cantidad) aparece en pantalla, no al
 * cargar la página: la carga ya la mide la visita, y medir lo mismo dos veces
 * no dice nada. Una vez por sesión (ver UNA_VEZ_POR_SESION).
 */
export default function RastreoVista({ segmento }: { segmento: Segmento }) {
  useEffect(() => {
    const disparar = () => rastrear('ViewContent', datosMetaEcogel(segmento, TIER_POR_DEFECTO));
    const oferta = document.getElementById(ID_OFERTA);
    if (!oferta || typeof IntersectionObserver === 'undefined') {
      disparar();
      return;
    }
    const observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          observador.disconnect();
          disparar();
        }
      },
      { threshold: 0.5 },
    );
    observador.observe(oferta);
    return () => observador.disconnect();
  }, [segmento]);
  return null;
}
