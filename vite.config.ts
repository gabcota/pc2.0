import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const clientDir = path.resolve(import.meta.dirname, "client");

function buildHtmlInputs(): Record<string, string> {
  const inputs: Record<string, string> = {
    index: path.resolve(clientDir, "index.html"),
  };
  if (!fs.existsSync(clientDir)) return inputs;
  const files = fs.readdirSync(clientDir).filter((f) => f.endsWith(".html"));
  for (const file of files) {
    const key = file.replace(".html", "");
    inputs[key] = path.resolve(clientDir, file);
  }
  return inputs;
}

export default defineConfig({
  // Keep optimized development modules in a versioned directory. Changing
  // dependency layouts must not leave the Replit preview proxy serving chunks
  // generated from an older optimizer graph.
  cacheDir: path.resolve(import.meta.dirname, "node_modules/.vite-replit-v2"),
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
        ]
      : []),
  ],
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react/jsx-runtime",
      "@tanstack/react-query",
    ],
  },
  root: clientDir,
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: buildHtmlInputs(),
      output: {
        chunkFileNames: 'assets/[hash].js',
        assetFileNames: `assets/[hash].[ext]`,
      },
    },
  },
});
