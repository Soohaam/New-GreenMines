module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
        extend: {
          animation: {
            marquee: 'marquee 20s linear infinite',
            'marquee-reverse': 'marquee-reverse 20s linear infinite',
          },
          keyframes: {
            marquee: {
              '0%': { transform: 'translateX(0%)' },
              '100%': { transform: 'translateX(-100%)' },
            },
            'marquee-reverse': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(0%)' },
            }
          }
        },
  plugins: [],
},
}
