import { createHash } from "crypto";
import { writeFileSync, mkdirSync, existsSync, rmSync } from "fs";
import path from "path";
import { getFraseAleatoria, getFraseAleatoriaUmIdioma } from "./random";

const REGISTRY_TS   = path.resolve("server/dp-registry.ts");
const REGISTRY_JSON = path.resolve("dist/dp-variants.json");
const N = 120;

function uid(): string {
  return Math.random().toString(36).slice(2, 7);
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── #3: String obfuscation ───────────────────────────────────────────────
function obfStr(s: string): string {
  const mode = Math.floor(Math.random() * 4);
  if (mode === 1) return `atob("${Buffer.from(s).toString("base64")}")`;
  if (mode === 2) {
    const codes = [...s].map(c => c.charCodeAt(0)).join(",");
    return `[${codes}].map(function(c){return String.fromCharCode(c)}).join("")`;
  }
  if (mode === 3 && s.length > 1) {
    const mid = Math.ceil(s.length / 2);
    return `"${s.slice(0, mid)}"+"${s.slice(mid)}"`;
  }
  return `"${s}"`;
}

// ── #5: Score addition as statement ─────────────────────────────────────
function scoreAdd(v: string, n: number): string {
  const opts: string[] = [
    `${v}+=${n};`,
    `${v}=${v}+${n};`,
    `${v}=(${v}+${n});`,
  ];
  if (n === 1) opts.push(`++${v};`);
  if (n === 2) opts.push(`${v}+=(1<<1);`);
  if (n === 3) opts.push(`${v}+=(1<<1)+1;`);
  if (n > 1)   opts.push(`${v}=Math.max(${v},${v})+${n};`);
  return pick(opts);
}

// ── Signal pools ─────────────────────────────────────────────────────────

function webdriverChecks(v: string): string[] {
  const k = uid();
  return [
    `if(navigator.webdriver===true){${scoreAdd(v,3)}}`,
    `if(navigator[${obfStr("webdriver")}]){${scoreAdd(v,3)}}`,
    `{var _${k}=${obfStr("webdriver")};if(navigator[_${k}]){${scoreAdd(v,3)}}}`,
    `${v}+=navigator.webdriver?3:0;`,
    `if(window.navigator.webdriver){${scoreAdd(v,3)}}`,
    `if(navigator.webdriver==true){${scoreAdd(v,3)}}`,
  ];
}

function pluginsChecks(v: string): string[] {
  const k = uid();
  return [
    `if((navigator.plugins?.length??0)<1){${scoreAdd(v,1)}}`,
    `if(navigator[${obfStr("plugins")}]&&!navigator[${obfStr("plugins")}].length){${scoreAdd(v,1)}}`,
    `{var _${k}=navigator.plugins;if(!_${k}||!_${k}.length){${scoreAdd(v,1)}}}`,
    `if((navigator.plugins||[]).length===0){${scoreAdd(v,1)}}`,
    `if(!(navigator.plugins&&navigator.plugins[0])){${scoreAdd(v,1)}}`,
  ];
}

function langEmptyChecks(v: string): string[] {
  const k = uid();
  return [
    `if(!navigator.languages||navigator.languages.length===0){${scoreAdd(v,2)}}`,
    `if(navigator[${obfStr("languages")}]&&!navigator[${obfStr("languages")}].length){${scoreAdd(v,2)}}`,
    `{var _${k}=navigator.languages;if(!_${k}||!_${k}.length){${scoreAdd(v,2)}}}`,
    `if((navigator.languages??[]).length<1){${scoreAdd(v,2)}}`,
  ];
}

function langInconsistentChecks(v: string): string[] {
  const k1 = uid(); const k2 = uid();
  return [
    `if(navigator.language&&navigator.languages?.length&&!Array.from(navigator.languages).includes(navigator.language)){${scoreAdd(v,1)}}`,
    `{var _${k1}=navigator.language,_${k2}=Array.from(navigator.languages||[]);if(_${k1}&&_${k2}.length&&!_${k2}.includes(_${k1})){${scoreAdd(v,1)}}}`,
    `if(navigator.language&&(navigator.languages||[]).length>0&&![].slice.call(navigator.languages).includes(navigator.language)){${scoreAdd(v,1)}}`,
  ];
}

function screenZeroChecks(v: string): string[] {
  return [
    `if(screen.width===0||screen.height===0){${scoreAdd(v,2)}}`,
    `if(screen.width<1||screen.height<1){${scoreAdd(v,2)}}`,
    `if(screen.width*screen.height===0){${scoreAdd(v,2)}}`,
  ];
}

function screenMatchChecks(v: string): string[] {
  return [
    `if(screen.width===window.innerWidth&&screen.height===window.innerHeight){${scoreAdd(v,1)}}`,
    `if(screen.width==window.innerWidth&&screen.height==window.innerHeight){${scoreAdd(v,1)}}`,
    `if(!(screen.width-window.innerWidth)&&!(screen.height-window.innerHeight)){${scoreAdd(v,1)}}`,
  ];
}

// ── #2: New signals ──────────────────────────────────────────────────────

function headlessUAChecks(v: string): string[] {
  const k = uid();
  return [
    `if(navigator.userAgent.indexOf(${obfStr("HeadlessChrome")})>-1){${scoreAdd(v,2)}}`,
    `if(new RegExp(${obfStr("HeadlessChrome")}).test(navigator.userAgent)){${scoreAdd(v,2)}}`,
    `{var _${k}=navigator.userAgent;if(_${k}.includes&&_${k}.includes(${obfStr("HeadlessChrome")})){${scoreAdd(v,2)}}}`,
  ];
}

function webdriverAttrChecks(v: string): string[] {
  const k = uid();
  return [
    `if(document.documentElement.getAttribute(${obfStr("webdriver")})){${scoreAdd(v,2)}}`,
    `if(document.documentElement.hasAttribute(${obfStr("webdriver")})){${scoreAdd(v,2)}}`,
    `{var _${k}=document.documentElement;if(_${k}&&_${k}.getAttribute(${obfStr("webdriver")})){${scoreAdd(v,2)}}}`,
  ];
}

function phantomChecks(v: string): string[] {
  const k1 = uid(); const k2 = uid();
  return [
    `if(window[${obfStr("callPhantom")}]||window[${obfStr("_phantom")}]){${scoreAdd(v,3)}}`,
    `if(typeof window.callPhantom!=="undefined"){${scoreAdd(v,3)}}`,
    `{var _${k1}=${obfStr("callPhantom")},_${k2}=${obfStr("_phantom")};if(window[_${k1}]||window[_${k2}]){${scoreAdd(v,3)}}}`,
  ];
}

function bufferLeakChecks(v: string): string[] {
  const k = uid();
  return [
    `if(typeof window[${obfStr("Buffer")}]!=="undefined"){${scoreAdd(v,2)}}`,
    `if(typeof Buffer!=="undefined"&&typeof window!=="undefined"){${scoreAdd(v,2)}}`,
    `{var _${k}=${obfStr("Buffer")};if(typeof window[_${k}]!=="undefined"){${scoreAdd(v,2)}}}`,
  ];
}

function outerSizeChecks(v: string): string[] {
  return [
    `if(window.outerWidth===0||window.outerHeight===0){${scoreAdd(v,1)}}`,
    `if(window.outerWidth<1||window.outerHeight<1){${scoreAdd(v,1)}}`,
    `if(window.outerWidth*window.outerHeight===0){${scoreAdd(v,1)}}`,
  ];
}

// ── Dead code ────────────────────────────────────────────────────────────
function pickDead(): string {
  const fns: Array<() => string> = [
    () => `var _${uid()}=typeof window!=="undefined"?1:0;`,
    () => `const _${uid()}=navigator.vendor||"";`,
    () => `let _${uid()}=Date.now();`,
    () => `var _${uid()}=screen.colorDepth||24;`,
    () => `const _${uid()}=navigator[${obfStr("platform")}]||"";`,
    () => `let _${uid()}=window.devicePixelRatio||1;`,
    () => `var _${uid()}=document.cookie.length;`,
    () => `const _${uid()}=navigator[${obfStr("vendor")}]||"";`,
    () => `var _${uid()}=window[${obfStr("innerWidth")}]||0;`,
    () => `let _${uid()}=document[${obfStr("readyState")}]||"";`,
    () => `var _${uid()}=screen.pixelDepth||24;`,
    () => `const _${uid()}=window.history.length||0;`,
  ];
  const n = 1 + Math.floor(Math.random() * 2);
  return fns.sort(() => Math.random() - 0.5).slice(0, n).map(f => f()).join("");
}

// ── #4: IIFE wrappers ────────────────────────────────────────────────────
function wrapIIFE(body: string): string {
  const patterns: Array<(b: string) => string> = [
    (b) => `(function(){${b}})();`,
    (b) => `(()=>{${b}})();`,
    (b) => `!function(){${b}}();`,
    (b) => `void function(){${b}}();`,
    (b) => `;(function(w,d){${b}})(window,document);`,
  ];
  return pick(patterns)(body);
}

// ── Variant assembly ─────────────────────────────────────────────────────
function generateVariant(): string {
  const v = `_${uid()}`;

  const signalGroups = [
    webdriverChecks(v),        // always include (strongest signal)
    pluginsChecks(v),          // always include
    langEmptyChecks(v),        // always include
    langInconsistentChecks(v), // always include
    screenZeroChecks(v),
    screenMatchChecks(v),
    headlessUAChecks(v),       // #2
    webdriverAttrChecks(v),    // #2
    phantomChecks(v),          // #2
    bufferLeakChecks(v),       // #2
    outerSizeChecks(v),        // #2
  ];

  // Core 4 always present; pick 2-4 extra from the remaining
  const core    = signalGroups.slice(0, 4).map(g => pick(g));
  const extras  = signalGroups.slice(4).sort(() => Math.random() - 0.5)
                              .slice(0, 2 + Math.floor(Math.random() * 3))
                              .map(g => pick(g));
  const checks  = [...core, ...extras].sort(() => Math.random() - 0.5);

  const body = [
    pickDead(),
    `var ${v}=0;`,
    ...checks,
    pickDead(),
    `window.__dp_score=${v};`,
    `window.__dp_frase="${getFraseAleatoriaUmIdioma().texto}";`
  ].join("");

  return wrapIIFE(body);
}

// ── Generate N unique variants ───────────────────────────────────────────
const variants: string[] = [];
const seen = new Set<string>();

let attempts = 0;
while (variants.length < N && attempts < N * 20) {
  attempts++;
  const code = generateVariant();
  const hash = createHash("sha1").update(code).digest("hex").slice(0, 8);
  if (!seen.has(hash)) {
    seen.add(hash);
    variants.push(code);
  }
}

// ── Write server/dp-registry.ts (bundled fallback) ───────────────────────
const tsContent = [
  "// AUTO-GENERATED — não edite manualmente. Rode: tsx scripts/generate-detection-variants.ts",
  `export const variants: string[] = [`,
  ...variants.map(v => `  ${JSON.stringify(v)},`),
  `];`,
].join("\n");
writeFileSync(REGISTRY_TS, tsContent, "utf-8");
console.log(`[dp-gen] ✓ ${variants.length} variantes → server/dp-registry.ts (bundle)`);

// ── Write dist/dp-variants.json (runtime — lido fresh a cada deploy) ─────
try {
  if (!existsSync(path.resolve("dist"))) mkdirSync(path.resolve("dist"), { recursive: true });
  writeFileSync(REGISTRY_JSON, JSON.stringify(variants), "utf-8");
  console.log(`[dp-gen] ✓ dist/dp-variants.json (runtime)`);
} catch {
  console.warn(`[dp-gen] ⚠ dist/dp-variants.json não gravado — bundle será usado`);
}

// ── Remove arquivos legados ──────────────────────────────────────────────
const legacyIndex = path.resolve("server/dp-index.json");
const legacyDir   = path.resolve("client/public/dp");
if (existsSync(legacyIndex)) rmSync(legacyIndex);
if (existsSync(legacyDir))   rmSync(legacyDir, { recursive: true });
