# Páginas que faltaban: artículos del blog, precios y páginas legales, con el texto actual del sitio
def _meta(path):
    first = ACT[path].split('\n', 1)[0]
    t = _re.search(r'TITLE: (.*?) \| DESC: (.*)$', first)
    return t.group(1), t.group(2)
ART_SKIP = _re.compile(r'^solicite|^¿necesita|tiene una plaga', _re.I)
def _art_items(path, keep_lead=True):
    out, skipping, seen = [], False, False
    for tag, t in _items(ACT[path]):
        if tag in ("A", "BUTTON"): continue
        if tag in ("H2", "H3") and STOP_H.match(t): break
        if tag == "H1": seen = True; continue
        if not seen: continue
        if tag == "H2": skipping = bool(ART_SKIP.search(t))
        if skipping: continue
        if t.endswith("→"): continue
        out.append((tag, t))
    return out
def _related(cur):
    lst = [p for p in POSTS if p[0] != cur][:3]
    return "".join(f'<a class="post-row" href="{h}" data-transition data-cursor="LEER"><span class="num">{i+1:02d}</span><span class="post-t">{t}</span><span class="post-c"><span class="label">{tag}</span>{c}</span></a>' for i, (h, t, c, tag) in enumerate(lst))
def article_page(fname, path, big, small, cat, crumbs, colado=None, form=False, related=True, dropcap=True):
    title, desc = _meta(path)
    items = _art_items(path)
    words = sum(len(t.split()) for _, t in items)
    meta = f'<p class="meta">{cat} · {max(2, round(words / 200))} minutos de lectura</p>' if cat else ""
    body = hero_title("h1", big, small, "", crumbs, small_first=False, size="sm", extra=meta)
    end = ""
    if colado:
        f, w = colado
        end = f'<div class="art-colado" data-reveal><img src="assets/{f}" alt="" width="{w}" height="500" loading="lazy"><p class="lema">Llegó AGROINCOL. Nos vamos.</p></div>'
    else:
        end = '<span class="gel" data-drop></span>'
    body += f'<article class="article">{to_html(items, dropcap=dropcap)}{end}</article>'
    if related: body += f'<section class="posts related"><h2 class="display" data-reveal>Siga<br>leyendo</h2>{_related(fname)}</section>'
    body += cotizar() if form else cta()
    return head(title, desc) + f'<main id="contenido">{body}</main>' + foot()

BLOG = [
 ("articulo-auditoria-invima.html", "/blog/auditoria-invima-como-preparar-restaurante", ["Auditoría", "del INVIMA:"], "Cómo preparar su restaurante para pasar sin problemas", "Restaurantes", None),
 ("articulo-plagas-temporada-lluvias.html", "/blog/plagas-temporada-lluvias-bucaramanga", ["Temporada", "de lluvias"], "en Bucaramanga: las plagas que aparecen y cómo prevenirlas", "Hogar", ("colado-don-serenata-zancudo.webp", 351)),
 ("articulo-multa-invima.html", "/blog/cuanto-cuesta-multa-invima-restaurante", ["¿Cuánto cuesta", "una multa"], "del INVIMA por plagas? Lo que todo restaurante debe saber", "Restaurantes", None),
 ("articulo-eliminar-cucarachas.html", "/blog/como-eliminar-cucarachas-bucaramanga", ["Cómo eliminar", "cucarachas"], "en Bucaramanga: guía profesional 2026", "Hogar", ("colado-dona-cuca-cucaracha.webp", 317)),
 ("articulo-fumigacion-restaurantes-norma.html", "/blog/fumigacion-restaurantes-bucaramanga-norma", ["Fumigación", "para restaurantes"], "en Bucaramanga: qué exige la norma y cuánto cuesta", "Restaurantes", None),
 ("articulo-comejen-termitas.html", "/blog/comejen-termitas-bucaramanga", ["Comején", "y termitas"], "en Bucaramanga: cómo identificar y eliminar", "Hogar", ("colado-mordisco-comejen.webp", 334)),
]
for fname, path, big, small, cat, colado in BLOG:
    pages[fname] = article_page(fname, path, big, small, cat, [("index.html", "Inicio"), ("blog.html", "Blog"), (None, cat)], colado=colado)

pages["certificado-de-fumigacion.html"] = article_page("certificado-de-fumigacion.html", "/certificado-de-fumigacion", ["Certificado", "de fumigación"], "en Bucaramanga", "", [("index.html", "Inicio"), (None, "Certificado de fumigación")], form=True, related=False)
pages["certificaciones-y-normativa.html"] = article_page("certificaciones-y-normativa.html", "/certificaciones-y-normativa", ["Certificaciones", "y normativa"], "de fumigación en Colombia", "", [("index.html", "Inicio"), (None, "Normativa")], form=True, related=False)
pages["politica-de-privacidad.html"] = article_page("politica-de-privacidad.html", "/politica-de-privacidad", ["Política de", "tratamiento"], "de datos personales", "", [("index.html", "Inicio"), (None, "Política de datos")], related=False, dropcap=False)

