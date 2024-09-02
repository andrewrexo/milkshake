import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import svgr from "vite-plugin-svgr";
// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    nodePolyfills({
      include: ["crypto", "stream", "path", "util", "buffer"],
      globals: {
        Buffer: true,
        global: true,
      },
    }),
  ],
  resolve: {
    alias: {
      "bn.js": path.resolve(__dirname, "node_modules/bn.js"),
      elliptic: path.resolve(__dirname, "node_modules/elliptic"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("@hop-protocol/sdk")) {
            // Split hop-sdk into smaller chunks
            if (id.includes("bridge")) return "hop-sdk-bridge";
            if (id.includes("token")) return "hop-sdk-token";
            if (id.includes("chain")) return "hop-sdk-chain";
            if (id.includes("utils")) return "hop-sdk-utils";
            if (id.includes("contracts")) return "hop-sdk-contracts";
            return "hop-sdk-core";
          }
          if (id.includes("@solana/web3.js")) {
            return "solana-web3";
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ["@hop-protocol/sdk", "bn.js", "elliptic"],
  },
});
