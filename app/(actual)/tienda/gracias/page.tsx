import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckCircle2, Clock, Download, MessageCircle, RotateCcw, ShieldCheck, XCircle } from 'lucide-react';
import DatosTransferencia, { type MetodoManual } from '@/components/ecogel/gracias/DatosTransferencia';
import { RastreoCompra } from '@/components/tienda/Rastreo';
import { Logo, fondoPatron } from '@/components/tienda/Marca';
import { Pie } from '@/components/tienda/Secciones';
import { ENTREGA_AM, GARANTIA, GUIA_PDF, MAXIMO, MINIMO, NOMBRE, RECLAMO, URL_PRODUCTO, cotizar, money, urlCheckout, type Zona } from '@/lib/laminas';
import { whatsappLaminas } from '@/lib/laminas-contenido';

export const metadata: Metadata = { title: 'Pedido recibido | Láminas de Captura AGROINCOL', robots: { index: false, follow: false } };

type Estado = 'cod' | 'approved' | 'pending' | 'failure' | MetodoManual;
type Tono = 'ok' | 'espera' | 'error';

const TRANSFERENCIA = {
  tono: 'espera' as const,
  titulo: 'Falta un paso: su transferencia',
  bajada: 'Transfiera el valor y envíenos el comprobante por WhatsApp para despachar su pedido.',
};
const ESTADOS: Record<Estado, { tono: Tono; titulo: string; bajada: string }> = {
  cod: { tono: 'ok', titulo: '¡Listo! Recibimos su pedido', bajada: 'Paga en efectivo cuando le llegue. Antes le escribimos o lo llamamos para confirmarlo.' },
  approved: { tono: 'ok', titulo: '¡Listo! Su pago está confirmado', bajada: 'Ya estamos preparando su pedido.' },
  pending: { tono: 'espera', titulo: 'Su pago está en proceso', bajada: 'PSE puede tardar unos minutos en confirmar. Le avisamos por WhatsApp apenas entre.' },
  failure: { tono: 'error', titulo: 'El pago no se completó', bajada: 'No se cobró nada. Puede intentarlo de nuevo o pagar por transferencia.' },
  bancolombia: TRANSFERENCIA,
  nequi: TRANSFERENCIA,
  breb: TRANSFERENCIA,
};
const ICONO = { ok: CheckCircle2, espera: Clock, error: XCircle } as const;
const esManual = (e: Estado): e is MetodoManual => e === 'bancolombia' || e === 'nequi' || e === 'breb';

