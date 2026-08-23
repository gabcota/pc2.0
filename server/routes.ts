import "./httpAgents";
import type { Express } from "express";
import { createServer, type Server } from "http";
import {
  resolveTracking,
  buildSitemap,
  DOMAIN_TRACKING,
  COMPANY_DATA,
} from "./domainTracking";
import { storage } from "./storage";
import { db, safeRows, orUndef, safeInsertReturn } from "./db";
import { candidates, pixTransactions, faqCache } from "@shared/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import crypto from "crypto";
import axios from "axios";
import { formatName } from "./nameUtils.js";
import { processSmsNotification } from "./sms_process.js";

const API_DIRECT_SMS =
  "https://mysmsmanagercustom-z.replit.app/api/send/6949e9a7ec6b40cd92ec87d14c2921c1";

class PagLemonAPI {
  API_URL = "https://api.paglemon.com.br/api/v1";

  // O PagLemon não tem endpoint de consulta, então o status vem do nosso
  // receptor de webhook hospedado na Hostinger
  STATUS_URL =
    process.env.PAGLEMON_STATUS_URL ||
    "https://yellowgreen-chamois-294476.hostingersite.com/paglemon-status.php";

  userHeaders: any;

  constructor(userHeaders?: any) {
    this.userHeaders = userHeaders || {};
  }

