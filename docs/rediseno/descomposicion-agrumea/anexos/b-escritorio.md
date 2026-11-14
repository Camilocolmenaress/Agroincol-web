# agrumeafarm.it — Ingeniería inversa en escritorio (1440×900 y 1920×1080)

Fecha de captura: 14-nov-2026. Navegador: Chrome del sistema con Playwright, sin barras de scroll. Este informe solo cubre escritorio.

**Rutas.** Todas las rutas son relativas a la carpeta de este archivo:
`/private/tmp/claude-501/-Users-camilocolmenares-Developer-agroincol-web/5a807af6-7bc3-4846-91e0-f5fb7a7fc8cd/scratchpad/agrumea/escritorio/`

**Convenciones**
- **[M] medido.** Sale de `getBoundingClientRect`, `getComputedStyle`, un muestreo por `requestAnimationFrame` o un cuadro de screencast con marca de tiempo.
- **[I] inferido.** Interpretación mía a partir de cuadros o números; no se verificó en el código.
- Las posiciones `y` de un texto son relativas al borde superior de su sección, salvo que diga "viewport".
- Las tipografías se escriben `familia tamaño/interlineado peso`.

**Datos crudos.** Cada página tiene dos archivos de medidas:
- `paginas/<pagina>/medidas_secciones.json`: cada sección se midió en reposo, con su borde superior en la parte de arriba de la ventana, después de esperar 1,8 s. Es la fuente buena.
- `paginas/<pagina>/medidas.json`: tiene la red, el conteo de elementos por pantalla y las capturas. Su bloque de medidas se tomó al final del scroll, cuando las animaciones ya habían terminado, así que **no** describe el reposo del hero.

---

## 0. Sistema global (aplica a todas las páginas)

### 0.1 Tokens [M]

**Colores**

| Token | Valor | Uso |
|---|---|---|
| Crema | `#FDF3EB` | Fondo de `body`, texto sobre oscuro |
| Naranja | `#E94E1B` | Títulos display, etiquetas, menú, píldoras activas |
| Burdeos | `#762530` | Texto de cuerpo, footer, panel de transición |
| Mostaza | `#F39200` | Fondo de "experience-proposals" |
| Melocotón | `#FFE9D7` | Tarjetas de producto |
| Blanco | `#FFFFFF` | Píldora del cursor, tarjetas de Experience |

Hay además un velo burdeos al 20 % (`rgba(118,37,48,.2)`) sobre las fotos del hero de página y como sombra de la píldora de navegación.

**Fuentes.** Hay dos familias (Adobe Fonts/Typekit [I]).
- `ivymode` 400: títulos display, siempre en mayúsculas.
- `ivystyle-sans` 400, 600 y 700: cuerpo, etiquetas y botones.

**Rejilla `.grid-12`**
- A 1440: 12 columnas de 95,86 px, separación de 20,88 px y padding lateral de 30 px. Ancho útil: 1380 px.
- A 1920: columnas de 128,08 px, separación de 27,84 px y padding de 38,4 px.
- La separación es 1,45 vw [M]. El padding es 30 px a 1440 y 38,4 px (2 vw) a 1920; podría ser `max(30px, 2vw)` [I].

**Escala tipográfica a 1440** [M]

| Rol | Tamaño/interlineado | Detalle |
|---|---|---|
| H1 de página | `ivymode 204.8px/266.24px` | Mayúsculas |
| Título del hero de producto | `ivymode 176px/158.4px` | |
| H2 de sección | `ivymode 128.08px/128.08px` | |
| Ítems del menú | `ivymode 115.27px/115.27px` | 8 vw |
| Título blanco sobre foto del hero | `ivymode 112.99px/112.99px` | Padding de 0 72px |
| "SAVOURY" | `ivymode 295px` | |
| "VISION" | `ivymode 370px` | |
| Intro grande | `ivystyle-sans 32px/41.6px` 400 | Burdeos, centrada |
| Cuerpo | `ivystyle-sans 19.736px/25.66px` 400 | |
| Etiqueta | `ivystyle-sans 14px/18.2px` 600 | Mayúsculas, naranja |
| Píldoras de peso | Círculo de 52×52, borde de 1 px burdeos | Texto 14 px 600 |

- **Interletrado:** es `normal` en todo, salvo "SCROLL TO DISCOVER" (1,3 px, 0,1 em).
- **Unidad de animación:** todos los textos se parten en máscaras `rvl-ink`, por caracteres en los títulos y por líneas en los párrafos (ver 0.4).

### 0.2 Header fijo [M]

Capturas: `producto-interacciones/hoja_header2.jpg` (9 estados en /en/dispensa) y `escala-1920/comparacion_1440_vs_1920.jpg`. Datos: `producto-interacciones/scroll-hero.json` y la sonda `scripts/final-probe.cjs`.

**Medidas.** El header es `fixed` de 97 px de alto. La barra está a `top 30px`, con 30 px a cada lado, y mide 37 px de alto. Las medidas son idénticas a 1920.

| Elemento | Posición y tamaño | Estilo |
|---|---|---|
| IT/EN (izquierda) | Dos círculos de 37×37 en x = 30 y x = 68 | Borde de 1 px. `ivystyle-sans 14px` 600, mayúsculas. EN activo: fondo `#E94E1B`, texto crema |
| Logo (centro) | SVG de 135×116, top 30 | Cuelga por debajo de la barra |
| MENU (derecha) | 128×37 en total | Píldora de 90×37 (radio 999, borde de 1 px, texto 14 px 600) más disco naranja de 37×37 con un rombo crema de 10×10 rotado 45° |

**Estados al hacer scroll**
- y = 0: `site-header`, con el logo completo (figura más wordmark) [M].
- y > ~50 px: `is-header-compact`. El logo pierde la figura y queda solo el wordmark "AGRUMEA Farm" [M por captura].
- y > ~240 px bajando: `is-header-hidden`. El header entero hace `translateY(-137px)` y sale por arriba [M].
- Al subir: `is-header-accent`. El header compacto vuelve con `translateY(-137 → 0)` en ~400 ms [M].
- **No hay franja de fondo.** `.site-header__solid-bg` existe, pero su opacidad fue 0 en los 9 estados probados. El header es transparente encima del contenido [M].
- **Color adaptativo** [M]: IT/EN, MENU y el logo son **burdeos `#762530` sobre fondo claro** y **crema `#FDF3EB` sobre fondo oscuro**. Es crema sobre la foto del hero, sobre la caja Savoury, sobre la foto de cierre y sobre el footer; vuelve a burdeos en cuanto pasa a crema. [I: lo decide la clase `darkwrapper` de las secciones oscuras.]

**Otros elementos fijos**
- "Privacy & Cookies" abajo a la izquierda: caja de 140×40 en (10, 850) con fondo crema al 90 %. El enlace es de 14 px y opacidad 0,7.
- `.cursor-label`: ver 1.4.

### 0.3 Footer (igual en todas las páginas salvo home y contactos) [M]

Captura: `producto-interacciones/hoja_footer.jpg`; video: `producto-interacciones/footer.mp4`.

**Medidas.** Fondo `#762530`, 967 px de alto, padding 60/40.
- Fila del logotipo (340 px): "AGRUMEA Farm" en naranja, SVG de 1030×340 en x = 380 (columnas 4–12).
- 200 px de aire.
- Rejilla de 248 px con cuatro columnas:
  - Símbolo de 86×91 más "©2026 | AGRUMEA FARM" (14 px 700, naranja), razón social e IVA (14/22.4, crema). Columna en x 30–359.
  - Navegación en x 380–593: `16px/20.8` crema, con la página actual en naranja. Un hueco separa los grupos Home–About y Contacts–Shop.
  - Sedes en x 614–943: etiqueta de 14 px 600 naranja más texto `16px/22.4`.
  - "FOLLOW US" e instagram en x 964–1410, más un párrafo de `19.7px/27.6` (máx. ~51 caracteres) y el email en naranja.
- 40 px de aire.
- Fila inferior de 39 px: "Privacy & Cookies" a la izquierda y "Designed by Studio K95" a la derecha, los dos de 14 px con opacidad 0,7.

**¿Se revela la marca gigante?** No. El `img` del logotipo mantiene `transform` y `opacity` constantes en todo el recorrido: entra con el scroll normal 1:1. Solo las líneas de texto del footer tienen el revelado `rvl-ink` [M].

### 0.4 Revelado de texto `rvl-ink` [M]

