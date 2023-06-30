/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        completed: "#F9FFF5",
        completeBorder: "#4F8595",
        notStarted: "#FFF8F6",
        notStartedBorder: "#FE4D35",
        inProgress: "#F8F1FF",
        inProgressBorder: "#7F2BC8",
        inProgressHover: "#6F25A6",
      },
    },
  },
  plugins: [],
};
