# AGROINCOL — Sitio Web

Sitio web de AGROINCOL, empresa de fumigación y control de plagas en Bucaramanga, Santander, Colombia.

## Stack Tecnológico

- **Framework:** Next.js 14+ con App Router
- **Lenguaje:** TypeScript (strict mode)
- **Estilos:** Tailwind CSS 3.4+
- **Fuentes:** Archivos .ttf locales (League Spartan + Nunito)
- **Iconos:** Lucide React
- **Deploy:** Vercel

## Instalación

```bash
npm install
cp .env.example .env.local
```

## Desarrollo

```bash
npm run dev
```

El sitio estará disponible en `http://localhost:3000`.

## Build de producción

```bash
npm run build
npm start
```

## Estructura de Carpetas

```
agroincol-web/
├── app/                    # App Router (páginas y API routes)
│   ├── page.tsx            # Home
│   ├── servicios/          # Páginas de servicios
│   ├── certificaciones-y-normativa/
│   └── api/contact/        # Endpoint del formulario
├── components/             # Componentes React
│   ├── layout/             # Navbar, Footer
│   ├── ui/                 # Button, Badge, WhatsApp, etc.
│   ├── sections/           # Secciones de página
│   ├── forms/              # Formularios
│   └── seo/                # Schema markup
├── lib/                    # Constantes y tipos
└── public/                 # Assets estáticos
    ├── fonts/              # Archivos .ttf
    └── images/             # Fotos e imágenes
```

## Agregar Fuentes

Copiar los archivos `.ttf` a `/public/fonts/`:

- `LeagueSpartan-Bold.ttf`
- `LeagueSpartan-SemiBold.ttf`
- `LeagueSpartan-Medium.ttf`
- `Nunito-Regular.ttf`
- `Nunito-Bold.ttf`
- `Nunito-SemiBold.ttf`
- `Nunito-Light.ttf`

## Agregar Imágenes

Agregar fotos a las subcarpetas correspondientes en `/public/images/`:

- `hero/` — Fotos para heroes de cada página
- `servicios/` — Fotos de servicios
- `equipo/` — Fotos del equipo trabajando
- `certificaciones/` — Fotos de certificados
- `logos/` — Logo AGROINCOL y variantes

## Conectar Formulario

Agregar la URL del webhook de n8n en `WEBHOOK_URL` en `.env.local`:

```
WEBHOOK_URL=https://tu-instancia-n8n.com/webhook/xxx
```

## Deploy en Vercel

1. Conectar el repositorio en [vercel.com](https://vercel.com)
2. Configurar las variables de entorno (`WEBHOOK_URL`, `NEXT_PUBLIC_SITE_URL`)
3. Deploy automático con cada push a `main`
