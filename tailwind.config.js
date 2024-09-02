const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        primary: withOpacityValue("--color-primary"),
        secondary: withOpacityValue("--color-secondary"),
        background: withOpacityValue("--color-background"),
        surface: withOpacityValue("--color-surface"),
        text: withOpacityValue("--color-text"),
        muted: withOpacityValue("--color-muted"),
        border: withOpacityValue("--color-border"),
        input: withOpacityValue("--color-input"),
        hover: withOpacityValue("--color-hover"),
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scale: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.5)' },
        },
        pulse: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.6 },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        spinnerRotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
        'scale-slow': 'scale 1.5s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'spin-reverse': 'spin-reverse 1s linear infinite',
        'spin': 'spinnerRotate 1s linear infinite',
      },
    },
  },
  plugins: [],
};

function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return `rgb(var(${variable}))`;
    }
    return `rgb(var(${variable}) / ${opacityValue})`;
  };
}
