/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Asegúrate de que está configurado correctamente para Angular
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  darkMode: 'class', // Esto habilita el modo oscuro basado en clases
}

