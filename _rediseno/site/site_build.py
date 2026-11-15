import os
HERE = os.path.dirname(os.path.abspath(__file__)) + '/'
CONT = os.path.join(HERE, '..', 'contenido-sitio-actual') + '/'
# Construye todas las páginas del prototipo con las mismas piezas.
import html as H

WA = "https://wa.me/573107891948"
WA_ICON = '<svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#143C2C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/></svg>'
PHONE_ICON = '<svg aria-hidden="true" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#164A38" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/></svg>'

# ---------------- Servicios (contenido del sitio actual) ----------------
S = [
 dict(slug="fumigacion-residencial", short="Residencial", obj="casa", name="Fumigación residencial",
      cap="Proteja su hogar y familia de plagas con nuestro servicio certificado para casas y apartamentos.",
      big=("Fumigación", "residencial"), small="en Bucaramanga y Área Metropolitana",
      title="Fumigación Residencial en Bucaramanga | AGROINCOL",
      left="Casas<br>Apartamentos", right="Desde 1985<br>Santander",
      lead="Proteja su hogar y familia con productos seguros aprobados por la OMS y el ICA. Sin riesgo para niños ni mascotas. Más de 40 años de experiencia en Bucaramanga, Floridablanca, Piedecuesta y Girón.",
      incluye="Inspección, tratamiento de cocina, baños y zonas de riesgo, y recomendaciones para después de la visita.",
      chips=["Única", "Cada 3 meses", "Cada 6 meses"], garantia="Si la plaga vuelve entre visitas, volvemos sin costo.",
      faq=["¿Es seguro para mascotas y niños?", "¿Cada cuánto se recomienda fumigar una vivienda?", "¿Qué debo hacer antes de la fumigación?"],
      gal=[("proteccion", "En la cocina", "Gel y cebos donde se esconde la plaga."), ("tranquilidad", "Sin sacar a nadie", "Usted a lo suyo, que la plaga es cosa nuestra.")], hogar=True),
 dict(slug="fumigacion-restaurantes", short="Restaurantes", obj="olla", name="Fumigación para restaurantes",
      cap="Cumpla con la Resolución 2674 del INVIMA. Servicio especializado para el sector de alimentos.",
      big=("Control de plagas", "para restaurantes"), small="en Bucaramanga",
      title="Fumigación Restaurantes Bucaramanga | AGROINCOL",
      left="Restaurantes<br>Cafeterías · Panaderías", right="Inspección<br>sin costo",
      lead="Cumpla con la Resolución 2674 del INVIMA y proteja su establecimiento. Servicio con más de 40 años de experiencia en el sector de alimentos.",
      incluye="Inspección, tratamiento en cocina y bodega, acta de hallazgos y seguimiento del plan.",
      chips=["Trimestral", "Bimestral", "Mensual"], garantia="Si algo no quedó bien, volvemos sin costo.",
      faq=["¿Cada cuánto se debe fumigar un restaurante en Colombia?", "¿Qué productos utilizan? ¿Son seguros para áreas de alimentos?", "¿Necesito cerrar mi restaurante durante la fumigación?", "¿Ofrecen planes de mantenimiento para restaurantes?"],
      gal=[], special="restaurantes"),
 dict(slug="control-plagas-comercial", short="Comercial", obj="local", name="Control de plagas comercial",
      cap="Soluciones integrales para oficinas, locales y establecimientos comerciales en el área metropolitana.",
      big=("Control de plagas", "para negocios"), small="en Bucaramanga",
      title="Control de Plagas para Negocios en Bucaramanga | AGROINCOL",
      left="Locales · Oficinas<br>Centros comerciales", right="Fuera de<br>horario",
      lead="Proteja la imagen y operación de su negocio. Programa MIP documentado, visitas periódicas y documentación para inspecciones sanitarias.",
      incluye="Programa MIP documentado, visitas periódicas y acta de cada visita.",
      chips=["Mensual", "Bimestral", "Trimestral"], garantia="Si algo no quedó bien, volvemos sin costo.",
      faq=["¿Debo cerrar el negocio durante la fumigación?", "¿Trabajan fuera de horario comercial?", "¿Cada cuánto se recomienda el servicio para un negocio?"],
      gal=[("rapidez", "De una llegamos", "Usted llama y de una llegamos.")]),
 dict(slug="desratizacion", short="Desratización", obj="estacion", name="Desratización",
      cap="Eliminación profesional de roedores con métodos seguros y seguimiento garantizado.",
      big=("Desratización", "profesional"), small="en Bucaramanga y Área Metropolitana",
      title="Desratización Profesional en Bucaramanga | AGROINCOL",
      left="Hogares · Negocios<br>Bodegas", right="Sellado de<br>entradas",
      lead="Eliminamos ratas y ratones identificando y sellando sus vías de entrada. Diagnóstico profesional, tratamiento efectivo y seguimiento para garantizar que no regresen.",
      incluye="Diagnóstico, estaciones de cebado seguras, trampas y sellado de puntos de entrada.",
      chips=["Única", "Mensual", "Bimestral"], garantia="Si los roedores vuelven entre visitas, volvemos sin costo.",
      faq=["¿Cómo sé si tengo ratas o ratones?", "¿Usan veneno o trampas?", "¿Incluye sellado de puntos de entrada?"], gal=[]),
 dict(slug="control-insectos-voladores", short="Voladores", obj="bomba", name="Control de insectos voladores",
      cap="Control efectivo de mosquitos, moscas y zancudos. Prevención de dengue y enfermedades vectoriales.",
      big=("Mosquitos, moscas", "y zancudos"), small="Control en Bucaramanga",
      title="Control de Mosquitos, Moscas y Zancudos en Bucaramanga | AGROINCOL",
      left="Hogares<br>Negocios", right="Antes de<br>las lluvias",
      lead="Prevención de dengue, zika y chikungunya en el Área Metropolitana. Tratamiento profesional que elimina adultos, huevos y larvas.",
      incluye="Control de adultos, larvicidas en criaderos y productos con efecto residual.",
      chips=["Febrero", "Agosto", "Trimestral", "Bimestral"], garantia="Si algo no quedó bien, volvemos sin costo.",
      faq=["¿Por qué hay más zancudos en temporada de lluvias?", "¿El tratamiento elimina también huevos y larvas?", "¿Cada cuánto se necesita el servicio?"], gal=[]),
 dict(slug="fumigacion-industrial", short="Industrial", obj="estiba", name="Fumigación industrial",
      cap="Servicio de control de plagas para bodegas, plantas de producción y zonas industriales.",
      big=("Fumigación", "industrial"), small="y control de plagas para empresas en Bucaramanga",
      title="Fumigación Industrial en Bucaramanga | AGROINCOL",
      left="Bodegas · Plantas<br>Centros logísticos", right="Expediente<br>para auditoría",
      lead="Protocolo MIP documentado para plantas de producción, bodegas y zonas industriales. Registros para auditorías de calidad.",
      incluye="Inspección, monitoreo de trampas y estaciones, aplicaciones preventivas e informe de cada visita.",
      chips=["Mensual", "Bimestral"], garantia="Garantía según contrato, con registro de cada visita.",
      faq=["¿El servicio incluye documentación para auditorías?", "¿Trabajan en plantas de producción activas?", "¿Ofrecen programa de mantenimiento con visitas periódicas?"], gal=[]),
 dict(slug="control-comejen-termitas", short="Comején", obj="viga", name="Control de comején y termitas",
      cap="Detección y eliminación de comején y termitas antes de que dañen la estructura de su propiedad.",
      big=("Comején", "y termitas"), small="Control en Bucaramanga",
      title="Control de Comején y Termitas en Bucaramanga | AGROINCOL",
      left="Casas · Muebles<br>Estructuras de madera", right="Toda la<br>colonia",
      lead="Eliminamos la colonia completa, no solo los insectos visibles. Inspección, inyección directa y barreras químicas con más de 40 años de experiencia en Santander.",
      incluye="Inspección y diagnóstico, inyección y barreras químicas, y visitas de verificación.",
      chips=["2 a 6 semanas", "Seguimiento"], garantia="Volvemos a verificar que no haya actividad nueva.",
      faq=["¿Cómo sé si tengo comején en mi casa?", "¿Los remedios caseros o insecticidas de supermercado funcionan contra el comején?", "¿Cuánto dura el tratamiento y cuándo veo resultados?"], gal=[]),
 dict(slug="eliminacion-abejas-avispas", short="Abejas y avispas", obj="panal", name="Retiro de abejas y avispas",
      cap="Retiro seguro de nidos de abejas y avispas con equipos especializados. Atención de urgencia.",
      big=("Retiro de abejas", "y avispas"), small="en Bucaramanga",
      title="Retiro de Abejas y Avispas en Bucaramanga | AGROINCOL",
      left="Casas · Negocios<br>Conjuntos", right="Atención<br>de urgencia",
      lead="¿Encontró un nido en su casa o negocio? No intente retirarlo: aléjese y escríbanos por WhatsApp con una foto. Retiro seguro con equipos de protección especializados.",
      incluye="Identificación por foto, retiro con equipo de protección y reubicación de abejas cuando es posible.",
      chips=["Urgencia", "Mismo día"], garantia="Si el nido vuelve a formarse, volvemos sin costo.",
      faq=["¿Qué hago si encuentro un nido de abejas o avispas en mi casa?", "¿Las abejas se exterminan o se reubican?", "¿Cómo sé si tengo abejas o avispas?"], gal=[]),
 dict(slug="control-chinches", short="Chinches", obj="colchon", name="Control de chinches de cama",
      cap="Eliminación profesional de chinches en hogares, hoteles y hospedajes con tratamiento de seguimiento.",
      big=("Chinches", "de cama"), small="Control en Bucaramanga",
      title="Control de Chinches de Cama en Bucaramanga | AGROINCOL",
      left="Hogares · Hoteles<br>Hospedajes", right="Segunda visita<br>incluida",
      lead="Eliminación profesional con inspección minuciosa, tratamiento certificado y segunda visita para romper el ciclo de huevos.",
      incluye="Inspección minuciosa, tratamiento dirigido y segunda visita de refuerzo.",
      chips=["2 visitas", "Seguimiento"], garantia="La segunda visita rompe el ciclo y evita la reinfestación.",
      faq=[], gal=[("tranquilidad", "Vuelva a dormir", "Usted a lo suyo, que la plaga es cosa nuestra.")], hogar=True),
]
SBY = {s["slug"]: s for s in S}