Video: `producto-interacciones/revelado-texto.mp4`; cuadros: `producto-interacciones/revelado-texto_*.jpg`.

- **Estructura.** Cada línea o carácter va dentro de un `span.rvl-ink__mask` con `overflow` oculto. La unidad empieza desplazada hacia abajo un ~112 % de su interlineado: `translateY(28.7px)` en una línea de 25,66 px y 20,4 px en una de 18,2 px. Sube a 0 sin cambiar la opacidad.
- **Curva.** Medida en `product-meta`: 28,7 → 15,9 (66 ms) → 6,9 (133 ms) → 3,0 (200 ms) → 0,8 (300 ms) → 0 (~430 ms). Es una curva tipo expo-out de ~450 ms por unidad.
- **Escalonado.** Entre 33 y 83 ms por línea.
- **Disparo.** Las unidades arrancan cuando la línea entra en la ventana (centro de la línea a ~620–830 px de 900).
- **Títulos.** Hacen lo mismo por carácter, con el mismo recorrido de abajo arriba.
- **Hover.** Los títulos del menú y del botón MENU reutilizan la máscara para el efecto de rodillo (ver 0.6).

### 0.5 Transiciones entre páginas [M]

Hay **tres** comportamientos distintos:

1. **Carga dura** (URL directa o recarga): preloader de frutas. Aparece en *todas* las páginas y en *cada* recarga; en la recarga se vio "91%" a los 1,5 s. Detalle en 1.1.
   - Hoja home: `carga/hoja_carga_home.jpg`.
   - Hoja producto: `carga/hoja_carga_producto.jpg`.
   - Datos: `carga/*/timeline.json`.
2. **Navegación interna con el menú o entre productos:** panel burdeos `#762530` a pantalla completa.
   - Sube desde abajo, de `translateY` 0 a −900, entre los 100 y los 900 ms.
   - **La URL cambia de inmediato** (≤ 100 ms tras el clic, en el primer sondeo). A los ~1,0 s, con el panel cubriendo todo, se reemplaza el contenido y el scroll vuelve a 0 [M].
   - Sigue subiendo y sale por arriba, de −900 a −1840, entre 1,1 y 2,0 s.
   - Con la página nueva ya debajo, el H1 se revela por caracteres entre 1,2 y 1,8 s.
   - Total: ~2 s.
   - Hojas: `producto-interacciones/hoja_producto-a-producto.jpg` y `menu-hovers/hoja_menu-navegar.jpg`. Videos: `producto-interacciones/producto-a-producto.mp4` y `menu-hovers/menu-navegar.mp4`.
3. **Home → producto (clic en un frasco):** transición de elemento compartido, sin panel ni loader. Detalle en 1.9.

### 0.6 Hovers globales [M]

Diferencias de estilos calculados antes y a los 900 ms del hover. Datos: `menu-hovers/hovers-header.json` y `menu-hovers/hovers-otros.json`. Recortes: `menu-hovers/hoja_hover_header.png` y `menu-hovers/hover_*_{0,1,2}.png` (0 = antes, 1 = 120 ms, 2 = 900 ms).

| Elemento | Qué cambia | Tiempo |
|---|---|---|
| IT (inactivo) | Color y borde de `#762530` a `#E94E1B` | `0.3s` (borde, color y fondo) |
| EN (activo) | Nada | — |
| MENU | Cada letra es un rodillo doble: la de arriba sube −14 px y la de abajo entra de +14 a 0. El disco se rellena de burdeos con el rombo crema (círculo que crece desde el centro [I], ver captura) | `0.35s cubic-bezier(.4,0,.2,1)`, 18 ms de retraso por letra |
| Logo | Nada | — |
| "Savoury" (meta del hero de producto) | Color de `#762530` a `#E94E1B` | `0.3s` |
| Enlaces del footer (nav, instagram) | Crema a `#E94E1B` | `0.3s cubic-bezier(.16,1,.3,1)` |
| Email del footer | Sin cambio de estilos calculados (ya es naranja) | — |
| Privacy & Cookies y "Designed by…" | Opacidad 0,7 a 1 | `0.25s` |
| Ítems gigantes del menú | Rodillo por carácter: la máscara sube −142,9 px y entra la copia | `0.35s cubic-bezier(.4,0,.2,1)`, 18 ms de retraso por carácter |
| Píldoras de `product-nav` | **Sin cambio visible** en el hover sobre "Creams" (`menu-hovers/hover_pill.png`); el diff salió vacío | — |

Todos los enlaces llevan `cursor: pointer`. Los frascos del home y los tracks de fotos y de tarjetas llevan `grab`. `grabbing` durante el arrastre **solo se midió en el slider de fotos**; en el home no se leyó el cursor del frasco durante el arrastre.

Hover de "About", "Contacts" y "Shop" en el menú: **no capturado** [I: probablemente el mismo rodillo, porque sus letras también están duplicadas en el DOM].

---

## 1. Home `/en`

Página de 100vh sin scroll; `scrollHeight` 900 [M].
- Captura en reposo: `paginas/home/s00.jpg` y `escala-1920/home_1440.jpg`.
- Medidas: `paginas/home/medidas_secciones.json`.
- Clips: `home-interacciones/clips/*.mp4`.

### 1.1 Carga inicial y preloader

Corrida limpia: `carga/home/timeline.json` y la hoja `carga/hoja_carga_home.jpg`. Los cuadros pedidos de 0, 150, 300, 600, 1000, 1500 y 2500 ms son `carga/home/f_0XXXXms.jpg`.

**Red** [M]: `responseStart` 310 ms, FCP 492 ms, DCL 659 ms y `load` 1339 ms.

Las fases que siguen están medidas con el reloj y los cuadros [M] (cuadros cada 200 ms entre 3 y 11 s):

| t (ms desde la navegación) | Qué se ve |
|---|---|
| 0–~450 | Blanco y luego crema `#FDF3EB` vacío |
| 441 | `.fruit-loader` en el DOM |
| 478–2520 | Contador "0%"→"100%" centrado, `ivymode` de ~80 px [I, estimado de la captura] en naranja, que entra con un fundido. La curva desacelera: 17 % a 1203, 44 % a 1403, 65 % a 1603, 80 % a 1803, 92 % a 2070, 98 % a 2320 y 100 % a 2520. Es idéntica en home y producto, así que es un tween de tiempo fijo y no progreso real [I]. |
| ~1200–2800 | Unas 25 frutas planas [I, contadas a ojo] (granada, pera, berenjena, limón, mora, naranja, fresa, higo…) caen desde arriba, rebotan y se apilan hasta tapar la pantalla. Física 2D [I]. |
| 2787 | El loader recibe `is-closing` |
| ~3000–3600 | Barrido: un panel naranja `#E94E1B` sube desde el borde inferior y cubre todo |
| ~3600–3800 | Pantalla naranja completa |
| ~3800–4300 | El panel sale por arriba y destapa el home ya pintado |
| 3920 | El prompt y el logo pasan a `is-ready` y `is-revealed` |
| ~4000–4800 | La forma burdeos de abajo hace un fundido de 0 a 1 (en 4,0 s se ve al ~15 %) |
| ~4400 | Aparecen las píldoras IT/EN y MENU, y el logo empieza diminuto |
| ~4400–4800 | El logo crece de un punto a 135×116 (escala) |
| 4603 | `.fruit-loader` sale del DOM |
| **5381** | **Primer frasco visible** (opacidad > 0,05 dentro del viewport) |
| ~5300–6000 | Los frascos entran con fundido y "caen" a su sitio con algo más de rotación; quietos a ~6,0 s |

- **Repetibilidad** (3 corridas en serie: `carga/home`, `carga/home_r2` y `carga/home_r3`; `timeline.json`) [M]:
  - Loader: aparece a los 441, 612 y 633 ms; recibe `is-closing` a los 2787, 3023 y 3076 ms; sale del DOM a los 4603, 4823 y 4893 ms.
  - **Primer frasco visible: 5381, 5373 y 5511 ms** (rango de 5,37 a 5,51 s), o sea entre +4,76 y +4,94 s desde que aparece el loader.
  - En una cuarta corrida, con la red cargada por capturas en paralelo, el loader tardó 3166 ms en aparecer; esa corrida no midió el frasco.

### 1.2 Composición [M]

Captura `paginas/home/s00.jpg`. Datos: `escala-1920/escala.json` y `home-interacciones/reposo.json`.

**Sección.** `section.jar-slider` de 1440×900 con fondo crema. Tiene tres capas:

1. **`shape-layer` (z 1):** 1152×492 en (144, 408), anclada abajo y centrada (80 vw).
   - Dentro va una imagen burdeos `back-slider-home.svg`, un heptágono redondeado de 1106×472.
   - Encima va el `badge`: el círculo de texto `circle-text-en.svg` de 922×922 ("…ERVE · WE GROW…"), naranja sobre burdeos. Solo se ve su arco superior.
2. **`wrapper` (z 2):** la `marquee` está rotada **10°** (`matrix(0.985,0.174,…)`) y desplazada (−720, −240).
   - Contiene 10 `a.jar-slider__item`; la caja de cada uno es de 222×357 a 1440.
   - Cada frasco es un PNG base (`img.jar-slider__base`) más un `canvas.jar-slider__label` de 299×481, la etiqueta pintada en canvas [I: para deformarla].
   - Se ven unos 5 frascos.

   Escala y rotación en reposo, ordenadas por x:

   | Frasco (centro x, y) | Escala | Rotación |
   |---|---|---|
   | 0, 360 | 0,67 | 0° |
   | 340, 464 | 1,11 | +16° |
   | 801, 528 (central) | 1,35 | −15,7° |
   | 1210, 620 | 0,98 | 0° |
   | 1552, 633 | 0,50 | +15,6° |

   - El máximo medido es 1,40 cuando un frasco pasa justo por el centro.
   - La rotación se alterna −18…+18° según el frasco.
   - La diagonal baja hacia la derecha: el centro y pasa de ~360 a ~633 en 1550 px.
3. **`overlay` (z 3):** "SCROLL TO DISCOVER", `ivymode 13px/16.9px`, `letter-spacing 1.3px`, mayúsculas, crema `#FDF3EB`, centrado, en y = 853 (a 30 px del borde inferior). Se lee sobre la forma burdeos.

**Otros**
- El H1 "Agrumea Farm: Sicilian artisan marmalade…" es `visually-hidden` (1×1).
- **Elementos por pantalla:** header (3 controles), ~5 frascos, forma, arco de texto, prompt y Privacy. `paginas/home/medidas.json`, `shots[0].inView`, cuenta 22 imágenes o canvas en el DOM visible: 10 frascos × 2 más forma y badge.

### 1.3 Rueda: lenta, rápida e inercia [M]

Datos: `home-interacciones/rueda-*.json`, `rueda-una.json`, `rueda-inversa2.json` y `rueda-horizontal.json`. Clips: `home-interacciones/clips/02-rueda-lenta.mp4` y `03-rueda-rapida.mp4`. Hoja de la rueda rápida: `home-interacciones/hoja_rueda_rapida.jpg`.

**Ganancia y sentido**
- **Ganancia.** Una sola `wheel(0,100)` mueve la marquesina **116,6 px**. Con 300 de delta mueve 347 px, con 8 × 100 mueve 925 px y con 10 × 120 mueve 1381 px. Factor ≈ **1,16 px por unidad de delta**.
- **Sentido.** La rueda hacia abajo mueve los frascos a la izquierda; hacia arriba, a la derecha.
- **Rueda horizontal.** `wheel(300,0)` también funciona: −347 px.
- `scrollY` sigue en 0.

**Inercia** (una muesca de 100)

| t (ms) | Desplazamiento | % del total |
|---|---|---|
| 24 | 4,4 | 4 % |
| 141 | 30,6 | 26 % |
| 257 | 50,8 | 44 % |
| 491 | 78,2 | 67 % |
| 841 | 99,6 | 85 % |
| 1191 | 109,1 | 94 % |
| 1774 | 115,1 | 99 % |

- Último movimiento > 0,05 px por cuadro: ~2,2 s.
- **Ajuste.** Decaimiento exponencial (lerp) con **factor ≈ 0,0375 por cuadro a 60 fps**, constante de tiempo τ ≈ 440 ms. Es consistente en los tres tramos medidos.

**Lenta frente a rápida**
- Lenta (8 × 100 cada 150 ms): velocidad pico de 11,4 px por cuadro; se detiene a ~4,0 s del inicio.
- Rápida (10 × 120 cada 16 ms): pico de **28,8 px por cuadro** (~1700 px/s); se detiene a ~3,5 s del último evento.

**Sin snap.** Al frenar, el frasco central queda donde caiga: escala final de 1,29 a 1,31, no 1,40.

**Sin autoplay.** Con el puntero quieto durante 4 s, el desplazamiento fue de 0,0 px (`reposo.json`).

**Detalle fino.** Con el puntero **sobre el logo** (720, 100), la rueda **no mueve** el slider (0 px), mientras que en (900, 100) mueve −346 px (`otras-interacciones/rueda-sobre-logo.json`). En cualquier otro punto de la pantalla funciona igual: centro y abajo a la izquierda dan resultados idénticos.

**Escala y rotación al moverse.** Dependen de la posición x de cada frasco en la diagonal y se interpolan continuamente durante el movimiento [M: muestreo por cuadro]. Al cruzar el centro sube a 1,40.

### 1.4 Arrastre [M]

Datos: `home-interacciones/arrastre.json` y `arrastre-lento.json`. Cuadros: `home-interacciones/arrastre/dr_*.jpg`. Clip: `clips/04-arrastre.mp4`.

- **Lanzamiento.** Arrastrar 500 px a la izquierda en ~320 ms mueve **917 px** en total, con inercia. Pico de 35,5 px por cuadro; quieto a ~3,7 s.
- **Arrastre lento.** 300 px en ~1 s mueven 406 px mientras se arrastra y 93 px más de inercia al soltar (499 en total).
- **Cursor.** El CSS de los frascos es `grab`; ni el `body` ni la sección cambian de clase al arrastrar.

### 1.5 Círculo de texto ("WE GROW…") [M]

- **No gira solo:** 0° en 4 s de reposo.
- **Gira con el slider**, ≈ **+1,19° por cada 100 px** de desplazamiento de la marquesina: 925 px dan 11°. Hereda la misma inercia.
- También tiene un ligero parallax con el mouse (1.6).

### 1.6 Parallax con el mouse [M]

Datos: `home-interacciones/parallax.json`. Capturas en los extremos: `home-interacciones/parallax_{izq,der,arr,aba}.jpg`. Clip: `clips/05-parallax-mouse.mp4`.

Barrido del puntero de x = 100 a x = 1340 y de y = 80 a y = 830:

| Capa | Desplazamiento x | Desplazamiento y |
|---|---|---|
| `shape-layer` | ±9,5 px (−588 a −569) | 0 a +2,6 px |
| `badge` | ±6,7 px | −6,7 a +2,1 px |
| Frascos | ±8 px (deriva lateral con suavizado) | — |

- Tarda ~1 s en asentarse tras el último movimiento.
- Es sutil: menos de 10 px [M].

### 1.7 Teclado [M]

Datos: `home-interacciones/teclado2.json` y `tab.json`; capturas `home-interacciones/tab_01..16.jpg` y `hoja_foco.jpg`.

- **Flechas, PageDown y Space:** no mueven el slider (≤ 1,6 px, ruido de parallax).
- **Orden de Tab** (en el DOM): skip link "SKIP TO CONTENT" (164×42, arriba a la izquierda) → IT → EN → logo → [MENU, I: la secuencia capturada termina en el logo] → los **10 frascos** en orden de DOM → Privacy & Cookies.
- **Foco fuera de pantalla.** Los frascos que reciben foco fuera de la ventana (x negativa) **no se traen a la vista** (`tab-mov.json`: 0 px).
- **Anillo de foco:** `outline 2px solid #762530`, `outline-offset 3px`, `:focus-visible`. Sigue la rotación del frasco: es un rectángulo inclinado con una línea interior clara.

### 1.8 Hover sobre un frasco [M]

Datos: `home-interacciones/hover-centro.json`. Cuadros: `home-interacciones/hover/hvc_*.jpg`. Clip: `clips/06-hover-frasco.mp4`.

**El frasco no reacciona**: escala y rotación sin cambios (Δ < 0,001) y opacidad sin cambios. Los demás frascos tampoco cambian.

