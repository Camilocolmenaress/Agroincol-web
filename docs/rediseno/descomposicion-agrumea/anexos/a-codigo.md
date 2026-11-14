# agrumeafarm.it — ingeniería inversa del código (HTML/CSS/JS servidos)

Fecha de captura: 14-nov-2026. Fuente: build Nuxt 3 servido en `https://www.agrumeafarm.it`.

## 0. Método y mapa de archivos

- HTML SSR de 9 páginas en `fuentes/html/` (`en`, `en_dispensa`, `en_dispensa_{smeraldo,mennulata,pestorosso}`, `en_produzione`, `en_experience`, `en_chi-siamo`, `en_contatti`).
- 67 chunks `/_nuxt/*.js|css` (descarga recursiva siguiendo imports dinámicos) en `fuentes/nuxt/` (minificados originales) y `fuentes/fmt/` (formateados con js-beautify). `fuentes/compact/` = CSS con una regla por línea y sin `[data-v-xxxx]` (lo uso para citar).
- CSS inline del SSR (14–22 `<style>` por página) extraído a `fuentes/inline/` → coincide 100 % con `entry.DxvjfHIO.css`, `default.*.css`, `CmsHomePage.*.css`, etc. (verificado con `comm`: 0 reglas faltantes).
- Assets auxiliares: `fuentes/assets/typekit-yey3ruw.css`, `circle-text-en.svg`, `back-slider-home.svg`.
- Script de cálculo (escalas y geometría): `scratchpad/fmt-tool/calc.py` (fuera de `fuentes/`).

Las referencias `archivo:línea` son de `fuentes/fmt/`. Los nombres de variables son los minificados; el "rol" de cada constante lo deduje leyendo su uso (marcado como *inferido* cuando no es evidente).

| Chunk | Contenido |
|---|---|
| `B5Ey9qla.js` (23 300 líneas) | Entry: Vue + Nuxt runtime, **Lenis 1.3.23** (≈11 380–12 160), **GSAP 3.15.0** core+CSSPlugin (≈12 300–14 660), Observer, **ScrollTrigger 3.15.0** (≈15 000–16 085), **CustomEase 3.15.0** (≈16 200–16 329), **SplitType** (≈16 330–16 880), sistema de revelado de texto (16 884–17 160), SiteHeader, SiteFullPageNav, SiteNavOverlay, SiteCursorLabel, SVG de frutas, **matter-js 0.20.0** (18 823–21 872), física de frutas `ry` (22 223), SiteFruitLoaderIntro, SiteJarFlight, SiteAppOverlay (transición de página), app, NotFound. Plugins: consentimiento+GA4, cookieconsent, Lenis, transición de página, scroll-restoration, text-reveal, `--app-height`. |
| `fKmsXwpK.js` | **HomeHero / jar-slider** completo (motor `Yr`) + CmsHomePage. |
| `DoMZv-wV.js` | **Three.js r160** (import dinámico). |
| `DeNDERGz.js` | `createProductJar` (etiqueta 3D en la página de producto y en el vuelo del frasco). |
| `Dizcpx2j.js` | Cálculo de pixelRatio con presupuesto de píxeles. |
| `BrPqqrCe.js` | ProductHero + CmsProductDetailPage. |
| `CQ9W51ls.js` | PhotoSlider ("DRAG"). |
| `ChHnAx5T.js` | ProductSlider / ProductSliderItem ("The other products") + datos de /dispensa. |
| `Dns_r6D9.js` | PageHero + helper `K` (clip-path + parallax de portada). |
| `B5hDNHw2.js` | Helper de parallax genérico. |
| `5PtKAPu2.js` | /dispensa: ProductSection, MonodoseSection, SalatiSection, PageOutro. |
| `C73Qw-M_.js` | SiteProductNav (píldora flotante inferior). |
| `BWJu6mGl.js` | /chi-siamo: AboutVision + pausa con frutas fijada. |
| `5M6GK-4E.js` | /experience: tarjetas apiladas con pin. |
| `CAHDvlNE.js` | /produzione. |
| `DfgJlGGB.js` | /contatti (frutas con física + "explosión" al clic). |
| `Cm2Qg7aL.js` | SiteFooter + layout `default`. |
| `CzvXvcsz.js` | SiteImage + PageIntro (rombos). |
| `C5nxDF4V.js` | Librería cookieconsent (API de orestbida/vanilla-cookieconsent v3 — versión no visible). |

**No hay SplitText de GSAP**: el corte en líneas/caracteres lo hace la librería **SplitType** embebida (clave interna `_splittype`, `B5Ey9qla.js:16532`). Plugins registrados: `pc.registerPlugin(Pe, yo)` = ScrollTrigger + CustomEase (`B5Ey9qla.js:17131`).

---

## 1. Tokens (variables CSS)

### 1.1 `:root` (inline, `compact/en.css` líneas 1–40)

```css
:root {
  --color-orange: #e94e1b;   --color-border: #762530;   /* "border" = bordó: color del texto */
  --color-white:  #fdf3eb;   --color-yellow: #f39200;   /* "white" = crema: fondo del body */
  --border-round: 15px;
  --container-padding: clamp(30px, 2vw, 40px);
  --grid-columns: 12;  --grid-gap-x: clamp(12px, 1.45vw, 30px);  --grid-gap-y: 0;
  --header-offset: clamp(20px, 2vw, 30px);  --header-logo-width: clamp(126px, 10vw, 152px);
  --header-pad-y: 30px;  --header-brand-width: 135px;
  --header-safe-top: calc(var(--header-pad-y) + var(--header-brand-width)*130/151);
  --font-sans: "ivystyle-sans","Avenir Next","Helvetica Neue",Helvetica,Arial,sans-serif;
  --font-serif: "ivymode","Iowan Old Style","Palatino Linotype","Book Antiqua",Palatino,serif;
  --text-small: .875rem;  --text-base: 1rem;
  --text-medium: clamp(1.125rem, calc(1.085rem + .165vw), 1.25rem);
  --text-large: 2rem;
  --text-hero: clamp(4.1rem, calc(2.65rem + 5.95vw), 999999px);
  --text-display: clamp(4rem, calc(2.9rem + 11vw), 999999px);
  --line-height-s: 1;  --line-height-m: 1.3;
  --space-s: 2.5rem; --space-xs: 3.75rem; --space-l: 6.25rem;
  --space-xl: clamp(6rem, calc(var(--space-l)*2), 999999px);
  --page-transition-duration: 1.8s; --page-cover-duration: .9s; --page-lift-duration: 975ms;
  --page-jar-exit-duration: .42s;   --page-jar-fade-duration: .35s;
  --ease-premium:  cubic-bezier(.645,.045,.355,1);   /* easeInOutCubic */
  --ease-soft:     cubic-bezier(.22,1,.36,1);
  --ease-out-expo: cubic-bezier(.16,1,.3,1);
  --ease-don-expo: cubic-bezier(.19,1,.22,1);
  --ease-don-power:cubic-bezier(.165,.84,.44,1);
  --app-height: 100svh;                      /* JS lo reescribe con visualViewport.height */
  --ph-jar-scale-from: 1.25; --ph-jar-w: clamp(380px, 24vw, 99999px);
  --ph-jar-h: calc(var(--ph-jar-w)*1013/630); --ph-jar-peek: .3;
  --ph-jar-bottom: calc((1 - var(--ph-jar-peek))*var(--ph-jar-h)*-1);
}
@media (max-width:1024px){ :root{ --ph-jar-w: clamp(250px,40vh,280px); --ph-jar-bottom:-30vh;
                                  --text-display: clamp(2.5rem, calc(1rem + 9vw), 999999px) } }
@media (max-width:480px){ :root{ --header-pad-y:24px; --header-brand-width:108px;
  --ph-jar-w: clamp(250px,40vh,260px); --ph-jar-bottom:-35%;
  --text-hero:2.65rem; --text-large: clamp(1.2rem, calc(1.359rem + .1vw), 1.938rem);
  --text-display: clamp(2.5rem, calc(1rem + 8vw), 999999px);
  --space-xl: calc(var(--space-l)*2); --space-l:3rem; --space-xs: var(--space-s); --line-height-s:1.2 } }
@property --header-safe-top { syntax:"<length>"; inherits:true; initial-value:0 }
@media (prefers-reduced-motion:reduce){ :root{ --page-transition-duration:0ms; --page-cover-duration:0ms;
  --page-lift-duration:0ms; --page-jar-exit-duration:0ms; --page-jar-fade-duration:0ms } }
```

`--app-height` lo fija el plugin `ZC` (`B5Ey9qla.js:17180`): `Math.round(visualViewport.height ?? innerHeight)` en `resize`, `orientationchange` y `visualViewport.resize`.

### 1.2 Colores literales fuera de `:root`

| Valor | Dónde |
|---|---|
| `#fff` | píldora del cursor, fondo sólido del header en móvil (`.site-header__solid-bg`), tarjeta de experiencia |
| `#ffe9d7` | fondo por defecto de `.product-slide` (y fallback `themeColor` en JS) |
| `var(--slide-bg)` | color del producto (`themeColor` de Prismic) al hacer hover en la tarjeta |
| `#f4e9dd` | fondo de 404 |
| `#fffc` / `#ffffffe6` | píldora de navegación de producto (con `backdrop-filter: blur(5px)`) |
| `#000` con `opacity: var(--card-shade)` | sombreado de las tarjetas apiladas (máx. .26) |
| `color-mix(in srgb, var(--color-border) 20%, transparent)` | filetes/bordes de tablas, meta de producto, sombras |
| `color-mix(in srgb, var(--color-white) 65%, transparent)` | línea de barrido de las transiciones |
| `color-mix(in srgb, var(--color-white) 18%, transparent)` | filete superior del pie del footer |
| SVG: `#e94e1b` (texto circular), `#762530` (forma de fondo del home) | `assets/` |

