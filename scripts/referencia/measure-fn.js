// injected: returns measurement of the page at current state
window.__measure = function (only) {
  const vw = innerWidth, vh = innerHeight, sy = scrollY;
  const R = el => { const r = el.getBoundingClientRect(); return { x: Math.round(r.left), y: Math.round(r.top + sy), w: Math.round(r.width), h: Math.round(r.height) }; };
  const vis = el => { const cs = getComputedStyle(el); if (cs.display === 'none' || cs.visibility === 'hidden') return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const cv = document.createElement('canvas').getContext('2d');
  const name = el => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + ((typeof el.className === 'string' && el.className.trim()) ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : '');
  const textInfo = el => {
    const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const t = el.innerText.replace(/\s+/g, ' ').trim();
    cv.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const avg = cv.measureText(t).width / Math.max(1, t.length);
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
    const lines = Math.max(1, Math.round(r.height / lh));
    return { el: name(el), t: t.slice(0, 70), len: t.length, ...R(el), ff: cs.fontFamily.split(',')[0].replace(/"/g, ''), fs: cs.fontSize, fw: cs.fontWeight, lh: cs.lineHeight, ls: cs.letterSpacing, tt: cs.textTransform, fst: cs.fontStyle, col: cs.color, ta: cs.textAlign, maxW: cs.maxWidth, lines, chPerLine: Math.round(t.length / lines), maxCh: Math.round(r.width / avg), op: cs.opacity };
  };
  const CAND = 'h1,h2,h3,h4,h5,h6,p,li,a,button,label,figcaption,dt,dd,blockquote';
  const leafText = root => {
    const own = e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 0);
    const set = new Set();
    root.querySelectorAll('*').forEach(e => {
      if (!vis(e) || !own(e) || e.closest('.visually-hidden,.sr-only')) return;
      let top = null, a = e;
      while (a && a !== root) { if (a.matches(CAND)) top = a; a = a.parentElement; }
      set.add(top || e);
    });
    return [...set].filter(e => ![...set].some(o => o !== e && o.contains(e)));
  };
  const sections = [...document.querySelectorAll('main section, main nav, footer.site-footer')].filter(s => !s.parentElement.closest('main section'));
  const out = { vw, vh, scrollHeight: document.documentElement.scrollHeight, sections: [] };
  sections.forEach((s, si) => {
    if (only !== undefined && si !== only) return;
    const cs = getComputedStyle(s);
    // content extent
    let minX = 1e9, maxX = -1e9;
    const kids = [...s.querySelectorAll('*')].filter(e => vis(e) && !['svg','path','g','canvas'].includes(e.tagName.toLowerCase()));
    kids.forEach(e => { const r = e.getBoundingClientRect(); if (r.width < vw * 0.98 && r.width > 4) { minX = Math.min(minX, r.left); maxX = Math.max(maxX, r.right); } });
    // descend to blocks
    let box = s; while (box.children.length === 1) box = box.children[0];
    const blocks = [...box.children].filter(vis).map(c => ({ el: name(c), ...R(c), bg: getComputedStyle(c).backgroundColor }));
    blocks.sort((a, b) => a.y - b.y);
    const gaps = []; for (let i = 1; i < blocks.length; i++) gaps.push(blocks[i].y - (blocks[i - 1].y + blocks[i - 1].h));
    const bx = [...blocks].sort((a, b) => a.x - b.x); const hgaps = []; for (let i = 1; i < bx.length; i++) if (bx[i].y < bx[i-1].y + bx[i-1].h && bx[i-1].y < bx[i].y + bx[i].h) hgaps.push(bx[i].x - (bx[i - 1].x + bx[i - 1].w));
    const sr = s.getBoundingClientRect(); const sa = sr.width * sr.height; let effBg = null;
    for (const e of [s, ...s.querySelectorAll('*')]) { const c = getComputedStyle(e).backgroundColor; const m = c.match(/[\d.]+/g); const a = m && m.length > 3 ? +m[3] : (m ? 1 : 0); const r = e.getBoundingClientRect(); if (a > 0.5 && r.width * r.height >= 0.35 * sa) { effBg = c + ' (' + name(e) + ')'; break; } }
    const bigImg = [...s.querySelectorAll('img,video')].find(e => { const r = e.getBoundingClientRect(); return r.width * r.height >= 0.5 * sa; });
    if (!effBg) effBg = 'transparente -> body ' + getComputedStyle(document.body).backgroundColor; if (bigImg) effBg += ' + imagen grande ' + name(bigImg);
    const containers = [...s.querySelectorAll('.container, [class*=grid-12], [class*=__inner]')].slice(0, 3).map(c => { const cc = getComputedStyle(c); return { el: name(c), ...R(c), pl: cc.paddingLeft, pr: cc.paddingRight, maxW: cc.maxWidth, gtc: cc.gridTemplateColumns?.slice(0, 80), gap: cc.columnGap }; });
    const media = [...s.querySelectorAll('img, video, canvas, picture')].filter(vis).map(m => ({ el: name(m), ...R(m), src: (m.currentSrc || m.src || '').split('?')[0].split('/').pop()?.slice(0, 50), fit: getComputedStyle(m).objectFit }));
    const texts = leafText(s).map(textInfo);
    out.sections.push({ si, effBg, hgaps, el: name(s), ...R(s), bg: cs.backgroundColor, bgImg: cs.backgroundImage.slice(0, 80), pt: cs.paddingTop, pb: cs.paddingBottom, pos: cs.position, contentL: Math.round(minX), contentR: Math.round(vw - maxX), contentW: Math.round(maxX - minX), box: name(box), blocks, gaps, containers, media: media.slice(0, 30), texts: texts.slice(0, 80) });
  });
  // header (fixed)
  const hdr = [...document.querySelectorAll('header, .site-header, [class*=site-header]')].filter(vis).slice(0, 3).map(h => ({ el: name(h), ...R(h), pos: getComputedStyle(h).position, bg: getComputedStyle(h).backgroundColor }));
  const hdrItems = [...document.querySelectorAll('header a, header button, .site-header a, .site-header button')].filter(vis).map(e => ({ ...textInfo(e), aria: e.getAttribute('aria-label') }));
  out.header = { hdr, items: hdrItems };
  return out;
};
window.__inView = function () {
  const vh = innerHeight; const c = { headings: 0, paragraphs: 0, images: 0, links: 0 };
  const iv = e => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.bottom > 0 && r.top < vh && r.width > 0 && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0.05; };
  document.querySelectorAll('main h1,main h2,main h3,main h4, footer h2, footer h3').forEach(e => iv(e) && !e.closest('.visually-hidden,.sr-only') && c.headings++);
  document.querySelectorAll('main p, footer p').forEach(e => iv(e) && c.paragraphs++);
  document.querySelectorAll('main img, main canvas, main video, footer img').forEach(e => iv(e) && c.images++);
  document.querySelectorAll('main a, main button, footer a').forEach(e => iv(e) && c.links++);
  return c;
};
