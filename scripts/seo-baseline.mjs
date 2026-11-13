#!/usr/bin/env node
// Línea base de SEO del rediseño.
//
// Recorre cada URL de app/sitemap.ts (más EXTRA) contra un servidor local de PRODUCCIÓN
// (`next build && next start`) y guarda, por URL, lo que no puede cambiar sin aprobación:
// title, description, canonical, hreflang, robots, Open Graph/Twitter, H1-H3 en orden,
// JSON-LD, enlaces, alt de imágenes y conteo de palabras de <main>.
//
// Usa el HTML que entrega el servidor (fetch, sin navegador): lo que no esté aquí no existe
// sin JavaScript. Por eso también sirve de prueba de la regla "nada depende de JS para existir".
//
// Cada enlace, alt y título va etiquetado por región (cabecera, main, pie, otro). La fase 1
// cambia cabecera y pie en todas las URLs: así el diff dice dónde cambió cada cosa.
//
// Uso:
//   node scripts/seo-baseline.mjs                       → guarda docs/rediseno/seo-baseline.json
//   node scripts/seo-baseline.mjs --compare             → compara contra la línea base (sale 1 si hay diferencias)
//   node scripts/seo-baseline.mjs --out otra.json       → guarda en otro archivo
//   node scripts/seo-baseline.mjs --base http://localhost:3201   (main en un worktree, para regenerar la línea base)
//   node scripts/seo-baseline.mjs --compare --solo-main → ignora cabecera y pie en el diff
//
// Cambios aprobados: docs/rediseno/seo-cambios-aprobados.json. Cada entrada es
//   { "fase": "...", "ruta": "*" | "/ruta", "tipo": "enlace" | "heading" | "img", "cambio": "+" | "-", "item": {...} }
// y saca ese cambio del diff. Lo que no esté en esa lista cuenta como diferencia.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseDocument } from 'htmlparser2';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DEFAULT_OUT = resolve(ROOT, 'docs/rediseno/seo-baseline.json');
const PROD = 'https://agroincol.com';
// Fuera del sitemap pero vigiladas:
// - /resena: dentro del rediseño (fase 5). Es noindex: se vigila que lo siga siendo.
// - Landings de pauta: fuera del rediseño. Cualquier diferencia aquí es una regresión.
const EXTRA = [
  '/resena',
  '/lp/chinches', '/lp/comejen', '/lp/restaurantes',
  '/ecogel', '/ecogel/hogar', '/ecogel/restaurantes', '/ecogel/terminos',
  '/tienda/laminas-de-captura', '/tienda/terminos',
];

const args = process.argv.slice(2);
const flag = (n) => args.includes(n);
const opt = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
const BASE = opt('--base', 'http://localhost:3200').replace(/\/$/, '');
const OUT = resolve(opt('--out', DEFAULT_OUT));
const COMPARE = flag('--compare');
const SOLO_MAIN = flag('--solo-main');
const APROBADOS_PATH = resolve(ROOT, 'docs/rediseno/seo-cambios-aprobados.json');
let APROBADOS = [];
try { APROBADOS = JSON.parse(readFileSync(APROBADOS_PATH, 'utf8')).cambios ?? []; } catch {}
const aprobado = (ruta, tipo, cambio, k) =>
  APROBADOS.some((a) => (a.ruta === '*' || a.ruta === ruta) && a.tipo === tipo && a.cambio === cambio && key(a.item) === k);

// ---------- utilidades de DOM ----------
const SKIP = new Set(['script', 'style', 'noscript', 'template', 'svg']);
const norm = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const isTag = (n) => n.type === 'tag' || n.type === 'script' || n.type === 'style';

function walk(node, fn, ancestors = []) {
  for (const c of node.children ?? []) {
    if (!isTag(c)) continue;
    fn(c, ancestors);
    walk(c, fn, [...ancestors, c]);
  }
}

function text(node) {
  if (node.type === 'text') return node.data;
  if (!isTag(node) || SKIP.has(node.name)) return node.type === 'tag' && node.name === 'br' ? ' ' : '';
  if (node.name === 'br') return ' ';
  return (node.children ?? []).map(text).join(' ');
}

function region(ancestors, node) {
  const chain = [...ancestors, node];
  if (chain.some((a) => a.name === 'main')) return 'main';
  if (chain.some((a) => a.name === 'footer')) return 'pie';
  if (chain.some((a) => a.name === 'nav' || a.name === 'header')) return 'cabecera';
  return 'otro';
}

function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]));
  }
  return v;
}

