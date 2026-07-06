/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mare: {
          50: '#E6F3F5',
          100: '#CCE7EB',
          200: '#99CFD6',
          300: '#66B7C2',
          400: '#33A0AD',
          500: '#0F8A9C',
          600: '#0B7A8C',
          700: '#096577',
          800: '#075162',
          900: '#053D4A',
        },
        aqua: {
          50: '#E7F9FB',
          100: '#CFF3F7',
          400: '#3FCEDF',
          500: '#14C0D4',
          600: '#0FA0B3',
        },
        coral: {
          50: '#FFEEEC',
          100: '#FFDBD7',
          400: '#FF8C81',
          500: '#FF6B5E',
          600: '#E8543F',
          700: '#C23F2E',
        },
        areia: {
          50: '#FFFBF4',
          100: '#F4EFE6',
          200: '#EFE3CE',
        },
        tinta: {
          DEFAULT: '#0A1B1F',
          700: '#132C31',
          800: '#0A1B1F',
          900: '#061114',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
