import type { Metadata } from 'next';
import { CheckCircle2, Clock, MessageCircle, XCircle } from 'lucide-react';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import PieEcogel from '@/components/ecogel/PieEcogel';
import RastreoCompra from '@/components/ecogel/RastreoCompra';
import { whatsappEcogel } from '@/lib/ecogel';

export const metadata: Metadata = { title: 'Pedido recibido | AGROINCOL', robots: { index: false, follow: false } };

const TEXTOS = {
  cod: {
    icono: CheckCircle2,
    titulo: 'Pedido recibido',
    texto: 'Te escribimos por WhatsApp para confirmar la dirección. Llega en 2-4 días hábiles y pagas en efectivo al recibir.',
  },
  approved: { icono: CheckCircle2, titulo: 'Pago recibido', texto: 'Tu pedido sale en las próximas 24 horas. Te enviamos la guía de la transportadora por WhatsApp.' },
  pending: { icono: Clock, titulo: 'Pago en proceso', texto: 'PSE puede tardar unos minutos en confirmar. Te avisamos por correo y WhatsApp apenas entre.' },
  failure: { icono: XCircle, titulo: 'El pago no se completó', texto: 'No se cobró nada. Escríbenos y lo resolvemos: puedes volver a intentar en línea o pagar al recibir.' },
} as const;

export default function GraciasPage({ searchParams }: { searchParams: { pedido?: string; estado?: string } }) {
  const pedido = /^EG-\d{6}-[A-Z0-9]{4}$/.test(searchParams.pedido ?? '') ? (searchParams.pedido as string) : '';
  const estado = (searchParams.estado ?? 'cod') as keyof typeof TEXTOS;
  const t = TEXTOS[estado] ?? TEXTOS.cod;
  const Icono = t.icono;
  const wa = whatsappEcogel(`Hola, es sobre mi pedido de EcoGel ${pedido}`.trim());

  return (
    <>
      <CabeceraEcogel whatsappTexto={`Hola, es sobre mi pedido de EcoGel ${pedido}`} />
      <main className="container-custom max-w-xl py-12 text-center">
        <Icono size={52} className={`mx-auto ${estado === 'failure' ? 'text-brand-orange-dark' : 'text-brand-green'}`} aria-hidden />
        <h1 className="font-heading text-h2-mobile text-brand-green mt-4 md:text-h2">{t.titulo}</h1>
        {pedido && <p className="mt-2 font-heading text-body font-bold text-brand-black">Pedido {pedido}</p>}
        <p className="text-brand-black/75 mt-3 text-body">{t.texto}</p>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white">
          <MessageCircle size={18} aria-hidden /> Escribir por WhatsApp
        </a>
        <p className="mt-8 text-body-sm text-brand-black/55">Guarda el número de pedido: es lo que necesitas para cualquier reclamo o para la garantía de 30 días.</p>
      </main>
      <PieEcogel />
      {pedido && <RastreoCompra pedidoId={pedido} estado={estado} />}
    </>
  );
}
