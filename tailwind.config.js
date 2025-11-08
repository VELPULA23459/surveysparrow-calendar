/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ss: { yellow: '#FFC107', dark: '#0B0D0E', ink: '#111827' }
      },
      boxShadow: { soft: '0 8px 20px rgba(0,0,0,0.08)' },
      borderRadius: { '2xl': '1rem' }
    },
  },
  plugins: [],
};
