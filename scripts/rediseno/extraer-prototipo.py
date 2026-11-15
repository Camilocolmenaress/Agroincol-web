#!/usr/bin/env python3
"""Extrae los datos y el HTML final del prototipo aprobado (_rediseno/site) a JSON.

Corre el generador del prototipo (site_build.py) en una copia temporal sin escribir páginas, y guarda:
- content/rediseno/datos.json: los datos del generador (servicios S, zonas Z, herramientas T, blog,
  carrusel ORB, ilustraciones, menú, preguntas frecuentes...). Es la fuente de contenido del sitio.
- content/rediseno/paginas.json: por página del prototipo, su title, description, ruta final (mapa
  de la sección 5 del README) y el HTML de <main>. Es la referencia para comparar la migración.

Uso: python3 scripts/rediseno/extraer-prototipo.py
"""
import json, os, re, shutil, sys, tempfile, html

RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ORIGEN = os.path.join(RAIZ, '_rediseno')
SALIDA = os.path.join(RAIZ, 'content', 'rediseno')

# Mapa de URLs (README §5).
RUTAS = {'index.html': '/', 'servicios.html': '/servicios', 'empresas.html': '/empresas', 'zonas.html': '/zonas',
         'herramientas.html': '/herramientas', 'herramienta-calculadora.html': '/herramientas/calculadora-fumigacion',
         'herramienta-plaga.html': '/herramientas/plaga', 'herramienta-checklist.html': '/herramientas/checklist',
         'precios.html': '/precios', 'blog.html': '/blog',
         'articulo-vi-una-cucaracha.html': '/blog/vi-cucaracha-en-mi-casa-que-hacer',
         'articulo-auditoria-invima.html': '/blog/auditoria-invima-como-preparar-restaurante',
         'articulo-plagas-temporada-lluvias.html': '/blog/plagas-temporada-lluvias-bucaramanga',
         'articulo-multa-invima.html': '/blog/cuanto-cuesta-multa-invima-restaurante',
         'articulo-eliminar-cucarachas.html': '/blog/como-eliminar-cucarachas-bucaramanga',
         'articulo-fumigacion-restaurantes-norma.html': '/blog/fumigacion-restaurantes-bucaramanga-norma',
         'articulo-comejen-termitas.html': '/blog/comejen-termitas-bucaramanga',
         'certificado-de-fumigacion.html': '/certificado-de-fumigacion',
         'certificaciones-y-normativa.html': '/certificaciones-y-normativa',
         'politica-de-privacidad.html': '/politica-de-privacidad'}

def ruta(f):
    if f in RUTAS: return RUTAS[f]
    if f.startswith('servicio-'): return '/servicios/' + f[len('servicio-'):-5]
    if f.startswith('zona-'): return '/zonas/' + f[len('zona-'):-5]
    raise SystemExit('Página sin ruta en el mapa: ' + f)

def texto_publicado(ruta):
    """Texto de una página en producción, en el formato de sitio.json (una línea por H1/H2/H3/P/LI de <main>)."""
    import urllib.request
    from html.parser import HTMLParser
    doc = urllib.request.urlopen(urllib.request.Request('https://agroincol.com' + ruta, headers={'User-Agent': 'agroincol-rediseno'})).read().decode('utf-8')
    titulo = html.unescape(re.search(r'<title>(.*?)</title>', doc, re.S).group(1))
    desc = html.unescape(re.search(r'<meta name="description" content="(.*?)"', doc, re.S).group(1))
    main = re.search(r'<main[^>]*>(.*)</main>', doc, re.S).group(1)
    class P(HTMLParser):
        def __init__(self):
            super().__init__(); self.pila = []; self.lineas = []; self.saltar = 0
        def handle_starttag(self, tag, attrs):
            if tag in ('script', 'style', 'svg'): self.saltar += 1
            if tag in ('h1', 'h2', 'h3', 'p', 'li'): self.pila.append([tag.upper(), ''])
        def handle_endtag(self, tag):
            if tag in ('script', 'style', 'svg'): self.saltar -= 1
            if tag in ('h1', 'h2', 'h3', 'p', 'li') and self.pila:
                t, txt = self.pila.pop()
                txt = re.sub(r'\s+', ' ', txt).strip()
                if self.pila: self.pila[-1][1] += ' ' + txt  # anidado: el texto queda en el padre
                elif txt: self.lineas.append(f'{t}: {txt}')
        def handle_data(self, data):
            if not self.saltar and self.pila: self.pila[-1][1] += data
    pr = P(); pr.feed(main)
    return f'=== {ruta} | TITLE: {titulo} | DESC: {desc}\n' + '\n'.join(pr.lineas)

def serializable(v):
    try:
        json.dumps(v); return True
    except TypeError:
        return False

