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
// Bono del combo de 3 unidades ($109.700): guía en PDF, solo para ese pedido.
var GUIA_PDF_ECOGEL_URL = 'https://drive.google.com/file/d/1jCReXhQzY6gPNuocx9OmPQxlgke9uD1T/view?usp=sharing';

// El orden manda: así llegan los datos desde el servidor (lib/hoja-pedidos.ts).
var COLUMNAS = [
  'estado', 'guia', 'fecha', 'pedidoId', 'unidades', 'producto', 'envio', 'descuento', 'total',
  'metodoPago', 'nombre', 'celular', 'correo', 'direccion', 'barrio', 'ciudad', 'departamento',
  'ofertas', 'origen', 'ip', 'eventId', 'fbp', 'fbc', 'externalId', 'navegador', 'url', 'mpPagoId',
  // Siempre se agrega al final: en medio descuadra las filas existentes.
  'tipoDocumento', 'documento', 'autorizaWhatsapp',
  'codigoPremio', 'premio', 'descuentoPremio', 'unidadesRegalo'
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

    if (datos.accion === 'crear') {
      h.appendRow(COLUMNAS.map(function (c) {
        var v = datos.fila[c];
        return v === undefined || v === null ? '' : v;
      }));
      // Contraentrega y los métodos manuales quedan confirmados apenas se
      // crean, así que el aviso va de una. "online" puede fallar en Mercado
      // Pago después de esto, así que el aviso espera a que actualizar()
      // confirme "pagado" — ver más abajo.
      if (datos.fila.metodoPago !== 'online') avisarPorCorreo(datos.fila);
      return ContentService.createTextOutput('ok');
    }

    if (datos.accion === 'actualizar') {
      actualizar(h, datos.pedidoId, datos.cambios || {});
      return ContentService.createTextOutput('ok');
    }

    if (datos.accion === 'leer') {
      var numeroFila = buscarFila(h, datos.pedidoId);
      var salida = numeroFila ? { ok: true, fila: leerFila(h, numeroFila) } : { ok: false };
      return ContentService.createTextOutput(JSON.stringify(salida)).setMimeType(ContentService.MimeType.JSON);
    }

    // Ruleta (§6): cada acción responde JSON.
    if (datos.accion === 'ruleta_girar') return respuestaJson(ruletaGirar(datos));
    if (datos.accion === 'ruleta_consultar') return respuestaJson(ruletaConsultar(datos.codigo));
    if (datos.accion === 'ruleta_canjear') return respuestaJson(ruletaCanjear(h, datos));

    return ContentService.createTextOutput('accion desconocida');
  } catch (error) {
    return ContentService.createTextOutput('error: ' + error.message);
  }
}

// Crea la fila de encabezados, o la corrige si cambió la lista de COLUMNAS.
function sincronizarEncabezados(h) {
  var actuales =
    h.getLastRow() === 0
      ? []
      : h.getRange(1, 1, 1, Math.max(h.getLastColumn(), 1)).getValues()[0];
  if (actuales.join('|') === COLUMNAS.join('|')) return;
  // Una hoja nueva tiene 26 columnas y COLUMNAS tiene más: sin esto getRange
  // lanza dentro de doPost y el pedido no se guarda.
  if (h.getMaxColumns() < COLUMNAS.length) {
    h.insertColumnsAfter(h.getMaxColumns(), COLUMNAS.length - h.getMaxColumns());
  }
  h.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]);
  h.getRange(1, 1, 1, COLUMNAS.length).setFontWeight('bold');
  h.setFrozenRows(1);
}

// Recorre la columna pedidoId. Con el volumen de EcoGel (decenas de pedidos al
// día, no miles) es más simple y confiable que mantener un índice aparte.
function buscarFila(h, pedidoId) {
  if (h.getLastRow() < 2) return null;
  var col = COLUMNAS.indexOf('pedidoId') + 1;
  var ids = h.getRange(2, col, h.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) {
    if (ids[i][0] === pedidoId) return i + 2;
  }
  return null;
}

