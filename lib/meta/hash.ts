/**
 * Normalización y hasheo de los datos de cliente que se envían a Meta.
 *
 * Meta EXIGE que estos campos vayan como SHA-256 en hexadecimal minúscula, y
 * que antes se normalicen igual que como normaliza su lado. Si la normalización
 * no coincide, el hash no coincide y la persona no empareja: el dato se manda y
 * no sirve para nada.
 *
 * Nunca sale un dato en texto plano de aquí.
 */

/** SHA-256 en hexadecimal minúscula. Web Crypto: funciona en el runtime de Vercel. */
export async function sha256(texto: string): Promise<string> {
  const datos = new TextEncoder().encode(texto);
  const resumen = await crypto.subtle.digest('SHA-256', datos);
  return Array.from(new Uint8Array(resumen), (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Minúsculas, sin tildes, sin puntuación ni espacios. Como normaliza Meta. */
function normalizarTexto(valor: string): string {
  return valor
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // "girón" -> "giron"
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Teléfono a formato internacional sin "+": 3107891948 -> 573107891948.
 * Meta descarta el número si no lleva indicativo de país.
 */
export function normalizarTelefono(valor: string, indicativo = '57'): string {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return '';
  if (digitos.startsWith(indicativo) && digitos.length > 10) return digitos;
  return `${indicativo}${digitos.replace(/^0+/, '')}`;
}

/**
 * Parte un nombre completo en nombre y apellido. Con una sola palabra el
 * apellido queda vacío: mejor no mandar nada que mandar un apellido inventado,
 * que solo ensucia la coincidencia.
 */
export function partirNombre(completo: string): { nombre: string; apellido: string } {
  const partes = completo.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return { nombre: '', apellido: '' };
  if (partes.length === 1) return { nombre: partes[0], apellido: '' };
  return { nombre: partes[0], apellido: partes.slice(1).join(' ') };
}

export interface DatosCliente {
  nombreCompleto?: string;
  telefono?: string;
  correo?: string;
  municipio?: string;
  /** Identificador anónimo y estable del dispositivo. */
  externalId?: string;
}

/** Campos hasheados, con los nombres que espera la API de Conversiones. */
export interface UserDataMeta {
  em?: string;
  ph?: string;
  fn?: string;
  ln?: string;
  ct?: string;
  st?: string;
  country?: string;
  external_id?: string;
}

/**
 * Construye el `user_data` de Meta. Solo incluye campos con valor real: un
 * campo vacío hasheado es un hash válido de la cadena vacía, y eso empeora la
 * coincidencia en vez de mejorarla.
 */
export async function construirUserData(datos: DatosCliente): Promise<UserDataMeta> {
  const salida: UserDataMeta = {};

  // Meta normaliza el correo a minúsculas y sin espacios. No se le quitan puntos
  // ni etiquetas "+algo": Gmail los ignora pero Meta no, y tocarlos cambiaría el
  // hash y rompería la coincidencia.
  const correo = (datos.correo ?? '').trim().toLowerCase();
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) salida.em = await sha256(correo);

  const telefono = normalizarTelefono(datos.telefono ?? '');
  if (telefono.length >= 11) salida.ph = await sha256(telefono);

  if (datos.nombreCompleto) {
    const { nombre, apellido } = partirNombre(datos.nombreCompleto);
    const fn = normalizarTexto(nombre);
    const ln = normalizarTexto(apellido);
    if (fn) salida.fn = await sha256(fn);
    if (ln) salida.ln = await sha256(ln);
  }

  if (datos.municipio) {
    const ct = normalizarTexto(datos.municipio);
    if (ct) salida.ct = await sha256(ct);
  }

  // Toda la cobertura está en Santander, Colombia.
  salida.st = await sha256('santander');
  salida.country = await sha256('co');

  if (datos.externalId) salida.external_id = await sha256(datos.externalId);

  return salida;
}

/**
 * Decide qué datos de cliente van a Meta.
 *
 * Es una función aparte porque es la línea con consecuencia legal del proyecto:
 * sin autorización expresa no puede salir NI UN dato personal hacia Meta
 * (Ley 1581 de 2012, y los propios términos de Meta).
 *
 * Sin autorización devuelve un objeto vacío. El evento se envía igual, pero
 * solo con las señales técnicas que agrega el servidor: IP, navegador y
 * cookies. Esas no son datos personales identificables aportados por la persona.
 */
export async function userDataParaMeta(
  cliente: DatosCliente,
  autoriza: boolean
): Promise<UserDataMeta> {
  if (!autoriza) return {};
  return construirUserData(cliente);
}
