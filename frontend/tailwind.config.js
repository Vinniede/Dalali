/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Ocean Blue - Trust, stability, international
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#1A5F7A',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Bright Cyan - Energy, modern, accessible
        secondary: {
          50: '#ecfdff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00D4FF',
          600: '#06b6d4',
          700: '#0891b2',
          800: '#0e7490',
          900: '#155e75',
        },
        // Warm Orange - Action, visibility, friendly
        accent: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#FF6B35',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        // Status Colors
        success: '#06A77D',
        warning: '#FFA630',
        error: '#D62828',
        info: {
          50: '#f0f4f8',
          100: '#d9e2f1',
          200: '#c3cce3',
          300: '#a8b8d8',
          400: '#6b91c4',
          500: '#457B9D',
          600: '#3d6a87',
          700: '#345971',
          800: '#2b485b',
          900: '#223745',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        elevation: '0 8px 24px rgba(26, 95, 122, 0.12)',
      },
      borderRadius: {
        xs: '4px',
        sm: '6px',
        base: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
      }
    },
  },
  plugins: [],
}
