// Vuelo del objeto: del selector del home al hero de su servicio (como el frasco de
// agrumeafarm.it). Una copia del objeto queda fija en pantalla, la página cambia por debajo y la
// copia viaja al sitio exacto del objeto en el hero de destino; ahí se cambia por el real.
// Vive fuera del ciclo de React: el selector se desmonta al navegar y el vuelo sigue.

const SALIDA = 320; // ms: lo demás del selector se desvanece antes de cambiar de página
const DURACION = 1100; // ms
const CURVA = 'cubic-bezier(.22,1,.36,1)';
const ESPERA_MAX = 3500; // ms buscando el destino; si no aparece, se cancela sin romper nada

type Opciones = {
  item: HTMLElement; // li.sel-item (con transform propio)
  rotacion: number; // grados en pantalla (objeto + inclinación de la fila)
  escala: number; // escala actual del objeto en la fila
  href: string;
  seccion: HTMLElement;
  ir: (href: string) => void;
};

export function volar({ item, rotacion, escala, href, seccion, ir }: Opciones) {
  const raiz = document.documentElement;
  if (raiz.hasAttribute('data-vuelo')) return;
  const encuadre = item.querySelector<HTMLElement>('.sel-encuadre');
  const img = item.querySelector('img');
  if (!encuadre || !img) {
    ir(href);
    return;
  }

  // Origen: centro en pantalla y tamaño real (la caja del objeto por su escala actual).
  const transformEncuadre = getComputedStyle(encuadre).transform;
  const r = item.getBoundingClientRect();
  const lado = item.offsetWidth * escala;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;

  const copia = document.createElement('div');
  copia.className = 'vuelo-copia';
  copia.setAttribute('aria-hidden', 'true');
  copia.style.cssText = `position:fixed;left:0;top:0;width:${lado}px;height:${lado}px;z-index:120;pointer-events:none;will-change:transform;`;
  const interior = encuadre.cloneNode(true) as HTMLElement;
  interior.querySelector('img')?.setAttribute('alt', '');
  copia.appendChild(interior);
  copia.style.transform = `translate(${cx - lado / 2}px, ${cy - lado / 2}px) rotate(${rotacion}deg)`;
  document.body.appendChild(copia);

  raiz.setAttribute('data-vuelo', '');
  item.style.visibility = 'hidden';
  seccion.dataset.saliendo = '';
  // Como en la referencia: primero se va todo lo demás y el objeto escogido se queda; después
  // cambia la página por debajo y la copia viaja.
  window.setTimeout(() => ir(href), SALIDA);

  const t0 = performance.now();
  const buscar = () => {
    const destino = document.querySelector<HTMLElement>('[data-destino-vuelo]');
    const imgDestino = destino?.querySelector('img');
    if (destino && imgDestino && imgDestino.complete && location.pathname === href) {
      aterrizar(destino);
      return;
    }
    if (performance.now() - t0 > ESPERA_MAX) {
      terminar();
      return;
    }
    requestAnimationFrame(buscar);
  };
  requestAnimationFrame(buscar);

  function aterrizar(destino: HTMLElement) {
    const d = destino.getBoundingClientRect();
    const ladoD = destino.offsetWidth;
    const rotD = new DOMMatrix(getComputedStyle(destino).transform);
    const angD = (Math.atan2(rotD.b, rotD.a) * 180) / Math.PI;
    const dx = d.left + d.width / 2 - ladoD / 2;
    const dy = d.top + d.height / 2 - ladoD / 2;
    const s0 = lado / ladoD;
    copia.style.width = `${ladoD}px`;
    copia.style.height = `${ladoD}px`;
    const anim = copia.animate(
      [
        { transform: `translate(${cx - ladoD / 2}px, ${cy - ladoD / 2}px) rotate(${rotacion}deg) scale(${s0})` },
        { transform: `translate(${dx}px, ${dy}px) rotate(${angD}deg) scale(1)` },
      ],
      { duration: DURACION, easing: CURVA, fill: 'forwards' }
    );
    // El encuadre del selector (escala y centrado) se deshace en el camino: en el hero el render va tal cual.
    interior.animate([{ transform: transformEncuadre }, { transform: 'none' }], {
      duration: DURACION,
      easing: CURVA,
      fill: 'forwards',
    });
    anim.onfinish = terminar;
  }

  function terminar() {
    raiz.removeAttribute('data-vuelo');
    copia.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'linear', fill: 'forwards' }).onfinish = () => copia.remove();
  }
}
