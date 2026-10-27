'use client';

/**
 * Entradas al hacer scroll, al estilo de essentia.framer.media: los títulos
 * pasan de borrosos a nítidos palabra por palabra, los bloques suben con un
 * desenfoque corto y las fotos se abren con un leve zoom.
 *
 * CSS + un IntersectionObserver por elemento, sin Motion: así no suma
 * JavaScript al primer pantallazo (Motion ya lo usa el formulario).
 *
 * El estado oculto solo existe con JavaScript activo (@media (scripting:
 * enabled) en globals.css): si el script no corre, todo se ve. Con movimiento
 * reducido no hay animación.
 */

import { Fragment, createElement, useEffect, useRef, type ReactNode } from 'react';

type Tipo = 'palabras' | 'bloque' | 'imagen';

interface Props {
  tipo?: Tipo;
  /** Etiqueta HTML del contenedor (h1, h2, p, div…). */
  como?: keyof JSX.IntrinsicElements;
  className?: string;
  /** Retraso en ms, para encadenar elementos vecinos. */
  retraso?: number;
  /** Solo para `palabras`: el texto a partir en palabras. */
  texto?: string;
  /**
   * Lo que se ve al cargar (el héroe): animación SOLO con CSS, que corre desde
   * el primer pintado sin esperar al JavaScript, y sin tocar la opacidad. Un
   * texto en opacidad 0 no cuenta como pintado: esperar a hidratar para
   * mostrarlo llevaba el LCP de 3,3 s a 5-6 s.
   */
  alCargar?: boolean;
  children?: ReactNode;
}

export default function Revelar({ tipo = 'bloque', como = 'div', className = '', retraso = 0, texto, alCargar, children }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || alCargar) return;
    const mostrar = () => el.setAttribute('data-visible', '');
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          mostrar();
          observador.disconnect();
        }
      },
      { rootMargin: '0px 0px -12% 0px' }
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, [alCargar]);

  const contenido =
    tipo === 'palabras' && texto
      ? texto.split(' ').map((palabra, i) => (
          // El espacio va FUERA del span: dentro de un inline-block se recorta y las palabras se pegan.
          <Fragment key={i}>
            <span
              className="rr-palabra"
              style={alCargar ? { animationDelay: `${retraso + i * 45}ms` } : { transitionDelay: `${retraso + i * 45}ms` }}
            >
              {palabra}
            </span>{' '}
          </Fragment>
        ))
      : children;

  return createElement(
    como,
    {
      ref,
      className: `rr-revelar rr-revelar-${tipo} ${alCargar ? 'rr-al-cargar' : ''} ${className}`,
      // Con alCargar el estado final viene ya del servidor; la entrada la hace la animación CSS.
      ...(alCargar ? { 'data-visible': '' } : {}),
      style:
        tipo !== 'palabras' && retraso ? (alCargar ? { animationDelay: `${retraso}ms` } : { transitionDelay: `${retraso}ms` }) : undefined,
      // El texto completo para lectores de pantalla; las palabras sueltas se ocultan.
      ...(tipo === 'palabras' && texto ? { 'aria-label': texto } : {}),
    },
    tipo === 'palabras' ? <span aria-hidden>{contenido}</span> : contenido
  );
}
