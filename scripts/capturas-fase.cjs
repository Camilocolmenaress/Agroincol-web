#!/usr/bin/env node
// Capturas de página completa para comparar antes/después en cada fase del rediseño.
// Las landings de pauta (/lp, /tienda) deben salir idénticas: son la guarda visual que el diff de SEO no ve.
//
// Playwright no es dependencia del repo; se usa el de la caché de npx:
//   npx --yes playwright@1.57.0 --version   (una vez, para que quede en caché)
//   NODE_PATH=$(dirname $(find ~/.npm/_npx -maxdepth 4 -path "*node_modules/playwright/package.json" | head -1 | xargs dirname)) \
//     node scripts/capturas-fase.cjs antes http://localhost:3100
//
// Salida: docs/rediseno/capturas/<etiqueta>/<ancho>/<slug>.png (ignorado en git: pesa).
// Comparar: node scripts/capturas-fase.cjs --comparar antes despues


const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const DIR = path.join(ROOT, 'docs/rediseno/capturas');
const ANCHOS = [390, 1440];
const RUTAS = [
  // Landings: no deben cambiar nunca.
  '/lp/chinches', '/lp/comejen', '/lp/restaurantes', '/tienda/laminas-de-captura', '/tienda/terminos',
  // Sitio: cambian a propósito; sirven de referencia visual.
  '/', '/servicios/fumigacion-residencial', '/blog/como-eliminar-cucarachas-bucaramanga', '/precios',
];
const slug = (r) => (r === '/' ? 'home' : r.slice(1).replace(/\//g, '__'));

async function capturar(etiqueta, base) {
  const { chromium } = require('playwright');
  // Usa el Chrome instalado: evita descargar el navegador que pide cada versión de Playwright.
  const browser = await chromium.launch({ channel: 'chrome' });
  for (const ancho of ANCHOS) {
    const ctx = await browser.newContext({ viewport: { width: ancho, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    fs.mkdirSync(path.join(DIR, etiqueta, String(ancho)), { recursive: true });
    for (const ruta of RUTAS) {
      await page.goto(base + ruta, { waitUntil: 'networkidle' });
      // Imágenes diferidas: se fuerzan a cargar ya (la captura de página completa no las dispara).
      await page.evaluate(() => document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; }));
      // Recorre la página para disparar revelados por scroll.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
        window.scrollTo(0, 0);
      });
      // Espera a que terminen las imágenes diferidas (si no, una corrida captura el difuminado y otra la foto).
      await page.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(800);
      const out = path.join(DIR, etiqueta, String(ancho), `${slug(ruta)}.png`);
      // Los videos con autoplay cambian de cuadro entre corridas: se pausan y se enmascaran.
      await page.evaluate(() => document.querySelectorAll('video').forEach((v) => { v.pause(); v.currentTime = 0; }));
      await page.screenshot({ path: out, fullPage: true, mask: [page.locator('video, iframe')], animations: 'disabled' });
      console.log(`${ancho} ${ruta}`);
    }
    await ctx.close();
  }
  await browser.close();
}

function comparar(a, b) {
  let fallas = 0;
  for (const ancho of ANCHOS) for (const ruta of RUTAS) {
    const fa = path.join(DIR, a, String(ancho), `${slug(ruta)}.png`);
    const fb = path.join(DIR, b, String(ancho), `${slug(ruta)}.png`);
    let px;
    try {
      execFileSync('magick', ['compare', '-metric', 'AE', '-fuzz', '2%', fa, fb, 'null:'], { stdio: 'pipe' });
      px = 0;
    } catch (e) { px = String(e.stderr).trim(); }
    const landing = ruta.startsWith('/lp') || ruta.startsWith('/tienda');
    // Tolerancia: dos corridas del mismo código difieren hasta ~0,9 % (antialiasing y un
    // desplazamiento de 1 px en /tienda en celular). Por encima de 1 % es un cambio real.
    const fraccion = px === 0 ? 0 : Number((String(px).match(/\(([^)]+)\)/) || [])[1] ?? 1);
    if (landing && fraccion > 0.01) fallas++;
    console.log(`${landing ? 'LANDING' : 'sitio  '} ${ancho} ${ruta.padEnd(45)} píxeles distintos: ${px}`);
  }
  if (fallas) { console.log(`\n${fallas} captura(s) de landings cambiaron.`); process.exitCode = 1; }
}

const [arg1, arg2, arg3] = process.argv.slice(2);
if (arg1 === '--comparar') comparar(arg2, arg3);
else capturar(arg1, arg2).catch((e) => { console.error(e); process.exit(1); });
