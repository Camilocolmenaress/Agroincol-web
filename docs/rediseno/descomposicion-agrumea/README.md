# Descomposición de agrumeafarm.it

14-nov-2026. Antes de rehacer el home de AGROINCOL desarmamos la referencia completa: dirección creativa, diseño, jerarquías, funcionamiento y uso.

**Cómo se hizo.** Se midió el sitio en vivo con Playwright a 390, 768, 1280, 1440 y 1920 px, se leyó su código servido (CSS y JS) y se grabaron en video las interacciones.

**Convención de marcas.** Cada dato lleva su origen:
- **[código]** sale del código fuente.
- **[medido]** sale de la pantalla.
- **[inferido]** es interpretación nuestra.

**Anexos con el detalle.**

| Anexo | Contenido |
|---|---|
| `anexos/a-codigo.md` | Fórmulas, constantes, eases y tokens tal como están en el código |
| `anexos/b-escritorio.md` | Medidas de cada sección e interacción a 1440 y 1920 |
| `anexos/c-celular-tablet.md` | Celular, tablet, accesibilidad, rendimiento y SEO |
| `anexos/d-textos-del-sitio.txt` | Todos los textos visibles por página |

Las imágenes de esta carpeta son hojas de contacto: cuadros de las capturas en orden de tiempo o de scroll.

---

## 0. Qué es la referencia, en una línea

Es una tienda de mermeladas sicilianas convertida en **una despensa que se recorre con la mano**. El producto es el protagonista absoluto, la tipografía y el color son el escenario, y el movimiento siempre responde a algo que hace el usuario.

**Ficha técnica**
- **Autor y premios.** La hizo Studio K95 y ganó Awwwards Sitio del Día (nov-2026) y CSS Design Awards.
- **Stack.**
  - Nuxt 3 con Prismic como CMS.
  - GSAP 3.15 (ScrollTrigger y CustomEase).
  - Lenis 1.3.
  - Three.js r160, solo para las etiquetas de los frascos.
  - matter.js, para la física de las frutas.
  - SplitType, para partir textos.
- **Idiomas.** Dos, IT y EN.
- **Páginas.** Siete plantillas:
  1. Home
  2. Despensa (catálogo)
  3. Producto (10 productos)
  4. Producción
  5. Experiencias
  6. Quiénes somos
  7. Contacto

  Además: menú a pantalla completa, pie y 404.

---

## 1. Dirección creativa

### 1.1 El concepto
- **Producto como héroe.** En el home no hay ni una frase visible (11 palabras en total, H1 oculto). Solo el logo, la forma de fondo, el lema que gira y los frascos. Todo lo demás está subordinado al frasco.
- **El sitio es una despensa:** se escoge un frasco y se abre su página. La metáfora se sostiene en todo: "Pantry", "The other products", "Discover the product".
- **El lema ("We preserve · We grow")** no se lee como titular. Es un sello circular que gira detrás de los frascos, en el fondo.

### 1.2 Personalidad
- **Artesanal pero editorial.** Se ve como revista de comida o empaque premium, no como "finca".
- Siciliano sin folclor: no hay limones dibujados ni azulejos. Lo siciliano lo cargan:
  - el color: crema, vino tinto, naranja;
  - la fotografía: luz dura, sombras de hojas, manos.
- **Calma.** Mucho aire, pocos elementos y ningún texto compitiendo. El movimiento es lento, con curvas suaves y tiempos de 0,9 a 2 s.

### 1.3 Un solo sistema visual, repetido sin excepciones
- **Tres colores de base:**
  - crema `#FDF3EB` (fondo);
  - vino tinto `#762530` (texto y fondos oscuros);
  - naranja `#E94E1B` (titulares, etiquetas y acentos).

  Los de apoyo aparecen solo en piezas puntuales: mostaza `#F39200` en Experiences y durazno `#FFE9D7` en tarjetas.
- **Color propio por producto.** Cada producto tiene su color y su fruta. Salen solo en el hover de su tarjeta y en su etiqueta, nunca en la interfaz general.
- **Dos fuentes:**
  - una serif fina para todos los titulares, siempre en MAYÚSCULAS y peso regular;
  - una sans para todo el texto.

  No hay negritas en titulares ni subrayados decorativos.
- **Un ornamento único: el rombo ◆.** Es un cuadrado de 13 px girado 45° (no un carácter). Aparece:
  - antes y después de los párrafos de introducción;
  - en el cursor;
  - en el botón de menú;
  - para marcar la página activa.
