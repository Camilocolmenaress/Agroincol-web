import { CheckCircle, AlertCircle } from 'lucide-react';
import type { ReactNode } from 'react';

interface NormativaSectionProps {
  title: string;
  description: string;
  subsectionTitle?: string;
  items?: string[];
  callout?: string;
  children?: ReactNode;
  bgColor?: 'white' | 'light';
}

export default function NormativaSection({
  title,
  description,
  subsectionTitle,
  items,
  callout,
  children,
  bgColor = 'white',
}: NormativaSectionProps) {
  return (
    <section className={`section-padding ${bgColor === 'light' ? 'bg-brand-light' : 'bg-white'}`}>
      <div className="container-custom">
        <h2 className="font-heading text-h2-mobile md:text-h2 text-brand-green mb-6">{title}</h2>
        <p className="text-brand-gray text-body-lg mb-8">{description}</p>

        {subsectionTitle && (
          <h3 className="font-heading font-semibold text-h3 text-brand-green mb-4">{subsectionTitle}</h3>
        )}

        {items && items.length > 0 && (
          <ul className="space-y-3 mb-8">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle size={20} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="text-brand-black text-body">{item}</span>
              </li>
            ))}
          </ul>
        )}

        {callout && (
          <div className="bg-brand-orange/10 border-l-4 border-brand-orange rounded-r-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle size={24} className="text-brand-orange shrink-0 mt-0.5" />
              <p className="text-brand-black text-body">{callout}</p>
            </div>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