// Escribe solo las columnas enviadas en la fila del pedido.
function actualizar(h, pedidoId, cambios) {
  var numeroFila = buscarFila(h, pedidoId);
  if (!numeroFila) throw new Error('pedido no encontrado: ' + pedidoId);
  Object.keys(cambios).forEach(function (c) {
    var idx = COLUMNAS.indexOf(c);
    if (idx >= 0) h.getRange(numeroFila, idx + 1).setValue(cambios[c]);
  });
  // Único momento en que un pedido en línea avisa por correo: cuando el
  // webhook de Mercado Pago (app/api/ecogel/mp/route.ts) confirma el pago.
  // Antes de esto nadie debe despachar nada. El mismo webhook, en ese
  // instante, también manda el Purchase a Meta — pide la fila con accion
  // "leer" (ver doPost arriba) porque esa función corre por separado.
  if (cambios.estado === 'pagado') avisarPorCorreo(leerFila(h, numeroFila));
}

function leerFila(h, numeroFila) {
  var valores = h.getRange(numeroFila, 1, 1, COLUMNAS.length).getValues()[0];
  var fila = {};
  COLUMNAS.forEach(function (c, i) { fila[c] = valores[i]; });
  return fila;
}

// Desde el 27-sep-2026 el checkout pide dirección y barrio en un solo campo y
// la columna barrio llega vacía; los pedidos anteriores la traen aparte.
function direccionCompleta(fila) {
  return [fila.direccion, fila.barrio].filter(function (v) { return v; }).join(', ');
}

function avisarPorCorreo(fila) {
  try {
    var asunto = 'Pedido EcoGel ' + fila.pedidoId + ' · ' + fila.unidades + 'u · ' + fila.metodoPago;
    var cuerpo =
      fila.nombre + ' · ' + fila.celular + '\n' +
      fila.tipoDocumento + ' ' + fila.documento + (fila.correo ? ' · ' + fila.correo : '') + '\n' +
      direccionCompleta(fila) + ', ' + fila.ciudad + ', ' + fila.departamento + '\n' +
      'Autoriza WhatsApp: ' + (fila.autorizaWhatsapp || 'no') + '\n' +
      'Total: $' + fila.total + ' (' + fila.metodoPago + ')\n' +
      'Estado: ' + fila.estado + '\n\n' +
      'Confirmar por WhatsApp (mensaje ya escrito, solo enviar):\n' + linkWhatsapp(fila);
    MailApp.sendEmail(CORREO_AVISOS, asunto, cuerpo);
  } catch (e) {
    // La fila ya quedó escrita; un fallo de correo no la pierde.
  }
}

// Mensaje distinto según qué falta para despachar: contraentrega necesita que
// el cliente confirme que sigue queriendo el pedido (baja el rechazo); las
// transferencias manuales necesitan el comprobante; lo demás ya está pagado.
function mensajeWhatsapp(fila) {
  var nombre = fila.nombre || '';
  var pedidoId = fila.pedidoId || '';
  var mensaje;
  if (fila.metodoPago === 'contraentrega') {
    mensaje =
      'Hola ' + nombre + ', tu pedido ' + pedidoId + ' de EcoGel está listo para despachar. ' +
      '*Confirma este mensaje con un SÍ* si deseas recibirlo en ' + direccionCompleta(fila) + '.';
  } else if (fila.metodoPago === 'online') {
    mensaje =
      'Hola ' + nombre + ', confirmamos tu pedido ' + pedidoId + ' de EcoGel. ' +
      'Sale en las próximas 24 horas, te enviamos la guía de la transportadora por aquí.';
  } else {
    // bancolombia, nequi, breb: transferencia manual, falta el comprobante.
    mensaje =
      'Hola ' + nombre + ', recibimos tu pedido ' + pedidoId + ' de EcoGel. ' +
      'Envíanos el comprobante de la transferencia para confirmar y despachar.';
  }
  // Qué esperar al aplicar: sin este aviso, el pico de cucarachas de las
  // primeras 48 h se lee como "no funciona". Mismo texto en los 3 métodos.
  mensaje +=
    '\n\nUn dato importante para cuando lo apliques:' +
    '\n\n🪳 Las primeras 24 a 48 horas vas a ver MÁS cucarachas de lo normal. Es buena señal: están saliendo a comerse el gel.' +
    '\n\n✅ Después de las 48 horas empiezan a desaparecer, porque lo llevan al nido y lo comparten con el resto.' +
    '\n\n📍 Para una cocina, aplica de 20 a 30 puntos pequeños, del tamaño de una lenteja, donde se esconden: ' +
    'detrás de la nevera, debajo del lavaplatos y en las bisagras. No limpies encima de los puntos.';
  // Bono del combo de 3 unidades: la guía en PDF. Mismo texto sin importar el método de pago.
  if (Number(fila.unidades) === 3) {
    mensaje +=
      '\n\nComo parte del combo, aquí tienes tu guía gratis: "5 puntos donde entran las cucarachas en tu cocina"' +
      '\n' + GUIA_PDF_ECOGEL_URL;
  }
  mensaje += '\n\nCualquier duda, escríbenos por aquí 🙌';
  return mensaje;
}

