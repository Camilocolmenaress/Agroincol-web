# Leads de restaurantes: hoja, aviso por correo y etapas hacia Meta

Formulario en **https://agroincol.com/lp/restaurantes** (noindex, sin enlaces
desde el sitio: solo llega tráfico de la campaña).

```
formulario (24/7)          → /api/restaurantes ─┬→ fila en la hoja → correo si calificó
                                                  └→ Lead a Meta (solo calificados)
estado en la hoja → Apps Script → /api/restaurantes/etapa → Schedule / Purchase a Meta
```

| Momento | Evento | Sale por |
|---|---|---|
| Envía el formulario y califica | `Lead` | Pixel + API, mismo `event_id` = `lead_id` |
| Toca WhatsApp o Llamar al final | `Contact` | Pixel + API |
| `estado` pasa a Inspección agendada, Inspección hecha o Cotizado | `Schedule` | Hoja → API |
| `estado` pasa a Contratado, con `valor_contrato` | `Purchase` con valor en COP | Hoja → API |
| Descalificado | **ninguno** | — |

Dataset de Meta: **1928275594400158 "AGROINCOL RESTAURANTES"**, propio y separado
del de servicios (/lp/chinches) y del de EcoGel.

---

## Dónde están los secretos

Nada de esto está en el código ni en el repositorio.

| Qué | Dónde |
|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID_RESTAURANTES` = 1928275594400158 | Vercel (público: el pixel siempre es visible) |
| `META_CAPI_TOKEN_RESTAURANTES` | Vercel, Secret. Se genera en Administrador de eventos → el dataset → Configuración → API de conversiones |
| `HOJA_RESTAURANTES_URL` | Vercel: la URL `/exec` del script |
| `HOJA_RESTAURANTES_SECRETO` | Vercel, Secret, **y** en el script: Configuración del proyecto → Propiedades del script → `SECRETO` |
| `META_TEST_EVENT_CODE_RESTAURANTES` | Vercel, **solo mientras se prueba** con "Probar eventos". Vacío en operación: con valor, todo entra como prueba y no optimiza |

El token de Meta vive solo en Vercel. El script nunca le habla a Meta: le pide
a la página que lo haga. Así hay un solo lugar donde rotarlo.

---

## Montaje (una vez, ~10 minutos)

1. Crea una hoja nueva en Google Sheets, por ejemplo **"Leads restaurantes"**.
   No escribas encabezados: el script los crea.
2. **Extensiones → Apps Script**. Borra lo que haya y pega el script de abajo.
3. **Configuración del proyecto (⚙) → Propiedades del script → Agregar**:
   nombre `SECRETO`, valor: el secreto que te paso.
4. En el editor elige la función **`configurar`** y toca **Ejecutar ▶**. Acepta
   los permisos (hoja, correo y "conectarse con un servicio externo"). Crea los
   encabezados, las listas desplegables, la pestaña Métricas y el trigger.
5. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como:
   **Yo**. Quién tiene acceso: **Cualquier usuario**. Copia la URL `/exec`.

"Cualquier usuario" no expone nada: sin el secreto el script responde `no`. Lo
que sí hay que cuidar es con quién se comparte la HOJA: tiene datos personales.

```javascript
// Leads del formulario de restaurantes (agroincol.com/lp/restaurantes).
//
//  - doPost: la página agrega una fila por cada envío, calificado o no.
//  - aviso por correo SOLO de los calificados.
//  - al cambiar `estado` (o escribir el valor), manda Schedule / Purchase a
//    Meta a través de la página.
//
// `var` y punto y coma explícitos: un proyecto puede quedar con el motor Rhino,
// que no entiende `let` y a veces falla sin los punto y coma.

var APP_URL = 'https://agroincol.com';
var CORREO_AVISOS = 'agroincol.1985@gmail.com';
var WHATSAPP_EMPRESA = '573107891948';

var ESTADOS = ['Nuevo', 'Contactado', 'Inspección agendada', 'Inspección hecha', 'Cotizado', 'Contratado', 'Perdido', 'Descalificado'];
// Estados que implican una inspección: si alguien salta de Contactado a
// Inspección hecha, el Schedule sale igual. Contratado NO está: un cliente que
// paga sin inspección no tuvo cita, y mandarle un Schedule sería inventarla.
var ETAPAS_SCHEDULE = ['Inspección agendada', 'Inspección hecha', 'Cotizado'];
var ETAPAS_CONTACTO = ['Contactado', 'Inspección agendada', 'Inspección hecha', 'Cotizado', 'Contratado'];
var TIPOS_PLAN = ['Choque', 'Mensual', 'Trimestral', 'Semestral', 'Anual'];
var MOTIVOS_PERDIDA = ['precio', 'ya tiene fumigador', 'no respondió', 'fuera de zona', 'otro'];

