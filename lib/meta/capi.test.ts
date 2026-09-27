import { test } from 'node:test';
import assert from 'node:assert/strict';
import { capiConfigurada, enviarEventoAMeta } from './capi';

const VARS = ['NEXT_PUBLIC_META_PIXEL_ID', 'META_CAPI_TOKEN', 'NEXT_PUBLIC_META_PIXEL_ID_ECOGEL', 'META_CAPI_TOKEN_ECOGEL', 'META_TEST_EVENT_CODE'] as const;

function conEntorno(valores: Partial<Record<(typeof VARS)[number], string>>, fn: () => void | Promise<void>) {
  const previo = Object.fromEntries(VARS.map((v) => [v, process.env[v]]));
  for (const v of VARS) {
    if (valores[v] === undefined) delete process.env[v];
    else process.env[v] = valores[v];
  }
  const restaurar = () => {
    for (const v of VARS) {
      if (previo[v] === undefined) delete process.env[v];
      else process.env[v] = previo[v] as string;
    }
  };
  try {
    const r = fn();
    if (r instanceof Promise) return r.finally(restaurar);
    restaurar();
    return r;
  } catch (e) {
    restaurar();
    throw e;
  }
}

test('capiConfigurada evalúa cada cuenta por separado', () =>
  conEntorno({ NEXT_PUBLIC_META_PIXEL_ID: '111', META_CAPI_TOKEN: 'tok-servicios' }, () => {
    assert.equal(capiConfigurada('servicios'), true);
    assert.equal(capiConfigurada(), true);
    // Sin sus propias credenciales, EcoGel queda apagado: no usa las de servicios.
    assert.equal(capiConfigurada('ecogel'), false);
  }));

test('enviarEventoAMeta usa el pixel y el token de la cuenta pedida', () =>
  conEntorno(
    {
      NEXT_PUBLIC_META_PIXEL_ID: '111',
      META_CAPI_TOKEN: 'tok-servicios',
      NEXT_PUBLIC_META_PIXEL_ID_ECOGEL: '222',
      META_CAPI_TOKEN_ECOGEL: 'tok-ecogel',
    },
    async () => {
      const urls: string[] = [];
      const fetchFalso = (async (entrada: RequestInfo | URL) => {
        urls.push(String(entrada));
        return new Response('{}', { status: 200 });
      }) as typeof fetch;

      const a = await enviarEventoAMeta({ event_name: 'Purchase' }, 'ecogel', fetchFalso);
      const b = await enviarEventoAMeta({ event_name: 'Lead' }, 'servicios', fetchFalso);
      const c = await enviarEventoAMeta({ event_name: 'Lead' }, undefined, fetchFalso);

      assert.deepEqual([a.ok, b.ok, c.ok], [true, true, true]);
      assert.match(urls[0], /\/222\/events\?access_token=tok-ecogel$/);
      assert.match(urls[1], /\/111\/events\?access_token=tok-servicios$/);
      assert.match(urls[2], /\/111\/events\?access_token=tok-servicios$/);
    },
  ));

test('sin credenciales de la cuenta, no se llama a Meta', () =>
  conEntorno({ NEXT_PUBLIC_META_PIXEL_ID: '111', META_CAPI_TOKEN: 'tok-servicios' }, async () => {
    let llamadas = 0;
    const fetchFalso = (async () => {
      llamadas++;
      return new Response('{}');
    }) as typeof fetch;
    const r = await enviarEventoAMeta({ event_name: 'Purchase' }, 'ecogel', fetchFalso);
    assert.deepEqual(r, { ok: false, motivo: 'sin-configurar' });
    assert.equal(llamadas, 0);
  }));

// 27-sep-2026: pruebas en localhost mandaron 11 Purchase falsos al pixel real.
test('enviarEventoAMeta no manda eventos generados fuera de agroincol.com', () =>
  conEntorno({ NEXT_PUBLIC_META_PIXEL_ID_ECOGEL: '222', META_CAPI_TOKEN_ECOGEL: 'tok-ecogel' }, async () => {
    let llamadas = 0;
    const fetchFalso = (async () => {
      llamadas++;
      return new Response('{}', { status: 200 });
    }) as typeof fetch;

    const local = await enviarEventoAMeta({ event_name: 'Purchase', event_source_url: 'http://localhost:3000/ecogel/pedido' }, 'ecogel', fetchFalso);
    const preview = await enviarEventoAMeta({ event_name: 'Purchase', event_source_url: 'https://x-camilos.vercel.app/ecogel/pedido' }, 'ecogel', fetchFalso);
    assert.deepEqual([local, preview], [{ ok: false, motivo: 'fuera-de-produccion' }, { ok: false, motivo: 'fuera-de-produccion' }]);
    assert.equal(llamadas, 0);

    const real = await enviarEventoAMeta({ event_name: 'Purchase', event_source_url: 'https://agroincol.com/ecogel/pedido' }, 'ecogel', fetchFalso);
    // Sin URL (p. ej. el cierre de servicios sin url en la hoja) se sigue mandando como hasta ahora.
    const sinUrl = await enviarEventoAMeta({ event_name: 'Purchase' }, 'ecogel', fetchFalso);
    assert.deepEqual([real.ok, sinUrl.ok], [true, true]);
    assert.equal(llamadas, 2);
  }));
