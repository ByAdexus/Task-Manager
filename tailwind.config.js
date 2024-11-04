/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Esto incluye todos los archivos de la carpeta src
  ],
  theme: {
    extend: {
      colors: {
        'yellow-main': '#FBCB0A',
        'gray-light': '#f7f7f7',
      },
    },
  },
  plugins: [],
};
