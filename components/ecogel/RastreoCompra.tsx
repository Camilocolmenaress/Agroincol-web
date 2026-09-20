'use client';

import { useEffect } from 'react';
import { soloPixel } from '@/lib/meta/pixel';

/**
 * Purchase por el Pixel, con el MISMO event_id que el servidor ya usó por CAPI
 * al crear el pedido. Meta deduplica por (event_name, event_id). Solo en los
 * estados en que hubo compra; si el almacenamiento está bloqueado, el evento ya
 * salió por el servidor y aquí no pasa nada.
 */
export default function RastreoCompra({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  useEffect(() => {
    if (estado !== 'cod' && estado !== 'approved') return;
    try {
      const crudo = window.sessionStorage.getItem('ecogel_compra');
      if (!crudo) return;
      const c = JSON.parse(crudo) as { pedidoId: string; eventId: string; valor: number; unidades: number; segmento: string };
      if (c.pedidoId !== pedidoId) return;
      soloPixel('Purchase', {
        eventId: c.eventId,
        valor: c.valor,
        categoria: `ecogel-${c.segmento}`,
        contenido: { ids: ['ecogel'], numItems: c.unidades },
      });
    } catch {
      // idem
    }
  }, [pedidoId, estado]);
  return null;
}
