import { useState, useEffect } from 'react';
import { CheckCircle, Clock, Calendar, MapPin, FileCheck } from 'lucide-react';
import minSaudeLogo from '@assets/min-saude-removebg-preview_1784414176995.png';

interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
  active: boolean;
}

interface MedicalSchedulingLoaderProps {
  onComplete: () => void;
}

export function MedicalSchedulingLoader({ onComplete }: MedicalSchedulingLoaderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [locationLabel, setLocationLabel] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('userMedicalLogin') || localStorage.getItem('userData') || '{}';
      const parsed = JSON.parse(raw);
      const loc =
        parsed?.jobPosition?.location ||
        parsed?.additionalData?.juntaData?.municipio ||
        parsed?.cidade ||
        parsed?.autoFilledData?.cidade ||
        '';
      setLocationLabel(loc);
    } catch {
      setLocationLabel('');
    }
  }, []);

  const buildSteps = (loc: string): Step[] => [
    {
      id: 1,
      title: loc ? `Localizando Unidades Credenciadas em ${loc}` : 'Localizando Unidades Credenciadas',
      description: loc
        ? `Buscando unidades de saúde credenciadas na região de ${loc}`
        : 'Buscando unidades de saúde credenciadas na sua região',
      icon: <MapPin className="w-5 h-5" />,
      completed: false,
      active: true,
    },
    {
      id: 2,
      title: 'Verificando Disponibilidade',
      description: 'Consultando horários disponíveis para a avaliação',
      icon: <Clock className="w-5 h-5" />,
      completed: false,
      active: false,
    },
    {
      id: 3,
      title: 'Preparando Calendário',
      description: 'Organizando datas e horários para agendamento',
      icon: <Calendar className="w-5 h-5" />,
      completed: false,
      active: false,
    },
    {
      id: 4,
      title: 'Validando Requisitos do Edital',
      description: 'Verificando documentação exigida pelo Edital IBGE PSS 2026',
      icon: <FileCheck className="w-5 h-5" />,
      completed: false,
      active: false,
    },
  ];

  const [steps, setSteps] = useState<Step[]>(() => buildSteps(''));

  useEffect(() => {
    setSteps(buildSteps(locationLabel));
  }, [locationLabel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteps(prevSteps => {
        const newSteps = [...prevSteps];

        if (currentStep < newSteps.length) {
          newSteps[currentStep].completed = true;
          newSteps[currentStep].active = false;

          if (currentStep < newSteps.length - 1) {
            newSteps[currentStep + 1].active = true;
            setCurrentStep(currentStep + 1);
          } else {
            setTimeout(() => onComplete(), 500);
          }
        }

        return newSteps;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: 'Rawline, Arial, sans-serif' }}>
      <div className="max-w-sm w-full mx-4">
        <div className="text-center">
          <div className="mb-8">
            <div className="mx-auto mb-4 flex items-center justify-center">
              <img src={minSaudeLogo} alt="Ministério da Saúde" className="h-28 w-auto" />
            </div>
            <h2 className="text-xl font-medium mb-2" style={{ color: '#0063AF' }}>
              Preparando Avaliação de Saúde Ocupacional
            </h2>
            <p className="text-sm text-gray-600">
              Configurando sistema de avaliações
            </p>
          </div>

          <div className="space-y-3">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center p-3 transition-all duration-300 ${
                  step.completed || step.active ? 'opacity-100' : 'opacity-40'
                }`}
              >
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border"
                  style={{
                    backgroundColor: step.completed ? '#0063AF' : step.active ? 'white' : '#f9fafb',
                    borderColor: step.completed ? '#0063AF' : step.active ? '#9ca3af' : '#e5e7eb',
                  }}
                >
                  {step.completed ? (
                    <CheckCircle className="w-4 h-4 text-white" />
                  ) : step.active ? (
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#0063AF' }}></div>
                  ) : (
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                  )}
                </div>

                <div className="ml-3 flex-1 text-left">
                  <p
                    className="text-sm"
                    style={{
                      color: step.completed ? '#0063AF' : step.active ? '#6b7280' : '#9ca3af',
                      fontWeight: step.completed ? 500 : 400,
                    }}
                  >
                    {step.title}
                  </p>
                </div>

                {step.active && !step.completed && (
                  <div className="flex-shrink-0">
                    <div className="animate-spin rounded-full h-3 w-3 border border-gray-300" style={{ borderTopColor: '#0063AF' }}></div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div
                className="h-1 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentStep + 1) / steps.length) * 100}%`,
                  backgroundColor: '#0063AF',
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
