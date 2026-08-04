/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          dark: '#6A2B15',
          DEFAULT: '#8C3B1F',
          light: '#A34320',
        },
        beige: {
          bg: '#FFFFF0',
          card: '#FAF7EC',
          border: '#E5D9C8',
        },
        gold: {
          DEFAULT: '#C59B27',
          light: '#E0BA55',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        script: ['Alex Brush', 'cursive'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
