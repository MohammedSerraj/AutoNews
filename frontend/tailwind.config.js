
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'nyt': ['Georgia', 'Times New Roman', 'Times', 'serif'],
        'nyt-heading': ['"Times New Roman"', 'Times', 'serif'],
        'sans': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        'nyt-black': '#121212',
        'nyt-gray': '#6e6e6e',
        'nyt-light': '#f8f8f8',
        'nyt-border': '#e2e2e2',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}
