#!/usr/bin/env node
// Mide el selector del home con los mismos gestos en la referencia (agrumeafarm.it) y en el
// nuestro, y compara los números de docs/rediseno/descomposicion-agrumea (anexo B, §1.3–1.8).
// Uso: NODE_PATH=<playwright de la caché de npx> node scripts/referencia/comparar-selector.cjs [base] [ancho] [alto]
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:3200';
const W = +(process.argv[3] || 1440), Hh = +(process.argv[4] || 900);
const SITIOS = [
  { nombre: 'referencia', url: 'https://www.agrumeafarm.it/en', item: 'a.jar-slider__item', sello: '.jar-slider__badge', espera: 9000 },
  { nombre: 'agroincol', url: BASE + '/', item: '.sel-item', sello: '.sel-sello', espera: 4500 },
];
const MUESTREO = (sel) => {
  window.__m = []; window.__sel = sel; const t0 = performance.now();
  const f = () => {
    const it = [...document.querySelectorAll(sel.item)];
    // Objeto más cercano al centro de la pantalla y su vecino: x del centro de cada uno.
    const xs = it.map((e) => { const r = e.getBoundingClientRect(); return r.left + r.width / 2; });
    const s = document.querySelector(sel.sello); const m = s ? new DOMMatrix(getComputedStyle(s).transform) : null;
    window.__m.push([performance.now() - t0, xs, m ? Math.atan2(m.b, m.a) * 180 / Math.PI : 0, it.map((e) => { const mm = new DOMMatrix(getComputedStyle(e).transform); return Math.hypot(mm.a, mm.b); })]);
    if (window.__m.length < 2000) window.__raf = requestAnimationFrame(f);
  };
  window.__raf = requestAnimationFrame(f);
};
const parar = () => { cancelAnimationFrame(window.__raf); return window.__m; };
// Desplazamiento de la fila: mediana del cambio de x de los objetos que no dieron la vuelta.
function despl(m) {
  const a = m[0][1];
  return m.map(([t, xs, giro, esc]) => {
    const d = xs.map((x, i) => x - a[i]).filter((v) => Math.abs(v) < 1200).sort((p, q) => p - q);
    return [t, d.length ? d[Math.floor(d.length / 2)] : 0, giro, esc];
  });
}
const enT = (serie, t) => { let r = serie[0]; for (const s of serie) { if (s[0] <= t) r = s; else break; } return r; };
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const out = {};
  for (const s of SITIOS) {
    const ctx = await b.newContext({ viewport: { width: W, height: Hh } });
    const p = await ctx.newPage();
    await p.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 });
    await p.waitForTimeout(s.espera);
    await p.mouse.move(W / 2, Hh * 0.62);
    await p.waitForTimeout(1500);
    const r = {};
    // 1) Una muesca de rueda (100).
    await p.evaluate(MUESTREO, s); await p.mouse.wheel(0, 100); await p.waitForTimeout(3000);
    let m = despl(await p.evaluate(parar)); const tot = m[m.length - 1][1];
    const quieto = m.find(([t, d]) => Math.abs(d - tot) < 0.5)?.[0];
    r.muesca = { total_px: +tot.toFixed(1), pct_257ms: +(100 * enT(m, 257)[1] / tot).toFixed(0), quieto_ms: Math.round(quieto), giro_sello_por_100px: +(100 * (m[m.length - 1][2] - m[0][2]) / Math.abs(tot)).toFixed(2) };
    // 2) Quieto 4 s.
    await p.evaluate(MUESTREO, s); await p.waitForTimeout(4000);
    m = despl(await p.evaluate(parar)); r.deriva_4s_px = +Math.abs(m[m.length - 1][1]).toFixed(1);
    // 3) Escalas en reposo: máxima (centro) y mínima visible.
    const esc = await p.evaluate((sel) => [...document.querySelectorAll(sel.item)].map((e) => { const r2 = e.getBoundingClientRect(); const mm = new DOMMatrix(getComputedStyle(e).transform); return [r2.left + r2.width / 2, Math.hypot(mm.a, mm.b)]; }).filter(([x]) => x > 0 && x < innerWidth), s);
    r.escalas_visibles = esc.sort((a2, b2) => a2[0] - b2[0]).map(([, k]) => +k.toFixed(2));
    // 4) Arrastre de 500 px en ~320 ms.
    await p.evaluate(MUESTREO, s);
    await p.mouse.move(W * 0.7, Hh * 0.6); await p.mouse.down();
    for (let k = 1; k <= 20; k++) { await p.mouse.move(W * 0.7 - 25 * k, Hh * 0.6); await p.waitForTimeout(16); }
    await p.mouse.up(); await p.waitForTimeout(4000);
    m = despl(await p.evaluate(parar)); r.arrastre_500px_total = +Math.abs(m[m.length - 1][1]).toFixed(0);
    // 5) Hover: la escala del objeto bajo el puntero no cambia.
    const antes = await p.evaluate((sel) => { const e = document.elementFromPoint(innerWidth / 2, innerHeight * 0.58)?.closest(sel.item); return e ? Math.hypot(...['a', 'b'].map((k) => new DOMMatrix(getComputedStyle(e).transform)[k])) : null; }, s);
    await p.mouse.move(W / 2 + 3, Hh * 0.58); await p.waitForTimeout(900);
    const despues = await p.evaluate((sel) => { const e = document.elementFromPoint(innerWidth / 2, innerHeight * 0.58)?.closest(sel.item); return e ? Math.hypot(...['a', 'b'].map((k) => new DOMMatrix(getComputedStyle(e).transform)[k])) : null; }, s);
    r.hover_cambio_escala = antes && despues ? +(despues - antes).toFixed(3) : 'sin objeto bajo el puntero';
    out[s.nombre] = r;
    await ctx.close();
  }
  await b.close();
  console.log(JSON.stringify(out, null, 1));
})();
