/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['"IBM Plex Mono"', 'monospace'],
        'sans': ['"IBM Plex Sans"', 'sans-serif'],
      },
      colors: {
        'dark-bg': '#0f1117',
        'category': {
          'billing': '#3b82f6',
          'refund': '#f59e0b',
          'account': '#8b5cf6',
          'cancellation': '#ef4444',
          'general': '#10b981',
        }
      }
    },
  },
  plugins: [],
}