function linkWhatsapp(fila) {
  var digitos = String(fila.celular || '').replace(/\D/g, '');
  if (!digitos) return '(sin celular)';
  var numero = digitos.length === 10 ? '57' + digitos : digitos;
  return 'https://wa.me/' + numero + '?text=' + encodeURIComponent(mensajeWhatsapp(fila));
}
// ---------------------------------------------------------------------------
// Ruleta de premios (pestaña "Ruleta"). El sorteo lo hace el servidor de la
// web; aquí solo se guarda, se garantiza un giro por correo y un canje por
// código (LockService), y se manda el correo con el código.
// ---------------------------------------------------------------------------

var COLUMNAS_RULETA = ['fecha', 'correo', 'premio', 'codigo', 'vence', 'estado', 'pedidoId', 'fechaUso', 'autorizaDatos', 'url'];
// Un pedido previo solo cuenta para el bono de próxima compra si de verdad se pagó o se entregó.
var ESTADOS_COMPRA_REAL = ['pagado', 'despachado', 'entregado'];

function respuestaJson(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}

function hojaRuleta() {
  var libro = SpreadsheetApp.getActiveSpreadsheet();
  var h = libro.getSheetByName('Ruleta');
  if (!h) {
    h = libro.insertSheet('Ruleta'); // queda de última: getSheets()[0] sigue siendo la de pedidos
    h.getRange(1, 1, 1, COLUMNAS_RULETA.length).setValues([COLUMNAS_RULETA]).setFontWeight('bold');
    h.setFrozenRows(1);
  }
  return h;
}

function buscarEnRuleta(h, columna, valor) {
  if (h.getLastRow() < 2) return null;
  var col = COLUMNAS_RULETA.indexOf(columna) + 1;
  var valores = h.getRange(2, col, h.getLastRow() - 1, 1).getValues();
  var buscado = String(valor).toLowerCase();
  for (var i = 0; i < valores.length; i++) {
    if (String(valores[i][0]).toLowerCase() === buscado) return i + 2;
  }
  return null;
}

function leerRuleta(h, numeroFila) {
  var valores = h.getRange(numeroFila, 1, 1, COLUMNAS_RULETA.length).getValues()[0];
  var r = {};
  COLUMNAS_RULETA.forEach(function (c, i) {
    // Sheets convierte las fechas ISO en Date al guardarlas: se devuelven como ISO.
    r[c] = valores[i] instanceof Date ? valores[i].toISOString() : valores[i];
  });
  return r;
}

function escribirRuleta(h, numeroFila, cambios) {
  Object.keys(cambios).forEach(function (c) {
    h.getRange(numeroFila, COLUMNAS_RULETA.indexOf(c) + 1).setValue(cambios[c]);
  });
}

