'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Gift, Loader2, MessageCircle, Truck } from 'lucide-react';
import { GARANTIA, configDe, datosMetaEcogel, money, whatsappEcogel, type MetodoPago, type Segmento, type Unidades } from '@/lib/ecogel';
import { MENSAJE_CODIGO, aplicabilidadPremio, esCodigoPremio, esIdPremio, fechaLarga, premioDe, totalConPremio } from '@/lib/ecogel-premios';
import { guardarPremio, leerPremioGuardado, olvidarPremio, type PremioGuardado } from '@/lib/ecogel-popups';
import { DEPARTAMENTOS, TIPOS_DOCUMENTO, validarPedido } from '@/lib/ecogel-pedido';
import { REGLA_DESPACHO, TIEMPO_ENTREGA } from '@/lib/ecogel-despacho';
import { nuevoEventId } from '@/lib/meta/eventos';
import { urlParaMedir } from '@/lib/meta/modo-prueba';
import { rastrear } from '@/lib/meta/pixel';
import { idDeVisitante } from '@/lib/meta/visitante';
import dynamic from 'next/dynamic';
import SelectorTier from './SelectorTier';
import { useTier } from './TierContext';

// Fuera del JS inicial: solo aparece si la persona intenta salir (ver PopupsEcogel).
const RuletaSalida = dynamic(() => import('./RuletaSalida'), { ssr: false });

// Checkout de una página. Celular: cantidad → datos → pago → resumen y botón.
// Escritorio: datos y pago a la izquierda; cantidad, resumen y botón en una
// columna fija a la derecha, para que el total nunca se pierda de vista.
// Solo 6 datos, celular primero (la recuperación de carritos depende de él).
// El correo NO se pide aquí: se captura, opcional, en el pop-up de salida.

const campo =
  'mt-1 w-full rounded-xl border border-brand-gray-light px-4 py-3 text-body focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/25';

// Tres grupos en vez de seis opciones: tarjeta y PSE van al mismo sitio
// (Mercado Pago) y las tres transferencias funcionan igual. Los datos de la
// cuenta se muestran en /gracias, que es cuando hacen falta.
type Grupo = 'online' | 'contraentrega' | 'transferencia';
type Banco = 'bancolombia' | 'nequi' | 'breb';

const BANCOS: { id: Banco; nombre: string; logo: string }[] = [
  { id: 'bancolombia', nombre: 'Bancolombia', logo: 'bancolombia.svg' },
  { id: 'nequi', nombre: 'Nequi', logo: 'nequi.svg' },
  { id: 'breb', nombre: 'Bre-B', logo: 'breb.svg' },
];

const ORDEN_CAMPOS = ['celular', 'nombre', 'tipoDocumento', 'documento', 'departamento', 'ciudad', 'direccion'] as const;

const LOGOS_EN_LINEA = ['visa.svg', 'mastercard.svg', 'amex.svg', 'diners.svg', 'pse.svg'];

