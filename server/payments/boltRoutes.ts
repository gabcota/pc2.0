import type { Express } from "express";
import { paymentGateway, UNAVAILABLE, amountInCents } from "./bolt";
import { BoltService, publicPayment, logBolt } from "./boltService";
import { PgBoltStore } from "./boltStore";
import { processSmsNotification } from "../sms_process";

export function registerBoltRoutes(app: Express, injected?: BoltService, getGateway = paymentGateway) {
  const service = injected ?? new BoltService(new PgBoltStore(), undefined, async row => {
    await processSmsNotification({
      ...row.control.customer, status: "paid", productName: row.control.productName,
    });
  });
  app.get("/api/payment-config", (_req, res) => {
    try {
      res.set("Cache-Control", "no-store").json({ gateway: getGateway() });
    } catch {
      res.status(503).json({ error: UNAVAILABLE });
    }
  });
  app.get("/api/pix-local/:id", async (req, res) => {
    try {
      if (getGateway() !== "bolt") return res.status(404).json({ success: false });
      const saved = await service.find(req.params.id);
      if (!saved) return res.status(404).json({ success: false });
      res.set("Cache-Control", "no-store").json({ success: true, data: publicPayment(saved) });
    } catch {
      res.status(503).json({ success: false, error: UNAVAILABLE });
    }
  });
  const paymentPath = (path: string) => /^\/api\/(?:gerar-pix|verificar-(?:status-pagamento|pagamento)|utmify|remarketing)(?:\/|$)/.test(path);
  app.use((req, res, next) => {
    if (!paymentPath(req.path)) return next();
    try {
      const gateway = getGateway();
      if (gateway === "bolt" && req.path.startsWith("/api/utmify/") && req.path !== "/api/utmify/bolt") {
        return res.status(200).json({ success: true, ignored: true });
      }
      next();
    } catch {
      res.status(503).json({ success: false, error: UNAVAILABLE });
    }
  });
  app.post("/api/gerar-pix", async (req, res, next) => {
    if (getGateway() !== "bolt") return next();
    try {
      const ip = req.ip || req.socket.remoteAddress || "";
      const data = await service.create(req.body, ip);
      res.json({ success: true, data });
    } catch {
      logBolt("create_unavailable");
      res.status(503).json({ success: false, gateway: "bolt", error: UNAVAILABLE });
    }
  });
  const status = async (req: any, res: any, next: any) => {
    if (getGateway() !== "bolt") return next();
    try {
      const row = await service.verify(String(req.params.id || req.params.transactionId));
      if (!row) return res.status(404).json({ success: false, gateway: "bolt", error: UNAVAILABLE });
      res.set("Cache-Control", "no-store").json({ success: true, data: publicPayment(row) });
    } catch {
      res.status(503).json({ success: false, gateway: "bolt", error: UNAVAILABLE });
    }
  };
  app.get("/api/verificar-status-pagamento/:id", status);
  app.get("/api/verificar-pagamento/:transactionId", status);
  app.get("/api/remarketing/:transaction_id", async (req, res, next) => {
    if (getGateway() !== "bolt") return next();
    try {
      const row = await service.find(req.params.transaction_id);
      if (!row) return res.status(404).json({ success: false, error: UNAVAILABLE });
      res.set("Cache-Control", "no-store").json({ success: true, data: {
        ...publicPayment(row), amount: (row.control.amountCents / 100).toFixed(2),
        candidateName: row.control.customer.name, candidateEmail: row.control.customer.email,
        candidatePhone: row.control.customer.phone,
        vagaTitle: row.vaga_title, vagaCompany: row.vaga_company, vagaLocation: row.vaga_location,
        localProvaName: row.local_prova_name, localProvaAddress: row.local_prova_address,
        dataProva: row.data_prova, horaProva: row.hora_prova,
      } });
    } catch {
      res.status(503).json({ success: false, error: UNAVAILABLE });
    }
  });
  app.post("/api/utmify/bolt", async (req, res) => {
    if (getGateway() !== "bolt") return res.status(200).json({ success: true, ignored: true });
    try {
      const id = typeof req.body?.Id === "string" || typeof req.body?.Id === "number" ? String(req.body.Id) : "";
      if (!id) return res.status(400).json({ success: false });
      const saved = await service.find(id);
      // Shared merchant account: no API call and no error for another app's ID.
      if (!saved) return res.status(200).json({ success: true, ignored: true });
      if (req.body.PaymentMethod && String(req.body.PaymentMethod).toLowerCase() !== "pix")
        return res.status(200).json({ success: true, ignored: true });
      if (amountInCents(req.body.Amount) !== saved.control.amountCents)
        return res.status(200).json({ success: true, ignored: true });
      logBolt("webhook", id, "RECEIVED", "reais");
      const verified = await service.verify(id, true);
      // A concurrent poll/429 can defer verification; ask the gateway to retry,
      // not mark a notification as processed without having verified its status.
      const wanted = String(req.body.Status ?? "").toUpperCase();
      if (wanted === "PAID" && !verified?.control.confirmedAt)
        return res.set("Retry-After", "15").status(503).json({ success: false, retry: true });
      res.status(200).json({ success: true });
    } catch {
      res.status(503).json({ success: false, retry: true });
    }
  });
}
