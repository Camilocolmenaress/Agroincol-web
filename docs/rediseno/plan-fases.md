# Rediseño "recorrido": plan por fases

Rama: `rediseno-recorrido` · Fecha: 13-nov-2026 · Estado: **Fase 0 aprobada (13-nov). Fase 1 y piloto 3D en curso.**

## Fase 0: lo que ya quedó

| Entregable | Dónde | Estado |
|---|---|---|
| Hojas de referencia de Agrumea (7) | `docs/rediseno/referencia-agrumea/` | Copiadas. La grabación de 173 MB no va al repo. |
| Script de línea base | `scripts/seo-baseline.mjs` | Hecho. Se corre contra `next build && next start` y lee el HTML del servidor con `fetch`, sin navegador. Por eso también prueba que el contenido no dependa de JS. |
| Línea base | `docs/rediseno/seo-baseline.json` | 39 URLs: las 29 del sitemap, `/resena` y las 9 landings de pauta. Estas últimas están como guarda: cualquier diferencia ahí es una regresión, y `/ecogel*` debe seguir respondiendo 307. Autocomparación: **0 diferencias**. Prueba de sensibilidad: al alterar un H2, un alt, un JSON-LD y un conteo de palabras, detectó los 4 y salió con error. |
| Lighthouse móvil | `docs/rediseno/lighthouse/fase-0-{local,prod}/` | Mediana de 3 corridas. Ver la tabla abajo. |
| Dependencia | `htmlparser2` 8.0.2 en devDependencies | Ya estaba instalada como dependencia transitiva. Solo se declaró. |

Comparar en cada fase:
1. `npm run build && npx next start -p 3200`.
2. En otra terminal, `node scripts/seo-baseline.mjs --compare`. Con `--solo-main` se ignoran la cabecera y el pie.

Los cambios aprobados están en `docs/rediseno/seo-cambios-aprobados.json`. Cualquier otra diferencia cuenta.

**Corrección del 13-nov.** En el puerto 3100 ya corría un `next dev` que no es de esta sesión, así que la primera medición fue contra el servidor de desarrollo.

- La línea base se regeneró desde un build de producción de `main`, en un worktree en el puerto 3201. Salió idéntica a la de desarrollo: 0 diferencias en las 39 URLs.
- El Lighthouse local de la Fase 0 se repitió en producción. Las cifras locales de la primera versión de este documento no valen.
- Las cifras de producción (agroincol.com) sí son válidas.

### Lighthouse antes (celular)

Mediana de 3 corridas. El preset de Lighthouse simula 4G lento.

| URL | Rendimiento local | Rendimiento prod | LCP local | **LCP prod** | TBT prod | CLS |
|---|---|---|---|---|---|---|
| `/` | 80 | 63 | 5,2 s | **9,9 s** | 352 ms | 0 |
| `/servicios/fumigacion-residencial` | 88 | 77 | 3,7 s | **4,6 s** | 263 ms | 0 |
| `/blog/como-eliminar-cucarachas-bucaramanga` | 99 | 73 | 2,1 s | **5,5 s** | 235 ms | 0 |
| `/zonas/fumigacion-bucaramanga` | 80 | 63 | 5,1 s | **10,6 s** | 320 ms | 0 |

**Hoy ninguna página cumple el presupuesto de LCP < 2,5 s.** La causa no son imágenes pesadas:

- **El elemento LCP en celular es el logo PNG de la cabecera, no el H1.**
  - El H1 arranca en `opacity: 0` (`.animate-rise`) y por eso Lighthouse no lo cuenta como candidato.
  - El logo tarda en pintarse. El 74 % del LCP (7,4 s) es *render delay*: el hilo principal está ocupado.
- **GTM descarga 502 KB y bloquea 248 ms.** Es lo más pesado de la página. En local no carga, y por eso local sale mucho mejor que producción.

Para el rediseño:

- Un H1 visible desde el primer pintado, más el logo SVG en línea, deberían bajar el LCP por sí solos.
- **GTM está fuera de alcance**, pero es la palanca más grande que queda. Revisar sus etiquetas es una tarea aparte que le propongo.

## Hallazgos del código que cambian el plan

1. **Las landings de pauta comparten los tokens y las fuentes del sitio.**
   - Hay unos 840 usos de `brand-*` en `/lp`, `/ecogel`, `/tienda` y sus componentes.
   - `/lp` y `/ecogel` toman Nunito y League Spartan del layout raíz.
   - Si cambio `brand.*` o `--font-body`, se rediseñan sin querer las landings, que están fuera de alcance.
   - El diff de SEO no lo detectaría, porque el cambio es visual.
