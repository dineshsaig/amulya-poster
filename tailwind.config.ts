import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FFF0C0',
          200: '#FFE07A',
          300: '#F0C96B',
          400: '#C9A84C',
          500: '#A8832A',
          600: '#7C5B1A',
          700: '#5C3D0D',
          800: '#3D2707',
          900: '#1E1203',
        },
        cream: '#F5EDD6',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Lato', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
