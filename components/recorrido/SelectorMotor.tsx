'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ANGULO_FILA, C, geometria, inicio, pose, type Geometria } from './selector/geometria';
import { volar } from './selector/vuelo';

// Motor del selector (mejora progresiva sobre el HTML del servidor). Copia el slider de
// agrumeafarm.it: el home es una sola pantalla que no baja; la rueda (vertical u horizontal), el
// arrastre y el teclado mueven un objetivo, y el desplazamiento H lo sigue con una exponencial
// (2,3/s libre, 11/s arrastrando). En táctil, el deslizamiento vertical también mueve la fila
// (decisión del 14-nov; en la referencia no hace nada).

export default function SelectorMotor() {
  const router = useRouter();

  useEffect(() => {
    const pista = document.querySelector<HTMLElement>('[data-selector]');
    const seccion = pista?.querySelector<HTMLElement>('.sel');
    const ventana = pista?.querySelector<HTMLElement>('.sel-ventana');
    const items = pista ? Array.from(pista.querySelectorAll<HTMLElement>('.sel-item')) : [];
    if (!pista || !seccion || !ventana || !items.length) return;

    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const n = items.length;
    const enlaces = items.map((it) => it.querySelector<HTMLAnchorElement>('a')!);

    let g: Geometria = geometria(innerWidth, innerHeight, n);
    let H = inicio(g);
    let Hprev = H;
    let desfase = 0; // rueda, arrastre y teclado
    let v = 0;
    let filaY = 0; // eje de la fila en coordenadas de la sección (reacción local al puntero)
    // Resortes de inclinación por objeto (cada uno responde distinto, como en la referencia).
    const resortes = items.map((_, i) => ({ val: 0, vel: 0, k: 70 * (1 - 0.15 + 0.3 * ((i * 0.618034) % 1)) }));

    // Puntero (solo con mouse): parallax y reacción local de cada objeto.
    let px = 0, py = 0, Px = 0, Py = 0, presencia = 0, dentro = false;
    let punteroX = -1e4, punteroY = -1e4;

    const medir = () => {
      g = geometria(innerWidth, innerHeight, n);
      seccion.style.setProperty('--u', `${g.u}px`);
      filaY = parseFloat(getComputedStyle(seccion.querySelector('.sel-fila')!).top) || seccion.clientHeight * 0.55;
    };
    medir();
    seccion.dataset.motor = '';

    const objetivo = () => inicio(g) + desfase;
    H = objetivo();
    Hprev = H;

    // ── Arrastre (mouse y dedo), por el eje dominante: horizontal como en la referencia y, en
    // táctil, también vertical (deslizar hacia arriba = avanzar, como la rueda hacia abajo).
    let apretado = false, arrastrando = false, eje: 'x' | 'y' = 'x', x0 = 0, y0 = 0, xUlt = 0, yUlt = 0, tUlt = 0, vel = 0, movido = 0, tactil = false;
    const bajar = (e: PointerEvent) => {
      if (e.button !== 0) return;
      apretado = true;
      arrastrando = false;
      movido = 0;
      tactil = e.pointerType !== 'mouse';
      x0 = xUlt = e.clientX;
      y0 = yUlt = e.clientY;
      tUlt = performance.now();
      vel = 0;
    };
    const mover = (e: PointerEvent) => {
      if (mouse) {
        const r = seccion.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width) * 2 - 1;
        py = ((e.clientY - r.top) / r.height) * 2 - 1;
        punteroX = e.clientX - r.left;
        punteroY = e.clientY - r.top;
        dentro = true;
      }
      if (!apretado) return;
      if (!arrastrando) {
        const tx = e.clientX - x0, ty = e.clientY - y0;
        if (Math.max(Math.abs(tx), Math.abs(ty)) < C.umbralArrastre) return;
        eje = Math.abs(tx) >= Math.abs(ty) || !tactil ? 'x' : 'y';
        arrastrando = true;
        xUlt = e.clientX;
        yUlt = e.clientY;
        seccion.setPointerCapture?.(e.pointerId);
        seccion.dataset.arrastrando = '';
      }
      const d = eje === 'x' ? e.clientX - xUlt : e.clientY - yUlt;
      const t = performance.now();
      const dt = Math.max(1, t - tUlt);
      vel = vel * 0.72 + (d / dt) * 0.28;
      desfase += d * C.arrastre;
      movido += Math.abs(d);
      xUlt = e.clientX;
      yUlt = e.clientY;
      tUlt = t;
    };
    const soltar = () => {
      if (arrastrando) desfase += Math.max(-C.lanzaMax, Math.min(C.lanzaMax, vel)) * C.arrastre * C.lanzaMs;
      apretado = false;
      arrastrando = false;
      delete seccion.dataset.arrastrando;
    };
    const salir = () => {
      dentro = false;
    };
    // Después de arrastrar, el clic no navega.
    const clic = (e: MouseEvent) => {
      if (movido > C.umbralArrastre) {
        e.preventDefault();
        e.stopPropagation();
        movido = 0;
        return;
      }
      const a = (e.target as Element).closest<HTMLAnchorElement>('a.sel-enlace');
      if (!a || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (quieto || !a.hasAttribute('data-vuela')) return; // navegación normal
      e.preventDefault();
      const i = enlaces.indexOf(a);
      volar({ item: items[i], rotacion: actual[i].rot + ANGULO_FILA, escala: actual[i].escala, href: a.getAttribute('href')!, seccion, ir: (h) => router.push(h) });
    };
    // Rueda (como la referencia): el eje dominante mueve la fila; la página no se desplaza.
    const rueda = (e: WheelEvent) => {
      e.preventDefault();
      desfase -= (Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * C.ganancia;
    };

    // ── Teclado: el foco nunca desplaza la ventana (falla de la referencia): el objeto enfocado
    // viene al centro. Las flechas pasan al objeto vecino.
    const sinScroll = () => {
      ventana.scrollLeft = 0;
      ventana.scrollTop = 0;
    };
    const centrar = (i: number) => {
      // Contra el objetivo (no contra H, que todavía viene en camino): varias flechas seguidas suman bien.
      const fe = pose(i, objetivo(), g).q * g.G;
      let d = g.G / 2 - fe;
      d = ((((d + g.F / 2) % g.F) + g.F) % g.F) - g.F / 2;
      desfase += d;
    };
    const foco = (e: FocusEvent) => {
      const i = enlaces.indexOf(e.target as HTMLAnchorElement);
      if (i >= 0) centrar(i);
    };
    const tecla = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const i = enlaces.indexOf(document.activeElement as HTMLAnchorElement);
      const objetivoTecla = e.target as HTMLElement;
      if (i < 0 && objetivoTecla !== document.body) return; // no robar las flechas a otros controles
      e.preventDefault();
      // Con un objeto enfocado, pasa al vecino; si no, la fila avanza un paso.
      if (i >= 0) enlaces[(i + (e.key === 'ArrowRight' ? 1 : n - 1)) % n].focus({ preventScroll: true });
      else desfase += e.key === 'ArrowRight' ? -g.N : g.N;
    };

    seccion.addEventListener('pointerdown', bajar);
    window.addEventListener('pointermove', mover, { passive: true });
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    seccion.addEventListener('pointerleave', salir);
    seccion.addEventListener('click', clic, true);
    seccion.addEventListener('wheel', rueda, { passive: false });
    ventana.addEventListener('scroll', sinScroll);
    seccion.addEventListener('focusin', foco);
    window.addEventListener('keydown', tecla);
    const alCambiar = () => {
      medir();
    };
    window.addEventListener('resize', alCambiar);

    // ── Cuadro a cuadro, solo mientras el selector está en pantalla.
    const actual = items.map(() => ({ rot: 0, escala: 1 }));
    const forma = seccion.querySelector<HTMLElement>('.sel-forma');
    let raf = 0, tAnt = 0, visible = true;
    const paso = (t: number) => {
      const dt = Math.min(1 / 30, tAnt ? (t - tAnt) / 1000 : 1 / 60);
      tAnt = t;
      const meta = objetivo();
      if (quieto) H = meta;
      else {
        H += (meta - H) * (1 - Math.exp(-(arrastrando ? C.tasaArrastre : C.tasaLibre) * dt));
        if (Math.abs(meta - H) < 0.05) H = meta;
      }
      v = (H - Hprev) / dt;
      Hprev = H;

      // Parallax del mouse: menos de 10 px, con entrada y salida suaves.
      if (mouse && !quieto) {
        Px += (px - Px) * (1 - Math.exp(-4 * dt));
        Py += (py - Py) * (1 - Math.exp(-4 * dt));
        presencia += ((dentro ? 1 : 0) - presencia) * (1 - Math.exp(-3 * dt));
        seccion.style.setProperty('--px', (Px * presencia).toFixed(4));
        seccion.style.setProperty('--py', (Py * presencia).toFixed(4));
      }
      seccion.style.setProperty('--giro', `${(H * (g.movil ? C.giroLemaMovil : C.giroLema)).toFixed(3)}deg`);

      const cos = Math.cos((ANGULO_FILA * Math.PI) / 180), sin = Math.sin((ANGULO_FILA * Math.PI) / 180);
      const lx = (punteroX - g.G / 2) * cos + (punteroY - filaY) * sin;
      const ly = -(punteroX - g.G / 2) * sin + (punteroY - filaY) * cos;
      const vn = Math.max(-1, Math.min(1, v / C.vNorm));

      for (let i = 0; i < n; i++) {
        const base = pose(i, H, g, { v });
        let jalonX = 0, jalonY = 0, eleva = 0, giroPuntero = 0;
        if (mouse && !quieto && presencia > 0.01) {
          const cx = base.x + g.u / 2 - g.G / 2;
          const dx = lx - cx, dy = ly - base.y;
          const radio = 1.6 * g.u;
          const cerca = Math.exp(-(dx * dx + dy * dy) / (radio * radio));
          jalonX = (16 * Math.tanh(dx / radio) * cerca - 26 * (base.escala / C.escalaMax) * Px) * presencia;
          jalonY = (16 * Math.tanh(dy / (0.8 * g.u)) * cerca - 26 * (base.escala / C.escalaMax) * Py * 0.5) * presencia;
          eleva = 0.05 * cerca * presencia;
          giroPuntero = 5 * Math.tanh(dx / radio) * cerca * presencia;
        }
        const r = resortes[i];
        const metaInclina = quieto ? 0 : -Math.sign(vn) * Math.abs(vn) * C.inclinMax + giroPuntero;
        r.vel += ((metaInclina - r.val) * r.k - r.vel * 9) * dt;
        r.val += r.vel * dt;
        const p = pose(i, H, g, { v: quieto ? 0 : v, inclina: r.val, jalonX, jalonY, eleva });
        actual[i].rot = p.rot;
        actual[i].escala = p.escala;
        const el = items[i];
        el.style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.rot.toFixed(2)}deg) scale(${p.escala.toFixed(4)})`;
        el.style.filter = `brightness(${p.brillo.toFixed(3)}) blur(${p.desenfoque.toFixed(2)}px)`;
        el.style.zIndex = String(Math.round(p.escala * 100));
      }
      if (forma) forma.dataset.listo = '';
      raf = visible ? requestAnimationFrame(paso) : 0;
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) {
        tAnt = 0;
        raf = requestAnimationFrame(paso);
      }
    });
    io.observe(seccion);
    raf = requestAnimationFrame(paso);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      seccion.removeEventListener('pointerdown', bajar);
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
      seccion.removeEventListener('pointerleave', salir);
      seccion.removeEventListener('click', clic, true);
      seccion.removeEventListener('wheel', rueda);
      ventana.removeEventListener('scroll', sinScroll);
      seccion.removeEventListener('focusin', foco);
      window.removeEventListener('keydown', tecla);
      window.removeEventListener('resize', alCambiar);
    };
  }, [router]);

  return null;
}
