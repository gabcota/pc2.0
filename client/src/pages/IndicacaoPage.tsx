import { useState } from 'react';
import { ExercitoHeader } from '../components/ExercitoHeader';
import { ExercitoFooter } from '../components/ExercitoFooter';
import { Copy, Share2, MessageCircle, Users, CheckCircle, Gift, Shield, DollarSign, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { useToast } from '../hooks/use-toast';
import { useClarityEvents } from '../hooks/use-clarity-events';

export function IndicacaoPage() {
  const [linkCopiado, setLinkCopiado] = useState(false);
  const { toast } = useToast();
  const { trackEvent, trackSharingBehavior } = useClarityEvents();
  
  // Link único de indicação usando o domínio atual
  const linkIndicacao = `${window.location.origin}?ref=${Math.random().toString(36).substr(2, 8)}`;
  
  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkIndicacao);
      setLinkCopiado(true);
      
      // Track sharing behavior - link copy
      trackSharingBehavior('copy_link', 'referral_program');
      
      toast({
        title: "Link copiado!",
        description: "O link de indicação foi copiado para sua área de transferência.",
      });
      setTimeout(() => setLinkCopiado(false), 3000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const compartilharWhatsApp = () => {
    const mensagem = encodeURIComponent(
      `📊 IBGE - PSS 2026 - CENSO AGROPECUÁRIO - PROCESSO SELETIVO\n\n` +
      `Vagas com salarios de R$ 2.000 a R$ 3.700\n\n` +
      `✅ Emprego temporario no servico publico federal\n` +
      `✅ Agente de Pesquisa e Mapeamento\n` +
      `✅ Atuacao em todo o Brasil\n` +
      `✅ Diarias + beneficios para deslocamento\n\n` +
      `Inscreva-se no portal oficial: ${linkIndicacao}`
    );
    
    // Track sharing behavior - WhatsApp share
    trackSharingBehavior('share_whatsapp', 'referral_program', 'whatsapp');
    
    window.open(`https://wa.me/?text=${mensagem}`, '_blank');
  };

  const compartilharTikTok = () => {
    const texto = encodeURIComponent(
      `IBGE abrindo vagas para o Censo Agropecuario 2027! PSS 2026 com atuacao em todo o Brasil. Cadastre-se: ${linkIndicacao}`
    );
    
    // Track sharing behavior - TikTok share
    trackSharingBehavior('share_tiktok', 'referral_program', 'tiktok');
    
    window.open(`https://www.tiktok.com/share?text=${texto}`, '_blank');
  };

  const compartilharInstagram = () => {
    const texto = `🇧🇷 POLÍCIA RODOVIÁRIA FEDERAL - CONCURSO 2026\n\n1.011 vagas • Salários R$ 5.173–17.484\nCargo efetivo com estabilidade • Atuação nacional\n\nCadastro: ${linkIndicacao}`;
    navigator.clipboard.writeText(texto);
    
    // Track sharing behavior - Instagram share
    trackSharingBehavior('share_instagram', 'referral_program', 'instagram');
    
    toast({
      title: "Texto copiado!",
      description: "Cole no seu Stories do Instagram para compartilhar.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ExercitoHeader />
      
      <main className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header de Confirmação */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" style={{ backgroundColor: '#EFF6FC' }}>
            <CheckCircle className="w-10 h-10" style={{ color: '#0063AF' }} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Inscrição Confirmada com Sucesso
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Sua participação no processo seletivo está garantida. Agora você pode participar do 
            <span className="font-semibold" style={{ color: '#0063AF' }}> Programa de Indicação IBGE</span> e 
            receber benefícios por cada candidato que indicar.
          </p>
        </div>

        {/* Programa Principal */}
        <div className="border-l-4 p-8 mb-8" style={{ borderLeftColor: '#0063AF', backgroundColor: '#EFF6FC' }}>
          <div className="flex items-center mb-4">
            <Shield className="w-8 h-8 mr-3" style={{ color: '#0063AF' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#0063AF' }}>
              Programa de Indicação IBGE
            </h2>
          </div>
          <p className="text-lg text-gray-700 mb-6 leading-relaxed">
            O IBGE reconhece a importância do recrutamento colaborativo para fortalecer 
            o quadro do PSS Censo Agropecuário. Por cada candidato qualificado que você indicar e que complete 
            sua inscrição, você receberá uma gratificação de <strong>R$ 50,00</strong>.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#EFF6FC' }}>
                <DollarSign className="w-8 h-8" style={{ color: '#0063AF' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#0063AF' }}>R$ 50</div>
              <div className="text-sm text-gray-600">Por indicação validada</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#EFF6FC' }}>
                <Calendar className="w-8 h-8" style={{ color: '#0063AF' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#0063AF' }}>Semanal</div>
              <div className="text-sm text-gray-600">Frequência de pagamento</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center" style={{ backgroundColor: '#EFF6FC' }}>
                <Users className="w-8 h-8" style={{ color: '#0063AF' }} />
              </div>
              <div className="text-2xl font-bold mb-1" style={{ color: '#0063AF' }}>Ilimitado</div>
              <div className="text-sm text-gray-600">Número de indicações</div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Processo de Indicação:</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0063AF' }}>1</div>
                <div className="text-sm font-medium text-gray-900">Compartilhe</div>
                <div className="text-xs text-gray-600">Envie seu link personalizado</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0063AF' }}>2</div>
                <div className="text-sm font-medium text-gray-900">Cadastro</div>
                <div className="text-xs text-gray-600">Indicado se inscreve</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0063AF' }}>3</div>
                <div className="text-sm font-medium text-gray-900">Validação</div>
                <div className="text-xs text-gray-600">Pagamento confirmado</div>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold" style={{ backgroundColor: '#0063AF' }}>4</div>
                <div className="text-sm font-medium text-gray-900">Recebimento</div>
                <div className="text-xs text-gray-600">R$50 via Pix ou transferência</div>
              </div>
            </div>
          </div>
        </div>
        {/* Canais de Compartilhamento */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: '#0063AF' }}>Canais de Divulgação Recomendados</CardTitle>
            <p className="text-gray-600">Maximize seu alcance utilizando diferentes plataformas digitais</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button
                onClick={compartilharWhatsApp}
                className="w-full h-16 bg-green-500 hover:bg-green-600 text-white text-left justify-start"
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                <div>
                  <div className="font-semibold">WhatsApp</div>
                  <div className="text-xs opacity-90">Grupos e contatos pessoais</div>
                </div>
              </Button>
              
              <Button
                onClick={compartilharTikTok}
                className="w-full h-16 bg-black hover:bg-gray-800 text-white text-left justify-start"
              >
                <span className="text-2xl mr-3">📱</span>
                <div>
                  <div className="font-semibold">TikTok</div>
                  <div className="text-xs opacity-90">Vídeos e publicações</div>
                </div>
              </Button>
              
              <Button
                onClick={compartilharInstagram}
                className="w-full h-16 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-left justify-start"
              >
                <span className="text-2xl mr-3">📷</span>
                <div>
                  <div className="font-semibold">Instagram</div>
                  <div className="text-xs opacity-90">Stories e feed</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard de Indicações */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle style={{ color: '#0063AF' }}>Painel de Controle - Suas Indicações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#0063AF' }}>0</div>
                <div className="text-sm text-gray-600">Compartilhamentos</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#0063AF' }}>0</div>
                <div className="text-sm text-gray-600">Cliques no link</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#0063AF' }}>0</div>
                <div className="text-sm text-gray-600">Inscrições validadas</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-1" style={{ color: '#0063AF' }}>R$ 0</div>
                <div className="text-sm text-gray-600">Valor acumulado</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 border border-blue-200 rounded-lg" style={{ backgroundColor: '#f0f7ff' }}>
              <div className="text-sm text-blue-900">
                <strong>📍 Recebimento dos benefícios:</strong> Os valores serão pagos via Pix ou transferência bancária 
                conforme dados cadastrados. Você receberá as instruções detalhadas por e-mail.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas Técnicas */}
        <div className="bg-gray-100 rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Regulamentação do Programa</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#0063AF' }}></div>
              <span>O valor de R$50 será liberado após confirmação do pagamento do indicado.</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#0063AF' }}></div>
              <span>Os pagamentos das indicações são realizados semanalmente.</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#0063AF' }}></div>
              <span>Apenas inscrições pagas com CPF diferente e validadas contam como válidas.</span>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 rounded-full mt-2 mr-3" style={{ backgroundColor: '#0063AF' }}></div>
              <span>O programa é válido até o encerramento do período de inscrições ou preenchimento das vagas.</span>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Acompanhamento do Processo</h3>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-gray-900 mb-2">Confirmação de Pagamento</div>
              <div className="text-sm text-gray-600">Aguarde o e-mail de confirmação com os detalhes da sua inscrição e instruções para a próxima fase.</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-gray-900 mb-2">Convocação para Seleção</div>
              <div className="text-sm text-gray-600">Você receberá informações sobre local, data e horário dos procedimentos seletivos.</div>
            </div>
            <div className="p-4 bg-white rounded-lg border">
              <div className="font-semibold text-gray-900 mb-2">Relatório de Indicações</div>
              <div className="text-sm text-gray-600">Acompanhe o status das suas indicações e valores a receber por e-mail semanal.</div>
            </div>
          </div>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}