### 1.3 Variables por componente

| Componente | Variables (valor inicial) |
|---|---|
| `.jar-slider` | `--jar-circle-rotation:0deg; --jar-marquee-top:55%` (43 % ≤1024, 45 % ≤480); `--jar-marquee-w:100vw; --jar-marquee-h:560px; --jar-marquee-angle:10deg; --jar-item-w:200px; --jar-item-h:320px` (≤480: `24.33vw`/`39.13vw`, pero el JS las sobrescribe inline); `--jar-shape-intro-opacity:0; --jar-shape-intro-y:24px; --jar-badge-intro-opacity:0; --jar-badge-intro-y:12px; --jar-badge-intro-rotation:-18deg; --jar-parallax-x:0; --jar-parallax-y:0`; `--jar-badge-shift-x:-52%` en `.jar-slider__badge--artwork` |
| `.product-hero` | `--ph-title-fall:48vh; --ph-meta-shift:0px; --ph-jar-rise:-24vh; --ph-jar-rotate:20deg; --ph-jar-scale-to:.8` (.7 ≤1024, .64 ≤480); en `__stage`: `--ph:0` (progreso del scroll); JS: `--ph-title-rest-y`, `--ph-title-fit` |
| `.page-hero` / `.page-outro` | `--page-margin:40px` (30 ≤1024, 20 ≤480); `--cover-radius: var(--border-round)`; en `__cover`: `--cover-inset:1` (GSAP lo lleva a 0) |
| `.photo-slider` | `--photo-slide-w:61vw` (74vw ≤1024, 84vw ≤480); `--photo-slide-gap:40px` (24/16); `--photo-img-bleed:16%` |
| `.product-slider` | `--slide-gap:15px` |
| `.fruit-loader` | `--fruit-base: clamp(220px, calc(28.96px + 18vw), 440px)` (≤1024: `clamp(253px,34vw,507px)`; ≤480: `clamp(180px,24vw,300px)`) |
| `.contatti` | `--fruit-base: clamp(152px,16vw,322px)` (≤480 `clamp(120px,30vw,220px)`) |
| `.not-found` | `--fruit-base: clamp(110px,13vw,250px); --code-size: clamp(130px,24.4vw,441px)` |
| `.fp-nav__list` / `__item` | `--fp-nav-last` (nº ítems − 1), `--i`, `--fp-marker-delay: (.45 + i·.08)s`; secundarios `(.7 + i·.06)s` |
| `.experience-cards` | `--experience-card-step:100vh; --experience-card-count` (JS) ; `--card-shade` (GSAP) |
| roll de caracteres | `--i` (índice de carácter) en menú, 404, nav; `--fp-char-index` |
| revelado de texto | `--reveal-index` en cada unidad (no se usa en CSS: *inferido* que es para depurar) |
| `.salati__inner`, `.vision__inner` | `--salati-box-width:100vw`, `--vision-box-width:100vw` |
| `.monodose__inner`, `.produzione__inner` | anchos por columnas: `--monodose-wide` (8 col), `--monodose-table` (10 col), `--monodose-narrow` (6 col); fórmula tipo `calc(66.66667vw - var(--container-padding)*2/12*8 - var(--grid-gap-x)*11/12*8 + var(--grid-gap-x)*7)` |

### 1.4 z-index (todos los del sitio)

| z | Elemento |
|---|---|
| 2147483640 | cookieconsent (`--cc-z-index`) |
| 10000 | `.fruit-loader` (preloader), `.jar-flight` (frasco clonado en vuelo) |
| 9999 | `.site-app-overlay`, `.page-transition` |
| 1000 | `.skip-link` |
| 950 | `.cursor-label` |
| 900 | `.site-header` |
| 800 | `.site-nav-overlay` (menú a pantalla completa) |
| 790 | `.site-header__solid-bg` |
| 60 | `.product-nav` |
| 10 | `.site-shell__legal`, contenido 404 |
| 0–3 | capas internas (home: forma 1, wrapper de frascos 2, overlay 3) |

### 1.5 Radios, sombras, bordes

- Radios: `15px` (`--border-round`: fotos, tarjetas, portadas), `50%` (botones IT/EN 37×37, disco del menú 37×37, badges de peso 52×52), `999px`/`500px` (píldoras: menú, cursor, nav de producto, CTA), `24px` (lista desplegable de nav de producto móvil), `14px` (aviso legal fijo), `10px` botones cookie / `16px` modal cookie, `1px`/`2px` (rombos).
- Sombras: `0 18px 38px color-mix(border 16%)` (CTA del slider, no se renderiza en el home actual), `0 0 100px color-mix(border 20%)` (nav de producto), `0 18px 50px color-mix(border 16%)` (cookie). Foco: `box-shadow: 0 0 0 5px var(--color-white); outline: 2px solid var(--color-border); outline-offset: 3px`.

### 1.6 Breakpoints

- CSS: `max-width:1024px` (tablet), `max-width:480px` (móvil), `(hover:hover) and (pointer:fine)`, `(max-width:480px) and (pointer:coarse)` (scroll-snap del carrusel), `prefers-reduced-motion:reduce`.
- JS: `≤480` / `≤1024` en el slider (`fKmsXwpK.js:172-173`), `gsap.matchMedia`: `(min-width: 481px)` y `(min-width: 1025px)`, `(max-width: 480px)`; consentimiento: `(hover: none), (pointer: coarse), (max-width: 900px)`.

### 1.7 Eases

| Nombre | Curva | Uso |
|---|---|---|
| `--ease-premium` (CSS; misma curva registrada como CustomEase `Pagtrans` y `pagein`, sin uso en GSAP) | `.645,.045,.355,1` | menú, transiciones de página, logo, cursor |
| `--ease-soft` (CSS; misma curva registrada como CustomEase `headermark`, sin uso en GSAP) | `.22,1,.36,1` | tarjetas de producto, salida del slider; **vuelo del frasco** (`$S = FS(.22,1,.36,1)`, `B5Ey9qla.js:22682`) |
| `--ease-out-expo` | `.16,1,.3,1` | hover de enlaces, zoom de portada, nav de producto |
| `--ease-don-expo` | `.19,1,.22,1` | header (ocultar/mostrar), barrido del preloader |
| `--ease-don-power` | `.165,.84,.44,1` | línea de barrido |
| CustomEase `textveil` | `.165,1,.32,1` | **todos los revelados de texto** (único CustomEase usado por GSAP) |
| CustomEase `linedraw` | `.65,.05,.36,1` | registrada, sin uso encontrado |
| roll de caracteres | `cubic-bezier(.4,0,.2,1)` .35s + 18 ms/char | hover de MENU, menú, 404 |
| JS `Qe` | `1-(1-t)^3` (easeOutCubic) | intro del slider |
| JS `HS` | `t<.5 ? 16t⁵ : 1-(-2t+2)⁵/2` (easeInOutQuint) | giro de la etiqueta (hover/vuelo) |

---

## 2. Tipografía

### 2.1 Fuentes (Adobe Fonts, kit `yey3ruw`)

`<link rel="preconnect" href="https://use.typekit.net" crossorigin>` + `p.typekit.net`; CSS `https://use.typekit.net/yey3ruw.css` (guardado en `assets/`):

```css
@font-face{font-family:"ivystyle-sans";src:url(".../00000000000000007735c074/31/l?...&fvd=n6&v=3") format("woff2"),...;
  font-display:swap;font-style:normal;font-weight:600}
@font-face{font-family:"ivystyle-sans";src:url(".../00000000000000007735c082/...fvd=n4...") ...;font-weight:400}
@font-face{font-family:"ivymode";src:url(".../00000000000000007735ce7b/...fvd=n4...") ...;font-weight:400}
```

- `--font-serif` (IvyMode 400): todos los titulares, en **MAYÚSCULAS** (`text-transform: uppercase`), `font-weight:400`.
- `--font-sans` (IvyStyle Sans 400/600): cuerpo; 600 para etiquetas en mayúsculas (`--text-small`, naranja) y botones.
- `body { font-size:16px; line-height:1.3; color:var(--color-border); background:var(--color-white); -webkit-font-smoothing:antialiased }`.

### 2.2 Escala (calculada con `calc.py`; ≤480 y ≤1024 con sus overrides)