**Cursor `.cursor-label`.** Es fijo y sigue al puntero con retardo.
- **Retardo:** con el puntero quieto, el label converge en ~400–500 ms; al moverse va unos ~100 px por detrás [M].
- **Píldora:** blanca `#FFF`, radio de 500 px, `padding 8px 10px`, 192×33. Va desplazada (+18, −16) respecto del puntero.
- **Contenido:** un rombo naranja de 4×4 rotado 45° y el texto "DISCOVER THE PRODUCT", `ivystyle-sans 13px` 600, mayúsculas, `#E94E1B`.
- **Entrada:** la escala pasa de 0,4 a 1 y la opacidad de 0 a 1 en **~350–450 ms** (0,4 → 0,56 → 0,85 → 0,98 → 1 en cuadros de 100 ms).
- **Salida:** simétrica, ~500 ms.
- Fuera de un frasco la píldora queda a escala 0,4 y opacidad 0.

### 1.9 Clic en un frasco → página de producto [M]

Hoja: `home-interacciones/hoja_clic.jpg`, a partir de los cuadros `home-interacciones/clic/ckc_*.jpg` (cada 100 ms). Datos: `home-interacciones/clic-centro.json`. Clip: `clips/07-clic-frasco.mp4`.

Mecanismo, de la sonda por cuadro `home-interacciones/clic-mecanismo.json` [M]:

| t desde el clic | Qué pasa |
|---|---|
| ≤ 74 ms | **La URL cambia** a `/en/dispensa/<slug>`. Sin loader y sin panel. |
| 0–500 ms | El home sigue montado. La forma burdeos hace un fundido (opacidad 0,11 a 164 ms y 0 a 463 ms). En los cuadros se ve también el fundido de los demás frascos, el arco y el prompt. El `a.jar-slider__item` original **no cambia** su `transform` (solo deriva unos px). |
| ~510 ms | El home se desmonta y aparece un **clon `.jar-flight` dentro de `.site-app-overlay`**: base `img.jar-flight__base` más etiqueta. Aparece en (516, 540) con 450×707. |
| 510–1800 ms | El clon converge con ease-out al rectángulo exacto del frasco del hero, (483, 640) con 475×764: 506,568 a 613 ms; 491,616 a 913 ms; 485,633 a 1213 ms; 483,640 a 1663 ms. |
| 0–2100 ms | `.product-hero__jar` **real** sigue en opacidad 0 |
| ~2100–2300 ms | **Relevo:** el frasco real pasa a opacidad 1 mientras el clon baja a 0,63 y desaparece. El clon se retira del DOM a ~2,4 s. |
| 1,2–1,7 s | El H1 del producto se revela por caracteres de abajo arriba; "Savoury" y "Made in Sicily – Italy" se revelan por líneas entre ~1,4 y 1,7 s [M por cuadros] |

- **Discrepancia.** En la corrida de cuadros (`hoja_clic.jpg`) el frasco ya se ve viajando y enderezándose entre 200 y 600 ms. En la sonda, el clon (filtrado por tamaño > 150×200) solo aparece a los 510 ms. El tramo inicial del vuelo (0–500 ms) no está aislado numéricamente [I: puede que el clon exista antes con otro tamaño].

---

## 2. Página de producto `/en/dispensa/smeraldo` (plantilla compartida por mennulata, pestorosso, cipolla…)

- Hojas: `paginas/dispensa_smeraldo/hoja.jpg`, `paginas/dispensa_mennulata/hoja.jpg` y `paginas/dispensa_pestorosso/hoja.jpg` (8 capturas cada una, paso de 600 px).
- Medidas en reposo: `paginas/dispensa_smeraldo/medidas_secciones.json`.
- `scrollHeight`: 4927 (smeraldo), 4945 (mennulata) y 5047 (pestorosso).
- **Variaciones de contenido** [M por capturas]:
  - El meta izquierdo cambia según la categoría ("Savoury", "Spreadable Creams").
  - El bloque `after` puede ser alérgenos (mennulata: "May contain: Pistachios, Walnuts…", 14 px 600).
  - El número de píldoras de peso varía (mennulata tiene 4: 30g, 190g, 1kg y 3kg).
  - El título puede ocupar 2 líneas de distinto largo.

**Secciones [M]** (top / alto, fondo efectivo)

| # | Sección | Top / alto | Fondo |
|---|---|---|---|
| 0 | `product-hero` | 0 / 900 | Crema (stage) |
| 1 | `page-intro` | 900 / 738 | Crema; `padding-top` **335 px** para dejar sitio al frasco que baja |
| 2 | `product-meta` | 1638 / 301 | Crema, pt 100 |
| 3 | `photo-slider` | 2138 / 629 | Fotos |
| 4 | `other-products` | 2768 / 1193 | Crema, pt 200 y pb 200 |
| 5 | Footer | 3960 / 967 | Burdeos |

Espacios verticales: intro → meta, 0 (el aire viene del pt de 100). Meta → slider, **199 px**. Slider → otros, 0 más el pt de 200.

### 2.1 Hero en reposo [M]

Captura `escala-1920/producto_1440.jpg`.

**H1 "PISTACHIO PESTO"**
- `ivymode 176px/158.4px`, mayúsculas, `#E94E1B`, centrado, a 2 líneas.
- Caja de 1368×317 en (36, 228).
- 14 caracteres por línea; ancho máximo de ~19 caracteres.

**Frasco**
- `div.product-hero__jar` con caja de 380×611 y `scale(1.25)`. Visualmente ocupa 475×764 en (483, 640).
- Solo se ve la mitad superior: la tapa empieza en y ≈ 640.
- Es un PNG base más la etiqueta en `canvas`.

**Meta**, en y = 718:
- "Savoury" es un enlace a la categoría: `ivymode 32px/35.2px`, `#762530`, x = 147 (columna 2), 2 líneas.
- "Made in / Sicily – Italy": misma fuente, alineado a la derecha, termina en x = 1294.

**Por pantalla:** 1 título, 1 frasco, 2 metas y el header.

### 2.1b Entrada del producto en carga dura [M por cuadros]

Hoja: `carga/hoja_carga_producto.jpg`; tiempos: `carga/producto/timeline.json`.

1. El preloader es el mismo que en el home (1.1).
2. Cuando el panel naranja sale por arriba (~3,9–4,3 s), el **frasco ya está en su sitio**, recortado por abajo. Está en el viewport desde los 635 ms, debajo del loader, y **no se mueve** en los cuadros de 4,2 a 6,0 s.
3. El H1 se revela por caracteres de abajo arriba entre ~4,2 y 4,8 s.
4. "Savoury" y "Made in…" se revelan por líneas entre ~4,4 y 4,8 s.
5. Las píldoras del header aparecen a ~4,6 s y el logo crece entre ~4,6 y 5,0 s.

Al llegar desde el home (1.9) el frasco **sí** vuela; con el panel burdeos (0.5) ya está quieto bajo el panel.

### 2.2 Cómo se mueve el frasco al bajar [M]

Datos: `producto-interacciones/scroll-hero.json`. Hoja: `producto-interacciones/hoja_scroll-hero.jpg`. Video: `producto-interacciones/scroll-hero.mp4`.

Animación ligada al scroll (scrub) entre `scrollY` 0 y ~376 px:

| scrollY | Frasco: ty extra | Escala | Rotación | Centro y del frasco (viewport) | Centro y del título |
|---|---|---|---|---|---|
| 0 | 0 | 1,25 | 0° | 1022 | 386 |
| 122 | −73 | 1,10 | 6,8° | 827 | 407 |
| 244 | −146 | 0,945 | 13,6° | 632 | 427 |
| 376 | **−216** | **0,80** | **20°** | 430 | 430 |
| > 376 | Fijo en −216 / 0,8 / 20° y sigue el scroll 1:1 | | | | |

- **Lectura.** Mientras sube, el frasco se achica de 1,25 a 0,8 y gira a 20°, hasta quedar **centrado sobre el H1**, tapando su centro (se ve en `paginas/dispensa_smeraldo/s01.jpg`).
- **Título.** Queda casi pegado (sticky) en esos 376 px: solo baja 44 px. Luego scrollea normal.
- **Meta.** Scrollea 1:1 desde el inicio.

### 2.3 Intro y meta [M]

**`page-intro`.** Rombo de 18×18 burdeos rotado 45° (`border-radius 2px`) centrado en x = 711. Debajo, a 58 px, el texto:
- "Enveloping pesto…": `ivystyle-sans 32px/41.6px` 400, `#762530`, centrado, ancho de 1103 px (~78 caracteres como máximo, 55 por línea), 2 líneas.
- A 60 px, "Ingredients: **pistachios (65%)**…": misma fuente, con el `strong` en peso 700.
- A 57 px, el bloque `after`, de 19,7 px: "pistachios".
- A 57 px, el segundo rombo.

