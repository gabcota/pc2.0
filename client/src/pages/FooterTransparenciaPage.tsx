import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterTransparenciaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">Transparência e Prestação de Contas</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Portal da Transparência do Exército Brasileiro</h2>
            <p className="text-gray-700 mb-4">
              O Exército Brasileiro mantém firme compromisso com a transparência pública e 
              prestação de contas à sociedade brasileira, disponibilizando de forma proativa 
              e acessível informações detalhadas sobre receitas, despesas, contratos, ações 
              institucionais e resultados operacionais, em conformidade com a Lei de Acesso 
              à Informação (Lei nº 12.527/2011) e demais marcos legais de transparência.
            </p>
            <p className="text-gray-700 mb-4">
              Nossa gestão transparente reflete os valores institucionais de honra, probidade 
              e responsabilidade com os recursos públicos. Através de relatórios detalhados, 
              indicadores de performance e sistemas de monitoramento em tempo real, 
              demonstramos como cada real investido na defesa nacional contribui para a 
              segurança, soberania e desenvolvimento do Brasil.
            </p>
            <p className="text-gray-700 mb-6">
              O Portal da Transparência do Exército é atualizado diariamente e oferece 
              interface intuitiva para consulta de dados, com filtros avançados e 
              funcionalidades de exportação que facilitam o controle social e a participação 
              cidadã no acompanhamento das ações governamentais.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <i className="fas fa-dollar-sign text-[#243413] text-2xl mb-2"></i>
                <h3 className="font-semibold text-[#243413]">Execução Orçamentária</h3>
                <p className="text-sm text-gray-700 mt-2">Acompanhe os gastos públicos em tempo real</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <i className="fas fa-handshake text-[#243413] text-2xl mb-2"></i>
                <h3 className="font-semibold text-[#243413]">Contratos</h3>
                <p className="text-sm text-gray-700 mt-2">Contratos firmados e seus valores</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <i className="fas fa-users text-[#243413] text-2xl mb-2"></i>
                <h3 className="font-semibold text-[#243413]">Servidores</h3>
                <p className="text-sm text-gray-700 mt-2">Informações sobre remuneração</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Relatórios de Gestão e Prestação de Contas</h2>
            <p className="text-gray-700 mb-6">
              A prestação de contas do Exército Brasileiro é realizada através de documentos 
              técnicos detalhados que apresentam os resultados alcançados, recursos utilizados 
              e impactos das ações institucionais. Estes relatórios são elaborados seguindo 
              rigorosos padrões técnicos e normativos, garantindo fidedignidade e transparência 
              das informações apresentadas à sociedade.
            </p>
            <div className="space-y-6">
              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#243413] mb-2">Relatório de Gestão 2024</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Documento abrangente que consolida todas as atividades desenvolvidas pelo 
                      Exército Brasileiro durante o exercício de 2024, incluindo resultados 
                      operacionais, investimentos realizados, programas sociais executados e 
                      indicadores de performance institucional. O relatório apresenta análise 
                      detalhada de 847 páginas com dados auditados e certificados.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                      <div><strong>Páginas:</strong> 847</div>
                      <div><strong>Tamanho:</strong> 28.5 MB</div>
                      <div><strong>Formato:</strong> PDF/A</div>
                      <div><strong>Publicação:</strong> 31/03/2025</div>
                      <div><strong>Auditoria:</strong> CGU/TCU</div>
                      <div><strong>Downloads:</strong> 23.456</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Missões Cumpridas: 94.2%</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Orçamento Executado: 96.8%</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Projetos Sociais: 127</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <button className="bg-[#6a7d00] text-white px-6 py-3 rounded-lg hover:bg-[#5a6d00] transition-colors mb-2">
                      <i className="fas fa-download mr-2"></i>Download PDF
                    </button>
                    <div className="text-xs text-gray-500">Versão Completa</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#243413] mb-2">Plano Estratégico do Exército 2024-2030</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Documento que estabelece as diretrizes estratégicas de longo prazo para 
                      modernização e transformação do Exército Brasileiro. Contempla análise 
                      do cenário estratégico nacional e internacional, definição de capacidades 
                      futuras necessárias e roadmap de implementação com cronograma detalhado 
                      de investimentos e marcos de acompanhamento.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                      <div><strong>Vigência:</strong> 2024-2030</div>
                      <div><strong>Revisão:</strong> Anual</div>
                      <div><strong>Investimento:</strong> R$ 47,2 bi</div>
                      <div><strong>Objetivos:</strong> 156</div>
                      <div><strong>Indicadores:</strong> 892</div>
                      <div><strong>Projetos:</strong> 78</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Modernização Tecnológica</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Capacitação de Pessoal</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Infraestrutura</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <button className="bg-[#6a7d00] text-white px-6 py-3 rounded-lg hover:bg-[#5a6d00] transition-colors mb-2">
                      <i className="fas fa-download mr-2"></i>Download PDF
                    </button>
                    <div className="text-xs text-gray-500">Documento Estratégico</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#243413] mb-2">Demonstrações Contábeis e Balanço Patrimonial 2024</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Relatório financeiro-contábil consolidado que apresenta a posição 
                      patrimonial, financeira e orçamentária do Exército Brasileiro. 
                      Elaborado conforme normas internacionais de contabilidade pública 
                      (IPSAS) e auditado por empresa independente. Inclui demonstração 
                      do fluxo de caixa, variações patrimoniais e notas explicativas detalhadas.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                      <div><strong>Ativo Total:</strong> R$ 127,3 bi</div>
                      <div><strong>Patrimônio:</strong> R$ 89,7 bi</div>
                      <div><strong>Receita:</strong> R$ 34,2 bi</div>
                      <div><strong>Auditoria:</strong> KPMG</div>
                      <div><strong>Parecer:</strong> Sem Ressalvas</div>
                      <div><strong>Normas:</strong> IPSAS/NBC TSP</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Gestão Eficiente</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Auditado</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Transparente</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <button className="bg-[#6a7d00] text-white px-6 py-3 rounded-lg hover:bg-[#5a6d00] transition-colors mb-2">
                      <i className="fas fa-download mr-2"></i>Download PDF
                    </button>
                    <div className="text-xs text-gray-500">Demonstrações Financeiras</div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-300 rounded-lg p-6 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-[#243413] mb-2">Relatório de Sustentabilidade e Responsabilidade Social 2024</h3>
                    <p className="text-gray-700 text-sm mb-3">
                      Documento que demonstra o compromisso do Exército Brasileiro com a 
                      sustentabilidade ambiental e responsabilidade social. Apresenta ações 
                      de preservação ambiental, programas sociais, iniciativas de inclusão 
                      e projetos de desenvolvimento comunitário realizados em parceria com 
                      organizações civis e governamentais.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4 text-xs text-gray-600 mb-3">
                      <div><strong>Projetos Ambientais:</strong> 234</div>
                      <div><strong>Pessoas Beneficiadas:</strong> 127.456</div>
                      <div><strong>Comunidades:</strong> 2.847</div>
                      <div><strong>Parceiros:</strong> 567 ONGs</div>
                      <div><strong>Investimento Social:</strong> R$ 890 mi</div>
                      <div><strong>CO2 Reduzido:</strong> 45.678 ton</div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Sustentável</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Social</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs border">Inclusivo</span>
                    </div>
                  </div>
                  <div className="ml-4 text-right">
                    <button className="bg-[#6a7d00] text-white px-6 py-3 rounded-lg hover:bg-[#5a6d00] transition-colors mb-2">
                      <i className="fas fa-download mr-2"></i>Download PDF
                    </button>
                    <div className="text-xs text-gray-500">Relatório de Sustentabilidade</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Indicadores de Performance</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Metas Cumpridas em 2024</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Treinamento de Efetivos</span>
                      <span>94%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '94%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Modernização Equipamentos</span>
                      <span>87%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '87%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Projetos Sociais</span>
                      <span>91%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '91%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Investimentos 2024</h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Defesa Nacional</span>
                    <span className="font-semibold">R$ 2,1 bi</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Desenvolvimento Social</span>
                    <span className="font-semibold">R$ 890 mi</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Pesquisa e Desenvolvimento</span>
                    <span className="font-semibold">R$ 456 mi</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-sm">Infraestrutura</span>
                    <span className="font-semibold">R$ 623 mi</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Auditoria e Controle</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Órgãos de Controle</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span className="text-sm">Tribunal de Contas da União (TCU)</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span className="text-sm">Controladoria-Geral da União (CGU)</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span className="text-sm">Auditoria Interna do Exército</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Canais de Denúncia</h3>
                <div className="space-y-2 text-sm">
                  <div>Ouvidoria: ouvidoria@eb.mil.br</div>
                  <div>Telefone: 0800-123-4567</div>
                  <div>Sistema de Denúncias Online</div>
                  <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors text-sm">
                    Fazer Denúncia
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}