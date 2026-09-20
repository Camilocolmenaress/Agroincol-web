'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { CUENTAS_MANUALES, DESCUENTO_ONLINE, GARANTIA, money, totalPedido, type MetodoPago, type Segmento, type Unidades } from '@/lib/ecogel';
import { DEPARTAMENTOS, validarPedido } from '@/lib/ecogel-pedido';
import { nuevoEventId } from '@/lib/meta/eventos';
import { rastrear } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';
import SelectorTier from './SelectorTier';
import { useTier } from './TierContext';

// Checkout de una página (spec §4). Orden: selector → resumen → datos de entrega →
// método de pago (en línea preseleccionado) → botón con el total → línea legal.

const campo =
  'mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25';

const B = CUENTAS_MANUALES.bancolombia;
const N = CUENTAS_MANUALES.nequi;
const R = CUENTAS_MANUALES.breb;

// Una opción por cada forma real de pagar, no por MetodoPago: tarjeta y PSE se
// ven distintas pero las dos redirigen a Mercado Pago (mismo `metodo: 'online'`).
// Los logos faltantes (pse/nequi/bancolombia/breb) van en public/ecogel/pagos/;
// mientras no estén, el <img> del navegador simplemente no muestra nada.
const OPCIONES_PAGO = [
  {
    id: 'tarjeta',
    metodo: 'online' as MetodoPago,
    titulo: 'Tarjeta Crédito/Débito',
    logos: ['visa.svg', 'mastercard.svg', 'amex.svg', 'diners.svg'],
    nota: 'Se te redirigirá a Mercado Pago para completar tu compra.',
  },
  {
    id: 'pse',
    metodo: 'online' as MetodoPago,
    titulo: 'PSE - Billetera Mercado Pago',
    logos: ['pse.svg'],
    nota: 'Se te redirigirá a Mercado Pago para completar tu compra.',
  },
  {
    id: 'bancolombia',
    metodo: 'bancolombia' as MetodoPago,
    titulo: 'Bancolombia (Transferencias y consignaciones)',
    logos: ['bancolombia.svg'],
    nota: `Cuenta de ${B.tipo} Bancolombia ${B.numero}, a nombre de ${B.titular} (C.C. ${B.cedula}). Transfiere el total y manda el comprobante por WhatsApp.`,
  },
  {
    id: 'nequi',
    metodo: 'nequi' as MetodoPago,
    titulo: 'Nequi',
    logos: ['nequi.svg'],
    nota: `Nequi ${N.numero}, a nombre de ${N.titular}. Transfiere el total y manda el comprobante por WhatsApp.`,
  },
  {
    id: 'breb',
    metodo: 'breb' as MetodoPago,
    titulo: 'Bre-B',
    logos: ['breb.svg'],
    nota: `Llave Bre-B ${R.llave} (${R.banco}), a nombre de ${R.titular}. Transfiere el total y manda el comprobante por WhatsApp.`,
  },
  {
    id: 'contraentrega',
    metodo: 'contraentrega' as MetodoPago,
    titulo: 'Pago Contraentrega',
    logos: [],
    nota: 'Pagas en efectivo cuando te llega el pedido.',
  },
] as const;

