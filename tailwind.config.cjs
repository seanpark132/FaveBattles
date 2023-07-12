/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      spacing: {
        '39': '9.75rem',
        '110': '27.5rem',
      }
    },
  },
  plugins: [],
}

