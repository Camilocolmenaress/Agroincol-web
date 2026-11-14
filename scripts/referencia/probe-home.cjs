const { launch, BASE } = require('./lib.cjs');
(async () => {
  const b = await launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto(BASE + '/en', { waitUntil: 'networkidle' }); await p.waitForTimeout(3000);
  const r = await p.evaluate(() => {
    const sec = document.querySelector('section.jar-slider');
    const out = [];
    const walk = (el, d) => { if (d > 7) return; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el);
      out.push('  '.repeat(d) + el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '') + ` [${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}] tf=${cs.transform.slice(0,60)} op=${cs.opacity} pos=${cs.position} z=${cs.zIndex}` + (el.childElementCount === 0 ? ' "' + el.textContent.trim().slice(0, 40) + '"' : '') + (el.getAttribute('href') ? ' href=' + el.getAttribute('href') : ''));
      if (el.matches('a.jar-slider__item') && out.filter(l => l.includes('jar-slider__item')).length > 2) return;
      [...el.children].forEach(c => walk(c, d + 1)); };
    walk(sec, 0);
    const hdr = document.querySelector('header.site-header'); const hh = [];
    const w2 = (el, d) => { if (d > 6) return; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); hh.push('  '.repeat(d) + el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : '') + ` [${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}] bg=${cs.backgroundColor} col=${cs.color} br=${cs.borderRadius} bd=${cs.border.slice(0,30)} ff=${cs.fontFamily.split(',')[0]} fs=${cs.fontSize} fw=${cs.fontWeight} ls=${cs.letterSpacing}` + (el.childElementCount === 0 ? ' "' + el.textContent.trim().slice(0, 30) + '"' : '')); [...el.children].forEach(c => w2(c, d + 1)); };
    w2(hdr, 0);
    const other = [...document.querySelectorAll('body *')].filter(e => /cursor|circle|scroll|privacy|legal/i.test(e.className + '')).slice(0, 20).map(e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return (typeof e.className === 'string' ? e.className : '') + ` [${Math.round(r.left)},${Math.round(r.top)} ${Math.round(r.width)}x${Math.round(r.height)}] pos=${cs.position} op=${cs.opacity} tf=${cs.transform.slice(0,50)} anim=${cs.animationName} ${cs.animationDuration} "${e.textContent.trim().slice(0,40)}"`; });
    return { items: document.querySelectorAll('a.jar-slider__item').length, tree: out.join('\n'), hdr: hh.join('\n'), other: other.join('\n') };
  });
  console.log('items', r.items); console.log(r.tree); console.log('---HDR'); console.log(r.hdr); console.log('---OTHER'); console.log(r.other);
  await b.close();
})();
