// Movimiento del sitio: js/site.js del prototipo aprobado (_rediseno/site/js/site.js), pasado a
// TypeScript sin cambiar su comportamiento. Diferencias, todas técnicas:
// - Se monta en cada cambio de ruta y devuelve una función que lo desmonta todo (listeners,
//   tickers, ScrollTrigger, Lenis, observadores, temporizadores). La cabecera, el menú y el pie
//   no se vuelven a pintar entre páginas, así que su estado se reinicia aquí.
// - La transición entre páginas navega con el router de Next (sin recargar) después del velo.
// - Lo que el prototipo hacía en window.load se hace al montar y cuando cargan fuentes e imágenes.
// - El formulario envía al sistema de leads (lib/rediseno/formularios.ts).
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { conectarFormularios } from './formularios';
import { montarHerramientas } from './herramientas';

gsap.registerPlugin(ScrollTrigger);
gsap.ticker.lagSmoothing(0);

type Opciones = { ir: (href: string) => void };

const HAND =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"/></svg>';

const store = {
  get(k: string) {
    try {
      return sessionStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      sessionStorage.setItem(k, v);
    } catch {
      /* sin almacenamiento */
    }
  },
};

export function montar({ ir }: Opciones): () => void {
  let desmontado = false;
  const limpiar: Array<() => void> = [];
  const on = (t: EventTarget, tipo: string, fn: EventListener, opts?: AddEventListenerOptions | boolean) => {
    t.addEventListener(tipo, fn, opts);
    limpiar.push(() => t.removeEventListener(tipo, fn, opts));
  };
  const ticker = (fn: gsap.TickerCallback) => {
    gsap.ticker.add(fn);
    limpiar.push(() => gsap.ticker.remove(fn));
  };
  const despues = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    limpiar.push(() => window.clearTimeout(id));
  };
  const observar = (io: IntersectionObserver) => {
    limpiar.push(() => io.disconnect());
    return io;
  };

  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = window.matchMedia('(pointer: fine)').matches;
  try {
    ScrollTrigger.clearScrollMemory('manual');
  } catch {
    /* nada */
  }

  /* Scroll suave */
  let lenis: Lenis | null = null;
  if (!RM) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    ticker((t) => lenis?.raf(t * 1000));
    (window as Window & { lenisRef?: Lenis }).lenisRef = lenis;
  }
  const scrollY = () => (lenis ? lenis.scroll : window.scrollY);

  /* Cada página abre siempre desde arriba (o en su ancla, si la trae). */
  const toTop = () => {
    if (location.hash) return;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  toTop();
  if (location.hash) {
    const ancla = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (ancla) requestAnimationFrame(() => (lenis ? lenis.scrollTo(ancla, { offset: -110, immediate: true, force: true }) : ancla.scrollIntoView()));
  }

  const ctx = gsap.context(() => {
    /* Cabecera */
    const header = document.querySelector<HTMLElement>('.site-header');
    let lastY = 0;
    let heroST: ScrollTrigger | null = null;
    const onScroll = () => {
      const y = scrollY();
      if (!header) return;
      header.classList.toggle('is-solid', y > 80);
      const menuOpen = document.querySelector('.menu.open');
      const inHero = heroST && y <= heroST.end + 10; /* en escritorio y tablet, la cabecera no se esconde durante el hero */
      if (!menuOpen) header.classList.toggle('is-hidden', !inHero && y > lastY && y > 260);
      lastY = y;
    };
    header?.classList.remove('is-hidden', 'is-solid');
    if (lenis) {
      lenis.on('scroll', onScroll);
    } else on(window, 'scroll', onScroll, { passive: true });

    /* Menú (persiste entre páginas: se cierra al cambiar de ruta) */
    const menu = document.querySelector<HTMLElement>('.menu');
    const botonesMenu = Array.from(document.querySelectorAll<HTMLElement>('[data-menu]'));
    if (menu) {
      menu.classList.remove('open');
      botonesMenu.forEach((x) => x.setAttribute('aria-expanded', 'false'));
    }
    botonesMenu.forEach((b) => {
      on(b, 'click', () => {
        if (!menu) return;
        const open = !menu.classList.contains('open');
        menu.classList.toggle('open', open);
        botonesMenu.forEach((x) => x.setAttribute('aria-expanded', String(open)));
        if (open) {
          header?.classList.remove('is-hidden');
          lenis?.stop();
          const f = menu.querySelector<HTMLElement>('nav a');
          if (f) despues(() => f.focus(), 300);
        } else lenis?.start();
      });
    });
    on(document, 'keydown', ((e: KeyboardEvent) => {
      if (e.key === 'Escape' && menu && menu.classList.contains('open')) menu.querySelector<HTMLElement>('[data-menu]')?.click();
    }) as EventListener);

    /* Cursor */
    const cursor = document.querySelector<HTMLElement>('.cursor');
    if (cursor && FINE) {
      cursor.classList.add('on');
      const label = cursor.querySelector('span');
      const qx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
      const qy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
      on(window, 'pointermove', ((e: PointerEvent) => {
        qx(e.clientX);
        qy(e.clientY);
      }) as EventListener);
      on(document, 'pointerover', ((e: PointerEvent) => {
        const t = (e.target as Element | null)?.closest?.('[data-cursor]');
        if (t && label) {
          label.textContent = t.getAttribute('data-cursor');
          cursor.classList.add('has-label');
        } else cursor.classList.remove('has-label');
      }) as EventListener);
      limpiar.push(() => cursor.classList.remove('has-label'));
    }

    /* Transición entre páginas: velo verde (el prototipo cambiaba de página; aquí, el router). */
    const veil = document.querySelector<HTMLElement>('.veil');
    if (veil) {
      if (store.get('veil') === '1' && !RM) {
        gsap.set(veil, { opacity: 1 });
        gsap.to(veil, { opacity: 0, duration: 0.35, delay: 0.05, ease: 'power2.out' });
      } else gsap.set(veil, { opacity: 0 });
      store.set('veil', '0');
    }
    on(document, 'click', ((e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a');
      if (!a || !a.getAttribute('href') || a.hasAttribute('download')) return;
      if (a.target && a.target !== '_self') return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname.startsWith('/api') || url.pathname.startsWith('/_next')) return;
      if (url.pathname === location.pathname && url.hash) return; /* ancla en la misma página */
      if (url.pathname.startsWith('/alivio')) return; /* otra zona de Vercel: carga completa */
      e.preventDefault();
      const destino = url.pathname + url.search + url.hash;
      if (veil && !RM && a.hasAttribute('data-transition')) {
        store.set('veil', '1');
        gsap.to(veil, { opacity: 1, duration: 0.25, ease: 'power2.in', onComplete: () => ir(destino) });
      } else ir(destino);
    }) as EventListener);

    /* Hero: lema que gira */
    const domeText = document.querySelector<HTMLElement>('.dome-text');
    if (domeText && !RM) {
      let ang = 0;
      ticker((_time, dt) => {
        const v = lenis ? Math.min(6, Math.abs(lenis.velocity) * 0.08) : 0;
        ang -= (dt / 1000) * 6 * (1 + v);
        domeText.style.transform = 'rotate(' + ang + 'deg)';
      });
    }

    /* Hero: objetos en arco */
    const hero = document.querySelector<HTMLElement>('.hero');
    const orbit = document.querySelector<HTMLElement>('.orbit');
    if (hero && orbit) {
      const objs = Array.from(orbit.querySelectorAll<HTMLElement>('.obj'));
      const wrap = hero.querySelector<HTMLElement>('.dome-wrap');
      let p = 0;
      const n = objs.length;
      let current = -1;
      const cap = hero.querySelector<HTMLElement>('.orbit-cap');
      const word = hero.querySelector<HTMLElement>('.orbit-word');
      const wordS = word?.querySelector<HTMLElement>('span') ?? null;
      const tag = hero.querySelector<HTMLElement>('.orbit-tag');
      const tagD = tag?.querySelector<HTMLElement>('.ot-d') ?? null;
      const fitWord = () => {
        if (!wordS) return;
        const W = hero.clientWidth;
        wordS.style.fontSize = Math.min(W * 0.2, 300) + 'px';
        const w = wordS.offsetWidth;
        if (w > W * 0.94) wordS.style.fontSize = (parseFloat(wordS.style.fontSize) * W * 0.94) / w + 'px';
      };
      const setCap = (i: number) => {
        if (i === current) return;
        current = i;
        const o = objs[i];
        if (cap) cap.textContent = o.getAttribute('data-title') + ': ' + o.getAttribute('data-desc');
        if (tag && tagD) {
          tagD.textContent = o.getAttribute('data-desc');
          tag.setAttribute('href', o.getAttribute('href') || '#');
          tag.setAttribute('data-cursor', o.getAttribute('data-cursor') || '');
        }
        if (!wordS) return;
        const swap = () => {
          wordS.textContent = o.getAttribute('data-word');
          fitWord();
        };
        if (RM) {
          swap();
          return;
        }
        gsap.to(wordS, {
          opacity: 0,
          yPercent: 8,
          duration: 0.18,
          overwrite: true,
          onComplete: () => {
            swap();
            gsap.fromTo(wordS, { opacity: 0, yPercent: -8 }, { opacity: 1, yPercent: 0, duration: 0.4, ease: 'power3.out' });
          },
        });
      };
      const mm = gsap.matchMedia();
      limpiar.push(() => mm.revert());
      mm.add('(min-width: 700px)', () => {
        if (!wrap) return;
        orbit.classList.add('is-live');
        const render = () => {
          const W = hero.clientWidth,
            H = hero.clientHeight;
          hero.style.setProperty('--D', Math.min(W * (W < 1100 ? 1.18 : 0.86), W < 1100 ? 1100 : 1280, H * 1.3) + 'px');
          const D = wrap.offsetWidth,
            r = D / 2,
            top = wrap.offsetTop;
          const cx = W / 2,
            cy = top + r;
          const spacing = W < 1100 ? 30 : 26;
          const base = Math.min(Math.max(150, W * (W < 1100 ? 0.25 : 0.19)), 300, (top - 112) / 1.04);
          const c = p * (n - 1),
            ci = Math.round(c) % n;
          let g: { x: number; y: number; S: number } | null = null;
          objs.forEach((o, i) => {
            let d = i - c;
            d = ((((d + n / 2) % n) + n) % n) - n / 2; /* carrusel circular: siempre hay objetos a ambos lados */
            const a = d * spacing;
            const k = Math.min(1, Math.abs(a) / 75);
            const S = base * (1 - 0.42 * k);
            const R = r + S * 0.52;
            const rad = (a * Math.PI) / 180;
            const x = cx + R * Math.sin(rad) - S / 2;
            const y = cy - R * Math.cos(rad) - S / 2;
            const op = Math.abs(a) > 66 ? Math.max(0, 1 - (Math.abs(a) - 66) / 14) : 1;
            o.style.width = S + 'px';
            o.style.height = S + 'px';
            o.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + a * 0.45 + 'deg)';
            o.style.filter = k > 0.12 ? 'blur(' + (k * 3.5).toFixed(2) + 'px)' : 'none';
            o.style.opacity = String(op);
            o.style.zIndex = String(100 - Math.round(Math.abs(a)));
            o.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
            o.tabIndex = op > 0.5 ? 0 : -1;
            if (i === ci) g = { x, y, S };
          });
          setCap(ci);
          const gg = g as { x: number; y: number; S: number } | null;
          if (gg && word) word.style.top = gg.y + gg.S * 0.1 + 'px';
          if (gg && tag) {
            const tw = tag.offsetWidth,
              th = tag.offsetHeight;
            let tx = gg.x + gg.S * 0.92,
              ty = gg.y + gg.S * 0.5 - th / 2;
            if (tx + tw > W - 24) tx = gg.x + gg.S * 0.08 - tw;
            if (tx < 16) {
              tx = gg.x + gg.S / 2 - tw / 2;
              ty = gg.y + gg.S * 0.96;
            }
            tag.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
            const op = Math.max(0, 1 - Math.abs(c - Math.round(c)) * 5);
            tag.style.opacity = String(op);
            tag.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
          }
        };
        fitWord();
        render();
        if (!RM) {
          heroST = ScrollTrigger.create({
            trigger: hero,
            start: 'top top',
            end: '+=' + (n - 1) * 40 + '%',
            pin: true,
            scrub: 0.6,
            snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' },
            onUpdate: (self) => {
              p = self.progress;
              render();
            },
          });
        }
        const onResize = () => {
          fitWord();
          render();
        };
        window.addEventListener('resize', onResize);
        return () => {
          heroST = null;
          window.removeEventListener('resize', onResize);
          tag?.removeAttribute('style');
          word?.removeAttribute('style');
          hero.style.removeProperty('--D');
          orbit.classList.remove('is-live');
          objs.forEach((o) => o.removeAttribute('style'));
        };
      });
      mm.add('(max-width: 699px)', () => {
        orbit.classList.add('is-strip');
        const nearest = () => {
          const mid = orbit.scrollLeft + orbit.clientWidth / 2;
          let best = 0,
            bd = 1e9;
          objs.forEach((o, i) => {
            const dd = Math.abs(o.offsetLeft + o.offsetWidth / 2 - mid);
            if (dd < bd) {
              bd = dd;
              best = i;
            }
          });
          setCap(best);
          if (word) word.style.top = orbit.offsetTop + 6 + 'px';
          if (tag) {
            const tw = tag.offsetWidth;
            tag.style.transform = 'translate(' + (hero.clientWidth / 2 - tw / 2) + 'px,' + (orbit.offsetTop + orbit.offsetHeight - tag.offsetHeight - 2) + 'px)';
            tag.style.opacity = '1';
            tag.style.pointerEvents = 'auto';
          }
        };
        fitWord();
        const start = () => {
          orbit.scrollLeft = objs[0].offsetLeft - (orbit.clientWidth - objs[0].offsetWidth) / 2;
          nearest();
        };
        const raf = requestAnimationFrame(start);
        window.addEventListener('load', start);
        orbit.addEventListener('scroll', nearest, { passive: true });
        /* Guía de arrastre en la tira del hero (celular) */
        let hc: HTMLElement | null = null;
        let htl: gsap.core.Timeline | null = null;
        let hDone = false;
        const killHc = () => {
          hDone = true;
          htl?.kill();
          if (hc)
            gsap.to(hc, {
              opacity: 0,
              scale: 0.6,
              duration: 0.25,
              onComplete: () => {
                hc?.remove();
                hc = null;
              },
            });
        };
        orbit.addEventListener('pointerdown', killHc);
        orbit.addEventListener('touchstart', killHc, { passive: true });
        let coachT = 0;
        if (!RM)
          coachT = window.setTimeout(() => {
            /* En el prototipo la condición incluía "scrollY > 40" comparando la función: nunca era cierta. */
            if (hDone) return;
            hc = document.createElement('span');
            hc.className = 'drag-coach';
            hc.setAttribute('aria-hidden', 'true');
            hc.innerHTML = HAND + '<i></i>';
            hero.appendChild(hc);
            const step = objs[1].offsetLeft - objs[0].offsetLeft;
            const x0 = hero.clientWidth * 0.66,
              y0 = orbit.offsetTop + orbit.offsetHeight * 0.5;
            gsap.set(hc, { x: x0, y: y0, scale: 0.6, zIndex: 30 });
            const dot = hc.querySelector('i');
            htl = gsap.timeline({ onComplete: killHc });
            for (let r = 0; r < 2; r++) {
              htl
                .set(hc, { x: x0 })
                .to(hc, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
                .to(hc, { scale: 0.86, duration: 0.18 })
                .to(dot, { opacity: 1, duration: 0.1 }, '<')
                .to(hc, {
                  x: x0 - hero.clientWidth * 0.36,
                  duration: 0.9,
                  ease: 'power2.inOut',
                  onStart: () => {
                    if (!hDone) orbit.scrollTo({ left: orbit.scrollLeft + step, behavior: 'smooth' });
                  },
                })
                .to(hc, { scale: 1, duration: 0.18 })
                .to(dot, { opacity: 0, duration: 0.15 }, '<')
                .to(
                  hc,
                  {
                    opacity: 0,
                    duration: 0.3,
                    onStart: () => {
                      if (!hDone) orbit.scrollTo({ left: orbit.scrollLeft - step, behavior: 'smooth' });
                    },
                  },
                  '+=0.35'
                );
            }
          }, 1400);
        return () => {
          cancelAnimationFrame(raf);
          window.clearTimeout(coachT);
          htl?.kill();
          hc?.remove();
          window.removeEventListener('load', start);
          orbit.classList.remove('is-strip');
          orbit.removeEventListener('scroll', nearest);
          orbit.removeEventListener('pointerdown', killHc);
          orbit.removeEventListener('touchstart', killHc);
        };
      });
    }

    /* Objeto que cae entre las líneas */
    const fallBetween = (section: Element, scrub: boolean) => {
      const title = section.querySelector<HTMLElement>('.display');
      const obj = section.querySelector<HTMLElement>('.foco-obj');
      if (!title || !obj || RM) return;
      const mid = () => {
        const t = title.getBoundingClientRect();
        return t.top + t.height * 0.5 - (obj.getBoundingClientRect().top + obj.offsetHeight * 0.5);
      };
      const tl = gsap.timeline(scrub ? { scrollTrigger: { trigger: title, start: 'top 75%', end: 'bottom 25%', scrub: 0.8 } } : { delay: 0.25 });
      tl.fromTo(obj, { y: mid, rotation: -34, scale: 1.1, opacity: 0 }, { y: mid, rotation: -24, scale: 1.06, opacity: 1, ease: 'none', duration: 0.25 }).to(obj, {
        y: 0,
        rotation: -8,
        scale: 1,
        ease: scrub ? 'none' : 'power3.out',
        duration: 0.75,
      });
      if (!scrub) tl.duration(1.3);
    };
    document.querySelectorAll('[data-fall="scroll"]').forEach((s) => fallBetween(s, true));
    document.querySelectorAll('[data-fall="load"]').forEach((s) => fallBetween(s, false));

    /* Apariciones suaves */
    if (!RM) {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
      document.querySelectorAll('.gel[data-drop]').forEach((el) => {
        gsap.from(el, { y: -40, scale: 0.4, duration: 0.7, ease: 'back.out(3)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });
    }

    /* Formulario de cotización: validación en vivo y envío al sistema de leads. */
    conectarFormularios(on, (done) => {
      if (!RM) gsap.from(done, { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' });
    });

    /* Herramientas (js/tools.js): calculadora, identificador de plagas y lista. */
    montarHerramientas(on);

    /* Índice de la guía: marca la sección que se está leyendo */
    document.querySelectorAll('.guia').forEach((g) => {
      const links = Array.from(g.querySelectorAll<HTMLAnchorElement>('.guia-index a'));
      if (!links.length || !('IntersectionObserver' in window)) return;
      links.forEach((a) => {
        on(a, 'click', (e) => {
          const t = document.getElementById((a.getAttribute('href') || '').slice(1));
          if (!t) return;
          e.preventDefault();
          if (lenis) lenis.scrollTo(t, { offset: -110 });
          else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
        });
      });
      const io = observar(
        new IntersectionObserver(
          (en) => {
            en.forEach((x) => {
              if (!x.isIntersecting) return;
              links.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + x.target.id));
            });
          },
          { rootMargin: '-20% 0px -70% 0px' }
        )
      );
      links.forEach((a) => {
        const t = document.getElementById((a.getAttribute('href') || '').slice(1));
        if (t) io.observe(t);
      });
    });

    /* Carruseles arrastrables: se mueven agarrando y soltando, con inercia */
    const medidas: Array<() => void> = [];
    document.querySelectorAll<HTMLElement>('.track, .cards').forEach((box) => {
      if (box.querySelector(':scope > .rail')) return; /* ya montado */
      const rail = document.createElement('div');
      rail.className = 'rail';
      while (box.firstChild) rail.appendChild(box.firstChild);
      box.appendChild(rail);
      const items = Array.from(rail.children).filter((nd) => nd.nodeType === 1) as HTMLElement[];
      if (!items.length) return;
      rail.querySelectorAll('a, img').forEach((nd) => nd.setAttribute('draggable', 'false'));
      const centered = box.classList.contains('track');
      const count = box.id ? document.querySelector<HTMLElement>('[data-count="' + box.id + '"]') : null;

      const ui = document.createElement('div');
      ui.className = 'drag-ui';
      ui.setAttribute('aria-hidden', 'true');
      ui.innerHTML = '<span class="du-dot"></span><span class="du-bar"><i></i></span><span class="du-hint"><span class="du-arr"><b></b><b></b><b></b></span><span class="du-t">Arrastre</span></span>';
      box.parentNode?.insertBefore(ui, box.nextSibling);
      const bar = ui.querySelector<HTMLElement>('.du-bar i') as HTMLElement;

      let x = 0,
        tx = 0,
        min = 0,
        snaps = [0];
      let down = false,
        moved = false,
        sx = 0,
        startX = 0,
        lastX = 0,
        lastT = 0,
        vel = 0,
        idx = -1;

      const clamp = (v: number) => Math.max(min, Math.min(0, v));
      const measure = () => {
        const cs = getComputedStyle(box);
        const vis = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        min = Math.min(0, vis - rail.scrollWidth);
        snaps = items
          .map((it) => {
            const s = centered ? -(it.offsetLeft + it.offsetWidth / 2 - (rail.firstElementChild as HTMLElement).offsetWidth / 2) : -it.offsetLeft;
            return Math.max(min, Math.min(0, s));
          })
          .filter((v, i, arr) => i === 0 || Math.abs(v - arr[i - 1]) > 1);
        if (snaps[snaps.length - 1] > min + 1) snaps.push(min);
        tx = clamp(tx);
        x = tx;
      };
      const nearest = (v: number) => {
        let best = snaps[0];
        snaps.forEach((s) => {
          if (Math.abs(s - v) < Math.abs(best - v)) best = s;
        });
        return best;
      };
      const rubber = (v: number) => {
        if (v > 0) return v * 0.3;
        if (v < min) return min + (v - min) * 0.3;
        return v;
      };
      const paint = () => {
        rail.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        const prog = min < 0 ? x / min : 1;
        bar.style.transform = 'scaleX(' + Math.max(0.06, Math.min(1, prog)).toFixed(3) + ')';
        ui.classList.toggle('to-left', prog > 0.97);
        let i = 0,
          bd = 1e9;
        snaps.forEach((s, k) => {
          const d = Math.abs(s - x);
          if (d < bd) {
            bd = d;
            i = k;
          }
        });
        if (count && i !== idx) {
          idx = i;
          count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(snaps.length).padStart(2, '0');
        }
      };
      ticker(() => {
        if (down) {
          x = tx;
        } else {
          const d = tx - x;
          x = Math.abs(d) < 0.05 ? tx : x + d * (RM ? 1 : 0.12);
        }
        paint();
      });

      on(box, 'pointerdown', ((e: PointerEvent) => {
        if (e.button !== undefined && e.button !== 0) return;
        down = true;
        moved = false;
        sx = e.clientX;
        startX = x;
        lastX = e.clientX;
        lastT = performance.now();
        vel = 0;
      }) as EventListener);
      on(window, 'pointermove', ((e: PointerEvent) => {
        if (!down) return;
        const dx = e.clientX - sx;
        if (!moved && Math.abs(dx) > 6) {
          moved = true;
          box.classList.add('is-dragging');
          try {
            box.setPointerCapture(e.pointerId);
          } catch {
            /* nada */
          }
        }
        if (!moved) return;
        const now = performance.now(),
          dt = Math.max(1, now - lastT);
        vel = vel * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
        lastX = e.clientX;
        lastT = now;
        tx = rubber(startX + dx);
      }) as EventListener);
      const release = () => {
        if (!down) return;
        down = false;
        box.classList.remove('is-dragging');
        if (!moved) return;
        const proj = clamp(x + vel * 260);
        tx = nearest(proj);
        if (tx === nearest(startX) && Math.abs(vel) > 0.25) {
          const k = snaps.indexOf(tx) + (vel < 0 ? 1 : -1);
          if (snaps[k] !== undefined) tx = snaps[k];
        }
      };
      on(window, 'pointerup', release);
      on(window, 'pointercancel', release);
      on(
        box,
        'click',
        (e) => {
          if (moved) {
            e.preventDefault();
            e.stopPropagation();
            moved = false;
          }
        },
        true
      );
      on(box, 'dragstart', (e) => e.preventDefault());
      on(box, 'keydown', ((e: KeyboardEvent) => {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        const k = snaps.indexOf(nearest(tx)) + (e.key === 'ArrowRight' ? 1 : -1);
        if (snaps[k] !== undefined) tx = snaps[k];
      }) as EventListener);

      measure();
      paint();
      on(window, 'resize', measure);
      medidas.push(measure);

      /* Al entrar en pantalla: una mano agarra el carrusel y lo desliza, para que se entienda que se arrastra */
      let coach: HTMLElement | null = null;
      let coachTl: gsap.core.Timeline | null = null;
      let touched = false;
      const stopCoach = () => {
        touched = true;
        coachTl?.kill();
        if (coach) {
          const c = coach;
          gsap.to(c, { opacity: 0, scale: 0.6, duration: 0.25, onComplete: () => c.remove() });
        }
      };
      on(box, 'pointerdown', stopCoach);
      on(box, 'keydown', stopCoach);
      limpiar.push(() => coachTl?.kill());
      if (min < 0 && 'IntersectionObserver' in window) {
        const io = observar(
          new IntersectionObserver(
            (en) => {
              if (!en[0].isIntersecting || touched) return;
              io.disconnect();
              coach = document.createElement('span');
              coach.className = 'drag-coach';
              coach.setAttribute('aria-hidden', 'true');
              coach.innerHTML = HAND + '<i></i>';
              box.appendChild(coach);
              const bw = box.clientWidth,
                cy = box.clientHeight * (centered ? 0.42 : 0.4);
              const x0 = bw * 0.68,
                dist = Math.min(220, bw * 0.34);
              const pull = Math.min(dist * 0.9, -min);
              if (RM) {
                coach.style.transform = 'translate(' + x0 + 'px,' + cy + 'px)';
                coach.style.opacity = '1';
                despues(() => {
                  if (!touched) stopCoach();
                }, 2600);
                return;
              }
              gsap.set(coach, { x: x0, y: cy, scale: 0.6 });
              const dot = coach.querySelector('i');
              coachTl = gsap.timeline({
                delay: 0.35,
                onComplete: () => {
                  if (!touched) stopCoach();
                  touched = false;
                },
              });
              for (let r = 0; r < 2; r++) {
                coachTl
                  .set(coach, { x: x0 })
                  .to(coach, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
                  .to(coach, { scale: 0.86, duration: 0.18, ease: 'power2.out' })
                  .to(dot, { opacity: 1, duration: 0.1 }, '<')
                  .to(coach, {
                    x: x0 - dist,
                    duration: 0.9,
                    ease: 'power2.inOut',
                    onStart: () => {
                      if (!down) tx = -pull;
                    },
                  })
                  .to(coach, { scale: 1, duration: 0.18 })
                  .to(dot, { opacity: 0, duration: 0.15 }, '<')
                  .to(
                    coach,
                    {
                      opacity: 0,
                      duration: 0.3,
                      onStart: () => {
                        if (!down && !touched) tx = 0;
                      },
                    },
                    '+=0.15'
                  );
              }
            },
            { threshold: 0.55 }
          )
        );
        io.observe(box);
      }
    });

    /* Bloque hogar: Los Colados se van por el arco */
    const stage = document.querySelector<HTMLElement>('.hogar-stage');
    if (stage) {
      stage.classList.add('is-live');
      const colados = Array.from(stage.querySelectorAll<HTMLElement>('.colado'));
      const starts = [0.16, 0.33, 0.5, 0.66, 0.8];
      let q = 0,
        idle = 0,
        clock = 0,
        onScreen = false;
      const P = [
        [0.02, 1.0],
        [0.36, 0.98],
        [0.66, 0.62],
        [1.04, -0.04],
      ];
      const bez = (t: number) => {
        const u = 1 - t;
        return [
          u * u * u * P[0][0] + 3 * u * u * t * P[1][0] + 3 * u * t * t * P[2][0] + t * t * t * P[3][0],
          u * u * u * P[0][1] + 3 * u * u * t * P[1][1] + 3 * u * t * t * P[2][1] + t * t * t * P[3][1],
        ];
      };
      const dots: HTMLElement[] = [];
      if (!stage.querySelector('.dot'))
        for (let i = 0; i <= 64; i++) {
          const d = document.createElement('span');
          d.className = 'dot';
          d.setAttribute('aria-hidden', 'true');
          stage.insertBefore(d, stage.firstChild);
          dots.push(d);
        }
      const place = () => {
        const W = stage.clientWidth,
          H = stage.clientHeight;
        dots.forEach((d, j) => {
          const pt = bez(j / 64);
          d.style.left = pt[0] * W + 'px';
          d.style.top = pt[1] * H + 'px';
        });
        colados.forEach((c, j) => {
          const t = (starts[j] + q * 0.42 + idle) % 1.08;
          const img = c.querySelector('img') as HTMLImageElement;
          const pt = bez(Math.min(t, 1));
          const h = Math.max(64, H * (0.44 - 0.28 * Math.min(t, 1)) * (W < 700 ? 0.78 : 1));
          const ratio = (img.naturalWidth || 340) / (img.naturalHeight || 500);
          const hop = RM ? 0 : Math.abs(Math.sin(clock * 5.2 + j * 1.7)) * h * 0.05;
          const sway = RM ? 0 : Math.sin(clock * 5.2 + j * 1.7) * 3;
          c.style.height = h + 'px';
          c.style.opacity = String(t < 0.05 ? t / 0.05 : t > 0.94 ? Math.max(0, (1.04 - t) / 0.1) : 1);
          c.style.transform = 'translate(' + (pt[0] * W - (h * ratio) / 2) + 'px,' + (pt[1] * H - h - hop) + 'px) rotate(' + (6 + t * 12 + sway) + 'deg)';
        });
      };
      colados.forEach((c) => {
        const im = c.querySelector('img');
        if (im && !im.complete) on(im, 'load', place);
      });
      place();
      on(window, 'resize', place);
      if (!RM)
        ScrollTrigger.create({
          trigger: stage,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
          onUpdate: (s) => {
            q = s.progress;
            place();
          },
        });
      if (!RM) {
        observar(
          new IntersectionObserver(
            (en) => {
              onScreen = en[0].isIntersecting;
            },
            { threshold: 0.05 }
          )
        ).observe(stage);
        ticker((time, dt) => {
          if (!onScreen) return;
          clock = time;
          idle += (dt / 1000) * 0.03;
          place();
        });
      }
    }

    /* Tarjetas que se inclinan */
    if (FINE && !RM) {
      document.querySelectorAll<HTMLElement>('.card').forEach((card) => {
        on(card, 'pointermove', ((e: PointerEvent) => {
          if (card.closest('.is-dragging')) {
            card.style.transform = '';
            return;
          }
          const r = card.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5,
            y = (e.clientY - r.top) / r.height - 0.5;
          card.style.transform = 'rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg) translateY(-6px)';
        }) as EventListener);
        on(card, 'pointerleave', () => {
          card.style.transform = '';
        });
      });
    }

    /* Imagen que se abre con el scroll */
    if (!RM) {
      document.querySelectorAll('[data-expand]').forEach((f) => {
        gsap.fromTo(
          f,
          { clipPath: 'inset(0% 7% 0% 7% round 24px)' },
          { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'center 55%', scrub: 0.6 } }
        );
      });
    }

    /* Barra de lectura en artículos */
    const article = document.querySelector<HTMLElement>('.article');
    const prog = document.querySelector<HTMLElement>('.progress');
    if (prog) prog.style.transform = '';
    document.body.classList.remove('is-article');
    if (article && prog) {
      document.body.classList.add('is-article');
      const upd = () => {
        const r = article.getBoundingClientRect();
        const pr = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.4)));
        prog.style.transform = 'scaleX(' + pr + ')';
      };
      if (lenis) lenis.on('scroll', upd);
      else on(window, 'scroll', upd, { passive: true });
      upd();
      limpiar.push(() => document.body.classList.remove('is-article'));
    }

    /* Enlaces simulados del prototipo */
    document.querySelectorAll('a[href="#"]').forEach((a) => on(a, 'click', (e) => e.preventDefault()));

    /* Lo que el prototipo hacía en window.load: medir de nuevo cuando ya hay fuentes e imágenes. */
    const remedir = () => {
      medidas.forEach((m) => m());
      ScrollTrigger.refresh();
    };
    requestAnimationFrame(remedir);
    if (document.readyState !== 'complete') on(window, 'load', remedir);
    document.fonts?.ready.then(() => {
      if (!desmontado) remedir();
    });
    const pendientes = Array.from(document.querySelectorAll<HTMLImageElement>('main img')).filter((im) => !im.complete);
    pendientes.forEach((im) => on(im, 'load', () => ScrollTrigger.refresh(), { once: true }));
  });

  /* Ajusta titulares: ninguna palabra se sale de su caja */
  // Misma regla que site.js (si la palabra más ancha no cabe, tamaño = base × cabida × 0,98), medida
  // de otra forma. site.js limpia el tamaño, lee el tamaño base y mide en un lienzo. En la red, el
  // lienzo podía medir con la fuente de respaldo, y la lectura justo después de limpiar a veces
  // devolvía el tamaño anterior: el titular quedaba sin ajustar (Bucaramanga a 187 px en vez de 173).
  // Aquí una copia oculta del titular, sin estilo en línea y en el mismo padre, da el tamaño base de
  // la hoja de estilos y mide cada palabra con la fuente que se está pintando. No depende del estado
  // previo del titular.
  const fitTitles = () => {
    document.querySelectorAll<HTMLElement>('.display, h1:not(.sr)').forEach((el) => {
      const cs = getComputedStyle(el);
      const padre = el.parentElement;
      if (!padre || el.clientWidth < 60 || cs.display === 'inline') {
        el.style.fontSize = '';
        return;
      }
      const palabras: string[] = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const nd = walker.currentNode,
          pe = nd.parentElement as HTMLElement;
        if (getComputedStyle(pe).fontSize !== cs.fontSize) continue;
        (nd.textContent || '').split(/\s+/).forEach((w) => w && palabras.push(w));
      }
      const copia = el.cloneNode(false) as HTMLElement;
      copia.removeAttribute('id');
      copia.removeAttribute('style');
      copia.setAttribute('aria-hidden', 'true');
      copia.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;left:0;top:0;width:auto;max-width:none;margin:0;padding:0';
      padre.appendChild(copia);
      const base = parseFloat(getComputedStyle(copia).fontSize);
      let ancho = 0;
      palabras.forEach((w) => {
        copia.textContent = w;
        ancho = Math.max(ancho, copia.getBoundingClientRect().width);
      });
      copia.remove();
      const avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ratio = ancho ? avail / ancho : 1;
      el.style.fontSize = ratio < 0.97 ? Math.floor(base * ratio * 0.98) + 'px' : '';
      const dbg = (window as unknown as { __fitLog?: string[] }).__fitLog;
      if (dbg && el.tagName === 'H1') dbg.push(`${Math.round(performance.now())} base=${base} avail=${avail} ancho=${ancho.toFixed(1)} sale=${el.style.fontSize}`);
    });
  };
  fitTitles();
  // Medir otra vez cuando las fuentes ya se pintan. Al dispararse load o loadingdone, la fuente puede
  // figurar como cargada pero el navegador sigue pintando la de respaldo: medir en ese instante hace
  // creer que el titular cabe. Por eso se mide de inmediato, tras dos cuadros y al rato.
  const timers: number[] = [];
  const fitLuego = () => {
    if (desmontado) return;
    fitTitles();
    requestAnimationFrame(() => requestAnimationFrame(() => !desmontado && fitTitles()));
    timers.push(window.setTimeout(() => !desmontado && fitTitles(), 500));
  };
  document.fonts?.ready.then(fitLuego);
  if (document.readyState !== 'complete') on(window, 'load', fitLuego);
  if (document.fonts) on(document.fonts, 'loadingdone', fitLuego);
  limpiar.push(() => timers.forEach((t) => window.clearTimeout(t)));
  let fitT = 0;
  on(window, 'resize', () => {
    window.clearTimeout(fitT);
    fitT = window.setTimeout(fitTitles, 150);
  });
  limpiar.push(() => window.clearTimeout(fitT));

  return () => {
    desmontado = true;
    limpiar.reverse().forEach((f) => {
      try {
        f();
      } catch {
        /* seguir limpiando */
      }
    });
    ctx.revert();
    lenis?.destroy();
    if ((window as Window & { lenisRef?: Lenis | null }).lenisRef === lenis) (window as Window & { lenisRef?: Lenis | null }).lenisRef = null;
  };
}
