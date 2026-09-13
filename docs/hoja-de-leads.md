# Hoja de leads: trazabilidad, aviso por correo y Purchase hacia Meta

Cada lead del formulario queda como una fila en una hoja de Google Sheets. La
hoja **es** la base de datos: no hace falta servidor ni base de datos aparte.

Hace tres cosas:

1. **Guarda el lead** con todos sus datos y los identificadores técnicos.
2. **Avisa por correo** a la empresa apenas entra, para que nadie lo descubra
   tarde. La regla de los 5 minutos es la palanca más barata de la campaña.
3. **Manda el `Purchase` a Meta** cuando marcas el lead como cerrado. Sin eso,
   Meta optimiza hacia «gente que deja datos», no hacia «gente que contrata».

```
formulario  →  /api/contact  →  fila en la hoja  →  correo de aviso
                                      ↓
                          marcas ☑ cerrado + escribes el valor
                                      ↓
                    Apps Script  →  /api/cierre  →  Purchase en Meta
```

---

## Montarlo (una sola vez, ~10 minutos)

### 1. Crear la hoja

Crea una hoja nueva en Google Sheets. **No escribas los encabezados a mano:**
el script los crea solos en el orden correcto. Un encabezado mal escrito
mandaría los datos a la columna equivocada.

### 2. Pegar el script

En la hoja: **Extensiones → Apps Script**. Borra lo que haya y pega esto:

