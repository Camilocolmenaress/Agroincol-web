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

  return (
    <div className="border border-brand-gray-light rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="bg-brand-orange/10 w-14 h-14 rounded-lg flex items-center justify-center">
        <IconComponent size={40} className="text-brand-orange" />
      </div>
      <h3 className="font-heading font-semibold text-h3 text-brand-green mt-4">
        {service.title}
      </h3>
      <p className="text-brand-gray text-body mt-2">
        {service.shortDescription}
      </p>
      {service.hasPage && service.href && (
        <Link
          href={service.href}
          className="text-brand-orange font-semibold hover:underline mt-4 inline-block"
        >
          Más información →
        </Link>
      )}
    </div>
  );
}