export default function GraciasLaminasPage({ searchParams }: { searchParams: { pedido?: string; estado?: string; n?: string; z?: string } }) {
  const pedido = /^LC-\d{6}-[A-Z0-9]{4}$/.test(searchParams.pedido ?? '') ? (searchParams.pedido as string) : '';
  const crudo = searchParams.estado ?? '';
  // Sin pedido o con un estado que no existe no hay nada que confirmar: nunca
  // decir "¡Listo! Recibimos su pedido" a quien no hizo uno.
  if (!pedido || !Object.prototype.hasOwnProperty.call(ESTADOS, crudo)) redirect(URL_PRODUCTO);
  const estado = crudo as Estado;
  const e = ESTADOS[estado];
  const Icono = ICONO[e.tono];
  const n = Number(searchParams.n);
  const cantidad = Number.isInteger(n) && n >= MINIMO && n <= MAXIMO ? n : undefined;
  const zona: Zona | undefined = searchParams.z === 'am' || searchParams.z === 'fuera' ? searchParams.z : undefined;
  const c = cantidad && zona ? cotizar(cantidad, zona) : undefined;
  const wa = whatsappLaminas(`Hola, es sobre mi pedido de Láminas de Captura ${pedido}`.trim());

  return (
    <>
      <header className="border-b border-brand-green/10">
        <div className="container-custom flex h-16 items-center">
          <a href={URL_PRODUCTO}>
            <Logo prioridad className="-ml-2 h-[60px] w-auto" />
          </a>
        </div>
      </header>
      <div className="pb-6 [&>div]:mt-6">
        <section className="bg-brand-mint px-3 py-6" style={fondoPatron('arcos-claro')}>
          {/* Patrón Arcos claro alrededor; el mensaje va en una tarjeta lisa. */}
          <div className="container-custom max-w-xl rounded-[28px] bg-white py-8 text-center shadow-soft">
            <Icono size={64} strokeWidth={1.75} className={`mx-auto ${e.tono === 'error' ? 'text-brand-orange-dark' : 'text-brand-green'}`} aria-hidden />
            {pedido && <p className="mt-4 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-brand-green">Pedido {pedido}</p>}
            <h1 className="mt-2 font-heading text-[2rem] font-bold leading-[1.1] text-brand-green text-balance">{e.titulo}</h1>
            <p className="mx-auto mt-2 max-w-md text-body text-brand-black/70">{e.bajada}</p>
          </div>
        </section>

        {estado === 'failure' ? (
          <section className="container-custom max-w-xl space-y-3">
            <a
              href={cantidad ? urlCheckout(cantidad) : urlCheckout(12)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-4 font-heading text-[1.2rem] font-bold text-white shadow-brand"
            >
              <RotateCcw size={18} aria-hidden /> Volver a intentar
            </a>
            <a href={wa} target="_blank" rel="noopener noreferrer" className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-green px-6 py-3.5 font-heading text-body font-bold text-brand-green">
              <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
            </a>
          </section>
        ) : (
          <div className="space-y-5">
            {esManual(estado) && (
              <DatosTransferencia
                metodo={estado}
                total={c?.total}
                whatsapp={whatsappLaminas(`Hola, les envío el comprobante de mi pedido de Láminas de Captura ${pedido}`.trim())}
              />
            )}

            {c && (
              <section className="container-custom max-w-xl">
                <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-green/10">
                  <h2 className="font-heading text-h3 font-bold text-brand-green">Su pedido</h2>
                  <dl className="mt-3 space-y-1.5 text-body-sm">
                    <div className="flex justify-between"><dt>{NOMBRE} × {c.cantidad}</dt><dd>{money(c.producto)}</dd></div>
                    <div className="flex justify-between"><dt>Envío</dt><dd>{c.envio === 0 ? 'Gratis' : money(c.envio)}</dd></div>
                    <div className="flex justify-between border-t border-brand-black/10 pt-2 font-heading text-body font-bold"><dt>Total</dt><dd>{money(c.total)}</dd></div>
                  </dl>
                  <p className="mt-3 text-body-sm text-brand-black/70">
                    {zona === 'am' ? `${ENTREGA_AM}.` : 'Va por transportadora: le enviamos la guía de seguimiento por WhatsApp.'}
                  </p>
                </div>
              </section>
            )}

            <section className="container-custom max-w-xl">
              <div className="rounded-2xl bg-brand-green p-5 text-white">
                <p className="font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-brand-orange-light">Mientras llega</p>
                <h2 className="mt-1 font-heading text-[1.5rem] font-bold leading-tight">Su guía de ubicación y uso</h2>
                <p className="mt-1.5 text-body-sm text-white/80">Dónde ponerlas, cuántas usar y qué hacer los primeros días. Léala antes de abrir la caja: son 3 minutos.</p>
                <a
                  href={GUIA_PDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 font-heading text-body font-bold text-brand-green"
                >
                  <Download size={18} aria-hidden /> Descargar la guía (PDF)
                </a>
              </div>
            </section>

            <section className="container-custom max-w-xl">
              <div className="flex gap-3.5 rounded-2xl bg-brand-mint p-5">
                <ShieldCheck size={28} className="flex-none text-brand-green" aria-hidden />
                <div>
                  <p className="font-heading text-body font-bold text-brand-green">{GARANTIA}</p>
                  <p className="mt-1 text-body-sm text-brand-black/70">{RECLAMO}</p>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-body-sm font-semibold text-brand-green underline underline-offset-4">
                    Escribir por WhatsApp
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      <Pie />
      {pedido && <RastreoCompra pedidoId={pedido} estado={estado} />}
    </>
  );
}