| Token / regla | Fórmula | 390 | 768 | 1440 | 1920 |
|---|---|---|---|---|---|
| `--text-small` | .875rem | 14 | 14 | 14 | 14 |
| `--text-base` | 1rem | 16 | 16 | 16 | 16 |
| `--text-medium` | `clamp(18px, 17.36px + .165vw, 20px)` | 18.00 | 18.63 | 19.74 | 20.00 |
| `--text-large` | 32px; ≤480 `clamp(19.2px, 21.744px + .1vw, 31.008px)` | 22.13 | 32 | 32 | 32 |
| `--text-hero` | `clamp(65.6px, 42.4px + 5.95vw, ∞)`; ≤480 = 42.4px | 42.4 | 88.10 | 128.08 | 156.64 |
| `--text-display` | `clamp(64px, 46.4px + 11vw)`; ≤1024 `clamp(40px,16px+9vw)`; ≤480 `clamp(40px,16px+8vw)` | 47.2 | 85.12 | 204.8 | 257.6 |
| `.fp-nav__link` (menú) | `clamp(59.04px, 38.16px + 5.355vw)`; ≤480 `clamp(35.2px, 10.5vw, 56px)` | 40.95 | 79.29 | 115.27 | 140.98 |
| `.product-hero__title` (×`--ph-title-fit`) | `clamp(64px,46.4px+9vw)`; ≤1024 `…+6vw`; ≤480 `clamp(48px,16px+3vw)` | 48 | 92.48 | 176 | 219.2 |
| `.page-hero__cover-title` | `clamp(58.08px, 36.96px + 5.28vw)`; ≤480 36.96px | 36.96 | 77.51 | 112.99 | 138.34 |
| `.contatti__subtitle` | `clamp(24px, 2.25vw, 40px)` | 24 | 24 | 32.4 | 40 |
| `.salati__title` | `calc(100vw*.324*.9)` + ajuste JS a 88 % del ancho | 113.7 | 223.9 | 419.9 | 559.9 |
| `.vision__title` | `calc(100vw*.257)` | 100.2 | 197.4 | 370.1 | 493.4 |
| `.vision__subtitle` | `calc(100vw*.0204)`; ≤480 `--text-medium` | 18 | 15.7 | 29.4 | 39.2 |
| `.jar-slider__prompt` | `calc(var(--text-small) - 1px)` = 13px, serif, `letter-spacing:.1em` | 13 | 13 | 13 | 13 |
| `.cursor-label__pill` | 13px sans 600 uppercase | 13 | 13 | 13 | 13 |
| `.fruit-loader__mark` (%) | `--text-display`; ≤1024 ×1.8 | 84.96 | 153.2 | 204.8 | 257.6 |

Uso: `--text-display` = H1 de página (PageHero) y contador del preloader; `--text-hero` = títulos de sección (H2), "The other products", números de tarjetas de experiencia, título de contacto; `--text-large` = texto de intro (PageIntro), meta del hero de producto; `--text-medium` = cuerpo de secciones, celdas de tablas, emails.

Ajustes por JS (texto en una línea): `.produzione__title--single` reduce `font-size` hasta que el texto quepa en el 99 % del ancho (`CAHDvlNE.js`, `m = e * .99`); `.salati__title` al 88 % del ancho de la caja (`5PtKAPu2.js`, `Ke = .88`). Ambos esperan a `document.fonts.ready` y se recalculan con ResizeObserver.

### 2.3 line-height, letter-spacing, transform

- line-height: `1` (`--line-height-s`, titulares; 1.2 en ≤480), `1.3` (`--line-height-m`, body), `.9` (título del hero de producto, 1 en ≤1024), `.72` (dígitos del 404), `1.1` (meta del hero), `1.4` (footer/contacto), `1.6` (copyright, legal), `1.2` (nav de producto, enlaces 404).
- letter-spacing: casi siempre `normal`. Solo `.04em` (skip-link), `.1em` (prompt "Scroll to discover"), `.01em` (cookie banner).
- `text-transform: uppercase`: todos los titulares serif, etiquetas 600, botones, cursor, prompt.

---

## 3. Espaciado y grid

| Token | Desktop | ≤480 |
|---|---|---|
| `--space-s` | 40px | 40px |
| `--space-xs` | 60px | 40px (`= --space-s`) |
| `--space-l` | 100px | 48px |
| `--space-xl` | 200px (`clamp(96px, 2·space-l)`) | 96px |
| `--container-padding` | `clamp(30px,2vw,40px)` → 30 / 30 / 30 / 38.4 (390/768/1440/1920) | 30px |
| `--grid-gap-x` | `clamp(12px,1.45vw,30px)` → 12 / 12 / 20.88 / 27.84 | 12px |

- Grid: `.grid-12 { display:grid; gap: var(--grid-gap-y) var(--grid-gap-x); grid-template-columns: repeat(12, minmax(0,1fr)) }`; clases `.grid-col--{d|t|m}-N` con fallback encadenado (`--grid-col-m` → `--grid-col-t` → `--grid-col-d`).
- Patrones recurrentes: secciones `padding-top: var(--space-xl)` (`.product-section`); texto centrado en columnas 2/span 10 (`.page-intro__inner`, máx. 1200px, `gap: var(--space-xs)`); bloque título→cuerpo `margin-top: var(--space-l)`; listas `gap:5px`; bloques etiqueta+valor `gap:8px`; valores `margin-top:14px`; filas de tabla `padding:16px 0` (12px en móvil) con filete `1px color-mix(border 20%)`, cabecera con filete sólido.
- Header: `padding: var(--header-pad-y) 30px` (24px/16px en móvil); `--header-safe-top` = 30 + 135·130/151 = **146.2px** (móvil 116.98px).
- PageHero: `padding-top:190px` en la cabecera; portada `height:130vh` (40vh/min 300px en ≤1024), `margin-top: clamp(24px,3vw,48px)`.

---

## 4. Home: `section.jar-slider` (motor `Yr` en `fKmsXwpK.js:142-607`)

### 4.0 Correcciones a lo que se suponía

- **No hay autoplay.** La posición solo cambia con rueda o arrastre; no existe ningún `setInterval` ni deriva constante (el objetivo `ae` solo lo modifican `ot` (rueda), `it` (arrastre) y `Te` (lanzamiento)).
- **No hay control por teclado en el slider del home.** No existe handler `keydown`. Los frascos son `<a>` tabulables, pero enfocar uno no mueve la pista. El texto "Use the left and right arrow keys to browse the photos." pertenece al **PhotoSlider** (§7.10).
- **El giro del círculo de texto depende de la posición, no de la velocidad**: `--jar-circle-rotation = H·(−0.012) deg` (≤480: `−0.03`), donde `H` es el desplazamiento acumulado en px (`fKmsXwpK.js:517-519`). Gira mientras te mueves y se detiene cuando te detienes.
- **Los frascos no entran escalonados**: `$t = 0` (`fKmsXwpK.js:86`) → `introDelay = índice·0`. Todos entran a la vez; el escalonado está preparado (se ordenan por posición en `o()`), pero desactivado.
- **La trayectoria es una recta** (la pista rotada 10°), no una curva: la "curva" la dan la escala, el brillo, el desenfoque y una ondulación de rotación.

### 4.1 Estructura (render de `HomeHero`, `fKmsXwpK.js:742-807`)

```html
<section class="jar-slider [is-flying-out]" data-jar-slider data-anim="hero" data-jar-slider-ready="true|false">
  <h1 class="visually-hidden">Agrumea Farm: Sicilian artisan marmalades, spreads and preserves</h1>
  <div class="jar-slider__shape-layer" aria-hidden="true">
    <img class="jar-slider__shape-image" src="/images/home/back-slider-home.svg" width="1407" height="601" alt="">
    <div class="jar-slider__badge jar-slider__badge--artwork">
      <img class="jar-slider__badge-artwork" src="/images/home/circle-text-en.svg" width="1168" height="1171" alt=""></div>
  </div>
  <div class="jar-slider__overlay"><p class="jar-slider__prompt [is-ready]">Scroll to discover</p></div>
  <div class="jar-slider__wrapper" data-jar-slider-wrap>
    <div class="jar-slider__marquee"><div class="jar-slider__track" data-jar-slider-track>
      <a class="jar-slider__item" href="/en/dispensa/pesto" aria-label="…" data-jar-slider-item
         data-jar="…_result.webp" data-label="…_result-1.webp">
        <img class="jar-slider__base" sizes="(max-width: 768px) 150px, 300px" loading="eager|lazy" …>
        <canvas class="jar-slider__label" aria-hidden="true"></canvas>
      </a> …
```

- Ítems: productos con `heroJarImage`, repetidos hasta **mínimo 8** (`sn = 8`, `fKmsXwpK.js:867, 922-929`); hoy el SSR trae **10** (hay 10 productos). Los 5 primeros `loading="eager"` y la etiqueta se precarga con `fetchpriority=high` (`Ke = 5`).
- `circle-text-{it|en}.svg` es el texto circular naranja (`#e94e1b`); `back-slider-home.svg` (1407×601, `#762530`) es la forma bordó de fondo.
- El prompt aparece cuando la intro del sitio terminó o empezó a revelarse (`is-ready` = `site-intro-complete || site-intro-revealing`): `.jar-slider__prompt { opacity:0; transform:translate3d(0,28px,0); transition: opacity .9s var(--ease-premium) .18s, transform .9s var(--ease-premium) .18s }` → `.is-ready { opacity:1; transform:none }`.
- El layout por defecto no pinta footer en `/` ni `/en` (ni en contactos): `Cm2Qg7aL.js` → `!(i === "/" || i === "/en") && !(i === "/contatti" || …)`. En su lugar aparece `.site-shell__legal` (enlace "Privacy & Cookies" fijo abajo a la izquierda, `backdrop-filter: blur(6px)`, oculto ≤1024). Por eso **la página no tiene altura de scroll**.

### 4.2 Leyenda de constantes (`fKmsXwpK.js:67-121`)

