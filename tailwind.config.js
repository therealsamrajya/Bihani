/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#fffffe",
        primary: "#181818",
        button: "#4fc4cf",
        text: "#2e2e2e",
        secondary: "#994ff3",
        tertiary: "#fbdd74",
      },
      fontFamily: {
        PoppinsBold: ["PoppinsBold"],
        PoppinsRegular: ["PoppinsRegular"],
        PoppinsThin: ["PoppinsThin"],
      },
    },
  },
  plugins: [],
};
