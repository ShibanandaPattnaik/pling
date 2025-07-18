/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Mood-based color scheme for Pling
        mood: {
          'creative': '#FF6B9D',
          'excited': '#FFE66D',
          'calm': '#4ECDC4',
          'confident': '#FF8C42',
          'sad': '#6C7CE0',
          'angry': '#FF4757',
          'happy': '#2ED573',
          'neutral': '#A4B0BE'
        },
        primary: {
          50: '#faf5ff',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        }
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'mood-pulse': 'pulse 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}