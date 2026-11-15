# Migración del prototipo aprobado (`_rediseno/`) a Next.js

Rama `rediseno-prototipo`, creada desde `main` (producción) el 14-nov-2026. Solo se publica en previews de Vercel; nada va a producción sin aprobación de Camilo. La rama `rediseno-recorrido` queda archivada, sin merge.

**Referencia exacta:** `_rediseno/site`, 33 páginas, con sus textos, diseño y animaciones (`js/site.js`, `js/tools.js`). Las decisiones cerradas están en `_rediseno/README.md` §6 y no se vuelven a preguntar.

## Fase 0: preparación (hecha el 14-nov)

**Paquete en el repositorio**
- Va en `_rediseno/`. Los renders 3D fuente (23 MB) quedan fuera de git.

**Recorrido del prototipo**
- 33 páginas, en 1440, 834 y 390 px: 0 errores de consola o de red.
- `form[data-lead-form]` está en el inicio, los 9 servicios, las 4 zonas, precios, certificado y normativa (20 páginas).
- La guía completa está en el inicio, los 9 servicios, las 4 zonas y precios.

**Datos y HTML extraídos** (`scripts/rediseno/extraer-prototipo.py`)
- `content/rediseno/datos.json`: servicios, zonas, herramientas, blog, carrusel, ilustraciones, menú y 46 preguntas frecuentes.
- `content/rediseno/paginas.json`: por página, la ruta final (mapa del README §5), el title, la description y el HTML de `<main>`.
- El HTML extraído es idéntico al de las 33 páginas del prototipo (verificado).

**Líneas base de producción** (`docs/rediseno-prototipo/`)
- SEO: `seo-baseline-produccion.json`, con 39 URL actuales.
- Capturas de las landings y del sitio: `capturas/produccion/`, ignorado en git.
- Lighthouse en celular, mediana de 3 corridas, en vivo con GTM:

  | Página | Rendimiento | LCP |
  |---|---|---|
  | `/` | 77 | 4,38 s |
  | Residencial | 76 | 4,59 s |
  | Zona Bucaramanga | 69 | 6,3 s |
  | Blog (cucarachas) | 65 | 6,83 s |
  | `/precios` | 74 | 4,67 s |

**Title y description.** En 19 páginas los del prototipo no coinciden con los de producción. El README §5 dice que se usan los actuales:
- Las páginas existentes toman su title y su description de `seo-baseline-produccion.json`.
- Las 4 páginas nuevas (`/empresas`, `/herramientas`, `/herramientas/plaga` y `/herramientas/checklist`) usan los del prototipo.

## Arquitectura

1. **Dos layouts raíz** con grupos de rutas: `app/(sitio)` y `app/(actual)`.
   - `(sitio)` carga solo el CSS y las fuentes del prototipo.
   - `(actual)` lleva el layout raíz actual, sin cambios, para `/lp`, `/ecogel`, `/tienda` y `/resena`.
   - El código de las landings no cambia: solo se mueve de carpeta. Así Tailwind (preflight) no altera el prototipo y el CSS del prototipo no toca las landings.
   - Navegar entre los dos grupos hace una carga completa de página: es el aislamiento que se busca.
   - Verificación: las landings con 0 píxeles distintos frente a producción.
2. **CSS.** `site.css` se usa tal cual en `(sitio)`. Las fuentes WOFF2 de `_rediseno/site/fonts` se sirven con `next/font/local`, no en base64.
3. **Marcado.** El `<main>` de cada página y la cabecera, el menú y el pie son el HTML que produce el generador del prototipo (`site_build.py`), extraído por `scripts/rediseno/extraer-prototipo.py` a `content/rediseno/`.
   - Se inyecta tal cual (`components/rediseno/Pagina.tsx`): mismas clases, misma estructura y mismo texto. React no administra esos nodos, así que el motor de `site.js` los manipula sin chocar con React.
   - `lib/rediseno/contenido.ts` solo cambia rutas (`servicio-x.html` → URL final) e imágenes (optimizador de Next con `srcset` y `sizes`).
   - El artículo "Vi una cucaracha" usa el texto completo publicado hoy, con el diseño del prototipo (README §6.4).
