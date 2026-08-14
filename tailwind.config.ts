import type { Config } from "tailwindcss";

// Configuração base do Tailwind CSS com otimizações para produção
const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/index.html", 
    "./client/src/**/*.{js,jsx,ts,tsx}",
    // Incluir apenas os arquivos necessários para otimizar o tamanho do bundle
    "!./client/src/**/*.{test,spec}.{js,jsx,ts,tsx}",
    "!./node_modules/**/*"
  ],
  
  // Configurações de otimização para produção
  corePlugins: {
    // Desabilitar plugins não utilizados para reduzir o tamanho
    ...(process.env.NODE_ENV === 'production' && {
      float: false,
      objectFit: false,
      objectPosition: false,
    })
  },
  
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Animações customizadas para proteção
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.5s ease-out",
      },
      // Fontes otimizadas
      fontFamily: {
        sans: [
          "Inter", 
          "system-ui", 
          "-apple-system", 
          "BlinkMacSystemFont", 
          "Segoe UI", 
          "Roboto", 
          "sans-serif"
        ],
      },
      // Espaçamentos otimizados
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Plugin customizado para adicionar utilities de proteção
    function({ addUtilities, addComponents, theme }) {
      const protectionUtilities = {
        '.no-select': {
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
        },
        '.no-drag': {
          '-webkit-user-drag': 'none',
          '-khtml-user-drag': 'none',
          '-moz-user-drag': 'none',
          '-o-user-drag': 'none',
          'user-drag': 'none',
        },
        '.no-highlight': {
          '-webkit-tap-highlight-color': 'transparent',
          '-webkit-touch-callout': 'none',
        },
        '.no-print': {
          '@media print': {
            display: 'none !important',
          },
        },
        '.debug-hide': {
          '@media (max-width: 1200px) and (min-width: 1199px)': {
            display: 'none !important',
          },
        },
      };
      
      addUtilities(protectionUtilities);
      
      // Componentes de proteção
      const protectionComponents = {
        '.protected-content': {
          '-webkit-user-select': 'none',
          '-moz-user-select': 'none',
          '-ms-user-select': 'none',
          'user-select': 'none',
          '-webkit-touch-callout': 'none',
          '-webkit-tap-highlight-color': 'transparent',
          'pointer-events': 'auto',
        },
        '.protected-input': {
          '-webkit-user-select': 'text',
          '-moz-user-select': 'text',
          '-ms-user-select': 'text',
          'user-select': 'text',
        },
      };
      
      addComponents(protectionComponents);
    },
  ],
  
  // Configurações de otimização
  ...(process.env.NODE_ENV === 'production' && {
    experimental: {
      optimizeUniversalDefaults: true,
    },
  }),
};

export default config;
