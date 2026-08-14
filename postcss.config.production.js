import postcssRename from 'postcss-rename';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import crypto from 'crypto';

// Função para gerar nomes de classes obfuscados
function generateObfuscatedClassName(originalName) {
  const hash = crypto.createHash('md5').update(originalName + Date.now()).digest('hex').substring(0, 8);
  const prefixes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}${hash}`;
}

// Configuração do plugin de renomeação
const renameConfig = {
  strategy: (name, node) => {
    // Pular classes do sistema e frameworks
    const skipPrefixes = [
      'radix-', 'data-', 'sr-', 'state-', 'orientation-', 'side-',
      'accordion-', 'alert-', 'avatar-', 'badge-', 'button-',
      'calendar-', 'card-', 'checkbox-', 'collapsible-', 'command-',
      'dialog-', 'drawer-', 'dropdown-', 'form-', 'hover-',
      'input-', 'label-', 'menubar-', 'navigation-', 'popover-',
      'progress-', 'radio-', 'scroll-', 'select-', 'separator-',
      'sheet-', 'sidebar-', 'slider-', 'switch-', 'table-',
      'tabs-', 'textarea-', 'toast-', 'toggle-', 'tooltip-'
    ];
    
    // Pular classes de estado do Radix UI
    const skipStates = [
      'open', 'closed', 'on', 'off', 'checked', 'unchecked',
      'indeterminate', 'disabled', 'enabled', 'pressed',
      'expanded', 'collapsed', 'selected', 'unselected'
    ];
    
    // Verificar se deve pular a classe
    if (skipPrefixes.some(prefix => name.startsWith(prefix)) ||
        skipStates.includes(name) ||
        name.startsWith('group-') ||
        name.startsWith('peer-') ||
        name.includes('hover:') ||
        name.includes('focus:') ||
        name.includes('active:') ||
        name.includes('dark:')) {
      return name;
    }
    
    // Gerar nome obfuscado
    return generateObfuscatedClassName(name);
  },
  by: 'class'
};

export default {
  plugins: [
    tailwindcss('./tailwind.config.production.ts'),
    autoprefixer,
    postcssRename(renameConfig),
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
          
          /* Esconder quando DevTools estão abertos */
          @media (max-width: 1200px) and (min-width: 1199px) {
            body { display: none !important; }
          }
          
          /* Proteção contra print screen */
          @media print {
            * { display: none !important; }
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
        `;
        
        root.append(protectionCSS);
      }
    }
  ]
};