export default function FormularioPedido({ segmento, unidadesIniciales, codigoUrl, premioUrl }: { segmento: Segmento; unidadesIniciales: Unidades; codigoUrl?: string; premioUrl?: string }) {
  const { unidades, setUnidades } = useTier();
  // Premio de la ruleta: llega por el enlace del correo (?codigo=), por el
  // pop-up de esta misma página o guardado de una visita anterior. El
  // servidor tiene la última palabra al crear el pedido.
  const [premio, setPremio] = useState<PremioGuardado | null>(null);
  const [errorCodigo, setErrorCodigo] = useState('');
  // El Apps Script tarda 2-4 s en responder: mientras tanto se muestra lo que ya se sabe.
  const [validando, setValidando] = useState(false);
  // El bono de próxima compra no se aplica solo: casi siempre lo tiene alguien
  // que aún no ha comprado, y mandarlo le haría fallar el pedido.
  const [usarBono, setUsarBono] = useState(false);
  // grupo es la elección visual; metodo es lo que viaja al servidor.
  const [grupo, setGrupo] = useState<Grupo>('online');
  const [banco, setBanco] = useState<Banco>('bancolombia');
  const metodo: MetodoPago = grupo === 'transferencia' ? banco : grupo;
  const [datos, setDatos] = useState({ celular: '', nombre: '', tipoDocumento: 'CC', documento: '', departamento: '', ciudad: '', direccion: '' });
  // Desmarcada: la autorización tiene que ser expresa (Ley 1581). Va junto al
  // celular y no al final porque los recordatorios por WhatsApp de quien
  // abandona necesitan que la haya dado antes de irse.
  const [autorizaWhatsapp, setAutorizaWhatsapp] = useState(false);
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
    // Sin carrito: llegar aquí con una cantidad ES agregar al carrito. El tier
    // inicial ya lo fija TierProvider (prop `inicial`); aquí solo se mide.
    rastrear('AddToCart', datosMetaEcogel(segmento, unidadesIniciales));
  }, [unidadesIniciales, segmento]);

  // InitiateCheckout al escribir en el primer campo, no al cargar: así se
  // distingue a quien se va al ver el formulario de quien lo deja a medias.
  // Ambos eventos son una vez por sesión (ver UNA_VEZ_POR_SESION).
  const empezoRef = useRef(false);
  const empezarCheckout = () => {
    if (empezoRef.current) return;
    empezoRef.current = true;
    rastrear('InitiateCheckout', datosMetaEcogel(segmento, unidades));
  };

  useEffect(() => {
    const guardado = leerPremioGuardado();
    if (!esCodigoPremio(codigoUrl)) {
      setPremio(guardado);
      return;
    }
    // Al instante: el premio guardado en este navegador o el que trae el enlace
    // del correo (?p=). El servidor lo confirma abajo y otra vez al canjear.
    if (guardado?.codigo === codigoUrl) setPremio(guardado);
    else if (esIdPremio(premioUrl)) setPremio({ codigo: codigoUrl, premio: premioUrl, vence: '' });
    setValidando(true);
    const fallar = (motivo: string) => {
      setPremio(null);
      setErrorCodigo(MENSAJE_CODIGO[motivo]);
    };
    fetch(`/api/ecogel/ruleta?codigo=${codigoUrl}`)
      .then((r) => r.json())
      .then((j: { ok: boolean; premio?: unknown; codigo?: string; vence?: string; estado?: string }) => {
        if (!j.ok || !esIdPremio(j.premio) || !j.codigo || !j.vence) return fallar('no-existe');
        if (j.estado === 'usado') return fallar('usado');
        if (new Date(j.vence).getTime() < Date.now()) return fallar('vencido');
        const p = { premio: j.premio, codigo: j.codigo, vence: j.vence };
        guardarPremio(p);
        setPremio(p);
      })
      // Sin conexión con la hoja se deja lo que ya se mostraba: el servidor decide al canjear.
      .catch(() => undefined)
      .finally(() => setValidando(false));
  }, [codigoUrl, premioUrl]);

  const premioElegido = premio && (premio.premio !== 'proxima_10000' || usarBono) ? premio.premio : null;
  const aplicaPremio = premioElegido !== null && aplicabilidadPremio(premioElegido, unidades, true).aplica;
  // yaCompro = usarBono: el total solo resta el bono si la persona dijo que ya compró (el servidor lo verifica).
  const t = totalConPremio(unidades, premioElegido, usarBono);
  const quitarPremio = () => {
    olvidarPremio();
    setPremio(null);
    setUsarBono(false);
    setErrorCodigo('');
  };
  const set = (k: keyof typeof datos) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    empezarCheckout();
    setDatos((d) => ({ ...d, [k]: e.target.value }));
  };
  const campoTexto = (k: keyof typeof datos, label: string, auto: string, extra: { tipo?: 'text' | 'tel'; ayuda?: string; ejemplo?: string } = {}) => (
    <div key={k}>
      <label htmlFor={`p-${k}`} className="block text-body-sm font-medium text-brand-black">{label}</label>
      <input
        id={`p-${k}`}
        name={k}
        type={extra.tipo ?? 'text'}
        autoComplete={auto}
        inputMode={extra.tipo === 'tel' ? 'tel' : undefined}
        placeholder={extra.ejemplo}
        value={datos[k]}
        onChange={set(k)}
        aria-invalid={errores[k] ? true : undefined}
        aria-describedby={extra.ayuda ? `p-${k}-ayuda` : undefined}
        className={campo}
      />
      {errores[k] && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores[k]}</p>}
      {extra.ayuda && <p id={`p-${k}-ayuda`} className="mt-1.5 text-body-sm leading-snug text-brand-black/60">{extra.ayuda}</p>}
    </div>
  );
  const whatsappAyuda = whatsappEcogel(configDe(segmento).whatsappTexto);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    const entrada = { ...datos, unidades, metodo, autorizaWhatsapp, de: segmento, ...(aplicaPremio && premio ? { codigo: premio.codigo } : {}) };
    const v = validarPedido(entrada);
    if (!v.ok) {
      setErrores(v.errores);
      // El botón queda abajo y los errores arriba: sin esto parece que no pasó nada.
      const primero = ORDEN_CAMPOS.find((k) => v.errores[k]);
      if (primero) document.getElementById(`p-${primero}`)?.focus();
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
          sourceUrl: urlParaMedir(),
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
        total?: number;
      };
      if (!res.ok || !json.ok) {
        // El código no entró: el pedido no se creó. Se explica junto al premio.
        if (json.errores?.codigo) {
          setErrorCodigo(json.errores.codigo);
          setEstado('idle');
          return;
        }
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
          // celular: /gracias le muestra a qué número lo vamos a contactar.
          JSON.stringify({ pedidoId: json.pedidoId, eventId: eventIdRef.current, valor: json.total ?? t.total, unidades, segmento, celular: datos.celular }),
        );
      } catch {
        // Sin almacenamiento el Purchase sale solo por el servidor. Aceptable.
      }
      window.location.assign(json.ir ?? '/ecogel/gracias');
    } catch {
      setEstado('error');
    }
  };

  const opcionPago = (id: Grupo, titulo: string, contenido: React.ReactNode) => {
    const activo = grupo === id;
    return (
      <div className={`rounded-xl border-2 transition-colors ${activo ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light'}`}>
        <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
          <input type="radio" name="grupoPago" value={id} checked={activo} onChange={() => setGrupo(id)} className="h-4 w-4 shrink-0 text-brand-green" />
          <span className="flex-1 font-semibold text-brand-black">{titulo}</span>
        </label>
        <div className="-mt-1 space-y-2 px-4 pb-3 pl-11 text-body-sm text-brand-black/70">{contenido}</div>
      </div>
    );
  };
  const logos = (archivos: string[]) => (
    <span className="flex flex-wrap items-center gap-2">
      {archivos.map((archivo) => (
        <img key={archivo} src={`/ecogel/pagos/${archivo}`} alt="" className="h-4 max-w-[5.5rem] object-contain" />
      ))}
    </span>
  );

  return (
    <>
    <form onSubmit={enviar} noValidate className="container-custom max-w-xl pb-10 pt-6 lg:max-w-5xl">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-heading text-h2-mobile text-brand-green md:text-h2">Tu pedido</h1>
        <a href={whatsappAyuda} target="_blank" rel="noopener noreferrer" className="shrink-0 text-body-sm font-semibold text-brand-green underline underline-offset-4">
          ¿Dudas? WhatsApp
        </a>
      </div>

      {/* Celular: la cantidad va arriba. Escritorio: vive en la columna del resumen. */}
      <div className="mt-5 lg:hidden">
        <SelectorTier compacto />
      </div>

      <div className="lg:mt-5 lg:grid lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start lg:gap-10">
        <div>
          <section className="mt-6 space-y-3.5 lg:mt-0">
            <h2 className="font-heading text-h3 text-brand-green">¿A dónde te lo enviamos?</h2>
            {campoTexto('celular', 'Celular (WhatsApp)', 'tel-national', {
              tipo: 'tel',
              ayuda: 'Pon un número al que estés pendiente: te escribimos o llamamos para confirmar tu pedido.',
            })}
            <label className="flex items-start gap-2.5 text-body-sm text-brand-black/75">
              <input type="checkbox" name="autorizaWhatsapp" checked={autorizaWhatsapp} onChange={(e) => setAutorizaWhatsapp(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-light text-brand-green" />
              Autorizo que AGROINCOL me escriba por WhatsApp sobre este pedido.
            </label>
            {campoTexto('nombre', 'Nombre y apellido', 'name')}
            <div>
              <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                <div>
                  <label htmlFor="p-tipoDocumento" className="block text-body-sm font-medium text-brand-black">Tipo</label>
                  <select id="p-tipoDocumento" name="tipoDocumento" value={datos.tipoDocumento} onChange={set('tipoDocumento')} className={campo}>
                    {TIPOS_DOCUMENTO.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="p-documento" className="block text-body-sm font-medium text-brand-black">Número de documento</label>
                  <input id="p-documento" name="documento" type="text" inputMode="numeric" autoComplete="off" value={datos.documento} onChange={set('documento')} aria-invalid={errores.documento ? true : undefined} aria-describedby="p-documento-ayuda" className={campo} />
                </div>
              </div>
              {(errores.tipoDocumento || errores.documento) && (
                <p className="mt-1 text-body-sm text-brand-orange-dark">{errores.tipoDocumento ?? errores.documento}</p>
              )}
              <p id="p-documento-ayuda" className="mt-1.5 text-body-sm text-brand-black/60">La transportadora lo exige para entregar tu pedido.</p>
            </div>
            <div>
              <label htmlFor="p-departamento" className="block text-body-sm font-medium text-brand-black">Departamento</label>
              <select id="p-departamento" name="departamento" autoComplete="address-level1" value={datos.departamento} onChange={set('departamento')} aria-invalid={errores.departamento ? true : undefined} className={campo}>
                <option value="">Escoge…</option>
                {DEPARTAMENTOS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              {errores.departamento && <p className="mt-1 text-body-sm text-brand-orange-dark">{errores.departamento}</p>}
            </div>
            {campoTexto('ciudad', 'Ciudad o municipio', 'address-level2')}
            {campoTexto('direccion', 'Dirección y barrio', 'street-address', { ejemplo: 'Calle 45 #12-30, apto 301, barrio Cabecera' })}
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute left-[-9999px] h-px w-px opacity-0" />
          </section>

          <fieldset className="mt-7">
            <legend className="font-heading text-h3 text-brand-green">¿Cómo quieres pagar?</legend>
            <div className="mt-3 space-y-2">
              {opcionPago(
                'online',
                'En línea: tarjeta o PSE',
                <>
                  {logos(LOGOS_EN_LINEA)}
                  {grupo === 'online' && <p>Pagas en Mercado Pago y vuelves aquí.</p>}
                </>,
              )}
              {opcionPago(
                'contraentrega',
                'Pago contra entrega',
                <p>Pagas en efectivo cuando te llega. Antes te escribimos o te llamamos para confirmarlo.</p>,
              )}
              {opcionPago(
                'transferencia',
                'Transferencia',
                grupo === 'transferencia' ? (
                  <>
                    <div role="radiogroup" aria-label="Banco" className="flex flex-wrap gap-2">
                      {BANCOS.map((b) => (
                        <label key={b.id} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 ${banco === b.id ? 'border-brand-green bg-white' : 'border-brand-gray-light'}`}>
                          <input type="radio" name="banco" value={b.id} checked={banco === b.id} onChange={() => setBanco(b.id)} className="h-3.5 w-3.5 text-brand-green" />
                          <img src={`/ecogel/pagos/${b.logo}`} alt={b.nombre} className="h-4 w-auto" />
                        </label>
                      ))}
                    </div>
                    <p>Al confirmar te mostramos los datos de la cuenta. Nos mandas el comprobante por WhatsApp y despachamos.</p>
                  </>
                ) : (
                  logos(BANCOS.map((b) => b.logo))
                ),
              )}
            </div>
          </fieldset>
        </div>

        <aside className="mt-7 lg:sticky lg:top-6 lg:mt-0 lg:rounded-2xl lg:border lg:border-brand-gray-light lg:p-5">
          <div className="mb-4 hidden lg:block">
            <SelectorTier compacto />
          </div>
          {validando && !premio && (
            <p className="mb-3 flex items-center gap-2 rounded-xl border border-brand-green/25 bg-brand-mint/60 px-4 py-3 text-body-sm text-brand-green">
              <Loader2 size={16} className="animate-spin" aria-hidden /> Validando tu código {codigoUrl}…
            </p>
          )}
          {(premio || errorCodigo) && (
            <div className="mb-3 rounded-xl border border-brand-green/25 bg-brand-mint/60 px-4 py-3 text-body-sm">
              {premio && (
                <>
                  <div className="flex items-start gap-2.5">
                    <Gift size={18} className="mt-0.5 flex-none text-brand-green" aria-hidden />
                    <div className="flex-1">
                      <p className="font-semibold text-brand-green">{premioDe(premio.premio).titulo}</p>
                      <p className="text-brand-black/60">Código {premio.codigo}{premio.vence && ` · vence el ${fechaLarga(premio.vence)}`}</p>
                    </div>
                    <button type="button" onClick={quitarPremio} className="text-body-sm font-semibold text-brand-black/55 underline underline-offset-2">Quitar</button>
                  </div>
                  {premio.premio === 'proxima_10000' ? (
                    <label className="mt-2 flex items-start gap-2 text-brand-black/75">
                      <input type="checkbox" checked={usarBono} onChange={(e) => { setUsarBono(e.target.checked); setErrorCodigo(''); }} className="mt-0.5 h-4 w-4 shrink-0 rounded border-brand-gray-light text-brand-green" />
                      Ya les compré antes con este celular: aplicar el bono ahora
                    </label>
                  ) : aplicaPremio ? (
                    <p className="mt-1.5 font-semibold text-brand-green">Aplicado a tu pedido</p>
                  ) : (
                    <p className="mt-1.5 text-brand-black/75">
                      {aplicabilidadPremio(premio.premio, unidades, true).motivo}{' '}
                      <button type="button" onClick={() => setUnidades(premioDe(premio.premio).unidades!)} className="font-semibold text-brand-green underline underline-offset-2">
                        Cambiar a {premioDe(premio.premio).unidades} unidades
                      </button>
                    </p>
                  )}
                </>
              )}
              {errorCodigo && <p role="alert" className={`${premio ? 'mt-2' : ''} text-brand-orange-dark`}>{errorCodigo}</p>}
            </div>
          )}
          <dl className="space-y-1 rounded-xl bg-brand-light p-4 text-body-sm">
            <div className="flex justify-between"><dt>EcoGel x{unidades}{t.unidadesRegalo > 0 && ' + 1 de regalo'}</dt><dd>{money(t.producto)}</dd></div>
            <div className="flex justify-between"><dt>Envío</dt><dd className={t.envio === 0 ? 'font-semibold text-brand-green' : undefined}>{t.envio === 0 ? 'Gratis' : money(t.envio)}</dd></div>
            {t.descuentoPremio > 0 && (
              <div className="flex justify-between text-brand-green"><dt>Premio de la ruleta</dt><dd>−{money(t.descuentoPremio)}</dd></div>
            )}
            <div className="flex justify-between border-t border-brand-gray-light pt-2 font-heading text-body font-bold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
          </dl>

          {/* Las razones para no abandonar, justo encima del botón. */}
          <ul className="mt-3 space-y-1.5 px-1 text-body-sm text-brand-black/80">
            <li className="flex gap-2"><Check size={16} className="mt-0.5 flex-none text-brand-green" aria-hidden />Garantía: si en {GARANTIA.dias} días siguen, te devolvemos el dinero</li>
            {unidades === 3 && (
              <li className="flex gap-2"><Check size={16} className="mt-0.5 flex-none text-brand-green" aria-hidden />Guía PDF de regalo: 5 puntos donde entran las cucarachas</li>
            )}
            <li className="flex gap-2"><Check size={16} className="mt-0.5 flex-none text-brand-green" aria-hidden />−80 % en 4 semanas (Journal of Economic Entomology, 2000)</li>
          </ul>

          <p className="mt-4 flex items-start gap-2.5 rounded-xl bg-brand-mint px-4 py-3 text-body-sm text-brand-green">
            <Truck size={18} className="mt-0.5 flex-none" aria-hidden />
            <span>{REGLA_DESPACHO} {TIEMPO_ENTREGA}</span>
          </p>

          {estado === 'error-mp' && (
            <p role="alert" className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
              No pudimos abrir el pago en línea. Tu pedido quedó guardado: escoge «Pago contra entrega» o «Transferencia» y confírmalo, o escríbenos por WhatsApp.
            </p>
          )}
          {estado === 'no-disponible' && (
            <p role="alert" className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
              Los pedidos en línea no están disponibles en este momento. Escríbenos por WhatsApp y te lo tomamos por ahí.
            </p>
          )}
          {estado === 'error' && (
            <p role="alert" className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
              No pudimos registrar el pedido. Inténtalo de nuevo o escríbenos por WhatsApp.
            </p>
          )}

          <button type="submit" disabled={estado === 'enviando'} className="mt-4 w-full rounded-full bg-brand-orange px-6 py-4 font-heading text-body font-bold text-white shadow-brand disabled:opacity-60">
            {estado === 'enviando' ? (
              <span className="inline-flex items-center gap-2"><Loader2 size={18} className="animate-spin" aria-hidden /> Procesando…</span>
            ) : (
              `Confirmar pedido — ${money(t.total)}`
            )}
          </button>
          <a href={whatsappAyuda} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 text-body-sm font-semibold text-brand-green">
            <MessageCircle size={16} aria-hidden /> ¿Tienes una duda? Escríbenos por WhatsApp
          </a>
          <p className="mt-3 text-center text-body-sm text-brand-black/55">
            Al confirmar autorizas el uso de tus datos para gestionar y entregar tu pedido, según la{' '}
            <a href="/politica-de-privacidad" target="_blank" rel="noopener noreferrer" className="underline">política de privacidad</a>, y aceptas los{' '}
            <a href="/ecogel/terminos" target="_blank" rel="noopener noreferrer" className="underline">términos y condiciones</a>, donde está tu derecho de retracto.
          </p>
        </aside>
      </div>
    </form>
    {/* Fuera del <form>: la ruleta trae su propio formulario y no se pueden anidar. */}
    <RuletaSalida
      segmento={segmento}
      onPremio={(p) => {
        setPremio(p);
        setErrorCodigo('');
        const u = premioDe(p.premio).unidades;
        if (u) setUnidades(u);
      }}
    />
    </>
  );
}