4. **Movimiento.**
   - `site.js` y `tools.js` se pasan a módulos que se montan en cada cambio de ruta (limpian y vuelven a crear ScrollTrigger, Lenis y los listeners), como pide el README §4.
   - GSAP, ScrollTrigger y Lenis salen de npm, en las mismas versiones del prototipo.
   - El velo verde se queda entre páginas y no hay intro de pantalla completa.
   - `prefers-reduced-motion`: igual que en el prototipo.
5. **Formulario.** `form[data-lead-form]` envía a `/api/contact` con los mismos nombres de campo (`nombre`, `telefono`, `tipoServicio`, `website` y `aceptaTerminos`).
   - Lleva `formId` por página y la ruta, y el servicio preseleccionado en cada servicio.
   - Mantiene el mismo `dataLayer` y la misma medición del formulario actual: Sheets, correo, conversiones, GTM y PostHog.
6. **Imágenes.** `next/image` (AVIF y WebP, con `sizes`, y `priority` solo en el hero) para los objetos 3D en WebP y las ilustraciones. No se cargan modelos 3D.
7. **SEO técnico.**
   - Metadatos por página.
   - Schema: LocalBusiness (global), Service, FAQPage (donde hay preguntas visibles) y BreadcrumbList.
   - `sitemap.ts` con las 4 URL nuevas; `robots`.
   - En los H1 del prototipo faltan los espacios entre líneas: en Next van con espacio.
   - Alivio no se incluye en el sitio (README §6.6). La zona `/alivio` de `next.config` no se toca.

## Fases (cada una termina con enlace del preview y espera aprobación)

| Fase | Contenido | Se verifica con |
|---|---|---|
| 1. Base | Grupos de rutas y layouts. CSS y fuentes. Cabecera, menú, pie, velo y cursor. Motor de `site.js` por ruta. Formulario conectado. Una página simple de punta a punta (`/politica-de-privacidad`). | Landings con 0 píxeles distintos. Formulario contra `/api/contact` (sin enviar leads reales sin permiso). Consola. |
| 2. Inicio | Carrusel del hero sobre el aro, segmentos, Los Colados, galería, reseñas, guía completa, preguntas, formulario y pie. | Comparación de texto y estructura de `<main>` contra el prototipo. Comparación de píxeles en 1440, 834 y 390. Animaciones en video. |
| 3. Servicios | `/servicios`, los 9 servicios y `/empresas`. | Igual que la fase 2, más el servicio preseleccionado en el formulario. |
| 4. Zonas, herramientas y precios | `/zonas` y sus 4 municipios. `/herramientas` y las 3 herramientas (`tools.js`, que termina en WhatsApp). `/precios`. | Igual que la fase 2, más las herramientas probadas a mano. |
| 5. Blog y legales | `/blog`, 7 artículos, certificado, normativa y privacidad. | Igual que la fase 2. |
| 6. Cierre | Schema, sitemap y robots. SEO contra producción con la lista de cambios. Accesibilidad (teclado, sin JS, reducir movimiento). Safari (WebKit). Lighthouse frente a la línea base. Medición intacta. | Preview final para aprobación. El merge a `main` solo con aprobación. |

## Resultados de la migración (14-nov)

Las fases 1 a 6 se hicieron de corrido (instrucción de Camilo). Todo está en la rama `rediseno-prototipo`; nada en `main`.