import json
FAQ_ALL = {}
for path, v in json.load(open(CONT + 'svc.json')).items():
    for q, a in v['faq']:
        FAQ_ALL[q.strip()] = a.strip()
FAQ_ALL.update({
 "¿Cómo sé si tengo chinches de cama y no pulgas o zancudos?": "Las picaduras de chinches suelen aparecer en línea o en grupos de tres al despertar, en zonas expuestas como brazos, cuello y piernas. Además, revise las sábanas y las costuras del colchón: manchas pequeñas de sangre, puntos negros o un olor dulzón en la habitación son señales típicas. Si tiene dudas, nuestra inspección lo confirma.",
 "¿Cuántas visitas se necesitan para eliminar las chinches por completo?": "El tratamiento incluye una primera visita de inspección y aplicación, y una segunda visita de refuerzo para eliminar las ninfas que nacen de los huevos que sobreviven al primer tratamiento. Esa segunda visita es la que rompe el ciclo y evita la reinfestación.",
 "¿Tengo que botar el colchón si hay chinches?": "En la mayoría de los casos no es necesario. El tratamiento incluye el colchón, el somier y la base de la cama, además de zócalos, grietas y muebles cercanos. Botar el colchón sin tratar la habitación no resuelve el problema.",
})
SBY["control-chinches"]["faq"] = ["¿Cómo sé si tengo chinches de cama y no pulgas o zancudos?", "¿Cuántas visitas se necesitan para eliminar las chinches por completo?", "¿Tengo que botar el colchón si hay chinches?"]

_FORM = {"fumigacion-residencial": "Fumigación Residencial", "fumigacion-restaurantes": "Fumigación para Restaurantes", "control-plagas-comercial": "Control de Plagas Comercial", "desratizacion": "Desratización", "control-insectos-voladores": "Control de Insectos Voladores", "fumigacion-industrial": "Fumigación Industrial"}
for _s in S:
    _s["guia"] = _s["name"].lower()
    _s["form"] = _FORM.get(_s["slug"])
ILU = {"proteccion": ("ilustracion-pilar-proteccion.webp", "Técnico aplicando gel en la cocina"), "rapidez": ("ilustracion-pilar-rapidez.webp", "Técnico llegando a una casa"), "tranquilidad": ("ilustracion-pilar-tranquilidad.webp", "Familia tranquila en la sala mientras el técnico trabaja"), "1985": ("ilustracion-historia-1985-fumigador-rural.webp", "Fumigación rural de AGROINCOL en 1985"), "ciudad": ("ilustracion-portada-bucaramanga.webp", "Ilustración de Bucaramanga y la meseta")}

MENU = [("index.html", "Inicio"), ("servicios.html", "Servicios"), ("servicio-fumigacion-restaurantes.html", "Restaurantes"), ("empresas.html", "Empresas"), ("zonas.html", "Zonas"), ("herramientas.html", "Herramientas"), ("blog.html", "Blog")]

def head(title, desc, extra_js=""):
    menu_links = "\n    ".join(f'<a href="{h}" data-transition>{n}</a>' for h, n in MENU)
    return f'''<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{H.escape(desc)}">
<meta name="theme-color" content="#164A38">
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/site.css">
</head>
<body>
<a class="sr" href="#contenido">Saltar al contenido</a>
<div class="cursor" aria-hidden="true"><span></span></div>
<div class="veil" aria-hidden="true"></div>
<div class="progress" aria-hidden="true"></div>
<header class="site-header">
  <nav class="seg pill" aria-label="Segmentos"><a href="servicio-fumigacion-residencial.html" data-transition>HOGAR</a><span aria-hidden="true">·</span><a href="servicio-fumigacion-restaurantes.html" data-transition>RESTAURANTES</a><span aria-hidden="true">·</span><a href="empresas.html" data-transition>EMPRESAS</a></nav>
  <a class="brand" href="index.html" data-transition aria-label="AGROINCOL, inicio"><img src="assets/agroincol-logo-principal.svg" alt="AGROINCOL" width="146" height="145"></a>
  <div class="actions">
    <button class="pill" type="button" data-menu aria-expanded="false" aria-controls="menu">MENÚ</button>
    <a class="wa-circle" href="{WA}" aria-label="Cotizar por WhatsApp" data-cursor="WHATSAPP">{WA_ICON}</a>
  </div>
</header>
<div class="menu" id="menu" role="dialog" aria-label="Menú">
  <button class="pill close" type="button" data-menu>CERRAR</button>
  <nav aria-label="Menú principal">
    {menu_links}
  </nav>
  <div class="menu-foot"><span>Cra. 36 #197-30, Floridablanca · 310 789 1948</span><a class="btn btn-naranja" href="{WA}">Cotizar por WhatsApp</a></div>
</div>
'''

def foot(extra_js=""):
    nav = "".join(f'<a href="{h}" data-transition>{n}</a>' for h, n in MENU)
    return f'''<footer class="site-footer">
  <img class="giant" src="assets/agroincol-logo-horizontal-blanca.svg" alt="AGROINCOL" width="974" height="359" loading="lazy">
  <div class="foot-grid">
    <div><img src="assets/agroincol-logo-simbolo-blanco.svg" alt="" width="64" height="64" style="width:64px;margin-bottom:12px"><span class="olabel">© 2026 AGROINCOL</span>Agroindustria Colombiana SAS</div>
    <nav aria-label="Pie de página">{nav}</nav>
    <div><span class="olabel">Sede</span>Cra. 36 #197-30<br>Floridablanca, Santander<br><br><span class="olabel">Contacto</span>310 789 1948</div>
    <div><p class="big">¿Tiene una plaga ahora? Escríbanos: le respondemos por WhatsApp en menos de 5 minutos.</p><a href="{WA}" style="color:#F5682E;font-weight:700">Cotizar por WhatsApp →</a></div>
  </div>
  <div class="foot-bottom"><span><a href="precios.html" data-transition>Precios</a> · <a href="certificado-de-fumigacion.html" data-transition>Certificado de fumigación</a> · <a href="certificaciones-y-normativa.html" data-transition>Normativa</a> · <a href="politica-de-privacidad.html" data-transition>Política de datos</a></span><span><a href="zona-fumigacion-bucaramanga.html" data-transition>Bucaramanga</a> · <a href="zona-fumigacion-floridablanca.html" data-transition>Floridablanca</a> · <a href="zona-fumigacion-piedecuesta.html" data-transition>Piedecuesta</a> · <a href="zona-fumigacion-giron.html" data-transition>Girón</a></span></div>
</footer>
<div class="mbar"><a class="btn btn-naranja" href="{WA}">Cotizar por WhatsApp</a><a class="call" href="tel:+573107891948" aria-label="Llamar al 310 789 1948">{PHONE_ICON}</a></div>
<script src="js/gsap.min.js"></script>
<script src="js/ScrollTrigger.min.js"></script>
<script src="js/lenis.min.js"></script>
<script src="js/site.js"></script>
{extra_js}
</body>
</html>
'''