- **Las frutas planas** (11 siluetas de color) son el "personaje" de la marca. Aparecen:
  - en el precargador (caen con física);
  - en el hover de tarjetas;
  - en la pausa de Quiénes somos;
  - en contacto y en el 404.

  Nunca como fondo decorativo de relleno.

### 1.4 Fotografía
- **Tres tipos, nunca mezclados en una misma pantalla:**
  1. **Recortes de frasco** sin fondo, para el slider y las tarjetas. Siempre el mismo frasco, la misma cámara y la misma luz.
  2. **Bodegón de color:** frasco más ingrediente sobre un fondo del color del producto, con sombra dura. Va en la galería que se arrastra.
  3. **Escenas de uso:** manos, pan, picnic, mesa. Van en las portadas a sangre y en Despensa.
- La foto entra recortada como tarjeta (márgenes de 40 px y esquinas de 15 px) y al hacer scroll se abre a sangre (ver 4.8).

### 1.5 Voz y textos
- **Corta y sensorial.** La descripción de un producto ocupa una o dos frases ("Sweetly flavored and enveloping. Spreadable texture.").
  - Página de producto: unas 50 palabras visibles.
  - Despensa: unas 345.
  - Quiénes somos: unas 244.
- **Primera persona del plural**, sin superlativos vacíos: "We have selected the finest of our harvests…".
- **Microtextos de interfaz en mayúscula pequeña:** "SCROLL TO DISCOVER", "DISCOVER THE PRODUCT", "DRAG", "USEFUL TIPS", "AVAILABLE WEIGHTS".
- **Una idea por pantalla.** Medido en escritorio: casi siempre hay 1 titular o 1 párrafo grande por pantalla, más 1 imagen.

---

## 2. Sistema de diseño (valores exactos)

### 2.1 Tipografía

| Rol | Fuente | 390 px | 768 px | 1440 px | 1920 px | Interlineado |
|---|---|---|---|---|---|---|
| H1 de página ("PANTRY") | serif 400, MAYÚS. | 47 | 85 | 205 | 258 | 1 |
| Título del hero de producto | serif 400, MAYÚS. | 48 | 92 | 176 | 219 | 0,9 |
| H2 de sección ("THE OTHER PRODUCTS") | serif 400, MAYÚS. | 42 | 88 | 128 | 157 | 1 |
| Ítems del menú | serif 400, MAYÚS. | 41 | 79 | 115 | 141 | 1 |
| Palabra gigante a sangre ("SAVOURY", "VISION") | serif 400, MAYÚS. | 80–100 | 157–197 | 295–370 | 420–493 | 1 |
| Párrafo de introducción | sans 400 | 22 | 32 | 32 | 32 | 1,3 |
| Cuerpo | sans 400 | 18 | 18,6 | 19,7 | 20 | 1,3 |
| Etiquetas ("USEFUL TIPS") | sans 600, MAYÚS., naranja | 14 | 14 | 14 | 14 | 1,3 |
| Microtexto (cursor, "Scroll to discover") | 13 px, interletrado 0,1 em | 13 | 13 | 13 | 13 | — |

Las fórmulas exactas están en el anexo A, §2.2. Lo que importa de la escala:
1. **Contraste brutal entre niveles:** titular de 128–205 px frente a cuerpo de 20 px, es decir entre 6 y 10 veces más grande. No hay tamaños intermedios que compitan.
2. **Solo hay cuatro niveles de texto:**
   - display;
   - introducción (32);
   - cuerpo (20);
   - etiqueta (14).
3. **Los titulares escalan con el ancho** (`px + vw`) **y el cuerpo casi no cambia.** En celular el titular sigue mandando sin que el texto crezca.
4. **Interletrado normal en todo**, salvo el microtexto. Ningún titular va con letras separadas.

### 2.2 Espaciado y rejilla
- **Tokens:**

  | Token | Escritorio | Celular |
  |---|---|---|
  | `s` | 40 | 40 |
  | `xs` | 60 | 40 |
  | `l` | 100 | 48 |
  | `xl` | 200 | 96 |

- **Ritmo fijo:**
  - 200 px arriba de cada sección;
  - 100 px entre el titular y su cuerpo;
  - 100 px entre el cuerpo y las tarjetas;
  - 60 px entre párrafos de introducción.
