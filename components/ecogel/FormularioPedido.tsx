'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DESCUENTO_ONLINE, money, totalPedido, type MetodoPago, type Segmento, type Unidades } from '@/lib/ecogel';
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

export default function FormularioPedido({ segmento, unidadesIniciales }: { segmento: Segmento; unidadesIniciales: Unidades }) {
  const { unidades, setUnidades } = useTier();
  const [metodo, setMetodo] = useState<MetodoPago>('online');
  const [datos, setDatos] = useState({ nombre: '', celular: '', correo: '', direccion: '', barrio: '', ciudad: '', departamento: '' });
  const [ofertas, setOfertas] = useState(true);
  const [website, setWebsite] = useState('');
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [estado, setEstado] = useState<'idle' | 'enviando' | 'error-mp' | 'error'>('idle');

  useEffect(() => {
    setUnidades(unidadesIniciales);
    // InitiateCheckout: una vez por sesión (ver UNA_VEZ_POR_SESION en lib/meta/pixel.ts).
    rastrear('InitiateCheckout', {
      categoria: `ecogel-${segmento}`,
      valor: totalPedido(unidadesIniciales, 'contraentrega').total,
      contenido: { ids: ['ecogel'], numItems: unidadesIniciales },
    });
  }, [unidadesIniciales, segmento, setUnidades]);

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
    // hubo compra. Pero el event_id se genera ahora, viaja al servidor (que sí
    // manda el Purchase por CAPI al crear el pedido) y se guarda para /gracias.
    // nuevoEventId() en vez de crypto.randomUUID() directo: en iOS <15.4 o en
    // webviews sin contexto seguro randomUUID no existe y lanza, dejando el
    // botón en "Procesando…" para siempre.
    const eventId = nuevoEventId();

    try {
      const res = await fetch('/api/ecogel/pedido', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ ...entrada, website, eventId, externalId: idDeVisitante(), sourceUrl: window.location.href }),
      });
      const json = (await res.json()) as { ok: boolean; pedidoId?: string; ir?: string; errores?: Record<string, string>; motivo?: string };
      if (!res.ok || !json.ok) {
        const hayErroresPorCampo = json.errores && Object.keys(json.errores).length > 0;
        if (hayErroresPorCampo) {
          setErrores(json.errores!);
          setEstado('idle');
        } else {
          setEstado(json.motivo === 'mp' ? 'error-mp' : 'error');
        }
        return;
      }
      try {
        window.sessionStorage.setItem(
          'ecogel_compra',
          JSON.stringify({ pedidoId: json.pedidoId, eventId, valor: t.total, unidades, segmento }),
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
            <div className="flex justify-between text-brand-green"><dt>Descuento por pago en línea</dt><dd>−{money(t.descuento)}</dd></div>
          )}
          <div className="flex justify-between border-t border-brand-gray-light pt-2 font-heading text-body font-bold"><dt>Total</dt><dd>{money(t.total)}</dd></div>
        </dl>
      </section>

      <section className="mt-6 space-y-3.5">
        <h2 className="font-heading text-h3 text-brand-green">Datos de entrega</h2>
        {(
          [
            ['nombre', 'Nombre completo', 'text', 'name'],
            ['celular', 'Celular (WhatsApp)', 'tel', 'tel'],
            ['correo', metodo === 'online' ? 'Correo' : 'Correo (opcional)', 'email', 'email'],
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
          {(
            [
              ['online', 'Pagar ahora — PSE, Nequi, tarjeta', `${money(DESCUENTO_ONLINE)} menos`],
              ['contraentrega', 'Pagar al recibir', 'solo efectivo'],
            ] as const
          ).map(([valor, titulo, nota]) => (
            <label key={valor} className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 px-4 py-3 ${metodo === valor ? 'border-brand-green bg-brand-green/5' : 'border-brand-gray-light'}`}>
              <input type="radio" name="metodo" value={valor} checked={metodo === valor} onChange={() => setMetodo(valor)} className="h-4 w-4 text-brand-green" />
              <span className="flex-1">
                <span className="block font-semibold text-brand-black">{titulo}</span>
                <span className="block text-body-sm text-brand-black/60">{nota}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {estado === 'error-mp' && (
        <p className="mt-4 rounded-lg bg-brand-orange/10 px-3 py-2.5 text-body-sm text-brand-orange-dark">
          No pudimos abrir el pago en línea. Tu pedido quedó guardado: escoge «Pagar al recibir» y confírmalo, o escríbenos por WhatsApp.
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
