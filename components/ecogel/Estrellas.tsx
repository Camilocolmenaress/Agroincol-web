import { BadgeCheck, Star } from 'lucide-react';

// Piezas repetidas de las tarjetas de reseña: fila de estrellas ámbar y
// nombre con sello de verificado. Las usan el marquee, el antes/después y la
// lista de reseñas para que las tres se vean iguales.

export function Estrellas({ n, size = 16 }: { n?: number; size?: number }) {
  if (n == null) return null;
  return (
    <span className="flex text-brand-amber" role="img" aria-label={`${n} de 5 estrellas`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} fill={s <= n ? 'currentColor' : 'none'} strokeWidth={s <= n ? 0 : 1.5} aria-hidden />
      ))}
    </span>
  );
}

export function NombreVerificado({ nombre, ciudad, className = '' }: { nombre: string; ciudad?: string; className?: string }) {
  return (
    <p className={`flex min-w-0 items-center gap-1 text-body-sm font-semibold text-brand-black ${className}`}>
      <span className="truncate">
        {nombre}
        {ciudad && <span className="font-normal text-brand-black/55"> · {ciudad}</span>}
      </span>
      <BadgeCheck size={16} className="flex-none text-brand-green" aria-label="Compra verificada" />
    </p>
  );
}

export function Avatar({ nombre }: { nombre: string }) {
  return (
    <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-brand-gray-light font-heading text-body-sm font-bold text-brand-black/60" aria-hidden>
      {nombre.charAt(0)}
    </span>
  );
}
