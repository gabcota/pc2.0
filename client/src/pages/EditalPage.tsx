import { useState } from 'react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Calendar, MapPin, Clock } from 'lucide-react';

export default function EditalPage() {
  const [isFloatingButtonVisible, setIsFloatingButtonVisible] = useState(true);

  const handleBackToProcess = () => {
    window.location.href = '/';
  };

  // Calculate dynamic dates based on today
  const getFormattedDate = (daysOffset: number) => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFormattedMonth = (monthsOffset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthsOffset);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getFormattedMonthRange = (startMonthsOffset: number, endMonthsOffset: number) => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() + startMonthsOffset);
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + endMonthsOffset);
    
    return `${startDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })} a ${endDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}`;
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <button onClick={handleBackToProcess} className="hover:text-gray-700 cursor-pointer">
            Home
          </button>
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-gray-900 font-medium">Edital</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 mr-3" style={{ color: '#0063AF' }} />
            <h1 className="text-3xl font-bold text-gray-900">
              Edital do Processo Seletivo Simplificado
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            PSS IBGE 2026 — Censo Agropecuário 2027
          </p>
        </div>

        {/* Official Document Style */}
        <article className="prose prose-lg max-w-none">
          <div className="bg-gray-50 border-l-4 p-6 mb-8" style={{ borderLeftColor: '#0063AF' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              EDITAL PSS Nº 001/2026 — IBGE — CENSO AGROPECUÁRIO 2027
            </h2>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Data de Publicação:</strong> 02 de janeiro de 2026
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Processo:</strong> Processo Seletivo Simplificado — IBGE PSS 2026
            </p>
            <p className="text-sm text-gray-600">
              <strong>Vigência:</strong> 31 de dezembro de 2026
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. DISPOSIÇÕES PRELIMINARES</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            O <strong>IBGE — Instituto Brasileiro de Geografia e Estatística</strong>, no uso das atribuições que lhe são conferidas pelo seu estatuto e pela legislação aplicável às fundações públicas federais, torna pública a abertura de
            <strong>Processo Seletivo Simplificado Nacional</strong> para contratação temporária de pessoal para o Censo Agropecuário 2027, nos termos da Lei nº 8.745/1993.
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. DAS VAGAS</h2>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-900 mb-4">2.1 Distribuição de Vagas</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">1.745</div>
                <div className="text-sm text-blue-700">Vagas Totais</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">27</div>
                <div className="text-sm text-blue-700">Unidades Federativas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-800">2</div>
                <div className="text-sm text-blue-700">Cargos</div>
              </div>
            </div>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>2.2</strong> As vagas estão distribuídas no seguinte cargo temporário:
          </p>

          <div className="space-y-4 mb-8">
            <div className="border-l-4 pl-4" style={{ borderLeftColor: '#0063AF' }}>
              <h4 className="font-semibold text-gray-900 mb-2">AGENTE DE PESQUISA E MAPEAMENTO</h4>
              <p className="text-gray-700">
                Coleta de dados agropecuários em campo, aplicação de questionários, uso de dispositivo móvel para registro de informações, georreferenciamento de estabelecimentos rurais e suporte à supervisão de coleta. Requisito: ensino médio completo. Remuneração conforme tabela do edital (vagas distribuídas por município).
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. DOS REQUISITOS</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            <strong>3.1</strong> Poderão se candidatar brasileiros que atendam aos seguintes requisitos:
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-yellow-900 mb-4">Requisitos Obrigatórios</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ser brasileiro(a) nato ou naturalizado</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Possuir ensino médio completo (Técnico Administrativo) ou ensino médio + curso técnico reconhecido pelo MEC (Técnico de Nível Médio)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ter no mínimo 18 anos e não ter ultrapassado 65 anos na data da posse</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Estar em situação regular com a Justiça Eleitoral e com o Serviço Militar (se do sexo masculino)</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Não possuir antecedentes criminais e ter conduta social ilibada</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-yellow-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ser aprovado em todos os exames e provas do concurso público</span>
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. DO PROCESSO SELETIVO</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>4.1</strong> O concurso público será realizado em etapas eliminatórias e classificatórias:
          </p>

          <div className="space-y-4 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">1ª ETAPA - Inscrição e Documentação</h4>
              <p className="text-blue-800">
                Preenchimento de formulário online, apresentação de documentos e pagamento da taxa de protocolo.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">2ª ETAPA - Prova Objetiva e Discursiva</h4>
              <p className="text-blue-800">
                Questões de múltipla escolha e redação abordando Direito, Português, Raciocínio Lógico e disciplinas específicas do cargo.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">3ª ETAPA - Exame Médico</h4>
              <p className="text-blue-800">
                Avaliação médica para verificar aptidão física e mental compatíveis com as atribuições do cargo policial.
              </p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">4ª ETAPA - Investigacao Social</h4>
              <p className="text-blue-800">
                Verificacao de antecedentes, conduta e idoneidade moral do candidato classificado nas etapas anteriores.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">5ª ETAPA - Programa de Integracao</h4>
              <p className="text-blue-800">
                Treinamento obrigatório do IBGE, realizado antes do início das atividades de campo, com apresentação institucional, metodologia de coleta e uso dos equipamentos.
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. DO CRONOGRAMA</h2>
          
          <div className="bg-gray-50 border rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-gray-900 mb-4">Cronograma Oficial</h3>
            <div className="space-y-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" style={{ color: '#0063AF' }} />
                <div>
                  <span className="font-medium text-gray-900">Inscrições:</span>
                  <span className="text-gray-700 ml-2">{getFormattedDate(-15)} a {getFormattedDate(7)}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" style={{ color: '#0063AF' }} />
                <div>
                  <span className="font-medium text-gray-900">Análise de Títulos:</span>
                  <span className="text-gray-700 ml-2">{getFormattedMonthRange(0, 1)}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" style={{ color: '#0063AF' }} />
                <div>
                  <span className="font-medium text-gray-900">Divulgação do Resultado:</span>
                  <span className="text-gray-700 ml-2">{getFormattedMonthRange(1, 2)}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" style={{ color: '#0063AF' }} />
                <div>
                  <span className="font-medium text-gray-900">Treinamento Obrigatório:</span>
                  <span className="text-gray-700 ml-2">{getFormattedMonthRange(1, 2)}</span>
                </div>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-3" style={{ color: '#0063AF' }} />
                <div>
                  <span className="font-medium text-gray-900">Início das Atividades de Campo:</span>
                  <span className="text-gray-700 ml-2">{getFormattedMonth(3)}</span>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. DA REMUNERAÇÃO E BENEFÍCIOS</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>6.1</strong> Os aprovados e nomeados farão jus à seguinte remuneração e benefícios:
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-4">Remuneração e Benefícios Garantidos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Remuneração</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Agente de Pesquisa e Mapeamento: conforme edital</li>
                  <li>• Diárias para deslocamento em campo</li>
                  <li>• Auxílio-alimentação previsto em lei</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Assistência</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Assistência médica (FUNPRE)</li>
                  <li>• Plano odontológico</li>
                  <li>• Seguro de vida em grupo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Formação</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Treinamento obrigatório IBGE pré-campo</li>
                  <li>• Capacitações metodológicas contínuas</li>
                  <li>• Acesso a materiais técnicos do Censo</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Outros</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 30 dias de férias remuneradas</li>
                  <li>• Licenças especiais previstas em lei</li>
                  <li>• Aposentadoria com integralidade</li>
                </ul>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. DISPOSIÇÕES FINAIS</h2>
          
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>7.1</strong> Os casos omissos neste edital serão resolvidos pelo IBGE, observada a legislação vigente, em especial a Lei nº 8.745/1993.
          </p>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>7.2</strong> Este edital entra em vigor na data de sua publicação no Diário Oficial da União.
          </p>

          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Presidente do IBGE</strong>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                IBGE — Edital PSS 2026 — Censo Agropecuário 2027
              </p>
              <p className="text-xs text-gray-500">
                Publicado no Diário Oficial da União em {getFormattedDate(-15)}
              </p>
            </div>
          </div>
        </article>
      </main>
      
      {/* Floating Back Button */}
      {isFloatingButtonVisible && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleBackToProcess}
            className="text-white shadow-lg rounded-full p-4 w-auto"
            style={{ backgroundColor: '#0063AF' }}
            size="lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para processo seletivo
          </Button>
        </div>
      )}
      
      <ExercitoFooter />
    </div>
  );
}