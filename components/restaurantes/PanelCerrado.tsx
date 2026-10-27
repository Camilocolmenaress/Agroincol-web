// Sin 'use client': lo usan la página (servidor) y el formulario (navegador).

// Espacios duros: en el celular "a. m." no debe partirse en dos renglones.
export const HORARIO_TEXTO = 'Atendemos de lunes a viernes, 8:00\u00a0a.\u00a0m.-12:00\u00a0m. y 2:00-6:00\u00a0p.\u00a0m.';

/** Lo que se ve en lugar del formulario fuera del horario del equipo. */
export function PanelCerrado({ vuelve }: { vuelve: string }) {
  return (
    <div className="px-6 py-10 text-center sm:px-10">
      <p className="font-heading text-[1.75rem] font-bold leading-tight text-brand-green-dark">Volvemos {vuelve}</p>
      <p className="mx-auto mt-3 max-w-sm text-body text-brand-black/70">
        {HORARIO_TEXTO} Recibimos solicitudes solo cuando hay alguien para atenderlo en 5 minutos.
      </p>
    </div>
  );
}
