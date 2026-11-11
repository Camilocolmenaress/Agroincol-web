'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AlertCircle, BookOpen, Check, ChevronDown, Loader2, Lock, Receipt, ShieldCheck, Truck } from 'lucide-react';
import type { MetodoPago } from '@/lib/ecogel';
import { DEPARTAMENTOS, TIPOS_DOCUMENTO } from '@/lib/ecogel-pedido';
import { CLAVE_BORRADOR, ENTREGA_AM, GARANTIA, MUNICIPIOS_AM, NOMBRE, cotizar, datosMetaLaminas, money, zonaDe, type Zona } from '@/lib/laminas';
import { validarPedidoLaminas } from '@/lib/laminas-pedido';
import { PRIMEROS_DIAS, whatsappLaminas } from '@/lib/laminas-contenido';
import { nuevoEventId } from '@/lib/meta/eventos';
import { urlParaMedir } from '@/lib/meta/modo-prueba';
import { rastrear } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';
import { useCantidad } from './Cantidad';
import Stepper from './Stepper';
import Empujon from './Empujon';
import { Logo, fondoPatron } from './Marca';

// Checkout de una página con la estructura del de Grüns (Shopify): Contacto →
// Entrega → Método de envío → Pago → botón, y el resumen en una columna aparte
// (escritorio) o plegado arriba (celular). La lógica de envío, pago y medición
// es la misma de EcoGel; aquí cambia la zona, que decide el envío.

type Grupo = 'online' | 'transferencia' | 'contraentrega';
type Banco = 'bancolombia' | 'nequi' | 'breb';
const BANCOS: { id: Banco; nombre: string; logo: string }[] = [
  { id: 'bancolombia', nombre: 'Bancolombia', logo: 'bancolombia.svg' },
  { id: 'nequi', nombre: 'Nequi', logo: 'nequi.svg' },
  { id: 'breb', nombre: 'Bre-B', logo: 'breb.svg' },
];
const LOGOS_EN_LINEA = ['visa.svg', 'mastercard.svg', 'amex.svg', 'pse.svg'];
const ORDEN_CAMPOS = ['celular', 'nombre', 'documento', 'departamento', 'municipio', 'direccion'] as const;
const OTRO = '__otro';

function Logos({ archivos }: { archivos: string[] }) {
  return (
    <span className="flex flex-none items-center gap-1">
      {archivos.map((a) => (
        <span key={a} className="flex h-6 items-center rounded border border-brand-black/10 bg-white px-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/ecogel/pagos/${a}`} alt="" className="h-3.5 w-auto max-w-[40px] object-contain" />
        </span>
      ))}
    </span>
  );
}

/** Campo con la etiqueta dentro del borde, como en Shopify. */
function Campo({ id, etiqueta, error, children }: { id: string; etiqueta: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`block rounded-lg border bg-white px-3 pb-1.5 pt-1.5 focus-within:border-brand-green focus-within:ring-2 focus-within:ring-brand-green/20 ${
          error ? 'border-brand-orange-dark' : 'border-brand-black/20'
        }`}
      >
        <span className="block text-[12px] text-brand-black/70">{etiqueta}</span>
        {children}
      </label>
      {error && (
        <p className="mt-1 flex items-start gap-1.5 text-body-sm font-medium text-brand-black">
          <AlertCircle size={16} className="mt-0.5 flex-none text-brand-orange-dark" aria-hidden />
          {error}
        </p>
      )}
    </div>
  );
}
// Errores legibles: texto oscuro (el naranja no da contraste en letra chica) y el naranja solo en el ícono y el borde.
const alerta = 'mt-4 flex gap-2 rounded-lg border border-brand-orange/50 bg-brand-orange/10 px-3 py-2.5 text-body-sm font-medium text-brand-black';
const entrada = 'block w-full border-0 bg-transparent p-0 text-body text-brand-black placeholder:text-brand-black/45 focus:outline-none focus:ring-0';

