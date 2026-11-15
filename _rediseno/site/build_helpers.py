# Contenido del sitio actual: Guía completa, blog, páginas legales y formulario
import re as _re
ACT = json.load(open(CONT + 'sitio.json'))
def _blocks_dump1():
    txt = open(CONT + 'dump1.txt').read()
    out = {}
    for m in _re.finditer(r'^=== (\S+) \|[^\n]*\n(.*?)(?=^=== |\Z)', txt, _re.S | _re.M):
        out[m.group(1)] = m.group(2)
    return out
D1 = _blocks_dump1()
def _items(text):
    res = []
    for line in text.split('\n'):
        m = _re.match(r'^([A-Z0-9]+): (.*)$', line.strip())
        if not m: continue
        tag, t = m.group(1), m.group(2).strip()
        if res and tag == 'P' and res[-1][0] == 'LI':
            prev = _re.sub(r'^[\d✓]+\.?\s*', '', res[-1][1]).strip()
            if prev == t or prev.endswith(t) or t.endswith(prev): continue
        res.append((tag, t))
    return res
SKIP_H2 = _re.compile(r'preguntas|^solicite|^proteja su|tiene una plaga|lo que dicen|^¿necesita|cotizaci|^cotice|otros servicios|servicios relacionados|alivio|nuestros servicios|^servicios de fumigaci|qué necesita proteger|suelen preguntarnos|problema hoy|^protéjase|^detenga|^no se arriesgue', _re.I)
STOP_H = _re.compile(r'^(¿Necesita fumigación\?|Herramientas|Artículos relacionados|Sobre AGROINCOL|¿Necesita Control de Plagas\?|Solicite su Cotización Gratis)$', _re.I)
def _clean(items, skip_sections=True, keep_lead=False):
    out, skipping, seen_h1, lead_taken = [], False, False, keep_lead
    for tag, t in items:
        if tag in ("A", "BUTTON"): continue
        if tag in ("H2", "H3") and STOP_H.match(t): break
        if tag == "H1": seen_h1 = True; continue
        if not seen_h1: continue
        if not lead_taken and tag == "P": lead_taken = True; continue
        if tag == "H2": skipping = bool(skip_sections and SKIP_H2.search(t))
        if skipping: continue
        if tag == "LI" and t.startswith("›"): continue
        if tag == "P" and len(t) < 30: continue
        if t.endswith("→"): continue
        out.append((tag, t))
    out = [x for i, x in enumerate(out) if not (x[0] == "H3" and (i + 1 == len(out) or out[i + 1][0] in ("H2", "H3")))]
    return out
def _slug(t):
    t = t.lower()
    for a, b in zip("áéíóúñü", "aeiounu"): t = t.replace(a, b)
    return _re.sub(r'[^a-z0-9]+', '-', t).strip('-')[:60]
def to_html(items, dropcap=True, ids=True):
    out, lst, first_p = [], None, True
    def close():
        nonlocal lst
        if lst: out.append('</ol>' if lst == 'ol' else '</ul>'); lst = None
    for tag, raw in items:
        t = H.escape(raw, quote=False)
        if tag == "LI":
            kind = 'ol' if _re.match(r'^\d+\D', raw) else ('checks' if raw.startswith('✓') else 'ul')
            txt = _re.sub(r'^\d+\.?\s*', '', t) if kind == 'ol' else t.lstrip('✓ ').strip()
            if lst != kind:
                close(); lst = kind
                out.append({'ol': '<ol class="numbered">', 'checks': '<ul class="checks">', 'ul': '<ul class="gel-list">'}[kind])
            out.append(f'<li>{txt}</li>'); continue
        close()
        if tag == "H2":
            idattr = f' id="{_slug(raw)}"' if ids else ''
            out.append(f'<h2{idattr} data-reveal>{t}</h2>')
        elif tag in ("H3", "H4"): out.append(f'<h3>{t}</h3>')
        elif tag == "BLOCKQUOTE": out.append(f'<blockquote>{t}</blockquote>')
        elif tag == "P":
            if raw.startswith("¿Sabía que"):
                out.append(f'<aside class="callout" data-reveal><span class="label">¿Sabía que…?</span><p>{H.escape(raw.split("?", 1)[1].strip(), quote=False)}</p></aside>')
                continue
            t = _re.sub(r'^(\d+\. [^.]{3,90}\.)', r'<strong>\1</strong>', t)
            out.append(f'<p class="dropcap" data-reveal>{t}</p>' if (first_p and dropcap) else f'<p>{t}</p>')
            first_p = False
    close()
    return "\n".join(out)
