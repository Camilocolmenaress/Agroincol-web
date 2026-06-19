'use client';

import { useRef, useEffect, useState, useCallback, Children } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  children: React.ReactNode;
  /** Auto-avanza solo (se pausa al interactuar y respeta prefers-reduced-motion). */
  autoPlay?: boolean;
  /** Intervalo de auto-avance en ms. */
  interval?: number;
  /** Alineación del snap de cada tarjeta. */
  align?: 'start' | 'center';
  /** Ancho de cada tarjeta por breakpoint (controla cuántas se ven / el "peek"). */
  itemClassName?: string;
  ariaLabel: string;
  controls?: 'dots' | 'arrows' | 'both';
  className?: string;
}

// Primitivo de carrusel basado en scroll-snap nativo: arrastre táctil gratis,
// rendimiento alto y accesible. La variación de movimiento entre secciones se
// logra con autoPlay / align / itemClassName — no con animaciones distintas por tarjeta.
export default function Carousel({
  children,
  autoPlay = false,
  interval = 4500,
  align = 'start',
  itemClassName = 'basis-[82%] sm:basis-[46%] lg:basis-[31%]',
  ariaLabel,
  controls = 'dots',
  className = '',
}: CarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const items = Children.toArray(children);
  const count = items.length;
  const [active, setActive] = useState(0);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    const child = track?.children[i] as HTMLElement | undefined;
    if (!track || !child) return;
    track.scrollTo({ left: child.offsetLeft - track.offsetLeft, behavior: 'smooth' });
  }, []);

  // Sincroniza el índice activo con la posición real del scroll (incluye el arrastre manual).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const center = track.scrollLeft + track.clientWidth / 2;
        let nearest = 0;
        let min = Infinity;
        Array.from(track.children).forEach((c, i) => {
          const el = c as HTMLElement;
          const elCenter = el.offsetLeft - track.offsetLeft + el.clientWidth / 2;
          const d = Math.abs(elCenter - center);
          if (d < min) {
            min = d;
            nearest = i;
          }
        });
        setActive(nearest);
      });
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      track.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Auto-avance: sin movimiento si el usuario lo prefiere, y pausado al interactuar.
  useEffect(() => {
    if (!autoPlay || count < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (pausedRef.current) return;
      setActive((prev) => {
        const next = (prev + 1) % count;
        scrollToIndex(next);
        return next;
      });
    }, interval);
    return () => clearInterval(id);
  }, [autoPlay, interval, count, scrollToIndex]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const showDots = controls === 'dots' || controls === 'both';
  const showArrows = controls === 'arrows' || controls === 'both';

  return (
    <div
      className={`relative ${className}`}
      role="region"
      aria-roledescription="carrusel"
      aria-label={ariaLabel}
    >
      <div
        ref={trackRef}
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-1"
        onPointerDown={pause}
        onPointerEnter={pause}
        onPointerLeave={resume}
        onFocusCapture={pause}
        onBlurCapture={resume}
      >
        {items.map((child, i) => (
          <div
            key={i}
            className={`shrink-0 ${align === 'center' ? 'snap-center' : 'snap-start'} ${itemClassName}`}
          >
            {child}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollToIndex(Math.max(0, active - 1))}
            disabled={active === 0}
            className="hidden md:flex absolute left-0 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-green shadow-card transition-opacity disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollToIndex(Math.min(count - 1, active + 1))}
            disabled={active === count - 1}
            className="hidden md:flex absolute right-0 top-1/2 h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand-green shadow-card transition-opacity disabled:pointer-events-none disabled:opacity-0"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showDots && count > 1 && (
        <div className="mt-5 flex justify-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Ir a la tarjeta ${i + 1}`}
              aria-current={active === i}
              onClick={() => scrollToIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                active === i ? 'w-6 bg-brand-orange' : 'w-2 bg-brand-gray-light hover:bg-brand-gray'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
