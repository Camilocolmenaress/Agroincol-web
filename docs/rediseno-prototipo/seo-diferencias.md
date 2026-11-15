# Diferencias de SEO frente a producción

Resumen de `node scripts/seo-baseline.mjs --compare` contra el servidor de la rama (14-nov). Title, description, canonical, hreflang, robots, Open Graph y JSON-LD son iguales a producción en las 29 URL que ya existen, salvo FAQPage, que se arma con las preguntas visibles. Las landings (`/lp`, `/tienda`, `/ecogel`, `/resena`) no tienen diferencias.

| Ruta | Palabras de `<main>` (prod → rama) | Preguntas FAQPage (prod → visibles) | Secciones H2 de producción que ya no están |
|---|---|---|---|
| /servicios | 193 → 185 (-5 %) | 0 → 0 | Fumigación Residencial · Control de Plagas Comercial · Fumigación para Restaurantes · Desratización · Control de Insectos Voladores · Fumigación Industrial · Control de Comején y Termitas · Retiro de Abejas y Avispas · Control de Chinches de Cama |
| /servicios/fumigacion-restaurantes | 934 → 1072 (+14 %) | 6 → 4 | Preguntas Frecuentes sobre Fumigación de Restaurantes |
| /servicios/fumigacion-residencial | 935 → 721 (-23 %) | 5 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Plagas Comunes en Restaurantes de Bucaramanga · Preguntas Frecuentes sobre Fumigación Residencial |
| /servicios/control-plagas-comercial | 888 → 636 (-29 %) | 5 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Plagas Comunes en Restaurantes de Bucaramanga · Preguntas Frecuentes sobre Control de Plagas Comercial |
| /servicios/desratizacion | 966 → 710 (-27 %) | 5 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Plagas Comunes en Restaurantes de Bucaramanga · Preguntas Frecuentes sobre Desratización · Solucione el Problema Hoy |
| /servicios/control-insectos-voladores | 999 → 712 (-29 %) | 5 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Plagas Comunes en Restaurantes de Bucaramanga · Preguntas Frecuentes sobre Control de Insectos Voladores · Protéjase Antes de la Próxima Temporada de Lluvias |
| /servicios/fumigacion-industrial | 960 → 697 (-28 %) | 5 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Plagas Comunes en Restaurantes de Bucaramanga · Preguntas Frecuentes sobre Fumigación Industrial |
| /servicios/control-comejen-termitas | 1317 → 1162 (-12 %) | 6 → 3 | Preguntas Frecuentes sobre Comején y Termitas · Detenga el Daño Antes de que Avance |
| /servicios/eliminacion-abejas-avispas | 1479 → 1228 (-17 %) | 6 → 3 | Nuestro Proceso de Fumigación para Restaurantes · Preguntas Frecuentes sobre Retiro de Abejas y Avispas |
| /servicios/control-chinches | 1345 → 920 (-32 %) | 6 → 3 | Nuestro Tratamiento Profesional Contra Chinches · Hoteles y Hospedajes en Bucaramanga: el Riesgo es su Reputación · Cómo Evitar Traer Chinches de un Viaje · Preguntas Frecuentes sobre Control de Chinches · Recupere su Descanso — Elimine las Chinches de Raíz |
| /precios | 1307 → 1280 (-3 %) | 0 → 0 | Programas de Protección para Restaurantes · Qué Incluye Cada Visita · Formas de Pago |
| /certificado-de-fumigacion | 695 → 666 (-5 %) | 5 → 0 | — |
| /certificaciones-y-normativa | 847 → 826 (-3 %) | 5 → 0 | ¿Necesita Certificación de Fumigación? |
| /blog | 317 → 197 (-38 %) | 0 → 0 | Auditoría del INVIMA: Cómo Preparar su Restaurante para Pasar sin Problemas · ¿Vi una Cucaracha en mi Casa: Significa que Hay Más? · Temporada de Lluvias en Bucaramanga: Las Plagas que Aparecen y Cómo Prevenirlas · ¿Cuánto Cuesta una Multa del INVIMA por Plagas? Lo que Todo Restaurante Debe Saber · Cómo Eliminar Cucarachas en Bucaramanga: Guía Profesional 2026 · Fumigación para Restaurantes en Bucaramanga: Norma y Costos 2026 · Comején y Termitas en Bucaramanga: Cómo Identificar y Eliminar |
| /blog/auditoria-invima-como-preparar-restaurante | 1466 → 1301 (-12 %) | 0 → 0 | ¿Necesita Control de Plagas? |
| /blog/vi-cucaracha-en-mi-casa-que-hacer | 1384 → 1220 (-12 %) | 0 → 0 | ¿Necesita Control de Plagas? |
| /blog/plagas-temporada-lluvias-bucaramanga | 1430 → 1278 (-11 %) | 0 → 0 | ¿Necesita Control de Plagas? |
| /blog/cuanto-cuesta-multa-invima-restaurante | 1405 → 1249 (-12 %) | 0 → 0 | ¿Necesita Control de Plagas? |
| /blog/como-eliminar-cucarachas-bucaramanga | 1735 → 1584 (-9 %) | 4 → 0 | ¿Necesita Control de Plagas? |
| /blog/fumigacion-restaurantes-bucaramanga-norma | 1565 → 1382 (-12 %) | 5 → 0 | ¿Necesita Control de Plagas? |
| /blog/comejen-termitas-bucaramanga | 1663 → 1512 (-10 %) | 4 → 0 | ¿Necesita Control de Plagas? |
| /herramientas/calculadora-fumigacion | 685 → 188 (-73 %) | 0 → 0 | ¿Cada Cuánto se Debe Fumigar en Colombia? · Factores que Influyen en la Frecuencia de Fumigación · ¿Qué Pasa si No Fumigo a Tiempo? |
| /zonas | 193 → 109 (-44 %) | 0 → 0 | Servicio en toda el Área Metropolitana · ¿No encuentra su zona? Escríbanos |
| /zonas/fumigacion-bucaramanga | 1443 → 1190 (-18 %) | 6 → 3 | Servicios de Fumigación en Bucaramanga · Preguntas Frecuentes sobre Fumigación en Bucaramanga |
| /zonas/fumigacion-floridablanca | 932 → 767 (-18 %) | 0 → 0 | Servicios de Fumigación en Floridablanca |
| /zonas/fumigacion-piedecuesta | 1353 → 827 (-39 %) | 6 → 1 | Servicios de Fumigación en Piedecuesta · Preguntas Frecuentes sobre Fumigación en Piedecuesta |
| /zonas/fumigacion-giron | 1120 → 935 (-17 %) | 0 → 0 | Servicios de Fumigación en Girón |
| /politica-de-privacidad | 330 → 342 (+3 %) | 0 → 0 | — |
| /empresas | URL nueva | 4 | — |
| /herramientas | URL nueva | 0 | — |
| /herramientas/plaga | URL nueva | 0 | — |
| /herramientas/checklist | URL nueva | 0 | — |

Columna de preguntas: si la rama no tiene preguntas desplegables y producción sí tenía FAQPage (certificado, normativa y tres artículos), se conserva el FAQPage de producción. Esas preguntas están en el texto del artículo (verificado: 5/5, 5/5, 4/4, 5/5 y 4/4).

Las secciones de llamado a la acción (cotice, solicite, testimonios) no se listan: el prototipo las reemplaza por las suyas.

El texto de producción que no está en el prototipo, frase por frase, está en `texto-faltante.md`. Ese conteo es más grueso: incluye formularios, migas y frases pegadas al título, así que exagera la pérdida; para decidir, use esta tabla.
