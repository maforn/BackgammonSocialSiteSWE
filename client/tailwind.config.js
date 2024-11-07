/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,html,js,ts,jsx,tsx}"
  ],
  safelist: [
    'bg-red-500',
    'bg-green-500',
  ],
  theme: {
    extend: {
      animation: {
        pulse: 'pulse 2s infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
}
