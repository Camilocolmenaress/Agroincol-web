import { Phone, MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

// Barra fija inferior solo-móvil con las dos acciones de conversión #1:
// llamar y WhatsApp. Siempre visible al hacer scroll.
export default function MobileCTABar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-white/10 shadow-premium md:hidden">
      <a
        href={`tel:${BUSINESS.phoneRaw}`}
        className="flex items-center justify-center gap-2 bg-brand-green py-3.5 font-heading font-semibold text-white active:bg-brand-green-dark"
        data-cta="mobile-call"
      >
        <Phone size={18} /> Llamar
      </a>
      <a
        href={BUSINESS.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25D366] py-3.5 font-heading font-semibold text-white active:bg-[#1DA851]"
        data-cta="mobile-whatsapp"
      >
        <MessageCircle size={18} fill="white" /> WhatsApp
      </a>
    </div>
  );
}