```javascript
// Recibe un lead de la página y lo agrega como fila.
// Rechaza cualquier llamada que no traiga el secreto correcto.
//
// Además:
//  - avisa por correo apenas entra un lead nuevo;
//  - cuando alguien marca la casilla "cerrado" de una fila, le avisa a la
//    página para que mande el Purchase a Meta.

const SECRETO = 'CAMBIA-ESTO-POR-TU-SECRETO'
// La página, sin barra al final.
const APP_URL = 'https://agroincol.com'
// A dónde llega el aviso de lead nuevo. Varios correos: separados por coma.
const CORREO_AVISOS = 'agroincol.1985@gmail.com'

// El orden manda: así llegan los datos desde el servidor.
// Si algún día se agrega una columna aquí, la hoja se ajusta sola.
//
// Las tres primeras van al frente a propósito: en el celular son lo único que
// se ve sin desplazar, y son las únicas celdas que alguien toca a mano.
const COLUMNAS = [
  'cerrado', 'valor', 'metaCierre',
  'fecha', 'plaga', 'nombre', 'telefono', 'municipio', 'franja',
  'servicio', 'origen', 'autoriza', 'politicaVersion', 'ip',
  'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url',
]

function hojaLeads() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
}

function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents)
    if (datos.secreto !== SECRETO) {
      return ContentService.createTextOutput('no')
    }

    const hoja = hojaLeads()
    sincronizarEncabezados(hoja)

    hoja.appendRow(COLUMNAS.map(function (columna) {
      const valor = datos.fila[columna]
      return valor === undefined || valor === null ? '' : valor
    }))
    // La casilla va SOLO en la fila del lead. Ponerla en toda la columna parece
    // cómodo, pero una casilla desmarcada cuenta como contenido y appendRow se
    // salta todas esas filas: los leads aparecerían en la fila 991.
    hoja.getRange(hoja.getLastRow(), 1).setDataValidation(casilla())

    avisarPorCorreo(datos.fila)

    return ContentService.createTextOutput('ok')
  } catch (error) {
    return ContentService.createTextOutput('error: ' + error.message)
  }
}

// ---------------------------------------------------------------------------
// Aviso por correo
// ---------------------------------------------------------------------------

// El aviso va DESPUÉS de escribir la fila: si el correo falla, el lead ya está
// guardado. Al revés se perdería el dato por un problema de correo.
//
// Gmail gratuito permite 100 correos al día; de sobra para este volumen. Si
// algún día se queda corto, el error queda en el registro de ejecuciones de
// Apps Script y los leads se siguen guardando igual.
function avisarPorCorreo(fila) {
  if (!CORREO_AVISOS) return
  try {
    const plaga = fila.plaga ? String(fila.plaga) : 'sin especificar'
    const asunto = 'Nuevo lead: ' + (fila.nombre || 'sin nombre') + ' — ' + plaga

    const cuerpo = [
      'Llamar a ' + (fila.franja ? String(fila.franja).toLowerCase() : 'cuando se pueda') + '.',
      '',
      'Nombre:     ' + (fila.nombre || ''),
      'WhatsApp:   ' + (fila.telefono || ''),
      'Municipio:  ' + (fila.municipio || ''),
      'Plaga:      ' + plaga,
      'Servicio:   ' + (fila.servicio || ''),
      'Origen:     ' + (fila.origen || ''),
      'Recibido:   ' + (fila.fecha || ''),
      '',
      'Abrir la hoja: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
      '',
      'Cuando este cliente contrate, marca la casilla "cerrado" de su fila y',
      'escribe el valor facturado. Eso le avisa a Meta que el lead se convirtió',
      'en venta, que es lo que hace que los anuncios busquen clientes y no solo',
      'gente que deja datos.',
    ].join('\n')

    MailApp.sendEmail(CORREO_AVISOS, asunto, cuerpo)
  } catch (error) {
    // El lead ya quedó guardado. Que falle el aviso no puede romper nada.
    console.error('aviso por correo: ' + error.message)
  }
}

// ---------------------------------------------------------------------------
// Encabezados
// ---------------------------------------------------------------------------

// Crea la fila de encabezados, o la corrige si cambió la lista de COLUMNAS.
// Así agregar una columna es editar solo este script, sin tocar la hoja a mano
// ni arriesgarse a que los datos caigan en la columna equivocada.
function sincronizarEncabezados(hoja) {
  const actuales =
    hoja.getLastRow() === 0
      ? []
      : hoja.getRange(1, 1, 1, Math.max(hoja.getLastColumn(), 1)).getValues()[0]

  if (actuales.join('|') === COLUMNAS.join('|')) return

  // Una hoja a la que le borraron columnas sobrantes no tiene sitio para las
  // nuevas; getRange lanzaría dentro de doPost y el lead no se guardaría.
  if (hoja.getMaxColumns() < COLUMNAS.length) {
    hoja.insertColumnsAfter(hoja.getMaxColumns(), COLUMNAS.length - hoja.getMaxColumns())
  }

  hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS])
  hoja.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold')
  hoja.setFrozenRows(1)

  // Casilla en las filas que YA tienen lead (las nuevas la reciben en doPost).
  // Nunca en filas vacías: ver el comentario en doPost.
  const ultima = hoja.getLastRow()
  if (ultima >= 2) hoja.getRange(2, 1, ultima - 1, 1).setDataValidation(casilla())
}

function casilla() {
  return SpreadsheetApp.newDataValidation().requireCheckbox().build()
}

// ---------------------------------------------------------------------------
// Lead cerrado → Purchase en Meta
// ---------------------------------------------------------------------------

// Correr UNA VEZ desde el editor (Ejecutar ▶ con esta función seleccionada).
// El trigger tiene que ser "instalable": los triggers simples de onEdit no
// pueden llamar a UrlFetchApp.
function instalarTrigger() {
  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'alMarcarCerrado' })
    .forEach(function (t) { ScriptApp.deleteTrigger(t) })

  ScriptApp.newTrigger('alMarcarCerrado')
    .forSpreadsheet(SpreadsheetApp.getActiveSpreadsheet())
    .onEdit()
    .create()

  // La migración de encabezados se hace aquí, de una vez, y no en el primer
  // lead que llegue: así se ve en el momento de instalar que quedó bien.
  sincronizarEncabezados(hojaLeads())
}

function alMarcarCerrado(e) {
  const rango = e.range
  // Solo la columna A, solo una celda, solo cuando se MARCA.
  if (rango.getColumn() !== 1 || rango.getRow() === 1) return
  if (rango.getNumRows() !== 1 || rango.getNumColumns() !== 1) return
  if (rango.getValue() !== true) return

  const hoja = rango.getSheet()
  // Otra pestaña del mismo archivo con una casilla en la columna A no es un lead.
  if (hoja.getSheetId() !== hojaLeads().getSheetId()) return

  const numeroFila = rango.getRow()
  const fila = leerFila(hoja, numeroFila)
  const celdaEstado = hoja.getRange(numeroFila, COLUMNAS.indexOf('metaCierre') + 1)

  // Ya se envió: no se repite. Meta solo deduplica 48 horas.
  if (String(fila.metaCierre).indexOf('✓') === 0) return

  if (!fila.eventId) {
    celdaEstado.setValue('error: lead anterior a esta versión, sin eventId')
    return
  }

  // El valor lo escribe quien cierra. Un Purchase en 0 no le enseña nada a Meta
  // sobre cuánto vale un cliente, así que se frena aquí con un mensaje claro en
  // vez de mandar un evento inútil.
  const valor = Number(fila.valor)
  if (!valor || valor <= 0) {
    celdaEstado.setValue('error: escribe primero el valor en la columna B')
    return
  }

  // Dos toques rápidos no deben mandar dos veces.
  const candado = LockService.getScriptLock()
  if (!candado.tryLock(10000)) {
    celdaEstado.setValue('error: ocupado, desmarca y vuelve a marcar')
    return
  }

  try {
    // Se vuelve a leer con el candado tomado: dos toques seguidos pasaban la
    // comprobación de arriba antes de que el primero escribiera el ✓.
    if (String(celdaEstado.getValue()).indexOf('✓') === 0) return

    const respuesta = UrlFetchApp.fetch(APP_URL + '/api/cierre', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        secreto: SECRETO,
        eventId: texto(fila.eventId),
        valor: valor,
        categoria: texto(fila.plaga),
        autoriza: texto(fila.autoriza),
        nombre: texto(fila.nombre),
        telefono: texto(fila.telefono),
        municipio: texto(fila.municipio),
        fbp: texto(fila.fbp),
        fbc: texto(fila.fbc),
        externalId: texto(fila.externalId),
        ip: texto(fila.ip),
        // La página acepta hasta 500 caracteres; los navegadores internos de
        // Instagram y Facebook a veces mandan más. Lo que sobra no le sirve a Meta.
        navegador: texto(fila.navegador).slice(0, 500),
        url: texto(fila.url),
      }),
    })

    let cuerpo = {}
    try { cuerpo = JSON.parse(respuesta.getContentText()) } catch (_) { /* no era JSON */ }

    if (respuesta.getResponseCode() === 200 && cuerpo.ok) {
      celdaEstado.setValue('✓ ' + Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM HH:mm'))
    } else {
      celdaEstado.setValue('error: ' + (cuerpo.motivo || respuesta.getResponseCode()))
    }
  } catch (error) {
    celdaEstado.setValue('error: ' + error.message)
  } finally {
    candado.releaseLock()
  }
}

function leerFila(hoja, numero) {
  const valores = hoja.getRange(numero, 1, 1, COLUMNAS.length).getValues()[0]
  const fila = {}
  COLUMNAS.forEach(function (columna, i) { fila[columna] = valores[i] })
  return fila
}

// Sheets guarda el celular como número y una celda vacía como ''. Todo viaja
// como texto; la página se encarga de normalizar.
function texto(valor) {
  return valor === undefined || valor === null ? '' : String(valor)
}
```