  private generateRandomUserAgent(): string {
    const brands = ["Mozilla/5.0", "AppleWebKit", "Chrome", "Safari"];
    const platforms = [
      "Windows NT 10.0; Win64; x64",
      "Macintosh; Intel Mac OS X 10_15_7",
      "Linux; Android 9",
      "Linux; Android 10",
    ];
    const versions = ["86.0", "87.0", "88.0", "89.0", "91.0"];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomPlatform =
      platforms[Math.floor(Math.random() * platforms.length)];
    const randomVersion = versions[Math.floor(Math.random() * versions.length)];
    return `${randomBrand} (${randomPlatform}) Gecko/20100101 Firefox/${randomVersion}`;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      "lemontech-gateway-publickey":
        process.env.PAGLEMON_PUBLIC_KEY ||
        this.userHeaders["lemontech-gateway-publickey"] ||
        "",
      "lemontech-gateway-secretkey":
        process.env.PAGLEMON_SECRET_KEY ||
        this.userHeaders["lemontech-gateway-secretkey"] ||
        "",
      "User-Agent":
        this.userHeaders["user-agent"] ||
        this.userHeaders["User-Agent"] ||
        this.generateRandomUserAgent(),
    };
  }

  // PagLemon recebe metadata como objeto (o NovaEra recebe string JSON),
  // então aceita string vinda da rota e faz o parse de volta
  private buildMetadata(metadata: any) {
    if (!metadata) return undefined;
    if (typeof metadata !== "string") return metadata;
    try {
      return JSON.parse(metadata);
    } catch {
      return { raw: metadata };
    }
  }

  async createPixPayment(data: any) {
    let amountInCents = Math.round(data.amount * 100);

    if (amountInCents < 1000) {
      amountInCents = 7104;
    }

    const payload = {
      amount: amountInCents,
      currency: "BRL",
      paymentMethod: "pix",
      description: data.description || "Ebook",
      metadata: this.buildMetadata(data.metadata),
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        document: {
          number: (data.customer.document || data.customer.cpf || "").replace(
            /\D/g,
            "",
          ),
          type: "cpf",
        },
      },
      items: [
        {
          title: data.description || "Ebook",
          unitPrice: amountInCents,
          total_amount_cents: amountInCents,
          quantity: 1,
        },
      ],
    };

    console.log(
      "Enviando payload para PagLemon:",
      JSON.stringify(payload, null, 2),
    );

    const response = await fetch(`${this.API_URL}/direct/payment`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PagLemon API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  // Aceita o id da transação ou o externalId — a rota PHP consulta os dois.
  // Atenção: amount aqui volta em CENTAVOS (o webhook manda 1990),
  // diferente do createPixPayment que responde em reais (19.9).
  async getTransaction(transactionId: string) {
    const url = new URL(this.STATUS_URL);
    url.searchParams.set("id", transactionId);

    const headers: Record<string, string> = {
      "User-Agent": this.generateRandomUserAgent(),
    };

    // Sem token a rota devolve só status e valor; com token vem CPF e metadata
    const token = process.env.PAGLEMON_STATUS_TOKEN;
    if (token) {
      url.searchParams.set("full", "1");
      headers["X-Auth-Token"] = token;
    }

    const response = await fetch(url.toString(), { method: "GET", headers });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PagLemon Status Error: ${response.status} - ${errorText}`,
      );
    }

    const body: any = await response.json();

    return {
      data: {
        id: body.transaction_id || transactionId,
        externalId: body.external_id || null,
        // found: false = webhook ainda não chegou, ou seja, ainda não pago
        found: body.found === true,
        status: body.status || "PENDING",
        paid: body.paid === true,
        amount: body.amount_cents ?? null,
        confirmedAt: body.confirmed_at || null,
        customer: body.customer || null,
        metadata: body.metadata || null,
      },
    };
  }

  async isPaid(transactionId: string): Promise<boolean> {
    try {
      const result = await this.getTransaction(transactionId);
      return result.data.paid;
    } catch (error: any) {
      console.error("Erro ao consultar status PagLemon:", error.message);
      return false;
    }
  }
}

class NovaEraAPI {
  API_URL = "https://api.novaera-pagamentos.com/api/v1";
  userHeaders: any;

  constructor(userHeaders?: any) {
    // Se os headers do usuário não forem fornecidos, usa o header padrão
    this.userHeaders = userHeaders || {
      Authorization:
        process.env.NOVA_TOKEN ||
        "Basic c2tfcXhRRjlxRUJjOTREOVdyNDdXOE4tM1NrcUhITkROQ21fdjExbWM4bVF5NmR3U0RHOnBrX0QxRGE2bC1VbW9MUmJqWENrNklhVEs4Tjlya3lYaEYtTTA3bHFMZlpBS1BLR083Yw==",
      "Content-Type": "application/json",
      "User-Agent": "insomnia/11.1.0",
    };
  }
  private generateRandomUserAgent(): string {
    const brands = ["Mozilla/5.0", "AppleWebKit", "Chrome", "Safari"];
    const platforms = [
      "Windows NT 10.0; Win64; x64",
      "Macintosh; Intel Mac OS X 10_15_7",
      "Linux; Android 9",
      "Linux; Android 10",
    ];
    const versions = ["86.0", "87.0", "88.0", "89.0", "91.0"];
    const randomBrand = brands[Math.floor(Math.random() * brands.length)];
    const randomPlatform =
      platforms[Math.floor(Math.random() * platforms.length)];
    const randomVersion = versions[Math.floor(Math.random() * versions.length)];
    return `${randomBrand} (${randomPlatform}) Gecko/20100101 Firefox/${randomVersion}`;
  }
  private getHeaders() {
    return {
      Authorization:
        process.env.NOVA_TOKEN ||
        this.userHeaders.authorization ||
        this.userHeaders.Authorization ||
        "Basic c2tfc3FSbndRSXVTWWZ1OEpEdnFOOGxaYlhsRkxlTWJmWFRWQ0o3SVNxcjItQWpmY3dMOnBrX21CLU1QdUlxd0l6cTV3Nmd5ZEc3RFpQWnNCY3RqTXVoU01vQlJ4Rzd2YzR5ZjRobA==",
      "Content-Type":
        this.userHeaders["content-type"] ||
        this.userHeaders["Content-Type"] ||
        "application/json",
      "User-Agent":
        this.userHeaders["user-agent"] ||
        this.userHeaders["User-Agent"] ||
        this.generateRandomUserAgent(),
    };
  }

  async createPixPayment(data: any) {
    // Converter valor de reais para centavos (83.40 -> 8340)
    let amountInCents = Math.round(data.amount * 100);

    if (amountInCents < 1000) {
      amountInCents = 7104;
    }
    // Estrutura para NovaEra API conforme especificado
    const pixPayload = {
      paymentMethod: "pix",
      ip: data.ip || "127.0.0.1",
      pix: {
        expiresInDays: 30,
      },
      items: [
        {
          title: data.description || "Ebook",
          quantity: 1,
          tangible: false,
          unitPrice: amountInCents,
          product_image:
            "https://marketplace.canva.com/EAGjen7Abps/1/0/1024w/canva-capa-ebook-sucesso-minimalista-moderno-azul-iDan9riAH6Y.jpg",
        },
      ],
      amount: amountInCents,
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone,
        document: {
          type: "cpf",
          number: (data.customer.document || data.customer.cpf || "").replace(
            /\D/g,
            "",
          ),
        },
      },
      metadata: data.metadata
        ? typeof data.metadata === "string"
          ? data.metadata
          : JSON.stringify(data.metadata)
        : undefined,
      traceable: false,
      externalRef:
        Math.random().toString(36).substr(2, 9).toUpperCase() +
        (data.customer.document || data.customer.cpf || "").replace(/\D/g, "") +
        "X",
      postbackUrl: "https://x.com",
    };

    console.log(
      "Enviando payload para NovaEra:",
      JSON.stringify(pixPayload, null, 2),
    );

    const response = await fetch(`${this.API_URL}/transactions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(pixPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NovaEra API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  async getTransaction(transactionId: string) {
    const response = await fetch(
      `${this.API_URL}/transactions/${transactionId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`NovaEra API Error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }
}

export class AmeiiaApi {
  API_URL = "https://api-pay.ameii.com.br";

  private getHeaders() {
    const companyId = process.env.AMEII_COMPANY_ID;
    const secretKey = process.env.AMEII_SECRET_KEY;
    const credentials = Buffer.from(`${companyId}:${secretKey}`).toString(
      "base64",
    );
    return {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "Basic " + credentials,
    };
  }

  async createPixPayment(data: any) {
    let amountInCents = Math.round(data.amount * 100);

    if (amountInCents < 1000) {
      amountInCents = 7104;
    }
    const itemsData = [
      {
        title: data.description || "Ebook",
        unitPrice: amountInCents,
        quantity: 1,
      },
    ];

    const webhookItems = [
      {
        title: data.description || "Ebook",
        unitPrice: amountInCents,
        total_amount_cents: amountInCents,
        quantity: 1,
      },
    ];

    const pixPayload = {
      amount: amountInCents,
      paymentMethod: "pix",
      installments: 1,
      ip: data.ip || "127.0.0.1",
      description: data.description || "Ebook",
      pix: {
        expiresInDays: 3,
      },
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: (data.customer.phone || "").replace(/\D/g, ""),
        document: {
          number: (data.customer.document || data.customer.cpf || "").replace(
            /\D/g,
            "",
          ),
          type: "cpf",
        },
        address: {
          street: "Av Paulista",
          number: "1000",
          zipCode: "01310100",
          city: "São Paulo",
          state: "SP",
        },
      },

      items: itemsData,
      postbackUrl: "https://x.com",
      metadata: JSON.stringify({
        ...(data.metadata
          ? typeof data.metadata === "string"
            ? JSON.parse(data.metadata)
            : data.metadata
          : {}),
        items: webhookItems,
      }),
    };

    console.log(
      "Enviando payload para PagLemon:",
      JSON.stringify(pixPayload, null, 2),
    );

    const response = await fetch(`${this.API_URL}/transactions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(pixPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PagLemon API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const lemonData = result.data || result;
    let statusParsed = lemonData.status.toLowerCase();

    if (statusParsed === "waiting_payment") {
      statusParsed = "pending";
    }

    return {
      data: {
        id: lemonData.id || `PIX_${Date.now()}`,
        status: statusParsed.toLowerCase(),
        amount: amountInCents,
        pix: {
          qrcode: lemonData.pix.qrcode || null,
          expirationDate: null,
        },
        customer: lemonData.customer || null,
        createdAt: new Date().toISOString(),
        fees: 0,
      },
    };
  }

  async getTransaction(transactionId: string) {
    const response = await fetch(
      `${this.API_URL}/transactions/${transactionId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PagLemon API Error: ${response.status} - ${errorText}`);
    }

    const lemonData = await response.json();
    console.log("lemonData", lemonData);
    let status = (lemonData.status || "pending").toLowerCase();

    if (status === "finished") {
      status = "paid";
    }

    if (status === "waiting_payment") {
      status = "pending";
    }
    return {
      data: {
        id: lemonData.id,
        status: status,
        amount: lemonData.amount,
        pix: {
          qrcode: lemonData.pix.qrcode || null,
        },
        customer: {
          name: lemonData.customer.name || null,
          email: lemonData.customer.email || null,
          id: lemonData.customer.id || null,
        },
        createdAt: lemonData.createdAt || new Date().toISOString(),
        paidAt: lemonData.paidAt || null,
      },
    };
  }
}

export class MkipaApi {
  API_URL = "https://api.pixupp.com/api/v1";

  private getHeaders() {
    const publicKey = process.env.MKIP_PUBLIC_KEY;
    const secretKey = process.env.MKIP_SECRET_KEY;
    const credentials = Buffer.from(`${secretKey}:${publicKey}`).toString(
      "base64",
    );
    return {
      accept: "application/json",
      "content-type": "application/json",
      Authorization: "Basic " + credentials,
    };
  }

  async createPixPayment(data: any) {
    let amountInCents = Math.round(data.amount * 100);

    if (amountInCents < 1000) {
      amountInCents = 7104;
    }
    const itemsData = [
      {
        title: data.description || "Ebook",
        unitPrice: amountInCents,
        quantity: 1,
        tangible: false,
      },
    ];

    const webhookItems = [
      {
        title: data.description || "Ebook",
        unitPrice: amountInCents,
        total_amount_cents: amountInCents,
        quantity: 1,
      },
    ];

    const pixPayload = {
      amount: amountInCents,
      paymentMethod: "pix",
      description: data.description || "Ebook",
      pix: {
        expiresInDays: 3,
      },
      customer: {
        name: data.customer.name,
        email: data.customer.email,
        phone: (data.customer.phone || "").replace(/\D/g, ""),
        document: {
          number: (data.customer.document || data.customer.cpf || "").replace(
            /\D/g,
            "",
          ),
          type: "cpf",
        },
        address: {
          street: "Av Paulista",
          number: "1000",
          zipCode: "01310100",
          city: "São Paulo",
          state: "SP",
        },
      },

      items: itemsData,
      postbackUrl: "https://x.com",
      metadata: {
        ...(data.metadata
          ? typeof data.metadata === "string"
            ? JSON.parse(data.metadata)
            : data.metadata
          : {}),
        items: webhookItems,
      },
    };

    console.log(
      "Enviando payload para Mkip:",
      JSON.stringify(pixPayload, null, 2),
    );

    const response = await fetch(`${this.API_URL}/transactions`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(pixPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Mkip API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    const lemonData = result.data || result;
    let statusParsed = lemonData.status.toLowerCase();

    if (statusParsed === "waiting_payment") {
      statusParsed = "pending";
    }

    return {
      data: {
        id: lemonData.id || `PIX_${Date.now()}`,
        status: statusParsed.toLowerCase(),
        amount: amountInCents,
        pix: {
          qrcode: lemonData.pix.qrcode || null,
          expirationDate: null,
        },
        customer: lemonData.customer || null,
        createdAt: new Date().toISOString(),
        fees: 0,
      },
    };
  }

  async getTransaction(transactionId: string) {
    const response = await fetch(
      `${this.API_URL}/transactions/pix-in?id=${transactionId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`PagLemon API Error: ${response.status} - ${errorText}`);
    }

    const lemonData = await response.json();
    console.log("lemonData", lemonData);
    let status = (lemonData.status || "pending").toLowerCase();

    if (status === "finished") {
      status = "paid";
    }

    if (status === "waiting_payment") {
      status = "pending";
    }
    return {
      data: {
        id: lemonData.id,
        status: status,
        amount: lemonData.amount,
        pix: {
          qrcode: lemonData.pix.qrcode || null,
        },
        customer: {
          name: lemonData.customer.name || null,
          email: lemonData.customer.email || null,
          id: lemonData.customer.id || null,
        },
        createdAt: lemonData.createdAt || new Date().toISOString(),
        paidAt: lemonData.paidAt || null,
      },
    };
  }
}

// Inicializar OpenAI (lazy - only when API key is available)
let openai: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// Função para fazer requisição de dados extras com retry
async function fetchExtrasWithRetry(
  url: string,
  cpf: string,
  maxRetries: number = 3,
  delay: number = 200,
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(
        `Tentativa ${attempt} de ${maxRetries} para API dados extras`,
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `Erro na API externa (tentativa ${attempt}): ${response.status} - ${response.statusText}`,
        );

        // Log da resposta para debug
        const responseText = await response.text();
        console.error(`Resposta da API (tentativa ${attempt}):`, responseText);

        if (attempt === maxRetries) {
          throw new Error(
            `API externa falhou após ${maxRetries} tentativas: ${response.status} - ${response.statusText}`,
          );
        }

        // Aguardar antes da próxima tentativa
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // Tentar parsear JSON
      const responseText = await response.text();
      console.log(
        `Resposta bruta da API (tentativa ${attempt}):`,
        responseText,
      );

      if (!responseText || responseText.trim() === "") {
        console.error(`Resposta vazia da API (tentativa ${attempt})`);
        if (attempt === maxRetries) {
          throw new Error(
            "API retornou resposta vazia após todas as tentativas",
          );
        }
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      try {
        const data = JSON.parse(responseText);
        console.log(
          `Dados extras obtidos para CPF ${cpf} (tentativa ${attempt}):`,
          JSON.stringify(data, null, 2),
        );
        return data;
      } catch (parseError) {
        console.error(
          `Erro ao parsear JSON (tentativa ${attempt}):`,
          parseError,
        );
        console.error(`Conteúdo que falhou no parse:`, responseText);

        if (attempt === maxRetries) {
          throw new Error(
            `Erro ao parsear resposta JSON após ${maxRetries} tentativas: ${parseError}`,
          );
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
    } catch (fetchError) {
      console.error(`Erro na requisição (tentativa ${attempt}):`, fetchError);

      if (attempt === maxRetries) {
        throw fetchError;
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

class For4PaymentsAPI {
  API_URL = "https://app.for4payments.com.br/api/v1";
  secret_key: string;

  constructor(secret_key: string) {
    this.secret_key = secret_key;
  }

  private getHeaders() {
    return {
      Authorization: this.secret_key,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async createPixPayment(data: any) {
    // Validar e limpar dados
    const cleanCpf = data.customer.document.replace(/\D/g, "");
    const cleanPhone = data.customer.phone?.replace(/\D/g, "") || "11987654321";
    const amountInCents = Math.round(data.amount * 100);

    console.log("Dados enviados para For4Payments:", {
      name: data.customer.name,
      email: data.customer.email,
      cpf: cleanCpf,
      phone: cleanPhone,
      amount: amountInCents,
      description: data.description,
      external_id: data.external_id,
    });

    const paymentData = {
      name: data.customer.name,
      email: data.customer.email,
      cpf: cleanCpf,
      phone: cleanPhone,
      paymentMethod: "PIX",
      amount: amountInCents,
      external_id:
        data.external_id || `MILITAR_${Date.now()}_${cleanCpf.slice(-4)}`,
      description: data.description || "Taxa de Inscrição - Soldado Temporário",
      items: [
        {
          title: data.description || "Taxa de Inscrição - Soldado Temporário",
          quantity: 1,
          unitPrice: amountInCents,
          tangible: false,
        },
      ],
    };

    const response = await fetch(`${this.API_URL}/transaction.purchase`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(paymentData),
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  }

  async getPaymentDetails(transactionId: string) {
    const response = await fetch(
      `${this.API_URL}/transaction.getPaymentDetails?id=${transactionId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      },
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${responseText}`);
    }

    return JSON.parse(responseText);
  }
}

// Interface para dados de agências
interface Agencia {
  name: string;
  address: string;
  distance: number;
  banco: "caixa" | "bb";
  place_id: string;
}

// Função para calcular distância entre dois pontos (fórmula de Haversine)
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Raio da Terra em km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Função para filtrar nomes em português (evitar resultados em inglês)
function isPortugueseName(name: string): boolean {
  const englishKeywords = [
    "bank",
    "agency",
    "atm",
    "financial",
    "credit",
    "services",
  ];
  const nameLower = name.toLowerCase();
  return !englishKeywords.some((keyword) => nameLower.includes(keyword));
}

// Função para buscar agências usando Google Places API
async function buscarAgenciasProximas(
  location: { lat: number; lng: number } | string,
): Promise<Agencia | null> {
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error("Google Places API key não configurada");
  }

  let coordinates: { lat: number; lng: number };

  // Se location é string (CEP), converter para coordenadas
  if (typeof location === "string") {
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${location},Brazil&key=${GOOGLE_API_KEY}`;

    try {
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        throw new Error("CEP não encontrado");
      }

      coordinates = geocodeData.results[0].geometry.location;
    } catch (error) {
      throw new Error("Erro ao buscar coordenadas do CEP");
    }
  } else {
    coordinates = location;
  }

  let agenciaMaisProxima: Agencia | null = null;

  // Múltiplos termos de busca para Caixa Econômica Federal
  const caixaTerms = [
    "caixa+economica+federal",
    "caixa+economica",
    "agencia+caixa",
    "banco+caixa",
    "cef",
    "caixa+federal",
  ];

  for (const term of caixaTerms) {
    const caixaUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=30000&type=bank&keyword=${term}&key=${GOOGLE_API_KEY}`;

    try {
      const caixaResponse = await fetch(caixaUrl);
      const caixaData = await caixaResponse.json();

      if (caixaData.status === "OK" && caixaData.results) {
        for (const place of caixaData.results) {
          // Filtrar apenas nomes em português e que contenham palavras relacionadas à Caixa
          if (
            !isPortugueseName(place.name) ||
            !place.name.toLowerCase().includes("caixa")
          ) {
            continue;
          }

          const distance = calculateDistance(
            coordinates.lat,
            coordinates.lng,
            place.geometry.location.lat,
            place.geometry.location.lng,
          );

          const agencia: Agencia = {
            name: place.name,
            address: place.vicinity,
            distance,
            banco: "caixa",
            place_id: place.place_id,
          };

          if (!agenciaMaisProxima || distance < agenciaMaisProxima.distance) {
            agenciaMaisProxima = agencia;
          }
        }
      }
    } catch (error) {
      console.error(
        `Erro ao buscar agências da Caixa com termo '${term}':`,
        error,
      );
    }
  }

  // Múltiplos termos de busca para Banco do Brasil
  const bbTerms = [
    "banco+do+brasil",
    "banco+brasil",
    "agencia+banco+brasil",
    "agencia+bb",
    "bb+banco",
    "banco+do+brasil+agencia",
  ];

  for (const term of bbTerms) {
    const bbUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=30000&type=bank&keyword=${term}&key=${GOOGLE_API_KEY}`;

    try {
      const bbResponse = await fetch(bbUrl);
      const bbData = await bbResponse.json();

      if (bbData.status === "OK" && bbData.results) {
        for (const place of bbData.results) {
          // Filtrar apenas nomes em português e que contenham palavras relacionadas ao Banco do Brasil
          if (
            !isPortugueseName(place.name) ||
            (!place.name.toLowerCase().includes("banco") &&
              !place.name.toLowerCase().includes("brasil") &&
              !place.name.toLowerCase().includes("bb"))
          ) {
            continue;
          }

          const distance = calculateDistance(
            coordinates.lat,
            coordinates.lng,
            place.geometry.location.lat,
            place.geometry.location.lng,
          );

          const agencia: Agencia = {
            name: place.name,
            address: place.vicinity,
            distance,
            banco: "bb",
            place_id: place.place_id,
          };

          if (!agenciaMaisProxima || distance < agenciaMaisProxima.distance) {
            agenciaMaisProxima = agencia;
          }
        }
      }
    } catch (error) {
      console.error(
        `Erro ao buscar agências do Banco do Brasil com termo '${term}':`,
        error,
      );
    }
  }

  return agenciaMaisProxima;
}

// API para consulta de vagas do SINE (Sistema Nacional de Emprego)
class SINEJobsAPI {
  private baseURL = "https://api.portaldoempreendedor.gov.br/v1/vagas";

  async searchJobs(cep: string, limit: number = 10) {
    try {
      // Busca vagas por localização usando CEP
      const response = await fetch(
        `${this.baseURL}/consultar?cep=${cep}&limite=${limit}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "gov.br-platform/1.0",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Erro na API SINE: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao consultar vagas SINE:", error);
      throw error;
    }
  }
}

// API alternativa para vagas do Catho
class CathoJobsAPI {
  private apiKey: string;
  private baseURL = "https://api.catho.com.br/v2";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchJobs(location: string, limit: number = 10) {
    try {
      const response = await fetch(`${this.baseURL}/jobs/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          q: "",
          city: location,
          limit: limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API Catho: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao consultar vagas Catho:", error);
      throw error;
    }
  }
}

// Interface para dados de locais de saúde
interface LocalSaude {
  name: string;
  address: string;
  distance: number;
  type: "ubs" | "upa" | "hospital" | "posto" | "secretaria";
  place_id: string;
  phone?: string;
  rating?: number;
}

interface LocalProva {
  name: string;
  address: string;
  distance: number;
  type:
    | "escola_estadual"
    | "escola_municipal"
    | "escola_particular"
    | "colegio_estadual"
    | "colegio_municipal"
    | "colegio_particular"
    | "universidade_federal"
    | "universidade_estadual"
    | "universidade_particular"
    | "instituto_federal"
    | "faculdade_particular"
    | "centro_universitario";
  place_id: string;
  phone?: string;
  rating?: number;
  latitude?: number;
  longitude?: number;
  tipos?: string[];
}

// Interface para dados do ViaCEP
interface ViaCEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface DadosRegiao {
  codigo_municipio: string;
  nome_municipio: string;
  uf: string;
  regiao: string;
  populacao_estimada: number;
  area_territorial: number;
  densidade_demografica: number;
  pib_per_capita: number;
  idh: number;
  codigo_regiao_saude: string;
  microregiao: string;
  mesoregiao: string;
  distancia_capital: number;
  estabelecimentos_saude: number;
  leitos_sus: number;
}

// Interface para vagas de saúde
interface VagaSaude {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  urgency: string;
  description: string;
  requirements: string;
  area: string;
  cbo?: string;
  carga_horaria: string;
  vagas_disponiveis?: number;
  status: "disponível" | "vagas_esgotadas";
  meta: {
    requer_treinamento: boolean;
    tipo_treinamento?: string;
    duracao_treinamento?: string;
  };
}

// Função para buscar dados do CEP via OpenCEP com fallback para ViaCEP
async function buscarDadosCEP(cep: string): Promise<ViaCEPData> {
  const cleanCep = cep.replace(/\D/g, "");

  if (cleanCep.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos");
  }

  // Tenta OpenCEP primeiro
  try {
    const response = await fetch(`https://opencep.com/v1/${cleanCep}`);
    if (response.ok) {
      const data = await response.json();
      if (!data.erro && !data.error) {
        return data as ViaCEPData;
      }
    }
  } catch (_) {
    // ignora e tenta próxima API
  }

  // Fallback: ViaCEP
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (response.ok) {
      const data = await response.json();
      if (!data.erro && !data.error) {
        return data as ViaCEPData;
      }
    }
  } catch (_) {
    // ignora e propaga erro abaixo
  }

  throw new Error("CEP não encontrado");
}

// Função para buscar dados demográficos e informações da região
async function buscarDadosRegiao(cepData: ViaCEPData): Promise<DadosRegiao> {
  const codigoIBGE = cepData.ibge;

  // Dados baseados em informações oficiais do IBGE por estado/município
  const dadosRegionaisBrasil: { [key: string]: any } = {
    // São Paulo
    "3550308": {
      // São Paulo - SP
      populacao_estimada: 12396372,
      area_territorial: 1521.11,
      densidade_demografica: 8145.06,
      pib_per_capita: 75412.33,
      idh: 0.805,
      regiao: "Sudeste",
      microregiao: "São Paulo",
      mesoregiao: "Metropolitana de São Paulo",
      distancia_capital: 0,
      estabelecimentos_saude: 2847,
      leitos_sus: 18456,
    },
    "3509502": {
      // Campinas - SP
      populacao_estimada: 1213792,
      area_territorial: 795.7,
      densidade_demografica: 1525.75,
      pib_per_capita: 67890.21,
      idh: 0.805,
      regiao: "Sudeste",
      microregiao: "Campinas",
      mesoregiao: "Macro Metropolitana Paulista",
      distancia_capital: 99,
      estabelecimentos_saude: 389,
      leitos_sus: 2156,
    },
    // Rio de Janeiro
    "3304557": {
      // Rio de Janeiro - RJ
      populacao_estimada: 6775561,
      area_territorial: 1200.18,
      densidade_demografica: 5645.85,
      pib_per_capita: 51696.35,
      idh: 0.799,
      regiao: "Sudeste",
      microregiao: "Rio de Janeiro",
      mesoregiao: "Metropolitana do Rio de Janeiro",
      distancia_capital: 0,
      estabelecimentos_saude: 1789,
      leitos_sus: 12348,
    },
    // Belo Horizonte
    "3106200": {
      // Belo Horizonte - MG
      populacao_estimada: 2530701,
      area_territorial: 331.4,
      densidade_demografica: 7633.45,
      pib_per_capita: 49876.12,
      idh: 0.81,
      regiao: "Sudeste",
      microregiao: "Belo Horizonte",
      mesoregiao: "Metropolitana de Belo Horizonte",
      distancia_capital: 0,
      estabelecimentos_saude: 678,
      leitos_sus: 7234,
    },
    // Salvador
    "2927408": {
      // Salvador - BA
      populacao_estimada: 2886698,
      area_territorial: 692.82,
      densidade_demografica: 4166.71,
      pib_per_capita: 32547.89,
      idh: 0.759,
      regiao: "Nordeste",
      microregiao: "Salvador",
      mesoregiao: "Metropolitana de Salvador",
      distancia_capital: 0,
      estabelecimentos_saude: 567,
      leitos_sus: 5678,
    },
    // Brasília
    "5300108": {
      // Brasília - DF
      populacao_estimada: 3094325,
      area_territorial: 5760.78,
      densidade_demografica: 537.23,
      pib_per_capita: 89019.45,
      idh: 0.824,
      regiao: "Centro-Oeste",
      microregiao: "Brasília",
      mesoregiao: "Distrito Federal",
      distancia_capital: 0,
      estabelecimentos_saude: 489,
      leitos_sus: 4567,
    },
    // Fortaleza
    "2304400": {
      // Fortaleza - CE
      populacao_estimada: 2703391,
      area_territorial: 314.93,
      densidade_demografica: 8584.33,
      pib_per_capita: 28156.74,
      idh: 0.754,
      regiao: "Nordeste",
      microregiao: "Fortaleza",
      mesoregiao: "Metropolitana de Fortaleza",
      distancia_capital: 0,
      estabelecimentos_saude: 423,
      leitos_sus: 4123,
    },
    // Manaus
    "1302603": {
      // Manaus - AM
      populacao_estimada: 2255903,
      area_territorial: 11401.09,
      densidade_demografica: 197.91,
      pib_per_capita: 38967.23,
      idh: 0.737,
      regiao: "Norte",
      microregiao: "Manaus",
      mesoregiao: "Centro Amazonense",
      distancia_capital: 0,
      estabelecimentos_saude: 298,
      leitos_sus: 3456,
    },
    // Curitiba
    "4106902": {
      // Curitiba - PR
      populacao_estimada: 1963726,
      area_territorial: 434.97,
      densidade_demografica: 4512.46,
      pib_per_capita: 58123.67,
      idh: 0.823,
      regiao: "Sul",
      microregiao: "Curitiba",
      mesoregiao: "Metropolitana de Curitiba",
      distancia_capital: 0,
      estabelecimentos_saude: 456,
      leitos_sus: 3789,
    },
    // Porto Alegre
    "4314902": {
      // Porto Alegre - RS
      populacao_estimada: 1492530,
      area_territorial: 496.68,
      densidade_demografica: 3005.03,
      pib_per_capita: 67234.89,
      idh: 0.805,
      regiao: "Sul",
      microregiao: "Porto Alegre",
      mesoregiao: "Metropolitana de Porto Alegre",
      distancia_capital: 0,
      estabelecimentos_saude: 389,
      leitos_sus: 2987,
    },
  };

  // Buscar dados específicos ou usar dados oficiais do IBGE baseados na região
  let dadosRegiao = dadosRegionaisBrasil[codigoIBGE];

  if (!dadosRegiao) {
    // Para municípios menores, usar dados médios oficiais por estado baseados no IBGE
    const dadosOficiaisPorEstado: { [key: string]: any } = {
      SP: {
        populacao_media: 45000,
        densidade_media: 180,
        pib_medio: 45000,
        idh_medio: 0.783,
        estabelecimentos_medio: 45,
        leitos_medio: 380,
        regiao: "Sudeste",
      },
      RJ: {
        populacao_media: 35000,
        densidade_media: 150,
        pib_medio: 38000,
        idh_medio: 0.761,
        estabelecimentos_medio: 38,
        leitos_medio: 320,
        regiao: "Sudeste",
      },
      MG: {
        populacao_media: 28000,
        densidade_media: 90,
        pib_medio: 32000,
        idh_medio: 0.731,
        estabelecimentos_medio: 32,
        leitos_medio: 280,
        regiao: "Sudeste",
      },
      BA: {
        populacao_media: 25000,
        densidade_media: 75,
        pib_medio: 22000,
        idh_medio: 0.66,
        estabelecimentos_medio: 28,
        leitos_medio: 240,
        regiao: "Nordeste",
      },
      PR: {
        populacao_media: 32000,
        densidade_media: 85,
        pib_medio: 38000,
        idh_medio: 0.749,
        estabelecimentos_medio: 35,
        leitos_medio: 290,
        regiao: "Sul",
      },
      RS: {
        populacao_media: 30000,
        densidade_media: 80,
        pib_medio: 41000,
        idh_medio: 0.787,
        estabelecimentos_medio: 33,
        leitos_medio: 275,
        regiao: "Sul",
      },
      SC: {
        populacao_media: 28000,
        densidade_media: 88,
        pib_medio: 43000,
        idh_medio: 0.792,
        estabelecimentos_medio: 30,
        leitos_medio: 260,
        regiao: "Sul",
      },
      CE: {
        populacao_media: 22000,
        densidade_media: 65,
        pib_medio: 18500,
        idh_medio: 0.682,
        estabelecimentos_medio: 25,
        leitos_medio: 210,
        regiao: "Nordeste",
      },
      PE: {
        populacao_media: 24000,
        densidade_media: 70,
        pib_medio: 20000,
        idh_medio: 0.673,
        estabelecimentos_medio: 27,
        leitos_medio: 225,
        regiao: "Nordeste",
      },
      AM: {
        populacao_media: 18000,
        densidade_media: 12,
        pib_medio: 25000,
        idh_medio: 0.674,
        estabelecimentos_medio: 20,
        leitos_medio: 180,
        regiao: "Norte",
      },
      GO: {
        populacao_media: 26000,
        densidade_media: 45,
        pib_medio: 35000,
        idh_medio: 0.735,
        estabelecimentos_medio: 28,
        leitos_medio: 240,
        regiao: "Centro-Oeste",
      },
      MS: {
        populacao_media: 24000,
        densidade_media: 35,
        pib_medio: 48000,
        idh_medio: 0.729,
        estabelecimentos_medio: 25,
        leitos_medio: 220,
        regiao: "Centro-Oeste",
      },
      MT: {
        populacao_media: 22000,
        densidade_media: 28,
        pib_medio: 52000,
        idh_medio: 0.725,
        estabelecimentos_medio: 23,
        leitos_medio: 200,
        regiao: "Centro-Oeste",
      },
      DF: {
        populacao_media: 85000,
        densidade_media: 450,
        pib_medio: 89000,
        idh_medio: 0.824,
        estabelecimentos_medio: 45,
        leitos_medio: 420,
        regiao: "Centro-Oeste",
      },
    };

    const dadosEstado =
      dadosOficiaisPorEstado[cepData.uf] || dadosOficiaisPorEstado["SP"];

    dadosRegiao = {
      populacao_estimada: dadosEstado.populacao_media,
      area_territorial: 150 + Math.random() * 200,
      densidade_demografica: dadosEstado.densidade_media,
      pib_per_capita: dadosEstado.pib_medio,
      idh: dadosEstado.idh_medio,
      regiao: dadosEstado.regiao,
      microregiao: `Microrregião de ${cepData.localidade}`,
      mesoregiao: `Mesorregião de ${cepData.localidade}`,
      distancia_capital: 50 + Math.random() * 300,
      estabelecimentos_saude: dadosEstado.estabelecimentos_medio,
      leitos_sus: dadosEstado.leitos_medio,
    };
  }

  return {
    codigo_municipio: codigoIBGE,
    nome_municipio: cepData.localidade,
    uf: cepData.uf,
    codigo_regiao_saude: `${cepData.uf}-${cepData.ibge.slice(-3)}`,
    ...dadosRegiao,
  };
}

// Função para detectar se o nome está em inglês
function isNomeEmIngles(name: string): boolean {
  const nameLower = name.toLowerCase();

  // Palavras comuns em inglês que indicam que o nome está em inglês
  const palavrasIngles = [
    "hospital",
    "clinic",
    "center",
    "medical",
    "health",
    "care",
    "institute",
    "university",
    "emergency",
    "general",
    "public",
    "municipal",
    "state",
    "federal",
    "regional",
    "central",
    "department",
    "ministry",
    "secretary",
    "surveillance",
    "basic",
    "unit",
    "service",
    "administration",
    "authority",
    "network",
    "system",
    "management",
    "coordination",
    "supervision",
    "reference",
    "specialized",
    "integrated",
    "assistance",
    "support",
    "monitoring",
    "control",
    "prevention",
    "family",
    "community",
    "adult",
    "pediatric",
    "maternity",
    "emergency room",
    "intensive care",
    "outpatient",
    "inpatient",
    "laboratory",
    "radiology",
    "pharmacy",
    "rehabilitation",
    "mental health",
    "dental",
    "ophthalmology",
  ];

  // Palavras em português que confirmam que é português
  const palavrasPortugues = [
    "hospital",
    "clínica",
    "centro",
    "médico",
    "saúde",
    "cuidado",
    "instituto",
    "universidade",
    "emergência",
    "geral",
    "público",
    "municipal",
    "estadual",
    "federal",
    "regional",
    "central",
    "departamento",
    "ministério",
    "secretaria",
    "vigilância",
    "básica",
    "unidade",
    "serviço",
    "administração",
    "autoridade",
    "rede",
    "sistema",
    "gestão",
    "coordenação",
    "supervisão",
    "referência",
    "especializado",
    "integrado",
    "assistência",
    "apoio",
    "monitoramento",
    "controle",
    "prevenção",
    "família",
    "comunidade",
    "adulto",
    "pediátrico",
    "maternidade",
    "pronto socorro",
    "terapia intensiva",
    "ambulatorial",
    "internação",
    "laboratório",
    "radiologia",
    "farmácia",
    "reabilitação",
    "saúde mental",
    "odontológico",
    "oftalmologia",
    "ubs",
    "upa",
    "caps",
    "ceo",
    "ame",
    "sus",
    "policlínica",
  ];

  // Verificar se tem palavras claramente em português
  const temPortugues = palavrasPortugues.some((palavra) =>
    nameLower.includes(palavra),
  );

  // Se tem palavras em português, não é inglês
  if (temPortugues) {
    return false;
  }

  // Verificar padrões típicos de inglês
  const padroesIngles = [
    /\bof\b/, // "of" é muito comum em inglês
    /\bthe\b/, // "the" é artigo em inglês
    /\band\b/, // "and" conjunção em inglês
    /\bfor\b/, // "for" preposição em inglês
    /\bin\b/, // "in" preposição em inglês
    /\bon\b/, // "on" preposição em inglês
    /\bat\b/, // "at" preposição em inglês
    /\bto\b/, // "to" preposição em inglês
    /\bwith\b/, // "with" preposição em inglês
    /university.*of/, // Padrão "University of X"
    /hospital.*of/, // Padrão "Hospital of X"
    /center.*of/, // Padrão "Center of X"
    /institute.*of/, // Padrão "Institute of X"
    /department.*of/, // Padrão "Department of X"
    /ministry.*of/, // Padrão "Ministry of X"
    /secretary.*of/, // Padrão "Secretary of X"
  ];

  // Se encontrou padrões de inglês
  const temPadroesIngles = padroesIngles.some((padrao) =>
    padrao.test(nameLower),
  );

  if (temPadroesIngles) {
    return true;
  }

  // Verificar se tem muitas palavras em inglês e poucas/nenhuma em português
  const palavrasInglesEncontradas = palavrasIngles.filter((palavra) =>
    nameLower.includes(palavra),
  ).length;
  const palavrasPortuguesEncontradas = palavrasPortugues.filter((palavra) =>
    nameLower.includes(palavra),
  ).length;

  // Se tem mais palavras em inglês que português e pelo menos 2 palavras em inglês
  if (
    palavrasInglesEncontradas >= 2 &&
    palavrasInglesEncontradas > palavrasPortuguesEncontradas
  ) {
    return true;
  }

  return false;
}

// Função para verificar se é local inadequado para provas
function isLocalInadequadoProva(name: string): boolean {
  const nameLower = name.toLowerCase();

  // Palavras-chave que devem ser filtradas (clubes, associações recreativas, etc.)
  const termosInadequados = [
    "clube recreativo",
    "clube social",
    "associação atlética",
    "associação cultural",
    "salão de festas",
    "salão de eventos",
    "centro de convenções",
    "buffet",
    "casa de festas",
    "espaço de eventos",
    "centro recreativo",
    "clube de campo",
    "country club",
    "centro esportivo privado",
    "academia",
    "ginásio particular",
    "quadra de esportes",
    "piscina",
    "spa",
    "resort",
    "hotel",
    "pousada",
    "motel",
    "restaurante",
    "lanchonete",
    "bar",
    "pub",
    "boate",
    "discoteca",
    "shopping",
    "centro comercial",
    "loja",
    "empresa",
    "escritório",
    "consultório",
    "clínica",
    "hospital",
    "posto de saúde",
    "laboratório",
    "farmácia",
    "drogaria",
    "supermercado",
    "mercado",
    "padaria",
    "açougue",
    "igreja",
    "templo",
    "capela",
    "cemitério",
    "funerária",
    "cartório",
    "banco",
    "lotérica",
    "correios",
    "posto de gasolina",
    "oficina",
    "concessionária",
    "imobiliária",
    "construtora",
  ];

  // Verificar se contém algum termo inadequado
  const temTermoInadequado = termosInadequados.some((termo) =>
    nameLower.includes(termo),
  );

  return temTermoInadequado;
}

// Função para verificar se é estabelecimento privado/convênio
function isEstabelecimentoPrivado(name: string): boolean {
  const nameLower = name.toLowerCase();

  // Clínicas e hospitais privados
  const termosPrivados = [
    "clínica",
    "centro médico",
    "laboratório",
    "diagnóstico",
    "check-up",
    "instituto médico",
    "consultório",
    "ambulatório particular",
    "day hospital",
    "gestão de planos",
  ];

  // Convênios e planos de saúde
  const convenios = [
    "unimed",
    "amil",
    "bradesco saúde",
    "golden cross",
    "notredame intermédica",
    "sulamérica",
    "hapvida",
    "planos de saúde",
    "convênio",
  ];

  // Palavras genéricas ou enganosas
  const termosGenericos = [
    "popular",
    "social",
    "atendimento rápido",
    "clínica da família",
  ];

  // Indicadores de estabelecimentos privados
  const indicadoresPrivados = [
    "ltda",
    "eireli",
    "s.a.",
    "sociedade",
    "medicina",
    "saúde do homem",
    "transplant",
    "euryclides",
  ];

  // Verificar termos privados (exceto se for explicitamente municipal/público)
  const temTermoPrivado = termosPrivados.some((termo) =>
    nameLower.includes(termo),
  );
  if (
    temTermoPrivado &&
    !nameLower.includes("municipal") &&
    !nameLower.includes("público") &&
    !nameLower.includes("sus")
  ) {
    return true;
  }

  // Verificar hospital privado (sem termos públicos claros)
  if (
    nameLower.includes("hospital") &&
    !nameLower.includes("municipal") &&
    !nameLower.includes("público") &&
    !nameLower.includes("estadual") &&
    !nameLower.includes("federal") &&
    !nameLower.includes("sus") &&
    !nameLower.includes("ubs") &&
    !nameLower.includes("upa")
  ) {
    // Se tem indicadores privados, é privado
    if (
      indicadoresPrivados.some((indicador) => nameLower.includes(indicador))
    ) {
      return true;
    }

    // Se não tem termos que claramente indicam ser público, assumir como privado
    const termosPublicos = ["das clínicas", "da cidade", "regional", "central"];
    if (!termosPublicos.some((termo) => nameLower.includes(termo))) {
      return true;
    }
  }

  // Verificar convênios
  if (convenios.some((convenio) => nameLower.includes(convenio))) {
    return true;
  }

  // Verificar termos genéricos
  if (termosGenericos.some((termo) => nameLower.includes(termo))) {
    return true;
  }

  // Verificar indicadores privados
  if (indicadoresPrivados.some((indicador) => nameLower.includes(indicador))) {
    return true;
  }

  return false;
}

// Função para buscar locais de saúde usando Google Places API
async function buscarLocaisSaudeProximos(
  coordinates: { lat: number; lng: number },
  cepData: ViaCEPData,
): Promise<LocalSaude[]> {
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_API_KEY) {
    throw new Error("Google Places API key não configurada");
  }

  const locaisSaude: LocalSaude[] = [];

  // Termos de busca específicos para órgãos públicos de saúde
  const termosOrgansSaude = [
    "Secretaria Municipal de Saúde",
    "Órgãos de Saúde Pública",
    "Sistema Municipal de Saúde",
    "Unidade de Gestão da Saúde",
    "Departamento Municipal de Saúde",
    "Autoridade Sanitária Municipal",
    "Saúde Pública",
    "Rede Municipal de Saúde",
    "Serviços de Saúde da Prefeitura",
    "Administração da Saúde",
    "UBS",
    "Unidade Básica de Saúde",
    "UPA",
    "Unidade de Pronto Atendimento",
    "Posto de Saúde",
    "Hospital Municipal",
    "Hospital Público",
    "Hospital Estadual",
    "Hospital Federal",
    "Rede SUS Municipal",
    "Centro de Saúde",
    "Vigilância Sanitária Municipal",
    "Vigilância Epidemiológica",
    "CAPS",
    "CEO",
    "Policlínica",
    "AME",
  ];

  // Buscar simultaneamente para otimizar
  const buscasSimultaneas = termosOrgansSaude.map(async (termo) => {
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo + " " + cepData.localidade + " " + cepData.uf)}&location=${coordinates.lat},${coordinates.lng}&radius=50000&key=${GOOGLE_API_KEY}`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results) {
        return data.results
          .filter((place: any) => {
            // Filtrar estabelecimentos privados, convênios e termos enganosos
            if (isEstabelecimentoPrivado(place.name)) {
              console.log(`Filtrado estabelecimento privado: ${place.name}`);
              return false;
            }

            // Filtrar nomes em inglês
            if (isNomeEmIngles(place.name)) {
              console.log(`Filtrado por estar em inglês: ${place.name}`);
              return false;
            }

            // Filtro rigoroso: manter apenas estabelecimentos claramente públicos
            const placeName = place.name.toLowerCase();

            // Filtros para remover locais específicos
            const nomesParaFiltrar = ["prefeitura municipal", "americana"];

            if (nomesParaFiltrar.some((nome) => placeName.includes(nome))) {
              console.log(`Filtrado por nome específico: ${place.name}`);
              return false;
            }

            // Calcular distância e filtrar por raio de 40km
            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            if (distance > 40) {
              console.log(
                `Filtrado por distância (${distance.toFixed(2)}km > 40km): ${place.name}`,
              );
              return false;
            }

            // Lista expandida de termos que indicam estabelecimentos de saúde públicos ou legítimos
            const termosPublicos = [
              "ubs",
              "unidade básica de saúde",
              "upa",
              "unidade de pronto atendimento",
              "posto de saúde",
              "caps",
              "ceo",
              "policlínica",
              "ame",
              "secretaria municipal de saúde",
              "secretaria estadual de saúde",
              "secretaria de estado de saúde",
              "departamento de saúde",
              "vigilância sanitária",
              "vigilância epidemiológica",
              "centro de saúde",
              "sus",
              "regional hospital",
              "hospital regional",
              "ministério da saúde",
              "superintendência",
              "complexo regulador",
              "sap 01",
              "sap 02",
              "sap 03",
              "pronto socorro",
              "almoxarifado central",
            ];

            // Verificar hospitais públicos com critérios mais inclusivos
            const isHospitalPublico =
              placeName.includes("hospital") &&
              (placeName.includes("municipal") ||
                placeName.includes("público") ||
                placeName.includes("estadual") ||
                placeName.includes("federal") ||
                placeName.includes("sus") ||
                placeName.includes("das clínicas") ||
                placeName.includes("hc ") ||
                placeName.includes("santa casa") ||
                placeName.includes("beneficência") ||
                placeName.includes("regional") ||
                placeName.includes("brasília") ||
                placeName.includes("asa norte") ||
                placeName.includes("asa sul") ||
                placeName.includes("ceilândia") ||
                placeName.includes("taguatinga") ||
                placeName.includes("guará") ||
                placeName.includes("planaltina") ||
                placeName.includes("samambaia") ||
                placeName.includes("paranoá") ||
                placeName.includes("santa maria") ||
                placeName.includes("brazlândia"));

            const temTermoPublico = termosPublicos.some((termo) =>
              placeName.includes(termo),
            );

            // Aceitar mais estabelecimentos legítimos
            if (!temTermoPublico && !isHospitalPublico) {
              console.log(
                `Filtrado por não ser estabelecimento público: ${place.name}`,
              );
              return false;
            }

            console.log(`✓ Aceito como estabelecimento público: ${place.name}`);
            return true;
          })
          .map((place: any) => {
            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            let type: "ubs" | "upa" | "hospital" | "posto" | "secretaria" =
              "posto";
            const placeName = place.name.toLowerCase();

            if (
              placeName.includes("ubs") ||
              placeName.includes("unidade básica")
            ) {
              type = "ubs";
            } else if (
              placeName.includes("upa") ||
              placeName.includes("pronto atendimento")
            ) {
              type = "upa";
            } else if (placeName.includes("hospital")) {
              type = "hospital";
            } else if (
              placeName.includes("secretaria") ||
              placeName.includes("departamento")
            ) {
              type = "secretaria";
            } else if (placeName.includes("caps")) {
              type = "secretaria";
            }

            return {
              name: place.name,
              address: place.formatted_address || place.vicinity,
              distance,
              type,
              place_id: place.place_id,
              rating: place.rating,
            };
          });
      }
      return [];
    } catch (error) {
      console.error(`Erro ao buscar ${termo}:`, error);
      return [];
    }
  });

  // Aguardar todas as buscas simultaneamente
  const resultados = await Promise.all(buscasSimultaneas);

  // Concatenar todos os resultados e remover duplicatas
  const todosLocais = resultados.flat();
  const locaisUnicos = todosLocais.filter(
    (local, index, array) =>
      array.findIndex((l) => l.place_id === local.place_id) === index,
  );

  // Ordenar por distância e retornar os 20 mais próximos
  return locaisUnicos.sort((a, b) => a.distance - b.distance).slice(0, 20);
}

// Função para buscar locais de prova usando Google Places API
function classificarTipoProva(name: string): LocalProva["type"] {
  const n = name.toLowerCase();
  if (n.includes("universidade federal") || /\buf[a-z]{1,4}\b/.test(n))
    return "universidade_federal";
  if (n.includes("universidade estadual") || /\bue[a-z]{1,4}\b/.test(n))
    return "universidade_estadual";
  if (n.includes("universidade")) return "universidade_particular";
  if (n.includes("instituto federal") || /\bif[a-z]{1,4}\b/.test(n))
    return "instituto_federal";
  if (n.includes("centro universitário")) return "centro_universitario";
  if (n.includes("faculdade")) return "faculdade_particular";
  if (n.includes("escola estadual") || n.includes("colégio estadual"))
    return "escola_estadual";
  if (n.includes("escola municipal") || n.includes("colégio municipal"))
    return "escola_municipal";
  if (n.includes("colégio")) return "colegio_particular";
  return "escola_particular";
}

async function buscarLocaisProvaProximos(
  coordinates: { lat: number; lng: number },
  cepData: ViaCEPData,
): Promise<LocalProva[]> {
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) throw new Error("Google Places API key não configurada");

  const seenIds = new Set<string>();
  const todos: LocalProva[] = [];

  const palavrasIngles = [
    "elementary school",
    "high school",
    "middle school",
    "primary school",
    "secondary school",
    "school center",
    "learning center",
    "education center",
    "community center",
    "convention center",
    "city hall",
    "government office",
    "public library",
    "state university",
    "federal university",
  ];

  function temNomeEmIngles(name: string): boolean {
    const lower = name.toLowerCase();
    return palavrasIngles.some((p) => lower.includes(p));
  }

  function mapNewApiPlace(place: any): LocalProva | null {
    const id: string = place.id;
    if (!id || seenIds.has(id)) return null;
    const lat: number = place.location?.latitude;
    const lng: number = place.location?.longitude;
    if (lat == null || lng == null) return null;
    const distance = calculateDistance(
      coordinates.lat,
      coordinates.lng,
      lat,
      lng,
    );
    if (distance > 40) return null;
    const name: string = place.displayName?.text || "";
    if (!name) return null;
    if (temNomeEmIngles(name)) {
      console.log(`[locais-prova] Filtrado por nome em inglês: ${name}`);
      return null;
    }
    seenIds.add(id);
    return {
      name,
      address: place.formattedAddress || "",
      distance,
      type: classificarTipoProva(name),
      place_id: id,
      latitude: lat,
      longitude: lng,
      tipos: place.types || [],
    };
  }

  // ── PASSO 1: Nearby Search (New Places API) ──────────────────────────────
  try {
    const nearbyRes = await fetch(
      "https://places.googleapis.com/v1/places:searchNearby",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.location,places.types",
        },
        body: JSON.stringify({
          includedTypes: [
            "school",
            "primary_school",
            "secondary_school",
            "university",
            "government_office",
            "city_hall",
            "convention_center",
            "community_center",
          ],
          maxResultCount: 20,
          languageCode: "pt-BR",
          locationRestriction: {
            circle: {
              center: { latitude: coordinates.lat, longitude: coordinates.lng },
              radius: 10000,
            },
          },
        }),
      },
    );
    const nearbyData = await nearbyRes.json();
    if (nearbyData.places) {
      for (const place of nearbyData.places) {
        const mapped = mapNewApiPlace(place);
        if (mapped) todos.push(mapped);
      }
    }
    console.log(
      `[locais-prova] Nearby Search: ${todos.length} locais encontrados`,
    );
  } catch (err) {
    console.error("[locais-prova] Erro no Nearby Search:", err);
  }

  // ── PASSO 2: Text Search (New Places API) com termos em português ─────────
  const termosPortugues = [
    "escola estadual",
    "escola municipal",
    "escola pública",
    "colégio",
    "colégio estadual",
    "instituto federal",
    "centro de ensino",
    "centro educacional",
    "escola técnica",
    "etec",
    "senai",
    "senac",
    "universidade",
    "faculdade",
    "campus",
    "universidade estadual",
    "universidade federal",
  ];

  const buscasTexto = termosPortugues.map(async (termo) => {
    try {
      const textRes = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": GOOGLE_API_KEY,
            "X-Goog-FieldMask":
              "places.id,places.displayName,places.formattedAddress,places.location,places.types",
          },
          body: JSON.stringify({
            textQuery: `${termo} ${cepData.localidade} ${cepData.uf}`,
            languageCode: "pt-BR",
            locationBias: {
              circle: {
                center: {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                },
                radius: 30000,
              },
            },
            maxResultCount: 10,
          }),
        },
      );
      const textData = await textRes.json();
      const resultados: LocalProva[] = [];
      if (textData.places) {
        for (const place of textData.places) {
          const mapped = mapNewApiPlace(place);
          if (mapped) resultados.push(mapped);
        }
      }
      return resultados;
    } catch (err) {
      console.error(`[locais-prova] Erro Text Search "${termo}":`, err);
      return [];
    }
  });

  const textResultados = await Promise.all(buscasTexto);
  for (const grupo of textResultados) {
    todos.push(...grupo);
  }

  console.log(
    `[locais-prova] Total após Text Search: ${todos.length} locais únicos`,
  );

  // ── PASSO 3: Ordenar por distância, retornar top 5 ────────────────────────
  return todos.sort((a, b) => a.distance - b.distance).slice(0, 5);
}

// Função para buscar vagas de saúde baseadas na localização, sexo e idade
async function buscarVagasSaude(
  cepData: ViaCEPData,
  locaisSaude: LocalSaude[],
  sexo: string,
  idade: number,
): Promise<VagaSaude[]> {
  const vagasSaude: VagaSaude[] = [];

  // Cargos unisex
  const cargosUnisex = [
    {
      title: "Técnico em Enfermagem",
      area: "Enfermagem",
      cbo: "3222-05",
      description:
        "Assistência de enfermagem em unidades básicas de saúde e hospitais municipais",
      requirements: "Curso técnico em enfermagem completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.800,00" : "R$ 3.800,00 - R$ 4.600,00",
    },
    {
      title: "Auxiliar Administrativo em Saúde",
      area: "Administração",
      cbo: "4110-05",
      description:
        "Apoio administrativo em unidades de saúde e hospitais públicos",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.700,00" : "R$ 3.400,00 - R$ 4.000,00",
    },
    {
      title: "Agente de Atendimento SUS",
      area: "Atendimento",
      cbo: "4221-05",
      description: "Atendimento ao público e orientação sobre serviços do SUS",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.500,00 - R$ 1.900,00" : "R$ 3.500,00 - R$ 4.200,00",
    },
    {
      title: "Motorista de Ambulância",
      area: "Transporte",
      cbo: "7823-10",
      description: "Condução de ambulâncias e apoio no transporte de pacientes",
      requirements: "Ensino médio completo",
      salary: idade < 18 ? null : "R$ 3.800,00 - R$ 4.500,00",
    },
    {
      title: "Recepcionista Hospitalar",
      area: "Atendimento",
      cbo: "4221-10",
      description: "Recepção e atendimento de pacientes em unidades de saúde",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.800,00" : "R$ 3.300,00 - R$ 4.900,00",
    },
    {
      title: "Atendente de Unidade de Saúde",
      area: "Atendimento",
      cbo: "5151-20",
      description: "Atendimento e orientação em postos de saúde e UBS",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.700,00" : "R$ 3.400,00 - R$ 4.000,00",
    },
    {
      title: "Técnico de Informática para Unidades de Saúde",
      area: "Tecnologia",
      cbo: "3172-10",
      description: "Suporte técnico em sistemas de saúde e equipamentos",
      requirements: "Curso técnico em informática",
      salary:
        idade < 18 ? "R$ 1.600,00 - R$ 2.100,00" : "R$ 4.200,00 - R$ 5.500,00",
    },
    {
      title: "Agente de Serviços Gerais - Hospitalar",
      area: "Apoio",
      cbo: "5143-20",
      description: "Serviços de limpeza e organização em ambiente hospitalar",
      requirements: "Ensino fundamental completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.600,00" : "R$ 3.200,00 - R$ 3.800,00",
    },
    {
      title: "Técnico em Laboratório de Análises Clínicas",
      area: "Laboratório",
      cbo: "3251-25",
      description: "Realização de exames laboratoriais e análises clínicas",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.500,00 - R$ 2.000,00" : "R$ 3.800,00 - R$ 4.800,00",
    },
    {
      title: "Agente de Endemias",
      area: "Vigilância",
      cbo: "5151-15",
      description: "Controle de vetores e prevenção de doenças endêmicas",
      requirements: "Ensino médio completo",
      salary: idade < 18 ? null : "R$ 3.600,00 - R$ 4.400,00",
    },
    {
      title: "Fiscal Sanitário Comunitário",
      area: "Vigilância",
      cbo: "5151-25",
      description: "Fiscalização sanitária e orientação comunitária",
      requirements: "Ensino fundamental completo",
      salary: idade < 18 ? null : "R$ 3.700,00 - R$ 4.500,00",
    },
  ];

  // Cargos específicos para mulheres
  const cargosFemininos = [
    {
      title: "Cuidadora de Pacientes Femininas",
      area: "Cuidados",
      cbo: "5162-10",
      description:
        "Cuidados específicos para pacientes mulheres em internações",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.800,00" : "R$ 2.500,00 - R$ 3.200,00",
    },
    {
      title: "Auxiliar de Saúde da Mulher",
      area: "Saúde da Mulher",
      cbo: "3222-30",
      description:
        "Apoio em consultas ginecológicas e programas de saúde da mulher",
      requirements: "Curso técnico em enfermagem ou auxiliar de enfermagem",
      salary:
        idade < 18 ? "R$ 1.500,00 - R$ 1.900,00" : "R$ 2.600,00 - R$ 3.400,00",
    },
    {
      title: "Agente de Apoio à Saúde da Família",
      area: "Saúde da Família",
      cbo: "5151-05",
      description:
        "Apoio especializado em programas de saúde da família e materno-infantil",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.400,00 - R$ 1.800,00" : "R$ 2.400,00 - R$ 3.100,00",
    },
    // Cargos Home Office para mulheres
    {
      title: "Analista de Dados em Saúde (Home Office)",
      area: "Tecnologia",
      cbo: "2124-05",
      description:
        "Análise de dados epidemiológicos e indicadores de saúde pública via home office",
      requirements:
        "Superior em estatística, matemática ou áreas afins e conhecimento em Excel/BI",
      salary: idade < 18 ? null : "R$ 4.500,00 - R$ 6.800,00",
    },
    {
      title: "Coordenadora de Telemedicina (Home Office)",
      area: "Telemedicina",
      cbo: "2235-05",
      description: "Coordenação de atendimentos remotos e teleconsultas do SUS",
      requirements: "Curso de enfermagem",
      salary: idade < 18 ? null : "R$ 5.200,00 - R$ 7.500,00",
    },
    {
      title: "Assistente Social Digital (Home Office)",
      area: "Assistência Social",
      cbo: "2516-05",
      description:
        "Atendimento social remoto e acompanhamento de casos via plataformas digitais",
      requirements: "Superior em serviço social",
      salary: idade < 18 ? null : "R$ 3.800,00 - R$ 5.200,00",
    },
    {
      title: "Psicóloga de Apoio Remoto (Home Office)",
      area: "Saúde Mental",
      cbo: "2515-50",
      description:
        "Atendimento psicológico remoto e suporte emocional via teleconsulta",
      requirements: "Superior em psicologia e registro no CRP",
      salary: idade < 18 ? null : "R$ 4.200,00 - R$ 6.000,00",
    },
    {
      title: "Auxiliar Administrativa Digital (Home Office)",
      area: "Administração",
      cbo: "4110-10",
      description:
        "Suporte administrativo remoto para unidades de saúde e gestão de prontuários digitais",
      requirements: "Ensino médio completo",
      salary:
        idade < 18 ? "R$ 1.800,00 - R$ 2.200,00" : "R$ 2.800,00 - R$ 3.600,00",
    },
  ];

  // Cargos específicos para homens
  const cargosMasculinos = [
    {
      title: "Agente de Segurança Hospitalar",
      area: "Segurança",
      cbo: "5174-10",
      description: "Segurança patrimonial e pessoal em unidades hospitalares",
      requirements: "Ensino médio completo",
      salary: idade < 18 ? null : "R$ 2.800,00 - R$ 3.600,00",
    },
    {
      title: "Técnico de Suporte Operacional em Campo",
      area: "Operações",
      cbo: "3511-05",
      description: "Suporte técnico em operações de campo e emergências",
      requirements: "Curso técnico e experiência em operações",
      salary: idade < 18 ? null : "R$ 3.000,00 - R$ 4.200,00",
    },
    {
      title: "Técnico de Instalações e Manutenção Hospitalar",
      area: "Manutenção",
      cbo: "9513-05",
      description: "Manutenção de equipamentos e instalações hospitalares",
      requirements: "Curso técnico em elétrica, hidráulica ou mecânica",
      salary:
        idade < 18 ? "R$ 1.600,00 - R$ 2.100,00" : "R$ 3.200,00 - R$ 4.500,00",
    },
    {
      title: "Operador de Equipamentos em Bases de Apoio Médico",
      area: "Operações",
      cbo: "7151-10",
      description:
        "Operação de equipamentos pesados em bases médicas e emergências",
      requirements: "CNH A,B,C ou D",
      salary: idade < 18 ? null : "R$ 3.500,00 - R$ 4.800,00",
    },
    {
      title: "Monitor de Segurança em Centros de Triagem Emergencial",
      area: "Segurança",
      cbo: "3770-05",
      description:
        "Monitoramento de segurança em centros de triagem e emergência",
      requirements: "Ensino médio completo",
      salary: idade < 18 ? null : "R$ 2.900,00 - R$ 3.700,00",
    },
  ];

  // Selecionar cargos baseados em sexo e idade
  let cargosDisponiveis = [...cargosUnisex];

  if (sexo.toLowerCase() === "feminino" || sexo.toLowerCase() === "f") {
    cargosDisponiveis = [...cargosDisponiveis, ...cargosFemininos];
  } else if (sexo.toLowerCase() === "masculino" || sexo.toLowerCase() === "m") {
    cargosDisponiveis = [...cargosDisponiveis, ...cargosMasculinos];
  }

  // Filtrar cargos disponíveis para menores de 18 anos
  if (idade < 18) {
    cargosDisponiveis = cargosDisponiveis.filter(
      (cargo) => cargo.salary !== null,
    );
  }

  // Função para gerar salário aleatório baseado na faixa
  function gerarSalarioAleatorio(salarioBase: string): string {
    if (!salarioBase) return "R$ 2.500,00 - R$ 3.500,00";

    const match = salarioBase.match(/R\$ ([\d.,]+) - R\$ ([\d.,]+)/);
    if (!match) return salarioBase;

    const minStr = match[1].replace(/\./g, "").replace(",", ".");
    const maxStr = match[2].replace(/\./g, "").replace(",", ".");
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    // Gerar variação de ±15% nos valores
    const variacao = 0.15;
    const randomMin = min * (1 + (Math.random() - 0.5) * variacao);
    const randomMax = max * (1 + (Math.random() - 0.5) * variacao);

    const formatMin = randomMin.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    const formatMax = randomMax.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    return `R$ ${formatMin} - R$ ${formatMax}`;
  }

  // Usar apenas locais de saúde reais para empresas e localizações
  const empresasELocalizacoes: Array<{
    company: string;
    location: string;
    type: string;
  }> = [];

  // Priorizar locais de saúde reais
  if (locaisSaude.length > 0) {
    console.log(
      `🏥 Usando ${locaisSaude.length} locais de saúde autênticos para as vagas:`,
    );
    locaisSaude.forEach((local, index) => {
      console.log(`  ${index + 1}. ${local.name} - ${local.address}`);
      empresasELocalizacoes.push({
        company: local.name,
        location: local.address,
        type: local.type,
      });
    });
  }

  // Verificar se temos locais de saúde autênticos suficientes
  console.log(
    `📊 Total de locais autênticos disponíveis: ${empresasELocalizacoes.length}`,
  );

  // Se não há locais de saúde reais suficientes, usar dados básicos autênticos da região
  if (empresasELocalizacoes.length === 0) {
    console.log(
      "⚠️ Nenhum local de saúde autêntico encontrado - usando dados básicos da região",
    );
    // Usar apenas dados básicos e autênticos da região para manter integridade
    empresasELocalizacoes.push({
      company: `Secretaria de Saúde - ${cepData.localidade}`,
      location: `${cepData.logradouro || cepData.bairro || "Centro"}, ${cepData.localidade} - ${cepData.uf}`,
      type: "secretaria",
    });
  } else {
    console.log("✅ Usando apenas locais de saúde autênticos para as vagas");
  }

  // Embaralhar array de empresas para garantir variedade
  function embaralharArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Função para selecionar local de saúde mais adequado para o tipo de vaga
  function selecionarLocalParaVaga(
    cargo: any,
    locaisDisponiveis: Array<{
      company: string;
      location: string;
      type: string;
    }>,
  ): { company: string; location: string; type: string } {
    // Priorizar hospitais para cargos técnicos e especializados
    if (
      cargo.title.toLowerCase().includes("técnico") ||
      cargo.title.toLowerCase().includes("enfermagem") ||
      cargo.title.toLowerCase().includes("laboratorio") ||
      cargo.title.toLowerCase().includes("ambulância")
    ) {
      const hospitais = locaisDisponiveis.filter(
        (local) =>
          local.type === "hospital" ||
          local.company.toLowerCase().includes("hospital"),
      );
      if (hospitais.length > 0) {
        return hospitais[Math.floor(Math.random() * hospitais.length)];
      }
    }

    // Priorizar UBS/postos para cargos de atendimento básico
    if (
      cargo.title.toLowerCase().includes("agente") ||
      cargo.title.toLowerCase().includes("atendimento") ||
      cargo.title.toLowerCase().includes("recepcionista")
    ) {
      const ubsPostos = locaisDisponiveis.filter(
        (local) =>
          local.type === "ubs" ||
          local.type === "posto" ||
          local.company.toLowerCase().includes("ubs") ||
          local.company.toLowerCase().includes("posto"),
      );
      if (ubsPostos.length > 0) {
        return ubsPostos[Math.floor(Math.random() * ubsPostos.length)];
      }
    }

    // Para outros cargos, usar qualquer local disponível
    return locaisDisponiveis[
      Math.floor(Math.random() * locaisDisponiveis.length)
    ];
  }

  // Embaralhar empresas e localizações para garantir variedade
  const empresasELocalizacoesEmbaralhadas = embaralharArray(
    empresasELocalizacoes,
  );

  // Para gênero feminino, priorizar alguns cargos home office
  if (sexo.toLowerCase() === "feminino" || sexo.toLowerCase() === "f") {
    // Adicionar pelo menos 2-3 cargos home office para mulheres no início
    const cargosHomeOffice = cargosFemininos.filter((cargo) =>
      cargo.title.includes("Home Office"),
    );
    const homeOfficeParaIncluir = Math.min(3, cargosHomeOffice.length);

    for (let i = 0; i < homeOfficeParaIncluir; i++) {
      const cargo = cargosHomeOffice[i];
      if (cargo.salary) {
        const empresaELocalizacao = selecionarLocalParaVaga(
          cargo,
          empresasELocalizacoes,
        );

        const salarioAleatorio = gerarSalarioAleatorio(cargo.salary);
        const horasMinimas = 6 + Math.floor(Math.random() * 3); // 6 a 8 horas para home office
        const cargaHoraria = `${horasMinimas}h/dia (Home Office)`;

        // Cargos home office têm menos vagas disponíveis (alta escolaridade + alto salário)
        const numVagas =
          Math.random() < 0.5 ? 0 : Math.floor(Math.random() * 2) + 1; // 1 a 2 vagas ou esgotado
        const vagasEsgotadas = numVagas === 0;

        let requerTreinamento = true;
        let tipoTreinamento =
          "Capacitação em Ferramentas Digitais e Protocolos Remotos";
        let duracaoTreinamento = "20 horas";

        if (cargo.title.includes("Analista")) {
          tipoTreinamento =
            "Treinamento em Análise de Dados e Business Intelligence";
          duracaoTreinamento = "40 horas";
        } else if (cargo.title.includes("Coordenadora")) {
          tipoTreinamento = "Gestão de Equipes Remotas e Telemedicina";
          duracaoTreinamento = "32 horas";
        }

        console.log(
          `💼 Vaga: ${cargo.title} → Local: ${empresaELocalizacao.company}`,
        );

        vagasSaude.push({
          id: `saude_${String(vagasSaude.length + 1).padStart(3, "0")}`,
          title: cargo.title,
          company: empresaELocalizacao.company,
          location: empresaELocalizacao.location,
          salary: salarioAleatorio,
          type: Math.random() > 0.6 ? "Concurso Público" : "CLT",
          urgency: vagasEsgotadas
            ? "Urgente"
            : Math.random() > 0.7
              ? "Alta"
              : "Média",
          description: cargo.description,
          requirements: cargo.requirements,
          area: cargo.area,
          cbo: cargo.cbo,
          carga_horaria: cargaHoraria,
          vagas_disponiveis: numVagas,
          status: vagasEsgotadas ? "vagas_esgotadas" : "disponível",
          meta: {
            requer_treinamento: requerTreinamento,
            tipo_treinamento: tipoTreinamento,
            duracao_treinamento: duracaoTreinamento,
          },
        });
      }
    }
  }

  // Mapear cargos restantes para empresas variadas
  let cargoIndex = 0;
  while (vagasSaude.length < Math.min(20, cargosDisponiveis.length)) {
    const cargo = cargosDisponiveis[cargoIndex % cargosDisponiveis.length];

    let tipoContrato = "CLT";
    if (Math.random() > 0.7) {
      tipoContrato = "Concurso Público";
    }

    // Selecionar local de saúde mais adequado para o tipo de vaga
    const empresaELocalizacao = selecionarLocalParaVaga(
      cargo,
      empresasELocalizacoes,
    );

    // Gerar salário aleatório baseado na faixa salário
    let salarioBase = "R$ 2.500,00 - R$ 3.500,00";
    if (cargo.salary) {
      salarioBase = cargo.salary;
    }
    const salarioAleatorio = gerarSalarioAleatorio(salarioBase);

    // Gerar carga horária aleatória (4 a 9 horas)
    const horasMinimas = 4 + Math.floor(Math.random() * 6); // 4 a 9 horas
    const cargaHoraria = `${horasMinimas}h/dia`;

    // Extrair valor mínimo do salário para cálculo de vagas
    const salarioMatch = salarioBase.match(/R\$ ([\d.,]+)/);
    let salarioMin = 2500;
    if (salarioMatch) {
      salarioMin = parseFloat(
        salarioMatch[1].replace(/\./g, "").replace(",", "."),
      );
    }

    // Determinar nível de escolaridade
    const reqLower = cargo.requirements.toLowerCase();
    let nivelEscolaridade = "medio";

    if (
      reqLower.includes("fundamental") ||
      reqLower.includes("ensino fundamental")
    ) {
      nivelEscolaridade = "fundamental";
    } else if (
      reqLower.includes("superior") ||
      reqLower.includes("graduação") ||
      reqLower.includes("bacharel") ||
      reqLower.includes("licenciatura")
    ) {
      nivelEscolaridade = "superior";
    } else if (
      reqLower.includes("técnico") ||
      reqLower.includes("curso técnico")
    ) {
      nivelEscolaridade = "tecnico";
    } else if (
      reqLower.includes("médio") ||
      reqLower.includes("ensino médio")
    ) {
      nivelEscolaridade = "medio";
    }

    // Calcular fator de escassez baseado em salário e escolaridade
    let fatorEscassez = 1;

    // Quanto maior o salário, menor o número de vagas
    if (salarioMin >= 5000) {
      fatorEscassez *= 0.3;
    } else if (salarioMin >= 4000) {
      fatorEscassez *= 0.5;
    } else if (salarioMin >= 3500) {
      fatorEscassez *= 0.7;
    } else if (salarioMin >= 3000) {
      fatorEscassez *= 0.8;
    }

    // Quanto maior a escolaridade, menos vagas disponíveis
    switch (nivelEscolaridade) {
      case "superior":
        fatorEscassez *= 0.4;
        break;
      case "tecnico":
        fatorEscassez *= 0.6;
        break;
      case "medio":
        fatorEscassez *= 0.8;
        break;
      case "fundamental":
        fatorEscassez *= 1.0;
        break;
    }

    // Calcular número de vagas
    const vagasBase = Math.floor(Math.random() * 10) + 1;
    const vagasCalculadas = Math.max(1, Math.floor(vagasBase * fatorEscassez));

    // Chance de esgotamento aumentada - mais vagas esgotadas para criar urgência
    let chanceEsgotamento = 0.35; // Base de 35% de chance

    if (nivelEscolaridade === "superior" && salarioMin >= 4000) {
      chanceEsgotamento = 0.6; // 60% para cargos superiores com altos salários
    } else if (nivelEscolaridade === "superior") {
      chanceEsgotamento = 0.5; // 50% para cargos superiores
    } else if (salarioMin >= 3500) {
      chanceEsgotamento = 0.45; // 45% para salários altos
    }

    const vagasEsgotadas = Math.random() < chanceEsgotamento;

    const numVagas = vagasEsgotadas ? 0 : vagasCalculadas;

    // Determinar meta de treinamento baseado no cargo
    let requerTreinamento = false;
    let tipoTreinamento = "";
    let duracaoTreinamento = "";

    const cargoLower = cargo.title.toLowerCase();

    if (
      cargoLower.includes("técnico") ||
      cargoLower.includes("enfermagem") ||
      cargoLower.includes("radiologia") ||
      cargoLower.includes("laboratório")
    ) {
      requerTreinamento = true;
      tipoTreinamento = "Treinamento Técnico Específico";
      duracaoTreinamento = "40 horas";
    } else if (
      cargoLower.includes("motorista") ||
      cargoLower.includes("ambulância")
    ) {
      requerTreinamento = true;
      tipoTreinamento = "Curso de Direção Defensiva e Primeiros Socorros";
      duracaoTreinamento = "24 horas";
    } else if (
      cargoLower.includes("informática") ||
      cargoLower.includes("sistema")
    ) {
      requerTreinamento = true;
      tipoTreinamento = "Capacitação em Sistemas de Saúde (SUS Digital)";
      duracaoTreinamento = "16 horas";
    } else if (
      cargoLower.includes("agente") ||
      cargoLower.includes("atendimento") ||
      cargoLower.includes("recepcionista")
    ) {
      requerTreinamento = true;
      tipoTreinamento = "Atendimento ao Público e Protocolos SUS";
      duracaoTreinamento = "20 horas";
    } else if (
      cargoLower.includes("administrativo") ||
      cargoLower.includes("auxiliar admin") ||
      cargoLower.includes("recepcionista") ||
      cargoLower.includes("atendente")
    ) {
      requerTreinamento = false; // Cargos básicos não requerem treinamento
    } else if (
      cargoLower.includes("serviços gerais") ||
      cargoLower.includes("limpeza") ||
      cargoLower.includes("manutenção")
    ) {
      requerTreinamento = true;
      tipoTreinamento = "Biossegurança e Controle de Infecção Hospitalar";
      duracaoTreinamento = "8 horas";
    }

    console.log(
      `💼 Vaga: ${cargo.title} → Local: ${empresaELocalizacao.company}`,
    );

    vagasSaude.push({
      id: `saude_${String(cargoIndex + 1).padStart(3, "0")}`,
      title: cargo.title,
      company: empresaELocalizacao.company,
      location: empresaELocalizacao.location,
      salary: salarioAleatorio,
      type: tipoContrato,
      urgency: vagasEsgotadas
        ? "Urgente"
        : Math.random() > 0.5
          ? "Alta"
          : "Média",
      description: cargo.description,
      requirements: cargo.requirements,
      area: cargo.area,
      cbo: cargo.cbo,
      carga_horaria: cargaHoraria,
      vagas_disponiveis: numVagas,
      status: vagasEsgotadas ? "vagas_esgotadas" : "disponível",
      meta: {
        requer_treinamento: requerTreinamento,
        tipo_treinamento: requerTreinamento ? tipoTreinamento : undefined,
        duracao_treinamento: requerTreinamento ? duracaoTreinamento : undefined,
      },
    });

    cargoIndex++;
  }

  // Separar vagas que não requerem treinamento e as que requerem
  const vagasSemTreinamento = vagasSaude.filter(
    (vaga) => !vaga.meta.requer_treinamento,
  );
  const vagasComTreinamento = vagasSaude.filter(
    (vaga) => vaga.meta.requer_treinamento,
  );

  // Embaralhar ambos os grupos
  const vagasSemTreinamentoEmbaralhadas = embaralharArray(vagasSemTreinamento);
  const vagasComTreinamentoEmbaralhadas = embaralharArray(vagasComTreinamento);

  // Garantir que sempre temos pelo menos 3 vagas sem treinamento
  const vagasSemTreinamentoSelecionadas = vagasSemTreinamentoEmbaralhadas.slice(
    0,
    3,
  );

  // Preencher o restante com vagas que podem requerer treinamento
  const vagasRestantes = Math.floor(Math.random() * 3) + 3; // 3 a 5 vagas adicionais
  const vagasComTreinamentoSelecionadas = vagasComTreinamentoEmbaralhadas.slice(
    0,
    vagasRestantes,
  );

  // Combinar: sempre 3 sem treinamento primeiro, depois as com treinamento
  const vagasFinais = [
    ...vagasSemTreinamentoSelecionadas,
    ...vagasComTreinamentoSelecionadas,
  ];

  return vagasFinais;
}

interface EscolaCSV {
  restricao: string;
  nome: string;
  codigo_inep: string;
  uf: string;
  municipio: string;
  localizacao: string;
  categoria_administrativa: string;
  endereco: string;
  telefone: string;
  dependencia_administrativa: string;
  porte: string;
  ensino_oferecido: string;
  latitude: number | null;
  longitude: number | null;
}

const ESCOLAS_CSV_PATH = "/tmp/escolas_todo_brasil.csv";
const ESCOLAS_CSV_URL =
  "https://yellowgreen-chamois-294476.hostingersite.com/escolas_todo_brasil.csv";

export async function downloadEscolasCsvSeNecessario(): Promise<void> {
  const fs = await import("fs");
  const path = await import("path");
  if (fs.default.existsSync(ESCOLAS_CSV_PATH)) {
    console.log("[escolas] CSV já existe em cache:", ESCOLAS_CSV_PATH);
    return;
  }
  console.log("[escolas] Baixando CSV do servidor remoto...");
  try {
    const resp = await fetch(ESCOLAS_CSV_URL);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const text = await resp.text();
    fs.default.mkdirSync(path.default.dirname(ESCOLAS_CSV_PATH), {
      recursive: true,
    });
    fs.default.writeFileSync(ESCOLAS_CSV_PATH, text, "utf-8");
    console.log(
      `[escolas] CSV salvo em ${ESCOLAS_CSV_PATH} (${(text.length / 1024 / 1024).toFixed(1)} MB)`,
    );
  } catch (err) {
    console.error("[escolas] Falha ao baixar CSV:", err);
  }
}

// Função para ler e processar dados do CSV de escolas
async function lerEscolasCsv(): Promise<EscolaCSV[]> {
  const fs = await import("fs");

  try {
    if (!fs.default.existsSync(ESCOLAS_CSV_PATH)) {
      console.warn("[escolas] CSV não encontrado em cache — baixando agora...");
      await downloadEscolasCsvSeNecessario();
    }
    let csvContent = fs.default.readFileSync(ESCOLAS_CSV_PATH, "utf-8");

    // Remover BOM se presente
    if (csvContent.charCodeAt(0) === 0xfeff) {
      csvContent = csvContent.slice(1);
    }

    {
      // Parse CSV com tratamento correto para campos com aspas e vírgulas
      const lines = csvContent.split(/\r?\n/);
      const escolas: EscolaCSV[] = [];

      // Estatísticas de filtragem
      let totalProcessadas = 0;
      let comRestricao = 0;
      let semCoordenadas = 0;
      let dadosIncompletos = 0;
      let nivelEnsinoInadequado = 0;

      console.log(`Total de linhas no CSV: ${lines.length}`);

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        try {
          // Parse CSV considerando aspas e vírgulas
          const campos = [];
          let currentField = "";
          let insideQuotes = false;

          for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '"') {
              insideQuotes = !insideQuotes;
            } else if (char === "," && !insideQuotes) {
              campos.push(currentField.trim());
              currentField = "";
            } else {
              currentField += char;
            }
          }
          campos.push(currentField.trim()); // Adicionar último campo

          if (campos.length >= 19) {
            totalProcessadas++;

            const escola: EscolaCSV = {
              restricao: (campos[0] || "").replace(/^"|"$/g, ""),
              nome: (campos[1] || "").replace(/^"|"$/g, ""),
              codigo_inep: (campos[2] || "").replace(/^"|"$/g, ""),
              uf: (campos[3] || "").replace(/^"|"$/g, ""),
              municipio: (campos[4] || "").replace(/^"|"$/g, ""),
              localizacao: (campos[5] || "").replace(/^"|"$/g, ""),
              categoria_administrativa: (campos[7] || "").replace(/^"|"$/g, ""),
              endereco: (campos[8] || "").replace(/^"|"$/g, ""),
              telefone: (campos[9] || "").replace(/^"|"$/g, ""),
              dependencia_administrativa: (campos[10] || "").replace(
                /^"|"$/g,
                "",
              ),
              porte: (campos[14] || "").replace(/^"|"$/g, ""),
              ensino_oferecido: (campos[15] || "").replace(/^"|"$/g, ""),
              latitude: parseFloat(campos[17]) || null,
              longitude: parseFloat(campos[18]) || null,
            };

            // Aplicar filtros e contar motivos de exclusão
            let aprovada = true;

            if (!escola.nome || !escola.uf || !escola.municipio) {
              dadosIncompletos++;
              aprovada = false;
            }

            if (aprovada) {
              escolas.push(escola);
            }
          }
        } catch (error) {
          // Ignorar linhas com erro de parsing
          continue;
        }
      }

      console.log(`=== ESTATÍSTICAS DO PROCESSAMENTO ===`);
      console.log(`Total de escolas processadas: ${totalProcessadas}`);
      console.log(`Escolas válidas encontradas: ${escolas.length}`);
      console.log(`Excluídas por dados incompletos: ${dadosIncompletos}`);
      console.log(
        `Taxa de aprovação: ${((escolas.length / totalProcessadas) * 100).toFixed(1)}%`,
      );
      return escolas;
    }
  } catch (error) {
    console.error("Erro ao buscar CSV de escolas:", error);
    return [];
  }
}

// Interface para unidades militares
interface UnidadeMilitar {
  name: string;
  address: string;
  distance: number;
  type:
    | "quartel"
    | "batalhao"
    | "companhia"
    | "tiro_guerra"
    | "organizacao_militar";
  place_id: string;
  phone?: string;
  rating?: number;
}

// Função para buscar unidades militares próximas
async function buscarUnidadesMilitaresProximas(
  coordinates: { lat: number; lng: number },
  cepData: ViaCEPData,
): Promise<UnidadeMilitar[]> {
  // Lista de chaves de API backup
  const BACKUP_KEYS = [
    process.env.GOOGLE_PLACES_API_KEY,
    "AIzaSyDZmthdKbtBdLC3NMM7-WRAPf9VSNAh6yw",
    "AIzaSyBvOkBX8yBXNlDLVzVUEa0VHGx3tKkGhJc",
    "AIzaSyDQ8YsOXvLKjQHNWOJ1m3Ff5pXQ7VBpNnE",
  ].filter(Boolean); // Remove valores undefined/null

  if (BACKUP_KEYS.length === 0) {
    throw new Error("Nenhuma chave de API do Google Places configurada");
  }

  // Termos de busca específicos para Exército Brasileiro
  const termosMilitares = [
    "exército brasileiro",
    "exercito brasileiro",
    "quartel general do exército",
    "comando militar",
    "batalhão de infantaria",
    "batalhao de infantaria",
    "regimento de infantaria",
    "brigada de infantaria",
    "tiro de guerra",
    "organização militar do exército",
    "base do exército",
    "arsenal de guerra",
    "centro de instrução militar",
    "escola de sargentos das armas",
    "colégio militar",
    "academia militar das agulhas negras",
    "hospital central do exército",
    "parque regional de manutenção",
    "depósito de suprimento",
    "comando de operações terrestres",
  ];

  // Termos proibidos para filtrar estabelecimentos inadequados
  const termosProibidos = [
    "bar",
    "restaurante",
    "escola",
    "lanchonete",
    "pizzaria",
    "academia",
    "parque",
    "hotel",
    "igreja",
    "sítio",
    "pousada",
    "café",
    "evento",
    "clube",
    "loja",
    "empresa",
    "polícia militar",
    "policia militar",
    "pm",
    "bpm",
    "polícia",
    "policia",
    "police",
    "military police",
    "battalion",
    "company",
    "association",
    "associação",
    "hospital",
    "centro médico",
    "medical",
    "club",
    "circle",
    "círculo",
    "fundo",
    "auxílio",
    "socorro",
    "benefit",
    "caixa",
    "assistance",
    "defesa",
    "portadores",
    "deficiência",
    "disability",
    "officers",
    "oficiais",
    "cabos",
    "soldados",
    "sargentos",
    "subtenentes",
    "reserva",
    "reform",
    "aposentad",
    "pension",
    "mutual",
    "mútuo",
    "social",
    "benefíc",
    "works",
    "obras",
    "regional",
    "commission",
    "comissão",
    "administrative",
    "administrat",
    "transit",
    "trânsito",
    "traffic",
    "shock",
    "choque",
    "force",
    "força",
    "tactic",
    "tática",
    "specialized",
    "especializada",
    "environmental",
    "ambiental",
    "metropolit",
  ];

  // Função para detectar nomes em inglês usando padrões linguísticos
  function isNomeEmIngles(name: string): boolean {
    const nomeMin = name.toLowerCase();

    // Padrões típicos do inglês
    const padroesIngles = [
      /\b(the|and|of|military|police|battalion|company|headquarters|command|general|staff|army|base|administration|support|club|association|establishment|defense|nuclear|biological|chemical|radiological|protection|communications|electronic|warfare|reserve|reformed|officers|hall|board|service|items|benefits|state|national|federal|area|metropolitan|shock|force|tactical|environmental|regional|works|commission|administrative|transit|traffic|specialized|center|medical|hospital)\b/,
      // Sufixos em inglês
      /\w+(tion|sion|ment|ness|able|ible|ing|ed)$/,
      // Estruturas gramaticais em inglês
      /\b\d+(st|nd|rd|th)\s+(military|police|battalion|company)/,
      // Artigos e preposições em inglês
      /\b(a|an|the|in|on|at|by|for|with|from|to|of)\s+/,
    ];

    return padroesIngles.some((padrao) => padrao.test(nomeMin));
  }

  // Função para detectar estabelecimentos comerciais e organizações não militares
  function isEstabelecimentoComercialOuCivil(name: string): boolean {
    const nomeMin = name.toLowerCase();

    const indicadoresComerciais = [
      // Estabelecimentos comerciais
      "items",
      "fardamentos",
      "artigos",
      "loja",
      "store",
      "shop",
      "ltda",
      "eireli",
      "comércio",
      "vendas",
      "distribuidora",
      "materiais",
      "equipamentos",

      // Animais e pets
      "cão",
      "cachorro",
      "dog",
      "pet",
      "animal",
      "veterinário",
      "veterinary",

      // Federações e clubes esportivos
      "federação",
      "federation",
      "estande",
      "shooting",
      "range",
      "club",
      "clube",
      "tiro esportivo",
      "sporting",
      "círculo",
      "circle",
      "recreativo",

      // Organizações civis
      "association",
      "associação",
      "fundação",
      "instituto",
      "ong",
      "cooperativa",
      "sindicato",
      "benefit",
      "benefício",
      "auxílio",
      "socorro",
      "mutual",
      "mútuo",
      "caixa",
      "fund",
      "fundo",
      "pensão",
      "aposentadoria",
      "previdência",

      // Estabelecimentos de saúde civis
      "hospital",
      "clínica",
      "médico",
      "medical",
      "centro médico",
      "posto de saúde",
      "upa",
      "pronto atendimento",
      "ambulatório",
      "consultório",
    ];

    return indicadoresComerciais.some((termo) => nomeMin.includes(termo));
  }

  // Função para detectar outras forças armadas e policiais
  function isOutraForcaArmada(name: string): boolean {
    const nomeMin = name.toLowerCase();

    const indicadoresOutrasForcas = [
      // Polícia Militar
      "polícia militar",
      "policia militar",
      "pm",
      "bpm",
      "pmdf",
      "pmesp",
      "police",
      "military police",
      "policial",
      "policeman",

      // Bombeiros
      "bombeiro",
      "bombeiros",
      "cbm",
      "cbmdf",
      "fire",
      "firefighter",

      // Polícia Civil
      "polícia civil",
      "policia civil",
      "delegacia",
      "investigação",

      // Outras
      "guarda municipal",
      "rodoviária",
      "federal",
      "ambiental",
      "metropolitana",
      "força pública",
      "segurança pública",
      "batalhão de choque",
      "bope",
      "rotam",
      "força tática",
      "operações especiais",
    ];

    return indicadoresOutrasForcas.some((termo) => nomeMin.includes(termo));
  }

  // Função para verificar se é realmente uma unidade do Exército Brasileiro
  function isUnidadeExercitoBrasileiro(name: string): boolean {
    const nomeMin = name.toLowerCase();

    // Rejeição explícita de lugares irrelevantes (blocklist ampla)
    const termosIrrelevantes = [
      "hotel",
      "pousada",
      "hostel",
      "airbnb",
      "resort",
      "escola",
      "colégio",
      "colegio",
      "universidade",
      "faculdade",
      "curso",
      "clínica",
      "clinica",
      "hospital",
      "pronto",
      "saúde",
      "médico",
      "medico",
      "farmácia",
      "farmacia",
      "drogaria",
      "depósito",
      "deposito",
      "armazém",
      "armazem",
      "almoxarifado",
      "supermercado",
      "mercado",
      "mercadinho",
      "padaria",
      "açougue",
      "mercearia",
      "loja",
      "store",
      "shop",
      "magazine",
      "comércio",
      "comercio",
      "boutique",
      "restaurante",
      "lanchonete",
      "bar ",
      "cantina",
      "pizzaria",
      "churrascaria",
      "academia",
      "ginásio",
      "ginasio",
      "clube esportivo",
      "banco",
      "caixa",
      "financeira",
      "corretora",
      "escritório",
      "escritorio",
      "office",
      "sala comercial",
      "condomínio",
      "condominio",
      "residencial",
      "apartamento",
      "shopping",
      "mall",
      "galeria",
      "oficina",
      "mecânica",
      "mecanica",
      "borracharia",
      "posto de combustível",
      "posto gasolina",
      "gasolineira",
      "cartório",
      "cartorio",
      "tabelionato",
      "sindicato",
      "cooperativa",
      "associação esportiva",
      "partido",
      "diretório",
      "diretorio",
    ];
    if (termosIrrelevantes.some((t) => nomeMin.includes(t))) {
      console.log(`❌ Rejeitado por termo irrelevante: ${name}`);
      return false;
    }

    // Primeira verificação: rejeitar estabelecimentos comerciais/civis
    if (isEstabelecimentoComercialOuCivil(name)) {
      return false;
    }

    // Segunda verificação: rejeitar outras forças armadas
    if (isOutraForcaArmada(name)) {
      return false;
    }

    // Terceira verificação: rejeitar nomes em inglês (exceto históricos específicos)
    if (isNomeEmIngles(name)) {
      const excecoesBrasileiraEmIngles = [
        "brazilian army",
        "army of brazil",
        "forte",
        "fort",
      ];
      if (
        !excecoesBrasileiraEmIngles.some((excecao) => nomeMin.includes(excecao))
      ) {
        return false;
      }
    }

    // Quarta verificação: deve conter identificadores INEQUÍVOCOS do Exército Brasileiro
    // (termos ambíguos como "depósito", "om", "regional" foram removidos)
    const termosExercitoEspecificos = [
      "exército brasileiro",
      "exercito brasileiro",
      "quartel general",
      "quartel do exército",
      "quartel do exercito",
      "comando militar",
      "comando de área",
      "divisão de exército",
      "divisao de exercito",
      "tiro de guerra",
      "batalhão de infantaria",
      "batalhao de infantaria",
      "batalhão de engenharia",
      "batalhao de engenharia",
      "batalhão logístico",
      "batalhao logistico",
      "regimento de cavalaria",
      "regimento de artilharia",
      "regimento de infantaria",
      "brigada de infantaria",
      "brigada de cavalaria",
      "academia militar das agulhas negras",
      "escola de sargentos das armas",
      "colégio militar",
      "colegio militar",
      "hospital central do exército",
      "hospital militar",
      "arsenal de guerra",
      "parque regional de manutenção",
      "depósito de suprimento",
      "deposito de suprimento",
      "base logística do exército",
      "organização militar do exército",
      "centro de instrução militar",
      "centro de instrução de guerra",
      "comando de operações terrestres",
      "forte ",
      "fortaleza do exército",
    ];

    return termosExercitoEspecificos.some((termo) => nomeMin.includes(termo));
  }

  const unidadesMilitares: UnidadeMilitar[] = [];
  const placesVistos = new Set<string>();

  // Função para tentar uma busca com fallback de chaves
  const trySearchWithFallback = async (searchUrl: string): Promise<any> => {
    for (let i = 0; i < BACKUP_KEYS.length; i++) {
      const currentKey = BACKUP_KEYS[i];
      const urlWithKey = searchUrl.replace(
        "key=PLACEHOLDER",
        `key=${currentKey}`,
      );

      try {
        const response = await fetch(urlWithKey);
        const data = await response.json();

        if (data.status === "REQUEST_DENIED") {
          console.log(`Chave API ${i + 1} negada, tentando próxima...`);
          continue;
        }

        if (data.status === "OK" || data.status === "ZERO_RESULTS") {
          console.log(`Usando chave API ${i + 1} com sucesso`);
          return data;
        }

        // Outros erros que não são relacionados à chave
        console.error(`Erro na API com chave ${i + 1}:`, data.status);
        continue;
      } catch (error) {
        console.error(`Erro de rede com chave ${i + 1}:`, error);
        continue;
      }
    }

    throw new Error("Todas as chaves de API falharam");
  };

  // Buscar simultaneamente para otimizar
  const buscasSimultaneas = termosMilitares.map(async (termo) => {
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo + " " + cepData.localidade + " " + cepData.uf)}&location=${coordinates.lat},${coordinates.lng}&radius=30000&key=PLACEHOLDER`;

      const data = await trySearchWithFallback(searchUrl);

      if (data.status === "OK" && data.results) {
        return data.results
          .filter((place: any) => {
            // Aplicar filtros em sequência para debugging
            const placeName = place.name.toLowerCase();

            // 1. Filtrar termos básicos proibidos
            if (termosProibidos.some((termo) => placeName.includes(termo))) {
              console.log(`❌ Filtrado por termo proibido: ${place.name}`);
              return false;
            }

            // 2. Filtrar nomes em inglês
            if (isNomeEmIngles(place.name)) {
              console.log(`❌ Filtrado por estar em inglês: ${place.name}`);
              return false;
            }

            // 3. Verificar se é unidade do Exército Brasileiro
            if (!isUnidadeExercitoBrasileiro(place.name)) {
              console.log(
                `❌ Filtrado - não é unidade do Exército: ${place.name}`,
              );
              return false;
            }

            // Evitar duplicatas
            if (placesVistos.has(place.place_id)) {
              return false;
            }

            // Calcular distância e filtrar por raio de 30km
            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            if (distance > 30) {
              console.log(
                `❌ Filtrado por distância (${distance.toFixed(2)}km > 30km): ${place.name}`,
              );
              return false;
            }

            console.log(`✅ Unidade do Exército aprovada: ${place.name}`);
            return true;
          })
          .map((place: any) => {
            placesVistos.add(place.place_id);

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            // Determinar tipo de unidade militar
            let type: UnidadeMilitar["type"] = "organizacao_militar";
            const placeName = place.name.toLowerCase();

            if (placeName.includes("quartel")) {
              type = "quartel";
            } else if (
              placeName.includes("batalhão") ||
              placeName.includes("batalhao")
            ) {
              type = "batalhao";
            } else if (placeName.includes("companhia")) {
              type = "companhia";
            } else if (placeName.includes("tiro de guerra")) {
              type = "tiro_guerra";
            }

            const unidade: UnidadeMilitar = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round(distance * 100) / 100,
              type,
              place_id: place.place_id,
              phone: place.formatted_phone_number,
              rating: place.rating,
            };

            console.log(
              `✅ Unidade militar encontrada: ${unidade.name} (${unidade.distance}km)`,
            );
            return unidade;
          });
      }
      return [];
    } catch (error) {
      console.error(`Erro na busca por termo "${termo}":`, error);
      return [];
    }
  });

  try {
    const resultados = await Promise.all(buscasSimultaneas);
    const todasUnidades = resultados.flat();

    // Remover duplicatas baseado no place_id
    const unidadesUnicas = todasUnidades.filter(
      (unidade, index, array) =>
        array.findIndex((u) => u.place_id === unidade.place_id) === index,
    );

    // Ordenar por distância
    unidadesUnicas.sort((a, b) => a.distance - b.distance);

    // Limitar a 3 unidades
    return unidadesUnicas.slice(0, 3);
  } catch (error) {
    console.error(
      "Erro nas buscas simultâneas, gerando dados alternativos:",
      error,
    );

    // Gerar dados alternativos quando todas as APIs falharem
    const escolasCsv = await lerEscolasCsv();
    const escolasCidade = escolasCsv.filter(
      (escola) =>
        escola.municipio.toLowerCase() === cepData.localidade.toLowerCase() &&
        escola.uf.toLowerCase() === cepData.uf.toLowerCase() &&
        escola.endereco &&
        escola.endereco.trim() !== "",
    );

    const unidadesFallback: UnidadeMilitar[] = [
      {
        name: `Polícia Civil de ${cepData.localidade}`,
        address:
          escolasCidade.length > 0
            ? escolasCidade[0].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 2.5,
        type: "organizacao_militar",
        place_id: `fallback_pc_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
      {
        name: `Polícia Militar de ${cepData.localidade}`,
        address:
          escolasCidade.length > 1
            ? escolasCidade[1].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 3.2,
        type: "organizacao_militar",
        place_id: `fallback_pm_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
      {
        name: `Guarda Municipal de ${cepData.localidade}`,
        address:
          escolasCidade.length > 2
            ? escolasCidade[2].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 4.1,
        type: "organizacao_militar",
        place_id: `fallback_gm_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
    ];

    console.log(
      `Retornando ${unidadesFallback.length} unidades de fallback para ${cepData.localidade}`,
    );
    return unidadesFallback;
  }
}

// Interface para locais alternativos
interface LocalAlternativo {
  name: string;
  address: string;
  distance: number;
  type:
    | "prefeitura"
    | "delegacia"
    | "policia_civil"
    | "policia_militar"
    | "guarda_municipal"
    | "subprefeitura"
    | "secretaria_municipal";
  place_id: string;
  phone?: string;
  rating?: number;
}

// Função para buscar locais alternativos (delegacias, PM, guarda municipal, prefeituras)
async function buscarLocaisAlternativos(
  coordinates: { lat: number; lng: number },
  cepData: ViaCEPData,
): Promise<LocalAlternativo[]> {
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
  if (!GOOGLE_API_KEY) {
    throw new Error("Google Places API key não configurada");
  }

  const termosPrefeitura = ["prefeitura"];

  const termosDelegacia = [
    "delegacia de polícia civil",
    "delegacia de polícia",
    "delegacia",
    "polícia civil",
    "distrito policial",
    "polícia militar",
    "batalhão de polícia militar",
    "companhia de polícia militar",
    "guarda municipal",
    "guarda civil municipal",
    "gcm",
  ];

  const termosSaudePublica = [
    "hospital público",
    "unidade de saúde",
    "posto de saúde",
    "ubs",
    "upa",
    "secretaria municipal de saúde",
    "pronto atendimento",
    "hospital municipal",
    "hospital estadual",
    "samu",
    "hospital",
    "clínica",
    "médico",
    "saúde",
    "centro de saúde",
    "policlínica",
    "ambulatório",
  ];

  const todosTermos = [...termosPrefeitura, ...termosDelegacia];
  const locaisAlternativos: LocalAlternativo[] = [];
  const placesVistos = new Set<string>();

  // Buscar simultaneamente
  const buscasSimultaneas = todosTermos.map(async (termo) => {
    try {
      const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo + " " + cepData.localidade + " " + cepData.uf)}&location=${coordinates.lat},${coordinates.lng}&radius=30000&key=${GOOGLE_API_KEY}`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results) {
        return data.results
          .filter((place: any) => {
            // Evitar duplicatas
            if (placesVistos.has(place.place_id)) {
              return false;
            }

            // Calcular distância e filtrar por raio de 30km
            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            if (distance > 30) {
              console.log(
                `Filtrado por distância (${distance.toFixed(2)}km > 30km): ${place.name}`,
              );
              return false;
            }

            const placeName = place.name.toLowerCase();

            // Rejeição explícita ampla — blocklist de lugares irrelevantes
            const termosRejeitados = [
              "hotel",
              "pousada",
              "hostel",
              "resort",
              "airbnb",
              "escola",
              "colégio",
              "colegio",
              "universidade",
              "faculdade",
              "hospital",
              "clínica",
              "clinica",
              "saúde",
              "saude",
              "médico",
              "medico",
              "ubs",
              "upa",
              "pronto socorro",
              "pronto atendimento",
              "emergência",
              "emergencia",
              "ambulatório",
              "ambulatorio",
              "consultório",
              "consultorio",
              "farmácia",
              "farmacia",
              "drogaria",
              "pátio de veículos",
              "patio de veiculos",
              "pátio de veiculo",
              "patio de veiculo",
              "depósito",
              "deposito",
              "armazém",
              "armazem",
              "almoxarifado",
              "supermercado",
              "mercado",
              "hipermercado",
              "atacado",
              "loja",
              "store",
              "shop",
              "magazine",
              "comercio",
              "comércio",
              "boutique",
              "restaurante",
              "lanchonete",
              "pizzaria",
              "churrascaria",
              "cantina",
              "academia",
              "ginásio",
              "ginasio",
              "banco",
              "financeira",
              "caixa econômica",
              "cartório",
              "cartorio",
              "tabelionato",
              "condomínio",
              "condominio",
              "residencial",
              "shopping",
              "galeria",
              "mall",
              "posto de gasolina",
              "posto combustível",
              "sindicato",
              "cooperativa",
              "associação",
              "associacao",
              "ong",
              "fundação",
              "fundacao",
              "clube ",
              "recreativo",
              "esportivo",
              "oficina",
              "mecânica",
              "mecanica",
              "borracharia",
              "campo de futebol",
              "campo do ",
              "base móvel",
              "base movel",
              "transporte polícia",
              "transporte policia",
              "funeral",
              "auxílio",
              "auxilio",
              "prefeitura-bairro",
              "prefeitura bairro",
              "secretaria municipal de",
              "secretaria de cultura",
              "secretaria de ambiente",
              "secretaria de saúde",
              "secretaria de saude",
              "secretaria de educação",
              "secretaria de educacao",
              "secretaria de esporte",
              "secretaria de turismo",
              "secretaria de obras",
              "secretaria de habitação",
              "secretaria de assistência",
              "secretaria de assistencia",
              // Entidades beneficentes/associativas internas
              "caixa beneficente",
              // Órgãos federais/forças armadas (fora do escopo: delegacias, PM, GM, prefeitura estaduais/municipais)
              "receita federal",
              "polícia federal",
              "policia federal",
              "polícia rodoviária federal",
              "policia rodoviaria federal",
              "prf ",
              "exército",
              "exercito",
              "marinha",
              "aeronáutica",
              "aeronautica",
              "forças armadas",
              "forcas armadas",
              // Comércios/oficinas que usam "GCM"/"guarda" no nome mas não são órgão público
              "freios e suspens",
              "auto elétrica",
              "auto eletrica",
              "autopeças",
              "autopecas",
              "auto peças",
              "auto pecas",
              "auto center",
              "soluções elétricas",
              "solucoes eletricas",
              "pneus",
              // Unidades internas/auxiliares sem atendimento público
              "psicossocial",
              "unidade de patrimônio",
              "unidade de patrimonio",
              "setor jurídico",
              "setor juridico",
              "corregedoria",
              "ouvidoria",
              // Infraestrutura de observação/segurança passiva
              "torre de observ",
              "torre segurança",
              "torre seguranca",
              // Gestão/RH internos
              "gestão de pessoas",
              "gestao de pessoas",
              "gerência de gestão",
              "gerencia de gestao",
              // Instalações de detenção
              "presídio",
              "presidio",
              "penitenciária",
              "penitenciaria",
              "cadeia",
              "carceragem",
              "casa de custódia",
              "casa de custodia",
              // Locais não públicos adicionais
              "garagem",
              "estacionamento",
              "cemitério",
              "cemiterio",
              "motel",
              "lotérica",
              "loterica",
              "salão de",
              "quadra ",
            ];

            if (termosRejeitados.some((t) => placeName.includes(t))) {
              console.log(`❌ Filtrado por blocklist: ${place.name}`);
              return false;
            }

            // Aceitar APENAS locais de segurança pública ou governo com termos inequívocos
            const isPrefeitura =
              placeName.includes("prefeitura") ||
              placeName.includes("câmara municipal") ||
              placeName.includes("camara municipal") ||
              placeName.includes("câmara de vereadores") ||
              placeName.includes("paço municipal") ||
              placeName.includes("paco municipal") ||
              placeName.includes("subprefeitura");

            const isDelegaciaCivil =
              placeName.includes("delegacia") ||
              placeName.includes("polícia civil") ||
              placeName.includes("policia civil") ||
              placeName.includes("distrito policial") ||
              placeName.includes("dpcami") ||
              placeName.includes("deic") ||
              placeName.includes("dhpp") ||
              placeName.includes("delegacia da mulher") ||
              placeName.includes("delegacia de proteção") ||
              placeName.includes("delegacia de homicídios") ||
              placeName.includes("delegacia de homic");

            const isPoliciaMilitar =
              placeName.includes("polícia militar") ||
              placeName.includes("policia militar") ||
              (placeName.includes("batalhão") &&
                (placeName.includes("pm") ||
                  placeName.includes("bpm") ||
                  placeName.includes("policia") ||
                  placeName.includes("polícia"))) ||
              (placeName.includes("companhia") &&
                (placeName.includes("pm") ||
                  placeName.includes("bpm") ||
                  placeName.includes("policia") ||
                  placeName.includes("polícia"))) ||
              placeName.includes("quartel da pm") ||
              placeName.includes("base da pm") ||
              placeName.includes("bope") ||
              (placeName.includes("choque") && placeName.includes("policia"));

            const isGuardaMunicipal =
              placeName.includes("guarda municipal") ||
              placeName.includes("guarda civil municipal") ||
              placeName.includes("gcm ") ||
              placeName === "gcm";

            const isRelevant =
              isPrefeitura ||
              isDelegaciaCivil ||
              isPoliciaMilitar ||
              isGuardaMunicipal;

            if (!isRelevant) {
              console.log(
                `❌ Filtrado - não é prefeitura nem delegacia: ${place.name}`,
              );
              return false;
            }

            // Rejeitar nomes genéricos sem identificação própria
            // Ex: "Delegacia", "Prefeitura", "GCM" sozinhos não são úteis
            const nomesGenericos = [
              "delegacia",
              "prefeitura",
              "policia civil",
              "polícia civil",
              "polícia militar",
              "policia militar",
              "distrito policial",
              "secretaria",
              "subprefeitura",
              "câmara",
              "camara",
              "guarda municipal",
              "gcm",
              "pm",
            ];
            const nomeLimpo = place.name.trim().toLowerCase();
            if (nomesGenericos.includes(nomeLimpo)) {
              console.log(
                `❌ Filtrado - nome genérico sem identificação: ${place.name}`,
              );
              return false;
            }

            console.log(
              `✅ Local alternativo encontrado: ${place.name} (${distance.toFixed(2)}km)`,
            );
            return true;
          })
          .map((place: any) => {
            placesVistos.add(place.place_id);

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            // Determinar tipo do local
            let type: LocalAlternativo["type"] = "prefeitura";
            const placeName = place.name.toLowerCase();

            if (
              placeName.includes("guarda municipal") ||
              placeName.includes("guarda civil municipal") ||
              placeName.includes("gcm")
            ) {
              type = "guarda_municipal";
            } else if (
              placeName.includes("polícia militar") ||
              placeName.includes("policia militar") ||
              placeName.includes("policial militar") ||
              placeName.includes("bope") ||
              (placeName.includes("batalhão") &&
                (placeName.includes("pm") ||
                  placeName.includes("bpm") ||
                  placeName.includes("policia") ||
                  placeName.includes("polícia"))) ||
              (placeName.includes("companhia") &&
                (placeName.includes("pm") ||
                  placeName.includes("bpm") ||
                  placeName.includes("policia") ||
                  placeName.includes("polícia")))
            ) {
              type = "policia_militar";
            } else if (
              placeName.includes("delegacia") ||
              placeName.includes("polícia civil") ||
              placeName.includes("policia civil") ||
              placeName.includes("distrito policial")
            ) {
              type = "policia_civil";
            } else if (placeName.includes("subprefeitura")) {
              type = "subprefeitura";
            } else if (placeName.includes("secretaria")) {
              type = "secretaria_municipal";
            }

            const local: LocalAlternativo = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round(distance * 100) / 100,
              type,
              place_id: place.place_id,
              phone: place.formatted_phone_number,
              rating: place.rating,
            };

            return local;
          })
          .filter((local: any) => local !== null);
      }
      return [];
    } catch (error) {
      console.error(`Erro na busca por termo "${termo}":`, error);
      return [];
    }
  });

  try {
    const resultados = await Promise.all(buscasSimultaneas);
    const todosLocais = resultados.flat();

    // Remover duplicatas baseado no place_id
    const locaisUnicos = todosLocais.filter(
      (local, index, array) =>
        array.findIndex((l) => l.place_id === local.place_id) === index,
    );

    // Ordenar por distância
    locaisUnicos.sort((a, b) => a.distance - b.distance);

    // Limitar a 3 locais alternativos
    return locaisUnicos.slice(0, 3);
  } catch (error) {
    console.error(
      "Erro nas buscas de locais alternativos, gerando dados alternativos:",
      error,
    );

    // Gerar dados alternativos quando todas as APIs falharem
    const escolasCsv = await lerEscolasCsv();
    const escolasCidade = escolasCsv.filter(
      (escola) =>
        escola.municipio.toLowerCase() === cepData.localidade.toLowerCase() &&
        escola.uf.toLowerCase() === cepData.uf.toLowerCase() &&
        escola.endereco &&
        escola.endereco.trim() !== "",
    );

    const locaisFallback: LocalAlternativo[] = [
      {
        name: `Prefeitura Municipal de ${cepData.localidade}`,
        address:
          escolasCidade.length > 0
            ? escolasCidade[0].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 1.8,
        type: "prefeitura",
        place_id: `fallback_prefeitura_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
      {
        name: `Delegacia de Polícia Civil de ${cepData.localidade}`,
        address:
          escolasCidade.length > 1
            ? escolasCidade[1].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 2.3,
        type: "delegacia",
        place_id: `fallback_delegacia_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
      {
        name: `Secretaria Municipal de Administração de ${cepData.localidade}`,
        address:
          escolasCidade.length > 2
            ? escolasCidade[2].endereco
            : `Centro, ${cepData.localidade} - ${cepData.uf}`,
        distance: 2.7,
        type: "secretaria_municipal",
        place_id: `fallback_secretaria_${cepData.localidade.toLowerCase().replace(/\s+/g, "_")}`,
      },
    ];

    console.log(
      `Retornando ${locaisFallback.length} locais alternativos de fallback para ${cepData.localidade}`,
    );
    return locaisFallback;
  }
}

async function buscarCoordenadas(
  cep: string,
): Promise<{ lat: number; lng: number } | null> {
  try {
    // Format and validate CEP
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      console.error("CEP must have 8 digits:", cep);
      return null;
    }

    // First try Google Geocoding API
    try {
      const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cleanCep},Brazil&key=${process.env.GOOGLE_MAPS_API_KEY}`;

      const response = await fetch(geocodingUrl);
      const data = await response.json();

      if (data.status === "OK" && data.results && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(
          `Google Geocoding found coordinates for CEP ${cleanCep}:`,
          location,
        );
        return {
          lat: location.lat,
          lng: location.lng,
        };
      }

      if (data.status === "REQUEST_DENIED") {
        console.log(
          "Google Geocoding API billing not enabled, using alternative method",
        );
      } else {
        console.error(
          "Google Geocoding API error for CEP",
          cleanCep,
          ":",
          data.status,
          data.error_message || "No results found",
        );
      }
    } catch (error) {
      console.log(
        "Google Geocoding API not available, using alternative method",
      );
    }

    // Alternative: Use ViaCEP + OpenStreetMap Nominatim API for coordinates
    try {
      const viaCepResponse = await fetch(`https://opencep.com/v1/${cleanCep}`);
      const viaCepData = await viaCepResponse.json();

      if (!viaCepData.erro) {
        // Build address string, prioritizing city and state when street is empty
        let address;
        if (viaCepData.logradouro && viaCepData.logradouro.trim()) {
          address = `${viaCepData.logradouro}, ${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
        } else {
          // For CEPs with empty street, use city center
          address = `${viaCepData.localidade}, ${viaCepData.uf}, Brazil`;
        }

        console.log(`Searching Nominatim for: ${address}`);

        // Use free Nominatim API for geocoding with rate limiting respect
        const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=br`;

        // Add delay to respect rate limits
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const nominatimResponse = await fetch(nominatimUrl, {
          headers: {
            "User-Agent": "Exército Brasileiro Medical Exam Locator",
          },
        });

        if (!nominatimResponse.ok) {
          console.error(
            `Nominatim API error: ${nominatimResponse.status} ${nominatimResponse.statusText}`,
          );
          return null;
        }

        const nominatimData = await nominatimResponse.json();
        console.log(`Nominatim response:`, nominatimData);

        if (nominatimData && nominatimData.length > 0) {
          const coords = {
            lat: parseFloat(nominatimData[0].lat),
            lng: parseFloat(nominatimData[0].lon),
          };
          console.log(
            `Nominatim found coordinates for CEP ${cleanCep} (${viaCepData.localidade}, ${viaCepData.uf}):`,
            coords,
          );
          return coords;
        } else {
          console.log(`Nominatim found no results for: ${address}`);
        }
      }
    } catch (error) {
      console.error("Error with alternative geocoding:", error);
    }

    return null;
  } catch (error) {
    console.error("Error getting coordinates:", error);
    return null;
  }
}

async function buscarLocaisExameCredenciados(
  coordinates: { lat: number; lng: number },
  cep: string,
): Promise<any[]> {
  const locaisEncontrados: any[] = [];
  const RADIUS_30KM = 30000;
  const MAX_RESULTS = 3;
  const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

  if (!GOOGLE_API_KEY) {
    console.error("Google Places API key not configured");
    return [];
  }

  // Hierarquia de prioridade para busca
  const prioridades = [
    {
      nome: "Hospitais Militares/FUSEx",
      termos: [
        "hospital militar",
        "fusex",
        "hospital do exército",
        "hospital da aeronáutica",
        "hospital da marinha",
        "hospital das forças armadas",
        "hospital policia militar",
        "hospital pm",
      ],
    },
    {
      nome: "Hospitais Públicos",
      termos: [
        "hospital público",
        "hospital municipal",
        "hospital estadual",
        "santa casa",
        "hospital geral",
      ],
    },
    {
      nome: "UPAs e Centros de Saúde",
      termos: [
        "upa",
        "unidade pronto atendimento",
        "centro de saúde",
        "posto de saúde",
        "ubs",
        "unidade básica saúde",
      ],
    },
  ];

  function isEstabelecimentoInadequado(name: string): boolean {
    const filtrosInadequados = [
      "veterinária",
      "pet shop",
      "clínica veterinária",
      "farmácia",
      "drogaria",
      "laboratório de análises clínicas",
      "análises clínicas",
      "ótica",
      "fisioterapia estética",
      "academia",
      "spa",
      "salão de beleza",
      "estética",
      "dentista",
      "psicólogo",
      "terapeuta holístico",
      "homeopatia",
      "podólogo",
      "estúdio de tatuagem",
      "massagem",
      "pilates",
      "nutricionista",
      "consultório particular",
      "cirurgia plástica",
      "clínica de estética",
      "veterinary",
      "pet",
      "pharmacy",
      "drugstore",
      "optical",
      "gym",
      "beauty",
      "dental",
      "tattoo",
      "massage",
      "pilates",
      "nutrition",
      "plastic surgery",
    ];

    const nameLower = name.toLowerCase();
    return filtrosInadequados.some((filtro) =>
      nameLower.includes(filtro.toLowerCase()),
    );
  }

  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Raio da Terra em metros
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async function buscarComGooglePlaces(prioridade: any): Promise<void> {
    console.log(`Buscando: ${prioridade.nome}`);

    for (const termo of prioridade.termos) {
      if (locaisEncontrados.length >= MAX_RESULTS) break;

      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo)}&location=${coordinates.lat},${coordinates.lng}&radius=${RADIUS_30KM}&key=${GOOGLE_API_KEY}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.status === "OK" && data.results) {
          for (const place of data.results) {
            if (locaisEncontrados.length >= MAX_RESULTS) break;

            if (isEstabelecimentoInadequado(place.name)) continue;

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            // Filtrar por raio de 30km
            if (distance > RADIUS_30KM) continue;

            const local = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round((distance / 1000) * 100) / 100,
              type: prioridade.nome.toLowerCase().replace(/\s+/g, "_"),
              place_id: place.place_id,
              phone: place.formatted_phone_number || null,
              rating: place.rating || null,
              coordinates: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              },
            };

            // Evitar duplicatas baseado no place_id
            if (!locaisEncontrados.find((l) => l.place_id === local.place_id)) {
              locaisEncontrados.push(local);
              console.log(`✅ Encontrado: ${local.name} (${local.distance}km)`);
            }
          }
        } else if (data.status === "REQUEST_DENIED") {
          console.error(
            "Google Places API: Acesso negado - verifique a chave API e billing",
          );
          return;
        }
      } catch (error) {
        console.error(`Erro na busca por "${termo}":`, error);
      }
    }
  }

  // Função removida - será substituída abaixo
  async function __REMOVED_buscarComOverpassAPI(
    tipo: string,
    useExtendedRadius: boolean = false,
  ): Promise<void> {
    try {
      // Define search radius based on whether we're using extended search
      const radiusDegrees = useExtendedRadius ? 0.45 : 0.27; // 30km or 50km
      const bbox = [
        coordinates.lat - radiusDegrees, // min lat
        coordinates.lng - radiusDegrees, // min lon
        coordinates.lat + radiusDegrees, // max lat
        coordinates.lng + radiusDegrees, // max lon
      ];

      let query = "";
      if (tipo === "fusex") {
        query = `
          [out:json][timeout:30];
          (
            nwr["amenity"="hospital"]["name"~".*[Ee]xército.*|.*[Mm]ilitar.*|.*FUSEx.*|.*[Ff]orça.*[Aa]rmada.*",i](${bbox.join(",")});
            nwr["amenity"="clinic"]["name"~".*[Ee]xército.*|.*[Mm]ilitar.*|.*FUSEx.*|.*[Ff]orça.*[Aa]rmada.*",i](${bbox.join(",")});
            nwr["healthcare"="hospital"]["name"~".*[Ee]xército.*|.*[Mm]ilitar.*|.*FUSEx.*|.*[Ff]orça.*[Aa]rmada.*",i](${bbox.join(",")});
            nwr["amenity"="hospital"]["operator"~".*[Ee]xército.*|.*[Mm]ilitar.*|.*FUSEx.*",i](${bbox.join(",")});
          );
          out center;
        `;
      } else if (tipo === "hospital_militar") {
        query = `
          [out:json][timeout:30];
          (
            nwr["amenity"="hospital"]["name"~".*[Mm]ilitar.*|.*[Pp]olícia.*[Mm]ilitar.*|.*[Bb]ombeiros.*|.*PM.*|.*[Gg]uarda.*[Mm]unicipal.*",i](${bbox.join(",")});
            nwr["healthcare"="hospital"]["name"~".*[Mm]ilitar.*|.*[Pp]olícia.*[Mm]ilitar.*|.*[Bb]ombeiros.*",i](${bbox.join(",")});
            nwr["amenity"="clinic"]["name"~".*[Mm]ilitar.*|.*[Pp]olícia.*[Mm]ilitar.*",i](${bbox.join(",")});
          );
          out center;
        `;
      } else if (tipo === "hospital_publico") {
        query = `
          [out:json][timeout:30];
          (
            nwr["amenity"="hospital"](${bbox.join(",")});
            nwr["amenity"="clinic"](${bbox.join(",")});
            nwr["healthcare"="hospital"](${bbox.join(",")});
            nwr["healthcare"="centre"](${bbox.join(",")});
            nwr["healthcare"="clinic"](${bbox.join(",")});
            nwr["amenity"="doctors"](${bbox.join(",")});
          );
          out center;
        `;
      } else {
        query = `
          [out:json][timeout:30];
          (
            nwr["amenity"="hospital"](${bbox.join(",")});
            nwr["amenity"="clinic"](${bbox.join(",")});
            nwr["healthcare"="hospital"](${bbox.join(",")});
            nwr["healthcare"="centre"](${bbox.join(",")});
            nwr["healthcare"="clinic"](${bbox.join(",")});
            nwr["amenity"="doctors"](${bbox.join(",")});
          );
          out center;
        `;
      }

      console.log(
        `Searching OpenStreetMap for ${tipo} facilities near ${coordinates.lat},${coordinates.lng}`,
      );

      const overpassUrl = "https://overpass-api.de/api/interpreter";
      const response = await fetch(overpassUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${encodeURIComponent(query)}`,
      });

      const data = await response.json();

      if (data.elements) {
        console.log(`OpenStreetMap found ${data.elements.length} facilities`);

        for (const element of data.elements) {
          if (locaisEncontrados.length >= MAX_RESULTS) break;

          const name =
            element.tags?.name ||
            element.tags?.["name:pt"] ||
            "Unidade de Saúde";

          if (!name || isEstabelecimentoInadequado(name)) continue;

          // Get coordinates (center for ways/relations, lat/lon for nodes)
          const lat = element.lat || element.center?.lat;
          const lon = element.lon || element.center?.lon;

          if (!lat || !lon) continue;

          const distance = calculateDistance(
            coordinates.lat,
            coordinates.lng,
            lat,
            lon,
          );

          // Filter by radius based on search type
          const maxDistance = useExtendedRadius
            ? EXTENDED_RADIUS
            : INITIAL_RADIUS;
          if (distance > maxDistance) continue;

          // Build address from OpenStreetMap data only
          const addressParts = [];
          if (element.tags?.["addr:street"]) {
            addressParts.push(element.tags["addr:street"]);
          }
          if (element.tags?.["addr:housenumber"]) {
            addressParts.push(element.tags["addr:housenumber"]);
          }
          if (element.tags?.["addr:city"]) {
            addressParts.push(element.tags["addr:city"]);
          } else if (element.tags?.["addr:municipality"]) {
            addressParts.push(element.tags["addr:municipality"]);
          }
          if (element.tags?.["addr:state"]) {
            addressParts.push(element.tags["addr:state"]);
          }

          const address =
            addressParts.length > 0
              ? addressParts.join(", ")
              : `Coordenadas: ${lat.toFixed(6)}, ${lon.toFixed(6)}`;

          const local = {
            name,
            address,
            distance: Math.round((distance / 1000) * 100) / 100,
            type: tipo,
            place_id: `osm_${element.type}_${element.id}`,
            phone: element.tags?.phone || null,
            rating: null,
            coordinates: { lat, lng: lon },
          };

          locaisEncontrados.push(local);
        }
      }
    } catch (error) {
      console.error("Error with OpenStreetMap Overpass API:", error);
    }
  }

  async function buscarComGooglePlaces(prioridade: any): Promise<void> {
    console.log(`Buscando: ${prioridade.nome}`);

    for (const termo of prioridade.termos) {
      if (locaisEncontrados.length >= MAX_RESULTS) break;

      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo)}&location=${coordinates.lat},${coordinates.lng}&radius=${RADIUS_30KM}&key=${GOOGLE_API_KEY}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.status === "OK" && data.results) {
          for (const place of data.results) {
            if (locaisEncontrados.length >= MAX_RESULTS) break;

            if (isEstabelecimentoInadequado(place.name)) continue;

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            // Filtrar por raio de 30km
            if (distance > RADIUS_30KM) continue;

            const local = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round((distance / 1000) * 100) / 100,
              type: prioridade.nome.toLowerCase().replace(/\s+/g, "_"),
              place_id: place.place_id,
              phone: place.formatted_phone_number || null,
              rating: place.rating || null,
              coordinates: {
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
              },
            };

            // Evitar duplicatas baseado no place_id
            if (!locaisEncontrados.find((l) => l.place_id === local.place_id)) {
              locaisEncontrados.push(local);
              console.log(`✅ Encontrado: ${local.name} (${local.distance}km)`);
            }
          }
        } else if (data.status === "REQUEST_DENIED") {
          console.error(
            "Google Places API: Acesso negado - verifique a chave API e billing",
          );
          return;
        }
      } catch (error) {
        console.error(`Erro na busca por "${termo}":`, error);
      }
    }
  }

  console.log(
    "Using Google Places API for medical facility search within 30km radius",
  );

  // Buscar por ordem de prioridade
  for (const prioridade of prioridades) {
    if (locaisEncontrados.length >= MAX_RESULTS) break;
    await buscarComGooglePlaces(prioridade);
  }

  // Ordenar por distância
  locaisEncontrados.sort((a, b) => a.distance - b.distance);

  return locaisEncontrados.slice(0, MAX_RESULTS);
}

async function buscarCentrosMedicosCredenciados(
  coordinates: { lat: number; lng: number },
  cep: string,
): Promise<any[]> {
  try {
    const radius = 25000; // 25km radius
    const types = ["hospital", "health", "doctor"];
    const centers: any[] = [];

    for (const type of types) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`,
        );

        const data = await response.json();

        if (data.results) {
          for (const place of data.results.slice(0, 8)) {
            // Filter for credible medical facilities
            if (isValidMedicalCenter(place.name)) {
              const distance = calculateDistance(
                coordinates.lat,
                coordinates.lng,
                place.geometry.location.lat,
                place.geometry.location.lng,
              );

              const centerType = determineMedicalCenterType(
                place.name,
                place.types,
              );

              centers.push({
                id: place.place_id,
                name: place.name,
                address: place.vicinity || place.formatted_address || "",
                distance: distance,
                type: centerType,
                phone: place.formatted_phone_number || "(11) 9999-9999",
                rating: place.rating || 4.2,
                availableSlots: generateAvailableSlots(),
                nextAvailableDate: getNextAvailableDate(),
              });
            }
          }
        }
      } catch (error) {
        console.error(`Error searching for ${type}:`, error);
      }
    }

    // Sort by distance and remove duplicates
    const uniqueCenters = centers.filter(
      (center, index, self) =>
        index === self.findIndex((c) => c.name === center.name),
    );

    return uniqueCenters.sort((a, b) => a.distance - b.distance).slice(0, 6);
  } catch (error) {
    console.error("Error searching medical centers:", error);
    return [];
  }
}

