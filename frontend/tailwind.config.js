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
        'jet-black': '#0A0A0A',
        surface: {
          base: '#0A0A0A',
          panel: '#121212',
          card: '#181818',
          hover: '#222222',
          input: '#141414',
          subtle: '#1C1C1C',
        },
        cerulean: {
          DEFAULT: '#007BA7',
          50: '#EBF8FC',
          100: '#CEEEF8',
          200: '#9DDDF3',
          300: '#6CD2F0',
          400: '#1BB8E3',
          500: '#007BA7',
          600: '#00668B',
          700: '#00516E',
          800: '#003C52',
          900: '#002837',
        },
        'neon-rose': {
          DEFAULT: '#FF2D95',
          50: '#FFF0F7',
          100: '#FFD6EB',
          200: '#FFA8D6',
          300: '#FF80BF',
          400: '#FF52A7',
          500: '#FF2D95',
          600: '#E61980',
          700: '#BF0E68',
          800: '#990B53',
          900: '#7A0942',
        },
        border: {
          charcoal: '#242424',
          'charcoal-subtle': '#1F1F1F',
          'charcoal-active': '#333333',
        }
      },
      boxShadow: {
        'glow-rose': '0 0 25px -5px rgba(255, 45, 149, 0.35)',
        'glow-blue': '0 0 25px -5px rgba(0, 123, 167, 0.35)',
        'subtle-panel': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      }
    },
  },
  plugins: [],
}
