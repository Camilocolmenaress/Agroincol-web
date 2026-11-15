'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Monta el movimiento del prototipo (js/site.js, pasado a lib/rediseno/motor.ts) en cada cambio
// de ruta y lo desmonta al salir: en Next la navegación no recarga la página, así que ScrollTrigger,
// Lenis y los listeners se limpian y se vuelven a crear (README §4).
export default function Motor() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let desmontar: (() => void) | undefined;
    let cancelado = false;
    import('@/lib/rediseno/motor').then(({ montar }) => {
      if (cancelado) return;
      desmontar = montar({ ir: (href) => router.push(href) });
    });
    return () => {
      cancelado = true;
      desmontar?.();
    };
  }, [pathname, router]);

  return null;
}
