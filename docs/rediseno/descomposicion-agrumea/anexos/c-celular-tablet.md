# agrumeafarm.it en celular y tablet: accesibilidad, casos límite y rendimiento

Fecha: 14-nov-2026. Sitio: https://www.agrumeafarm.it/en (Nuxt + Prismic + GSAP/ScrollTrigger + Lenis + Three.js + matter-js).
Herramientas: Playwright con Chrome del sistema, WebGL real (ANGLE Metal, M1) y Lighthouse 12 en modo móvil.

Todas las rutas son relativas a esta carpeta:
`/private/tmp/claude-501/-Users-camilocolmenares-Developer-agroincol-web/5a807af6-7bc3-4846-91e0-f5fb7a7fc8cd/scratchpad/agrumea/movil/`

Convención: **[M]** = medido (número o captura). **[I]** = inferido (deducido del código o del comportamiento, sin prueba directa).

Dispositivos emulados:
- Celular: 390×844, DPR 3, táctil, UA de iPhone Safari.
- Tablet: 768×1024, DPR 2, táctil, UA de iPad.
- Horizontal: 844×390.
- Portátil bajo: 1280×650.
- Comparación con escritorio: 1440×900, solo medidas, sin capturas (eso lo cubre el otro agente).

---

## 0. Evidencia (índice)

| Qué | Dónde |
|---|---|
| Recorrido de cada página, cada 70 % de la ventana | `phone/<página>/NN-yY.jpg`, `tablet/<página>/…` |
| Hojas de contacto por página | `hoja-phone-<página>.jpg`, `hoja-tablet-<página>.jpg` (dispensa, smeraldo, produzione, experience, chi-siamo, contatti, 404) |
| Medidas por sección (font-size, line-height, x/ancho, padding, ocultos) | `<dispositivo>/<página>/medidas.json` (phone/tablet/desk) |
| Tabla comparativa celular / tablet / escritorio | `comparativa-tipografia.txt` |
| Home: gestos, video y cuadros clave | `video-home-gestos.mp4`, `hoja-home-gestos.jpg`, `home-gestos/gestos-log.txt`, `home-celular-reposo.png` |
| Menú (celular y tablet) | `hoja-menu.jpg`, `video-menu-v-phone.mp4`, `video-menu-v-tablet.mp4`, `menu/*.jpg` |
| Producto: frasco, slider de fotos, otros productos, navegación de la despensa | `hoja-producto-interaccion.jpg`, `video-producto-v.mp4`, `producto/producto-log.txt` |
| Horizontal y portátil bajo | `hoja-horizontal-844x390.jpg`, `hoja-portatil-1280x650.jpg`, `bordes/*.jpg` |
| Tab, reduced-motion y sin JS | `hoja-tab-y-reduced-motion.jpg`, `hoja-sinjs.jpg`, `accesibilidad/a11y-log.txt`, `accesibilidad/*.jpg`, `video-accesibilidad-v-*.mp4` |
| Contraste, alt, zonas táctiles, SEO y cabecera | `accesibilidad/auditoria.json` |
| Lighthouse (3 corridas aisladas, más 3 descartadas) | `lighthouse/*.report.html/json`, `lighthouse/resumen-lighthouse.txt`, `lighthouse/ronda1/` |
| HTML del servidor y bundles JS | `html-crudo/`, `js-descargado/` |
| Verificaciones (momento en que carga Three.js, foco, H1 en horizontal, sin JS a 10 s, menú y tap con reduce) | `verificacion/verificacion-log.txt`, `hoja-verificacion.jpg`, `hoja-reduced-motion-loader.jpg` |

Nota: `phone/404`, `tablet/404` y `desk/404` salieron de un error mío en la ruta. Igual sirven: es la página 404 en celular ("This page bore no fruit", con frutas físicas al fondo).

---

## 1. Página por página a 390 y 768: qué cambia respecto al escritorio

### Patrones globales [M]

**Margen lateral.** Es 30 px fijo en los tres tamaños, sin cambiar a 16 o 20 en celular:
- Títulos `x30` en 390, 768 y 1440.
- El pie también va a 30 px.
- La cabecera usa 16 px en celular (idiomas en `x16`) y 30 px en tablet.

**Tipografía fluida.** Hay dos familias:
- *ivymode*: display, serif fina, en mayúsculas.
- *ivystyle-sans*: texto.

Los títulos escalan con el ancho de la ventana; el cuerpo casi no cambia:

| Elemento | 390 | 768 | 1440 |
|---|---|---|---|
| H1 de página (`page-hero__title`) | 47,2 px (12,1 vw) | 85,1 px | 204,8 px |
| H2 de portada sobre la foto | 37 px | 77,5 px | 113 px |
| H2 de sección (`product-section__title`, `other-products__title`) | 42,4 px | 88,1 px | 128 px |
| H2 gigante a sangre ("SAVOURY", "VISION") | 80–100 px | 157–197 px | 268–370 px |
| H1 de producto | 48 px (alto de línea 1,0) | 92,5 px | 176 px |
| Párrafo de introducción | 22,1/28,8 px | 32/41,6 px | 32/41,6 px |
| Cuerpo | 18,0/23,4 px | 18,6 px | 19,7 px (clamp suave) |
| Etiquetas en mayúsculas (`Useful tips`, `Available weights`, encabezados de tabla) | 14 px | 14 px | 14 px |
| Pastillas de peso (190g/1kg/3kg) | 52 px de ancho, 14 px | igual | igual |

