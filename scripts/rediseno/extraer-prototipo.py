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

os.makedirs(SALIDA, exist_ok=True)
json.dump(datos, open(os.path.join(SALIDA, 'datos.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
json.dump(paginas, open(os.path.join(SALIDA, 'paginas.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print(f'{len(paginas)} páginas; datos: {", ".join(datos)}')
