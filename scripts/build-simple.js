#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Iniciando build de produção simplificado...');

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

async function buildProject() {
  try {
    // 1. Limpar diretório de build anterior
    console.log('🧹 Limpando build anterior...');
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
    }

    // 2. Build inicial com Vite usando configuração de produção
    console.log('⚡ Executando build do Vite com configurações de produção...');
    execSync('vite build --config vite.config.production.ts && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    // 3. Obfuscar classes CSS nos arquivos
    console.log('🎨 Obfuscando classes CSS...');
    const cssFiles = [];
    const jsFiles = [];
    const htmlFiles = [];
    
    function findFiles(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          findFiles(filePath);
        } else {
          if (file.endsWith('.css')) cssFiles.push(filePath);
          if (file.endsWith('.js') && !file.includes('.min.')) jsFiles.push(filePath);
          if (file.endsWith('.html')) htmlFiles.push(filePath);
        }
      });
    }
    
    findFiles(path.join(rootDir, 'dist/public'));
    
    // Processar arquivos CSS para criar mapeamento de classes
    for (const cssFile of cssFiles) {
      const css = fs.readFileSync(cssFile, 'utf8');
      
      // Extrair classes CSS (simplificado)
      const classMatches = css.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g);
      if (classMatches) {
        classMatches.forEach(match => {
          const className = match.substring(1); // Remove o ponto
          
          // Pular classes do sistema
          if (className.startsWith('radix-') || className.startsWith('data-') || 
              className.includes('state-') || className.includes('orientation-')) {
            return;
          }
          
          if (!classNameMap.has(className)) {
            classNameMap.set(className, obfuscateClassName(className));
          }
        });
      }
      
      // Substituir classes no CSS
      let modifiedCSS = css;
      for (const [original, obfuscated] of classNameMap.entries()) {
        const regex = new RegExp(`\\.${original}\\b`, 'g');
        modifiedCSS = modifiedCSS.replace(regex, `.${obfuscated}`);
      }
      
      fs.writeFileSync(cssFile, modifiedCSS);
    }

    // 4. Substituir nomes de classes nos arquivos JavaScript
    console.log('🔒 Processando arquivos JavaScript...');
    for (const jsFile of jsFiles) {
      let jsContent = fs.readFileSync(jsFile, 'utf8');
      
      // Substituir nomes de classes CSS no JavaScript
      for (const [original, obfuscated] of classNameMap.entries()) {
        const patterns = [
          `"${original}"`,
          `'${original}'`,
          `\`${original}\``,
          `className="${original}"`,
          `className='${original}'`,
          `class="${original}"`,
          `class='${original}'`
        ];
        
        patterns.forEach(pattern => {
          const replacement = pattern.replace(original, obfuscated);
          jsContent = jsContent.split(pattern).join(replacement);
        });
      }
      
      fs.writeFileSync(jsFile, jsContent);
    }

    // 5. Substituir nomes de classes nos arquivos HTML
    console.log('📄 Processando arquivos HTML...');
    for (const htmlFile of htmlFiles) {
      let htmlContent = fs.readFileSync(htmlFile, 'utf8');
      
      // Substituir nomes de classes CSS no HTML
      for (const [original, obfuscated] of classNameMap.entries()) {
        const patterns = [
          `class="${original}"`,
          `class='${original}'`,
          `class="${original} `,
          `class='${original} `,
          ` ${original}"`,
          ` ${original}'`,
          ` ${original} `
        ];
        
        patterns.forEach(pattern => {
          const replacement = pattern.replace(original, obfuscated);
          htmlContent = htmlContent.split(pattern).join(replacement);
        });
      }
      
      // Minificar HTML básico
      htmlContent = htmlContent
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      
      fs.writeFileSync(htmlFile, htmlContent);
    }

    // 6. Criar arquivo de mapeamento de classes
    const mappingFile = path.join(rootDir, 'class-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(Object.fromEntries(classNameMap), null, 2));

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
    console.log(`   - Arquivos JavaScript processados: ${jsFiles.length}`);
    console.log(`   - Arquivos HTML processados: ${htmlFiles.length}`);
    console.log(`   - Arquivos CSS processados: ${cssFiles.length}`);
    console.log('🛡️  Proteções aplicadas:');
    console.log('   - Obfuscação de classes CSS');
    console.log('   - Minificação de código');
    console.log('   - Nomes de arquivos obfuscados');
    console.log('   - Verificação de integridade');
    console.log(`📝 Mapeamento de classes salvo em: ${mappingFile}`);
    console.log('⚠️  IMPORTANTE: NÃO inclua o arquivo class-mapping.json no deploy!');

  } catch (error) {
    console.error('❌ Erro durante o build:', error);
    process.exit(1);
  }
}

buildProject();