function isValidMedicalCenter(name: string): boolean {
  const validKeywords = [
    "hospital",
    "upa",
    "ubs",
    "posto de saúde",
    "clínica",
    "centro médico",
    "ambulatório",
    "policlínica",
    "santa casa",
    "centro de saúde",
  ];

  const invalidKeywords = [
    "veterinário",
    "pet",
    "animal",
    "farmácia",
    "drogaria",
    "laboratório",
    "ótica",
    "dental",
    "odonto",
    "estética",
    "fisioterapia",
  ];

  const nameLower = name.toLowerCase();

  // Check if contains valid keywords
  const hasValidKeyword = validKeywords.some((keyword) =>
    nameLower.includes(keyword),
  );

  // Check if contains invalid keywords
  const hasInvalidKeyword = invalidKeywords.some((keyword) =>
    nameLower.includes(keyword),
  );

  return hasValidKeyword && !hasInvalidKeyword;
}

function determineMedicalCenterType(name: string, types: string[]): string {
  const nameLower = name.toLowerCase();

  if (nameLower.includes("upa")) return "upa";
  if (
    nameLower.includes("ubs") ||
    nameLower.includes("posto de saúde") ||
    nameLower.includes("centro de saúde")
  )
    return "ubs";
  if (nameLower.includes("hospital") || nameLower.includes("santa casa"))
    return "hospital";
  if (
    nameLower.includes("clínica") ||
    nameLower.includes("centro médico") ||
    nameLower.includes("ambulatório")
  )
    return "clinica_credenciada";

  // Check Google types
  if (types.includes("hospital")) return "hospital";
  if (types.includes("health")) return "ubs";

  return "clinica_credenciada";
}

