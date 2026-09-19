# EcoGel: landings de producto y checkout — plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dos landings de producto (`/ecogel/hogar`, `/ecogel/restaurantes`) calcadas de la página de producto de Lummia, con checkout de una página (contraentrega y Mercado Pago), pedidos en una hoja de Google Sheets y eventos `ViewContent` / `InitiateCheckout` / `Purchase` hacia Meta.

**Architecture:** Segmento nuevo `app/ecogel/` con layout propio que monta el Pixel y PostHog (como `app/lp/`). Un solo árbol de componentes en `components/ecogel/` alimentado por `lib/ecogel.ts` (config por ICP + tiers de precio). El estado del tier elegido vive en un contexto de React compartido por el selector, la caja de compra y la barra sticky. El servidor recalcula siempre el total; la hoja es la base de datos; Mercado Pago se integra con `fetch` directo (sin SDK); el webhook confía solo en lo que responde la API de Mercado Pago.

**Tech Stack:** Next.js 14 (App Router, TypeScript, Tailwind), `lucide-react`, Google Apps Script (hoja), Mercado Pago Checkout Pro (REST), Meta Pixel + Conversions API (módulos existentes en `lib/meta/`), `node:test` + `tsx` para pruebas.

**Spec:** `docs/superpowers/specs/2026-09-19-ecogel-landing-checkout-design.md`

## Global Constraints

- Precios exactos: 1u `$39.900` + envío `$20.000`; 2u `$79.800` + envío `$10.000`; 3u `$119.700` envío gratis. Descuento por pago en línea: `$5.000` por pedido. Costo unitario `$13.900` (no se muestra).
- El tier de **3 unidades va preseleccionado** y etiquetado "Más vendido".
- Garantía: "Si en 30 días siguen, te enviamos otro kit sin costo". Nunca "devolvemos tu dinero".
- **Nunca inventar testimonios.** Toda reseña/caso de ejemplo lleva `placeholder: true` y se pinta con etiqueta visible "Ejemplo — reemplazar por reseña real".
- Todas las páginas de `/ecogel` llevan `robots: { index: false, follow: false }`.
- Sin animaciones de entrada: el H1 está en el primer frame.
- El total del pedido se **recalcula en el servidor** desde `lib/ecogel.ts`; el precio que manda el navegador nunca se usa.
- Datos personales hacia Meta solo hasheados con `construirUserData` (`lib/meta/hash.ts`), y solo desde `/api/ecogel/pedido`.
- Nada de PII entra por `/api/meta`.
- Texto en español de Colombia, tuteo (la página habla de "tú", como Lummia; las landings de fumigación usan "usted", pero este es otro producto y otro público).
- No iterar `Map`/`Set` con `for..of` (el target de TypeScript no tiene `downlevelIteration`); usar `forEach`.
- Commits pequeños en la rama `feat/ecogel`. Cada commit termina con `Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>`.
- Verificación de cada tarea: `npm test` (cuando aplique), `npm run lint`, `npm run build`.

---

## Mapa de archivos

| Archivo | Responsabilidad |
|---|---|
| `lib/ecogel.ts` | Tiers, cálculo de totales, tipo `EcogelConfig`, constantes `HOGAR` y `RESTAURANTES` (todo el copy). Sin imports de Node. |
| `lib/ecogel.test.ts` | Pruebas de precios y totales. |
| `lib/ecogel-resenas.ts` | Reseñas y casos con `placeholder: true`. |
| `lib/ecogel-pedido.ts` | Tipo `Pedido`, `DEPARTAMENTOS`, `validarPedido`, `nuevoPedidoId`. Compartido por formulario y API. |
| `lib/ecogel-pedido.test.ts` | Pruebas de validación e id. |
| `lib/hoja-pedidos.ts` | `crearFilaPedido`, `actualizarFilaPedido` (Apps Script). |
| `lib/mercadopago.ts` | `construirPreferencia`, `crearPreferencia`, `consultarPago`. |
| `lib/mercadopago.test.ts` | Pruebas de construcción de preferencia y consulta. |
| `lib/meta/eventos.ts` | +3 eventos. |
| `lib/meta/pixel.ts` | `DatosEvento` gana `contenido`; `Purchase`/`InitiateCheckout` una vez por sesión. |
| `app/api/meta/route.ts` | Acepta categorías `ecogel-hogar` / `ecogel-restaurantes` y `contenido`. |
| `app/ecogel/layout.tsx` | Pixel + PostHog. |
| `app/ecogel/page.tsx` | Redirect a `/ecogel/hogar`. |
| `app/ecogel/hogar/page.tsx`, `app/ecogel/restaurantes/page.tsx` | Páginas de producto. |
| `app/ecogel/pedido/page.tsx` | Checkout. |
| `app/ecogel/gracias/page.tsx` | Confirmación. |
| `app/api/ecogel/pedido/route.ts` | Crea el pedido. |
| `app/api/ecogel/mp/route.ts` | Webhook de Mercado Pago. |
| `app/api/ecogel/mp/estado.ts` + `estado.test.ts` | Mapeo `status` → `estado` (puro, testeable). |
| `components/ecogel/TierContext.tsx` | Contexto del tier elegido. |
| `components/ecogel/Marcador.tsx` | Placeholder de imagen. |
| `components/ecogel/BarraPromo.tsx`, `CabeceraEcogel.tsx`, `Galeria.tsx`, `SelectorTier.tsx`, `CajaCompra.tsx`, `BarraSticky.tsx`, `BloqueGarantia.tsx` | Fold y caja de compra. |
| `components/ecogel/AntesDespues.tsx`, `Objeciones.tsx`, `Autoridad.tsx`, `Beneficios.tsx`, `Casos.tsx`, `Comparativa.tsx`, `SinRiesgo.tsx`, `PreguntasEcogel.tsx`, `Resenas.tsx`, `PieEcogel.tsx` | Secciones bajo el fold. |
| `components/ecogel/PaginaProducto.tsx` | Ensambla todo en el orden de Lummia. |
| `components/ecogel/RastreoVista.tsx` | `ViewContent` al cargar. |
| `components/ecogel/FormularioPedido.tsx` | Checkout (cliente). |
| `components/ecogel/RastreoCompra.tsx` | `Purchase` por Pixel en `/gracias`. |
| `docs/hoja-de-pedidos.md` | Apps Script de la hoja de pedidos e instrucciones. |
| `.env.example` | +`MP_ACCESS_TOKEN`, `HOJA_PEDIDOS_URL`, `HOJA_PEDIDOS_SECRETO`. |

---

### Task 1: Runner de pruebas y `lib/ecogel.ts` (tiers y totales)

**Files:**
- Modify: `package.json` (scripts + devDependency `tsx`)
- Create: `lib/ecogel.ts`
- Test: `lib/ecogel.test.ts`

**Interfaces:**
- Produces:
  - `type Unidades = 1 | 2 | 3`
  - `type MetodoPago = 'online' | 'contraentrega'`
  - `type Segmento = 'hogar' | 'restaurantes'`
  - `interface Tier { unidades: Unidades; producto: number; envio: number; etiqueta: string; masVendido: boolean }`
  - `const TIERS: readonly Tier[]`, `const TIER_POR_DEFECTO: Unidades = 3`, `const DESCUENTO_ONLINE = 5000`
  - `function tierDe(unidades: number): Tier` (lanza si no es 1-3)
  - `function esUnidades(v: unknown): v is Unidades`
  - `function totalPedido(unidades: Unidades, metodo: MetodoPago): { producto: number; envio: number; descuento: number; total: number }`
  - `function money(n: number): string` → `"$119.700"`
  - `interface EcogelConfig` y constantes `HOGAR`, `RESTAURANTES`, `configDe(segmento)`.

- [ ] **Step 1: Instalar tsx y definir el script de pruebas**

```bash
npm i -D tsx
```

En `package.json`, dentro de `"scripts"`, agregar:

```json
"test": "node --import tsx --test 'lib/**/*.test.ts' 'app/api/**/*.test.ts'"
```

- [ ] **Step 2: Escribir la prueba que falla**

Crear `lib/ecogel.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DESCUENTO_ONLINE, TIERS, TIER_POR_DEFECTO, esUnidades, money, tierDe, totalPedido } from './ecogel';

test('los tres tiers tienen los precios del spec', () => {
  assert.deepEqual(
    TIERS.map((t) => [t.unidades, t.producto, t.envio]),
    [
      [1, 39_900, 20_000],
      [2, 79_800, 10_000],
      [3, 119_700, 0],
    ],
  );
});

test('el tier por defecto es 3 y es el único "más vendido"', () => {
  assert.equal(TIER_POR_DEFECTO, 3);
  assert.deepEqual(TIERS.filter((t) => t.masVendido).map((t) => t.unidades), [3]);
});

test('contraentrega paga producto + envío sin descuento', () => {
  assert.deepEqual(totalPedido(1, 'contraentrega'), { producto: 39_900, envio: 20_000, descuento: 0, total: 59_900 });
  assert.deepEqual(totalPedido(3, 'contraentrega'), { producto: 119_700, envio: 0, descuento: 0, total: 119_700 });
});

test('pago en línea descuenta $5.000 por pedido', () => {
  assert.equal(DESCUENTO_ONLINE, 5_000);
  assert.deepEqual(totalPedido(2, 'online'), { producto: 79_800, envio: 10_000, descuento: 5_000, total: 84_800 });
  assert.equal(totalPedido(3, 'online').total, 114_700);
});

test('tierDe rechaza cantidades fuera de 1-3', () => {
  assert.throws(() => tierDe(0));
  assert.throws(() => tierDe(4));
  assert.equal(tierDe(2).unidades, 2);
});

test('esUnidades solo acepta 1, 2 o 3 numéricos', () => {
  assert.equal(esUnidades(3), true);
  assert.equal(esUnidades('3'), false);
  assert.equal(esUnidades(5), false);
});

test('money formatea en pesos colombianos', () => {
  assert.equal(money(119_700), '$119.700');
  assert.equal(money(0), '$0');
});
```

- [ ] **Step 3: Correr la prueba y verificar que falla**

Run: `npm test`
Expected: FAIL con `Cannot find module './ecogel'`.

- [ ] **Step 4: Implementar `lib/ecogel.ts`**