2. **El H1 actual ya anima su opacidad** (`.animate-rise` arranca en `opacity: 0`). Eso viola la regla 3.3 hoy mismo. El rediseño lo corrige.
3. **El home ya tiene el H2 "¿Qué necesita proteger?".** El titular gigante de la sección 3 puede ser ese mismo H2 en mayúsculas por CSS, sin texto nuevo.
4. **Hay H3 duplicados en el HTML.** `AudienceSelector` y `ServicesGrid` pintan dos veces las mismas tarjetas, una para celular y otra para escritorio: son 12 H3 repetidos en el home.
5. **El texto para la tabla Frecuencia/Garantía casi no existe.**
   - "Garantía" aparece solo en `/servicios/desratizacion` y en el paso "Certificado y garantía" del home.
   - "Frecuencia" aparece en el cuerpo de residencial, comercial y restaurantes. En otras dos páginas solo está dentro de una FAQ ("¿Cada cuánto…?").
   - En 8 de las 9 páginas, la columna "Garantía" sería texto nuevo y además una promesa comercial.
6. **Los H1 de servicio son largos.** Por ejemplo, "Fumigación Industrial y Control de Plagas para Empresas en Bucaramanga" tiene 10 palabras.
7. **El JSON-LD global apunta a `/og-image.jpg`, que no existe** (404). No toco el JSON-LD. Se arregla subiendo un archivo a esa ruta.
8. **Íconos rojos de riesgo:** están en `/servicios/fumigacion-restaurantes`, líneas 134 y 135 (`bg-red-50` / `text-red-500`).
9. **Lenguaje alarmista:** "riesgo", "infestación" y "exterminio" aparecen en el texto indexable de unas 20 páginas. El texto está congelado, así que el rediseño no lo puede quitar.

## Decisiones de arquitectura (propuestas)

- **A1. Separar el sitio de las landings sin mover archivos** (ver D0):
  - Se extiende el patrón de `SiteChrome`, que ya decide por ruta en el servidor con `usePathname`.
  - Un contenedor envuelve el `<body>` con `data-marca="v2"` en el sitio y `"v1"` en `/lp`, `/ecogel` y `/tienda`.
  - Las fuentes y los colores nuevos cuelgan de `[data-marca=v2]`.
  - Los portales (menú y cursor) se montan dentro de ese contenedor, no en `body`.
  - Con esto `<main>` sigue donde está, así que la línea base sigue etiquetando bien cabecera, main y pie.
- **A2. Tokens nuevos en un espacio aparte:** `marca.verde` #164A38, `marca.naranja` #F5682E, `marca.menta` #E1EBE3, `marca.letra` #143C2C y `marca.blanco`. `brand.*` se queda solo para las landings.
- **A3. Fuentes desde `Web_WOFF2` del manual:**
  - League Spartan 800 para el H1 (la única que se precarga) y 700 para los demás títulos.
  - Montserrat 400, 500 y 700. El manual dice "Regular, Medium y Bold": el 600 del prompt se cae y gana el manual.
  - Caveat Brush solo en la ruta que la use, sin precarga.
- **A4. Ningún texto nuevo se convierte en encabezado.** El lema, las etiquetas laterales y "Baje para descubrir" van como `<p>` o `<span>`. Los adornos llevan `alt=""`.
- **A5. Movimiento:**
  - GSAP, ScrollTrigger y Lenis se cargan con `import()` dinámico después del primer pintado, solo en el home y en servicios. Pesan unos 45 KB gzip.
  - Lenis solo en escritorio con `pointer: fine`. En táctil va el scroll nativo, para no arriesgar el INP.
  - `motion` se queda porque lo usa `/lp/restaurantes`.
  - Todo se apaga con `prefers-reduced-motion`.
- **A6. Peso del 3D** (no se puede cumplir el LCP con 9 sprites de 24 cuadros):
  - Hero: imágenes fijas AVIF de máximo 40 KB cada una, cargadas después del LCP. El LCP es el H1 de texto, no una imagen.
  - Sprites de giro: solo en escritorio y solo al pasar el cursor o al enfocar. En celular no hay sprites.
  - Tope para el home en celular: hasta el primer pantallazo, 150 KB de imágenes. En total, 600 KB de 3D.
