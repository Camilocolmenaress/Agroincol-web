import type { Metadata } from 'next';
import CabeceraEcogel from '@/components/ecogel/CabeceraEcogel';
import PieEcogel from '@/components/ecogel/PieEcogel';
import { BUSINESS } from '@/lib/constants';
import { DESCUENTO_ONLINE, GARANTIA, TIERS, money } from '@/lib/ecogel';
import { REGLA_DESPACHO, TIEMPO_ENTREGA } from '@/lib/ecogel-despacho';
import { PREMIOS } from '@/lib/ecogel-premios';

// Términos de la tienda EcoGel. Lo enlaza el checkout junto a la política de
// privacidad. Retracto (art. 47) y reversión del pago (art. 51) son de la Ley
// 1480 de 2011 para ventas a distancia: informarlos no es opcional.
// Revisado por: pendiente del abogado de la empresa antes de producción.

export const metadata: Metadata = {
  title: 'Términos y condiciones de EcoGel',
  robots: { index: false, follow: true },
};

const ACTUALIZADO = '27 de septiembre de 2026';

export default function TerminosPage() {
  const secciones: { titulo: string; id?: string; parrafos: React.ReactNode[] }[] = [
    {
      titulo: 'Quién vende',
      parrafos: [
        `${BUSINESS.legalName}, NIT 1.095.786.836-1. ${BUSINESS.address.full}. Teléfono y WhatsApp ${BUSINESS.phone}. Correo ${BUSINESS.email}.`,
        'EcoGel es marca de Mylva S.A. Registro INVIMA 2009V0004964.',
      ],
    },
    {
      titulo: 'Precios',
      parrafos: [
        `Los precios están en pesos colombianos: ${TIERS.map((t) => `${t.unidades} ${t.unidades === 1 ? 'unidad' : 'unidades'} ${money(t.producto)} con envío ${t.envio === 0 ? 'gratis' : `de ${money(t.envio)}`}`).join('; ')}.`,
        `Si pagas en línea o por transferencia, el total tiene ${money(DESCUENTO_ONLINE)} de descuento. El total final se muestra antes de confirmar el pedido.`,
      ],
    },
    {
      titulo: 'Formas de pago',
      parrafos: [
        'En línea con tarjeta o PSE, a través de Mercado Pago.',
        'Por transferencia a Bancolombia, Nequi o Bre-B: despachamos cuando recibimos el comprobante por WhatsApp.',
        'Contra entrega, en efectivo: antes de enviar te escribimos o te llamamos para confirmar el pedido.',
      ],
    },
    {
      titulo: 'Envío',
      parrafos: [
        `${REGLA_DESPACHO} ${TIEMPO_ENTREGA}`,
        'La transportadora exige el documento de identidad de quien recibe.',
      ],
    },
    {
      titulo: 'Garantía EcoGel',
      parrafos: [
        `${GARANTIA.titulo}. ${GARANTIA.texto}`,
        'Esta garantía se suma a la garantía legal de calidad e idoneidad de la Ley 1480 de 2011; no la reemplaza.',
      ],
    },
    {
      titulo: 'Derecho de retracto',
      parrafos: [
        'Como compraste a distancia, puedes retractarte de la compra dentro de los 5 días hábiles siguientes a la entrega (Ley 1480 de 2011, artículo 47).',
        'Para hacerlo, escríbenos por WhatsApp o correo con tu número de pedido. Devuelves el producto por los mismos medios y en las mismas condiciones en que lo recibiste; el costo del transporte de la devolución corre por tu cuenta.',
        'Te devolvemos todo lo que pagaste, sin descuentos ni retenciones, dentro de los 30 días calendario siguientes a tu solicitud.',
      ],
    },
    {
      titulo: 'Reversión del pago',
      parrafos: [
        'Si pagaste en línea y fuiste víctima de fraude, no hiciste la compra, no recibiste el producto, o lo que llegó no corresponde a lo que pediste o está defectuoso, puedes pedir la reversión del pago dentro de los 5 días hábiles siguientes a que te enteres (Ley 1480 de 2011, artículo 51).',
        'Escríbenos a nosotros y avisa también al banco o emisor del medio de pago que usaste.',
      ],
    },
    {
      titulo: 'Ruleta de premios',
      id: 'ruleta',
      parrafos: [
        'Participar es opcional. Para reclamar el premio se deja un correo, al que enviamos el código y promociones de EcoGel con tu autorización. Cada correo gira una sola vez; si gira de nuevo, recibe el mismo premio.',
        'El premio lo sortea nuestro servidor con estas probabilidades reales:',
        <ul key="premios" className="list-disc space-y-1 pl-5">
          {PREMIOS.map((p) => (
            <li key={p.id}>
              <strong>{p.titulo}</strong>: {p.probabilidad} %. {p.condicion} Vigencia: {p.vigenciaDias} días desde el giro.
            </li>
          ))}
        </ul>,
        'Cada código es de un solo uso, queda asociado al correo que giró y sirve para un pedido. Un pedido admite un solo código. El premio se suma al descuento por pago anticipado. No se cambia por dinero ni por otro premio.',
        'Si el pago en línea de un pedido con código falla, el código se puede volver a usar en un pedido nuevo.',
        'Para dejar de recibir correos, responde cualquiera de ellos con la palabra BAJA.',
      ],
    },
    {
      titulo: 'Tus datos',
      parrafos: [
        <p key="datos">
          Usamos tus datos para gestionar y entregar tu pedido, como explica la{' '}
          <a href="/politica-de-privacidad" className="underline underline-offset-4">política de privacidad</a>. Solo te escribimos por WhatsApp o correo para promociones si lo autorizaste.
        </p>,
      ],
    },
    {
      titulo: 'Peticiones, quejas y reclamos',
      parrafos: [`WhatsApp ${BUSINESS.phone} o correo ${BUSINESS.email}. Respondemos dentro de los plazos de ley.`],
    },
  ];

  return (
    <>
      <CabeceraEcogel />
      <main className="container-custom max-w-2xl py-10">
        <h1 className="font-heading text-h2-mobile text-brand-green md:text-h2">Términos y condiciones de EcoGel</h1>
        <p className="mt-2 text-body-sm text-brand-black/55">Última actualización: {ACTUALIZADO}</p>
        <div className="mt-8 space-y-8">
          {secciones.map((s) => (
            <section key={s.titulo} id={s.id} className="scroll-mt-6">
              <h2 className="font-heading text-h3 text-brand-green">{s.titulo}</h2>
              <div className="mt-2 space-y-2 text-body leading-relaxed text-brand-black/80">
                {s.parrafos.map((p, i) => (typeof p === 'string' ? <p key={i}>{p}</p> : p))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <PieEcogel />
    </>
  );
}
