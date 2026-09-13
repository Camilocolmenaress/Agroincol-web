'use client';

import { useEffect } from 'react';

// Tracker global de clics en los CTA de conversión: WhatsApp y llamada.
// Empuja eventos a dataLayer (GTM/GA4) para poder medir ambos canales por igual.
//
// Este tracker NO sabe nada de Meta, a propósito. El sitio orgánico recibe
// tráfico de Google Ads y de búsqueda; mandarle esos clics al Pixel le
// atribuiría a Meta conversiones que trajo otro canal. El evento Contact de
// Meta lo dispara components/landing/LandingContactTracker.tsx, que solo se
// monta en /lp/*.
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
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
