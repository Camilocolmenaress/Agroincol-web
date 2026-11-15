#!/usr/bin/env node
// Compara páginas migradas contra el prototipo aprobado (_rediseno/site), en 1440, 834 y 390 px:
// 1) Texto y estructura de <main>: títulos, enlaces (con la URL ya traducida), imágenes (alt) y
//    el texto completo normalizado. Tienen que ser iguales.
// 2) Píxeles de la página completa con reduce-motion (sin animaciones a mitad de camino).
//    Se informa el % de píxeles distintos y se guarda la imagen de diferencias.
//
// Uso: NODE_PATH=<playwright de la caché de npx> node scripts/rediseno/comparar-prototipo.cjs [base] [archivo.html ...]
// Sin archivos, compara todas las páginas ya migradas (las que responden con el sitio nuevo).
const { chromium } = require('playwright');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const RAIZ = path.resolve(__dirname, '..', '..');
// Referencia: el prototipo con el artículo completo (la genera scripts/rediseno/extraer-prototipo.py).
const REF = path.join(RAIZ, 'docs', 'rediseno-prototipo', 'referencia');
const SITE = fs.existsSync(REF) ? REF : path.join(RAIZ, '_rediseno', 'site');
const SALIDA = path.join(RAIZ, 'docs', 'rediseno-prototipo', 'capturas', 'comparacion');
const PAGINAS = JSON.parse(fs.readFileSync(path.join(RAIZ, 'content', 'rediseno', 'paginas.json'), 'utf8'));
const args = process.argv.slice(2);
const BASE = (args[0] && args[0].startsWith('http') ? args.shift() : 'http://localhost:3200').replace(/\/$/, '');
const ARCHIVOS = args.length ? args : Object.keys(PAGINAS);
const ANCHOS = [[1440, 900], [834, 1112], [390, 844]];
const RUTA = Object.fromEntries(Object.entries(PAGINAS).map(([a, p]) => [a, p.ruta]));