const words = (s) => norm(s).split(' ').filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// ---------- extracción ----------
function extract(html, headers) {
  const doc = parseDocument(html);
  const r = {
    title: null,
    description: null,
    canonical: null,
    hreflang: [],
    robots: null,
    xRobotsTag: headers.get('x-robots-tag'),
    social: {},
    headings: [],
    jsonLd: [],
    links: [],
    images: [],
    mainWords: 0,
  };
  let main = null;
  let inHead = false;

  walk(doc, (n, anc) => {
    const a = n.attribs ?? {};
    inHead = anc.some((x) => x.name === 'head');
    if (n.name === 'title' && inHead && r.title === null) r.title = norm(text(n));
    if (n.name === 'meta') {
      const key = a.name ?? a.property;
      if (key === 'description') r.description = norm(a.content);
      else if (key === 'robots') r.robots = norm(a.content);
      else if (key && /^(og|twitter):/.test(key)) {
        r.social[key] = r.social[key] ? [].concat(r.social[key], norm(a.content)) : norm(a.content);
      }
    }
    if (n.name === 'link') {
      const rel = (a.rel ?? '').toLowerCase();
      if (rel === 'canonical') r.canonical = a.href;
      if (rel === 'alternate' && a.hreflang) r.hreflang.push(`${a.hreflang} → ${a.href}`);
    }
    if (/^h[1-3]$/.test(n.name)) {
      r.headings.push({ nivel: n.name, region: region(anc, n), texto: norm(text(n)) });
    }
    if (n.name === 'script' && (a.type ?? '') === 'application/ld+json') {
      const raw = (n.children ?? []).map((c) => c.data ?? '').join('');
      try {
        r.jsonLd.push(sortKeys(JSON.parse(raw)));
      } catch {
        r.jsonLd.push({ __error_json_invalido: norm(raw).slice(0, 200) });
      }
    }
    if (n.name === 'a' && a.href !== undefined) {
      const href = a.href.startsWith(PROD) ? a.href.slice(PROD.length) || '/' : a.href;
      const t = norm(text(n)) || norm(a['aria-label']) || '';
      r.links.push({ region: region(anc, n), href, texto: t });
    }
    if (n.name === 'img') {
      r.images.push({ region: region(anc, n), alt: a.alt === undefined ? null : norm(a.alt) });
    }
    if (n.name === 'main' && !main) main = n;
  });

  r.hreflang.sort();
  r.mainWords = main ? words(text(main)) : 0;
  return r;
}

// ---------- URLs ----------
function urls() {
  const src = readFileSync(resolve(ROOT, 'app/sitemap.ts'), 'utf8');
  const fromSitemap = [...src.matchAll(/url:\s*'([^']+)'/g)].map((m) => m[1].replace(PROD, '') || '/');
  return [...new Set([...fromSitemap, ...EXTRA])];
}

async function snapshot() {
  const out = { generado: new Date().toISOString(), base: BASE, paginas: {} };
  for (const path of urls()) {
    const res = await fetch(BASE + path, { redirect: 'manual', headers: { 'user-agent': 'agroincol-seo-baseline' } });
    const html = await res.text();
    out.paginas[path] = { status: res.status, ...extract(html, res.headers) };
    process.stderr.write(`${res.status} ${path}\n`);
  }
  return out;
}

// ---------- comparación ----------
const filtra = (lista) => (SOLO_MAIN ? lista.filter((x) => x.region === 'main') : lista);
const key = (x) => JSON.stringify(x);

function diffLista(nombre, a, b, ruta) {
  const sa = a.map(key);
  const sb = b.map(key);
  const out = [];
  if (sa.join('\n') === sb.join('\n')) return out;
  const fa = new Map(), fb = new Map();
  sa.forEach((k) => fa.set(k, (fa.get(k) ?? 0) + 1));
  sb.forEach((k) => fb.set(k, (fb.get(k) ?? 0) + 1));
  let aprob = 0;
  for (const [k, n] of fa) for (let i = fb.get(k) ?? 0; i < n; i++) {
    if (aprobado(ruta, nombre, '-', k)) aprob++; else out.push(`  - ${nombre} quitado: ${k}`);
  }
  for (const [k, n] of fb) for (let i = fa.get(k) ?? 0; i < n; i++) {
    if (aprobado(ruta, nombre, '+', k)) aprob++; else out.push(`  + ${nombre} nuevo:   ${k}`);
  }
  if (!out.length && !aprob) out.push(`  ~ ${nombre}: mismo contenido, distinto orden`);
  return out;
}

function compare(antes, ahora) {
  const lineas = [];
  const paths = new Set([...Object.keys(antes.paginas), ...Object.keys(ahora.paginas)]);
  for (const p of paths) {
    const a = antes.paginas[p], b = ahora.paginas[p];
    const d = [];
    if (!a || !b) { lineas.push(`${p}: ${!a ? 'URL nueva' : 'URL desaparecida'}`); continue; }
    for (const campo of ['status', 'title', 'description', 'canonical', 'robots', 'xRobotsTag', 'mainWords']) {
      if (a[campo] !== b[campo]) d.push(`  ~ ${campo}: ${JSON.stringify(a[campo])} → ${JSON.stringify(b[campo])}`);
    }
    for (const campo of ['hreflang', 'jsonLd']) d.push(...diffLista(campo, a[campo], b[campo], p));
    if (key(sortKeys(a.social)) !== key(sortKeys(b.social))) d.push(`  ~ social: ${key(a.social)} → ${key(b.social)}`);
    d.push(...diffLista('heading', filtra(a.headings), filtra(b.headings), p));
    d.push(...diffLista('enlace', filtra(a.links), filtra(b.links), p));
    d.push(...diffLista('img', filtra(a.images), filtra(b.images), p));
    if (d.length) lineas.push(`${p}\n${d.join('\n')}`);
  }
  return lineas;
}

// ---------- main ----------
const actual = await snapshot();
if (COMPARE) {
  const base = JSON.parse(readFileSync(DEFAULT_OUT, 'utf8'));
  const diffs = compare(base, actual);
  if (!diffs.length) {
    console.log(`SEO: 0 diferencias sin aprobar en ${Object.keys(actual.paginas).length} URLs${SOLO_MAIN ? ' (solo <main>)' : ''} · ${APROBADOS.length} cambio(s) aprobado(s) en ${APROBADOS_PATH.replace(ROOT + '/', '')}.`);
  } else {
    console.log(diffs.join('\n\n'));
    console.log(`\nSEO: ${diffs.length} URL(s) con diferencias.`);
    process.exitCode = 1;
  }
  if (args.includes('--out')) writeFileSync(OUT, JSON.stringify(actual, null, 2));
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(actual, null, 2) + '\n');
  console.log(`Guardado ${OUT} (${Object.keys(actual.paginas).length} URLs).`);
}
