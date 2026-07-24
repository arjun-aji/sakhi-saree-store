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
          dark: '#2A0E11',
          DEFAULT: '#3D1418',
          light: '#5B1D23',
        },
        beige: {
          bg: '#F7EFE8',
          card: '#EFE6DD',
          border: '#E2D4C5',
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