**`product-meta`.** Tres columnas separadas por filetes verticales (`meta-border-left`):

| Columna | Posición y ancho | Contenido |
|---|---|---|
| "USEFUL TIPS" | x 263, 514 px | Etiqueta de 14 px 600 naranja; texto de 19,7/25,66, 5 líneas, ~44 caracteres por línea |
| "AVAILABLE WEIGHTS" | x 778, 257 px | Píldoras circulares de 52×52 (borde de 1 px burdeos, 14 px 600) separadas 5 px |
| "SHELF LIFE" | x 1035, 141 px | "36 months" |

- Separación horizontal entre columnas: 0–1 px más el padding interno de ~21 px.
- La primera línea de texto va 33 px por debajo de la etiqueta.

### 2.4 Slider de fotos con "DRAG" [M]

Datos: `producto-interacciones/photo-slider.json`. Cuadros: `producto-interacciones/photo-slider_*.jpg`. Video: `producto-interacciones/photo-slider.mp4`, con marcas a 1,37 s (arrastre), 4,56 s (arrastre lento), 8,7 s (flechas) y 13,2 s (rueda).

**Geometría**
- Diapositivas `figure` de **878×629** (61 vw), separadas **40 px**, con radio de 15 px.
- La diapositiva central empieza en x = 281: centrada, con las vecinas asomando ~140 px a cada lado.
- Bucle infinito: hay clones a la izquierda y a la derecha (3 imágenes que se repiten).

**Parallax interno.** La `img` mide 1159×629 dentro de la `figure` y se desplaza ~0,17 px por cada px de desplazamiento del slide.

**Cursor.** El track tiene `cursor: grab`, y `grabbing` al arrastrar. El label dice **"DRAG"**: píldora blanca de 72×33 con rombo y texto naranja de 13 px 600.

**Arrastre.** 400 px a la izquierda en ~340 ms mueven 537 px en total, con inercia; quieto a ~2,5 s. **Sin snap**: termina en x = −255, no alineado.

**Teclado.** El track tiene `tabindex="0"` y un texto oculto: "Use the left and right arrow keys…". **ArrowRight o ArrowLeft avanzan exactamente una diapositiva (918 px)** con un ease de ~1 s.

**Rueda.** Sobre el slider, la rueda **hace scroll de la página**; no mueve el slider.

### 2.5 "The other products" [M]

Datos: `producto-interacciones/otros-hover.json` y `otros-arrastre.json`. Antes y después: `producto-interacciones/hoja_otros_hover.jpg`. Video: `producto-interacciones/otros-hover.mp4`.

**Composición**
- H2 "THE OTHER PRODUCTS": `ivymode 128.08px/128.08px`, 2 líneas, 1008 px de ancho, centrado.
- A 100 px, un track horizontal de 9 tarjetas `article.product-slide` de **334×437** separadas 15 px, con radio de 15 px y fondo `#FFE9D7`.
- La primera tarjeta empieza en x = 30. Se ven ~4 tarjetas por pantalla y un trozo de la quinta.

**Arrastre.** El track es arrastrable (`grab`, clase `is-scroll`). 500 px de arrastre mueven 668 px en total; quieto a ~2 s.

**Hover sobre una tarjeta.** Cambios medidos hasta el reposo a ~600 ms:
- **Tarjeta:** escala de 1 a **0,96** y rotación de 0 a **2°**. El fondo cambia al color del producto, por ejemplo `#F8C8D0` para pesto rosso. Transición `background-color 0.6s cubic-bezier(.22,1,.36,1)`.
- **Decoración:** el `stage` hace un fundido de 0 a 1 en 0,4 s. Son SVG de la fruta del producto (tomates, higos, hojas de pistacho…) repartidos con rotaciones aleatorias.
- **Frasco:** escala de 1 a **1,10** y rotación de 0 a **4°** (`transform 1s cubic-bezier(.22,1,.36,1)`).
- **Cursor:** "DISCOVER THE PRODUCT".
- **Salida:** simétrica, ~600 ms.

**Clic.** Panel burdeos (0.5): sale hacia `/en/dispensa/cipolla` y la página nueva entra en el hero (`hoja_producto-a-producto.jpg`).

### 2.6 Footer

Ver 0.3. Sin revelado de la marca gigante [M].

---

## 3. Dispensa `/en/dispensa`

- Hoja: `paginas/dispensa/hoja.jpg` (18 capturas).
- Medidas: `paginas/dispensa/medidas_secciones.json`. `scrollHeight`: 11079.

| # | Sección | Top / alto | Fondo | Contenido (alineación) |
|---|---|---|---|---|
| 0 | `page-hero` | 0 / 1669 | Crema más foto | H1 "PANTRY" `ivymode 204.8px/266.24px`, centrado, en y = 190. Debajo, a 43 px, la foto (`cover`) de 1440×1170 en y = 499, con el título blanco "OUR LAND, ONE JAR AT A TIME." (`ivymode 113px`, centrado, 1147 px) en y = 971 |
| 1 | `page-intro` | 1669 / 377 | Crema | Rombo, a 57 px el texto de 32/41.6 (1071 px, ~76 caracteres por línea, 3 líneas), a 58 px el rombo |
| 2 | `#marmellate` | 2047 / 1667 | Crema, pt 200 | H2 "MARMELADE & JAMS" (128 px, 2 líneas, centrado). A 100 px, una fila de foto de 796×574 (columnas 1–7, radio 15) y un aside en x = 964 de 446 px (cuerpo de 19,7 px, 7 líneas, 39 caracteres por línea, más "AVAILABLE WEIGHTS" y píldoras). A 100 px, el track de tarjetas (4 visibles) |
| 3 | `#creme` | 3714 / 993 | Crema | Igual, invertido: tarjetas a la izquierda y texto a la derecha |
| 4 | `#salati` | 4706 / 2380 | **Caja oscura**: morado ciruela casi negro de la foto `salati__bg` (1440×1168); píxeles entre `#180616` y `#1F0721` en `paginas/dispensa/s08.jpg` | "SAVOURY" en crema `ivymode 295px`, a todo el ancho, detrás de un recorte del frasco (`salati__front`, parallax). Debajo, texto centrado de 680 px (19,7 px, 8 líneas, 58 caracteres por línea), pesos y tarjetas |
| 5 | `#monodose` | 7086 / 2016 | Crema | H2 "MONO PACK" de una línea. Texto centrado de 680 px. Foto de 913×559 centrada. Tabla de 1147 px: cabeceras de 14 px 600 naranja; filas de 19,7 px con `padding 16px 0` (59 px) y filete inferior |
| 6 | `page-outro` | 9302 / 810 | Foto a sangre | Imagen de 1440×1037 con parallax |
| — | `nav.product-nav` | Fija | Blanco 80 % con desenfoque | Ver 3.2 |
| 7 | Footer | 10112 / 967 | Burdeos | |

- Ritmo vertical: pt de 200 por sección; 100 entre título y cuerpo, y entre cuerpo y tarjetas [M].
- **Por pantalla:** entre 1 y 2 titulares, 1 párrafo, hasta 6 imágenes y ~8 enlaces (tarjetas) (`medidas.json`, `shots[].inView`).

### 3.1 Hero de página con foto que se expande [M]

Datos: `otras-interacciones/dispensa-hero.json`. Hoja: `otras-interacciones/hoja_dispensa-hero.jpg`. Video: `otras-interacciones/dispensa-hero.mp4`.

La plantilla es la misma en produzione, experience y chi-siamo.

- **Recorte de la foto.** En reposo, la caja de la foto tiene `clip-path: inset(0 40px round 15px)`: se ve como una tarjeta con 40 px de margen lateral y esquinas de 15 px.
- **Expansión.** Al hacer scroll el recorte se abre a sangre: `inset(0 10.4px round 3.9px)` en y = 74 e `inset(0)` en y ≈ 147. Es un scrub en los primeros ~150 px.
- **Parallax de la foto.** `.page-hero__cover-media`, de 1440×1498, va de `translateY -150` a `+150` mientras la foto atraviesa la ventana (≈ 0,18 px por px).
- **Velo y título.** El velo burdeos al 20 % es fijo. El título blanco se revela por caracteres al entrar.
- **El H1 grande** scrollea 1:1, sin sticky.

### 3.2 Navegación inferior "Jams / Creams / Savoury / Mono Pack" [M]

Datos: `menu-hovers/product-nav.json`. Clic: `menu-hovers/pill-clic_*.jpg` y `pill-clic.mp4`.

