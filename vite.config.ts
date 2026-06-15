import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({ filename: "stats.html", gzipSize: true, open: false }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("node_modules/react-dom") || id.includes("react-router")) {
            return "vendor";
          }
          if (id.includes("node_modules/firebase")) return "firebase";
          if (id.includes("node_modules/@sentry")) return "sentry";
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
