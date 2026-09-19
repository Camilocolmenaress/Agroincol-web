import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

// Marcador evidente para las fotos que aún no existen. Quien lo usa decide con
// `publicFileExists` (servidor) si pasa `src`; si no hay archivo, se pinta el
// recuadro con el encuadre esperado para que nadie olvide qué foto falta.

const RATIOS = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[4/5]',
} as const;

interface Props {
  etiqueta: string;
  medidas: string;
  ratio?: keyof typeof RATIOS;
  src?: string;
  alt?: string;
  prioridad?: boolean;
  className?: string;
}

export default function Marcador({ etiqueta, medidas, ratio = 'square', src, alt, prioridad, className = '' }: Props) {
  if (src) {
    return (
      <div className={`relative ${RATIOS[ratio]} w-full overflow-hidden rounded-2xl ${className}`}>
        <Image src={src} alt={alt ?? etiqueta} fill priority={prioridad} sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`flex ${RATIOS[ratio]} w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-green/30 bg-brand-cream p-4 text-center ${className}`}
      role="img"
      aria-label={`Imagen pendiente: ${etiqueta}`}
    >
      <ImageIcon className="text-brand-green/40" size={28} aria-hidden />
      <p className="mt-2 text-body-sm font-semibold text-brand-green/70">{etiqueta}</p>
      <p className="text-brand-black/45 text-body-sm">{medidas}</p>
    </div>
  );
}
