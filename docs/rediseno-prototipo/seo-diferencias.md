# Diferencias de SEO frente a producción

Resumen de `node scripts/seo-baseline.mjs --compare` contra la rama, después de recuperar el texto (15-nov). Title, description, canonical, hreflang, robots, Open Graph y JSON-LD son iguales a producción en las 29 URL que ya existen. FAQPage tiene las mismas preguntas que producción (cambia el orden en algunas páginas). Las landings no tienen diferencias.

| Ruta | Palabras de `<main>` (producción → rama) | Preguntas (producción → visibles) |
|---|---|---|
| / | 1337 → 850 (-37 %) | 0 → 5 |
| /servicios | 193 → 185 (-5 %) | 0 → 0 |
| /servicios/fumigacion-restaurantes | 934 → 1188 (+27 %) | 6 → 6 |
| /servicios/fumigacion-residencial | 935 → 817 (-13 %) | 5 → 5 |
| /servicios/control-plagas-comercial | 888 → 751 (-16 %) | 5 → 5 |
| /servicios/desratizacion | 966 → 815 (-16 %) | 5 → 5 |
| /servicios/control-insectos-voladores | 999 → 850 (-15 %) | 5 → 5 |
| /servicios/fumigacion-industrial | 960 → 820 (-15 %) | 5 → 5 |
| /servicios/control-comejen-termitas | 1317 → 1354 (+2 %) | 6 → 6 |
| /servicios/eliminacion-abejas-avispas | 1479 → 1441 (-3 %) | 6 → 6 |
| /servicios/control-chinches | 1345 → 1484 (+10 %) | 6 → 6 |
| /precios | 1307 → 1619 (+23 %) | 0 → 0 |
| /certificado-de-fumigacion | 695 → 666 (-5 %) | 5 → 0 (las preguntas están en el texto del artículo; FAQPage se conserva) |
| /certificaciones-y-normativa | 847 → 826 (-3 %) | 5 → 0 (las preguntas están en el texto del artículo; FAQPage se conserva) |
| /blog | 317 → 197 (-38 %) | 0 → 0 |
| /blog/auditoria-invima-como-preparar-restaurante | 1466 → 1301 (-12 %) | 0 → 0 |
| /blog/vi-cucaracha-en-mi-casa-que-hacer | 1384 → 1220 (-12 %) | 0 → 0 |
| /blog/plagas-temporada-lluvias-bucaramanga | 1430 → 1278 (-11 %) | 0 → 0 |
| /blog/cuanto-cuesta-multa-invima-restaurante | 1405 → 1249 (-12 %) | 0 → 0 |
| /blog/como-eliminar-cucarachas-bucaramanga | 1735 → 1584 (-9 %) | 4 → 0 (las preguntas están en el texto del artículo; FAQPage se conserva) |
| /blog/fumigacion-restaurantes-bucaramanga-norma | 1565 → 1382 (-12 %) | 5 → 0 (las preguntas están en el texto del artículo; FAQPage se conserva) |
| /blog/comejen-termitas-bucaramanga | 1663 → 1512 (-10 %) | 4 → 0 (las preguntas están en el texto del artículo; FAQPage se conserva) |
| /herramientas/calculadora-fumigacion | 685 → 843 (+23 %) | 0 → 0 |
| /zonas | 193 → 194 (+0 %) | 0 → 0 |
| /zonas/fumigacion-bucaramanga | 1443 → 1598 (+10 %) | 6 → 6 |
| /zonas/fumigacion-floridablanca | 932 → 877 (-6 %) | 0 → 0 |
| /zonas/fumigacion-piedecuesta | 1353 → 1269 (-7 %) | 6 → 6 |
| /zonas/fumigacion-giron | 1120 → 1070 (-5 %) | 0 → 0 |
| /politica-de-privacidad | 330 → 342 (+3 %) | 0 → 0 |
| /empresas | URL nueva | 4 |
| /herramientas | URL nueva | 0 |
| /herramientas/plaga | URL nueva | 0 |
| /herramientas/checklist | URL nueva | 0 |

Lo que todavía baja de palabras es, a propósito:
- en 6 servicios, el texto de restaurantes que estaba repetido (eliminado por decisión de Camilo);
- llamados a cotizar, formularios y reseñas de producción (el prototipo tiene los suyos);
- tarjetas de navegación del inicio, `/servicios`, `/zonas` y `/blog`, y la caja "Sobre AGROINCOL" de los artículos.

El detalle, elemento por elemento, está en `texto-faltante.md`.
