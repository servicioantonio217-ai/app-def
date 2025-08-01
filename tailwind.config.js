/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#E53E3E',
        'brand-red-dark': '#C53030',
        'brand-black': '#1A202C',
        'brand-gray': '#4A5568',
        'brand-gray-dark': '#2D3748',
        'brand-gray-light': '#F7FAFC',
      }
    },
  },
  plugins: [],
}
