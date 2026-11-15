(function () {
  'use strict';
  /* Cada página abre siempre desde arriba */
  try { history.scrollRestoration = 'manual'; } catch (e) {}
  function toTop() {
    if (location.hash) return;
    if (window.lenisRef) window.lenisRef.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0; document.body.scrollTop = 0;
  }
  toTop();
  document.addEventListener('DOMContentLoaded', toTop);
  window.addEventListener('load', function () { toTop(); setTimeout(toTop, 60); setTimeout(toTop, 300); });
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(pointer: fine)').matches;
  var hasGsap = typeof window.gsap !== 'undefined';
  if (hasGsap && window.ScrollTrigger) { gsap.registerPlugin(ScrollTrigger); try { ScrollTrigger.clearScrollMemory('manual'); } catch (e) {} }
  var store = {
    get: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  /* Scroll suave */
  var lenis = null;
  if (!RM && hasGsap && window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
    window.lenisRef = lenis;
  }
  function scrollY() { return lenis ? lenis.scroll : window.scrollY; }

  /* Cabecera */
  var header = document.querySelector('.site-header');
  var lastY = 0, heroST = null;
  function onScroll() {
    var y = scrollY();
    if (!header) return;
    header.classList.toggle('is-solid', y > 80);
    var menuOpen = document.querySelector('.menu.open');
    var inHero = heroST && y <= heroST.end + 10;   /* en escritorio y tablet, la cabecera no se esconde durante el hero */
    if (!menuOpen) header.classList.toggle('is-hidden', !inHero && y > lastY && y > 260);
    lastY = y;
  }
  if (lenis) lenis.on('scroll', onScroll); else window.addEventListener('scroll', onScroll, { passive: true });

  /* Menú */
  var menu = document.querySelector('.menu');
  document.querySelectorAll('[data-menu]').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = !menu.classList.contains('open');
      menu.classList.toggle('open', open);
      document.querySelectorAll('[data-menu]').forEach(function (x) { x.setAttribute('aria-expanded', String(open)); });
      if (open) { header.classList.remove('is-hidden'); if (lenis) lenis.stop(); var f = menu.querySelector('nav a'); if (f) setTimeout(function () { f.focus(); }, 300); }
      else if (lenis) lenis.start();
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu && menu.classList.contains('open')) { menu.querySelector('[data-menu]').click(); }
  });

  /* Cursor */
  var cursor = document.querySelector('.cursor');
  if (cursor && FINE && hasGsap) {
    cursor.classList.add('on');
    var label = cursor.querySelector('span');
    var qx = gsap.quickTo(cursor, 'x', { duration: 0.25, ease: 'power3.out' });
    var qy = gsap.quickTo(cursor, 'y', { duration: 0.25, ease: 'power3.out' });
    window.addEventListener('pointermove', function (e) { qx(e.clientX); qy(e.clientY); });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor]');
      if (t) { label.textContent = t.getAttribute('data-cursor'); cursor.classList.add('has-label'); }
      else cursor.classList.remove('has-label');
    });
  }

  /* Transición entre páginas */
  var veil = document.querySelector('.veil');
  if (veil && hasGsap) {
    if (store.get('veil') === '1' && !RM) { gsap.set(veil, { opacity: 1 }); gsap.to(veil, { opacity: 0, duration: 0.35, delay: 0.05, ease: 'power2.out' }); }
    store.set('veil', '0');
    document.querySelectorAll('a[data-transition]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        if (RM || e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        store.set('veil', '1');
        var href = a.getAttribute('href');
        gsap.to(veil, { opacity: 1, duration: 0.25, ease: 'power2.in', onComplete: function () { window.location.href = href; } });
      });
    });
  }

  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    if (veil && hasGsap) gsap.set(veil, { opacity: 0 });
    var m = document.querySelector('.menu.open');
    if (m) { m.classList.remove('open'); if (lenis) lenis.start(); }
    toTop();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* Entrada (solo primera visita de la sesión) */
  var intro = document.querySelector('.intro');
  if (intro) {
    if (RM || !hasGsap || store.get('intro') === '1') intro.remove();
    else {
      store.set('intro', '1');
      var shapes = intro.querySelectorAll('img');
      shapes.forEach(function (s, i) {
        s.style.left = (6 + ((i * 37) % 86)) + 'vw';
        s.style.top = (8 + ((i * 53) % 70)) + 'vh';
      });
      var arc = intro.querySelector('path');
      var tl = gsap.timeline({ onComplete: function () { intro.remove(); } });
      tl.from(shapes, { y: '-110vh', rotation: function (i) { return (i % 2 ? 1 : -1) * 40; }, duration: 0.45, ease: 'power3.out', stagger: 0.025 })
        .fromTo(arc, { rotation: -120, transformOrigin: '50% 50%' }, { rotation: 60, duration: 0.45, ease: 'power2.inOut' }, '-=0.1')
        .to(intro, { clipPath: 'inset(0 0 100% 0)', duration: 0.35, ease: 'power3.inOut' }, '-=0.25');
    }
  }

  /* Hero: lema que gira */
  var domeText = document.querySelector('.dome-text');
  if (domeText && hasGsap && !RM) {
    var ang = 0;
    gsap.ticker.add(function (time, dt) {
      var v = lenis ? Math.min(6, Math.abs(lenis.velocity) * 0.08) : 0;
      ang -= (dt / 1000) * 6 * (1 + v);
      domeText.style.transform = 'rotate(' + ang + 'deg)';
    });
  }

  var HAND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0"/><path d="M14 10V4a2 2 0 0 0-4 0v2"/><path d="M10 10.5V6a2 2 0 0 0-4 0v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-6-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.83L7 15"/></svg>';
  /* Hero: objetos en arco */
  var hero = document.querySelector('.hero');
  var orbit = document.querySelector('.orbit');
  if (hero && orbit && hasGsap) {
    var objs = Array.prototype.slice.call(orbit.querySelectorAll('.obj'));
    var wrap = hero.querySelector('.dome-wrap');
    var p = 0, n = objs.length, current = -1;
    var cap = hero.querySelector('.orbit-cap');
    var word = hero.querySelector('.orbit-word'), wordS = word && word.querySelector('span');
    var tag = hero.querySelector('.orbit-tag'), tagD = tag && tag.querySelector('.ot-d');
    function fitWord() {
      if (!wordS) return;
      var W = hero.clientWidth;
      wordS.style.fontSize = Math.min(W * 0.2, 300) + 'px';
      var w = wordS.offsetWidth;
      if (w > W * 0.94) wordS.style.fontSize = (parseFloat(wordS.style.fontSize) * W * 0.94 / w) + 'px';
    }
    function setCap(i) {
      if (i === current) return;
      current = i;
      var o = objs[i];
      if (cap) cap.textContent = o.getAttribute('data-title') + ': ' + o.getAttribute('data-desc');
      if (tag) { tagD.textContent = o.getAttribute('data-desc'); tag.setAttribute('href', o.getAttribute('href')); tag.setAttribute('data-cursor', o.getAttribute('data-cursor')); }
      if (!wordS) return;
      var swap = function () { wordS.textContent = o.getAttribute('data-word'); fitWord(); };
      if (RM) { swap(); return; }
      gsap.to(wordS, { opacity: 0, yPercent: 8, duration: 0.18, overwrite: true, onComplete: function () { swap(); gsap.fromTo(wordS, { opacity: 0, yPercent: -8 }, { opacity: 1, yPercent: 0, duration: 0.4, ease: 'power3.out' }); } });
    }
    var mm = gsap.matchMedia();
    mm.add('(min-width: 700px)', function () {
      orbit.classList.add('is-live');
      var render = function () {
        var W = hero.clientWidth, H = hero.clientHeight;
        hero.style.setProperty('--D', Math.min(W * (W < 1100 ? 1.18 : 0.86), W < 1100 ? 1100 : 1280, H * 1.3) + 'px');
        var D = wrap.offsetWidth, r = D / 2, top = wrap.offsetTop;
        var cx = W / 2, cy = top + r;
        var spacing = W < 1100 ? 30 : 26;
        var base = Math.min(Math.max(150, W * (W < 1100 ? 0.25 : 0.19)), 300, (top - 112) / 1.04);
        var c = p * (n - 1), ci = Math.round(c) % n, g = null;
        objs.forEach(function (o, i) {
          var d = i - c;
          d = ((d + n / 2) % n + n) % n - n / 2;   /* carrusel circular: siempre hay objetos a ambos lados */
          var a = d * spacing;
          var k = Math.min(1, Math.abs(a) / 75);
          var S = base * (1 - 0.42 * k);
          var R = r + S * 0.52;
          var rad = a * Math.PI / 180;
          var x = cx + R * Math.sin(rad) - S / 2;
          var y = cy - R * Math.cos(rad) - S / 2;
          var op = Math.abs(a) > 66 ? Math.max(0, 1 - (Math.abs(a) - 66) / 14) : 1;
          o.style.width = S + 'px'; o.style.height = S + 'px';
          o.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (a * 0.45) + 'deg)';
          o.style.filter = k > 0.12 ? 'blur(' + (k * 3.5).toFixed(2) + 'px)' : 'none';
          o.style.opacity = op;
          o.style.zIndex = String(100 - Math.round(Math.abs(a)));
          o.style.pointerEvents = op > 0.5 ? 'auto' : 'none';
          o.tabIndex = op > 0.5 ? 0 : -1;
          if (i === ci) g = { x: x, y: y, S: S };
        });
        setCap(ci);
        if (g && word) word.style.top = (g.y + g.S * 0.1) + 'px';
        if (g && tag) {
          var tw = tag.offsetWidth, th = tag.offsetHeight;
          var tx = g.x + g.S * 0.92, ty = g.y + g.S * 0.5 - th / 2;
          if (tx + tw > W - 24) tx = g.x + g.S * 0.08 - tw;
          if (tx < 16) { tx = g.x + g.S / 2 - tw / 2; ty = g.y + g.S * 0.96; }
          tag.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
          tag.style.opacity = Math.max(0, 1 - Math.abs(c - Math.round(c)) * 5);
          tag.style.pointerEvents = tag.style.opacity > 0.5 ? 'auto' : 'none';
        }
      };
      fitWord(); render();
      var st = null;
      if (!RM) {
        st = heroST = ScrollTrigger.create({
          trigger: hero, start: 'top top', end: '+=' + (n - 1) * 40 + '%', pin: true, scrub: 0.6,
          snap: { snapTo: 1 / (n - 1), duration: { min: 0.2, max: 0.5 }, delay: 0.08, ease: 'power2.inOut' },
          onUpdate: function (self) { p = self.progress; render(); }
        });
      }
      var onResize = function () { fitWord(); render(); };
      window.addEventListener('resize', onResize);
      return function () { heroST = null; window.removeEventListener('resize', onResize); if (tag) tag.removeAttribute('style'); if (word) word.removeAttribute('style'); hero.style.removeProperty('--D'); orbit.classList.remove('is-live'); window.removeEventListener('resize', render); objs.forEach(function (o) { o.removeAttribute('style'); }); };
    });
    mm.add('(max-width: 699px)', function () {
      orbit.classList.add('is-strip');
      var nearest = function () {
        var mid = orbit.scrollLeft + orbit.clientWidth / 2, best = 0, bd = 1e9;
        objs.forEach(function (o, i) { var dd = Math.abs(o.offsetLeft + o.offsetWidth / 2 - mid); if (dd < bd) { bd = dd; best = i; } });
        setCap(best);
        if (word) word.style.top = (orbit.offsetTop + 6) + 'px';
        if (tag) {
          var tw = tag.offsetWidth;
          tag.style.transform = 'translate(' + (hero.clientWidth / 2 - tw / 2) + 'px,' + (orbit.offsetTop + orbit.offsetHeight - tag.offsetHeight - 2) + 'px)';
          tag.style.opacity = 1; tag.style.pointerEvents = 'auto';
        }
      };
      fitWord();
      var start = function () { orbit.scrollLeft = objs[0].offsetLeft - (orbit.clientWidth - objs[0].offsetWidth) / 2; nearest(); };
      requestAnimationFrame(start);
      window.addEventListener('load', start);
      orbit.addEventListener('scroll', nearest, { passive: true });
      /* Guía de arrastre en la tira del hero (celular) */
      var hc = null, htl = null, hDone = false;
      var killHc = function () {
        hDone = true; if (htl) htl.kill();
        if (hc) gsap.to(hc, { opacity: 0, scale: 0.6, duration: 0.25, onComplete: function () { if (hc) hc.remove(); hc = null; } });
      };
      orbit.addEventListener('pointerdown', killHc);
      orbit.addEventListener('touchstart', killHc, { passive: true });
      if (!RM) setTimeout(function () {
        if (hDone || scrollY > 40) return;
        hc = document.createElement('span');
        hc.className = 'drag-coach';
        hc.setAttribute('aria-hidden', 'true');
        hc.innerHTML = HAND + '<i></i>';
        hero.appendChild(hc);
        var step = objs[1].offsetLeft - objs[0].offsetLeft;
        var x0 = hero.clientWidth * 0.66, y0 = orbit.offsetTop + orbit.offsetHeight * 0.5;
        gsap.set(hc, { x: x0, y: y0, scale: 0.6, zIndex: 30 });
        var dot = hc.querySelector('i');
        htl = gsap.timeline({ onComplete: killHc });
        for (var r = 0; r < 2; r++) {
          htl.set(hc, { x: x0 })
            .to(hc, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
            .to(hc, { scale: 0.86, duration: 0.18 })
            .to(dot, { opacity: 1, duration: 0.1 }, '<')
            .to(hc, { x: x0 - hero.clientWidth * 0.36, duration: 0.9, ease: 'power2.inOut', onStart: function () { if (!hDone) orbit.scrollTo({ left: orbit.scrollLeft + step, behavior: 'smooth' }); } })
            .to(hc, { scale: 1, duration: 0.18 })
            .to(dot, { opacity: 0, duration: 0.15 }, '<')
            .to(hc, { opacity: 0, duration: 0.3, onStart: function () { if (!hDone) orbit.scrollTo({ left: orbit.scrollLeft - step, behavior: 'smooth' }); } }, '+=0.35');
        }
      }, 1400);
      return function () { orbit.classList.remove('is-strip'); orbit.removeEventListener('scroll', nearest); };
    });
  }

  /* Objeto que cae entre las líneas */
  function fallBetween(section, scrub) {
    var title = section.querySelector('.display');
    var obj = section.querySelector('.foco-obj');
    if (!title || !obj || !hasGsap || RM) return;
    var mid = function () { var t = title.getBoundingClientRect(); return (t.top + t.height * 0.5) - (obj.getBoundingClientRect().top + obj.offsetHeight * 0.5); };
    var tl = gsap.timeline(scrub ? { scrollTrigger: { trigger: title, start: 'top 75%', end: 'bottom 25%', scrub: 0.8 } } : { delay: 0.25 });
    tl.fromTo(obj, { y: mid, rotation: -34, scale: 1.1, opacity: 0 }, { y: mid, rotation: -24, scale: 1.06, opacity: 1, ease: 'none', duration: 0.25 })
      .to(obj, { y: 0, rotation: -8, scale: 1, ease: scrub ? 'none' : 'power3.out', duration: 0.75 });
    if (!scrub) tl.duration(1.3);
  }
  document.querySelectorAll('[data-fall="scroll"]').forEach(function (s) { fallBetween(s, true); });
  document.querySelectorAll('[data-fall="load"]').forEach(function (s) { fallBetween(s, false); });

  /* Apariciones suaves */
  if (hasGsap && !RM) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
    document.querySelectorAll('.gel[data-drop]').forEach(function (el) {
      gsap.from(el, { y: -40, scale: 0.4, duration: 0.7, ease: 'back.out(3)', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });
  }

  /* Formulario de cotización: validación en vivo. En producción se conecta al sistema de leads actual (mismos nombres de campo). */
  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    var chk = form.querySelector('[name="aceptaTerminos"]'), chkErr = form.querySelector('.err-chk');
    function check(el) {
      var ok = true, v = (el.value || '').trim();
      if (el.name === 'telefono') ok = v.replace(/\D/g, '').length >= 10;
      else if (el.required) ok = v.length > 1;
      var f = el.closest('.fld'); if (f) f.classList.toggle('is-error', !ok);
      return ok;
    }
    form.querySelectorAll('.fld input, .fld select').forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value) check(el); });
      el.addEventListener('input', function () { var f = el.closest('.fld'); if (f && f.classList.contains('is-error')) check(el); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.website && form.website.value) return;
      var ok = true;
      form.querySelectorAll('.fld input, .fld select').forEach(function (el) { if (!check(el)) ok = false; });
      if (!chk.checked) { ok = false; chkErr.classList.add('is-on'); } else chkErr.classList.remove('is-on');
      if (!ok) { var bad = form.querySelector('.is-error input, .is-error select') || chk; bad.focus(); return; }
      var done = form.querySelector('.cot-ok');
      done.querySelector('.cot-ok-t').textContent = 'Listo, ' + form.nombre.value.trim().split(' ')[0] + '.';
      done.hidden = false;
      if (hasGsap && !RM) gsap.from(done, { opacity: 0, y: 12, duration: 0.4, ease: 'power2.out' });
    });
    chk.addEventListener('change', function () { if (chk.checked) chkErr.classList.remove('is-on'); });
  });

  /* Índice de la guía: marca la sección que se está leyendo */
  document.querySelectorAll('.guia').forEach(function (g) {
    var links = Array.prototype.slice.call(g.querySelectorAll('.guia-index a'));
    if (!links.length || !('IntersectionObserver' in window)) return;
    links.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var t = document.getElementById(a.getAttribute('href').slice(1)); if (!t) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(t, { offset: -110 }); else t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
      });
    });
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) {
        if (!x.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + x.target.id); });
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    links.forEach(function (a) { var t = document.getElementById(a.getAttribute('href').slice(1)); if (t) io.observe(t); });
  });

  /* Carruseles arrastrables: se mueven agarrando y soltando, con inercia */
  document.querySelectorAll('.track, .cards').forEach(function (box) {
    var rail = document.createElement('div');
    rail.className = 'rail';
    while (box.firstChild) rail.appendChild(box.firstChild);
    box.appendChild(rail);
    var items = Array.prototype.slice.call(rail.children).filter(function (n) { return n.nodeType === 1; });
    if (!items.length) return;
    rail.querySelectorAll('a, img').forEach(function (n) { n.setAttribute('draggable', 'false'); });
    var centered = box.classList.contains('track');
    var count = box.id ? document.querySelector('[data-count="' + box.id + '"]') : null;

    var ui = document.createElement('div');
    ui.className = 'drag-ui';
    ui.setAttribute('aria-hidden', 'true');
    ui.innerHTML = '<span class="du-dot"></span><span class="du-bar"><i></i></span><span class="du-hint"><span class="du-arr"><b></b><b></b><b></b></span><span class="du-t">Arrastre</span></span>';
    box.parentNode.insertBefore(ui, box.nextSibling);
    var bar = ui.querySelector('.du-bar i');

    var x = 0, tx = 0, min = 0, snaps = [0];
    var down = false, moved = false, sx = 0, startX = 0, lastX = 0, lastT = 0, vel = 0, idx = -1;

    function measure() {
      var vis = box.clientWidth - parseFloat(getComputedStyle(box).paddingLeft) - parseFloat(getComputedStyle(box).paddingRight);
      min = Math.min(0, vis - rail.scrollWidth);
      snaps = items.map(function (it) {
        var s = centered ? -(it.offsetLeft + it.offsetWidth / 2 - rail.firstElementChild.offsetWidth / 2) : -it.offsetLeft;
        return Math.max(min, Math.min(0, s));
      }).filter(function (v, i, arr) { return i === 0 || Math.abs(v - arr[i - 1]) > 1; });
      if (snaps[snaps.length - 1] > min + 1) snaps.push(min);
      tx = clamp(tx); x = tx;
    }
    function clamp(v) { return Math.max(min, Math.min(0, v)); }
    function nearest(v) {
      var best = snaps[0];
      snaps.forEach(function (s) { if (Math.abs(s - v) < Math.abs(best - v)) best = s; });
      return best;
    }
    function rubber(v) {
      if (v > 0) return v * 0.3;
      if (v < min) return min + (v - min) * 0.3;
      return v;
    }
    function paint() {
      rail.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
      var prog = min < 0 ? x / min : 1;
      bar.style.transform = 'scaleX(' + Math.max(0.06, Math.min(1, prog)).toFixed(3) + ')';
      ui.classList.toggle('to-left', prog > 0.97);
      var i = 0, bd = 1e9;
      snaps.forEach(function (s, k) { var d = Math.abs(s - x); if (d < bd) { bd = d; i = k; } });
      if (count && i !== idx) { idx = i; count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(snaps.length).padStart(2, '0'); }
    }
    function tick() {
      if (down) { x = tx; }
      else {
        var d = tx - x;
        x = Math.abs(d) < 0.05 ? tx : x + d * (RM ? 1 : 0.12);
      }
      paint();
    }
    if (hasGsap) gsap.ticker.add(tick); else (function loop() { tick(); requestAnimationFrame(loop); })();

    box.addEventListener('pointerdown', function (e) {
      if (e.button !== undefined && e.button !== 0) return;
      down = true; moved = false; sx = e.clientX; startX = x; lastX = e.clientX; lastT = performance.now(); vel = 0;
    });
    window.addEventListener('pointermove', function (e) {
      if (!down) return;
      var dx = e.clientX - sx;
      if (!moved && Math.abs(dx) > 6) { moved = true; box.classList.add('is-dragging'); try { box.setPointerCapture(e.pointerId); } catch (er) {} }
      if (!moved) return;
      var now = performance.now(), dt = Math.max(1, now - lastT);
      vel = vel * 0.6 + ((e.clientX - lastX) / dt) * 0.4;
      lastX = e.clientX; lastT = now;
      tx = rubber(startX + dx);
    });
    function release() {
      if (!down) return;
      down = false; box.classList.remove('is-dragging');
      if (!moved) return;
      var proj = clamp(x + vel * 260);
      tx = nearest(proj);
      if (tx === nearest(startX) && Math.abs(vel) > 0.25) {
        var k = snaps.indexOf(tx) + (vel < 0 ? 1 : -1);
        if (snaps[k] !== undefined) tx = snaps[k];
      }
    }
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    box.addEventListener('click', function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } }, true);
    box.addEventListener('dragstart', function (e) { e.preventDefault(); });
    box.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var k = snaps.indexOf(nearest(tx)) + (e.key === 'ArrowRight' ? 1 : -1);
      if (snaps[k] !== undefined) tx = snaps[k];
    });

    measure(); paint();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);

    /* Al entrar en pantalla: una mano agarra el carrusel y lo desliza, para que se entienda que se arrastra */
    var coach = null, coachTl = null, touched = false;
    function stopCoach() {
      touched = true;
      if (coachTl) coachTl.kill();
      if (coach) { if (hasGsap) gsap.to(coach, { opacity: 0, scale: 0.6, duration: 0.25, onComplete: function () { coach.remove(); } }); else coach.remove(); }
    }
    box.addEventListener('pointerdown', stopCoach);
    box.addEventListener('keydown', stopCoach);
    if (min < 0 && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting || touched) return;
        io.disconnect();
        coach = document.createElement('span');
        coach.className = 'drag-coach';
        coach.setAttribute('aria-hidden', 'true');
        coach.innerHTML = HAND + '<i></i>';
        box.appendChild(coach);
        var bw = box.clientWidth, cy = box.clientHeight * (centered ? 0.42 : 0.4);
        var x0 = bw * 0.68, dist = Math.min(220, bw * 0.34);
        var pull = Math.min(dist * 0.9, -min);
        if (!hasGsap || RM) {
          coach.style.transform = 'translate(' + x0 + 'px,' + cy + 'px)';
          coach.style.opacity = 1;
          setTimeout(function () { if (!touched) stopCoach(); }, 2600);
          return;
        }
        gsap.set(coach, { x: x0, y: cy, scale: 0.6 });
        var dot = coach.querySelector('i');
        coachTl = gsap.timeline({ delay: 0.35, onComplete: function () { if (!touched) stopCoach(); touched = false; } });
        for (var r = 0; r < 2; r++) {
          coachTl.set(coach, { x: x0 })
            .to(coach, { opacity: 1, scale: 1, duration: 0.35, ease: 'back.out(2)' })
            .to(coach, { scale: 0.86, duration: 0.18, ease: 'power2.out' })
            .to(dot, { opacity: 1, duration: 0.1 }, '<')
            .to(coach, { x: x0 - dist, duration: 0.9, ease: 'power2.inOut', onStart: function () { if (!down) tx = -pull; } })
            .to(coach, { scale: 1, duration: 0.18 })
            .to(dot, { opacity: 0, duration: 0.15 }, '<')
            .to(coach, { opacity: 0, duration: 0.3, onStart: function () { if (!down && !touched) tx = 0; } }, '+=0.15');
        }
      }, { threshold: 0.55 });
      io.observe(box);
    }
  });

  /* Bloque hogar: Los Colados se van por el arco */
  var stage = document.querySelector('.hogar-stage');
  if (stage && hasGsap) {
    stage.classList.add('is-live');
    var colados = Array.prototype.slice.call(stage.querySelectorAll('.colado'));
    var starts = [0.16, 0.33, 0.5, 0.66, 0.8];
    var q = 0, idle = 0, clock = 0, onScreen = false;
    var P = [[0.02, 1.0], [0.36, 0.98], [0.66, 0.62], [1.04, -0.04]];
    var bez = function (t) {
      var u = 1 - t;
      return [u*u*u*P[0][0] + 3*u*u*t*P[1][0] + 3*u*t*t*P[2][0] + t*t*t*P[3][0], u*u*u*P[0][1] + 3*u*u*t*P[1][1] + 3*u*t*t*P[2][1] + t*t*t*P[3][1]];
    };
    var dots = [];
    for (var i = 0; i <= 64; i++) { var d = document.createElement('span'); d.className = 'dot'; d.setAttribute('aria-hidden', 'true'); stage.insertBefore(d, stage.firstChild); dots.push(d); }
    var place = function () {
      var W = stage.clientWidth, H = stage.clientHeight;
      dots.forEach(function (d, j) { var pt = bez(j / 64); d.style.left = (pt[0] * W) + 'px'; d.style.top = (pt[1] * H) + 'px'; });
      colados.forEach(function (c, j) {
        var t = (starts[j] + q * 0.42 + idle) % 1.08;
        var img = c.querySelector('img');
        var pt = bez(Math.min(t, 1));
        var h = Math.max(64, H * (0.44 - 0.28 * Math.min(t, 1)) * (W < 700 ? 0.78 : 1));
        var ratio = (img.naturalWidth || 340) / (img.naturalHeight || 500);
        var hop = RM ? 0 : Math.abs(Math.sin(clock * 5.2 + j * 1.7)) * h * 0.05;
        var sway = RM ? 0 : Math.sin(clock * 5.2 + j * 1.7) * 3;
        c.style.height = h + 'px';
        c.style.opacity = t < 0.05 ? t / 0.05 : (t > 0.94 ? Math.max(0, (1.04 - t) / 0.1) : 1);
        c.style.transform = 'translate(' + (pt[0] * W - h * ratio / 2) + 'px,' + (pt[1] * H - h - hop) + 'px) rotate(' + (6 + t * 12 + sway) + 'deg)';
      });
    };
    colados.forEach(function (c) { var im = c.querySelector('img'); if (!im.complete) im.addEventListener('load', place); });
    place();
    window.addEventListener('resize', place);
    if (!RM) ScrollTrigger.create({ trigger: stage, start: 'top bottom', end: 'bottom top', scrub: 0.6, onUpdate: function (s) { q = s.progress; place(); } });
    if (!RM) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; }, { threshold: 0.05 }).observe(stage);
      gsap.ticker.add(function (time, dt) {
        if (!onScreen) return;
        clock = time; idle += (dt / 1000) * 0.03;
        place();
      });
    }
  }

  /* Tarjetas que se inclinan */
  if (FINE && !RM) {
    document.querySelectorAll('.card').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        if (card.closest('.is-dragging')) { card.style.transform = ''; return; }
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = 'rotateX(' + (-y * 8).toFixed(2) + 'deg) rotateY(' + (x * 10).toFixed(2) + 'deg) translateY(-6px)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }


  /* Imagen que se abre con el scroll */
  if (hasGsap && !RM) {
    document.querySelectorAll('[data-expand]').forEach(function (f) {
      gsap.fromTo(f, { clipPath: 'inset(0% 7% 0% 7% round 24px)' }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', ease: 'none', scrollTrigger: { trigger: f, start: 'top 90%', end: 'center 55%', scrub: 0.6 } });
    });
  }

  /* Barra de lectura en artículos */
  var article = document.querySelector('.article');
  var prog = document.querySelector('.progress');
  if (article && prog) {
    document.body.classList.add('is-article');
    var upd = function () {
      var r = article.getBoundingClientRect();
      var p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (r.height + window.innerHeight * 0.4)));
      prog.style.transform = 'scaleX(' + p + ')';
    };
    if (lenis) lenis.on('scroll', upd); else window.addEventListener('scroll', upd, { passive: true });
    upd();
  }

  /* Formularios y enlaces simulados del prototipo */
  document.querySelectorAll('a[href="#"]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); }); });

  window.addEventListener('load', function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });

  /* Ajusta titulares: ninguna palabra se sale de su caja */
  var fitCtx = document.createElement('canvas').getContext('2d');
  function widestWord(el, size) {
    var cs = getComputedStyle(el), max = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var ls = parseFloat(cs.letterSpacing) || 0;
    fitCtx.font = cs.fontWeight + ' ' + size + 'px ' + cs.fontFamily;
    while (walker.nextNode()) {
      var n = walker.currentNode, p = n.parentElement;
      if (getComputedStyle(p).fontSize !== cs.fontSize) continue;
      var t = n.textContent;
      if (cs.textTransform === 'uppercase') t = t.toUpperCase();
      t.split(/\s+/).forEach(function (w) {
        if (!w) return;
        var width = fitCtx.measureText(w).width + ls * w.length;
        if (width > max) max = width;
      });
    }
    return max;
  }
  function fitTitles() {
    document.querySelectorAll('.display, h1:not(.sr)').forEach(function (el) {
      el.style.fontSize = '';
      var cs = getComputedStyle(el);
      if (el.clientWidth < 60 || cs.display === 'inline') return;
      var fs = parseFloat(cs.fontSize);
      var avail = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var ratio = avail / widestWord(el, fs);
      if (ratio < 0.97) el.style.fontSize = Math.floor(fs * ratio * 0.98) + 'px';
    });
  }
  fitTitles();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitTitles);
  window.addEventListener('load', fitTitles);
  var fitT; window.addEventListener('resize', function () { clearTimeout(fitT); fitT = setTimeout(fitTitles, 150); });
})();
