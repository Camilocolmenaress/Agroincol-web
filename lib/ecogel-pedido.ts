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
