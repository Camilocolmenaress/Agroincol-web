const { launch, BASE } = require('./lib.cjs');
const [route, ...sels] = process.argv.slice(2);
(async () => {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + route, { waitUntil: 'networkidle' }); await p.waitForTimeout(6000);
  for (const sel of sels) {
    const r = await p.evaluate((sel) => { const root = document.querySelector(sel); if (!root) return 'NONE ' + sel; const out = []; let n = 0;
      const walk = (el, d) => { if (d > 7 || n > 70) return; n++; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
        out.push('  '.repeat(d) + el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '') + ` [${Math.round(r.left)},${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}] bg=${cs.backgroundColor} tf=${cs.transform.slice(0, 45)} op=${cs.opacity} pos=${cs.position} cur=${cs.cursor} br=${cs.borderRadius} tr=${cs.transition.slice(0, 60)}` + (el.childElementCount === 0 ? ' "' + el.textContent.trim().slice(0, 30) + '"' : ''));
        const kids = [...el.children]; kids.slice(0, 4).forEach(c => walk(c, d + 1)); if (kids.length > 4) out.push('  '.repeat(d + 1) + `... +${kids.length - 4}`); };
      walk(root, 0); return out.join('\n'); }, sel);
    console.log('=== ' + sel); console.log(r);
  }
  await b.close();
})();