- **Igual al prototipo.** `scripts/rediseno/comparar-prototipo.cjs` compara las 33 páginas en 1440, 834 y 390 contra `docs/rediseno-prototipo/referencia` (el prototipo con el artículo completo).
  - Estructura de `<main>` (títulos, enlaces, alt, formularios y texto): igual en las 99 capturas. La excepción es el inicio en 390 px con reducir movimiento: el prototipo muestra "Industria" bajo la tira y Next "Hogar", que es el objeto en que está la tira. Una vez, en local, Next también mostró "Industria". Solo afecta ese rótulo y solo con reducir movimiento.
  - Píxeles en local: 0 % a 0,5 % en casi todo; lo que queda es la recompresión de las imágenes por el optimizador (q75).
  - Las portadas `.frame` (zonas) pedían una imagen de 640 px en celular y se veían borrosas; corregido con `sizes`. /zonas en 390 pasó de 3,75 % a 0,59 % en el preview.
  - En el preview, Bucaramanga salía 12 px más alto: el titular quedaba sin ajustar (187 px en vez de 173). `fitTitles` de `site.js` limpia el tamaño, lee el tamaño base y mide en un lienzo. En la red, esa lectura justo después de limpiar a veces devolvía el tamaño anterior, y el lienzo podía medir con la fuente de respaldo. En el prototipo no se nota porque, abierto desde el disco, todo carga al instante. Arreglo, con la misma regla: una copia oculta del titular, sin estilo en línea, da el tamaño base y mide cada palabra con la fuente pintada; se vuelve a medir con `load`, `fonts.ready` y `loadingdone`. Verificado con fuentes demoradas, con latencia y con 12 cargas en 390 y 1440 en el preview, con la barra de Vercel y sin ella: 0 fallas.
- **Funcionamiento.** `scripts/rediseno/probar-funcionamiento.cjs`: 34/34 en Chrome y 34/34 en WebKit (Safari).
  - Hero fijado y con acomodo, tira en celular con mano de arrastre, carruseles, menú, velo entre páginas, guía, herramientas, 404, reducir movimiento, sin JavaScript, teclado y consola sin errores.
  - Formulario contra `/api/contact` interceptado (no se enviaron leads): mismos campos, `formId` de antes, servicio preseleccionado, evento `form_submission`, validación y mensaje de error si la API falla.
- **Landings.** `/lp/*`, `/tienda/*`, `/ecogel/terminos` y `/resena`: 0 píxeles distintos frente a `main` local en 1440 y 390, y la misma `<head>` (GTM, schema, metadatos). En git son movimientos al 100 %.
- **Formulario contra el `/api/contact` real** (servidor aislado, sin hoja, webhook ni CAPI): el payload exacto responde 200 y sin servicio responde 400. Los valores de servicio son los mismos 7 de producción. El formulario anterior tenía además correo y dirección opcionales; el prototipo no los tiene y la hoja tampoco los guarda.
- **Medición:** GTM, Vercel Analytics, Speed Insights y `CTAClickTracker` se montan igual que antes. `whatsapp_click` y `phone_click` salen en el marcado nuevo con el número vigente, y `form_submission` también. El Pixel y PostHog solo existían en las landings y siguen allí. Se pierde `click_resena`, porque el prototipo no tiene el botón "Dejar una reseña".
- **SEO frente a producción** (`node scripts/seo-baseline.mjs --compare`):
  - title, description, canonical, hreflang, robots, Open Graph y JSON-LD iguales, salvo FAQPage.
  - FAQPage se arma con las preguntas visibles. En servicios y zonas producción tiene 5 o 6 y el prototipo muestra 3.
  - Cambian los encabezados, los enlaces y las imágenes (es el rediseño) y baja el conteo de palabras (ver abajo).