```ts
// Todo lo que las landings y el checkout de EcoGel necesitan saber del producto:
// precios, copy por público y garantía. Sin imports de Node: lo usan cliente y servidor.
//
// Los precios viven SOLO aquí. El servidor recalcula el total desde este archivo;
// lo que mande el navegador nunca se usa como precio.

import { BUSINESS } from './constants';

export type Unidades = 1 | 2 | 3;
export type MetodoPago = 'online' | 'contraentrega';
export type Segmento = 'hogar' | 'restaurantes';

export interface Tier {
  unidades: Unidades;
  /** Precio del producto, sin envío. */
  producto: number;
  /** Lo que paga el cliente por el envío. 0 = gratis. */
  envio: number;
  /** Texto corto bajo el número de unidades. */
  etiqueta: string;
  masVendido: boolean;
}

export const PRECIO_UNIDAD = 39_900;
export const ENVIO_BASE = 20_000;
/** Descuento por pedido cuando paga en línea: neutraliza el costo del rechazo contraentrega. */
export const DESCUENTO_ONLINE = 5_000;
export const TIER_POR_DEFECTO: Unidades = 3;

export const TIERS: readonly Tier[] = [
  { unidades: 1, producto: PRECIO_UNIDAD, envio: ENVIO_BASE, etiqueta: 'Para probar', masVendido: false },
  { unidades: 2, producto: PRECIO_UNIDAD * 2, envio: 10_000, etiqueta: 'Cocina + baños', masVendido: false },
  { unidades: 3, producto: PRECIO_UNIDAD * 3, envio: 0, etiqueta: 'Casa completa · envío gratis', masVendido: true },
];

export function esUnidades(valor: unknown): valor is Unidades {
  return valor === 1 || valor === 2 || valor === 3;
}

export function tierDe(unidades: number): Tier {
  const tier = TIERS.find((t) => t.unidades === unidades);
  if (!tier) throw new Error(`tier inválido: ${unidades}`);
  return tier;
}

export function totalPedido(unidades: Unidades, metodo: MetodoPago) {
  const tier = tierDe(unidades);
  const descuento = metodo === 'online' ? DESCUENTO_ONLINE : 0;
  return {
    producto: tier.producto,
    envio: tier.envio,
    descuento,
    total: tier.producto + tier.envio - descuento,
  };
}

export function money(n: number): string {
  return `$${n.toLocaleString('es-CO')}`;
}

// ---------------------------------------------------------------------------
// Copy por público
// ---------------------------------------------------------------------------

export interface Pregunta {
  pregunta: string;
  respuesta: string;
}

export interface Caso {
  nombre: string;
  ciudad: string;
  problema: string;
  cita: string;
  placeholder: boolean;
}

export interface EcogelConfig {
  segmento: Segmento;
  metaTitle: string;
  metaDescription: string;
  /** H1: promesa + plazo. */
  titulo: string;
  /** Línea bajo el H1. */
  subtitulo: string;
  /** 4 beneficios cortos con ícono (nombre de ícono de lucide). */
  beneficios: { icono: 'ShieldCheck' | 'Wind' | 'Timer' | 'Bug' | 'Store' | 'Utensils' | 'FileCheck'; texto: string }[];
  /** "Pagas lo mismo que…" de Lummia. */
  reencuadre: string;
  /** 5 objeciones en acordeón, pantalla 3. */
  objeciones: Pregunta[];
  /** 4 bloques largos. */
  beneficiosLargos: { titulo: string; texto: string }[];
  /** FAQ larga, al final. */
  preguntas: Pregunta[];
  /** Texto con el que abre WhatsApp. */
  whatsappTexto: string;
}

export const GARANTIA = {
  titulo: 'Si en 30 días siguen, te enviamos otro kit sin costo',
  texto: 'Nos escribes por WhatsApp con una foto y te despachamos la reposición. Sin formularios ni devoluciones.',
  dias: 30,
} as const;

export const AUTORIDAD = {
  anios: new Date().getFullYear() - BUSINESS.founded,
  /** PLACEHOLDER: confirmar con Camilo el número real antes de pautar. */
  restaurantes: '+N',
} as const;

const OBJECIONES_COMUNES: Pregunta[] = [
  {
    pregunta: '¿Cuándo hace efecto?',
    respuesta:
      'Las primeras cucarachas caen en 24-48 horas. Como el gel actúa con retardo, cada una que lo come contamina a las demás en el nido: la colonia completa cae en 1-2 semanas.',
  },
  {
    pregunta: '¿Cuánto rinde una jeringa?',
    respuesta:
      'Una jeringa de 5 g alcanza para una cocina y un baño (unos 30-40 puntos del tamaño de un grano de arroz). Para una casa completa o una infestación fuerte recomendamos 3.',
  },
  {
    pregunta: '¿Y si no funciona?',
    respuesta: `${GARANTIA.titulo}. ${GARANTIA.texto}`,
  },
  {
    pregunta: '¿Cómo se aplica?',
    respuesta:
      'Puntos pequeños en rendijas, detrás de la nevera y la estufa, bajo el lavaplatos y en las esquinas de los gabinetes. Sin desalojar, sin tapar comida, sin olor. Con el pedido llega la guía paso a paso.',
  },
];

const PREGUNTAS_ENVIO_PAGO: Pregunta[] = [
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta: '2 a 4 días hábiles a todo Colombia por transportadora. Te enviamos la guía por WhatsApp.',
  },
  {
    pregunta: '¿Cómo puedo pagar?',
    respuesta:
      'En línea con PSE, Nequi o tarjeta (con $5.000 de descuento) o en efectivo al recibir el paquete.',
  },
  {
    pregunta: '¿Cómo reclamo la garantía?',
    respuesta:
      'Si a los 30 días siguen viendo cucarachas, nos escribes por WhatsApp con una foto y te enviamos otro kit sin costo.',
  },
];

export const HOGAR: EcogelConfig = {
  segmento: 'hogar',
  metaTitle: 'EcoGel: cocina sin cucarachas en 48 horas | AGROINCOL',
  metaDescription:
    'Gel profesional para cucarachas, seguro con niños y mascotas. Envío a todo Colombia, paga en línea o al recibir. Garantía de 30 días.',
  titulo: 'Cocina sin cucarachas en 48 horas, sin fumigar ni salir de casa',
  subtitulo: 'El mismo gel que usamos en nuestras fumigaciones, en una jeringa que aplicas tú en 10 minutos.',
  beneficios: [
    { icono: 'ShieldCheck', texto: 'Seguro con niños y mascotas: lleva Bitrex' },
    { icono: 'Wind', texto: 'Sin olor, sin desalojar, sin tapar la comida' },
    { icono: 'Timer', texto: 'Primeros resultados en 24-48 horas' },
    { icono: 'Bug', texto: 'Elimina la colonia, no solo la que ves' },
  ],
  reencuadre: 'Menos que el mercado que botas por una infestación',
  objeciones: [
    {
      pregunta: '¿Es seguro con niños y mascotas?',
      respuesta:
        'Sí. Lleva Bitrex, la sustancia más amarga que existe: si un niño o una mascota lo toca con la boca, lo escupe de inmediato. Se aplica en rendijas donde ellos no llegan, y no hay olor ni vapores.',
    },
    ...OBJECIONES_COMUNES,
  ],
  beneficiosLargos: [
    {
      titulo: 'Ataca el nido, no la cucaracha que viste',
      texto:
        'El aerosol mata la que sale y deja las 40 que están detrás de la nevera. El gel se lo llevan al nido y lo comparten: cae la colonia completa.',
    },
    {
      titulo: 'Sin olor y sin salir de la casa',
      texto:
        'No tienes que tapar la comida, sacar a los niños ni ventilar. Aplicas los puntos y sigues con tu día.',
    },
    {
      titulo: 'Diez minutos, una vez',
      texto:
        'Puntos del tamaño de un grano de arroz en los lugares que te indica la guía. El gel sigue actuando semanas después.',
    },
    {
      titulo: 'Respaldo de una fumigadora de verdad',
      texto: `Lo aplicamos hace ${new Date().getFullYear() - BUSINESS.founded} años en casas y restaurantes. No es un producto de importador: es lo que usan nuestros técnicos.`,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Es seguro con niños y mascotas?',
      respuesta:
        'Sí. Lleva Bitrex, la sustancia más amarga que existe, y se aplica en rendijas donde ellos no llegan. Sin olor ni vapores.',
    },
    ...OBJECIONES_COMUNES,
    ...PREGUNTAS_ENVIO_PAGO,
    {
      pregunta: '¿Y si la infestación es muy grande?',
      respuesta:
        'Si ves cucarachas de día o en varias habitaciones, el gel ayuda pero lo honesto es una fumigación profesional. Escríbenos y te decimos cuál es tu caso.',
    },
  ],
  whatsappTexto: 'Hola, tengo una pregunta sobre EcoGel para mi casa',
};

export const RESTAURANTES: EcogelConfig = {
  segmento: 'restaurantes',
  metaTitle: 'EcoGel: cero cucarachas en tu cocina antes de sanidad | AGROINCOL',
  metaDescription:
    'Gel profesional para cucarachas apto para zona de alimentos, con registro INVIMA. Sin cerrar el local. Envío a todo Colombia.',
  titulo: 'Cero cucarachas en tu cocina antes de la próxima visita de sanidad',
  subtitulo: 'El gel que usamos en restaurantes, sin cerrar el local ni parar la cocina.',
  beneficios: [
    { icono: 'Store', texto: 'Sin cerrar el local ni parar un turno' },
    { icono: 'Utensils', texto: 'Apto para zona de alimentos: sin olor ni residuos' },
    { icono: 'Timer', texto: 'Actúa en 24-48 horas' },
    { icono: 'FileCheck', texto: 'Registro sanitario INVIMA 2009V0004964' },
  ],
  reencuadre: 'Menos que un cliente que ve una cucaracha y no vuelve',
  objeciones: [
    {
      pregunta: '¿Puedo aplicarlo con la cocina funcionando?',
      respuesta:
        'Sí. Se aplica en rendijas, bajo equipos y en zócalos, nunca sobre superficies de trabajo. No hay olor, no hay vapores y no hay que cerrar.',
    },
    ...OBJECIONES_COMUNES,
  ],
  beneficiosLargos: [
    {
      titulo: 'Lo que sanidad no debe encontrar',
      texto:
        'Una cucaracha en la inspección es un hallazgo crítico. El gel llega a las rendijas de los equipos donde el aerosol no entra y donde el inspector sí mira.',
    },
    {
      titulo: 'Sin cerrar ni un turno',
      texto:
        'Diez minutos después del cierre, con la cocina apagada. Al día siguiente abres normal.',
    },
    {
      titulo: 'Prevención, no solo emergencia',
      texto:
        'Un kit cada 2-3 meses en los puntos críticos mantiene la cocina limpia entre fumigaciones.',
    },
    {
      titulo: 'Respaldo de una fumigadora de verdad',
      texto: `Llevamos ${new Date().getFullYear() - BUSINESS.founded} años atendiendo restaurantes. Este es el gel que aplican nuestros técnicos.`,
    },
  ],
  preguntas: [
    {
      pregunta: '¿Puedo aplicarlo con la cocina funcionando?',
      respuesta: 'Sí. Va en rendijas y bajo equipos, nunca sobre superficies de trabajo. Sin olor ni vapores.',
    },
    ...OBJECIONES_COMUNES,
    ...PREGUNTAS_ENVIO_PAGO,
    {
      pregunta: '¿Sirve como plan de control de plagas para sanidad?',
      respuesta:
        'El gel es parte del control, no el plan completo. Sanidad pide un programa con registros y una empresa certificada. Si estás en Santander, nosotros lo hacemos; si no, te orientamos.',
    },
  ],
  whatsappTexto: 'Hola, tengo una pregunta sobre EcoGel para mi restaurante',
};

export function configDe(segmento: Segmento): EcogelConfig {
  return segmento === 'restaurantes' ? RESTAURANTES : HOGAR;
}

export function esSegmento(valor: unknown): valor is Segmento {
  return valor === 'hogar' || valor === 'restaurantes';
}

export function whatsappEcogel(texto: string): string {
  return `https://wa.me/${BUSINESS.phoneRaw.replace('+', '')}?text=${encodeURIComponent(texto)}`;
}
```

- [ ] **Step 5: Correr las pruebas y verificar que pasan**

Run: `npm test`
Expected: 7 pruebas PASS.

- [ ] **Step 6: Lint y commit**

```bash
npm run lint
git add package.json package-lock.json lib/ecogel.ts lib/ecogel.test.ts
git commit -m "feat(ecogel): tiers, totales y copy por público

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Eventos de compra en Meta (`ViewContent`, `InitiateCheckout`, `Purchase`)

**Files:**
- Modify: `lib/meta/eventos.ts:26` (lista de eventos)
- Modify: `lib/meta/pixel.ts` (`UNA_VEZ_POR_SESION`, `DatosEvento`, parámetros)
- Modify: `app/api/meta/route.ts` (categorías válidas + `contenido`)
- Modify: `lib/analitica/posthog.ts` (nada estructural: `NombreEvento` ya cubre los nuevos)

**Interfaces:**
- Produces:
  - `EVENTOS = ['PageView','Lead','Contact','ViewContent','InitiateCheckout','Purchase']`
  - `interface ContenidoEvento { ids: string[]; numItems?: number }`
  - `DatosEvento` gana `contenido?: ContenidoEvento`
  - `/api/meta` acepta `categoria` en `['chinches','comejen','ecogel-hogar','ecogel-restaurantes']` y `contenido: { ids: string[], numItems?: number }`.

- [ ] **Step 1: Ampliar la lista de eventos**

En `lib/meta/eventos.ts` reemplazar la constante y su comentario final:

```ts
/**
 * … (comentario existente sobre Lead y Contact) …
 *
 * Los tres de compra son del e-commerce de EcoGel (/ecogel): `ViewContent` en
 * la página de producto, `InitiateCheckout` al abrir el checkout y `Purchase`
 * al crear el pedido. `Purchase` sale por el servidor desde /api/ecogel/pedido
 * (lleva datos hasheados) y por el Pixel desde /ecogel/gracias, con el mismo
 * event_id.
 */
export const EVENTOS = ['PageView', 'Lead', 'Contact', 'ViewContent', 'InitiateCheckout', 'Purchase'] as const;
```

- [ ] **Step 2: Enseñarle al Pixel los parámetros de contenido**

En `lib/meta/pixel.ts`:

```ts
/** Eventos de conversión: uno por sesión y por visitante. PageView y ViewContent no. */
const UNA_VEZ_POR_SESION: NombreEvento[] = ['Lead', 'Contact', 'InitiateCheckout', 'Purchase'];

export interface ContenidoEvento {
  /** `content_ids` de Meta. Para EcoGel siempre ['ecogel']. */
  ids: string[];
  /** Unidades del pedido. */
  numItems?: number;
}

interface DatosEvento {
  valor?: number;
  categoria?: string;
  contenido?: ContenidoEvento;
  /**
   * Event id ya generado por otro lado (p. ej. el que guardó el checkout para
   * que /gracias dispare el Purchase con el mismo id que usó el servidor).
   */
  eventId?: string;
}
```

En `soloPixel`, reemplazar `const eventId = nuevoEventId();` por
`const eventId = datos.eventId ?? nuevoEventId();` y, tras `if (datos.categoria) …`, agregar:

```ts
  if (datos.contenido) {
    parametros.content_ids = datos.contenido.ids;
    parametros.content_type = 'product';
    if (datos.contenido.numItems !== undefined) parametros.num_items = datos.contenido.numItems;
  }
```

En `rastrear`, pasar también el contenido:

```ts
  enviarACapi('/api/meta', {
    evento,
    eventId,
    valor: saneaValor(datos.valor),
    categoria: datos.categoria,
    contenido: datos.contenido,
  });
```

- [ ] **Step 3: Aceptar las categorías y el contenido en `/api/meta`**

En `app/api/meta/route.ts`, extraer `contenido` del cuerpo junto a los demás campos y reemplazar el bloque de `categoriaValida`/`custom_data` por:

```ts
  // Lista cerrada: nada que venga del navegador llega crudo a Meta.
  const CATEGORIAS = ['chinches', 'comejen', 'ecogel-hogar', 'ecogel-restaurantes'];
  const categoriaValida =
    typeof categoria === 'string' && CATEGORIAS.includes(categoria) ? categoria : undefined;

  // content_ids solo puede ser 'ecogel' por ahora; num_items entre 1 y 3.
  let contenidoValido: { content_ids: string[]; content_type: 'product'; num_items?: number } | undefined;
  if (contenido && typeof contenido === 'object') {
    const { ids, numItems } = contenido as { ids?: unknown; numItems?: unknown };
    if (Array.isArray(ids) && ids.length === 1 && ids[0] === 'ecogel') {
      contenidoValido = { content_ids: ['ecogel'], content_type: 'product' };
      if (numItems === 1 || numItems === 2 || numItems === 3) contenidoValido.num_items = numItems;
    }
  }

  if (valorNumerico !== undefined || categoriaValida || contenidoValido) {
    datos.custom_data = {
      ...(valorNumerico !== undefined ? { value: valorNumerico, currency: MONEDA } : {}),
      ...(categoriaValida ? { content_category: categoriaValida } : {}),
      ...(contenidoValido ?? {}),
    };
  }
```

- [ ] **Step 4: Build y lint**

Run: `npm run lint && npm run build`
Expected: sin errores. (`registrarEnEmbudo` en `posthog.ts` ya acepta cualquier `NombreEvento`.)

- [ ] **Step 5: Commit**

```bash
git add lib/meta/eventos.ts lib/meta/pixel.ts app/api/meta/route.ts
git commit -m "feat(meta): eventos ViewContent, InitiateCheckout y Purchase

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Reseñas placeholder y marcador de imagen

**Files:**
- Create: `lib/ecogel-resenas.ts`
- Create: `components/ecogel/Marcador.tsx`

**Interfaces:**
- Produces:
  - `interface ResenaEcogel { nombre: string; ciudad: string; estrellas: 1|2|3|4|5; texto: string; placeholder: boolean }`
  - `const RESENAS_ECOGEL: ResenaEcogel[]`, `const CASOS_ECOGEL: Record<Segmento, Caso[]>`
  - `function resumenResenas(): { promedio: number; total: number; distribucion: Record<1|2|3|4|5, number>; esEjemplo: boolean }`
  - `<Marcador etiqueta="…" medidas="1200×1200" ratio="square"|"video"|"portrait" src?="/ecogel/x.jpg" alt?="…" prioridad?>` — pinta `next/image` si `src` existe en `/public` (lo decide quien lo llama con `publicFileExists`), si no, el recuadro punteado.

- [ ] **Step 1: Crear `lib/ecogel-resenas.ts`**

```ts
// Reseñas y casos de EcoGel.
//
// REGLA DEL REPO: nunca inventar testimonios (ver lib/reviews.ts). Todo lo que
// está aquí con `placeholder: true` es TEXTO DE EJEMPLO para diseñar la página
// y se pinta con una etiqueta visible que lo dice. No se quita con un flag: se
// quita reemplazando cada entrada por una reseña real, copiada textualmente.
// No se manda pauta mientras haya un solo placeholder visible.