| Const | Valor | Rol |
|---|---|---|
| `or` | 18 | amplitud (°) de la ondulación de rotación |
| `Xt` | 1013/630 | proporción alto/ancho del frasco |
| `Bt` | `[-.053,.043,-.024,.057,-.048,.029,-.038,.053]` | desfase vertical por índice (×alto del ítem) |
| `Gt` | 2 (`NS`) | duración (s) del giro de etiqueta al hover |
| `ir` | 1.4 | velocidad máx. (×pitch px/s) para permitir el giro hover |
| `cr` | 260 | permanencia (ms) del puntero antes del giro si entró mientras se movía |
| `dr` | 6 | umbral px/s para considerar "en movimiento" |
| `Yt` / `Le` | .55 / 1.35 | escala mín. (bordes) / máx. (centro). `Le` también = sobremuestreo del canvas |
| `ur` | .1 | reducción extra de escala por distancia al centro (en pitches) |
| `Ht` / `hr` / `pr` | .7 / 1.1 / 1 | brillo mín./máx./exponente |
| `mr` / `_r` / `fr` | 4 / 2 / 1 | desenfoque máx. desktop/móvil (px) y factor |
| `qe` | 1150 | duración (ms) de cada intro |
| `$t` | 0 | escalonado de intro entre frascos (ms) |
| `Se` | 56 | desplazamiento base (px) de las intros |
| `Ut` | .9 | escala inicial de la intro |
| `gr` | 1 | vueltas completas que da la etiqueta durante la intro |
| `vr` / `yr` | 0 / 0 | retraso de la intro de forma / badge |
| `Wt` | −18 | rotación inicial (°) del badge |
| `Lr` | 1.15 | multiplicador del ancho del ítem |
| `Sr` / `Er` | 2.3 / 11 | tasa de seguimiento (1/s) libre / arrastrando |
| `Ir` | 1.15 | multiplicador de la rueda |
| `zt` | 1.5 | multiplicador del arrastre |
| `wr` / `Jt` | 190 / 3.5 | lanzamiento: ms de "proyección" / velocidad máx. px/ms |
| `br` | 1/30 | dt máx. (s) |
| `Vt` | 2400 | velocidad de normalización (px/s) |
| `Tr` | 6 | inclinación máx. (°) por velocidad |
| `Mr` / `Pr` | 3.2 / 1.6 | desenfoque extra por velocidad desktop / móvil (px) |
| `Cr` | .05 | encogimiento por velocidad |
| `Rr` / `Or` | −.012 / −.03 | °/px del círculo, desktop / ≤480 |
| `Ar` / `qt` | .55 / .16 | deformación tanh de la trayectoria: pendiente 1 + .55·sech² → **1.55× en el centro** (los frascos se separan y van más rápido al cruzar el centro, se apiñan y frenan en los bordes) |
| `xr` / `Dr` / `Qt` | 70 / 9 / .3 | rigidez / amortiguación / variación de rigidez de los resortes por frasco |
| `Nr` | 38 | giro máx. (°) de la etiqueta por velocidad |
| `Fr` / `Kt` / `kr` / `jr` | 30 / .3 / 5 / .05 | reacción al puntero: giro (°), base, inclinación (°), elevación de escala |
| `Xr` / `Zt` / `ea` | 1.6 / 16 / 26 | radio gaussiano (×ancho), atracción (px), parallax por frasco (px) |
| `ta` | 1/2000 | cuantización del offset de la etiqueta (evita re-render) |
| `Gr`/`tn` | 1000 | retraso (ms) antes de importar Three.js |
| `Br` | ver §5 | parámetros del cilindro y de la luz |

### 4.3 Geometría (`le()`, `fKmsXwpK.js:169-182`)

```js
const e = innerWidth, r = innerHeight, h = e <= 480, c = !h && e <= 1024;
Z = e / (h || c ? 3 : 4);                         // ancho de "columna"
N = Z * (h ? 1.15 : c ? 1.265 : .92);             // pitch (distancia entre frascos)
u = Z * (h ? .73 : c ? .7875 : .5358) * 1.15;     // ancho del ítem
R = u * 1013/630;  if (R > r*.72) { R = r*.72; u = R / (1013/630) }
F = D * N;  Y = 3 * N;  j = u * 2;  ee = Math.min(R * 1.35, r * .95);  // loop, periodo ondulación, margen, alto marquesina
// → --jar-item-w, --jar-item-h, --jar-marquee-h ; d = cos(10°), O = sin(10°) (de --jar-marquee-angle)
```

| Viewport | pitch N | ítem w×h | loop F (10) | canvas (w,h ×1.35) |
|---|---|---|---|---|
| 390×844 | 149.5 | 109.1×175.5 | 1495 | 147×237 |
| 768×1024 | 323.8 | 231.8×372.8 | 3238 | 313×503 |
| 1440×900 | 331.2 | 221.8×356.7 | 3312 | **299×481** (= canvas observado, comprobación OK) |
| 1920×1080 | 441.6 | 295.8×475.6 | 4416 | 399×642 |

CSS de la pista: `.jar-slider__marquee { position:absolute; left:50%; top:var(--jar-marquee-top); width:100vw; height:var(--jar-marquee-h); transform:translate(-50%,-50%) rotate(10deg) }`; ítems `position:absolute; top:50%; left:0; margin-top:calc(var(--jar-item-h)/-2); will-change: transform, opacity, filter`.

### 4.4 Bucle infinito

```js
ie = (e, r) => { let c = (e*N + u/2 + r + j) % F; return c < 0 && (c += F), c - j };   // :312-315
```
Cada ítem `i` tiene posición `x = ((i·N + u/2 + H + 2u) mod F) − 2u`: módulo sobre la longitud total; se reaparece por el otro lado 2 anchos fuera de pantalla. No hay clones: el envoltorio es aritmético.

### 4.5 Entrada → velocidad → inercia

```js
// rueda (wrapper, passive:false)                                   :423-427
e.preventDefault(); const r = |deltaY| >= |deltaX| ? deltaY : deltaX;  ae = ae - r * 1.15;
// arrastre: umbral 6 px antes de setPointerCapture                 :436-456
ue = ue*.72 + (dx/dt)*.28;  ae = ae + dx * 1.5;                    // ue = velocidad EMA (px/ms)
// al soltar                                                         :457-467
ae += clamp(ue, -3.5, 3.5) * 1.5 * 190;                             // "fling": hasta ±997 px
// cada frame                                                        :514-516
H += (ae - H) * (1 - Math.exp(-(dragging ? 11 : 2.3) * dt));  if |ae-H| < .05 → H = ae;
ce = (H - Hprev) / dt;                                              // velocidad px/s
```
- La "fricción/inercia" es un seguimiento exponencial al objetivo: constante de tiempo 1/2.3 ≈ **0.43 s** libre y 1/11 ≈ 0.09 s arrastrando. El lanzamiento solo desplaza el objetivo.
- Tras un arrastre, `click` se cancela en fase de captura (`pt`, `:478-480`; el flag se reinicia en el siguiente `pointerdown`).
- El wrapper tiene `touch-action:none; cursor:grab` (`:active → grabbing`).
- Dt limitado a 1/30 s.

### 4.6 Fórmulas por frasco y por frame (`fKmsXwpK.js:534-598`)

Con `G = innerWidth`, `fe = ie(i, H)`, `q = fe/G` (0 = borde izq., 1 = borde der.):

