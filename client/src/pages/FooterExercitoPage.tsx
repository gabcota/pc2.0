import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterExercitoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">O Exército Brasileiro</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">História e Missão</h2>
            <p className="text-gray-700 mb-4">
              O Exército Brasileiro é uma das três Forças singulares das Forças Armadas do Brasil, 
              responsável pelas operações militares em terra. Criado oficialmente em 1648 durante 
              a Guerra da Restauração Pernambucana, o Exército tem como missão fundamental defender 
              a Pátria, garantir os poderes constitucionais e participar do desenvolvimento nacional, 
              conforme estabelece a Constituição Federal de 1988.
            </p>
            <p className="text-gray-700 mb-4">
              Com mais de 375 anos de história ininterrupta, o Exército Brasileiro participou 
              ativamente da construção da nacionalidade brasileira, sendo uma instituição que 
              transcende sua missão constitucional ao contribuir significativamente para o 
              desenvolvimento socioeconômico do país. Desde as primeiras expedições de defesa 
              territorial até as modernas operações de paz da ONU, a Força Terrestre mantém 
              seus valores e tradições enquanto se adapta às demandas contemporâneas.
            </p>
            <p className="text-gray-700 mb-4">
              A trajetória histórica do Exército confunde-se com a própria formação do Brasil. 
              Durante o período colonial, as forças militares terrestres defenderam o território 
              contra invasões estrangeiras, participaram da expansão das fronteiras e garantiram 
              a soberania portuguesa sobre o vasto território sul-americano. No período imperial, 
              o Exército consolidou-se como instituição nacional, participando de conflitos como 
              a Guerra do Paraguai (1864-1870), que testou e fortaleceu a capacidade operacional 
              da força terrestre brasileira.
            </p>
            <p className="text-gray-700 mb-4">
              Durante a República, o Exército modernizou-se continuamente, incorporando novas 
              tecnologias e doutrinas militares. Participou de ambas as Guerras Mundiais, 
              notadamente enviando a Força Expedicionária Brasileira (FEB) para combater na 
              Itália durante a Segunda Guerra Mundial, demonstrando a capacidade do Brasil de 
              projetar poder militar além de suas fronteiras em defesa dos valores democráticos 
              e da liberdade internacional.
            </p>
            <p className="text-gray-700 mb-4">
              Atualmente, o Exército Brasileiro é reconhecido internacionalmente por sua 
              excelência operacional, capacidade de adaptação e contribuição para a paz mundial. 
              Mantém aproximadamente 190.000 militares em atividade, distribuídos em todo o 
              território nacional através de 12 Comandos Militares de Área, garantindo presença 
              estratégica em todas as regiões do país, especialmente nas fronteiras e áreas 
              de interesse nacional como a Amazônia.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Valores Fundamentais e Filosofia Institucional</h2>
            <p className="text-gray-700 mb-6">
              O Exército Brasileiro fundamenta sua ação em valores milenares que constituem o alicerce 
              da identidade militar e orientam o comportamento de todos os seus integrantes. Estes 
              valores não são meros conceitos abstratos, mas princípios vivenciados diariamente que 
              moldam o caráter e a conduta dos soldados brasileiros em todas as circunstâncias.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="bg-[#243413] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-shield-alt text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Honra</h3>
                <p className="text-sm text-gray-600">
                  Princípio fundamental que orienta todas as ações militares, manifestando-se através 
                  da retidão moral, probidade, dignidade pessoal e institucional. A honra militar 
                  transcende o cumprimento formal do dever, exigindo que cada ação seja pautada pela 
                  justiça, verdade e lealdade aos compromissos assumidos.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#243413] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-flag text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Pátria</h3>
                <p className="text-sm text-gray-600">
                  Dedicação total à defesa da soberania nacional, manifestada através do amor 
                  incondicional ao Brasil, seus símbolos, território e povo. Este valor implica 
                  o sacrifício pessoal em prol do bem comum e a disposição de defender os interesses 
                  nacionais acima de qualquer interesse particular ou corporativo.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-[#243413] text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-users text-2xl"></i>
                </div>
                <h3 className="font-semibold mb-2">Instituição</h3>
                <p className="text-sm text-gray-600">
                  Compromisso com os valores e tradições militares, manifestado através da fidelidade 
                  aos princípios institucionais, respeito à hierarquia e disciplina, e dedicação 
                  ao aperfeiçoamento contínuo da organização militar como instrumento a serviço 
                  da sociedade brasileira.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold text-[#243413] mb-3">Código de Ética Militar</h3>
              <p className="text-gray-700 text-sm mb-3">
                O comportamento ético do militar brasileiro é regulamentado por um conjunto abrangente 
                de normas que estabelecem padrões de conduta tanto na vida profissional quanto pessoal. 
                Este código baseia-se nos princípios da legalidade, impessoalidade, moralidade, 
                publicidade e eficiência, garantindo que a atuação militar esteja sempre alinhada 
                com os melhores interesses da sociedade.
              </p>
              <p className="text-gray-700 text-sm">
                A ética militar brasileira enfatiza a importância da transparência nas ações, 
                responsabilidade social, respeito aos direitos humanos e compromisso com a 
                democracia e o Estado de Direito. Estes princípios são constantemente reforçados 
                através de programas de educação continuada e exemplos de liderança em todos os 
                níveis da hierarquia militar.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Estrutura Organizacional e Comando</h2>
            <p className="text-gray-700 mb-6">
              A estrutura organizacional do Exército Brasileiro reflete a complexidade e abrangência 
              de suas missões, distribuindo-se hierarquicamente desde o Comando do Exército até as 
              menores frações operacionais. Esta organização permite resposta eficaz às demandas 
              de segurança e defesa em todo o território nacional, mantendo a unidade de comando 
              e a eficiência operacional.
            </p>
            <div className="space-y-6">
              <div className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2">Comando do Exército (C Ex)</h3>
                <p className="text-gray-700 mb-3">
                  Órgão superior de direção geral do Exército Brasileiro, responsável pelo planejamento, 
                  coordenação e controle de todas as atividades da Força Terrestre. Localizado em 
                  Brasília, o Comando do Exército formula as políticas estratégicas, diretrizes 
                  doutrinárias e coordena a execução das missões constitucionais.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Principais Órgãos:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Estado-Maior do Exército (EME)</li>
                      <li>Departamento de Ciência e Tecnologia (DCT)</li>
                      <li>Departamento de Educação e Cultura (DEC)</li>
                      <li>Departamento de Engenharia e Construção (DEC)</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Comandos Subordinados:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Comando de Operações Terrestres (COTER)</li>
                      <li>Comando Logístico (COLOG)</li>
                      <li>Secretaria de Economia e Finanças (SEF)</li>
                      <li>Departamento-Geral do Pessoal (DGP)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2">Comandos Militares de Área (CMA)</h3>
                <p className="text-gray-700 mb-3">
                  Organização territorial estratégica que divide o país em 12 Comandos Militares de Área, 
                  cada um responsável pela defesa de uma região específica. Esta divisão considera 
                  fatores geográficos, estratégicos e operacionais, garantindo presença militar 
                  efetiva em todo o território nacional, especialmente nas fronteiras e áreas sensíveis.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Região Norte:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>CMA - Comando Militar da Amazônia</li>
                      <li>8ª Região Militar</li>
                      <li>12ª Região Militar</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Região Nordeste:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>CMN - Comando Militar do Nordeste</li>
                      <li>6ª Região Militar</li>
                      <li>7ª Região Militar</li>
                      <li>10ª Região Militar</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Região Sul:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>CMS - Comando Militar do Sul</li>
                      <li>3ª Região Militar</li>
                      <li>5ª Região Militar</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-[#6a7d00] pl-6 bg-gray-50 p-4 rounded-r-lg">
                <h3 className="font-semibold text-lg mb-2">Organizações Militares (OM)</h3>
                <p className="text-gray-700 mb-3">
                  Unidades operacionais básicas distribuídas estrategicamente pelo território nacional, 
                  constituindo a estrutura operacional fundamental do Exército. Incluem desde grandes 
                  comandos de Divisão de Exército até pequenos destacamentos de fronteira, cada um 
                  com missões específicas adequadas à sua localização e capacidades.
                </p>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold mb-1">Grandes Unidades:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Divisões de Exército (DE)</li>
                      <li>Brigadas de Infantaria (Bda Inf)</li>
                      <li>Brigadas Blindadas (Bda Bld)</li>
                      <li>Brigadas de Cavalaria Mecanizada</li>
                      <li>Brigadas de Artilharia Antiaérea</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Unidades Especializadas:</h4>
                    <ul className="list-disc list-inside text-gray-600">
                      <li>Batalhões de Forças Especiais</li>
                      <li>Batalhões de Infantaria de Selva</li>
                      <li>Batalhões de Engenharia</li>
                      <li>Batalhões Logísticos</li>
                      <li>Pelotões de Fronteira (PEFRON)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Missões Constitucionais e Operacionais</h2>
            <p className="text-gray-700 mb-6">
              O Exército Brasileiro atua em múltiplas frentes para cumprir suas responsabilidades 
              constitucionais, que vão além da defesa nacional tradicional. A Constituição Federal 
              de 1988 estabelece três missões principais: defesa da Pátria, garantia dos poderes 
              constitucionais e participação no desenvolvimento nacional.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h3 className="font-semibold text-green-800 mb-3 flex items-center">
                  <i className="fas fa-shield-alt mr-2"></i>
                  Defesa Nacional
                </h3>
                <p className="text-green-700 text-sm mb-3">
                  Proteção da integridade territorial, soberania nacional e interesses estratégicos 
                  do Brasil. Inclui a vigilância e defesa das fronteiras, especialmente na região 
                  amazônica, e a capacidade de dissuasão contra ameaças externas.
                </p>
                <ul className="text-green-700 text-sm list-disc list-inside">
                  <li>Operação Ágata (fronteiras)</li>
                  <li>Operação Verde Brasil (Amazônia)</li>
                  <li>Sistema Integrado de Monitoramento de Fronteiras</li>
                  <li>Projeto Soldado Cidadão</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <i className="fas fa-balance-scale mr-2"></i>
                  Garantia da Lei e da Ordem
                </h3>
                <p className="text-blue-700 text-sm mb-3">
                  Apoio aos poderes constituídos em situações de grave perturbação da ordem pública 
                  ou ameaça à estabilidade institucional, sempre respeitando os princípios democráticos 
                  e os direitos fundamentais.
                </p>
                <ul className="text-blue-700 text-sm list-disc list-inside">
                  <li>Operações de Garantia da Lei e da Ordem (GLO)</li>
                  <li>Apoio à segurança de grandes eventos</li>
                  <li>Proteção de infraestruturas críticas</li>
                  <li>Assistência a desastres naturais</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Modernização e Projetos Estratégicos</h2>
            <p className="text-gray-700 mb-6">
              O Exército Brasileiro investe continuamente na modernização de seus equipamentos, 
              doutrina e capacidades operacionais. O Programa de Excelência Gerencial (PEG-EB) 
              e o Sistema Integrado de Monitoramento de Fronteiras (SISFRON) representam marcos 
              importantes na transformação da Força Terrestre.
            </p>
            <div className="space-y-6">
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                <h3 className="font-semibold text-purple-800 mb-3">SISFRON - Sistema Integrado de Monitoramento de Fronteiras</h3>
                <p className="text-purple-700 text-sm mb-3">
                  Projeto estratégico que visa modernizar o monitoramento e controle das fronteiras 
                  terrestres brasileiras através da integração de sensores, sistemas de comunicação 
                  e centros de comando e controle. O SISFRON representa um salto tecnológico 
                  significativo na capacidade de vigilância territorial.
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-semibold text-purple-800">Tecnologias:</h4>
                    <ul className="list-disc list-inside text-purple-700">
                      <li>Radares de vigilância terrestre</li>
                      <li>Sensores ópticos e térmicos</li>
                      <li>Sistemas de comunicação digital</li>
                      <li>Plataformas aéreas não tripuladas</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Abrangência:</h4>
                    <ul className="list-disc list-inside text-purple-700">
                      <li>16.886 km de fronteira terrestre</li>
                      <li>10 países limítrofes</li>
                      <li>588 municípios de fronteira</li>
                      <li>11 milhões de habitantes</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-purple-800">Benefícios:</h4>
                    <ul className="list-disc list-inside text-purple-700">
                      <li>Combate ao crime transnacional</li>
                      <li>Proteção ambiental</li>
                      <li>Controle migratório</li>
                      <li>Desenvolvimento regional</li>
                    </ul>
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