- **Texto que no está en el prototipo** (detalle en `seo-diferencias.md`). Pendiente de decisión de Camilo; no se agregó nada porque la regla es no cambiar los textos.
  - **Calculadora:** pasa de 685 a 188 palabras. Pierde sus tres secciones: "¿Cada cuánto se debe fumigar en Colombia?", "Factores…" y "¿Qué pasa si no fumigo a tiempo?".
  - **Servicios:** entre 12 % y 32 % menos palabras. Las preguntas frecuentes bajan de 5 o 6 a 3.
  - **Zonas:** Bucaramanga, Floridablanca y Girón bajan entre 17 % y 18 %; Piedecuesta baja 39 % y sus preguntas pasan de 6 a 1.
  - **Artículos:** bajan alrededor de 10 % (la caja "¿Necesita control de plagas?" y el bloque "Sobre AGROINCOL").
  - Parte de lo que se pierde está mal en producción: 6 servicios repiten "Nuestro proceso de fumigación para restaurantes" y "Plagas comunes en restaurantes".
  - `texto-faltante.md` compara frase por frase y exagera la pérdida, porque cuenta formularios y migas; sirve para buscar una frase, no para medir.
  - No hay cifras de precios de servicios en el prototipo. Las únicas cifras son multas del INVIMA y ejemplos.
- **Lighthouse local**, móvil, mediana de 3, en las mismas condiciones (sin GTM):

  | Página | `main`: rendimiento / LCP | Rama: rendimiento / LCP |
  |---|---|---|
  | Inicio | 92 / 3,36 s | 89 / 3,68 s |
  | Residencial | 89 / 3,66 s | 90 / 3,60 s |
  | Blog | 91 / 3,31 s | 96 / 2,71 s |
  | Bucaramanga | 89 / 3,66 s | 93 / 3,16 s |

  El CLS del inicio (0,056) viene de la tira del hero en celular, que se centra un cuadro después de cargar; es el mismo código del prototipo.
- **Observación heredada del prototipo.** Si el teléfono es inválido y el usuario marca la casilla de autorización, el mensaje de error del teléfono aparece al perder el foco y empuja la casilla. Ese clic se pierde. No se cambió porque el prototipo hace lo mismo.

## Segunda ronda (15-nov), con las decisiones de Camilo

1. **Texto recuperado.**
   - Las preguntas frecuentes de producción van completas en el acordeón: 5 o 6 por servicio, 6 en Bucaramanga y 6 en Piedecuesta.
   - El resto va en la "Guía completa", armada con el texto publicado hoy: servicios, zonas (incluida "Servicios de Fumigación en <municipio>"), inicio, precios, la calculadora (guía nueva) y /zonas (guía nueva).
   - Se eliminó el texto de restaurantes repetido en 6 servicios.
   - Se hace en `scripts/rediseno/extraer-prototipo.py`, con las funciones del prototipo (`guia`, `faq_raw`, `_clean`); `_rediseno` no cambia.
   - Lo que no se recupera, a propósito: llamados a cotizar, formularios, reseñas de producción, tarjetas de navegación, Alivio (§6.6) y la caja "Sobre AGROINCOL" de los artículos.
   - Detalle en `texto-faltante.md` (elemento por elemento) y `seo-diferencias.md`.
2. **Reseña.** "Dejar una reseña en Google" en "Lo que dicen" (inicio), con el evento `click_resena` (`destino: google_review`), el mismo del botón anterior.
3. **Formulario.** Sin correo ni dirección.
4. **Casilla.** Los mensajes de error tienen su espacio reservado: el formulario es unos 97 px más alto y nada se mueve al validar.
5. **Tira del hero en celular.** Empieza en "Hogar"; el rótulo se recalcula cuando ya hay fuentes e imágenes.
6. **Rendimiento del inicio**, sin cambiar el diseño:
   - imágenes de la tercera sección en adelante diferidas;
   - el carrusel carga 2 objetos de entrada y el resto al terminar la carga;
   - la tira de celular se arma desde el primer pintado (CLS de 0,056 a 0);
   - el lema del aro se pinta con la League Spartan del sitio (antes salía con la de respaldo).
7. **`docs/rediseno` borrado.**

**Verificación de la segunda ronda (15-nov):**
- **Comparación con el prototipo** (las 99 capturas, referencia con el texto recuperado): todo igual.
  - Las únicas diferencias son el formulario, unos 97 px más alto en 17 páginas (punto 4), y el rótulo "Hogar" en el inicio a 390 px (punto 5).
