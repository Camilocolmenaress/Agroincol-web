import { test } from 'node:test';
import assert from 'node:assert/strict';
import { celularNormalizado, construirEvento, eventIdDe, origenDeUrl } from './eventos';
import { sha256 } from '@/lib/meta/hash';

const LEAD = '7f3c2a10-1111-4222-8333-944455556666';

test('el Lead comparte el lead_id con el Pixel; Schedule y Purchase tienen el suyo', () => {
  assert.equal(eventIdDe('Lead', LEAD), LEAD);
  assert.equal(eventIdDe('Schedule', LEAD), `schedule-${LEAD}`);
  assert.equal(eventIdDe('Purchase', LEAD), `purchase-${LEAD}`);
});

test('celular colombiano de 10 dígitos que empieza por 3', () => {
  assert.equal(celularNormalizado('310 789 1948'), '3107891948');
  assert.equal(celularNormalizado('+57 310 789 1948'), '3107891948');
  assert.equal(celularNormalizado('6076341234'), null); // fijo
  assert.equal(celularNormalizado('31078919'), null);
  assert.equal(celularNormalizado(undefined), null);
});

test('UTM y fbclid salen de la URL sin tocarse', () => {
  const o = origenDeUrl('https://agroincol.com/lp/restaurantes?utm_source=fb&utm_campaign=rest&utm_content=ad1&fbclid=AbC_12');
  assert.deepEqual(o, { utm_source: 'fb', utm_campaign: 'rest', utm_content: 'ad1', fbclid: 'AbC_12' });
  assert.deepEqual(origenDeUrl('basura'), { utm_source: '', utm_campaign: '', utm_content: '', fbclid: '' });
});

test('Lead con autorización: datos hasheados con 57, país y ciudad, sin valor', async () => {
  const e = await construirEvento(
    {
      evento: 'Lead',
      leadId: LEAD,
      autoriza: true,
      nombre: 'Andrés Carvajal',
      celular: '3107891948',
      municipio: 'Girón',
      externalId: 'visitante-1',
      fbp: 'fb.1.1.2',
      ip: '181.1.1.1',
      navegador: 'UA',
      url: 'https://agroincol.com/lp/restaurantes',
    },
    1_793_000_000_000
  );
  const u = e.user_data as Record<string, string>;
  assert.equal(e.event_id, LEAD);
  assert.equal(e.action_source, 'website');
  assert.equal(e.event_time, 1_793_000_000);
  assert.equal(u.ph, await sha256('573107891948'));
  assert.equal(u.fn, await sha256('andres'));
  assert.equal(u.ct, await sha256('giron'));
  assert.equal(u.country, await sha256('co'));
  assert.equal(u.external_id, await sha256('visitante-1'));
  assert.deepEqual(e.custom_data, { content_category: 'restaurantes' });
  // Nada en texto plano.
  assert.ok(!JSON.stringify(e).includes('3107891948"'));
  assert.ok(!JSON.stringify(e).includes('Andrés'));
});

test('sin autorización no sale ningún dato personal, solo las señales técnicas', async () => {
  const e = await construirEvento({ evento: 'Lead', leadId: LEAD, autoriza: false, nombre: 'Ana', celular: '3001234567', fbp: 'fb.1.1.2' });
  const u = e.user_data as Record<string, string>;
  assert.equal(u.ph, undefined);
  assert.equal(u.fn, undefined);
  assert.equal(u.fbp, 'fb.1.1.2');
  // Sin id de dispositivo se usa el lead_id.
  assert.equal(u.external_id, await sha256(LEAD));
});

test('Purchase lleva el valor del contrato en COP', async () => {
  const e = await construirEvento({ evento: 'Purchase', leadId: LEAD, autoriza: true, valor: 1_800_000 });
  assert.deepEqual(e.custom_data, { content_category: 'restaurantes', value: 1_800_000, currency: 'COP' });
  assert.equal(e.event_id, `purchase-${LEAD}`);
});
