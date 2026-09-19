# EcoGel: landings de producto y checkout — diseño

Fecha: 2026-09-19. Estado: aprobado por Camilo (chat, misma fecha).

## 1. Qué se construye y por qué

Nueva unidad de e-commerce: venta nacional por Meta de **EcoGel** (cebo en gel
para cucarachas, jeringa 5 g, Mylva España, INVIMA 2009V0004964). Dos públicos,
dos landings con el mismo esqueleto y distinto copy:

- **Hogar** — madres con infestación severa en la cocina. Miedo central:
  seguridad de niños y mascotas; dolor: vergüenza y comida perdida.
- **Restaurantes** — dueño del local. Miedo central: sanidad y clientes que no
  vuelven; dolor: cerrar para fumigar.

La estructura de la página es una **ingeniería inversa de la página de producto
de Lummia** (lummia.com.co, IPL Pro y LummiAir), sección por sección, adaptada
al ticket y al producto. No se toma nada de ninguna otra página. Lo que Lummia
hace y aquí no aplica (cuotas Addi, devolución del dinero a 90 días, checkout
de 9 campos, variantes de color, influencers) se reemplaza por su equivalente
para un consumible de $39.900 vendido por una fumigadora con 40 años.

### Economía que la página tiene que respetar

| Unidades | Producto | Envío al cliente | Margen neto | CPA máximo |
|---|---|---|---|---|
| 1 | $39.900 | $20.000 | $26.000 | $16.900 |
| 2 | $79.800 | $10.000 | $42.000 | $27.300 |
| 3 | $119.700 | gratis | $58.000 | $37.700 |

Costo $13.900/u. Objetivo: **≥ 1,8 unidades por pedido**. El tier de 1 unidad
entra en pérdida si el rechazo contraentrega supera 17,5 %. De ahí dos
decisiones no negociables de la página:

1. **El selector de cantidad preselecciona 3 unidades** y las marca "Más
   vendido · envío gratis". Es el elemento más importante de la página.
2. **Pago en línea = $5.000 menos por pedido.** El rechazo esperado en
   contraentrega (15-25 % × ~$20.000 de ida y vuelta) cuesta $3.000-5.000 por
   pedido; el descuento es neutro para el margen y mueve al cliente al pago
   anticipado, que es la prioridad.

### Garantía (nacional, sin visita)

AGROINCOL solo opera en Santander, así que la garantía no puede ser una
visita. Es **reposición gratis a 30 días**: "Si en 30 días siguen, te enviamos
otro kit sin costo". Se reclama por WhatsApp con foto. Costo por reclamo:
$13.900 + envío, no el ticket completo.

## 2. Rutas

Segmento nuevo `app/ecogel/`, con `layout.tsx` propio que monta `MetaPixel` y
`PostHogInit` exactamente como `app/lp/layout.tsx` (mismo pixel, misma razón:
medición aislada del sitio orgánico). Todas las páginas llevan
`robots: { index: false, follow: false }`.

| Ruta | Qué es |
|---|---|
| `/ecogel` | redirect 307 a `/ecogel/hogar` |
| `/ecogel/hogar` | página de producto, copy hogar |
| `/ecogel/restaurantes` | página de producto, copy restaurantes |
| `/ecogel/pedido` | checkout de una página. Query: `u` (1-3), `de` (hogar/restaurantes) |
| `/ecogel/gracias` | confirmación. Query: `pedido` (id), `estado` (`cod` / `approved` / `pending` / `failure`) |
| `POST /api/ecogel/pedido` | crea el pedido |
| `POST /api/ecogel/mp` | webhook de Mercado Pago |

## 3. Página de producto — secciones en orden (calco de Lummia)

Todo vive en `components/ecogel/`, alimentado por `lib/ecogel.ts`
(`EcogelConfig` con una constante `HOGAR` y otra `RESTAURANTES`, mismo patrón
que `LandingConfig`). Un solo `EcogelPage` recibe la config y pinta esto, en
este orden, sin secciones opcionales:

