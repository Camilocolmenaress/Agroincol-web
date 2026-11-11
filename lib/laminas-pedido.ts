// Validación del pedido de láminas. La comparten el checkout (mensajes por
// campo) y la API (última palabra). Sin imports de Node.

import type { MetodoPago } from './ecogel';
import { DEPARTAMENTOS, TIPOS_DOCUMENTO, type TipoDocumento } from './ecogel-pedido';
import { CATEGORIA, MAXIMO, MINIMO, municipioAm, zonaDe, type Zona } from './laminas';

export interface PedidoLaminas {
  cantidad: number;
  metodo: MetodoPago;
  nombre: string;
  celular: string;
  /** Opcional: para enviar la factura electrónica. '' si no lo dejó o no parece correo. */
  correo: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  direccion: string;
  municipio: string;
  departamento: string;
  zona: Zona;
  autorizaWhatsapp: boolean;
}

type Resultado = { ok: true; pedido: PedidoLaminas } | { ok: false; errores: Record<string, string> };

const METODOS: readonly MetodoPago[] = ['online', 'bancolombia', 'nequi', 'breb', 'contraentrega'];
const texto = (v: unknown, max = 120) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

export function validarPedidoLaminas(entrada: unknown): Resultado {
  if (!entrada || typeof entrada !== 'object') return { ok: false, errores: { general: 'Datos incompletos' } };
  const e = entrada as Record<string, unknown>;
  const errores: Record<string, string> = {};

  const cantidad = e.cantidad;
  if (typeof cantidad !== 'number' || !Number.isInteger(cantidad) || cantidad < MINIMO) {
    errores.cantidad = `La compra mínima es de ${MINIMO} láminas`;
  } else if (cantidad > MAXIMO) {
    errores.cantidad = `Por la tienda son máximo ${MAXIMO} láminas. Para más, escríbanos por WhatsApp`;
  }

  const metodo = typeof e.metodo === 'string' && (METODOS as readonly string[]).includes(e.metodo) ? (e.metodo as MetodoPago) : null;
  if (!metodo) errores.metodo = 'Escoja cómo va a pagar';

  const nombre = texto(e.nombre);
  if (nombre.length < 3) errores.nombre = 'Escriba su nombre o el de su negocio';

  const celular = texto(e.celular, 30).replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');
  if (!/^3\d{9}$/.test(celular)) errores.celular = 'Escriba un celular de 10 dígitos que empiece por 3';

  // Opcional y nunca bloquea: si no parece correo, se guarda vacío.
  const correoCrudo = texto(e.correo).toLowerCase();
  const correo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoCrudo) ? correoCrudo : '';

  const tipoDocumento = (TIPOS_DOCUMENTO as readonly unknown[]).includes(e.tipoDocumento) ? (e.tipoDocumento as TipoDocumento) : null;
  if (!tipoDocumento) errores.tipoDocumento = 'Escoja el tipo de documento';
  const documento = texto(e.documento, 30).replace(/\D/g, '');
  if (!/^\d{5,12}$/.test(documento)) errores.documento = 'Escriba el número de documento o NIT';

  const direccion = texto(e.direccion);
  if (direccion.length < 5) errores.direccion = 'Escriba la dirección de entrega con el barrio o la vereda';
  const departamento = texto(e.departamento, 40);
  if (!(DEPARTAMENTOS as readonly string[]).includes(departamento)) errores.departamento = 'Escoja el departamento';
  const municipioEscrito = texto(e.municipio, 60);
  if (municipioEscrito.length < 2) errores.municipio = 'Escriba el municipio';
  // "giron" escrito a mano se guarda como "Girón": la hoja y la transportadora ven el nombre oficial.
  const municipio = (departamento === 'Santander' && municipioAm(municipioEscrito)) || municipioEscrito;

  const zona = zonaDe(departamento, municipio);
  // Fuera del área la entrega es por transportadora y en fincas el rechazo del
  // contraentrega es alto: ahí solo pago anticipado.
  if (metodo === 'contraentrega' && zona !== 'am') {
    errores.metodo = 'El pago contra entrega es solo para el área metropolitana de Bucaramanga';
  }

  if (Object.keys(errores).length > 0) return { ok: false, errores };

  return {
    ok: true,
    pedido: {
      cantidad: cantidad as number,
      metodo: metodo as MetodoPago,
      nombre,
      celular,
      correo,
      tipoDocumento: tipoDocumento as TipoDocumento,
      documento,
      direccion,
      municipio,
      departamento,
      zona,
      // Consentimiento expreso (Ley 1581): solo un true explícito cuenta.
      autorizaWhatsapp: e.autorizaWhatsapp === true,
    },
  };
}

/** Lo que el servidor sabe del pedido aparte del formulario: id, fecha y atribución. */
export interface ExtrasPedido {
  pedidoId: string;
  fecha: string;
  ip: string;
  eventId: string;
  fbp: string;
  fbc: string;
  externalId: string;
  navegador: string;
  url: string;
}

type Escritura = { accion: 'crear'; fila: Record<string, unknown> } | { accion: 'actualizar'; cambios: Record<string, unknown> };

/**
 * Qué se escribe en la hoja. En un reintento tras el 502 de Mercado Pago la
 * preferencia nunca se creó (no puede existir un pago), así que se reescriben
 * TODOS los datos del comprador: el aviso de error lo invita a cambiar de
 * método y bien pudo corregir la dirección o el municipio. Lo que no cambia:
 * id, fecha y la atribución del primer intento (eventId, fbp, fbc...).
 */
export function escrituraHojaLaminas(
  pedido: PedidoLaminas,
  totales: { producto: number; envio: number; total: number },
  extras: ExtrasPedido,
  reintento: boolean,
): Escritura {
  const comprador = {
    estado: pedido.metodo === 'online' ? 'pendiente_pago' : 'confirmar',
    unidades: pedido.cantidad,
    producto: totales.producto,
    envio: totales.envio,
    descuento: 0,
    total: totales.total,
    metodoPago: pedido.metodo,
    nombre: pedido.nombre,
    celular: pedido.celular,
    correo: pedido.correo,
    direccion: pedido.direccion,
    barrio: '',
    ciudad: pedido.municipio,
    departamento: pedido.departamento,
    tipoDocumento: pedido.tipoDocumento,
    documento: pedido.documento,
    autorizaWhatsapp: pedido.autorizaWhatsapp ? 'sí' : 'no',
  };
  if (reintento) return { accion: 'actualizar', cambios: comprador };
  return {
    accion: 'crear',
    fila: {
      ...comprador,
      guia: '',
      fecha: extras.fecha,
      pedidoId: extras.pedidoId,
      ofertas: 'no',
      origen: CATEGORIA,
      ip: extras.ip,
      eventId: extras.eventId,
      fbp: extras.fbp,
      fbc: extras.fbc,
      externalId: extras.externalId,
      navegador: extras.navegador,
      url: extras.url,
      mpPagoId: '',
    },
  };
}
