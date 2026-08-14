import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";

export default function FooterConteudosPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#243413] mb-6">Central de Conteúdos</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Biblioteca Digital Militar</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-[#243413] mb-2">Manuais e Regulamentos</h3>
                <p className="text-sm text-gray-600 mb-3">Documentos oficiais e procedimentos militares</p>
                <button className="bg-[#6a7d00] text-white px-4 py-2 rounded hover:bg-[#5a6d00] transition-colors">
                  Acessar Biblioteca
                </button>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold text-[#243413] mb-2">História Militar</h3>
                <p className="text-sm text-gray-600 mb-3">Arquivo histórico das operações e campanhas</p>
                <button className="bg-[#6a7d00] text-white px-4 py-2 rounded hover:bg-[#5a6d00] transition-colors">
                  Explorar História
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Recursos Educacionais</h2>
            <div className="space-y-4">
              <div className="flex items-center p-4 border-l-4 border-[#6a7d00] bg-gray-50">
                <i className="fas fa-video text-[#243413] text-xl mr-4"></i>
                <div>
                  <h3 className="font-semibold">Cursos Online</h3>
                  <p className="text-sm text-gray-600">Plataforma de ensino à distância para militares</p>
                </div>
              </div>
              <div className="flex items-center p-4 border-l-4 border-[#6a7d00] bg-gray-50">
                <i className="fas fa-book text-[#243413] text-xl mr-4"></i>
                <div>
                  <h3 className="font-semibold">Publicações Técnicas</h3>
                  <p className="text-sm text-gray-600">Artigos e estudos sobre defesa e segurança</p>
                </div>
              </div>
              <div className="flex items-center p-4 border-l-4 border-[#6a7d00] bg-gray-50">
                <i className="fas fa-graduation-cap text-[#243413] text-xl mr-4"></i>
                <div>
                  <h3 className="font-semibold">Material Didático</h3>
                  <p className="text-sm text-gray-600">Recursos para formação e capacitação</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-[#243413] mb-4">Acesso aos Sistemas</h2>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
                <span className="font-semibold text-yellow-800">Acesso Restrito</span>
              </div>
              <p className="text-sm text-yellow-700">
                O acesso aos sistemas internos requer credenciais válidas. 
                Entre em contato com sua unidade para obter as informações necessárias.
              </p>
            </div>
          </div>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}