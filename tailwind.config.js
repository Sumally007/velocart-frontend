/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#2563eb',
          dark: '#1e3a8a',
          accent: '#10b981',
        }
      }
    },
  },
  plugins: [],
}
