import { useCallback, useEffect, useRef, useState } from 'react';

// Lo que comparten los carruseles con scroll-snap (galería y evidencia): el
// slide activo es el hijo cuyo centro queda más cerca del centro visible de la
// pista, y `irA` centra el hijo pedido. Así sirve igual para slides a ancho
// completo y para tarjetas más angostas que la pista. Deslizar con el dedo no
// depende de este JavaScript; solo mueve el punto activo y las flechas.
export function useCarrusel(total: number) {
  const pista = useRef<HTMLDivElement>(null);
  const [activo, setActivo] = useState(0);

  useEffect(() => {
    const el = pista.current;
    if (!el) return;
    const onScroll = () => {
      const centro = el.scrollLeft + el.clientWidth / 2;
      let mejor = 0;
      let distancia = Infinity;
      Array.from(el.children).forEach((hijo, i) => {
        const h = hijo as HTMLElement;
        const d = Math.abs(h.offsetLeft + h.offsetWidth / 2 - centro);
        if (d < distancia) {
          distancia = d;
          mejor = i;
        }
      });
      setActivo(mejor);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const irA = useCallback(
    (i: number) => {
      const el = pista.current;
      if (!el) return;
      const hijo = el.children[Math.max(0, Math.min(total - 1, i))] as HTMLElement | undefined;
      if (!hijo) return;
      el.scrollTo({ left: hijo.offsetLeft + hijo.offsetWidth / 2 - el.clientWidth / 2, behavior: 'smooth' });
    },
    [total],
  );

  return { pista, activo, irA };
}
