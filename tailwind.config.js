export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      red: "#F44336",
      yellow: "#FFD54F",
      green: "#4CAF50",
      blue: "#2196F3",
      white: "#FFFFFF",
      black: "#000000",
      dark: "#051109",
      forest: {
        DEFAULT: "#051109",
        light: "#0a1a12",
        panel: "#0c1f16",
        muted: "#142a1f",
        border: "#1e3d2a",
      },
      gray: {
        200: "#e5e5e5",
        400: "#999999",
        600: "#333333",
        800: "#0c1f16",
      },
      gold: {
        DEFAULT: "#D4AF37",
        light: "#F9D976",
        dark: "#B38728",
        pale: "#E8D5A3",
      },
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "gold-shine": "linear-gradient(135deg, #F9D976 0%, #D4AF37 45%, #B38728 100%)",
        "forest-vignette": "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.35) 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.15)",
        "gold-sm": "0 0 8px rgba(212, 175, 55, 0.2)",
      },
    },
  },
  plugins: [],
};
