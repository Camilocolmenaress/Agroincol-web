'use client';

import { useEffect } from 'react';

export default function WhatsAppClickTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      const link = target?.closest('a');
      if (!link) return;

      const href = link.getAttribute('href') || '';
      if (!href.includes('wa.me') && !href.includes('api.whatsapp.com')) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: 'whatsapp_click',
        click_url: href,
        click_text: (link.textContent || '').trim().slice(0, 100),
      });
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  return null;
}
