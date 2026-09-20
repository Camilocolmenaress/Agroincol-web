'use client';

import { MessageCircle } from 'lucide-react';
import { whatsappEcogel } from '@/lib/ecogel';

// Botón de WhatsApp fijo abajo a la derecha, encima de la barra sticky (por eso
// los 96px). Vive en la página de producto, en /pedido y en /gracias: la pregunta
// que frena la compra se hace desde donde esté la persona. El clic lo mide
// LandingContactTracker (evento Contact) porque el href es wa.me.
export default function WhatsAppFlotante({ texto }: { texto: string }) {
  return (
    <a
      href={whatsappEcogel(texto)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      className="fixed bottom-[calc(env(safe-area-inset-bottom)+96px)] right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] lg:bottom-6"
    >
      <MessageCircle size={28} aria-hidden />
    </a>
  );
}
