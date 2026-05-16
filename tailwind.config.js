/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Page & content backgrounds
        'page':      '#dce8f5',   // light blue-gray page bg
        'surface-0': '#dce8f5',
        'surface-1': '#f0f5fb',   // slightly lighter area
        'surface-2': '#ffffff',   // card / panel white
        'surface-3': '#eaf1fb',   // hover rows

        // Sidebar
        'sidebar-bg':     '#1a3664',
        'sidebar-hover':  '#243f75',
        'sidebar-active': '#2c4d8a',
        'sidebar-border': 'rgba(255,255,255,0.08)',

        // Brand blue
        'brand': {
          DEFAULT: '#1a56db',
          hover:   '#1648c0',
          light:   '#3b82f6',
          pale:    '#dbeafe',
          muted:   'rgba(26,86,219,0.1)',
        },

        // Borders
        'line':      'rgba(0,0,0,0.07)',
        'line-str':  'rgba(0,0,0,0.12)',

        // Semantic
        'success': '#059669',
        'warning': '#d97706',
        'danger':  '#dc2626',
        'info':    '#0284c7',

        // Text
        'text-primary':   '#111827',
        'text-secondary': '#4b5563',
        'text-muted':     '#9ca3af',
      },
      boxShadow: {
        'card':    '0 1px 3px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.06)',
        'card-lg': '0 4px 24px rgba(0,0,0,0.1)',
        'btn':     '0 2px 6px rgba(26,86,219,0.3)',
        'btn-hov': '0 4px 14px rgba(26,86,219,0.4)',
      },
    },
  },
  plugins: [],
}
