// Herramientas del sitio: js/tools.js del prototipo aprobado (_rediseno/site/js/tools.js), pasado
// a TypeScript sin cambiar su comportamiento. Solo cambian las rutas (las de producción) y la forma
// de registrar listeners (se limpian al cambiar de página). Terminan en WhatsApp, como el prototipo.

type Registrar = (t: EventTarget, tipo: string, fn: EventListener, opts?: AddEventListenerOptions | boolean) => void;

const SERVICIO = (slug: string) => `/servicios/${slug}`;

export function montarHerramientas(on: Registrar) {
  /* Calculadora de frecuencia */
  const calc = document.getElementById('calc');
  if (calc) {
    const sets = Array.from(calc.querySelectorAll<HTMLFieldSetElement>('fieldset'));
    let ans: Record<string, string> = {};
    let i = 0;
    const step = document.getElementById('calc-step') as HTMLElement;
    const bar = document.getElementById('calc-bar') as HTMLElement;
    const back = document.getElementById('calc-back') as HTMLElement;
    const result = document.getElementById('calc-result') as HTMLElement;
    const show = (k: number) => {
      sets.forEach((f, j) => (f.hidden = j !== k));
      result.hidden = k < sets.length;
      step.textContent = k < sets.length ? 'Pregunta ' + (k + 1) + ' de ' + sets.length : 'Resultado';
      bar.style.width = Math.min(100, ((k + 1) / sets.length) * 100) + '%';
      back.hidden = k === 0 || k >= sets.length;
      const first = k < sets.length ? sets[k].querySelector('button') : result;
      if (first && k > 0) first.focus({ preventScroll: true });
    };
    const base: Record<string, [number, number]> = { casa: [3, 6], conjunto: [2, 3], oficina: [3, 3], institucion: [2, 3], restaurante: [1, 3], bodega: [1, 2] };
    const srv: Record<string, string> = {
      casa: SERVICIO('fumigacion-residencial'),
      conjunto: SERVICIO('control-plagas-comercial'),
      oficina: SERVICIO('control-plagas-comercial'),
      institucion: SERVICIO('control-plagas-comercial'),
      restaurante: SERVICIO('fumigacion-restaurantes'),
      bodega: SERVICIO('fumigacion-industrial'),
    };
    const finish = () => {
      const r = base[ans.tipo].slice() as [number, number];
      const why: string[] = [];
      let tighten = 0;
      if (ans.entorno === 'agua' || ans.entorno === 'mercado') {
        tighten++;
        why.push(ans.entorno === 'agua' ? 'hay agua cerca, que favorece zancudos y cucarachas' : 'el comercio denso aumenta la presión de roedores y cucarachas');
      }
      if (ans.historial === 'frecuente') {
        tighten += 2;
        why.push('ya hay plaga activa');
      } else if (ans.historial === 'ocasional') {
        tighten++;
        why.push('ha visto plagas de vez en cuando');
      }
      if (ans.construccion === 'antigua') {
        tighten++;
        why.push('las grietas y la tubería expuesta les dan refugio');
      }
      for (let t = 0; t < tighten; t++) {
        r[1] = Math.max(r[0], r[1] - 1);
        if (r[1] === r[0]) r[0] = Math.max(1, r[0] - 1);
      }
      const txt = r[0] === r[1] ? 'Cada ' + r[0] + (r[0] === 1 ? ' mes' : ' meses') : 'Cada ' + r[0] + ' a ' + r[1] + ' meses';
      (document.getElementById('calc-freq') as HTMLElement).textContent = txt;
      const extra = ans.ultima === 'nunca' ? ' Como hace más de 6 meses que no fumiga, conviene empezar con una inspección pronto.' : '';
      (document.getElementById('calc-why') as HTMLElement).textContent =
        (why.length ? 'Ajustamos la frecuencia porque ' + why.join(', ') + '.' : 'Su propiedad tiene condiciones de riesgo bajo.') +
        (ans.tipo === 'restaurante' ? ' Para negocios de alimentos, la Resolución 2674 exige un programa continuo.' : '') +
        extra;
      document.getElementById('calc-srv')?.setAttribute('href', srv[ans.tipo]);
      document
        .getElementById('calc-wa')
        ?.setAttribute('href', 'https://wa.me/573107891948?text=' + encodeURIComponent('Hola, la calculadora me recomendó fumigar ' + txt.toLowerCase() + '. Quiero cotizar.'));
    };
    sets.forEach((f, k) => {
      f.querySelectorAll('button').forEach((b) => {
        on(b, 'click', () => {
          ans[f.getAttribute('data-q') as string] = b.getAttribute('data-v') as string;
          i = k + 1;
          if (i >= sets.length) finish();
          show(i);
        });
      });
    });
    on(back, 'click', () => {
      i = Math.max(0, i - 1);
      show(i);
    });
    const reset = document.getElementById('calc-reset');
    if (reset)
      on(reset, 'click', () => {
        ans = {};
        i = 0;
        show(0);
      });
    show(0);
  }

  /* Identificador de plagas */
  const plaga = document.getElementById('plaga');
  if (plaga) {
    const info: Record<string, [string, string, string, string]> = {
      cucarachas: ['Cucarachas', 'Si las ve de día, la colonia ya es grande. Tratamos el nido con gel y cebos.', SERVICIO('fumigacion-residencial'), 'casa'],
      chinches: ['Chinches de cama', 'No use insecticida casero: dispersa la plaga a otras habitaciones. El tratamiento lleva dos visitas.', SERVICIO('control-chinches'), 'colchon'],
      comejen: ['Comején', 'El daño avanza aunque no vea insectos. Pida una inspección cuanto antes.', SERVICIO('control-comejen-termitas'), 'viga'],
      roedores: ['Ratas o ratones', 'Además del cebado, hay que sellar por dónde entran.', SERVICIO('desratizacion'), 'estacion'],
      abejas: ['Abejas o avispas', 'No se acerque ni intente retirarlo. Envíenos una foto desde lejos.', SERVICIO('eliminacion-abejas-avispas'), 'panal'],
      zancudos: ['Zancudos', 'Elimine el agua estancada. En temporada de lluvias conviene un tratamiento con larvicida.', SERVICIO('control-insectos-voladores'), 'bomba'],
    };
    const res = document.getElementById('plaga-result') as HTMLElement;
    const img = document.getElementById('plaga-img') as HTMLImageElement | null;
    // La imagen cambia según la plaga: sin srcset (lo pone el optimizador de Next al servirla).
    img?.removeAttribute('srcset');
    img?.removeAttribute('sizes');
    const upd = () => {
      const score: Record<string, number> = {};
      plaga.querySelectorAll('.sign[aria-pressed="true"]').forEach((s) => {
        const p = s.getAttribute('data-p') as string;
        score[p] = (score[p] || 0) + 1;
      });
      const best = Object.keys(score).sort((a, b) => score[b] - score[a])[0];
      res.hidden = !best;
      if (!best) return;
      const d = info[best];
      (document.getElementById('plaga-name') as HTMLElement).textContent = d[0];
      (document.getElementById('plaga-what') as HTMLElement).textContent = d[1];
      document.getElementById('plaga-srv')?.setAttribute('href', d[2]);
      img?.setAttribute('src', '/rediseno/obj-' + d[3] + '.webp');
    };
    plaga.querySelectorAll('.sign').forEach((s) => {
      on(s, 'click', () => {
        s.setAttribute('aria-pressed', s.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
        upd();
      });
    });
  }

  /* Lista antes de fumigar */
  const ck = document.getElementById('checklist');
  if (ck) {
    const boxes = ck.querySelectorAll('input');
    const cnt = document.getElementById('ck-count') as HTMLElement;
    const cb = document.getElementById('ck-bar') as HTMLElement;
    const done = document.getElementById('ck-done') as HTMLElement;
    const u = () => {
      const n = ck.querySelectorAll('input:checked').length;
      cnt.textContent = n + ' de ' + boxes.length + ' listos';
      cb.style.width = (n / boxes.length) * 100 + '%';
      done.hidden = n !== boxes.length;
    };
    boxes.forEach((b) => on(b, 'change', u));
    u();
  }
}
