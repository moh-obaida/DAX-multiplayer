export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      red: "#e53935",
      yellow: "#fdd835",
      green: "#43a047",
      blue: "#1e88e5",
      white: "#FFFFFF",
      black: "#000000",
      emerald: {
        DEFAULT: "#0f2818",
        dark: "#071810",
        light: "#163322",
        glow: "#1e4d32",
      },
      board: {
        DEFAULT: "#1a3a2e",
        light: "#234a3a",
        dark: "#122820",
        felt: "#165038",
      },
      gold: {
        DEFAULT: "#d4af37",
        light: "#f0d060",
        dark: "#9a7b1a",
        glow: "#ffd700",
      },
      ivory: {
        DEFAULT: "#f5f1e8",
        muted: "#b8b0a0",
        dim: "#6b655c",
      },
      card: {
        red: "#e53935",
        yellow: "#fdd835",
        green: "#43a047",
        blue: "#1e88e5",
      },
      transparent: "transparent",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Orbitron", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gold-shine": "linear-gradient(135deg, #f0d060 0%, #d4af37 45%, #9a7b1a 100%)",
        "emerald-mesh": "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(30,77,50,0.8) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(212,175,55,0.06) 0%, transparent 50%)",
        "grid-pattern": "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)",
        "hero-glow": "radial-gradient(ellipse 50% 80% at 50% 100%, rgba(212,175,55,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        gold: "0 0 32px rgba(212, 175, 55, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
        "gold-sm": "0 0 12px rgba(212, 175, 55, 0.3)",
        panel: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(212,175,55,0.08)",
        "panel-hover": "0 12px 40px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.1)",
        neon: "0 0 20px rgba(212,175,55,0.4), 0 0 40px rgba(212,175,55,0.1)",
      },
      animation: {
        "pulse-gold": "pulseGold 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212,175,55,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(212,175,55,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
