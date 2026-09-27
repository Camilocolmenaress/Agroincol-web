import { MessageCircle } from 'lucide-react';
import { CUENTAS_MANUALES, money } from '@/lib/ecogel';
import BotonCopiar from './BotonCopiar';

export type MetodoManual = 'bancolombia' | 'nequi' | 'breb';

type Fila = { etiqueta: string; valor: string; copiable?: boolean };

function filasDe(metodo: MetodoManual): Fila[] {
  if (metodo === 'bancolombia') {
    const b = CUENTAS_MANUALES.bancolombia;
    return [
      { etiqueta: 'Banco', valor: `${b.banco} · ${b.tipo}` },
      { etiqueta: 'Número de cuenta', valor: b.numero, copiable: true },
      { etiqueta: 'Titular', valor: b.titular },
      { etiqueta: 'Cédula', valor: b.cedula, copiable: true },
    ];
  }
  if (metodo === 'nequi') {
    const n = CUENTAS_MANUALES.nequi;
    return [
      { etiqueta: 'Número Nequi', valor: n.numero, copiable: true },
      { etiqueta: 'Titular', valor: n.titular },
    ];
  }
  const r = CUENTAS_MANUALES.breb;
  return [
    { etiqueta: 'Llave Bre-B', valor: r.llave, copiable: true },
    { etiqueta: 'Banco', valor: r.banco },
    { etiqueta: 'Titular', valor: r.titular },
  ];
}

// Lo único que falta para despachar es la plata: por eso va antes que todo lo
// demás, con el valor exacto y cada dato listo para copiar.
export default function DatosTransferencia({ metodo, total, whatsapp }: { metodo: MetodoManual; total?: number; whatsapp: string }) {
  const filas: Fila[] = total ? [{ etiqueta: 'Valor a transferir', valor: money(total), copiable: true }, ...filasDe(metodo)] : filasDe(metodo);
  return (
    <section className="container-custom max-w-xl">
      <div className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-green/10">
        <h2 className="font-heading text-h3 font-bold text-brand-green">Datos para transferir</h2>
        <dl className="mt-3 divide-y divide-brand-gray-light">
          {filas.map((f) => (
            <div key={f.etiqueta} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <dt className="text-[13px] text-brand-black/55">{f.etiqueta}</dt>
                <dd className="break-words font-heading text-body font-bold text-brand-black">{f.valor}</dd>
              </div>
              {f.copiable && <BotonCopiar valor={f.valor.replace(/[^0-9A-Za-z@]/g, '')} etiqueta={f.etiqueta.toLowerCase()} />}
            </div>
          ))}
        </dl>
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 font-heading text-body font-bold text-white"
        >
          <MessageCircle size={18} aria-hidden /> Enviar comprobante por WhatsApp
        </a>
      </div>
    </section>
  );
}
