#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Build de produção rápido com proteção anti-clonagem...');

function generateRandomHash(length = 8) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

function obfuscateClassName(originalName) {
  const prefixes = ['x', 'y', 'z', 'q', 'w', 'r', 't', 'u', 'i', 'o'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = generateRandomHash(6);
  return `${randomPrefix}${randomSuffix}`;
}

async function buildProject() {
  try {
    console.log('🧹 Limpando build anterior...');
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
    }

    console.log('⚡ Executando build padrão...');
    execSync('npm run build', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    console.log('🎨 Aplicando obfuscação de classes CSS...');
    
    const classNameMap = new Map();
    const distDir = path.join(rootDir, 'dist/public');
    
    // Encontrar arquivos
    function findFiles(dir, extension) {
      const files = [];
      function scan(currentDir) {
        const items = fs.readdirSync(currentDir);
        items.forEach(item => {
          const fullPath = path.join(currentDir, item);
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            scan(fullPath);
          } else if (item.endsWith(extension)) {
            files.push(fullPath);
          }
        });
      }
      scan(dir);
      return files;
    }

    const cssFiles = findFiles(distDir, '.css');
    const jsFiles = findFiles(distDir, '.js');
    const htmlFiles = findFiles(distDir, '.html');

    // Processar CSS para mapear classes
    for (const cssFile of cssFiles) {
      const css = fs.readFileSync(cssFile, 'utf8');
      const classMatches = css.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g) || [];
      
      classMatches.forEach(match => {
        const className = match.substring(1);
        
        // Pular classes do sistema
        if (className.startsWith('radix-') || 
            className.startsWith('data-') || 
            className.includes('state-') ||
            className.length > 20) {
          return;
        }
        
        if (!classNameMap.has(className)) {
          classNameMap.set(className, obfuscateClassName(className));
        }
      });
    }

    // Substituir classes nos arquivos CSS
    for (const cssFile of cssFiles) {
      let css = fs.readFileSync(cssFile, 'utf8');
      
      for (const [original, obfuscated] of classNameMap.entries()) {
        const regex = new RegExp(`\\.${original}\\b`, 'g');
        css = css.replace(regex, `.${obfuscated}`);
      }
      
      fs.writeFileSync(cssFile, css);
    }

    // Substituir classes nos arquivos JS
    for (const jsFile of jsFiles) {
      let js = fs.readFileSync(jsFile, 'utf8');
      
      for (const [original, obfuscated] of classNameMap.entries()) {
        const patterns = [
          `"${original}"`,
          `'${original}'`,
          `\`${original}\``
        ];
        
        patterns.forEach(pattern => {
          const replacement = pattern.replace(original, obfuscated);
          js = js.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
        });
      }
      
      fs.writeFileSync(jsFile, js);
    }

    // Substituir classes nos arquivos HTML
    for (const htmlFile of htmlFiles) {
      let html = fs.readFileSync(htmlFile, 'utf8');
      
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
          html = html.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
        });
      }
      
      fs.writeFileSync(htmlFile, html);
    }

    // Adicionar proteção básica ao HTML
    for (const htmlFile of htmlFiles) {
      let html = fs.readFileSync(htmlFile, 'utf8');
      
      const protectionScript = `<script>
(function(){
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if(e.key==='F12'||(e.ctrlKey&&e.shiftKey&&e.key==='I')||(e.ctrlKey&&e.key==='U')){
      e.preventDefault();
      return false;
    }
  });
  setInterval(()=>{
    if(window.outerHeight-window.innerHeight>150||window.outerWidth-window.innerWidth>150){
      document.body.innerHTML='<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;"><h1>Acesso Negado</h1></div>';
    }
  },500);
})();
</script>`;

      html = html.replace('<head>', `<head>${protectionScript}`);
      fs.writeFileSync(htmlFile, html);
    }

    // Criar mapeamento e arquivo de integridade
    const mappingFile = path.join(rootDir, 'class-mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(Object.fromEntries(classNameMap), null, 2));

    const integrityData = {
      buildDate: new Date().toISOString(),
      version: generateRandomHash(16),
      classCount: classNameMap.size
    };
    
    fs.writeFileSync(
      path.join(distDir, 'integrity.json'),
      JSON.stringify(integrityData, null, 2)
    );

    console.log('✅ Build concluído com sucesso!');
    console.log(`📊 Classes CSS obfuscadas: ${classNameMap.size}`);
    console.log(`📁 Arquivos processados: ${cssFiles.length} CSS, ${jsFiles.length} JS, ${htmlFiles.length} HTML`);
    console.log('🛡️ Proteções aplicadas:');
    console.log('   - Obfuscação de classes CSS');
    console.log('   - Proteção anti-DevTools');
    console.log('   - Bloqueio de menu de contexto');
    console.log('   - Desabilitação de seleção de texto');
    console.log(`📝 Mapeamento salvo em: ${mappingFile}`);
    console.log('⚠️ IMPORTANTE: NÃO inclua class-mapping.json no deploy!');

  } catch (error) {
    console.error('❌ Erro durante o build:', error.message);
    process.exit(1);
  }
}

buildProject();