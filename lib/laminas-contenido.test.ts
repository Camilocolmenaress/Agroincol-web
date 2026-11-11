import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { GARANTIA } from './laminas';

// El brief de Camilo prohíbe estas frases en la página. Se revisan los textos y
// todos los componentes de /tienda, no solo este archivo.
const PROHIBIDAS = [
  /reposici[oó]n instant[aá]nea/i,
  /evita(r)? (sellos|clausuras)/i,
  /cumple (las )?normas sanitarias/i,
  /100\s?%/,
  /inofensiv/i,
  /\bhumana\b/i,
  /no t[oó]xic/i,
  /fumigaci[oó]n/i,
  /inspecci[oó]n/i,
];

function archivos(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? archivos(p) : /\.tsx?$/.test(e.name) && !e.name.endsWith('.test.ts') ? [p] : [];
  });
}

test('ningún texto de la tienda usa las frases prohibidas por el brief', () => {
  const fuentes = [...archivos('components/tienda'), ...archivos('app/tienda'), 'lib/laminas.ts', 'lib/laminas-contenido.ts'];
  for (const f of fuentes) {
    // El encabezado de lib/laminas-contenido.ts las nombra para documentarlas.
    const texto = readFileSync(f, 'utf8').replace(/\/\/ PROHIBIDO[\s\S]*?lo vigila\./, '');
    for (const re of PROHIBIDAS) assert.doesNotMatch(texto, re, `${f} contiene ${re}`);
  }
});

test('la garantía no se parafrasea: el sello dice "Garantía" y el texto exacto va al lado', () => {
  const fuentes = [...archivos('components/tienda'), ...archivos('app/tienda')];
  for (const f of fuentes) assert.doesNotMatch(readFileSync(f, 'utf8'), /garant[ií]a de reposici[oó]n/i, f);
});

test('la garantía es el texto exacto del brief', () => {
  assert.equal(GARANTIA, 'Si su paquete llega dañado o la lámina no pega, le reponemos el paquete.');
});
