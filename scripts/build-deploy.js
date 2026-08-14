#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Build para deploy com proteção anti-clonagem...');

function generateRandomHash(length = 8) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

function obfuscateClassName(originalName) {
  const prefixes = ['x', 'y', 'z', 'q', 'w', 'r', 't', 'u', 'i', 'o'];
  const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const randomSuffix = generateRandomHash(6);
  return `${randomPrefix}${randomSuffix}`;
}

async function buildForDeploy() {
  try {
    console.log('🧹 Limpando build anterior...');
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
    }

    console.log('⚡ Executando build de produção...');
    execSync('vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    console.log('🎨 Aplicando obfuscação...');
    
    const classNameMap = new Map();
    const distDir = path.join(rootDir, 'dist/public');
    
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

    // Extrair e mapear classes CSS
    for (const cssFile of cssFiles) {
      const css = fs.readFileSync(cssFile, 'utf8');
      const classMatches = css.match(/\.([a-zA-Z][a-zA-Z0-9_-]*)/g) || [];
      
      classMatches.forEach(match => {
        const className = match.substring(1);
        
        if (className.startsWith('radix-') || 
            className.startsWith('data-') || 
            className.includes('state-') ||
            className.length > 25) {
          return;
        }
        
        if (!classNameMap.has(className)) {
          classNameMap.set(className, obfuscateClassName(className));
        }
      });
    }

    // Obfuscar CSS
    for (const cssFile of cssFiles) {
      let css = fs.readFileSync(cssFile, 'utf8');
      
      for (const [original, obfuscated] of classNameMap.entries()) {
        const regex = new RegExp(`\\.${original}\\b`, 'g');
        css = css.replace(regex, `.${obfuscated}`);
      }
      
      fs.writeFileSync(cssFile, css);
    }

    // Obfuscar JavaScript
    for (const jsFile of jsFiles) {
      let js = fs.readFileSync(jsFile, 'utf8');
      
      for (const [original, obfuscated] of classNameMap.entries()) {
        const patterns = [`"${original}"`, `'${original}'`, `\`${original}\``];
        patterns.forEach(pattern => {
          const replacement = pattern.replace(original, obfuscated);
          js = js.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
        });
      }
      
      fs.writeFileSync(jsFile, js);
    }

    // Aplicar proteções ao HTML
    for (const htmlFile of htmlFiles) {
      let html = fs.readFileSync(htmlFile, 'utf8');
      
      // Substituir classes obfuscadas
      for (const [original, obfuscated] of classNameMap.entries()) {
        const patterns = [
          `class="${original}"`, `class='${original}'`,
          `class="${original} `, `class='${original} `,
          ` ${original}"`, ` ${original}'`, ` ${original} `
        ];
        patterns.forEach(pattern => {
          const replacement = pattern.replace(original, obfuscated);
          html = html.replace(new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replacement);
        });
      }
      
      // Adicionar proteções runtime
      const protectionScript = `<script>
(function(){
  'use strict';
  
  // Anti-DevTools
  let devtools = {open: false};
  const threshold = 160;
  
  function detectDevTools() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;background:#f5f5f5;color:#333;"><div style="text-align:center;"><h1 style="margin:0;font-size:24px;">Acesso Restrito</h1><p style="margin:10px 0 0;color:#666;">Esta página não pode ser inspecionada</p></div></div>';
      }
    } else {
      devtools.open = false;
    }
  }
  
  setInterval(detectDevTools, 100);
  
  // Bloqueios de interação
  document.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('selectstart', e => e.preventDefault());
  document.addEventListener('dragstart', e => e.preventDefault());
  
  // Bloqueios de teclado
  document.addEventListener('keydown', e => {
    if (e.key === 'F12' || 
        (e.ctrlKey && e.shiftKey && ['I', 'C', 'J'].includes(e.key)) ||
        (e.ctrlKey && ['U', 'S'].includes(e.key)) ||
        (e.metaKey && e.altKey && ['I', 'C', 'J'].includes(e.key))) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  });
  
  // Proteção contra console
  try {
    Object.defineProperty(window, 'console', {
      get: function() {
        throw new Error('Console bloqueado');
      },
      set: function() {}
    });
  } catch(e) {}
  
  // Anti-debug
  setInterval(() => {
    try { debugger; } catch(e) {}
  }, 1000);
  
})();
</script>`;

      html = html.replace('<head>', `<head>${protectionScript}`);
      
      // Minificar HTML
      html = html
        .replace(/<!--.*?-->/gs, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      
      fs.writeFileSync(htmlFile, html);
    }

    // Remover arquivos sensíveis que não devem ir para produção
    const sensitiveFiles = [
      'class-mapping.json',
      'BUILD-PRODUCTION.md',
      'COMO-USAR-BUILD-PRODUCAO.md',
      '.gitignore.production'
    ];
    
    sensitiveFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️  Removido arquivo sensível: ${file}`);
      }
    });

    // Criar arquivo de integridade para produção
    const integrityData = {
      buildDate: new Date().toISOString(),
      version: generateRandomHash(16),
      classCount: classNameMap.size,
      environment: 'production'
    };
    
    fs.writeFileSync(
      path.join(distDir, 'integrity.json'),
      JSON.stringify(integrityData)
    );

    // Estatísticas finais
    const stats = fs.statSync(path.join(rootDir, 'dist/index.js'));
    const serverSize = Math.round(stats.size / 1024);
    
    console.log('✅ Build para deploy concluído!');
    console.log(`📊 Classes obfuscadas: ${classNameMap.size}`);
    console.log(`📁 Servidor: ${serverSize}kb`);
    console.log(`📁 Arquivos: ${cssFiles.length} CSS, ${jsFiles.length} JS, ${htmlFiles.length} HTML`);
    console.log('🛡️ Proteções aplicadas:');
    console.log('   - Obfuscação completa de classes CSS');
    console.log('   - Anti-DevTools avançado');
    console.log('   - Bloqueios de interação');
    console.log('   - Minificação agressiva');
    console.log('   - Remoção de arquivos sensíveis');
    console.log('🚀 Pronto para deploy!');

  } catch (error) {
    console.error('❌ Erro no build:', error.message);
    process.exit(1);
  }
}

buildForDeploy();