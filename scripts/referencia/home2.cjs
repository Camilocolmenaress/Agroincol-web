const fs = require('fs'), path = require('path');
const { launch, BASE, OUT, startCast, SAMPLER } = require('./lib.cjs');
const DIR = path.join(OUT, 'home-interacciones'); fs.mkdirSync(DIR, { recursive: true });
const SELS = { items: 'a.jar-slider__item', badge: '.jar-slider__badge', shape: '.jar-slider__shape-layer', prompt: '.jar-slider__prompt', pill: '.cursor-label__pill', cursor: '.cursor-label' };
const save = (n, o) => fs.writeFileSync(path.join(DIR, n + '.json'), JSON.stringify(o));
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: path.join(DIR, 'video2'), size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.addInitScript(SAMPLER);
  await page.addInitScript(() => { window.__tl = []; const seen = {}; const t = () => Math.round(performance.now()); const chk = () => { const m = (k) => { if (!seen[k]) { seen[k] = t(); window.__tl.push([k, seen[k]]); } };
    const fl = document.querySelector('.fruit-loader'); if (fl) { m('loader en DOM'); m('loader clases ' + fl.className); const txt = fl.innerText.trim(); if (txt) m('loader texto ' + txt.slice(0, 5)); } else if (seen['loader en DOM']) m('loader fuera del DOM');
    const it = document.querySelector('a.jar-slider__item'); if (it) { const r = it.getBoundingClientRect(); m('frasco en DOM'); }
    const pr = document.querySelector('.jar-slider__prompt.is-ready'); if (pr) m('prompt is-ready');
    if (performance.now() < 9000) requestAnimationFrame(chk); }; requestAnimationFrame(chk); });
  // LOAD long
  let c = await startCast(page, path.join(DIR, 'carga'), 'carga');
  const t0 = Date.now(); c.setT0(t0);
  await page.goto(BASE + '/en', { waitUntil: 'commit' });
  await page.waitForTimeout(8000);
  const pick = [0, 150, 300, 600, 1000, 1500, 2500]; for (let t = 3000; t <= 7000; t += 100) pick.push(t);
  await c.stop(pick);
  const tl = await page.evaluate(() => window.__tl);
  save('carga2', tl); console.log('TL', JSON.stringify(tl.filter(x => !/loader texto/.test(x[0])).slice(0, 40)));
  console.log('pct', JSON.stringify(tl.filter(x => /loader texto/.test(x[0])).map(x => x[0].slice(14) + '@' + x[1]).slice(0, 40)));
  // reload: preloader again?
  await page.reload({ waitUntil: 'commit' }); await page.waitForTimeout(1500);
  const again = await page.evaluate(() => ({ fl: !!document.querySelector('.fruit-loader'), txt: (document.querySelector('.fruit-loader') || {}).innerText }));
  console.log('RELOAD loader', JSON.stringify(again));
  await page.waitForTimeout(7000);
  // WHEEL at various points
  for (const [nm, x, y] of [['centro', 720, 450], ['abajo-izq', 200, 780]]) {
    await page.mouse.move(x, y); await page.waitForTimeout(1500);
    c = await startCast(page, path.join(DIR, 'rueda-lenta'), 'rl_' + nm);
    await page.evaluate(([s]) => window.__startSample(s), [SELS]);
    for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(150); }
    await page.waitForTimeout(3500);
    save('rueda-lenta_' + nm, await page.evaluate(() => window.__stopSample()));
    await c.stop([0, 300, 600, 900, 1200, 1600, 2000, 3000, 4000]);
  }
  await page.mouse.move(720, 450);
  c = await startCast(page, path.join(DIR, 'rueda-rapida'), 'rr');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(16); }
  await page.waitForTimeout(4500);
  save('rueda-rapida2', await page.evaluate(() => window.__stopSample()));
  await c.stop([0, 100, 200, 400, 700, 1000, 1500, 2000, 3000, 4000]);
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.wheel(0, 100); await page.waitForTimeout(3000);
  save('rueda-una', await page.evaluate(() => window.__stopSample()));
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.wheel(0, -300); await page.waitForTimeout(3000);
  save('rueda-inversa2', await page.evaluate(() => window.__stopSample()));
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.wheel(300, 0); await page.waitForTimeout(3000);
  save('rueda-horizontal', await page.evaluate(() => window.__stopSample()));
  // keyboard with body focus, mouse on page
  await page.mouse.click(720, 880); // click empty area near bottom (prompt) to focus document
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (const k of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'PageDown', 'Space']) { await page.keyboard.press(k); await page.waitForTimeout(1500); }
  save('teclado2', await page.evaluate(() => window.__stopSample()));
  console.log('url after keys', page.url());
  if (!page.url().endsWith('/en')) { await page.goto(BASE + '/en'); await page.waitForTimeout(8000); }
  // Focus a jar via Tab and see whether slider moves
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Tab'); await page.waitForTimeout(800); }
  save('tab-mov', await page.evaluate(() => window.__stopSample()));
  // HOVER center (largest) jar
  await page.mouse.move(200, 780); await page.waitForTimeout(1500);
  const target = await page.evaluate(() => { const its = [...document.querySelectorAll('a.jar-slider__item')]; let best = null, bs = 0; its.forEach((e, i) => { const r = e.getBoundingClientRect(); const s = window.__parse(e).s; if (s > bs && r.left > 0 && r.right < innerWidth) { bs = s; best = { i, s, x: r.left + r.width / 2, y: r.top + r.height / 2, href: e.getAttribute('href') }; } }); return best; });
  console.log('target', JSON.stringify(target));
  c = await startCast(page, path.join(DIR, 'hover'), 'hvc');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.move(target.x, target.y, { steps: 8 }); await page.waitForTimeout(1500);
  await page.mouse.move(target.x + 60, target.y - 40, { steps: 5 }); await page.waitForTimeout(800);
  await page.mouse.move(200, 780, { steps: 8 }); await page.waitForTimeout(1200);
  save('hover-centro', { target, s: await page.evaluate(() => window.__stopSample()) });
  await c.stop([0, 100, 200, 300, 400, 500, 700, 1000, 1500, 2000, 2500, 3000, 3500]);
  // CLICK center jar
  await page.mouse.move(target.x, target.y, { steps: 6 }); await page.waitForTimeout(800);
  c = await startCast(page, path.join(DIR, 'clic'), 'ckc');
  const tc = Date.now(); c.setT0(tc);
  await page.evaluate(([s]) => window.__startSample({ items: s.items, panel: '.page-transition__panel', pt: '.page-transition', hero: '.product-hero__jar', title: '.product-hero__title', loader: '.fruit-loader__sweep-panel' }), [SELS]);
  await page.mouse.click(target.x, target.y);
  const urls = []; for (let i = 0; i < 40; i++) { await page.waitForTimeout(100); const u = page.url(); if (!urls.length || urls[urls.length - 1][1] !== u) urls.push([Date.now() - tc, u]); }
  await page.waitForTimeout(500);
  const sm = await page.evaluate(() => window.__stopSample());
  const pk = []; for (let t = 0; t <= 4500; t += 100) pk.push(t);
  await c.stop(pk);
  save('clic-centro', { target, urls, s: sm.map(r => ({ t: r.t, panel: r.panel, pt: r.pt, hero: r.hero, title: r.title, loader: r.loader, it: r.items && r.items[target.i] })) });
  console.log('URLS', JSON.stringify(urls));
  await ctx.close(); await b.close();
})();
