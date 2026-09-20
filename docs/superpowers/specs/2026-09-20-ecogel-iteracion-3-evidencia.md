# EcoGel — iteración 3: evidencia real como prueba social (20-sep-2026)

Reemplaza la "figura de autoridad" de la iteración 2 (§10) por evidencia verificable: estudios, una noticia y la norma. Reglas:

- **Todo dato es real y está enlazado.** No se inventa ni se redondea más allá de lo que dice la fuente. Copy honesto: nunca "EcoGel fue probado por…"; sí "un gel con la misma molécula y concentración que EcoGel (imidacloprid 2,15 %)".
- **Las tarjetas deben verse ajenas a la página**, como recortes traídos de afuera: nada de `brand-green`/`brand-orange`, nada de esquinas `rounded-2xl` de la marca. Tres estilos según el tipo (abajo). Sin logos de terceros (no tenemos licencia ni los archivos); el nombre del medio va como cabecera tipográfica.
- **Formato carrusel horizontal** (scroll-snap, tarjetas de ~300px, flechas y puntos como la galería), corto en vertical.
- Las cifras también se **siembran** en otros puntos de la página y del checkout (§4), siempre con su fuente en una línea.

## 1. Datos: `lib/ecogel-evidencia.ts`

```ts
export type TipoEvidencia = 'estudio' | 'noticia' | 'norma';
export interface Evidencia {
  tipo: TipoEvidencia;
  /** Cabecera tipográfica: nombre del medio/revista/entidad. */
  fuente: string;
  /** Línea secundaria: autores e institución, o fecha, o "Ministerio de…". */
  detalle: string;
  /** El dato, en una frase, con la cifra en negrita marcada con ** **. */
  dato: string;
  /** Cita corta para el pie de la tarjeta. */
  cita: string;
  url: string;
  anio: number;
}
```

Entradas (exactas):

```ts
const IMIDACLOPRID: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Appel & Tanley · Auburn University · 2000',
  dato: 'Un gel de **imidacloprid al 2,15 %** —la misma molécula y concentración de EcoGel— redujo las cucarachas en cocinas de casas infestadas **~50 % en 1 semana y ~80 % en 4 semanas**.',
  cita: 'J. Econ. Entomol. 93(1):112–118. doi:10.1603/0022-0493-93.1.112',
  url: 'https://pubmed.ncbi.nlm.nih.gov/14658520/',
  anio: 2000,
};
const CASCADA: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Hamilton, Wada-Katsumata & Schal · North Carolina State University · 2023',
  dato: 'El **100 %** de las cucarachas que comen el gel mueren y contagian a **más del 85 %** de las que nunca lo tocaron, **en 48 horas**.',
  cita: 'J. Econ. Entomol. 116(2):529–537',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12102599/',
  anio: 2023,
};
const AEROSOL: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Miller & Meek · Virginia Tech · 2004 · 12 meses, 1.200 viviendas',
  dato: 'El programa de **aerosol mensual "tuvo poco o ningún efecto"** y la población **se triplicó** en verano. El programa con cebos bajó de 24,7 a 3,9 cucarachas por vivienda (**−84 %**) y se mantuvo así el resto del año.',
  cita: 'J. Econ. Entomol. 97(2):559–569. PMID 15154482',
  url: 'https://pubmed.ncbi.nlm.nih.gov/15154482/',
  anio: 2004,
};
const ASMA: Evidencia = {
  tipo: 'estudio',
  fuente: 'The New England Journal of Medicine',
  detalle: 'Rosenstreich et al. · 476 niños con asma · 1997',
  dato: 'Los niños alérgicos a la cucaracha y expuestos en su habitación tuvieron **0,37 hospitalizaciones al año frente a 0,11** —más de tres veces— y más urgencias, noches sin dormir y días sin colegio.',
  cita: 'N. Engl. J. Med. 336(19):1356–1363. doi:10.1056/NEJM199705083361904',
  url: 'https://pubmed.ncbi.nlm.nih.gov/9134876/',
  anio: 1997,
};
const NORMA: Evidencia = {
  tipo: 'norma',
  fuente: 'Resolución 2674 de 2013',
  detalle: 'Ministerio de Salud y Protección Social · Colombia',
  dato: 'Todo establecimiento que prepare o venda alimentos debe tener **control de plagas**; la presencia de plagas es **hallazgo crítico** en la inspección sanitaria.',
  cita: 'Requisitos sanitarios para establecimientos de alimentos',
  url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-2674-de-2013.pdf',
  anio: 2013,
};
const CIERRES: Evidencia = {
  tipo: 'noticia',
  fuente: 'Infobae',
  detalle: 'Colombia · 20 de marzo de 2026',
  dato: 'La Secretaría de Salud de Ibagué **cerró locales de alimentos por hallazgo de cucarachas** antes de Semana Santa. En 2025, **más de 15 restaurantes** de la ciudad fueron cerrados por plagas.',
  cita: '"Secretaría de Salud de Ibagué clausuró locales de venta de pescado por hallazgo de cucarachas"',
  url: 'https://www.infobae.com/colombia/2026/03/20/secretaria-de-salud-de-ibague-clausuro-locales-de-venta-de-pescado-por-hallazgo-de-cucarachas-antes-de-semana-santa/',
  anio: 2026,
};

export const EVIDENCIA: Record<Segmento, Evidencia[]> = {
  hogar: [IMIDACLOPRID, CASCADA, ASMA, AEROSOL],
  restaurantes: [NORMA, CIERRES, IMIDACLOPRID, CASCADA, AEROSOL],
};
```

