# AGROINCOL · Sitio web rediseñado: paquete para Claude Code

Este es el prototipo funcional y aprobado del nuevo agroincol.com. Es HTML, CSS y JS estático, y funciona abriendo `site/index.html`.

- Prototipo en línea: https://claude.ai/artifact/BrgSZArczKxvduXc15H1jP
- Las 33 páginas ya tienen el texto final, el diseño final y las animaciones finales.
- No hay nada que inventar ni que decidir. Las decisiones están cerradas en la sección 6.

## 1. Contenido del paquete

| Carpeta | Contenido |
|---|---|
| `site/` | El sitio completo: 33 páginas, `css/`, `js/`, `assets/`, `fonts/`. Es la referencia exacta. |
| `site/site_build.py` | Generador de las páginas. Usa `build_helpers.py` y `build_pages2.py`. Contiene todos los datos: servicios `S`, zonas `Z`, herramientas `T`, blog `BLOG`/`POSTS`, carrusel del inicio `ORB`. |
| `contenido-sitio-actual/` | El texto del sitio en producción. `svc.json` trae H1, lead y FAQ de cada servicio; `dump1.txt` el texto de los servicios; `sitio.json` el inicio, las zonas, el blog, precios y las páginas legales. |
| `renders-3d/` | Los 12 objetos en PNG transparente de 900 px, la hoja original de fal.ai en 4K y los pictogramas SVG de respaldo. |

Para regenerar las páginas: `cd site && python3 site_build.py`. El resultado es idéntico al de este paquete.

## 2. Páginas

- **Inicio**
- **Servicios:** el índice y los 9 servicios.
- **Empresas**
- **Zonas:** el índice y los 4 municipios.
- **Herramientas:** el índice, la calculadora, "¿Qué plaga tengo?" y "Antes de fumigar".
- **Precios**
- **Blog:** el índice y 7 artículos.
- **Certificado de fumigación**
- **Normativa**
- **Política de datos**

## 3. Componentes que se deben respetar

- **Guía completa** (`.guia`): está en el inicio, en los 9 servicios, en las 4 zonas y en precios.
  - Lleva el texto actual del sitio, visible y con sus H2 originales. Así se conserva el SEO.
  - En escritorio tiene un índice lateral fijo que marca la sección que se está leyendo.
- **Formulario de cotización** (`form[data-lead-form]`):
  - Está en el inicio, en los servicios, en las zonas, en precios, en certificado y en normativa.
  - Usa los mismos nombres de campo del formulario actual: `nombre`, `telefono`, `tipoServicio`, `website` (honeypot) y `aceptaTerminos`.
  - **Conéctelo al sistema de leads que ya existe:** hoja de Sheets, correo, conversiones, GTM y PostHog.
  - En las páginas de servicio el servicio viene preseleccionado.
  - El prototipo solo valida los campos y muestra el mensaje de éxito.
- **Carrusel del hero:**
  - En escritorio y tablet los 7 objetos giran sobre el aro con el scroll. Cada uno pasa por el centro y se acomoda solo.
  - Detrás aparece la palabra gigante del segmento.
  - La cabecera no se esconde durante el hero.
  - En celular es una tira deslizable con la guía de arrastre (la mano).
- **Carruseles arrastrables** (galería y otros servicios):
  - Se mueven agarrando y soltando, con inercia, rebote en los extremos y acomodo automático.
  - Tienen un indicador debajo y la mano de arrastre al entrar en pantalla.
  - El scroll horizontal del trackpad no los mueve (decisión del cliente).
- **Usted a lo suyo:** Los Colados caminan siempre por la línea punteada, y el scroll los acelera.
- **Navegación:** cada página abre desde arriba.
- **Intro:** no hay intro de pantalla completa. Solo queda el velo verde entre páginas.

## 4. Stack del prototipo

