/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: '#07111f',
        panel: '#0f172a',
        panel2: '#111c31',
        line: 'rgba(255,255,255,0.08)',
        ink: '#f8fafc',
        muted: '#94a3b8',
        brand: {
          blue: '#3b82f6',
          purple: '#8b5cf6',
          green: '#10b981',
          orange: '#f59e0b',
          pink: '#ec4899',
          cyan: '#06b6d4',
        },
      },
      boxShadow: {
        glass: '0 20px 40px rgba(0,0,0,0.35)',
        'glass-lg': '0 28px 60px rgba(0,0,0,0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
        'app-bg': 'linear-gradient(180deg,#07111f 0%,#081425 100%)',
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
}
