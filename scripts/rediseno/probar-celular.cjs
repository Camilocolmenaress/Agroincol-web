#!/usr/bin/env node
// Fix celular (15-nov): en pantallas táctiles, carruseles con scroll nativo e imán, sus imágenes cargan,
// y las figuras 3D salen directas (sin /_next/image) con su sombra.
// Uso: NODE_PATH=<playwright> [VERCEL_JWT=…] node scripts/rediseno/probar-celular.cjs [base]
const pw = require('playwright');
const BASE = (process.argv[2] || 'http://localhost:3200').replace(/\/$/, '');
let fallas = 0;
const ok = (n, c, d = '') => { if (!c) fallas++; console.log(`${c ? 'OK   ' : 'FALLA'} ${n}${d ? '  — ' + d : ''}`); };
(async () => {
  for (const [motor, tipo, disp] of [['webkit', pw.webkit, 'iPhone 13'], ['chromium', pw.chromium, 'Pixel 7']]) {
    const b = await tipo.launch(motor === 'chromium' ? { channel: 'chrome' } : {});
    const ctx = await b.newContext({ ...pw.devices[disp] });
    await ctx.route(/vercel\.live/, (r) => r.abort());
    if (process.env.VERCEL_JWT && !BASE.includes('localhost')) await ctx.addCookies([{ name: '_vercel_jwt', value: process.env.VERCEL_JWT, url: BASE }]);
    const p = await ctx.newPage();
    for (const ruta of ['/', '/servicios/fumigacion-residencial']) {
      await p.goto(BASE + ruta + '?test=1', { waitUntil: 'networkidle' });
      await p.waitForTimeout(1500);
      const t = `${disp} ${ruta}`;
      ok(`${t}: pantalla táctil (pointer: coarse)`, await p.evaluate(() => matchMedia('(pointer: coarse)').matches));
      for (const sel of ['.track', '.cards']) {
        const caja = p.locator(sel).first();
        if (!(await caja.count())) continue;
        await caja.scrollIntoViewIfNeeded();
        await p.waitForTimeout(800);
        const st = await caja.evaluate((el) => ({ nativo: el.classList.contains('is-native'), ox: getComputedStyle(el).overflowX, snap: getComputedStyle(el).scrollSnapType, ta: getComputedStyle(el).touchAction, riel: getComputedStyle(el.querySelector('.rail')).transform }));
        ok(`${t} ${sel}: scroll nativo con imán`, st.nativo && st.ox === 'auto' && /x/.test(st.snap) && st.riel === 'none', JSON.stringify(st));
        // Desplazar como un dedo: el contador y la barra siguen al scroll; el imán deja una tarjeta alineada.
        const antes = await p.evaluate((s) => document.querySelector(s).scrollLeft, sel);
        await caja.evaluate((el) => el.scrollBy({ left: el.clientWidth * 0.8 }));
        await p.waitForTimeout(900);
        const despues = await caja.evaluate((el) => el.scrollLeft);
        ok(`${t} ${sel}: se desplaza en horizontal`, despues > antes + 20, `${antes} → ${Math.round(despues)}`);
        await caja.evaluate((el) => el.scrollTo({ left: el.scrollWidth }));
        await p.waitForTimeout(1200);
        const imgs = await caja.evaluate((el) => [...el.querySelectorAll('img')].map((i) => ({ ok: i.complete && i.naturalWidth > 0, lazy: i.loading })));
        ok(`${t} ${sel}: todas sus imágenes cargan (${imgs.length})`, imgs.length && imgs.every((i) => i.ok && i.lazy !== 'lazy'), JSON.stringify(imgs.filter((i) => !i.ok)));
      }
      const objs = await p.evaluate(() => [...document.querySelectorAll('main img')].filter((i) => /obj-/.test(i.currentSrc || i.src)).map((i) => ({ src: (i.currentSrc || i.src).replace(location.origin, ''), carga: i.complete && i.naturalWidth > 0, sombra: getComputedStyle(i).filter })));
      const directas = objs.every((o) => /^\/rediseno\/obj-[a-z]+(-\d{3})?\.webp$/.test(o.src));
      ok(`${t}: figuras 3D directas, sin optimizador (${objs.length})`, objs.length && directas, directas ? '' : objs.find((o) => !/^\/rediseno\//.test(o.src)).src);
      const conSombra = objs.filter((o) => /drop-shadow/.test(o.sombra)).length;
      ok(`${t}: figuras 3D con drop-shadow`, conSombra > 0, `${conSombra} de ${objs.length}`);
    }
    // Escritorio: el arrastre con mouse se queda.
    const esc = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
    await esc.goto(BASE + '/servicios/fumigacion-residencial?test=1', { waitUntil: 'networkidle' });
    await esc.waitForTimeout(1000);
    ok(`${motor} escritorio: carrusel con arrastre (sin is-native)`, await esc.evaluate(() => !document.querySelector('.cards').classList.contains('is-native') && getComputedStyle(document.querySelector('.cards .rail')).transform !== 'none'));
    await b.close();
  }
  console.log(fallas ? `\n${fallas} fallas` : '\nTodo OK');
  process.exitCode = fallas ? 1 : 0;
})();