- **Rejilla de 12 columnas.**
  - Separación: `clamp(12px, 1,45vw, 30px)`.
  - Margen lateral: **30 px fijo**, también en celular.
  - Los textos de introducción ocupan 10 columnas (máximo 1200 px). El texto de sección va en 680 px centrado o en una columna lateral de 446 px.
- **Largo de línea:**
  - introducción: 55 a 78 caracteres;
  - cuerpo: 39 a 61;
  - tarjetas: unos 39.

### 2.3 Componentes y detalles
- **Radios:**
  - 15 px en fotos y tarjetas;
  - círculo en idioma y pesos;
  - píldora en el botón de menú, el cursor y la navegación inferior.
- **Píldoras de peso:** círculos de 52 px con borde de 1 px y texto de 14/600.
- **Tablas:** filas de 16 px de padding, filete al 20 % y encabezado naranja en 14/600.
- **Foco de teclado:** contorno vino tinto de 2 px, separación de 3 px y halo crema de 5 px. Se ve sobre cualquier fondo.
- **Sombras:** casi no hay. Solo una muy difusa en la navegación inferior (`0 0 100px` vino tinto al 20 %).
- **Íconos:** prácticamente ninguno. El rombo y una flecha ↗ para enlaces externos.

---

## 3. Jerarquías

### 3.1 Reglas que se repiten en todas las plantillas
1. **Una idea por pantalla.** Un titular o un párrafo grande, más una imagen. Nunca dos bloques de texto compitiendo.
2. **El color dice el rol:**
   - naranja = titular o etiqueta ("mire aquí");
   - vino tinto = lectura;
   - crema sobre oscuro = momento especial (Savoury, Vision, pie).
3. **El tamaño dice el orden.** Display gigante, después introducción, después cuerpo, después etiqueta. El salto entre niveles es grande, así que se lee sin esfuerzo.
4. **Lo secundario se va a los bordes, en pequeño.** En el hero de producto, "Savoury" y "Made in Sicily – Italy" van a los lados, en serif de 32 px. Leídos en el código o vistos en pantalla, siempre quedan como notas al margen del titular.
5. **Simetría central** en titulares e introducciones. La asimetría (texto en columna lateral) solo aparece en el cuerpo de las secciones de categoría y en contacto.
6. **El aire se mide en pantallas.** Las secciones tienen 200 px de margen arriba y abajo; el pie mide 100vh.

### 3.2 Jerarquía por plantilla

**Home (una sola pantalla de 900 px)**

| Orden | Elemento |
|---|---|
| 1 | Frasco central (escala 1,35, nítido y brillante) |
| 2 | Frascos laterales (0,5–1,1, borrosos y más oscuros) |
| 3 | Forma vino tinto con el lema que gira |
| 4 | Logo |
| 5 | Menú, idioma, "Scroll to discover" y privacidad, todos de 13–14 px |

**Producto** (`05-producto-completo.jpg`)

| Orden | Bloque |
|---|---|
| 1 | Titular gigante con el frasco cruzándolo |
| 2 | Introducción de 32 px entre rombos |
| 3 | Fila de tres datos: consejos, pesos, vida útil |
| 4 | Galería de fotos para arrastrar |
| 5 | "The other products" |
| 6 | Pie con la marca gigante |

Son seis bloques y ninguno se repite.

**Despensa** (`07-despensa.jpg`)
1. Titular "PANTRY" y foto que se abre.
2. Introducción.
3. Cuatro categorías, cada una con titular, foto ambiental más texto lateral y tarjetas de frascos.
4. Una categoría ("Savoury") rompe el ritmo con una caja oscura a sangre y la palabra gigante en crema.
5. Navegación inferior fija para saltar entre categorías.

---

## 4. Funcionamiento y movimiento

### 4.1 Precargador (`01-carga-home.jpg`)
Sale **en cada carga dura**, también al recargar, y nunca en la navegación interna.

1. Aparece un contador "0 %→100 %" en serif naranja. Dura 1,7 s y es tiempo fijo, no progreso real.
2. En paralelo, 22 frutas planas caen con física y se apilan; se pueden arrastrar con el mouse.
3. Cierre: un panel naranja sube desde abajo, cubre la pantalla y sale por arriba (1,8 s), con una línea crema que barre.
4. Al 62 % del cierre arranca todo lo demás:
   - el logo crece desde un punto;
   - la forma y el lema entran con un fundido (1150 ms).
5. Los frascos entran después, cuando cargan sus etiquetas 3D.