```js
ft  = (q + .55*.16*Math.tanh((q - .5)/.16)) * G;     // x deformada: 1.55× más rápida/espaciada en el centro
gt  = (q>=0 && q<=1) ? Math.sin(q*Math.PI) : 0;      // campana 0→1→0
Ye  = |q - .5| / (N/G);                              // distancia al centro en pitches
scale     = (.55 + gt*(1.35 - .55)) * (1 - .1*min(1,Ye)) * introScale * (1 - (v/2400)²*.05) * (1 + lift)
brightness= .7 + gt * (1.1 - .7)
blur(px)  = min(G<=480 ? 2 : 4, Ye²) + (v/2400)² * (G<=480 ? 1.6 : 3.2)
rotate(°) = Math.sin((i*N + H)/(3*N) * 2π) * 18 + lean          // ondulación periodo 3 frascos
translate = (ft - u/2 + pullX ,  Bt[i%8]*R + (1-introE)*56 + pullY)
opacity   = introE
a.element.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${s})`;
a.element.style.filter    = `brightness(${da}) blur(${Ea.toFixed(2)}px)`;
```
- `lean` (resorte) objetivo: `-sign(v)·min(1,|v|/2400)·6°` + inclinación hacia el puntero.
- Resortes (`Ie`, `:126-128`): `vel += ((target - val)·k − vel·9)·dt; val += vel·dt`, con `k = 70·(1 − .15 + .3·frac(i·0.618034))` → 59.5–80.5 (cada frasco responde distinto).

### 4.7 Parallax con el mouse (solo `hover:hover` + `pointer:fine` y sin reduced-motion)

```js
fe,q = puntero normalizado a [-1,1] en la sección;  Fe += (fe - Fe)*(1 - exp(-4*dt));       // :503-507
P += ((activo?1:0) - P)*(1 - exp(-3*dt));                       // intensidad (entra/sale suave)
--jar-parallax-x = Fe*P ; --jar-parallax-y = ke*P              // :511-513
```
CSS: forma `translate3d(calc(-50% + px*-14px), calc(intro-y + max(0px, py*-10px)), 0)`; badge `translate3d(calc(-52% + px*-10px), calc(intro-y + py*-8px), 0) rotate(circle + intro-rot)`.
Por frasco (en coordenadas de la marquesina rotada): desplazamiento `26px·(scale/1.35)` según parallax, y reacción local gaussiana al puntero: `ye = exp(-(dx²+dy²)/(1.6u)²)`; giro de etiqueta `+30°·tanh(dx/1.6u)·P·(.3 + .7ye)`, inclinación `+5°·tanh·ye`, elevación `+5 %·ye`, atracción `16px·tanh(dx/1.6u)` y `16px·tanh(dy/.8R)` (`:561-575`).

### 4.8 Hover y cursor

- `mouseenter` en el frasco → cursor "Discover the product" (`show(b("discoverProduct"))`, solo puntero fino).
- Giro de la etiqueta: al entrar queda en cola; arranca si el slider va lento (`|v| ≤ 1.4·N`) y (entraste después del último movimiento o permaneciste 260 ms). Dura **2 s** con easeInOutQuint: la etiqueta da **una vuelta completa** alrededor del frasco (`:586-591`). El tiempo transcurrido se publica en `data-spin-elapsed` para que el vuelo lo continúe.

### 4.9 Clic → página de producto (vuelo del frasco)

`ie` (`fKmsXwpK.js:736-741`) si es clic izquierdo interno sin modificadores:
1. `PT(el)` (`B5Ey9qla.js:12219`) captura: `currentSrc` de la imagen, `canvas.toDataURL()` de la etiqueta, `spinElapsed`, rectángulo de origen (centro, tamaño, **rotación y escala acumuladas** recorriendo los `transform` de los padres con `DOMMatrix`, incluida la marquesina de 10°) y destino calculado con un nodo fantasma `left:50%; bottom:var(--ph-jar-bottom); width:var(--ph-jar-w); aspect-ratio:630/1013; transform:translateX(-50%) scale(var(--ph-jar-scale-from))`. Con reduced-motion devuelve `null` (sin vuelo).
2. `section.is-flying-out` → `.jar-slider.is-flying-out > * { opacity:0; scale:.94; transition: opacity .42s var(--ease-soft), scale .42s var(--ease-soft) }`; el frasco clicado `visibility:hidden`.
3. `navigateTo`. El plugin de transición detecta el vuelo → modo `is-jar-fade` (sin telón): salida opacity `.42s linear`, entrada `.35s`.
4. `SiteJarFlight` (`B5Ey9qla.js:22698-22838`): clon `position:fixed` con la imagen base + la etiqueta capturada; anima 2000 ms con `cubic-bezier(.22,1,.36,1)` interpolando `cx, cy, scale (from.height·from.scale/to.height → 1.25), rotation (→0)`. Carga `createProductJar` y sigue girando la etiqueta: `setSpin(HS(min(1,(spinElapsed + t)/2)))`. Aterriza cuando t ≥ 1, el hero de producto está listo y (modo jar-fade o lift ≥ 50 % de `--page-lift-duration`); `.is-landed { opacity:0 }` (`.18s linear`) y se desmonta 180 ms después. Tope de seguridad 6 s.

### 4.10 Animación de entrada (cadena completa)

1. Primera visita: preloader de frutas (§7.1). El slider **no se inicializa** hasta `site-intro-complete` o `site-intro-revealing` (`D = Ts() || ud()`, `fKmsXwpK.js:660, 723, 730`). `revealing` se activa al 62 % del cierre del preloader (≈1116 ms).
2. Al crear el motor (`mt = now`): **forma y badge** empiezan de inmediato (retrasos `vr = yr = 0`), 1150 ms easeOutCubic:
   - forma: opacity 0→1, y `23.52px → 0` (56·.42);
   - badge: opacity 0→1, y `12.32px → 0` (56·.22), rotación `−18° → 0`.
3. Los frascos arrancan con `opacity:0` (inline). A los **1000 ms** (`labelDelayMs`) se importa Three.js, se crean los materiales de los frascos visibles y, cuando **todas las etiquetas visibles cargaron** (o a los **4 s** contados desde que resolvió el import de Three.js), empieza la intro de frascos (`X = now`). Las etiquetas fuera de pantalla se cargan después, ordenadas por distancia. Respaldo global: si nada de eso ocurre, la intro arranca a los **7 s** (`setTimeout(B, z + 6e3)`); si falla el import de Three.js, arranca de inmediato.
4. Intro de cada frasco (1150 ms, easeOutCubic, todos a la vez): opacity 0→1, y `+56px → 0`, escala `.9 → 1`, y la etiqueta da **una vuelta completa** (`wa = Pe·gr`, offset −1 → 0).
5. `data-jar-slider-ready="true"` al crear el motor; el prompt "Scroll to discover" entra (.9s, retraso .18s) con la misma condición (intro revelando o completa).

### 4.11 Bucle de render

Un solo `requestAnimationFrame` (`_t`). La etiqueta solo se re-renderiza si cambió su offset cuantizado (pasos de 1/2000 de vuelta) **y** el frasco está cerca de la pantalla, o si se pidió (`needsRender`). Se limpia todo en `destroy()` (listeners, timers, `renderer.dispose()`, `forceContextLoss`).

---

## 5. Three.js: la etiqueta envuelta (r160)

Dos implementaciones casi idénticas: home (`Oe` en `fKmsXwpK.js:185-269`, **un renderer compartido** que dibuja en un canvas WebGL fuera del DOM y copia con `drawImage` al `<canvas>` 2D de cada frasco) y producto/vuelo (`createProductJar` en `DeNDERGz.js`, un renderer por frasco, con ResizeObserver).

```js
const Br = { CYL_TOP:.27, CYL_BOT:.87, CYL_WIDTH:.885, CYL_CURV:3, GAP_LABEL:.09,
             FRONT_ROT:182, LIGHT_INT:.58, LIGHT_AMB:.89, LIGHT_X:-1 };          // fKmsXwpK.js:129-139
