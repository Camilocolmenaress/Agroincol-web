// Formulario de cotización del prototipo (form[data-lead-form]) conectado al sistema de leads de
// siempre: /api/contact (hoja de Sheets, correo, conversiones) y el evento form_submission de GTM.
// Mismos nombres de campo que el formulario anterior: nombre, telefono, tipoServicio, website
// (honeypot) y aceptaTerminos. Mismo formId por página que antes, para no cortar la medición.
// La validación en vivo y el mensaje de éxito son los del prototipo (js/site.js).

const FORM_ID: Record<string, string> = {
  '/': 'home-contact',
  '/servicios/fumigacion-residencial': 'residencial-contact',
  '/servicios/fumigacion-restaurantes': 'restaurantes-contact',
  '/servicios/control-plagas-comercial': 'comercial-contact',
  '/servicios/desratizacion': 'desratizacion-contact',
  '/servicios/control-insectos-voladores': 'insectos-voladores-contact',
  '/servicios/fumigacion-industrial': 'industrial-contact',
  '/servicios/control-comejen-termitas': 'comejen-contact',
  '/servicios/eliminacion-abejas-avispas': 'abejas-contact',
  '/servicios/control-chinches': 'chinches-contact',
  '/empresas': 'empresas-contact',
  '/servicios/control-cucarachas': 'cucarachas-contact',
  '/zonas/fumigacion-bucaramanga': 'bucaramanga-contact',
  '/zonas/fumigacion-floridablanca': 'floridablanca-contact',
  '/zonas/fumigacion-piedecuesta': 'piedecuesta-contact',
  '/zonas/fumigacion-giron': 'giron-contact',
  '/precios': 'precios-contact',
  '/certificado-de-fumigacion': 'certificado-contact',
  '/certificaciones-y-normativa': 'normativa-contact',
};

export function formIdDe(ruta: string) {
  return FORM_ID[ruta] ?? `sitio-${ruta.replace(/\W+/g, '-').replace(/^-|-$/g, '') || 'inicio'}`;
}

type Registrar = (t: EventTarget, tipo: string, fn: EventListener, opts?: AddEventListenerOptions | boolean) => void;

export function conectarFormularios(on: Registrar, animarExito: (el: HTMLElement) => void) {
  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    const chk = form.querySelector<HTMLInputElement>('[name="aceptaTerminos"]');
    const chkErr = form.querySelector<HTMLElement>('.err-chk');
    const boton = form.querySelector<HTMLButtonElement>('button[type="submit"]');
    if (!chk || !chkErr) return;

    const check = (el: HTMLInputElement | HTMLSelectElement) => {
      let ok = true;
      const v = (el.value || '').trim();
      if (el.name === 'telefono') ok = v.replace(/\D/g, '').length >= 10;
      else if (el.required) ok = v.length > 1;
      el.closest('.fld')?.classList.toggle('is-error', !ok);
      return ok;
    };
    const campos = Array.from(form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('.fld input, .fld select'));
    campos.forEach((el) => {
      on(el, 'blur', () => {
        if (el.value) check(el);
      });
      on(el, 'input', () => {
        if (el.closest('.fld')?.classList.contains('is-error')) check(el);
      });
    });

    // Error de envío: mismo estilo que los errores del prototipo (.err), solo si la API falla.
    const errEnvio = document.createElement('em');
    errEnvio.className = 'err err-envio';
    errEnvio.setAttribute('role', 'alert');
    errEnvio.textContent = 'No pudimos enviar su solicitud. Escríbanos por WhatsApp al 310 789 1948.';
    boton?.insertAdjacentElement('beforebegin', errEnvio);

    on(form, 'submit', async (e) => {
      e.preventDefault();
      const datos = new FormData(form);
      const nombre = String(datos.get('nombre') || '').trim();
      // Honeypot: a un bot se le muestra éxito sin enviar nada (igual que el formulario anterior).
      const trampa = String(datos.get('website') || '');
      let ok = true;
      campos.forEach((el) => {
        if (!check(el)) ok = false;
      });
      if (!chk.checked) {
        ok = false;
        chkErr.classList.add('is-on');
      } else chkErr.classList.remove('is-on');
      if (!ok && !trampa) {
        const mal = form.querySelector<HTMLElement>('.is-error input, .is-error select') || chk;
        mal.focus();
        return;
      }
      errEnvio.classList.remove('is-on');
      const ruta = window.location.pathname;
      const formId = formIdDe(ruta);
      const servicio = String(datos.get('tipoServicio') || '');
      // /empresas: la empresa viaja a la hoja en el mismo campo (sin columna nueva). A GTM va solo la
      // opción elegida: el nombre lo escribe el visitante y no debe salir hacia la medición.
      const empresa = String(datos.get('empresa') || '').trim();
      const tipoServicio = empresa ? `Empresas · ${servicio} · ${empresa}` : servicio;
      if (!trampa) {
        if (boton) boton.disabled = true;
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              nombre,
              telefono: String(datos.get('telefono') || '').trim(),
              tipoServicio,
              website: trampa,
              aceptaTerminos: chk.checked,
              formId,
              page: ruta,
            }),
          });
          if (!res.ok) throw new Error(String(res.status));
          const w = window as Window & { dataLayer?: Record<string, unknown>[] };
          w.dataLayer?.push({ event: 'form_submission', form_id: formId, form_page: ruta, form_service: servicio });
        } catch {
          if (boton) boton.disabled = false;
          errEnvio.classList.add('is-on');
          return;
        }
      }
      const done = form.querySelector<HTMLElement>('.cot-ok');
      if (!done) return;
      const t = done.querySelector('.cot-ok-t');
      if (t) t.textContent = `Listo, ${nombre.split(' ')[0]}.`;
      done.hidden = false;
      animarExito(done);
    });
    on(chk, 'change', () => {
      if (chk.checked) chkErr.classList.remove('is-on');
    });
  });
}