def crumb(items):
    parts = []
    for h, n in items:
        parts.append(f'<a href="{h}" data-transition>{n}</a>' if h else n)
    return '<p class="crumb">' + " · ".join(parts) + '</p>'

def hero_fall(tag, big, small, obj, left, right, para, crumbs, cta=True, small_first=False, fall="load", size=""):
    sm = f'<span class="h1-small">{small}</span>' if small else ""
    lines = " ".join(f"<span>{l}</span>" for l in big)
    inner = (sm + " " + lines) if small_first else (lines + " " + sm)
    btns = f'<div class="srv-cta"><a class="btn btn-naranja" href="{WA}">Cotizar por WhatsApp</a><a class="btn btn-linea" href="tel:+573107891948">Llamar 310 789 1948</a></div>' if cta else ""
    return f'''<section class="foco srv-hero" data-fall="{fall}">
  {crumb(crumbs)}
  <{tag} class="display {size}">{inner}</{tag}>
  <div class="foco-row">
    <p>{left}</p>
    <div class="foco-obj"><img src="assets/obj-{obj}.webp" alt="" width="200" height="200"></div>
    <p>{right}</p>
  </div>
  <div class="foco-text"><span class="gel" data-drop></span><p>{para}</p></div>
  {btns}
</section>'''

def hero_title(tag, big, small, para, crumbs, small_first=True, size="", extra=""):
    sm = f'<span class="h1-small">{small}</span>' if small else ""
    lines = " ".join(f"<span>{l}</span>" for l in big)
    inner = (sm + " " + lines) if small_first else (lines + " " + sm)
    return f'''<section class="page-hero">
  {crumb(crumbs)}
  <{tag} class="display {size}">{inner}</{tag}>
  {f'<p class="page-lead" data-reveal>{para}</p>' if para else ''}
  {extra}
</section>'''

def tabla(cols):
    out = '<div class="tabla" data-reveal>'
    for label, body in cols:
        out += f'<div><span class="label">{label}</span>{body}</div>'
    return out + '</div>'

def chips(items):
    return '<div class="chips">' + "".join(f"<span>{c}</span>" for c in items) + '</div>'

def faq(title, qs, aside=""):
    items = "".join(f'<details><summary>{q}</summary><p>{FAQ_ALL.get(q, "")}</p></details>' for q in qs if FAQ_ALL.get(q))
    if not items: return ""
    return f'''<section class="voces" aria-label="{title.replace('<br>', ' ')}">
  <div class="faq-wrap" style="margin-top:0">
    <div><h2 class="display">{title}</h2>{aside}</div>
    <div class="faq">{items}</div>
  </div>
</section>'''

def faq_raw(title, pairs):
    items = "".join(f'<details><summary>{q}</summary><p>{a}</p></details>' for q, a in pairs)
    return f'''<section class="voces"><div class="faq-wrap" style="margin-top:0"><div><h2 class="display">{title}</h2></div><div class="faq">{items}</div></div></section>'''

def galeria(gid, title, slides):
    if not slides: return ""
    sl = "".join(f'<figure class="slide"><img src="assets/{ILU[k][0]}" alt="{ILU[k][1]}" width="1600" height="900" loading="lazy"><figcaption><strong>{t}</strong><span>{c}</span></figcaption></figure>' for k, t, c in slides)
    return f'''<section class="galeria">
  <div class="galeria-head"><h2 class="display" data-reveal>{title}</h2><span class="count" data-count="{gid}">01 / {len(slides):02d}</span></div>
  <div class="track" id="{gid}" data-cursor="ARRASTRE" tabindex="0" aria-label="Galería, deslice para ver más">{sl}</div>
</section>'''

def cards(exclude=None, title="Otros<br>servicios"):
    out = ""
    for s in S:
        if s["slug"] == exclude: continue
        out += f'<a class="card" href="servicio-{s["slug"]}.html" data-transition data-cursor="VER SERVICIO"><div class="art"><img src="assets/obj-{s["obj"]}.webp" alt="" width="200" height="200" loading="lazy"></div><span class="name">{s["name"]}</span></a>\n'
    return f'''<section class="otros">
  <h2 class="display" data-reveal>{title}</h2>
  <div class="cards" data-cursor="ARRASTRE" tabindex="0" aria-label="Servicios, arrastre para ver más">{out}</div>
</section>'''

def rows(items, size="md"):
    out = '<section class="segs">'
    for i, it in enumerate(items):
        pic = f'<span class="pic"><img src="assets/obj-{it["obj"]}.webp" alt="" width="200" height="200"></span>' if it.get("obj") else ""
        tr = ' data-transition' if it["href"] != "#" else ""
        out += f'<a class="seg-row {size}" href="{it["href"]}"{tr} data-cursor="{it.get("cursor", "VER")}"><span class="num">{i+1:02d}</span><span class="display word">{it["word"]}<svg viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M 5 10 Q 500 70 995 10"/></svg></span><span class="aside"><p class="cap">{it["cap"]}</p>{pic}</span></a>'
    return out + '</section>'

def cta(title="¿Tiene una plaga<br>ahora?", text="Escríbanos. Le respondemos por WhatsApp en menos de 5 minutos.", btn="Cotizar por WhatsApp"):
    return f'''<section class="cta-final">
  <div data-reveal>
    <h2 class="display">{title}</h2>
    <p>{text}</p>
    <div class="btns"><a class="btn btn-naranja" href="{WA}">{btn}</a><a class="btn btn-linea" href="tel:+573107891948">Llamar 310 789 1948</a></div>
  </div>
</section>'''

def lead_block(text, zonas=False):
    z = '<p class="zonas">Atendemos Bucaramanga, Floridablanca, Piedecuesta y Girón.</p>' if zonas else ""
    return f'<section class="metodo"><span class="gel" data-drop></span><p class="lead" data-reveal>{text}</p>{z}<span class="gel" data-drop style="margin-top:30px"></span>'

def colados_block(title=("Usted a", "lo suyo"), sub="que la plaga es cosa nuestra.", label="Para su casa"):
    imgs = "".join(f'<span class="colado"><img src="assets/{f}" alt="" width="{w}" height="500"></span>' for f, w in [("colado-rosa-desvelo-chinche.webp", 337), ("colado-don-serenata-zancudo.webp", 351), ("colado-mordisco-comejen.webp", 334), ("colado-la-ingeniera-hormiga.webp", 364), ("colado-pulgarcito-pulga.webp", 431)])
    return f'''<section class="hogar">
  <div class="hogar-copy">
    <span class="label">{label}</span>
    <h2 class="display" data-reveal>{title[0]}<br>{title[1]}</h2>
    <p class="sub">{sub}</p>
    <p class="lema">Llegó AGROINCOL. Nos vamos.</p>
  </div>
  <div class="hogar-stage" aria-hidden="true">{imgs}</div>
</section>'''

exec(open(HERE + 'build_helpers.py').read())

pages = {}

