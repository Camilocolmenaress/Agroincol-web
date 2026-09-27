import type { Metadata } from 'next';
import { MessageCircle, RotateCcw } from 'lucide-react';
import AprendeAUsarlo from '@/components/ecogel/AprendeAUsarlo';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import ComoAplicar from '@/components/ecogel/ComoAplicar';
import PieEcogel from '@/components/ecogel/PieEcogel';
import RastreoCompra from '@/components/ecogel/RastreoCompra';
import WhatsAppFlotante from '@/components/ecogel/WhatsAppFlotante';
import Bienvenida, { type Tono } from '@/components/ecogel/gracias/Bienvenida';
import { Ayuda, LoQueTienes, Respaldo } from '@/components/ecogel/gracias/Confianza';
import DatosTransferencia, { type MetodoManual } from '@/components/ecogel/gracias/DatosTransferencia';
import LineaTiempo from '@/components/ecogel/gracias/LineaTiempo';
import ResumenPedido from '@/components/ecogel/gracias/ResumenPedido';
import { esSegmento, esUnidades, totalPedido, whatsappEcogel, type MetodoPago } from '@/lib/ecogel';
import { diaDeDespacho } from '@/lib/ecogel-despacho';
import { fotosEcogel, videosAprenderAUsarlo } from '../fotos';

export const metadata: Metadata = { title: 'Pedido recibido | AGROINCOL', robots: { index: false, follow: false } };

type Estado = 'cod' | 'approved' | 'pending' | 'failure' | MetodoManual;

const ESTADOS: Record<Estado, { tono: Tono; titulo: string; bajada: string; metodo: MetodoPago }> = {
  cod: {
    tono: 'ok',
    titulo: '¡Listo! Recibimos tu pedido',
    bajada: 'Pagas en efectivo cuando te llegue. Esto es lo que sigue.',
    metodo: 'contraentrega',
  },
  approved: {
    tono: 'ok',
    titulo: '¡Listo! Tu pago está confirmado',
    bajada: 'Ya estamos preparando tu pedido. Esto es lo que sigue.',
    metodo: 'online',
  },
  pending: {
    tono: 'espera',
    titulo: 'Tu pago está en proceso',
    bajada: 'PSE puede tardar unos minutos en confirmar. Te avisamos por correo y WhatsApp apenas entre.',
    metodo: 'online',
  },
  failure: {
    tono: 'error',
    titulo: 'El pago no se completó',
    bajada: 'No se cobró nada. Puedes volver a intentarlo o escribirnos y lo resolvemos: también puedes pagar al recibir.',
    metodo: 'online',
  },
  bancolombia: {
    tono: 'espera',
    titulo: 'Falta un paso: tu transferencia',
    bajada: 'Transfiere el valor y mándanos el comprobante por WhatsApp para despachar tu pedido.',
    metodo: 'bancolombia',
  },
  nequi: {
    tono: 'espera',
    titulo: 'Falta un paso: tu transferencia',
    bajada: 'Transfiere el valor y mándanos el comprobante por WhatsApp para despachar tu pedido.',
    metodo: 'nequi',
  },
  breb: {
    tono: 'espera',
    titulo: 'Falta un paso: tu transferencia',
    bajada: 'Transfiere el valor y mándanos el comprobante por WhatsApp para despachar tu pedido.',
    metodo: 'breb',
  },
};

const esManual = (e: Estado): e is MetodoManual => e === 'bancolombia' || e === 'nequi' || e === 'breb';

export default function GraciasPage({ searchParams }: { searchParams: { pedido?: string; estado?: string; u?: string; s?: string } }) {
  const pedido = /^EG-\d{6}-[A-Z0-9]{4}$/.test(searchParams.pedido ?? '') ? (searchParams.pedido as string) : '';
  const crudo = searchParams.estado ?? 'cod';
  const estado: Estado = Object.prototype.hasOwnProperty.call(ESTADOS, crudo) ? (crudo as Estado) : 'cod';
  const e = ESTADOS[estado];
  // Pedidos anteriores a este cambio llegan sin u/s: el resumen se omite y se asume hogar.
  const u = Number(searchParams.u);
  const unidades = esUnidades(u) ? u : undefined;
  const segmento = esSegmento(searchParams.s) ? searchParams.s : 'hogar';
  const total = unidades ? totalPedido(unidades, e.metodo).total : undefined;
  const fotos = fotosEcogel(segmento);
  // Hora de la solicitud = hora del pedido: el checkout redirige aquí al crearlo.
  const despacho = diaDeDespacho(new Date());

  const whatsappTexto = `Hola, es sobre mi pedido de EcoGel ${pedido}`.trim();
  const wa = whatsappEcogel(whatsappTexto);

  return (
    <>
      {/* Sin segmento: el pedido ya está hecho, el carrito no aplica. */}
      <CabeceraEcogel />
      <main className="pb-4">
        <Bienvenida
          tono={e.tono}
          titulo={e.titulo}
          bajada={e.bajada}
          pedido={pedido}
          despacho={estado === 'cod' || estado === 'approved' ? despacho : undefined}
          avisoContacto={estado === 'cod'}
        />

        {estado === 'failure' ? (
          <section className="container-custom max-w-xl space-y-3">
            <a
              href={unidades ? `/ecogel/pedido?u=${unidades}&de=${segmento}` : '/ecogel/pedido'}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-orange px-6 py-3.5 font-heading text-body font-bold text-white shadow-brand"
            >
              <RotateCcw size={18} aria-hidden /> Volver a intentar
            </a>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-heading text-body font-bold text-white"
            >
              <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
            </a>
          </section>
        ) : (
          <>
            {esManual(estado) && (
              <DatosTransferencia
                metodo={estado}
                total={total}
                whatsapp={whatsappEcogel(`Hola, te envío el comprobante de mi pedido de EcoGel ${pedido}`.trim())}
              />
            )}
            {unidades && <ResumenPedido unidades={unidades} metodo={e.metodo} estado={estado} kit={fotos.kit} />}
            <LineaTiempo estado={estado} despacho={despacho} total={total} />

            <div className="mx-auto mt-12 max-w-xl [&>section:first-of-type]:mt-1">
              <p className="container-custom font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">
                Mientras llega
              </p>
              <AprendeAUsarlo videos={videosAprenderAUsarlo()} />
              {segmento === 'hogar' && <ComoAplicar conQueEsperar={false} />}
            </div>

            <LoQueTienes />
            <Respaldo foto={fotos.equipo} />
            <Ayuda whatsapp={wa} pedido={pedido} />
          </>
        )}
      </main>
      <PieEcogel />
      <WhatsAppFlotante texto={whatsappTexto} />
      {pedido && <RastreoCompra pedidoId={pedido} estado={estado} />}
    </>
  );
}