// Lo que se compara del <main>: texto y estructura, con los enlaces del prototipo traducidos.
function extraer() {
  const main = document.querySelector('main');
  if (!main) return null;
  const limpio = (s) => (s || '').replace(/\s+/g, ' ').trim();
  const href = (a) => a.getAttribute('href');
  return {
    titulos: [...main.querySelectorAll('h1,h2,h3')].map((h) => h.tagName + ': ' + limpio(h.textContent)),
    enlaces: [...main.querySelectorAll('a[href]')].map((a) => href(a) + ' | ' + limpio(a.textContent)),
    imagenes: [...main.querySelectorAll('img')].map((i) => i.getAttribute('alt') || ''),
    formularios: main.querySelectorAll('form[data-lead-form]').length,
    texto: limpio(main.innerText),
  };
}
const traducir = (h) => {
  if (!h) return h;
  const m = h.match(/^([a-z0-9-]+\.html)(#.*)?$/);
  return m && RUTA[m[1]] ? RUTA[m[1]] + (m[2] || '') : h;
};

function difPx(a, b) {
  // Mismo tamaño para comparar (el más corto se rellena de magenta): la diferencia de alto cuenta.
  const dim = (f) => execFileSync('magick', ['identify', '-format', '%w %h', f], { encoding: 'utf8' }).split(' ').map(Number);
  const [wa, ha] = dim(a), [wb, hb] = dim(b);
  const W = Math.max(wa, wb), H = Math.max(ha, hb);
  const ea = a.replace('.png', '-ext.png'), eb = b.replace('.png', '-ext.png');
  for (const [src, dst] of [[a, ea], [b, eb]]) execFileSync('magick', [src, '-background', 'magenta', '-gravity', 'north', '-extent', `${W}x${H}`, dst]);
  const dif = a.replace('-prototipo.png', '-diferencias.png');
  const r = require('node:child_process').spawnSync('magick', ['compare', '-metric', 'AE', '-fuzz', '6%', ea, eb, dif], { encoding: 'utf8' });
  fs.rmSync(ea, { force: true });
  fs.rmSync(eb, { force: true });
  return { px: Number((r.stderr || '').trim().split(/\s/)[0]), total: W * H, alto: [ha, hb] };
}

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const b = await chromium.launch({ channel: 'chrome' });
  const resumen = [];
  for (const archivo of ARCHIVOS) {
    const ruta = RUTA[archivo];
    for (const [w, h] of ANCHOS) {
      const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
      // Preview protegido de Vercel: VERCEL_JWT=<cookie _vercel_jwt>.
      if (process.env.VERCEL_JWT && !BASE.includes('localhost')) await ctx.addCookies([{ name: '_vercel_jwt', value: process.env.VERCEL_JWT, url: BASE }]);
      const p = await ctx.newPage();
      const errores = [];
      p.on('pageerror', (e) => errores.push(e.message));
      p.on('console', (m) => m.type() === 'error' && !/insights|Failed to load resource.*404/.test(m.text()) && errores.push(m.text()));
      const fotos = {};
      const datos = {};
      for (const [cual, url] of [['prototipo', 'file://' + path.join(SITE, archivo)], ['next', BASE + ruta]]) {
        await p.goto(url, { waitUntil: 'networkidle' });
        await p.evaluate(async () => {
          document.querySelectorAll('img[loading="lazy"]').forEach((i) => (i.loading = 'eager'));
          await Promise.all([...document.images].map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; }))));
          await Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => null) : null)));
          await document.fonts.ready;
        });
        await p.waitForTimeout(1200);
        // Toda imagen debe cargar (en Vercel el optimizador ha devuelto 400 donde en local funcionaba).
        const rotas = await p.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => (i.currentSrc || i.src).slice(-70)));
        if (rotas.length) errores.push(`${cual}: ${rotas.length} imagen(es) sin cargar: ${rotas.slice(0, 2).join(' , ')}`);
        datos[cual] = await p.evaluate(extraer);
        const f = path.join(SALIDA, `${archivo.replace('.html', '')}-${w}-${cual}.png`);
        await p.screenshot({ path: f, fullPage: true });
        fotos[cual] = f;
      }
      await ctx.close();
      const A = datos.prototipo, N = datos.next;
      const fallas = [];
      if (!N) fallas.push('sin <main> en Next');
      else {
        const enlacesProto = A.enlaces.map((e) => { const [h, ...r] = e.split(' | '); return traducir(h) + ' | ' + r.join(' | '); });
        if (JSON.stringify(A.titulos) !== JSON.stringify(N.titulos)) fallas.push('títulos distintos');
        if (JSON.stringify(enlacesProto) !== JSON.stringify(N.enlaces)) fallas.push('enlaces distintos');
        if (JSON.stringify(A.imagenes) !== JSON.stringify(N.imagenes)) fallas.push('imágenes distintas');
        if (A.formularios !== N.formularios) fallas.push('formularios distintos');
        if (A.texto !== N.texto) fallas.push('texto distinto');
        if (fallas.length) fs.writeFileSync(path.join(SALIDA, `${archivo.replace('.html', '')}-${w}-estructura.json`), JSON.stringify({ prototipo: { ...A, enlaces: enlacesProto }, next: N }, null, 1));
      }
      let pct = '?';
      let altos = '';
      try {
        const d = difPx(fotos.prototipo, fotos.next);
        pct = ((d.px / d.total) * 100).toFixed(2) + '%';
        altos = d.alto[0] === d.alto[1] ? '' : ` (alto ${d.alto[0]} vs ${d.alto[1]})`;
      } catch (e) {
        pct = 'error: ' + e.message.slice(0, 80);
      }
      resumen.push({ archivo, ruta, ancho: w, estructura: fallas.length ? fallas.join(', ') : 'igual', pixeles: pct + altos, errores: errores.length });
      console.log(`${archivo.padEnd(44)} ${String(w).padEnd(5)} estructura: ${(fallas.join(', ') || 'igual').padEnd(30)} píxeles distintos: ${pct}${altos}${errores.length ? '  errores: ' + errores.slice(0, 2).join(' | ') : ''}`);
    }
  }
  fs.writeFileSync(path.join(SALIDA, 'resumen.json'), JSON.stringify(resumen, null, 1));
  await b.close();
})();