- **Contenedor.** `fixed`, `bottom 40px`, centrado, 502×67. Fondo `rgba(255,255,255,.8)` con `backdrop-filter: blur(5px)`, radio de 500 px, `padding 10px` y `box-shadow 0 0 100px rgba(118,37,48,.2)`.
- **Enlaces.** 121×47, `ivystyle-sans 16px` 600, `padding 14px 20px`. El activo va en crema sobre un **indicador naranja deslizante** de 122×47 y radio de 500.
- **Entrada.** Aparece al terminar el hero (scroll ~1600–1700): `translateY 107 → 0` con fundido de opacidad.
- **Clic en una píldora.** Scroll suave con Lenis a la sección: de 2978 a 3714 px en ~1 s (240 ms: 3523; 480 ms: 3670; 720 ms: 3703).
- **Indicador activo.** Cambia con el scroll; se ve en las capturas s04–s15.
- En produzione solo hay 2 píldoras: "Citrus Fruits" y "Dried Fruits".

### 3.3 Caja "SAVOURY" [M e I]

Hoja: `otras-interacciones/hoja_dispensa-savoury.jpg`. Video: `dispensa-savoury.mp4`.

- La caja oscura entra con esquinas superiores redondeadas.
- "SAVOURY" queda detrás del frasco recortado, que sube más rápido que el fondo: parallax con `salati__front` en `translateY ≈ +44`, que va a menos [M].
- Debajo de la caja, el texto, los pesos y las tarjetas vuelven al fondo crema.

---

## 4. Producción `/en/produzione`

- Hoja: `paginas/produzione/hoja.jpg` (12 capturas).
- Medidas: `paginas/produzione/medidas_secciones.json`. `scrollHeight`: 7318.

| # | Sección | Top / alto | Contenido |
|---|---|---|---|
| 0 | `page-hero` | 0 / 1669 | "PRODUCTION" (204,8 px, 1 línea a todo el ancho) más foto de limones con "THE BOUNTY OF OUR LAND" |
| 1 | `page-intro` | 1669 / 422 | Texto de 32 px, 1127 px de ancho, 4 líneas, ~63 caracteres por línea |
| 2 | `#agrumi` | 2091 / 1265 | "CITRUS FRUITS" (126,9 px, 1 línea). A 60 px, texto de 680 px (8 líneas, 61 caracteres por línea). A 101 px, el subtítulo h3 "CRATES / BOX DA: 10KG" (19,7 px 600, mayúsculas, burdeos). A 99 px, la tabla de 2 columnas de 1147 px (PRODUCT 816 px / AVAILABILITY 310 px), filas de 19,7 px |
| 3 | `photo-slider` | 3557 / 629 | Como en 2.4, con 200 px de aire antes |
| 4 | `#pistacchi` | 4186 / 1136 | "PISTACHIOS & ALMONDS" (2 líneas), texto, h3 "VACUUM-PACKED / AVAILABLE ALL YEAR ROUND", tabla de 3 columnas (563/433/108) |
| 5 | `photo-slider` | 5522 / 629 | — |
| 6 | Footer | 6351 / 967 | 200 px de aire antes |

---

## 5. Experience `/en/experience`

- Hoja: `paginas/experience/hoja.jpg`.
- Medidas: `paginas/experience/medidas_secciones.json`. `scrollHeight`: 7032.

| # | Sección | Top / alto | Contenido |
|---|---|---|---|
| 0 | `page-hero` | 0 / 1669 | "EXPERIENCE" más foto con "AN EXPERIENCE OF PLACES AND FLAVOURS" (3 líneas) |
| 1 | `page-intro` | 1669 / 512 | Texto de 32 px, 7 líneas, 1136 px |
| 2 | `experience-proposals` | 2381 / 3684 | **Fondo `#F39200`**, pt y pb de 200. H2 "DISCOVER OUR EXPERIENCES" en **burdeos** (128 px, 3 líneas, 994 px). Laterales "HARVESTING & TASTING" (izquierda, alineado a la derecha) y "FLAVOURS & TASTINGS" (derecha) en crema, 19,7 px 600, mayúsculas. A 200 px, la pila de tarjetas |
| 3 | Footer | 6065 / 967 | — |

### 5.1 Tarjetas apiladas (pin) [M e I]

Datos: `otras-interacciones/experience-cards.json`. Hoja: `hoja_experience-cards.jpg`. Video: `experience-cards.mp4`.

**Tarjeta.** Blanca `#FFF`, 1147×645, radio de 15 px, padding de 30.
- Foto de 391×585 con radio de 15 y parallax interno de −75 px.
- Cuerpo de 639 px:
  - Número "01." en `ivymode 128px` naranja.
  - Título "THE GOLDEN PATH (YOUR BASKET)" en `ivymode 32px/41.6`, mayúsculas, naranja, 2 líneas.
  - "DURATION" (16 px 600 naranja) más "1 hour and 30 minutes" (16 px burdeos).
  - Dos columnas de 301 px, "THE EXPERIENCE" y "WHAT'S INCLUDED", con texto de 16/20.8 (~39 caracteres por línea).

**Pin.** El `stage` se fija (`pin-spacer` de 900 px) desde scroll ≈ 3256 hasta ≈ 5006, unos **1750 px**.
- La tarjeta 2 sube desde +785 px hasta quedar 18 px por encima de la 1, en y ≈ 128 frente a 147.
- Luego la tarjeta 3 hace lo mismo con opacidad de 0 a 1.
- La tarjeta anterior se ve detrás **más pequeña, inclinada ~2–3° y agrisada** [I, por los cuadros 4242–6788 ms: el `transform` del `article` no cambió, así que la inclinación va en un hijo o en la propiedad `rotate`].

**Laterales.** Parallax opuesto: `translateY` de −110 a +71 el izquierdo y de +110 a −71 el derecho, a lo largo de todo el tramo.

---

## 6. Chi siamo `/en/chi-siamo`

- Hoja: `paginas/chi-siamo/hoja.jpg` (15 capturas).
- Medidas: `paginas/chi-siamo/medidas_secciones.json`. `scrollHeight`: 9286.

| # | Sección | Top / alto | Contenido |
|---|---|---|---|
| 0 | `page-hero` | 0 / 1669 | "ABOUT" más foto con "A TREASURE GUARDED SINCE 1968" |
| 1 | `page-intro` | 1669 / 596 | 2 párrafos de 32 px (4 y 3 líneas, ~70 caracteres por línea, 1145 px) |
| 2 | `about-pause` | 2266 / 2250 | **Pin** de 900 px con 4 frutas SVG gigantes (granada burdeos, pera verde, berenjena morada, mora azul marino) más la frase "IT'S NOT JUST A BRAND, BUT A PROMISE THAT HAS BEEN KEPT OVER TIME." (`ivymode`, naranja, 3 líneas centradas) |
| 3 | `page-intro.about-intro-2` | 4516 / 994 | pt de 403 px. Texto de 32 px, 11 líneas, 1138 px |
| 4 | `vision` | 5710 / 1168 | Foto a sangre (cielo y agricultor). "VISION" crema en `ivymode 370px` a todo el ancho, detrás de un recorte del agricultor (`vision__front`, 1674×1464, parallax). Subtítulo "Growing the future, starting from the earth." en 29,4/38.2 crema, 307 px, en x = 280 |
| 5 | `page-intro` | 6877 / 422 | Texto de 32 px, 4 líneas |
| 6 | `about-closing` | 7399 / 720 | Foto de 913×921 centrada (frascos) con parallax |
| 7 | Footer | 8319 / 967 | — |

**`about-pause`** (`otras-interacciones/hoja_about-pause.jpg` y `about-pause.mp4`) [M por cuadros]
1. La granada entra sola desde abajo y queda centrada a gran tamaño.
2. Las otras tres frutas salen de detrás de ella y se separan hacia las cuatro esquinas, con escala inicial de 0,5 y rotaciones.
3. En el centro aparece la frase con un fundido (`opacity 0` en reposo).
4. Al final la pera y la granada salen por arriba, y la berenjena y la mora quedan abajo mientras entra el siguiente texto.

**`vision`**: `otras-interacciones/hoja_vision.jpg`, `vision.mp4` y `vision.json` [M].
- La foto de fondo `vision__bg` scrollea 1:1.
- El recorte del agricultor `vision__front` se mueve **≈ 1,12–1,13 px por px de scroll**: en 2000 px de scroll se adelanta ~250 px al fondo. Por eso el agricultor "sube" por delante de "VISION".
- El H2 scrollea con la sección.
- La caja entra con esquinas superiores redondeadas, igual que Savoury.