export default function FormularioPedido({ segmento, unidadesIniciales }: { segmento: Segmento; unidadesIniciales: Unidades }) {
  const { unidades } = useTier();
  // opcion es la elección visual (tarjeta vs PSE se ven distintas); metodo es
  // lo que realmente viaja al servidor. Las dos primeras opciones comparten metodo.
  const [opcion, setOpcion] = useState<(typeof OPCIONES_PAGO)[number]['id']>('tarjeta');
  const metodo: MetodoPago = OPCIONES_PAGO.find((o) => o.id === opcion)!.metodo;
  const [datos, setDatos] = useState({ nombre: '', celular: '', correo: '', direccion: '', barrio: '', ciudad: '', departamento: '' });
  const [ofertas, setOfertas] = useState(true);
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'error-mp' | 'no-disponible' | 'error'>('idle');
  // Un solo event_id por instancia del formulario (useRef, no useState: no debe
  // disparar un re-render). nuevoEventId() en vez de crypto.randomUUID() directo:
  // en iOS <15.4 o en webviews sin contexto seguro randomUUID no existe y lanza.
  // Si el pago en línea falla y la persona reintenta, el segundo envío manda el
  // MISMO event_id: Meta deduplica el Purchase por (event_name, event_id), así
  // que un reintento no cuenta como dos compras.
  const eventIdRef = useRef(nuevoEventId());
  // Si Mercado Pago falla, el servidor ya guardó una fila con este pedidoId y
  // manda de vuelta una firma que lo prueba. El siguiente envío manda ambos
  // como `pedidoAnterior`/`firmaAnterior` para que el servidor actualice esa
  // fila en vez de crear una nueva (y una duplicada en la hoja); sin la firma
  // el servidor no reutiliza el id, así que sin ella no vale la pena guardarlo.
  const [pedidoAnterior, setPedidoAnterior] = useState<{ pedidoId: string; firma: string } | undefined>(undefined);

  useEffect(() => {
    // El tier inicial ya lo fija TierProvider (prop `inicial`); aquí solo se mide.
    // InitiateCheckout: una vez por sesión (ver UNA_VEZ_POR_SESION en lib/meta/pixel.ts).
    rastrear('InitiateCheckout', {
      categoria: `ecogel-${segmento}`,
      valor: totalPedido(unidadesIniciales, 'contraentrega').total,
      contenido: { ids: ['ecogel'], numItems: unidadesIniciales },
    });
  }, [unidadesIniciales, segmento]);

  const t = totalPedido(unidades, metodo);
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setDatos((d) => ({ ...d, [k]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const entrada = { ...datos, unidades, metodo, ofertas, de: segmento };
    const v = validarPedido(entrada);
    if (!v.ok) {
      setErrores(v.errores);
      return;
    }
    setErrores({});
    setEstado('enviando');

    // El Pixel dispara Purchase en /gracias, no aquí: si el pago en línea falla no
    // hubo compra. El event_id de eventIdRef viaja al servidor (que sí manda el
    // Purchase por CAPI al crear el pedido) y se guarda para /gracias.
    try {
      const res = await fetch('/api/ecogel/pedido', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          ...entrada,
          website,
          eventId: eventIdRef.current,
          externalId: idDeVisitante(),
          sourceUrl: window.location.href,
          ...(pedidoAnterior ? { pedidoAnterior: pedidoAnterior.pedidoId, firmaAnterior: pedidoAnterior.firma } : {}),
        }),
      });
      const json = (await res.json()) as {
        ok: boolean;
        pedidoId?: string;
        ir?: string;
        errores?: Record<string, string>;
        motivo?: string;
        firma?: string;
      };
      if (!res.ok || !json.ok) {
        const hayErroresPorCampo = json.errores && Object.keys(json.errores).length > 0;
        if (hayErroresPorCampo) {
          setErrores(json.errores!);
          setEstado('idle');
        } else {
          setEstado(json.motivo === 'mp' ? 'error-mp' : json.motivo === 'no-disponible' ? 'no-disponible' : 'error');
          if (json.motivo === 'mp' && json.pedidoId && json.firma) setPedidoAnterior({ pedidoId: json.pedidoId, firma: json.firma });
        }
        return;
      }
      try {
        window.sessionStorage.setItem(
          'ecogel_compra',
          JSON.stringify({ pedidoId: json.pedidoId, eventId: eventIdRef.current, valor: t.total, unidades, segmento }),
        );
      } catch {
        // Sin almacenamiento el Purchase sale solo por el servidor. Aceptable.
      }
      window.location.assign(json.ir ?? '/ecogel/gracias');
    } catch {
      setEstado('error');
    }
  };

  return (
    <form onSubmit={enviar} noValidate className="container-custom max-w-xl pb-10 pt-6">
      <h1 className="font-heading text-h2-mobile text-brand-green md:text-h2">Tu pedido</h1>

      <section className="mt-5">
        <SelectorTier compacto />
        <dl className="mt-4 space-y-1 rounded-xl bg-brand-light p-4 text-body-sm">
          <div className="flex justify-between"><dt>EcoGel x{unidades}</dt><dd>{money(t.producto)}</dd></div>
          <div className="flex justify-between"><dt>Envío</dt><dd>{t.envio === 0 ? 'Gratis' : money(t.envio)}</dd></div>
          {t.descuento > 0 && (
            <div className="flex justify-between text-brand-green"><dt>Descuento por no pagar contraentrega</dt><dd>−{money(t.descuento)}</dd></div>
          )}
          <div className="flex justify-between border-t border-brand-gray-light pt-2 font-heading text-body font-bold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>
        {/* Dos razones para no abandonar aquí: el dato con fuente y la garantía (iteración 3 §4). */}
        <ul className="mt-3 space-y-1 rounded-xl bg-brand-gray-light/40 px-4 py-3 text-body-sm text-brand-black/75">
          <li>✓ −80 % en 4 semanas (Journal of Economic Entomology, 2000)</li>
          <li>✓ Garantía: si en {GARANTIA.dias} días siguen, otro kit sin costo</li>
        </ul>
      </section>

      <section className="mt-6 space-y-3.5">
        <h2 className="font-heading text-h3 text-brand-green">Datos de entrega</h2>
        {(
          [
            ['nombre', 'Nombre completo', 'text', 'name'],
            ['celular', 'Celular (WhatsApp)', 'tel', 'tel'],
            ['correo', metodo !== 'contraentrega' ? 'Correo' : 'Correo (opcional)', 'email', 'email'],
            ['direccion', 'Dirección', 'text', 'street-address'],
            ['barrio', 'Barrio', 'text', 'address-level3'],
            ['ciudad', 'Ciudad / municipio', 'text', 'address-level2'],
          ] as const
        ).map(([k, label, type, auto]) => (
          <div key={k}>
            <label htmlFor={`p-${k}`} className="block text-body-sm font-medium text-brand-black">{label}</label>
            <input id={`p-${k}`} name={k} type={type} autoComplete={auto} inputMode={type === 'tel' ? 'tel' : undefined} value={datos[k]} onChange={set(k)} className={campo} />
            {errores[k] && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores[k]}</p>}
          </div>
        ))}
        <div>
          <label htmlFor="p-departamento" className="block text-body-sm font-medium text-brand-black">Departamento</label>
          <select id="p-departamento" name="departamento" value={datos.departamento} onChange={set('departamento')} className={campo}>
            <option value="">Escoge…</option>
            {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {errores.departamento && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores.departamento}</p>}
        </div>
        <label className="flex items-start gap-2.5 text-body-sm text-brand-black/70">
          <input type="checkbox" checked={ofertas} onChange={(e) => setOfertas(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-brand-gray-light text-brand-green" />
          Recibir ofertas y la guía de aplicación por correo
        </label>
        <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
      </section>

      <fieldset className="mt-6">
        <legend className="font-heading text-h3 text-brand-green">Método de pago</legend>
        <div className="mt-3 space-y-2">
          {OPCIONES_PAGO.map((o) => (
            <div key={o.id} className={`rounded-xl border-2 ${opcion === o.id ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light'}`}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
                <input type="radio" name="opcionPago" value={o.id} checked={opcion === o.id} onChange={() => setOpcion(o.id)} className="h-4 w-4 shrink-0 text-brand-green" />
                <span className="flex-1">
                  <span className="block font-semibold text-brand-black">{o.titulo}</span>
                  {o.metodo !== 'contraentrega' && <span className="block text-body-sm text-brand-black/60">{money(DESCUENTO_ONLINE)} menos</span>}
                </span>
                {o.logos.length > 0 && (
                  <span className="flex shrink-0 items-center gap-1.5">
                    {o.logos.map((archivo) => (
                      <img key={archivo} src={`/ecogel/pagos/${archivo}`} alt="" className="h-5 w-auto" />
                    ))}
                  </span>
                )}
              </label>
              {opcion === o.id && <p className="border-t border-brand-gray-light/70 px-4 py-2.5 text-body-sm text-brand-black/70">{o.nota}</p>}
            </div>
          ))}
        </div>
      </fieldset>

      {estado === 'error-mp' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          No pudimos abrir el pago en línea. Tu pedido quedó guardado: escoge «Pagar al recibir» y confírmalo, o escríbenos por WhatsApp.
        </p>
      )}
      {estado === 'no-disponible' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          Los pedidos en línea no están disponibles en este momento. Escríbenos por WhatsApp y te lo tomamos por ahí.
        </p>
      )}
      {estado === 'error' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          No pudimos registrar el pedido. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
      )}

      <button type="submit" disabled={estado === 'enviando'} className="mt-6 w-full rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand disabled:opacity-60">
        {estado === 'enviando' ? (
          <span className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" aria-hidden /> Procesando…</span>
        ) : (
          `Confirmar pedido — ${money(t.total)}`
        )}
      </button>
      <p className="mt-3 text-center text-body-sm text-brand-black/55">
        Al confirmar aceptas que te contactemos por WhatsApp para coordinar la entrega.{' '}
        <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline">Política de privacidad</a>.
      </p>
    </form>
  );
}