**Cambia `SECRETO`** por una clave larga y aleatoria. Guárdala: la necesitas en
el paso 4.

> Para generar una, en la terminal: `openssl rand -hex 24`

Revisa también **`CORREO_AVISOS`**: ahí llegan los avisos de lead nuevo.

### 3. Publicar el script

1. **Implementar → Nueva implementación**.
2. Tipo: **Aplicación web**.
3. *Ejecutar como:* **Yo**.
4. *Quién tiene acceso:* **Cualquier usuario**.
5. **Implementar**, acepta los permisos y **copia la URL** que termina en
   `/exec`.
6. En el editor, arriba, elige la función **`instalarTrigger`** y toca
   **Ejecutar ▶**. Acepta los permisos: pide acceso a la hoja, a enviar correo
   y a «conectarse con un servicio externo». Solo se hace una vez.

> «Cualquier usuario» suena peligroso, pero el script no hace nada sin el
> secreto. Quien no lo tenga recibe `no` y ya. Lo que **sí** hay que cuidar es a
> quién le compartes la hoja: ahí están los datos de tus clientes.

### 4. Cargar las variables en Vercel

**Settings → Environment Variables**, entorno *Production*:

| Variable | Valor |
|---|---|
| `HOJA_LEADS_URL` | La URL `/exec` del paso 3 |
| `HOJA_LEADS_SECRETO` | El secreto del paso 2 |

