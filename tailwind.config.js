/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'void-black': '#0a0a0a',
        'cold-white': '#d0d0d0',
        'wireframe-grey': '#404040',
        'studio-purple': '#6B4C8A',
        'drive-tan': '#8B6F47',
        'kitchen-terra': '#A85C5C',
        'bruised-maroon': '#5a3a3a',
        'bruised-navy': '#2a3a4a',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
        sans: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

module.exports = config;
