import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("react-router")) {
            return "vendor";
          }
          if (id.includes("node_modules/firebase")) return "firebase";
          if (id.includes("node_modules/zustand")) return "state";
        },
      },
    },
  },
  server: {
    host: true,
    allowedHosts: ["localhost", "help.localhost"],
  },
});
