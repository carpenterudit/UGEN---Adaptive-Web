/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core Tri-Color Brand Palette
        'ice-silver': {
          DEFAULT: '#DDE3E8',
          50: '#F7F9FA',
          100: '#EFF2F5',
          200: '#DDE3E8',
          300: '#B8C4CD',
          400: '#94A4B1',
          500: '#6E8394',
        },
        'deep-aubergine': {
          DEFAULT: '#3A0F34',
          50: '#FBF4FA',
          100: '#F4E3F2',
          200: '#E5C0E1',
          300: '#C98CC3',
          400: '#8A2B7E',
          500: '#5C1853',
          600: '#3A0F34', // Core
          700: '#2C0A27',
          800: '#20071C',
          900: '#150413',
        },
        marigold: {
          DEFAULT: '#EAAA00',
          50: '#FFFDF5',
          100: '#FEF8E3',
          200: '#FDEFBA',
          300: '#FCE38B',
          400: '#F4CA3E',
          500: '#EAAA00', // Core
          600: '#C99100',
          700: '#A37500',
          800: '#7E5A00',
          900: '#5A4000',
        },

        // Supporting Neutrals
        brand: {
          bg: '#100D12',
          surface: '#19141C',
          'surface-elevated': '#241B28',
          'surface-hover': '#2D2333',
          'text-primary': '#F4F0F5',
          'text-secondary': '#BDB3C1',
          'text-muted': '#8E8293',
          border: 'rgba(221, 227, 232, 0.14)',
          'border-active': 'rgba(234, 170, 0, 0.4)',
        },

        // Backward compatibility mappings
        'jet-black': '#100D12',
        surface: {
          base: '#100D12',
          panel: '#19141C',
          card: '#241B28',
          hover: '#2D2333',
          input: '#151119',
          subtle: '#1F1823',
        },
        cerulean: {
          DEFAULT: '#3A0F34',
          400: '#B8C4CD',
          300: '#DDE3E8',
        },
        'neon-rose': {
          DEFAULT: '#EAAA00',
          400: '#F4CA3E',
        },
        border: {
          charcoal: 'rgba(221, 227, 232, 0.14)',
          'charcoal-subtle': 'rgba(221, 227, 232, 0.08)',
          'charcoal-active': 'rgba(234, 170, 0, 0.3)',
        }
      },
      boxShadow: {
        'glow-marigold': '0 0 30px -5px rgba(234, 170, 0, 0.35)',
        'glow-aubergine': '0 0 50px 10px rgba(58, 15, 52, 0.45)',
        'glow-silver': '0 0 25px -5px rgba(221, 227, 232, 0.25)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'subtle-panel': '0 4px 24px -2px rgba(16, 13, 18, 0.7)',
      }
    },
  },
  plugins: [],
}
