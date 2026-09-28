'use client';

import dynamic from 'next/dynamic';
import type { Segmento } from '@/lib/ecogel';

// La ruleta y la calculadora no se ven al cargar (la primera espera 3 s y un
// intento de salida; la segunda, 10 s): su código va en un archivo aparte que
// se descarga después de que la página ya es usable, fuera del JS inicial.
const RuletaSalida = dynamic(() => import('./RuletaSalida'), { ssr: false });
const CalculadoraJeringas = dynamic(() => import('./CalculadoraJeringas'), { ssr: false });

export default function PopupsEcogel({ segmento }: { segmento: Segmento }) {
  return (
    <>
      <RuletaSalida segmento={segmento} />
      <CalculadoraJeringas segmento={segmento} />
    </>
  );
}