**Resultado medido:** el primer frasco aparece a **5,4 s** aunque la página carga en 1,3 s. En celular, el LCP es de 9,2 s y el puntaje de rendimiento, 59.

### 4.2 El selector del home (`02-home-rueda.jpg`)

**Geometría** [código]
- Una fila de 10 frascos rotada **10°**, de modo que bajan en diagonal hacia la derecha.
- El bucle es infinito por aritmética (módulo), sin clones.
- En escritorio se ven unos 5 frascos y en celular, 3.

**Por posición** (0 = borde izquierdo, 1 = borde derecho)

| Propiedad | Comportamiento |
|---|---|
| Escala | 0,55 en los bordes, 1,35 en el centro (curva seno) |
| Brillo | 0,7 a 1,1 |
| Desenfoque | hasta 4 px en los bordes |
| Rotación | ondulación de ±18° con periodo de 3 frascos |
| Velocidad de paso | deformada con tanh: cruza el centro 1,55 veces más rápido y se frena en los bordes |
| Desfase vertical | cada frasco tiene uno propio (±5 % del alto) |

**Respuesta a la entrada**

| Entrada | Respuesta |
|---|---|
| Rueda vertical u horizontal | Mueve la fila 1,15 px por unidad. La página no se desplaza nunca. |
| Arrastre | 1,5 veces la distancia. Al soltar hay lanzamiento proporcional a la velocidad (hasta unos 1000 px). |
| Inercia | Seguimiento exponencial al objetivo: constante de 0,43 s libre y 0,09 s arrastrando. Una muesca de rueda llega al 44 % del recorrido a los 250 ms y se detiene a ~2,2 s. |
| Sin entrada | No hay autoplay ni imán: el frasco queda donde frena. |
| Velocidad | Inclina los frascos (hasta 6°), los desenfoca un poco y gira las etiquetas (hasta 38°). |
| Mouse | Parallax sutil, de 10 px o menos en la forma, el lema y los frascos. Cada frasco se acerca y gira hacia el puntero (gaussiana, 16 px y 30°). |

**El lema gira con la posición, no solo:** −0,012° por px (~1,2° cada 100 px). Cuando la fila se detiene, el lema se detiene.

### 4.3 Etiquetas en 3D
- Cada frasco es una foto sin etiqueta más un canvas encima.
- **Three.js** envuelve la etiqueta plana (un PNG de 1600×607) en un cilindro:
  - cámara ortográfica con la misma proporción que la foto;
  - banda del 27 % al 87 % del alto;
  - 3° de inclinación para que los bordes se vean elípticos;
  - un hueco del 9 % para que la etiqueta no dé la vuelta completa;
  - luz ambiente más un foco lateral.
- Un solo renderer dibuja todas las etiquetas, con un presupuesto de 12 megapíxeles.
- Three.js se importa **1 s después de montar el slider**. Sin WebGL, el frasco se ve sin etiqueta.

### 4.4 Cursor
- Solo con mouse. Es una píldora blanca con un rombo naranja y texto de 13 px en mayúscula.
- Sigue al puntero con retraso (lerp 0,12 por cuadro), desplazada +18 px.
- Entra con una escala de 0,4 a 1 en 0,5 s.
- Su texto depende de lo que haya debajo:
  - "Discover the product" en frascos y tarjetas;
  - "Drag" en la galería;
  - "Click" en las frutas de contacto.
- **Al pasar sobre un frasco, el frasco no crece.** Todo el feedback está en el cursor y en un giro de la etiqueta de 2 s.

### 4.5 Clic en un frasco: el frasco "vuela" a su página (`03-home-clic-vuelo.jpg`)
1. La URL cambia de inmediato (menos de 75 ms).
2. El resto del home se desvanece y se reduce a 0,94 en 0,42 s.
3. Una copia del frasco, con su etiqueta capturada, vuela durante **2 s** (ease `.22,1,.36,1`) hasta el sitio exacto del frasco en la página de producto. En el camino se endereza y escala hasta 1,25, mientras la etiqueta sigue girando.
4. Mientras tanto, el titular del producto se revela letra por letra.
5. A los ~2,1 s la copia se cambia por el frasco real.

Es la pieza más importante de la sensación de "escoger y abrir".

