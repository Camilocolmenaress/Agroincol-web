#!/usr/bin/env python3
"""Enlaces internos del <main> de producción que no están en el <main> de la página nueva.

Uso: python3 scripts/rediseno/enlaces-faltantes.py   (compara contra content/rediseno/paginas.json)
"""
import json, re, urllib.request

P = json.load(open('content/rediseno/paginas.json', encoding='utf-8'))
RUTA = {k: v['ruta'] for k, v in P.items()}
total = faltan_total = 0
for arch, v in sorted(P.items(), key=lambda x: x[1]['ruta']):
    ruta = v['ruta']
    try:
        doc = urllib.request.urlopen(urllib.request.Request('https://agroincol.com' + ruta, headers={'User-Agent': 'agroincol-rediseno'}), timeout=20).read().decode('utf-8')
    except Exception:
        continue
    main = re.search(r'<main[^>]*>(.*)</main>', doc, re.S).group(1)
    norm = lambda h: (h.split('#')[0].rstrip('/') or '/')
    prod = {norm(h) for h in re.findall(r'href="(/[^"]*)"', main)} - {ruta}
    nuevo = set()
    for h in re.findall(r'href="([^"#]*)', v['main'] or ''):
        nuevo.add(norm(RUTA.get(h, h)))
    falta = sorted(prod - nuevo)
    total += len(prod); faltan_total += len(falta)
    if falta: print(f'{ruta:48s} {len(falta)} de {len(prod)}: {falta}')
print(f'\nEn total faltan {faltan_total} de {total} enlaces internos de producción.')
