module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bimanRed: '#D71920',
        bimanGreen: '#006A4E',
        bimanGold: '#FFD700',
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        bengali: ['Noto Sans Bengali', 'SolaimanLipi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 