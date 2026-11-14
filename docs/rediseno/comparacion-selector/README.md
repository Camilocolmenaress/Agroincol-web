# Selector del home contra agrumeafarm.it (14-nov)

En los videos va la referencia a la izquierda y nuestro selector a la derecha, haciendo los mismos gestos.

**Escritorio (1440×900):** rueda lenta, rueda rápida, arrastre, cursor sobre un objeto y clic.

**Celular (390×844):** dos deslizamientos verticales y dos horizontales.
- En la referencia el deslizamiento vertical no mueve los frascos.
- En el nuestro el vertical sí mueve la fila (decisión del 14-nov).

## Números (`scripts/referencia/comparar-selector.cjs`, 1440×900)

| Medida | Referencia | AGROINCOL |
|---|---|---|
| Una muesca de rueda (100) | 113 px | 114 px |
| % del recorrido a los 257 ms | 42 % | 42 % |
| Se detiene a los | 2,29 s | 2,30 s |
| Giro del lema por cada 100 px | 1,22° | 1,21° |
| Deriva quieto 4 s | 0,1 px | 0,1 px |
| Escalas visibles (izquierda → derecha) | 0,97 · 1,38 · 1,14 · 0,68 | 0,91 · 1,33 · 1,22 · 0,77 |
| Cambio de escala con el cursor encima | +0,055 | +0,015 |

**Arrastre de 500 px en ~320 ms:**
- AGROINCOL recorre 1160 px.
- En esta corrida el arrastre no movió la referencia (el navegador automatizado arrastró la imagen).
- El informe de escritorio midió 917 px en la referencia (`descomposicion-agrumea/anexos/b-escritorio.md` §1.4). La fórmula es la misma; la diferencia sale del ritmo del gesto.
