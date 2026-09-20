# EcoGel — iteración 2 (revisión de Camilo contra Lummia, 20-sep-2026)

Cambios a la página de producto (`components/ecogel/*`, ambos segmentos). Todo lo que no se menciona queda igual. Sigue vigente: nunca inventar testimonios (todo placeholder lleva `placeholder: true` y etiqueta visible), garantía solo desde `GARANTIA`, sin animaciones de entrada en el hero (el marquee de reseñas sí se mueve: es contenido, no entrada).

## 1. Cabecera más grande, con carrito
`CabeceraEcogel`: franja `bg-brand-mint` más alta (`py-5`), logo centrado y grande (`h-14 md:h-16`), a la derecha un ícono de carrito (`ShoppingBag` de lucide) que enlaza a `/ecogel/pedido?u=<tier actual>&de=<segmento>` (necesita `useTier`, así que la cabecera pasa a `'use client'` y recibe `segmento`). El botón de WhatsApp sale de la cabecera: ahora es flotante (ver §8).

## 2. Galería: carrusel de 12 placeholders, sin miniaturas
`Galeria`: un carrusel horizontal con `scroll-snap` (sin librerías), 12 slides cuadrados a ancho completo del contenedor, cada uno un `Marcador` con su encuadre:
1. Gel aplicándose en la rendija de una cocina · 2. Jeringa sobre fondo neutro · 3. Detrás de la nevera · 4. Bajo el lavaplatos · 5. Esquina de gabinete · 6. Zócalo de cocina de restaurante · 7. Antes (cocina) · 8. Después día 7 · 9. Técnico de AGROINCOL aplicando · 10. Caja/kit con la guía · 11. Puntos del tamaño de un grano de arroz (macro) · 12. Cliente mostrando la jeringa (UGC).
Flechas ‹ › a los lados (botones, `aria-label`), puntos indicadores debajo (12), el activo en `bg-brand-green`. Sello "30 días de garantía" encima del primer slide igual que hoy. Componente cliente (`'use client'`) que sigue el scroll con un listener para marcar el punto activo. Si `fotos.enUso` etc. existen, se usan en los slides correspondientes (1→enUso, 2→producto, 7→antes, 8→despues, 9→equipo).

## 3. Marquee de reseñas justo después de la galería (donde estaban las miniaturas)
Nuevo `MarqueeResenas`: tarjetas grandes (ancho ~300px) desplazándose de derecha a izquierda con `.animate-marquee` (ya existe en `app/globals.css`; pista duplicada como en `components/landing/ReviewsMarquee.tsx`). Cada tarjeta: 5 estrellas ámbar, la cita entre comillas, y abajo avatar circular (placeholder gris con inicial), nombre y un sello de verificado (`BadgeCheck` de lucide). Fuente: `RESENAS_ECOGEL` (placeholders). Si `placeholder`, la tarjeta lleva borde punteado y la etiqueta pequeña "Ejemplo".

## 4. "Qué es y cómo funciona": 3 párrafos antes del CTA
En `CajaCompra`, después de los 4 beneficios y antes del reencuadre de precio, un bloque de texto de 3 párrafos por segmento (nuevo campo `queEs: [string, string, string]` en `EcogelConfig`):
- Hogar: (1) *EcoGel es un cebo en gel para cucarachas: no las espanta, las atrae. Se aplica en puntos del tamaño de un grano de arroz en las rendijas donde viven, y ellas lo comen.* (2) *Actúa con retardo: la que come vuelve al nido y contamina a las demás. Por eso en 24-48 horas ves las primeras caer y en 1-2 semanas desaparece la colonia, no solo la que viste.* (3) *Lleva Bitrex, el amargante más potente que existe: si un niño o una mascota lo toca con la boca, lo escupe. Sin olor, sin vapores, sin salir de la casa.*
- Restaurantes: (1) *EcoGel es el cebo en gel que usamos en cocinas de restaurantes: se aplica en rendijas, bajo equipos y en zócalos, nunca sobre superficies de trabajo.* (2) *Actúa con retardo: la cucaracha que lo come vuelve al nido y contamina a la colonia. Primeros resultados en 24-48 horas, colonia completa en 1-2 semanas.* (3) *Sin olor, sin vapores y sin cerrar: diez minutos después del cierre, con la cocina apagada, y al día siguiente abres normal. Registro sanitario INVIMA 2009V0004964.*
El tercer párrafo en cursiva, como el aviso de Lummia.

## 5. CTA principal: "Comprar ahora — $X"
En `CajaCompra` el botón dice `Comprar ahora — {money(total)}`.