**Espaciado vertical.** En celular baja a la mitad:
- `page-intro`: padding-top 48 px en celular frente a 100 px en tablet y escritorio.
- `product-section`: 96 px frente a 200 px.
- `other-products` y `experience-proposals`: 96/96 frente a 200/200.
- Pie: 48/40 frente a 60/40.

**Cabecera** (por igual en todas las páginas):
- Pastillas IT/EN a la izquierda, logo centrado y MENU a la derecha.
- Celular: el logo mide 108×93 y el botón MENU solo la pastilla (84×37).
- Tablet y escritorio: el logo mide 135×116 y la pastilla MENU lleva al lado un disco naranja con un rombo (128×37 en total). En celular el disco tiene 0×0, oculto.
- Comportamiento con scroll [M], en `accesibilidad/auditoria.json → header`:
  - Es `position: fixed`.
  - Al bajar se oculta (`is-header-hidden`, translateY −181).
  - Al subir reaparece en versión compacta (alto 141 → 93, clases `is-header-compact is-header-solid is-header-accent`).
  - El `background-color` calculado del `<header>` es transparente. En la captura `producto/fotos-1-tras-swipe.jpg` se ve una franja clara detrás, que parece blanca. [I] El fondo lo pinta un hijo o un pseudo-elemento.

**Pie (`site-footer`)**:
- Celular, 1133 px de alto:
  - Logotipo AGRUMEA Farm grande a ancho completo (330×109).
  - Luego dos columnas de 159 px: links | direcciones.
  - Debajo, una sola columna: Follow us, el texto con el correo, copyright e IVA, y Privacy | Designed by.
- Tablet, 1014 px: el logotipo pasa a 528×174 y aparece el ícono del granjero (72×76). Tres columnas: copyright | links | direcciones, más una fila con Follow us | texto.
- Escritorio, 967 px: el logotipo pasa a 1030×340 a la derecha.

**Navegación por categorías** (`.product-nav`) en Despensa y Producción:
- Celular: una sola pastilla fija abajo al centro (173×44, `position: fixed`, y 780) con la categoría actual y un círculo naranja con chevron. Al tocarla se abre hacia arriba una tarjeta con las 4 opciones (43 px de alto cada una). Al elegir una, hace scroll a la sección (`producto/dispensa-nav-*.jpg`).
- Tablet y escritorio: el botón `product-nav__current` se oculta y se ven las 4 pestañas en fila dentro de una pastilla blanca, con la activa en naranja (`hoja-tablet-dispensa.jpg`).

**Lo que se oculta en celular** [M]:
- "Made in Sicily – Italy" en el hero de producto (también en tablet).
- `experience-proposals__side` ("Harvesting & Tasting", también en tablet).
- El link "Privacy & Cookies" del home (en escritorio aparece abajo a la izquierda; en celular solo vía menú).
- El disco del botón de menú.

### Home `/en` (`home-celular-reposo.png`, `phone/home/00-y0.jpg`, `tablet/home/00-y0.jpg`)

- [M] Es una sola pantalla de 100vh en los tres tamaños (scrollHeight = alto de la ventana), sin scroll.
- [M] La composición se mantiene. Arriba la cabecera. Al centro la marquesina de frascos. Abajo, un sello granate poligonal con el texto curvo "…WE PRESERVE · WE GROW…" (una SVG de 1168 px) y "SCROLL TO DISCOVER" (13 px, ls 1,3 px).
- En celular el sello ocupa el ~45 % inferior y se corta por los lados. En tablet es proporcionalmente más grande.
- [M] El texto dice "Scroll to discover" también en táctil, y en celular deslizar en vertical no hace nada (ver 2).

### Despensa `/en/dispensa` (`hoja-phone-dispensa.jpg`, `hoja-tablet-dispensa.jpg`)

Alto total: 7514 px en celular, 9392 en tablet y 11079 en escritorio.

1. **Hero**:
   - Celular: H1 "PANTRY" centrado. Debajo, una foto en tarjeta redondeada (radio ~12 px) de 330 px de ancho, con margen de 30 px y el H2 "OUR LAND, ONE JAR AT A TIME." en crema encima.
   - Escritorio: el hero mide 1669 px y la foto es a sangre.
   - Hacia y=591 del celular la foto ya toca los bordes. [I] Se expande con el scroll, como en escritorio, pero en menos recorrido (613 px de hero frente a 1669).
2. **Introducción**: rombo, párrafo centrado de 22 px a 309–330 px de ancho y otro rombo.
3. **Secciones de categoría** (Jams, Creams, Mono Pack):
   - Celular: todo apilado y centrado (título, foto ambiental a 330 px, texto y pesos) y luego una fila de tarjetas de frascos con scroll horizontal. Se ven 1,2 tarjetas: una de ~240 px y la siguiente asomando.
   - Escritorio: el texto va en una columna a la derecha (x964, ancho 446).
   - Tablet: el texto va centrado y angosto (x90, ancho 588), y las tarjetas muestran 2,5 frascos.
4. **Savoury**: banda morada a sangre con "SAVOURY" gigante (80 px en celular), foto del frasco y luego el texto.
5. **Mono Pack**: tabla de 3 columnas (Product / Shelf life / Weight) que en celular sigue siendo tabla, a 13–14 px y sin apilarse.
6. Banda de foto a sangre y pie.

### Producto `/en/dispensa/smeraldo` (`hoja-phone-smeraldo.jpg`, `hoja-tablet-smeraldo.jpg`, `hoja-producto-interaccion.jpg`)

Alto total: 4053 px en celular, 4935 en tablet y 4927 en escritorio.