---

## 7. Contactos `/en/contatti`

Página de 100vh sin scroll. Captura `paginas/contatti/s00.jpg`; medidas `paginas/contatti/medidas_secciones.json`.

**Izquierda.** `contatti__stage` de 603×900 con 11 frutas SVG apiladas (física [I]).
- Posicionadas con `transform` inline (`translate(...) rotate(...rad)`).
- **No reaccionan perceptiblemente al mouse ni al arrastre:** se movieron ≤ 6 px en total (`otras-interacciones/contatti-mouse.json`; antes y después: `contatti_0.jpg` y `contatti_1.jpg`).

**Derecha**, desde x = 730 (columna 7):
- "CONTACT": `ivymode 128px`, en y = 207.
- A ~60 px, el subtítulo `ivymode 32.4px/38.9px` burdeos, 446 px, 3 líneas, ~21 caracteres por línea.
- Tres columnas de 213 px en x = 730, 964 y 1197, separadas 21 px: etiqueta de 14 px 600 naranja más texto `16px/22.4`.
- Párrafo y email naranja en y ≈ 745–836.

---

## 8. Menú a pantalla completa [M]

- Abrir: `menu-hovers/hoja_menu-abrir.jpg`, `menu-abrir.mp4` y los cuadros `menu-abrir_*ms.jpg` (cada 80 ms).
- Cerrar: `hoja_menu-cerrar.jpg` y `menu-cerrar.mp4`.
- Estado abierto: `menu_abierto.png`.
- Hover: `hoja_menu_hover2.jpg`, `menu_hover_*` y `menu-hover.mp4`.
- Datos: `menu-abrir.json`, `menu-cerrar.json` y `menu-info.json`.

**Contenido**
- **Panel.** `#E94E1B` a pantalla completa.
- **4 ítems gigantes** en `ivymode 115.27px/115.27px`, mayúsculas, burdeos `#762530`, con **sangría en escalera**:

  | Ítem | Borde izquierdo (x) |
  |---|---|
  | HOME | 30 |
  | PANTRY | 334 |
  | PRODUCTION | 421 |
  | EXPERIENCE | 716 (termina alineado a la derecha) |

- **Filas.** Cada una mide 155 px (`padding 20px 0`), con un filete de 1 px de borde a borde.
- **Ítem activo.** Crema `#FDF3EB` con un **rombo crema** de 28×28 a la derecha del texto, centrado verticalmente.
- **Abajo a la izquierda,** en y = 826: "About", "Contacts" y "Shop ↗" en `ivystyle-sans 19.7px` 600 burdeos, separados ~50 px.
- **Header encima del panel.** El logo pasa a burdeos e IT/EN cambian de color. MENU pasa a **CLOSE** por el rodillo de letras, y el disco se vuelve crema con una × burdeos (fondo calculado `#FDF3EB`). En `menu_abierto.png` el puntero está sobre el botón, así que el disco sale con el relleno burdeos del hover.

**Apertura**
- El panel hace `translateY(-900 → 0)` entre los 100 y los ~1000 ms, con `transition: transform .9s cubic-bezier(.645,.045,.355,1)` (ease-in-out cúbico). Valores: −887 a 180 ms, −700 a 430, −305 a 597, −68 a 764 y −4 a 930.
- Los ítems se revelan por caracteres de abajo arriba (`data-text-reveal-delay="0.45"`), escalonados por ítem, de ~720 a 1300 ms.
- Los filetes se dibujan de izquierda a derecha al mismo tiempo.
- La página de debajo **no** se mueve.

**Cierre**
- Los caracteres bajan y salen por la máscara entre ~400 y 650 ms; el rombo se encoge.
- Los filetes se recogen hacia la izquierda entre ~800 y 1200 ms.
- El panel sube de 0 a −900 entre ~1,0 y 1,9 s.
- Total: ~1,9 s.

**Hover** sobre un ítem gigante: rodillo por carácter (0.6). Las líneas duplicadas suben 142,9 px con 18 ms de retraso por carácter y una duración de 0,35 s. No hay cambio de color.

**Clic en un ítem:** panel burdeos (0.5). Desde el menú naranja el burdeos sube por encima del naranja (`hoja_menu-navegar.jpg`).

---

## 9. 1920×1080: qué escala y qué queda fijo [M]

Datos: `escala-1920/escala.json`. Comparación lado a lado: `escala-1920/comparacion_1440_vs_1920.jpg`. Capturas completas: `paginas/home_1920/` y `paginas/dispensa_smeraldo_1920/`.

| Elemento | 1440×900 | 1920×1080 | Comportamiento |
|---|---|---|---|
| Header: alto, barra, márgenes de 30 | 97 / 37 / 30 | 97 / 37 / 30 | **Fijo en px** |
| Logo del header | 135×116 | 135×116 | Fijo |
| IT/EN, MENU, "Privacy & Cookies" y prompt (13 px) | — | Iguales | Fijos |
| Caja del frasco del home | 222×357 | 296×476 | **×1,333 = proporcional al ancho** (~15,4 vw) |
| Marquesina | 1502×724 | 2002×966 | ×1,333 (ancho) |
| Forma burdeos | 1152×492 | 1536×656 | 80 vw |
| Círculo de texto | 922 | 1229 | ×1,333 |
| Escala y rotación de los frascos (por posición) | 0,67 / 1,11 / 1,35 / 0,98 / 0,50 | 0,67 / 1,11 / 1,35 / 0,98 / 0,50 | **Idénticas**: la coreografía se normaliza al ancho. Se siguen viendo 5 frascos |
| Padding de la rejilla | 30 | 38,4 | max(30, 2 vw) [I] |
| Separación de la rejilla | 20,88 | 27,84 | 1,45 vw |
| H1 del producto | 176 px | 219,2 px | No es vw puro. Ajuste lineal ≈ `46.4px + 9vw` [I] |
| H2 de sección | 128,08 | 156,64 | ≈ `42.4px + 5.95vw` [I] |
| Caja del frasco del hero de producto | 380×611 | 461×741 | ×1,21: sigue al **alto** de la ventana (~68 vh) [I] |
| Texto de la intro de producto | 32 px, 1103 px de ancho | 32 px, 1103 px | **Fijo** (ancho máximo en px) |
| Cuerpo de 19,7 px | 19,736 | 20 | Fluido con tope de 20 px [I] |
| "Savoury" / "Made in…" | 32 px | 32 px | Fijo |
| Diapositiva de fotos | 878×629 | 1171×839 | 61 vw |
| Tarjeta de "other products" | 334×437 | 450×588 | Columnas ×1,35 |
| Logotipo del footer | 1030×340 | 1375×454 | Columnas 4–12 |

`scrollHeight` del producto: 4927 a 1440 y 5654 a 1920.

---

## 9b. Elementos por pantalla [M]

Conteos dentro del viewport en cada captura (`paginas/*/medidas.json`, `shots[].inView`, sin contar el footer). Formato: mínimo–máximo (mediana).

| Página | Titulares | Párrafos | Imágenes | Enlaces |
|---|---|---|---|---|
| Producto | 0–1 (1) | 0–8 (1) | 0–10 (6) | 0–9 (1) |
| Dispensa | 0–1 (1) | 0–2 (1) | 1–6 (2) | 0–10 (4) |
| Produzione | 0–2 (1) | 0–2 (1) | 0–9 (1) | 0–2 (2) |
| Experience | 0–3 (1) | 0–21 (7) | 1–4 (1) | 0–9 (0) |
| Chi siamo | 0–1 (0) | 0–2 (1) | 0–3 (1) | 0 |
| Contatti | 2 | 8 | 0 (las frutas son SVG) | 3 |

En Experience, los párrafos son las tarjetas.

Lectura [I]: casi siempre hay **una idea por pantalla**: un titular o un párrafo grande, más una imagen.

## 10. Rendimiento [M]

Fuente: `paginas/*/medidas.json` (CDP `encodedDataLength`). Incluye **todo lo cargado durante el recorrido completo con scroll**: el lazy-load de imágenes y los payloads de Nuxt de las rutas precargadas.