// Las primeras columnas son las que se tocan a mano y las que se ven en el
// celular sin desplazar. `estado` queda fija al desplazar a la derecha.
var COLUMNAS = [
  'estado', 'valor_contrato', 'nombre', 'negocio', 'whatsapp', 'calificado', 'prioridad', 'situacion',
  'canal_preferido', 'fecha_hora', 'tipo_plan', 'fecha_inspeccion', 'motivo_perdida',
  'meta_schedule', 'meta_purchase', 'fecha_primer_contacto', 'minutos_a_contacto', 'id_cliente_erp',
  'lead_id', 'puntaje', 'motivo_descalificacion', 'plan_sugerido', 'tipo_negocio', 'municipio', 'personas',
  'rol', 'plan_anual', 'presupuesto', 'autoriza', 'politica_version',
  'utm_source', 'utm_campaign', 'utm_content', 'fbclid', 'fbc', 'fbp', 'client_ip', 'user_agent', 'external_id', 'url',
  // Al final para no correr las filas que ya existen.
  'en_horario', 'contactar'
];

function hojaLeads() {
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
}

function col(nombre) {
  return COLUMNAS.indexOf(nombre) + 1;
}

function secreto() {
  return PropertiesService.getScriptProperties().getProperty('SECRETO') || '';
}

// ---------------------------------------------------------------------------
// Fila nueva desde la página
// ---------------------------------------------------------------------------

function doPost(e) {
  try {
    var datos = JSON.parse(e.postData.contents);
    if (!secreto() || datos.secreto !== secreto()) return ContentService.createTextOutput('no');

    var fila = datos.fila;
    fila.estado = fila.calificado === 'Sí' ? 'Nuevo' : 'Descalificado';

    var hoja = hojaLeads();
    hoja.appendRow(COLUMNAS.map(function (c) {
      var v = fila[c];
      return v === undefined || v === null ? '' : v;
    }));
    validarFila(hoja, hoja.getLastRow());
    if (fila.calificado !== 'Sí') hoja.getRange(hoja.getLastRow(), 1, 1, COLUMNAS.length).setFontColor('#9aa39e');

    if (fila.calificado === 'Sí') avisarPorCorreo(fila);
    return ContentService.createTextOutput('ok');
  } catch (error) {
    return ContentService.createTextOutput('error: ' + error.message);
  }
}

// Las listas van fila por fila, solo donde hay lead: así appendRow no se salta
// filas "ocupadas" por una validación vacía.
function validarFila(hoja, n) {
  var lista = function (valores) {
    return SpreadsheetApp.newDataValidation().requireValueInList(valores, true).setAllowInvalid(false).build();
  };
  hoja.getRange(n, col('estado')).setDataValidation(lista(ESTADOS));
  hoja.getRange(n, col('tipo_plan')).setDataValidation(lista(TIPOS_PLAN));
  hoja.getRange(n, col('motivo_perdida')).setDataValidation(lista(MOTIVOS_PERDIDA));
}

// ---------------------------------------------------------------------------
// Aviso por correo (solo calificados). Va DESPUÉS de guardar la fila.
// ---------------------------------------------------------------------------

