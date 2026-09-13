'use client';

import { useEffect } from 'react';
import { rastrear } from '@/lib/meta/pixel';

/**
 * Evento `Contact` de Meta para los clics a WhatsApp y a teléfono, SOLO en las
 * landings de pauta.
 *
 * Va aparte del CTAClickTracker global por dos razones:
 *
 * 1. Limpieza de datos. El sitio orgánico recibe tráfico de Google Ads y de
 *    búsqueda; si esos clics llegaran al Pixel, Meta se atribuiría conversiones
 *    que trajo otro canal y optimizaría con señal contaminada.
 * 2. Peso. Al vivir en el árbol de /lp, todo el módulo del Pixel y la API de
 *    Conversiones queda fuera del bundle del resto del sitio, en vez de estar
 *    ahí filtrado por un if de ruta.
 *
 * `Contact` y no `Lead`: el Lead queda reservado para el formulario, que es
 * hacia donde optimiza la campaña porque llega calificado. La deduplicación por
 * sesión vive en lib/meta/pixel.ts.
 */
export default function LandingContactTracker({ categoria }: { categoria: string }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      const esContacto =
        href.includes('wa.me') || href.includes('api.whatsapp.com') || href.startsWith('tel:');
      if (!esContacto) return;
      rastrear('Contact', { categoria });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [categoria]);

  return null;
}
