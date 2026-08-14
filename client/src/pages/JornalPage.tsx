import { useState, useEffect } from 'react';
import { AgHeader } from '@/components/AgHeader';
import { AgFooter } from '@/components/AgFooter';
import { SecurityLoader } from '@/components/SecurityLoader';
import { markFunnelValidated } from '@/lib/funnelGate';

const ink = '#111213';
const mid = '#3D3D3D';
const muted = '#6B7280';
const border = '#D1D5DB';
const red = '#C0392B';
const light = '#F9F9F7';
const white = '#FFFFFF';

const artigos = [
  {
    tag: 'ANÁLISE',
    tagColor: red,
    titulo: 'PSS IBGE 2026: vagas para o Censo Agropecuário, etapas de seleção e contrato temporário com benefícios',
    subtitulo: 'A seleção contempla todo o território nacional com o cargo de Agente de Pesquisa e Mapeamento. Candidatos relatam que a preparação antecipada foi o fator mais determinante.',
    corpo: `O Processo Seletivo Simplificado do IBGE prevê contratação temporária para o cargo de Agente de Pesquisa e Mapeamento para realização do Censo Agropecuário 2027 em municípios de todo o território nacional.

A seleção é composta por análise de títulos e, quando aplicável, entrevista de perfil. Inscrições realizadas exclusivamente pelo portal oficial do IBGE conforme edital publicado no Diário Oficial da União.`,
    destaque: true,
  },
  {
    tag: 'CARGOS',
    tagColor: '#0063AF',
    titulo: 'Agente de Pesquisa e Mapeamento: cargo de nível médio acessível para todos',
    subtitulo: 'O PSS do IBGE é acessível a candidatos com ensino médio completo, sem restrição de área de formação.',
    corpo: `As vagas do PSS IBGE 2026 destinam-se ao cargo de Agente de Pesquisa e Mapeamento, com atuacao em municipios de todo o territorio nacional. Exige-se ensino medio completo como escolaridade minima. Os requisitos exatos devem ser conferidos no edital oficial publicado no Diario Oficial da Uniao.`,
    destaque: false,
  },
  {
    tag: 'PREPARAÇÃO',
    tagColor: '#276749',
    titulo: 'Quem começa antes do edital tem meses de vantagem — e os dados confirmam',
    subtitulo: 'Conteúdo-base de Direito Constitucional, Penal, Administrativo e Português é estável entre edições da CEBRASPE.',
    corpo: `Candidatos aprovados apontam consistentemente a antecipação como o fator mais determinante. Disciplinas como Língua Portuguesa, Raciocínio Lógico, Direito Constitucional, Penal e Administrativo compõem o núcleo comum de provas e raramente sofrem alterações entre edições. Quem inicia a preparação antes da publicação do edital chega com conteúdo dominado — e usa o período pós-edital para ajuste fino.`,
    destaque: false,
  },
];

const manchetes = [
  { tag:'PREPARACAO', texto:'Candidatos relatam: iniciar antes da publicação do edital foi decisivo para aprovação' },
  { tag:'REMUNERAÇÃO', texto:'Agente de Pesquisa e Mapeamento: remuneração + diárias — valores no edital oficial' },
  { tag:'BENEFICIOS', texto:'Diárias de campo, auxílio-alimentação, FGTS e 13º salário proporcional' },
  { tag:'ISENCAO', texto:'Inscritos no CadUnico com renda até 3 SM podem ter isenção de taxa' },
  { tag:'VAGAS', texto:'Vagas distribuídas em municípios de todo o território nacional — PSS IBGE 2026' },
];

const cargosTabela = [
  { cargo:'Agente de Pesquisa e Mapeamento',  formacao:'Ensino médio completo',  vagas:'Conforme edital', salario:'Conforme edital' },
];