const b = 630/1013;                                                              // ancho del frasco con alto = 1
renderer = new WebGLRenderer({ alpha:true, antialias:true }); renderer.outputColorSpace = SRGBColorSpace;
camera = new OrthographicCamera(-b/2, b/2, .5, -.5, .01, 10); camera.position.z = 5;
scene.add(new AmbientLight(0xffffff, .89));
spot = new SpotLight(0xffffff, .58*5);  spot.distance=6; spot.angle=Math.PI/4; spot.penumbra=.7; spot.decay=1.2;
spot.position.set(-1, .5, .6);  spot.target.position.x = 0;
// cilindro = Lathe de una recta vertical
const G = .87 - .27, Be = .885*b/2;            // alto .60, radio .2752 (unidades del frasco)
pts = [0..16].map(L => new Vector2(Be, (L/16 - .5)*G));
mesh.geometry = new LatheGeometry(pts, 128);   // 16 segmentos verticales × 128 radiales
mesh.position.y = .5 - (.27+.87)/2;            // -0.07: centra la banda entre 27 % y 87 % del alto
mesh.rotation.x = 3 * Math.PI/180;             // 3° de inclinación → bordes elípticos ("curvatura")
material = new MeshStandardMaterial({ map, side:FrontSide, roughness:.72, metalness:0 });
// textura: wrapS=RepeatWrapping, wrapT=ClampToEdge, sRGB, mipmaps, LinearMipmapLinear, anisotropía máxima
```

Parche de shader (`onBeforeCompile`): rota la textura por `uOffset` (fracción de vuelta) y **recorta un hueco del 9 %** de la circunferencia (la etiqueta no da la vuelta completa):

```glsl
float _u = fract(vMapUv.x + uOffset);
if (_u >= 1.0 - uGap) discard;
float _r = _u / max(1.0 - uGap, 0.001);
vec4 sampledDiffuseColor = texture2D(map, vec2(_r, vMapUv.y));
diffuseColor *= sampledDiffuseColor;
```

- La cámara ortográfica tiene exactamente la proporción del PNG del frasco (630×1013), así el cilindro cae encima de la foto base sin etiqueta. La etiqueta plana (1600×607) se estira en la banda 27–87 % del alto.
- **Rotación de la etiqueta** (home): `uOffset = 182/360 − Ct − Pe·1 − round(turn/360 / (1/2000))·(1/2000)` (`fKmsXwpK.js:593-595`), donde `Ct` = giro hover (0→1 en 2 s, easeInOutQuint), `Pe` = progreso de la intro (una vuelta), `turn` = resorte con objetivo `−clamp(v/2400)·38°` (velocidad) + reacción al puntero (±30°). `FRONT_ROT = 182°` es la posición "de frente".
- Producto: `x.value = 182/360 − spin` con `spin` ∈ [0,1] (scroll del hero o vuelo).
- **Tamaño del canvas**: home = `offsetWidth·1.35 × offsetHeight·1.35` (sobremuestreo para que la escala 1.35 del centro siga nítida); pixelRatio `M(w,h,1.35,n)` = `max(1, min(min(dpr,3), sqrt(12e6/(w·1.35·h·1.35·n))))` (`Dizcpx2j.js`): presupuesto de 12 megapíxeles entre todos los canvases.
- **Cuándo se inicializa**: `setTimeout(la, 1000)` tras montar el slider; import dinámico `import("./DoMZv-wV.js")`.
- **Sin WebGL**: si el import o `new WebGLRenderer` lanza, `catch { B() }` → la intro arranca igual y los frascos se ven con la foto base (sin etiqueta: no hay imagen de respaldo con etiqueta en el home). En el producto, si `createProductJar` devuelve `null`, el hero se marca listo de inmediato. No hay detección explícita de WebGL. *Inferido*: sin WebGL el frasco del home se queda sin etiqueta.

---

## 6. Lenis

Plugin `nw` (`B5Ey9qla.js:12160-12182`):

```js
const ew = 1.2, tw = t => Math.min(1, 1.001 - Math.pow(2, -10*t));      // easeOutExpo
if (matchMedia("(prefers-reduced-motion: reduce)").matches) return { provide:{ lenis:null } };
new Lenis({ duration:1.2, easing:tw, infinite:false, smoothWheel:true, syncTouch:true, syncTouchLerp:.085, autoRaf:true });
```
- Defaults de Lenis 1.3.23 que quedan: `lerp:.1` (ignorado: con `duration`+`easing` gana la rama de duración en `Animate.advance`, `B5Ey9qla.js:11593`: `if (this.duration && this.easing) {…} else this.lerp ? …`), `wheelMultiplier:1`, `touchMultiplier:1`, `touchInertiaExponent:1.7`, `orientation:"vertical"`, `overscroll:true`, `anchors:false`, `autoResize:true`.
- Táctil: `syncTouch` → durante el gesto `lerp:1` (sigue al dedo); al soltar, inercia `sign(h)·|velocity|^1.7` con `lerp .085` (`:11950-11957`).
- Sincronía con ScrollTrigger: `t.$lenis?.on?.("scroll", () => Pe.update())` (`:17142`). No usa `gsap.ticker` (Lenis lleva su propio RAF).
- `lenis.stop()` en: preloader, menú abierto (`html.is-nav-open`), transición de página; `html.lenis.lenis-stopped { overflow:hidden }`.
- `history.scrollRestoration = "manual"` y `scrollTo(0, {immediate, force})` al montar si no hay hash (`ow`, `:12326`). Con hash, el header calcula su estado y hace `lenis.scrollTo(target, {immediate:true, force:true})`; /dispensa y /produzione hacen `lenis.scrollTo(el, {force:true})` (animado).
- **Convivencia con el home**: el slider no usa `data-lenis-prevent`. Funciona porque la página mide exactamente 100 % del alto (`.jar-slider{height:var(--app-height); overflow:hidden}`, sin footer) → Lenis no tiene recorrido, y el wrapper consume la rueda con `preventDefault()` (`passive:false`). El carrusel de "otros productos" sí usa `data-lenis-prevent-horizontal`.
- `window.lenis` **no es la instancia**: el propio constructor de Lenis hace `window.lenisVersion = "1.3.23"; window.lenis ||= {}; window.lenis.version = …; window.lenis.touch = true` (`B5Ey9qla.js:11814`). Por eso no expone `scrollTo`. La instancia real se inyecta como `$lenis` de Nuxt (`useNuxtApp().$lenis`). Igual `window.__THREE__ = "160"` lo pone Three.js al importarse (`DoMZv-wV.js:14558`).

---

## 7. Animaciones por componente

### 7.1 Preloader de frutas (`SiteFruitLoaderIntro`, `B5Ey9qla.js:22513-22655`)

- Aparece en la primera carga de cualquier ruta real (no en 404: `meta.hideIntro`). `aria-hidden="true"`. `lenis.stop()`.
- 22 frutas = 11 SVG (`/assets/fruits/fruit-01…13.svg`, embebidos) × 2 copias. Ancho `calc(var(--fruit-base) * scale)` con `scale = viewBoxW/300 · 1.2 · {fruit-06:.95, fruit-09:.88} · .8 · (.9 | 1.0)`.
- Física **matter-js** (`ry`, `B5Ey9qla.js:22223`): gravedad `3.35`; suelo y paredes estáticos de 240 px (`restitution .2, friction .6`); cuerpos con casco convexo precalculado (tabla `_S` indexada por hash FNV-1a del `d` de los paths), `restitution .03, friction .82, frictionAir .03, sleepThreshold 18`; spawn `x = max(60, W·.15 + rand·(p − 1.3W))`, `y = −(h+140) − i·90 − rand·110`, ángulo `(rand−.5)·.24 rad`; `MouseConstraint` (stiffness .2): **se pueden arrastrar las frutas**. Transform por frame: `translate(x−offX, y−offY) rotate(angle rad)`.
- Contador: arranca a los 300 ms y sube 0→100 % en **1700 ms** con easeOutCubic, en serif naranja `--text-display`, entrada `opacity 0→1 .22s ease-out .3s`.
- Cierre (`P`) cuando el contador llega a 100 **y** la física se asentó (80 % de los cuerpos dormidos o lentos durante 10 frames), o forzado a los **2000 ms** (2500 en ≤480). `closeDelayMs = 1800`:
  - `.is-closing`: panel naranja `fruit-loader-panel-sweep` en `--page-transition-duration` (1.8 s): `translateY(100%) → −100%` (0–50 %, `--ease-don-expo`) → `−205%`; el contenido se oculta en el 50 %; línea blanca 65 % barre de izquierda a derecha en 1.25 s.
  - 46 % (828 ms) → `site-intro-covered`; **62 % (1116 ms) → `site-intro-revealing`** (dispara slider, revelados de texto y logo); 1800 ms → `complete`, `lenis.start()`.
- Reduced motion: las frutas se colocan en círculo (radio 42 % del lado menor) sin física.

### 7.2 Transiciones entre páginas (`sw`, `B5Ey9qla.js:12243-12322` + `SiteAppOverlay` `:22840-22895` + CSS)

- `router.beforeEach` (si cambia la ruta) → `lenis.stop()`, oculta cursor, `body.is-transitioning { cursor:progress; overflow:hidden }`.
- **Normal**: telón `.page-transition__panel` (bordó `#762530`, `top:100%`, alto `max(100vh,100dvh)`):
  - cubrir: `page-panel-cover` `translateY(0 → −100%)` en `--page-cover-duration` **.9 s** `--ease-premium` + línea `page-line-sweep` (izq.→der., opacidad 0→1 en 12 %, desaparece al final);
  - el cambio de página **no espera** al telón: `beforeEach` devuelve `true` y el reemplazo lo temporiza la transición Vue `out-in` (`name:"site-page"`, `opacity 1→1` en `--page-cover-duration` .9 s, o sea una espera de la misma duración que el telón). `animationend` → evento `agrumea:page-cover-finished` solo marca "cubierto" (también por timer: cover + 180 ms);
  - cuando están "cubierto" **y** "entrado" (el `onEnter` de la página nueva, 2 RAF), empieza el levantamiento;
  - levantar: `page-panel-lift` `−100% → −205%` en **975 ms** `--ease-premium`; reset a `lift + 120 ms`. Tope de seguridad 6 s.
- **Con vuelo de frasco** (`is-jar-fade`): sin telón; salida `.42s linear`, entrada `opacity 0→1 .35s linear`.
- Los revelados de texto de la página nueva se reinician cuando `page-transition-entered` pasa a `true`.

### 7.3 Header (`SiteHeader`, `B5Ey9qla.js:17456-17840`)

- `position:fixed; z-index:900; pointer-events:none` (los hijos `auto`). Transición `transform .8s var(--ease-don-expo)`.
- **Ocultar/mostrar por scroll**: lee `lenis.scroll`; tras pasar `min(200px, limit/2)` (100 px en ≤480) acumula delta: `≥ +4 px` → oculto (`translate3d(0, calc(-100% - 40px), 0)`), `≤ −4 px` → visible + `is-header-accent`.
- **Logo compacto** con scroll > 33 px: el icono `translate3d(0,−19.8px,0) scale(0)`, palabra y "FARM" `translate3d(0,−62.1px,0)`; `.78s var(--ease-premium)` (colores .28 s).
- **Tema claro/oscuro**: IntersectionObserver sobre `[data-header-light]` con `rootMargin: -60px 0px -(innerHeight-61)px 0px` (franja de 1 px a 60 px del borde superior) → `data-header-theme="light"` pinta todo de crema.
- Fondo sólido blanco solo en ≤480 tras 450 px.
- Entrada del logo: `.site-header__brand-track { transform: translate3d(0,115%,0); transition: transform .9s var(--ease-premium) .1s }` → `.is-revealed` al revelar la intro. Toda la cabecera `.site-app-header { opacity:0; visibility:hidden }` hasta `is-ready`.

### 7.4 Botón MENU con rombo

- Píldora `37px` de alto, `min-width:90px`, borde 1px, texto 14px/600 uppercase + disco naranja 37×37 con rombo blanco 7×7 (`rotate(45deg)`, radio 1px).
- Hover del texto: cada letra es un "roll" (`roll-top`/`roll-bot`), `transform .35s cubic-bezier(.4,0,.2,1)` con retraso `--i·18ms`: la letra sube −100 % y entra la copia desde abajo.
- Hover del disco: `:before` bordó `scale(0→1) .3s ease-out`; rombo `scale(1.2)`.
- Abierto: rombo y "MENU" salen hacia arriba (`translate3d(0,−100%,0)`, `.9s var(--ease-premium)`), entra "CLOSE" y una X; disco blanco.
- ≤480: sin disco, píldora 84 px.

### 7.5 Menú a pantalla completa (`SiteFullPageNav` + `SiteNavOverlay`)

