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

# Enlaces internos del texto publicado: viajan como marcas ⟦/ruta|texto⟧ por las funciones del
# prototipo (que trabajan con texto plano y lo escapan) y al final vuelven a ser <a> (enlazar()).
MARCA = re.compile(r'⟦(/[^|⟧]*)\|([^⟧]*)⟧')
def sin_marcas(t):
    return MARCA.sub(lambda m: m.group(2), t)
def enlazar(doc):
    return MARCA.sub(lambda m: f'<a href="{m.group(1)}" data-transition>{m.group(2)}</a>', doc)

def texto_publicado(ruta, enlaces=False):
    """Texto de una página en producción, en el formato de sitio.json (una línea por H1/H2/H3/P/LI de <main>).
    Con enlaces=True, los enlaces internos dentro de párrafos e ítems quedan como marcas ⟦/ruta|texto⟧."""
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
            su = getattr(self, 'suelto', None)
            if tag in ('h1', 'h2', 'h3') and su is not None and not su['tarjeta']:
                # Es una tarjeta: se suelta el enlace y su texto sigue como títulos y párrafos normales.
                su['tarjeta'] = True
                self.pila.pop()
            if tag in ('h1', 'h2', 'h3', 'p', 'li'): self.pila.append([tag.upper(), ''])
            # Enlace suelto (fuera de párrafo): es texto con enlace salvo que envuelva un título (tarjeta
            # de navegación; el pie del prototipo ya enlaza esas páginas desde todo el sitio).
            if tag == 'a' and enlaces and not self.pila and not self.saltar:
                href = (dict(attrs).get('href') or '').split('#')[0]
                if href.startswith('/') and not href.startswith('//'):
                    self.suelto = {'href': href.rstrip('/') or '/', 'tarjeta': False}
                    self.pila.append(['P', '⟦' + self.suelto['href'] + '|'])
                    self.suelto['nivel'] = len(self.pila)
                    return
            if tag == 'a' and enlaces and self.pila and self.pila[-1][0] in ('P', 'LI'):
                href = (dict(attrs).get('href') or '').split('#')[0]
                if href.startswith('/') and not href.startswith('//'):
                    self.pila[-1][1] += '⟦' + (href.rstrip('/') or '/') + '|'
                    self.enlace_abierto = len(self.pila)
        def handle_endtag(self, tag):
            su = getattr(self, 'suelto', None)
            if tag == 'a' and su is not None and su['tarjeta'] and not self.pila:
                self.suelto = None
                return
            if tag == 'a' and su is not None and not su['tarjeta'] and len(self.pila) == su['nivel']:
                t, txt = self.pila.pop(); self.suelto = None
                txt = re.sub(r'\s+', ' ', txt).strip() + '⟧'
                if not su['tarjeta'] and len(sin_marcas(txt)) > 12: self.lineas.append(f'P: {txt}')
                return
            if tag == 'a' and getattr(self, 'enlace_abierto', 0) and len(self.pila) == self.enlace_abierto:
                self.pila[-1][1] = self.pila[-1][1].rstrip() + '⟧'
                self.enlace_abierto = 0
            if tag in ('script', 'style', 'svg'): self.saltar -= 1
            if tag in ('h1', 'h2', 'h3', 'p', 'li') and self.pila:
                t, txt = self.pila.pop()
                if getattr(self, 'enlace_abierto', 0) > len(self.pila): txt += '⟧'; self.enlace_abierto = 0
                txt = re.sub(r'\s+', ' ', txt).strip()
                txt = re.sub(r'⟦(/[^|⟧]*)\|\s*⟧', '', txt)  # enlace sin texto
                txt = re.sub(r'⟦(/[^|⟧]*)\|\s+', r'⟦\1|', txt)
                if t.startswith('H'): txt = sin_marcas(txt)  # los títulos van sin enlace (dan los id del índice)
                if enlaces and sin_marcas(txt).rstrip().endswith('→') and '⟦' not in txt: txt = ''  # llamado "… →" sin enlace interno
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

# Guarda: el texto "publicado hoy" se tomó del sitio ANTERIOR. Desde el 15-nov-2026 producción ya es este
# sitio rediseñado, así que leerla otra vez sería leerse a sí mismo (pasó: las preguntas de chinches
# volvieron a 3). content/rediseno/*.json es ahora la fuente de verdad; este script ya no se corre contra
# producción. Para cambiar textos, editar el contenido directamente.
def _produccion_es_el_sitio_nuevo():
    import urllib.request
    doc = urllib.request.urlopen(urllib.request.Request('https://agroincol.com/', headers={'User-Agent': 'agroincol-rediseno'})).read().decode('utf-8')
    return 'data-lead-form' in doc