Si el enlace del PDF de la resolución no responde 200 al verificar con `curl -sI`, usar `https://www.minsalud.gov.co/Normatividad_Nuevo/Resoluci%C3%B3n%202674%20de%202013.pdf` o, en último caso, la búsqueda en la Biblioteca Digital del Ministerio; anotar en el reporte cuál quedó.

Además, `RESTAURANTES_CLIENTES: { nombre: string; ciudad: string; placeholder: boolean }[]` con 5 entradas placeholder ("Restaurante de ejemplo", "Bucaramanga", `placeholder: true`) para la franja "Restaurantes que confían en AGROINCOL" (solo en el segmento restaurantes).

## 2. Componente `Evidencia` (reemplaza `Autoridad` en el orden; `Autoridad` se elimina)

Cabecera de sección (esta sí con la tipografía de la página): eyebrow "Prueba, no promesas" y título por segmento — hogar: "Lo dice la ciencia, no nosotros"; restaurantes: "Lo dice la norma, la prensa y la ciencia". Debajo, el carrusel (cliente, mismo patrón de scroll-snap, flechas y puntos que la galería; tarjetas de `w-[300px]` con `snap-center`, gap 16px, padding lateral del contenedor).

Estilos por tipo (todas las tarjetas con `font-serif` para el texto; `Georgia, 'Times New Roman', serif`):

- **estudio** — "página de revista": fondo `#FFFFFF`, borde 1px `#111`, esquinas rectas (`rounded-none`), cabecera con `fuente` en versalitas (`uppercase tracking-[0.18em] text-[11px]`) separada por una regla negra de 2px; `detalle` en 12px gris; `dato` en 15px serif con negritas; pie con `cita` en 11px monospace (`font-mono`) y un enlace "Ver estudio ↗" en negro subrayado. Una etiqueta vertical "PEER-REVIEWED" en el borde derecho, girada 90°, 10px, gris.
- **noticia** — "recorte de periódico": fondo `#F7F5EE` (papel), esquinas rectas, `fuente` en negrita serif 20px como masthead con una línea fina debajo, `detalle` como dateline en versalitas 11px, `dato` en 15px serif, columna de texto estrecha; pie con enlace "Leer la noticia ↗".
- **norma** — "documento oficial": fondo `#FFFFFF`, borde doble (`border-4 border-double border-[#333]`), cabecera "REPÚBLICA DE COLOMBIA" en 10px centrada arriba y `fuente` en negrita 16px centrada, `detalle` centrado 12px, `dato` justificado, pie "Ver la resolución ↗".

Las negritas del `dato` se renderizan partiendo la cadena por `**` (sin `dangerouslySetInnerHTML`).

Debajo del carrusel, solo en restaurantes: franja "Restaurantes que confían en AGROINCOL" con las 5 tarjetas placeholder en fila con scroll (borde punteado + etiqueta "Placeholder: cliente por autorizar").

Debajo de todo, en ambos segmentos, la franja compacta actual de "41 años · +N restaurantes" (con su aviso `+N`).

## 3. Orden bajo el fold (sustituye §7 de la iteración 2)
Galería → MarqueeResenas → CajaCompra → BloqueGarantia → AprendeAUsarlo → Objeciones → AntesDespues (+ reseña) → **Evidencia** → Beneficios → Casos → Comparativa → SinRiesgo → PreguntasEcogel → Resenas → PieEcogel.

## 4. Siembra de datos (una línea con fuente, tipografía de la página)

- `CajaCompra`: bajo los 4 beneficios, una línea `−80 % de cucarachas en 4 semanas · Journal of Economic Entomology, 2000` con enlace en "ver estudio" (hogar y restaurantes).
- `Objeciones` / `lib/ecogel.ts`: la respuesta de "¿Cuándo hace efecto?" termina con "(Journal of Economic Entomology, 2000 y 2023)"; la de "¿Es seguro con niños y mascotas?" (hogar) suma: "Y quitar las cucarachas importa: el NEJM asoció su presencia con el triple de hospitalizaciones en niños asmáticos."; la de "¿Puedo aplicarlo con la cocina funcionando?" (restaurantes) suma: "La Resolución 2674 exige control de plagas; el gel cumple sin cerrar."
- `Comparativa`: bajo la tabla, nota en 12px: `Aerosol mensual: "poco o ningún efecto" en 12 meses · Virginia Tech, J. Econ. Entomol. 2004` con enlace.
- `FormularioPedido` (checkout): entre el resumen de precios y "Datos de entrega", una franja gris clara con dos líneas: `✓ −80 % en 4 semanas (Journal of Economic Entomology, 2000)` y `✓ Garantía: si en 30 días siguen, otro kit sin costo` (usa `GARANTIA.dias`).
- `BarraSticky`: sin cambios.

## Verificación
`npm run lint && npm run build && npm test` (20/20). `curl -sI` a las 6 URL: todas 200 (o 30x que termine en 200); anotar en el reporte. En navegador móvil: el carrusel de evidencia se desliza, las tarjetas se ven claramente distintas al resto de la página (serif, bordes rectos, sin colores de marca), y las líneas sembradas aparecen en la caja de compra, comparativa y checkout.
