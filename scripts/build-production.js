#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import obfuscatorPkg from 'javascript-obfuscator';
import { minify } from 'html-minifier-terser';
const { obfuscate } = obfuscatorPkg;
import postcss from 'postcss';
import postcssRenamePkg from 'postcss-rename';
const postcssRename = postcssRenamePkg.default || postcssRenamePkg;
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Iniciando build de produção com proteção anti-clonagem...');

// Função para gerar hash aleatório
function generateRandomHash(length = 8) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

// Função para obfuscar nomes de classes CSS
function obfuscateClassName(originalName) {
  const prefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = generateRandomHash(6);
  return `${randomPrefix}${randomSuffix}`;
}

// Mapa de classes originais para obfuscadas
const classNameMap = new Map();

// Plugin personalizado para renomear classes CSS
const customRenamePlugin = postcssRename({
  strategy: (name, node) => {
    // Pula classes que começam com prefixos específicos do framework
    if (name.startsWith('radix-') || name.startsWith('data-') || name.startsWith('sr-') || 
        name.includes('state-') || name.includes('orientation-') || name.includes('side-')) {
      return name;
    }
    
    if (!classNameMap.has(name)) {
      classNameMap.set(name, obfuscateClassName(name));
    }
    return classNameMap.get(name);
  },
  by: 'class'
});

