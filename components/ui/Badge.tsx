import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export default function Badge({ children, icon, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-2 bg-orange-gradient text-white px-4 py-2 rounded-full text-body-sm font-semibold shadow-brand ring-1 ring-white/20 ${className}`}>
      {icon}
      {children}
    </span>
  );
}