### 4.6 Transiciones entre páginas
Hay tres, cada una con su caso:
1. **Precargador:** solo en carga dura.
2. **Telón vino tinto:** para el menú y entre productos.
   - Sube y cubre en 0,9 s.
   - Se cambia la página.
   - Sigue subiendo y destapa en 0,975 s, con una línea crema que barre.
   - Total: unos 2 s.
3. **Vuelo del frasco:** del home a un producto (4.5).

Con reducción de movimiento, las tres se reemplazan por cortes.

### 4.7 Encabezado (`11-header-estados.jpg`)
- **Fijo y sin fondo.**
- Su color se adapta: vino tinto sobre fondos claros y crema sobre fotos o fondos oscuros, detectado con una franja de 1 px.
- **Cuatro estados:**
  1. completo;
  2. compacto, pasados 33 px: solo la palabra, el ícono se encoge;
  3. oculto al bajar;
  4. de vuelta al subir (0,8 s).
- **Botón MENU:** cada letra "rueda" al pasar el mouse (0,35 s, con 18 ms de retraso por letra). El disco naranja se llena de vino tinto.

### 4.8 Hero de página (Despensa, Producción, Experiencias, Quiénes somos) (`08-hero-pagina-expande.jpg`)
- Titular gigante arriba y, debajo, la foto recortada como tarjeta (márgenes de 40 px y radio de 15 px).
- En los primeros ~100–150 px de scroll el recorte se abre a sangre.
- La foto tiene parallax interno de ±10 % y un velo vino tinto al 20 %.
- Sobre la foto, un subtítulo crema que se revela letra por letra.

### 4.9 Revelado de texto (en todo el sitio)
- **Máscara, sin fundido:** cada línea o letra sube desde el 108–112 % de su alto, dentro de un recorte.

  | Elemento | Unidad | Duración | Escalonado |
  |---|---|---|---|
  | Titulares | letra | 0,95 s | 0,02 s |
  | Párrafos | línea | 0,55 s | 0,08 s |

- La curva es `textveil` (`.165,1,.32,1`).
- Se dispara cuando el elemento llega al 91 % de la ventana y solo una vez.

### 4.10 Página de producto (`04-producto-scroll-frasco.jpg`)
- **Entrada:** el frasco asoma por abajo a escala 1,25. El titular gigante va encima.
- **Con los primeros 376 px de scroll (scrub):**
  - el frasco sube 216 px, baja a escala 0,8, gira 20° y da una vuelta completa de etiqueta;
  - el titular casi no se mueve (baja 44 px).

  El frasco termina **cruzando el titular por el centro**.
- La introducción lleva 335 px de margen superior para que el frasco tenga dónde caer.

### 4.11 Galería que se arrastra ("DRAG")
- Fotos de 61vw centradas, 40 px de separación y bucle infinito.
- Inercia propia y parallax interno de la foto de 0,17.
- No tiene imán.
- **Las flechas del teclado avanzan exactamente una foto.** La rueda del mouse desplaza la página, no la galería.

### 4.12 "The other products" (`06-otros-productos-hover.jpg`)
- Fila de tarjetas color durazno (4 por pantalla) con scroll horizontal y arrastre.
- **Al pasar el mouse:**
  - la tarjeta **se achica** a 0,96 y gira 2°;
  - el fondo toma el color del producto (0,6 s);
  - caen 9 frutas del producto con física;
  - el frasco **crece** a 1,1 y gira 4° (1 s).
- Al hacer clic, el telón vino tinto.

### 4.13 Menú a pantalla completa (`09-menu-abrir.jpg`)
- Panel naranja que baja en 0,9 s (`.645,.045,.355,1`).
- Cuatro ítems de 115 px en **escalera**: el primero a la izquierda y el último a la derecha.
  - Se revelan letra por letra con retraso de 0,45 s + 0,08 s por ítem.
  - Los filetes de 1 px se dibujan de izquierda a derecha.
- **Ítem activo:** en crema con un rombo.
- **Hover:** rueda de letras.
- **Cierre:** reproduce la apertura al revés, 2,1 veces más rápido.
- **Accesibilidad:** el foco queda atrapado dentro del menú, Esc lo cierra y al cerrar devuelve el foco al botón.

### 4.14 Otras piezas
- **Navegación inferior en Despensa:** píldora blanca al 80 % con desenfoque. El indicador naranja se desliza entre categorías y al hacer clic hace scroll suave de 1 s. En celular se vuelve un desplegable.
- **Caja "SAVOURY" y "VISION":**
  - fondo oscuro a sangre con la palabra gigante en crema;
  - encima, un recorte (el frasco o el agricultor) que sube más rápido que el fondo, a 1,12 px por px. Así el objeto queda **delante** de la palabra.
