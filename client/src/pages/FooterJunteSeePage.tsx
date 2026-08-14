import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterJunteSeePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">Junte-se a Nós</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Carreira Militar: Vocação para Servir o Brasil</h2>
            <p className="text-gray-700 mb-4">
              O Exército Brasileiro oferece múltiplas trajetórias profissionais para quem deseja 
              dedicar sua vida ao serviço da Pátria. Com mais de 375 anos de tradição e excelência, 
              nossa instituição proporciona formação integral, desenvolvimento de liderança e 
              oportunidades de crescimento pessoal e profissional incomparáveis.
            </p>
            <p className="text-gray-700 mb-4">
              A carreira militar transcende a simples profissão, constituindo um verdadeiro 
              projeto de vida baseado nos valores da honra, patriotismo e dedicação institucional. 
              Nossos militares são formados para serem líderes em suas comunidades, agentes de 
              transformação social e guardiões da democracia brasileira.
            </p>
            <p className="text-gray-700 mb-6">
              Independentemente da forma de ingresso escolhida, todos os militares do Exército 
              Brasileiro participam de um processo contínuo de formação e aperfeiçoamento que 
              combina excelência técnica, desenvolvimento humano e compromisso social. Nossa 
              missão é formar não apenas soldados, mas cidadãos exemplares e líderes preparados 
              para os desafios do século XXI.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-[#6a7d00] rounded-lg p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-graduation-cap text-[#243413] text-3xl mb-2"></i>
                  <h3 className="font-semibold text-lg">Escola Preparatória de Cadetes do Exército (EsPCEx)</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Estabelecimento de ensino destinado à formação inicial de futuros oficiais do Exército. 
                  Localizada em Campinas/SP, oferece ensino médio integrado com preparação militar específica.
                </p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>• Formação inicial de cadetes (18-22 anos)</li>
                  <li>• Preparação para Academia Militar das Agulhas Negras</li>
                  <li>• Ensino médio integrado com disciplinas militares</li>
                  <li>• Desenvolvimento de liderança e caráter</li>
                  <li>• Atividades físicas e treinamento militar</li>
                  <li>• Formação em valores éticos e cívicos</li>
                </ul>
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mb-3">
                  <strong>Requisitos:</strong> Ensino fundamental completo, idade entre 17-18 anos, 
                  aprovação em concurso público específico, exames médicos e físicos.
                </div>
                <button className="w-full mt-2 bg-[#6a7d00] text-white py-2 rounded hover:bg-[#5a6d00] transition-colors">
                  Saiba Mais sobre EsPCEx
                </button>
              </div>
              
              <div className="border-2 border-[#6a7d00] rounded-lg p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-star text-[#243413] text-3xl mb-2"></i>
                  <h3 className="font-semibold text-lg">Academia Militar das Agulhas Negras (AMAN)</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Principal estabelecimento de formação de oficiais do Exército Brasileiro. 
                  Localizada em Resende/RJ, forma oficiais da linha de ensino militar bélico.
                </p>
                <ul className="text-sm space-y-2 mb-4">
                  <li>• Formação de oficiais combatentes (5 anos)</li>
                  <li>• Curso superior em Ciências Militares</li>
                  <li>• Especialização em Infantaria, Cavalaria, Artilharia ou Engenharia</li>
                  <li>• Desenvolvimento de liderança e comando</li>
                  <li>• Estágios operacionais em unidades do Exército</li>
                  <li>• Formação acadêmica reconhecida pelo MEC</li>
                </ul>
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mb-3">
                  <strong>Requisitos:</strong> Aprovação na EsPCEx ou curso superior completo, 
                  idade até 24 anos, aprovação em concurso específico.
                </div>
                <button className="w-full mt-2 bg-[#6a7d00] text-white py-2 rounded hover:bg-[#5a6d00] transition-colors">
                  Saiba Mais sobre AMAN
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Formação de Sargentos e Praças</h2>
            <p className="text-gray-700 mb-6">
              O Exército Brasileiro oferece múltiplas oportunidades para formação de sargentos e praças, 
              profissionais especializados essenciais para o funcionamento operacional da Força Terrestre. 
              Estes militares são responsáveis pela execução técnica das missões e pelo treinamento 
              e liderança das frações menores.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-tools text-[#243413] text-2xl mb-2"></i>
                  <h3 className="font-semibold text-[#243413]">Escola de Sargentos das Armas (ESA)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Formação de sargentos especialistas em combate e apoio ao combate. 
                  Curso de 2 anos com formação técnica e militar.
                </p>
                <ul className="text-gray-700 text-xs list-disc list-inside mb-3">
                  <li>Infantaria, Cavalaria, Artilharia</li>
                  <li>Engenharia, Comunicações</li>
                  <li>Intendência, Saúde</li>
                  <li>Música Militar</li>
                </ul>
                <div className="text-xs text-gray-600">
                  <strong>Local:</strong> Três Corações/MG<br/>
                  <strong>Duração:</strong> 2 anos
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-laptop-code text-[#243413] text-2xl mb-2"></i>
                  <h3 className="font-semibold text-[#243413]">Escola de Formação Complementar (EsFCEx)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Formação de sargentos técnicos temporários em áreas específicas. 
                  Ideal para profissionais com formação técnica prévia.
                </p>
                <ul className="text-gray-700 text-xs list-disc list-inside mb-3">
                  <li>Informática e TI</li>
                  <li>Saúde e Enfermagem</li>
                  <li>Aviação e Manutenção</li>
                  <li>Topografia e Cartografia</li>
                </ul>
                <div className="text-xs text-gray-600">
                  <strong>Local:</strong> Salvador/BA<br/>
                  <strong>Duração:</strong> 1 ano
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="text-center mb-4">
                  <i className="fas fa-user-tie text-[#243413] text-2xl mb-2"></i>
                  <h3 className="font-semibold text-[#243413]">Centro de Instrução de Guerra na Selva (CIGS)</h3>
                </div>
                <p className="text-gray-700 text-sm mb-3">
                  Formação especializada em operações na selva amazônica. 
                  Reconhecido mundialmente pela excelência em guerra de selva.
                </p>
                <ul className="text-gray-700 text-xs list-disc list-inside mb-3">
                  <li>Sobrevivência na selva</li>
                  <li>Operações ribeirinhas</li>
                  <li>Combate em ambiente tropical</li>
                  <li>Proteção da biodiversidade</li>
                </ul>
                <div className="text-xs text-gray-600">
                  <strong>Local:</strong> Manaus/AM<br/>
                  <strong>Duração:</strong> Variável
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Processo Seletivo Temporário</h2>
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <i className="fas fa-clipboard-check text-[#243413] text-2xl mr-3"></i>
                <h3 className="font-semibold text-lg text-[#243413]">Alistamento em Andamento</h3>
              </div>
              <p className="text-gray-700 mb-4">
                Estão abertas as inscrições para o alistamento temporário no Exército Brasileiro. 
                Não perca esta oportunidade de servir à Pátria!
              </p>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="font-bold text-2xl text-[#243413]">85.000</div>
                  <div className="text-sm text-gray-700">Vagas Disponíveis</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-[#243413]">18-45</div>
                  <div className="text-sm text-gray-700">Idade (anos)</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-2xl text-[#243413]">12</div>
                  <div className="text-sm text-gray-700">Meses de Serviço</div>
                </div>
              </div>
              <button className="w-full bg-[#6a7d00] text-white py-3 rounded-lg font-semibold hover:bg-[#5a6d00] transition-colors">
                Iniciar Alistamento Agora
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Benefícios da Carreira Militar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-heart text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Assistência Médica</h4>
                    <p className="text-sm text-gray-600">Atendimento completo para militares e familiares</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-home text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Moradia</h4>
                    <p className="text-sm text-gray-600">Alojamentos e auxílio-moradia disponíveis</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-utensils text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Alimentação</h4>
                    <p className="text-sm text-gray-600">Refeições balanceadas nos quartéis</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <i className="fas fa-graduation-cap text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Educação</h4>
                    <p className="text-sm text-gray-600">Cursos de especialização e formação continuada</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-plane text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Viagens</h4>
                    <p className="text-sm text-gray-600">Missões em diferentes regiões do país</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <i className="fas fa-medal text-[#243413] mt-1 mr-3"></i>
                  <div>
                    <h4 className="font-semibold">Reconhecimento</h4>
                    <p className="text-sm text-gray-600">Condecorações e progressão na carreira</p>
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