import Image from 'next/image';
import { FileDown } from 'lucide-react';
import { BONO_GUIA_PDF, money, tierDe, type MetodoPago, type Unidades } from '@/lib/ecogel';
import { premioDe, totalConPremio, type IdPremio } from '@/lib/ecogel-premios';

const COMO_PAGA: Record<string, string> = {
  cod: 'Pagas en efectivo al recibir',
  approved: 'Pagado en línea',
  pending: 'Pago en línea en proceso',
  bancolombia: 'Transferencia Bancolombia',
  nequi: 'Transferencia Nequi',
  breb: 'Transferencia Bre-B',
};

// El mismo desglose del checkout, recalculado desde lib/ecogel.ts con las
// unidades de la URL: nunca un precio que venga del navegador.
export default function ResumenPedido({ unidades, metodo, estado, premio = null, kit }: { unidades: Unidades; metodo: MetodoPago; estado: string; premio?: IdPremio | null; kit?: string }) {
  const t = totalConPremio(unidades, metodo, premio, true);
  const tier = tierDe(unidades);
  return (
    <section className="reveal container-custom mt-10 max-w-xl">
      <p className="font-heading text-[13px] font-semibold uppercase tracking-[0.14em] text-brand-orange">Tu pedido</p>
      <div className="mt-3 overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-brand-green/10">
        {kit && (
          <Image src={kit} alt="Kit EcoGel con la guía de aplicación" width={1254} height={1254} sizes="(max-width: 640px) 100vw, 576px" className="aspect-square w-full object-cover" />
        )}
        <div className="p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-h3 font-bold text-brand-green">EcoGel x{unidades + t.unidadesRegalo}</h2>
            <p className="text-body-sm text-brand-black/60">{tier.etiqueta}</p>
          </div>
          <dl className="mt-3 space-y-1.5 text-body-sm">
            <div className="flex justify-between"><dt className="text-brand-black/65">Producto</dt><dd>{money(t.producto)}</dd></div>
            <div className="flex justify-between"><dt className="text-brand-black/65">Envío</dt><dd>{t.envio === 0 ? 'Gratis' : money(t.envio)}</dd></div>
            {t.descuento > 0 && (
              <div className="flex justify-between text-brand-green"><dt>Descuento por pago anticipado</dt><dd>−{money(t.descuento)}</dd></div>
            )}
            {premio && t.premioAplicado && (
              <div className="flex justify-between text-brand-green">
                <dt>Premio: {premioDe(premio).titulo}</dt>
                <dd>{t.descuentoPremio > 0 ? `−${money(t.descuentoPremio)}` : t.unidadesRegalo > 0 ? '+1 unidad' : 'Aplicado'}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-brand-gray-light pt-2.5 font-heading text-body font-bold text-brand-black">
              <dt>Total</dt>
              <dd>{money(t.total)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[13px] text-brand-black/55">{COMO_PAGA[estado]}</p>

          {unidades === 3 && (
            <a
              href={BONO_GUIA_PDF.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-xl bg-brand-mint p-3.5 text-left"
            >
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-white text-brand-green">
                <FileDown size={20} aria-hidden />
              </span>
              <span className="text-body-sm leading-snug">
                <span className="block font-heading font-bold text-brand-green">Bono del combo, ya es tuyo</span>
                <span className="text-brand-black/70">{BONO_GUIA_PDF.titulo}. Toca para descargarla.</span>
              </span>
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
