import { Check, X } from 'lucide-react';
import { AEROSOL } from '@/lib/ecogel-evidencia';

// Tabla de Lummia ("Otras marcas / Láser / Rastrillo / Cera"). La fumigación no
// entra: es el servicio de la casa y se recomienda honestamente en el FAQ.
const COLUMNAS = ['Gel AGROINCOL', 'Aerosol', 'Trampas', 'Otros geles'];
const FILAS: [string, boolean[]][] = [
  ['Elimina la colonia completa', [true, false, false, true]],
  ['Sin olor ni vapores', [true, false, true, true]],
  ['Seguro con niños y mascotas (Bitrex)', [true, false, true, true]],
  ['Sin desalojar ni tapar comida', [true, false, true, true]],
  ['Sigue actuando por semanas', [true, false, false, true]],
  ['Respaldo de una fumigadora', [true, false, false, false]],
];

export default function Comparativa() {
  return (
    <section className="container-custom mt-10 overflow-x-auto">
      <h2 className="font-heading text-h2-mobile text-brand-green md:text-h2">¿Y si uso otra cosa?</h2>
      <table className="mt-5 w-full min-w-[520px] border-separate border-spacing-0 text-body-sm">
        <thead>
          <tr>
            <th className="p-2 text-left" />
            {COLUMNAS.map((c, i) => (
              <th key={c} className={`p-2 text-center font-heading ${i === 0 ? 'rounded-t-xl bg-brand-green text-white' : 'text-brand-black/70'}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FILAS.map(([fila, valores]) => (
            <tr key={fila}>
              <td className="border-b border-brand-gray-light p-2 text-brand-black">{fila}</td>
              {valores.map((v, i) => (
                <td key={i} className={`border-b border-brand-gray-light p-2 text-center ${i === 0 ? 'bg-brand-green/5' : ''}`}>
                  {v ? <Check size={18} className="mx-auto text-brand-green" aria-label="Sí" /> : <X size={18} className="mx-auto text-brand-black/30" aria-label="No" />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-3 text-[12px] leading-snug text-brand-black/60">
        Aerosol mensual: &quot;poco o ningún efecto&quot; en 12 meses · Virginia Tech, J. Econ. Entomol. 2004 ·{' '}
        <a href={AEROSOL.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
          ver estudio
        </a>
      </p>
    </section>
  );
}
