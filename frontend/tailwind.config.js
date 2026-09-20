/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#172B63',
          dark: '#0F1F4B',
          deep: '#0A1433',
          light: '#233F8E',
          subtle: '#EEF2FA',
        },
        orange: {
          DEFAULT: '#F58220',
          hover: '#E07212',
          light: '#FEF3EB',
          saffron: '#FF9933',
        },
        paper: {
          DEFAULT: '#F7F5EE',
          deep: '#EFECE2',
          card: '#FFFFFF',
        },
        slate: {
          bg: '#F6F8FC',
          surface: '#FFFFFF',
          text: '#172033',
          secondary: '#5A6578',
          border: '#DDE2EC',
          divider: '#C8D0DF',
        },
        status: {
          success: '#16805C',
          successBg: '#ECFDF3',
          warning: '#B7791F',
          warningBg: '#FFFAEB',
          error: '#C24141',
          errorBg: '#FEF3F2',
          info: '#175CD3',
          infoBg: '#EFF8FF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans Gujarati', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"DM Mono"', 'Consolas', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '6px',
        sm: '4px',
        md: '6px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(16, 24, 40, 0.05)',
        modal: '0 8px 24px -4px rgba(15, 31, 75, 0.15)',
        masthead: '0 2px 4px 0 rgba(15, 31, 75, 0.04)',
      }
    },
  },
  plugins: [],
}
