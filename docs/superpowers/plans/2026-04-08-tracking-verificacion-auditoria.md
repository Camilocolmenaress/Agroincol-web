# Tracking Verificación y Auditoría — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Verificar que el commit 1e57db0 (reemplazo de Partytown por @next/third-parties) está correcto, no tiene referencias rotas, y cumple el spec aprobado.

**Architecture:** Auditoría estática del código fuente local — búsquedas de patrones, lectura de archivos clave, y revisión de consistencia contra el spec. No requiere acceso a producción en vivo.

**Tech Stack:** Next.js 14 App Router, @next/third-parties/google, TypeScript, ripgrep/grep para búsquedas.

---

### Task 1: Verificar que no quedan referencias a Partytown

**Files:**
- Read: todo el repo (búsqueda grep)

- [ ] **Step 1: Buscar imports de Partytown en todo el código fuente**

```bash
grep -r "partytown" /Users/camilocolmenares/Desktop/AGROINCOL\ NUEVO/agroincol-web \
  --include="*.tsx" --include="*.ts" --include="*.js" --include="*.json" \
  --exclude-dir=node_modules --exclude-dir=.git -l
```

Expected: cero resultados. Si aparece algún archivo, es un residuo que debe eliminarse.

- [ ] **Step 2: Verificar que public/~partytown fue eliminado**

```bash
ls "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/public/" | grep partytown
```

Expected: sin output (directorio eliminado).

- [ ] **Step 3: Verificar que los archivos custom de analytics fueron eliminados**

```bash
ls "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/components/analytics/"
```

Expected: solo `WhatsAppClickTracker.tsx`. No debe aparecer `GoogleTagManager.tsx` ni `GoogleAnalytics.tsx`.

- [ ] **Step 4: Verificar que la API route del proxy fue eliminada**

```bash
ls "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/app/api/"
```

Expected: solo `contact/`. No debe aparecer `partytown-proxy/`.

- [ ] **Step 5: Verificar que types/partytown.d.ts fue eliminado y globals.d.ts existe**

```bash
ls "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/types/"
```

Expected: solo `globals.d.ts`. No debe aparecer `partytown.d.ts`.

---

### Task 2: Auditar app/layout.tsx

**Files:**
- Read: `app/layout.tsx`

- [ ] **Step 1: Leer layout.tsx completo y verificar estructura**

Leer el archivo y confirmar que:

1. Import de `@next/third-parties/google` → `GoogleTagManager` presente
2. NO hay import de `@builder.io/partytown`
3. NO hay import de `GoogleTagManager` custom
4. NO hay import de `GoogleAnalytics`
5. Import de `WhatsAppClickTracker` presente
6. El `<body>` no tiene ningún `<script>` inline
7. `<GoogleTagManager gtmId="GTM-NLH5NQRR" />` aparece dentro del `<html>` pero fuera del `<body>`
8. `<WhatsAppClickTracker />` está dentro del `<body>`
9. `<Analytics />` y `<SpeedInsights />` están dentro del `<body>`
10. El `<head>` está vacío (no hay componentes de head custom de analytics)

- [ ] **Step 2: Verificar que no hay doble tracking de GA4**

```bash
grep -r "G-M0V6SN0Z6V" \
  "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web" \
  --include="*.tsx" --include="*.ts" --exclude-dir=node_modules -l
```

Expected: cero resultados. El GA4 ID solo debe vivir dentro de GTM, no en el código fuente.

---

### Task 3: Auditar WhatsAppClickTracker.tsx

**Files:**
- Read: `components/analytics/WhatsAppClickTracker.tsx`

- [ ] **Step 1: Leer el archivo y verificar correctitud**

Confirmar que:

1. Tiene `'use client'` al inicio
2. Usa `useEffect` con cleanup (`return () => document.removeEventListener(...)`)
3. El listener usa `{ capture: true }` — necesario para que se ejecute antes de que el enlace abra nueva pestaña
4. Detecta `wa.me` y `api.whatsapp.com` en el href
5. Usa `closest('a')` para manejar clics en elementos hijos (svg, span dentro del enlace)
6. El `dataLayer.push` tiene exactamente: `event`, `click_url`, `click_text`
7. No tiene referencias a Partytown ni a `window.gtag`

- [ ] **Step 2: Verificar que WhatsAppButton usa un enlace con wa.me**

```bash
grep -r "wa.me\|whatsapp" \
  "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/components" \
  --include="*.tsx" -n
```

Expected: debe aparecer `WhatsAppButton.tsx` con un href que contenga `wa.me`. El tracker cubre ese enlace automáticamente por event delegation.

---

### Task 4: Verificar types/globals.d.ts

**Files:**
- Read: `types/globals.d.ts`

- [ ] **Step 1: Leer el archivo**

Confirmar que:

1. Declara `interface Window { dataLayer: Record<string, unknown>[]; }`
2. Tiene `export {}` para que TypeScript lo trate como módulo
3. No tiene ninguna referencia al módulo `@builder.io/partytown`

- [ ] **Step 2: Verificar que el build de TypeScript acepta el tipo sin errores**

```bash
cd "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web" && npm run build 2>&1 | head -20
```

Expected: `✓ Compiled successfully` y `Linting and checking validity of types ...` sin errores.

---

### Task 5: Code Review contra el spec

**Files:**
- Read: `docs/superpowers/specs/2026-04-08-tracking-reimplementacion-design.md`

- [ ] **Step 1: Verificar cobertura del spec — sección "Instalar"**

El spec dice instalar `@next/third-parties`. Verificar en package.json:

```bash
grep "next/third-parties" \
  "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/package.json"
```

Expected: aparece `@next/third-parties` con versión en `dependencies`.

- [ ] **Step 2: Verificar cobertura del spec — sección "Desinstalar"**

El spec dice desinstalar `@builder.io/partytown`. Verificar:

```bash
grep "partytown" \
  "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/package.json"
```

Expected: cero resultados (ni en dependencies ni devDependencies).

- [ ] **Step 3: Verificar cobertura del spec — sección "Mantener"**

El spec dice mantener `WhatsAppClickTracker.tsx` sin cambios. Verificar que el archivo existe:

```bash
ls "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/components/analytics/WhatsAppClickTracker.tsx"
```

Expected: archivo presente.

- [ ] **Step 4: Verificar cobertura del spec — arquitectura resultante**

El spec describe el flujo: `@next/third-parties inyecta GTM script (afterInteractive)`. Verificar que `@next/third-parties` usa efectivamente `afterInteractive`:

```bash
grep -r "afterInteractive\|strategy" \
  "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web/node_modules/@next/third-parties/dist" \
  --include="*.js" -l 2>/dev/null | head -3
```

Expected: archivos en el paquete confirman la estrategia. Si grep no encuentra nada, buscar en la documentación del paquete.

- [ ] **Step 5: Verificar que el build final pasa limpio**

```bash
cd "/Users/camilocolmenares/Desktop/AGROINCOL NUEVO/agroincol-web" && npm run build 2>&1 | tail -20
```

Expected:
- `✓ Generating static pages (23/23)`
- 23 rutas en el output (no 24 — la ruta `/api/partytown-proxy` fue eliminada)
- Cero errores TypeScript
- Cero warnings de compilación

- [ ] **Step 6: Confirmar resultado de auditoría**

Si todos los steps anteriores pasaron: la implementación cumple el spec. Reportar resultado con lista de verificaciones aprobadas.

Si algún step falló: reportar qué falló y proponer fix puntual.
