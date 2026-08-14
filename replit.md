# Police Civil Recruitment Platform

A comprehensive public security recruitment platform simulating an official government system for the Brazilian Civil and Scientific Police, handling the entire recruitment workflow from registration to final confirmation.

## Run & Operate

- **Run Dev Server**: `npm run dev`
- **Build**: `npm run build`
- **Typecheck**: `npm run typecheck`
- **Database Push**: `drizzle-kit push:pg`
- **Required Env Vars**: `VITE_API_BASE_URL`, `DATABASE_URL`, `FOR4PAYMENTS_API_KEY`, `FLUXONS_API_KEY`, `OPENAI_API_KEY`, `WORKBUSCAS_API_KEY`

## Stack

- **Frontend**: React with TypeScript, Wouter, TanStack Query, Radix UI, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Authentication**: `express-session` (cookie-based)
- **Payment**: For4Payments API (PIX)
- **Validation**: _Populate as you build_
- **Build Tool**: Vite

## Where things live

- `src/` - Frontend source code
- `server/` - Backend source code
- `drizzle/schema.ts` - Database schema
- `src/components/` - Reusable UI components
- `src/pages/` - Application pages
- `server/api/` - Backend API endpoints
- `src/styles/index.css` - Tailwind CSS configuration and custom styles
- `public/` - Static assets
- `whatsapp-pre-message.txt` - WhatsApp pre-message content
- `roteiro-ligacao-pregravada.txt`, `roteiro-ligacao-urgencia-maxima.txt`, `roteiros-ligacao-pos-pagamento.txt`, `roteiro-audio-confirmacao-dados.txt` - Call automation scripts
- `template-email-pix-gerado.html`, `template-email-pix-gerado.txt` - PIX generation email templates

## Architecture decisions

- **Mobile-First Design**: Desktop access is blocked via middleware, and the UI is optimized for mobile touch interaction.
- **Multi-Step Recruitment Flow**: A complex, guided multi-page process (landing to final confirmation) ensures comprehensive data capture and user progression.
- **Intelligent Caching for AI**: A specialized caching system (`faq_cache` table) with profile hashing and similarity scoring reduces OpenAI API calls by 70-90% for FAQs.
- **Progressive Objection Handling**: Throughout the conversion funnels (especially payment), copywriting and AI-generated content are tailored to address user objections and fears progressively.
- **Dynamic Data Integration**: Real-time integration with external APIs (For4Payments, Workbuscas, Fluxons, ViaCEP) and local storage for candidate data (`dados-extras`) ensures a personalized and dynamic user experience.

## Product

- Simulate official government recruitment (Polícia Civil/Científica) with 24,000 vacancies.
- Full recruitment workflow: registration, position selection, payment (PIX), medical scheduling, confirmation.
- Real-time payment tracking and status updates.
- Personalized AI-powered FAQ and military recruitment analysis.
- Automated communication (SMS, email, voice calls) for user engagement and conversion.
- Biometric identity validation during critical steps.

## User preferences

Preferred communication style: Simple, everyday language.

## Gotchas

- **Deployment**: Ensure correct environment variables are set for each deployment platform (Fly.io, Replit, Railway).
- **Payment API**: For4Payments API integration requires careful handling of webhooks for real-time payment status.
- **External API Rate Limits**: Be mindful of rate limits for `workbuscas.com` and other external APIs; rate limiting is implemented on `/api/*` routes.
- **Data Consistency**: `dados-extras` in local storage is critical for personalized experiences; ensure it's populated correctly after CPF validation.

## Pointers

- [React Documentation](https://react.dev/learn)
- [Express.js Documentation](https://expressjs.com/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/docs/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Wouter Documentation](https://docs.wouter.com/)
- [For4Payments API Docs](https://for4payments.com/docs)
- [Neon Database](https://neon.tech/)
- [Workbuscas API](https://workbuscas.com/)
- [Fluxons API](https://app.fluxons.com.br/)
- [OpenAI API](https://platform.openai.com/docs/overview)
- [ViaCEP API](https://viacep.com.br/)