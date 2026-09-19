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
