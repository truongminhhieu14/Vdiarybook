/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "15px",
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1400px"
    },
    fontFamily: {
      oswald: 'var(--font-oswald)',
      roboto: 'var(--font-roboto)',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#333',
          100: '#484848',
          200: '#151515',
          300: '#111',
        },
        accent: '#d4000d'
      },
      keyframes: {
        blink: {
          '0%, 80%, 100%': { opacity: 0 },
          '40%': { opacity: 1 },
        },
      },
      animation: {
        blink: 'blink 1s infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
}

