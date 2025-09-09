module.exports = {
  // ... other config
  theme: {
    extend: {  // Add this if not exists
      fontFamily: {  // Add this
        nastaliq: ['var(--font-nastaliq)'],
      },
    },
  },
  plugins: [
    // ... other plugins
    require('tailwind-scrollbar-hide')
  ],
}