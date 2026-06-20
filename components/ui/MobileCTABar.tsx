import { Phone, MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

// Barra fija inferior solo-móvil con las dos acciones de conversión #1:
// llamar y WhatsApp. Siempre visible al hacer scroll.
export default function MobileCTABar() {
  return (
    // Flota sobre la página: margen lateral, espacio inferior (con safe-area iOS) y bordes redondeados.
    // pointer-events-none en el contenedor deja ver/tocar la página en los huecos; los botones reactivan el toque.
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden">
      <div className="pointer-events-auto mx-auto flex max-w-md gap-3">
        <a
          href={`tel:${BUSINESS.phoneRaw}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-green py-3.5 font-heading font-semibold text-white shadow-premium ring-1 ring-white/10 transition-transform active:scale-[0.97] active:bg-brand-green-dark"
          data-cta="mobile-call"
        >
          <Phone size={18} /> Llamar
        </a>
        <a
          href={BUSINESS.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-3.5 font-heading font-semibold text-white shadow-premium ring-1 ring-white/10 transition-transform active:scale-[0.97] active:bg-[#1DA851]"
          data-cta="mobile-whatsapp"
        >
          <MessageCircle size={18} fill="white" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
