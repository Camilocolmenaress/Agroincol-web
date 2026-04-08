# Tracking Reimplementación — AGROINCOL

**Fecha:** 2026-04-08
**Estado:** Aprobado
**Autor:** Brainstorming session con Claude

## Problema

Partytown fue implementado para correr GTM en un web worker y mejorar PageSpeed (69 → 89). Sin embargo:

1. Partytown no está soportado en Next.js App Router (documentación oficial Next.js)
2. GTM Tag Assistant es fundamentalmente incompatible con Partytown — GTM en worker no es visible desde el main thread
3. Google Ads Conversion Linker tiene fallos silenciosos conocidos en contexto de web worker (Issue #360 QwikDev/partytown, "The Silent Assassin" post-mortem)
4. Nunca se verificó que las conversiones AW-17263214967 llegaran correctamente

## Decisión

Remover Partytown completamente. Adoptar `@next/third-parties` — paquete oficial co-desarrollado por Google Chrome Aurora y Vercel para exactamente este stack (Next.js App Router + GTM).

**Trade-off aceptado:** Leve regresión en PageSpeed mobile (~89 → ~78-84). Tracking correcto tiene mayor prioridad que TBT.

## Arquitectura resultante

```
Browser carga página
  → Next.js hidrata
  → @next/third-parties inyecta GTM script (afterInteractive)
  → GTM corre en main thread
  → Tag Assistant lo detecta ✓
  → GTM dispara: GA4 (G-M0V6SN0Z6V), Google Ads (AW-17263214967),
    Microsoft Clarity, Meta Pixel ✓
  → WhatsAppClickTracker escucha clics → dataLayer.push → GTM procesa ✓
```

## Cambios

### Instalar
- `@next/third-parties`

### Desinstalar
- `@builder.io/partytown`

### Modificar
- `app/layout.tsx` — usar `<GoogleTagManager gtmId="GTM-NLH5NQRR" />`, remover imports de Partytown/custom GTM/GA4
- `types/partytown.d.ts` → `types/globals.d.ts` — solo conservar `Window.dataLayer`

### Eliminar
- `components/analytics/GoogleTagManager.tsx`
- `components/analytics/GoogleAnalytics.tsx` (causaba double tracking en GA4)
- `app/api/partytown-proxy/route.ts`
- `public/~partytown/` (4 archivos + debug/)

### Mantener
- `components/analytics/WhatsAppClickTracker.tsx` — sin cambios
- Todo el resto del sitio

## WhatsApp Click Tracking

`WhatsAppClickTracker` usa event delegation con `capture: true` para detectar clics en `wa.me` / `api.whatsapp.com` y hace `window.dataLayer.push({ event: 'whatsapp_click', click_url, click_text })`. Con GTM en main thread, este evento llega directamente a GTM sin proxy.

**Requiere en GTM:** Custom Event trigger (`whatsapp_click`) → GA4 Event tag.

## Verificación post-deploy

1. GTM Tag Assistant → conectar a agroincol.com → debe ver GTM-NLH5NQRR
2. GA4 Realtime → debe recibir page_view sin duplicados
3. Google Ads → Tag Assistant debe mostrar AW-17263214967 activo
4. WhatsApp click → `window.dataLayer` en consola tras clic debe contener `{event: 'whatsapp_click', ...}`
