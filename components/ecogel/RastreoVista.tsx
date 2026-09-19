'use client';

import { useEffect } from 'react';
import { rastrear } from '@/lib/meta/pixel';
import { TIER_POR_DEFECTO, totalPedido, type Segmento } from '@/lib/ecogel';

/** ViewContent al cargar la página de producto, con el valor del tier por defecto. */
export default function RastreoVista({ segmento }: { segmento: Segmento }) {
  useEffect(() => {
    rastrear('ViewContent', {
      categoria: `ecogel-${segmento}`,
      valor: totalPedido(TIER_POR_DEFECTO, 'contraentrega').total,
      contenido: { ids: ['ecogel'], numItems: TIER_POR_DEFECTO },
    });
  }, [segmento]);
  return null;
}
