/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          400: '#c4d0bc',
          500: '#a8b89e',
          600: '#8fa585',
          700: '#7a9070',
          800: '#627559',
        },
        cream: '#f8f6f2',
      },
    },
  },
  plugins: [],
}

