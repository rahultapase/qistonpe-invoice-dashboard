/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom status colors for invoice states
        status: {
          paid: {
            bg: '#dcfce7',      // bg-green-100
            text: '#166534',    // text-green-800
            border: '#bbf7d0'   // border-green-200
          },
          pending: {
            bg: '#fef9c3',      // bg-yellow-100
            text: '#854d0e',    // text-yellow-800
            border: '#fef08a'   // border-yellow-200
          },
          overdue: {
            bg: '#fee2e2',      // bg-red-100
            text: '#991b1b',    // text-red-800
            border: '#fecaca'   // border-red-200
          }
        },
        // Brand colors for QistonPe
        brand: {
          primary: '#2563eb',   // blue-600
          secondary: '#1e40af', // blue-800
          accent: '#3b82f6'     // blue-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
