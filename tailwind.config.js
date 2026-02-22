/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ok: '#22c55e',
        low: '#f59e0b',
        need: '#ef4444',
      },
    },
  },
  plugins: [],
}

