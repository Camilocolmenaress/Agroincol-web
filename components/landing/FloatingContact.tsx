'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Phone } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';
import { whatsappUrl } from '@/lib/landing';

// Los botones flotantes NO aparecen de entrada: mientras el formulario está a la vista
// o todavía no se ha llegado a él, la única conversión ofrecida es el formulario, que es
// el evento que entrena al algoritmo y el único que llega calificado.
// Cuando el visitante pasa de largo el formulario sin llenarlo, ahí sí aparecen como
// salida alternativa. Recogen al que no convirtió en vez de competir con la conversión.

export default function FloatingContact({ whatsappText }: { whatsappText: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const form = document.getElementById('agendar');
    if (!form) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        // boundingClientRect.bottom < 0 → el formulario quedó arriba del viewport.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.bottom < 0);
      },
      { threshold: 0 }
    );

    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-50 px-4 pb-[calc(env(safe-area-inset-bottom)+14px)] transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <div className={`mx-auto flex max-w-md gap-2.5 ${visible ? 'pointer-events-auto' : ''}`}>
        <a
          href={whatsappUrl(whatsappText)}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-5 py-3.5 font-heading font-bold text-white shadow-premium"
        >
          <MessageCircle size={20} aria-hidden /> WhatsApp
        </a>
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          tabIndex={visible ? 0 : -1}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-orange px-5 py-3.5 font-heading font-bold text-white shadow-premium"
        >
          <Phone size={20} aria-hidden /> Llamar
        </a>
      </div>
    </div>
  );
}
