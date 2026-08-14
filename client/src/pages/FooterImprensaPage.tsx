import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterImprensaPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">Imprensa</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Centro de Comunicação Social do Exército</h2>
            <p className="text-gray-700 mb-6">
              O Centro de Comunicação Social do Exército (CCOMSEx) é o órgão responsável pela 
              coordenação e execução das atividades de comunicação social da Força Terrestre. 
              Criado para garantir transparência e facilitar o relacionamento com a sociedade, 
              o CCOMSEx desenvolve estratégias integradas de comunicação que fortalecem os 
              laços entre o Exército e a população brasileira.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[#243413] mb-3">Nossa Missão</h3>
              <p className="text-gray-700 text-sm">
                Planejar, coordenar e executar as atividades de comunicação social do Exército 
                Brasileiro, promovendo a transparência institucional, fortalecendo a imagem da 
                Força Terrestre e mantendo a sociedade informada sobre as ações e contribuições 
                do Exército para o desenvolvimento nacional e a defesa da soberania.
              </p>
            </div>

            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Últimas Notícias e Comunicados</h2>
            <div className="space-y-6">
              <article className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>10 de Junho de 2025</span>
                  <i className="fas fa-tag ml-4 mr-2"></i>
                  <span>Alistamento Militar</span>
                  <i className="fas fa-eye ml-4 mr-2"></i>
                  <span>12.847 visualizações</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#243413]">Exército Brasileiro Inicia Nova Fase do Programa de Alistamento Temporário com 85.000 Vagas</h3>
                <p className="text-gray-700 text-sm mb-3">
                  O Comando do Exército anuncia oficialmente o início da nova fase do Programa de 
                  Alistamento Temporário, oferecendo 85.000 vagas para jovens brasileiros de 18 a 45 anos. 
                  Esta iniciativa representa a maior oportunidade de ingresso nas Forças Armadas 
                  dos últimos anos, proporcionando formação profissional, desenvolvimento pessoal 
                  e experiência militar valiosa para a carreira civil.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  O programa abrange diversas especialidades militares, incluindo infantaria, 
                  cavalaria, artilharia, engenharia, comunicações, logística e saúde. Os candidatos 
                  selecionados receberão treinamento militar especializado, capacitação técnica 
                  em suas áreas de atuação e certificações profissionais reconhecidas pelo mercado 
                  civil, contribuindo significativamente para seu desenvolvimento profissional futuro.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span><i className="fas fa-user mr-1"></i>Maj Comunicação Social</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>Comando do Exército - Brasília</span>
                  </div>
                  <button className="text-[#6a7d00] text-sm hover:underline">Leia mais</button>
                </div>
              </article>
              
              <article className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>08 de Junho de 2025</span>
                  <i className="fas fa-tag ml-4 mr-2"></i>
                  <span>Exercícios Militares</span>
                  <i className="fas fa-eye ml-4 mr-2"></i>
                  <span>9.234 visualizações</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#243413]">Exercício Conjunto Amazônia 2025 Demonstra Capacidade Operacional das Forças Armadas</h3>
                <p className="text-gray-700 text-sm mb-3">
                  Militares das três Forças Armadas participaram do maior exercício conjunto 
                  realizado na região amazônica em 2025, demonstrando alto nível de preparação 
                  e integração operacional. O exercício, que durou duas semanas, envolveu mais 
                  de 8.000 militares e testou protocolos de defesa da região amazônica, operações 
                  de cooperação interforças e resposta a ameaças transnacionais.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  Durante o exercício, foram testadas novas tecnologias de vigilância territorial, 
                  sistemas de comunicação integrada e táticas de combate em ambiente de selva. 
                  A operação também incluiu treinamento em operações ribeirinhas, proteção de 
                  infraestruturas críticas e cooperação com órgãos ambientais para combate ao 
                  desmatamento ilegal e crimes ambientais.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span><i className="fas fa-user mr-1"></i>Comando Militar da Amazônia</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>Manaus - AM</span>
                  </div>
                  <button className="text-[#6a7d00] text-sm hover:underline">Leia mais</button>
                </div>
              </article>
              
              <article className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>05 de Junho de 2025</span>
                  <i className="fas fa-tag ml-4 mr-2"></i>
                  <span>Inovação e Tecnologia</span>
                  <i className="fas fa-eye ml-4 mr-2"></i>
                  <span>15.567 visualizações</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#243413]">Centro de Desenvolvimento Tecnológico Apresenta Inovações em Defesa Nacional</h3>
                <p className="text-gray-700 text-sm mb-3">
                  O Centro de Desenvolvimento Tecnológico do Exército (CTEx) apresentou durante 
                  o Seminário de Inovação em Defesa 2025 uma série de tecnologias revolucionárias 
                  desenvolvidas pela instituição. Entre as principais inovações destacam-se sistemas 
                  autônomos de vigilância, drones de reconhecimento de longo alcance e tecnologias 
                  de comunicação criptografada de última geração.
                </p>
                <p className="text-gray-700 text-sm mb-3">
                  As tecnologias apresentadas representam investimento de R$ 450 milhões em 
                  pesquisa e desenvolvimento ao longo dos últimos cinco anos, consolidando o 
                  Brasil como referência em tecnologia militar na América Latina. O CTEx também 
                  anunciou parcerias estratégicas com universidades brasileiras e empresas de 
                  tecnologia para acelerar o desenvolvimento de soluções inovadoras em defesa.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span><i className="fas fa-user mr-1"></i>Centro de Desenvolvimento Tecnológico</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>Rio de Janeiro - RJ</span>
                  </div>
                  <button className="text-[#6a7d00] text-sm hover:underline">Leia mais</button>
                </div>
              </article>

              <article className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <i className="fas fa-calendar mr-2"></i>
                  <span>03 de Junho de 2025</span>
                  <i className="fas fa-tag ml-4 mr-2"></i>
                  <span>Ações Sociais</span>
                  <i className="fas fa-eye ml-4 mr-2"></i>
                  <span>7.891 visualizações</span>
                </div>
                <h3 className="font-semibold text-lg mb-3 text-[#243413]">Projeto Soldado Cidadão Beneficia Mais de 50.000 Jovens em 2025</h3>
                <p className="text-gray-700 text-sm mb-3">
                  O Projeto Soldado Cidadão, uma das principais iniciativas sociais do Exército 
                  Brasileiro, atingiu a marca de 50.000 jovens beneficiados em 2025. O programa 
                  oferece capacitação profissional, educação complementar e formação cidadã para 
                  jovens de comunidades vulneráveis em todo o país, contribuindo significativamente 
                  para a redução da desigualdade social e o fortalecimento do tecido social brasileiro.
                </p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex space-x-4 text-xs text-gray-500">
                    <span><i className="fas fa-user mr-1"></i>Departamento-Geral do Pessoal</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>Nacional</span>
                  </div>
                  <button className="text-[#6a7d00] text-sm hover:underline">Leia mais</button>
                </div>
              </article>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Assessoria de Imprensa</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Contatos para Imprensa</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <i className="fas fa-phone text-[#6a7d00] mr-3"></i>
                    <span className="text-sm">(61) 3415-5006</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-envelope text-[#6a7d00] mr-3"></i>
                    <span className="text-sm">imprensa@eb.mil.br</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fas fa-clock text-[#6a7d00] mr-3"></i>
                    <span className="text-sm">Segunda a Sexta: 8h às 17h</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Credenciamento</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Jornalistas interessados em cobrir eventos do Exército devem 
                  solicitar credenciamento através dos canais oficiais.
                </p>
                <button className="bg-[#6a7d00] text-white px-4 py-2 rounded hover:bg-[#5a6d00] transition-colors text-sm">
                  Solicitar Credenciamento
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Material para Download</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <i className="fas fa-image text-[#243413] text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Logotipos</h4>
                <p className="text-xs text-gray-600 mb-3">Logomarcas oficiais em alta resolução</p>
                <button className="text-[#6a7d00] text-sm hover:underline">Baixar</button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <i className="fas fa-file-pdf text-[#243413] text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Press Kit</h4>
                <p className="text-xs text-gray-600 mb-3">Informações institucionais</p>
                <button className="text-[#6a7d00] text-sm hover:underline">Baixar</button>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <i className="fas fa-camera text-[#243413] text-2xl mb-2"></i>
                <h4 className="font-semibold mb-2">Fotos</h4>
                <p className="text-xs text-gray-600 mb-3">Banco de imagens oficial</p>
                <button className="text-[#6a7d00] text-sm hover:underline">Acessar</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}