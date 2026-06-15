export const theme = {
  colors: {
    emerald: "#0f2818",
    board: "#1a3a2e",
    gold: "#d4af37",
    ivory: "#f5f1e8",
    black: "#000000",
    suits: {
      red: "#F44336",
      yellow: "#FFD54F",
      green: "#4CAF50",
      blue: "#2196F3",
    },
  },
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Hanken Grotesk", system-ui, sans-serif',
  },
  card: {
    width: 96,
    height: 144,
    discardSize: 120,
    selectedScale: 1.1,
  },
  timer: {
    total: 30,
    yellowAt: 15,
    redAt: 5,
    flashAt: 5,
  },
  animation: {
    cardPlay: 300,
    cardDraw: 200,
    handReflow: 200,
    modalFade: 200,
  },
  breakpoints: {
    mobile: 375,
    tablet: 768,
    desktop: 1920,
  },
} as const;