- **Quiénes somos:** pausa fijada durante 1,5 pantallas en la que cuatro frutas viajan de las esquinas al centro y aparece una frase.
- **Experiencias:** tarjetas apiladas y fijadas. Cada tarjeta nueva sube y la anterior queda detrás, más pequeña, girada e inclinada.
- **Contacto:** frutas con física; un clic las hace "explotar".
- **Lenis:** duración de 1,2 s con easeOutExpo. Se apaga con reducción de movimiento.

### 4.15 Catálogo de curvas

| Nombre | Curva | Se usa en |
|---|---|---|
| premium | `.645,.045,.355,1` | menú, transiciones, logo, cursor |
| soft | `.22,1,.36,1` | vuelo del frasco, tarjetas |
| out-expo | `.16,1,.3,1` | hover de enlaces, zoom de portada |
| textveil | `.165,1,.32,1` | todos los revelados de texto |
| don-expo | `.19,1,.22,1` | encabezado, barrido del precargador |

---

## 5. Uso

### 5.1 Recorridos
- **Escoger:** home, gira la fila, clic en un frasco, vuelo a su página.
- **Seguir comprando:** página de producto, "The other products", otra página de producto con el telón.
- **Explorar la marca:** menú, Despensa, Producción, Experiencias o Quiénes somos.

Desde el home no hay ningún otro camino visible que el frasco o el menú: el home **obliga a escoger**.

### 5.2 Por tipo de dispositivo

| | Mouse | Trackpad | Táctil | Teclado |
|---|---|---|---|---|
| Home | Rueda y arrastre; cursor con texto; parallax | Ambas direcciones mueven la fila | Solo arrastre horizontal; **el deslizamiento vertical no hace nada** (y dice "Scroll to discover") | **No funciona**: Tab enfoca frascos fuera de pantalla y descoloca la composición |
| Galería | Arrastre | Arrastre | Arrastre | Flechas, una foto por pulsación |
| Menú | Hover con rueda de letras | — | Toque | Foco atrapado y Esc |

### 5.3 Celular y tablet (`15-celular-home.jpg`, `16-celular-producto.jpg`, `17-celular-menu.jpg`)
- **Se mantiene igual:** composición, margen de 30 px y fila de frascos (3 visibles, el central al 60 % del ancho).
- **Se reduce:**
  - los espacios bajan a la mitad;
  - los titulares bajan con el ancho (47 px).
- **Se oculta:**
  - "Made in Sicily";
  - el disco del menú;
  - el enlace de privacidad del home.
- **Cambia de forma:**
  - la navegación por categorías pasa a una píldora fija abajo (zona del pulgar);
  - las tarjetas de Experiencias dejan de apilarse y van en columna.
- **Horizontal (844×390): se rompe** (`18-horizontal-roto.jpg`):
  - el titular del producto queda en tamaño 0;
  - el menú se encima;
  - el frasco tapa el logo.

### 5.4 Accesibilidad, rendimiento y SEO (lo que mide la referencia)
- **Bien:**
  - enlace para saltar al contenido;
  - foco visible;
  - menú accesible;
  - alt en los frascos;
  - reducción de movimiento por **sustitución**: la física pasa a pila quieta y el telón y el vuelo pasan a cortes;
  - CLS de 0.
- **Mal:**
  - sin JavaScript solo se ve "0 %" para siempre;
  - el naranja no pasa contraste en textos pequeños (3,45) ni el menú (2,68);
  - zonas táctiles de 37 px;
  - el selector no funciona con teclado.
- **Rendimiento en celular:**
  - puntaje 59 en home y en producto;
  - LCP de 9,2 s en el home, de los cuales ~4 s los retiene el precargador.
- **SEO:** home con 11 palabras y H1 oculto. El producto tiene datos estructurados de Product sin precio.

---

## 6. Qué copiamos, qué no y qué cambia para AGROINCOL

### 6.1 Lo que copiamos tal cual (mecánica)
1. **El selector del home:**
   - fila diagonal de 10°;
   - escala, brillo, desenfoque y ondulación por posición;
   - deformación tanh;
   - inercia con las mismas constantes;
   - rueda y arrastre con lanzamiento;
   - lema que gira con la posición;
   - parallax de 10 px o menos.
