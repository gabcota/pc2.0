import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

// Configuração para desenvolvimento
const developmentConfig = {
  plugins: [
    tailwindcss,
    autoprefixer
  ]
};

// Configuração para produção com proteções CSS integradas
const productionConfig = {
  plugins: [
    tailwindcss,
    autoprefixer,
    // Plugin personalizado para adicionar CSS de proteção
    {
      postcssPlugin: 'add-protection-css',
      Once(root) {
        // Adicionar CSS que dificulta inspeção
        const protectionCSS = `
          /* Anti-seleção e proteção contra cópia */
          * {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
          }
          
          /* Permitir seleção apenas em inputs e textareas */
          input, textarea, [contenteditable="true"] {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
          }
          
          /* Esconder quando DevTools estão abertos */
          @media (max-width: 1200px) and (min-width: 1199px) {
            body { display: none !important; }
          }
          
          /* Proteção contra print screen */
          @media print {
            * { display: none !important; }
            body::after {
              content: "Este conteúdo não pode ser impresso";
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 24px;
              color: #000;
            }
          }
          
          /* CSS para detectar extensões de debug */
          .debug-detector {
            position: fixed;
            top: -9999px;
            left: -9999px;
            width: 1px;
            height: 1px;
            opacity: 0;
            pointer-events: none;
          }
          
          /* Proteção contra zoom excessivo */
          @media (min-resolution: 2dppx) and (max-width: 480px) {
            html { font-size: 14px; }
          }
          
          /* Utilities de proteção customizadas */
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          .no-drag {
            -webkit-user-drag: none;
            -khtml-user-drag: none;
            -moz-user-drag: none;
            -o-user-drag: none;
            user-drag: none;
          }
          
          .no-highlight {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }
          
          .protected-content {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
            -webkit-tap-highlight-color: transparent;
            pointer-events: auto;
          }
        `;
        
        root.append(protectionCSS);
      }
    }
  ]
};

// Determinar qual configuração usar baseado no NODE_ENV
export default process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig;
