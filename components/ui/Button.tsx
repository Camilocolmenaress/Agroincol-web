import { type ReactNode } from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'whatsapp';
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
  target?: string;
  fullWidth?: boolean;
}

const variantStyles = {
  primary:
    'bg-orange-gradient text-white shadow-brand hover:shadow-brand-lg hover:-translate-y-0.5 focus-visible:ring-brand-orange/50',
  secondary:
    'bg-transparent text-brand-green border-2 border-brand-green hover:bg-brand-green hover:text-white hover:-translate-y-0.5 focus-visible:ring-brand-green/40',
  whatsapp:
    'bg-[#25D366] text-white shadow-soft hover:bg-[#1DA851] hover:-translate-y-0.5 focus-visible:ring-[#25D366]/50',
} as const;

export default function Button({
  variant,
  children,
  href,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  target,
  fullWidth = false,
}: ButtonProps) {
  const baseStyles = `font-heading font-semibold px-6 py-3 rounded-xl transition-all duration-300 ease-out inline-flex items-center justify-center gap-2 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''} ${className}`;

  if (href) {
    return (
      <a href={href} className={baseStyles} target={target} rel={target === '_blank' ? 'noopener noreferrer' : undefined}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={baseStyles}>
      {children}
    </button>
  );
}
