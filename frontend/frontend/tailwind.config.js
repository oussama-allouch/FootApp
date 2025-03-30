/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Ajoute tous les fichiers React
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6", // Exemple de couleur personnalisée
      },
    },
  },
  plugins: [],
  darkMode: "class", // Active le dark mode via classe CSS
}