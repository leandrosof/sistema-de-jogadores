/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  important: "#nucleofc-app", // Adicione este ID ao seu elemento raiz
  corePlugins: {
    preflight: false // Desativa o reset do Tailwind para evitar conflito com Bootstrap
  },
  theme: {
    extend: {}
  },
  plugins: []
};
