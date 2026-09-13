'use client';

import { useEffect } from 'react';
import { rastrear } from '@/lib/meta/pixel';

// Tracker global de clics en los CTA alternativos: WhatsApp y llamada.
//
// Empuja al dataLayer (GTM/GA4) como siempre, y además dispara el evento
// `Contact` de Meta por Pixel y por la API de Conversiones.
//
// Contact y NO Lead, a propósito: `Lead` queda reservado para el formulario,
// que es el evento hacia el que se optimiza la campaña porque llega calificado
// (municipio, franja horaria y autorización). Si estos clics también fueran
// Lead, Meta optimizaría hacia el más barato de los dos — y el más barato aquí
// es el de peor calidad. Medirlos por separado evita además que las compuertas
// del tramo 1 apaguen una campaña rentable por no ver estos leads.
//
// La deduplicación por sesión vive en lib/meta/pixel.ts: quien escribe por
// WhatsApp y además llama cuenta una sola vez.
export default function CTAClickTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      const isWhatsApp = href.includes('wa.me') || href.includes('api.whatsapp.com');
      const isPhone = href.startsWith('tel:');
      if (!isWhatsApp && !isPhone) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: isWhatsApp ? 'whatsapp_click' : 'phone_click',
        click_url: href,
        click_text: (link.textContent || '').trim().slice(0, 100),
      });

      rastrear('Contact');
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