2. **El cursor con texto** y la regla de que **el objeto no crece al pasar el mouse**.
3. **El vuelo del objeto** del home a su página, la copia y el relevo.
4. **La página de servicio con la estructura de la página de producto:**
   - titular gigante con el objeto que lo cruza al hacer scroll;
   - introducción entre rombos;
   - fila de tres datos;
   - galería que se arrastra;
   - "Otros servicios" con hover de tarjeta;
   - pie con la marca gigante.
5. **El revelado por máscara**, con los mismos tiempos y curvas.
6. **El telón entre páginas**, el menú en escalera y el encabezado de cuatro estados.
7. **Las reglas del sistema:**
   - una idea por pantalla;
   - cuatro niveles de texto;
   - ritmo de 200/100/60;
   - margen de 30 px;
   - un solo ornamento.

### 6.2 Lo que corregimos (fallas de la referencia)
1. **Precargador.** Nada que retenga el contenido:
   - entrada de 1,2 s como máximo, detrás del contenido y solo la primera visita de la sesión (decisión D4 ya aprobada);
   - sin JavaScript, la página se ve completa.
2. **Táctil.** En celular el texto dice "Deslice" y el gesto vertical también mueve la fila (ver 6.3).
3. **Teclado en el selector:**
   - flechas para mover la fila;
   - el frasco con foco se trae al centro;
   - nunca hay foco fuera de pantalla.
4. **Contraste.** El naranja solo en textos de 19 px en negrita o más (regla del manual). Nada de texto oscuro sobre naranja.
5. **Celular en horizontal:** tamaños limitados también por el alto y menú con scroll propio.
6. **Zonas táctiles de 44 px** como mínimo.
7. **Revelado de texto** sin `aria-label` en `<p>`: el texto real queda intacto y las piezas animadas van con `aria-hidden`.

### 6.3 Lo que cambia por nuestras reglas (ya decidido)
- **H1 visible:** pequeño (~28 px), como etiqueta arriba de la forma. Los botones salen de la forma y WhatsApp queda en la cabecera (respuesta 1).
- **Three.js** solo para el giro, cargado después del primer pintado, con imagen quieta de respaldo (respuesta 2). En nuestro caso no es una etiqueta envuelta: el objeto 3D girando se resuelve en la siguiente etapa, con la familia de objetos.
- **El home es un selector en la primera pantalla, pero la página sigue** (respuesta 3). Nuestro home necesita su texto indexable, así que no puede ser una sola pantalla como la referencia:
  - la primera pantalla queda fijada;
  - la rueda o el deslizamiento hacen avanzar la fila durante una vuelta completa de los 10 objetos;
  - al terminar la vuelta, la página sigue bajando.

  Es la mayor diferencia mecánica con la referencia y la que hay que afinar en el prototipo.
- **Objetos:** por ahora se mantienen los 10 actuales; la familia de objetos queda para el final (respuesta 4).
- **Tipografía.** El manual exige League Spartan Bold o ExtraBold en titulares, así que no podemos imitar la serif fina. La jerarquía la tienen que dar:
  - el tamaño;
  - el aire;
  - pocos elementos;
  - mayúscula solo en titulares.
- **Color.** Manual 50/40/10:
  - verde `#164A38` como fondo oscuro, y verde letra `#143C2C` para el texto (el papel del vino tinto);
  - menta y blanco como fondos claros (el papel del crema);
  - naranja `#F5682E` como acento (máximo 10 %).
- **Ornamento.** El rombo de la referencia se reemplaza por el punto de gel del manual.
- **El "personaje"** que cae con física (las frutas): candidatos las gotas de gel del patrón, o Los Colados solo en Hogar. Queda abierto.

---

## 7. Preguntas que siguen abiertas

1. **Selector en celular.** ¿El deslizamiento vertical también mueve la fila mientras la primera pantalla está fijada (recomendado), o solo el horizontal, como en la referencia?
2. **Precargador.** La referencia lo usa como sello de marca y cuesta ~4 s. Con nuestro presupuesto de LCP, propongo la versión de 1,2 s detrás del contenido (gotas de gel que caen con física y se van). ¿De acuerdo?
3. **¿Menú en escalera** con los cuatro destinos principales (Hogar, Restaurantes, Empresas, Servicios) y debajo, en pequeño, el resto?
4. **"Personaje" con física:** ¿gotas de gel o Los Colados (solo en el contexto de Hogar)?
