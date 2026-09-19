import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { whatsappEcogel } from '@/lib/ecogel';

// Logo + WhatsApp. Sin menú ni buscador: en una landing de pauta cada enlace es una fuga.
export default function CabeceraEcogel({ whatsappTexto }: { whatsappTexto: string }) {
  return (
    <header className="bg-brand-mint py-3">
      <div className="container-custom flex items-center justify-between">
        <Image src="/images/logos/logo-horizontal.png" alt="AGROINCOL" width={420} height={140} priority className="h-9 w-auto md:h-11" />
        <a
          href={whatsappEcogel(whatsappTexto)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle size={20} aria-hidden />
        </a>
      </div>
    </header>
  );
}