1. **Hero de 844 px** con "Savoury" (link de 30 px) y el H1 "PISTACHIO PESTO" (48 px, en dos líneas) centrados.
   - El frasco arranca asomando por abajo: en y=669 solo se ve la tapa y el inicio de la etiqueta, a 325×523 con escala 1,25.
   - En escritorio, en cambio, el frasco queda al centro entre "Savoury" y "Made in Sicily".
2. **Frasco con el scroll** [M], medido como `transform` del contenedor:

   | scroll | rect del frasco | escala | giro |
   |---|---|---|---|
   | 0 | 33,669 · 325×523 | 1,25 | 0° |
   | 200 | 44,405 · 302×411 | 0,87 | ~12° |
   | 450 | 71,124 · 248×308 | 0,60 | ~20° |

   A partir de 450 queda fijo sobre la introducción.
   - Hacia scroll 200 el frasco tapa momentáneamente el párrafo (`producto/hero-scroll-200.jpg`).
3. **Introducción**: rombo, descripción (22 px), ingredientes con negritas, "pistachios" como alérgeno (18 px) y otro rombo.
4. **Metadatos**: tres bloques separados por líneas finas (Useful tips, Available weights con pastillas y Shelf life), centrados a 330 px. En escritorio la columna mide 471 px.
5. **Slider de fotos** (`photo-slider`):
   - 235 px de alto en celular, 407 en tablet y 629 en escritorio.
   - Celular: se ven 1 foto central (~292 px de paso) y los bordes de las vecinas.
6. **"THE OTHER PRODUCTS"**: H2 de 42 px y luego un carrusel de tarjetas de 281×367 con fondo durazno y frasco centrado.
7. Pie.

### Producción `/en/produzione` (`hoja-phone-produzione.jpg`)

- Tiene la misma plantilla que la despensa:
  - Hero "PRODUCTION" con foto de naranjas.
  - Introducción.
  - "CITRUS FRUITS" (42 px) con texto, el subtítulo "Crates / Box da: 10Kg" en negrita, una tabla Product | Availability, un photo-slider y "PISTACHIOS & ALMONDS" con su tabla.
- [M] En celular las tablas siguen siendo tablas, a 13 px. La columna "PCS X CTN" se parte en 3 líneas ("PCS / X / CTN"), apretada pero legible.
- [M] En tablet el texto de sección va a ancho 348 (x210), muy angosto.

### Experience `/en/experience` (`hoja-phone-experience.jpg`, `hoja-tablet-experience.jpg`)

- Hero, introducción y luego un bloque naranja a sangre con "DISCOVER OUR EXPERIENCES" (42 px en celular).
- **Celular**: las 3 tarjetas blancas se apilan, una debajo de otra:
  - Foto de 248 px, "01." (40 px), Duration al lado, título (24 px).
  - Debajo, "The experience" y "What's included" (16 px), uno sobre otro.
- **Tablet**: las tarjetas se superponen como mazo apilado (sticky stacking) y el texto pasa a dos columnas dentro de la tarjeta.
- **Escritorio**: otra composición, con el número "01." de 128 px. Allí la tarjeta 03 queda oculta a la vez, de modo que es una transición entre tarjetas. [I]

### Quiénes somos `/en/chi-siamo` (`hoja-phone-chi-siamo.jpg`, `hoja-tablet-chi-siamo.jpg`)

1. Hero "ABOUT", introducción larga (22 px).
2. Luego una pausa con frutas de colores en silueta (pera, tomate, berenjena y mora) que se mueven alrededor de la frase "IT'S NOT JUST A BRAND, BUT A PROMISE…" (24 px en celular).
3. Más texto y luego "VISION" (100 px en celular, 370 en escritorio) sobre una foto del agricultor con cielo azul. El subtítulo "Growing the future…" mide 18 px en celular y 15,7 en tablet: más chico en tablet que en celular.
4. Texto, una foto de frascos y el pie.

### Contacto `/en/contatti` (`hoja-phone-contatti.jpg`)

- Celular: una sola columna centrada.
  - H1 "CONTACT" de 42 px.
  - Subtítulo serif de 24 px.
  - Bloques Registered office / Operational office / Follow us / texto y correo.
  - Al final, una pila de frutas con física (matter-js) que cae.
  - Alto: 1353 px, la única página corta con scroll.
- Tablet: dos columnas para las direcciones, todo en 1024 px.
- Escritorio: el texto a la derecha (x730), todo en 900 px.
- [M] Esta página no tiene el pie granate.

---

## 2. Home en celular: cómo se mueve el slider

Evidencia: `video-home-gestos.mp4`, `hoja-home-gestos.jpg`, `home-gestos/gestos-log.txt`.

**Carga [M]:**
- 0–1,5 s: un loader con frutas planas de colores que caen y se apilan con física (matter-js) y un contador "0%…100%".
- Luego, un barrido naranja de abajo hacia arriba.
- Hacia los 3–4 s aparecen los frascos, primero como `<img>` base (WebP de Prismic).
  - En el iPhone emulado (DPR 3, `sizes=150px`), `currentSrc` resultó ser la variante w=640. La w=400 la pidió el dispositivo de Lighthouse.
  - Hacia los 5,5 s carga Three.js y pinta la etiqueta envuelta, en un canvas por frasco (441×708 a DPR 3). Ver la sección 6.

**Frascos visibles [M]:**
- 3 a la vez: uno central de ~233×275 px (60 % del ancho) y dos laterales cortados de ~90–110 px, con desenfoque y brillo reducido.
- Cada frasco va girado ~15°.
- Hay 10 frascos en el bucle.
- Código (`js-descargado/fKmsXwpK.js`):
  - Hasta 480 px: columna = ancho/3 y ancho del frasco = columna × 0,73.
  - Hasta 1024: también /3.
  - Escritorio: /4.
  - El alto se limita al 72 % del alto de la ventana.

