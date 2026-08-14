import type { Config } from "tailwindcss";
import crypto from "crypto";

// Função para gerar nomes de classes obfuscados
function generateObfuscatedClass(original: string): string {
  const hash = crypto.createHash('md5').update(original).digest('hex').substring(0, 8);
  const prefixes = ['x', 'y', 'z', 'q', 'w'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  return `${prefix}${hash}`;
}

// Gerar classes obfuscadas para utilitários comuns
const obfuscatedUtilities = {
  // Layout
  'flex': generateObfuscatedClass('flex'),
  'grid': generateObfuscatedClass('grid'),
  'block': generateObfuscatedClass('block'),
  'inline': generateObfuscatedClass('inline'),
  'hidden': generateObfuscatedClass('hidden'),
  
  // Spacing
  'p-0': generateObfuscatedClass('p-0'),
  'p-1': generateObfuscatedClass('p-1'),
  'p-2': generateObfuscatedClass('p-2'),
  'p-4': generateObfuscatedClass('p-4'),
  'p-8': generateObfuscatedClass('p-8'),
  'm-0': generateObfuscatedClass('m-0'),
  'm-1': generateObfuscatedClass('m-1'),
  'm-2': generateObfuscatedClass('m-2'),
  'm-4': generateObfuscatedClass('m-4'),
  'm-8': generateObfuscatedClass('m-8'),
  
  // Colors
  'text-white': generateObfuscatedClass('text-white'),
  'text-black': generateObfuscatedClass('text-black'),
  'bg-white': generateObfuscatedClass('bg-white'),
  'bg-black': generateObfuscatedClass('bg-black'),
  'bg-blue-500': generateObfuscatedClass('bg-blue-500'),
  'text-blue-500': generateObfuscatedClass('text-blue-500'),
  
  // Typography
  'text-sm': generateObfuscatedClass('text-sm'),
  'text-base': generateObfuscatedClass('text-base'),
  'text-lg': generateObfuscatedClass('text-lg'),
  'text-xl': generateObfuscatedClass('text-xl'),
  'font-bold': generateObfuscatedClass('font-bold'),
  'font-medium': generateObfuscatedClass('font-medium'),
};

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Cores customizadas com nomes obfuscados
      colors: {
        [generateObfuscatedClass('primary')]: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
        [generateObfuscatedClass('secondary')]: {
          50: '#f8fafc',
          100: '#f1f5f9',
          500: '#64748b',
          900: '#0f172a',
        },
        // Manter algumas cores do sistema
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
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
        // Animações obfuscadas
        [generateObfuscatedClass('fade-in')]: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        [generateObfuscatedClass('slide-up')]: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        [generateObfuscatedClass('fade-in')]: `${generateObfuscatedClass('fade-in')} 0.3s ease-out`,
        [generateObfuscatedClass('slide-up')]: `${generateObfuscatedClass('slide-up')} 0.5s ease-out`,
      },
      // Fontes com nomes obfuscados
      fontFamily: {
        [generateObfuscatedClass('primary')]: ['Inter', 'sans-serif'],
        [generateObfuscatedClass('secondary')]: ['Roboto', 'sans-serif'],
      },
      // Espaçamentos customizados
      spacing: {
        [generateObfuscatedClass('xs')]: '0.5rem',
        [generateObfuscatedClass('sm')]: '1rem',
        [generateObfuscatedClass('md')]: '1.5rem',
        [generateObfuscatedClass('lg')]: '2rem',
        [generateObfuscatedClass('xl')]: '3rem',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), 
    require("@tailwindcss/typography"),
    // Plugin customizado para adicionar utilities obfuscados
    function({ addUtilities }: any) {
      const obfuscatedClasses: Record<string, any> = {};
      
      // Criar classes obfuscadas para utilities comuns
      Object.entries(obfuscatedUtilities).forEach(([original, obfuscated]) => {
        obfuscatedClasses[`.${obfuscated}`] = {
          // Mapear para a classe original do Tailwind
          [`@apply ${original}`]: {},
        };
      });
      
      addUtilities(obfuscatedClasses);
    },
  ],
} satisfies Config;