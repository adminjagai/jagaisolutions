/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './src/**/*.css'
  ],
  safelist: [
    'bg-dark-950'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#EBF3FF',
          100: '#D6E7FF',
          200: '#ADC9FF',
          300: '#85ABFF',
          400: '#5C8DFF',
          500: '#0047FF',  // Vibrant cobalt blue (RGB: 0, 71, 255)
          600: '#0035DB',
          700: '#0029B7',
          800: '#001D93',
          900: '#00116F',
        },
        dark: {
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#E5E5E5',
          300: '#D4D4D4',
          400: '#A3A3A3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0A0A0A',
        },
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 71, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 71, 255, 0.8)' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}