// Evidencia real para la sección "Prueba, no promesas" (iteración 3). Cada
// entrada es un estudio, una noticia o una norma verificable y enlazada. Las
// cifras se copian tal cual las da la fuente; nunca "EcoGel fue probado por…",
// sí "un gel con la misma molécula y concentración". Sin imports de Node.

import type { Segmento } from './ecogel';

export type TipoEvidencia = 'estudio' | 'noticia' | 'norma';

export interface Evidencia {
  tipo: TipoEvidencia;
  /** Cabecera tipográfica: nombre del medio/revista/entidad. */
  fuente: string;
  /** Línea secundaria: autores e institución, o fecha, o "Ministerio de…". */
  detalle: string;
  /** El dato, en una frase, con la cifra en negrita marcada con ** **. */
  dato: string;
  /** Cita corta para el pie de la tarjeta. */
  cita: string;
  url: string;
  anio: number;
}

export const IMIDACLOPRID: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Appel & Tanley · Auburn University · 2000',
  dato: 'Un gel de **imidacloprid al 2,15 %** —la misma molécula y concentración de EcoGel— redujo las cucarachas en cocinas de casas infestadas **~50 % en 1 semana y ~80 % en 4 semanas**.',
  cita: 'J. Econ. Entomol. 93(1):112–118. doi:10.1603/0022-0493-93.1.112',
  url: 'https://pubmed.ncbi.nlm.nih.gov/14658520/',
  anio: 2000,
};

export const CASCADA: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Hamilton, Wada-Katsumata & Schal · North Carolina State University · 2023',
  dato: 'El **100 %** de las cucarachas que comen el gel mueren y contagian a **más del 85 %** de las que nunca lo tocaron, **en 48 horas**.',
  cita: 'J. Econ. Entomol. 116(2):529–537',
  url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC12102599/',
  anio: 2023,
};

export const AEROSOL: Evidencia = {
  tipo: 'estudio',
  fuente: 'Journal of Economic Entomology',
  detalle: 'Miller & Meek · Virginia Tech · 2004 · 12 meses, 1.200 viviendas',
  dato: 'El programa de **aerosol mensual "tuvo poco o ningún efecto"** y la población **se triplicó** en verano. El programa con cebos bajó de 24,7 a 3,9 cucarachas por vivienda (**−84 %**) y se mantuvo así el resto del año.',
  cita: 'J. Econ. Entomol. 97(2):559–569. PMID 15154482',
  url: 'https://pubmed.ncbi.nlm.nih.gov/15154482/',
  anio: 2004,
};

export const ASMA: Evidencia = {
  tipo: 'estudio',
  fuente: 'The New England Journal of Medicine',
  detalle: 'Rosenstreich et al. · 476 niños con asma · 1997',
  dato: 'Los niños alérgicos a la cucaracha y expuestos en su habitación tuvieron **0,37 hospitalizaciones al año frente a 0,11** —más de tres veces— y más urgencias, noches sin dormir y días sin colegio.',
  cita: 'N. Engl. J. Med. 336(19):1356–1363. doi:10.1056/NEJM199705083361904',
  url: 'https://pubmed.ncbi.nlm.nih.gov/9134876/',
  anio: 1997,
};

export const NORMA: Evidencia = {
  tipo: 'norma',
  fuente: 'Resolución 2674 de 2013',
  detalle: 'Ministerio de Salud y Protección Social · Colombia',
  dato: 'Todo establecimiento que prepare o venda alimentos debe tener **control de plagas**; la presencia de plagas es **hallazgo crítico** en la inspección sanitaria.',
  cita: 'Requisitos sanitarios para establecimientos de alimentos',
  url: 'https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-2674-de-2013.pdf',
  anio: 2013,
};

export const CIERRES: Evidencia = {
  tipo: 'noticia',
  fuente: 'Infobae',
  detalle: 'Colombia · 20 de marzo de 2026',
  dato: 'La Secretaría de Salud de Ibagué **cerró locales de alimentos por hallazgo de cucarachas** antes de Semana Santa. En 2025, **más de 15 restaurantes** de la ciudad fueron cerrados por plagas.',
  cita: '"Secretaría de Salud de Ibagué clausuró locales de venta de pescado por hallazgo de cucarachas"',
  url: 'https://www.infobae.com/colombia/2026/03/20/secretaria-de-salud-de-ibague-clausuro-locales-de-venta-de-pescado-por-hallazgo-de-cucarachas-antes-de-semana-santa/',
  anio: 2026,
};

export const EVIDENCIA: Record<Segmento, Evidencia[]> = {
  hogar: [IMIDACLOPRID, CASCADA, ASMA, AEROSOL],
  restaurantes: [NORMA, CIERRES, IMIDACLOPRID, CASCADA, AEROSOL],
};