**Autoplay [M]:** no hay. La posición del frasco central quedó idéntica (x = 90,8) durante 3 s de reposo. Solo hay una pequeña "respiración" de entrada (translateY que se asienta en ~1 s).

**Deslizar en horizontal [M]:**
- El arrastre sigue al dedo de cerca: 250 px de dedo en 160 ms dejaron la pista desplazada 215 px. Esa primera muestra se tomó justo después de soltar, así que puede incluir algo de inercia; la proporción exacta no está medida.
- Al soltar hay inercia con desaceleración exponencial: ~210 px más en ~1,3 s.
- Un deslizamiento lento de 150 px en 1,2 s dejó solo ~40 px de inercia.
- Es un bucle infinito: el frasco que sale por la izquierda reaparece a +1524 px.
- No hay imán (snap): el frasco central queda descentrado, con el centro en x=229 frente a 195 del centro de la pantalla.

**Deslizar en vertical [M]:**
- No mueve el slider ni la página (scrollY = 0 y posición sin cambio).
- [I] El código usa `wheel` (deltaY → movimiento horizontal) para ratón o trackpad y pointer events con el componente X para arrastrar. En táctil el gesto vertical, que es el natural, se ignora, aunque el texto dice "Scroll to discover".

**Llegar a un producto [M]:**
- Se toca el frasco. Es un `<a>` con aria-label y abre `/en/dispensa/<producto>`.
- La URL cambia hacia los 400 ms.
- Transición de elemento compartido:
  - El frasco tocado vuela y crece hacia la posición del hero del producto (abajo de la pantalla).
  - El resto de la home se desvanece.
  - El título del producto se revela letra por letra (`k06-tap-*.jpg`).
- No hay listado ni botón visible en el home: el único camino a los productos es tocar un frasco o abrir el menú → Pantry.

---

## 3. Menú, producto y pie en celular

### Menú (`hoja-menu.jpg`, `video-menu-v-phone.mp4`)

