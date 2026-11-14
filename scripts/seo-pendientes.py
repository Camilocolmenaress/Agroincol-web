#!/usr/bin/env python3
# Escribe docs/rediseno/seo-cambios-pendientes.md a partir de la salida de
#   node scripts/seo-baseline.mjs --compare > /tmp/diff.txt
#   python3 -I scripts/seo-pendientes.py /tmp/diff.txt
import sys, re, json
txt = open(sys.argv[1]).read()
bloques = [b for b in txt.strip().split('\n\n') if b.startswith('/')]
out = ['# Cambios de SEO pendientes de aprobación', '',
       'Generado con `node scripts/seo-baseline.mjs --compare` contra la línea base de `main` '
       '(`scripts/seo-pendientes.py`). Nada de esto está en `seo-cambios-aprobados.json`: hay que aprobarlo antes del merge.', '',
       '**Sin ninguna diferencia:** el resto del sitio (zonas, blog, precios, certificaciones, calculadora, reseña y privacidad, con el rediseño visual de la fase 5) y las 9 landings de pauta.', '',
       '## Resumen por tipo', '',
       '| Cambio | Dónde | Por qué |', '|---|---|---|',
       '| +10 enlaces internos, uno por objeto 3D del desfile (alt como texto) | `/` | Cada objeto lleva a su servicio (cursor "Ver servicio"), como los frascos de la referencia. |',
       '| +9 imágenes 3D con alt descriptivo | `/` | Regla del brief: cada render 3D lleva alt descriptivo. La de la casa ya está aprobada (D3). |',
       '| +N `<img alt="">` decorativas | `/`, servicios | El mismo render ya descrito una vez (foco, hover de segmentos, tarjetas de servicio). |',
       '| −1 imagen: la foto del hero y su alt | 9 servicios | La plantilla de servicio usa el objeto 3D. En el home, sacar la foto ya está aprobado (D3). |',
       '| +8 enlaces en "Otros servicios" (solo el nombre) | 9 servicios | Pedido en el brief (6.2.6). Sin H2 ni H3 nuevos. |',
       '| Unas 50 palabras más | 9 servicios | "Otros servicios", los 8 nombres y las etiquetas laterales (aria-hidden). |', '',
       '## Detalle por página', '']
for b in bloques:
    lineas = b.split('\n')
    out += [f'### `{lineas[0]}`', '']
    for l in lineas[1:]:
        l = l.strip()
        m = re.match(r'([+~-]) (\w+)(?: nuevo| quitado)?:\s+(.*)', l)
        if not m:
            out.append('- ' + l); continue
        signo, tipo, resto = m.groups()
        try:
            d = json.loads(resto)
            if tipo == 'enlace': resto = f"`{d['href']}`: «{d['texto'][:100]}»"
            elif tipo == 'img': resto = f"alt «{d['alt']}»" if d['alt'] else 'alt vacío (decorativa)'
        except Exception:
            pass
        out.append(f'- {signo} {tipo}: {resto}')
    out.append('')
open('docs/rediseno/seo-cambios-pendientes.md', 'w').write('\n'.join(out) + '\n')
print(len(bloques), 'páginas con cambios pendientes')
