import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterAcessoInformacaoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">Acesso à Informação</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Lei de Acesso à Informação</h2>
            <p className="text-gray-700 mb-4">
              Em cumprimento à Lei nº 12.527/2011 (Lei de Acesso à Informação), o Exército Brasileiro 
              disponibiliza informações de interesse público e garante o direito fundamental de acesso 
              à informação.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-[#243413] mb-2">Como solicitar informações</h3>
              <p className="text-gray-700 text-sm">
                Qualquer pessoa pode solicitar informações ao Exército através do sistema e-SIC 
                ou presencialmente nas unidades militares.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Informações Disponíveis</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-chart-bar text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Dados Orçamentários</h4>
                    <p className="text-sm text-gray-600">Execução orçamentária e financeira</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-users text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Estrutura Organizacional</h4>
                    <p className="text-sm text-gray-600">Organograma e competências</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-gavel text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Atos Normativos</h4>
                    <p className="text-sm text-gray-600">Regulamentos e instruções</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-shopping-cart text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Contratos e Licitações</h4>
                    <p className="text-sm text-gray-600">Processos de aquisição</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-map-marker-alt text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Endereços e Telefones</h4>
                    <p className="text-sm text-gray-600">Contatos das organizações militares</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-file-alt text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Relatórios Institucionais</h4>
                    <p className="text-sm text-gray-600">Prestação de contas anuais</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibent text-[#243413] mb-4">Formulário de Solicitação</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-info-circle text-[#243413] mr-2"></i>
                <span className="font-semibold text-[#243413]">Sistema e-SIC</span>
              </div>
              <p className="text-sm text-gray-700">
                Para solicitar informações, utilize o sistema eletrônico e-SIC disponível 
                no portal do governo federal.
              </p>
            </div>
            <button className="bg-[#6a7d00] text-white px-6 py-3 rounded-lg hover:bg-[#5a6d00] transition-colors">
              Acessar e-SIC
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Contatos</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Serviço de Informação ao Cidadão</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <i className="fas fa-map-marker-alt text-[#6a7d00] mr-2"></i>
                    <span>SMU - Setor Militar Urbano, Brasília/DF</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-phone text-[#6a7d00] mr-2"></i>
                    <span>(61) 3415-4000</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <i className="fas fa-envelope text-[#6a7d00] mr-2"></i>
                    <span>sic@eb.mil.br</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Horário de Atendimento</h3>
                <div className="space-y-2 text-sm">
                  <div>Segunda a Sexta-feira: 8h às 17h</div>
                  <div>Sábados, Domingos e Feriados: Fechado</div>
                  <div className="text-gray-600 mt-2">
                    * Atendimento presencial mediante agendamento
                  </div>
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