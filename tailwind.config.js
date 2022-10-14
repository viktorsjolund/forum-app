/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight': '#1f2327',
        'main-purple': '#5a189a',
        'main-purple-light': '#7b2cbf',
        'main-purple-dark': '#3c096c',
      },
      fontWeight: {
        'medium-bolder': 550
      }
    },
  },
  plugins: [],
}
