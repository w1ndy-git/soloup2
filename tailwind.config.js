/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 8px)',
        sm: 'calc(var(--radius) - 14px)',
      },
      colors: {
        /* SoloUp brand — values from the organisation's own stylesheet */
        carbon: 'rgb(var(--carbon) / <alpha-value>)',
        carbonsoft: 'rgb(var(--carbonsoft) / <alpha-value>)',
        navy: 'rgb(var(--navy) / <alpha-value>)',
        deepsea: 'rgb(var(--deepsea) / <alpha-value>)',
        ocean: 'rgb(var(--ocean) / <alpha-value>)',
        sky: 'rgb(var(--sky) / <alpha-value>)',
        leaf: 'rgb(var(--leaf) / <alpha-value>)',
        leafbright: 'rgb(var(--leafbright) / <alpha-value>)',
        lime: 'rgb(var(--lime) / <alpha-value>)',
        palegreen: 'rgb(var(--palegreen) / <alpha-value>)',
        gold: 'rgb(var(--gold) / <alpha-value>)',
        cream: 'rgb(var(--cream) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        stone: 'rgb(var(--stone) / <alpha-value>)',

        /* shadcn/ui primitives */
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        alt: ['var(--font-alt)'],
        mono: ['var(--font-mono)'],
      },
      boxShadow: {
        brand: '0 16px 40px rgb(21 50 74 / 0.12)',
        'brand-lg': '0 28px 70px rgb(21 50 74 / 0.18)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'fade-up': { from: { opacity: '0', transform: 'translateY(14px)' }, to: { opacity: '1', transform: 'none' } },
        sprout: { '0%': { transform: 'scaleY(0.6)', opacity: '0' }, '100%': { transform: 'none', opacity: '1' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        sprout: 'sprout 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
