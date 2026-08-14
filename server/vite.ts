import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

/**
 * Variação de campanha ativa.
 * Formato: "{número}_{campanha}" (ex: "1_IB", "2_AM") ou vazio para o padrão.
 * Consulte client/src/lib/variationConfig.ts para a lista completa.
 */
const GOOGLE_VARIATION = process.env.VITE_GOOGLE_VARIATION ?? "";

/**
 * Resolve o arquivo HTML de entrada com base na variação.
 * "1_IB" → google_1.html | "" → index.html
 */
function resolveHtmlFile(variation: string): string {
  if (!variation) return "index.html";
  const numStr = variation.split("_")[0];
  const num = parseInt(numStr, 10);
  if (isNaN(num) || num < 1) return "index.html";
  return `google_${num}.html`;
}

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        resolveHtmlFile(GOOGLE_VARIATION),
      );

      // always reload the html file from disk in case it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath, { index: false }));

  // fall through to the correct html file if the path doesn't match a static asset
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, resolveHtmlFile(GOOGLE_VARIATION)));
  });
}
