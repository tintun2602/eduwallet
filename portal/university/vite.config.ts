import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    host: true,
  },
  build: {
    outDir: "dist",
    rollupOptions: {
      external: ["http", "https", "zlib", "crypto"],
    },
  },
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      crypto: "crypto-browserify",
      stream: "stream-browserify",
      buffer: "buffer",
      process: "process/browser",
    },
  },
  optimizeDeps: {
    include: ["buffer", "process"],
  },
});
