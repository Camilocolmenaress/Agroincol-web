#!/usr/bin/env node
// Lighthouse móvil por fase del rediseño: 3 corridas por URL, se queda con la mediana
// (por puntaje de rendimiento) y guarda resumen + reporte HTML de la mediana.
//
//   node scripts/lighthouse-fase.mjs fase-0-local  http://localhost:3100
//   node scripts/lighthouse-fase.mjs fase-0-prod   https://agroincol.com
//
// Ojo: en localhost no carga GTM (está restringido al dominio), así que los números
// locales salen optimistas frente a producción. Compare local con local y prod con prod.

import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const [etiqueta, base] = process.argv.slice(2);
if (!etiqueta || !base) {
  console.error('Uso: node scripts/lighthouse-fase.mjs <etiqueta> <base-url>');
  process.exit(1);
}
const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const DIR = resolve(ROOT, 'docs/rediseno/lighthouse', etiqueta);
const RUNS = Number(process.env.LH_RUNS ?? 3);
const PATHS = (process.env.LH_PATHS ?? '/,/servicios/fumigacion-residencial,/blog/como-eliminar-cucarachas-bucaramanga,/zonas/fumigacion-bucaramanga').split(',');
mkdirSync(DIR, { recursive: true });

const resumen = [];
for (const path of PATHS) {
  const slug = path === '/' ? 'home' : path.slice(1).replace(/\//g, '__');
  const corridas = [];
  for (let i = 0; i < RUNS; i++) {
    const out = resolve(DIR, `${slug}-run${i}`);
    execFileSync('npx', ['--yes', 'lighthouse@12', base + path, '--quiet', '--chrome-flags=--headless=new',
      '--only-categories=performance,accessibility,seo,best-practices', '--output=json', '--output=html', `--output-path=${out}`],
      { stdio: 'ignore', timeout: 180000 });
    const r = JSON.parse(readFileSync(`${out}.report.json`, 'utf8'));
    corridas.push({ i, out, r });
  }
  corridas.sort((a, b) => a.r.categories.performance.score - b.r.categories.performance.score);
  const med = corridas[Math.floor(corridas.length / 2)];
  const a = med.r.audits;
  const fila = {
    url: path,
    perf: Math.round(med.r.categories.performance.score * 100),
    a11y: Math.round(med.r.categories.accessibility.score * 100),
    seo: Math.round(med.r.categories.seo.score * 100),
    bp: Math.round(med.r.categories['best-practices'].score * 100),
    lcp_s: +(a['largest-contentful-paint'].numericValue / 1000).toFixed(2),
    cls: +a['cumulative-layout-shift'].numericValue.toFixed(3),
    tbt_ms: Math.round(a['total-blocking-time'].numericValue),
    fcp_s: +(a['first-contentful-paint'].numericValue / 1000).toFixed(2),
    peso_kb: Math.round(a['total-byte-weight'].numericValue / 1024),
    perf_corridas: corridas.map((c) => Math.round(c.r.categories.performance.score * 100)),
  };
  resumen.push(fila);
  // Guarda solo el HTML de la mediana; borra el resto para no inflar el repo.
  for (const c of corridas) {
    rmSync(`${c.out}.report.json`, { force: true });
    if (c !== med) rmSync(`${c.out}.report.html`, { force: true });
  }
  execFileSync('mv', [`${med.out}.report.html`, resolve(DIR, `${slug}.html`)]);
  console.log(JSON.stringify(fila));
}
writeFileSync(resolve(DIR, 'resumen.json'), JSON.stringify({ base, fecha: new Date().toISOString(), corridas: RUNS, nota: 'Lighthouse móvil (preset por defecto: Moto G Power, 4G lento simulado). INP no se mide en laboratorio: se usa TBT como proxy y CrUX/Speed Insights para campo.', resumen }, null, 2) + '\n');
