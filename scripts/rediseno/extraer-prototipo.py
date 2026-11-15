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
originales = dict(pages)

# ---------------------------------------------------------------------------------------------
# Texto recuperado (decisión de Camilo, 15-nov): todo el texto publicado hoy que no está en el
# prototipo vuelve, con el diseño del prototipo y sus propias funciones:
#  - las preguntas frecuentes completas, en el acordeón (faq_raw);
#  - el resto, en la "Guía completa" (guia), armada con el texto publicado hoy en vez del corte
#    viejo de contenido-sitio-actual. Sigue el mismo filtro del prototipo (_clean): fuera
#    llamados a cotizar, formularios, reseñas y tarjetas de navegación;
#  - en los servicios que no son de restaurantes se elimina el texto de restaurantes repetido.
# Las páginas originales del prototipo quedan intactas en _rediseno; esto solo cambia la salida.
# ---------------------------------------------------------------------------------------------
import urllib.request
_cache = {}
def _publicado(ruta_prod):
    if ruta_prod not in _cache:
        _cache[ruta_prod] = urllib.request.urlopen(urllib.request.Request(
            'https://agroincol.com' + ruta_prod, headers={'User-Agent': 'agroincol-rediseno'})).read().decode('utf-8')
    return _cache[ruta_prod]

