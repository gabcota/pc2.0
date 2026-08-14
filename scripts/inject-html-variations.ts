import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(ROOT, "dist/public");
const CLIENT = path.resolve(ROOT, "client");

const VARIATIONS: Array<{ source: string; dest: string }> = fs
  .readdirSync(CLIENT)
  .filter(f => /^google_\d+\.html$/.test(f))
  .sort((a, b) => {
    const n = (s: string) => parseInt(s.match(/\d+/)![0]);
    return n(a) - n(b);
  })
  .map(f => ({ source: f, dest: f }));

function extractBuiltStylesheets(html: string): string {
  const tags: string[] = [];
  const re = /<link[^>]+rel=["']stylesheet["'][^>]*\/?>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) tags.push(m[0]);
  return tags.join("\n    ");
}

function extractBuiltModuleScripts(html: string): string {
  const tags: string[] = [];
  const re = /<script\s[^>]*type=["']module["'][^>]*><\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) tags.push(m[0]);
  return tags.join("\n    ");
}

function extractSourceHead(html: string): string {
  const m = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (!m) return "";
  return m[1]
    .replace(/<script\s[^>]*type=["']module["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();
}

function extractSourceBody(html: string): string {
  const m = html.match(/<body>([\s\S]*?)<\/body>/i);
  if (!m) return '<div id="root"></div>';
  return m[1]
    .replace(/<script\s[^>]*type=["']module["'][^>]*>[\s\S]*?<\/script>/gi, "")
    .trim();
}

function extractHtmlAttrs(html: string): string {
  const m = html.match(/<html([^>]*)>/i);
  return m ? m[1] : ' lang="pt-BR"';
}

function run(): void {
  const variation = process.env.VITE_GOOGLE_VARIATION ?? "(não definida)";
  console.log(`[html-inject] VITE_GOOGLE_VARIATION=${variation}`);

  const indexPath = path.join(DIST, "index.html");
  if (!fs.existsSync(indexPath)) {
    console.error("[html-inject] ✗ dist/public/index.html não encontrado — rode o build antes.");
    process.exit(1);
  }

  const builtHtml = fs.readFileSync(indexPath, "utf-8");
  const builtStylesheets = extractBuiltStylesheets(builtHtml);
  const builtModuleScripts = extractBuiltModuleScripts(builtHtml);
  console.log(`[html-inject] base: index.html (${(builtHtml.length / 1024).toFixed(1)} KB)`);

  let generated = 0;

  for (const { source, dest } of VARIATIONS) {
    const sourcePath = path.join(CLIENT, source);
    if (!fs.existsSync(sourcePath)) {
      console.warn(`[html-inject] ⚠  ${source} não encontrado — ignorando`);
      continue;
    }

    const sourceHtml = fs.readFileSync(sourcePath, "utf-8");
    const htmlAttrs   = extractHtmlAttrs(sourceHtml);
    const sourceHead  = extractSourceHead(sourceHtml);
    const sourceBody  = extractSourceBody(sourceHtml);

    const titleMatch = sourceHtml.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : "(sem título)";

    const output = `<!DOCTYPE html>
<html${htmlAttrs}>
  <head>
    ${sourceHead}
    ${builtStylesheets}
  </head>
  <body>
    ${sourceBody}
    ${builtModuleScripts}
  </body>
</html>`;

    fs.writeFileSync(path.join(DIST, dest), output, "utf-8");
    console.log(`[html-inject] ✓ ${dest} → "${title}" (${(output.length / 1024).toFixed(1)} KB)`);
    generated++;
  }

  console.log(`[html-inject] ✓ ${generated} variações geradas em dist/public/`);
}

run();
