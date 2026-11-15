import { notFound } from 'next/navigation';

// Cualquier URL que no exista cae aquí y muestra la 404 del sitio (app/(sitio)/not-found.tsx),
// con su cabecera y su pie. Con dos layouts raíz, Next no tiene una 404 global propia.
export default function Resto() {
  notFound();
}
