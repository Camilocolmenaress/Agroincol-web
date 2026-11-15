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

1. **Dos layouts raíz** con grupos de rutas: `app/(sitio)` y `app/(landings)`.
   - `(sitio)` carga solo el CSS y las fuentes del prototipo.
   - `(landings)` lleva el layout raíz actual, sin cambios, para `/lp`, `/ecogel`, `/tienda` y `/resena`.
   - El código de las landings no cambia: solo se mueve de carpeta. Así Tailwind (preflight) no altera el prototipo y el CSS del prototipo no toca las landings.
   - Navegar entre los dos grupos hace una carga completa de página: es el aislamiento que se busca.
   - Verificación: las landings con 0 píxeles distintos frente a producción.
2. **CSS.** `site.css` se usa tal cual en `(sitio)`. Las fuentes WOFF2 de `_rediseno/site/fonts` se sirven con `next/font/local`, no en base64.
3. **Marcado.** Componentes de servidor que producen el mismo HTML que las funciones del generador, con las mismas clases y la misma estructura: `hero_fall`, `hero_title`, `tabla`, `chips`, `faq`, `galeria`, `cards`, `rows`, `cta`, `cotizar`, `guia`, `colados_block`, cabecera, menú y pie.
   - Los datos salen de `content/rediseno/datos.json`.
   - Los bloques largos de texto actual (guía, artículos y páginas legales) salen del HTML extraído, con los enlaces del prototipo (`servicio-x.html`) reescritos a las URL finales.
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