import type { Caso, Segmento } from './ecogel';

export interface ResenaEcogel {
  nombre: string;
  ciudad: string;
  estrellas: 1 | 2 | 3 | 4 | 5;
  texto: string;
  placeholder: boolean;
}

export const RESENAS_ECOGEL: ResenaEcogel[] = [
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 5,
    texto: 'Ejemplo: "A los dos días dejé de ver cucarachas en la cocina. Fácil de aplicar y sin olor."',
    placeholder: true,
  },
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 5,
    texto: 'Ejemplo: "Lo usé detrás de la nevera y la estufa. En una semana no quedó ninguna."',
    placeholder: true,
  },
  {
    nombre: 'Nombre de ejemplo',
    ciudad: 'Ciudad',
    estrellas: 4,
    texto: 'Ejemplo: "Funcionó, aunque tardó más de lo que esperaba en los baños."',
    placeholder: true,
  },
];

export const CASOS_ECOGEL: Record<Segmento, Caso[]> = {
  hogar: [
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Cucarachas alemanas detrás de la nevera desde hace 3 meses',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Apartamento nuevo con cucarachas que venían del ducto',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Bebé en casa: no quería usar aerosol',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
  ],
  restaurantes: [
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Visita de sanidad en 10 días y cucarachas bajo la plancha',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'No podía cerrar el local para fumigar',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
    {
      nombre: 'Nombre de ejemplo',
      ciudad: 'Ciudad',
      problema: 'Prevención entre fumigaciones trimestrales',
      cita: 'Ejemplo de cita del cliente sobre el resultado.',
      placeholder: true,
    },
  ],
};

export function resumenResenas() {
  const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let suma = 0;
  RESENAS_ECOGEL.forEach((r) => {
    distribucion[r.estrellas] += 1;
    suma += r.estrellas;
  });
  const total = RESENAS_ECOGEL.length;
  return {
    promedio: total ? Math.round((suma / total) * 10) / 10 : 0,
    total,
    distribucion,
    esEjemplo: RESENAS_ECOGEL.some((r) => r.placeholder),
  };
}
```

- [ ] **Step 2: Crear `components/ecogel/Marcador.tsx`**

```tsx
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

// Marcador evidente para las fotos que aún no existen. Quien lo usa decide con
// `publicFileExists` (servidor) si pasa `src`; si no hay archivo, se pinta el
// recuadro con el encuadre esperado para que nadie olvide qué foto falta.

const RATIOS = {
  square: 'aspect-square',
  video: 'aspect-video',
  portrait: 'aspect-[4/5]',
} as const;

interface Props {
  etiqueta: string;
  medidas: string;
  ratio?: keyof typeof RATIOS;
  src?: string;
  alt?: string;
  prioridad?: boolean;
  className?: string;
}