function avisarPorCorreo(f) {
  try {
    var celular = String(f.whatsapp || '');
    var saludo = 'Hola ' + String(f.nombre || '').split(' ')[0] + ', le habla [su nombre] de AGROINCOL. ' +
      'Recibimos su solicitud de inspección gratis para ' + (f.negocio || 'su restaurante') + '.';
    var alta = f.prioridad === 'alta';
    var asunto = (alta ? '🔴 ' : '') + (f.en_horario === 'No' ? '🌙 ' : '') + 'Restaurante: ' + (f.negocio || f.nombre) + ' — ' + (f.situacion || '');
    var boton = function (href, texto, color) {
      return '<a href="' + href + '" style="display:inline-block;padding:14px 22px;margin:4px 6px 4px 0;border-radius:12px;' +
        'background:' + color + ';color:#fff;font-weight:bold;text-decoration:none;font-family:Arial">' + texto + '</a>';
    };
    var html =
      '<div style="font-family:Arial;font-size:15px;color:#1a1a1a">' +
      '<p style="font-size:18px"><b>Contactar ' + (f.contactar || 'en 5 minutos') + '</b> — prefiere <b>' + f.canal_preferido + '</b></p>' +
      boton('tel:+' + celular, 'Llamar', '#174634') +
      boton('https://wa.me/' + celular + '?text=' + encodeURIComponent(saludo), 'WhatsApp', '#1FA855') +
      '<table cellpadding="4" style="margin-top:14px">' +
      ['nombre', 'negocio', 'situacion', 'tipo_negocio', 'municipio', 'personas', 'rol', 'plan_anual', 'presupuesto', 'puntaje', 'plan_sugerido', 'fecha_hora', 'lead_id']
        .map(function (c) { return '<tr><td style="color:#6b7280">' + c + '</td><td><b>' + (f[c] === undefined ? '' : f[c]) + '</b></td></tr>'; })
        .join('') +
      '</table>' +
      '<p><a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">Abrir la hoja</a> y pasar el estado a <b>Contactado</b> al hablar con él.</p>' +
      '</div>';
    MailApp.sendEmail({ to: CORREO_AVISOS, subject: asunto, htmlBody: html });
  } catch (error) {
    console.error('aviso por correo: ' + error.message);
  }
}

// ---------------------------------------------------------------------------
// Cambio de estado → Schedule / Purchase en Meta
// ---------------------------------------------------------------------------

function alEditar(e) {
  var rango = e.range;
  var hoja = rango.getSheet();
  if (hoja.getSheetId() !== hojaLeads().getSheetId()) return;
  if (rango.getRow() === 1 || rango.getNumRows() !== 1 || rango.getNumColumns() !== 1) return;
  if (rango.getColumn() !== col('estado') && rango.getColumn() !== col('valor_contrato')) return;

  var candado = LockService.getScriptLock();
  if (!candado.tryLock(10000)) return;
  try {
    var n = rango.getRow();
    var f = leerFila(hoja, n);

    // Velocidad de atención: la primera vez que sale de "Nuevo".
    if (ETAPAS_CONTACTO.indexOf(f.estado) >= 0 && !f.fecha_primer_contacto) {
      var ahora = new Date();
      hoja.getRange(n, col('fecha_primer_contacto')).setValue(ahora);
      var recibido = f.fecha_hora instanceof Date ? f.fecha_hora : new Date(String(f.fecha_hora).replace(' ', 'T') + '-05:00');
      if (!isNaN(recibido.getTime())) {
        hoja.getRange(n, col('minutos_a_contacto')).setValue(Math.round((ahora - recibido) / 60000));
      }
    }

    if (ETAPAS_SCHEDULE.indexOf(f.estado) >= 0 && !enviado(f.meta_schedule)) {
      enviar('Schedule', f, hoja.getRange(n, col('meta_schedule')));
    }

    if (f.estado === 'Contratado' && !enviado(f.meta_purchase)) {
      var valor = Number(f.valor_contrato);
      if (!valor || valor <= 0) {
        hoja.getRange(n, col('meta_purchase')).setValue('error: escriba primero valor_contrato');
      } else {
        enviar('Purchase', f, hoja.getRange(n, col('meta_purchase')));
      }
    }
  } finally {
    candado.releaseLock();
  }
}

// Meta solo deduplica 48 horas: lo que ya salió no se vuelve a mandar.
function enviado(celda) {
  return String(celda).indexOf('✓') === 0;
}

function enviar(evento, f, celda) {
  try {
    var r = UrlFetchApp.fetch(APP_URL + '/api/restaurantes/etapa', {
      method: 'post',
      contentType: 'application/json',
      muteHttpExceptions: true,
      payload: JSON.stringify({
        secreto: secreto(),
        evento: evento,
        leadId: texto(f.lead_id),
        valor: Number(f.valor_contrato) || 0,
        autoriza: texto(f.autoriza),
        nombre: texto(f.nombre),
        whatsapp: texto(f.whatsapp),
        municipio: texto(f.municipio),
        externalId: texto(f.external_id),
        fbp: texto(f.fbp),
        fbc: texto(f.fbc),
        ip: texto(f.client_ip),
        navegador: texto(f.user_agent).slice(0, 500),
        url: texto(f.url)
      })
    });
    var cuerpo = {};
    try { cuerpo = JSON.parse(r.getContentText()); } catch (_) { /* no era JSON */ }
    if (r.getResponseCode() === 200 && cuerpo.ok) {
      celda.setValue('✓ ' + Utilities.formatDate(new Date(), 'America/Bogota', 'dd/MM HH:mm'));
    } else {
      celda.setValue('error: ' + (cuerpo.motivo || r.getResponseCode()) + (cuerpo.detalle ? ' ' + cuerpo.detalle : ''));
    }
  } catch (error) {
    celda.setValue('error: ' + error.message);
  }
}

