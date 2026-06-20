import Image from 'next/image';
import { Clock, Star } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { BUSINESS } from '@/lib/constants';
import type { HeroProps } from '@/lib/types';

function RatingChip() {
  return (
    <a
      href={BUSINESS.googleMapsLink}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur-sm transition-colors hover:bg-white/15"
    >
      <span className="flex items-center gap-0.5 text-brand-amber">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} size={14} className="fill-current" />
        ))}
      </span>
      <span className="text-body-sm font-semibold text-white">4.9</span>
      <span className="text-body-sm text-white/70">· 28 reseñas en Google</span>
    </a>
  );
}

export default function Hero({ title, subtitle, badgeText, primaryCta, secondaryCta, imageSrc, imageAlt, centeredText = false, withBreadcrumbs = false }: HeroProps) {
  const topPadding = withBreadcrumbs ? '' : 'pt-24 md:pt-32';

  // Capa de atmósfera compartida: dot-grid + glow naranja difuso.
  const atmosphere = (
    <>
      <div className="pointer-events-none absolute inset-0 bg-dot-grid opacity-60" aria-hidden />
      <div
        className="glow-pulse pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-brand-orange/30 blur-[120px]"
        aria-hidden
      />
    </>
  );

  if (centeredText) {
    return (
      <section className={`relative overflow-hidden bg-hero-radial ${topPadding}`}>
        {atmosphere}
        <div className="container-custom section-padding relative text-center">
          {badgeText && (
            <div className="animate-rise anim-d1 mb-6">
              <Badge icon={<Clock size={16} />}>{badgeText}</Badge>
            </div>
          )}
          <h1 className="animate-rise anim-d2 text-hero-mobile md:text-hero text-white font-heading text-balance max-w-4xl mx-auto">
            {title}
          </h1>
          <p className="animate-rise anim-d3 text-white/75 text-body-lg mt-5 max-w-3xl mx-auto text-pretty">
            {subtitle}
          </p>
          <div className="animate-rise anim-d4 flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button variant="primary" href={primaryCta.href}>
              {primaryCta.text}
            </Button>
            {secondaryCta && (
              <Button variant="secondary" href={secondaryCta.href} className="border-white/40 text-white hover:bg-white hover:text-brand-green">
                {secondaryCta.text}
              </Button>
            )}
          </div>
          <div className="animate-rise anim-d5 mt-8 flex justify-center">
            <RatingChip />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`relative overflow-hidden bg-hero-radial ${topPadding}`}>
      {atmosphere}
      <div className="container-custom section-padding relative">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Text — 60% */}
          <div className="lg:col-span-3">
            {badgeText && (
              <div className="animate-rise anim-d1 mb-6">
                <Badge icon={<Clock size={16} />}>{badgeText}</Badge>
              </div>
            )}
            <h1 className="animate-rise anim-d2 text-hero-mobile md:text-hero text-white font-heading text-balance">
              {title}
            </h1>
            <p className="animate-rise anim-d3 text-white/75 text-body-lg mt-5 max-w-xl text-pretty">
              {subtitle}
            </p>
            <div className="animate-rise anim-d4 flex flex-col sm:flex-row gap-4 mt-8">
              <Button variant="primary" href={primaryCta.href}>
                {primaryCta.text}
              </Button>
              {secondaryCta && (
                <Button variant="secondary" href={secondaryCta.href} className="border-white/40 text-white hover:bg-white hover:text-brand-green">
                  {secondaryCta.text}
                </Button>
              )}
            </div>
            <div className="animate-rise anim-d5 mt-8">
              <RatingChip />
            </div>
          </div>

          {/* Image — 40% */}
          {imageSrc && (
            <div className="animate-rise anim-d3 lg:col-span-2 relative aspect-video rounded-2xl overflow-hidden ring-1 ring-white/15 shadow-premium">
              <Image
                src={imageSrc}
                alt={imageAlt || title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-green-dark/40 to-transparent" aria-hidden />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
