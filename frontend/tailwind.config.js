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
          light: '#233F8E',
          subtle: '#EEF2FA',
        },
        orange: {
          DEFAULT: '#F58220',
          hover: '#E07212',
          light: '#FEF3EB',
        },
        slate: {
          bg: '#F6F8FC',
          surface: '#FFFFFF',
          text: '#172033',
          secondary: '#667085',
          border: '#E4E7EC',
          divider: '#D0D5DD',
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
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '10px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(16, 24, 40, 0.05)',
        modal: '0 4px 16px -2px rgba(16, 24, 40, 0.1)',
      }
    },
  },
  plugins: [],
}
