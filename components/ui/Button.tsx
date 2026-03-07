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
  primary: 'bg-brand-orange text-white hover:bg-brand-orange-dark',
  secondary: 'bg-transparent text-brand-green border-2 border-brand-green hover:bg-brand-green hover:text-white',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1DA851]',
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
  const baseStyles = `font-heading font-semibold px-6 py-3 rounded-lg transition-colors duration-200 inline-flex items-center justify-center gap-2 ${variantStyles[variant]} ${fullWidth ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

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