async function buildProject() {
  try {
    // 1. Limpar diretório de build anterior
    console.log('🧹 Limpando build anterior...');
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
    }

    // 2. Build inicial com Vite
    console.log('⚡ Executando build do Vite...');
    execSync('npm run build', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    // 3. Processar arquivos CSS para obfuscar classes
    console.log('🎨 Obfuscando classes CSS...');
    const cssFiles = [];
    
    function findCSSFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findCSSFiles(filePath);
        } else if (file.endsWith('.css')) {
          cssFiles.push(filePath);
        }
      });
    }
    
    findCSSFiles(path.join(rootDir, 'dist/public'));
    
    // Processar cada arquivo CSS
    for (const cssFile of cssFiles) {
      const css = fs.readFileSync(cssFile, 'utf8');
      const result = await postcss([customRenamePlugin]).process(css, { from: cssFile });
      fs.writeFileSync(cssFile, result.css);
    }

    // 4. Obfuscar arquivos JavaScript
    console.log('🔒 Obfuscando código JavaScript...');
    const jsFiles = [];
    
    function findJSFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findJSFiles(filePath);
        } else if (file.endsWith('.js') && !file.includes('.min.')) {
          jsFiles.push(filePath);
        }
      });
    }
    
    findJSFiles(path.join(rootDir, 'dist/public'));
    
    // Configuração de obfuscação JavaScript
    const obfuscationOptions = {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.8,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 2000,
      disableConsoleOutput: true,
      identifierNamesGenerator: 'hexadecimalNumber',
      log: false,
      numbersToExpressions: true,
      renameGlobals: false,
      selfDefending: true,
      simplify: true,
      splitStrings: true,
      splitStringsChunkLength: 8,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayEncoding: ['base64'],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 2,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 4,
      stringArrayWrappersType: 'function',
      stringArrayThreshold: 0.8,
      transformObjectKeys: true,
      unicodeEscapeSequence: false
    };

    // Processar cada arquivo JS
    for (const jsFile of jsFiles) {
      const jsContent = fs.readFileSync(jsFile, 'utf8');
      
      // Substituir nomes de classes CSS no JavaScript
      let modifiedContent = jsContent;
      for (const [original, obfuscated] of classNameMap.entries()) {
        const regex = new RegExp(`['"\`]${original}['"\`]`, 'g');
        modifiedContent = modifiedContent.replace(regex, `"${obfuscated}"`);
        
        // Também substituir em template strings e concatenações
        const regexTemplate = new RegExp(`\\b${original}\\b`, 'g');
        modifiedContent = modifiedContent.replace(regexTemplate, obfuscated);
      }
      
      // Obfuscar o código JavaScript
      const obfuscatedResult = obfuscate(modifiedContent, obfuscationOptions);
      fs.writeFileSync(jsFile, obfuscatedResult.getObfuscatedCode());
    }

    // 5. Minificar arquivos HTML
    console.log('📄 Minificando arquivos HTML...');
    const htmlFiles = [];
    
    function findHTMLFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findHTMLFiles(filePath);
        } else if (file.endsWith('.html')) {
          htmlFiles.push(filePath);
        }
      });
    }
    
    findHTMLFiles(path.join(rootDir, 'dist/public'));
    
    // Configuração de minificação HTML
    const htmlMinifyOptions = {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      useShortDoctype: true,
      minifyCSS: true,
      minifyJS: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      removeOptionalTags: true,
      sortAttributes: true,
      sortClassName: true
    };

    // Processar cada arquivo HTML
    for (const htmlFile of htmlFiles) {
      let htmlContent = fs.readFileSync(htmlFile, 'utf8');
      
      // Substituir nomes de classes CSS no HTML
      for (const [original, obfuscated] of classNameMap.entries()) {
        const regex = new RegExp(`class=["']([^"']*)\\b${original}\\b([^"']*)["']`, 'g');
        htmlContent = htmlContent.replace(regex, (match, before, after) => {
          const newClasses = `${before}${obfuscated}${after}`.trim();
          return `class="${newClasses}"`;
        });
      }
      
      // Minificar HTML
      const minifiedHtml = await minify(htmlContent, htmlMinifyOptions);
      fs.writeFileSync(htmlFile, minifiedHtml);
    }

    // 6. Adicionar comentários falsos e código morto
    console.log('🎭 Adicionando proteções adicionais...');
    
    // Criar arquivo de mapeamento de classes (para desenvolvimento, não incluir em produção)
    const mappingFile = path.join(rootDir, 'class-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(Object.fromEntries(classNameMap), null, 2));
    console.log(`📝 Mapeamento de classes salvo em: ${mappingFile}`);
    console.log('⚠️  IMPORTANTE: NÃO inclua este arquivo no deploy de produção!');

    // 7. Criar arquivo de integridade
    console.log('🔐 Gerando checksums de integridade...');
    const integrityData = {
      buildDate: new Date().toISOString(),
      version: generateRandomHash(16),
      files: {}
    };

    function generateFileHashes(dir, basePath = '') {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const relativePath = path.join(basePath, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          generateFileHashes(filePath, relativePath);
        } else if (!file.includes('integrity.json')) {
          const content = fs.readFileSync(filePath);
          const hash = crypto.createHash('sha256').update(content).digest('hex');
          integrityData.files[relativePath.replace(/\\/g, '/')] = hash;
        }
      });
    }
    
    generateFileHashes(path.join(rootDir, 'dist/public'));
    fs.writeFileSync(
      path.join(rootDir, 'dist/public/integrity.json'),
      JSON.stringify(integrityData, null, 2)
    );

    console.log('✅ Build de produção concluído com sucesso!');
    console.log('📊 Estatísticas:');
    console.log(`   - Classes CSS obfuscadas: ${classNameMap.size}`);
    console.log(`   - Arquivos JavaScript obfuscados: ${jsFiles.length}`);
    console.log(`   - Arquivos HTML minificados: ${htmlFiles.length}`);
    console.log(`   - Arquivos CSS processados: ${cssFiles.length}`);
    console.log('🛡️  Proteções aplicadas:');
    console.log('   - Obfuscação de classes CSS');
    console.log('   - Obfuscação de código JavaScript');
    console.log('   - Minificação de HTML/CSS');
    console.log('   - Proteção anti-debug');
    console.log('   - Embaralhamento de strings');
    console.log('   - Verificação de integridade');

  } catch (error) {
    console.error('❌ Erro durante o build:', error);
    process.exit(1);
  }
}

buildProject();