- GSAP con ScrollTrigger, y Lenis. `gsap.matchMedia` separa los tamaños de pantalla.
- Cortes de diseño: 1099 px para tablet y 699 px para celular.
- `prefers-reduced-motion` apaga las animaciones y deja todo legible.
- Las fuentes del prototipo van en base64 dentro de `css/fonts.css`. En producción, sirva las WOFF2 de `site/fonts/` con `next/font/local`.
- En Next, la navegación no recarga la página. Por eso `site.js` debe reiniciarse en cada cambio de ruta: limpiar ScrollTrigger y Lenis, y volver a montarlos.

## 5. Mapa de URLs (conservar las actuales)

| Prototipo | URL en producción |
|---|---|
| `index.html` | `/` |
| `servicios.html` | `/servicios` |
| `servicio-<slug>.html` | `/servicios/<slug>` |
| `empresas.html` | `/empresas` (nueva) |
| `zonas.html` | `/zonas` |
| `zona-fumigacion-<municipio>.html` | `/zonas/fumigacion-<municipio>` |
| `herramientas.html` | `/herramientas` (nueva) |
| `herramienta-calculadora.html` | `/herramientas/calculadora-fumigacion` (la URL actual) |
| `herramienta-plaga.html`, `herramienta-checklist.html` | `/herramientas/plaga`, `/herramientas/checklist` (nuevas) |
| `precios.html` | `/precios` (se conserva, sin redirección) |
| `blog.html` | `/blog` |
| `articulo-vi-una-cucaracha.html` | `/blog/vi-cucaracha-en-mi-casa-que-hacer` |
| `articulo-auditoria-invima.html` | `/blog/auditoria-invima-como-preparar-restaurante` |
| `articulo-plagas-temporada-lluvias.html` | `/blog/plagas-temporada-lluvias-bucaramanga` |
| `articulo-multa-invima.html` | `/blog/cuanto-cuesta-multa-invima-restaurante` |
| `articulo-eliminar-cucarachas.html` | `/blog/como-eliminar-cucarachas-bucaramanga` |
| `articulo-fumigacion-restaurantes-norma.html` | `/blog/fumigacion-restaurantes-bucaramanga-norma` |
| `articulo-comejen-termitas.html` | `/blog/comejen-termitas-bucaramanga` |
| `certificado-de-fumigacion.html` | `/certificado-de-fumigacion` |
| `certificaciones-y-normativa.html` | `/certificaciones-y-normativa` |
| `politica-de-privacidad.html` | `/politica-de-privacidad` |

- `/resena` sigue igual, sin indexar.
- Las landings `/lp`, `/ecogel` y `/tienda` no se tocan.
- Use el title y la meta description actuales de cada página: los generados ya los tienen.

## 6. Decisiones cerradas (no volver a preguntar)

1. **Texto:** se conserva el texto actual dentro de la "Guía completa", tal como está en el prototipo.
2. **Formulario:** se conserva y se conecta al sistema de leads actual.
3. **/precios:** se conserva como página propia, sin tabla de precios y sin redirección.
4. **Páginas que existen hoy:** todas están en el prototipo con su texto actual. La única excepción es `articulo-vi-una-cucaracha.html`, que tiene un texto resumido: en producción, use el texto completo que ya está publicado y respete el diseño del prototipo.
5. **Intro de pantalla completa:** eliminada.
6. **Alivio:** no se incluye en el sitio.
7. **Frecuencias, "certificado" y reseñas:** quedan como están. Los textos y las reseñas del prototipo son los del sitio actual.

## 7. Reglas de marca (no negociables)

- **Colores:** Verde Con Sello #164A38, Verde Letra Clara #143C2C, Menta En Paz #E1EBE3, Blanco #FFFFFF y Naranja De Una #F5682E (máximo 10 %).
- **Tipografía:** League Spartan 800 en mayúscula para los titulares, Montserrat para el texto y Caveat Brush una vez por página como remate.
- **Logos:** los oficiales, sin redibujar. Un solo patrón por pieza.
- **Los Colados:** solo en hogar y en contextos sociales, nunca en industria o restaurantes. Siempre pierden o se van.
- **Voz:** se trata de usted. El chiste va contra la plaga, nunca contra el cliente.