/** Sin municipio no se asume el área: el total es el subtotal y el envío queda pendiente (como Shopify). */
function totales(cantidad: number, zona: Zona | null) {
  const c = cotizar(cantidad, zona ?? 'am');
  return zona ? c : { ...c, envio: 0, total: c.producto };
}

function Resumen({ zona }: { zona: Zona | null }) {
  const { cantidad, setCantidad } = useCantidad();
  const c = totales(cantidad, zona);
  return (
    <div>
      <div className="flex items-center gap-3.5">
        <div className="relative h-16 w-16 flex-none rounded-xl border border-brand-black/10 bg-white">
          <Image src="/tienda/laminas/esquina.webp" alt="" fill sizes="64px" className="rounded-xl object-cover" />
          <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-brand-black/75 px-1 text-[12px] font-bold text-white">
            {cantidad}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body-sm font-semibold leading-tight text-brand-black">{NOMBRE}</p>
          <p className="text-[13px] text-brand-black/70">{money(c.precioUnidad)} c/u</p>
        </div>
        <p className="text-body-sm font-semibold">{money(c.producto)}</p>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-body-sm text-brand-black/70">Cantidad</span>
        <Stepper valor={cantidad} onChange={setCantidad} tamano="sm" />
      </div>
      <Empujon zona={zona ?? 'fuera'} className="mt-3" />
      <dl className="mt-4 space-y-1.5 text-body-sm">
        <div className="flex justify-between">
          <dt>Subtotal · {cantidad} láminas</dt>
          <dd>{money(c.producto)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Envío</dt>
          <dd className={zona && c.envio === 0 ? 'font-semibold text-brand-green' : 'text-brand-black/70'}>
            {zona ? (c.envio === 0 ? 'Gratis' : money(c.envio)) : 'Escoja el municipio'}
          </dd>
        </div>
        <div className="flex items-baseline justify-between pt-2 font-heading text-[1.2rem] font-bold">
          <dt>Total</dt>
          <dd>
            <span className="mr-1.5 text-[12px] font-normal text-brand-black/70">COP</span>
            {money(c.total)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export default function Checkout() {
  const { cantidad } = useCantidad();
  const [datos, setDatos] = useState({ celular: '', correo: '', nombre: '', tipoDocumento: 'CC', documento: '', departamento: 'Santander', municipioAm: '', municipioTexto: '', direccion: '' });
  const [autorizaWhatsapp, setAutorizaWhatsapp] = useState(false);
  const [grupo, setGrupo] = useState<Grupo>('online');
  const [banco, setBanco] = useState<Banco>('bancolombia');
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'error-mp' | 'no-disponible' | 'error'>('idle');
  const [resumenAbierto, setResumenAbierto] = useState(false);
  const eventIdRef = useRef(nuevoEventId());
  const [pedidoAnterior, setPedidoAnterior] = useState<{ pedidoId: string; firma: string } | undefined>(undefined);

  const enSantander = datos.departamento === 'Santander';
  const municipio = enSantander ? (datos.municipioAm === OTRO ? datos.municipioTexto : datos.municipioAm) : datos.municipioTexto;
  const zona: Zona | null = municipio.trim() ? zonaDe(datos.departamento, municipio.trim()) : null;
  const c = totales(cantidad, zona);
  const metodo: MetodoPago = grupo === 'transferencia' ? banco : grupo;

  // Si llegó directo (sin pasar por el carrito), llegar aquí también es agregar
  // al carrito. Es una vez por sesión: si ya salió en el carrito, no se repite.
  useEffect(() => {
    rastrear('AddToCart', datosMetaLaminas(cantidad));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Borrador de un intento anterior en esta pestaña (p. ej. pago rechazado).
  // En un efecto y no en el estado inicial: el servidor no ve sessionStorage.
  useEffect(() => {
    try {
      const crudo = window.sessionStorage.getItem(CLAVE_BORRADOR);
      if (!crudo) return;
      const b = JSON.parse(crudo) as { datos?: Partial<typeof datos>; autorizaWhatsapp?: boolean; grupo?: Grupo; banco?: Banco };
      if (b.datos) setDatos((d) => ({ ...d, ...b.datos }));
      if (typeof b.autorizaWhatsapp === 'boolean') setAutorizaWhatsapp(b.autorizaWhatsapp);
      if (b.grupo === 'online' || b.grupo === 'transferencia' || b.grupo === 'contraentrega') setGrupo(b.grupo);
      if (b.banco === 'bancolombia' || b.banco === 'nequi' || b.banco === 'breb') setBanco(b.banco);
    } catch {
      // Sin almacenamiento: formulario vacío, como siempre.
    }
  }, []);

  // Contraentrega solo existe en el área: si cambia el municipio a uno de fuera, se quita.
  useEffect(() => {
    if (zona === 'fuera' && grupo === 'contraentrega') setGrupo('online');
  }, [zona, grupo]);

  const empezoRef = useRef(false);
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!empezoRef.current) {
      empezoRef.current = true;
      rastrear('InitiateCheckout', datosMetaLaminas(cantidad));
    }
    setDatos((d) => ({ ...d, [k]: e.target.value }));
    // El error del campo se va apenas lo corrige, no hasta el siguiente envío.
    const campo = k === 'municipioAm' || k === 'municipioTexto' ? 'municipio' : k === 'tipoDocumento' ? 'documento' : k;
    setErrores((er) => {
      if (!er[campo] && !(campo === 'municipio' && er.metodo)) return er;
      const { [campo]: _quitado, ...resto } = er;
      return resto;
    });
  };

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const pedido = {
      cantidad,
      metodo,
      nombre: datos.nombre,
      celular: datos.celular,
      correo: datos.correo,
      tipoDocumento: datos.tipoDocumento,
      documento: datos.documento,
      direccion: datos.direccion,
      departamento: datos.departamento,
      municipio: municipio.trim(),
      autorizaWhatsapp,
    };
    const v = validarPedidoLaminas(pedido);
    if (!v.ok) {
      setErrores(v.errores);
      const primero = ORDEN_CAMPOS.find((k) => v.errores[k]);
      if (primero) document.getElementById(`c-${primero}`)?.focus();
      return;
    }
    setErrores({});
    setEstado('enviando');
    try {
      window.sessionStorage.setItem(CLAVE_BORRADOR, JSON.stringify({ datos, autorizaWhatsapp, grupo, banco }));
    } catch {
      // Sin almacenamiento no hay borrador; el pedido sigue igual.
    }
    try {
      const res = await fetch('/api/tienda/pedido', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...pedido,
          website,
          eventId: eventIdRef.current,
          externalId: idDeVisitante(),
          sourceUrl: urlParaMedir(),
          ...(pedidoAnterior ? { pedidoAnterior: pedidoAnterior.pedidoId, firmaAnterior: pedidoAnterior.firma } : {}),
        }),
      });
      const json = (await res.json()) as { ok: boolean; pedidoId?: string; ir?: string; errores?: Record<string, string>; motivo?: string; firma?: string; total?: number };
      if (!res.ok || !json.ok) {
        if (json.errores && Object.keys(json.errores).length > 0) {
          setErrores(json.errores);
          setEstado('idle');
        } else {
          setEstado(json.motivo === 'mp' ? 'error-mp' : json.motivo === 'no-disponible' ? 'no-disponible' : 'error');
          if (json.motivo === 'mp' && json.pedidoId && json.firma) setPedidoAnterior({ pedidoId: json.pedidoId, firma: json.firma });
        }
        return;
      }
      try {
        window.sessionStorage.setItem(
          'laminas_compra',
          JSON.stringify({ pedidoId: json.pedidoId, eventId: eventIdRef.current, valor: json.total ?? c.total, cantidad, celular: datos.celular }),
        );
      } catch {
        // Sin almacenamiento el Purchase sale solo por el servidor.
      }
      window.location.assign(json.ir ?? '/tienda/gracias');
    } catch {
      setEstado('error');
    }
  };

  const opcion = (id: Grupo, titulo: string, derecha: React.ReactNode, detalle: React.ReactNode, deshabilitada?: string) => {
    const activa = grupo === id;
    return (
      <div className={`${activa ? 'bg-brand-mint/50' : ''}`}>
        <label className={`flex items-center gap-3 px-4 py-3.5 ${deshabilitada ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${activa ? 'ring-1 ring-inset ring-brand-green' : ''}`}>
          <input
            type="radio"
            name="grupoPago"
            value={id}
            checked={activa}
            disabled={!!deshabilitada}
            onChange={() => {
              setGrupo(id);
              setErrores(({ metodo: _m, ...resto }) => resto);
            }}
            className="h-4 w-4 flex-none border-brand-black/30 accent-brand-green text-brand-green focus:ring-brand-green"
          />
          <span className="flex-1 text-body font-semibold text-brand-black">{titulo}</span>
          {derecha}
        </label>
        {deshabilitada && <p className="-mt-2 px-11 pb-3 text-[13px] text-brand-black/70">{deshabilitada}</p>}
        {activa && <div className="border-t border-brand-black/10 bg-brand-black/[0.03] px-4 py-3.5 text-body-sm text-brand-black/75">{detalle}</div>}
      </div>
    );
  };

  const h2 = 'font-heading text-[1.35rem] font-bold text-brand-black';

  return (
    <>
      <div className="bg-brand-green py-4 text-center text-white">
        {/* Sobre verde, logo blanco (manual v2). */}
        <a href="/tienda/laminas-de-captura" className="inline-block">
          <Logo blanco prioridad className="mx-auto h-[60px] w-auto" />
        </a>
        <p className="mx-auto mt-2 w-fit rounded-md bg-brand-mint px-2.5 py-0.5 font-heading text-body-sm font-bold text-brand-green">Láminas de Captura · con guía de ubicación</p>
        <p className="mt-1.5 flex items-center justify-center gap-3 text-[13px] text-white/85">
          <span className="flex items-center gap-1"><Check size={14} aria-hidden /> Factura electrónica</span>
          <span className="flex items-center gap-1"><Check size={14} aria-hidden /> Garantía</span>
        </p>
      </div>
      {/* Franja con el patrón Arcos (oscuro sobre verde): el logo nunca va encima del patrón. */}
      <div className="h-5 bg-brand-green" style={fondoPatron('arcos-oscuro', 160)} aria-hidden />

      {/* Celular: resumen plegado arriba, como "Order summary ˅ $66.65" de Grüns. */}
      <div className="border-b border-brand-black/10 bg-brand-mint lg:hidden">
        <button
          type="button"
          onClick={() => setResumenAbierto((a) => !a)}
          aria-expanded={resumenAbierto}
          className="container-custom flex w-full items-center justify-between py-4"
        >
          <span className="flex items-center gap-1.5 text-body-sm font-semibold text-brand-green">
            {resumenAbierto ? 'Ocultar resumen' : 'Resumen del pedido'}
            <ChevronDown size={16} className={`transition-transform ${resumenAbierto ? 'rotate-180' : ''}`} aria-hidden />
          </span>
          <span className="font-heading text-body-lg font-bold">{money(c.total)}</span>
        </button>
        {resumenAbierto && (
          <div className="container-custom pb-5">
            <Resumen zona={zona} />
          </div>
        )}
      </div>

      <div className="lg:grid lg:min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <form onSubmit={enviar} noValidate className="px-4 pb-12 pt-6 lg:flex lg:justify-end lg:px-10 lg:pt-10">
          <div className="mx-auto w-full max-w-[540px] lg:mx-0">
            <h1 className="sr-only">Pagar su pedido de {NOMBRE}</h1>
            <section>
              <div className="flex items-baseline justify-between">
                <h2 className={h2}>Contacto</h2>
              </div>
              <div className="mt-3 space-y-3">
                <Campo id="c-celular" etiqueta="Celular (WhatsApp)" error={errores.celular}>
                  <input id="c-celular" type="tel" inputMode="tel" autoComplete="tel-national" placeholder="310 000 0000" value={datos.celular} onChange={set('celular')} className={entrada} />
                </Campo>
                <Campo id="c-correo" etiqueta="Correo para la factura electrónica (opcional)">
                  <input id="c-correo" type="email" inputMode="email" autoComplete="email" value={datos.correo} onChange={set('correo')} className={entrada} />
                </Campo>
                <label className="flex items-start gap-2.5 text-body-sm text-brand-black/75">
                  <input type="checkbox" checked={autorizaWhatsapp} onChange={(e) => setAutorizaWhatsapp(e.target.checked)} className="mt-0.5 h-4 w-4 flex-none rounded border-brand-black/30 accent-brand-green text-brand-green focus:ring-brand-green" />
                  Autorizo que AGROINCOL me escriba por WhatsApp sobre este pedido.
                </label>
              </div>
            </section>

            <section className="mt-8">
              <h2 className={h2}>Entrega</h2>
              <div className="mt-3 space-y-3">
                <Campo id="c-nombre" etiqueta="Nombre o razón social" error={errores.nombre}>
                  <input id="c-nombre" type="text" autoComplete="name" value={datos.nombre} onChange={set('nombre')} className={entrada} />
                </Campo>
                <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                  <Campo id="c-tipoDocumento" etiqueta="Tipo">
                    <select id="c-tipoDocumento" value={datos.tipoDocumento} onChange={set('tipoDocumento')} className={entrada}>
                      {TIPOS_DOCUMENTO.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </Campo>
                  <Campo id="c-documento" etiqueta="Número de documento o NIT" error={errores.documento ?? errores.tipoDocumento}>
                    <input id="c-documento" type="text" inputMode="numeric" autoComplete="off" value={datos.documento} onChange={set('documento')} className={entrada} />
                  </Campo>
                </div>
                <p className="-mt-1 text-[13px] text-brand-black/70">Para su factura electrónica y para la entrega.</p>
                <Campo id="c-departamento" etiqueta="Departamento" error={errores.departamento}>
                  <select id="c-departamento" autoComplete="address-level1" value={datos.departamento} onChange={set('departamento')} className={entrada}>
                    {DEPARTAMENTOS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </Campo>
                {enSantander && (
                  <Campo id="c-municipio" etiqueta="Municipio" error={datos.municipioAm === OTRO ? undefined : errores.municipio}>
                    <select id="c-municipio" autoComplete="address-level2" value={datos.municipioAm} onChange={set('municipioAm')} className={entrada}>
                      <option value="">Escoja…</option>
                      {MUNICIPIOS_AM.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                      <option value={OTRO}>Otro municipio de Santander</option>
                    </select>
                  </Campo>
                )}
                {(!enSantander || datos.municipioAm === OTRO) && (
                  <Campo id={enSantander ? 'c-municipio-otro' : 'c-municipio'} etiqueta={enSantander ? 'Escriba el municipio' : 'Municipio'} error={errores.municipio}>
                    <input
                      id={enSantander ? 'c-municipio-otro' : 'c-municipio'}
                      type="text"
                      autoComplete="address-level2"
                      value={datos.municipioTexto}
                      onChange={set('municipioTexto')}
                      className={entrada}
                    />
                  </Campo>
                )}
                <Campo id="c-direccion" etiqueta="Dirección, con barrio o vereda" error={errores.direccion}>
                  <input id="c-direccion" type="text" autoComplete="street-address" placeholder="Calle 35 #20-10, Centro" value={datos.direccion} onChange={set('direccion')} className={entrada} />
                </Campo>
                <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
              </div>
            </section>

            <section className="mt-8">
              <h2 className={h2}>Método de envío</h2>
              {zona === null ? (
                <p className="mt-3 rounded-lg bg-brand-black/[0.04] px-4 py-4 text-center text-body-sm text-brand-black/70">
                  Escoja el municipio para ver el envío.
                </p>
              ) : (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-brand-green bg-brand-mint/50 px-4 py-3.5">
                  <div>
                    <p className="text-body font-semibold">{zona === 'am' ? 'Área metropolitana' : 'Transportadora a todo el país'}</p>
                    <p className="text-[13px] text-brand-black/70">
                      {zona === 'am' ? `${ENTREGA_AM}.` : 'Le enviamos la guía de seguimiento por WhatsApp.'}
                    </p>
                  </div>
                  <p className={`font-semibold ${c.envio === 0 ? 'text-brand-green' : ''}`}>{c.envio === 0 ? 'Gratis' : money(c.envio)}</p>
                </div>
              )}
            </section>

            <fieldset className="mt-8">
              <legend className={h2}>Pago</legend>
              <p className="mt-1 text-body-sm text-brand-black/70">Todas las transacciones son seguras.</p>
              {errores.metodo && (
                <p className="mt-2 flex items-start gap-1.5 text-body-sm font-medium text-brand-black">
                  <AlertCircle size={16} className="mt-0.5 flex-none text-brand-orange-dark" aria-hidden />
                  {errores.metodo}
                </p>
              )}
              <div className="mt-3 divide-y divide-brand-black/10 overflow-hidden rounded-lg border border-brand-black/20 bg-white">
                {opcion('online', 'Tarjeta o PSE', <Logos archivos={LOGOS_EN_LINEA} />, <p>Al pagar lo llevamos a Mercado Pago para terminar de forma segura y vuelve aquí.</p>)}
                {opcion(
                  'transferencia',
                  'Transferencia',
                  <Logos archivos={BANCOS.map((b) => b.logo)} />,
                  <>
                    <div role="radiogroup" aria-label="Banco" className="flex flex-wrap gap-2">
                      {BANCOS.map((b) => (
                        <label key={b.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border bg-white px-3 py-2 ${banco === b.id ? 'border-brand-green' : 'border-brand-black/15'}`}>
                          <input type="radio" name="banco" value={b.id} checked={banco === b.id} onChange={() => setBanco(b.id)} className="h-3.5 w-3.5 accent-brand-green text-brand-green focus:ring-brand-green" />
                          {b.nombre}
                        </label>
                      ))}
                    </div>
                    <p className="mt-2">Al confirmar le mostramos los datos de la cuenta. Nos envía el comprobante por WhatsApp y despachamos.</p>
                  </>,
                )}
                {opcion(
                  'contraentrega',
                  'Efectivo al recibir',
                  null,
                  <p>Paga cuando le llegue. Antes le escribimos o lo llamamos para confirmar.</p>,
                  zona === 'fuera' ? 'Solo en el área metropolitana de Bucaramanga.' : undefined,
                )}
              </div>
            </fieldset>

            {/* Celular: el total vuelve a quedar a la vista justo antes del botón. */}
            <div className="mt-8 flex items-baseline justify-between border-t border-brand-black/10 pt-4 lg:hidden">
              <p className="font-heading text-[1.2rem] font-bold">Total</p>
              <p className="font-heading text-[1.2rem] font-bold">
                <span className="mr-1.5 text-[12px] font-normal text-brand-black/70">COP</span>
                {money(c.total)}
              </p>
            </div>

            {(errores.cantidad || errores.general) && (
              <p role="alert" className={alerta}>
                {errores.cantidad ?? errores.general}
              </p>
            )}
            {estado === 'error-mp' && (
              <p role="alert" className={alerta}>
                No pudimos abrir el pago en línea. Su pedido quedó guardado: escoja «Transferencia»{zona === 'am' ? ' o «Efectivo al recibir»' : ''} y confírmelo.
              </p>
            )}
            {estado === 'no-disponible' && (
              <p role="alert" className={alerta}>
                Los pedidos en línea no están disponibles en este momento. Escríbanos por WhatsApp y se lo tomamos por ahí.
              </p>
            )}
            {estado === 'error' && (
              <p role="alert" className={alerta}>
                No pudimos registrar el pedido. Inténtelo de nuevo.
              </p>
            )}

            <p className="mt-5 text-[13px] text-brand-black/70">
              Al confirmar autoriza el uso de sus datos para gestionar y entregar su pedido, según la{' '}
              <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline">política de privacidad</a>, y acepta los{' '}
              <a href="/tienda/terminos" target="_blank" rel="noopener noreferrer" className="underline">términos y condiciones</a>.
            </p>
            <button
              type="submit"
              disabled={estado === 'enviando'}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 font-heading text-[1.2rem] font-bold text-white shadow-brand disabled:opacity-60"
            >
              {estado === 'enviando' ? (
                <>
                  <Loader2 size={20} className="animate-spin" aria-hidden /> Procesando…
                </>
              ) : (
                <>
                  {grupo === 'online' ? 'Pagar ahora' : 'Confirmar pedido'} · {money(c.total)} <Lock size={18} aria-hidden />
                </>
              )}
            </button>
            {/* Debajo del botón, como en el checkout de Grüns: la garantía en una caja, tres razones con ícono y la línea de tiempo. */}
            <div className="mt-5 rounded-lg bg-brand-mint px-4 py-3.5">
              <p className="flex items-center gap-2 font-heading text-body font-bold text-brand-green">
                <ShieldCheck size={18} aria-hidden /> Garantía
              </p>
              <p className="mt-1 text-body-sm text-brand-black">{GARANTIA}</p>
            </div>
            <ul className="mt-5 space-y-4">
              {[
                { Icono: Receipt, t: 'Factura electrónica', d: 'A nombre de su negocio: escoja NIT en el tipo de documento.' },
                { Icono: BookOpen, t: 'Guía de ubicación y uso', d: 'Dónde ponerlas, cuántas usar y qué hacer los primeros días.' },
                {
                  Icono: Truck,
                  t: zona === 'fuera' ? 'Envío por transportadora' : 'Entrega rápida',
                  d: zona === 'fuera' ? 'Le enviamos la guía de seguimiento por WhatsApp.' : `${ENTREGA_AM}.`,
                },
              ].map(({ Icono, t, d }) => (
                <li key={t} className="flex gap-3">
                  <Icono size={24} className="mt-0.5 flex-none text-brand-green" aria-hidden />
                  <div>
                    <p className="font-heading text-body font-bold text-brand-black">{t}</p>
                    <p className="text-body-sm text-brand-black/70">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-brand-green px-5 py-6 text-white">
              <p className="text-center font-heading text-[1.35rem] font-bold leading-tight">Paciencia: déjela quieta</p>
              <ol className="mt-4 grid grid-cols-3 gap-2 text-center">
                {PRIMEROS_DIAS.map((l) => (
                  <li key={l.d}>
                    <p className="font-heading text-body font-bold text-brand-orange-light">{l.d}</p>
                    <p className="mt-0.5 text-body-sm leading-snug text-white/90">{l.t}</p>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-6 text-center text-[13px] text-brand-black/70">
              ¿Una duda antes de pagar?{' '}
              <a href={whatsappLaminas('Hola, tengo una pregunta antes de pagar mis Láminas de Captura')} target="_blank" rel="noopener noreferrer" className="underline">
                WhatsApp
              </a>
            </p>
          </div>
        </form>

        {/* Escritorio: resumen en su propia columna con fondo, como Grüns. */}
        <aside className="hidden border-l border-brand-black/10 bg-brand-mint lg:block lg:px-10 lg:pt-10">
          <div className="sticky top-10 w-full max-w-[420px]">
            <Resumen zona={zona} />
          </div>
        </aside>
      </div>
    </>
  );
}
