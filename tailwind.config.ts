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
        brand: {
          green: '#174634',
          'green-dark': '#0D2B20',
          orange: '#F46931',
          'orange-dark': '#D4551F',
          white: '#FFFFFF',
          light: '#F5F5F0',
          gray: '#6B7280',
          'gray-light': '#E5E5E5',
          black: '#1A1A1A',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      fontSize: {
        'hero': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'hero-mobile': ['2.25rem', { lineHeight: '1.15', fontWeight: '700' }],
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