- **A7. FAQ con `<details>`/`<summary>`.** El contenido ya está en el DOM hoy; se mantiene igual.

## Respuestas de Camilo (13-nov) y lo que elegí donde me dejó decidir

Aprobado: tokens aparte, D1 (aro gráfico con arco que gira y logo plano sobre objetos reales), D2, D3, D4 (sin overlay, ≤1,2 s detrás del contenido), D5, D6 (og:image queda pendiente), D8 (garantía solo para planes, con su texto exacto) y D13 (revisión de GTM aparte; GTM en el preview).

Lo que elegí en las decisiones que me dejó a mí:

- **D7, galería:** arranca con fotos del repo que **Camilo confirme como reales**. No asumo cuáles lo son, porque algunas imágenes de las landings salieron de briefs de IA. Los marcos "Foto real pendiente" solo se ven en el preview. A producción sale con al menos 4 fotos reales.
- **D9, titular de servicio:** el mismo H1 en mayúsculas por CSS, en League Spartan 800 gigante, con el objeto cruzando entre las líneas. El DOM no cambia.
- **D10, `/og-image.jpg`:** subido. Es la imagen para compartir del manual, en JPG de 15 KB. No toca el JSON-LD.
- **D11, lenguaje alarmista:** fuera del rediseño. En lo visual no quedan íconos rojos de riesgo.
- **D12, Alivio:** enlace, texto y color (#1FB3A7) sin cambios. En la cabecera vive dentro del menú, con las mismas clases de siempre.

GTM en el preview: **me aparté de la instrucción**, que era cargarlo "igual que en producción".

- Carga solo con `?gtm=1`, que queda guardado en la sesión.
- Así Lighthouse mide igual que en producción, pero las visitas de revisión no mandan pageviews a GA4 ni clics de WhatsApp a las conversiones de Ads, que son las que usa la puja.
- Si Camilo prefiere que cargue siempre, es un cambio de una línea en `app/layout.tsx`.

## Decisiones de la Fase 0 (registro)

| # | Choque | Mi recomendación |
|---|---|---|
| D0 | **Cómo aislar las landings.** Hay dos caminos: (a) mover unas 35 carpetas a un grupo de rutas `app/(sitio)/` (las URLs no cambian, pero `<main>` sale del layout raíz, las landings necesitan su propio `<main>`, el 404 pierde el cromo y los portales escapan); (b) un contenedor por ruta (A1). | (b): menos archivos tocados y el mismo resultado. Se verifica con la línea base y con capturas de las landings. |
| D13 | **Presupuesto de LCP.** Producción está hoy en 9,9 s, con GTM (502 KB) fuera de alcance. Los previews y localhost no cargan GTM, así que un "LCP < 2,5 s" medido en el preview no garantiza ese número en producción. | La meta de cada fase se mide en el preview (Lighthouse móvil, 5 corridas). La meta de producción se verifica después del merge, con Speed Insights y CrUX. ¿Abrimos una revisión de GTM como tarea aparte? |
| D1 | **Logo.** El manual prohíbe rotar el logo, separar o mover sus elementos y agregarle sombras o efectos. El prompt pide un aro gigante con el arco naranja "en su posición", el arco que barre y subraya por su cuenta, y el símbolo extruido en 3D girando 360°. | El aro gigante es un círculo verde liso, un elemento gráfico de la familia del patrón Arcos, sin hoja y sin el arco del logo. El lema gira sobre él (eso no es el logo). Elimino el objeto 3D #1 y el logo va plano desde su SVG. Las gotas de gel (#9) sí van en 3D: son del patrón, no del logo. El "arco que barre" se vuelve una forma naranja genérica, no el arco del símbolo. |
| D2 | **Tipografías.** El manual dice "máximo dos por pieza". Una página con League Spartan, Montserrat y Caveat Brush lleva tres. | Caveat Brush solo en la página donde vayan Los Colados (ver D5) y en ninguna otra. Si usted considera cada sección como una "pieza", puede quedar en el home. Decida usted. |
| D3 | **"Cero diferencias" no se puede cumplir tal como está escrito.** Diferencias que ya sé que van a aparecer: (a) cabecera: +3 enlaces de segmento (Hogar, Restaurantes, Empresas) y +1 botón circular de WhatsApp; (b) sale la foto del hero y con ella su alt; (c) el lema, las etiquetas, "Baje para descubrir", "Arrastre" y el remate suben el conteo de palabras unas 25-40 por página; (d) al quitar duplicados salen 12 H3 repetidos del home. | Apruebe esta lista de antemano. Me comprometo a: los mismos 11 enlaces actuales de la cabecera (Inicio…Contacto, Alivio y Cotizar Ahora) y los mismos 22 del pie, dentro del HTML; el logo como `<img src="….svg">` con el mismo alt de hoy; y ninguna otra diferencia. ¿A qué rutas van los segmentos? Propongo residencial, restaurantes y comercial. |
| D4 | **La entrada animada choca con "el H1 y WhatsApp se ven desde el primer pintado".** Cualquier overlay los tapa durante ese segundo. | Sin overlay. Las hojas y los puntos de gel caen por los bordes del hero, sin tapar el H1 ni los botones. |
| D5 | **Los Colados.** El manual los permite "solo en hogar y redes", y el home habla también a restaurantes e industria. | Muevo el bloque a `/servicios/fumigacion-residencial` y dejo el home sin Colados. Alternativa: en el home, pero solo dentro de la sección "Hogar". |
| D6 | **El código del favicon trae `og:image`**, y la metadata está congelada. | Adopto el favicon (SVG e ICO), el apple-touch y `theme-color` #164A38, pero no el `og:image`. Necesito que apruebe ese cambio en `metadata.icons`. |
| D7 | **La galería sin fotos.** Marcos que digan "Foto real pendiente" en producción se ven a obra negra. | La galería solo se publica cuando haya al menos 4 fotos reales. En los previews sí se ve con los marcos. |
| D8 | **Tabla Frecuencia/Garantía** (hallazgo 5). La garantía es una promesa comercial: no la invento. | Solo muestro columnas con el texto que ya existe. Para tenerlas en las 9 páginas necesito su política real de garantía por segmento. El manual trae las frases: hogar "Si la plaga vuelve, nosotros también", comercio "Si algo no quedó bien, volvemos sin costo", industria "Garantía según contrato". ¿Las puede cumplir tal cual? |
| D9 | **Titular gigante de servicio.** | Uso el mismo H1 en mayúsculas por CSS (el DOM no cambia), con tamaño adaptado a su largo. No agrego un nombre corto aparte. |
| D10 | **`/og-image.jpg` da 404** en el JSON-LD. | Subo `public/og-image.jpg` con la imagen oficial del manual. No toca el JSON-LD. |
| D11 | **Lenguaje alarmista en el texto indexable.** | Queda fuera del rediseño. Lo propongo como una pasada de texto aparte, con su aprobación. |
| D12 | **Alivio.** | Sin cambios de contenido ni de enlace. Solo hereda los tokens nuevos del contenedor, igual que el resto. ¿O lo dejo pixel a pixel como está hoy? |

## Fases y tareas

### Fase 1: base de marca (no cambia nada visible del recorrido)
0. **Capturas "antes"** con Playwright de las landings y de las páginas principales, en 390 px y 1440 px, tomadas en `main` antes de tocar nada.
1. **Contenedor por ruta** (A1 / D0).
   - Acepto si: build OK, SEO 0 diferencias y capturas de `/lp/*` y `/tienda/*` idénticas al pixel con las de antes.
2. **Tokens `marca.*` y fuentes del manual** (A2, A3). Acepto si: no queda Nunito en `(sitio)` y solo se precarga LS 800.
3. **Cabecera nueva:**
   - segmentos, logo SVG oficial centrado, "Menú" y botón circular de WhatsApp;
   - menú con los mismos enlaces dentro del HTML.
   - Acepto si: SEO 0 diferencias en la cabecera y el botón de WhatsApp se ve en el primer pantallazo, en celular y en escritorio.
4. **Pie nuevo:** logo horizontal blanco a todo el ancho y los mismos 22 enlaces. Acepto si: SEO 0 diferencias en el pie.
5. **Favicon y theme-color** (D6). **`og-image.jpg`** (D10).
6. **Revisar los rastreadores en el preview:** que Pixel y PostHog no ensucien datos con los hostnames de vercel.app.
- **Punto de control:** preview en Vercel, diff de SEO, Lighthouse y capturas de las landings.

### Fase 2: 3D en Blender (puede correr en paralelo con la fase 1)
1. Instalar las skills con `--project .` y dejar `.claude/skills` en `.gitignore`.
2. Escena, rig de luz y cámara únicos (`blender-scene-setup`, `blender-lighting-lookdev`).
3. Un objeto piloto: la casa. Modelado, materiales y QA. **Se lo muestro antes de seguir con los demás.**
4. Los objetos restantes, según lo que decida en D1. QA obligatorio en cada uno.
5. Render por lotes: AVIF/WebP 1x/2x de máximo 120 KB y sprites solo para escritorio. Los `.blend` van en `~/Desktop/agroincol-3d/`.
- **Punto de control:** hoja de contacto con los renders para su aprobación.

### Fase 3: home
1. Hero estático: aro, H1, botones y reseñas. Sin JS. Acepto si: LCP < 2,5 s y CLS < 0,1 en Lighthouse móvil.
2. Capa de movimiento con carga diferida: lema girando, desfile de objetos y cursor. Acepto si: con JS apagado la página se lee completa, y con reduce-motion no hay animación.
3. Foco de servicio, segmentos y método (tabla con `<details>` donde aplique).
4. Galería "Arrastre" (D7), "Otros servicios" con el patrón gel, y luego reseñas, FAQ, zonas, banda de CTA y formulario de contacto, todos conservados.
- **Punto de control:** preview, diff (solo los cambios aprobados en D3), Lighthouse y revisión en celular.

### Fase 4: plantilla de servicio
1. Un componente de plantilla y su piloto en `/servicios/desratizacion`.
2. Las otras 8 rutas, más los íconos de restaurantes pasados a verde y menta.
- **Punto de control:** igual al de la fase 3.

### Fase 5: resto del sitio
Precios, blog, artículos, certificaciones, calculadora, zonas, reseña y privacidad reciben los tokens, el cromo, el cursor y los separadores. Al final: comparación SEO, Lighthouse y revisión en celular.

## Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Las landings cambian sin querer | Alto: es pauta pagada | A1, más capturas antes y después en cada fase |
| El LCP empeora por el 3D o las fuentes | Alto: SEO | El H1 es de texto y es el LCP; tope de A6; Lighthouse en cada fase |
| Lenis o el cursor dañan el INP | Medio | Solo escritorio y en carga diferida |
| Los números locales salen optimistas, porque GTM no carga en localhost | Medio | Se compara local con local y producción con producción |
| Ruido de Lighthouse (producción osciló entre 59 y 85) | Medio | 5 corridas en producción y en el preview |

Notas:
- El SEO local da 92 frente a 100 en producción solo por la auditoría `robots-txt` en localhost. No es una regresión.
- Los reportes HTML pesan unos 7,7 MB por fase. Propongo versionar solo `resumen.json` e ignorar los `.html` en git.

## Resultado Fase 1 (13-nov)

Preview: `agroincol-web-git-rediseno-recorrido-camilos-projects-1d68bc1f.vercel.app` (protegido con login de Vercel).

- **SEO:** 0 diferencias sin aprobar en las 39 URLs. Los únicos cambios son los 4 enlaces aprobados de la cabecera.
- **Landings:** `/lp/*` y `/tienda/*` idénticas al píxel en 390 y 1440 px. Las diferencias que quedan están por debajo del 0,4 % y vienen de los bordes del video enmascarado.
- **Lighthouse local** (producción, 3 corridas, `main` → rama):

| URL | Rendimiento | LCP | Peso |
|---|---|---|---|
| `/` | 90 → 91 | 3,44 → 3,39 s | 351 → 343 KB |
| residencial | 82 → 90 | 3,78 → 3,48 s | 408 → 360 KB |
| blog | 91 → 93 | 3,33 → 3,23 s | 395 → 336 KB |
| zonas | 88 → 92 | 3,75 → 3,34 s | 413 → 365 KB |

- **Preview con GTM contra producción** (5 corridas cada uno, mismo momento):

| URL | LCP producción | LCP preview | TBT producción | TBT preview |
|---|---|---|---|---|
| `/` | 6,21 s | **2,59 s** | 408 ms | 1.304 ms |
| residencial | 6,43 s | **2,59 s** | 393 ms | 593 ms |
| blog | 6,35 s | **2,30 s** | 345 ms | 438 ms |
| zonas | 4,74 s | 4,49 s | 308 ms | 550 ms |

**Lectura de los números (provisional):**
- La comparación controlada es la local: `main` contra la rama, en la misma máquina y con el mismo build. Ahí el LCP casi no se mueve (3,44 → 3,39 s en el home).
- La comparación preview contra producción enfrenta dos despliegues distintos, y producción osciló hoy entre 6,2 y 9,9 s. Que el LCP del preview salga más bajo no prueba todavía que lo bajó el arreglo del H1, ni que el presupuesto de 2,5 s esté cumplido.
- La prueba real será producción después del merge, con Speed Insights y CrUX.
- El TBT del preview sale más alto. En el preview GTM bloqueó 1.007 ms, contra unos 250 ms en producción.
- Hay dos causas probables que todavía no separo:
  1. GTM se comporta distinto en el host vercel.app.
  2. El render 3D corría en paralelo en la misma máquina.
- Se repite cuando termine el render. El SEO del preview da 69 por el `noindex` que Vercel pone a todos los previews: es esperado.

**Ajustes del cierre de la Fase 1 (después de la revisión):**
- **Precarga de League Spartan 800 fuera de las landings.** Ahora se declara con `@font-face` y URL estable, y se precarga con `ReactDOM.preload` solo en las rutas v2. En las landings, las precargas son las mismas de `main`.
- **El H1 del sitio va en League Spartan 800**, la fuente precargada.
- **Contraste:** el botón primario pasa a 19 px bold (blanco sobre naranja da 3,04:1 y solo vale como texto grande). La píldora del hero ya no lleva texto blanco pequeño sobre naranja.
- **Lo que sí cambia en el `<head>` de las landings** (global por dominio, no es contenido):
  - `theme-color` #164A38;
  - favicon del manual (el `favicon.ico` anterior pesaba 70 bytes);
  - el CSS global partido en dos archivos (fuentes v1 y resto), con el mismo contenido.
  - Visualmente, 0 píxeles distintos en `/lp/*`.

## Resultado Fase 3: home (13-nov)

**Decisiones del 13-nov:** variante B de la casa (techo naranja), ronda de detalle hecha, galería con marcos en blanco (no hay fotos reales) y Blender en vivo por MCP.

**Qué hay en el home:**
- Hero con aro, lema girando y arco naranja.
- Casa 3D desfilando sobre el arco.
- Entrada de primera visita detrás del contenido.
- Cinta de confianza.
- Foco "¿Qué necesita proteger?" con la casa entre las líneas.
- Segmentos gigantes, con Los Colados solo en Hogar.
- Método en ficha de tres columnas.
- Galería "Arrastre" en blanco.
- Lema con Caveat (única vez en la página).
- Servicios con inclinación y patrón gel.
- Alivio sin cambios, y Por qué, Zonas, Reseñas, FAQ, banda de WhatsApp y formulario restilados con el mismo texto.

**SEO:** solo cambia el home. Aprobado por D3: −12 H3 duplicados y sus enlaces duplicados, sale la foto del hero, entra el alt del render 3D, y el conteo de palabras pasa de 1.337 a 1.153.

**Pendiente de aprobación:**
1. +1 enlace interno: la casa del desfile lleva a `/servicios/fumigacion-residencial`, con su alt como texto del enlace.
2. 3 imágenes decorativas con `alt=""`: la casa del foco, la casa que aparece al pasar el cursor sobre "Mi hogar" y la casa de la tarjeta de residencial. Es el mismo objeto ya descrito una vez.

**Texto propuesto para la tabla del método** (nuevo en el home; no está publicado, espera su visto bueno):

| Columna | Texto |
|---|---|
| Frecuencia (chips) | Servicio único · Mensual · Bimestral · Trimestral. Son los planes que ya nombran las FAQ de restaurantes y comercial. |
| Garantía | "En planes: si la plaga vuelve entre visitas, volvemos sin costo, siguiendo las recomendaciones del técnico." Es el texto que usted aprobó. |

**Choques de texto que encontré (no los toqué):**
- **Método, paso 3:** dice "respondemos sin costo si la plaga vuelve" sin aclarar que es solo en planes. Choca con la política real de garantía.
- **"Certificado":** el home y las FAQ siguen diciendo "certificado". Desde sep-2026 el documento real es el acta de hallazgos. Pendiente de contenido.
- **`WhyUs`** usa `equipo-agroincol.webp` (tres técnicos con una van). Si la foto es de IA, rompe la regla "nunca fotos de IA con personas". Cambiarla mueve un alt: necesita su aprobación.

**Lighthouse local del home** (producción, 3 corridas), `main` → rama:

| Rendimiento | LCP | FCP | TBT | Peso |
|---|---|---|---|---|
| 91 → 91 | 3,37 → 3,44 s | 1,52 → 1,06 s | 3 → 2 ms | 351 → 500 KB |

- El peso extra viene de GSAP y Lenis (cargan con el hilo libre, después del primer pintado), los renders y Los Colados.
- El elemento LCP es el texto del aro (SVG), que se pinta junto con el H1.

**Landings:** 0 píxeles distintos frente a `main` capturado a la misma hora. `/lp/restaurantes` cambia sola según el horario de atención, así que las capturas "antes" de otra hora no sirven para compararla.

**Preview con GTM contra producción** (home, 5 corridas cada uno):

| | Rendimiento | LCP | TBT | Peso |
|---|---|---|---|---|
| Producción hoy | 75 | 6,12 s | 147 ms | 873 KB |
| Preview fase 3 | 77 | 4,90 s | 215 ms | 1.043 KB |

- **El LCP sigue lejos del presupuesto de 2,5 s.** El elemento LCP es el texto del aro, con 4,2 s de *render delay*.
- **Las corridas son muy ruidosas** (el preview fue de 68 a 95). No cuento esto como mejora probada.
- **Próximos pasos para el LCP:**
  1. La revisión de GTM que ya está aprobada.
  2. Probar CSS crítico en línea: hoy hay dos CSS que bloquean el render, unos 85 KB.
  3. Sacar el lema del aro de la carrera por el LCP: que aparezca después del H1, sin opacidad en el H1.

## Trabajo autónomo (13-nov, noche): hero rehecho y fases 4 y 5

Camilo: "Se ve horrible, ese hero… compara con la referencia con Playwright. Termina el trabajo, completamente autónomo."

**Hero, medido contra agrumeafarm.it.** Capturé la referencia en vivo con Playwright a 1440×900, 1280×720 y 390×844.

| Qué | Referencia | Hero viejo | Hero nuevo |
|---|---|---|---|
| Aro | ~3/4 del ancho, desde media pantalla | Más ancho que la pantalla ("loma") | `min(78vw, 1240px)`, desde el 45 % del alto |
| Dentro del aro | Solo el texto curvo | Píldora, H1, párrafo, 2 botones, reseñas, hojas regadas | Lema curvo, H1 y botones (WhatsApp, Llamar), y las reseñas. La píldora y el párrafo bajan justo después, con el mismo texto. |
| Objetos | 3–4 grandes por un arco; el hero queda fijo mientras desfilan | 1 casa chica al borde | Arco concéntrico al aro, objetos de 40svh, el hero fijo (ScrollTrigger `pin`) durante el desfile |
| Fondo | Crema | Blanco y cabecera blanca | Menta En Paz y cabecera transparente en el home |

- **WhatsApp en el primer pantallazo:** borde inferior del botón en y = 735 (1440×900), 614 (1280×720), 649 (1366×768), 604 (390×844) y 549 (360×740).
- **Naranja en el primer pantallazo:** 3,4 % (1440), 3,9 % (1280) y 8,0 % (390). Todos bajo el tope de 10 %.
- **Entrada:** las piezas caen y salen por abajo; ya no quedan regadas.

**Fase 4, plantilla de servicio en las 9 rutas:**
- `HeroServicio`: el H1 de siempre gigante, con el objeto 3D cruzando su última línea y etiquetas laterales.
- FAQ con `<details>`.
- Íconos de riesgo a verde y menta.
- Galería en blanco.
- "Otros servicios" con solo los nombres.

**Fase 5, resto del sitio:**
- Hero compartido en verde liso con patrón gel.
- Títulos, viñetas y tarjetas al estilo v2.
- El texto pequeño en naranja pasa a verde con subrayado naranja.
- Cursor y fundido verde entre páginas en todo el sitio v2.
- SEO: 0 diferencias en estas páginas.

**SEO pendiente de aprobación:** ver `docs/rediseno/seo-cambios-pendientes.md` (home y 9 servicios).

**3D:** el agente produce los 9 objetos en el Blender en vivo y registra cada uno en `~/Desktop/agroincol-3d/ESTADO.md`. Para integrar uno:
1. `scripts/3d-web.sh <id> B frente34 picado`
2. `python3 -I scripts/integrar-objeto.py <id> "<alt>" <href>`