Vuelve a desplegar para que las tome.

### 5. Probar

Manda un lead de prueba desde el celular en `/lp/chinches`. A los pocos
segundos debe aparecer una fila nueva y llegarte el correo.

Si no aparece: **Vercel → Logs**, busca `[hoja]`. Ahí sale qué respondió el
script. Los logs **nunca** registran el contenido del lead: son datos
personales.

---

## Cerrar un cliente

Cuando el lead contrate:

1. Busca su fila.
2. **Escribe el valor facturado en la columna B** (`valor`). Sin esto no se
   envía nada: el script te lo dirá.
3. **Marca la casilla de la columna A** (`cerrado`).

Se puede hacer desde la app de Google Sheets en el celular: las tres primeras
columnas son lo único que se ve sin desplazar.

La columna `metaCierre` dice qué pasó:

| Dice | Significa |
|---|---|
| vacío | Aún no se ha marcado |
| `✓ 13/09 20:41` | Enviado a Meta. No hace falta hacer nada más |
| `error: escribe primero el valor…` | Falta la columna B |
| `error: …` | No salió. Desmarca, espera un segundo y vuelve a marcar |

Marcar y desmarcar no «devuelve» nada: solo el primer marcado envía. Un lead
cerrado días después cuenta igual, con la fecha del día en que se marcó: para
Meta la venta ocurre cuando se cierra.

### Qué valor escribir

El que realmente facturaste, no el de lista:

| Caso | Valor |
|---|---|
| Visita única | 140000 |
| Tratamiento de chinches (3 visitas) | 420000 |
| Tratamiento de comején (2 visitas) | 340000 |
| Con recargo por movilidad | El total cobrado |

Ese número es el que le enseña a Meta cuánto vale un cliente. Si escribes
siempre el mismo, el algoritmo no puede distinguir un cliente grande de uno
pequeño.

---

## Para qué sirve la hoja además de esto

**Las compuertas del tramo 1.** Contar filas por día es cómo se verifica si se
llegó a los 24 leads del día 3 y a las 6 ventas del día 7. La hoja es la fuente
de verdad, no el panel de Meta.

**El CAC y la tasa de cierre reales.** Leads (filas) contra cierres (casillas
marcadas) da la tasa de cierre; el gasto de Meta dividido entre los cierres da
el CAC. Esos son los dos números que esta campaña existe para medir.

**La mezcla de ticket.** La columna `valor` dice qué porcentaje termina en
contrato y no en visita única. Si supera el 13%, el CAC techo sube de $71.000 a
~$117.600 y se puede escalar.

**Públicos en Meta.** Filtrando `autoriza = sí` sale un CSV de clientes para
subir como público personalizado y crear un *lookalike*.

---

## Cuidados

- **La hoja tiene datos personales.** No la compartas con «cualquier persona con
  el enlace». Solo con quien la necesite.
- **Solo contacta a quien marcó `autoriza = sí`.** La columna
  `politicaVersion` guarda qué texto aceptaron: es tu prueba si alguien reclama.
- **Si alguien pide que borres sus datos**, busca su celular y borra la fila.
  Es un derecho suyo por la Ley 1581 y hay que atenderlo.