const etapas = [
  { n:'I',   nome:'Inscrição Online',      detalhe:'Preenchimento do formulário no portal oficial do IBGE' },
  { n:'II',  nome:'Análise de Títulos',    detalhe:'Avaliação de escolaridade, experiências e cursos complementares' },
  { n:'III', nome:'Entrevista de Perfil',  detalhe:'Verificação de aptidão para atividades de campo (quando aplicável)' },
  { n:'IV',  nome:'Contratação',           detalhe:'Assinatura do contrato temporário conforme Lei 8.745/1993' },
  { n:'V',   nome:'Treinamento',           detalhe:'Capacitação obrigatória em metodologia de coleta e uso de equipamentos' },
];

const depoimentos = [
  { nome:'Rodrigo M.', cargo:'Agente de Pesquisa — SP', texto:'"Quando parei de tentar cobrir tudo e comecei a me preparar exatamente para o que o IBGE avalia, consegui a vaga. A questao nunca foi estudar mais — foi estudar o que faz diferenca na selecao."' },
  { nome:'Fernanda L.', cargo:'Agente de Pesquisa — MG', texto:'"Consegui a vaga porque me preparei antes do edital sair. Conhecer bem a metodologia do IBGE e os roteiros de coleta foi decisivo na entrevista de perfil."' },
  { nome:'Carlos A.',  cargo:'Agente de Mapeamento — RJ', texto:'"Ler o edital completo antes de qualquer outra coisa poupou semanas. O que o IBGE avalia na análise de títulos é previsível — é só estar com a documentação certa em mãos."' },
];

const faqs = [
  { q:'Qual e a escolaridade minima para o PSS IBGE 2026?', r:'Ensino medio completo para o cargo de Agente de Pesquisa e Mapeamento. Confirme os requisitos no edital oficial publicado no Diario Oficial da Uniao.' },
  { q:'Existe limite de idade para participar?', r:'Em geral nao ha limite de idade para o PSS do IBGE. O criterio pode variar entre edicoes — consulte sempre o edital oficial publicado no Diario Oficial da Uniao.' },
  { q:'Preciso de um curso preparatorio pago?', r:'Nao. O PSS do IBGE avalia titulos e, quando aplicavel, realiza entrevista de perfil. Organizar sua documentacao com antecedencia e conhecer a metodologia do Censo Agropecuario e o que faz diferenca.' },
  { q:'O treinamento e remunerado?', r:'Sim. Com base em edicoes anteriores, os contratados recebem remuneracao durante o treinamento obrigatorio realizado pelo IBGE antes do inicio das atividades de campo. Confirme no edital da edicao correspondente.' },
  { q:'Posso me preparar antes de o edital ser publicado?', r:'Sim — e os aprovados recomendam. Conhecer a metodologia dos Censos do IBGE, os tipos de pesquisa e os roteiros de coleta sao diferenciais constantes entre edicoes. Quem comeca antes chega com vantagem.' },
  { q:'Quanto tempo leva do edital a contratacao?', r:'Com base no historico de edicoes anteriores, entre 6 e 12 meses para candidatos classificados dentro das vagas. Candidatos em cadastro de reserva podem aguardar mais tempo, dependendo de convocacoes adicionais.' },
];

