import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#01016F',
          50: '#01016F',
          100: '#01016F',
          200: '#01016F',
          300: '#01016F',
          400: '#01016F',
          500: '#01016F',
          600: '#01016F',
          700: '#01016F',
          800: '#01016F',
          900: '#01016F',
        },
        secondary: {
          DEFAULT: '#D8031C',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist)'],
      },
    },
  },
  plugins: [],
};

export default config; 