/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        "main-bg": "#ffffff",
        "component-green": "#294E3E",
        "component-dull-green": "#0A8851",
        "outline": "#07613A",
        "accent": "#0EBD71",
        "disabled": "#C3D2CB",
        "active-btn": "#07AA38",
        "red": "#C20000",
      },
      textColor: {
        "accent": "#0EBD71",
        "error": "#C20000",
      },
      borderColor: {
        "outline": "#07613A",
        "accent": "#0EBD71",
        "error": "#C20000",
      }
    },
  },
  plugins: [],
}