**Apertura y cierre [M]:**
- El botón `button.site-menu-toggle` mide 84×37 y lleva `aria-controls="site-full-page-nav"`, `aria-expanded` y `aria-label` "menu" → "close".
- Al tocarlo, una cortina naranja (#e94e1b) baja desde arriba: a los 350 ms cubre ~55 %.
- Los ítems aparecen línea por línea con rodado de letras (cada letra con top y bottom) y quedan estables hacia los 900 ms.
- MENU se convierte en CLOSE con el mismo rodado de letras.
- `html` recibe `is-nav-open lenis-stopped`: el scroll queda bloqueado.
- Escape cierra el menú (aria-expanded=false) y el foco queda visible en CLOSE.

**Contenido [M]:**
- HOME, PANTRY, PRODUCTION y EXPERIENCE: ivymode 40,95 px, centrados, en granate sobre naranja, separados por líneas finas granate.
- La página actual lleva un rombo blanco ("PANTRY ◆").
- Abajo, About / Contacts / Shop ↗ en sans 18 px (68–93×23 px) y "Privacy & Cookies" en un tamaño menor (no medido).
- El logo y IT/EN siguen visibles sobre la cortina (EN activo en blanco).
- En tablet es la misma composición, con más aire.
- En escritorio los ítems se escalonan en diagonal (Home a la izquierda, Experience a la derecha), según `bordes/laptop-menu.jpg`.

### Producto (`hoja-producto-interaccion.jpg`, `producto/producto-log.txt`)

**Frasco:** ver la tabla de la sección 1. Lo pinta el WebGL encima de un `<img>` estático (`product-hero__jar-base`, `fetchpriority="high"`).

**Slider de fotos [M]:**
- `.photo-slider__track` con `tabindex=0`, `role=group`, `aria-roledescription="carousel"` y un texto oculto "Use the left and right arrow keys…".
- Al deslizar con el dedo, la pista se mueve ~300 px (≈ una foto) con desaceleración y luego un segundo ajuste corto. [I] Es una animación propia (transform translate3d por slide) con algún acomodo final.
- No hay autoplay en reposo (posiciones fijas durante 2,8 s).
- El gesto vertical sobre el slider sí hace scroll de la página (`touch-action: auto`): 1719 → 2020.

**Otros productos [M]:**
- La pista `.product-slider__track.is-scroll` usa scroll nativo (`overflow-x: auto`).
- Un deslizamiento movió exactamente una tarjeta (296 px = 281 + 15 de separación) y se detuvo. [I] Lleva scroll-snap.
- Las tarjetas son `<a class="product-slide__link" aria-label="Sicilian Caponata">` vacías superpuestas a la tarjeta, sin texto visible del nombre: solo el frasco.

**Pie:** ver la sección 1.

---

## 4. Celular en horizontal (844×390) y portátil bajo (1280×650)

Evidencia: `hoja-horizontal-844x390.jpg`, `hoja-portatil-1280x650.jpg`, `bordes/*.jpg`.

**Horizontal 844×390: se rompe [M].**
- **Home**:
  - El frasco central mide 373×440, más alto que la ventana: se corta arriba y tapa el logo.
  - El sello granate (600×600) ocupa media pantalla detrás del frasco.
  - "Scroll to discover" queda encima del sello, pero el conjunto se ve encimado.
- **Menú: roto.**
  - Los 4 ítems (83 px de alto cada uno) suman más alto que la ventana: el contenedor mide 290 px de contenido en 254 de alto, con `overflow: visible`.
  - El logo se monta sobre HOME.
  - About / Contacts / Shop (y=256) quedan encima de PRODUCTION y EXPERIENCE.
  - No hay scroll interno.
- **Producto: falta el título.**
  - El H1 "PISTACHIO PESTO" tiene `font-size: 0px` y alto 0, medido a los 4,5 s, a los 10 s, tras hacer scroll a 150 y al volver a 0.
  - En horizontal el título del producto no aparece nunca. En la misma pestaña, al pasar a 390×844 vuelve a 48 px (`verificacion/verificacion-log.txt`, `verificacion/horizontal-smeraldo-10s.jpg`).
  - El frasco del hero (313×502) además tapa el logo.
  - [I] Probablemente el tamaño sale de un cálculo que en ese formato da 0.
- **Despensa y Experience**: aguantan. H1 de 92 px, la cabecera ocupa ~40 % de la altura y la foto de portada asoma abajo. Usables, pero el primer pantallazo es solo título.
- Ninguna página tiene scroll horizontal (scrollWidth = 844).

**Portátil 1280×650: se adapta, con aprietos [M].**
- **Home**: correcto. 4 frascos visibles (el código usa /4) y el alto limitado al 72 % evita cortes.
- **Menú**: entra justo. EXPERIENCE termina en y=617 de 650, al ras del borde, y About / Contacts / Shop quedan en y=584 a la izquierda, a la misma altura que EXPERIENCE pero sin chocar porque EXPERIENCE va a la derecha.
- **Producto**: H1 de 127 px, y el frasco entra por abajo y se monta sobre la parte baja del título, por diseño.
- **Despensa y Experience**: H1 de 187 px, primer pantallazo solo título más el inicio de la foto. Correcto.

---

## 5. Accesibilidad

### Recorrido con Tab desde el inicio (`accesibilidad/a11y-log.txt`, `tab-*.jpg`)

**Orden [M]**, igual en celular y escritorio:
1. "Skip to content" (aparece arriba a la izquierda como pastilla naranja, 164×42).
2. IT.
3. EN.
4. Logo.
5. MENU.
6. a 15. Los 10 frascos, en orden del DOM.
7. En escritorio, "Privacy & Cookies".
8. Luego `BODY` y vuelve a empezar.

Con el menú cerrado, sus links no entran al orden de tabulación (bien).

**Indicador de foco [M]:** consistente y bueno. Contorno granate de 2 px con 3 px de separación más un halo crema de 5 px (`box-shadow`). Se ve sobre crema y sobre naranja.

**Fallas en el slider [M]:**
- Al enfocar un frasco que está fuera de la vista, el navegador desplaza el contenedor de la marquesina para mostrarlo: `div.jar-slider__wrapper` pasó de `scrollLeft` 0 a 780 al enfocar el frasco 7.
- Ese desplazamiento descoloca la composición: aparecen frascos pequeños, borrosos y fuera de lugar (`accesibilidad/tab-phone-12.jpg`, `tab-desk-12-ampliada.jpg`, `verificacion/foco-frasco7.jpg`).
- El frasco 15 (pera) recibe el foco estando fuera de la pantalla (x=−160, invisible).
- **Teclado en el slider [M]:** las flechas ←/→, PageDown y Espacio no mueven la marquesina (x sin cambio). [I] El código solo escucha `wheel` y `pointer*`; no hay `keydown`.
- En cambio, el slider de fotos del producto sí anuncia el uso de flechas y tiene `role` y `tabindex`.

### prefers-reduced-motion

Evidencia: `hoja-reduced-motion-loader.jpg` (cuadros cada 0,3 s de ambos videos), `hoja-verificacion.jpg`, `verificacion/rm-*.jpg`, `video-accesibilidad-v-*.mp4`.

**Qué cambia con `reduce` [M]:**
- **Loader**: las frutas no caen. Aparecen de inmediato como una pila estática, mientras el contador sigue de 0 % a 100 % debajo. La duración total del loader es parecida (~3 s).
- **Cortina del menú**: es instantánea. A los 120 ms ya cubre toda la pantalla; sin `reduce`, a los 120 ms apenas empezó y a los 300 ms cubre ~40 %.
- **Tocar un frasco**: en lugar de que el frasco vuele al hero, hay un corte a una pantalla granate (150 ms) y luego aparece la página de producto con el título.
- **Lenis**: se desactiva (`html` pierde la clase `lenis`) y queda el scroll nativo.
- [I] Según el código, también se apaga la inclinación del frasco que sigue al ratón (`Re.matches`).

**Sin conclusión [M]:**
- Revelado de texto: a 120 ms de un scroll el texto ya estaba visible en ambos modos, así que no pude distinguirlos.
- La clase `is-text-reveal-enabled` sigue presente en ambos modos.

**Lo que no cambia [M]:**
- El loader sigue existiendo, con ~3 s de espera, y el frasco del home sigue teniendo su entrada (escala y desplazamiento que se asientan en ~1 s).

**Conclusión:** respeta reduced-motion bastante bien. Sustituye los movimientos grandes (caída física, cortina y vuelo del frasco) por cortes o estados estáticos. Lo único que no ahorra es la espera del loader.

### Sin JavaScript (`hoja-sinjs.jpg`, `accesibilidad/sinjs-*.jpg`)

- [M] **Home, producto y despensa muestran solo "0%" en naranja sobre crema, y nada más.** Lo comprobé de nuevo a los 10 s: el `.fruit-loader` sigue en `position: fixed`, `z-index: 10000`, 390×844 (`verificacion/sinjs-smeraldo-10s.jpg`).
- El contenido sí está en el DOM gracias al SSR:
  - 172 palabras en el producto y 456 en la despensa.
  - 33 links.
  - Imágenes con alt.
- Pero el loader (`fruit-loader`) lo tapa a pantalla completa y nunca se retira, porque no hay `<noscript>` ni CSS de respaldo.
- Para un usuario sin JS, o si el bundle falla, el sitio está en blanco.
- [I] Google renderiza con JS, así que el impacto en SEO es bajo. Para robustez es una falla grave.

### Texto alternativo (`accesibilidad/auditoria.json → altStats`)

**Bien [M]:**
- Ninguna `<img>` sin atributo `alt`.
- Los frascos llevan alt y aria-label con el nombre del producto.
- Los canvas WebGL tienen `aria-hidden="true"`.
- Las decorativas van con `alt=""`.

**Calidad irregular [M]:**
- Alts en italiano en la versión EN ("Pesti, patè e salse siciliane", "Mandorla sgusciata", "Esperienza - Il Percorso dell'Oro").
- Alts genéricos: "logotipo", "logo".
- Mayúsculas inconsistentes ("GELSI NERI") y un error tipográfico ("Crema splamabile al pistacchio").
- Producción: 10 de 17 imágenes con alt vacío, entre ellas fotos de contenido del slider.

**Lighthouse [M]:** 19 `<p>` con `aria-label` prohibido en la página de producto. El revelado de texto parte el texto en spans y pone el texto completo en `aria-label` del `<p>`, lo cual no es válido sin `role` (auditoría `aria-prohibited-attr`).

### Contraste (pares color/fondo medidos en las 7 páginas; WCAG AA)

| Par | Ratio | Dónde | Veredicto |
|---|---|---|---|
| Granate #762530 sobre crema #fdf3eb | 9,24 | cuerpo, títulos secundarios | Pasa AAA |
| Crema sobre granate | 9,24 | pie | Pasa |
| Granate sobre blanco | 10,1 | tarjetas de Experience | Pasa |
| Naranja #e94e1b sobre blanco | 3,77 | "Duration", "The experience" en 16 px, tarjetas | **Falla AA** en texto normal (solo pasa en grande) |
| Naranja sobre crema | 3,45 | etiquetas de 14 px ("Useful tips", "Available weights", encabezados de tabla) | **Falla AA** |
| Crema sobre naranja | 3,45 | EN activo, "Skip to content", pastilla activa de la navegación (14 px) | **Falla AA** (Lighthouse lo marca: 3,44) |
| Granate sobre naranja | 2,68 | ítems del menú (41 px) y links secundarios del menú (18 px) | **Falla incluso como texto grande** (mínimo 3:1) |

Notas:
- Los títulos grandes naranjas sobre crema (H1 y H2 de 42 a 205 px) quedan en 3,45, que pasa como texto grande.
- "Scroll to discover" va sobre el sello granate. Mi script lo midió contra crema porque el sello es una `<img>`; el par real es crema sobre granate, 9,24.

### Zonas táctiles (celular) [M]

**Por debajo de 44×44 (guía de Apple / AAA), aunque sobre el mínimo AA de 24×24:**
- IT y EN: 37×37.
- MENU: 84×37.
- Skip link: 164×42.
- Pestañas de la navegación de la despensa: 43 de alto.
- Links del pie: 159×25.
- @instagram: 86×25.
- Correo: 330×22–25.
- "Privacy & Cookies": 111×22.
- El link "Savoury" del hero de producto: 106×33.

**Grandes:** frascos del home (233×275 el central) y tarjetas de otros productos (281×367).

**Lighthouse `target-size`:** pasa (100), porque evalúa el mínimo de 24 px.

---

## 6. Rendimiento (Lighthouse 12, móvil simulado: Moto G Power, 4G lenta y CPU ×4)

Evidencia: `lighthouse/resumen-lighthouse.txt` y los informes HTML.

Hice 6 corridas. La primera ronda (`ronda1/`) coincidió con otras pruebas de Playwright en paralelo y dio una dispersión absurda en el producto (33, 93 y 40), así que la descarté. Las cifras de abajo son la **mediana de 3 corridas aisladas**.

| Métrica | Home `/en` | Producto `/en/dispensa/smeraldo` |
|---|---|---|
| Rendimiento | **59** (58–60) | **59** (57–60) |
| FCP | 5,1 s | 4,4 s |
| LCP | **9,2 s** (7,7–9,8) | **5,5 s** (5,4–7,2) |
| Elemento LCP | `img.jar-slider__shape-image` / sello SVG (`jar-slider__badge-artwork`); una corrida tomó `fruit-loader__mark` | `img.product-hero__jar-base` (WebP estático del frasco) |
| Desglose del LCP | TTFB ~0,3 s · carga ~0,1 s · **retraso de render ~3,9–4,2 s** | TTFB ~0,38 s · carga ~0,2 s · **retraso de render ~1,9 s** |
| TBT | 59 ms | 262 ms |
| CLS | 0,000 | 0,001 |
| Speed Index | 7,1 s | 7,4 s |
| Peso total transferido | **1253 KB** (54 solicitudes) | **969 KB** (64 solicitudes) |
| JS transferido | 422 KB (incluye gtag 178 KB) | 557 KB (incluye gtag 178 KB) |
| Three.js (`_nuxt/DoMZv-wV.js`) | 0 KB dentro de la ventana de Lighthouse | **112 KB br / 456 KB sin comprimir** |
| Bundle principal Nuxt (`B5Ey9qla.js`, con GSAP, ScrollTrigger y matter-js) | 210 KB br / 569 KB | igual |
| Imágenes | 686 KB (10 bases WebP w=400 de ~10–34 KB en el dispositivo de Lighthouse; el iPhone emulado pidió w=640, más 10 etiquetas WebP de ~40–58 KB para las texturas) | 235 KB |
| Fuentes (Typekit, 3 archivos) | 73 KB | 73 KB |
| Accesibilidad / Buenas prácticas / SEO | 96 / 100 / 100 | 92 / 100 / 100 |

**Diagnóstico [M]:**
- El cuello de botella no es la red; es la **coreografía de entrada**. En el home, el LCP tiene ~4 s de "element render delay": el loader con frutas y el barrido naranja retienen la pintura del contenido.
- En producto, ~1,9 s por la transición de entrada.
- El CLS es prácticamente cero: todo está posicionado con transform y las `<img>` llevan width/height.
- Bloquean el render los CSS de página (`CmsHomePage.css`, 277 ms en home; 4 CSS chicos en producto).
- Lighthouse marca además: caché corta en estáticos, JS sin usar, imágenes sobredimensionadas, "legacy JavaScript" y reflujo forzado.

**Qué carga primero y cómo evita que el WebGL bloquee.** Tiempos medidos con Playwright en el iPhone emulado, en ms desde la navegación (`verificacion/verificacion-log.txt`). Hay que distinguir por página:
1. **Lo común [M]:**
   - El HTML del servidor (Nuxt SSR) ya trae los 10 `<img class="jar-slider__base">` con `loading="eager"` y `sizes="(max-width: 768px) 150px, 300px"`.
   - Precargas: `modulepreload` del bundle, `preload` del `_payload.json` y `preconnect` a Typekit.
   - En producto, `img.product-hero__jar-base` lleva `fetchpriority="high"` y es el LCP.
   - Los canvas tienen `aria-hidden`. El código maneja `webglcontextlost` y, si falla el import, se queda la `<img>` (`catch`). [I]
2. **Home: Three.js diferido [M].**
   - El componente del slider (`fKmsXwpK.js`) se pide a los 373 ms y las texturas de etiqueta (`*_result-1.webp`, ~40–58 KB) a los 864 ms.
   - **Three.js (`DoMZv-wV.js`) recién a los 5484 ms**, después de lo cual se vuelven a pedir las texturas (5652 ms).
   - Por eso el chunk no aparece dentro de la ventana de Lighthouse y no cuenta ni para el LCP ni para el TBT del home (59 ms).
   - [I] El código lo importa con `import("./DoMZv-wV.js")` tras un `setTimeout`, después de que cargan las imágenes base (con un tope de 4 s).
   - El usuario ve primero los frascos como imagen plana, y la etiqueta en 3D aparece después.
3. **Producto: Three.js en la ruta crítica [M].**
   - El HTML del servidor trae `<link rel="modulepreload" href="/_nuxt/DoMZv-wV.js">`, y el chunk (112 KB br / 456 KB sin comprimir) se pide a los 384 ms, junto con el bundle principal.
   - No bloquea el LCP, que es la `<img>` estática, pero compite por red y CPU: TBT de 262 ms frente a 59 ms en el home, y "bootup" de JS mayor.
   - [I] Parte de esa diferencia de TBT probablemente se debe a parsear e inicializar Three.js temprano.

**Resultado:** el patrón que vale copiar es el del home (imagen primero y 3D diferido). En producto lo precargan para que el frasco 3D esté listo al llegar, y lo pagan en TBT.

---

## 7. SEO de la plantilla (a grandes rasgos)

Evidencia: `accesibilidad/auditoria.json → seo` y `html-crudo/`.

| Página | Title | Meta description | H1 | H2 | Palabras en `main` | JSON-LD |
|---|---|---|---|---|---|---|
| Home | Agrumea Farm \| Jams, pestos and flavours of Sicily | sí, propia | "Agrumea Farm: Sicilian artisan marmalades, spreads and preserves" (**visually-hidden**) | **ninguno** | **11** (43 en todo el body) | Organization (nombre, url, logo, sameAs Instagram) |
| Despensa | Sicilian jams, pestos and preserves \| Agrumea Farm | sí | Pantry | Our land…, Marmelade & Jams, Spreadable creams, Savoury, Mono Pack | 429 | ninguno |
| Producto | Smeraldo - Pistachio Pesto \| Agrumea Farm | sí, específica | Pistachio Pesto | The other products | 113 (262 en el HTML del servidor) | Product (name, description, image, category y brand; **sin offers**) |
| Producción | Citrus and Dried Fruit Production \| Agrumea Farm | sí | Production | The bounty of our land, Citrus Fruits, Pistachios & Almonds | 364 | ninguno |
| Experience | Sicilian Citrus Grove Experience \| Agrumea Farm | sí | Experience | An experience of places and flavours, Discover our experiences | 308 | ninguno |
| Quiénes somos | Agrumea Farm – The history, land and flavours of Sicily | sí | About | A treasure guarded since 1968, Vision | 294 | ninguno |
| Contacto | Contact \| Agrumea Farm | **duplicada de Producción** | Contact | subtítulo | 71 | ninguno |

**Bien [M]:**
- `lang="en"`.
- Canonical propio en cada página.
- hreflang it / en / x-default correctos.
- og:image por página.
- Viewport correcto, sin bloquear el zoom.

**Riesgos [M + I]:**
- El home es casi solo imagen: 11 palabras visibles, el H1 oculto y ningún H2. Los nombres de producto solo están en alt y aria-label.
- El revelado de texto parte el texto en letras, y en el HTML del servidor el menú se lee "H o m e P a n t r y…" y el botón "m m e e n n u u c c l l o o s s e e".
  - [I] Puede ensuciar el texto que ve un rastreador sin CSS y el texto que lee un lector de pantalla, si no lleva aria-hidden en todos los casos.
- El JSON-LD de Product no tiene `offers`, así que no habilita resultados enriquecidos de producto.

---

## Decisiones de adaptación a celular que vale la pena copiar

1. **Escala tipográfica en dos niveles.** Los títulos display se miden en vw (≈12 vw en celular, de 42 a 48 px) y el cuerpo se queda casi fijo (18 → 19,7 px). En celular los títulos siguen siendo protagonistas sin que el texto crezca de más.
2. **El espaciado vertical se reduce a la mitad en celular** (100 → 48 px y 200 → 96 px), con margen lateral fijo de 30 px. Es simple, predecible y fácil de replicar con dos tokens.
3. **La navegación por categorías pasa a una pastilla fija abajo** (173×44, en la zona del pulgar) que se despliega hacia arriba. En tablet y escritorio se ven las 4 pestañas. Ideal para un catálogo por plaga o servicio.
4. **Cabecera que se oculta al bajar y reaparece compacta (141 → 93 px) con fondo sólido al subir.** Recupera alto útil en celular.
5. **En Experience, las tarjetas se apilan simples en celular** y el mazo superpuesto (sticky) queda solo en tablet o más. El efecto caro se reserva para pantallas que lo aguantan.
6. **Imagen estática primero y WebGL después**, como en el home.
   - El `<img>` del frasco es el LCP.
   - Three.js va en un chunk aparte (112 KB br) que en el home se pide recién a los ~5,5 s y no toca ni el LCP ni el TBT.
   - Tiene respaldo si falla el WebGL, y el CLS es 0.
   - Es el patrón exacto para nuestros objetos 3D.
   - En la página de producto, en cambio, lo precargan con `modulepreload` y el TBT sube a 262 ms. Ahí conviene diferirlo también.
7. **Slider táctil con inercia y bucle infinito** que sigue al dedo de cerca. Los carruseles secundarios usan scroll nativo con snap (más barato y accesible) y dejan pasar el gesto vertical.
8. **Indicador de foco doble (contorno de 2 px más halo de 5 px del color de fondo)**, visible sobre cualquier fondo, más skip link. Los canvas van con `aria-hidden`.
9. **Las tablas de datos (vida útil, disponibilidad) siguen siendo tablas en celular**, a 13–14 px, en vez de convertirse en tarjetas. Funciona con 3 columnas cortas.
10. **Transición de elemento compartido** frasco del home → hero del producto (~400 ms): da continuidad y deja claro que el frasco "es" el link.
11. **Versión reduced-motion por sustitución, no por apagado.** Con `reduce`:
    - la caída física pasa a pila estática;
    - la cortina del menú pasa a corte instantáneo;
    - el vuelo del frasco pasa a un corte de color.

    La experiencia se mantiene sin movimiento grande.

## Fallas que no hay que copiar

1. **Sin JS, la pantalla queda en "0%" para siempre.** El loader tapa contenido que sí llegó por SSR. Si se copia el loader, tiene que retirarse con CSS (`<noscript>` o una clase que pone el JS) y nunca bloquear contenido.
2. **El loader cuesta ~4 s de LCP en el home** (9,2 s de mediana, rendimiento 59). Con LCP como métrica de negocio, no se paga eso por una intro.
3. **"Scroll to discover" en táctil, donde el gesto vertical no hace nada**: el slider solo responde al arrastre horizontal. En celular hay que decir "Desliza" o mapear el gesto vertical.
4. **Slider sin teclado y con foco que lo rompe.** Las flechas no hacen nada, el foco desplaza la marquesina y descoloca los frascos, y uno recibe foco fuera de la pantalla. Hay que dar teclado al slider (flechas) y llevar a la vista el elemento enfocado.
5. **Un loader de ~3 s que tampoco se salta con reduced-motion.** Con `reduce` sustituyen bien la física, la cortina y el vuelo del frasco por estados estáticos o cortes (eso sí hay que copiarlo), pero la espera del loader sigue.
6. **Contraste insuficiente en la paleta acentuada.** El menú granate sobre naranja (2,68) y el texto de 14–16 px naranja sobre crema o blanco, o crema sobre naranja (3,45–3,77), fallan AA. Si usamos naranja de acento, que sea solo en texto de 24 px o más, o que se oscurezca.
7. **Pantalla horizontal rota a 390 px de alto.**
   - El H1 del producto queda en `font-size: 0`: no hay título.
   - En el menú los ítems se enciman y no hay scroll interno.
   - El frasco tapa el logo.
   - El menú necesita `overflow-y: auto` y un alto mínimo, y los tamaños tienen que limitarse por la altura (vh), no solo por el ancho. Además hay que probar en horizontal.
8. **Zonas táctiles de 37 px** (idiomas y menú) **y links del pie de 25 px.** Hay que llevarlos a 44 px.
9. **`aria-label` en `<p>` para el revelado de texto** (19 errores) y texto partido en letras en el HTML del servidor. Para el revelado conviene dejar el texto real intacto y animar con clip o máscara, o poner los spans con aria-hidden y el texto en un span visually-hidden.
10. **SEO débil en la plantilla.** Home con 11 palabras y H1 oculto, alts en otro idioma, descripción duplicada (Contacto = Producción) y Product sin `offers`.
11. **El frasco del hero tapa el texto de la introducción** durante el scroll en celular (scroll ~200 px). Hay que reservar espacio o retrasar la entrada del texto.
