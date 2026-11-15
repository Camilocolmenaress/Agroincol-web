#!/usr/bin/env node
// Prueba de funcionamiento del sitio rediseñado (lo que la comparación de píxeles no ve):
// movimiento, navegación con velo, menú, formulario (interceptado: no se envían leads reales),
// herramientas, guía, accesibilidad básica y versiones sin movimiento / sin JavaScript.
// Uso: NODE_PATH=<playwright> [VERCEL_JWT=…] node scripts/rediseno/probar-funcionamiento.cjs [base] [chromium|webkit]
const pw = require('playwright');
const BASE = (process.argv[2] || 'http://localhost:3200').replace(/\/$/, '');
const MOTOR = process.argv[3] || 'chromium';
const resultados = [];
const ok = (nombre, cond, detalle = '') => {
  resultados.push({ nombre, ok: !!cond, detalle });
  console.log(`${cond ? 'OK   ' : 'FALLA'} ${nombre}${detalle ? '  — ' + detalle : ''}`);
};

(async () => {
  const b = MOTOR === 'webkit' ? await pw.webkit.launch() : await pw.chromium.launch({ channel: 'chrome' });
  const errores = [];
  const nueva = async (opts = {}) => {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, ...opts });
    // Preview protegido de Vercel: VERCEL_JWT=<cookie _vercel_jwt> (se obtiene abriendo el enlace con _vercel_share).
    // La barra de Vercel (vercel.live) solo se inyecta en los previews; agroincol.com no la carga.
    // Se bloquea para medir lo que ve un visitante.
    await ctx.route(/vercel\.live/, (r) => r.abort());
    if (process.env.VERCEL_JWT) await ctx.addCookies([{ name: '_vercel_jwt', value: process.env.VERCEL_JWT, url: BASE }]);
    const p = await ctx.newPage();
    p.on('pageerror', (e) => errores.push(e.message + ' @ ' + p.url()));
    p.on('console', (m) => m.type() === 'error' && !/insights|speed-insights|Failed to load resource/.test(m.text()) && errores.push(m.text().slice(0, 80) + ' @ ' + p.url()));
    return { ctx, p };
  };

  // 1. Inicio en escritorio: carrusel del hero fijado, cambia de objeto con el scroll y se acomoda.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1500);
    const palabra0 = await p.textContent('.orbit-word span').catch(() => null);
    const live = await p.evaluate(() => document.querySelector('.orbit')?.classList.contains('is-live'));
    ok('Inicio: carrusel del hero activo en escritorio', live);
    await p.mouse.move(720, 500);
    for (let i = 0; i < 6; i++) {
      await p.mouse.wheel(0, 200);
      await p.waitForTimeout(120);
    }
    await p.waitForTimeout(1800);
    const palabra1 = await p.textContent('.orbit-word span').catch(() => null);
    ok('Inicio: al bajar cambia el objeto central y su palabra', palabra0 && palabra1 && palabra0 !== palabra1, `${palabra0} → ${palabra1}`);
    const fijado = await p.evaluate(() => {
      const h = document.querySelector('.hero');
      return h ? Math.abs(h.getBoundingClientRect().top) < 2 : false;
    });
    ok('Inicio: el hero queda fijado mientras gira', fijado);
    const cabecera = await p.evaluate(() => !document.querySelector('.site-header')?.classList.contains('is-hidden'));
    ok('Inicio: la cabecera no se esconde durante el hero', cabecera);
    // Lema girando
    const r1 = await p.evaluate(() => document.querySelector('.dome-text')?.style.transform);
    await p.waitForTimeout(500);
    const r2 = await p.evaluate(() => document.querySelector('.dome-text')?.style.transform);
    ok('Inicio: el lema gira', r1 && r2 && r1 !== r2);
    await ctx.close();
  }

  // 2. Inicio en celular: tira deslizable con la mano de arrastre.
  {
    const { ctx, p } = await nueva({ viewport: { width: 390, height: 844 }, isMobile: MOTOR !== 'webkit', hasTouch: true });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(2200);
    const tira = await p.evaluate(() => document.querySelector('.orbit')?.classList.contains('is-strip'));
    ok('Inicio celular: el carrusel es una tira deslizable', tira);
    const mano = await p.evaluate(() => !!document.querySelector('.hero .drag-coach'));
    ok('Inicio celular: aparece la mano de arrastre', mano);
    await ctx.close();
  }

  // 3. Galería y otros servicios: arrastrar con inercia y acomodo; el trackpad horizontal no los mueve.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/servicios/fumigacion-residencial', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1200);
    const cards = await p.$('.cards');
    await cards.scrollIntoViewIfNeeded();
    await p.waitForTimeout(3500); // deja pasar la mano de arrastre
    const caja = await cards.boundingBox();
    const x0 = await p.evaluate(() => getComputedStyle(document.querySelector('.cards .rail')).transform);
    await p.mouse.move(caja.x + caja.width * 0.7, caja.y + caja.height / 2);
    await p.mouse.down();
    for (let k = 1; k <= 12; k++) {
      await p.mouse.move(caja.x + caja.width * 0.7 - 25 * k, caja.y + caja.height / 2);
      await p.waitForTimeout(16);
    }
    await p.mouse.up();
    await p.waitForTimeout(1500);
    const x1 = await p.evaluate(() => getComputedStyle(document.querySelector('.cards .rail')).transform);
    ok('Otros servicios: se arrastra', x0 !== x1, `${x0} → ${x1}`);
    await p.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
    await p.mouse.wheel(300, 0);
    await p.waitForTimeout(800);
    const x2 = await p.evaluate(() => getComputedStyle(document.querySelector('.cards .rail')).transform);
    ok('Otros servicios: el scroll horizontal del trackpad no lo mueve', x1 === x2);
    const ui = await p.evaluate(() => !!document.querySelector('.otros .drag-ui'));
    ok('Otros servicios: indicador debajo del carrusel', ui);
    await ctx.close();
  }

  // 4. Menú: abre, Esc cierra; navegación con velo y la página abre arriba.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/blog', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await p.click('.site-header [data-menu]');
    await p.waitForTimeout(500);
    ok('Menú: abre', await p.evaluate(() => document.querySelector('.menu')?.classList.contains('open')));
    await p.keyboard.press('Escape');
    await p.waitForTimeout(400);
    ok('Menú: Esc lo cierra', await p.evaluate(() => !document.querySelector('.menu')?.classList.contains('open')));
    await p.evaluate(() => window.scrollTo(0, 1200));
    await p.click('.site-header [data-menu]');
    await p.waitForTimeout(500);
    await p.evaluate(() => {
      window.__veloMax = 0;
      const v = document.querySelector('.veil');
      const t = () => { window.__veloMax = Math.max(window.__veloMax, Number(getComputedStyle(v).opacity)); if (performance.now() - t0 < 1500) requestAnimationFrame(t); };
      const t0 = performance.now();
      requestAnimationFrame(t);
    });
    await p.click('.menu nav a[href="/zonas"]');
    await p.waitForTimeout(400);
    const velo = await p.evaluate(() => window.__veloMax).catch(() => 0);
    ok('Navegación: el velo verde cubre al cambiar de página', velo > 0.3, `opacidad ${velo}`);
    await p.waitForURL('**/zonas');
    await p.waitForTimeout(1200);
    ok('Navegación: llega a /zonas sin recargar y abre arriba', (await p.evaluate(() => window.scrollY)) < 5);
    ok('Navegación: el menú queda cerrado', await p.evaluate(() => !document.querySelector('.menu')?.classList.contains('open')));
    ok('Navegación: el velo se va', (await p.evaluate(() => Number(getComputedStyle(document.querySelector('.veil')).opacity))) < 0.05);
    await p.goBack();
    await p.waitForURL('**/blog');
    await p.waitForTimeout(1000);
    ok('Navegación: Atrás vuelve al blog', p.url().endsWith('/blog'));
    await ctx.close();
  }

  // 5. Formulario: valida en vivo y envía al sistema de leads con los mismos campos (interceptado).
  {
    const { ctx, p } = await nueva();
    await p.addInitScript(() => { window.dataLayer = []; });
    let enviado = null;
    await p.route('**/api/contact', async (route) => {
      enviado = JSON.parse(route.request().postData() || '{}');
      await route.fulfill({ status: 200, contentType: 'application/json', body: '{"success":true}' });
    });
    await p.goto(BASE + '/servicios/desratizacion', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const form = p.locator('form[data-lead-form]');
    await form.scrollIntoViewIfNeeded();
    await form.locator('button[type=submit]').click();
    await p.waitForTimeout(300);
    ok('Formulario: marca los errores si está vacío', (await p.locator('form[data-lead-form] .is-error').count()) >= 2);
    ok('Formulario: el servicio viene preseleccionado', (await form.locator('select[name=tipoServicio]').inputValue()) === 'Desratización');
    await form.locator('input[name=nombre]').fill('Prueba Automática');
    await form.locator('input[name=telefono]').fill('3001234567');
    await form.locator('input[name=aceptaTerminos]').check();
    await form.locator('button[type=submit]').click();
    await p.waitForTimeout(800);
    ok('Formulario: envía a /api/contact', !!enviado);
    ok(
      'Formulario: mismos campos y formId de antes',
      enviado && enviado.nombre === 'Prueba Automática' && enviado.telefono === '3001234567' && enviado.tipoServicio === 'Desratización' && enviado.aceptaTerminos === true && enviado.formId === 'desratizacion-contact' && enviado.page === '/servicios/desratizacion' && 'website' in enviado,
      JSON.stringify(enviado)
    );
    ok('Formulario: muestra el mensaje de éxito', await p.evaluate(() => !document.querySelector('.cot-ok')?.hidden));
    const dl = await p.evaluate(() => (window.dataLayer || []).some((e) => e.event === 'form_submission' && e.form_id === 'desratizacion-contact'));
    ok('Formulario: evento form_submission en dataLayer (GTM)', dl);
    await ctx.close();
  }

  // 6. Herramientas.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/herramientas/calculadora-fumigacion', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    for (let i = 0; i < 5; i++) {
      const b1 = p.locator('#calc fieldset:not([hidden]) button').first();
      await b1.click();
      await p.waitForTimeout(150);
    }
    ok('Calculadora: da un resultado', await p.evaluate(() => !document.getElementById('calc-result')?.hidden && /Cada/.test(document.getElementById('calc-freq')?.textContent || '')));
    ok('Calculadora: lleva al servicio y a WhatsApp', await p.evaluate(() => /^\/servicios\//.test(document.getElementById('calc-srv')?.getAttribute('href') || '') && /wa\.me/.test(document.getElementById('calc-wa')?.getAttribute('href') || '')));
    await p.goto(BASE + '/herramientas/plaga', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    await p.locator('#plaga .sign').first().click();
    await p.waitForTimeout(300);
    ok('¿Qué plaga tengo?: identifica la plaga', await p.evaluate(() => !document.getElementById('plaga-result')?.hidden && (document.getElementById('plaga-name')?.textContent || '').length > 2));
    await p.goto(BASE + '/herramientas/checklist', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const n = await p.locator('#checklist input').count();
    for (let i = 0; i < n; i++) await p.locator('#checklist input').nth(i).check();
    ok('Antes de fumigar: la lista se completa', await p.evaluate(() => !document.getElementById('ck-done')?.hidden));
    await ctx.close();
  }

  // 7. Guía completa: el índice marca la sección y lleva a ella.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/zonas/fumigacion-bucaramanga', { waitUntil: 'networkidle' });
    await p.waitForTimeout(1000);
    const enlaces = p.locator('.guia-index a');
    const n = await enlaces.count();
    if (n > 1) {
      await p.locator('.guia').scrollIntoViewIfNeeded();
      await p.waitForTimeout(600);
      await enlaces.nth(1).click();
      await p.waitForTimeout(1800);
      const activo = await p.evaluate(() => document.querySelector('.guia-index a.is-on')?.getAttribute('href'));
      ok('Guía: el índice lleva a la sección y la marca', !!activo, activo || '');
    } else ok('Guía: índice presente', false, 'sin enlaces');
    await ctx.close();
  }

  // 8. Reducir movimiento: sin hero fijado, todo legible.
  {
    const { ctx, p } = await nueva({ reducedMotion: 'reduce' });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    await p.waitForTimeout(800);
    const pin = await p.evaluate(() => !!document.querySelector('.pin-spacer'));
    ok('Reducir movimiento: el hero no se fija', !pin);
    const lenis = await p.evaluate(() => document.documentElement.classList.contains('lenis'));
    ok('Reducir movimiento: sin scroll suave (Lenis)', !lenis);
    await ctx.close();
  }

  // 9. Sin JavaScript: el contenido y los enlaces están en el HTML.
  {
    const { ctx, p } = await nueva({ javaScriptEnabled: false });
    await p.goto(BASE + '/servicios/fumigacion-restaurantes', { waitUntil: 'load' });
    const h1 = await p.textContent('h1');
    const formulario = await p.locator('form[data-lead-form]').count();
    ok('Sin JS: H1, contenido y formulario en el HTML', !!h1 && formulario === 1, h1?.replace(/\s+/g, ' ').trim());
    await ctx.close();
  }

  // 10. Teclado: el enlace "Saltar al contenido" y el foco visible.
  {
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/precios', { waitUntil: 'networkidle' });
    await p.keyboard.press(MOTOR === 'webkit' ? 'Alt+Tab' : 'Tab'); // Safari: Tab solo enfoca campos; Opción+Tab recorre enlaces
    const primero = await p.evaluate(() => document.activeElement?.textContent?.trim());
    ok('Teclado: el primer Tab es "Saltar al contenido"', /Saltar al contenido/.test(primero || ''), primero || '');
    await ctx.close();
  }

  // 12. Cambios del 15-nov.
  {
    // La casilla de autorización no se mueve cuando aparece el error del teléfono.
    const { ctx, p } = await nueva();
    await p.route('**/api/contact', (r) => r.fulfill({ status: 200, body: '{}' }));
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const f = p.locator('form[data-lead-form]');
    await f.scrollIntoViewIfNeeded();
    await p.waitForTimeout(1500);
    await f.locator('input[name=telefono]').fill('300 12');
    const caja = f.locator('input[name=aceptaTerminos]');
    const antes = (await caja.boundingBox()).y;
    await f.locator('input[name=nombre]').focus(); // el teléfono pierde el foco: aparece su error
    await p.waitForTimeout(300);
    const despues = (await caja.boundingBox()).y;
    const errorVisible = await p.evaluate(() => getComputedStyle(document.querySelector('form[data-lead-form] .is-error .err')).visibility === 'visible');
    ok('Formulario: el error del teléfono aparece y la casilla no se mueve', errorVisible && Math.abs(antes - despues) < 0.5, `${antes.toFixed(1)} → ${despues.toFixed(1)}`);
    await caja.click();
    ok('Formulario: el clic en la casilla no se pierde', await caja.isChecked());
    await ctx.close();
  }
  {
    // "Dejar una reseña en Google" en "Lo que dicen", con click_resena.
    const { ctx, p } = await nueva();
    await ctx.route(/g\.page|google\.com/, (r) => r.abort());
    await p.addInitScript(() => { window.dataLayer = []; });
    await p.goto(BASE + '/', { waitUntil: 'networkidle' });
    const a = p.locator('.voces a[data-resena]');
    const href = await a.getAttribute('href');
    await a.evaluate((el) => { el.addEventListener('click', (e) => e.preventDefault(), { once: true }); el.click(); });
    const ev = await p.evaluate(() => (window.dataLayer || []).find((e) => e.event === 'click_resena'));
    ok('Reseña: enlace en "Lo que dicen" con el evento click_resena', /g\.page\/r\/Cd-hRhdI2eRIEBM\/review/.test(href || '') && ev && ev.destino === 'google_review', href || '');
    await ctx.close();
  }
  {
    // Texto recuperado: preguntas frecuentes completas (y su esquema) y guía de la calculadora.
    const { ctx, p } = await nueva();
    await p.goto(BASE + '/servicios/control-chinches', { waitUntil: 'networkidle' });
    const vis = await p.locator('.faq details').count();
    const esquema = await p.evaluate(() => [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => JSON.parse(s.textContent)).find((j) => j['@type'] === 'FAQPage')?.mainEntity.length);
    ok('Texto recuperado: chinches con sus 6 preguntas y el mismo número en FAQPage', vis === 6 && esquema === 6, `${vis} visibles, ${esquema} en el esquema`);
    await p.goto(BASE + '/herramientas/calculadora-fumigacion', { waitUntil: 'load' });
    const h2 = await p.locator('.guia h2').count();
    ok('Texto recuperado: la calculadora tiene su guía completa', h2 === 3, `${h2} secciones`);
    await ctx.close();
  }
  {
    // En celular el carrusel empieza en "Hogar", con y sin reducir movimiento.
    for (const rm of ['no-preference', 'reduce']) {
      const { ctx, p } = await nueva({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: rm });
      // Se lee al arrancar: después la mano de arrastre hace su demostración (Hogar ↔ Restaurantes).
      await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
      await p.waitForFunction(() => document.querySelector('.orbit')?.classList.contains('is-strip'));
      await p.waitForTimeout(300);
      const palabra = await p.textContent('.orbit-word span');
      ok(`Inicio celular (${rm}): el carrusel empieza en Hogar`, (palabra || '').trim() === 'Hogar', palabra || '');
      await ctx.close();
    }
  }

  // 11. 404 con el diseño del sitio.
  {
    const { ctx, p } = await nueva();
    const r = await p.goto(BASE + '/pagina-que-no-existe', { waitUntil: 'networkidle' });
    ok('404: responde 404 con cabecera y pie del sitio', r.status() === 404 && (await p.locator('.site-header').count()) === 1 && (await p.locator('.site-footer').count()) === 1);
    await ctx.close();
  }

  ok('Consola sin errores en todas las pruebas', errores.length === 0, errores.slice(0, 3).join(' | '));
  const fallas = resultados.filter((r) => !r.ok).length;
  console.log(`\n${resultados.length - fallas}/${resultados.length} pruebas OK (${MOTOR}).`);
  await b.close();
  process.exitCode = fallas ? 1 : 0;
})();
