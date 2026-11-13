import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Los colores son variables CSS (app/globals.css): las landings (/lp, /ecogel, /tienda)
        // conservan los valores v1 exactos y el sitio toma los del manual v2 vía [data-marca="v2"]
        // (components/layout/SiteChrome.tsx). Así las landings no cambian ni un píxel.
        brand: {
          green: 'rgb(var(--brand-green) / <alpha-value>)',
          'green-dark': 'rgb(var(--brand-green-dark) / <alpha-value>)',
          'green-mid': 'rgb(var(--brand-green-mid) / <alpha-value>)',
          'green-light': 'rgb(var(--brand-green-light) / <alpha-value>)',
          orange: 'rgb(var(--brand-orange) / <alpha-value>)',
          'orange-dark': 'rgb(var(--brand-orange-dark) / <alpha-value>)',
          'orange-light': 'rgb(var(--brand-orange-light) / <alpha-value>)',
          amber: 'rgb(var(--brand-amber) / <alpha-value>)',
          white: 'rgb(var(--brand-white) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
          cream: 'rgb(var(--brand-cream) / <alpha-value>)',
          mint: 'rgb(var(--brand-mint) / <alpha-value>)',
          gray: 'rgb(var(--brand-gray) / <alpha-value>)',
          'gray-light': 'rgb(var(--brand-gray-light) / <alpha-value>)',
          black: 'rgb(var(--brand-black) / <alpha-value>)',
        },
        // Paleta del manual de marca v2 con sus nombres, para los componentes nuevos del rediseño.
        marca: {
          verde: '#164A38', // Verde Con Sello
          naranja: '#F5682E', // Naranja De Una · máximo 10 % de cada pantalla
          menta: '#E1EBE3', // Menta En Paz
          letra: '#143C2C', // Verde Letra Clara
          blanco: '#FFFFFF',
        },
      },
      boxShadow: {
        soft: '0 1px 2px rgba(13,43,32,0.04), 0 4px 16px -4px rgba(13,43,32,0.08)',
        card: '0 2px 6px rgba(13,43,32,0.05), 0 8px 24px -12px rgba(13,43,32,0.12)',
        'card-hover': '0 18px 44px -16px rgba(13,43,32,0.28)',
        premium: '0 28px 70px -24px rgba(13,43,32,0.38)',
        brand: '0 10px 28px -8px rgba(244,105,49,0.45)',
        'brand-lg': '0 16px 40px -10px rgba(244,105,49,0.5)',
      },
      backgroundImage: {
        'hero-radial':
          'radial-gradient(120% 120% at 80% 0%, rgb(var(--brand-green-mid)) 0%, rgb(var(--brand-green)) 45%, rgb(var(--brand-green-dark)) 100%)',
        'green-gradient': 'linear-gradient(135deg, rgb(var(--brand-green-mid)) 0%, rgb(var(--brand-green-dark)) 100%)',
        'orange-gradient': 'linear-gradient(135deg, rgb(var(--brand-orange-light)) 0%, rgb(var(--brand-orange)) 55%, rgb(var(--brand-orange-dark)) 100%)',
        'orange-soft': 'linear-gradient(135deg, rgb(var(--brand-orange) / 0.14), rgb(var(--brand-orange) / 0.05))',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        // League Spartan 800 del manual: solo H1 y titulares gigantes. Es la única fuente precargada del sitio v2.
        display: ['var(--font-display)', 'var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        // Caveat Brush del manual de marca: lemas y humor, una vez por pieza. Solo la carga /tienda.
        lema: ['var(--font-lema)', 'cursive'],
      },
      fontSize: {
        'hero': ['4.25rem', { lineHeight: '1.04', letterSpacing: '-0.02em', fontWeight: '700' }],
        'hero-mobile': ['2.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'h1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h1-mobile': ['1.875rem', { lineHeight: '1.25', fontWeight: '700' }],
        'h2': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h2-mobile': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.25rem', { lineHeight: '1.4', fontWeight: '500' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.7' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6' }],
      },
      spacing: {
        'section': '5rem',
        'section-mobile': '3rem',
      },
      maxWidth: {
        'content': '1200px',
      },
    },
  },
  plugins: [],
}
export default config
