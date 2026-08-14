import express, { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";
import { injectTrackingIntoHtml } from "./domainTracking";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("pt-BR", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}


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


function creativeMiddleware(req: Request, res: Response, next: NextFunction) {
  // Lista de rotas que devem ser ignoradas pelo middleware de sessão
  const ignoredRoutes = [
    '/api',
    '/assets',
    "/utmify",
    '/fonts',
    '/remarketing',
    '/login',
    '/bot',
    '/conversar',
    '/pagamento',
    '/converar',
    '/login-pos-pagamento',
    '/confirmacao-dados',
    '/confirmar-dados',
    '/confirmacao-pagamento',
    '/agendamento-medico',
    '/confirmacao-medica',
    '/validacao-identidade',
    '/regularizacao-pagamento',
    '/obrigado',
    '/resultados-medicos',
    '/autoridade-beneficios',
    '/regularizacao-migracao',
    '/footer-exercito',
    '/footer-conteudos',
    '/footer-junte-se',
    '/footer-imprensa',
    '/footer-acesso-informacao',
    '/footer-transparencia'
  ];

  // Verificar se a rota atual deve ser ignorada usando regex
  const shouldIgnore = ignoredRoutes.some(route => {
    const routeRegEx = new RegExp(`^${route}(/|$)`);
    return routeRegEx.test(req.path);
  });

    return next();
  
 
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true,
  } as const;

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

  // Aplicar middleware creative antes do middleware do Vite
  app.use(creativeMiddleware);
  app.use(vite.middlewares);
  
  // Middleware para servir o frontend apenas para rotas que não são da API
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    
    // Pular rotas da API - elas já foram processadas anteriormente
    if (url.startsWith('/api/')) {
      return next();
    }

    try {
      const clientTemplate = path.resolve(
        __dirname,
        "..",
        "client",
        resolveHtmlFile(GOOGLE_VARIATION),
      );

      // always reload the index.html file from disk incase it changes
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

  // fall through to the correct html file if the path doesn't match a static asset.
  // Inject tracking directly on the string — DO NOT rely on trackingMiddleware here
  // because Express converts the string to a Buffer internally before calling res.end,
  // causing the middleware's Buffer-check guard to skip the injection silently.
  console.log(`[serveStatic] distPath=${distPath} | variation="${GOOGLE_VARIATION}" | file=${resolveHtmlFile(GOOGLE_VARIATION)}`);
  app.use("*", (_req, res) => {
    const htmlPath = path.resolve(distPath, resolveHtmlFile(GOOGLE_VARIATION));
    try {
      let html = fs.readFileSync(htmlPath, "utf-8");
      const hasPlaceholder = html.includes("<!-- __TRACKING__ -->");
      console.log(`[serveStatic] GET ${_req.path} host=${_req.hostname} | file=${path.basename(htmlPath)} | size=${html.length}B | placeholder=${hasPlaceholder}`);
      html = injectTrackingIntoHtml(html, _req.hostname, _req.path);
      console.log(`[serveStatic] injected | final size=${html.length}B`);
      res.set("Content-Type", "text/html").send(html);
    } catch (err) {
      console.error(`[serveStatic] ERROR serving ${htmlPath}:`, err);
      res.status(404).send("Not found");
    }
  });
}
