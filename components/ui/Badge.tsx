import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function Badge({ children, icon, className = '' }: BadgeProps) {
  return (
    // Manual v2: nada de texto pequeño blanco sobre naranja. La píldora va translúcida sobre el
    // verde del hero y el ícono lleva el acento naranja.
    <span className={`inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-body-sm font-semibold ring-1 ring-white/25 [&>svg]:text-marca-naranja ${className}`}>
      {icon}
      {children}
    </span>
  );
}