| # | Lummia | EcoGel | Componente |
|---|---|---|---|
| 1 | Barra "Envío gratis a todo Colombia" | `Envío gratis desde 3 unidades · Paga en línea o al recibir` | `BarraPromo` |
| 2 | Logo + carrito | Logo AGROINCOL + botón WhatsApp. Sin menú: es una landing de pauta | `CabeceraEcogel` |
| 3 | Galería con sello "90 días" | Galería con miniaturas y sello `Garantía 30 días · reposición gratis`. Imágenes: placeholders (ver §7) | `Galeria` |
| 4 | Sticky inferior "Compra Ahora" | Sticky inferior con tier elegido y precio: `Pedir 3 — $119.700`. Solo en móvil (`lg:hidden`). Visible desde el primer píxel | `BarraSticky` |
| 5 | H1 promesa + plazo | Hogar: *Cocina sin cucarachas en 48 horas, sin fumigar ni salir de casa*. Restaurantes: *Cero cucarachas en tu cocina antes de la próxima visita de sanidad* | `CajaCompra` |
| 6 | Precio + ancla tachada + pastilla "$100.000 OFF" | Precio del tier + pastilla en pesos: 3u → `$119.700` + `Envío gratis · ahorras $20.000`; 2u → `$79.800 + $10.000 envío` + `ahorras $10.000 de envío`; 1u → `$39.900 + $20.000 envío` | `CajaCompra` |
| 7 | ★★★★★ 3015 reseñas | Estrellas + contador. Mientras no haya reseñas reales, muestra el estado placeholder (§7) | `CajaCompra` |
| 8 | Caja Addi (cuotas) | **Selector 1 / 2 / 3** en tarjetas; la de 3 con etiqueta `MÁS VENDIDO` y preseleccionada. Cambiarlo actualiza precio, pastilla, CTA y sticky | `SelectorTier` |
| 9 | 4 beneficios con ícono | Hogar: Seguro con niños y mascotas (lleva Bitrex) · Sin olor, sin desalojar · Primeros resultados en 24-48 h · Elimina la colonia, no solo la que ves. Restaurantes: Sin cerrar el local · Apto para zona de alimentos · Actúa en 24-48 h · Registro INVIMA | `CajaCompra` |
| 10 | "Pagas lo mismo que 1 sesión de láser" | Hogar: *Menos que el mercado que botas por una infestación*. Restaurantes: *Menos que un cliente que ve una cucaracha y no vuelve* | `CajaCompra` |
| 11 | CTA "Compra Ahora — $549.900" + logos de pago | `Pedir ahora — $119.700` (link a `/ecogel/pedido?u=3&de=hogar`) + fila PSE · Nequi · Tarjeta · Contraentrega | `CajaCompra` |
| 12 | 3 chips | Garantía 30 días · Envío 2-4 días hábiles · 40 años en control de plagas | `CajaCompra` |
| 13 | Bloque "Resultados en 90 días o devolvemos tu dinero" | *Si en 30 días siguen, te enviamos otro kit sin costo* + una línea de cómo reclamar | `BloqueGarantia` |
| 14 | Antes / después | Placeholder de dos fotos | `AntesDespues` |
| 15 | FAQ de 5 objeciones (acordeón, pantalla 3) | ¿Es seguro con niños y mascotas? · ¿Cuándo hace efecto? · ¿Cuánto rinde una jeringa? · ¿Y si no funciona? · ¿Cómo se aplica? (placeholder de video) | `Objeciones` |
| 16 | Citas de influencers | **Autoridad propia:** `40 años · +N restaurantes atendidos en Santander` + foto del equipo aplicando (placeholder) + dos líneas de por qué este gel es el que usan | `Autoridad` |
| 17 | "Lo que puede hacer por ti" (4 bloques) | 4 bloques largos, copy por ICP | `Beneficios` |
| 18 | Casos de uso `Nombre, edad · Problema principal · cita` | `Nombre, ciudad · Problema: … · cita`. Placeholders (§7) | `Casos` |
| 19 | "1 solo dispositivo" + tabla vs Otras marcas / Láser / Rastrillo / Cera | Tabla: **Gel AGROINCOL** vs Aerosol vs Trampas vs Otros geles. Filas: elimina la colonia · sin olor · seguro con niños/mascotas · sin desalojar · dura semanas. La fumigación **no** entra: es el servicio de la casa y la página lo dice en el FAQ ("infestación severa → fumigación") | `Comparativa` |
| 20 | "Pruébala sin riesgo" | Garantía explicada + pasos para reclamarla por WhatsApp | `SinRiesgo` |
| 21 | FAQ larga | 8 preguntas (las 5 de objeciones + envío, pago, reclamos) | `LandingFAQ` existente, reutilizado |
| 22 | Widget 4.9 + distribución de estrellas + "Reviews por WhatsApp" | Mismo widget. Placeholder hasta tener reseñas | `Resenas` |
| 23 | Footer con "Pagos aceptados" | Footer con logos de pago + datos legales | `PieEcogel` |