export default function Marcador({ etiqueta, medidas, ratio = 'square', src, alt, prioridad, className = '' }: Props) {
  if (src) {
    return (
      <div className={`relative ${RATIOS[ratio]} w-full overflow-hidden rounded-2xl ${className}`}>
        <Image src={src} alt={alt ?? etiqueta} fill priority={prioridad} sizes="(max-width: 1024px) 100vw, 560px" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={`flex ${RATIOS[ratio]} w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brand-green/30 bg-brand-cream p-4 text-center ${className}`}
      role="img"
      aria-label={`Imagen pendiente: ${etiqueta}`}
    >
      <ImageIcon className="text-brand-green/40" size={28} aria-hidden />
      <p className="mt-2 text-body-sm font-semibold text-brand-green/70">{etiqueta}</p>
      <p className="text-brand-black/45 text-body-sm">{medidas}</p>
    </div>
  );
}
```

- [ ] **Step 3: Lint y commit**

```bash
npm run lint
git add lib/ecogel-resenas.ts components/ecogel/Marcador.tsx
git commit -m "feat(ecogel): reseñas de ejemplo marcadas y marcador de imagen

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 4: Fold y caja de compra (contexto de tier, galería, selector, CTA, sticky, garantía)

**Files:**
- Create: `components/ecogel/TierContext.tsx`
- Create: `components/ecogel/BarraPromo.tsx`
- Create: `components/ecogel/CabeceraEcogel.tsx`
- Create: `components/ecogel/Galeria.tsx`
- Create: `components/ecogel/SelectorTier.tsx`
- Create: `components/ecogel/CajaCompra.tsx`
- Create: `components/ecogel/BarraSticky.tsx`
- Create: `components/ecogel/BloqueGarantia.tsx`

**Interfaces:**
- Consumes: `TIERS`, `TIER_POR_DEFECTO`, `totalPedido`, `money`, `GARANTIA`, `AUTORIDAD`, `EcogelConfig`, `whatsappEcogel` de `lib/ecogel.ts`; `Marcador`.
- Produces:
  - `<TierProvider>` y `useTier(): { unidades: Unidades; setUnidades(u: Unidades): void }`
  - `<Galeria fotos={{ principal?: string; enUso?: string; producto?: string; equipo?: string }} />` (rutas ya verificadas por el servidor)
  - `<CajaCompra config={EcogelConfig} />` (cliente)
  - `<BarraSticky segmento={Segmento} />` (cliente)
  - `function urlPedido(unidades: Unidades, segmento: Segmento): string` → `/ecogel/pedido?u=3&de=hogar` (en `TierContext.tsx`)

- [ ] **Step 1: Contexto del tier**

`components/ecogel/TierContext.tsx`:

```tsx
'use client';

import { createContext, useContext, useState } from 'react';
import { TIER_POR_DEFECTO, type Segmento, type Unidades } from '@/lib/ecogel';

// El selector, la caja de compra y la barra sticky muestran el mismo tier. Un
// contexto pequeño evita pasar el estado por props a través del árbol entero.

interface TierState {
  unidades: Unidades;
  setUnidades: (u: Unidades) => void;
}

const TierCtx = createContext<TierState>({ unidades: TIER_POR_DEFECTO, setUnidades: () => {} });

export function TierProvider({ children }: { children: React.ReactNode }) {
  const [unidades, setUnidades] = useState<Unidades>(TIER_POR_DEFECTO);
  return <TierCtx.Provider value={{ unidades, setUnidades }}>{children}</TierCtx.Provider>;
}

export function useTier() {
  return useContext(TierCtx);
}

export function urlPedido(unidades: Unidades, segmento: Segmento): string {
  return `/ecogel/pedido?u=${unidades}&de=${segmento}`;
}
```

- [ ] **Step 2: Barra promo y cabecera**

`components/ecogel/BarraPromo.tsx`:

```tsx
// Sección 1 de Lummia: "Envío gratis a todo Colombia". Aquí la condición es el tier de 3.
export default function BarraPromo() {
  return (
    <div className="bg-brand-green px-4 py-2 text-center font-heading text-body-sm font-semibold text-white">
      Envío gratis desde 3 unidades · Paga en línea o al recibir
    </div>
  );
}
```

`components/ecogel/CabeceraEcogel.tsx`:

```tsx
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { whatsappEcogel } from '@/lib/ecogel';

// Logo + WhatsApp. Sin menú ni buscador: en una landing de pauta cada enlace es una fuga.
export default function CabeceraEcogel({ whatsappTexto }: { whatsappTexto: string }) {
  return (
    <header className="bg-brand-mint py-3">
      <div className="container-custom flex items-center justify-between">
        <Image src="/images/logos/logo-horizontal.png" alt="AGROINCOL" width={420} height={140} priority className="h-9 w-auto md:h-11" />
        <a
          href={whatsappEcogel(whatsappTexto)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribir por WhatsApp"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white"
        >
          <MessageCircle size={20} aria-hidden />
        </a>
      </div>
    </header>
  );
}
```

- [ ] **Step 3: Galería con sello de garantía**

`components/ecogel/Galeria.tsx`:

```tsx
import Marcador from './Marcador';
import { GARANTIA } from '@/lib/ecogel';

// Sección 3 de Lummia: foto grande con sello de garantía encima y miniaturas.
// Sin carrusel con JavaScript: en móvil el 90 % no pasa de la primera foto y el
// resto de encuadres está justo debajo, en el orden en que importan.

export interface FotosEcogel {
  enUso?: string;
  producto?: string;
  antes?: string;
  despues?: string;
  equipo?: string;
}

export default function Galeria({ fotos }: { fotos: FotosEcogel }) {
  return (
    <section className="container-custom pt-4">
      <div className="relative">
        <Marcador
          etiqueta="Gel aplicándose en la rendija de una cocina"
          medidas="1200×1200"
          src={fotos.enUso}
          alt="Aplicación de EcoGel en una rendija de cocina"
          prioridad
        />
        <div className="absolute right-3 top-3 flex h-20 w-20 flex-col items-center justify-center rounded-full bg-brand-orange text-center text-white shadow-brand">
          <span className="font-heading text-2xl font-bold leading-none">{GARANTIA.dias}</span>
          <span className="text-[10px] font-semibold uppercase leading-tight">días de garantía</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2">
        <Marcador etiqueta="Jeringa" medidas="600×600" src={fotos.producto} alt="Jeringa EcoGel" className="!rounded-xl" />
        <Marcador etiqueta="Antes" medidas="600×600" src={fotos.antes} alt="Cocina antes" className="!rounded-xl" />
        <Marcador etiqueta="Después" medidas="600×600" src={fotos.despues} alt="Cocina después" className="!rounded-xl" />
        <Marcador etiqueta="Equipo" medidas="600×600" src={fotos.equipo} alt="Técnico de AGROINCOL aplicando" className="!rounded-xl" />
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Selector de tier**

`components/ecogel/SelectorTier.tsx`:

```tsx
'use client';

import { TIERS, money, type Unidades } from '@/lib/ecogel';
import { useTier } from './TierContext';

// Reemplaza la caja de cuotas Addi de Lummia. Es el elemento más importante de
// la página: mueve el pedido promedio de 1 a 1,8 unidades. El 3 va preseleccionado.

export default function SelectorTier({ compacto = false }: { compacto?: boolean }) {
  const { unidades, setUnidades } = useTier();
  return (
    <fieldset>
      <legend className="text-body-sm font-semibold text-brand-black">Cantidad</legend>
      <div className={`mt-2 grid gap-2 ${compacto ? 'grid-cols-3' : 'grid-cols-1 sm:grid-cols-3'}`}>
        {TIERS.map((t) => {
          const activo = t.unidades === unidades;
          return (
            <button
              key={t.unidades}
              type="button"
              aria-pressed={activo}
              onClick={() => setUnidades(t.unidades as Unidades)}
              className={`relative rounded-xl border-2 px-3 py-3 text-left transition-colors ${
                activo ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light hover:border-brand-green/50'
              }`}
            >
              {t.masVendido && (
                <span className="absolute -top-2.5 left-3 rounded-full bg-brand-orange px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Más vendido
                </span>
              )}
              <span className="block font-heading text-body font-bold text-brand-green">
                {t.unidades} {t.unidades === 1 ? 'unidad' : 'unidades'}
              </span>
              {!compacto && <span className="block text-body-sm text-brand-black/65">{t.etiqueta}</span>}
              <span className="mt-1 block text-body-sm font-semibold text-brand-black">
                {money(t.producto)}
                <span className="font-normal text-brand-black/55"> · envío {t.envio === 0 ? 'gratis' : money(t.envio)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
```

- [ ] **Step 5: Caja de compra (H1 → garantía)**

`components/ecogel/CajaCompra.tsx`:

```tsx
'use client';

import { Bug, FileCheck, ShieldCheck, Store, Timer, Utensils, Wind, Star } from 'lucide-react';
import { AUTORIDAD, ENVIO_BASE, GARANTIA, money, tierDe, totalPedido, type EcogelConfig } from '@/lib/ecogel';
import { resumenResenas } from '@/lib/ecogel-resenas';
import SelectorTier from './SelectorTier';
import { urlPedido, useTier } from './TierContext';

// Pantalla 2 de Lummia, en su orden exacto: H1 → precio anclado → estrellas →
// selector → 4 beneficios → reencuadre → CTA con precio → logos de pago → chips → garantía.

const ICONOS = { ShieldCheck, Wind, Timer, Bug, Store, Utensils, FileCheck } as const;

const PAGOS = ['PSE', 'Nequi', 'Tarjeta', 'Contraentrega'];

export default function CajaCompra({ config }: { config: EcogelConfig }) {
  const { unidades } = useTier();
  const tier = tierDe(unidades);
  const cod = totalPedido(unidades, 'contraentrega');
  const ahorroEnvio = ENVIO_BASE - tier.envio;
  const resenas = resumenResenas();

  return (
    <section className="container-custom pt-6">
      <h1 className="font-heading text-[1.9rem] font-bold leading-[1.1] tracking-[-0.01em] text-brand-green text-balance sm:text-4xl">
        {config.titulo}
      </h1>
      <p className="text-brand-black/70 mt-2 text-body">{config.subtitulo}</p>

      {/* Precio anclado en pesos, como Lummia ("$100.000 OFF"), no en porcentaje. */}
      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-heading text-3xl font-bold text-brand-orange">{money(tier.producto)}</span>
        {tier.envio > 0 ? (
          <span className="text-body-sm text-brand-black/60">+ {money(tier.envio)} de envío</span>
        ) : (
          <span className="text-body-sm text-brand-black/60">envío gratis</span>
        )}
        {ahorroEnvio > 0 && (
          <span className="rounded-full border border-dashed border-brand-orange bg-brand-orange/10 px-2.5 py-0.5 text-body-sm font-semibold text-brand-orange-dark">
            Ahorras {money(ahorroEnvio)} de envío
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-body-sm">
        <span className="flex text-brand-amber" aria-hidden>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} size={16} fill={i <= Math.round(resenas.promedio) ? 'currentColor' : 'none'} />
          ))}
        </span>
        <a href="#resenas" className="text-brand-black/70 underline underline-offset-2">
          {resenas.promedio} · {resenas.total} reseñas
        </a>
        {resenas.esEjemplo && (
          <span className="rounded bg-brand-orange/15 px-1.5 py-0.5 text-[11px] font-semibold text-brand-orange-dark">
            Calificación de ejemplo
          </span>
        )}
      </div>

      <div className="mt-5">
        <SelectorTier />
      </div>

      <ul className="mt-5 space-y-2.5">
        {config.beneficios.map((b) => {
          const Icono = ICONOS[b.icono];
          return (
            <li key={b.texto} className="flex items-center gap-3 text-body text-brand-black">
              <Icono size={22} className="flex-none text-brand-green" aria-hidden />
              {b.texto}
            </li>
          );
        })}
      </ul>

      <p className="mt-4 rounded-lg bg-brand-amber/20 px-3 py-2 text-body-sm font-semibold italic text-brand-black">
        {config.reencuadre}
      </p>

      <a
        href={urlPedido(unidades, config.segmento)}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand"
      >
        Pedir ahora — {money(cod.total)}
      </a>
      <p className="mt-1.5 text-center text-body-sm text-brand-black/60">
        Pagando en línea: {money(totalPedido(unidades, 'online').total)}
      </p>

      <ul className="mt-3 flex flex-wrap justify-center gap-2" aria-label="Métodos de pago">
        {PAGOS.map((p) => (
          <li key={p} className="rounded-md border border-brand-gray-light px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-black/70">
            {p}
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-brand-light p-3 text-center text-body-sm font-semibold text-brand-green">
        <span>Garantía {GARANTIA.dias} días</span>
        <span>Envío 2-4 días</span>
        <span>{AUTORIDAD.anios} años en plagas</span>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Bloque de garantía y barra sticky**

`components/ecogel/BloqueGarantia.tsx`:

```tsx
import { ShieldCheck } from 'lucide-react';
import { GARANTIA } from '@/lib/ecogel';

// El bloque rosa de Lummia ("Resultados en 90 días o devolvemos tu dinero"),
// con la garantía nacional: reposición, no devolución.
export default function BloqueGarantia() {
  return (
    <section className="container-custom mt-5">
      <div className="flex items-start gap-4 rounded-2xl bg-brand-orange/10 p-4">
        <div className="flex h-14 w-14 flex-none items-center justify-center rounded-full bg-brand-orange text-white">
          <ShieldCheck size={28} aria-hidden />
        </div>
        <div>
          <h2 className="font-heading text-body font-bold text-brand-green">{GARANTIA.titulo}</h2>
          <p className="text-brand-black/70 text-body-sm mt-1">{GARANTIA.texto}</p>
        </div>
      </div>
    </section>
  );
}
```

`components/ecogel/BarraSticky.tsx`:

```tsx
'use client';

import { money, totalPedido, type Segmento } from '@/lib/ecogel';
import { urlPedido, useTier } from './TierContext';

// Sección 4 de Lummia: CTA fijo abajo desde el primer píxel. Solo en móvil; en
// escritorio la caja de compra siempre está a la vista.
export default function BarraSticky({ segmento }: { segmento: Segmento }) {
  const { unidades } = useTier();
  const { total } = totalPedido(unidades, 'contraentrega');
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-gray-light bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2.5 backdrop-blur lg:hidden">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold text-brand-black">
            {unidades} {unidades === 1 ? 'unidad' : 'unidades'}
          </p>
          <p className="text-body-sm text-brand-black/60">{money(total)} · garantía 30 días</p>
        </div>
        <a
          href={urlPedido(unidades, segmento)}
          className="flex-none rounded-full bg-brand-orange px-5 py-3 font-heading text-body-sm font-bold text-white shadow-brand"
        >
          Pedir {unidades}
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Lint y commit**

Run: `npm run lint`
Expected: sin errores (los componentes aún no se usan; el build completo se verifica en la Task 5).

```bash
git add components/ecogel/
git commit -m "feat(ecogel): fold y caja de compra calcados de Lummia

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 5: Secciones bajo el fold, ensamblaje y páginas de producto

**Files:**
- Create: `components/ecogel/AntesDespues.tsx`, `Objeciones.tsx`, `Autoridad.tsx`, `Beneficios.tsx`, `Casos.tsx`, `Comparativa.tsx`, `SinRiesgo.tsx`, `PreguntasEcogel.tsx`, `Resenas.tsx`, `PieEcogel.tsx`, `PaginaProducto.tsx`, `RastreoVista.tsx`
- Create: `app/ecogel/layout.tsx`, `app/ecogel/page.tsx`, `app/ecogel/hogar/page.tsx`, `app/ecogel/restaurantes/page.tsx`

**Interfaces:**
- Consumes: todo lo de Task 1, 3 y 4; `LandingContactTracker`, `MetaPixel`, `PostHogInit`, `publicFileExists`, `rastrear`.
- Produces: `<PaginaProducto config fotos />` (servidor) que envuelve todo en `TierProvider`.

- [ ] **Step 1: Secciones**

`components/ecogel/AntesDespues.tsx`:

```tsx
import Marcador from './Marcador';

export default function AntesDespues({ antes, despues }: { antes?: string; despues?: string }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green text-balance md:text-h2">
        Esto es lo que pasa cuando dejas el aerosol y aplicas el gel
      </h2>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <Marcador etiqueta="Antes" medidas="800×1000" ratio="portrait" src={antes} alt="Cocina con cucarachas, antes" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Antes</p>
        </div>
        <div>
          <Marcador etiqueta="Después (día 7)" medidas="800×1000" ratio="portrait" src={despues} alt="La misma cocina, día 7" />
          <p className="mt-1 text-center text-body-sm font-semibold text-brand-black/70">Después · día 7</p>
        </div>
      </div>
    </section>
  );
}
```

`components/ecogel/Objeciones.tsx` (pantalla 3 de Lummia: 5 objeciones, antes de todo lo demás):

```tsx
import { ChevronDown } from 'lucide-react';
import type { Pregunta } from '@/lib/ecogel';
import Marcador from './Marcador';

export default function Objeciones({ objeciones, video }: { objeciones: Pregunta[]; video?: string }) {
  return (
    <section className="container-custom mt-10">
      <div className="space-y-2">
        {objeciones.map((o, i) => (
          <details key={o.pregunta} open={i === 0} className="group rounded-xl border border-brand-gray-light bg-white px-4 py-3">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-body font-semibold text-brand-green">
              {o.pregunta}
              <ChevronDown size={18} className="flex-none text-brand-orange transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="text-brand-black/75 text-body-sm mt-2">{o.respuesta}</p>
            {o.pregunta === '¿Cómo se aplica?' && (
              <div className="mt-3">
                <Marcador etiqueta="Video de 20 s: cómo aplicar el gel" medidas="1080×1350 · vertical" ratio="portrait" src={video} />
              </div>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
```

`components/ecogel/Autoridad.tsx` (reemplaza a los influencers):

```tsx
import { AUTORIDAD } from '@/lib/ecogel';
import Marcador from './Marcador';

export default function Autoridad({ equipo }: { equipo?: string }) {
  return (
    <section className="mt-10 bg-brand-green px-4 py-8 text-white">
      <div className="container-custom grid gap-5 md:grid-cols-2 md:items-center">
        <Marcador etiqueta="Técnico de AGROINCOL aplicando gel en un restaurante" medidas="1200×900" ratio="video" src={equipo} className="border-white/30 bg-white/10" />
        <div>
          <p className="eyebrow !text-brand-orange-light">Quién te lo vende</p>
          <h2 className="font-heading text-h2-mobile mt-2 text-balance md:text-h2">
            {AUTORIDAD.anios} años controlando plagas. {AUTORIDAD.restaurantes} restaurantes atendidos.
          </h2>
          <p className="mt-3 text-body text-white/80">
            No somos un importador con una tienda. Somos la empresa que va a la cocina cuando el problema ya es grande. Este es el gel que aplican nuestros técnicos, en una jeringa para que lo apliques tú antes de que llegue a eso.
          </p>
          {AUTORIDAD.restaurantes === '+N' && (
            <p className="mt-3 inline-block rounded bg-brand-orange/30 px-2 py-1 text-body-sm font-semibold">
              Placeholder: confirmar número real de restaurantes
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
```

`components/ecogel/Beneficios.tsx`:

```tsx
export default function Beneficios({ bloques }: { bloques: { titulo: string; texto: string }[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Lo que el gel hace por ti</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {bloques.map((b) => (
          <div key={b.titulo} className="rounded-2xl bg-brand-light p-5">
            <h3 className="font-heading text-body font-bold text-brand-green">{b.titulo}</h3>
            <p className="text-brand-black/75 text-body-sm mt-2">{b.texto}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

`components/ecogel/Casos.tsx` (formato "problema primero" de Lummia):

```tsx
import type { Caso } from '@/lib/ecogel';

export default function Casos({ casos }: { casos: Caso[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Casos reales</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {casos.map((c, i) => (
          <article
            key={i}
            className={`rounded-2xl p-5 ${c.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-card'}`}
          >
            {c.placeholder && (
              <p className="mb-2 inline-block rounded bg-brand-orange/15 px-2 py-0.5 text-[11px] font-bold uppercase text-brand-orange-dark">
                Ejemplo — reemplazar por caso real
              </p>
            )}
            <p className="font-heading text-body font-bold text-brand-green">
              {c.nombre}, {c.ciudad}
            </p>
            <p className="text-body-sm text-brand-black/60">
              <span className="font-semibold">Problema:</span> {c.problema}
            </p>
            <p className="mt-3 text-body-sm italic text-brand-black/80">“{c.cita}”</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

`components/ecogel/Comparativa.tsx`:

```tsx
import { Check, X } from 'lucide-react';

// Tabla de Lummia ("Otras marcas / Láser / Rastrillo / Cera"). La fumigación no
// entra: es el servicio de la casa y se recomienda honestamente en el FAQ.
const COLUMNAS = ['Gel AGROINCOL', 'Aerosol', 'Trampas', 'Otros geles'];
const FILAS: [string, boolean[]][] = [
  ['Elimina la colonia completa', [true, false, false, true]],
  ['Sin olor ni vapores', [true, false, true, true]],
  ['Seguro con niños y mascotas (Bitrex)', [true, false, true, false]],
  ['Sin desalojar ni tapar comida', [true, false, true, true]],
  ['Sigue actuando por semanas', [true, false, false, true]],
  ['Respaldo de una fumigadora', [true, false, false, false]],
];

export default function Comparativa() {
  return (
    <section className="container-custom mt-10 overflow-x-auto">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">¿Y si uso otra cosa?</h2>
      <table className="mt-5 w-full min-w-[520px] border-separate border-spacing-0 text-body-sm">
        <thead>
          <tr>
            <th className="p-2 text-left" />
            {COLUMNAS.map((c, i) => (
              <th key={c} className={`p-2 text-center font-heading ${i === 0 ? 'rounded-t-xl bg-brand-green text-white' : 'text-brand-black/70'}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FILAS.map(([fila, valores]) => (
            <tr key={fila}>
              <td className="border-b border-brand-gray-light p-2 text-brand-black">{fila}</td>
              {valores.map((v, i) => (
                <td key={i} className={`border-b border-brand-gray-light p-2 text-center ${i === 0 ? 'bg-brand-green/5' : ''}`}>
                  {v ? <Check size={18} className="mx-auto text-brand-green" aria-label="Sí" /> : <X size={18} className="mx-auto text-brand-black/30" aria-label="No" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
```

`components/ecogel/SinRiesgo.tsx`:

```tsx
import { GARANTIA, whatsappEcogel } from '@/lib/ecogel';

export default function SinRiesgo() {
  return (
    <section className="container-custom mt-10">
      <div className="rounded-2xl bg-brand-light p-6">
        <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Pruébalo sin riesgo</h2>
        <p className="mt-2 text-body text-brand-black/80">{GARANTIA.titulo}.</p>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-body-sm text-brand-black/75">
          <li>Aplicas el gel siguiendo la guía que llega con el pedido.</li>
          <li>Si a los {GARANTIA.dias} días siguen apareciendo, nos mandas una foto por WhatsApp.</li>
          <li>Te despachamos otro kit sin costo. Sin devoluciones ni formularios.</li>
        </ol>
        <a href={whatsappEcogel('Hola, quiero saber cómo funciona la garantía de EcoGel')} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-body-sm font-semibold text-brand-green underline underline-offset-2">
          Preguntar por la garantía
        </a>
      </div>
    </section>
  );
}
```

`components/ecogel/PreguntasEcogel.tsx`:

```tsx
import { ChevronDown } from 'lucide-react';
import type { Pregunta } from '@/lib/ecogel';

export default function PreguntasEcogel({ preguntas }: { preguntas: Pregunta[] }) {
  return (
    <section className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Preguntas frecuentes</h2>
      <div className="mt-5 space-y-2">
        {preguntas.map((p) => (
          <details key={p.pregunta} className="group rounded-xl bg-white px-4 py-3 shadow-soft">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-heading text-body font-semibold text-brand-green">
              {p.pregunta}
              <ChevronDown size={18} className="flex-none text-brand-orange transition-transform group-open:rotate-180" aria-hidden />
            </summary>
            <p className="text-brand-black/75 text-body-sm mt-2">{p.respuesta}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

`components/ecogel/Resenas.tsx` (widget 4.9 con distribución):

```tsx
import { Star } from 'lucide-react';
import { RESENAS_ECOGEL, resumenResenas } from '@/lib/ecogel-resenas';

export default function Resenas() {
  const r = resumenResenas();
  const niveles: (1 | 2 | 3 | 4 | 5)[] = [5, 4, 3, 2, 1];
  return (
    <section id="resenas" className="container-custom mt-10">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">Lo que dicen quienes ya lo usaron</h2>
      {r.esEjemplo && (
        <p className="mt-2 inline-block rounded bg-brand-orange/15 px-2 py-1 text-body-sm font-semibold text-brand-orange-dark">
          Reseñas de ejemplo: reemplazar por reseñas reales antes de pautar
        </p>
      )}
      <div className="mt-4 flex items-center gap-5">
        <div className="text-center">
          <p className="font-heading text-5xl font-bold text-brand-green">{r.promedio}</p>
          <p className="text-body-sm text-brand-black/60">{r.total} opiniones</p>
        </div>
        <ul className="flex-1 space-y-1">
          {niveles.map((n) => (
            <li key={n} className="flex items-center gap-2 text-body-sm">
              <span className="w-8">{n} ★</span>
              <span className="h-2 flex-1 overflow-hidden rounded bg-brand-gray-light">
                <span className="block h-full bg-brand-amber" style={{ width: `${r.total ? (r.distribucion[n] / r.total) * 100 : 0}%` }} />
              </span>
              <span className="w-6 text-right text-brand-black/60">{r.distribucion[n]}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-5 space-y-3">
        {RESENAS_ECOGEL.map((res, i) => (
          <article key={i} className={`rounded-2xl p-4 ${res.placeholder ? 'border-2 border-dashed border-brand-orange/50 bg-brand-cream' : 'bg-white shadow-soft'}`}>
            <div className="flex items-center justify-between gap-2">
              <p className="font-heading text-body-sm font-bold text-brand-green">
                {res.nombre} · {res.ciudad}
              </p>
              <span className="flex text-brand-amber" aria-label={`${res.estrellas} de 5`}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill={s <= res.estrellas ? 'currentColor' : 'none'} />
                ))}
              </span>
            </div>
            <p className="text-brand-black/80 text-body-sm mt-2">{res.texto}</p>
            {res.placeholder && <p className="mt-2 text-[11px] font-bold uppercase text-brand-orange-dark">Ejemplo — reemplazar por reseña real</p>}
          </article>
        ))}
      </div>
      <p className="mt-4 text-body-sm text-brand-black/55">Reseñas recogidas por WhatsApp después de la entrega.</p>
    </section>
  );
}
```

`components/ecogel/PieEcogel.tsx`:

```tsx
import { BUSINESS } from '@/lib/constants';

export default function PieEcogel() {
  return (
    <footer className="mt-12 bg-brand-green-dark px-4 pb-[calc(env(safe-area-inset-bottom)+92px)] pt-10 text-center text-white">
      <p className="font-heading text-lg font-bold">{BUSINESS.name}</p>
      <p className="text-white/60 text-body-sm mt-1.5">{BUSINESS.address.full}</p>
      <p className="text-white/60 text-body-sm">{BUSINESS.phone} · {BUSINESS.email}</p>
      <p className="mt-4 text-body-sm text-white/60">Pagos aceptados: PSE · Nequi · Tarjeta · Contraentrega (efectivo)</p>
      <p className="mt-4 text-white/45 text-body-sm">
        <a href="/politica-de-privacidad" className="underline underline-offset-4">Política de privacidad</a>
      </p>
      <p className="text-white/35 text-body-sm mt-3">© {new Date().getFullYear()} {BUSINESS.legalName}. EcoGel es marca de Mylva S.A. Registro INVIMA 2009V0004964.</p>
    </footer>
  );
}
```

`components/ecogel/RastreoVista.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { rastrear } from '@/lib/meta/pixel';
import { TIER_POR_DEFECTO, totalPedido, type Segmento } from '@/lib/ecogel';

/** ViewContent al cargar la página de producto, con el valor del tier por defecto. */
export default function RastreoVista({ segmento }: { segmento: Segmento }) {
  useEffect(() => {
    rastrear('ViewContent', {
      categoria: `ecogel-${segmento}`,
      valor: totalPedido(TIER_POR_DEFECTO, 'contraentrega').total,
      contenido: { ids: ['ecogel'], numItems: TIER_POR_DEFECTO },
    });
  }, [segmento]);
  return null;
}
```

- [ ] **Step 2: Ensamblaje**

`components/ecogel/PaginaProducto.tsx`:

```tsx
import type { EcogelConfig } from '@/lib/ecogel';
import { CASOS_ECOGEL } from '@/lib/ecogel-resenas';
import LandingContactTracker from '@/components/landing/LandingContactTracker';
import { TierProvider } from './TierContext';
import BarraPromo from './BarraPromo';
import CabeceraEcogel from './CabeceraEcogel';
import Galeria, { type FotosEcogel } from './Galeria';
import CajaCompra from './CajaCompra';
import BarraSticky from './BarraSticky';
import BloqueGarantia from './BloqueGarantia';
import AntesDespues from './AntesDespues';
import Objeciones from './Objeciones';
import Autoridad from './Autoridad';
import Beneficios from './Beneficios';
import Casos from './Casos';
import Comparativa from './Comparativa';
import SinRiesgo from './SinRiesgo';
import PreguntasEcogel from './PreguntasEcogel';
import Resenas from './Resenas';
import PieEcogel from './PieEcogel';
import RastreoVista from './RastreoVista';

// Orden = página de producto de Lummia, sección por sección (ver spec §3).
export default function PaginaProducto({ config, fotos, video }: { config: EcogelConfig; fotos: FotosEcogel; video?: string }) {
  return (
    <TierProvider>
      <BarraPromo />
      <CabeceraEcogel whatsappTexto={config.whatsappTexto} />
      <Galeria fotos={fotos} />
      <CajaCompra config={config} />
      <BloqueGarantia />
      <AntesDespues antes={fotos.antes} despues={fotos.despues} />
      <Objeciones objeciones={config.objeciones} video={video} />
      <Autoridad equipo={fotos.equipo} />
      <Beneficios bloques={config.beneficiosLargos} />
      <Casos casos={CASOS_ECOGEL[config.segmento]} />
      <Comparativa />
      <SinRiesgo />
      <PreguntasEcogel preguntas={config.preguntas} />
      <Resenas />
      <PieEcogel />
      <BarraSticky segmento={config.segmento} />
      <RastreoVista segmento={config.segmento} />
      <LandingContactTracker categoria={`ecogel-${config.segmento}`} />
    </TierProvider>
  );
}
```

- [ ] **Step 3: Layout, redirect y páginas**

`app/ecogel/layout.tsx`:

```tsx
import MetaPixel from '@/components/analytics/MetaPixel';
import PostHogInit from '@/components/analytics/PostHogInit';

// Misma medición aislada que /lp (ver el comentario largo en app/lp/layout.tsx):
// el Pixel vive aquí y no en el layout raíz para no contaminar la atribución.
export default function EcogelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <MetaPixel />
      <PostHogInit />
    </>
  );
}
```

`app/ecogel/page.tsx`:

```tsx
import { redirect } from 'next/navigation';

export default function EcogelIndex() {
  redirect('/ecogel/hogar');
}
```

`app/ecogel/hogar/page.tsx`:

```tsx
import type { Metadata } from 'next';
import PaginaProducto from '@/components/ecogel/PaginaProducto';
import { HOGAR } from '@/lib/ecogel';
import { fotosEcogel, videoEcogel } from '../fotos';

export const metadata: Metadata = {
  title: HOGAR.metaTitle,
  description: HOGAR.metaDescription,
  // Landing de pauta: no debe competir con el sitio orgánico ni indexarse.
  robots: { index: false, follow: false },
};

export default function EcogelHogarPage() {
  return <PaginaProducto config={HOGAR} fotos={fotosEcogel()} video={videoEcogel()} />;
}
```

`app/ecogel/restaurantes/page.tsx`: idéntico con `RESTAURANTES` y `EcogelRestaurantesPage`.

`app/ecogel/fotos.ts` (servidor: decide qué fotos existen):

```ts
import { publicFileExists } from '@/lib/publicFiles';
import type { FotosEcogel } from '@/components/ecogel/Galeria';

// Fotos definitivas: cuando existan en /public/ecogel con estos nombres, la página
// las pinta sola. Mientras no, se ven los marcadores.
const RUTAS = {
  enUso: '/ecogel/en-uso.jpg',
  producto: '/ecogel/producto.jpg',
  antes: '/ecogel/antes.jpg',
  despues: '/ecogel/despues.jpg',
  equipo: '/ecogel/equipo.jpg',
} as const;

export function fotosEcogel(): FotosEcogel {
  const salida: FotosEcogel = {};
  (Object.keys(RUTAS) as (keyof typeof RUTAS)[]).forEach((k) => {
    if (publicFileExists(RUTAS[k])) salida[k] = RUTAS[k];
  });
  return salida;
}

export function videoEcogel(): string | undefined {
  return publicFileExists('/ecogel/aplicacion.jpg') ? '/ecogel/aplicacion.jpg' : undefined;
}
```

- [ ] **Step 4: Build y revisión visual**

Run: `npm run lint && npm run build`
Expected: sin errores; `/ecogel/hogar` y `/ecogel/restaurantes` aparecen como rutas estáticas.

Run: `npm run dev` y abrir `http://localhost:3000/ecogel/hogar` con el emulador móvil (390×844). Verificar:
- Primer frame: barra promo, cabecera, marcador grande con sello "30 días", barra sticky "Pedir 3 — $119.700".
- Cambiar el tier a 1 actualiza precio, pastilla, CTA y sticky.
- Todas las reseñas y casos llevan la etiqueta "Ejemplo".
- El bloque de autoridad muestra el aviso "+N".

- [ ] **Step 5: Commit**

```bash
git add components/ecogel/ app/ecogel/
git commit -m "feat(ecogel): páginas de producto hogar y restaurantes

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 6: Validación del pedido (`lib/ecogel-pedido.ts`)

**Files:**
- Create: `lib/ecogel-pedido.ts`
- Test: `lib/ecogel-pedido.test.ts`

**Interfaces:**
- Produces:
  - `const DEPARTAMENTOS: readonly string[]` (33: los 32 + "Bogotá D.C.")
  - `interface DatosPedido { unidades: Unidades; metodo: MetodoPago; nombre: string; celular: string; correo: string; direccion: string; barrio: string; ciudad: string; departamento: string; ofertas: boolean; de: Segmento }`
  - `function validarPedido(entrada: unknown): { ok: true; pedido: DatosPedido } | { ok: false; errores: Record<string, string> }`
  - `function nuevoPedidoId(ahora?: Date, azar?: () => number): string` → `EG-250919-K7Q2`

- [ ] **Step 1: Prueba que falla**

`lib/ecogel-pedido.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEPARTAMENTOS, nuevoPedidoId, validarPedido } from './ecogel-pedido';

const base = {
  unidades: 3,
  metodo: 'online',
  nombre: 'Diana Pérez',
  celular: '310 789 1948',
  correo: 'diana@example.com',
  direccion: 'Calle 10 # 20-30',
  barrio: 'Cabecera',
  ciudad: 'Bucaramanga',
  departamento: 'Santander',
  ofertas: true,
  de: 'hogar',
};

test('un pedido completo es válido y normaliza el celular', () => {
  const r = validarPedido(base);
  assert.equal(r.ok, true);
  if (r.ok) {
    assert.equal(r.pedido.celular, '3107891948');
    assert.equal(r.pedido.correo, 'diana@example.com');
  }
});

test('el celular debe tener 10 dígitos y empezar por 3', () => {
  const r = validarPedido({ ...base, celular: '6076543210' });
  assert.equal(r.ok, false);
  if (!r.ok) assert.match(r.errores.celular, /celular/i);
});

test('el correo es obligatorio solo al pagar en línea', () => {
  assert.equal(validarPedido({ ...base, correo: '' }).ok, false);
  assert.equal(validarPedido({ ...base, correo: '', metodo: 'contraentrega' }).ok, true);
  assert.equal(validarPedido({ ...base, correo: 'no-es-correo' }).ok, false);
});

test('rechaza tier, método, segmento y departamento inválidos', () => {
  assert.equal(validarPedido({ ...base, unidades: 4 }).ok, false);
  assert.equal(validarPedido({ ...base, metodo: 'cheque' }).ok, false);
  assert.equal(validarPedido({ ...base, de: 'oficinas' }).ok, false);
  assert.equal(validarPedido({ ...base, departamento: 'Narnia' }).ok, false);
  assert.equal(validarPedido(null).ok, false);
});

test('hay 33 departamentos y Bogotá está', () => {
  assert.equal(DEPARTAMENTOS.length, 33);
  assert.ok(DEPARTAMENTOS.includes('Bogotá D.C.'));
});

test('el id de pedido es legible y determinista con azar fijo', () => {
  const id = nuevoPedidoId(new Date('2026-09-19T15:00:00Z'), () => 0);
  assert.match(id, /^EG-260919-[A-Z0-9]{4}$/);
});
```

- [ ] **Step 2: Verificar que falla**

Run: `npm test`
Expected: FAIL con `Cannot find module './ecogel-pedido'`.

- [ ] **Step 3: Implementar**

`lib/ecogel-pedido.ts`:

```ts
// Validación del pedido. La comparten el formulario (mensajes por campo) y la
// API (última palabra). Sin imports de Node.

import { esSegmento, esUnidades, type MetodoPago, type Segmento, type Unidades } from './ecogel';

export const DEPARTAMENTOS = [
  'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
  'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba', 'Cundinamarca', 'Guainía', 'Guaviare', 'Huila',
  'La Guajira', 'Magdalena', 'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
  'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca', 'Vaupés', 'Vichada',
] as const;

export interface DatosPedido {
  unidades: Unidades;
  metodo: MetodoPago;
  nombre: string;
  /** 10 dígitos, sin espacios ni indicativo. */
  celular: string;
  correo: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  departamento: string;
  ofertas: boolean;
  de: Segmento;
}

type Resultado = { ok: true; pedido: DatosPedido } | { ok: false; errores: Record<string, string> };

const texto = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validarPedido(entrada: unknown): Resultado {
  if (!entrada || typeof entrada !== 'object') return { ok: false, errores: { general: 'Datos incompletos' } };
  const e = entrada as Record<string, unknown>;
  const errores: Record<string, string> = {};

  if (!esUnidades(e.unidades)) errores.unidades = 'Escoge 1, 2 o 3 unidades';
  const metodo = e.metodo === 'online' || e.metodo === 'contraentrega' ? e.metodo : null;
  if (!metodo) errores.metodo = 'Escoge cómo vas a pagar';
  if (!esSegmento(e.de)) errores.de = 'Origen inválido';

  const nombre = texto(e.nombre);
  if (nombre.length < 3) errores.nombre = 'Escribe tu nombre completo';

  const celular = texto(e.celular, 30).replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');
  if (!/^3\d{9}$/.test(celular)) errores.celular = 'Escribe un celular de 10 dígitos que empiece por 3';

  const correo = texto(e.correo).toLowerCase();
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) errores.correo = 'Ese correo no parece válido';
  if (metodo === 'online' && !correo) errores.correo = 'Para pagar en línea necesitamos tu correo';

  const direccion = texto(e.direccion);
  if (direccion.length < 5) errores.direccion = 'Escribe la dirección de entrega';
  const barrio = texto(e.barrio, 60);
  if (barrio.length < 2) errores.barrio = 'Escribe el barrio';
  const ciudad = texto(e.ciudad, 60);
  if (ciudad.length < 2) errores.ciudad = 'Escribe la ciudad o municipio';
  const departamento = texto(e.departamento, 40);
  if (!(DEPARTAMENTOS as readonly string[]).includes(departamento)) errores.departamento = 'Escoge el departamento';

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  return {
    ok: true,
    pedido: {
      unidades: e.unidades as Unidades,
      metodo: metodo as MetodoPago,
      nombre,
      celular,
      correo,
      direccion,
      barrio,
      ciudad,
      departamento,
      ofertas: e.ofertas !== false,
      de: e.de as Segmento,
    },
  };
}

const ALFABETO = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O ni 1/I: se dicta por teléfono

export function nuevoPedidoId(ahora = new Date(), azar: () => number = Math.random): string {
  const fecha = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', year: '2-digit', month: '2-digit', day: '2-digit' })
    .format(ahora)
    .replace(/-/g, '');
  let sufijo = '';
  for (let i = 0; i < 4; i++) sufijo += ALFABETO[Math.floor(azar() * ALFABETO.length)];
  return `EG-${fecha}-${sufijo}`;
}
```

- [ ] **Step 4: Verificar que pasa**

Run: `npm test`
Expected: todas PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/ecogel-pedido.ts lib/ecogel-pedido.test.ts
git commit -m "feat(ecogel): validación del pedido e id legible

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 7: Hoja "Pedidos EcoGel" (cliente y Apps Script)

**Files:**
- Create: `lib/hoja-pedidos.ts`
- Create: `docs/hoja-de-pedidos.md`
- Modify: `.env.example` (agregar `HOJA_PEDIDOS_URL`, `HOJA_PEDIDOS_SECRETO`, `MP_ACCESS_TOKEN`)

**Interfaces:**
- Produces:
  - `const COLUMNAS_PEDIDO: readonly string[]` (orden de la hoja)
  - `async function crearFilaPedido(fila: Record<string, unknown>, fetchFn?: typeof fetch): Promise<void>`
  - `async function actualizarFilaPedido(pedidoId: string, cambios: Record<string, unknown>, fetchFn?: typeof fetch): Promise<void>`
  - Ambas devuelven sin hacer nada si faltan las variables; lanzan si la hoja responde distinto de 200/302.

- [ ] **Step 1: Cliente de la hoja**

`lib/hoja-pedidos.ts`:

```ts
// Hoja de Google Sheets "Pedidos EcoGel". Es la base de datos de pedidos: desde
// ahí se despacha, se marca entregado/rechazado y se lee la economía real.
// Mismo mecanismo que la hoja de leads (ver docs/hoja-de-leads.md y
// app/api/contact/route.ts): Apps Script con doPost + secreto, y 302 como
// respuesta normal.

export const COLUMNAS_PEDIDO = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId',
] as const;

function credenciales() {
  return { url: process.env.HOJA_PEDIDOS_URL ?? '', secreto: process.env.HOJA_PEDIDOS_SECRETO ?? '' };
}

async function llamar(cuerpo: Record<string, unknown>, fetchFn: typeof fetch): Promise<void> {
  const { url, secreto } = credenciales();
  if (!url || !secreto) return;
  const respuesta = await fetchFn(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secreto, ...cuerpo }),
    redirect: 'manual', // Apps Script responde 302 tras escribir; seguirlo solo pierde tiempo
    signal: AbortSignal.timeout(10000),
  });
  if (respuesta.status !== 200 && respuesta.status !== 302) {
    throw new Error(`la hoja de pedidos respondió ${respuesta.status}`);
  }
}

export function crearFilaPedido(fila: Record<string, unknown>, fetchFn: typeof fetch = fetch) {
  return llamar({ accion: 'crear', fila }, fetchFn);
}

export function actualizarFilaPedido(pedidoId: string, cambios: Record<string, unknown>, fetchFn: typeof fetch = fetch) {
  return llamar({ accion: 'actualizar', pedidoId, cambios }, fetchFn);
}
```

- [ ] **Step 2: Documentación y Apps Script**

`docs/hoja-de-pedidos.md`:

````markdown
# Hoja de pedidos de EcoGel

Cada pedido de `/ecogel/pedido` queda como una fila en una hoja de Google
Sheets. La hoja **es** la base de datos de pedidos: desde ahí se despacha, se
anota la guía y se marca entregado o rechazado.

```
checkout → /api/ecogel/pedido → fila (estado: confirmar | pendiente_pago) → correo de aviso
Mercado Pago → /api/ecogel/mp → actualiza la fila (estado: pagado | pago_fallido)
```

**Regla de pauta:** no se envía tráfico pago a `/ecogel/*` mientras la página
muestre reseñas, casos o fotos con la etiqueta "Ejemplo" / marcador punteado.

## 1. Crear la hoja

Hoja nueva en Google Sheets, nombre "AGROINCOL — Pedidos EcoGel". No escribas
encabezados: el script los pone.

## 2. Apps Script

Extensiones → Apps Script. Borra lo que haya y pega:

```javascript
// Recibe pedidos de agroincol.com/ecogel y los agrega como filas; actualiza el
// estado cuando Mercado Pago confirma el pago. Rechaza llamadas sin el secreto.

var SECRETO = 'CAMBIA-ESTO-POR-TU-SECRETO';
var CORREO_AVISOS = 'agroincol.1985@gmail.com';

// El orden manda: así llegan los datos desde el servidor (lib/hoja-pedidos.ts).
var COLUMNAS = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId'
];

function hoja() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    if (datos.secreto !== SECRETO) return ContentService.createTextOutput('no');
    var h = hoja();
    sincronizarEncabezados(h);

    if (datos.accion === 'actualizar') {
      actualizar(h, datos.pedidoId, datos.cambios || {});
      return ContentService.createTextOutput('ok');
    }

    h.appendRow(COLUMNAS.map(function (c) {
      var v = datos.fila[c];
      return v === undefined || v === null ? '' : v;
    }));
    avisarPorCorreo(datos.fila);
    return ContentService.createTextOutput('ok');
  } catch (error) {
    return ContentService.createTextOutput('error: ' + error.message);
  }
}

function sincronizarEncabezados(h) {
  var primera = h.getRange(1, 1, 1, COLUMNAS.length).getValues()[0];
  if (primera.join('|') !== COLUMNAS.join('|')) {
    h.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
    h.setFrozenRows(1);
  }
}

// Busca la fila por pedidoId y escribe solo las columnas enviadas.
function actualizar(h, pedidoId, cambios) {
  var col = COLUMNAS.indexOf('pedidoId') + 1;
  var ids = h.getRange(2, col, Math.max(h.getLastRow() - 1, 1), 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === pedidoId) {
      var fila = i + 2;
      Object.keys(cambios).forEach(function (c) {
        var idx = COLUMNAS.indexOf(c);
        if (idx >= 0) h.getRange(fila, idx + 1).setValue(cambios[c]);
      });
      return;
    }
  }
  throw new Error('pedido no encontrado: ' + pedidoId);
}

function avisarPorCorreo(fila) {
  try {
    var asunto = 'Pedido EcoGel ' + fila.pedidoId + ' · ' + fila.unidades + 'u · ' + fila.metodoPago;
    var cuerpo =
      fila.nombre + ' · ' + fila.celular + '\n' +
      fila.direccion + ', ' + fila.barrio + ', ' + fila.ciudad + ', ' + fila.departamento + '\n' +
      'Total: $' + fila.total + ' (' + fila.metodoPago + ')\n' +
      'Estado: ' + fila.estado;
    MailApp.sendEmail(CORREO_AVISOS, asunto, cuerpo);
  } catch (e) {
    // La fila ya quedó escrita; un fallo de correo no la pierde.
  }
}
```

Cambia `SECRETO` por una cadena larga y aleatoria.

## 3. Publicar

Implementar → Nueva implementación → Aplicación web. "Ejecutar como": tú.
"Quién tiene acceso": **Cualquier usuario**. Copia la URL (`…/exec`).

## 4. Variables en Vercel

```
HOJA_PEDIDOS_URL=https://script.google.com/macros/s/…/exec
HOJA_PEDIDOS_SECRETO=<el mismo SECRETO>
```

## 5. Estados

`confirmar` (COD nuevo: llamar/escribir para confirmar dirección) →
`despachado` (anota la `guia`) → `entregado` o `rechazado`.
`pendiente_pago` → `pagado` (lo pone el webhook) → `despachado` → `entregado`.
`pago_fallido`: el cliente no completó el pago; escribirle y ofrecer contraentrega.
````

- [ ] **Step 3: `.env.example`**

Agregar al final de `.env.example`:

```
# EcoGel: hoja de pedidos (ver docs/hoja-de-pedidos.md)
HOJA_PEDIDOS_URL=
HOJA_PEDIDOS_SECRETO=
# Mercado Pago Checkout Pro. Access Token de la aplicación (APP_USR-… en producción).
MP_ACCESS_TOKEN=
```

- [ ] **Step 4: Lint y commit**

```bash
npm run lint
git add lib/hoja-pedidos.ts docs/hoja-de-pedidos.md .env.example
git commit -m "feat(ecogel): hoja de pedidos con Apps Script

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 8: Mercado Pago (`lib/mercadopago.ts`)

**Files:**
- Create: `lib/mercadopago.ts`
- Test: `lib/mercadopago.test.ts`

**Interfaces:**
- Produces:
  - `function construirPreferencia(p: { pedidoId: string; unidades: Unidades; total: number; nombre: string; correo: string; celular: string; segmento: Segmento; base: string }): Record<string, unknown>`
  - `async function crearPreferencia(pref: Record<string, unknown>, fetchFn?: typeof fetch): Promise<{ ok: true; initPoint: string } | { ok: false; detalle: string }>`
  - `async function consultarPago(id: string, fetchFn?: typeof fetch): Promise<{ ok: true; status: string; externalReference: string } | { ok: false; detalle: string }>`
  - `function mpConfigurado(): boolean`

- [ ] **Step 1: Prueba que falla**

`lib/mercadopago.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { construirPreferencia, consultarPago, crearPreferencia } from './mercadopago';

const datos = {
  pedidoId: 'EG-260919-K7Q2',
  unidades: 3 as const,
  total: 114_700,
  nombre: 'Diana Pérez',
  correo: 'diana@example.com',
  celular: '3107891948',
  segmento: 'hogar' as const,
  base: 'https://agroincol.com',
};

test('la preferencia lleva un solo ítem con el total y las URLs del pedido', () => {
  const p = construirPreferencia(datos) as any;
  assert.equal(p.items.length, 1);
  assert.equal(p.items[0].unit_price, 114_700);
  assert.equal(p.items[0].quantity, 1);
  assert.equal(p.items[0].currency_id, 'COP');
  assert.equal(p.external_reference, 'EG-260919-K7Q2');
  assert.equal(p.notification_url, 'https://agroincol.com/api/ecogel/mp');
  assert.equal(p.back_urls.success, 'https://agroincol.com/ecogel/gracias?pedido=EG-260919-K7Q2&estado=approved');
  assert.equal(p.back_urls.failure, 'https://agroincol.com/ecogel/gracias?pedido=EG-260919-K7Q2&estado=failure');
  assert.equal(p.auto_return, 'approved');
  assert.equal(p.statement_descriptor, 'AGROINCOL');
  assert.equal(p.payer.email, 'diana@example.com');
});

test('crearPreferencia devuelve init_point o el detalle del error', async () => {
  process.env.MP_ACCESS_TOKEN = 'APP_USR-prueba';
  const okFetch = (async () => new Response(JSON.stringify({ init_point: 'https://mp/x' }), { status: 201 })) as unknown as typeof fetch;
  assert.deepEqual(await crearPreferencia({}, okFetch), { ok: true, initPoint: 'https://mp/x' });
  const malFetch = (async () => new Response('nope', { status: 400 })) as unknown as typeof fetch;
  const r = await crearPreferencia({}, malFetch);
  assert.equal(r.ok, false);
});

test('consultarPago devuelve status y external_reference', async () => {
  process.env.MP_ACCESS_TOKEN = 'APP_USR-prueba';
  const f = (async (url: string) => {
    assert.match(String(url), /\/v1\/payments\/123$/);
    return new Response(JSON.stringify({ status: 'approved', external_reference: 'EG-1' }), { status: 200 });
  }) as unknown as typeof fetch;
  assert.deepEqual(await consultarPago('123', f), { ok: true, status: 'approved', externalReference: 'EG-1' });
});
```

- [ ] **Step 2: Verificar que falla**

Run: `npm test`
Expected: FAIL con `Cannot find module './mercadopago'`.

- [ ] **Step 3: Implementar**

`lib/mercadopago.ts`:

```ts
// Mercado Pago Checkout Pro, sin SDK: dos llamadas REST. El token se lee en
// cada llamada (como en lib/meta/capi.ts) para que las pruebas puedan variarlo.

import type { Segmento, Unidades } from './ecogel';

const API = 'https://api.mercadopago.com';

function token() {
  return process.env.MP_ACCESS_TOKEN ?? '';
}

export function mpConfigurado(): boolean {
  return token().length > 0;
}

export function construirPreferencia(p: {
  pedidoId: string;
  unidades: Unidades;
  total: number;
  nombre: string;
  correo: string;
  celular: string;
  segmento: Segmento;
  base: string;
}): Record<string, unknown> {
  const gracias = (estado: string) => `${p.base}/ecogel/gracias?pedido=${p.pedidoId}&estado=${estado}`;
  return {
    // Un solo ítem con el total: el desglose (envío, descuento) vive en la hoja.
    items: [
      {
        id: 'ecogel',
        title: `EcoGel x${p.unidades} — AGROINCOL`,
        quantity: 1,
        unit_price: p.total,
        currency_id: 'COP',
      },
    ],
    payer: { name: p.nombre, email: p.correo, phone: { area_code: '57', number: p.celular } },
    external_reference: p.pedidoId,
    notification_url: `${p.base}/api/ecogel/mp`,
    back_urls: { success: gracias('approved'), pending: gracias('pending'), failure: gracias('failure') },
    auto_return: 'approved',
    statement_descriptor: 'AGROINCOL',
    metadata: { segmento: p.segmento, unidades: p.unidades },
  };
}

export async function crearPreferencia(
  pref: Record<string, unknown>,
  fetchFn: typeof fetch = fetch,
): Promise<{ ok: true; initPoint: string } | { ok: false; detalle: string }> {
  try {
    const r = await fetchFn(`${API}/checkout/preferences`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token()}` },
      body: JSON.stringify(pref),
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { ok: false, detalle: `${r.status} ${await r.text()}` };
    const json = (await r.json()) as { init_point?: string };
    if (!json.init_point) return { ok: false, detalle: 'sin init_point' };
    return { ok: true, initPoint: json.init_point };
  } catch (e) {
    return { ok: false, detalle: e instanceof Error ? e.message : String(e) };
  }
}

export async function consultarPago(
  id: string,
  fetchFn: typeof fetch = fetch,
): Promise<{ ok: true; status: string; externalReference: string } | { ok: false; detalle: string }> {
  try {
    const r = await fetchFn(`${API}/v1/payments/${encodeURIComponent(id)}`, {
      headers: { authorization: `Bearer ${token()}` },
      signal: AbortSignal.timeout(8000),
    });
    if (!r.ok) return { ok: false, detalle: `${r.status}` };
    const json = (await r.json()) as { status?: string; external_reference?: string };
    return { ok: true, status: json.status ?? '', externalReference: json.external_reference ?? '' };
  } catch (e) {
    return { ok: false, detalle: e instanceof Error ? e.message : String(e) };
  }
}
```

- [ ] **Step 4: Verificar que pasa y commit**

Run: `npm test` → PASS.

```bash
git add lib/mercadopago.ts lib/mercadopago.test.ts
git commit -m "feat(ecogel): cliente de Mercado Pago Checkout Pro

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 9: `POST /api/ecogel/pedido`

**Files:**
- Create: `app/api/ecogel/pedido/route.ts`

**Interfaces:**
- Consumes: `validarPedido`, `nuevoPedidoId`, `totalPedido`, `crearFilaPedido`, `construirPreferencia`, `crearPreferencia`, `mpConfigurado`, `capiConfigurada`, `enviarEventoAMeta`, `construirUserData`, `resolverFbp`, `resolverFbc`, `nuevoEventId`.
- Produces: respuesta `{ ok: true, pedidoId, ir }` (302 lógico hacia `ir`), `{ ok: false, errores }` 400, `{ ok: false, motivo: 'mp' }` 502.
- Cuerpo esperado: los campos de `DatosPedido` + `eventId`, `externalId`, `sourceUrl`, `website` (honeypot).

- [ ] **Step 1: Implementar la ruta**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { totalPedido } from '@/lib/ecogel';
import { nuevoPedidoId, validarPedido } from '@/lib/ecogel-pedido';
import { crearFilaPedido } from '@/lib/hoja-pedidos';
import { construirPreferencia, crearPreferencia, mpConfigurado } from '@/lib/mercadopago';
import { nuevoEventId } from '@/lib/meta/eventos';
import { construirUserData } from '@/lib/meta/hash';
import { resolverFbc } from '@/lib/meta/fbc';
import { FBP_DURACION_S, resolverFbp } from '@/lib/meta/fbp';
import { capiConfigurada, enviarEventoAMeta } from '@/lib/meta/capi';

/**
 * Crea un pedido de EcoGel.
 *
 * Orden de los pasos, y por qué:
 * 1. Validar y RECALCULAR el total en el servidor. El precio del navegador no existe.
 * 2. Escribir la fila en la hoja. Si falla, el pedido sigue: queda en los logs.
 * 3. Purchase a Meta por CAPI con el event_id del checkout. Se manda al crear el
 *    pedido en ambos métodos (como Shopify): es la señal con la que optimiza la
 *    campaña. La verdad de entregado/rechazado vive en la hoja.
 * 4. Contraentrega → /gracias. En línea → preferencia de Mercado Pago → init_point.
 */
export async function POST(req: NextRequest) {
  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = await req.json();
  } catch {
    return NextResponse.json({ ok: false, errores: { general: 'Datos inválidos' } }, { status: 400 });
  }

  // Honeypot: un bot lo llena, una persona no lo ve.
  if (typeof cuerpo.website === 'string' && cuerpo.website) {
    return NextResponse.json({ ok: true, pedidoId: 'EG-000000-BOT', ir: '/ecogel/gracias?estado=cod' });
  }

  const validacion = validarPedido(cuerpo);
  if (!validacion.ok) return NextResponse.json({ ok: false, errores: validacion.errores }, { status: 400 });
  const pedido = validacion.pedido;

  const totales = totalPedido(pedido.unidades, pedido.metodo);
  const pedidoId = nuevoPedidoId();
  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || req.headers.get('x-real-ip') || '';
  const navegador = req.headers.get('user-agent') ?? '';
  const url = typeof cuerpo.sourceUrl === 'string' && cuerpo.sourceUrl ? cuerpo.sourceUrl : `${base}/ecogel/pedido`;
  const { fbp, generado } = resolverFbp(req.cookies.get('_fbp')?.value);
  const fbc = resolverFbc(req.cookies.get('_fbc')?.value, url);
  const externalId = typeof cuerpo.externalId === 'string' ? cuerpo.externalId : '';
  const eventId = typeof cuerpo.eventId === 'string' && cuerpo.eventId.length >= 8 ? cuerpo.eventId : nuevoEventId();

  const fechaLocal = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Bogota', dateStyle: 'short', timeStyle: 'medium' }).format(new Date());

  await crearFilaPedido({
    estado: pedido.metodo === 'online' ? 'pendiente_pago' : 'confirmar',
    guia: '',
    fecha: fechaLocal,
    pedidoId,
    unidades: pedido.unidades,
    producto: totales.producto,
    envio: totales.envio,
    descuento: totales.descuento,
    total: totales.total,
    metodoPago: pedido.metodo,
    nombre: pedido.nombre,
    celular: pedido.celular,
    correo: pedido.correo,
    direccion: pedido.direccion,
    barrio: pedido.barrio,
    ciudad: pedido.ciudad,
    departamento: pedido.departamento,
    ofertas: pedido.ofertas ? 'sí' : 'no',
    origen: `ecogel-${pedido.de}`,
    ip,
    eventId,
    fbp,
    fbc: fbc ?? '',
    externalId,
    navegador,
    url,
    mpPagoId: '',
  }).catch((error) => {
    console.error('[hoja-pedidos] no se pudo guardar el pedido', pedidoId, error instanceof Error ? error.message : error);
  });

  if (capiConfigurada()) {
    try {
      const userData = await construirUserData({
        nombreCompleto: pedido.nombre,
        telefono: pedido.celular,
        correo: pedido.correo || undefined,
        municipio: pedido.ciudad,
        externalId: externalId || undefined,
      });
      const envio = await enviarEventoAMeta({
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: url,
        custom_data: {
          value: totales.total,
          currency: 'COP',
          content_ids: ['ecogel'],
          content_type: 'product',
          num_items: pedido.unidades,
          content_category: `ecogel-${pedido.de}`,
          order_id: pedidoId,
        },
        user_data: { ...userData, client_ip_address: ip || undefined, client_user_agent: navegador || undefined, fbp, fbc },
      });
      if (!envio.ok) console.error('[meta] Purchase no enviado:', envio.motivo, envio.detalle ?? '');
    } catch (error) {
      console.error('[meta] error inesperado enviando Purchase:', error);
    }
  }

  let ir = `/ecogel/gracias?pedido=${pedidoId}&estado=cod`;
  if (pedido.metodo === 'online') {
    if (!mpConfigurado()) return NextResponse.json({ ok: false, motivo: 'mp' }, { status: 502 });
    const pref = await crearPreferencia(
      construirPreferencia({ pedidoId, unidades: pedido.unidades, total: totales.total, nombre: pedido.nombre, correo: pedido.correo, celular: pedido.celular, segmento: pedido.de, base }),
    );
    if (!pref.ok) {
      console.error('[mp] no se pudo crear la preferencia', pedidoId, pref.detalle);
      return NextResponse.json({ ok: false, motivo: 'mp', pedidoId }, { status: 502 });
    }
    ir = pref.initPoint;
  }

  const respuesta = NextResponse.json({ ok: true, pedidoId, ir, eventId });
  if (generado) respuesta.cookies.set('_fbp', fbp, { maxAge: FBP_DURACION_S, path: '/', sameSite: 'lax', secure: true });
  return respuesta;
}

export async function GET() {
  return NextResponse.json({ ok: false }, { status: 405 });
}
```

Nota: `construirUserData` pone `st = 'santander'` fijo (herencia de las landings de fumigación). Para EcoGel el departamento varía; en esta ruta, después de `construirUserData`, sobrescribir `userData.st` con `await sha256(pedido.departamento.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, ''))` importando `sha256` de `@/lib/meta/hash`.

- [ ] **Step 2: Prueba manual con curl**

Run: `npm run dev` y luego:

```bash
curl -s -X POST http://localhost:3000/api/ecogel/pedido -H 'content-type: application/json' \
  -d '{"unidades":3,"metodo":"contraentrega","nombre":"Prueba Local","celular":"3107891948","correo":"","direccion":"Calle 1 # 2-3","barrio":"Centro","ciudad":"Bucaramanga","departamento":"Santander","ofertas":true,"de":"hogar","eventId":"prueba-local-0001"}'
```

Expected: `{"ok":true,"pedidoId":"EG-…","ir":"/ecogel/gracias?pedido=EG-…&estado=cod","eventId":"prueba-local-0001"}`. Con `"metodo":"online"` y correo, `ir` empieza por `https://www.mercadopago.com.co/checkout/`.

Repetir con `"unidades":4` → 400 con `errores.unidades`.

- [ ] **Step 3: Lint, build y commit**

```bash
npm run lint && npm run build
git add app/api/ecogel/pedido/route.ts
git commit -m "feat(ecogel): API de pedidos con hoja, Purchase y Mercado Pago

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 10: Webhook `POST /api/ecogel/mp`

**Files:**
- Create: `app/api/ecogel/mp/estado.ts`
- Create: `app/api/ecogel/mp/estado.test.ts`
- Create: `app/api/ecogel/mp/route.ts`

**Interfaces:**
- Produces: `function estadoDesdeMp(status: string): 'pagado' | 'pago_fallido' | null` (`approved` → pagado; `rejected`/`cancelled` → pago_fallido; otros → null, no se toca la hoja).

- [ ] **Step 1: Prueba que falla**

`app/api/ecogel/mp/estado.test.ts`:

```ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoDesdeMp } from './estado';

test('approved marca pagado; rejected y cancelled marcan pago_fallido; el resto no toca', () => {
  assert.equal(estadoDesdeMp('approved'), 'pagado');
  assert.equal(estadoDesdeMp('rejected'), 'pago_fallido');
  assert.equal(estadoDesdeMp('cancelled'), 'pago_fallido');
  assert.equal(estadoDesdeMp('pending'), null);
  assert.equal(estadoDesdeMp('in_process'), null);
  assert.equal(estadoDesdeMp(''), null);
});
```

- [ ] **Step 2: Verificar que falla**

Run: `npm test` → FAIL `Cannot find module './estado'`.

- [ ] **Step 3: Implementar**

`app/api/ecogel/mp/estado.ts`:

```ts
/** Estado de la hoja según el status del pago en Mercado Pago. null = no cambiar nada. */
export function estadoDesdeMp(status: string): 'pagado' | 'pago_fallido' | null {
  if (status === 'approved') return 'pagado';
  if (status === 'rejected' || status === 'cancelled') return 'pago_fallido';
  return null;
}
```

`app/api/ecogel/mp/route.ts`:

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { consultarPago, mpConfigurado } from '@/lib/mercadopago';
import { actualizarFilaPedido } from '@/lib/hoja-pedidos';
import { estadoDesdeMp } from './estado';

/**
 * Webhook de Mercado Pago.
 *
 * No se confía en el cuerpo de la notificación: solo trae un id. El servidor
 * consulta ese pago con el token y actúa con lo que responde la API. Quien no
 * tenga el token no puede fabricar un pago aprobado, así que no hace falta
 * validar firmas.
 *
 * Responde 200 siempre que el aviso tenga forma, incluso si el pago no cambia
 * nada: Mercado Pago reintenta ante cualquier otro código.
 */
export async function POST(req: NextRequest) {
  if (!mpConfigurado()) return NextResponse.json({ ok: false }, { status: 503 });

  let cuerpo: { type?: string; action?: string; data?: { id?: string | number } } = {};
  try {
    cuerpo = await req.json();
  } catch {
    // Algunas notificaciones viejas mandan todo por query string.
  }
  const tipo = cuerpo.type ?? req.nextUrl.searchParams.get('type') ?? req.nextUrl.searchParams.get('topic') ?? '';
  const id = String(cuerpo.data?.id ?? req.nextUrl.searchParams.get('data.id') ?? req.nextUrl.searchParams.get('id') ?? '');

  if (tipo !== 'payment' || !id) return NextResponse.json({ ok: true, ignorado: true });

  const pago = await consultarPago(id);
  if (!pago.ok) {
    console.error('[mp] no se pudo consultar el pago', id, pago.detalle);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  const estado = estadoDesdeMp(pago.status);
  if (!estado || !pago.externalReference.startsWith('EG-')) return NextResponse.json({ ok: true, ignorado: true });

  try {
    await actualizarFilaPedido(pago.externalReference, { estado, mpPagoId: id });
  } catch (error) {
    console.error('[hoja-pedidos] no se pudo actualizar', pago.externalReference, error instanceof Error ? error.message : error);
    return NextResponse.json({ ok: false }, { status: 502 });
  }
  return NextResponse.json({ ok: true, estado });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Verificar, build y commit**

Run: `npm test && npm run lint && npm run build` → PASS.

```bash
git add app/api/ecogel/mp/
git commit -m "feat(ecogel): webhook de Mercado Pago que marca la hoja

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 11: Checkout `/ecogel/pedido`

**Files:**
- Create: `components/ecogel/FormularioPedido.tsx`
- Create: `app/ecogel/pedido/page.tsx`

**Interfaces:**
- Consumes: `SelectorTier`, `TierProvider`, `useTier`, `totalPedido`, `money`, `DEPARTAMENTOS`, `validarPedido`, `soloPixel`, `rastrear`, `idDeVisitante`, `esUnidades`, `esSegmento`.
- Produces: `<FormularioPedido segmento unidadesIniciales />`. Guarda en `sessionStorage` `ecogel_compra = JSON.stringify({ pedidoId, eventId, valor, unidades, segmento })` antes de redirigir, para que `/gracias` dispare el Purchase por Pixel con el mismo id.

- [ ] **Step 1: Página**

`app/ecogel/pedido/page.tsx`:

```tsx
import type { Metadata } from 'next';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import FormularioPedido from '@/components/ecogel/FormularioPedido';
import PieEcogel from '@/components/ecogel/PieEcogel';
import { TierProvider } from '@/components/ecogel/TierContext';
import { TIER_POR_DEFECTO, configDe, esSegmento, esUnidades } from '@/lib/ecogel';

export const metadata: Metadata = {
  title: 'Tu pedido de EcoGel | AGROINCOL',
  robots: { index: false, follow: false },
};

export default function PedidoPage({ searchParams }: { searchParams: { u?: string; de?: string } }) {
  const u = Number(searchParams.u);
  const unidades = esUnidades(u) ? u : TIER_POR_DEFECTO;
  const segmento = esSegmento(searchParams.de) ? searchParams.de : 'hogar';
  return (
    <TierProvider>
      <CabeceraEcogel whatsappTexto={configDe(segmento).whatsappTexto} />
      <FormularioPedido segmento={segmento} unidadesIniciales={unidades} />
      <PieEcogel />
    </TierProvider>
  );
}
```

- [ ] **Step 2: Formulario**

`components/ecogel/FormularioPedido.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DESCUENTO_ONLINE, money, totalPedido, type MetodoPago, type Segmento, type Unidades } from '@/lib/ecogel';
import { DEPARTAMENTOS, validarPedido } from '@/lib/ecogel-pedido';
import { rastrear, soloPixel } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';
import SelectorTier from './SelectorTier';
import { useTier } from './TierContext';

// Checkout de una página (spec §4). Orden: selector → resumen → datos de entrega →
// método de pago (en línea preseleccionado) → botón con el total → línea legal.

const campo =
  'mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25';

export default function FormularioPedido({ segmento, unidadesIniciales }: { segmento: Segmento; unidadesIniciales: Unidades }) {
  const { unidades, setUnidades } = useTier();
  const [metodo, setMetodo] = useState<MetodoPago>('online');
  const [datos, setDatos] = useState({ nombre: '', celular: '', correo: '', direccion: '', barrio: '', ciudad: '', departamento: '' });
  const [ofertas, setOfertas] = useState(true);
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'error-mp' | 'error'>('idle');

  useEffect(() => {
    setUnidades(unidadesIniciales);
    // InitiateCheckout: una vez por sesión (ver UNA_VEZ_POR_SESION en lib/meta/pixel.ts).
    rastrear('InitiateCheckout', {
      categoria: `ecogel-${segmento}`,
      valor: totalPedido(unidadesIniciales, 'contraentrega').total,
      contenido: { ids: ['ecogel'], numItems: unidadesIniciales },
    });
  }, [unidadesIniciales, segmento, setUnidades]);

  const t = totalPedido(unidades, metodo);
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const entrada = { ...datos, unidades, metodo, ofertas, de: segmento };
    const v = validarPedido(entrada);
    if (!v.ok) {
      setErrores(v.errores);
      return;
    }
    setErrores({});
    setEstado('enviando');

    // El Pixel dispara Purchase en /gracias, no aquí: si el pago en línea falla no
    // hubo compra. Pero el event_id se genera ahora, viaja al servidor (que sí
    // manda el Purchase por CAPI al crear el pedido) y se guarda para /gracias.
    const eventId = crypto.randomUUID();

    try {
      const res = await fetch('/api/ecogel/pedido', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...entrada, website, eventId, externalId: idDeVisitante(), sourceUrl: window.location.href }),
      });
      const json = (await res.json()) as { ok: boolean; pedidoId?: string; ir?: string; errores?: Record<string, string>; motivo?: string };
      if (!res.ok || !json.ok) {
        if (json.errores) setErrores(json.errores);
        setEstado(json.motivo === 'mp' ? 'error-mp' : 'error');
        return;
      }
      try {
        window.sessionStorage.setItem(
          'ecogel_compra',
          JSON.stringify({ pedidoId: json.pedidoId, eventId, valor: t.total, unidades, segmento }),
        );
      } catch {
        // Sin almacenamiento el Purchase sale solo por el servidor. Aceptable.
      }
      window.location.assign(json.ir ?? '/ecogel/gracias');
    } catch {
      setEstado('error');
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="container-custom max-w-xl pb-10 pt-6">
      <h1 className="font-heading text-h2-mobile text-brand-green md:text-h2">Tu pedido</h1>

      <section className="mt-5">
        <SelectorTier compacto />
        <dl className="mt-4 space-y-1 rounded-xl bg-brand-light p-4 text-body-sm">
          <div className="flex justify-between"><dt>EcoGel x{unidades}</dt><dd>{money(t.producto)}</dd></div>
          <div className="flex justify-between"><dt>Envío</dt><dd>{t.envio === 0 ? 'Gratis' : money(t.envio)}</dd></div>
          {t.descuento > 0 && (
            <div className="flex justify-between text-brand-green"><dt>Descuento por pago en línea</dt><dd>−{money(t.descuento)}</dd></div>
          )}
          <div className="flex justify-between border-t border-brand-gray-light pt-2 font-heading text-body font-bold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>
      </section>

      <section className="mt-6 space-y-3.5">
        <h2 className="font-heading text-h3 text-brand-green">Datos de entrega</h2>
        {(
          [
            ['nombre', 'Nombre completo', 'text', 'name'],
            ['celular', 'Celular (WhatsApp)', 'tel', 'tel'],
            ['correo', metodo === 'online' ? 'Correo' : 'Correo (opcional)', 'email', 'email'],
            ['direccion', 'Dirección', 'text', 'street-address'],
            ['barrio', 'Barrio', 'text', 'address-level3'],
            ['ciudad', 'Ciudad / municipio', 'text', 'address-level2'],
          ] as const
        ).map(([k, label, type, auto]) => (
          <div key={k}>
            <label htmlFor={`p-${k}`} className="block text-body-sm font-medium text-brand-black">{label}</label>
            <input id={`p-${k}`} name={k} type={type} autoComplete={auto} inputMode={type === 'tel' ? 'tel' : undefined} value={datos[k]} onChange={set(k)} className={campo} />
            {errores[k] && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores[k]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="p-departamento" className="block text-body-sm font-medium text-brand-black">Departamento</label>
          <select id="p-departamento" name="departamento" value={datos.departamento} onChange={set('departamento')} className={campo}>
            <option value="">Escoge…</option>
            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errores.departamento && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores.departamento}</p>}
        </div>
        <label className="flex items-start gap-2.5 text-body-sm text-brand-black/70">
          <input type="checkbox" checked={ofertas} onChange={(e) => setOfertas(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-brand-gray-light text-brand-green" />
          Recibir ofertas y la guía de aplicación por correo
        </label>
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      </section>

      <fieldset className="mt-6">
        <legend className="font-heading text-h3 text-brand-green">Método de pago</legend>
        <div className="mt-3 space-y-2">
          {(
            [
              ['online', 'Pagar ahora — PSE, Nequi, tarjeta', `${money(DESCUENTO_ONLINE)} menos`],
              ['contraentrega', 'Pagar al recibir', 'solo efectivo'],
            ] as const
          ).map(([valor, titulo, nota]) => (
            <label key={valor} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 ${metodo === valor ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light'}`}>
              <input type="radio" name="metodo" value={valor} checked={metodo === valor} onChange={() => setMetodo(valor)} className="h-4 w-4 text-brand-green" />
              <span className="flex-1">
                <span className="block font-semibold text-brand-black">{titulo}</span>
                <span className="block text-body-sm text-brand-black/60">{nota}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {estado === 'error-mp' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          No pudimos abrir el pago en línea. Tu pedido quedó guardado: escoge «Pagar al recibir» y confírmalo, o escríbenos por WhatsApp.
        </p>
      )}
      {estado === 'error' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          No pudimos registrar el pedido. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'} className="mt-6 w-full rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand disabled:opacity-60">
        {estado === 'enviando' ? (
          <span className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" aria-hidden /> Procesando…</span>
        ) : (
          `Confirmar pedido — ${money(t.total)}`
        )}
      </button>
      <p className="mt-3 text-center text-body-sm text-brand-black/55">
        Al confirmar aceptas que te contactemos por WhatsApp para coordinar la entrega.{' '}
        <a href="/politica-de-privacidad" target="_blank" className="underline">Política de privacidad</a>.
      </p>
    </form>
  );
}
```

- [ ] **Step 3: Prueba manual**

Run: `npm run dev`, abrir `/ecogel/pedido?u=3&de=hogar` en móvil.
- Llega con 3 preseleccionado y "Pagar ahora" marcado; total `$114.700`.
- Cambiar a contraentrega: total `$119.700`, la etiqueta del correo pasa a "(opcional)".
- Enviar vacío: errores por campo, sin llamada al servidor.
- Enviar completo con contraentrega: redirige a `/ecogel/gracias?pedido=EG-…&estado=cod`.
- Enviar completo con "Pagar ahora": redirige a Mercado Pago con "EcoGel x3 — AGROINCOL" y `$114.700`. **No pagar.**

- [ ] **Step 4: Lint, build y commit**

```bash
npm run lint && npm run build
git add components/ecogel/FormularioPedido.tsx app/ecogel/pedido/
git commit -m "feat(ecogel): checkout de una página con contraentrega y pago en línea

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 12: `/ecogel/gracias` y Purchase por Pixel

**Files:**
- Create: `components/ecogel/RastreoCompra.tsx`
- Create: `app/ecogel/gracias/page.tsx`

**Interfaces:**
- Consumes: `soloPixel` (con `eventId` explícito), `whatsappEcogel`, `money`.
- Produces: página con los cuatro estados del spec §9.

- [ ] **Step 1: Rastreo del Purchase**

`components/ecogel/RastreoCompra.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { soloPixel } from '@/lib/meta/pixel';

/**
 * Purchase por el Pixel, con el MISMO event_id que el servidor ya usó por CAPI
 * al crear el pedido. Meta deduplica por (event_name, event_id). Solo en los
 * estados en que hubo compra; si el almacenamiento está bloqueado, el evento ya
 * salió por el servidor y aquí no pasa nada.
 */
export default function RastreoCompra({ pedidoId, estado }: { pedidoId: string; estado: string }) {
  useEffect(() => {
    if (estado !== 'cod' && estado !== 'approved') return;
    try {
      const crudo = window.sessionStorage.getItem('ecogel_compra');
      if (!crudo) return;
      const c = JSON.parse(crudo) as { pedidoId: string; eventId: string; valor: number; unidades: number; segmento: string };
      if (c.pedidoId !== pedidoId) return;
      soloPixel('Purchase', {
        eventId: c.eventId,
        valor: c.valor,
        categoria: `ecogel-${c.segmento}`,
        contenido: { ids: ['ecogel'], numItems: c.unidades },
      });
    } catch {
      // idem
    }
  }, [pedidoId, estado]);
  return null;
}
```

- [ ] **Step 2: Página**

`app/ecogel/gracias/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { CheckCircle2, Clock, MessageCircle, XCircle } from 'lucide-react';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import PieEcogel from '@/components/ecogel/PieEcogel';
import RastreoCompra from '@/components/ecogel/RastreoCompra';
import { whatsappEcogel } from '@/lib/ecogel';

export const metadata: Metadata = { title: 'Pedido recibido | AGROINCOL', robots: { index: false, follow: false } };

const TEXTOS = {
  cod: {
    icono: CheckCircle2,
    titulo: 'Pedido recibido',
    texto: 'Te escribimos por WhatsApp para confirmar la dirección. Llega en 2-4 días hábiles y pagas en efectivo al recibir.',
  },
  approved: { icono: CheckCircle2, titulo: 'Pago recibido', texto: 'Tu pedido sale en las próximas 24 horas. Te enviamos la guía de la transportadora por WhatsApp.' },
  pending: { icono: Clock, titulo: 'Pago en proceso', texto: 'PSE puede tardar unos minutos en confirmar. Te avisamos por correo y WhatsApp apenas entre.' },
  failure: { icono: XCircle, titulo: 'El pago no se completó', texto: 'No se cobró nada. Escríbenos y lo resolvemos: puedes volver a intentar en línea o pagar al recibir.' },
} as const;

export default function GraciasPage({ searchParams }: { searchParams: { pedido?: string; estado?: string } }) {
  const pedido = /^EG-\d{6}-[A-Z0-9]{4}$/.test(searchParams.pedido ?? '') ? (searchParams.pedido as string) : '';
  const estado = (searchParams.estado ?? 'cod') as keyof typeof TEXTOS;
  const t = TEXTOS[estado] ?? TEXTOS.cod;
  const Icono = t.icono;
  const wa = whatsappEcogel(`Hola, es sobre mi pedido de EcoGel ${pedido}`.trim());

  return (
    <>
      <CabeceraEcogel whatsappTexto={`Hola, es sobre mi pedido de EcoGel ${pedido}`} />
      <main className="container-custom max-w-xl py-12 text-center">
        <Icono size={52} className={`mx-auto ${estado === 'failure' ? 'text-brand-orange-dark' : 'text-brand-green'}`} aria-hidden />
        <h1 className="font-heading text-h2-mobile text-brand-green mt-4 md:text-h2">{t.titulo}</h1>
        {pedido && <p className="mt-2 font-heading text-body font-bold text-brand-black">Pedido {pedido}</p>}
        <p className="text-brand-black/75 mt-3 text-body">{t.texto}</p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white">
          <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
        </a>
        <p className="mt-8 text-body-sm text-brand-black/55">Guarda el número de pedido: es lo que necesitas para cualquier reclamo o para la garantía de 30 días.</p>
      </main>
      <PieEcogel />
      {pedido && <RastreoCompra pedidoId={pedido} estado={estado} />}
    </>
  );
}
```

- [ ] **Step 3: Prueba manual**

Abrir `/ecogel/gracias?pedido=EG-260919-K7Q2&estado=cod`, `…&estado=approved`, `…&estado=pending`, `…&estado=failure`: cuatro textos distintos, ícono correcto, botón de WhatsApp con el id. Con el Pixel activo y `ecogel_compra` en sessionStorage (dejado por el checkout), en `cod` y `approved` la extensión Meta Pixel Helper muestra un `Purchase` con `eventID` igual al del pedido.

- [ ] **Step 4: Lint, build y commit**

```bash
npm run lint && npm run build
git add components/ecogel/RastreoCompra.tsx app/ecogel/gracias/
git commit -m "feat(ecogel): página de gracias con Purchase deduplicado

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>"
```

---

### Task 13: Verificación de punta a punta y cierre

**Files:** ninguno nuevo.

- [ ] **Step 1: Suite completa**

Run: `npm test && npm run lint && npm run build`
Expected: todo verde; el build lista `/ecogel`, `/ecogel/hogar`, `/ecogel/restaurantes`, `/ecogel/pedido`, `/ecogel/gracias`, `/api/ecogel/pedido`, `/api/ecogel/mp`.

- [ ] **Step 2: Aislamiento del bundle**

Run: `grep -rl "fbevents" .next/static/chunks/app/ | grep -v "lp/\|ecogel/" || echo "aislado"`
Expected: `aislado` (el Pixel solo vive en los chunks de `/lp` y `/ecogel`).

- [ ] **Step 3: Recorrido móvil completo (dev)**

1. `/ecogel/hogar` → sticky visible desde el primer frame, tier 3 preseleccionado.
2. Cambiar a 2 → CTA y sticky dicen `$89.800`; pulsar el sticky → `/ecogel/pedido?u=2&de=hogar`.
3. Checkout con contraentrega → `/gracias?…&estado=cod`.
4. Checkout con pago en línea → Mercado Pago muestra `EcoGel x2 — AGROINCOL` `$84.800`. Volver sin pagar.
5. `/ecogel/restaurantes` → H1 y beneficios del segmento restaurantes; WhatsApp abre con el texto de restaurantes.

- [ ] **Step 4: Pendientes que no son código (recordárselos a Camilo al entregar)**

- Crear la hoja "Pedidos EcoGel" con `docs/hoja-de-pedidos.md`; cargar `HOJA_PEDIDOS_URL` y `HOJA_PEDIDOS_SECRETO` en Vercel Production.
- Tras el despliegue, un pedido real de prueba en línea por el tier de 1 unidad (`$54.900`) y reembolso desde el panel de Mercado Pago: verifica webhook → `pagado` en la hoja.
- Renovar el Access Token de Mercado Pago y cargarlo directo en Vercel (quedó pegado en un chat).
- Número real de restaurantes atendidos (`AUTORIDAD.restaurantes`), fotos en `public/ecogel/` y reseñas reales antes de pautar.

- [ ] **Step 5: Commit final si quedó algo suelto y push**

```bash
git status --short
git push -u origin feat/ecogel
```