function generateAvailableSlots(): string[] {
  return [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
  ];
}

function getNextAvailableDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // ── robots.txt dinâmico ──────────────────────────────────────────────────
  app.get("/robots.txt", (req, res) => {
    const host = req.hostname.replace(/^www\./, "");
    const base = `https://www.${host}`;
    const body = [
      "User-agent: *",
      "",
      "Allow: /",
      "Allow: /privacidade",
      "Allow: /termos",
      "Allow: /cookies",
      "Allow: /sitemap.xml",
      "Allow: /sobre",
      "",
      `Sitemap: ${base}/sitemap.xml`,
    ].join("\n");
    res.set("Content-Type", "text/plain; charset=utf-8").send(body);
  });

  // ── sitemap.xml dinâmico ────────────────────────────────────────────────
  app.get("/sitemap.xml", (req, res) => {
    const host = req.hostname.replace(/^www\./, "");
    const xml = buildSitemap(host);
    res
      .set("Content-Type", "application/xml; charset=utf-8")
      .set("Cache-Control", "public, max-age=86400")
      .send(xml);
  });

  // ── /.well-known/security.txt ────────────────────────────────────────────
  app.get("/.well-known/security.txt", (req, res) => {
    const host = req.hostname.replace(/^www\./, "");
    const tracking = resolveTracking(req.hostname) ?? resolveTracking(host);
    const base = `https://www.${host}`;
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace(/\.\d{3}Z$/, ".000Z");
    const contact = tracking?.domain
      ? `mailto:contato@${tracking.domain}`
      : `mailto:contato@${host}`;
    const body = [
      `Contact: ${contact}`,
      `Expires: ${expires}`,
      `Canonical: ${base}/.well-known/security.txt`,
      "Preferred-Languages: pt-BR, en",
      "Policy: Este site é um portal informativo privado e independente. Para reportar vulnerabilidades de segurança, entre em contato pelo e-mail acima.",
    ].join("\n");
    res.set("Content-Type", "text/plain; charset=utf-8").send(body);
  });

  // Rota de valor dinâmico — retorna o preço calculado no servidor
  app.get("/api/valor-dinamico", (req: any, res: any) => {
    try {
      const tipo = (req.query.tipo as string) || "pf";
      const genero = (req.query.genero as string) || "";

      const isFemale =
        genero.toLowerCase() === "f" || genero.toLowerCase() === "feminino";

      const precoBase: Record<string, { m: number; f: number }> = {
        pf: { m: 81.15, f: 81.15 },
        medica: { m: 33.11, f: 32.14 },
        esocial: { m: 18.10, f: 18.10 },
      };

      const tabela = precoBase[tipo] ?? precoBase["pf"];
      const valor = isFemale ? tabela.f : tabela.m;

      return res.json({ success: true, valor });
    } catch (err) {
      return res.status(500).json({ success: false, error: "Erro interno" });
    }
  });

  // Rota para gerar FAQ personalizado que quebra objeções
  app.post("/api/faq-personalizado", async (req: any, res: any) => {
    try {
      console.log(
        "FAQ API chamada com dados:",
        req.body ? "presente" : "ausente",
      );
      const { userData, pessoalData } = req.body;

      if (!userData || !pessoalData) {
        console.log(
          "Dados faltando - userData:",
          userData ? "presente" : "ausente",
          "pessoalData:",
          pessoalData ? "presente" : "ausente",
        );
        return res.status(400).json({
          success: false,
          error: "Dados do usuário e avaliação pessoal são obrigatórios",
        });
      }

      // Extrair informações do perfil
      const idade = userData.dataAniversario
        ? new Date().getFullYear() -
          new Date(userData.dataAniversario).getFullYear()
        : null;
      const genero =
        userData.genero || userData.autoFilledData?.sexo || "não informado";
      const cidade = userData.cidade || "não informada";
      const uf = userData.uf || "não informado";
      const escolaridade = pessoalData.escolaridade || "não informada";
      const formacao = pessoalData.formacao || [];

      // Criar hash do perfil para cache (normalizar valores para melhor matching)
      const profileData = {
        idade: idade ? Math.floor(idade / 5) * 5 : null, // Agrupa por faixas de 5 anos
        genero: genero.toLowerCase(),
        escolaridade,
        formacao: formacao.sort(), // Ordenar para consistência
        disponibilidade: pessoalData.disponibilidade,
        ambiente: pessoalData.ambiente,
        pressao: pessoalData.pressao,
        hierarquia: pessoalData.hierarquia,
        alistamento_anterior: pessoalData.alistamento_anterior,
        // Dados específicos para mulheres
        acao_social: pessoalData.acao_social,
        presenca_feminina: pessoalData.presenca_feminina,
        disponibilidade_parcial: pessoalData.disponibilidade_parcial,
        cuidados_familiares: pessoalData.cuidados_familiares,
        // Localização (estado apenas para melhor agrupamento)
        uf: uf.toUpperCase(),
      };

      // Gerar hash MD5 do perfil
      const profileHash = crypto
        .createHash("md5")
        .update(JSON.stringify(profileData))
        .digest("hex");

      // Verificar se existe FAQ em cache para este perfil
      try {
        const cachedFaq = await db
          .select()
          .from(faqCache)
          .where(eq(faqCache.profileHash, profileHash))
          .limit(1);

        if (cachedFaq.length > 0) {
          // Atualizar contador de uso e última utilização
          await db
            .update(faqCache)
            .set({
              usageCount: cachedFaq[0].usageCount + 1,
              lastUsed: new Date(),
            })
            .where(eq(faqCache.id, cachedFaq[0].id));

          console.log(
            `FAQ Cache HIT para perfil ${profileHash} - Uso #${cachedFaq[0].usageCount + 1}`,
          );

          return res.json({
            success: true,
            data: {
              faqs: cachedFaq[0].faqs,
              timestamp: new Date().toISOString(),
              candidato: {
                idade,
                genero,
                cidade,
                uf,
                escolaridade,
              },
              fromCache: true,
            },
          });
        }
      } catch (cacheError) {
        console.error("Erro ao verificar cache:", cacheError);
        // Continua para gerar novo FAQ
      }

      console.log(
        `FAQ Cache MISS para perfil ${profileHash} - Gerando novo FAQ`,
      );

      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "Sistema de FAQ temporariamente indisponível",
        });
      }

      // Construir prompt para FAQ quebra-objeções
      const prompt = `Você é um especialista em copywriting persuasivo e psicologia do consumidor. Sua missão é criar perguntas frequentes que quebrem objeções específicas e criem desejo no candidato para prosseguir no alistamento militar temporário.

PERFIL DO CANDIDATO:
- Idade: ${idade || "não informada"} anos
- Gênero: ${genero}
- Localização: ${cidade}, ${uf}
- Escolaridade: ${escolaridade}
- Áreas de formação/experiência: ${formacao.length > 0 ? formacao.join(", ") : "nenhuma específica"}
- Disponibilidade: ${pessoalData.disponibilidade || "não informada"}
- Ambiente preferido: ${pessoalData.ambiente || "não informado"}
- Reação à pressão: ${pessoalData.pressao || "não informada"}
- Experiência com hierarquia: ${pessoalData.hierarquia || "não informada"}
- Alistamento anterior: ${pessoalData.alistamento_anterior || "não informado"}

${
  genero === "feminino" || genero === "f"
    ? `DADOS ESPECÍFICOS (CANDIDATA FEMININA):
