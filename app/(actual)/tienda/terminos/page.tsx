import type { Metadata } from 'next';
import { BUSINESS } from '@/lib/constants';
import { DESDE_ENVIO_GRATIS, DESDE_PRECIO_24, ENTREGA_AM, ENVIO_AM, ENVIO_FUERA, GARANTIA, MINIMO, PRECIO_UNIDAD, PRECIO_UNIDAD_24, RECLAMO, URL_PRODUCTO, money } from '@/lib/laminas';
import { Pie } from '@/components/tienda/Secciones';
import { Logo } from '@/components/tienda/Marca';

// Términos de la tienda (Láminas de Captura). Adaptados de /ecogel/terminos:
// retracto (art. 47) y reversión del pago (art. 51) de la Ley 1480 de 2011 son
// obligatorios en ventas a distancia. Pendiente: revisión del abogado.

export const metadata: Metadata = {
  title: 'Términos y condiciones · Láminas de Captura AGROINCOL',
  robots: { index: false, follow: true },
};

const ACTUALIZADO = '9 de noviembre de 2026';

export default function TerminosTiendaPage() {
  const secciones: { titulo: string; parrafos: string[] }[] = [
    {
      titulo: 'Quién vende',
      parrafos: [`${BUSINESS.legalName}, NIT 1.095.786.836-1. ${BUSINESS.address.full}. Teléfono y WhatsApp ${BUSINESS.phone}. Correo ${BUSINESS.email}.`],
    },
    {
      titulo: 'Precios',
      parrafos: [
        `Precios en pesos colombianos. Compra mínima: ${MINIMO} láminas. De ${MINIMO} a ${DESDE_PRECIO_24 - 1} láminas, ${money(PRECIO_UNIDAD)} cada una; desde ${DESDE_PRECIO_24}, ${money(PRECIO_UNIDAD_24)} cada una.`,
        'El precio es el mismo con cualquier forma de pago. El total final, con el envío, se muestra antes de confirmar el pedido. Emitimos factura electrónica.',
      ],
    },
    {
      titulo: 'Envío',
      parrafos: [
        `Área metropolitana de Bucaramanga (Bucaramanga, Floridablanca, Girón y Piedecuesta): ${money(ENVIO_AM)} de ${MINIMO} a ${DESDE_ENVIO_GRATIS - 1} láminas y gratis desde ${DESDE_ENVIO_GRATIS}. ${ENTREGA_AM}.`,
        `Resto del país: ${money(ENVIO_FUERA)} por pedido, por transportadora. Le enviamos la guía de seguimiento por WhatsApp.`,
        'La transportadora puede pedir el documento de identidad de quien recibe.',
      ],
    },
    {
      titulo: 'Formas de pago',
      parrafos: [
        'En línea con tarjeta o PSE, a través de Mercado Pago.',
        'Por transferencia a Bancolombia, Nequi o Bre-B: despachamos cuando recibimos el comprobante por WhatsApp.',
        'En efectivo al recibir, solo en el área metropolitana: antes de enviar le escribimos o lo llamamos para confirmar el pedido.',
      ],
    },
    {
      titulo: 'Garantía',
      parrafos: [GARANTIA, RECLAMO, 'Esta garantía se suma a la garantía legal de calidad e idoneidad de la Ley 1480 de 2011; no la reemplaza.'],
    },
    {
      titulo: 'Derecho de retracto',
      parrafos: [
        'Como compró a distancia, puede retractarse dentro de los 5 días hábiles siguientes a la entrega (Ley 1480 de 2011, artículo 47), sin dar un motivo.',
        'Escríbanos por WhatsApp o correo con su número de pedido. Devuelva el producto sin usar, en las mismas condiciones en que lo recibió; el transporte de la devolución corre por su cuenta.',
        'Le devolvemos todo lo que pagó, sin descuentos ni retenciones, dentro de los 30 días calendario siguientes a su solicitud.',
      ],
    },
    {
      titulo: 'Reversión del pago',
      parrafos: [
        'Si pagó en línea y fue víctima de fraude, no hizo la compra, no recibió el producto, o lo que llegó no corresponde a lo que pidió o está defectuoso, puede pedir la reversión del pago dentro de los 5 días hábiles siguientes a que se entere (Ley 1480 de 2011, artículo 51). Escríbanos y avise también al emisor del medio de pago.',
      ],
    },
    {
      titulo: 'Sus datos',
      parrafos: ['Usamos sus datos para gestionar, facturar y entregar su pedido, como explica la política de privacidad. Solo le escribimos por WhatsApp si lo autorizó.'],
    },
    {
      titulo: 'Peticiones, quejas y reclamos',
      parrafos: [`WhatsApp ${BUSINESS.phone} o correo ${BUSINESS.email}. Respondemos dentro de los plazos de ley.`],
    },
  ];

  return (
    <>
      <header className="border-b border-brand-green/10">
        <div className="container-custom flex h-16 items-center">
          <a href={URL_PRODUCTO}>
            <Logo className="-ml-2 h-[60px] w-auto" />
          </a>
        </div>
      </header>
      <div className="container-custom max-w-2xl py-10">
        <h1 className="font-heading text-h2-mobile text-brand-green md:text-h2">Términos y condiciones de la tienda</h1>
        <p className="mt-2 text-body-sm text-brand-black/70">Última actualización: {ACTUALIZADO}</p>
        <div className="mt-8 space-y-8">
          {secciones.map((s) => (
            <section key={s.titulo}>
              <h2 className="font-heading text-h3 text-brand-green">{s.titulo}</h2>
              <div className="mt-2 space-y-2 text-body leading-relaxed text-brand-black/80">
                {s.parrafos.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
      <Pie />
    </>
  );
}
