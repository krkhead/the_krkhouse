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
        'void-black': '#050505',
        'cold-white': '#f0f0f0',
        'wireframe-grey': '#404040',
        'studio-purple': '#6B4C8A',
        'drive-tan': '#8B6F47',
        'bruised-maroon': '#5a3a3a',
        'bruised-navy': '#2a3a4a',
        'acid-accent': '#e0ff00',
      },
      fontFamily: {
        mono: ['"Courier New"', 'monospace'],
        display: ['Impact', 'Haettenschweiler', '"Arial Narrow"', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0) skewX(0deg)' },
          '20%': { transform: 'translate(-3px, 2px) skewX(0.5deg)' },
          '40%': { transform: 'translate(-2px, -2px) skewX(-0.4deg)' },
          '60%': { transform: 'translate(3px, 2px) skewX(0.3deg)' },
          '80%': { transform: 'translate(2px, -3px) skewX(-0.5deg)' },
        },
      },
      animation: {
        'glitch-fast': 'glitch 0.18s cubic-bezier(.25,.46,.45,.94) both infinite',
      },
    },
  },
  plugins: [],
};

module.exports = config;
