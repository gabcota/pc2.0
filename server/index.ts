import cluster from "cluster";
import compression from "compression";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes, downloadEscolasCsvSeNecessario } from "./routes";
import { setupVite, serveStatic, log } from "./creative-vite";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { trackingMiddleware } from "./domainTracking";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.set("trust proxy", 1);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use((req, res, next) => {
  const isInternal =
    req.hostname === "127.0.0.1" ||
    req.hostname === "localhost" ||
    req.ip === "127.0.0.1" ||
    req.ip === "::1";
  if (
    process.env.NODE_ENV === "production" &&
    !isInternal &&
    req.headers["x-forwarded-proto"] !== "https" &&
    req.path !== "/healthz"
  ) {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  if (process.env.NODE_ENV === "production") {
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload"
    );
  }
  next();
});

const apiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 1000,
  message: {
    error: "Muitas requisições",
    message:
      "Você excedeu o limite de requisições de API. Tente novamente em uma hora.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: (req) => process.env.NODE_ENV === "development",
});

app.use("/api", apiLimiter);

app.use((req, res, next) => {
  const start = Date.now();
  const reqPath = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (reqPath.startsWith("/api")) {
      let logLine = `${req.method} ${reqPath} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

app.use(trackingMiddleware);

async function startWorker() {
  if (process.env.NODE_ENV === "development") {
    downloadEscolasCsvSeNecessario().catch((err) =>
      console.error("[startup] Erro ao iniciar download do CSV de escolas:", err)
    );
  }

  app.use(
    compression({
      level: 6,
      threshold: 1024,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) return false;
        return compression.filter(req, res);
      },
    })
  );

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = process.env.PORT || 5000;
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      log(`serving on port ${port} (worker ${process.pid})`);
    }
  );
}

if (cluster.isPrimary && process.env.DEVELOPING !== "true") {
  (async () => {
    downloadEscolasCsvSeNecessario().catch((err) =>
      console.error("[startup] Erro ao iniciar download do CSV de escolas:", err)
    );

    // Vite's dependency optimizer writes to a shared cache. Running multiple
    // development workers races those writes and can serve mismatched React
    // chunks, causing invalid hook calls in the preview.
    const defaultWorkers = "1";
    const numWorkers = parseInt(process.env.WEB_CONCURRENCY || defaultWorkers);
    log(`Primary ${process.pid} iniciando ${numWorkers} workers`);

    for (let i = 0; i < numWorkers; i++) {
      cluster.fork();
    }

    cluster.on("exit", (worker, code, signal) => {
      log(
        `Worker ${worker.process.pid} encerrado (${signal || code}) — reiniciando`
      );
      cluster.fork();
    });
  })();
} else {
  startWorker();
}
