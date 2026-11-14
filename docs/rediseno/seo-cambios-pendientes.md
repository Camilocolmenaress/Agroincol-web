# Cambios de SEO pendientes de aprobación

Generado con `node scripts/seo-baseline.mjs --compare` contra la línea base de `main` (`scripts/seo-pendientes.py`). Nada de esto está en `seo-cambios-aprobados.json`: hay que aprobarlo antes del merge.

**Sin ninguna diferencia:** el resto del sitio (zonas, blog, precios, certificaciones, calculadora, reseña y privacidad, con el rediseño visual de la fase 5) y las 9 landings de pauta.

## Resumen por tipo

| Cambio | Dónde | Por qué |
|---|---|---|
| +10 enlaces internos, uno por objeto 3D del desfile (alt como texto) | `/` | Cada objeto lleva a su servicio (cursor "Ver servicio"), como los frascos de la referencia. |
| +9 imágenes 3D con alt descriptivo | `/` | Regla del brief: cada render 3D lleva alt descriptivo. La de la casa ya está aprobada (D3). |
| +N `<img alt="">` decorativas | `/`, servicios | El mismo render ya descrito una vez (foco, hover de segmentos, tarjetas de servicio). |
| −1 imagen: la foto del hero y su alt | 9 servicios | La plantilla de servicio usa el objeto 3D. En el home, sacar la foto ya está aprobado (D3). |
| +8 enlaces en "Otros servicios" (solo el nombre) | 9 servicios | Pedido en el brief (6.2.6). Sin H2 ni H3 nuevos. |
| Unas 50 palabras más | 9 servicios | "Otros servicios", los 8 nombres y las etiquetas laterales (aria-hidden). |

## Detalle por página

### `/`

- + enlace: `/servicios/fumigacion-residencial`: «Casa santandereana con techo de teja, en 3D: fumigación para hogares de AGROINCOL»
- + enlace: `/servicios/fumigacion-restaurantes`: «Cocina de restaurante con estufa y ollas, en 3D: control de plagas para restaurantes de AGROINCOL»
- + enlace: `/servicios/control-insectos-voladores`: «Bomba de aspersión de espalda, en 3D: control de zancudos y moscas de AGROINCOL»
- + enlace: `/servicios/fumigacion-industrial`: «Estiba con cajas de bodega, en 3D: fumigación industrial y control de plagas para empresas de AGROIN»
- + enlace: `/servicios/desratizacion`: «Estación cebadera para roedores, en 3D: desratización de AGROINCOL»
- + enlace: `/servicios/control-plagas-comercial`: «Gotas de gel insecticida sobre una baldosa, en 3D: control de cucarachas en negocios de AGROINCOL»
- + enlace: `/servicios/control-comejen-termitas`: «Aplicador de gel en jeringa, en 3D: tratamiento de comején y termitas de AGROINCOL»
- + enlace: `/servicios/control-plagas-comercial`: «Caja del kit de bienvenida para empresas con el logo de AGROINCOL, en 3D: control de plagas comercia»
- + enlace: `/certificado-de-fumigacion`: «Acta de hallazgos con sello y código QR, en 3D: el documento que AGROINCOL entrega después de cada s»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Gorra blanca con el símbolo de AGROINCOL bordado, en 3D: técnicos con equipo de protección para reti»
- + img: alt «Cocina de restaurante con estufa y ollas, en 3D: control de plagas para restaurantes de AGROINCOL»
- + img: alt «Bomba de aspersión de espalda, en 3D: control de zancudos y moscas de AGROINCOL»
- + img: alt «Estiba con cajas de bodega, en 3D: fumigación industrial y control de plagas para empresas de AGROINCOL»
- + img: alt «Estación cebadera para roedores, en 3D: desratización de AGROINCOL»
- + img: alt «Gotas de gel insecticida sobre una baldosa, en 3D: control de cucarachas en negocios de AGROINCOL»
- + img: alt «Aplicador de gel en jeringa, en 3D: tratamiento de comején y termitas de AGROINCOL»
- + img: alt «Caja del kit de bienvenida para empresas con el logo de AGROINCOL, en 3D: control de plagas comercial»
- + img: alt «Acta de hallazgos con sello y código QR, en 3D: el documento que AGROINCOL entrega después de cada servicio»
- + img: alt «Gorra blanca con el símbolo de AGROINCOL bordado, en 3D: técnicos con equipo de protección para retiro de abejas y avispas»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/fumigacion-restaurantes`

- ~ mainWords: 934 → 985
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Técnico de AGROINCOL inspeccionando cocina de restaurante en Bucaramanga»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/fumigacion-residencial`

- ~ mainWords: 935 → 987
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Técnico de AGROINCOL realizando fumigación residencial en Bucaramanga»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/control-plagas-comercial`

- ~ mainWords: 888 → 938
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Control de plagas comercial en Bucaramanga — AGROINCOL»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/desratizacion`

- ~ mainWords: 966 → 1019
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Desratización profesional en Bucaramanga — AGROINCOL»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/control-insectos-voladores`

- ~ mainWords: 999 → 1049
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Control de mosquitos y zancudos en Bucaramanga — AGROINCOL»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/fumigacion-industrial`

- ~ mainWords: 960 → 1012
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Fumigación industrial en Bucaramanga — AGROINCOL»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/control-comejen-termitas`

- ~ mainWords: 1317 → 1366
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Técnico de AGROINCOL inspeccionando madera afectada por comején en Bucaramanga»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/eliminacion-abejas-avispas`

- ~ mainWords: 1479 → 1528
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/control-chinches`: «Control de Chinches de Cama Más información →»
- - img: alt «Técnico de AGROINCOL con equipo de protección retirando nido de abejas en Bucaramanga»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

### `/servicios/control-chinches`

- ~ mainWords: 1345 → 1394
- + enlace: `/servicios/fumigacion-residencial`: «Fumigación Residencial Más información →»
- + enlace: `/servicios/control-plagas-comercial`: «Control de Plagas Comercial Más información →»
- + enlace: `/servicios/fumigacion-restaurantes`: «Fumigación para Restaurantes Más información →»
- + enlace: `/servicios/desratizacion`: «Desratización Más información →»
- + enlace: `/servicios/control-insectos-voladores`: «Control de Insectos Voladores Más información →»
- + enlace: `/servicios/fumigacion-industrial`: «Fumigación Industrial Más información →»
- + enlace: `/servicios/control-comejen-termitas`: «Control de Comején y Termitas Más información →»
- + enlace: `/servicios/eliminacion-abejas-avispas`: «Retiro de Abejas y Avispas Más información →»
- - img: alt «Técnico de AGROINCOL realizando control de chinches de cama en Bucaramanga»
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)
- + img: alt vacío (decorativa)

