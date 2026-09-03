/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      opacity: Object.fromEntries(Array.from({ length: 101 }, (_, i) => [i, `${i / 100}`])),
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 6px)',
        sm: 'calc(var(--radius) - 10px)'
      },
      colors: {
        background: 'rgb(var(--background))',
        foreground: 'rgb(var(--foreground))',
        forest: {
          DEFAULT: 'rgb(27 67 50)',
          deep: 'rgb(20 53 39)',
          light: 'rgb(43 92 69)'
        },
        petal: {
          DEFAULT: 'rgb(255 209 102)',
          soft: 'rgb(255 224 153)'
        },
        terracotta: {
          DEFAULT: 'rgb(226 149 120)',
          soft: 'rgb(240 196 178)'
        },
        mist: 'rgb(248 249 241)',
        card: {
          DEFAULT: 'rgb(var(--card))',
          foreground: 'rgb(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'rgb(var(--popover))',
          foreground: 'rgb(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'rgb(var(--primary))',
          foreground: 'rgb(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary))',
          foreground: 'rgb(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'rgb(var(--muted))',
          foreground: 'rgb(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'rgb(var(--accent))',
          foreground: 'rgb(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'rgb(var(--destructive))',
          foreground: 'rgb(var(--destructive-foreground))'
        },
        border: 'rgb(var(--border))',
        input: 'rgb(var(--input))',
        ring: 'rgb(var(--ring))'
      },
      fontFamily: {
        heading: ['var(--font-heading)'],
        body: ['var(--font-body)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)']
      },
      fontSize: {
        'hero': ['clamp(3rem, 8vw, 6rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.08', letterSpacing: '-0.015em' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}