function leerFila(hoja, n) {
  var valores = hoja.getRange(n, 1, 1, COLUMNAS.length).getValues()[0];
  var f = {};
  COLUMNAS.forEach(function (c, i) { f[c] = valores[i]; });
  return f;
}

function texto(v) {
  return v === undefined || v === null ? '' : String(v);
}

// ---------------------------------------------------------------------------
// Configuración: correr UNA VEZ desde el editor (y de nuevo si cambia COLUMNAS)
// ---------------------------------------------------------------------------

function configurar() {
  if (!secreto()) throw new Error('Falta la propiedad del script SECRETO');
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  libro.setSpreadsheetTimeZone('America/Bogota');

  var hoja = hojaLeads();
  hoja.setName('Leads');
  if (hoja.getMaxColumns() < COLUMNAS.length) hoja.insertColumnsAfter(hoja.getMaxColumns(), COLUMNAS.length - hoja.getMaxColumns());
  hoja.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]).setFontWeight('bold');
  hoja.setFrozenRows(1);
  hoja.setFrozenColumns(1);
  for (var n = 2; n <= hoja.getLastRow(); n++) validarFila(hoja, n);

  crearMetricas(libro);

  // Instalable: los triggers simples no pueden llamar a UrlFetchApp.
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction() === 'alEditar') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('alEditar').forSpreadsheet(libro).onEdit().create();
}

// Lo que mide la hoja (sección 8 de la especificación). El gasto se escribe a
// mano desde el Administrador de anuncios; todo lo demás se calcula.
function crearMetricas(libro) {
  var m = libro.getSheetByName('Métricas') || libro.insertSheet('Métricas');
  var L = function (c) { return "Leads!" + columnaLetra(col(c)) + "2:" + columnaLetra(col(c)); };
  var filas = [
    ['Gasto en Meta (COP, escribir a mano)', 0, ''],
    ['Leads calificados', '=COUNTIF(' + L('calificado') + ',"Sí")', ''],
    ['Leads descalificados', '=COUNTIF(' + L('calificado') + ',"No")', ''],
    ['Inspecciones agendadas', '=COUNTIF(' + L('meta_schedule') + ',"✓*")', ''],
    ['Inspecciones hechas', '=COUNTIF(' + L('estado') + ',"Inspección hecha")+COUNTIF(' + L('estado') + ',"Cotizado")+COUNTIFS(' + L('estado') + ',"Contratado",' + L('meta_schedule') + ',"✓*")', 'Contratos sin inspección no cuentan'],
    ['Contratos', '=COUNTIF(' + L('estado') + ',"Contratado")', ''],
    ['CPL calificado', '=IFERROR(B1/B2,"")', 'Máx. $15.000'],
    ['Lead → inspección', '=IFERROR(B4/B2,"")', ''],
    ['Inspección → contrato', '=IFERROR(COUNTIFS(' + L('estado') + ',"Contratado",' + L('meta_schedule') + ',"✓*")/B5,"")', 'Solo contratos que tuvieron inspección'],
    ['Cierre total', '=IFERROR(B6/B2,"")', 'Supuesto: 11,1 %'],
    ['Costo por venta real', '=IFERROR(B1/B6,"")', 'Máx. $135.141 — criterio de corte'],
    // Solo los que llegaron en horario: uno de la noche espera la apertura y no mide la velocidad del equipo.
    ['Minutos a primer contacto (mediana, en horario)', '=IFERROR(MEDIAN(FILTER(' + L('minutos_a_contacto') + ',' + L('minutos_a_contacto') + '<>"",' + L('en_horario') + '<>"No")),"")', '≤ 5'],
    ['Ticket real de restaurante', '=IFERROR(AVERAGEIF(' + L('estado') + ',"Contratado",' + L('valor_contrato') + '),"")', '']
  ];
  m.getRange(1, 1, filas.length, 3).setValues(filas);
  m.getRange('B7').setNumberFormat('$#,##0');
  m.getRange('B11').setNumberFormat('$#,##0');
  m.getRange('B13').setNumberFormat('$#,##0');
  m.getRange('B8:B10').setNumberFormat('0.0%');
  m.setColumnWidth(1, 280);
}

