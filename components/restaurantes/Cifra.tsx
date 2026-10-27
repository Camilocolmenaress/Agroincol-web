'use client';

import { useEffect, useRef } from 'react';

interface Props {
  valor: number;
  decimales?: number;
  prefijo?: string;
  sufijo?: string;
}

/** Misma curva que el resto de la página (ease-out exponencial). */
const suavizar = (t: number) => 1 - Math.pow(2, -10 * t);

/**
 * Cifra que cuenta desde cero la primera vez que se acerca a la pantalla.
 *
 * Sin Motion a propósito: su `animate()` arrastra el motor completo (~30 KB) a
 * la primera carga, y contar un número son diez líneas. Motion se queda para
 * el formulario, donde sí hace falta (entradas y salidas de cada paso).
 *
 * El valor final está SIEMPRE pintado: el conteo arranca cuando la cifra está
 * a punto de entrar, todavía fuera de la vista. Si el observador nunca se
 * dispara, se ve la cifra correcta y no un "0+ años". Con movimiento reducido
 * no cuenta.
 */
export default function Cifra({ valor, decimales = 0, prefijo = '', sufijo = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const formato = (n: number) =>
      prefijo + n.toLocaleString('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }) + sufijo;

    let cuadro = 0;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        observador.disconnect();
        // Ya a la vista al cargar (pantalla alta): no se cuenta frente a la persona.
        if (el.getBoundingClientRect().top < window.innerHeight) return;
        const inicio = performance.now();
        const paso = (ahora: number) => {
          const t = Math.min((ahora - inicio) / 1400, 1);
          el.textContent = formato(valor * suavizar(t));
          if (t < 1) cuadro = requestAnimationFrame(paso);
        };
        cuadro = requestAnimationFrame(paso);
      },
      { rootMargin: '0px 0px 25% 0px' }
    );
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(cuadro);
    };
  }, [valor, decimales, prefijo, sufijo]);

  return (
    <span ref={ref}>
      {prefijo + valor.toLocaleString('es-CO', { minimumFractionDigits: decimales, maximumFractionDigits: decimales }) + sufijo}
    </span>
  );
}
