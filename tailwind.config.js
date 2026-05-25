/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eeedfe',
          100: '#cecbf6',
          200: '#afa9ec',
          400: '#7f77dd',
          600: '#6c5ce7',
          700: '#534ab7',
          900: '#26215c',
        },
        surface: {
          DEFAULT: '#0a0a0f',
          card: '#0f0f1a',
          hover: '#141420',
          border: 'rgba(255,255,255,0.07)',
        },
        teal: {
          400: '#5dcaa5',
          600: '#1d9e75',
        },
        coral: {
          400: '#f0997b',
          600: '#d85a30',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(12px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
