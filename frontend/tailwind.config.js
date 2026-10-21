/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  corePlugins: {
    // Crucial para que Tailwind no rompa los estilos de Vuetify
    preflight: false,
  },
  theme: {
    extend: {},
  },
  plugins: [],
}