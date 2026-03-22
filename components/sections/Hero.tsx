import Image from 'next/image';
import { Clock } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { HeroProps } from '@/lib/types';

export default function Hero({ title, subtitle, badgeText, primaryCta, secondaryCta, imageSrc, imageAlt, centeredText = false, withBreadcrumbs = false }: HeroProps) {
  const topPadding = withBreadcrumbs ? '' : 'pt-24 md:pt-32';

  if (centeredText) {
    return (
      <section className={`bg-brand-green ${topPadding}`}>
        <div className="container-custom section-padding text-center">
          {badgeText && (
            <div className="mb-6">
              <Badge icon={<Clock size={16} />}>{badgeText}</Badge>
            </div>
          )}
          <h1 className="text-hero-mobile md:text-hero text-white font-heading max-w-4xl mx-auto">
            {title}
          </h1>
          <p className="text-gray-300 text-body-lg mt-4 max-w-3xl mx-auto">
            {subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button variant="primary" href={primaryCta.href}>
              {primaryCta.text}
            </Button>
            {secondaryCta && (
              <Button variant="secondary" href={secondaryCta.href} className="border-white text-white hover:bg-white hover:text-brand-green">
                {secondaryCta.text}
              </Button>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-brand-green ${topPadding}`}>
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Text — 60% */}
          <div className="lg:col-span-3">
            {badgeText && (
              <div className="mb-6">
                <Badge icon={<Clock size={16} />}>{badgeText}</Badge>
              </div>
            )}
            <h1 className="text-hero-mobile md:text-hero text-white font-heading">
              {title}
            </h1>
            <p className="text-gray-300 text-body-lg mt-4">
              {subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button variant="primary" href={primaryCta.href}>
                {primaryCta.text}
              </Button>
              {secondaryCta && (
                <Button variant="secondary" href={secondaryCta.href} className="border-white text-white hover:bg-white hover:text-brand-green">
                  {secondaryCta.text}
                </Button>
              )}
            </div>
          </div>

          {/* Image — 40% */}
          {imageSrc && (
            <div className="lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={imageSrc}
                alt={imageAlt || title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
