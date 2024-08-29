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
