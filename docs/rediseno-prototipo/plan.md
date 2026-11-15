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
  - En el preview, Bucaramanga salía 12 px más alto. `fitTitles` medía cuando la fuente figuraba como cargada pero el navegador aún pintaba la de respaldo. Creía que el titular cabía, le quitaba el ajuste y nadie volvía a medir; con reducir movimiento se veía siempre. `site.js` tiene el mismo fallo latente; en el prototipo no se nota porque las fuentes cargan al instante desde el disco. Arreglo: se mide en el DOM, no en un lienzo, y se vuelve a medir tras dos cuadros y a los 500 ms de cada `load`, `fonts.ready` y `loadingdone`. Verificado con fuentes demoradas 2,5 s y con 40 y 150 ms de latencia.
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
