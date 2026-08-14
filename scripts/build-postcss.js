#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Build com PostCSS + Tailwind otimizado...');

function generateRandomHash(length = 8) {
  return crypto.randomBytes(length).toString('hex').substring(0, length);
}

async function buildWithPostCSS() {
  try {
    console.log('🧹 Limpando build anterior...');
    if (fs.existsSync(path.join(rootDir, 'dist'))) {
      fs.rmSync(path.join(rootDir, 'dist'), { recursive: true, force: true });
    }

    console.log('⚡ Executando build com PostCSS...');
    execSync('NODE_ENV=production vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist --minify', { 
      cwd: rootDir, 
      stdio: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' }
    });

    console.log('🎨 PostCSS aplicou obfuscação automaticamente...');
    
    const distDir = path.join(rootDir, 'dist/public');
    
    // Encontrar arquivos gerados
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

    // Contar classes obfuscadas nos arquivos CSS
    let totalObfuscatedClasses = 0;
    for (const cssFile of cssFiles) {
      const css = fs.readFileSync(cssFile, 'utf8');
      const obfuscatedMatches = css.match(/\.[a-j][a-f0-9]{7,8}/g) || [];
      totalObfuscatedClasses += obfuscatedMatches.length;
    }

    // Aplicar proteções JavaScript adicionais aos arquivos JS
    for (const jsFile of jsFiles) {
      let js = fs.readFileSync(jsFile, 'utf8');
      
      // Adicionar verificações de integridade inline
      const integrityCheck = `
        (function(){
          const originalConsole = window.console;
          let attempts = 0;
          const maxAttempts = 3;
          
          function detectTampering() {
            attempts++;
            if (attempts > maxAttempts) {
              document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;background:#000;color:#fff;font-family:monospace;">ACESSO_NEGADO</div>';
            }
          }
          
          Object.defineProperty(window, 'console', {
            get: function() {
              detectTampering();
              return originalConsole;
            }
          });
          
          setInterval(function() {
            const devToolsOpen = window.outerHeight - window.innerHeight > 160 || window.outerWidth - window.innerWidth > 160;
            if (devToolsOpen) {
              document.body.style.display = 'none';
            }
          }, 200);
        })();
      `;
      
      js = integrityCheck + js;
      fs.writeFileSync(jsFile, js);
    }

    // Aplicar proteções avançadas ao HTML
    for (const htmlFile of htmlFiles) {
      let html = fs.readFileSync(htmlFile, 'utf8');
      
      // Script de proteção avançado
      const advancedProtection = `<script>
(function(){
  'use strict';
  
  const protection = {
    init() {
      this.blockDevTools();
      this.blockInteractions();
      this.blockKeyboardShortcuts();
      this.startMonitoring();
    },
    
    blockDevTools() {
      let devtools = {open: false, orientation: null};
      const threshold = 160;
      
      setInterval(() => {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
          if (!devtools.open) {
            devtools.open = true;
            this.showBlockedMessage();
          }
        } else {
          devtools.open = false;
          this.restoreContent();
        }
      }, 100);
    },
    
    blockInteractions() {
      const events = ['contextmenu', 'selectstart', 'dragstart', 'copy', 'cut'];
      events.forEach(event => {
        document.addEventListener(event, e => {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }, true);
      });
    },
    
    blockKeyboardShortcuts() {
      document.addEventListener('keydown', e => {
        const blocked = [
          e.key === 'F12',
          e.ctrlKey && e.shiftKey && ['I', 'C', 'J', 'K'].includes(e.key),
          e.ctrlKey && ['U', 'S', 'A', 'P'].includes(e.key),
          e.metaKey && e.altKey && ['I', 'C', 'J'].includes(e.key),
          e.altKey && e.key === 'F4'
        ];
        
        if (blocked.some(condition => condition)) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }, true);
    },
    
    startMonitoring() {
      // Anti-debug
      setInterval(() => {
        const start = performance.now();
        debugger;
        const end = performance.now();
        if (end - start > 100) {
          this.showBlockedMessage();
        }
      }, 1000);
      
      // Console protection
      let devtools = false;
      Object.defineProperty(window, 'console', {
        get() {
          devtools = true;
          return {
            log: () => {},
            warn: () => {},
            error: () => {},
            info: () => {},
            debug: () => {},
            clear: () => {},
            dir: () => {},
            trace: () => {}
          };
        }
      });
    },
    
    showBlockedMessage() {
      if (!document.body.classList.contains('blocked')) {
        document.body.classList.add('blocked');
        document.body.innerHTML = \`
          <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <div style="
              text-align: center;
              color: white;
              padding: 3rem;
              border-radius: 1rem;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
            ">
              <h1 style="
                font-size: 2.5rem;
                margin: 0 0 1rem 0;
                font-weight: 700;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
              ">
                Acesso Restrito
              </h1>
              <p style="
                font-size: 1.25rem;
                margin: 0;
                opacity: 0.9;
                line-height: 1.6;
              ">
                Esta aplicação não pode ser inspecionada<br>
                Por favor, feche as ferramentas de desenvolvedor
              </p>
            </div>
          </div>
        \`;
      }
    },
    
    restoreContent() {
      if (document.body.classList.contains('blocked')) {
        document.body.classList.remove('blocked');
        location.reload();
      }
    }
  };
  
  // Inicializar proteções quando o DOM estiver pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => protection.init());
  } else {
    protection.init();
  }
  
})();
</script>`;

      html = html.replace('<head>', `<head>${advancedProtection}`);
      
      // Minificar HTML
      html = html
        .replace(/<!--.*?-->/gs, '')
        .replace(/\s+/g, ' ')
        .replace(/>\s+</g, '><')
        .trim();
      
      fs.writeFileSync(htmlFile, html);
    }

    // Criar arquivo de integridade
    const integrityData = {
      buildDate: new Date().toISOString(),
      version: generateRandomHash(16),
      obfuscatedClasses: totalObfuscatedClasses,
      buildMethod: 'postcss-tailwind',
      environment: 'production'
    };
    
    fs.writeFileSync(
      path.join(distDir, 'integrity.json'),
      JSON.stringify(integrityData, null, 2)
    );

    // Estatísticas finais
    const stats = fs.statSync(path.join(rootDir, 'dist/index.js'));
    const serverSize = Math.round(stats.size / 1024);
    
    console.log('✅ Build PostCSS concluído!');
    console.log(`📊 Classes obfuscadas automaticamente: ${totalObfuscatedClasses}`);
    console.log(`📁 Servidor: ${serverSize}kb`);
    console.log(`📁 Arquivos: ${cssFiles.length} CSS, ${jsFiles.length} JS, ${htmlFiles.length} HTML`);
    console.log('🛡️ Proteções aplicadas:');
    console.log('   - Obfuscação automática via PostCSS');
    console.log('   - Utilities de proteção do Tailwind (.no-select, .no-drag, etc.)');
    console.log('   - Anti-DevTools avançado');
    console.log('   - Bloqueios de interação completos');
    console.log('   - Proteção contra debugging');
    console.log('   - CSS de proteção integrado');
    console.log('🚀 Pronto para deploy!');

  } catch (error) {
    console.error('❌ Erro no build PostCSS:', error.message);
    process.exit(1);
  }
}

buildWithPostCSS();