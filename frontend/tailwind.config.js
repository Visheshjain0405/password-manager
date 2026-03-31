/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Outfit', 'Inter', 'sans-serif'],
      heading: ['Outfit', 'Inter', 'sans-serif'],
    },
    extend: {
      colors: {
        indigo: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1bafb',
          400: '#6d91f7',
          500: '#4666f1',
          600: '#2e44e6',
          700: '#2534d4',
          800: '#232bad',
          900: '#212a89',
          950: '#151952',
        },
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1bafb',
          400: '#6d91f7',
          500: '#4666f1',
          600: '#2e44e6',
          700: '#2534d4',
          800: '#232bad',
          900: '#212a89',
          950: '#151952',
        },
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0, 0, 0, 0.05)',
        'premium-hover': '0 20px 50px -12px rgba(0, 0, 0, 0.08)',
        'indigo-glow': '0 8px 30px rgba(70, 102, 241, 0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
