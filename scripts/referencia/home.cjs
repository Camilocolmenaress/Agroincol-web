const fs = require('fs'), path = require('path');
const { launch, BASE, OUT, startCast, SAMPLER } = require('./lib.cjs');
const DIR = path.join(OUT, 'home-interacciones'); fs.mkdirSync(DIR, { recursive: true });
const SELS = { items: 'a.jar-slider__item', marquee: '.jar-slider__marquee', shape: '.jar-slider__shape-layer', shapeImg: '.jar-slider__shape-image', badge: '.jar-slider__badge', badgeArt: '.jar-slider__badge-artwork', prompt: '.jar-slider__prompt', cursor: '.cursor-label', pill: '.cursor-label__pill', brand: '.site-header__brand' };
const save = (n, o) => fs.writeFileSync(path.join(DIR, n + '.json'), JSON.stringify(o));
const only = process.argv[2];
(async () => {
  const b = await launch();
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, recordVideo: { dir: path.join(DIR, 'video'), size: { width: 1440, height: 900 } } });
  const page = await ctx.newPage();
  await page.addInitScript(SAMPLER);
  // in-page load timeline
  await page.addInitScript(() => {
    window.__tl = []; const t = () => Math.round(performance.now());
    const seen = {};
    const chk = () => {
      const it = document.querySelector('a.jar-slider__item');
      const mark = (k) => { if (!seen[k]) { seen[k] = t(); window.__tl.push([k, seen[k]]); } };
      if (document.querySelector('.fruit-loader')) mark('fruit-loader presente');
      if (it) { mark('primer a.jar-slider__item en DOM'); const img = it.querySelector('img'); const op = +getComputedStyle(it).opacity; if (img && img.complete && img.naturalWidth) mark('img frasco decodificada'); if (op > 0.05) mark('frasco opacidad>0.05'); if (op > 0.6) mark('frasco opacidad>0.6'); }
      const pr = document.querySelector('.jar-slider__prompt'); if (pr && pr.classList.contains('is-ready')) mark('prompt is-ready');
      const br = document.querySelector('.site-header__brand.is-revealed'); if (br) mark('logo is-revealed');
      if (performance.now() < 8000) requestAnimationFrame(chk);
    }; requestAnimationFrame(chk);
  });
  const sample = (ms) => page.evaluate(async ([s, ms]) => { window.__startSample(s); await new Promise(r => setTimeout(r, ms)); return window.__stopSample(); }, [SELS, ms]);

  // 1. LOAD
  const cast = await startCast(page, path.join(DIR, 'carga'), 'carga');
  const t0 = Date.now(); cast.setT0(t0);
  await page.goto(BASE + '/en', { waitUntil: 'commit' });
  await page.waitForTimeout(4500);
  const r1 = await cast.stop([0, 150, 300, 450, 600, 800, 1000, 1250, 1500, 2000, 2500, 3000, 3500, 4000]);
  const tl = await page.evaluate(() => window.__tl);
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return { responseStart: Math.round(n.responseStart), dcl: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: Math.round((performance.getEntriesByName('first-contentful-paint')[0] || {}).startTime || 0) }; });
  save('carga', { r1: { n: r1.n, saved: r1.saved }, tl, nav });
  console.log('LOAD', JSON.stringify(nav), JSON.stringify(tl), r1.n);

  // 2. IDLE (autoplay?) 4s without input, mouse outside
  await page.mouse.move(720, 450); await page.waitForTimeout(500);
  save('reposo', await sample(4000));

  // 3. CIRCLE/BADGE rotation & parallax: mouse sweep left->right, top->bottom
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (let i = 0; i <= 40; i++) { await page.mouse.move(100 + i * 31, 450); await page.waitForTimeout(25); }
  await page.waitForTimeout(800);
  for (let i = 0; i <= 30; i++) { await page.mouse.move(720, 80 + i * 25); await page.waitForTimeout(25); }
  await page.waitForTimeout(1200);
  save('parallax', await page.evaluate(() => window.__stopSample()));
  // parallax screenshots at extremes
  for (const [n, x, y] of [['izq', 60, 450], ['der', 1380, 450], ['arr', 720, 60], ['aba', 720, 860]]) { await page.mouse.move(x, y, { steps: 10 }); await page.waitForTimeout(1500); await page.screenshot({ path: path.join(DIR, `parallax_${n}.jpg`), quality: 80, type: 'jpeg' }); }

  // 4. WHEEL slow
  await page.mouse.move(720, 120); await page.waitForTimeout(800);
  let c = await startCast(page, path.join(DIR, 'rueda-lenta'), 'rl');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (let i = 0; i < 8; i++) { await page.mouse.wheel(0, 100); await page.waitForTimeout(150); }
  await page.waitForTimeout(3500);
  save('rueda-lenta', await page.evaluate(() => window.__stopSample()));
  await c.stop([0, 300, 600, 900, 1200, 1600, 2000, 3000, 4000]);

  // 5. WHEEL fast
  c = await startCast(page, path.join(DIR, 'rueda-rapida'), 'rr');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  for (let i = 0; i < 10; i++) { await page.mouse.wheel(0, 120); await page.waitForTimeout(16); }
  await page.waitForTimeout(4000);
  save('rueda-rapida', await page.evaluate(() => window.__stopSample()));
  await c.stop([0, 100, 200, 400, 700, 1000, 1500, 2000, 3000, 4000]);

  // 5b. WHEEL reverse single
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.wheel(0, -100);
  await page.waitForTimeout(2500);
  save('rueda-inversa', await page.evaluate(() => window.__stopSample()));

  // 6. DRAG
  c = await startCast(page, path.join(DIR, 'arrastre'), 'dr');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.move(1000, 120); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(1000 - i * 25, 120 + i * 4); await page.waitForTimeout(16); }
  const dragCursor = await page.evaluate(() => ({ body: getComputedStyle(document.body).cursor, sec: getComputedStyle(document.querySelector('.jar-slider')).cursor, cls: document.querySelector('.jar-slider').className, wr: document.querySelector('.jar-slider__wrapper').className }));
  await page.mouse.up();
  await page.waitForTimeout(3500);
  save('arrastre', { dragCursor, s: await page.evaluate(() => window.__stopSample()) });
  await c.stop([0, 150, 300, 450, 700, 1000, 1500, 2500, 3500]);
  // slow drag (no flick)
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.move(400, 120); await page.mouse.down();
  for (let i = 1; i <= 20; i++) { await page.mouse.move(400 + i * 15, 120); await page.waitForTimeout(50); }
  await page.waitForTimeout(400); await page.mouse.up(); await page.waitForTimeout(2500);
  save('arrastre-lento', await page.evaluate(() => window.__stopSample()));

  // 7. KEYBOARD
  await page.mouse.move(720, 120);
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500);
  await page.keyboard.press('ArrowDown'); await page.waitForTimeout(1500);
  await page.keyboard.press('ArrowLeft'); await page.waitForTimeout(1500);
  await page.keyboard.press('PageDown'); await page.waitForTimeout(1500);
  await page.keyboard.press('Space'); await page.waitForTimeout(1500);
  save('teclado', await page.evaluate(() => window.__stopSample()));
  const tabs = [];
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab'); await page.waitForTimeout(700);
    const f = await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); const r = e.getBoundingClientRect(); return { tag: e.tagName, cls: (e.className + '').slice(0, 60), txt: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40), href: e.getAttribute('href'), outline: cs.outline, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow, rect: [Math.round(r.left), Math.round(r.top), Math.round(r.width), Math.round(r.height)], fv: e.matches(':focus-visible') }; });
    tabs.push(f);
    await page.screenshot({ path: path.join(DIR, `tab_${String(i + 1).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 75 });
  }
  save('tab', tabs); console.log('TABS', tabs.map(t => t.tag + ':' + t.txt + ':' + t.href + ':' + t.outline).join(' | '));

  // 8. HOVER on a jar
  await page.evaluate(() => document.activeElement && document.activeElement.blur());
  await page.mouse.move(720, 60); await page.waitForTimeout(1500);
  const target = await page.evaluate(() => { const its = [...document.querySelectorAll('a.jar-slider__item')]; let best = null, bs = 0; its.forEach((e, i) => { const r = e.getBoundingClientRect(); if (r.width > bs && r.left > 0 && r.right < innerWidth) { bs = r.width; best = { i, x: r.left + r.width / 2, y: r.top + r.height / 2, href: e.getAttribute('href') }; } }); return best; });
  c = await startCast(page, path.join(DIR, 'hover'), 'hv');
  await page.evaluate(([s]) => window.__startSample(s), [SELS]);
  await page.mouse.move(target.x, target.y, { steps: 8 });
  await page.waitForTimeout(1500);
  const hoverState = await page.evaluate(() => { const cl = document.querySelector('.cursor-label'); const t = document.querySelector('.cursor-label__text'); const p = document.querySelector('.cursor-label__pill'); const cs = getComputedStyle(p); const ct = getComputedStyle(t); return { cursorCss: getComputedStyle(document.elementFromPoint(innerWidth/2, innerHeight/2) || document.body).cursor, cls: cl.className, text: t.textContent, pill: { bg: cs.backgroundColor, col: cs.color, br: cs.borderRadius, pad: cs.padding, h: p.getBoundingClientRect().height, w: p.getBoundingClientRect().width, op: cs.opacity, tf: cs.transform }, textFont: [ct.fontFamily.split(',')[0], ct.fontSize, ct.fontWeight, ct.letterSpacing, ct.textTransform, ct.color], label: cl.getBoundingClientRect().toJSON() }; });
  await page.mouse.move(target.x + 120, target.y + 60, { steps: 10 }); await page.waitForTimeout(600);
  await page.mouse.move(720, 60, { steps: 8 }); await page.waitForTimeout(1200);
  save('hover', { target, hoverState, s: await page.evaluate(() => window.__stopSample()) });
  await c.stop([0, 100, 200, 300, 500, 800, 1200, 1600, 2200, 2800, 3400]);
  console.log('HOVER', JSON.stringify(hoverState));

  // 9. CLICK on a jar -> product
  await page.mouse.move(target.x, target.y, { steps: 6 }); await page.waitForTimeout(800);
  const tgt2 = await page.evaluate(() => { const e = document.elementFromPoint(innerWidth / 2, innerHeight / 2); const a = e && e.closest('a'); return a ? a.getAttribute('href') : null; });
  const evs = [];
  page.on('framenavigated', f => { if (f === page.mainFrame()) evs.push(['nav', Date.now(), f.url()]); });
  c = await startCast(page, path.join(DIR, 'clic'), 'ck');
  const tc = Date.now(); c.setT0(tc);
  await page.mouse.click(target.x, target.y);
  const urlPoll = []; for (let i = 0; i < 30; i++) { await page.waitForTimeout(100); urlPoll.push([Date.now() - tc, page.url()]); }
  await page.waitForTimeout(1500);
  const pick = []; for (let t = 0; t <= 4000; t += 100) pick.push(t);
  const rc = await c.stop(pick);
  save('clic', { target, tgt2, evs: evs.map(e => [e[0], e[1] - tc, e[2]]), urlPoll: urlPoll.filter((u, i) => i === 0 || u[1] !== urlPoll[i - 1][1]), frames: rc.n });
  console.log('CLICK', JSON.stringify(evs.map(e => [e[1] - tc, e[2]])), JSON.stringify(urlPoll.filter((u, i) => i === 0 || u[1] !== urlPoll[i - 1][1])));
  await ctx.close(); await b.close();
})();
