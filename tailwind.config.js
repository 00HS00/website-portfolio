/** @type {import('tailwindcss').Config} */
// Colors are CSS variables (RGB channels) defined in src/index.css so the dark and light themes share one set of classes.
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        border: token('border'),
        ink: token('text'),
        'ink-muted': token('text-muted'),
        gold: token('gold'),
        blue: token('blue'),
        live: token('live'),
        danger: token('danger'),
        warn: token('warn'),
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
