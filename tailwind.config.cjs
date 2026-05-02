/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{html,ts}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      colors: {
        burgundy: { DEFAULT: '#7A1F1F', dark: '#5A1515', light: '#9A2F2F' },
        gold: { DEFAULT: '#C9A84C', light: '#E8D5A3', 50: 'rgba(201,168,76,0.12)' },
        cream: { DEFAULT: '#FAF6F0', dark: '#F0EBE3' },
        church: { text: '#1A1410', 'text-secondary': '#5C5147', 'text-muted': '#8A7E72', border: '#E2D9CE' },
      },
      boxShadow: {
        card: '0 2px 16px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
};
