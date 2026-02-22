/** @type {import('tailwindcss').Config} */
export default {
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

