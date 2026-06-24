'use client';

import { type ReactNode } from 'react';

interface ReviewButtonProps {
  href: string;
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'ghost';
}

// Botón de reseña con tracking. Empuja un evento a dataLayer (GTM/GA4) antes de
// abrir la casilla de reseña de Google, para medir conversión desde el QR físico.
export default function ReviewButton({ href, children, className = '', variant = 'primary' }: ReviewButtonProps) {
  const handleClick = () => {
    if (typeof window !== 'undefined') {
      const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
      w.dataLayer = w.dataLayer || [];
      w.dataLayer.push({ event: 'click_resena', destino: 'google_review' });
    }
  };

  const styles =
    variant === 'primary'
      ? 'bg-orange-gradient text-white shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 focus-visible:ring-brand-orange/50'
      : 'bg-transparent text-brand-green border-2 border-brand-green/30 hover:border-brand-green hover:-translate-y-0.5 focus-visible:ring-brand-green/40';

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`font-heading font-semibold rounded-2xl transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${styles} ${className}`}
    >
      {children}
    </a>
  );
}
