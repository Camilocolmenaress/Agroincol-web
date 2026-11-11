'use client';

import { useEffect } from 'react';
import { CATEGORIA, CLAVE_BORRADOR, CONTENT_ID, RECOMENDADO, datosMetaLaminas } from '@/lib/laminas';
import { rastrear, soloPixel } from '@/lib/meta/pixel';

export const ID_OFERTA = 'oferta-laminas';

/** ViewContent cuando el selector de cantidad entra en pantalla (una vez por sesión). */
export function RastreoVista() {
  useEffect(() => {
    const disparar = () => rastrear('ViewContent', datosMetaLaminas(RECOMENDADO));
    const oferta = document.getElementById(ID_OFERTA);
    if (!oferta || typeof IntersectionObserver === 'undefined') return disparar();
    const obs = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          obs.disconnect();
          disparar();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(oferta);
    return () => obs.disconnect();
  }, []);
  return null;
}

/**
 * Purchase por el Pixel en /tienda/gracias, con el MISMO event_id que el
 * servidor ya mandó por CAPI (Meta deduplica). Valor = total real con envío.
 */
export function RastreoCompra({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  useEffect(() => {
    if (!['cod', 'approved', 'bancolombia', 'nequi', 'breb'].includes(estado)) return;
    try {
      // Pedido hecho: el borrador del checkout ya no sirve (sí se conserva tras un pago rechazado).
      window.sessionStorage.removeItem(CLAVE_BORRADOR);
      const crudo = window.sessionStorage.getItem('laminas_compra');
      if (!crudo) return;
      const c = JSON.parse(crudo) as { pedidoId: string; eventId: string; valor: number; cantidad: number };
      if (c.pedidoId !== pedidoId) return;
      soloPixel('Purchase', { eventId: c.eventId, valor: c.valor, categoria: CATEGORIA, contenido: { ids: [CONTENT_ID], numItems: c.cantidad } });
    } catch {
      // Sin almacenamiento el Purchase ya salió por el servidor.
    }
  }, [pedidoId, estado]);
  return null;
}
