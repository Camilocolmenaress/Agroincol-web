import Link from 'next/link';
import { Home, Building2, UtensilsCrossed, MousePointer2, Bug, Factory, type LucideIcon } from 'lucide-react';
import type { ServiceCardData } from '@/lib/types';

const iconMap: Record<string, LucideIcon> = {
  Home,
  Building2,
  UtensilsCrossed,
  MousePointer2,
  Bug,
  Factory,
};

export default function ServiceCard({ service }: { service: ServiceCardData }) {
  const IconComponent = iconMap[service.icon] || Bug;

  const content = (
    <>
      <div className="bg-orange-gradient w-14 h-14 rounded-xl flex items-center justify-center shadow-brand transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
        <IconComponent size={28} className="text-white" />
      </div>
      <h3 className="font-heading font-semibold text-h3 text-brand-green mt-5">
        {service.title}
      </h3>
      <p className="text-brand-gray text-body mt-2">
        {service.shortDescription}
      </p>
      {service.hasPage && service.href && (
        <span className="text-brand-orange font-semibold mt-5 inline-flex items-center gap-1.5">
          Más información
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </span>
      )}
    </>
  );

  const cardClass =
    'group block rounded-2xl border border-brand-gray-light/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-orange/30 hover:shadow-card-hover';

  if (service.hasPage && service.href) {
    return (
      <Link href={service.href} className={cardClass}>
        {content}
      </Link>
    );
  }

  return <div className={cardClass}>{content}</div>;
}