Estilo: paleta y tipografía del sitio (`brand.*` de `tailwind.config.ts`),
mobile-first, sin animaciones de entrada (el H1 tiene que estar en el primer
frame, igual que en `LandingHero`).

## 4. Checkout `/ecogel/pedido`

Una sola página, sin carrito ni cuenta. De arriba abajo:

1. **Selector de tier** (el mismo `SelectorTier`, editable) con resumen:
   producto, envío, descuento por pago en línea, total.
2. **Datos de entrega**, 7 campos: nombre completo, celular (10 dígitos que
   empiezan por 3), correo, dirección, barrio, ciudad, departamento (select con
   los 32 + Bogotá D.C.). Correo es **obligatorio si paga en línea** (Mercado
   Pago lo exige) y opcional en contraentrega. Casilla "Recibir ofertas por
   correo" **pre-marcada** (patrón Lummia; sin popups en ninguna página).
3. **Método de pago**, radio:
   - `Pagar ahora — PSE, Nequi, tarjeta · $5.000 menos` **(preseleccionado)**
   - `Pagar al recibir · solo efectivo`
4. Botón `Confirmar pedido — $114.700` (el total refleja el método elegido).
5. Línea legal: "Al confirmar aceptas que te contactemos por WhatsApp para
   coordinar la entrega."

Validación en cliente (mensajes en español, por campo) y la misma validación en
el servidor. Sin librerías de formularios: es un formulario controlado como
`LeadForm`.

### `POST /api/ecogel/pedido`

Entrada: tier, datos de entrega, método, `de`, `eventId`, `fbp`, `fbc`,
`externalId`, `url`. Pasos, en este orden:

1. Validar. Total se **recalcula en el servidor** desde `lib/ecogel.ts`; nunca
   se confía en el precio que manda el navegador.
2. Generar `pedidoId`: `EG-` + fecha `yymmdd` + 4 caracteres aleatorios en
   mayúscula. Legible por teléfono.
3. Escribir la fila en la hoja **"Pedidos EcoGel"** (§5) con
   `estado = 'pendiente_pago'` (online) o `'confirmar'` (contraentrega).
4. Enviar **Purchase** a Meta por CAPI con el `eventId` recibido, `value` =
   total del pedido, `currency` COP, `num_items` = unidades,
   `content_ids: ['ecogel']`, `content_category: 'ecogel-<de>'`. Se envía en
   ambos métodos al crear el pedido (así lo hace Shopify/Lummia; es la señal
   que Meta necesita para optimizar). La verdad de entregado/rechazado vive en
   la hoja, no en Meta.
5. Si es contraentrega: responder `{ pedidoId, ir: '/ecogel/gracias?pedido=…&estado=cod' }`.
6. Si es online: crear la preferencia en Mercado Pago (§6) y responder
   `{ pedidoId, ir: <init_point> }`.

Si la hoja falla, el pedido **no** se pierde: se responde igual, se registra el
error y el correo de aviso no sale. Si Mercado Pago falla, se responde 502 con
mensaje y el formulario ofrece cambiar a contraentrega sin volver a escribir.

## 5. Hoja "Pedidos EcoGel"

Hoja nueva, separada de la de leads (son negocios distintos y la de leads tiene
la lógica de cierre). Mismo mecanismo: Apps Script con `doPost`, secreto
compartido, 302 como respuesta normal, correo de aviso tras escribir. Variables:
`HOJA_PEDIDOS_URL`, `HOJA_PEDIDOS_SECRETO`.