# ---------------- HOME ----------------
src = open(HERE + 'index.html').read()
home_main = src[src.index('<main id="contenido">'):src.index('<footer class="site-footer">')]
import re
ORB = [
    ("casa", "Hogar", "Hogar", "Cucarachas, hormigas y zancudos", "servicio-fumigacion-residencial.html", "VER HOGAR"),
    ("olla", "Restaurantes", "Restaurantes", "Con acta para el INVIMA", "servicio-fumigacion-restaurantes.html", "VER RESTAURANTES"),
    ("local", "Locales y oficinas", "Comercios", "Oficinas, tiendas y locales", "servicio-control-plagas-comercial.html", "VER COMERCIAL"),
    ("estiba", "Bodegas e industria", "Industria", "Programa MIP para auditorías", "empresas.html", "VER EMPRESAS"),
    ("aplicador", "Cucarachas", "Cucarachas", "Gel cebo donde se esconden", "servicio-fumigacion-residencial.html", "VER CUCARACHAS"),
    ("estacion", "Ratas y ratones", "Roedores", "Estaciones cebaderas con llave", "servicio-desratizacion.html", "VER ROEDORES"),
    ("bomba", "Zancudos y moscas", "Zancudos", "Aspersión contra el dengue", "servicio-control-insectos-voladores.html", "VER VOLADORES"),
]
orb_html = '<div class="orbit-word" aria-hidden="true"><span>' + ORB[0][2] + '</span></div><div class="orbit">' + "".join(
    f'<a class="obj" href="{h}" data-transition data-cursor="{c}" aria-label="{t}: {d}" data-title="{t}" data-word="{w}" data-desc="{d}"><img src="assets/obj-{o}.webp" alt="" width="200" height="200"></a>'
    for o, t, w, d, h, c in ORB) + '</div>'
home_main = re.sub(r'(<div class="orbit-word".*?</div>)?<div class="orbit">.*?</a></div>(<a class="orbit-tag".*?</a>)?', lambda m: orb_html, home_main, count=1, flags=re.S)
home_main = re.sub(r'\s*<p class="orbit-cap[^"]*".*?</p>', '', home_main, flags=re.S)
cap = f'<p class="orbit-cap sr" aria-live="polite"><span class="oc-n">{ORB[0][1]}</span>: <span class="oc-d">{ORB[0][3]}</span></p>'
home_main = home_main.replace('<div class="hero-copy">', '<div class="hero-copy">\n    ' + cap, 1)
seg_hrefs = ["servicio-fumigacion-residencial.html", "servicio-fumigacion-restaurantes.html", "empresas.html"]
for h in seg_hrefs:
    home_main = home_main.replace('<a class="seg-row" href="#" data-cursor="VER SERVICIO">', f'<a class="seg-row" href="{h}" data-transition data-cursor="VER SERVICIO">', 1)
home_main = home_main[:home_main.index('<section class="otros"')] + cards() + home_main[home_main.index('<section class="voces"'):]
home_main = _re.sub(r'<section class="guia".*?\n</section>\s*', '', home_main, flags=_re.S)
home_main = home_main.replace('<section class="voces"', guia('Por qué<br>AGROINCOL', _clean(_items(ACT["/"]))) + '\n<section class="voces"', 1)
home_main = _re.sub(r'<section class="cotizar".*?</form>\s*</div>\s*</section>\s*', '', home_main, flags=_re.S)
home_main = _re.sub(r'<section class="cta-final">.*?</section>', '', home_main, count=1, flags=_re.S)
home_main = home_main.replace('</main>', cotizar() + '\n</main>', 1) if '<section class="cotizar"' not in home_main else home_main
pages["index.html"] = head("Fumigación y Control de Plagas en Bucaramanga | AGROINCOL", "Más de 40 años protegiendo hogares, restaurantes e industrias en Bucaramanga, Floridablanca, Piedecuesta y Girón.") + home_main + foot()

# ---------------- SERVICIOS (índice) ----------------
pages["servicios.html"] = head("Servicios de Fumigación y Control de Plagas en Bucaramanga | AGROINCOL", "Control profesional de cucarachas, termitas, roedores, moscas e insectos para hogares, restaurantes e industrias.") + f'''
<main id="contenido">
{hero_title("h1", ["Nuestros", "servicios"], "de control de plagas", "Soluciones profesionales para hogares, restaurantes e industrias en Bucaramanga y el Área Metropolitana. Elija su caso.", [("index.html", "Inicio"), (None, "Servicios")], small_first=False)}
{rows([dict(word=s["short"], cap=s["cap"], obj=s["obj"], href=f'servicio-{s["slug"]}.html', cursor="VER SERVICIO") for s in S], "md")}
{cta()}
</main>''' + foot()

# ---------------- PÁGINAS DE SERVICIO ----------------
def service_page(s):
    crumbs = [("index.html", "Inicio"), ("servicios.html", "Servicios"), (None, s["name"])]
    body = hero_fall("h1", s["big"], s["small"], s["obj"], s["left"], s["right"], s["lead"], crumbs, size="sm")
    if s.get("special") == "restaurantes":
        body += restaurant_sections()
    else:
        body += lead_block(f'Tratamos la plaga donde vive, no solo donde se ve. {s["incluye"]}', zonas=True) + tabla([("Qué incluye", f'<p>{s["incluye"]}</p>'), ("Frecuencia", chips(s["chips"])), ("Garantía", f'<p>{s["garantia"]}</p>')]) + "</section>"
    body += galeria(f'g-{s["slug"]}', "En el<br>terreno", s["gal"])
    if s.get("hogar"): body += colados_block()
    body += guia(f'Todo sobre<br>{s["guia"]}', _clean(_items(D1.get("/servicios/" + s["slug"], ""))))
    body += faq("Preguntas<br>frecuentes", s["faq"])
    body += cards(s["slug"])
    body += cotizar(pre=s.get("form"))
    return head(s["title"], s["lead"][:155]) + f'<main id="contenido">{body}</main>' + foot()