def _faq_publicada(ruta_prod):
    """Preguntas y respuestas visibles en producción (botón con la pregunta, div con la respuesta)."""
    main = re.search(r'<main[^>]*>(.*)</main>', _publicado(ruta_prod), re.S).group(1)
    i = main.find('Preguntas Frecuentes')
    if i < 0: return []
    fin = main.find('</section>', i)
    trozo = main[i:fin if fin > 0 else None]
    limpio = lambda x: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', x))).strip()
    pares = []
    for m in re.finditer(r'<button[^>]*>\s*<span[^>]*>(.*?)</span>.*?</button>\s*<div[^>]*>(.*?)</div>', trozo, re.S):
        q, a = limpio(m.group(1)), ' '.join(limpio(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', m.group(2), re.S))
        if q and a: pares.append((html.escape(q, quote=False), html.escape(a, quote=False)))
    return pares

RESTAURANTE_REPETIDO = re.compile(r'^(Nuestro Proceso de Fumigación para Restaurantes|Plagas Comunes en Restaurantes de Bucaramanga)$', re.I)
CTA_EXTRA = re.compile(r'^(¿No encuentra su zona\?|Recupere su Descanso)', re.I)
NAVEGACION = re.compile(r'Ver cobertura en|^Leer más|^Más información', re.I)
SKIP_PROTOTIPO = g['SKIP_H2']
# En las zonas, "Servicios de Fumigación en <municipio>" es texto local propio de cada zona: vuelve.
SKIP_ZONAS = re.compile(SKIP_PROTOTIPO.pattern.replace('|^servicios de fumigaci', ''), re.I)
_n = lambda t: re.sub(r'[^a-z0-9ñáéíóúü]+', ' ', html.unescape(t).lower()).strip()
def _items_publicados(ruta_prod, quitar_restaurantes=False, doc=''):
    g['SKIP_H2'] = SKIP_ZONAS if ruta_prod.startswith('/zonas/') else SKIP_PROTOTIPO
    try:
        items = g['_clean'](g['_items'](texto_publicado(ruta_prod)), keep_lead=True)
    finally:
        g['SKIP_H2'] = SKIP_PROTOTIPO
    # La entrada de producción va solo si la página no la tiene ya (el prototipo la resume en el héroe).
    texto_doc = ' ' + _n(re.sub(r'<[^>]+>', ' ', doc)) + ' '
    if items and items[0][0] == 'P' and f' {_n(items[0][1])} ' in texto_doc:
        items = items[1:]
    out, saltar = [], False
    for tag, t in items:
        if NAVEGACION.search(t): continue  # tarjetas de navegación ("Ver cobertura en…"): el prototipo ya las tiene
        if tag == 'H2':
            saltar = bool((quitar_restaurantes and RESTAURANTE_REPETIDO.match(t)) or CTA_EXTRA.match(t))
        if not saltar: out.append((tag, t))
    return out

GUIA_RE = re.compile(r'<section class="guia" aria-label="Guía completa">.*?\n</section>', re.S)
FAQ_RE = re.compile(r'<section class="voces"[^>]*>\s*<div class="faq-wrap" style="margin-top:0">.*?</section>', re.S)
def _cambiar_guia(f, ruta_prod, quitar_restaurantes=False, tema=None, antes_de=None):
    doc = pages[f]
    items = _items_publicados(ruta_prod, quitar_restaurantes, doc)
    m = GUIA_RE.search(doc)
    if m:
        tema = tema or re.search(r'<p class="display" data-reveal>(.*?)</p>', m.group(0)).group(1)
        pages[f] = doc[:m.start()] + g['guia'](tema, items) + doc[m.end():]
    else:  # Página sin guía en el prototipo: se agrega antes de la sección indicada.
        i = doc.index(antes_de)
        pages[f] = doc[:i] + g['guia'](tema, items) + '\n' + doc[i:]

def _cambiar_faq(f, ruta_prod):
    pares = _faq_publicada(ruta_prod)
    if not pares: return 0
    nueva = g['faq_raw']('Preguntas<br>frecuentes', pares)
    doc = pages[f]
    m = FAQ_RE.search(doc)
    if m:
        pages[f] = doc[:m.start()] + nueva + doc[m.end():]
    else:  # Sin acordeón en el prototipo: va justo después de la guía.
        m = GUIA_RE.search(doc)
        pages[f] = doc[:m.end()] + '\n' + nueva + doc[m.end():]
    return len(pares)

recuperado = {}
for f in sorted(pages):
    if f.startswith('servicio-'):
        r = ruta(f)
        _cambiar_guia(f, r, quitar_restaurantes=(f != 'servicio-fumigacion-restaurantes.html'))
        recuperado[f] = _cambiar_faq(f, r)
    elif f.startswith('zona-'):
        r = ruta(f)
        _cambiar_guia(f, r)
        recuperado[f] = _cambiar_faq(f, r)
_cambiar_guia('index.html', '/')
_cambiar_guia('precios.html', '/precios')
_cambiar_guia('herramienta-calculadora.html', '/herramientas/calculadora-fumigacion',
              tema='Cada cuánto<br>fumigar', antes_de='<section class="cta-final')
_cambiar_guia('zonas.html', '/zonas', tema='Cobertura en el<br>Área Metropolitana', antes_de='<section class="cta-final')
print('Preguntas frecuentes recuperadas:', recuperado)

# "Dejar una reseña en Google" en "Lo que dicen" (decisión de Camilo, 15-nov). Evento click_resena:
# lib/rediseno/motor.ts, por el atributo data-resena.
RESENA = '<a class="call" href="https://g.page/r/Cd-hRhdI2eRIEBM/review" target="_blank" rel="noopener" data-resena>Dejar una reseña en Google</a>'
for f, doc in pages.items():
    if '<div class="voces-head">' in doc and 'data-resena' not in doc:
        pages[f] = re.sub(r'(<div class="voces-head">.*?<span class="rating">[^<]*</span>)', lambda m: m.group(1) + RESENA, doc, count=1, flags=re.S)

datos ={k: g[k] for k in ['S', 'Z', 'T', 'POSTS', 'BLOG', 'ORB', 'ILU', 'MENU', 'FAQ_ALL', 'SERV_OPTS', 'FACT', 'WA']
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
for f, doc in pages.items():  # Artículo completo, texto recuperado y enlace de reseña.
    if f == 'articulo-vi-una-cucaracha.html' or doc != originales[f]:
        open(os.path.join(REF, f), 'w', encoding='utf-8').write(doc)

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
