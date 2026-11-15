# Tarea para Claude Code: publicar el rediseño de agroincol.com

Vamos a reemplazar el sitio actual de agroincol.com por el rediseño aprobado que está en /_rediseno.

1. Lee /_rediseno/README.md completo. La sección 6 trae las decisiones ya cerradas: no las vuelvas a preguntar.
2. Abre /_rediseno/site/index.html y recorre las 33 páginas en 1440, 834 y 390 px. Esa es la referencia exacta de diseño, textos y animaciones.
3. Propón el plan por fases sobre el stack actual (Next.js). Trabaja en una rama nueva y publica solo en previews de Vercel.

## Reglas
- No cambies el diseño, los textos ni las animaciones. Replica /_rediseno/site tal cual, incluidos js/site.js y js/tools.js.
- Conserva las URLs actuales. Usa el mapa de la sección 5 del README.
- Conecta el formulario `form[data-lead-form]` al sistema de leads actual, con los mismos nombres de campo.
- Agrega schema LocalBusiness, Service, FAQPage y BreadcrumbList, además de sitemap y robots.
- Sirve las fuentes WOFF2 de /_rediseno/site/fonts de forma local.
- Usa next/image. Los objetos 3D son WebP: no cargues modelos 3D.
- Respeta prefers-reduced-motion.
- No toques /lp, /ecogel ni /tienda.
- Al final de cada fase, entrega el enlace del preview y espera la aprobación. Nada va a producción sin aprobación.