def guia(topic, items):
    if not items: return ""
    h2s = [t for tag, t in items if tag == "H2"]
    idx = "".join(f'<li><a href="#{_slug(t)}">{H.escape(t, quote=False)}</a></li>' for t in h2s)
    nav = f'<nav class="guia-index" aria-label="En esta guía"><span class="label">En esta guía</span><ol>{idx}</ol></nav>' if len(h2s) > 1 else '<div></div>'
    return ('<section class="guia" aria-label="Guía completa">\n'
            f'  <div class="guia-head"><span class="label">Guía completa</span><p class="display" data-reveal>{topic}</p></div>\n'
            f'  <div class="guia-grid">{nav}<div class="article guia-body">{to_html(items, dropcap=True)}</div></div>\n'
            '</section>')

SERV_OPTS = ["Fumigación Residencial", "Fumigación para Restaurantes", "Control de Plagas Comercial", "Desratización", "Control de Insectos Voladores", "Fumigación Industrial", "Otro"]
def cotizar(title="¿Tiene una plaga<br>ahora?", pre=None):
    opts = "".join(f'<option{" selected" if o == pre else ""}>{o}</option>' for o in SERV_OPTS)
    return f'''<section class="cotizar" id="cotizar">
  <div class="cot-box">
    <div class="cot-copy" data-reveal>
      <span class="label">Cotización gratis</span>
      <h2 class="display">{title}</h2>
      <p>Déjenos sus datos. Le respondemos por WhatsApp en menos de 5 minutos.</p>
      <ul class="cot-list"><li>Cotización gratis y sin compromiso</li><li>Respuesta por WhatsApp en menos de 5 minutos</li><li>Certificado válido ante INVIMA</li><li>40+ años de experiencia</li></ul>
      <div class="cot-alt"><a class="btn btn-naranja" href="{WA}">Prefiero WhatsApp</a><a class="call" href="tel:+573107891948">Llamar 310 789 1948</a></div>
    </div>
    <form class="cot-form" data-lead-form novalidate>
      <p class="cot-form-t">Solicite su cotización</p>
      <label class="fld"><span>Nombre completo *</span><input name="nombre" type="text" autocomplete="name" placeholder="Ej: Juan Pérez" required><em class="err">Escriba su nombre.</em></label>
      <label class="fld"><span>Teléfono / WhatsApp *</span><input name="telefono" type="tel" autocomplete="tel" inputmode="tel" placeholder="Ej: 310 789 1948" required><em class="err">Escriba un número de 10 dígitos.</em></label>
      <label class="fld"><span>¿Qué servicio necesita? *</span><span class="sel"><select name="tipoServicio" required><option value="">Seleccione un servicio</option>{opts}</select></span><em class="err">Elija un servicio.</em></label>
      <div class="hp" aria-hidden="true"><label>Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label></div>
      <label class="chk"><input name="aceptaTerminos" type="checkbox" required><span>Autorizo a AGROINCOL para el tratamiento de mis datos personales según la <a href="politica-de-privacidad.html" data-transition>Política de Tratamiento de Datos Personales</a>. *</span></label>
      <em class="err err-chk">Debe aceptar para continuar.</em>
      <button class="btn btn-verde" type="submit">Solicitar cotización gratis</button>
      <p class="cot-note">Respuesta por WhatsApp en menos de 5 minutos · Sin compromiso</p>
      <div class="cot-ok" role="status" aria-live="polite" hidden><span class="gel"></span><p class="cot-ok-t">Listo.</p><p>Le escribimos por WhatsApp en menos de 5 minutos.</p></div>
    </form>
  </div>
</section>'''