| Página | KB transferidos | Peticiones | FCP (ms) | DCL / load (ms) | Desglose (KB) |
|---|---|---|---|---|---|
| Home `/en` | 1370 | 69 | 584 | 1860 / 1860 | Imágenes 685, JS 537, fuentes 73 |
| Home a 1920 | 1373 | 69 | 496 | 652 / 1128 | Igual que a 1440: no sirve imágenes más grandes |
| `/en/dispensa` | 1439 | 103 | 1548* | 1870 / 2382 | Imágenes 472, JS 577, fetch 236 |
| Producto smeraldo | 1171 | 93 | 672 | 801 / 1395 | Imágenes 272, JS 581, fetch 166 |
| Producto mennulata | 1292 | 93 | 604 | — | — |
| Producto pestorosso | 1181 | 92 | 3120* | — | — |
| `/en/produzione` | 1085 | 80 | 500 | 676 / 1294 | — |
| `/en/experience` | 882 | 69 | 828 | — | — |
| `/en/chi-siamo` | 870 | 76 | 548 | — | — |
| `/en/contatti` | 568 | 40 | 528 | 726 / 1242 | — |

\* Valores con la red ocupada por otras capturas en paralelo; tómalos como peores casos.

- **Preloader:** sí, en cada carga dura (1.1). El contenido real aparece a ~4,3 s, cuando el panel naranja sale. **El primer frasco del home aparece a 5,4 s** desde la navegación en la corrida limpia. Es el cuello de botella percibido, no la red: el `load` llega a 1,3 s.
- **Imágenes.** Prismic, en `webp` con `auto=format,compress`. Las bases de frasco del home se piden con `w=400`.
- **Stack** [M, por globales]: Nuxt, GSAP (`gsapVersions`), Lenis (`lenisVersion`), `__THREE__` presente, GTM/GA4 y Cloudflare RUM.

---

## 11. Detalles finos que un clon descuidado se perdería

1. **La marquesina va rotada 10°** y los frascos bajan en diagonal. Las escalas no son simétricas por posición: 0,67 / 1,11 / 1,35 / 0,98 / 0,50. Las rotaciones alternan ±16–18° según el frasco, no según el lado.
2. **Inercia del home:** lerp de ~0,0375 por cuadro (τ ≈ 440 ms), ganancia de 1,16 px por unidad de delta, **sin snap y sin autoplay**. La rueda horizontal también funciona. Sobre el logo la rueda no hace nada.
3. **El círculo "WE GROW…" no gira solo:** gira ~1,19° por cada 100 px de slider y hereda su inercia.
4. **El parallax del mouse es mínimo** (≤ 10 px) y con suavizado de ~1 s. Exagerarlo lo abarata.
5. **Hover sobre un frasco: el frasco NO crece.** Todo el feedback está en la píldora del cursor: escala de 0,4 a 1 y opacidad de 0 a 1 en ~400 ms, con retardo de seguimiento y desplazada (+18, −16). Lleva un rombo de 4 px antes del texto.
6. **El preloader se ve en cada carga dura,** incluida la recarga, pero **nunca** en la navegación interna. Contador con una curva de tiempo fija de ~2 s. Las frutas caen y se apilan. El barrido naranja **sube** y luego **sale por arriba**. El logo crece desde un punto y los frascos entran ~1 s después que el resto.
7. **Hay tres transiciones distintas** (0.5): el loader, el panel burdeos de ~2 s que sube, cubre y sigue subiendo, y el **clon `.jar-flight`** del frasco en home → producto. El clon vuela al rectángulo exacto del frasco del hero y se intercambia con él a ~2,1 s. Usar el panel en home → producto sería un error.
8. **El frasco del hero de producto** empieza recortado por abajo a escala 1,25 y, en solo **376 px** de scroll, sube 216 px, baja a 0,8 y gira 20°. Termina **centrado encima del H1**, que mientras tanto queda casi fijo (solo baja 44 px). Por eso la intro lleva 335 px de padding superior.
9. **El revelado de texto es por máscara, sin fundido:** desplazamiento del ~112 % del interlineado, ~450 ms tipo expo-out y 33–83 ms entre líneas. Los títulos van por carácter y los párrafos por línea.
10. **Rodillo de letras** en MENU (14 px, 18 ms entre letras, 0,35 s) y en los ítems del menú (142,9 px, 18 ms). La palabra existe duplicada en el DOM, así que un lector de texto lee "MMEENNUU"; conviene un `aria-label`.
11. **Ítems del menú en escalera** (x 30 / 334 / 421 / 716), con filetes de 1 px a todo el ancho que se dibujan y se recogen. El activo va en crema con un rombo de 28 px. El cierre es más lento que la apertura porque primero salen las letras.
12. **El header tiene cuatro estados:** completo, compacto con solo el wordmark, oculto al bajar (−137 px) y de vuelta al subir. **No tiene fondo.** Cambia de burdeos a crema según el fondo que tenga debajo (foto, Savoury, footer). El logo (116 px de alto) cuelga 79 px por debajo de la barra de 37 px.
13. **Hero de página con foto en "tarjeta":** `clip-path inset(0 40px round 15px)` se abre a sangre en los primeros ~150 px de scroll. Encima hay un parallax de ±150 px de la imagen interior y un velo burdeos al 20 %.
14. **Slider de fotos:** diapositivas a 61 vw centradas, 40 px de separación, radio de 15 y bucle infinito. La imagen interior tiene parallax de 0,17. Las flechas del teclado avanzan exactamente una diapositiva y el arrastre no hace snap. La rueda **no** lo mueve.
15. **Hover de tarjeta de producto:** la tarjeta se **achica** (0,96) e inclina 2°, mientras el frasco **crece** (1,10) e inclina 4°. El fondo cambia al color propio del producto y aparece una decoración SVG con su fruta. Los tiempos son distintos: fondo 0,6 s, decoración 0,4 s y frasco 1 s, con `cubic-bezier(.22,1,.36,1)`.
16. **Píldora de navegación inferior:** blanco al 80 % con desenfoque de 5 px y una sombra burdeos de 100 px muy difusa. El indicador naranja se desliza. Solo aparece al pasar el hero y lleva al ancla con scroll suave de ~1 s.
17. **Tarjetas de Experience:** pin de ~1750 px; la anterior se queda detrás inclinada y agrisada. Los rótulos laterales tienen parallax opuesto (±110 px).
18. **Footer:** el logotipo gigante **no** se anima; solo las líneas de texto. La página actual va en naranja en la lista del footer.
19. **Foco por teclado:** `outline 2px #762530` con `offset 3px`, que rota con el frasco. Los frascos fuera de pantalla reciben foco sin traerse a la vista; un clon accesible debería corregirlo, no copiarlo.
20. **Qué escala a 1920:** el header, los controles y los textos de 32 px quedan fijos en px. El slider del home escala al ancho con la coreografía idéntica. El frasco del hero escala al alto. Los titulares crecen con una fórmula `px + vw`, no con vw puro.
21. **El color de "SCROLL TO DISCOVER" es crema,** no burdeos, porque se apoya sobre la forma burdeos. Es el único texto con interletrado (0,1 em).
22. **Contactos:** las frutas apiladas son decorativas y estáticas una vez asentadas. No tiene sentido añadirles interacción con el mouse para "igualar".

---

### Índice de archivos

**Hojas de contacto por página**
- `paginas/<pagina>/hoja.jpg`: capturas `s00..sNN` cada 600 px.
- Capturas por sección en reposo: `paginas/<pagina>/seccion_NN.jpg`.
- Video del recorrido de scroll: `paginas/<pagina>/video_scroll.webm`.

**Carga**
- `carga/hoja_carga_home.jpg` y `carga/hoja_carga_producto.jpg`.
- Cuadros: `carga/{home,producto}/f_*.jpg`.
- Tiempos: `carga/*/timeline.json`.

**Home**
- `home-interacciones/clips/01..07-*.mp4`.
- Cuadros en `home-interacciones/{arrastre,clic,hover,rueda-lenta,rueda-rapida}/`.
- Datos en `*.json`.
- `home-interacciones/_descartado_corrida1/` guarda la primera corrida: la rueda estaba sobre el logo y el clic sobre un frasco lateral. No usar.

**Producto:** `producto-interacciones/` (videos `.mp4`, cuadros `*_NNNNNms.jpg` y datos `.json`).

**Menú y hovers:** `menu-hovers/`.

**Otras páginas:** `otras-interacciones/` (hero de dispensa, Savoury, tarjetas de Experience, about-pause, vision, contactos y la prueba de rueda sobre el logo).

**1920:** `escala-1920/`.

**Scripts de captura** (para repetir): `../../scripts/*.cjs`, junto a la carpeta `agrumea/`.
