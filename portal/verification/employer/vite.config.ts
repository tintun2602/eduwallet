import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/portal/verification/employer/",
  build: {
    outDir: "../../dist/verification/employer",
    emptyOutDir: true,
  },
  server: {
    port: 3001,
    open: true,
  },
});