## 6. "Aprende a usarlo con AGROINCOL" después de la garantía
Nueva sección `AprendeAUsarlo` entre `BloqueGarantia` y `Objeciones`: título "Aprende a usarlo con AGROINCOL", subtítulo "Spoiler: son diez minutos", y 3 `Marcador` verticales (`ratio="portrait"`) en fila (grid de 3 en móvil, con scroll horizontal si no caben): "1 · Dónde aplicar (video 20 s)", "2 · Cuánto poner (video 20 s)", "3 · Qué esperar los primeros días (video 20 s)". Cada marcador con un ícono de play (`Play` de lucide) centrado encima del marcador.

## 7. Orden nuevo bajo el fold
Galería → **MarqueeResenas** → CajaCompra (con queEs) → BloqueGarantia → **AprendeAUsarlo** → Objeciones → AntesDespues (**+ tarjeta de reseña debajo**, ver §9) → Autoridad (rediseñada, §10) → Beneficios → Casos → Comparativa → SinRiesgo → PreguntasEcogel → Resenas (rediseñada, §11) → PieEcogel.

## 8. WhatsApp flotante y barra sticky nueva
- Nuevo `WhatsAppFlotante` (cliente): botón circular verde `#25D366` fijo abajo a la derecha (`fixed right-4 bottom-[calc(env(safe-area-inset-bottom)+96px)] z-50`, 56px), visible en toda la página y también en `/pedido` y `/gracias`. Texto de WhatsApp = `config.whatsappTexto`.
- `BarraSticky`: a la izquierda tres pastillas circulares "1" "2" "3" (la activa con borde `brand-green` y fondo `brand-green/10`; cambiarlas cambia el tier, como el selector) y a la derecha un botón grande que ocupe el resto (`flex-1`, `py-4`, `rounded-full`, `bg-brand-orange`) que dice **"Comprar ahora"**. Debajo del botón, en una línea de 11px centrada: `{unidades} unidades · {money(total)}`. Sigue `lg:hidden`.

## 9. Antes/después con la reseña de la persona debajo
`AntesDespues` recibe además una reseña (`ResenaEcogel`) y la pinta debajo de las dos fotos como tarjeta: 5 estrellas, un titular corto en negrita (nuevo campo opcional `titulo?: string` en `ResenaEcogel`, placeholder "Ejemplo: Se acabaron de verdad"), la cita, y nombre + sello verificado. Usa `RESENAS_ECOGEL[0]`.

## 10. Autoridad: figura de prueba social configurable
`Autoridad` pasa a ser el bloque de Lummia "Aida Victoria la ama tanto…": fondo claro, pastilla arriba ("Recomendado por"), título grande de dos líneas, 2 marcadores verticales de video en fila, y debajo una tarjeta de perfil: avatar circular (placeholder), nombre, `@usuario`, sello verificado. Los datos salen de un nuevo objeto `FIGURA` en `lib/ecogel.ts` con `placeholder: true`: `{ nombre: 'Nombre de la figura', usuario: '@usuario', titulo: 'Lo probó en su casa y lo recomienda', placeholder: true }`. Mientras `placeholder` sea true, la tarjeta lleva la etiqueta visible "Placeholder: figura de autoridad por definir". El bloque actual de "41 años · +N restaurantes" NO se pierde: pasa a ser una franja compacta debajo de la tarjeta (`bg-brand-green`, texto blanco, dos líneas), con su aviso de `+N`.

## 11. Reseñas al final, estilo Lummia
`Resenas`: (a) resumen con promedio grande, estrellas y distribución (igual que hoy); (b) fila horizontal de 5 `Marcador` cuadrados pequeños ("Foto de cliente 1..5 · UGC") con scroll horizontal; (c) chips de palabras ("Excelente", "Recomendado", "Sin olor", "Fácil", "Funciona", "Rápido") como en Lummia; (d) la lista de reseñas, cada una con **fecha** arriba (nuevo campo `fecha: string` en `ResenaEcogel`, placeholder "2026-09-01"), nombre + sello verificado, texto, y un `Marcador` cuadrado de 240px "Foto enviada por el cliente"; (e) la línea "Reseñas recogidas por WhatsApp después de la entrega". Las placeholders siguen con borde punteado y etiqueta.

## Verificación
`npm run lint && npm run build && npm test` (20/20). En navegador móvil 390×844: el carrusel se desliza y los puntos cambian; el marquee rota; el sticky muestra "Comprar ahora" grande y cambiar la pastilla "1" actualiza el precio; el WhatsApp flotante está abajo a la derecha en hogar, restaurantes, pedido y gracias; el orden de secciones es el de §7.
