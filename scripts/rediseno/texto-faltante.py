#!/usr/bin/env python3
"""Qué texto publicado hoy en agroincol.com no está en la página nueva.

Compara elemento por elemento: cada H1/H2/H3, párrafo, ítem de lista, pregunta y respuesta del
<main> de producción se busca (sin mayúsculas, tildes ni puntuación) dentro del texto de la página
nueva (content/rediseno/paginas.json). Lo que no aparece se lista agrupado por la sección (H2) de
producción en que estaba, para decidir si es contenido o cromo (formularios, llamados, reseñas,
tarjetas de navegación).

Escribe docs/rediseno-prototipo/texto-faltante.md. Uso: python3 scripts/rediseno/texto-faltante.py
"""
import html, json, re, unicodedata, urllib.request
from html.parser import HTMLParser

P = json.load(open('content/rediseno/paginas.json', encoding='utf-8'))

def norm(t):
    t = unicodedata.normalize('NFD', html.unescape(t).lower())
    t = ''.join(c for c in t if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9ñ]+', ' ', t).strip()

class Items(HTMLParser):
    BLOQUES = ('h1', 'h2', 'h3', 'p', 'li', 'span', 'blockquote')
    def __init__(self):
        super().__init__(); self.pila = []; self.items = []; self.saltar = 0; self.en_boton = 0
    def handle_starttag(self, tag, a):
        if tag in ('script', 'style', 'svg'): self.saltar += 1
        if tag == 'button': self.en_boton += 1
        if tag in self.BLOQUES and (tag != 'span' or self.en_boton): self.pila.append([tag, ''])
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg'): self.saltar -= 1
        if tag == 'button': self.en_boton -= 1
        if tag in self.BLOQUES and self.pila and self.pila[-1][0] == tag:
            t, txt = self.pila.pop()
            txt = re.sub(r'\s+', ' ', txt).strip()
            if self.pila: self.pila[-1][1] += ' ' + txt
            elif txt: self.items.append(('PREGUNTA' if t == 'span' else t.upper(), txt))
    def handle_data(self, d):
        if not self.saltar and self.pila: self.pila[-1][1] += d

def produccion(ruta):
    doc = urllib.request.urlopen(urllib.request.Request('https://agroincol.com' + ruta, headers={'User-Agent': 'agroincol-rediseno'})).read().decode('utf-8')
    main = re.search(r'<main[^>]*>(.*)</main>', doc, re.S).group(1)
    p = Items(); p.feed(main)
    return p.items

filas, detalle = [], []
for arch, v in sorted(P.items(), key=lambda x: x[1]['ruta']):
    ruta = v['ruta']
    try:
        items = produccion(ruta)
    except Exception:
        continue  # Página nueva: no existe en producción.
    nuevo = ' ' + norm(re.sub(r'<[^>]+>', ' ', v['main'] or '')) + ' '
    seccion, faltan, total, palabras_f = '(antes del primer H2)', {}, 0, 0
    for tag, t in items:
        if tag == 'H2': seccion = t
        n = norm(re.sub(r'^\s*(\d+\.?|[✓›•])\s*', '', t))  # numeración y viñetas: el prototipo las pone con <ol>/<ul>
        if len(n.split()) < 4: continue  # botones, cifras y rótulos sueltos
        total += len(n.split())
        if f' {n} ' not in nuevo:
            faltan.setdefault(seccion, []).append(f'{tag}: {t}')
            palabras_f += len(n.split())
    filas.append(f'| {ruta} | {palabras_f} de {total} ({palabras_f * 100 // max(total, 1)} %) | {len(faltan)} |')
    if faltan:
        detalle += ['', f'## {ruta}']
        for sec, lineas in faltan.items():
            detalle += ['', f'**{sec}**', ''] + [f'- {l}' for l in lineas]

md = ['# Texto de producción que no está en la página nueva', '',
      'Generado por `scripts/rediseno/texto-faltante.py`. Cada encabezado, párrafo, ítem, pregunta y respuesta del `<main>` publicado hoy (4 palabras o más) se busca en la página nueva. Lo que falta se agrupa por la sección de producción en que estaba.', '',
      '| Ruta | Palabras que faltan | Secciones con faltantes |', '|---|---|---|'] + filas + detalle
open('docs/rediseno-prototipo/texto-faltante.md', 'w', encoding='utf-8').write('\n'.join(md) + '\n')
print('\n'.join(filas))
