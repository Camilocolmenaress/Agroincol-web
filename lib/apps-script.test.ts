import { test } from 'node:test';
import assert from 'node:assert/strict';
import { enviarAAppsScript } from './apps-script';

const EXEC = 'https://script.google.com/macros/s/X/exec';
const ECO = 'https://script.googleusercontent.com/macros/echo?user_content_key=k';

/** fetch falso: el POST responde 302 hacia ECO; el GET a ECO responde `texto` (o falla). */
function falso(eco: string | Error, opciones: { statusPost?: number } = {}) {
  const llamadas: { url: string; metodo: string; redirect?: string }[] = [];
  const f = (async (url: string, init: RequestInit = {}) => {
    llamadas.push({ url, metodo: init.method ?? 'GET', redirect: init.redirect });
    if (url === EXEC) {
      const status = opciones.statusPost ?? 302;
      return new Response(null, { status, headers: status === 302 ? { location: ECO } : {} });
    }
    if (eco instanceof Error) throw eco;
    return new Response(eco, { status: 200 });
  }) as typeof fetch;
  return { f, llamadas };
}

test('"ok" detrás del 302: confirmado, y la redirección se lee con GET', async () => {
  const { f, llamadas } = falso('ok');
  assert.deepEqual(await enviarAAppsScript(EXEC, { a: 1 }, f), { confirmado: true });
  assert.equal(llamadas[0].metodo, 'POST');
  assert.equal(llamadas[0].redirect, 'manual');
  assert.deepEqual(llamadas[1], { url: ECO, metodo: 'GET', redirect: undefined });
});

test('"no" (secreto distinto) es un fallo: la fila NO se escribió', async () => {
  const { f } = falso('no');
  await assert.rejects(enviarAAppsScript(EXEC, {}, f), /la hoja respondió: no/);
});

test('"error: …" (excepción del script) es un fallo', async () => {
  const { f } = falso("error: Cannot read properties of null (reading 'appendRow')");
  await assert.rejects(enviarAAppsScript(EXEC, {}, f), /la hoja respondió: error: Cannot read/);
});

test('una página HTML (implementación borrada o sin permisos) es un fallo', async () => {
  const { f } = falso('<!DOCTYPE html><html><title>Error</title></html>');
  await assert.rejects(enviarAAppsScript(EXEC, {}, f), /la hoja respondió: <!DOCTYPE html>/);
});

test('si leer la respuesta falla, doPost ya corrió: se da por guardado SIN confirmar (no se reintenta ni se duplica)', async () => {
  const { f } = falso(new Error('The operation was aborted due to timeout'));
  assert.deepEqual(await enviarAAppsScript(EXEC, {}, f), { confirmado: false });
});

test('un 200 directo se lee sin redirección', async () => {
  const f = (async () => new Response('ok', { status: 200 })) as unknown as typeof fetch;
  assert.deepEqual(await enviarAAppsScript(EXEC, {}, f), { confirmado: true });
});

test('un status distinto de 200/302 es un fallo, como antes', async () => {
  const { f } = falso('ok', { statusPost: 500 });
  await assert.rejects(enviarAAppsScript(EXEC, {}, f), /la hoja respondió 500/);
});