export default function JornalPage() {
  const [openFaq, setOpenFaq] = useState<number|null>(null);
  const today = new Date().toLocaleDateString('pt-BR', { day:'numeric', month:'long', year:'numeric' });
  const hasAdParam = (() => {
    const p = new URLSearchParams(window.location.search);
    return p.has("gclid") || p.has("gbraid");
  })();

  const [isRedirecting] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.has('gclid') || params.has('gbraid');
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasAdParam) {
        localStorage.setItem("joseneto", "true");
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [hasAdParam]);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (isRedirecting) {
    return <SecurityLoader />;
  }

  return (
    <div style={{ fontFamily:"'Georgia','Times New Roman',serif",color:ink,background:white,minHeight:'100vh',display:'flex',flexDirection:'column' }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .jp-tag{display:inline-block;font-size:10px;font-weight:800;letter-spacing:1.2px;text-transform:uppercase;padding:3px 8px;border-radius:2px;font-family:Arial,sans-serif;margin-bottom:8px}
        .jp-h2{font-size:22px;font-weight:900;line-height:1.25;color:${ink};margin-bottom:6px}
        .jp-h3{font-size:16px;font-weight:700;line-height:1.35;color:${ink};margin-bottom:5px}
        .jp-sub{font-size:14px;color:${mid};line-height:1.6;font-style:italic;margin-bottom:12px;font-family:Arial,sans-serif}
        .jp-body{font-size:15px;color:${mid};line-height:1.85}
        .jp-rule{border:none;border-top:1px solid ${border};margin:0}
        .jp-col2{display:grid;grid-template-columns:1fr 1fr;gap:0}
        .jp-col3{display:grid;grid-template-columns:2fr 1fr 1fr;gap:0}
        .jp-faq-btn{width:100%;text-align:left;padding:14px 0;background:none;border:none;cursor:pointer;font-family:Georgia,serif;font-size:15px;font-weight:700;color:${ink};display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid ${border}}
        .jp-faq-btn:hover{color:${red}}
        @media(max-width:768px){.jp-col2,.jp-col3{grid-template-columns:1fr}}
      `}</style>

      <AgHeader />

      <main style={{ flex:1,maxWidth:1200,margin:'0 auto',padding:'0 24px 80px',width:'100%' }}>

        {/* Linha de data + manchetes scrolláveis */}
        <div style={{ borderTop:`3px solid ${ink}`,borderBottom:`1px solid ${border}`,padding:'8px 0',display:'flex',alignItems:'center',gap:16,overflowX:'auto',marginTop:0 }}>
          <span style={{ fontSize:11,color:muted,fontFamily:'Arial,sans-serif',whiteSpace:'nowrap',flexShrink:0 }}>{today}</span>
          <div style={{ width:1,height:14,background:border,flexShrink:0 }}/>
          <div style={{ display:'flex',gap:20,overflowX:'auto' }}>
            {manchetes.map((m,i)=>(
              <span key={i} style={{ fontSize:12,whiteSpace:'nowrap',fontFamily:'Arial,sans-serif' }}>
                <span style={{ fontWeight:800,color:red,marginRight:4 }}>{m.tag}</span>
                <span style={{ color:mid }}>{m.texto}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Grid principal: destaque + lateral */}
        <div id="edital" style={{ display:'grid',gridTemplateColumns:'2fr 1fr',gap:0,borderBottom:`1px solid ${border}`,marginTop:32 }} className="jp-col2">

          {/* Artigo destaque */}
          <div style={{ paddingRight:32,borderRight:`1px solid ${border}` }}>
            <span className="jp-tag" style={{ background:red,color:'#fff' }}>{artigos[0].tag}</span>
            <h1 style={{ fontSize:36,fontWeight:900,lineHeight:1.15,color:ink,marginBottom:10,letterSpacing:'-0.5px' }}>
              {artigos[0].titulo}
            </h1>
            <p className="jp-sub">{artigos[0].subtitulo}</p>
            <hr className="jp-rule" style={{ marginBottom:16 }}/>
            <div className="jp-body" style={{ whiteSpace:'pre-line' }}>{artigos[0].corpo}</div>

            {/* box de dados do concurso */}
            <div style={{ marginTop:24,background:light,border:`1px solid ${border}`,borderLeft:`3px solid ${red}`,padding:'16px 20px' }}>
              <p style={{ fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1,color:red,fontFamily:'Arial,sans-serif',marginBottom:10 }}>Dados do Concurso</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'8px 24px',fontFamily:'Arial,sans-serif' }}>
                {[
                  ['Vagas (edital vigente)','Conforme edital'],['Etapas','5 fases'],['Organizador','IBGE'],
                  ['Portal de inscrição','ibge.gov.br'],['Treinamento','Capacitação obrigatória pelo IBGE'],['Cargo','Agente de Pesquisa e Mapeamento'],
                ].map(([k,v])=>(
                  <div key={k}>
                    <span style={{ fontSize:10,color:muted,textTransform:'uppercase',letterSpacing:.8 }}>{k}</span>
                    <div style={{ fontSize:13,fontWeight:700,color:ink }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna lateral: manchetes secundárias */}
          <div style={{ paddingLeft:24 }}>
            {artigos.slice(1).map((a,i)=>(
              <div key={i} style={{ paddingBottom:20,marginBottom:20,borderBottom:i<artigos.length-2?`1px solid ${border}`:'none' }}>
                <span className="jp-tag" style={{ background:a.tagColor,color:'#fff' }}>{a.tag}</span>
                <h2 className="jp-h2" style={{ fontSize:17 }}>{a.titulo}</h2>
                <p className="jp-sub" style={{ fontSize:13 }}>{a.subtitulo}</p>
                <p style={{ fontSize:13,color:mid,lineHeight:1.75,fontFamily:'Arial,sans-serif' }}>{a.corpo.split('\n\n')[0]}</p>
              </div>
            ))}

            {/* Aviso legal */}
            <div style={{ background:'#FEF3C7',border:'1px solid #F59E0B',borderRadius:4,padding:'12px 16px',marginTop:8 }}>
              <p style={{ fontSize:11,fontFamily:'Arial,sans-serif',color:'#92400E',lineHeight:1.65 }}>
                <strong>Aviso:</strong> Este portal é privado e independente. As informações publicadas têm caráter exclusivamente informativo. A única fonte com validade legal é o edital oficial publicado no Diário Oficial da União.
              </p>
            </div>
          </div>
        </div>

        {/* Seção: Tabela de Cargos */}
        <section id="cargos" style={{ marginTop:40,paddingBottom:40,borderBottom:`1px solid ${border}` }}>
          <div style={{ display:'flex',alignItems:'baseline',gap:16,marginBottom:20 }}>
            <h2 style={{ fontSize:22,fontWeight:900,letterSpacing:'-0.3px' }}>Cargos disponíveis</h2>
            <div style={{ flex:1,borderBottom:`1px solid ${border}` }}/>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%',borderCollapse:'collapse',fontFamily:'Arial,sans-serif',minWidth:560 }}>
              <thead>
                <tr style={{ background:ink,color:'#fff' }}>
                  {['Cargo','Formação exigida','Abrangência','Remuneração inicial*'].map(h=>(
                    <th key={h} style={{ textAlign:'left',padding:'10px 14px',fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:.8 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cargosTabela.map((c,i)=>(
                  <tr key={i} style={{ background:i%2===0?white:light }}>
                    <td style={{ padding:'11px 14px',fontSize:14,fontWeight:700,borderBottom:`1px solid ${border}` }}>{c.cargo}</td>
                    <td style={{ padding:'11px 14px',fontSize:13,color:mid,borderBottom:`1px solid ${border}` }}>{c.formacao}</td>
                    <td style={{ padding:'11px 14px',fontSize:13,color:mid,borderBottom:`1px solid ${border}` }}>{c.vagas}</td>
                    <td style={{ padding:'11px 14px',fontSize:13,fontWeight:700,color:red,borderBottom:`1px solid ${border}` }}>{c.salario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize:11,color:muted,marginTop:8,fontFamily:'Arial,sans-serif',fontStyle:'italic' }}>* Valores estimados com base em editais anteriores. Confirme no edital oficial.</p>
          </div>
        </section>

        {/* Seção: Etapas do processo */}
        <section id="processo" style={{ marginTop:40,paddingBottom:40,borderBottom:`1px solid ${border}` }}>
          <div style={{ display:'flex',alignItems:'baseline',gap:16,marginBottom:20 }}>
            <h2 style={{ fontSize:22,fontWeight:900,letterSpacing:'-0.3px' }}>Etapas do processo seletivo</h2>
            <div style={{ flex:1,borderBottom:`1px solid ${border}` }}/>
          </div>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1px',background:border,border:`1px solid ${border}` }}>
            {etapas.map((e,i)=>(
              <div key={i} style={{ background:white,padding:'18px 20px' }}>
                <div style={{ display:'flex',alignItems:'center',gap:10,marginBottom:6 }}>
                  <div style={{ width:28,height:28,borderRadius:2,background:red,color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Arial,sans-serif',fontSize:11,fontWeight:800,flexShrink:0 }}>{e.n}</div>
                  <div style={{ fontSize:14,fontWeight:800 }}>{e.nome}</div>
                </div>
                <p style={{ fontSize:12,color:muted,lineHeight:1.65,fontFamily:'Arial,sans-serif',margin:0 }}>{e.detalhe}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: Depoimentos */}
        <section id="depoimentos" style={{ marginTop:40,paddingBottom:40,borderBottom:`1px solid ${border}` }}>
          <div style={{ display:'flex',alignItems:'baseline',gap:16,marginBottom:8 }}>
            <h2 style={{ fontSize:22,fontWeight:900,letterSpacing:'-0.3px' }}>Relatos de candidatos aprovados</h2>
            <div style={{ flex:1,borderBottom:`1px solid ${border}` }}/>
          </div>
          <p style={{ fontSize:11,color:muted,fontFamily:'Arial,sans-serif',marginBottom:20,fontStyle:'italic' }}>
            Relatos coletados de candidatos aprovados em edições anteriores. Nomes e informações identificáveis foram omitidos ou alterados para preservar a privacidade.
          </p>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:24 }}>
            {depoimentos.map((d,i)=>(
              <div key={i} style={{ borderLeft:`3px solid ${border}`,paddingLeft:16 }}>
                <p style={{ fontSize:15,fontStyle:'italic',color:mid,lineHeight:1.8,marginBottom:12 }}>{d.texto}</p>
                <div style={{ fontFamily:'Arial,sans-serif' }}>
                  <div style={{ fontSize:12,fontWeight:800,color:ink }}>{d.nome}</div>
                  <div style={{ fontSize:11,color:muted }}>{d.cargo}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Seção: FAQ */}
        <section id="faq" style={{ marginTop:40,paddingBottom:40 }}>
          <div style={{ display:'flex',alignItems:'baseline',gap:16,marginBottom:20 }}>
            <h2 style={{ fontSize:22,fontWeight:900,letterSpacing:'-0.3px' }}>Perguntas frequentes</h2>
            <div style={{ flex:1,borderBottom:`1px solid ${border}` }}/>
          </div>
          <div style={{ maxWidth:800 }}>
            {faqs.map((f,i)=>(
              <div key={i}>
                <button className="jp-faq-btn" onClick={()=>setOpenFaq(openFaq===i?null:i)}>
                  <span>{f.q}</span>
                  <span style={{ fontSize:18,flexShrink:0,color:red,fontFamily:'Arial,sans-serif' }}>{openFaq===i?'−':'+'}</span>
                </button>
                {openFaq===i&&(
                  <div style={{ padding:'12px 0 16px',fontSize:14,color:mid,lineHeight:1.8,fontFamily:'Arial,sans-serif',borderBottom:`1px solid ${border}` }}>
                    {f.r}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Fontes oficiais */}
        <div style={{ marginTop:32,background:light,border:`1px solid ${border}`,padding:'20px 24px' }}>
          <p style={{ fontSize:11,fontWeight:800,textTransform:'uppercase',letterSpacing:1,color:muted,fontFamily:'Arial,sans-serif',marginBottom:10 }}>Fontes oficiais</p>
          <div style={{ display:'flex',gap:24,flexWrap:'wrap',fontFamily:'Arial,sans-serif' }}>
            {[
              { t:'IBGE', u:'ibge.gov.br' },
              { t:'Diario Oficial da Uniao', u:'in.gov.br' },
              { t:'Portal gov.br', u:'gov.br' },
              { t:'Diário Oficial da União', u:'in.gov.br' },
            ].map(s=>(
              <div key={s.t}>
                <div style={{ fontSize:12,fontWeight:700,color:ink }}>{s.t}</div>
                <div style={{ fontSize:11,color:muted }}>{s.u}</div>
              </div>
            ))}
          </div>
        </div>

      </main>

      <AgFooter />
    </div>
  );
}