# ---------------- PRECIOS (sin precios: qué define el valor) ----------------
def _sections(path, wanted):
    res, on = [], False
    for tag, t in _items(ACT[path]):
        if tag == "H2": on = any(w in t for w in wanted)
        if on and tag in ("H2", "H3", "P", "LI") and not t.endswith("→"): res.append((tag, t))
    return res
_pr = _items(ACT["/precios"])
_lead = next(t for tag, t in _pr if tag == "P")
def _programs():
    progs, cur = [], None
    on = False
    for tag, t in _pr:
        if tag == "H2": on = t.startswith("Programas de Protección")
        if not on: continue
        if tag == "H3": cur = {"n": t, "li": [], "ideal": ""}; progs.append(cur)
        elif tag == "LI" and cur: cur["li"].append(t)
        elif tag == "P" and cur and t.startswith("Ideal para:"): cur["ideal"] = t
    return progs
def _freq(p):
    m = _re.search(r'\((1 cada [^)]+)\)', " ".join(p["li"]))
    return m.group(1).capitalize() if m else "Una visita"
_pg = ""
for p in _programs():
    feat = " is-featured" if p["n"] == "Protección" else ""
    lis = "".join(f'<li{" class=\"no\"" if _re.search(r"no incluid|^Sin |adicionales", x) else ""}>{H.escape(x, quote=False)}</li>' for x in p["li"])
    _pg += f'<article class="program{feat}" data-reveal><span class="label">{_freq(p)}</span><h3 class="display">{p["n"]}</h3><ul>{lis}</ul><p class="ideal">{H.escape(p["ideal"], quote=False)}</p></article>'
_prog_intro = next(t for tag, t in _pr if tag == "P" and t.startswith("La Resolución 2674"))
_prog_note = next(t for tag, t in _pr if tag == "P" and t.startswith("PROTECCIÓN"))
_steps = []
_on = False
for i, (tag, t) in enumerate(_pr):
    if tag == "H2": _on = t.startswith("Qué Incluye Cada Visita")
    if _on and tag == "H3": _steps.append((t, _pr[i + 1][1]))
_steps_h = "".join(f'<li data-reveal><span class="n">{i+1:02d}</span><h3>{t}</h3><p>{d}.</p></li>' for i, (t, d) in enumerate(_steps))
FACT = [("Tipo de propiedad", "Restaurante, hogar, bodega u oficina: cada espacio tiene riesgos distintos."),
        ("Tamaño", "Los metros a tratar definen el producto y el tiempo del técnico."),
        ("Plaga", "No se trata igual una cucaracha que un comején o un nido de abejas."),
        ("Frecuencia", "Un servicio único o un programa con visitas programadas."),
        ("Protección", "Garantía, reportes, estaciones y acompañamiento en auditorías.")]
_fact = "".join(f'<li data-reveal><span class="n">{i+1:02d}</span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate(FACT))
_guia_pr = [x for x in _sections("/precios", ["¿Cuánto Cuesta Fumigar en Bucaramanga en", "¿Cómo Elegir el Plan Correcto?"])]
pages["precios.html"] = head(*_meta("/precios")) + f'''
<main id="contenido">
{hero_title("h1", ["¿Cuánto cuesta", "fumigar"], "en Bucaramanga?", H.escape(_lead, quote=False), [("index.html", "Inicio"), (None, "Precios")], small_first=False)}
<section class="pasos factores">
  <h2 class="display" data-reveal>Lo que define<br>el valor</h2>
  <ol class="steps6 five">{_fact}</ol>
</section>
{rows([dict(word="Calculadora", cap="Descubra cada cuánto debe fumigar su propiedad. Cinco preguntas, resultado inmediato.", obj="gota", href="herramienta-calculadora.html", cursor="USAR")], "md")}
<section class="programas">
  <h2 class="display" data-reveal>Programas para<br>restaurantes</h2>
  <p class="programas-intro">{H.escape(_prog_intro, quote=False)}</p>
  <div class="program-grid four">{_pg}</div>
  <p class="note">{H.escape(_prog_note, quote=False)}</p>
</section>
<section class="pasos">
  <h2 class="display" data-reveal>Así es<br>cada visita</h2>
  <ol class="steps6">{_steps_h}</ol>
</section>
<section class="sub-head"><h2 class="display" data-reveal>Formas<br>de pago</h2></section>
{tabla([("Contado o mensual", "<p>Pago antes del servicio.</p>"), ("50/50", "<p>50 % al agendar y 50 % al finalizar. Requiere contrato.</p>"), ("Prepago anual", "<p>10 % de descuento. Requiere contrato.</p><p>Factura electrónica disponible.</p>")])}
{guia("Precios<br>en detalle", _guia_pr)}
{cotizar("¿Cuánto cuesta<br>su caso?")}
</main>''' + foot()
