import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function Badge({ children, icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 bg-brand-orange text-white px-4 py-2 rounded-full text-body-sm font-semibold ${className}`}>
      {icon}
      {children}
    </span>
  );
}
