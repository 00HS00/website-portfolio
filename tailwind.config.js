/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0E14',
        surface: '#12151D',
        'surface-2': '#191D27',
        border: '#262B38',
        ink: '#EDEFF3',
        'ink-muted': '#8D94A5',
        gold: '#C9A15A',
        blue: '#5B8DEF',
        live: '#4ADE80',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
    },
  },
  plugins: [],
};