- **Funcionamiento:** 41/41 en Chrome y en WebKit, en local y en el preview. En el preview, WebKit solo marca el `manifest.json` bloqueado por la protección.
- **Lighthouse móvil del inicio:**
  - build de producción local: 92 a 94, sin GTM;
  - preview con LCP: 97 a 100;
  - cerca de la mitad de las corridas en el preview protegido no tienen LCP: la página queda en blanco unos 2,5 s. El sitio actual muestra el mismo blanco en ese entorno, y nunca pasó en local en unas 25 corridas;
  - la medición que vale es PageSpeed en agroincol.com después del merge;
  - GTM (Clarity, Ads, Bing, GA) suma entre 250 y 460 ms de TBT en producción.
- **`fitTitles`:** se corrigieron dos fallos.
  - Medir en el DOM retrasaba el primer pintado. Ahora mide por lotes y con lienzo.
  - Con reducir movimiento, la transición de .01 ms del prototipo hacía leer el tamaño viejo.
- **Motor:** si su descarga falla, se reintenta.

**Enlaces internos (15-nov, por pregunta de Camilo sobre SEO).**
- Al recuperar el texto, los párrafos venían sin sus enlaces: faltaban unos 60 de los 195 enlaces internos que tiene producción dentro de `<main>`.
- Ahora el texto llega de producción con sus enlaces marcados (⟦/ruta|texto⟧). Las marcas pasan por las funciones del prototipo y al final vuelven a ser `<a data-transition>`. Aplica a la guía, a las preguntas (respuestas, introducción y cierre), a los artículos, al certificado y a la normativa.
- Los artículos, el certificado y la normativa quedan con el texto publicado hoy.
- `scripts/rediseno/enlaces-faltantes.py` mide lo que falta: 22 de 195, todos esperados.
  - La privacidad en los artículos venía del formulario y el pie la enlaza desde todo el sitio.
  - `/alivio` queda fuera (§6.6).
  - Las tarjetas de navegación (zonas en el inicio; blog, normativa, calculadora y un artículo en las zonas) no vuelven como tarjetas. Su texto sí volvió, y el pie del prototipo enlaza zonas, blog y normativa desde todas las páginas.
- Los enlaces en las preguntas usan el mismo estilo que `.article a`.

## Fix celular (15-nov, en producción)

Referencia: `_rediseno/fix-celular-agroincol/` (site.css y site.js de Camilo).

1. **Figuras 3D sin optimizador.** La recompresión a AVIF ensuciaba el alfa: 49,5 % de píxeles transparentes contra 51,3 % del original, y más casi transparentes. El drop-shadow lo volvía un cuadro en el iPhone.
   - Ahora salen directas: el original de 900 px y copias estáticas de 300, 450 y 600 px con el alfa sin pérdida (0 píxeles de alfa distintos), generadas con `scripts/rediseno/figuras.sh`.
   - El drop-shadow se mantiene.
2. **Carruseles en pantallas táctiles** ("Así trabajamos" y "Otros servicios"): scroll horizontal nativo con imán, con la lógica `is-native` de site.js y las reglas `.is-native` de site.css. En escritorio sigue el arrastre con mouse.
3. **Imágenes dentro de los carruseles sin `loading="lazy"`**, porque Safari no las cargaba.
4. **Va en el mismo despliegue:** la mano del hero arranca 1,4 s después del primer pintado. Así PageSpeed ya no queda sin LCP.

Pruebas:
- `scripts/rediseno/probar-celular.cjs` (iPhone 13 en WebKit y Pixel 7 en Chrome): todo OK.
- `probar-funcionamiento`: 41/41 en Chrome y WebKit.
- Lighthouse local del inicio: 90–91. Era 86 con los originales de 900 px.

`extraer-prototipo.py` ahora se niega a correr contra producción, porque se leería a sí mismo.