with tempfile.TemporaryDirectory() as tmp:
    shutil.copytree(os.path.join(ORIGEN, 'site'), os.path.join(tmp, 'site'))
    shutil.copytree(os.path.join(ORIGEN, 'contenido-sitio-actual'), os.path.join(tmp, 'contenido-sitio-actual'))
    fuente = open(os.path.join(tmp, 'site', 'site_build.py'), encoding='utf-8').read()
    # Sin escribir páginas: se quita el ciclo final que las guarda.
    fuente = re.sub(r"\nfor k, v in pages\.items\(\):\n    open\(.*?\n print\(.*$", "\n", fuente, flags=re.S)
    fuente = re.sub(r"\nfor k, v in pages\.items\(\):.*$", "\n", fuente, flags=re.S)
    # README §6.4: el artículo "Vi una cucaracha" va con el texto completo publicado hoy y el diseño
    # del prototipo. Se baja de producción en el mismo formato de contenido-sitio-actual/sitio.json y se
    # arma con la misma plantilla de artículo del prototipo (article_page de build_pages2.py).
    VI = '/blog/vi-cucaracha-en-mi-casa-que-hacer'
    sitio_json = os.path.join(tmp, 'contenido-sitio-actual', 'sitio.json')
    act = json.load(open(sitio_json, encoding='utf-8'))
    if VI not in act:
        act[VI] = texto_publicado(VI)
        json.dump(act, open(sitio_json, 'w', encoding='utf-8'), ensure_ascii=False)
    fuente += '''
pages["articulo-vi-una-cucaracha.html"] = article_page("articulo-vi-una-cucaracha.html", "/blog/vi-cucaracha-en-mi-casa-que-hacer", ["¿Vi una cucaracha", "en mi casa?"], "Significa que hay más", "Hogar", [("index.html", "Inicio"), ("blog.html", "Blog"), (None, "Hogar")], colado=("colado-dona-cuca-cucaracha.webp", 317))
'''
    g = {'__file__': os.path.join(tmp, 'site', 'site_build.py'), '__name__': 'prototipo'}
    cwd = os.getcwd(); os.chdir(os.path.join(tmp, 'site'))
    try:
        exec(compile(fuente, 'site_build.py', 'exec'), g)
    finally:
        os.chdir(cwd)

pages = g['pages']
datos = {k: g[k] for k in ['S', 'Z', 'T', 'POSTS', 'BLOG', 'ORB', 'ILU', 'MENU', 'FAQ_ALL', 'SERV_OPTS', 'FACT', 'WA']
         if k in g and serializable(g[k])}
faltan = [k for k in ['S', 'Z', 'T', 'POSTS', 'BLOG', 'ORB'] if k not in datos]
if faltan: print('Aviso: no se pudieron serializar', faltan, file=sys.stderr)

paginas = {}
for f, doc in sorted(pages.items()):
    t = re.search(r'<title>(.*?)</title>', doc, re.S)
    d = re.search(r'<meta name="description" content="(.*?)"', doc, re.S)
    m = re.search(r'<main[^>]*>(.*)</main>', doc, re.S)
    paginas[f] = {'ruta': ruta(f), 'title': html.unescape(t.group(1)) if t else None,
                  'description': html.unescape(d.group(1)) if d else None, 'main': m.group(1) if m else None}

# Cromo común (cabecera, menú, velo, cursor, barra de lectura, pie, barra móvil): lo que va en
# <body> antes y después de <main> en el inicio, sin los <script> del prototipo.
doc = pages['index.html']
cuerpo = re.search(r'<body>(.*)</body>', doc, re.S).group(1)
antes, resto = cuerpo.split('<main', 1)
despues = resto.split('</main>', 1)[1]
despues = re.sub(r'<script[^>]*></script>\s*', '', despues).strip()
cromo = {'antes': antes.strip(), 'despues': despues}
for f, doc in pages.items():  # El cromo es igual en todas las páginas.
    c = re.search(r'<body>(.*)</body>', doc, re.S).group(1)
    a2, r2 = c.split('<main', 1)
    d2 = re.sub(r'<script[^>]*></script>\s*', '', r2.split('</main>', 1)[1]).strip()
    if a2.strip() != cromo['antes'] or d2 != cromo['despues']:
        print('Aviso: cromo distinto en', f, file=sys.stderr)

# Referencia para comparar (scripts/rediseno/comparar-prototipo.cjs): el prototipo con el artículo
# "Vi una cucaracha" completo. Se escribe fuera de git (docs/rediseno-prototipo/referencia/).
REF = os.path.join(RAIZ, 'docs', 'rediseno-prototipo', 'referencia')
shutil.rmtree(REF, ignore_errors=True)
shutil.copytree(os.path.join(ORIGEN, 'site'), REF)
open(os.path.join(REF, 'articulo-vi-una-cucaracha.html'), 'w', encoding='utf-8').write(pages['articulo-vi-una-cucaracha.html'])

os.makedirs(SALIDA, exist_ok=True)
json.dump(cromo, open(os.path.join(SALIDA, 'cromo.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(datos, open(os.path.join(SALIDA, 'datos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(paginas, open(os.path.join(SALIDA, 'paginas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{len(paginas)} páginas; datos: {", ".join(datos)}')

# Metadatos y JSON-LD de producción por ruta (de la línea base): las páginas que ya existen los
# conservan tal cual (README §5). Se guarda solo lo necesario para la cabecera de cada página.
BASE_SEO = os.path.join(RAIZ, 'docs', 'rediseno-prototipo', 'seo-baseline-produccion.json')
if os.path.exists(BASE_SEO):
    b = json.load(open(BASE_SEO, encoding='utf-8'))['paginas']
    rutas = {v['ruta'] for v in paginas.values()}
    seo = {r: {k: b[r][k] for k in ['title', 'description', 'canonical', 'hreflang', 'robots', 'social', 'jsonLd']}
           for r in sorted(rutas) if r in b}
    json.dump(seo, open(os.path.join(SALIDA, 'seo-produccion.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(f'SEO de producción: {len(seo)} rutas; nuevas sin línea base: {sorted(rutas - set(seo))}')