- Panel naranja `transform: translate3d(0,−100%,0)` → `0` en **.9 s** `--ease-premium` al abrir; al cerrar **.975 s** (`visibility` con retraso).
- Ítems gigantes: serif uppercase `clamp(59.04px, 38.16px + 5.355vw, ∞)`, `line-height:1`; disposición en **escalera**: `margin-left: calc(i/last·100%); transform: translate(calc(i/last·−100%))` (el primero a la izquierda, el último a la derecha). Separadores 1 px bordó `scaleX(0→1) .6s var(--ease-premium)` con retraso `.45 + i·.08 s`.
- Entrada de cada ítem: revelado por **caracteres** (`data-text-reveal-mode="chars"`, trigger `load`, retraso `.45 + i·.08 s`, .95 s, stagger .02 s, `yPercent 108 → 0`, ease `textveil`); secundarios retraso `.7 + i·.06 s`; legal `.9 s`.
- Cierre: `timeline.timeScale(2.1)` y `reverse()` de todos los revelados.
- Activo: color crema + rombo-marcador blanco `.16em` que sube desde `translate3d(0,165%,0)` (.6 s con el mismo retraso).
- Hover: `is-roll-hover` → las máscaras de caracteres suben −100 % y entra el clon (`.fp-nav__char-bot`) desde abajo, 18 ms por carácter.
- Externos: flecha SVG 11×11 que entra desde abajo.

### 7.6 Cursor (`SiteCursorLabel`, `B5Ey9qla.js:18630-18705`)

- Solo `(hover: hover) and (pointer: fine)`. Seguimiento con lerp **0.12 por frame** (`fS = .12`; 1 = sin lerp con reduced-motion): `o += (i − o)·.12`. Si al aparecer está a más de 80 px, salta a la posición. Ocultar con retraso de 90 ms.
- `.cursor-label { position:fixed; z-index:950 }`, píldora blanca `border-radius:500px; padding:8px 10px; gap:10px; 13px/600 uppercase naranja`, rombo naranja 7×7; `transform: translate(18px,−50%) scale(.4)` → `scale(1)` (`.5s var(--ease-premium)`), opacity `.35s`. Origen `left center`.
- Textos: "Discover the product" (frascos del home, tarjetas de producto), "Drag" (PhotoSlider), "Click" (frutas de contacto). Se ignora durante la transición de página.

### 7.7 Revelado de texto (`YC`, `B5Ey9qla.js:16884-17160`)

| Modo | Corte | duración | stagger | distancia (`yPercent`) |
|---|---|---|---|---|
| `lines` (defecto) | SplitType `types:"lines"` | .55 s | .08 s | 112 |
| `chars` | `types:"words,chars"` | .95 s | .02 s | 108 |

- Cada unidad se envuelve en `span.rvl-ink__mask` (`overflow:hidden; margin:-.14em 0 -.1em; padding:.14em 0 .1em`), se coloca con `gsap.set({yPercent: distancia, force3D:true})` y se anima a `yPercent:0` con `stagger:{each, from:"start"}`, ease `textveil` (`.165,1,.32,1`).
- Disparador: ScrollTrigger `start:"top 91%"`, `once:true` (o `data-text-reveal-trigger="load"` → se reproduce al iniciar). Atributos configurables: `data-text-reveal-{mode,start,once,duration,stagger,distance,delay,ease,trigger}`.
- `[data-default-text-reveal-mode="lines"]` en contenedores rich-text añade `data-text-reveal` a cada `<p>` hijo.
- Antes de partir: `html.is-text-reveal-enabled [data-text-reveal]:not(.is-text-reveal-ready)… { visibility:hidden }` (evita el destello).
- Re-corte con ResizeObserver (debounce 160 ms) en modo líneas; si ya se había reproducido, queda completo.
- Se inicializa cuando la intro revela o completa y en cada `page:finish`.
- Usos: títulos H1/H2 por caracteres; textos, etiquetas, enlaces del footer y celdas por líneas; título de portada (`data-text-reveal-distance="135"`, manual).

### 7.8 PageHero (portada de /dispensa, /produzione, /experience, /chi-siamo) — `Dns_r6D9.js`

```js
gsap.fromTo(cover, {"--cover-inset":1}, {"--cover-inset":0, ease:"none",
  scrollTrigger:{trigger:e, start:"top top", end:"+=100", scrub:true}});        // márgenes 40px y radio 15px → 0
gsap.fromTo(media, {yPercent:-10}, {yPercent:10, ease:"none",
  scrollTrigger:{trigger:e, start:"top top", end:"bottom top", scrub:true}});
```
- CSS: `clip-path: inset(0 calc(var(--page-margin)*var(--cover-inset)) round calc(var(--cover-radius)*var(--cover-inset)))`, alto 130vh; imagen `scale(1.18) → 1` en **1.5 s** `--ease-out-expo` al revelarse; overlay bordó 20 %.
- Título de portada (crema): revelado por caracteres al llegar la portada arriba (desktop); `reverse()` al volver.
- PageOutro (/dispensa): el mismo helper con `expandStart:"top bottom", expandEnd:"center center"`; zoom al entrar 15 % en viewport.

### 7.9 Parallax genérico (`B5hDNHw2.js`)

`fromTo(el, {yPercent: from}, {yPercent: to, ease:"none", scrollTrigger:{trigger: box, start:"top bottom", end:"bottom top", scrub:true, invalidateOnRefresh:true}})`, por defecto `−10 → 10`, **limitado** para no destapar los bordes (calcula el margen real de la capa `inset:-14% 0`). Usos: portadas de secciones de /dispensa, monodosis, imagen de cierre de /chi-siamo; capas frontales de "Salati" y "Vision" con `{from:3, to:-14}` (recorte que sobresale por encima del título).

### 7.10 PhotoSlider con "DRAG" (`CQ9W51ls.js`)

- Bucle infinito: duplica el set hasta cubrir 2× el contenedor; cada slide `translate3d(containerW/2 − slideW/2 + ((i·step − x) mod total, centrado), 0, 0)`.
- Física: `current += (target − current)·.05` por frame; al soltar `momentum = −velocity·16` (velocity EMA `.76/.24` en px/ms) y decae `·.93` por frame; corte a .05.
- Parallax interno: imagen 16 % más ancha por lado; `offset = sign(A)·|A|^.84·K`, `A = clamp(−u/T, −1, 1)`, `T = (containerW + slideW)/2·.78`.
- Medidas: ancho `61vw` (74/84), gap 40/24/16 px, alto `w·702/980`, radio 15 px; `touch-action: pan-y`.
- Teclado: `ArrowLeft/Right` → `target ± step`. `tabindex="0" role="group" aria-roledescription="carousel" aria-label="Photo gallery"` + `<p class="visually-hidden">Use the left and right arrow keys to browse the photos.</p>`. Foco: `box-shadow: inset 0 0 0 6px crema; outline: 2px solid bordó; outline-offset:-6px`. Clic cancelado si se arrastró > 8 px. Cursor "Drag".

### 7.11 Carrusel "The other products" (`ChHnAx5T.js`)

- Scroll nativo (`scrollLeft`), arrastre solo con ratón cuando hay ≥5 productos, bloqueo de eje a 8 px; `current += (target − current)·.075`, momentum `−velocity·18`, decae `·.92`. Táctil: scroll nativo con `scroll-snap` en ≤480 coarse.
- Tarjeta: `aspect-ratio:367.51/480.826`, radio 15, fondo `#ffe9d7`. Hover: fondo = color del producto, `scale(.96) rotate(2deg)` (.6 s `--ease-soft`), frasco `scale(1.1) rotate(4deg)` (1 s, origen 50 % 72 %), y **caen 9 frutas SVG** del producto (ancho 35.64 %) con matter-js gravedad 3.5 sin interacción; al salir se destruye la física y se limpian a los 400 ms.
- Ancho: 4 por vista (`25vw − …`), 2.5 en ≤1024, 85 % en ≤480. Orden: misma categoría primero.

### 7.12 Hero de producto (`BrPqqrCe.js`)

```js
ScrollTrigger.create({ trigger: root, start:"top top", end: () => `+=${innerHeight*.4}`, scrub:true,
  invalidateOnRefresh:true, onUpdate: n => { stage.style.setProperty("--ph", n.progress); jar.setSpin(n.progress) } });
```
CSS con `--ph` ∈ [0,1]: frasco `translateY(ph·−24vh) rotate(ph·20deg) scale(1.25 → .8)`, título `translateY(ph·--ph-title-fall)` (cae hacia el frasco), meta `translateY(ph·--ph-meta-shift)`; la etiqueta da una vuelta completa. El JS calcula posición de reposo y `--ph-title-fit` para que el título no choque con el frasco. Título por caracteres (load); meta por líneas con retrasos .2/.3 s.

### 7.13 Otros

