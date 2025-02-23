/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#F8F9FA",
        primary: "#4A90E2", // for button navbar active icons
        title: "#1E3A8A",
        subtitle: "#666666",
        text: "#2e2e2e",
        secondary: "#5CB85C", //for success messages , progress bar
        tertiary: "#FF9800", // for reminders pending notification badges , call to action button
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