Columnas (las editables primero, como en la de leads):

```
estado · guia · fecha · pedidoId · unidades · producto · envio · descuento · total
· metodoPago · nombre · celular · correo · direccion · barrio · ciudad · departamento
· ofertas · origen · ip · eventId · fbp · fbc · externalId · navegador · url · mpPagoId
```

`estado` toma: `confirmar` (COD nuevo) · `pendiente_pago` · `pagado` ·
`pago_fallido` · `despachado` · `entregado` · `rechazado`. Los tres últimos los
pone el equipo a mano; `pagado`/`pago_fallido` los pone el webhook. `guia` es
el número de la transportadora, a mano.

El script acepta dos acciones: `{ accion: 'crear', fila }` y
`{ accion: 'actualizar', pedidoId, cambios }` (busca la fila por `pedidoId` y
escribe solo las columnas enviadas). El script completo y las instrucciones van
en `docs/hoja-de-pedidos.md`, hermano de `docs/hoja-de-leads.md`.

## 6. Mercado Pago (Checkout Pro)

`lib/mercadopago.ts`, sin SDK: un `fetch` a
`POST https://api.mercadopago.com/checkout/preferences` con
`Authorization: Bearer ${MP_ACCESS_TOKEN}`. Cuerpo:

```
items: [{ id: 'ecogel', title: 'EcoGel x3 — AGROINCOL', quantity: 1,
          unit_price: <total ya con envío y descuento>, currency_id: 'COP' }]
payer: { name, email, phone: { number } }
external_reference: pedidoId
notification_url: https://agroincol.com/api/ecogel/mp
back_urls: { success|pending|failure: https://agroincol.com/ecogel/gracias?pedido=…&estado=… }
auto_return: 'approved'
statement_descriptor: 'AGROINCOL'
```

Un solo ítem con el total: el desglose vive en la hoja, no en Mercado Pago, y
así el descuento y el envío no necesitan reglas de la pasarela.

### Webhook `POST /api/ecogel/mp`

Mercado Pago llama con `type=payment` y `data.id`. **No se confía en el cuerpo:**
el servidor consulta `GET /v1/payments/{id}` con el token y solo actúa con lo
que responde la API. Eso es la autenticación: quien no tenga el token no puede
fabricar un pago aprobado. Con `status = approved` → hoja `actualizar`
`{ estado: 'pagado', mpPagoId }`; con `rejected`/`cancelled` →
`estado: 'pago_fallido'`. Responde 200 siempre que el `id` exista, para que
Mercado Pago no reintente eternamente. Idempotente: actualizar dos veces deja
el mismo resultado.

`MP_ACCESS_TOKEN` ya está en Vercel Production como variable *sensitive* y en
`.env.local`. No hay token de prueba cargado: el desarrollo crea preferencias
reales y verifica el redirect; la prueba de pago de punta a punta se hace con
un pedido real de $1.000 que luego se reembolsa desde el panel.

## 7. Placeholders

La regla del repo (`lib/reviews.ts`, `Testimonials.tsx`): **nunca inventar
testimonios**. Se respeta así:

- **Imágenes:** componente `Marcador` que pinta un recuadro punteado en crema
  con el encuadre esperado y las medidas ("Gel aplicándose en la rendija de
  una cocina · 1200×1200"). Cuando exista el archivo en
  `public/ecogel/<nombre>` se pinta la imagen; la detección usa
  `publicFileExists`, como en `LandingHero`.
- **Reseñas y casos:** `lib/ecogel-resenas.ts` exporta `RESENAS_ECOGEL` con
  `placeholder: true` en cada entrada de ejemplo. Toda entrada con
  `placeholder` se pinta con borde punteado y etiqueta visible
  **"Ejemplo — reemplazar por reseña real"**, y el widget de calificación
  muestra "Calificación de ejemplo". Nada de esto se quita con un flag: se
  quita reemplazando las entradas por reseñas reales.
- **Regla de pauta:** no se envía tráfico pago a estas páginas mientras haya
  placeholders visibles. Queda escrito en `docs/hoja-de-pedidos.md`.

## 8. Medición (Meta)

`lib/meta/eventos.ts` pasa de 3 a 6 eventos: `PageView`, `Lead`, `Contact`,
`ViewContent`, `InitiateCheckout`, `Purchase`. `VALOR_MAXIMO` se mantiene
(5.000.000 cubre cualquier pedido).

| Dónde | Evento | Pixel | CAPI | Datos |
|---|---|---|---|---|
| Landing | `PageView` + `ViewContent` | sí | sí (vía `/api/meta`, como hoy) | `content_ids: ['ecogel']`, `content_category`, `value` del tier por defecto |
| `/pedido` | `InitiateCheckout` | sí | sí | `value`, `num_items` |
| `/api/ecogel/pedido` + `/gracias` | `Purchase` | sí, en `/gracias` con el `eventId` del pedido | sí, desde la API con el mismo `eventId` | `value`, `currency`, `num_items`, `content_ids` |

`/api/meta` hoy acepta solo `PageView` y `Contact` sin PII; `ViewContent` e
`InitiateCheckout` entran por la misma puerta con la misma regla (sin PII).
`Purchase` solo sale desde `/api/ecogel/pedido`, con `em`/`ph`/`fn`/`ln`
hasheados como hace `/api/contact` con `Lead`.

Clics a WhatsApp siguen siendo `Contact` con `content_category: 'ecogel-<de>'`.

## 9. Página `/ecogel/gracias`

Lee `pedido` y `estado`:

- `cod` → "Pedido `EG-…` recibido. Te escribimos por WhatsApp para confirmar la
  dirección; llega en 2-4 días hábiles y pagas en efectivo al recibir." +
  botón a WhatsApp con el id prellenado.
- `approved` → "Pago recibido. Pedido `EG-…` sale en 24 h." + WhatsApp.
- `pending` → "Tu pago está en proceso (PSE puede tardar). Te avisamos por
  correo." + WhatsApp.
- `failure` → "El pago no se completó. Puedes intentar de nuevo o pedir
  contraentrega." + botón a WhatsApp con el id; el equipo lo resuelve a mano.

Dispara `Purchase` por Pixel solo en `cod` y `approved`, con el `eventId`
guardado en `sessionStorage` por el checkout (así Pixel y CAPI deduplican).

## 10. Pruebas

El repo no tiene runner. Se agrega el mínimo: `tsx` como devDependency y
`"test": "node --import tsx --test 'lib/**/*.test.ts' 'app/api/ecogel/**/*.test.ts'"`.
Se prueba lo que tiene lógica y no depende de red:

- `lib/ecogel.ts`: precio, envío, descuento y total por tier y método; que el
  total nunca dependa de datos del cliente.
- Validación del pedido (celular, correo condicional, tier fuera de rango,
  departamento inválido).
- `lib/mercadopago.ts`: construcción de la preferencia (URLs de retorno,
  `external_reference`, un solo ítem con el total).
- Webhook: mapeo `status` → `estado` e idempotencia (con `fetch` inyectado).

Lo demás se verifica con `npm run build`, `npm run lint` y una pasada manual en
móvil de las dos landings, el checkout en ambos métodos y `/gracias` en sus
cuatro estados.

## 11. Fuera de alcance

Cuenta de cliente, carrito, upsell post-compra, cupones, integración con
transportadora (se despacha desde la hoja), Mercado Libre, ERP, indexación
orgánica, reseñas reales y fotos reales (llegan después y solo reemplazan
placeholders).

## 12. Pendientes que no son código

- Crear la hoja "Pedidos EcoGel" y pegar el script (`docs/hoja-de-pedidos.md`);
  cargar `HOJA_PEDIDOS_URL` y `HOJA_PEDIDOS_SECRETO` en Vercel.
- Renovar el Access Token de Mercado Pago al cerrar la integración y cargarlo
  directo en Vercel (quedó pegado en un chat).
- Confirmar el número real de restaurantes atendidos para el bloque de
  autoridad; hasta entonces el copy dice "+N" como placeholder visible.
- Fotos: gel en uso, producto, antes/después, equipo. Reseñas reales.
