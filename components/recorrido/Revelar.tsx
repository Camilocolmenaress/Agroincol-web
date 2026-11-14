'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Revelado de texto por máscara, como el de agrumeafarm.it: cada letra (títulos) o línea (párrafos)
// sube desde abajo dentro de un recorte, sin fundido, cuando entra en pantalla (una vez).
// Títulos por letra: 0,95 s, 0,02 s entre letras. Párrafos por línea: 0,55 s, 0,08 s entre líneas.
// Curva "textveil" (.165,1,.32,1).
//
// Reglas (SEO y primer pintado):
// - El HTML del servidor no cambia: el corte se hace aquí, en el cliente.
// - El texto no se duplica: los cortes son <span> con las mismas letras y espacios, así que el
//   textContent (lo que leen buscadores) es idéntico al original. Los títulos llevan aria-label con
//   su texto para que los lectores de pantalla no lean letra por letra.
// - Solo se preparan los elementos que al cargar están por debajo del primer pantallazo: nada de
//   lo visible al pintar (el H1, el texto de arriba) se oculta esperando JS. Los H1 nunca.
// - Al terminar se devuelven los nodos originales (sin cortes que se rompan al cambiar el ancho).
//
// Qué se revela: los h2 de <main> que solo tienen texto (por letra) y los elementos con
// data-revelar="lineas".
const LETRA = { dur: 950, paso: 20, dist: 108 };
const LINEA = { dur: 550, paso: 80, dist: 112 };
const CURVA = 'cubic-bezier(.165,1,.32,1)';

function soloTexto(el: Element) {
  return Array.from(el.childNodes).every((n) => n.nodeType === Node.TEXT_NODE || (n as Element).tagName === 'BR');
}

function cortarLetras(el: HTMLElement) {
  const texto = el.textContent ?? '';
  const visible = document.createDocumentFragment();
  // Palabra por palabra (para que el navegador siga partiendo líneas entre palabras).
  texto.split(/(\s+)/).forEach((trozo) => {
    if (!trozo) return;
    if (/^\s+$/.test(trozo)) {
      visible.appendChild(document.createTextNode(' '));
      return;
    }
    const palabra = document.createElement('span');
    palabra.className = 'rvl-palabra';
    for (const c of Array.from(trozo)) {
      const m = document.createElement('span');
      m.className = 'rvl-mascara';
      const u = document.createElement('span');
      u.className = 'rvl-u';
      u.textContent = c;
      m.appendChild(u);
      palabra.appendChild(m);
    }
    visible.appendChild(palabra);
  });
  return visible;
}

function cortarLineas(el: HTMLElement) {
  // Primero por palabras para medir; luego se agrupan por línea según su posición.
  const texto = el.textContent ?? '';
  const medir = document.createElement('span');
  const palabras = texto.split(/\s+/).filter(Boolean).map((w) => {
    const s = document.createElement('span');
    s.textContent = w;
    medir.appendChild(s);
    medir.appendChild(document.createTextNode(' '));
    return s;
  });
  el.textContent = '';
  el.appendChild(medir);
  const lineas: string[][] = [];
  let top = -1;
  palabras.forEach((s) => {
    const t = s.offsetTop;
    if (Math.abs(t - top) > 2) {
      lineas.push([]);
      top = t;
    }
    lineas[lineas.length - 1].push(s.textContent ?? '');
  });
  el.textContent = '';
  const visible = document.createDocumentFragment();
  lineas.forEach((l, i) => {
    if (i > 0) visible.appendChild(document.createTextNode(' '));
    const m = document.createElement('span');
    m.className = 'rvl-mascara rvl-linea';
    const u = document.createElement('span');
    u.className = 'rvl-u';
    u.textContent = l.join(' ');
    m.appendChild(u);
    visible.appendChild(m);
  });
  return visible;
}

export default function Revelar() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const main = document.querySelector('main');
    if (!main) return;
    const alto = window.innerHeight;
    const candidatos = [
      ...Array.from(main.querySelectorAll<HTMLElement>('h2')).filter(soloTexto).map((el) => ({ el, modo: 'letras' as const })),
      ...Array.from(main.querySelectorAll<HTMLElement>('[data-revelar="lineas"]')).filter(soloTexto).map((el) => ({ el, modo: 'lineas' as const })),
    ].filter(({ el }) => el.getBoundingClientRect().top > alto && !el.closest('[data-sin-revelar]'));

    // Se guardan los nodos originales (los que maneja React) y se devuelven tal cual al terminar.
    const preparados = new Map<HTMLElement, { original: ChildNode[]; modo: 'letras' | 'lineas' }>();
    candidatos.forEach(({ el, modo }) => {
      const original = Array.from(el.childNodes);
      const texto = el.textContent ?? '';
      const visible = modo === 'letras' ? cortarLetras(el) : cortarLineas(el);
      el.textContent = '';
      el.append(visible);
      if (modo === 'letras') el.setAttribute('aria-label', texto.trim());
      const cfg = modo === 'letras' ? LETRA : LINEA;
      el.querySelectorAll<HTMLElement>('.rvl-u').forEach((u) => (u.style.transform = `translateY(${cfg.dist}%)`));
      el.dataset.rvl = '';
      preparados.set(el, { original, modo });
    });

    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const info = preparados.get(el);
          if (!info) return;
          io.unobserve(el);
          const cfg = info.modo === 'letras' ? LETRA : LINEA;
          const unidades = Array.from(el.querySelectorAll<HTMLElement>('.rvl-u'));
          let ultima: Animation | undefined;
          unidades.forEach((u, i) => {
            ultima = u.animate([{ transform: `translateY(${cfg.dist}%)` }, { transform: 'translateY(0)' }], {
              duration: cfg.dur,
              delay: i * cfg.paso,
              easing: CURVA,
              fill: 'forwards',
            });
          });
          // Al terminar, el HTML vuelve a ser el original.
          if (ultima)
            ultima.onfinish = () => {
              el.replaceChildren(...info.original);
              el.removeAttribute('aria-label');
              delete el.dataset.rvl;
              preparados.delete(el);
            };
        });
      },
      { rootMargin: '0px 0px -9% 0px' }
    );
    preparados.forEach((_, el) => io.observe(el));

    return () => {
      io.disconnect();
      preparados.forEach((info, el) => {
        el.replaceChildren(...info.original);
        el.removeAttribute('aria-label');
        delete el.dataset.rvl;
      });
    };
  }, [pathname]);

  return null;
}
