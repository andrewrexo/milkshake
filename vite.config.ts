import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      include: ["crypto", "stream", "path", "util"],
      globals: {
        Buffer: true,
        global: true,
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "solana-web3": ["@solana/web3.js"],
        },
      },
    },
  },
});
