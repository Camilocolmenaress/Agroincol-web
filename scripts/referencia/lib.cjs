const { chromium } = require('playwright');
const OUT = '/private/tmp/claude-501/-Users-camilocolmenares-Developer-agroincol-web/5a807af6-7bc3-4846-91e0-f5fb7a7fc8cd/scratchpad/agrumea/escritorio';
const BASE = 'https://www.agrumeafarm.it';
async function launch() { return chromium.launch({ channel: 'chrome', args: ['--hide-scrollbars'] }); }
async function netTrack(page) {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const st = { bytes: 0, n: 0, byType: {}, t0: Date.now(), reqs: {} };
  cdp.on('Network.requestWillBeSent', e => { st.reqs[e.requestId] = { url: e.request.url, type: e.type }; });
  cdp.on('Network.loadingFinished', e => { st.n++; st.bytes += e.encodedDataLength; const t = (st.reqs[e.requestId] || {}).type || '?'; st.byType[t] = (st.byType[t] || 0) + e.encodedDataLength; });
  return st;
}
async function scrollY(page) { return page.evaluate(() => window.lenis ? Math.round(window.lenis.scroll ?? window.scrollY) : Math.round(window.scrollY)); }
// wheel by ~dy px in chunks, then wait until stable
async function wheelBy(page, dy, chunk = 100) {
  const steps = Math.max(1, Math.round(Math.abs(dy) / chunk));
  for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, Math.sign(dy) * chunk); await page.waitForTimeout(16); }
  let last = -1, same = 0;
  for (let i = 0; i < 60 && same < 4; i++) { await page.waitForTimeout(80); const y = await scrollY(page); if (y === last) same++; else { same = 0; last = y; } }
  return last;
}
module.exports = { launch, netTrack, scrollY, wheelBy, OUT, BASE };
const fs = require('fs'), path = require('path');
// CDP screencast: saves every frame with ms timestamp relative to t0 (epoch ms)
async function startCast(page, dir, prefix, opts = {}) {
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = []; let t0 = opts.t0 || Date.now();
  cdp.on('Page.screencastFrame', async f => {
    frames.push({ ts: f.metadata.timestamp * 1000, data: f.data });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {}
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: opts.maxWidth || 1440, maxHeight: opts.maxHeight || 900, everyNthFrame: 1 });
  return {
    setT0: t => { t0 = t; },
    async stop(pick) {
      try { await cdp.send('Page.stopScreencast'); } catch (e) {}
      const list = frames.map(f => ({ t: Math.round(f.ts - t0), data: f.data }));
      const saved = [];
      const targets = pick || list.map(f => f.t);
      for (const tt of targets) {
        let best = null; for (const f of list) { if (f.t <= tt + 20 && (!best || Math.abs(f.t - tt) < Math.abs(best.t - tt))) best = f; }
        if (!best) best = list[0]; if (!best) continue;
        const name = `${prefix}_${String(tt).padStart(5, '0')}ms.jpg`;
        fs.writeFileSync(path.join(dir, name), Buffer.from(best.data, 'base64'));
        saved.push({ want: tt, got: best.t, file: name });
      }
      return { n: list.length, times: list.map(f => f.t), saved };
    }
  };
}
module.exports.startCast = startCast;
// sampler injected into page: records per-rAF transforms for selector list
module.exports.SAMPLER = `
window.__parse = (el) => { if (!el) return null; const cs = getComputedStyle(el); const m = cs.transform; let a=1,b=0,c=0,d=1,e=0,f=0; if (m && m !== 'none') { const v = m.match(/-?[\\d.e-]+/g).map(Number); if (v.length === 6) [a,b,c,d,e,f] = v; else if (v.length === 16) { a=v[0];b=v[1];c=v[4];d=v[5];e=v[12];f=v[13]; } } const r = el.getBoundingClientRect(); return { tx: +e.toFixed(1), ty: +f.toFixed(1), s: +Math.hypot(a,b).toFixed(3), rot: +(Math.atan2(b,a)*180/Math.PI).toFixed(2), op: +(+cs.opacity).toFixed(3), cx: Math.round(r.left + r.width/2), cy: Math.round(r.top + r.height/2), w: Math.round(r.width) }; };
window.__startSample = (sels) => { window.__samples = []; window.__sampling = true; const t0 = performance.now(); const loop = () => { if (!window.__sampling) return; const row = { t: Math.round(performance.now() - t0) }; for (const [k, s] of Object.entries(sels)) { const els = [...document.querySelectorAll(s)]; row[k] = els.length > 1 ? els.map(window.__parse) : window.__parse(els[0]); } window.__samples.push(row); requestAnimationFrame(loop); }; requestAnimationFrame(loop); };
window.__stopSample = () => { window.__sampling = false; return window.__samples; };
`;
// screencast -> mp4 with real timing + optional picked stills
const { execFileSync } = require('child_process');
async function castClip(page, dir, name) {
  fs.mkdirSync(dir, { recursive: true });
  const cdp = await page.context().newCDPSession(page);
  const frames = []; let t0 = Date.now(); const marks = [];
  cdp.on('Page.screencastFrame', async f => { frames.push({ ts: f.metadata.timestamp * 1000, data: f.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 70, maxWidth: 1440, maxHeight: 900, everyNthFrame: 1 });
  return {
    reset() { t0 = Date.now(); },
    mark(label) { marks.push([Date.now() - t0, label]); },
    async stop(pick = []) {
      try { await cdp.send('Page.stopScreencast'); } catch (e) {}
      await cdp.detach().catch(() => {});
      const list = frames.map(f => ({ t: Math.round(f.ts - t0), data: f.data })).filter(f => f.t > -300);
      const tmp = path.join(dir, '.tmp_' + name); fs.mkdirSync(tmp, { recursive: true });
      let txt = '';
      list.forEach((f, i) => { const fn = path.join(tmp, `${String(i).padStart(5, '0')}.jpg`); fs.writeFileSync(fn, Buffer.from(f.data, 'base64')); const nxt = list[i + 1] ? list[i + 1].t : f.t + 500; txt += `file '${fn}'\nduration ${Math.max(0.008, (nxt - f.t) / 1000).toFixed(3)}\n`; });
      if (list.length) { txt += `file '${path.join(tmp, String(list.length - 1).padStart(5, '0') + '.jpg')}'\n`; fs.writeFileSync(path.join(tmp, 'l.txt'), txt);
        try { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'l.txt'), '-vf', 'scale=1280:-2,fps=30', '-pix_fmt', 'yuv420p', '-c:v', 'libx264', '-crf', '26', path.join(dir, name + '.mp4')]); } catch (e) { console.log('ffmpeg err', e.message.slice(0, 200)); } }
      const saved = [];
      for (const tt of pick) { let best = null; for (const f of list) { if (f.t <= tt + 20 && (!best || Math.abs(f.t - tt) < Math.abs(best.t - tt))) best = f; } if (!best) best = list[0]; if (!best) continue; const fn = `${name}_${String(tt).padStart(5, '0')}ms.jpg`; fs.writeFileSync(path.join(dir, fn), Buffer.from(best.data, 'base64')); saved.push(fn); }
      fs.rmSync(tmp, { recursive: true, force: true });
      return { n: list.length, marks, saved };
    }
  };
}
function sheet(dir, files, out, cols = 5, w = 576) { try { execFileSync('magick', ['montage', '-font', '/System/Library/Fonts/Helvetica.ttc', '-pointsize', '18', '-fill', 'white', '-label', '%t', ...files.map(f => path.join(dir, f)), '-tile', cols + 'x', '-geometry', `${w}x${Math.round(w * 0.625)}+4+4`, '-background', '#222', path.join(dir, out)]); } catch (e) { console.log('montage err', e.message.slice(0, 200)); } }
module.exports.castClip = castClip; module.exports.sheet = sheet;
