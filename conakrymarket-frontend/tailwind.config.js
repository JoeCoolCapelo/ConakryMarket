/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#F97316',
          DEFAULT: '#EA580C',
          dark: '#C2410C',
        },
        secondary: {
          light: '#059669',
          DEFAULT: '#047857',
          dark: '#065F46',
        },
        background: {
          DEFAULT: '#FFFBEB',
          alt: '#FEF3C7',
        },
        accent: {
          dark: '#1C1917',
          light: '#292524',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