function columnaLetra(n) {
  var s = '';
  while (n > 0) { var r = (n - 1) % 26; s = String.fromCharCode(65 + r) + s; n = Math.floor((n - 1) / 26); }
  return s;
}
```

---

## Operación diaria

1. Llega el correo (solo calificados). **Contactar en 5 minutos** por el canal
   que prefirió. Los botones del correo llaman o abren WhatsApp con un saludo.
   Si el asunto trae 🌙, llegó fuera de horario: el correo dice cuándo se le
   prometió el contacto (p. ej. "mañana a partir de las 8:00 a. m.") y esos van
   primero al abrir.
2. Al hablar con él, `estado` → **Contactado**. Eso registra solo la hora del
   primer contacto y los minutos que tardamos.
3. `Inspección agendada` → sale el **Schedule** (`meta_schedule` dice ✓).
4. Al cerrar: escribe `valor_contrato` (total del contrato, en pesos, sin
   puntos) y `estado` → **Contratado** → sale el **Purchase** (`meta_purchase` ✓).
   Sin valor no sale y la celda lo dice: un Purchase en 0 le enseña a Meta que
   un cliente no vale nada.
5. **Contratado = registrar la venta en el ERP con fuente `META_ADS`** y anotar
   el id en `id_cliente_erp`.
6. Si se pierde: `estado` → Perdido y `motivo_perdida`.

**Si paga sin inspección:** escribe `valor_contrato` y pasa directo a
**Contratado**. Sale solo el Purchase (no se inventa un Schedule) y la venta
cuenta igual en el costo por venta. Con pago 50/50, el Purchase va al cerrar,
con el TOTAL del contrato: no se espera al segundo pago ni se manda en dos.

Las filas grises son descalificados (estado `Descalificado`). No dispararon
Lead. Si igual contratan, pasarlas a Contratado manda el Purchase: si compró,
servía, y Meta debe saberlo.

---

## Horario y festivos

El formulario recibe 24/7. El horario del equipo (lunes a viernes, 8:00-12:00
y 14:00-18:00, Bogotá) solo cambia la promesa: de 8:00 a 11:55 y de 14:00 a
17:55 es "lo contactamos en 5 minutos"; fuera de ahí, la próxima apertura
("mañana a partir de las 8:00 a. m."). Lo decide el reloj del servidor al
recibir: `lib/restaurantes/horario.ts`. La fila guarda `en_horario` y
`contactar` con lo que se le prometió.

**Los festivos de Colombia se calculan solos** (fijos, Ley Emiliani y los que
dependen de Semana Santa), así que no hay lista que actualizar cada enero. Lo
que sí se revisa cada enero, o cuando pase:

- Días en que el equipo no atiende aunque no sean festivo (24 y 31 de
  diciembre, vacaciones colectivas, un día cívico decretado): agregarlos a
  `DIAS_SIN_ATENCION` en ese archivo como `'2026-12-24'` y desplegar.
- `npm test` comprueba los festivos de 2026 y 2027 contra el calendario oficial.

---

## Cómo probar

**En local:** `npm run dev` y abre http://localhost:3000/lp/restaurantes. En
local la medición está apagada (solo agroincol.com mide).

**En producción, con "Probar eventos"** (a cualquier hora):

1. Administrador de eventos → dataset 1928275594400158 → **Probar eventos** →
   copia el código `TEST…`.
2. Vercel: `META_TEST_EVENT_CODE_RESTAURANTES` = ese código → volver a desplegar.
3. Abre agroincol.com/lp/restaurantes desde "Probar eventos" y envía un lead
   calificado: debe aparecer `Lead` como **navegador y servidor, deduplicado**.
4. En la hoja, pasa esa fila a Inspección agendada y luego, con valor, a
   Contratado: deben aparecer `Schedule` y `Purchase`.
5. **Borra `META_TEST_EVENT_CODE_RESTAURANTES`** y vuelve a desplegar.
6. **Borra las filas de prueba** de la hoja: si no, ensucian las métricas.

`?test=1` en la URL apaga toda la medición (Pixel y API): sirve para probar el
formulario y la hoja sin mandar nada a Meta.

---

## Cuidados

- Solo se guarda a quien marcó la autorización (es obligatoria).
  `politica_version` dice qué texto aceptó.
- Si alguien pide borrar sus datos, se borra su fila (Ley 1581).
- La hoja no se comparte "con cualquier persona con el enlace".
