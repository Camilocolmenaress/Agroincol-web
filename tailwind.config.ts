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
          'green-mid': '#1F5C44',
          'green-light': '#2E7D5B',
          orange: '#F46931',
          'orange-dark': '#D4551F',
          'orange-light': '#FB8A5C',
          amber: '#F59E0B',
          white: '#FFFFFF',
          light: '#F5F5F0',
          cream: '#FBFBF7',
          gray: '#6B7280',
          'gray-light': '#E5E5E5',
          black: '#1A1A1A',
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
          'radial-gradient(120% 120% at 80% 0%, #1F5C44 0%, #174634 45%, #0D2B20 100%)',
        'green-gradient': 'linear-gradient(135deg, #1F5C44 0%, #0D2B20 100%)',
        'orange-gradient': 'linear-gradient(135deg, #FB8A5C 0%, #F46931 55%, #D4551F 100%)',
        'orange-soft': 'linear-gradient(135deg, rgba(244,105,49,0.14), rgba(244,105,49,0.05))',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
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
