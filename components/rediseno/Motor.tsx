'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ponerMensajeEnCromo } from '@/lib/rediseno/whatsapp';

// Monta el movimiento del prototipo (js/site.js, pasado a lib/rediseno/motor.ts) en cada cambio
// de ruta y lo desmonta al salir: en Next la navegación no recarga la página, así que ScrollTrigger,
// Lenis y los listeners se limpian y se vuelven a crear (README §4).
export default function Motor() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    ponerMensajeEnCromo();
    let desmontar: (() => void) | undefined;
    let cancelado = false;
    // Si la descarga del motor falla (conexión inestable), se reintenta una vez: sin motor tampoco
    // queda conectado el formulario de cotización.
    const cargar = (intento: number): void => {
      import('@/lib/rediseno/motor')
        .then(({ montar }) => {
          if (cancelado) return;
          desmontar = montar({ ir: (href) => router.push(href) });
        })
        .catch(() => {
          if (!cancelado && intento === 0) window.setTimeout(() => cargar(1), 1500);
        });
    };
    cargar(0);
    return () => {
      cancelado = true;
      desmontar?.();
    };
  }, [pathname, router]);

  return null;
}