def restaurant_sections():
    steps = [("Confirmación previa", "Mensaje con fecha, hora y técnico asignado."), ("Inspección diagnóstica", "Revisión de puntos críticos con fotos."), ("Tratamiento profesional", "Aspersión y gel con productos registrados."), ("Limpieza y orden", "Dejamos el espacio igual o mejor."), ("Cierre presencial", "Resumen de hallazgos y recomendaciones."), ("Reporte digital", "Le llega por WhatsApp el mismo día.")]
    st = "".join(f'<li data-reveal><span class="n">{i+1:02d}</span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate(steps))
    programs = [("Control", "Cada 3 meses", ["4 visitas al año", "Acta de cada visita", "1 estación de roedores"], "Cumplir el mínimo legal."),
                ("Protección", "Cada 2 meses", ["6 visitas al año", "Reporte con fotos de cada visita", "Garantía entre visitas, respuesta en menos de 24 h", "Soporte documental en auditorías"], "Operar tranquilo."),
                ("Blindaje", "Cada mes", ["12 visitas al año", "Informe trimestral de tendencias", "Acompañamiento en auditorías", "Garantía ilimitada, respuesta en menos de 12 h"], "Restaurante grande, cadena u hotel.")]
    pr = ""
    for i, (n, f, items, ideal) in enumerate(programs):
        feat = " is-featured" if i == 1 else ""
        li = "".join(f"<li>{x}</li>" for x in items)
        pr += f'<article class="program{feat}" data-reveal><span class="label">{f}</span><h3 class="display">{n}</h3><ul>{li}</ul><p class="ideal">Ideal para: {ideal}</p></article>'
    return f'''<section class="offer"><div><span class="label">Oferta para negocios con cocina</span><p class="offer-t">Inspección sin costo</p><p>Revisamos su cocina, bodega y desagües, y le mostramos los hallazgos antes de cotizar.</p></div><a class="btn btn-verde" href="{WA}">Pedir la inspección</a></section>
<section class="pasos">
  <h2 class="display" data-reveal>Así es<br>cada visita</h2>
  <ol class="steps6">{st}</ol>
</section>
<section class="norma">
  <span class="gel" data-drop></span>
  <p class="lead" data-reveal>La <strong>Resolución 2674 de 2013</strong> obliga a los establecimientos de alimentos a tener un Plan de Saneamiento con control de plagas ejecutado por una empresa especializada. No es un servicio anual: es un programa continuo.</p>
  <span class="gel" data-drop></span>
</section>
<section class="programas">
  <h2 class="display" data-reveal>Programas</h2>
  <div class="program-grid">{pr}</div>
  <p class="note">Cada programa se cotiza según el tamaño del establecimiento. Use la <a href="herramienta-calculadora.html" data-transition>calculadora de frecuencia</a> si no sabe cuál le sirve.</p>
</section>'''

for s in S:
    pages[f'servicio-{s["slug"]}.html'] = service_page(s)

# ---------------- EMPRESAS ----------------
mip = ["Control de roedores con estaciones de cebado permanentes y monitoreo periódico", "Fumigación de bodegas contra polillas, gorgojos e insectos de productos almacenados", "Control de insectos voladores con trampas UV y nebulización para plantas de alimentos", "Desinfección de áreas de producción conforme a Buenas Prácticas de Manufactura", "Plan de Manejo Integrado de Plagas con documentación para auditorías"]
mip_li = "".join(f'<li data-reveal><span class="n">{i+1:02d}</span><p>{x}</p></li>' for i, x in enumerate(mip))
docs = [("Fichas técnicas", "De todos los productos utilizados."), ("Registro de cada visita", "Firmado por el técnico."), ("Mapa de estaciones", "Ubicación de trampas y estaciones de cebado."), ("Informe de seguimiento", "Tendencias y acciones correctivas.")]
docs_h = "".join(f'<div class="doc" data-reveal><span class="doc-n">{i:02d}</span><h3>{t}</h3><p>{d}</p></div>' for i, (t, d) in enumerate(docs, 1))
pages["empresas.html"] = head("Control de Plagas para Empresas e Industria en Bucaramanga | AGROINCOL", "Programa de Manejo Integrado de Plagas documentado para negocios, bodegas y plantas de producción en Bucaramanga y el Área Metropolitana.") + f'''
<main id="contenido">
{hero_fall("h1", ["Empresas"], "Control de plagas para negocios e industria en Bucaramanga", "estiba", "Negocios · Bodegas<br>Plantas de producción", "Expediente<br>para auditoría", "Control de plagas certificado desde 1985. Cotización detallada por área, frecuencia y producto.", [("index.html", "Inicio"), (None, "Empresas")], small_first=False)}
{rows([dict(word="Comercial", cap=SBY["control-plagas-comercial"]["cap"], obj="local", href="servicio-control-plagas-comercial.html", cursor="VER SERVICIO"), dict(word="Industrial", cap=SBY["fumigacion-industrial"]["cap"], obj="estiba", href="servicio-fumigacion-industrial.html", cursor="VER SERVICIO"), dict(word="Restaurantes", cap=SBY["fumigacion-restaurantes"]["cap"], obj="olla", href="servicio-fumigacion-restaurantes.html", cursor="VER SERVICIO")], "md")}
<section class="pasos">
  <h2 class="display" data-reveal>Programa<br>MIP</h2>
  <ol class="steps6 five">{mip_li}</ol>
</section>
<section class="docs-sec">
  <h2 class="display" data-reveal>Lo que recibe<br>para su auditoría</h2>
  <div class="docs">{docs_h}</div>
  <p class="note">Documentación conforme al Decreto 1843 de 1991. Trabajamos antes de la apertura, después del cierre y los sábados en la mañana.</p>
</section>
<section class="metodo">{tabla([("Frecuencia", chips(["Mensual", "Bimestral", "Trimestral"])), ("Horario", "<p>Desde las 6 a. m., después del cierre y sábados.</p>"), ("Garantía", "<p>Según contrato, con registro de cada visita.</p>")])}</section>
{faq("Preguntas<br>frecuentes", ["¿El servicio incluye documentación para auditorías?", "¿Trabajan en plantas de producción activas?", "¿Trabajan fuera de horario comercial?", "¿Debo cerrar el negocio durante la fumigación?"])}
{cta("Pida una<br>visita técnica", "Le respondemos por WhatsApp en menos de 5 minutos y coordinamos el diagnóstico.", "Pedir visita técnica")}
</main>''' + foot()

# ---------------- ZONAS ----------------
Z = [
 dict(slug="fumigacion-bucaramanga", name="Bucaramanga", cap="Cobertura barrio por barrio: Cabecera, Centro, Provenza, Real de Minas y zona norte.",
      title="Control de Plagas en Bucaramanga: Todos los Barrios | AGROINCOL",
      lead="Cobertura en toda la ciudad, del Centro a Cabecera y de Provenza a la zona norte. Más de 40 años eliminando plagas en la capital de Santander.",
      stats=[("Toda la ciudad", "Norte, centro y sur"), ("Mismo día", "Tiempo de respuesta"), ("40+ años", "De experiencia"), ("4.9", "En Google")],
      intro="Bucaramanga es la ciudad más poblada de Santander, sobre una meseta de clima cálido. Esa combinación de temperatura templada todo el año, comercio denso en el Centro y edificios altos en Cabecera crea condiciones ideales para cucarachas, roedores y zancudos.",
      sectores=[("Cuadrante sur", "Cabecera del Llano, Sotomayor, El Prado, Nuevo Sotomayor, La Floresta y Terrazas. Edificios altos, donde las cucarachas se mueven por ductos y shafts."), ("Centro", "Centro, San Francisco, La Aurora, García Rovira y Girardot. La zona de mayor presión de roedores y cucarachas."), ("Occidente", "Provenza, La Victoria, Real de Minas, Ciudadela y Mutis. Quebradas cercanas que favorecen zancudos en lluvias."), ("Zona norte", "Café Madrid, Kennedy, Colorados, Villa Rosa y Regadero Norte. Control reforzado de roedores y vectores.")],
      plagas=[("Cucarachas", "La plaga más reportada. Se mueven entre apartamentos por ductos y tuberías: hay que tratar el edificio, no solo un apartamento."), ("Roedores", "Concentrados en el Centro, las plazas de mercado y las bodegas del norte. Cebado en estaciones seguras y sellado de accesos."), ("Zancudos y dengue", "Zona endémica de dengue. En lluvias aplicamos larvicidas en criaderos además del control de adultos."), ("Comején", "Frecuente en casas antiguas del Centro y en construcciones nuevas con maderas sin tratar.")],
      faq=[("¿Atienden mi barrio en Bucaramanga?", "Sí. Cubrimos toda la ciudad: Cabecera, Sotomayor, El Prado, Centro, San Francisco, Provenza, La Victoria, Real de Minas, Ciudadela, Mutis, Café Madrid, Kennedy, Colorados y todos los sectores del norte, centro y sur."), ("¿Cada cuánto se debe fumigar en Bucaramanga?", "En hogares recomendamos una fumigación preventiva cada 3 a 6 meses. Restaurantes y negocios de alimentos deben fumigar mínimo cada 3 meses. El clima cálido de la meseta acelera la reproducción de cucarachas y zancudos."), ("¿En cuánto tiempo llegan?", "Atendemos el mismo día en toda Bucaramanga. Para casos urgentes, como una plaga visible en un restaurante o una inspección próxima, priorizamos la visita.")]),
 dict(slug="fumigacion-floridablanca", name="Floridablanca", cap="Sede principal en Cra. 36 #197-30. Respuesta en menos de 1 hora.",
      title="Fumigación en Floridablanca | AGROINCOL",
      lead="Sede principal de AGROINCOL. Más de 40 años protegiendo hogares, restaurantes y empresas en Floridablanca, Santander.",
      stats=[("Cra. 36 #197-30", "Sede principal"), ("< 1 hora", "Tiempo de llegada"), ("40+ años", "De experiencia"), ("4.9", "En Google")],
      intro="Floridablanca es el segundo municipio más poblado de Santander. Su clima cálido, la expansión en zonas como Cañaveral, Lagos del Cacique y La Cumbre, y la cercanía a zonas rurales hacen clave el control de plagas.",
      sectores=[("Cañaveral", "Conjuntos residenciales y zona comercial."), ("Lagos del Cacique", "Conjuntos con vegetación abundante, donde las hormigas encuentran hábitat."), ("La Cumbre", "Vivienda y comercio en expansión."), ("Centro", "Mayor densidad comercial y presión de roedores.")],
      plagas=[("Cucarachas", "El clima cálido y la cercanía a zonas verdes favorecen cucarachas americanas y alemanas en cocinas y baños."), ("Hormigas", "Comunes en los conjuntos de Cañaveral, Lagos del Cacique y La Cumbre."), ("Zancudos", "La humedad y quebradas como La Cascada generan criaderos del Aedes aegypti."), ("Roedores", "Sectores comerciales como el centro y la vía al Anillo Vial.")], faq=[]),
 dict(slug="fumigacion-piedecuesta", name="Piedecuesta", cap="Cobertura en todo el municipio. Respondemos por WhatsApp en menos de 5 minutos.",
      title="Fumigación en Piedecuesta | AGROINCOL",
      lead="Cobertura completa en Piedecuesta: desde el casco urbano hasta la Mesa de los Santos. Más de 40 años de experiencia en control de plagas.",
      stats=[("Todo el municipio", "Urbano y rural"), ("15 minutos", "Desde nuestra sede"), ("40+ años", "De experiencia"), ("4.9", "En Google")],
      intro="Piedecuesta crece rápido: nuevos conjuntos, centros comerciales y la expansión hacia Tablanca y la vía a la Mesa de los Santos generan condiciones propicias para las plagas.",
      sectores=[("Centro histórico", "Construcciones en madera vulnerables a termitas."), ("Tablanca", "Urbanizaciones nuevas con hormigas y cucarachas."), ("Mesa de los Santos", "Fincas, galpones y áreas agroindustriales."), ("Zona rural", "Veredas, Mensulí y Guatiguará.")],
      plagas=[("Termitas", "Alta incidencia en el centro histórico y en conjuntos nuevos con madera reciente."), ("Cucarachas", "Frecuentes en zonas con alcantarillado antiguo y en comercios del centro."), ("Zancudos y dengue", "Zonas bajas cercanas a quebradas con alta reproducción del Aedes aegypti."), ("Garrapatas y pulgas", "Zonas rurales y semirrurales con áreas verdes extensas.")],
      faq=[("¿Atienden la zona rural, fincas y veredas de Piedecuesta?", "Sí. Cubrimos todo Piedecuesta: casco urbano, zona industrial y área rural, incluyendo la vía a la Mesa de los Santos, Mensulí, Guatiguará y las veredas.")]),
 dict(slug="fumigacion-giron", name="Girón", cap="Incluye la zona industrial de Chimitá y el casco urbano.",
      title="Fumigación en Girón | AGROINCOL",
      lead="Cobertura completa en Girón y la zona industrial de Chimitá. Más de 40 años protegiendo hogares, restaurantes e industrias en Santander.",
      stats=[("Girón completo", "Urbano y Chimitá"), ("< 5 min", "Respuesta por WhatsApp"), ("40+ años", "De experiencia"), ("4.9", "En Google")],
      intro="Girón combina un patrimonio colonial con Chimitá, una de las zonas industriales más importantes de Santander. Eso exige control de plagas para viviendas y para grandes bodegas.",
      sectores=[("Centro histórico", "Restaurantes y hoteles con cumplimiento sanitario obligatorio."), ("Chimitá", "Bodegas, plantas y centros de distribución."), ("Rincón de Girón", "Conjuntos residenciales."), ("Vía al aeropuerto", "Urbanizaciones en crecimiento.")],
      plagas=[("Roedores", "Alta incidencia en Chimitá y el casco antiguo, cerca del río de Oro."), ("Cucarachas", "El municipio más cálido del área: presión de plagas todo el año."), ("Zancudos", "El río de Oro y las quebradas generan criaderos del Aedes aegypti."), ("Polillas y gorgojos", "Atacan productos almacenados en las bodegas de Chimitá.")], faq=[]),
]
pages["zonas.html"] = head("Cobertura en Bucaramanga y el Área Metropolitana | AGROINCOL", "AGROINCOL presta servicio de fumigación y control de plagas en Bucaramanga, Floridablanca, Piedecuesta y Girón.") + f'''
<main id="contenido">
{hero_title("h1", ["Cobertura"], "en Bucaramanga y el Área Metropolitana", "Más de 40 años protegiendo hogares, restaurantes y empresas en los cuatro municipios del Área Metropolitana. Elija su zona.", [("index.html", "Inicio"), (None, "Zonas")], small_first=False)}
<section class="frame-sec"><figure class="frame" data-expand><img src="assets/ilustracion-portada-bucaramanga.webp" alt="{ILU['ciudad'][1]}" width="1800" height="1013"></figure></section>
{rows([dict(word=z["name"], cap=z["cap"], href=f'zona-{z["slug"]}.html', cursor="VER ZONA") for z in Z], "md")}
{cta("¿No encuentra<br>su zona?", "También atendemos sectores cercanos. Cuéntenos dónde está y le confirmamos cobertura el mismo día.", "Escribir por WhatsApp")}
</main>''' + foot()

def zona_page(z):
    stats = "".join(f'<div data-reveal><strong>{a}</strong><span>{b}</span></div>' for a, b in z["stats"])
    sect = rows([dict(word=n, cap=c, href="#", cursor="COTIZAR") for n, c in z["sectores"]], "sm")
    pl = "".join(f'<article data-reveal><span class="gel"></span><h3>{t}</h3><p>{d}</p></article>' for t, d in z["plagas"])
    others = "".join(f'<a href="zona-{o["slug"]}.html" data-transition data-cursor="VER ZONA">{o["name"]}</a>' for o in Z if o["slug"] != z["slug"])
    body = hero_title("h1", [z["name"]], "Fumigación y control de plagas en", z["lead"], [("index.html", "Inicio"), ("zonas.html", "Zonas"), (None, z["name"])], small_first=True, size="xl")
    body += f'<section class="frame-sec"><figure class="frame" data-expand><img src="assets/ilustracion-portada-bucaramanga.webp" alt="{ILU["ciudad"][1]}" width="1800" height="1013"></figure></section>'
    body += f'<section class="stats">{stats}</section>'
    body += f'<section class="metodo"><span class="gel" data-drop></span><p class="lead" data-reveal>{z["intro"]}</p><span class="gel" data-drop></span></section>'
    body += f'<section class="sub-head"><h2 class="display" data-reveal>Sectores</h2></section>' + sect
    body += f'<section class="plagas"><h2 class="display" data-reveal>Plagas<br>comunes</h2><div class="plaga-grid">{pl}</div></section>'
    if z["faq"]: body += faq_raw("Preguntas<br>frecuentes", z["faq"])
    body += guia(f'Fumigación en<br>{z["name"]}', _clean(_items(ACT.get("/zonas/" + z["slug"], ""))))
    body += f'<section class="otras-zonas"><span class="label">También atendemos en</span><div>{others}</div></section>'
    body += cotizar(f"Cotice en<br>{z['name']}")
    return head(z["title"], z["lead"][:155]) + f'<main id="contenido">{body}</main>' + foot()
for z in Z:
    pages[f'zona-{z["slug"]}.html'] = zona_page(z)

# ---------------- HERRAMIENTAS ----------------
T = [dict(word="Calculadora", cap="Descubra cada cuánto debe fumigar su propiedad según su tipo, su zona y su historial.", obj="gota", href="herramienta-calculadora.html", cursor="USAR"),
     dict(word="¿Qué plaga?", cap="Marque lo que ha visto en casa o en su negocio y le decimos qué plaga es y qué hacer.", obj="viga", href="herramienta-plaga.html", cursor="USAR"),
     dict(word="Antes de fumigar", cap="La lista para preparar su casa o negocio antes de que llegue el técnico.", obj="acta", href="herramienta-checklist.html", cursor="USAR"),
     dict(word="Precios", cap="Qué define el valor de una fumigación, programas para restaurantes y formas de pago.", obj="olla", href="precios.html", cursor="VER")]
pages["herramientas.html"] = head("Herramientas gratis para el control de plagas | AGROINCOL", "Calculadora de frecuencia de fumigación, identificador de plagas y lista para preparar su casa antes de fumigar.") + f'''
<main id="contenido">
{hero_title("h1", ["Herramientas"], "gratis para decidir mejor", "Respuestas rápidas antes de cotizar. Sin registro y sin compromiso.", [("index.html", "Inicio"), (None, "Herramientas")], small_first=False)}
{rows(T, "md")}
<section class="pasos">
  <h2 class="display" data-reveal>Qué incluye<br>cada visita</h2>
  <ol class="steps6">{"".join(f'<li data-reveal><span class="n">{i+1:02d}</span><h3>{t}</h3><p>{d}</p></li>' for i, (t, d) in enumerate([("Confirmación previa", "Mensaje con fecha, hora y técnico asignado."), ("Inspección diagnóstica", "Revisión de puntos críticos con fotos."), ("Tratamiento profesional", "Aspersión y gel con productos registrados."), ("Limpieza y orden", "Dejamos el espacio igual o mejor."), ("Cierre presencial", "Resumen de hallazgos y recomendaciones."), ("Reporte digital", "Le llega por WhatsApp el mismo día.")]))}</ol>
</section>
{cta("¿Prefiere que<br>se lo digamos?", "Cuéntenos su caso por WhatsApp. Le respondemos en menos de 5 minutos.")}
</main>''' + foot()

def tool_page(fname, title, desc, big, small, lead, tool_html):
    return head(title, desc) + f'''
<main id="contenido">
{hero_title("h1", big, small, lead, [("index.html", "Inicio"), ("herramientas.html", "Herramientas"), (None, big[0])], small_first=False, size="sm")}
<section class="tool-sec">{tool_html}</section>
{cta()}
</main>''' + foot('<script src="js/tools.js"></script>')

calc = '''<form class="tool" id="calc" novalidate>
  <div class="tool-top"><span class="label" id="calc-step">Pregunta 1 de 5</span><div class="bar"><span id="calc-bar"></span></div></div>
  <fieldset data-q="tipo"><legend>¿Qué tipo de propiedad necesita fumigar?</legend><div class="opts">
    <button type="button" data-v="casa">Casa o apartamento</button><button type="button" data-v="restaurante">Restaurante o negocio de alimentos</button><button type="button" data-v="oficina">Oficina o local comercial</button><button type="button" data-v="bodega">Bodega o planta industrial</button><button type="button" data-v="conjunto">Conjunto residencial</button><button type="button" data-v="institucion">Institución educativa o de salud</button></div></fieldset>
  <fieldset data-q="entorno" hidden><legend>¿Qué hay cerca de su propiedad?</legend><div class="opts">
    <button type="button" data-v="agua">Quebradas, río o agua estancada</button><button type="button" data-v="mercado">Plaza de mercado o comercio denso</button><button type="button" data-v="verde">Zonas verdes o rurales</button><button type="button" data-v="tranquilo">Zona residencial tranquila</button></div></fieldset>
  <fieldset data-q="historial" hidden><legend>¿Ha tenido plagas en los últimos 6 meses?</legend><div class="opts">
    <button type="button" data-v="nunca">No he visto nada</button><button type="button" data-v="ocasional">Las he visto de vez en cuando</button><button type="button" data-v="frecuente">Las veo casi todos los días</button></div></fieldset>
  <fieldset data-q="construccion" hidden><legend>¿Cómo es la construcción?</legend><div class="opts">
    <button type="button" data-v="nueva">Nueva, sin grietas</button><button type="button" data-v="antigua">Antigua o con grietas y tubería expuesta</button></div></fieldset>
  <fieldset data-q="ultima" hidden><legend>¿Cuándo fue la última fumigación profesional?</legend><div class="opts">
    <button type="button" data-v="reciente">Hace menos de 3 meses</button><button type="button" data-v="media">Hace 3 a 6 meses</button><button type="button" data-v="nunca">Hace más de 6 meses o nunca</button></div></fieldset>
  <div class="result" id="calc-result" hidden aria-live="polite">
    <span class="label">Su frecuencia recomendada</span>
    <p class="result-big" id="calc-freq"></p>
    <p id="calc-why"></p>
    <div class="result-cta"><a class="btn btn-naranja" id="calc-wa" href="https://wa.me/573107891948">Cotizar por WhatsApp</a><a class="btn btn-linea" id="calc-srv" href="servicios.html" data-transition>Ver el servicio</a><button class="pill" type="button" id="calc-reset">VOLVER A EMPEZAR</button></div>
    <p class="note">Recomendación orientativa. La frecuencia exacta se define en la inspección.</p>
  </div>
  <div class="tool-nav"><button class="pill" type="button" id="calc-back" hidden>ATRÁS</button></div>
</form>'''
pages["herramienta-calculadora.html"] = tool_page("herramienta-calculadora.html", "Calculadora de Frecuencia de Fumigación | AGROINCOL", "Descubra cada cuánto debe fumigar su propiedad según la normativa colombiana y las condiciones de su zona.", ["Calculadora"], "de frecuencia de fumigación", "Descubra cada cuánto debe fumigar su propiedad según las condiciones de su zona. Cinco preguntas, resultado inmediato.", calc)

signs = [("cucarachas", "Veo cucarachas de día"), ("cucarachas", "Puntos oscuros en cajones o gabinetes"), ("cucarachas", "Cápsulas marrones ovaladas"), ("chinches", "Picaduras en línea al despertar"), ("chinches", "Manchas pequeñas en sábanas y colchón"), ("chinches", "Olor dulzón en la habitación"), ("comejen", "Alas sueltas cerca de ventanas o lámparas"), ("comejen", "Túneles de barro en paredes"), ("comejen", "Madera que suena hueca"), ("roedores", "Heces pequeñas detrás de electrodomésticos"), ("roedores", "Cables o alimentos mordidos"), ("roedores", "Ruidos de noche en paredes o techo"), ("abejas", "Un panal o nido gris de papel"), ("zancudos", "Zancudos al atardecer y picaduras"), ("zancudos", "Agua estancada en materas o canales")]
sg = "".join(f'<button type="button" class="sign" data-p="{p}" aria-pressed="false">{t}</button>' for p, t in signs)
plaga_tool = f'''<div class="tool" id="plaga">
  <div class="tool-top"><span class="label">Marque todo lo que ha visto</span></div>
  <div class="signs">{sg}</div>
  <div class="result" id="plaga-result" hidden aria-live="polite">
    <div class="result-row"><img id="plaga-img" src="assets/obj-casa.webp" alt="" width="140" height="140"><div><span class="label">Lo más probable</span><p class="result-big" id="plaga-name"></p><p id="plaga-what"></p></div></div>
    <div class="result-cta"><a class="btn btn-naranja" href="https://wa.me/573107891948">Enviar foto por WhatsApp</a><a class="btn btn-linea" id="plaga-srv" href="servicios.html" data-transition>Ver el servicio</a></div>
    <p class="note">Si no está seguro, envíenos una foto. Nuestro equipo la identifica.</p>
  </div>
</div>'''
pages["herramienta-plaga.html"] = tool_page("herramienta-plaga.html", "¿Qué plaga tengo? Identificador de plagas | AGROINCOL", "Marque las señales que ha visto y descubra qué plaga tiene y qué servicio necesita.", ["¿Qué plaga", "tengo?"], "Identificador de plagas", "Marque las señales que ha visto. Le decimos qué plaga es y qué hacer.", plaga_tool)

check = ["Guarde o cubra alimentos y utensilios de cocina.", "Retire mascotas y sus accesorios del área a tratar.", "Cubra peceras o terrarios.", "Limpie pisos y superficies.", "Despeje debajo de muebles y camas para que el técnico tenga acceso.", "Tenga a mano el acceso a desagües, sifones y cajas de inspección.", "Avise si alguien en casa tiene una condición respiratoria."]
ck = "".join(f'<li><label><input type="checkbox"><span>{c}</span></label></li>' for c in check)
check_tool = f'''<div class="tool" id="checklist">
  <div class="tool-top"><span class="label" id="ck-count">0 de {len(check)} listos</span><div class="bar"><span id="ck-bar"></span></div></div>
  <ul class="checklist">{ck}</ul>
  <div class="result" id="ck-done" hidden aria-live="polite"><p class="result-big">Todo listo.</p><p>El técnico le indicará cuánto tiempo ventilar antes de volver a usar el espacio.</p></div>
</div>'''
pages["herramienta-checklist.html"] = tool_page("herramienta-checklist.html", "Qué hacer antes de fumigar: lista | AGROINCOL", "Lista para preparar su casa o negocio antes de la fumigación.", ["Antes de", "fumigar"], "Lista para preparar su casa o negocio", "Marque cada punto a medida que lo hace. Así el tratamiento llega a donde tiene que llegar.", check_tool)

# ---------------- BLOG ----------------
POSTS = [("articulo-vi-una-cucaracha.html", "¿Vi una cucaracha en mi casa: significa que hay más?", "Qué hacer cuando ve una cucaracha en su hogar. Por qué aparecen, dónde se esconden y cuándo llamar a un profesional.", "Hogar"),
         ("articulo-auditoria-invima.html", "Auditoría del INVIMA: cómo preparar su restaurante", "Checklist, normativa y errores comunes para pasar la auditoría sin sanciones.", "Restaurantes"),
         ("articulo-plagas-temporada-lluvias.html", "Temporada de lluvias en Bucaramanga: las plagas que aparecen", "Las lluvias disparan mosquitos, cucarachas y roedores. Cómo proteger su hogar y negocio.", "Hogar"),
         ("articulo-multa-invima.html", "¿Cuánto cuesta una multa del INVIMA por plagas?", "Las sanciones pueden ir de 5 a 1.000 SMMLV. Los costos reales y cómo evitarlos.", "Restaurantes"),
         ("articulo-eliminar-cucarachas.html", "Cómo eliminar cucarachas en Bucaramanga", "Tipos, tratamientos efectivos y cuándo llamar a un profesional.", "Hogar"),
         ("articulo-fumigacion-restaurantes-norma.html", "Fumigación para restaurantes: norma y costos 2026", "Resolución 2674, frecuencia y lo que exige la Secretaría de Salud.", "Restaurantes"),
         ("articulo-comejen-termitas.html", "Comején y termitas: cómo identificar y eliminar", "Señales de daño, tipos y tratamiento profesional.", "Hogar")]
post_rows = "".join(f'<a class="post-row" href="{h}"{" data-transition" if h != "#" else ""} data-cursor="LEER"><span class="num">{i+1:02d}</span><span class="post-t">{t}</span><span class="post-c"><span class="label">{tag}</span>{c}</span></a>' for i, (h, t, c, tag) in enumerate(POSTS))
pages["blog.html"] = head("Blog de Fumigación y Control de Plagas | AGROINCOL", "Consejos sobre fumigación, control de plagas y normativa sanitaria en Bucaramanga y Santander.") + f'''
<main id="contenido">
{hero_title("h1", ["Blog"], "Control de plagas y fumigación", "Consejos de más de 40 años protegiendo Bucaramanga y Santander.", [("index.html", "Inicio"), (None, "Blog")], small_first=False, size="xl")}
<section class="posts">{post_rows}</section>
{cta("¿Necesita<br>fumigación?", "Más de 40 años en el Área Metropolitana. Le respondemos por WhatsApp en menos de 5 minutos.", "Cotizar gratis")}
</main>''' + foot()

art = f'''<article class="article">
  <p class="dropcap" data-reveal>La respuesta corta es: probablemente sí. Las cucarachas son insectos nocturnos y cautelosos. Si usted ve una durante el día, caminando por su cocina o baño, generalmente es una señal de que la población dentro de su vivienda es lo suficientemente grande como para que algunas salgan de sus escondites.</p>
  <p>En Bucaramanga y el Área Metropolitana, el clima cálido y húmedo de Santander, con temperaturas entre 23 °C y 28 °C todo el año, acelera su ciclo reproductivo. Aquí las cucarachas están activas los 365 días del año.</p>
  <p>Pero no se asuste todavía. Entender por qué aparecen, dónde se esconden y qué puede hacer le da el control de la situación.</p>
  <span class="gel" data-drop></span>
  <h2 data-reveal>¿Por qué aparecen cucarachas en su casa?</h2>
  <p>Necesitan tres cosas: agua, alimento y refugio. Si su casa les da las tres, se quedan y se reproducen.</p>
  <ul class="gel-list"><li><strong>Agua.</strong> Una cucaracha sobrevive semanas sin comer, pero apenas unos días sin agua. Goteras bajo el lavaplatos, tuberías con condensación y baños húmedos son su fuente.</li><li><strong>Alimento.</strong> Migajas, grasa detrás de la estufa, basura sin sellar y comida de mascotas en la noche.</li><li><strong>Refugio.</strong> Grietas, tuberías, marcos sin sello, desagües y cajas de cartón.</li></ul>
  <h2 data-reveal>¿Dónde se esconden?</h2>
  <ul class="gel-list"><li>Detrás de la nevera, la estufa y el microondas.</li><li>Debajo del lavaplatos.</li><li>Dentro de cajas de cartón.</li><li>En grietas de paredes, marcos y zócalos.</li><li>Dentro de aparatos que dan calor: routers y tableros eléctricos.</li><li>En sifones y desagües secos.</li></ul>
  <aside class="callout" data-reveal><span class="label">Dato importante</span><p>Una sola cucaracha alemana hembra puede producir hasta 300 crías en su vida. En cuestión de semanas, una pareja puede convertirse en cientos.</p></aside>
  <h2 data-reveal>¿Cuándo llamar a un profesional?</h2>
  <p>Si reconoce dos o más de estas señales, es momento de actuar:</p>
  <ul class="gel-list"><li>Ve cucarachas de día.</li><li>Encuentra puntos oscuros en cajones, estantes o detrás de electrodomésticos.</li><li>Siente un olor aceitoso y fuerte.</li><li>Encuentra cápsulas marrones ovaladas con huevos.</li><li>Los productos de supermercado no funcionaron.</li></ul>
  <p>¿No está seguro? Use el <a href="herramienta-plaga.html" data-transition>identificador de plagas</a>.</p>
  <h2 data-reveal>Qué hacer mientras tanto</h2>
  <ul class="checks"><li>Selle la basura y saque los residuos orgánicos a diario.</li><li>Limpie migajas antes de dormir.</li><li>Repare goteras.</li><li>Selle grietas visibles con silicona.</li><li>No deje comida de mascotas en la noche.</li><li>Vierta agua con cloro por los sifones poco usados.</li></ul>
  <h2 data-reveal>Cómo funciona el control profesional</h2>
  <ol class="numbered"><li><strong>Inspección.</strong> Identificamos la especie, los puntos críticos y las entradas.</li><li><strong>Tratamiento.</strong> Gel en puntos estratégicos, aspersión en áreas de tránsito y tratamiento de grietas, con productos registrados ante el ICA.</li><li><strong>Seguimiento.</strong> Verificamos el resultado y le decimos cada cuánto repetir. Use la <a href="herramienta-calculadora.html" data-transition>calculadora de frecuencia</a>.</li></ol>
  <div class="art-colado" data-reveal><img src="assets/colado-dona-cuca-cucaracha.webp" alt="" width="317" height="500"><p class="lema">Llegó AGROINCOL. Nos vamos.</p></div>
</article>'''
related = "".join(f'<a class="post-row" href="{h}"{" data-transition" if h != "#" else ""} data-cursor="LEER"><span class="num">{i+2:02d}</span><span class="post-t">{t}</span><span class="post-c"><span class="label">{tag}</span>{c}</span></a>' for i, (h, t, c, tag) in enumerate(POSTS[1:4]))
pages["articulo-vi-una-cucaracha.html"] = head("Vi una Cucaracha: ¿Hay Más? | AGROINCOL", "Qué hacer cuando encuentra una cucaracha en su hogar. Por qué aparecen, dónde se esconden y cuándo llamar a un profesional.") + f'''
<main id="contenido">
{hero_title("h1", ["¿Vi una cucaracha", "en mi casa?"], "Significa que hay más", "", [("index.html", "Inicio"), ("blog.html", "Blog"), (None, "Hogar")], small_first=False, size="sm", extra='<p class="meta">Hogar · 6 minutos de lectura</p>')}
{art}
<section class="posts related"><h2 class="display" data-reveal>Siga<br>leyendo</h2>{related}</section>
{cta()}
</main>''' + foot()

exec(open(HERE + 'build_pages2.py').read())

for k, v in pages.items():
    open(HERE + '' + k, 'w').write(v)
print(len(pages), "páginas")
