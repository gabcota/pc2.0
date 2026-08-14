import { readFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { variants as bundledVariants } from "./dp-registry";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

function loadVariants(): string[] {
  try {
    const jsonPath = path.resolve(__dirname, "dp-variants.json");
    if (existsSync(jsonPath)) {
      const data = JSON.parse(readFileSync(jsonPath, "utf-8"));
      if (Array.isArray(data) && data.length > 0) {
        console.log(`[dp] ${data.length} variantes carregadas do runtime JSON`);
        return data;
      }
    }
  } catch {}
  console.log(`[dp] ${bundledVariants.length} variantes carregadas do bundle`);
  return bundledVariants;
}

const variants = loadVariants();

export function getRandomVariantCode(): string {
  if (!variants || variants.length === 0) return "";
  return variants[Math.floor(Math.random() * variants.length)];
}
