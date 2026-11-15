# Qué texto publicado hoy en agroincol.com (dentro de <main>) no aparece en el prototipo aprobado.
# Compara frase por frase (8+ palabras, sin mayúsculas ni puntuación). Escribe
# docs/rediseno-prototipo/texto-faltante.md. Uso: python3 scripts/rediseno/texto-faltante.py
import json,re,sys,urllib.request,html
from html.parser import HTMLParser
P=json.load(open('content/rediseno/paginas.json'))
class T(HTMLParser):
    def __init__(s): super().__init__(); s.d=0; s.skip=0; s.out=[]
    def handle_starttag(s,t,a):
        if t=='main': s.d+=1
        if t in('script','style'): s.skip+=1
    def handle_endtag(s,t):
        if t=='main': s.d-=1
        if t in('script','style'): s.skip-=1
    def handle_data(s,x):
        if s.d>0 and not s.skip: s.out.append(x)
def texto(h):
    t=T(); t.feed(h); return re.sub(r'\s+',' ',' '.join(t.out))
norm=lambda x: re.sub(r'[^a-záéíóúñü0-9 ]','',x.lower())
md=['# Texto de producción que no está en el prototipo','','Generado por `scripts/rediseno/texto-faltante.py`. Frases de 8+ palabras del `<main>` publicado hoy que no aparecen en la página del prototipo. Incluye formularios y llamados a la acción (esperable) y contenido (a decidir).','','| Ruta | Frases | Faltan | Palabras faltantes |','|---|---|---|---|']
detalle=[]
for arch,v in P.items():
    ruta=v['ruta']
    try: prod=urllib.request.urlopen(urllib.request.Request('https://agroincol.com'+ruta,headers={'User-Agent':'Mozilla/5.0'}),timeout=20).read().decode()
    except Exception as e: print(ruta,'sin página en producción'); continue
    tp=texto(prod); proto=norm(re.sub(r'<[^>]+>',' ',html.unescape(v['main'] or '')))
    proto=re.sub(r'\s+',' ',proto)
    frases=[f.strip() for f in re.split(r'(?<=[.!?¿:])\s+',tp) if len(f.split())>=8]
    falt=[f for f in frases if re.sub(r'\s+',' ',norm(f)).strip() not in proto]
    pal=sum(len(f.split()) for f in falt); tot=sum(len(f.split()) for f in frases) or 1
    md.append(f"| {ruta} | {len(frases)} | {len(falt)} | {pal} de {tot} ({pal*100//tot} %) |")
    if falt: detalle += ['', f'## {ruta}', ''] + ['- ' + f for f in falt]
    print(f"{ruta:48s} frases {len(frases):3d}  faltan {len(falt):3d}  palabras faltantes {pal:4d}/{tot} ({pal*100//tot}%)")


open('docs/rediseno-prototipo/texto-faltante.md','w').write('\n'.join(md+detalle)+'\n')