function ruletaGirar(datos) {
  var candado = LockService.getScriptLock();
  candado.waitLock(10000);
  try {
    var h = hojaRuleta();
    var existente = buscarEnRuleta(h, 'correo', datos.registro.correo);
    if (existente) return { ok: true, nuevo: false, registro: leerRuleta(h, existente) };
    h.appendRow(COLUMNAS_RULETA.map(function (c) {
      var v = datos.registro[c];
      return v === undefined || v === null ? '' : v;
    }));
    try {
      MailApp.sendEmail({ to: datos.registro.correo, subject: datos.correo.asunto, body: datos.correo.cuerpo, name: 'EcoGel · AGROINCOL', replyTo: CORREO_AVISOS });
    } catch (e) {
      // El premio ya quedó guardado y se mostró en pantalla; un fallo de correo no lo pierde.
    }
    return { ok: true, nuevo: true, registro: datos.registro };
  } finally {
    candado.releaseLock();
  }
}

function ruletaConsultar(codigo) {
  var h = hojaRuleta();
  var fila = buscarEnRuleta(h, 'codigo', codigo);
  return fila ? { ok: true, registro: leerRuleta(h, fila) } : { ok: false };
}

// ¿El pedido que tiene este código se puede soltar? Sí si el pago falló, o si
// quedó pendiente más de una hora (la persona abandonó Mercado Pago).
function pedidoLiberaCodigo(hPedidos, pedidoId, fechaUso) {
  var fila = buscarFila(hPedidos, pedidoId);
  if (!fila) return true;
  var estado = hPedidos.getRange(fila, COLUMNAS.indexOf('estado') + 1).getValue();
  if (estado === 'pago_fallido') return true;
  return estado === 'pendiente_pago' && Date.now() - new Date(fechaUso).getTime() > 3600 * 1000;
}

function yaCompro(hPedidos, celular, pedidoActual) {
  if (hPedidos.getLastRow() < 2) return false;
  var filas = hPedidos.getRange(2, 1, hPedidos.getLastRow() - 1, COLUMNAS.length).getValues();
  var iCel = COLUMNAS.indexOf('celular'), iEst = COLUMNAS.indexOf('estado'), iId = COLUMNAS.indexOf('pedidoId');
  for (var i = 0; i < filas.length; i++) {
    if (String(filas[i][iCel]) === String(celular) && filas[i][iId] !== pedidoActual && ESTADOS_COMPRA_REAL.indexOf(filas[i][iEst]) >= 0) return true;
  }
  return false;
}

function ruletaCanjear(hPedidos, datos) {
  var candado = LockService.getScriptLock();
  candado.waitLock(10000);
  try {
    var h = hojaRuleta();
    var fila = buscarEnRuleta(h, 'codigo', datos.codigo);
    if (!fila) return { ok: false, motivo: 'no-existe' };
    var r = leerRuleta(h, fila);
    if (r.estado === 'usado' && r.pedidoId !== datos.pedidoId && !pedidoLiberaCodigo(hPedidos, r.pedidoId, r.fechaUso)) {
      return { ok: false, motivo: 'usado' };
    }
    if (new Date(r.vence).getTime() < Date.now()) return { ok: false, motivo: 'vencido' };
    if (r.premio === 'proxima_10000' && !yaCompro(hPedidos, datos.celular, datos.pedidoId)) {
      return { ok: false, motivo: 'primer-pedido' };
    }
    escribirRuleta(h, fila, { estado: 'usado', pedidoId: datos.pedidoId, fechaUso: new Date().toISOString() });
    return { ok: true, premio: r.premio };
  } finally {
    candado.releaseLock();
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

## 6. Ruleta de premios

La pestaña **Ruleta** se crea sola con el primer giro. Una fila por correo:
`fecha, correo, premio, codigo, vence, estado, pedidoId, fechaUso, autorizaDatos, url`.

- Un correo gira una sola vez: si vuelve a intentarlo, recibe el mismo premio.
- `estado` pasa de `disponible` a `usado` cuando el código entra en un pedido.
  Si ese pedido termina en `pago_fallido`, o queda en `pendiente_pago` más de
  una hora, el código se puede usar en un pedido nuevo.
- El bono de $10.000 (`proxima_10000`) solo se canjea si el mismo celular ya
  tiene un pedido `pagado`, `despachado` o `entregado`.
- En la hoja de pedidos, `unidadesRegalo = 1` significa **despachar una unidad
  más** de las que dice `unidades` (premio 4x3).
- Los correos salen de la cuenta dueña del script (Gmail: unos 100 por día).