- **/chi-siamo, pausa** (≥481 px): `timeline` con pin de `.about-pause__stage` durante `1.5·innerHeight`, scrub; 4 frutas SVG viajan desde las esquinas al centro (`x,y → 0`, `scale: data-pause-scale → 1`) y el título hace `autoAlpha 0→1` en la mitad.
- **/experience**: textos laterales `y: −110 → 110` y `110 → −110` (≥1025). Tarjetas apiladas (≥481): pin de `.experience-cards__stage` durante `(n−1)·innerHeight`; cada tarjeta nueva sube desde `yPercent ≈ ((vh + h)/2/h)·100 + 2` a 0 mientras la anterior va a `scale .85, rotationZ −3.8, rotationX 8, xPercent −.8, --card-shade .26` (`perspective:1400px`); imagen interna `yPercent −10 → 0`.
- **/contatti**: frutas con física (gravedad 3.35, sin arrastre) y **clic = explosión** de radio 420 px (impulso `24·(.35 + .65·cercanía)`, empuje vertical extra `24·.6·cercanía`, giro). Cursor "Click".
- **Nav de producto** (píldora inferior, /dispensa y /produzione): aparece cuando la primera sección pasa el 50 % de la ventana y se oculta antes del footer; `opacity` + `translate` `.6s --ease-out-expo`; indicador naranja que se desliza (`transform/width/height .5s`). Móvil: selector desplegable.
- **Footer** (bordó, `min-height:100vh`): la "marca gigante" es una imagen de Prismic (`.site-footer__logo`, columnas 4/-1) **sin animación propia**; solo revelados por líneas en textos y enlaces. Hover de enlaces: color → naranja `.3s --ease-out-expo`.
- **404**: frutas + dígitos gigantes `--code-size` (*inferido del CSS*: no leí el setup de `NotFoundPage`, `B5Ey9qla.js` ≈22 973–23 170).

---

## 8. Accesibilidad

### 8.1 prefers-reduced-motion (todo lo que cambia)

- CSS global: `animation-duration:.01ms !important; transition-duration:.01ms !important; animation-iteration-count:1`, y duraciones de transición de página a `0ms`.
- Lenis no se crea (`$lenis = null`) → scroll nativo.
- Sin parallax de mouse ni giro de etiqueta por velocidad en el home (`h = !Re.matches`); la marquesina, la intro y el hover siguen funcionando.
- Sin vuelo de frasco (`PT` → `null`); sin ScrollTrigger del hero de producto, PageHero, parallax, pausa de /chi-siamo y tarjetas de /experience (se apilan en flujo normal con `transform:none !important`).
- Cursor sin lerp (sigue al instante) y solo fundido de opacidad.
- Preloader: frutas en círculo sin física (se da por asentado al instante); el fundido CSS del número dura 1 ms, pero el **conteo JS sigue durando 1700 ms** (más 300 ms de espera) y el cierre CSS queda en 0 ms.

### 8.2 Foco y teclado

- `:focus-visible { border-radius:2px; box-shadow:0 0 0 5px var(--color-white); outline:2px solid var(--color-border); outline-offset:3px }`.
- Skip link `<a class="skip-link" href="#site-main">Skip to content</a>`: fijo arriba-izquierda, naranja, `translateY(-150%)` → `0` al enfocar (`.2s var(--ease-soft)`); `<main id="site-main" tabindex="-1">`.
- Menú: botón con `aria-controls="site-full-page-nav"`, `aria-expanded`, `aria-label` "menu"/"close". Si se abrió con teclado (`event.detail === 0`) el foco va al primer enlace; si no, al overlay (`tabindex="-1"`, sin outline). **Trampa de foco** con Tab/Shift+Tab sobre `a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])` visibles; **Esc** cierra; al cerrar devuelve el foco al elemento previo. Panel cerrado: `aria-hidden="true"`.
- PhotoSlider: flechas izquierda/derecha (único control de teclado de carruseles).
- Slider del home: **sin teclado** (solo enlaces tabulables con `aria-label` = alt del frasco).
- Nav de producto: botones con `aria-current="true"`; en móvil `aria-expanded`/`aria-controls="product-nav-list"`; `aria-hidden` mientras no es visible.
- `NuxtRouteAnnouncer` (`role="alert"`, `aria-live="polite"`) anuncia cambios de página.

### 8.3 Ocultación y ARIA

```css
.visually-hidden { border:0; clip-path:inset(50%); height:1px; margin:-1px; overflow:hidden;
                   padding:0; position:absolute; white-space:nowrap; width:1px }
```
- H1 del home oculto con esa clase (texto SEO "Agrumea Farm: Sicilian artisan marmalades, spreads and preserves"; viene de `hero.title` o de la traducción `homeHeadline`).
- Revelados de texto: el elemento recibe `aria-label` con el texto completo y cada máscara/unidad `aria-hidden="true"` (los lectores no leen letra por letra).
- Decorativos con `aria-hidden="true"`: forma y badge del home, canvas de etiquetas, cursor, preloader, telón, clon del vuelo, escenas de frutas, rombos de PageIntro, marcadores del menú.
- Idioma: `<html lang="en">`; selector `<nav class="site-lang-switcher" aria-label="Language switcher">` con `aria-current="true"` en el activo; footer `<nav aria-label="Footer">`; menú `<nav aria-label="Main navigation">`.

---

## 9. Otros detalles

- **Selector IT/EN**: dos círculos de 37×37 px (borde 1px, 14px/600, `gap:.5px`), activo relleno naranja con texto crema; hover borde+texto naranja (`.3s`). Guarda la elección en `localStorage["agrumea:lang"]`. Las rutas EN llevan prefijo `/en`; los productos usan `alternateUids` para enlazar el slug traducido.
- **Separadores ◆**: no son caracteres (ningún `◆` en HTML/JS). Son cuadrados CSS rotados 45°: `.page-intro__rhombus` 13×13 bordó (radio 2px, antes y después del texto de intro), rombo del menú 7×7, del cursor 7×7, marcadores del menú `.16em`/`.45em`.
- **Badges de peso (190g / 1kg / 3kg)**: `<li>` circulares 52×52, borde 1px bordó (25 % en la meta de producto), 14px/600, `gap:5px`; etiqueta encima naranja 14px/600 uppercase con `margin-top:14px` a la lista.
- **Tablas** (/produzione, monodosis): grid `1fr 27%` (2 col) o `1.3fr 1fr .25fr` (3 col), filas `padding:16px 0`, filete 20 %; cabecera naranja 14px/600 uppercase.
- **Cookie banner**: vanilla-cookieconsent (`run({ guiOptions:{ consentModal:{layout:"box", position:"bottom right", equalWeightButtons:true}, preferencesModal:{layout:"box", position:"right"} }, categories:{necessary(readOnly), analytics(ga4)} })`). Carga diferida: espera al fin de la intro (o 8 s), luego 300 ms (600 en táctil/≤900px) + `requestIdleCallback` (timeout 1200/2000 ms); no se muestra a bots/webdriver. Tema: crema, botones píldora naranja (hover bordó), título serif, sombra `0 18px 50px`. Botones "Accept"/"Reject"/"Manage preferences". Cualquier `[data-cookie-prefs]` abre preferencias. GA4 con Consent Mode v2 (`analytics_storage` según cookie `cc_cookie`), `gtag.js` cargado en idle (4 s), `page_view` manual por ruta.
- **Hover de enlaces**: footer/contacto → color naranja `.3s var(--ease-out-expo)`; legal → opacity `.7 → 1` (.25s, subrayado con offset 3px); meta del hero de producto → naranja .3s; enlaces de 404 → roll de caracteres.
- **CTA del slider** (`.jar-slider__cta`, círculo crema 94–112 px con sombra): existe en el código pero el home actual no lo renderiza (no hay `hero.cta` en Prismic).
- **Imágenes**: Prismic (`images.prismic.io`, `auto=format,compress`) con `srcset` generado (máx. 2400px; 1080 en frascos del home); `sizes` por componente (frascos `(max-width:768px) 150px, 300px`).
- **CMS**: Prismic (`getSingle("homepage" | "products_page" | "produzione" | "experience" | "chi_siamo" | "navigation"…)`); los colores por producto (`themeColor`) y SVG de fruta (`fruitSvgMarkup`) vienen de ahí.

---

## 10. Lo que no pude determinar (o es inferido)

1. **Versión exacta de cookieconsent**: el bundle no incluye la cadena de versión; por la API (`run`, `acceptedCategory`, `show--consent`) es vanilla-cookieconsent v3.x.
2. **Contenido de los SVG de frutas** (11 dibujos, nombres pear/eggplant/blackberry/tomato en /chi-siamo): están embebidos como strings en `B5Ey9qla.js` (18 694–18 822) y `DfgJlGGB.js`; no los extraje a archivos.
3. **Logo SVG completo** (`site-logo-full` con `__icon`, `__wordmark`, `__farm`): está en `B5Ey9qla.js:17261`, truncado en mis lecturas; los desplazamientos del modo compacto (−19.8px / −62.1px) sí están.
4. **Comportamiento real sin WebGL**: deducido del `try/catch`; no lo probé en un navegador.
5. **Valores que dependen del CMS**: colores `themeColor` por producto, número de productos (hoy 10), textos de portada, pesos.
6. **`--reveal-index`**: se asigna a cada unidad del revelado pero ninguna regla CSS lo usa (*inferido*: residuo o depuración).
7. **CustomEase `linedraw`** registrada sin uso encontrado en los chunks descargados (puede usarse en una ruta que no visité, p. ej. `/privacy`).
8. **Rol de algunas constantes** de la tabla 4.2 (`ta`, `Kt`, `Xr`) está deducido por su uso en la fórmula, no por nombre.
9. Los `ease: "expo"` (`B5Ey9qla.js:15530`) y `"power4"` (`:16035`) están dentro de ScrollTrigger (defaults de la librería), no en código del sitio.
10. Página 404: solo leí su CSS.
11. No ejecuté el sitio: tiempos y fórmulas salen del código, no de medición en pantalla (excepto la comprobación de tamaño de canvas 299×481 a 1440 px).
