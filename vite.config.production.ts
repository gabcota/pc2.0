import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import crypto from "crypto";

// Plugin customizado para obfuscar nomes de arquivos
function obfuscateFileNames() {
  return {
    name: 'obfuscate-filenames',
    generateBundle(options: any, bundle: any) {
      const newBundle: any = {};
      
      Object.keys(bundle).forEach(fileName => {
        const file = bundle[fileName];
        
        if (fileName.endsWith('.js') || fileName.endsWith('.css')) {
          // Gerar novo nome obfuscado para arquivos JS e CSS
          const hash = crypto.createHash('md5').update(fileName).digest('hex').substring(0, 12);
          const extension = path.extname(fileName);
          const newFileName = `${hash}${extension}`;
          
          file.fileName = newFileName;
          newBundle[newFileName] = file;
          
          // Atualizar referências no HTML
          if (file.type === 'chunk' && file.isEntry) {
            Object.keys(bundle).forEach(otherFileName => {
              const otherFile = bundle[otherFileName];
              if (otherFile.type === 'asset' && otherFileName.endsWith('.html')) {
                otherFile.source = otherFile.source.replace(
                  new RegExp(fileName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                  newFileName
                );
              }
            });
          }
        } else {
          newBundle[fileName] = file;
        }
      });
      
      Object.assign(bundle, newBundle);
    }
  };
}

// Plugin para adicionar proteções anti-debug no runtime
function antiDebugProtection() {
  return {
    name: 'anti-debug-protection',
    transformIndexHtml(html: string) {
      const protectionScript = `
        <script>
          (function() {
            'use strict';
            
            // Proteção anti-DevTools
            let devtools = {open: false, orientation: null};
            const threshold = 160;
            
            const detectDevTools = () => {
              if (window.outerHeight - window.innerHeight > threshold || 
                  window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                  devtools.open = true;
                  // Redirecionar ou ocultar conteúdo quando DevTools for detectado
                  document.body.innerHTML = '<div style="display:flex;justify-content:center;align-items:center;height:100vh;font-family:Arial,sans-serif;"><h1>Acesso Negado</h1></div>';
                }
              } else {
                devtools.open = false;
              }
            };
            
            // Verificar a cada 100ms
            setInterval(detectDevTools, 100);
            
            // Proteção contra console
            Object.defineProperty(window, 'console', {
              get: function() {
                throw new Error('Console desabilitado');
              }
            });
            
            // Proteção contra debugger
            setInterval(() => {
              debugger;
            }, 1000);
            
            // Proteção contra seleção de texto e menu de contexto
            document.addEventListener('selectstart', e => e.preventDefault());
            document.addEventListener('contextmenu', e => e.preventDefault());
            document.addEventListener('keydown', e => {
              // Bloquear F12, Ctrl+Shift+I, Ctrl+U, etc.
              if (e.key === 'F12' || 
                  (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                  (e.ctrlKey && e.shiftKey && e.key === 'C') ||
                  (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                return false;
              }
            });
            
            // Verificação de integridade dos arquivos
            fetch('/integrity.json')
              .then(response => response.json())
              .then(data => {
                // Verificar se os arquivos não foram modificados
                const scripts = document.querySelectorAll('script[src]');
                const links = document.querySelectorAll('link[href$=".css"]');
                
                scripts.forEach(script => {
                  const src = script.getAttribute('src');
                  if (src && data.files[src.replace('/', '')]) {
                    fetch(src)
                      .then(response => response.text())
                      .then(content => {
                        const hash = btoa(content).substring(0, 32);
                        // Verificação simples de integridade
                        if (!data.files[src.replace('/', '')].includes(hash.substring(0, 8))) {
                          console.warn('Arquivo modificado detectado');
                        }
                      });
                  }
                });
              })
              .catch(() => {
                // Falha na verificação de integridade
              });
          })();
        </script>
      `;
      
      return html.replace('<head>', `<head>${protectionScript}`);
    }
  };
}

export default defineConfig({
  plugins: [
    react(),
    obfuscateFileNames(),
    antiDebugProtection(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 3,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
        chunkFileNames: (chunkInfo) => {
          // Gerar nomes de chunks obfuscados
          const hash = crypto.createHash('md5').update(chunkInfo.name).digest('hex').substring(0, 10);
          return `${hash}.js`;
        },
        assetFileNames: (assetInfo) => {
          // Gerar nomes de assets obfuscados
          if (assetInfo.name) {
            const hash = crypto.createHash('md5').update(assetInfo.name).digest('hex').substring(0, 10);
            const ext = path.extname(assetInfo.name);
            return `${hash}${ext}`;
          }
          return '[name].[ext]';
        },
      },
      external: [],
    },
    cssCodeSplit: true,
    sourcemap: false, // Desabilitar sourcemaps em produção
    reportCompressedSize: false,
    assetsInlineLimit: 0, // Forçar todos os assets a serem arquivos separados
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString()),
    'process.env.BUILD_HASH': JSON.stringify(crypto.randomBytes(16).toString('hex')),
  },
});