'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS } from '@/lib/constants';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {showTooltip && (
        <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white text-brand-black text-sm font-body px-4 py-2 rounded-lg shadow-lg whitespace-nowrap">
          ¿Necesita fumigación? ¡Escríbanos!
        </div>
      )}
      <a
        href={BUSINESS.whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1DA851] rounded-full shadow-xl flex items-center justify-center transition-colors duration-200"
        style={{ animation: 'gentle-bounce 3s ease-in-out infinite' }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Contactar por WhatsApp"
      >
        <MessageCircle size={28} className="text-white" fill="white" />
      </a>
    </div>
  );
}