if _produccion_es_el_sitio_nuevo() and '--forzar' not in sys.argv:
    sys.exit('agroincol.com ya sirve el sitio rediseñado: este extractor leería sus propias páginas como "texto '
             'publicado" y perdería lo recuperado. content/rediseno/*.json es la fuente de verdad (ver el comentario).')

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
    # Artículos, certificado y normativa: el texto publicado hoy, con sus enlaces internos (decisión
    # de Camilo, 15-nov: recuperar todo el texto, y los enlaces son parte de él).
    for r in [VI, '/blog/auditoria-invima-como-preparar-restaurante', '/blog/plagas-temporada-lluvias-bucaramanga',
              '/blog/cuanto-cuesta-multa-invima-restaurante', '/blog/como-eliminar-cucarachas-bucaramanga',
              '/blog/fumigacion-restaurantes-bucaramanga-norma', '/blog/comejen-termitas-bucaramanga',
              '/certificado-de-fumigacion', '/certificaciones-y-normativa']:
        act[r] = texto_publicado(r, enlaces=True)
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
    """Preguntas y respuestas visibles en producción (botón con la pregunta, div con la respuesta) y los
    párrafos sueltos de la sección. Los enlaces internos quedan como marcas."""
    main = re.search(r'<main[^>]*>(.*)</main>', _publicado(ruta_prod), re.S).group(1)
    i = main.find('Preguntas Frecuentes')
    if i < 0: return [], []
    fin = main.find('</section>', i)
    trozo = main[i:fin if fin > 0 else None]
    marcar = lambda x: re.sub(r'<a [^>]*href="(/[^"#]*)[^"]*"[^>]*>(.*?)</a>',
                              lambda m: '⟦' + (m.group(1).rstrip('/') or '/') + '|' + re.sub(r'<[^>]+>', '', m.group(2)).strip() + '⟧', x, flags=re.S)
    limpio = lambda x: re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', marcar(x)))).strip()
    pares = []
    for m in re.finditer(r'<button[^>]*>\s*<span[^>]*>(.*?)</span>.*?</button>\s*<div[^>]*>(.*?)</div>', trozo, re.S):
        q, a = limpio(m.group(1)), ' '.join(limpio(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', m.group(2), re.S))
        if q and a: pares.append((html.escape(sin_marcas(q), quote=False), html.escape(a, quote=False)))
    sin_qa = re.sub(r'<button.*?</button>\s*<div[^>]*>.*?</div>', ' ', trozo, flags=re.S)
    sueltos = [limpio(p) for p in re.findall(r'<p[^>]*>(.*?)</p>', sin_qa, re.S)]
    sueltos = [html.escape(t, quote=False) for t in sueltos if ('⟦' in t and len(sin_marcas(t)) > 12) or (len(sin_marcas(t)) > 20 and not sin_marcas(t).endswith('→'))]
    return pares, sueltos

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
        items = g['_clean'](g['_items'](texto_publicado(ruta_prod, enlaces=True)), keep_lead=True)
    finally:
        g['SKIP_H2'] = SKIP_PROTOTIPO
    # La entrada de producción va solo si la página no la tiene ya (el prototipo la resume en el héroe).
    texto_doc = ' ' + _n(re.sub(r'<[^>]+>', ' ', doc)) + ' '
    if items and items[0][0] == 'P' and f' {_n(sin_marcas(items[0][1]))} ' in texto_doc:
        items = items[1:]
    out, saltar = [], False
    for tag, t in items:
        if NAVEGACION.search(sin_marcas(t)): continue  # tarjetas de navegación ("Ver cobertura en…"): el prototipo ya las tiene
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
    pares, sueltos = _faq_publicada(ruta_prod)
    if not pares: return 0
    for q, a in pares: g['FAQ_ALL'][q] = a
    aside = ''.join(f'<p class="zonas">{t}</p>' for t in sueltos)
    nueva = g['faq']('Preguntas<br>frecuentes', [q for q, _ in pares], aside)
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
for f in pages:
    pages[f] = enlazar(pages[f])
assert not any('⟦' in d or '⟧' in d for d in pages.values()), 'quedaron marcas de enlace sin convertir'

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