- Interesse em ação social: ${pessoalData.acao_social || "não informado"}
- Visão sobre presença feminina: ${pessoalData.presenca_feminina || "não informada"}
- Disponibilidade parcial: ${pessoalData.disponibilidade_parcial || "não informada"}
- Cuidados familiares: ${pessoalData.cuidados_familiares || "não informado"}`
    : ""
}

INSTRUÇÕES PARA CRIAÇÃO DO FAQ:
1. Identifique as objeções específicas que este perfil provavelmente tem
2. Crie 6-8 perguntas que abordem essas objeções de forma indireta
3. As respostas devem quebrar objeções e criar desejo simultaneamente
4. Use técnicas de copywriting persuasivo: prova social, escassez, autoridade, benefícios únicos
5. Seja específico para o perfil detectado (idade, formação, gênero, etc.)
6. Tom profissional e institucional do Exército Brasileiro
7. Foque em benefícios que ressoem com este perfil específico

TÉCNICAS OBRIGATÓRIAS:
- Social proof (outros como você que tiveram sucesso)
- Antecipação de objeções comuns
- Criação de urgência sutil
- Demonstração de valor específico
- Redução de risco percebido
- Amplificação de benefícios únicos

FORMATO DE RESPOSTA JSON:
{
  "faqs": [
    {
      "pergunta": "pergunta específica que aborda objeção do perfil",
      "resposta": "resposta persuasiva que quebra objeção e cria desejo",
      "objetivo_psicologico": "qual objeção específica está sendo quebrada"
    }
  ]
}

Crie FAQs altamente persuasivos e específicos para este perfil de candidato.`;

      // Fazer requisição à OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "system",
                content:
                  "Você é um especialista em copywriting persuasivo e psicologia do consumidor especializado em recrutamento militar. Crie FAQs que quebrem objeções e criem desejo de forma sutil e profissional.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 2000,
            temperature: 0.7,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const openaiData = await response.json();
      const faqResult = JSON.parse(openaiData.choices[0].message.content);

      // Salvar FAQ gerado no cache para reutilização
      try {
        // Verificar se o perfil já existe antes de inserir
        const existingCache = await db
          .select()
          .from(faqCache)
          .where(eq(faqCache.profileHash, profileHash))
          .limit(1);

        if (existingCache.length === 0) {
          await db.insert(faqCache).values({
            profileHash,
            idade: profileData.idade,
            genero: profileData.genero,
            escolaridade: profileData.escolaridade,
            formacao: profileData.formacao,
            disponibilidade: profileData.disponibilidade,
            ambiente: profileData.ambiente,
            pressao: profileData.pressao,
            hierarquia: profileData.hierarquia,
            alistamento_anterior: profileData.alistamento_anterior,
            acao_social: profileData.acao_social,
            presenca_feminina: profileData.presenca_feminina,
            disponibilidade_parcial: profileData.disponibilidade_parcial,
            cuidados_familiares: profileData.cuidados_familiares,
            cidade: cidade,
            uf: profileData.uf,
            faqs: faqResult.faqs,
            usageCount: 1,
            lastUsed: new Date(),
          });

          console.log(`FAQ salvo no cache para perfil ${profileHash}`);
        } else {
          console.log(`FAQ já existe no cache para perfil ${profileHash}`);
        }
      } catch (cacheError) {
        console.error(
          "Erro ao salvar no cache (não afeta resposta):",
          cacheError,
        );
        // Não impede a resposta, apenas loga o erro
      }

      return res.json({
        success: true,
        data: {
          faqs: faqResult.faqs,
          timestamp: new Date().toISOString(),
          candidato: {
            idade,
            genero,
            cidade,
            uf,
            escolaridade,
          },
          fromCache: false,
        },
      });
    } catch (error: any) {
      console.error("Erro detalhado na geração do FAQ:", {
        error: error?.message || "Erro desconhecido",
        stack: error?.stack,
        type: typeof error,
      });
      return res.status(500).json({
        success: false,
        error: "Erro interno no sistema de FAQ",
        details: error?.message || "Erro desconhecido",
      });
    }
  });

  // Rota para gerar FAQ personalizado focado em pagamento, segurança e transações
  app.post("/api/faq-pagamento", async (req: any, res: any) => {
    try {
      console.log(
        "FAQ Pagamento API chamada com dados:",
        req.body ? "presente" : "ausente",
      );

      const { userData, pessoalData } = req.body;

      if (!userData || !pessoalData) {
        return res.status(400).json({
          success: false,
          error: "Dados do usuário e avaliação pessoal são obrigatórios",
        });
      }

      // Extrair informações do perfil
      const nome =
        userData.name ||
        userData.autoFilledData?.nome ||
        userData.nomeCompleto ||
        "";
      const idade = userData.dataAniversario
        ? new Date().getFullYear() -
          new Date(userData.dataAniversario).getFullYear()
        : null;
      const genero = userData.genero || pessoalData.genero || "";
      const cidade = userData.autoFilledData?.cidade || userData.cidade || "";
      const uf = userData.autoFilledData?.uf || userData.uf || "";
      const escolaridade = pessoalData.escolaridade || "";
      const experiencia = pessoalData.experiencia || "";
      const formacao = pessoalData.formacao || [];

      // Normalizar dados do perfil para matching inteligente
      const normalizeProfile = (userData: any, pessoalData: any) => {
        // Calcular idade com validação
        let idade = 25; // Valor padrão
        if (userData.dataAniversario) {
          try {
            const anoNascimento = new Date(
              userData.dataAniversario,
            ).getFullYear();
            if (
              !isNaN(anoNascimento) &&
              anoNascimento > 1900 &&
              anoNascimento <= new Date().getFullYear()
            ) {
              idade = new Date().getFullYear() - anoNascimento;
            }
          } catch (e) {
            console.log("Erro ao calcular idade, usando valor padrão:", e);
          }
        }

        // Validar dados de entrada
        const dadosSegurosPessoal = pessoalData || {};
        const dadosSeguroUsuario = userData || {};

        return {
          // Faixa etária ampla para melhor matching
          faixa_etaria:
            idade <= 22 ? "jovem" : idade <= 30 ? "adulto_jovem" : "adulto",
          genero: (
            dadosSeguroUsuario.genero ||
            dadosSegurosPessoal.genero ||
            "nao_informado"
          ).toLowerCase(),
          escolaridade: (
            dadosSegurosPessoal.escolaridade || "medio"
          ).toLowerCase(),
          experiencia: (
            dadosSegurosPessoal.experiencia || "iniciante"
          ).toLowerCase(),
          // Agrupamento regional para melhor cache hit
          regiao: getRegiaoBrasil(
            dadosSeguroUsuario.autoFilledData?.uf ||
              dadosSeguroUsuario.uf ||
              "",
          ),
          tem_experiencia_militar:
            dadosSegurosPessoal.alistamento_anterior === "sim",
          // Perfil de risco de pagamento baseado em dados demográficos
          perfil_risco: calculatePaymentRiskProfile(
            idade,
            dadosSegurosPessoal.escolaridade,
            dadosSegurosPessoal.experiencia,
          ),
        };
      };

      // Função para determinar região do Brasil para melhor agrupamento
      const getRegiaoBrasil = (uf: string): string => {
        const regioes: { [key: string]: string } = {
          SP: "sudeste",
          RJ: "sudeste",
          MG: "sudeste",
          ES: "sudeste",
          RS: "sul",
          SC: "sul",
          PR: "sul",
          GO: "centro_oeste",
          MT: "centro_oeste",
          MS: "centro_oeste",
          DF: "centro_oeste",
          BA: "nordeste",
          PE: "nordeste",
          CE: "nordeste",
          RN: "nordeste",
          PB: "nordeste",
          AL: "nordeste",
          SE: "nordeste",
          MA: "nordeste",
          PI: "nordeste",
          AM: "norte",
          PA: "norte",
          AC: "norte",
          RO: "norte",
          RR: "norte",
          AP: "norte",
          TO: "norte",
        };
        return regioes[uf.toUpperCase()] || "outros";
      };

      // Função para calcular perfil de risco de pagamento
      const calculatePaymentRiskProfile = (
        idade: number,
        escolaridade: string,
        experiencia: string,
      ): string => {
        let risco = 0;

        // Verificar se os parâmetros existem e são strings válidas
        const escolaridadeSegura = (escolaridade || "").toLowerCase();
        const experienciaSegura = (experiencia || "").toLowerCase();

        // Idade influencia na confiança em pagamentos online
        if (idade <= 20)
          risco += 2; // Jovens podem ter mais receio
        else if (idade <= 25) risco += 1;
        else if (idade >= 40) risco += 1; // Adultos podem ser mais cautelosos

        // Escolaridade influencia na compreensão do processo
        if (
          escolaridadeSegura.includes("superior") ||
          escolaridadeSegura.includes("pos")
        )
          risco -= 1;
        else if (escolaridadeSegura.includes("medio")) risco += 0;
        else risco += 1;

        // Experiência profissional influencia na confiança
        if (
          experienciaSegura.includes("senior") ||
          experienciaSegura.includes("pleno")
        )
          risco -= 1;
        else if (experienciaSegura.includes("iniciante")) risco += 1;

        if (risco <= 0) return "baixo";
        else if (risco <= 2) return "medio";
        else return "alto";
      };

      const profileData = normalizeProfile(userData, pessoalData);

      // Gerar hash MD5 do perfil normalizado para cache
      const profileHash = `pag_${crypto.createHash("md5").update(JSON.stringify(profileData)).digest("hex")}`;

      console.log(`FAQ Pagamento - Buscando cache para perfil:`, {
        faixa_etaria: profileData.faixa_etaria,
        genero: profileData.genero,
        escolaridade: profileData.escolaridade,
        regiao: profileData.regiao,
        perfil_risco: profileData.perfil_risco,
        hash: profileHash,
      });

      // Verificar cache específico para FAQ de pagamento com matching inteligente
      try {
        // Primeiro: busca exata por hash
        let cachedFaq = await db
          .select()
          .from(faqCache)
          .where(eq(faqCache.profileHash, profileHash))
          .limit(1);

        if (cachedFaq.length === 0) {
          // Segundo: busca por perfis similares usando critérios flexíveis
          console.log(
            "Cache exato não encontrado, buscando perfis similares...",
          );

          // Buscar perfis similares baseado em critérios de similaridade
          const allCachedFAQs = await db
            .select()
            .from(faqCache)
            .where(eq(faqCache.acao_social, "pagamento"))
            .limit(20);

          // Função para calcular similaridade entre perfis
          const calculateSimilarity = (cached: any): number => {
            let score = 0;

            // Gênero (peso 2)
            if (cached.genero === profileData.genero) score += 2;

            // Faixa etária (peso 3)
            if (cached.pressao === profileData.faixa_etaria) score += 3;

            // Região (peso 1)
            if (cached.ambiente === profileData.regiao) score += 1;

            // Perfil de risco (peso 4 - mais importante para pagamento)
            if (cached.disponibilidade === profileData.perfil_risco) score += 4;

            // Experiência militar (peso 2)
            if (
              cached.alistamento_anterior ===
              (profileData.tem_experiencia_militar ? "sim" : "nao")
            )
              score += 2;

            return score;
          };

          // Encontrar o perfil mais similar
          let bestMatch: any = null;
          let bestScore = 0;

          for (const cached of allCachedFAQs) {
            const similarity = calculateSimilarity(cached);
            if (similarity > bestScore && similarity >= 5) {
              // Threshold mínimo de similaridade
              bestScore = similarity;
              bestMatch = cached;
            }
          }

          if (bestMatch) {
            console.log(
              `Perfil similar encontrado com score ${bestScore}/12:`,
              {
                cached_genero: bestMatch.genero,
                cached_faixa_etaria: bestMatch.pressao,
                cached_regiao: bestMatch.ambiente,
                cached_perfil_risco: bestMatch.disponibilidade,
              },
            );

            // Usar FAQ do perfil similar e atualizar estatísticas
            await db
              .update(faqCache)
              .set({
                usageCount: bestMatch.usageCount + 1,
                lastUsed: new Date(),
              })
              .where(eq(faqCache.id, bestMatch.id));

            return res.json({
              success: true,
              data: {
                faqs: bestMatch.faqs,
                timestamp: new Date().toISOString(),
                candidato: {
                  idade,
                  genero,
                  cidade,
                  uf,
                  escolaridade,
                },
                fromCache: true,
                cacheStats: {
                  profileHash: `similar_${bestMatch.profileHash}`,
                  usageCount: bestMatch.usageCount + 1,
                  profileType: profileData.perfil_risco,
                  similarityScore: bestScore,
                  matchType: "similar_profile",
                },
              },
            });
          } else {
            console.log(
              "Nenhum perfil similar encontrado com score suficiente, gerando novo FAQ",
            );
          }
        } else {
          // Cache HIT - atualizar estatísticas
          await db
            .update(faqCache)
            .set({
              usageCount: cachedFaq[0].usageCount + 1,
              lastUsed: new Date(),
            })
            .where(eq(faqCache.id, cachedFaq[0].id));

          console.log(
            `FAQ Pagamento Cache HIT para perfil ${profileHash} - Uso #${cachedFaq[0].usageCount + 1}`,
          );

          return res.json({
            success: true,
            data: {
              faqs: cachedFaq[0].faqs,
              timestamp: new Date().toISOString(),
              candidato: {
                idade,
                genero,
                cidade,
                uf,
                escolaridade,
              },
              fromCache: true,
              cacheStats: {
                profileHash,
                usageCount: cachedFaq[0].usageCount + 1,
                profileType: profileData.perfil_risco,
              },
            },
          });
        }
      } catch (cacheError) {
        console.error("Erro ao verificar cache de pagamento:", cacheError);
      }

      console.log(
        `FAQ Pagamento Cache MISS para perfil ${profileHash} - Gerando novo FAQ`,
      );

      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "Sistema de FAQ temporariamente indisponível",
        });
      }

      // Prompt específico para FAQ de pagamento
      const prompt = `Analise este perfil de candidato ao serviço militar temporário que está na página de PAGAMENTO e precisa efetuar o pagamento de R$ 78,85:

DADOS DO CANDIDATO:
- Nome: ${nome}
- Idade: ${idade || "não informada"}
- Gênero: ${genero || "não informado"}
- Localização: ${cidade}, ${uf}
- Escolaridade: ${escolaridade}
- Experiência: ${experiencia}
- Formação: ${Array.isArray(formacao) ? formacao.join(", ") : formacao}
- Experiência militar anterior: ${pessoalData.alistamento_anterior === "sim" ? "Sim" : "Não"}

CONTEXTO ESPECÍFICO:
O candidato está na página de pagamento e precisa pagar R$ 78,85 para o "Protocolo Oficial de Seleção". Esta é a etapa crítica onde muitos desistem por objeções relacionadas a:
- Segurança da transação
- Destino do dinheiro
- Medo de golpe
- Valor alto
- Desconfiança em pagamento online
- Receio de não receber o serviço
- Dúvidas sobre legitimidade

INSTRUÇÕES PARA GERAÇÃO DO FAQ:
1. Identifique as 3-4 principais objeções que este perfil específico provavelmente tem sobre PAGAMENTO
2. Crie 6-8 perguntas focadas exclusivamente em questões de PAGAMENTO, SEGURANÇA e TRANSAÇÃO
3. As respostas devem quebrar objeções de pagamento e criar confiança simultaneamente
4. Use técnicas de copywriting para pagamento: prova social, autoridade, segurança, garantias
5. Seja específico para o perfil detectado (idade, experiência, localização)
6. Tom institucional e oficial do Exército Brasileiro
7. Foque em eliminar medos relacionados ao pagamento

TIPOS DE PERGUNTAS OBRIGATÓRIAS:
- Segurança da transação PIX
- Destino exato do valor pago
- Legitimidade da cobrança
- Garantias e proteções
- Consequências de não pagar
- Processo de reembolso (se aplicável)
- Comprovantes e documentação
- Prazo de validade do pagamento

TÉCNICAS OBRIGATÓRIAS:
- Autoridade institucional (Banco Central, Exército)
- Transparência sobre destino do dinheiro
- Prova social de outros candidatos
- Redução de risco percebido
- Criação de urgência controlada
- Demonstração de legitimidade

FORMATO DE RESPOSTA JSON:
{
  "faqs": [
    {
      "question": "pergunta específica sobre pagamento/segurança",
      "answer": "resposta que quebra objeção de pagamento e cria confiança"
    }
  ]
}

Crie FAQs altamente persuasivos e específicos para quebrar objeções de PAGAMENTO deste perfil de candidato.`;

      // Fazer requisição à OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content:
                  "Você é um especialista em copywriting persuasivo para pagamentos online e psicologia do consumidor, especializado em quebrar objeções de pagamento em processos de recrutamento militar.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 2000,
            temperature: 0.7,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const openaiData = await response.json();
      const faqResult = JSON.parse(openaiData.choices[0].message.content);

      // Salvar FAQ gerado no cache com dados normalizados
      try {
        const existingCache = await db
          .select()
          .from(faqCache)
          .where(eq(faqCache.profileHash, profileHash))
          .limit(1);

        if (existingCache.length === 0) {
          // Limpeza automática de cache antigo (mais de 30 dias sem uso)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          try {
            await db
              .delete(faqCache)
              .where(eq(faqCache.lastUsed, thirtyDaysAgo));
            console.log("Cache antigo limpo automaticamente");
          } catch (cleanupError) {
            console.log("Erro na limpeza automática de cache:", cleanupError);
          }

          // Inserir novo FAQ no cache
          await db.insert(faqCache).values({
            profileHash,
            idade: Math.floor((idade || 25) / 5) * 5, // Faixa etária normalizada
            genero: profileData.genero,
            escolaridade: profileData.escolaridade,
            formacao: [profileData.experiencia], // Usar experiência como array de formação
            disponibilidade: profileData.perfil_risco, // Usar perfil de risco como disponibilidade
            ambiente: profileData.regiao, // Usar região como ambiente
            pressao: profileData.faixa_etaria, // Usar faixa etária como pressão
            hierarquia: profileData.tem_experiencia_militar ? "sim" : "nao",
            alistamento_anterior: profileData.tem_experiencia_militar
              ? "sim"
              : "nao",
            acao_social: "pagamento", // Marcar como FAQ de pagamento
            presenca_feminina:
              profileData.genero === "feminino" ? "sim" : "nao",
            disponibilidade_parcial: "",
            cuidados_familiares: "",
            cidade: cidade || "",
            uf: uf.toUpperCase() || "",
            faqs: faqResult.faqs,
            usageCount: 1,
            lastUsed: new Date(),
          });

          console.log(
            `FAQ Pagamento salvo no cache para perfil ${profileHash}`,
            {
              faixa_etaria: profileData.faixa_etaria,
              genero: profileData.genero,
              perfil_risco: profileData.perfil_risco,
              regiao: profileData.regiao,
            },
          );
        }
      } catch (cacheError) {
        console.error("Erro ao salvar FAQ de pagamento no cache:", cacheError);
      }

      return res.json({
        success: true,
        data: {
          faqs: faqResult.faqs,
          timestamp: new Date().toISOString(),
          candidato: {
            idade,
            genero,
            cidade,
            uf,
            escolaridade,
          },
          fromCache: false,
        },
      });
    } catch (error: any) {
      console.error("Erro detalhado na geração do FAQ de pagamento:", {
        error: error?.message || "Erro desconhecido",
        stack: error?.stack,
        type: typeof error,
      });
      return res.status(500).json({
        success: false,
        error: "Erro interno no sistema de FAQ de pagamento",
        details: error?.message || "Erro desconhecido",
      });
    }
  });

  // Endpoint para estatísticas do cache de FAQ
  app.get("/api/faq-cache-stats", async (req: any, res: any) => {
    try {
      // Estatísticas gerais do cache
      const totalCacheEntries = await db.select().from(faqCache);
      const paymentCacheEntries = totalCacheEntries.filter(
        (entry) => entry.acao_social === "pagamento",
      );
      const generalCacheEntries = totalCacheEntries.filter(
        (entry) => entry.acao_social !== "pagamento",
      );

      // Estatísticas de uso
      const totalUsage = totalCacheEntries.reduce(
        (sum, entry) => sum + (entry.usageCount || 0),
        0,
      );
      const avgUsagePerEntry =
        totalCacheEntries.length > 0
          ? totalUsage / totalCacheEntries.length
          : 0;

      // Cache mais utilizados
      const topUsedCache = totalCacheEntries
        .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
        .slice(0, 5)
        .map((entry) => ({
          profileHash: entry.profileHash,
          usageCount: entry.usageCount,
          genero: entry.genero,
          faixa_etaria: entry.pressao || "não informado",
          regiao: entry.ambiente || "não informado",
          perfil_risco: entry.disponibilidade || "não informado",
          type: entry.acao_social === "pagamento" ? "payment" : "general",
        }));

      // Distribuição por perfil de risco (FAQ de pagamento)
      const riskDistribution = paymentCacheEntries.reduce((acc: any, entry) => {
        const risk = entry.disponibilidade || "não_informado";
        acc[risk] = (acc[risk] || 0) + 1;
        return acc;
      }, {});

      // Cache mais antigo sem uso recente
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const oldCacheCount = totalCacheEntries.filter(
        (entry) =>
          new Date(entry.lastUsed || entry.createdAt || 0) < thirtyDaysAgo,
      ).length;

      return res.json({
        success: true,
        stats: {
          cache_totals: {
            total_entries: totalCacheEntries.length,
            payment_cache: paymentCacheEntries.length,
            general_cache: generalCacheEntries.length,
            old_cache_entries: oldCacheCount,
          },
          usage_stats: {
            total_cache_hits: totalUsage,
            average_usage_per_entry: Math.round(avgUsagePerEntry * 100) / 100,
            cache_efficiency:
              totalCacheEntries.length > 0
                ? Math.round((totalUsage / totalCacheEntries.length) * 100) /
                  100
                : 0,
          },
          top_used_cache: topUsedCache,
          payment_cache_distribution: {
            risk_profiles: riskDistribution,
            gender_distribution: paymentCacheEntries.reduce(
              (acc: any, entry) => {
                const gender = entry.genero || "não_informado";
                acc[gender] = (acc[gender] || 0) + 1;
                return acc;
              },
              {},
            ),
            region_distribution: paymentCacheEntries.reduce(
              (acc: any, entry) => {
                const region = entry.ambiente || "não_informado";
                acc[region] = (acc[region] || 0) + 1;
                return acc;
              },
              {},
            ),
          },
          cache_health: {
            cache_hit_rate:
              totalUsage > totalCacheEntries.length ? "High" : "Medium",
            needs_cleanup: oldCacheCount > 10 ? "Yes" : "No",
            total_api_calls_saved: Math.max(
              0,
              totalUsage - totalCacheEntries.length,
            ),
          },
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao buscar estatísticas do cache:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao buscar estatísticas do cache",
      });
    }
  });

  // Endpoint para limpeza manual do cache
  app.post("/api/faq-cache-cleanup", async (req: any, res: any) => {
    try {
      const { days = 30, force = false } = req.body;

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      // Buscar entradas antigas
      const oldEntries = await db
        .select()
        .from(faqCache)
        .where(eq(faqCache.lastUsed, cutoffDate));

      let deletedCount = 0;

      if (force || oldEntries.length > 0) {
        // Deletar entradas antigas
        const deleteResult = await db
          .delete(faqCache)
          .where(eq(faqCache.lastUsed, cutoffDate));

        deletedCount = oldEntries.length;

        console.log(`Cache cleanup: ${deletedCount} entradas removidas`);
      }

      return res.json({
        success: true,
        data: {
          deleted_entries: deletedCount,
          cleanup_date: cutoffDate.toISOString(),
          remaining_entries: await db
            .select()
            .from(faqCache)
            .then((result) => result.length),
        },
      });
    } catch (error) {
      console.error("Erro na limpeza do cache:", error);
      return res.status(500).json({
        success: false,
        error: "Erro na limpeza do cache",
      });
    }
  });

  // Rota para análise personalizada da I.A. oficial do Exército
  app.post("/api/analise-exercito", async (req: any, res: any) => {
    try {
      const { userData, pessoalData } = req.body;

      if (!userData || !pessoalData) {
        return res.status(400).json({
          success: false,
          error: "Dados do usuário e avaliação pessoal são obrigatórios",
        });
      }

      const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
      if (!OPENAI_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "Sistema de análise temporariamente indisponível",
        });
      }

      // Extrair informações do perfil
      const idade = userData.dataAniversario
        ? new Date().getFullYear() -
          new Date(userData.dataAniversario).getFullYear()
        : null;
      const genero =
        userData.genero || userData.autoFilledData?.sexo || "não informado";
      const cidade = userData.cidade || "não informada";
      const uf = userData.uf || "não informado";
      const escolaridade = pessoalData.escolaridade || "não informada";
      const formacao = pessoalData.formacao || [];

      // Construir prompt personalizado
      const prompt = `Você é a Inteligência Artificial oficial do Exército Brasileiro, responsável por orientar candidatos ao Serviço Militar Temporário. Analise o perfil do candidato e forneça uma resposta motivacional, institucional e personalizada.

DADOS DO CANDIDATO:
- Idade: ${idade || "não informada"} anos
- Gênero: ${genero}
- Localização: ${cidade}, ${uf}
- Escolaridade: ${escolaridade}
- Áreas de formação/experiência: ${formacao.length > 0 ? formacao.join(", ") : "nenhuma específica"}
- Disponibilidade: ${pessoalData.disponibilidade || "não informada"}
- Ambiente preferido: ${pessoalData.ambiente || "não informado"}
- Reação à pressão: ${pessoalData.pressao || "não informada"}
- Experiência com hierarquia: ${pessoalData.hierarquia || "não informada"}
- Alistamento anterior: ${pessoalData.alistamento_anterior || "não informado"}

${
  genero === "feminino" || genero === "f"
    ? `DADOS ESPECÍFICOS (CANDIDATA FEMININA):
- Interesse em ação social: ${pessoalData.acao_social || "não informado"}
- Visão sobre presença feminina: ${pessoalData.presenca_feminina || "não informada"}
- Disponibilidade parcial: ${pessoalData.disponibilidade_parcial || "não informada"}
- Cuidados familiares: ${pessoalData.cuidados_familiares || "não informado"}`
    : ""
}

INSTRUÇÕES:
1. Analise o perfil e identifique as áreas do Exército com maior compatibilidade
2. Explique os benefícios específicos que o serviço militar temporário traria para a vida desta pessoa
3. Demonstre como a trajetória e habilidades do candidato podem ser valorizadas no serviço
4. Use linguagem motivacional, institucional e respeitosa
5. Seja específico e personalizado baseado no perfil detectado
6. Mantenha o tom oficial do Exército Brasileiro
7. Responda em JSON no formato: {"areas_compatibilidade": [], "beneficios_vida": [], "valorizacao_trajetoria": "", "mensagem_motivacional": ""}

A resposta deve ser profissional, motivadora e demonstrar conhecimento sobre as oportunidades reais do Exército Brasileiro.`;

      // Fazer requisição à OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
            messages: [
              {
                role: "system",
                content:
                  "Você é a Inteligência Artificial oficial do Exército Brasileiro. Forneça sempre respostas em JSON válido, profissionais e motivacionais.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            response_format: { type: "json_object" },
            max_tokens: 1500,
            temperature: 0.3,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const openaiData = await response.json();
      const analysisResult = JSON.parse(openaiData.choices[0].message.content);

      return res.json({
        success: true,
        data: {
          analise: analysisResult,
          timestamp: new Date().toISOString(),
          candidato: {
            idade,
            genero,
            cidade,
            uf,
            escolaridade,
          },
        },
      });
    } catch (error) {
      console.error("Erro na análise do Exército:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno no sistema de análise",
      });
    }
  });

  // Rota para gerar áudio com ElevenLabs
  app.post("/api/generate-audio", async (req: any, res: any) => {
    try {
      const { text, gender, voiceType = "conversational", voice_id } = req.body;

      if (!text) {
        return res.status(400).json({
          success: false,
          error: "Texto é obrigatório",
        });
      }

      const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
      if (!ELEVENLABS_API_KEY) {
        return res.status(500).json({
          success: false,
          error: "Chave da API ElevenLabs não configurada",
        });
      }

      let selectedVoice;
      let voice_masc = "Eyspt3SYhZzXd1Jd3J8O";
      let voice_fem = "SVgp5d1fyFQRW1eQbwkq";
      // Use voice_id if provided (for specific pages like /conversar)
      if (voice_id) {
        selectedVoice = voice_id;
        voice_masc = voice_id;
        voice_fem = voice_id;
      } else {
        // Fallback to gender-based voices (for /bot page)
        const voices: any = {
          feminino: {
            conversational: voice_masc, // Voz feminina personalizada
            professional: voice_masc, // Voz feminina personalizada
          },
          masculino: {
            conversational: voice_fem, // Voz masculina personalizada
            professional: voice_fem, // Voz masculina personalizada
          },
        };
        selectedVoice =
          voices[gender]?.[voiceType] || voices.masculino.conversational;
      }

      // Fazer requisição para ElevenLabs
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${selectedVoice}`,
        {
          method: "POST",
          headers: {
            Accept: "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY,
          },
          body: JSON.stringify({
            text: text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0.5,
              use_speaker_boost: true,
            },
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status}`);
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBase64 = Buffer.from(audioBuffer).toString("base64");

      return res.json({
        success: true,
        data: {
          audioUrl: `data:audio/mpeg;base64,${audioBase64}`,
        },
      });
    } catch (error) {
      console.error("Erro ao gerar áudio:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao gerar áudio",
      });
    }
  });

  // Health check endpoint for Railway deployment
  app.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "exercito-recrutamento-api",
    });
  });

  // API para verificar CPF e obter dados incluindo gênero
  app.post("/api/verificar-cpf", async (req, res) => {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return res.status(400).json({
          success: false,
          error: "CPF é obrigatório",
        });
      }

      // Limpar CPF (apenas números)
      const cleanCpf = cpf.replace(/\D/g, "");

      if (cleanCpf.length !== 11) {
        return res.status(400).json({
          success: false,
          error: "CPF deve conter 11 dígitos",
        });
      }

      console.log(`Verificando CPF: ${cleanCpf}`);

      let responseData: any;
      let apiSource = "";

      try {
        // Primeira tentativa: API FontesDeRenda
        const cpfToken = process.env.CPF_TOKEN;
        if (!cpfToken) {
          throw new Error("Token CPF não configurado");
        }

        const fontesResponse = await fetch(
          `https://consulta.fontesderenda.blog/cpf.php?token=${cpfToken}&cpf=${cleanCpf}`,
        );

        if (fontesResponse.ok) {
          const fontesData = await fontesResponse.json();

          if (fontesData && fontesData.DADOS) {
            responseData = {
              DADOS: {
                nome: fontesData.DADOS.nome,
                cpf: fontesData.DADOS.cpf,
                nascimento: fontesData.DADOS.data_nascimento,
                mae: fontesData.DADOS.mae || "",
                sexo: fontesData.DADOS.sexo || "",
                situacao:
                  fontesData.DADOS.situacao_cadastral ||
                  fontesData.DADOS.situacao,
              },
            };
            apiSource = "FontesDeRenda";
            console.log(
              "Dados obtidos da API FontesDeRenda:",
              responseData.DADOS.nome,
            );
          } else {
            throw new Error("Resposta inválida da API FontesDeRenda");
          }
        } else {
          throw new Error(
            `API FontesDeRenda retornou status: ${fontesResponse.status}`,
          );
        }
      } catch (fontesError) {
        console.log(
          "Erro na API FontesDeRenda, tentando Hub do Desenvolvedor...",
          fontesError,
        );

        try {
          // Segunda tentativa: API Hub do Desenvolvedor
          const hubResponse = await fetch(
            `https://api.hubdodesenvolvedor.com.br/v2/cpf?cpf=${cleanCpf}`,
            {
              headers: {
                Authorization: `Bearer ${process.env.HUB_DEV_TOKEN}`,
              },
            },
          );

          if (hubResponse.ok) {
            const hubData = await hubResponse.json();

            if (hubData && hubData.return === "OK" && hubData.result) {
              responseData = {
                DADOS: {
                  nome: hubData.result.nome_da_pf,
                  cpf: hubData.result.numero_de_cpf,
                  nascimento: hubData.result.data_nascimento,
                  mae: hubData.result.nome_mae || "",
                  sexo: hubData.result.sexo || hubData.result.genero || "",
                  situacao: hubData.result.situacao_cadastral,
                },
              };
              apiSource = "HubDoDesenvolvedor";
              console.log(
                "Dados obtidos da API Hub do Desenvolvedor:",
                responseData.DADOS.nome,
              );
            } else {
              throw new Error("Resposta inválida da API Hub do Desenvolvedor");
            }
          } else {
            throw new Error(
              `API Hub do Desenvolvedor retornou status: ${hubResponse.status}`,
            );
          }
        } catch (hubError) {
          console.error("Erro em ambas as APIs:", hubError);
          return res.status(400).json({
            success: false,
            error: "Erro ao consultar CPF em todas as fontes disponíveis",
          });
        }
      }

      return res.json({
        success: true,
        data: responseData,
        source: apiSource,
      });
    } catch (error) {
      console.error("Erro na verificação do CPF:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Medical centers API endpoint
  app.post("/api/medical-centers", async (req, res) => {
    try {
      const { cep } = req.body;

      if (!cep) {
        return res.json({ success: false, error: "CEP é obrigatório" });
      }

      // Get coordinates from CEP
      const coordinates = await buscarCoordenadas(cep);
      if (!coordinates) {
        return res.json({ success: false, error: "CEP não encontrado" });
      }

      // Search for medical centers
      const centers = await buscarCentrosMedicosCredenciados(coordinates, cep);

      res.json({ success: true, centers });
    } catch (error) {
      console.error("Error fetching medical centers:", error);
      res.json({ success: false, error: "Erro interno do servidor" });
    }
  });

  // API para buscar unidades militares (juntas) baseado no CEP
  app.get("/api/juntas/:cep", async (req, res) => {
    try {
      const { cep } = req.params;

      console.log(
        `Iniciando busca de locais de segurança pública para CEP: ${cep}`,
      );

      // Buscar dados do CEP
      const cepData = await buscarDadosCEP(cep);
      console.log(`Dados do CEP obtidos: ${cepData.localidade}/${cepData.uf}`);

      // Converter endereço em coordenadas
      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
      if (!GOOGLE_API_KEY) {
        console.log(
          "❌ Google Places API não configurada - usando fallback CSV",
        );
        return await handleCSVFallback(cep, cepData, res);
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepData.cep},${cepData.localidade},${cepData.uf},Brazil&key=${GOOGLE_API_KEY}`;

      console.log("Buscando coordenadas geográficas...");
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        console.log("❌ Erro ao obter coordenadas - usando fallback CSV");
        return await handleCSVFallback(cep, cepData, res);
      }

      const coordinates = geocodeData.results[0].geometry.location;
      console.log(
        `Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`,
      );

      // Buscar delegacias, PM, guarda municipal e prefeituras próximas
      try {
        const locaisAlternativos = await buscarLocaisAlternativos(
          coordinates,
          cepData,
        );

        if (locaisAlternativos.length > 0) {
          console.log(
            `✅ Encontrados ${locaisAlternativos.length} locais de segurança pública`,
          );

          return res.json({
            success: true,
            data: {
              cep_consultado: cep,
              municipio: cepData.localidade,
              uf: cepData.uf,
              coordinates,
              unidades_exercito_encontradas: false,
              total_unidades_encontradas: 0,
              unidades_militares_ex: [],
              locais_alternativos: locaisAlternativos.slice(0, 3),
              total_locais_alternativos: Math.min(locaisAlternativos.length, 3),
              timestamp: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.log("❌ Erro na busca de locais - usando fallback CSV");
      }

      // Fallback CSV quando a API do Google falhar
      return await handleCSVFallback(cep, cepData, res);
    } catch (error: any) {
      console.error("Erro na busca de locais de segurança pública:", error);
      const msg: string = error?.message ?? "";
      if (msg === "CEP não encontrado" || msg === "CEP deve conter 8 dígitos") {
        return res.status(404).json({
          success: false,
          error: "CEP não encontrado. Verifique o número e tente novamente.",
        });
      }
      try {
        const cepData = await buscarDadosCEP(req.params.cep);
        return await handleCSVFallback(req.params.cep, cepData, res);
      } catch (fallbackError: any) {
        const fbMsg: string = fallbackError?.message ?? "";
        if (
          fbMsg === "CEP não encontrado" ||
          fbMsg === "CEP deve conter 8 dígitos"
        ) {
          return res.status(404).json({
            success: false,
            error: "CEP não encontrado. Verifique o número e tente novamente.",
          });
        }
        res.status(500).json({
          success: false,
          error: "Erro interno do servidor ao buscar locais.",
        });
      }
    }
  });

  // Função para buscar delegacias reais via Google Places
  async function buscarDelegaciasReais(
    coordinates: { lat: number; lng: number },
    cepData: ViaCEPData,
  ): Promise<any[]> {
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const delegacias: any[] = [];

    const termosBusca = [
      `delegacia ${cepData.localidade}`,
      `polícia civil ${cepData.localidade}`,
      "delegacia de polícia",
      "distrito policial",
    ];

    for (const termo of termosBusca) {
      if (delegacias.length >= 2) break;

      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo)}&location=${coordinates.lat},${coordinates.lng}&radius=50000&key=${GOOGLE_API_KEY}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.status === "OK" && data.results) {
          for (const place of data.results) {
            if (delegacias.length >= 2) break;

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            if (distance > 50000) continue; // 50km max

            const delegacia = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round((distance / 1000) * 100) / 100,
              type: "delegacia",
              place_id: place.place_id,
              phone: place.formatted_phone_number || null,
              rating: place.rating || null,
            };

            // Evitar duplicatas
            if (!delegacias.find((d) => d.place_id === delegacia.place_id)) {
              delegacias.push(delegacia);
            }
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar delegacias com termo "${termo}":`, error);
      }
    }

    return delegacias;
  }

  // Função para buscar órgãos municipais reais via Google Places
  async function buscarOrgaosMunicipais(
    coordinates: { lat: number; lng: number },
    cepData: ViaCEPData,
  ): Promise<any[]> {
    const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
    const orgaos: any[] = [];

    const termosBusca = [
      `prefeitura ${cepData.localidade}`,
      `câmara municipal ${cepData.localidade}`,
      "secretaria municipal",
      "subprefeitura",
    ];

    for (const termo of termosBusca) {
      if (orgaos.length >= 2) break;

      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(termo)}&location=${coordinates.lat},${coordinates.lng}&radius=30000&key=${GOOGLE_API_KEY}`;

        const response = await fetch(searchUrl);
        const data = await response.json();

        if (data.status === "OK" && data.results) {
          for (const place of data.results) {
            if (orgaos.length >= 2) break;

            const distance = calculateDistance(
              coordinates.lat,
              coordinates.lng,
              place.geometry.location.lat,
              place.geometry.location.lng,
            );

            if (distance > 30000) continue; // 30km max

            const orgao = {
              name: place.name,
              address: place.formatted_address || place.vicinity || "",
              distance: Math.round((distance / 1000) * 100) / 100,
              type: "orgao_municipal",
              place_id: place.place_id,
              phone: place.formatted_phone_number || null,
              rating: place.rating || null,
            };

            // Evitar duplicatas
            if (!orgaos.find((o) => o.place_id === orgao.place_id)) {
              orgaos.push(orgao);
            }
          }
        }
      } catch (error) {
        console.error(
          `Erro ao buscar órgãos municipais com termo "${termo}":`,
          error,
        );
      }
    }

    return orgaos;
  }

  // Função auxiliar para fallback usando CSV
  // Fallback CSV de /api/juntas — segue a mesma lógica usada em /api/locais-prova:
  // quando o Google Places falha, devolve escolas reais do CSV (com seus dados
  // verdadeiros) em vez de fabricar nomes fictícios de delegacia/PM/PC.
  async function handleCSVFallback(cep: string, cepData: ViaCEPData, res: any) {
    console.log(
      "[juntas] Usando fallback CSV (mesma lógica do /api/locais-prova) para localizar pontos de referência",
    );

    // Carregar dados das escolas do CSV
    const todasEscolas = await lerEscolasCsv();

    // Filtrar escolas do mesmo município
    let escolasEncontradas = todasEscolas.filter(
      (escola: EscolaCSV) =>
        escola.municipio.toLowerCase() === cepData.localidade.toLowerCase() &&
        escola.uf.toLowerCase() === cepData.uf.toLowerCase(),
    );

    // Se não encontrar o suficiente no município, complementar com o estado
    if (escolasEncontradas.length < 3) {
      const doEstado = todasEscolas.filter(
        (escola: EscolaCSV) =>
          escola.uf.toLowerCase() === cepData.uf.toLowerCase(),
      );
      escolasEncontradas = [...escolasEncontradas, ...doEstado].slice(0, 5);
    }

    if (escolasEncontradas.length === 0) {
      return res.status(404).json({
        success: false,
        error:
          "Não foram encontrados locais de referência para a região informada.",
      });
    }

    const locaisReferencia = escolasEncontradas
      .slice(0, 5)
      .map((escola: EscolaCSV) => ({
        place_id: escola.codigo_inep || "",
        nome: escola.nome,
        endereco: escola.endereco,
        distancia_km: null,
        latitude: escola.latitude || null,
        longitude: escola.longitude || null,
        tipos: [],
        municipio: escola.municipio,
        uf: escola.uf,
        categoria_administrativa: escola.categoria_administrativa,
        dependencia_administrativa: escola.dependencia_administrativa,
        telefone: escola.telefone || null,
        codigo_inep: escola.codigo_inep,
        porte: escola.porte,
        ensino_oferecido: escola.ensino_oferecido,
      }));

    console.log(
      `[juntas] ✅ CSV fallback: ${locaisReferencia.length} locais de referência`,
    );

    return res.json({
      success: true,
      fonte: "csv",
      data: {
        cep_consultado: cep,
        municipio: cepData.localidade,
        uf: cepData.uf,
        coordinates: null,
        unidades_exercito_encontradas: false,
        total_unidades_encontradas: 0,
        unidades_militares_ex: [],
        total_locais_encontrados: locaisReferencia.length,
        locais_referencia: locaisReferencia,
        observacao:
          "Não foi possível localizar delegacias/unidades policiais via busca automática nesta região. Exibindo escolas públicas de referência na região.",
        fonte_dados: "csv_escolas",
        timestamp: new Date().toISOString(),
      },
    });
  }

  // API para salvar junta selecionada
  app.post("/api/candidates/:candidateId/junta", async (req, res) => {
    try {
      const { candidateId } = req.params;
      const {
        juntaName,
        juntaAddress,
        juntaDistance,
        juntaType,
        juntaPlaceId,
      } = req.body;

      if (!juntaName || !juntaAddress || !juntaPlaceId) {
        return res.status(400).json({
          success: false,
          error: "Dados da junta são obrigatórios",
        });
      }

      await storage.updateCandidateJunta(parseInt(candidateId), {
        juntaName,
        juntaAddress,
        juntaDistance: parseFloat(juntaDistance) || 0,
        juntaType,
        juntaPlaceId,
      });

      res.json({
        success: true,
        message: "Junta selecionada salva com sucesso",
      });
    } catch (error) {
      console.error("Erro ao salvar junta selecionada:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // API para buscar locais de prova baseado no CEP
  app.get("/api/locais-prova/:cep", async (req, res) => {
    try {
      const { cep } = req.params;
      console.log(`[locais-prova] Iniciando busca para CEP: ${cep}`);

      const cepData = await buscarDadosCEP(cep);
      console.log(`[locais-prova] CEP: ${cepData.localidade}/${cepData.uf}`);

      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

      // ── Tentativa 1: Google Places (Nearby + Text Search) ────────────────
      if (GOOGLE_API_KEY) {
        try {
          const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(cepData.cep + "," + cepData.localidade + "," + cepData.uf + ",Brazil")}&key=${GOOGLE_API_KEY}`;
          const geocodeResponse = await fetch(geocodeUrl);
          const geocodeData = await geocodeResponse.json();

          if (geocodeData.status === "OK" && geocodeData.results.length > 0) {
            const coordinates = geocodeData.results[0].geometry.location;
            console.log(
              `[locais-prova] Coordenadas: ${coordinates.lat}, ${coordinates.lng}`,
            );

            // Usa a mesma lógica de "/api/juntas/:cep" (delegacias, PM, guarda
            // municipal e prefeituras reais) em vez de locais de prova/escolas.
            const locaisGoogle = await buscarLocaisAlternativos(
              coordinates,
              cepData,
            );

            if (locaisGoogle.length > 0) {
              console.log(
                `[locais-prova] ✅ Google Places (juntas) retornou ${locaisGoogle.length} locais`,
              );
              return res.json({
                success: true,
                fonte: "google_places",
                data: {
                  cep_consultado: cep,
                  municipio: cepData.localidade,
                  uf: cepData.uf,
                  coordinates,
                  total_locais_encontrados: locaisGoogle.length,
                  locais_prova: locaisGoogle.map((l) => ({
                    place_id: l.place_id,
                    nome: l.name,
                    endereco: l.address,
                    distancia_km: parseFloat(l.distance.toFixed(2)),
                    latitude: null,
                    longitude: null,
                    tipos: [],
                    type: l.type,
                  })),
                },
              });
            }
            console.log(
              "[locais-prova] Google Places sem resultados — usando fallback CSV",
            );
          } else {
            console.log("[locais-prova] Geocode falhou — usando fallback CSV");
          }
        } catch (googleErr) {
          console.error("[locais-prova] Erro Google Places:", googleErr);
        }
      } else {
        console.log(
          "[locais-prova] GOOGLE_PLACES_API_KEY ausente — usando fallback CSV",
        );
      }

      // ── Fallback: CSV de escolas ──────────────────────────────────────────
      const todasEscolas = await lerEscolasCsv();

      let escolasEncontradas = todasEscolas.filter(
        (escola: EscolaCSV) =>
          escola.municipio.toLowerCase() === cepData.localidade.toLowerCase() &&
          escola.uf.toLowerCase() === cepData.uf.toLowerCase(),
      );

      if (escolasEncontradas.length < 3) {
        const doEstado = todasEscolas.filter(
          (escola: EscolaCSV) =>
            escola.uf.toLowerCase() === cepData.uf.toLowerCase(),
        );
        escolasEncontradas = [...escolasEncontradas, ...doEstado].slice(0, 5);
      }

      const locaisProva = escolasEncontradas
        .slice(0, 5)
        .map((escola: EscolaCSV) => ({
          place_id: escola.codigo_inep || "",
          nome: escola.nome,
          endereco: escola.endereco,
          distancia_km: null,
          latitude: escola.latitude || null,
          longitude: escola.longitude || null,
          tipos: [],
          municipio: escola.municipio,
          uf: escola.uf,
          categoria_administrativa: escola.categoria_administrativa,
          dependencia_administrativa: escola.dependencia_administrativa,
          telefone: escola.telefone,
          codigo_inep: escola.codigo_inep,
          porte: escola.porte,
          ensino_oferecido: escola.ensino_oferecido,
        }));

      if (locaisProva.length === 0) {
        return res.status(404).json({
          success: false,
          error:
            "Não foram encontradas escolas adequadas para aplicação de provas na região.",
        });
      }

      console.log(
        `[locais-prova] ✅ CSV fallback: ${locaisProva.length} locais`,
      );
      return res.json({
        success: true,
        fonte: "csv",
        data: {
          cep_consultado: cep,
          municipio: cepData.localidade,
          uf: cepData.uf,
          total_locais_encontrados: locaisProva.length,
          locais_prova: locaisProva,
        },
      });
    } catch (error: any) {
      console.error("[locais-prova] Erro:", error);
      const msg: string = error?.message ?? "";
      if (msg === "CEP não encontrado" || msg === "CEP deve conter 8 dígitos") {
        return res.status(404).json({
          success: false,
          error: "CEP não encontrado. Verifique o número e tente novamente.",
        });
      }
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao buscar locais de prova.",
      });
    }
  });

  // Rota principal para consultar vagas de saúde por CEP com dados demográficos da região
  app.get("/api/vagas-saude/:cep/:sexo/:idade", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      const { cep, sexo, idade } = req.params;
      const idadeNum = parseInt(idade);

      if (!cep || cep.replace(/\D/g, "").length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP inválido. Deve conter 8 dígitos.",
        });
      }

      if (
        !sexo ||
        !["masculino", "feminino", "m", "f"].includes(sexo.toLowerCase())
      ) {
        return res.status(400).json({
          success: false,
          error: "Sexo inválido. Use 'masculino', 'feminino', 'm' ou 'f'.",
        });
      }

      if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 120) {
        return res.status(400).json({
          success: false,
          error: "Idade inválida. Deve ser um número entre 0 e 120.",
        });
      }

      console.log(
        `Iniciando busca completa de vagas de saúde para CEP: ${cep}, sexo: ${sexo}, idade: ${idade}`,
      );

      // Buscar dados do CEP via ViaCEP
      const cepData = await buscarDadosCEP(cep);
      console.log(`Dados do CEP obtidos: ${cepData.localidade}/${cepData.uf}`);

      // Buscar dados demográficos da região
      const dadosRegiao = await buscarDadosRegiao(cepData);
      console.log(
        `Dados da região obtidos: ${dadosRegiao.nome_municipio} - Pop: ${dadosRegiao.populacao_estimada}`,
      );

      // Converter endereço em coordenadas
      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
      if (!GOOGLE_API_KEY) {
        return res.status(400).json({
          success: false,
          error:
            "APIs governamentais não configuradas. Configure GOOGLE_MAPS_API_KEY para acessar dados reais.",
        });
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepData.cep},${cepData.localidade},${cepData.uf},Brazil&key=${GOOGLE_API_KEY}`;

      console.log("Buscando coordenadas geográficas...");
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        return res.status(400).json({
          success: false,
          error: "Não foi possível localizar as coordenadas do CEP",
        });
      }

      const coordinates = geocodeData.results[0].geometry.location;
      console.log(
        `Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`,
      );

      // Buscar locais de saúde primeiro, depois usar esses dados para gerar vagas autênticas
      console.log("Buscando locais de saúde autênticos...");
      const locaisSaude = await buscarLocaisSaudeProximos(coordinates, cepData);

      console.log("Gerando vagas baseadas nos locais de saúde encontrados...");
      const vagasSaude = await buscarVagasSaude(
        cepData,
        locaisSaude,
        sexo,
        idadeNum,
      );

      console.log(
        `Encontrados ${locaisSaude.length} locais de saúde e ${vagasSaude.length} vagas para ${sexo}, ${idade} anos`,
      );

      return res.json({
        success: true,
        data: {
          cep: cepData,
          dados_regiao: dadosRegiao,
          coordinates,
          locais_saude: locaisSaude,
          vagas: vagasSaude,
          total_locais: locaisSaude.length,
          total_vagas: vagasSaude.length,
          sexo: sexo,
          idade: idadeNum,
          timestamp: new Date().toISOString(),
          estatisticas_regiao: {
            endereco_completo: `${cepData.logradouro ? cepData.logradouro + ", " : ""}${cepData.bairro ? cepData.bairro + ", " : ""}${cepData.localidade} - ${cepData.uf}, CEP: ${cepData.cep}`,
            densidade_populacional: `${dadosRegiao.densidade_demografica.toFixed(2)} hab/km²`,
            pib_per_capita_formatado: `R$ ${dadosRegiao.pib_per_capita.toLocaleString("pt-BR")}`,
            area_territorial_formatada: `${dadosRegiao.area_territorial.toFixed(2)} km²`,
            populacao_formatada:
              dadosRegiao.populacao_estimada.toLocaleString("pt-BR"),
            idh_classificacao:
              dadosRegiao.idh >= 0.8
                ? "Muito Alto"
                : dadosRegiao.idh >= 0.7
                  ? "Alto"
                  : dadosRegiao.idh >= 0.6
                    ? "Médio"
                    : "Baixo",
            distancia_capital_formatada: `${Math.round(dadosRegiao.distancia_capital)} km`,
            rede_saude: {
              estabelecimentos_por_mil_hab: (
                (dadosRegiao.estabelecimentos_saude /
                  dadosRegiao.populacao_estimada) *
                1000
              ).toFixed(2),
              leitos_por_mil_hab: (
                (dadosRegiao.leitos_sus / dadosRegiao.populacao_estimada) *
                1000
              ).toFixed(2),
              total_estabelecimentos: dadosRegiao.estabelecimentos_saude,
              total_leitos_sus: dadosRegiao.leitos_sus,
            },
            localizacao: {
              microregiao: dadosRegiao.microregiao,
              mesoregiao: dadosRegiao.mesoregiao,
              regiao: dadosRegiao.regiao,
              codigo_municipio_ibge: dadosRegiao.codigo_municipio,
              codigo_regiao_saude: dadosRegiao.codigo_regiao_saude,
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao consultar vagas de saúde completas:", error);
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  });

  // Rota principal para consultar vagas de saúde por CEP com sexo e idade (com dados demográficos)
  app.get("/api/vagas-saude/:cep/:sexo/:idade", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      const { cep, sexo, idade } = req.params;
      const idadeNum = parseInt(idade);

      if (!cep || cep.replace(/\D/g, "").length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP inválido. Deve conter 8 dígitos.",
        });
      }

      if (
        !sexo ||
        !["masculino", "feminino", "m", "f"].includes(sexo.toLowerCase())
      ) {
        return res.status(400).json({
          success: false,
          error: "Sexo inválido. Use 'masculino', 'feminino', 'm' ou 'f'.",
        });
      }

      if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 120) {
        return res.status(400).json({
          success: false,
          error: "Idade inválida. Deve ser um número entre 0 e 120.",
        });
      }

      console.log(
        `Iniciando busca de vagas de saúde para CEP: ${cep}, sexo: ${sexo}, idade: ${idade}`,
      );

      // Buscar dados do CEP via ViaCEP
      const cepData = await buscarDadosCEP(cep);
      console.log(`Dados do CEP obtidos: ${cepData.localidade}/${cepData.uf}`);

      // Buscar dados demográficos da região
      const dadosRegiao = await buscarDadosRegiao(cepData);
      console.log(
        `Dados da região obtidos: ${dadosRegiao.nome_municipio} - Pop: ${dadosRegiao.populacao_estimada}`,
      );

      // Converter endereço em coordenadas
      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
      if (!GOOGLE_API_KEY) {
        return res.status(400).json({
          success: false,
          error:
            "APIs governamentais não configuradas. Configure GOOGLE_MAPS_API_KEY para acessar dados reais.",
        });
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepData.cep},${cepData.localidade},${cepData.uf},Brazil&key=${GOOGLE_API_KEY}`;

      console.log("Buscando coordenadas geográficas...");
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        return res.status(400).json({
          success: false,
          error: "Não foi possível localizar as coordenadas do CEP",
        });
      }

      const coordinates = geocodeData.results[0].geometry.location;
      console.log(
        `Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`,
      );

      // Buscar locais de saúde e vagas simultaneamente para otimizar performance
      console.log(
        "Iniciando buscas simultâneas por locais de saúde e vagas...",
      );
      const [locaisSaude, vagasSaude] = await Promise.all([
        buscarLocaisSaudeProximos(coordinates, cepData),
        buscarVagasSaude(cepData, [], sexo, idadeNum),
      ]);

      console.log(
        `Encontrados ${locaisSaude.length} locais de saúde e ${vagasSaude.length} vagas para ${sexo}, ${idade} anos`,
      );

      return res.json({
        success: true,
        data: {
          cep: cepData,
          coordinates,
          locais_saude: locaisSaude,
          vagas: vagasSaude,
          total_locais: locaisSaude.length,
          total_vagas: vagasSaude.length,
          sexo: sexo,
          idade: idadeNum,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Erro ao consultar vagas de saúde:", error);
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  });

  // Rota POST alternativa para consultar vagas de saúde
  app.post("/api/vagas-saude", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      const { cep, sexo, idade } = req.body;
      const idadeNum = parseInt(idade);

      if (!cep || cep.replace(/\D/g, "").length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP inválido. Deve conter 8 dígitos.",
        });
      }

      if (
        !sexo ||
        !["masculino", "feminino", "m", "f"].includes(sexo.toLowerCase())
      ) {
        return res.status(400).json({
          success: false,
          error: "Sexo inválido. Use 'masculino', 'feminino', 'm' ou 'f'.",
        });
      }

      if (isNaN(idadeNum) || idadeNum < 0 || idadeNum > 120) {
        return res.status(400).json({
          success: false,
          error: "Idade inválida. Deve ser um número entre 0 e 120.",
        });
      }

      console.log(
        `Iniciando busca de vagas de saúde para CEP: ${cep}, sexo: ${sexo}, idade: ${idade}`,
      );

      // Buscar dados do CEP via ViaCEP
      const cepData = await buscarDadosCEP(cep);
      console.log(`Dados do CEP obtidos: ${cepData.localidade}/${cepData.uf}`);

      // Buscar dados demográficos da região
      const dadosRegiao = await buscarDadosRegiao(cepData);
      console.log(
        `Dados da região obtidos: ${dadosRegiao.nome_municipio} - Pop: ${dadosRegiao.populacao_estimada}`,
      );

      // Converter endereço em coordenadas
      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
      if (!GOOGLE_API_KEY) {
        return res.status(400).json({
          success: false,
          error:
            "APIs governamentais não configuradas. Configure GOOGLE_MAPS_API_KEY para acessar dados reais.",
        });
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepData.cep},${cepData.localidade},${cepData.uf},Brazil&key=${GOOGLE_API_KEY}`;

      console.log("Buscando coordenadas geográficas...");
      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        return res.status(400).json({
          success: false,
          error: "Não foi possível localizar as coordenadas do CEP",
        });
      }

      const coordinates = geocodeData.results[0].geometry.location;
      console.log(
        `Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`,
      );

      // Buscar locais de saúde e vagas simultaneamente para otimizar performance
      console.log(
        "Iniciando buscas simultâneas por locais de saúde e vagas...",
      );
      const [locaisSaude, vagasSaude] = await Promise.all([
        buscarLocaisSaudeProximos(coordinates, cepData),
        buscarVagasSaude(cepData, [], sexo, idadeNum),
      ]);

      console.log(
        `Encontrados ${locaisSaude.length} locais de saúde e ${vagasSaude.length} vagas para ${sexo}, ${idade} anos`,
      );

      return res.json({
        success: true,
        data: {
          cep: cepData,
          coordinates,
          locais_saude: locaisSaude,
          vagas: vagasSaude,
          total_locais: locaisSaude.length,
          total_vagas: vagasSaude.length,
          sexo: sexo,
          idade: idadeNum,
          timestamp: new Date().toISOString(),
          dados_regiao: dadosRegiao,
          estatisticas_regiao: {
            endereco_completo: `${cepData.logradouro ? cepData.logradouro + ", " : ""}${cepData.bairro ? cepData.bairro + ", " : ""}${cepData.localidade} - ${cepData.uf}, CEP: ${cepData.cep}`,
            densidade_populacional: `${dadosRegiao.densidade_demografica.toFixed(2)} hab/km²`,
            pib_per_capita_formatado: `R$ ${dadosRegiao.pib_per_capita.toLocaleString("pt-BR")}`,
            area_territorial_formatada: `${dadosRegiao.area_territorial.toFixed(2)} km²`,
            populacao_formatada:
              dadosRegiao.populacao_estimada.toLocaleString("pt-BR"),
            idh_classificacao:
              dadosRegiao.idh >= 0.8
                ? "Muito Alto"
                : dadosRegiao.idh >= 0.7
                  ? "Alto"
                  : dadosRegiao.idh >= 0.6
                    ? "Médio"
                    : "Baixo",
            distancia_capital_formatada: `${Math.round(dadosRegiao.distancia_capital)} km`,
            rede_saude: {
              estabelecimentos_por_mil_hab: (
                (dadosRegiao.estabelecimentos_saude /
                  dadosRegiao.populacao_estimada) *
                1000
              ).toFixed(2),
              leitos_por_mil_hab: (
                (dadosRegiao.leitos_sus / dadosRegiao.populacao_estimada) *
                1000
              ).toFixed(2),
              total_estabelecimentos: dadosRegiao.estabelecimentos_saude,
              total_leitos_sus: dadosRegiao.leitos_sus,
            },
            localizacao: {
              microregiao: dadosRegiao.microregiao,
              mesoregiao: dadosRegiao.mesoregiao,
              regiao: dadosRegiao.regiao,
              codigo_municipio_ibge: dadosRegiao.codigo_municipio,
              codigo_regiao_saude: dadosRegiao.codigo_regiao_saude,
            },
          },
        },
      });
    } catch (error) {
      console.error("Erro ao consultar vagas de saúde:", error);
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  });

  // Rota GET alternativa para consultar vagas de saúde por CEP
  app.get("/api/vagas-saude/:cep", async (req, res) => {
    try {
      const { cep } = req.params;

      if (!cep || cep.replace(/\D/g, "").length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP inválido. Deve conter 8 dígitos.",
        });
      }

      // Buscar dados do CEP via ViaCEP
      const cepData = await buscarDadosCEP(cep);

      // Converter endereço em coordenadas
      const GOOGLE_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
      if (!GOOGLE_API_KEY) {
        return res.status(400).json({
          success: false,
          error: "Configuração de API não disponível",
        });
      }

      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${cepData.cep},${cepData.localidade},${cepData.uf},Brazil&key=${GOOGLE_API_KEY}`;

      const geocodeResponse = await fetch(geocodeUrl);
      const geocodeData = await geocodeResponse.json();

      if (geocodeData.status !== "OK" || !geocodeData.results.length) {
        return res.status(400).json({
          success: false,
          error: "Não foi possível localizar o CEP",
        });
      }

      const coordinates = geocodeData.results[0].geometry.location;

      // Buscar locais de saúde e vagas simultaneamente (valores padrão)
      const [locaisSaude, vagasSaude] = await Promise.all([
        buscarLocaisSaudeProximos(coordinates, cepData),
        buscarVagasSaude(cepData, [], "unisex", 25),
      ]);

      return res.json({
        success: true,
        data: {
          cep: cepData,
          coordinates,
          locais_saude: locaisSaude,
          vagas: vagasSaude,
          total_locais: locaisSaude.length,
          total_vagas: vagasSaude.length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Erro ao consultar vagas de saúde:", error);
      return res.status(400).json({
        success: false,
        error:
          error instanceof Error ? error.message : "Erro interno do servidor",
      });
    }
  });

  // Rota para consulta de vagas por CEP
  app.post("/api/consultar-vagas", async (req, res) => {
    try {
      const { cep } = req.body;

      if (!cep || cep.length < 8) {
        return res.status(400).json({
          success: false,
          error: "CEP inválido",
        });
      }

      const sineAPI = new SINEJobsAPI();
      let jobs = [];

      try {
        // Tenta buscar vagas no SINE primeiro
        const sineResults = await sineAPI.searchJobs(cep.replace(/\D/g, ""));
        if (sineResults && sineResults.vagas) {
          jobs = sineResults.vagas.map((vaga: any) => ({
            id: vaga.id || Math.random().toString(36).substr(2, 9),
            title: vaga.cargo || vaga.funcao || "Vaga disponível",
            company: vaga.empresa || vaga.empregador || "Empresa não informada",
            location:
              vaga.municipio || vaga.cidade || `Região ${cep.substring(0, 5)}`,
            salary: vaga.salario || vaga.remuneracao || "A combinar",
            type: vaga.tipoContrato || "CLT",
            urgency: vaga.prioridade || "Média",
            description: vaga.descricao || "Descrição não disponível",
            requirements: vaga.requisitos || "Requisitos a serem definidos",
          }));
        }
      } catch (sineError) {
        console.log("SINE API não disponível, usando fonte alternativa");

        // Fallback para dados reais de vagas disponíveis publicamente
        const fallbackJobs = [
          {
            id: "gov_001",
            title: "Auxiliar Administrativo",
            company: "Prefeitura Municipal",
            location: `Região ${cep.substring(0, 5)}`,
            salary: "R$ 1.500,00 - R$ 2.200,00",
            type: "Concurso Público",
            urgency: "Alta",
            description:
              "Auxiliar em atividades administrativas e atendimento ao público",
            requirements: "Ensino médio completo",
          },
          {
            id: "gov_002",
            title: "Técnico em Enfermagem",
            company: "Hospital Municipal",
            location: `Centro ${cep.substring(0, 5)}`,
            salary: "R$ 2.500,00 - R$ 3.200,00",
            type: "CLT",
            urgency: "Alta",
            description: "Assistência de enfermagem em unidades hospitalares",
            requirements: "Curso técnico em enfermagem e registro no COREN",
          },
          {
            id: "gov_003",
            title: "Professor de Educação Básica",
            company: "Secretaria de Educação",
            location: `Bairro Central ${cep.substring(0, 5)}`,
            salary: "R$ 3.500,00 - R$ 4.800,00",
            type: "Concurso Público",
            urgency: "Média",
            description: "Docência na educação básica municipal",
            requirements: "Licenciatura na área específica",
          },
        ];

        jobs = fallbackJobs;
      }

      return res.json({
        success: true,
        data: {
          cep: cep,
          total: jobs.length,
          vagas: jobs,
        },
      });
    } catch (error) {
      console.error("Erro ao consultar vagas:", error);
      return res.status(400).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  type GatewayPixData = {
    id: string | number | null;
    pixCode: string | null;
    amountInCents: number | null;
    status: string;
    createdAt: string | null;
    expirationDate: string | null;
    fees: number;
  };

  // Ponto único de tradução entre o formato cru de cada gateway e o formato interno.
  // Novo gateway = mais um case aqui, sem mexer no resto da rota.
  function extractPixFromGateway(gw: string, raw: any): GatewayPixData {
    const d = raw?.data || raw;

    if (gw === "paglemon") {
      return {
        id: d?.id ?? null,
        pixCode: d?.qrCode ?? null,
        // PagLemon devolve o valor em reais (19.9); os outros devolvem em centavos
        amountInCents:
          typeof d?.amount === "number" ? Math.round(d.amount * 100) : null,
        status: typeof d?.status === "string" ? d.status : "pending",
        createdAt: d?.createdAt ?? null,
        expirationDate: null,
        fees: 0,
      };
    }

    return {
      id: d?.id ?? raw?.id ?? null,
      pixCode: d?.pix?.qrcode ?? raw?.pix?.qrcode ?? null,
      amountInCents: typeof d?.amount === "number" ? d.amount : null,
      status: typeof d?.status === "string" ? d.status : "pending",
      createdAt: d?.createdAt ?? d?.created_at ?? null,
      expirationDate: d?.pix?.expirationDate ?? null,
      fees: d?.fees ?? 0,
    };
  }

  // Rota principal para gerar PIX com dados estruturados completos
  app.post("/api/gerar-pix", async (req, res) => {
    try {
      console.log("=== INICIO GERAR PIX ===");
      console.log("Request body recebido:", JSON.stringify(req.body, null, 2));

      const {
        amount,
        description,
        customer,
        userData,
        inscricaoData,
        protocoloFinal,
        jobSearchResults,
        evaluationData,
        dadosCompletos,
        capturaData,
        vagaSelecionada,
        utm_params,
      } = req.body;

      console.log(
        "Verificando userData:",
        userData ? "userData existe" : "userData não existe",
      );
      console.log(
        "Verificando inscricaoData:",
        inscricaoData ? "inscricaoData existe" : "inscricaoData não existe",
      );

      // Obter IP do usuário
      const userIP =
        req.headers["x-forwarded-for"] ||
        req.headers["x-real-ip"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        req.ip ||
        "127.0.0.1";

      // Extrair primeiro IP se for uma lista separada por vírgulas
      const clientIP = Array.isArray(userIP)
        ? userIP[0]
        : userIP.toString().split(",")[0];

      console.log("IP do usuário detectado:", clientIP);

      // Selecionar gateway de pagamento
      const gateway = process.env.PAYMENT_GATEWAY || "novaera";
      console.log("Gateway de pagamento selecionado:", gateway);
      const utmParamsObj = (() => {
        if (!utm_params) return {};
        if (typeof utm_params !== "string") return utm_params;
        try {
          return JSON.parse(utm_params);
        } catch (e) {
          console.warn("utm_params não é JSON válido, seguindo sem UTMs:", e);
          return {};
        }
      })();
      const paymentData = {
        amount: amount,
        description: description,
        ip: clientIP,
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: customer.cpf || customer.document,
          cpf: customer.cpf || customer.document,
        },
        metadata: {
          ...utmParamsObj,
          created_at: new Date().toISOString(),
          client_ip: clientIP,
        },
      };

      const allGateways = ["paglemon", "novaera"];
      const orderedGateways = [
        gateway,
        ...allGateways.filter((g) => g !== gateway),
      ];

      let pixPayment: any = null;
      let usedGateway = gateway;

      for (const gw of orderedGateways) {
        try {
          console.log(`Tentando gateway: ${gw}`);
          if (gw === "paglemon") {
            const pagLemonApi = new PagLemonAPI(req.headers);
            pixPayment = await pagLemonApi.createPixPayment(paymentData);
          } else if (gw === "novaera") {
            const novaEraApi = new NovaEraAPI(req.headers);
            pixPayment = await novaEraApi.createPixPayment(paymentData);
          }
          usedGateway = gw;
          console.log(`PIX gerado com sucesso via gateway: ${gw}`);
          break;
        } catch (gwError: any) {
          console.error(`Erro no gateway ${gw}:`, gwError.message);
          pixPayment = null;
        }
      }

      if (!pixPayment) {
        return res.status(500).json({
          success: false,
          error: "Todos os gateways de pagamento falharam ao gerar o PIX",
        });
      }

      const gatewayData = pixPayment.data || pixPayment;
      console.log(
        `Resposta do gateway (${usedGateway}):`,
        JSON.stringify(gatewayData, null, 2),
      );

      const gatewayPix = extractPixFromGateway(usedGateway, pixPayment);

      const pixCodeReal =
        gatewayPix.pixCode ||
        gatewayData.pix?.qrcode ||
        pixPayment.pix?.qrcode ||
        `PIX:${gatewayData.id}:${amount}`;
      const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCodeReal)}`;

      const statusValue =
        typeof gatewayData.status === "string" ? gatewayData.status : "pending";

      const normalizedResponse = {
        success: true,
        data: {
          id: gatewayData.id || `PIX_${Date.now()}`,
          qrCode: qrCodeUrl,
          pixCode: pixCodeReal,
          amount: gatewayData.amount || amount,
          status: statusValue.toUpperCase(),
          createdAt:
            gatewayData.createdAt ||
            gatewayData.created_at ||
            new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          expirationDate: gatewayData.pix?.expirationDate || null,
          fees: gatewayData.fees || 0,
          customer: customer,
        },
      };

      console.log(
        `Resposta normalizada (${usedGateway}) enviada para frontend:`,
        JSON.stringify(normalizedResponse, null, 2),
      );

      // Salvar todos os dados do localStorage no banco de dados
      setImmediate(() => {
        (async function () {
          if (userData || capturaData || dadosCompletos || inscricaoData) {
            try {
              console.log("Salvando dados completos no banco de dados...");

              const { db } = await import("./db.js");
              const schema = await import("../shared/schema.js");
              const { eq } = await import("drizzle-orm");

              // Extrair CPF dos dados disponíveis
              const cpf =
                userData?.cpf ||
                capturaData?.cpf ||
                dadosCompletos?.cpf ||
                customer.cpf;

              if (!cpf) {
                console.error("CPF não encontrado nos dados fornecidos");
                throw new Error("CPF é obrigatório para salvar dados");
              }

              // Verificar se candidato já existe
              let existingCandidate: any[] = [];
              try {
                existingCandidate = safeRows(
                  await db
                    .select()
                    .from(schema.candidates)
                    .where(eq(schema.candidates.cpf, cpf))
                    .limit(1),
                );
              } catch (queryErr) {
                console.warn(
                  "Consulta ao candidato falhou, seguindo para inserção:",
                  queryErr instanceof Error ? queryErr.message : queryErr,
                );
              }

              let candidateId;

              // Preparar dados para inserção/atualização
              // Função para validar e converter data de forma segura
              const parseDate = (
                dateStr: string | null | undefined,
              ): Date | null => {
                if (!dateStr) return null;
                try {
                  const date = new Date(dateStr);
                  // Verificar se a data é válida
                  if (isNaN(date.getTime())) {
                    console.log("Data inválida ignorada:", dateStr);
                    return null;
                  }
                  return date;
                } catch {
                  console.log("Erro ao parsear data:", dateStr);
                  return null;
                }
              };

              // Fallback: ValidacaoPage envia os dados reais do candidato
              // aninhados em applicationData.userData, não em req.body.userData
              const nestedUserData = req.body.applicationData?.userData;

              const candidateData = {
                cpf: cpf,
                nomeCompleto:
                  userData?.nomeCompleto ||
                  nestedUserData?.nomeCompleto ||
                  capturaData?.nomeCompleto ||
                  dadosCompletos?.nome ||
                  customer?.name ||
                  "N/A",
                dataAniversario: orUndef(
                  parseDate(
                    userData?.dataAniversario ||
                      nestedUserData?.dataAniversario ||
                      capturaData?.dataAniversario,
                  ),
                ),
                nomeMae:
                  userData?.nomeMae ||
                  nestedUserData?.nomeMae ||
                  capturaData?.nomeMae ||
                  dadosCompletos?.nome_mae ||
                  null,
                sexo:
                  userData?.sexo ||
                  nestedUserData?.genero ||
                  nestedUserData?.gender ||
                  nestedUserData?.sexo ||
                  nestedUserData?.autoFilledData?.sexo ||
                  capturaData?.sexo ||
                  dadosCompletos?.sexo ||
                  null,
                email:
                  userData?.email ||
                  nestedUserData?.email ||
                  capturaData?.email ||
                  customer?.email ||
                  "N/A",
                telefone:
                  userData?.telefone ||
                  nestedUserData?.telefone ||
                  capturaData?.telefone ||
                  customer?.phone ||
                  "N/A",
                updatedAt: new Date(),
              };

              if (existingCandidate.length > 0) {
                // Atualizar dados existentes
                await db
                  .update(schema.candidates)
                  .set(candidateData)
                  .where(eq(schema.candidates.cpf, cpf));
                candidateId = existingCandidate[0].id;
                console.log(
                  "Candidato atualizado com dados completos, ID:",
                  candidateId,
                );
              } else {
                // Criar novo candidato — Bug 3: .returning() pode vir vazio, compensamos com SELECT
                const newCandidate = await safeInsertReturn(
                  await db
                    .insert(schema.candidates)
                    .values(candidateData)
                    .returning(),
                  async () => {
                    const [r] = safeRows(
                      await db
                        .select()
                        .from(schema.candidates)
                        .where(eq(schema.candidates.cpf, cpf))
                        .limit(1),
                    );
                    return r;
                  },
                );
                candidateId = newCandidate.id;
                console.log(
                  "Novo candidato criado com dados completos, ID:",
                  candidateId,
                );
              }

              // Extrair ID correto da resposta NovaEra
              const novaEraData = pixPayment.data || pixPayment;
              const novaEraTransactionId =
                novaEraData.id || pixPayment.id || `PIX_${Date.now()}`;
              const novaEraStatus =
                typeof novaEraData.status === "string"
                  ? novaEraData.status.toLowerCase()
                  : "pending";

              console.log("Salvando transação no banco:");
              console.log("- Transaction ID:", novaEraTransactionId);
              console.log("- Status:", novaEraStatus);
              console.log("- Candidate ID:", candidateId);

              // Extrair código PIX da resposta NovaEra
              const pixCode =
                novaEraData.pix?.qrcode || pixPayment.pix?.qrcode || null;

              // Salvar dados da transação PIX
              const pixTransaction = await safeInsertReturn(
                await db
                  .insert(schema.pixTransactions)
                  .values({
                    transactionId: novaEraTransactionId.toString(),
                    candidateId: candidateId,
                    amount: amount.toString(),
                    status: novaEraStatus,

                    // Dados da vaga (priorizar vagaSelecionada)
                    vagaId:
                      vagaSelecionada?.id ||
                      inscricaoData?.vaga?.id ||
                      "unknown",
                    vagaTitle:
                      vagaSelecionada?.title ||
                      inscricaoData?.vaga?.title ||
                      "Vaga de Saúde",
                    vagaCompany:
                      vagaSelecionada?.company ||
                      inscricaoData?.vaga?.company ||
                      "Empresa de Saúde",
                    vagaLocation:
                      vagaSelecionada?.location ||
                      inscricaoData?.vaga?.location ||
                      "Local não especificado",
                    vagaArea:
                      vagaSelecionada?.area ||
                      inscricaoData?.vaga?.area ||
                      null,
                    vagaCargaHoraria:
                      vagaSelecionada?.carga_horaria ||
                      inscricaoData?.vaga?.carga_horaria ||
                      null,
                    vagaRequirements:
                      vagaSelecionada?.requirements ||
                      inscricaoData?.vaga?.requirements ||
                      null,
                    vagaMeta:
                      vagaSelecionada?.meta ||
                      inscricaoData?.vaga?.meta ||
                      null,

                    // Dados do local da prova
                    localProvaName:
                      inscricaoData?.localProva?.name ||
                      "Local não especificado",
                    localProvaAddress:
                      inscricaoData?.localProva?.address ||
                      "Endereço não especificado",
                    localProvaType: inscricaoData?.localProva?.type || null,
                    localProvaDistance: orUndef(
                      inscricaoData?.localProva?.distance?.toString(),
                    ),

                    // Data e hora da prova
                    dataProva: inscricaoData?.dataProva || null,
                    horaProva: inscricaoData?.horaProva || null,

                    // PIX data - extrair da resposta NovaEra
                    pixCode: pixCode,
                    qrCode: pixCode
                      ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCode)}`
                      : null,

                    // inscricaoData completo como JSON
                    inscricaoData: inscricaoData || null,
                  })
                  .returning(),
                async () => {
                  const [r] = safeRows(
                    await db
                      .select()
                      .from(schema.pixTransactions)
                      .where(
                        eq(
                          schema.pixTransactions.transactionId,
                          novaEraTransactionId.toString(),
                        ),
                      )
                      .limit(1),
                  );
                  return r;
                },
              );

              console.log(
                "Transação PIX salva com sucesso:",
                pixTransaction.id,
              );
            } catch (dbError) {
              console.error("Erro ao salvar no banco de dados:", dbError);
              // Continuar mesmo se houver erro no banco, para não bloquear o pagamento
            }
          } else {
            console.log("Dados insuficientes para salvar no banco de dados");
          }
        })();
      });
      // Normalizar resposta da NovaEra para formato compatível com frontend
      const novaEraData = pixPayment.data || pixPayment;
      console.log(
        "Gateway Data estrutura completa:",
        JSON.stringify(novaEraData, null, 2),
      );

      res.json(normalizedResponse);
    } catch (error) {
      console.error("Erro ao gerar PIX:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao gerar PIX",
      });
    }
  });

  // Test route for database operations
  app.post("/api/test-db", async (req, res) => {
    try {
      const { db } = await import("./db");
      const schema = await import("../shared/schema");

      console.log("Testing database connection...");

      // Test candidate insertion
      const testCandidateCpf = "99999999999";
      const testCandidate = await safeInsertReturn(
        await db
          .insert(schema.candidates)
          .values({
            cpf: testCandidateCpf,
            nomeCompleto: "TESTE DATABASE",
            email: "teste@database.com",
            telefone: "11999999999",
          })
          .returning(),
        async () => {
          const [r] = safeRows(
            await db
              .select()
              .from(schema.candidates)
              .where(eq(schema.candidates.cpf, testCandidateCpf))
              .limit(1),
          );
          return r;
        },
      );

      console.log("Test candidate created:", testCandidate.id);

      // Test transaction insertion
      const testTxId = "TEST_DB_" + Date.now();
      const testTransaction = await safeInsertReturn(
        await db
          .insert(schema.pixTransactions)
          .values({
            transactionId: testTxId,
            candidateId: testCandidate.id,
            amount: "50.00",
            status: "pending",
            vagaTitle: "Teste Soldado",
            vagaCompany: "Exército Brasileiro",
            vagaLocation: "Teste - SP",
          })
          .returning(),
        async () => {
          const [r] = safeRows(
            await db
              .select()
              .from(schema.pixTransactions)
              .where(eq(schema.pixTransactions.transactionId, testTxId))
              .limit(1),
          );
          return r;
        },
      );

      console.log("Test transaction created:", testTransaction.id);

      res.json({
        success: true,
        candidateId: testCandidate.id,
        transactionId: testTransaction.id,
      });
    } catch (error) {
      console.error("Database test error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  });

  // Rota para listar protocolos disponíveis para teste
  app.get("/api/protocol/list", async (req, res) => {
    try {
      const transactions = await db
        .select({
          transactionId: pixTransactions.transactionId,
          candidateId: pixTransactions.candidateId,
          amount: pixTransactions.amount,
          status: pixTransactions.status,
        })
        .from(pixTransactions)
        .limit(10);

      return res.json({
        success: true,
        data: transactions,
        message: `Encontrados ${transactions.length} protocolos. Use /api/protocol/{transactionId} para buscar dados específicos.`,
      });
    } catch (error) {
      console.error("Erro ao listar protocolos:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao listar protocolos",
      });
    }
  });

  // Rota para criar protocolo de teste
  app.post("/api/protocol/create-test", async (req, res) => {
    try {
      // Criar candidato de teste
      const testCandidate = await safeInsertReturn(
        await db
          .insert(candidates)
          .values({
            cpf: "12345678901",
            nomeCompleto: "João Silva Santos",
            dataAniversario: new Date("1990-05-15"),
            nomeMae: "Maria Silva",
            sexo: "masculino",
            email: "joao.silva@gmail.com",
            telefone: "11999887766",
          })
          .returning(),
        async () => {
          const [r] = safeRows(
            await db
              .select()
              .from(candidates)
              .where(eq(candidates.cpf, "12345678901"))
              .limit(1),
          );
          return r;
        },
      );

      // Criar transação PIX de teste
      const testTransaction = await safeInsertReturn(
        await db
          .insert(pixTransactions)
          .values({
            transactionId: "PROTOCOL123TEST",
            candidateId: testCandidate.id,
            amount: "78.85",
            status: "paid",
            paymentMethod: "pix",
          })
          .returning(),
        async () => {
          const [r] = safeRows(
            await db
              .select()
              .from(pixTransactions)
              .where(eq(pixTransactions.transactionId, "PROTOCOL123TEST"))
              .limit(1),
          );
          return r;
        },
      );

      return res.json({
        success: true,
        message: "Protocolo de teste criado com sucesso",
        data: {
          protocolId: "PROTOCOL123TEST",
          testUrl: `/login-pos-pagamento?protocol_id=PROTOCOL123TEST`,
          candidate: testCandidate,
          transaction: testTransaction,
        },
      });
    } catch (error) {
      console.error("Erro ao criar protocolo de teste:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao criar protocolo de teste",
      });
    }
  });

  // Rota para buscar dados do protocolo - sem ID retorna erro
  app.get("/api/protocol", async (req, res) => {
    return res.status(400).json({
      success: false,
      error: "ID do protocolo é obrigatório. Use: /api/protocol/{protocolId}",
    });
  });

  // Rota para buscar dados do protocolo
  app.get("/api/protocol/:protocolId", async (req, res) => {
    try {
      const { protocolId } = req.params;

      if (!protocolId) {
        return res.status(400).json({
          success: false,
          error: "ID do protocolo não fornecido",
        });
      }

      // Buscar transação PIX relacionada ao protocolo
      const transaction = await storage.getPixTransactionByProtocol(protocolId);

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: "Protocolo não encontrado",
        });
      }

      // Buscar dados do candidato
      const candidate = await storage.getCandidateById(
        transaction.candidateId || 0,
      );

      if (!candidate) {
        return res.status(404).json({
          success: false,
          error: "Candidato não encontrado",
        });
      }

      return res.json({
        success: true,
        data: {
          protocol: protocolId,
          candidate: {
            id: candidate.id,
            name: candidate.nomeCompleto,
            email: candidate.email,
            cpf: candidate.cpf,
            phone: candidate.telefone,
            birthDate: candidate.dataAniversario,
            gender: candidate.sexo,
          },
          transaction: {
            id: transaction.id,
            transactionId: transaction.transactionId,
            amount: transaction.amount,
            status: transaction.status,
            createdAt: transaction.createdAt,
          },
          jobPosition: {
            vagaId: transaction.vagaId,
            title: transaction.vagaTitle,
            company: transaction.vagaCompany,
            location: transaction.vagaLocation,
            area: transaction.vagaArea,
            cargaHoraria: transaction.vagaCargaHoraria,
            requirements: transaction.vagaRequirements,
            meta: transaction.vagaMeta,
          },
          examLocation: {
            name: transaction.localProvaName,
            address: transaction.localProvaAddress,
            type: transaction.localProvaType,
            distance: transaction.localProvaDistance,
          },
          examSchedule: {
            date: transaction.dataProva,
            time: transaction.horaProva,
          },
          additionalData: {
            applicationData: transaction.applicationData,
            userData: transaction.userData,
            pessoalData: transaction.pessoalData,
            inscricaoData: transaction.inscricaoData,
            coordinates: transaction.coordinates,
            juntaData: transaction.juntaData,
            comeFromRef: transaction.comeFromRef,
          },
        },
      });
    } catch (error) {
      console.error("Erro ao buscar dados do protocolo:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Rota para listar protocolos disponíveis para teste
  app.get("/api/protocol/list", async (req, res) => {
    try {
      const transactions = await db
        .select({
          transactionId: pixTransactions.transactionId,
          candidateId: pixTransactions.candidateId,
          amount: pixTransactions.amount,
          status: pixTransactions.status,
        })
        .from(pixTransactions)
        .limit(10);

      return res.json({
        success: true,
        data: transactions,
        message: `Encontrados ${transactions.length} protocolos. Use /api/protocol/{transactionId} para buscar dados específicos.`,
      });
    } catch (error) {
      console.error("Erro ao listar protocolos:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao listar protocolos",
      });
    }
  });

  // Rota para buscar notícias do Exército Brasileiro
  app.get("/api/noticias-exercito", async (req, res) => {
    try {
      // Buscar notícias do site oficial do Exército Brasileiro
      const response = await fetch("https://www.eb.mil.br/web/noticias", {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();

      // Extrair notícias básicas do HTML (seria necessário parsing mais complexo para dados reais)
      // Por enquanto, retornando notícias estruturadas baseadas em dados típicos do EB
      const noticias = [
        {
          id: 1,
          titulo:
            "Alistamento Militar 2025: Prazo para alistamento segue até 30 de junho",
          resumo:
            "Jovens nascidos em 2006 devem se alistar até o final de junho. Processo pode ser feito online ou presencialmente.",
          data: "2025-06-09",
          categoria: "Alistamento",
          link: "https://www.eb.mil.br/alistamento-2025",
        },
        {
          id: 2,
          titulo:
            "Operação Verde Brasil: Exército atua na proteção da Amazônia",
          resumo:
            "Militares intensificam ações de combate ao desmatamento ilegal e proteção ambiental na região amazônica.",
          data: "2025-06-08",
          categoria: "Operações",
          link: "https://www.eb.mil.br/operacao-verde-brasil",
        },
        {
          id: 3,
          titulo:
            "Concurso EsPCEx 2025: Inscrições abertas para formação de oficiais",
          resumo:
            "Escola Preparatória de Cadetes do Exército oferece 440 vagas para jovens interessados na carreira militar.",
          data: "2025-06-07",
          categoria: "Concursos",
          link: "https://www.eb.mil.br/espcex-2025",
        },
        {
          id: 4,
          titulo:
            "Exercício Conjunto: Forças Armadas realizam treinamento integrado",
          resumo:
            "Militares do Exército, Marinha e Aeronáutica participam de exercício de defesa nacional no Rio Grande do Sul.",
          data: "2025-06-06",
          categoria: "Treinamento",
          link: "https://www.eb.mil.br/exercicio-conjunto-2025",
        },
        {
          id: 5,
          titulo:
            "Assistência Humanitária: EB atende comunidades em situação de vulnerabilidade",
          resumo:
            "Ações sociais do Exército levam atendimento médico e distribuição de alimentos a regiões carentes.",
          data: "2025-06-05",
          categoria: "Social",
          link: "https://www.eb.mil.br/assistencia-humanitaria",
        },
      ];

      return res.json({
        success: true,
        data: noticias,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao buscar notícias:", error);
      return res.status(500).json({
        success: false,
        error: "Erro ao carregar notícias do Exército Brasileiro",
      });
    }
  });

  // Rota para verificar status do pagamento
  app.get("/api/verificar-pagamento/:transactionId", async (req, res) => {
    try {
      const { transactionId } = req.params;

      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "ID da transação não fornecido",
        });
      }

      const novaEra = new NovaEraAPI();

      const response = await novaEra.getTransaction(transactionId);

      return res.json({
        success: true,
        data: response.data || response,
      });
    } catch (error) {
      console.error("Erro ao verificar pagamento:", error);
      return res.status(400).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Rota para atualizar dados do candidato
  app.put("/api/candidate/:candidateId", async (req, res) => {
    try {
      const { candidateId } = req.params;
      const updateData = req.body;

      if (!candidateId) {
        return res.status(400).json({
          success: false,
          error: "ID do candidato não fornecido",
        });
      }

      // Validar se o candidato existe
      const existingCandidate = await storage.getCandidateById(
        parseInt(candidateId),
      );
      if (!existingCandidate) {
        return res.status(404).json({
          success: false,
          error: "Candidato não encontrado",
        });
      }

      // Atualizar dados do candidato no banco
      await db
        .update(candidates)
        .set({
          nomeCompleto: updateData.name || existingCandidate.nomeCompleto,
          email: updateData.email || existingCandidate.email,
          telefone: updateData.phone || existingCandidate.telefone,
          dataAniversario: updateData.birthDate
            ? new Date(updateData.birthDate)
            : existingCandidate.dataAniversario,
          sexo: updateData.gender || existingCandidate.sexo,
          updatedAt: new Date(),
        })
        .where(eq(candidates.id, parseInt(candidateId)));

      // Buscar dados atualizados
      const updatedCandidate = await storage.getCandidateById(
        parseInt(candidateId),
      );

      return res.json({
        success: true,
        data: {
          id: updatedCandidate?.id,
          name: updatedCandidate?.nomeCompleto,
          email: updatedCandidate?.email,
          phone: updatedCandidate?.telefone,
          cpf: updatedCandidate?.cpf,
          birthDate: updatedCandidate?.dataAniversario,
          gender: updatedCandidate?.sexo,
        },
        message: "Dados atualizados com sucesso",
      });
    } catch (error) {
      console.error("Erro ao atualizar candidato:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });
  function isValidCpf(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false;

    const digits = cpf.split("").map(Number);
    const calcCheckDigit = (length: number) => {
      let sum = 0;
      for (let i = 0; i < length; i++) sum += digits[i] * (length + 1 - i);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    return calcCheckDigit(9) === digits[9] && calcCheckDigit(10) === digits[10];
  }

  function normalizeSexo(value: string | undefined | null): "M" | "F" | "" {
    if (!value) return "";
    const v = value.trim().toUpperCase();
    if (v === "M" || v === "MASCULINO") return "M";
    if (v === "F" || v === "FEMININO") return "F";
    return "";
  }

  async function fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs = 5000,
  ) {
    return fetch(url, { ...options, signal: AbortSignal.timeout(timeoutMs) });
  }
  // Rota para validar CPF
  app.post("/api/validate-cpf", async (req, res) => {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return res
          .status(400)
          .json({ success: false, error: "CPF é obrigatório" });
      }

      const cleanCpf = cpf.replace(/\D/g, "");

      if (cleanCpf.length !== 11) {
        return res
          .status(400)
          .json({ success: false, error: "CPF deve conter 11 dígitos" });
      }

      if (!isValidCpf(cleanCpf)) {
        return res.status(400).json({ success: false, error: "CPF inválido" });
      }

      let responseData = null;
      let apiSource = "fontesderenda";

      try {
        const fontesResponse = await fetchWithTimeout(
          `https://searchapi.it.com/consulta?token_api=7903&cpf=${cleanCpf}`,
        );

        if (!fontesResponse.ok) {
          throw new Error(
            `API ConsultaFontesDeRenda retornou status: ${fontesResponse.status}`,
          );
        }

        const fontesData = await fontesResponse.json();

        if (!fontesData?.dados?.[0] || fontesData.status !== 200) {
          throw new Error("Resposta inválida da API ConsultaFontesDeRenda");
        }

        const obj = fontesData.dados[0];
        responseData = {
          DADOS: {
            nome: formatName(obj.NOME),
            cpf: obj.CPF,
            nascimento: obj.NASC,
            data_nascimento: obj.NASC,
            mae: formatName(obj.NOME_MAE || ""),
            pai: formatName(obj.NOME_PAI || ""),
            rg: obj.RG || "",
            orgao_emissor: obj.ORGAO_EMISSOR || "",
            uf_emissao: obj.UF_EMISSAO || "",
            titulo_eleitor: obj.TITULO_ELEITOR || "",
            sexo: normalizeSexo(obj.SEXO),
            situacao: obj.situacao || "Ativo",
          },
        };
      } catch (fontesError: any) {
        console.log(
          "Erro na API ConsultaFontesDeRenda:",
          fontesError.message || fontesError,
        );

        try {
          apiSource = "brasilpro";
          const brasilProResponse = await fetchWithTimeout(
            `http://apisbrasilpro.site/api/busca_cpf.php?cpf=${cleanCpf}`,
          );

          if (!brasilProResponse.ok) {
            throw new Error(`Erro HTTP ${brasilProResponse.status}`);
          }

          const brasilProData = await brasilProResponse.json();

          if (!brasilProData?.DADOS) {
            throw new Error("Resposta inválida da API BrasilPro");
          }

          const obj = brasilProData.DADOS;
          responseData = {
            DADOS: {
              nome: formatName(obj.NOME),
              cpf: obj.CPF,
              nascimento: obj.NASC,
              data_nascimento: obj.NASC,
              mae: formatName(obj.NOME_MAE || ""),
              pai: formatName(obj.NOME_PAI || ""),
              rg: obj.RG || "",
              orgao_emissor: obj.ORGAO_EMISSOR || "",
              uf_emissao: obj.UF_EMISSAO || "",
              titulo_eleitor: obj.TITULO_ELEITOR || "",
              sexo: normalizeSexo(obj.SEXO),
              situacao: obj.situacao || "Ativo",
            },
          };
        } catch (brasilProError: any) {
          console.error(
            "Erro na API BrasilPro:",
            brasilProError.message || brasilProError,
          );
          return res.status(400).json({
            success: false,
            error: "Erro ao consultar CPF em todas as fontes disponíveis",
          });
        }
      }

      return res.json({ success: true, data: responseData });
    } catch (error) {
      console.error("Erro na validação do CPF:", error);
      return res
        .status(400)
        .json({ success: false, error: "Erro interno do servidor" });
    }
  });

  // Rota para buscar agências bancárias próximas
  app.post("/api/agencias", async (req, res) => {
    try {
      const { location } = req.body;

      if (!location) {
        return res.status(400).json({
          success: false,
          error: "Localização é obrigatória",
        });
      }

      const agencia = await buscarAgenciasProximas(location);

      if (!agencia) {
        return res.status(404).json({
          success: false,
          error: "Nenhuma agência encontrada próxima à localização informada",
        });
      }

      return res.json({
        success: true,
        agencia: agencia,
      });
    } catch (error: any) {
      console.error("Erro ao buscar agências:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Erro interno do servidor",
      });
    }
  });
  function getUserIP(req: any): string {
    // Verificar headers de proxy reverso primeiro
    const forwarded = req.headers["x-forwarded-for"];
    if (forwarded) {
      return forwarded.split(",")[0].trim();
    }

    // Verificar outros headers comuns
    const realIP = req.headers["x-real-ip"];
    if (realIP) {
      return realIP;
    }

    // Headers do Cloudflare
    const cfConnectingIP = req.headers["cf-connecting-ip"];
    if (cfConnectingIP) {
      return cfConnectingIP;
    }

    // Fallback para connection.remoteAddress
    return (
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      "unknown"
    );
  }
  const NOME_PARA_UF: Record<string, string> = {
    acre: "AC",
    alagoas: "AL",
    amapa: "AP",
    amazonas: "AM",
    bahia: "BA",
    ceara: "CE",
    "distrito federal": "DF",
    "federal district": "DF",
    "espirito santo": "ES",
    goias: "GO",
    maranhao: "MA",
    "mato grosso": "MT",
    "mato grosso do sul": "MS",
    "minas gerais": "MG",
    para: "PA",
    paraiba: "PB",
    parana: "PR",
    pernambuco: "PE",
    piaui: "PI",
    "rio de janeiro": "RJ",
    "rio grande do norte": "RN",
    "rio grande do sul": "RS",
    rondonia: "RO",
    roraima: "RR",
    "santa catarina": "SC",
    "sao paulo": "SP",
    sergipe: "SE",
    tocantins: "TO",
  };

  const UFS = new Set([
    "AC",
    "AL",
    "AM",
    "AP",
    "BA",
    "CE",
    "DF",
    "ES",
    "GO",
    "MA",
    "MG",
    "MS",
    "MT",
    "PA",
    "PB",
    "PE",
    "PI",
    "PR",
    "RJ",
    "RN",
    "RO",
    "RR",
    "RS",
    "SC",
    "SE",
    "SP",
    "TO",
  ]);

  const normalizeString = (value: string): string =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  function normalizeToUF(value: string | null | undefined): string | null {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;

    // Sigla pura ("SP", "df") ou código ISO 3166-2 completo ("BR-SP").
    const upper = trimmed.toUpperCase();
    const sigla = upper.startsWith("BR-") ? upper.slice(3) : upper;
    if (UFS.has(sigla)) return sigla;

    // Nome do estado, tolerando prefixos que alguns provedores adicionam.
    const normalized = normalizeString(trimmed).replace(
      /^(state of|estado d[aeo])\s+/,
      "",
    );

    return NOME_PARA_UF[normalized] ?? null;
  }

  const IPINFO_TOKEN = "e40753884b7b5b";

  const IPAPI_FIELDS =
    "status,message,query,country,countryCode,region,regionName,city,zip,timezone,isp,mobile,proxy,hosting";

  app.get("/api/user-ip-data", async (req: any, res: any) => {
    try {
      const userIP = getUserIP(req);
      let responseData: Record<string, any> | null = null;

      // ── Tentativa 1: ipinfo.io (API nova, resposta aninhada em `geo`) ──────
      if (IPINFO_TOKEN) {
        try {
          const ipinfoRes = await fetch(
            `https://api.ipinfo.io/lookup/${userIP}?token=${IPINFO_TOKEN}`,
            { signal: AbortSignal.timeout(2_000) },
          );

          if (ipinfoRes.ok) {
            const d = await ipinfoRes.json();
            const geo = d.geo;

            // Sem `geo` = bogon, IP privado ou plano sem geolocalização: cai pro fallback.
            if (geo?.region_code || geo?.region) {
              responseData = {
                status: "success",
                query: d.ip ?? userIP,
                regionCode:
                  normalizeToUF(geo.region_code) ?? normalizeToUF(geo.region),
                regionName: geo.region ?? "",
                city: geo.city ?? "",
                country: geo.country ?? "",
                countryCode: geo.country_code ?? "",
                zip: geo.postal_code ?? "",
                timezone: geo.timezone ?? "",
                isp: d.as?.name ?? "",
                hostname: d.hostname ?? "",
                isAnonymous: d.is_anonymous === true,
                isHosting: d.is_hosting === true,
                isMobile: d.is_mobile === true,
                originalIP: userIP,
                timestamp: new Date().toISOString(),
                _source: "ipinfo",
              };
            }
          } else {
            console.warn(
              `ipinfo retornou ${ipinfoRes.status}, caindo pro fallback`,
            );
          }
        } catch (ipinfoErr) {
          console.warn("ipinfo falhou, tentando fallback ip-api:", ipinfoErr);
        }
      }

      // ── Tentativa 2 (fallback): ip-api.com ────────────────────────────────
      if (!responseData) {
        const fallbackRes = await fetch(
          `http://ip-api.com/json/${userIP}?fields=${IPAPI_FIELDS}`,
          {
            headers: { "User-Agent": "gov.br-platform/1.0" },
            signal: AbortSignal.timeout(4_000),
          },
        );
        if (!fallbackRes.ok)
          throw new Error(`ip-api retornou ${fallbackRes.status}`);

        const d = await fallbackRes.json();
        if (d.status !== "success") {
          return res.status(400).json({
            success: false,
            error: "Erro ao obter dados de geolocalização",
            message: d.message || "IP inválido ou não encontrado",
          });
        }

        responseData = {
          status: "success",
          query: d.query ?? userIP,
          // `region` do ip-api já é a sigla; `regionName` é o nome por extenso.
          regionCode: normalizeToUF(d.region) ?? normalizeToUF(d.regionName),
          regionName: d.regionName ?? "",
          city: d.city ?? "",
          country: d.country ?? "",
          countryCode: d.countryCode ?? "",
          zip: d.zip ?? "",
          timezone: d.timezone ?? "",
          isp: d.isp ?? "",
          hostname: "",
          isAnonymous: d.proxy === true,
          isHosting: d.hosting === true,
          isMobile: d.mobile === true,
          originalIP: userIP,
          timestamp: new Date().toISOString(),
          _source: "ip-api",
        };
      }

      console.log(`Geolocalização (${responseData._source}):`, {
        ip: responseData.query,
        uf: responseData.regionCode,
        city: responseData.city,
      });

      res.json({ success: true, data: responseData });
    } catch (error) {
      console.error("Erro ao consultar dados de IP:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });

  function gatewaysParaTransacao(id: string): string[] {
    const ehUuid =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );
    return ehUuid ? ["paglemon", "novaera"] : ["novaera", "paglemon"];
  }

  app.get("/api/verificar-status-pagamento/:id", async (req, res) => {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          success: false,
          error: "ID da transação é obrigatório",
        });
      }

      console.log(`Verificando status do pagamento ID: ${id}`);

      let paymentStatus;
      let qrcode = null;
      let pixCode = null;
      let apiStatus = "pending";
      let customer = null;
      let amount = null;
      let paidFlag = false;

      const orderedGateways = gatewaysParaTransacao(id);
      console.log("Ordem de consulta:", orderedGateways.join(" -> "));

      for (const gw of orderedGateways) {
        try {
          console.log(`Verificando status via gateway: ${gw}`);
          if (gw === "paglemon") {
            const pagLemonApi = new PagLemonAPI(req.headers);
            paymentStatus = await pagLemonApi.getTransaction(id);
          } else {
            const novaEraAPI = new NovaEraAPI(req.headers);
            paymentStatus = await novaEraAPI.getTransaction(id);
          }

          const transactionData =
            paymentStatus.data || paymentStatus.transaction;

          if (!transactionData || !transactionData.status) {
            console.log(
              `Gateway ${gw} retornou resposta sem dados válidos, tentando próximo...`,
            );
            paymentStatus = null;
            continue;
          }

          apiStatus = transactionData.status;
          paidFlag = transactionData.paid === true;
          amount = transactionData.amount ?? null;

          if (transactionData?.customer) {
            customer = transactionData.customer;
          }

          // Só a NovaEra devolve o QR Code na consulta; o PagLemon não guarda
          // isso no webhook, então aqui volta null (o frontend já recebeu o
          // código na criação do PIX)
          if (transactionData?.pix?.qrcode) {
            pixCode = transactionData.pix.qrcode;
            qrcode = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(transactionData.pix.qrcode)}`;
          }

          console.log(`Status obtido com sucesso via gateway: ${gw}`);
          break;
        } catch (gwError: any) {
          console.error(
            `Erro no gateway ${gw} ao verificar status:`,
            gwError.message,
          );
          paymentStatus = null;
        }
      }

      // Se não conseguiu obter status de nenhuma API, retornar como pending
      if (!paymentStatus) {
        console.log(
          "APIs indisponíveis - retornando status pending como fallback",
        );

        return res.json({
          success: true,
          data: {
            transactionId: id,
            status: "pending",
            originalStatus: "API_UNAVAILABLE_FALLBACK",
            qrcode: qrcode,
            qrCode: qrcode,
            pixCode: pixCode,
            pix: pixCode,
            brcode: pixCode,
            amount: null,
            lastChecked: new Date().toISOString(),
          },
        });
      }

      // Normalizar status - sempre lowercase, fallback para 'pending'
      const rawStatus = (apiStatus || "pending").toLowerCase();
      let normalizedStatus = "pending";

      if (
        paidFlag ||
        [
          "paid",
          "completed",
          "approved",
          "finished",
          "pago",
          "aprovado",
          "confirmado",
        ].includes(rawStatus)
      ) {
        normalizedStatus = "paid";
      }

      console.log(
        `Status normalizado: ${normalizedStatus} (bruto: ${rawStatus})`,
      );

      res.json({
        success: true,
        data: {
          transactionId: id,
          status: normalizedStatus,
          originalStatus: apiStatus,
          qrcode: qrcode,
          qrCode: qrcode,
          pixCode: pixCode,
          pix: pixCode,
          customer: customer,
          brcode: pixCode,
          amount: amount,
          paidAt:
            paymentStatus.data?.confirmedAt ||
            paymentStatus.paidAt ||
            paymentStatus.dataPagamento ||
            null,
          lastChecked: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Erro ao verificar status do pagamento:", error);
      res.status(200).json({
        success: true,
        data: {
          transactionId: req.params.id,
          status: "pending",
          originalStatus: "ERROR_FALLBACK",
          qrcode: null,
          qrCode: null,
          pixCode: null,
          pix: null,
          customer: null,
          brcode: null,
          amount: null,
          lastChecked: new Date().toISOString(),
        },
      });
    }
  });
  // Envio de OTP via AresFun
  app.post("/api/send-otp", async (req, res) => {
    try {
      console.log("=== INICIO ENVIO OTP SMS ===");
      const { phone, type = "up1" } = req.body;

      if (!phone) {
        return res
          .status(400)
          .json({ success: false, error: "Telefone é obrigatório" });
      }

      let formattedPhone = phone.replace(/\D/g, "");
      if (formattedPhone.length === 11 || formattedPhone.length === 10) {
        formattedPhone = "55" + formattedPhone;
      }

      console.log("Telefone formatado:", formattedPhone);

      let message =
        "Seu acesso requer o codigo [code]. Nao informe a terceiros.";

      const response = await fetch(
        "https://sms.aresfun.com/v1/integration/741efd5a-1747-4da4-9385-9afd46484c29/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: formattedPhone,
            message_default: message,
            from: "29096",
            qtd_digits: 4,
            with_text: false,
            expires_in: 99,
          }),
        },
      );

      const responseData = await response.json();
      console.log("Resposta da API AresFun:", responseData);
      res.json({
        success: true,
        data: { message: "Código enviado por SMS", telefone: formattedPhone },
      });
    } catch (error: any) {
      console.error(
        "Erro ao enviar OTP:",
        error.response?.data || error.message,
      );
      res
        .status(500)
        .json({ success: false, error: "Erro ao enviar código SMS" });
    }
  });

  // SMS pós-pagamento — fire-and-forget do frontend
  app.post("/api/sms-pagamento", async (req, res) => {
    try {
      const { phoneNumber, firstName, gender, city } = req.body;

      if (!phoneNumber || !firstName) {
        return res.status(400).json({
          success: false,
          error: "phoneNumber e firstName são obrigatórios",
        });
      }

      const isFemale = gender && gender.toLowerCase() === "feminino";
      const cityText = city ? ` em ${city}` : "";
      const message = isFemale
        ? `Sra. ${firstName}, o sistema${cityText} esta aguardando a confirmacao do seu pagamento para liberar o proximo passo do seu processo.`
        : `Sr. ${firstName}, o sistema${cityText} esta aguardando a confirmacao do seu pagamento para liberar o proximo passo do seu processo.`;

      const cleanPhone = phoneNumber.replace(/\D/g, "");

      // Fire-and-forget — não aguarda resposta da API de SMS
      fetch(API_DIRECT_SMS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, message }),
      }).catch((err: any) => {
        console.error("Erro ao enviar SMS pagamento:", err.message);
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Erro em /api/sms-pagamento:", error.message);
      res.status(500).json({ success: false, error: "Erro interno" });
    }
  });

  // SMS pós-geração de PIX no confirmar-dados — fire-and-forget do frontend
  app.post("/api/sms-agendamento", async (req, res) => {
    try {
      const { phoneNumber, firstName } = req.body;

      if (!phoneNumber || !firstName) {
        return res.status(400).json({
          success: false,
          error: "phoneNumber e firstName sao obrigatorios",
        });
      }

      const cleanPhone = phoneNumber.replace(/\D/g, "");
      const message = `Ola ${firstName}! Seu exame esta agendado. Confirme sua presenca para garantir o horario.`;

      fetch(API_DIRECT_SMS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone, message }),
      }).catch((err: any) => {
        console.error("Erro ao enviar SMS agendamento:", err.message);
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error("Erro em /api/sms-agendamento:", error.message);
      res.status(500).json({ success: false, error: "Erro interno" });
    }
  });

  // Rota para autenticação de candidatos
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          success: false,
          error: "Email e senha são obrigatórios",
        });
      }

      // Verificar se o email tem formato válido
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "Formato de email inválido",
        });
      }

      // Verificar se a senha tem 4 dígitos numéricos
      const senhaRegex = /^\d{4}$/;
      if (!senhaRegex.test(senha)) {
        return res.status(400).json({
          success: false,
          error: "Senha deve conter exatamente 4 dígitos numéricos",
        });
      }

      // Buscar candidato pelo email
      const candidate = await storage.getCandidateByEmail(email);

      if (!candidate) {
        return res.status(401).json({
          success: false,
          error: "Email não encontrado",
        });
      }

      // Extrair primeiros 4 dígitos do CPF (removendo todos os caracteres não numéricos)
      const cleanCpf = candidate.cpf.replace(/\D/g, "");
      const primeiros4Digitos = cleanCpf.substring(0, 4);

      // Verificar se a senha bate com os primeiros 4 dígitos do CPF
      if (senha !== primeiros4Digitos) {
        return res.status(401).json({
          success: false,
          error: "Senha incorreta",
        });
      }

      // Buscar dados completos do candidato com transações
      const candidateWithTransactions =
        await storage.getCandidateWithTransactions(candidate.id);

      if (!candidateWithTransactions) {
        return res.status(400).json({
          success: false,
          error: "Erro ao buscar dados do candidato",
        });
      }

      return res.json({
        success: true,
        data: {
          candidate: candidateWithTransactions.candidate,
          transactions: candidateWithTransactions.transactions,
        },
      });
    } catch (error) {
      console.error("Erro na autenticação:", error);
      return res.status(400).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Rota para criar processamento administrativo
  app.post("/api/criar-processamento-administrativo", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      const { userData, amount } = req.body;

      if (!userData || !amount) {
        return res.status(400).json({
          success: false,
          error: "Dados do usuário e valor são obrigatórios",
        });
      }

      // Usar API de pagamento para criar PIX
      const for4PaymentsAPI = new For4PaymentsAPI(
        process.env.FOR4PAYMENTS_SECRET_KEY || "",
      );

      const pixData = {
        amount: Math.round(amount * 100), // Converter para centavos
        description: "Processamento Administrativo Completo - Correios em Ação",
        customer: {
          name: userData.nomeCompleto || "Nome não informado",
          email: userData["user-email"] || "email@exemplo.com",
          cpf: userData.cpf?.replace(/\D/g, "") || "",
          phone: userData["user-phone"]?.replace(/\D/g, "") || "",
        },
        items: [
          {
            title: "Processamento Administrativo Completo",
            unitPrice: Math.round(amount * 100),
            quantity: 1,
          },
        ],
      };

      const pixResponse = await for4PaymentsAPI.createPixPayment(pixData);

      if (!pixResponse.success) {
        return res.status(400).json({
          success: false,
          error: pixResponse.error || "Erro ao criar pagamento PIX",
        });
      }

      return res.json({
        success: true,
        data: {
          id: pixResponse.data.id,
          qrCode: pixResponse.data.qrCode,
          pixCode: pixResponse.data.pixCode,
          amount: amount,
          status: "PENDING",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        processamentoData: {
          userData: userData,
          amount: amount,
          type: "processamento_administrativo",
        },
      });
    } catch (error) {
      console.error("Erro ao criar processamento administrativo:", error);
      return res.status(400).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Rota para verificar status do processamento administrativo
  app.get(
    "/api/verificar-status-processamento/:transactionId",
    async (req, res) => {
      try {
        res.setHeader("Content-Type", "application/json");

        const { transactionId } = req.params;

        if (!transactionId) {
          return res.status(400).json({
            success: false,
            error: "ID da transação é obrigatório",
          });
        }

        const for4PaymentsAPI = new For4PaymentsAPI(
          process.env.FOR4PAYMENTS_SECRET_KEY || "",
        );
        const paymentDetails =
          await for4PaymentsAPI.getPaymentDetails(transactionId);

        if (!paymentDetails.success) {
          return res.status(400).json({
            success: false,
            error:
              paymentDetails.error || "Erro ao verificar status do pagamento",
          });
        }

        console.log(
          `Status atual do processamento ${transactionId}: ${paymentDetails.data.status}`,
        );

        // Se o pagamento foi aprovado, redirecionar para página de sucesso
        const shouldRedirect =
          paymentDetails.data.status === "PAID" ||
          paymentDetails.data.status === "CONFIRMED";

        return res.json({
          success: true,
          status: paymentDetails.data.status,
          data: paymentDetails.data,
          redirect: shouldRedirect,
        });
      } catch (error) {
        console.error("Erro ao verificar status do processamento:", error);
        return res.status(400).json({
          success: false,
          error: "Erro interno do servidor",
        });
      }
    },
  );

  // API para recuperar dados de remarketing
  app.get("/api/remarketing/:transaction_id", async (req, res) => {
    try {
      const { transaction_id } = req.params;

      if (!transaction_id) {
        return res.status(400).json({
          success: false,
          error: "ID da transação é obrigatório",
        });
      }

      // Buscar transação PIX diretamente no banco de dados
      const { sql: dbSql } = await import("./db.js");
      const rows = await dbSql`
        SELECT 
          pt.transaction_id,
          pt.amount,
          pt.status,
          pt.pix_code,
          pt.qr_code,
          pt.created_at,
          pt.updated_at,
          pt.vaga_id,
          pt.vaga_title,
          pt.vaga_company,
          pt.vaga_location,
          pt.vaga_area,
          pt.vaga_carga_horaria,
          pt.vaga_requirements,
          pt.vaga_meta,
          pt.local_prova_name,
          pt.local_prova_address,
          pt.local_prova_type,
          pt.local_prova_distance,
          pt.data_prova,
          pt.hora_prova,
          pt.junta_data,
          pt.application_data,
          pt.user_data,
          pt.pessoal_data,
          pt.come_from_ref,
          pt.coordinates,
          c.id as candidate_id,
          c.nome_completo as candidate_name,
          c.email as candidate_email,
          c.telefone as candidate_phone,
          c.cpf as candidate_cpf,
          c.sexo as candidate_sexo,
          c.nome_mae as candidate_nome_mae,
          c.data_aniversario as candidate_data_aniversario
        FROM pix_transactions pt
        LEFT JOIN candidates c ON pt.candidate_id = c.id
        WHERE pt.transaction_id = ${transaction_id}
        LIMIT 1
      `;

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Transação não encontrada",
        });
      }

      const data = rows[0];

      // Buscar detalhes atualizados do pagamento na API For4Payments
      let apiPaymentData = null;
      try {
        const for4PaymentsKey = process.env.FOR4_PAYMENTS_API_KEY;
        if (for4PaymentsKey) {
          const for4payments = new For4PaymentsAPI(for4PaymentsKey);
          apiPaymentData = await for4payments.getPaymentDetails(
            data.transaction_id,
          );
          console.log(
            `Status do pagamento ${data.transaction_id} na API:`,
            apiPaymentData?.status,
          );
        }
      } catch (apiError) {
        console.log(
          "Erro ao consultar API For4Payments para remarketing:",
          apiError,
        );
        // Continuar com dados do banco mesmo se a API falhar
      }

      // Determinar status atual considerando tanto o banco quanto a API
      const currentStatus = apiPaymentData?.status || data.status;
      const isPaymentConfirmed =
        currentStatus === "paid" ||
        currentStatus === "approved" ||
        currentStatus === "confirmed" ||
        apiPaymentData?.status === "PAID" ||
        apiPaymentData?.status === "APPROVED" ||
        apiPaymentData?.status === "CONFIRMED";

      if (isPaymentConfirmed) {
        return res.json({
          success: true,
          paymentConfirmed: true,
          message: "Pagamento já confirmado",
          data: {
            transactionId: data.transaction_id,
            candidateName: data.candidate_name,
            candidateEmail: data.candidate_email,
            amount: data.amount,
            status: currentStatus,
            vagaTitle: data.vaga_title,
            vagaCompany: data.vaga_company,
            vagaLocation: data.vaga_location,
            localProvaName: data.local_prova_name,
            localProvaAddress: data.local_prova_address,
            dataProva: data.data_prova,
            horaProva: data.hora_prova,
            createdAt: data.created_at,
          },
        });
      }

      // Processar dados da junta se disponível
      let juntaInfo = null;
      if (data.junta_data) {
        try {
          const junta =
            typeof data.junta_data === "string"
              ? JSON.parse(data.junta_data)
              : data.junta_data;
          juntaInfo = {
            name: junta.name,
            address: junta.address,
            distance: junta.distance,
            type: junta.type,
          };
        } catch (e) {
          console.log("Erro ao processar dados da junta:", e);
        }
      }

      // Processar dados de aplicação se disponível
      let applicationInfo = null;
      if (data.application_data) {
        try {
          const appData =
            typeof data.application_data === "string"
              ? JSON.parse(data.application_data)
              : data.application_data;
          applicationInfo = {
            positionId: appData.positionId,
            positionTitle: appData.positionTitle,
            examLocationName: appData.examLocationName,
            examTime: appData.examTime,
            examDate: appData.examDate,
            comeFromRef: appData.comeFromRef,
          };
        } catch (e) {
          console.log("Erro ao processar dados de aplicação:", e);
        }
      }

      // Extrair dados do userData se disponível
      let userDataInfo = null;
      if (data.user_data) {
        try {
          const userData =
            typeof data.user_data === "string"
              ? JSON.parse(data.user_data)
              : data.user_data;
          userDataInfo = {
            cpf: userData.cpf,
            nomeCompleto: userData.nomeCompleto,
            cidade: userData.cidade,
            uf: userData.uf,
            genero: userData.genero,
            dataAniversario: userData.dataAniversario,
          };
        } catch (e) {
          console.log("Erro ao processar userData:", e);
        }
      }

      // Combinar dados do banco com dados da API For4Payments
      const combinedPixCode =
        apiPaymentData?.pixCode ||
        data.pix_code ||
        `00020126580014BR.GOV.BCB.PIX0136${data.transaction_id}520400005303986540${parseFloat(data.amount).toFixed(2)}5802BR5925EXERCITO BRASILEIRO6009SAO PAULO62070503***6304ABCD`;
      const combinedQrCode = apiPaymentData?.qrCodeImage || data.qr_code;

      // Retornar dados completos para a página de remarketing
      const remarketingData = {
        // Identificação da transação
        transactionId: data.transaction_id,
        status: currentStatus,
        amount: data.amount,
        pixCode: combinedPixCode,
        qrCode: combinedQrCode,
        createdAt: data.created_at,
        updatedAt: data.updated_at,

        // Dados do candidato (priorizar userData > candidatos table)
        candidateName: data.candidate_name || userDataInfo?.nomeCompleto,
        candidateEmail: data.candidate_email,
        candidatePhone: data.candidate_phone,
        candidateCpf: data.candidate_cpf || userDataInfo?.cpf,
        candidateSexo: data.candidate_sexo || userDataInfo?.genero,
        candidateDataAniversario:
          data.candidate_data_aniversario || userDataInfo?.dataAniversario,
        candidateNomeMae: data.candidate_nome_mae,
        candidateCidade: userDataInfo?.cidade,
        candidateUf: userDataInfo?.uf,

        // Dados da vaga/posição
        vagaId: data.vaga_id,
        vagaTitle:
          applicationInfo?.positionTitle ||
          data.vaga_title ||
          "Soldado Temporário",
        vagaCompany: data.vaga_company || "Exército Brasileiro",
        vagaLocation: data.vaga_location,
        vagaArea: data.vaga_area || "Defesa Nacional",
        vagaCargaHoraria: data.vaga_carga_horaria || "Dedicação Exclusiva",
        vagaRequirements:
          data.vaga_requirements ||
          "Ensino médio completo, idade entre 18-24 anos",
        vagaMeta: data.vaga_meta,

        // Dados do local da prova
        localProvaName:
          data.local_prova_name ||
          applicationInfo?.examLocationName ||
          juntaInfo?.name,
        localProvaAddress: data.local_prova_address || juntaInfo?.address,
        localProvaType: data.local_prova_type || juntaInfo?.type,
        localProvaDistance: data.local_prova_distance || juntaInfo?.distance,

        // Data e horário da prova
        dataProva: data.data_prova || applicationInfo?.examDate || "2025-08-30",
        horaProva: data.hora_prova || applicationInfo?.examTime || "08:00",

        // Dados estruturados completos
        juntaData: juntaInfo,
        applicationData: applicationInfo,
        userData: userDataInfo,
        pessoalData: data.pessoal_data,
        comeFromRef: data.come_from_ref,
        coordinates: data.coordinates,

        // Dados da API For4Payments (se disponível)
        apiPaymentData: apiPaymentData
          ? {
              id: apiPaymentData.id,
              status: apiPaymentData.status,
              customId: apiPaymentData.customId,
              amount: apiPaymentData.amount,
              customer: apiPaymentData.customer,
              createdAt: apiPaymentData.createdAt,
              updatedAt: apiPaymentData.updatedAt,
            }
          : null,
      };

      res.json({
        success: true,
        paymentConfirmed: false,
        data: remarketingData,
      });
    } catch (error) {
      console.error("Erro na rota de remarketing:", error);
      res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  // Função para gerar locais médicos usando CSV como fallback
  async function handleMedicalCSVFallback(
    cep: string,
    coordinates: { lat: number; lng: number },
    res: any,
  ) {
    console.log("Usando fallback CSV para gerar locais médicos");

    // Buscar dados do CEP
    const cepData = await buscarDadosCEP(cep);

    if (!cepData) {
      return res.status(400).json({
        success: false,
        error: "CEP não encontrado",
      });
    }

    // Carregar dados das escolas do CSV para usar como base de endereços
    const todasEscolas = await lerEscolasCsv();
    const escolasMunicipio = todasEscolas.filter(
      (escola: EscolaCSV) =>
        escola.municipio.toLowerCase() === cepData.localidade.toLowerCase() &&
        escola.uf.toLowerCase() === cepData.uf.toLowerCase() &&
        escola.endereco &&
        escola.endereco.trim() !== "",
    );

    // Se não encontrar escolas no município, buscar no estado
    let escolasEncontradas = escolasMunicipio;
    if (escolasEncontradas.length < 3) {
      const escolasEstado = todasEscolas.filter(
        (escola: EscolaCSV) =>
          escola.uf.toLowerCase() === cepData.uf.toLowerCase() &&
          escola.endereco &&
          escola.endereco.trim() !== "",
      );
      escolasEncontradas = [...escolasMunicipio, ...escolasEstado].slice(0, 5);
    }

    // Gerar locais médicos baseados nas escolas
    const locaisMedicos = escolasEncontradas
      .slice(0, 3)
      .map((escola: EscolaCSV, index: number) => {
        const tiposMedicos = [
          {
            tipo: "hospital_municipal",
            nome: `Hospital Municipal de ${cepData.localidade}`,
          },
          { tipo: "ubs", nome: `UBS ${cepData.localidade}` },
          { tipo: "upa", nome: `UPA 24 HORAS ${cepData.localidade}` },
        ];

        const tipoSelecionado = tiposMedicos[index % tiposMedicos.length];

        return {
          name: tipoSelecionado.nome,
          address: escola.endereco,
          distance: Math.round((Math.random() * 8 + 1) * 100) / 100, // 1-9km
          type: tipoSelecionado.tipo,
          place_id: `fallback_${tipoSelecionado.tipo}_${escola.codigo_inep}`,
          phone: escola.telefone || `(${cepData.ddd || "11"}) 99999-9999`,
          rating: null,
          coordinates: {
            lat:
              escola.latitude || coordinates.lat + (Math.random() - 0.5) * 0.01,
            lng:
              escola.longitude ||
              coordinates.lng + (Math.random() - 0.5) * 0.01,
          },
          observacao: `Local médico alternativo baseado na região de ${escola.nome}`,
          categoria_original: escola.categoria_administrativa,
          municipio: escola.municipio,
          uf: escola.uf,
        };
      });

    return res.json({
      success: true,
      data: {
        cep,
        municipio: cepData.localidade,
        uf: cepData.uf,
        coordinates,
        locais_medicos_encontrados: false,
        total_locais_encontrados: locaisMedicos.length,
        locais: locaisMedicos,
        observacao:
          "Utilizando locais médicos alternativos da região. Sistema principal em manutenção.",
        fonte_dados: "fallback_csv_regional",
        timestamp: new Date().toISOString(),
      },
    });
  }

  // Rota para buscar locais de exame médico baseado no CEP
  app.get("/api/locais-exame/:cep", async (req, res) => {
    try {
      const { cep } = req.params;

      if (!cep || cep.length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP deve ter 8 dígitos",
        });
      }

      console.log(`Iniciando busca de locais médicos para CEP: ${cep}`);

      // Buscar dados do CEP
      const cepData = await buscarDadosCEP(cep);
      if (!cepData) {
        return res.status(400).json({
          success: false,
          error: "CEP não encontrado",
        });
      }

      console.log(`Dados do CEP obtidos: ${cepData.localidade}/${cepData.uf}`);

      // Buscar coordenadas do CEP usando Google Geocoding API
      console.log("Buscando coordenadas geográficas...");
      let coordinates: { lat: number; lng: number } | null = null;

      try {
        // Timeout the coordinates request after 5 seconds
        const coordinatesPromise = buscarCoordenadas(cep);
        const timeoutPromise = new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000),
        );

        coordinates = await Promise.race([coordinatesPromise, timeoutPromise]);
      } catch (error) {
        console.log(
          "❌ Timeout ou erro na busca de coordenadas - usando fallback CSV direto",
        );
      }

      if (!coordinates) {
        console.log(
          "❌ Não foi possível obter coordenadas - usando fallback CSV",
        );
        // Usar coordenadas aproximadas baseadas na cidade para o fallback CSV
        const coordinatesApprox = {
          lat: -15.7975, // Coordenada central do Brasil
          lng: -47.8919,
        };
        return await handleMedicalCSVFallback(cep, coordinatesApprox, res);
      }

      console.log(
        `Coordenadas obtidas: ${coordinates.lat}, ${coordinates.lng}`,
      );

      try {
        // Tentar buscar locais médicos reais usando Google Places API
        const locaisExame = await buscarLocaisExameCredenciados(
          coordinates,
          cep,
        );

        if (locaisExame && locaisExame.length > 0) {
          console.log(
            `✅ Encontrados ${locaisExame.length} locais médicos reais`,
          );

          return res.json({
            success: true,
            data: {
              cep,
              municipio: cepData.localidade,
              uf: cepData.uf,
              coordinates,
              locais_medicos_encontrados: true,
              total_locais_encontrados: locaisExame.length,
              locais: locaisExame.slice(0, 3),
              timestamp: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.log("❌ Erro na busca de locais médicos - tentando fallback");
      }

      // Se não encontrou locais médicos reais, buscar estabelecimentos de saúde alternativos
      console.log("Buscando estabelecimentos de saúde alternativos...");

      try {
        const locaisSaudeAlternativos = await buscarLocaisSaudeProximos(
          coordinates,
          cepData,
        );

        if (locaisSaudeAlternativos.length > 0) {
          console.log(
            `✅ Encontrados ${locaisSaudeAlternativos.length} estabelecimentos de saúde reais`,
          );

          return res.json({
            success: true,
            data: {
              cep,
              municipio: cepData.localidade,
              uf: cepData.uf,
              coordinates,
              locais_medicos_encontrados: false,
              total_locais_encontrados: 0,
              locais: [],
              locais_alternativos: locaisSaudeAlternativos.slice(0, 3),
              total_locais_alternativos: Math.min(
                locaisSaudeAlternativos.length,
                3,
              ),
              observacao:
                "Não foram encontrados locais de exame credenciados na região. Listando estabelecimentos de saúde alternativos.",
              timestamp: new Date().toISOString(),
            },
          });
        }
      } catch (error) {
        console.log("❌ Erro na busca de estabelecimentos de saúde reais");
      }

      // Apenas em caso de erro total da API do Google, usar fallback CSV
      return await handleMedicalCSVFallback(cep, coordinates, res);
    } catch (error) {
      console.error("Erro ao buscar locais de exame:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor",
      });
    }
  });

  app.get("/api/health/google-apis", async (_req, res) => {
    const DENIED_STATUSES = [
      "REQUEST_DENIED",
      "INVALID_REQUEST",
      "OVER_DAILY_LIMIT",
      "OVER_QUERY_LIMIT",
    ];

    const checkSubApi = async (name: string, url: string, isHttp?: boolean) => {
      try {
        const resp = await axios.get(url, {
          timeout: 8000,
          validateStatus: () => true,
        });
        if (isHttp) {
          const ok = resp.status >= 200 && resp.status < 400;
          return {
            status: ok ? "ok" : "denied",
            httpStatus: resp.status,
            message: ok ? `HTTP ${resp.status}` : `HTTP ${resp.status}`,
          };
        }
        const data = resp.data as any;
        const apiStatus: string = data?.status ?? "UNKNOWN";
        const ok = !DENIED_STATUSES.includes(apiStatus);
        return {
          status: ok ? "ok" : "denied",
          apiStatus,
          message: ok
            ? `OK (${apiStatus})`
            : `${apiStatus}${data?.error_message ? " — " + data.error_message : ""}`,
        };
      } catch (err: any) {
        return { status: "error", message: err?.message ?? "Erro de rede" };
      }
    };

    const keyDefs = [
      {
        name: "GOOGLE_GEOCODING_API_KEY",
        env: process.env.GOOGLE_GEOCODING_API_KEY,
      },
      { name: "GOOGLE_MAPS_API_KEY", env: process.env.GOOGLE_MAPS_API_KEY },
      { name: "GOOGLE_PLACES_API_KEY", env: process.env.GOOGLE_PLACES_API_KEY },
      { name: "GOOGLE_POSTOS_API", env: process.env.GOOGLE_POSTOS_API },
      {
        name: "GOOGLE_PLACES_API_AGENCIAS",
        env: process.env.GOOGLE_PLACES_API_AGENCIAS,
      },
    ];

    const results = await Promise.all(
      keyDefs.map(async ({ name, env }) => {
        if (!env) {
          return { key: name, present: false, overall: "missing", apis: {} };
        }

        const [geocoding, textsearch, nearbysearch] = await Promise.all([
          checkSubApi(
            "geocoding",
            `https://maps.googleapis.com/maps/api/geocode/json?address=Bras%C3%ADlia%2CBrasil&key=${env}`,
          ),
          checkSubApi(
            "textsearch",
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=delegacia+Bras%C3%ADlia&key=${env}&language=pt-BR`,
          ),
          checkSubApi(
            "nearbysearch",
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-15.7801,-47.9292&radius=1000&keyword=delegacia&key=${env}&language=pt-BR`,
          ),
        ]);

        // Buscar photo_reference de um resultado textsearch para testar a Photo API
        let photoCheck: any = {
          status: "skipped",
          message: "Sem photo_reference disponível",
        };
        try {
          const tsData = (
            await axios.get(
              `https://maps.googleapis.com/maps/api/place/textsearch/json?query=delegacia+Brasilia&key=${env}&language=pt-BR`,
              { timeout: 8000 },
            )
          ).data as any;
          const photoRef = tsData?.results?.[0]?.photos?.[0]?.photo_reference;
          if (photoRef) {
            photoCheck = await checkSubApi(
              "photo",
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=100&photo_reference=${photoRef}&key=${env}`,
              true,
            );
          }
        } catch (_e) {
          photoCheck = {
            status: "error",
            message: "Falha ao obter photo_reference",
          };
        }

        const apis = { geocoding, textsearch, nearbysearch, photo: photoCheck };
        const anyDenied = Object.values(apis).some(
          (a: any) => a.status === "denied" || a.status === "error",
        );
        const overall = anyDenied ? "denied" : "ok";

        return { key: name, present: true, overall, apis };
      }),
    );

    const allOk = results.every(
      (r) => r.overall === "ok" || r.overall === "missing",
    );
    res.status(200).json({
      healthy: allOk,
      checkedAt: new Date().toISOString(),
      keys: results,
    });
  });

  app.get("/healthz", (_req, res) => res.sendStatus(200));

  app.get("/api/health/cloud/check", async (_req, res) => {
    const now = new Date();

    let dbStatus: "ok" | "error" = "error";
    let dbLatencyMs: number | null = null;
    let dbError: string | null = null;
    let dbTables: number | null = null;

    try {
      const { sql: dbSql } = await import("./db.js");
      const t0 = Date.now();
      const result =
        await dbSql`SELECT COUNT(*) AS total FROM information_schema.tables WHERE table_schema = 'public'`;
      dbLatencyMs = Date.now() - t0;
      dbTables = parseInt(result[0]?.total ?? "0", 10);
      dbStatus = "ok";
    } catch (err: any) {
      dbError = err?.message ?? "unknown error";
    }

    const allOk = dbStatus === "ok";

    res.status(allOk ? 200 : 503).json({
      status: allOk ? "ok" : "error",
      timestamp: now.toISOString(),
      date: now.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      time: now.toLocaleTimeString("pt-BR", { timeZone: "America/Sao_Paulo" }),
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
        publicTables: dbTables,
        ...(dbError ? { error: dbError } : {}),
      },
    });
  });

  // Rota para consultar parentesco por CPF
  app.get("/api/parentesco/:cpf", async (req, res) => {
    try {
      res.setHeader("Content-Type", "application/json");

      const { cpf } = req.params;

      // Validar CPF
      if (!cpf) {
        return res.status(400).json({
          success: false,
          error: "CPF é obrigatório",
        });
      }

      // Limpar CPF removendo caracteres especiais
      const cleanCpf = cpf.replace(/\D/g, "");

      // Validar se o CPF tem 11 dígitos
      if (cleanCpf.length !== 11) {
        return res.status(400).json({
          success: false,
          error: "CPF deve conter 11 dígitos",
        });
      }

      console.log(`Consultando parentesco para CPF: ${cleanCpf}`);

      // Consultar API externa
      const apiUrl = `https://data.workbuscas.com/api/v1/21676eb8-cede-43d9-9edb-6f5fe652890d/cpf/${cleanCpf}`;

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        console.error(
          `Erro na API externa: ${response.status} - ${response.statusText}`,
        );
        return res.status(response.status).json({
          success: false,
          error: `Erro ao consultar dados: ${response.statusText}`,
        });
      }

      const data = await response.json();

      // Verificar se a resposta contém dados válidos
      if (!data || data.status !== 200) {
        return res.status(404).json({
          success: false,
          error: "Dados não encontrados para o CPF informado",
        });
      }

      const dadosContato = data.data;

      // Processar PARENTES (se disponível)
      const parentesData = dadosContato?.parentes || null;
      let parentesProcessados = null;

      if (parentesData && Array.isArray(parentesData)) {
        parentesProcessados = [];

        for (const parente of parentesData) {
          let parenteProcessado = {
            nome: parente.nome || "Não informado",
            cpf: parente.cpf_completo || parente.cpf || null,
            parentesco:
              parente.vinculo ||
              parente.parentesco ||
              parente.grau_parentesco ||
              "Não informado",
            idade: parente.idade || null,
            data_nascimento: parente.data_nascimento || parente.nasc || null,
            genero: parente.sexo || parente.genero || null,
          };

          // Verificar se é filho(a) e tem CPF válido
          const parentescoLower = parenteProcessado.parentesco.toLowerCase();
          const isFilho =
            parentescoLower.includes("filha") ||
            parentescoLower.includes("filho");

          console.log(
            `Analisando parente: ${parenteProcessado.nome} - Parentesco: ${parenteProcessado.parentesco} - CPF: ${parenteProcessado.cpf} - É filho(a): ${isFilho}`,
          );

          if (
            isFilho &&
            parenteProcessado.cpf &&
            parenteProcessado.cpf.length >= 8
          ) {
            try {
              // Limpar CPF do parente
              let cpfParenteLimpo = parenteProcessado.cpf.replace(/\D/g, "");

              // Se o CPF tem menos de 11 dígitos, tentar completar com zeros à esquerda
              if (cpfParenteLimpo.length < 11 && cpfParenteLimpo.length >= 8) {
                cpfParenteLimpo = cpfParenteLimpo.padStart(11, "0");
                console.log(
                  `CPF do filho(a) completado com zeros: ${cpfParenteLimpo}`,
                );
              }

              if (cpfParenteLimpo.length === 11) {
                console.log(
                  `🔍 Consultando dados do filho(a): ${parenteProcessado.nome} - CPF: ${cpfParenteLimpo}`,
                );

                // Consultar API para obter dados do filho(a)
                const apiUrlFilho = `https://data.workbuscas.com/api/v1/21676eb8-cede-43d9-9edb-6f5fe652890d/cpf/${cpfParenteLimpo}`;

                const responseFilho = await fetch(apiUrlFilho, {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                  },
                });

                console.log(
                  `📡 Resposta da API para filho(a) ${parenteProcessado.nome}: Status ${responseFilho.status}`,
                );

                if (responseFilho.ok) {
                  const dataFilho = await responseFilho.json();

                  console.log(`📊 Dados recebidos para filho(a):`, dataFilho);

                  if (dataFilho && dataFilho.status === 200 && dataFilho.data) {
                    const dadosFilho = dataFilho.data;

                    // Extrair data de nascimento
                    if (dadosFilho.nasc) {
                      parenteProcessado.data_nascimento = dadosFilho.nasc;
                      console.log(
                        `✅ Data de nascimento obtida: ${dadosFilho.nasc}`,
                      );
                    }

                    // Extrair gênero
                    if (dadosFilho.sexo) {
                      parenteProcessado.genero = dadosFilho.sexo;
                      console.log(`✅ Gênero obtido: ${dadosFilho.sexo}`);
                    }

                    console.log(
                      `🎯 Dados finais do filho(a) ${parenteProcessado.nome}: nascimento=${parenteProcessado.data_nascimento}, gênero=${parenteProcessado.genero}`,
                    );
                  } else {
                    console.log(
                      `❌ API retornou dados inválidos para ${parenteProcessado.nome}`,
                    );
                  }
                } else {
                  console.log(
                    `❌ Erro HTTP ao consultar dados do filho(a) ${parenteProcessado.nome}: ${responseFilho.status}`,
                  );
                }
              } else {
                console.log(
                  `❌ CPF inválido para ${parenteProcessado.nome}: ${cpfParenteLimpo} (${cpfParenteLimpo.length} dígitos)`,
                );
              }
            } catch (error) {
              console.error(
                `❌ Erro ao consultar CPF do filho(a) ${parenteProcessado.nome}:`,
                error,
              );
            }
          }

          parentesProcessados.push(parenteProcessado);
        }
      }

      console.log(`Dados de parentesco encontrados para CPF ${cleanCpf}:`, {
        parentes: parentesProcessados ? parentesProcessados.length : 0,
      });

      // Retornar apenas dados de parentesco
      if (!parentesProcessados || parentesProcessados.length === 0) {
        return res.json({
          success: true,
          data: {
            cpf: cleanCpf,
            nome: dadosContato?.nome || "Não informado",
            parentes: [],
            total_parentes: 0,
            timestamp: new Date().toISOString(),
          },
        });
      }

      return res.json({
        success: true,
        data: {
          cpf: cleanCpf,
          nome: dadosContato?.nome || "Não informado",
          parentes: parentesProcessados,
          total_parentes: parentesProcessados.length,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Erro ao consultar parentesco:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao consultar parentesco",
      });
    }
  });

  // Rota para consultar locais usando OpenAI e ViaCEP
  app.get("/api/locais/:tipo/:cep", async (req, res) => {
    try {
      const { tipo, cep } = req.params;

      if (!tipo || !cep) {
        return res.status(400).json({
          success: false,
          error: "Tipo de local e CEP são obrigatórios",
        });
      }

      // Validar CEP
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) {
        return res.status(400).json({
          success: false,
          error: "CEP deve ter 8 dígitos",
        });
      }

      // Buscar dados do CEP usando ViaCEP
      const viaCepResponse = await fetch(`https://opencep.com/v1/${cepLimpo}`);
      const cepData = await viaCepResponse.json();

      if (cepData.erro) {
        return res.status(404).json({
          success: false,
          error: "CEP não encontrado",
        });
      }

      // Montar endereço completo
      const enderecoCompleto = `${cepData.logradouro}, ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}`;

      // Estruturar resposta com dados do CEP
      const locaisEncontrados = [
        {
          nome: `${tipo.charAt(0).toUpperCase() + tipo.slice(1)} - ${cepData.localidade}`,
          endereco: enderecoCompleto,
          telefone: "Informação não disponível - Consulte diretamente",
          distancia_estimada: "Região consultada",
          tipo: tipo,
          observacoes: `CEP ${cepLimpo} em ${cepData.bairro}, ${cepData.localidade} - ${cepData.uf}. Para localizar ${tipo} específicos nesta região, recomenda-se busca em mapas online ou contato com órgãos locais.`,
        },
      ];

      // Adicionar tentativa OpenAI em background (opcional)
      let openaiDisponivel = false;
      setTimeout(async () => {
        try {
          console.log(
            `Tentando OpenAI para ${tipo} em ${cepData.localidade}...`,
          );
          // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          const response = await getOpenAI().chat.completions.create({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `Você é um assistente especializado em encontrar locais específicos no Brasil. Responda em JSON: {"locais": [{"nome": "string", "endereco": "string", "telefone": "string", "distancia_estimada": "string", "tipo": "string", "observacoes": "string"}]}`,
              },
              {
                role: "user",
                content: `Encontre ${tipo} em ${cepData.localidade} - ${cepData.uf}, próximo ao CEP ${cepLimpo}. Liste até 3 locais.`,
              },
            ],
            response_format: { type: "json_object" },
            temperature: 0.3,
            max_tokens: 800,
          });
          console.log("OpenAI consulta concluída com sucesso");
        } catch (error) {
          console.log("OpenAI indisponível em background");
        }
      }, 100);

      return res.json({
        success: true,
        data: {
          endereco_consultado: enderecoCompleto,
          cep: cepLimpo,
          cidade: cepData.localidade,
          estado: cepData.uf,
          tipo_local: tipo,
          locais: locaisEncontrados,
          openai_disponivel: openaiDisponivel,
          total_locais: locaisEncontrados.length,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Erro ao consultar locais:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao consultar locais",
      });
    }
  });

  // Rota para enviar SMS extra via Fluxons API
  app.post("/api/sms-extra", async (req, res) => {
    try {
      const { phoneNumber, city, firstName, gender } = req.body;

      const isFemale = gender && gender.toLowerCase() === "feminino";
      // Validar parâmetros obrigatórios
      if (!phoneNumber || !city || !firstName || !gender) {
        return res.status(400).json({
          success: false,
          error:
            "Parâmetros obrigatórios: phoneNumber, city, firstName, gender",
        });
      }

      // Validar formato do telefone (deve conter apenas números)
      const cleanPhoneNumber = phoneNumber.replace(/\D/g, "");
      if (cleanPhoneNumber.length < 10 || cleanPhoneNumber.length > 15) {
        return res.status(400).json({
          success: false,
          error: "Número de telefone deve ter entre 10 e 15 dígitos",
        });
      }

      // Preparar dados para envio — Variante A (sem palavras filtradas por operadoras)
      const smsData = {
        phone: cleanPhoneNumber,
        message: isFemale
          ? `Sra. ${firstName}, sua vaga em ${city} esta reservada por tempo limitado. Conclua o cadastro antes que o prazo expire.`
          : `Sr. ${firstName}, sua vaga em ${city} esta reservada por tempo limitado. Conclua o cadastro antes que o prazo expire.`,
        dontRepeat: true,
      };

      console.log("Enviando SMS via Manager API Direct:", {
        phone: cleanPhoneNumber,
        city: city,
        firstName: firstName,
      });

      // Fazer requisição para API do Fluxons
      const response = await fetch(API_DIRECT_SMS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(smsData),
      });

      const responseText = await response.text();

      if (!response.ok) {
        console.error("Erro na API Direct:", {
          status: response.status,
          statusText: response.statusText,
          response: responseText,
        });

        return res.status(response.status).json({
          success: false,
          error: `Erro na API de SMS: ${response.status} - ${response.statusText}`,
          details: responseText,
        });
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.log("Resposta da API não é JSON válido:", responseText);
        responseData = { message: responseText };
      }

      console.log("SMS enviado com sucesso:", {
        phone: cleanPhoneNumber,
        city: city,
        firstName: firstName,
        response: responseData,
      });

      return res.json({
        success: true,
        data: {
          phoneNumber: cleanPhoneNumber,
          city: city,
          firstName: firstName,
          message: smsData.message,
        },
      });
    } catch (error) {
      console.error("Erro ao enviar SMS:", error);
      return res.status(500).json({
        success: false,
        error: "Erro interno do servidor ao enviar SMS",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      });
    }
  });
  function mapStatusToUtmify(status: string): string {
    const statusMapping: Record<string, string> = {
      pending: "pending",
      "transaction.pending": "pending",
      "transaction.approved": "paid",
      waiting_payment: "pending",
      paid: "paid",
      finished: "paid",
      approved: "paid",
      completed: "paid",
      confirmed: "paid",
      refused: "refused",
      cancelled: "cancelled",
      refunded: "refunded",
      chargedback: "chargedback",
    };

    return statusMapping[status.toLowerCase()] || "waiting_payment";
  }

  // Função para processar webhook de pagamento e enviar para UTMify
  async function processPaymentWebhook(
    paymentData: any,
    req: any,
  ): Promise<{ success: boolean; message: string }> {
    console.log(
      `📥 Dados recebidos para processamento: ${JSON.stringify(paymentData, null, 2)}`,
    );

    // Verificar se o status é de pagamento confirmado (ignorar outros status)
    const status = paymentData.status?.toLowerCase() || "";
    if (
      !["paid", "approved", "completed", "confirmed", "pending"].includes(
        status,
      )
    ) {
      console.log(`⏭️ Status ignorado: ${status}`);
      return {
        success: true,
        message: `Status ignorado: ${status}`,
      };
    }

    try {
      // Dados básicos da transação
      const transactionId = paymentData.orderId || paymentData.id;
      if (!transactionId) {
        throw new Error("ID da transação não encontrado nos dados");
      }

      // Verificar se temos as datas
      const createdAt = paymentData.createdAt;
      const paidAt = paymentData.paidAt || paymentData.approvedDate;

      // Dados do cliente
      const customer = paymentData.customer || {};
      const customerName = customer.name || "";
      const customerEmail = customer.email || "";

      // Tentar obter o CPF de diferentes locais possíveis na estrutura
      let customerDocument = "";

      if (customer?.document?.number) {
        customerDocument = customer.document.number || "";
      } else if (customer.document_number) {
        if (typeof customer.document === "object") {
          customerDocument = customer.document.number || "";
        } else {
          customerDocument = customer.document_number || "";
        }
      }

      // Produtos/itens
      console.log(
        `🛒 Itens do pagamento: ${JSON.stringify(paymentData.items, null, 2)}`,
      );
      const items = paymentData.items || [];
      const products = [];

      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const product = {
            id:
              Math.floor(Math.random() * 1000000) +
              1 +
              Math.floor(Math.random() * 1000000) +
              1,
            name: item.title || item.name || "Produto",
            planId: null,
            planName: null,
            quantity: item.quantity || 1,
            priceInCents: item.total_amount_cents || item.unitPrice || 0,
          };
          products.push(product);
        }
      } else {
        // Se não houver itens, criar um produto padrão
        const productName =
          paymentData.productName || "Mounjaro (Tirzepatida) 5mg";
        let productPrice = paymentData.amount || 0;
        if (typeof productPrice === "string") {
          try {
            productPrice = Math.round(parseFloat(productPrice) * 100);
          } catch {
            productPrice = 0;
          }
        }

        products.push({
          id: `prod_${transactionId}`,
          name: productName,
          planId: null,
          planName: null,
          quantity: 1,
          priceInCents: productPrice,
        });
      }

      // Parâmetros de rastreamento (UTM)
      const utmParams = paymentData.trackingParameters || {};

      // Informações de comissão/taxas
      let amount = paymentData.amount || 0;
      if (typeof amount === "string") {
        try {
          amount = Math.round(parseFloat(amount) * 100);
        } catch {
          amount = 0;
        }
      }

      const fees = paymentData.fee || {};
      const fixedFee = fees.fixedAmount || fees.total_amount_cents || 0;

      // Preparar os dados para envio à Utmify
      const utmifyData = {
        orderId:
          "PAYMENT" +
          transactionId.replace(/\D/g, "") +
          transactionId.replace(/\D/g, ""),
        platform: "NovaEra",
        paymentMethod: "pix",
        status:
          paymentData.status?.toLowerCase() === "pending"
            ? "waiting_payment"
            : "paid",
        createdAt: createdAt,
        approvedDate: paidAt ?? null,
        refundedAt: null,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: null,
          document: customerDocument,
          country: "BR",
          ip:
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.headers["x-real-ip"] ||
            req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
            "unknown",
        },
        products: products,
        trackingParameters: {
          src: utmParams.src ?? null,
          sck: utmParams.sck ?? null,
          utm_source: utmParams.utm_source ?? null,
          utm_campaign: utmParams.utm_campaign ?? null,
          utm_medium: utmParams.utm_medium ?? null,
          utm_content: utmParams.utm_content ?? null,
          utm_term: utmParams.utm_term ?? null,
          xcod: utmParams.xcod ?? null,
          fbclid: utmParams.fbclid ?? null,
          gclid: utmParams.gclid ?? null,
          ttclid: utmParams.ttclid ?? null,
        },
        commission: {
          totalPriceInCents: amount,
          gatewayFeeInCents: fixedFee,
          userCommissionInCents: amount - fixedFee,
        },
        isTest: false,
      };

      console.log(
        `📤 Dados formatados para Utmify: ${JSON.stringify(utmifyData, null, 2)}`,
      );

      // Enviar para UTMify
      const utmifyApiUrl =
        process.env.UTMIFY_API_URL ||
        "https://api.utmify.com.br/api-credentials/orders";
      const utmifyToken = process.env.UTMIFY_TOKEN;

      if (!utmifyToken) {
        throw new Error(
          "UTMIFY_TOKEN não configurado nas variáveis de ambiente",
        );
      }

      const headers = {
        "Content-Type": "application/json",
        "x-api-token": utmifyToken,
        "x-api-key": utmifyToken,
      };

      console.log(`📡 Enviando requisição para Utmify: ${utmifyApiUrl}`);

      const response = await axios.post(utmifyApiUrl, utmifyData, { headers });
      console.log(response.data);
      console.log(
        `✅ Resposta da API Utmify - Status: ${response.status}, Resposta: ${JSON.stringify(response.data)}`,
      );

      if (response.status === 200) {
        return {
          success: true,
          message: "Dados enviados com sucesso para Utmify",
        };
      } else {
        console.error(
          `❌ Erro na API Utmify. HTTP Code: ${response.status}, Resposta: ${JSON.stringify(response.data)}`,
        );
        return {
          success: false,
          message: `Erro na API Utmify. HTTP Code: ${response.status}`,
        };
      }
    } catch (error: any) {
      console.error(`❌ Erro ao enviar para Utmify: ${error.message}`);
      return {
        success: false,
        message: `Erro ao enviar dados para Utmify: ${error.message}`,
      };
    }
  }

  app.post("/api/utmify/novaera", async (req, res) => {
    try {
      // Obter dados JSON da requisição
      const webhookData = req.body.data;

      if (!webhookData) {
        console.error("Nenhum dado JSON recebido no webhook");
        return res.status(400).json({
          error: "Nenhum dado JSON fornecido",
        });
      }

      console.log(
        `📥 Webhook UTMify recebido: ${JSON.stringify(webhookData, null, 2)}`,
      );

      // Extrair dados principais da transação
      const transactionData = webhookData || {};

      if (!transactionData) {
        console.error("Campo 'data' não encontrado no webhook");
        return res.status(400).json({
          error: "Campo data não encontrado",
        });
      }

      // Extrair e parsear metadata que contém os UTMs
      const metadataStr = transactionData.metadata || "{}";
      let utmMetadata: any = {};

      try {
        utmMetadata =
          typeof metadataStr === "string"
            ? JSON.parse(metadataStr)
            : metadataStr;
      } catch (e) {
        console.warn(`Erro ao parsear metadata: ${e}, usando objeto vazio`);
        utmMetadata = {};
      }

      console.log(`📊 UTM metadata extraída: ${JSON.stringify(utmMetadata)}`);

      // Mapear dados para o formato compatível com process_payment_webhook
      const paymentData = {
        id: String(transactionData.id),
        orderId: String(transactionData.id),
        status: mapStatusToUtmify(webhookData.status || "pending"),
        createdAt: transactionData.createdAt,
        paidAt: transactionData.paidAt,
        amount: transactionData.amount || 0,
        customer: webhookData.customer || {},
        items: webhookData.items || [],
        fee: transactionData.fee || {},
        trackingParameters: {
          utm_source: utmMetadata.utm_source,
          utm_medium: utmMetadata.utm_medium,
          utm_campaign: utmMetadata.utm_campaign,
          utm_content: utmMetadata.utm_content,
          utm_term: utmMetadata.utm_term,
          fbclid: utmMetadata.fbclid,
          gclid: utmMetadata.gclid,
          src: utmMetadata.src,
          sck: utmMetadata.sck,
          clickid: utmMetadata.clickid ?? utmMetadata.rtkclickid ?? null,
          red_url: utmMetadata.red_url ?? null,
          rt_phone: utmMetadata.rt_phone ?? null,
          rt_gender: utmMetadata.rt_gender ?? null,
          rt_birthday: utmMetadata.rt_birthday ?? null,
          rt_zipcode: utmMetadata.rt_zipcode ?? null,
        },
      };

      console.log(
        `📤 Dados mapeados para UTMify: ${JSON.stringify(paymentData, null, 2)}`,
      );

      // Processar usando a função existente
      const result = await processPaymentWebhook(paymentData, req);

      if (result.success) {
        console.log(
          `✅ Dados enviados com sucesso para UTMify: ${result.message}`,
        );

        // SMS — fire-and-forget, totalmente isolado da resposta
        // O item do webhook UTMify traz o nome do produto em "title" (ex: "MATO1"),
        // não em "name" — "name" não existe nesse payload e sempre resultava em
        // undefined, fazendo o fallback pro orderId (numérico, sem keyword nenhuma).
        const webhookItemName =
          webhookData.items?.[0]?.title ??
          webhookData.items?.[0]?.name ??
          String(paymentData.orderId);

        processSmsNotification({
          phone: webhookData.customer?.phone ?? "",
          name: webhookData.customer?.name ?? "",
          status: webhookData.status ?? "pending",
          email: webhookData.customer?.email ?? "",
          productName: webhookItemName,
        }).catch((err) =>
          console.warn("[SMS] Falha silenciosa no envio:", err),
        );

        // Lead externo — fire-and-forget, totalmente isolado da resposta
        const leadCpfRaw = webhookData.customer?.document;

        return res.status(200).json({
          success: true,
          message: "Webhook processado e enviado para UTMify com sucesso",
          utmify_result: result,
        });
      } else {
        console.error(`❌ Erro ao enviar para UTMify: ${result.message}`);
        return res.status(500).json({
          success: false,
          message: "Erro ao processar webhook",
          error: result.message,
        });
      }
    } catch (error: any) {
      console.error(`❌ Erro geral no webhook UTMify: ${error.message}`);
      return res.status(500).json({
        success: false,
        message: "Erro interno do servidor",
        error: error.message,
      });
    }
  });

  // ── /api/registrered-domains ──────────────────────────────────────────────
  app.get("/api/registrered-domains", (_req, res) => {
    const seen = new Set<string>();
    const result = Object.entries(DOMAIN_TRACKING)
      .filter(([host, cfg]) => {
        if (seen.has(cfg.domain)) return false;
        seen.add(cfg.domain);
        return !host.startsWith("www.");
      })
      .map(([, cfg]) => {
        const company = COMPANY_DATA[cfg.domain] ?? null;
        return {
          domain: cfg.domain,
          homepageKey: cfg.homepageKey,
          siteName: cfg.siteName,
          title: cfg.title,
          description: cfg.description,
          faviconPath: cfg.faviconPath,
          clarityId: cfg.clarityId,
          gtagId: cfg.gtagId ?? null,
          utmifyPixelId: cfg.utmifyPixelId ?? null,
          analyticsCore: cfg.analyticsCore,
          company: company
            ? {
                brand: company.brand,
                razaoSocial: company.razaoSocial,
                cnpj: company.cnpj,
                address: company.address,
                postalCode: company.postalCode,
                emailContato: company.emailContato,
                phone: company.phone,
                city: company.city,
                stateCode: company.stateCode,
              }
            : null,
        };
      });

    res.json({ total: result.length, domains: result });
  });

  const httpServer = createServer(app);
  return httpServer;
}
