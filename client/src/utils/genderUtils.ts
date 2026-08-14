// Utility functions for gender-specific copy and UI customization

export interface GenderCopyConfig {
  gender: 'feminino' | 'masculino' | '';
  isWoman: boolean;
}

export function detectUserGender(userData?: any, protocolData?: any): GenderCopyConfig {
  let gender = '';
  
  // Try multiple sources for gender data
  if (protocolData?.candidate?.gender) {
    gender = protocolData.candidate.gender;
  } else if (userData?.gender) {
    gender = userData.gender;
  } else if (userData?.sexo) {
    gender = userData.sexo;
  } else if (userData?.autoFilledData?.sexo) {
    gender = userData.autoFilledData.sexo;
  }
  
  // Normalize gender value
  const normalizedGender = gender.toLowerCase() === 'f' || 
                          gender.toLowerCase() === 'feminino' ? 'feminino' : 
                          gender.toLowerCase() === 'm' || 
                          gender.toLowerCase() === 'masculino' ? 'masculino' : '';
  
  return {
    gender: normalizedGender as 'feminino' | 'masculino' | '',
    isWoman: normalizedGender === 'feminino'
  };
}

export const genderCopy = {
  loginPage: {
    title: {
      feminino: "Portal da Militar Temporária",
      masculino: "Portal do Militar Temporário"
    },
    welcome: {
      feminino: "Bem-vinda ao seu portal exclusivo de acompanhamento. Acesse com o email utilizado no seu processo de alistamento.",
      masculino: "Acesse com o email utilizado para acessar seu painel de acompanhamento e agendamento."
    },
    systemInfo: {
      feminino: "Sistema seguro e adaptado para o acompanhamento do processo de alistamento feminino temporário",
      masculino: "Sistema de acompanhamento do processo de alistamento temporário"
    }
  },
  
  medicalScheduling: {
    title: {
      feminino: "Agendamento do Seu Exame Médico",
      masculino: "Agendamento de Exame Médico"
    },
    description: {
      feminino: (name: string) => `${name}, selecione data e local para seu exame médico. Processo adaptado às especificidades femininas com total privacidade e respeito.`,
      masculino: (name: string) => `${name}, selecione data e local para seu exame de competência mínima.`
    },
    examInfo: {
      feminino: "Avaliação básica de aptidão com procedimentos adaptados para candidatas femininas",
      masculino: "Avaliação básica de aptidão para atividades administrativas e operacionais"
    }
  },
  
  medicalConfirmation: {
    title: {
      feminino: "Seu Exame Médico Foi Confirmado!",
      masculino: "Agendamento Confirmado"
    },
    description: {
      feminino: "Parabéns! Seu exame médico foi agendado com total privacidade e respeito às especificidades femininas. Anote as informações importantes abaixo.",
      masculino: "Seu exame médico foi agendado com sucesso. Anote as informações abaixo."
    },
    orientationsTitle: {
      feminino: "Orientações Especiais para Seu Exame",
      masculino: "Orientações para o Exame"
    },
    preparationTitle: {
      feminino: "Preparação e conforto:",
      masculino: "Recomendações:"
    }
  }
};

export function getCopyForGender(section: keyof typeof genderCopy, key: string, gender: 'feminino' | 'masculino' | '', fallback?: string): string {
  if (!gender || !genderCopy[section] || !genderCopy[section][key as keyof typeof genderCopy[typeof section]]) {
    return fallback || '';
  }
  
  const copySection = genderCopy[section][key as keyof typeof genderCopy[typeof section]];
  
  if (typeof copySection === 'object' && copySection[gender]) {
    return copySection[gender];
  }
  
  return fallback || '';
}

export function getWomenSpecificFeatures() {
  return {
    medicalExam: {
      benefits: [
        "Exames realizados por profissionais qualificados com experiência em atendimento feminino",
        "Ambiente reservado e privativo durante toda a avaliação",
        "Procedimentos adaptados às especificidades femininas conforme protocolo militar",
        "Horários preferenciais disponíveis para mães e responsáveis familiares",
        "Possibilidade de reagendamento sem penalização em casos especiais"
      ],
      additionalDocuments: [
        "Acompanhante permitido (se desejar)"
      ],
      additionalPreparation: [
        "Roupas confortáveis e fáceis de vestir",
        "Ambiente reservado garantido",
        "Duração estimada: 45 minutos"
      ],
      specificInfo: [
        "Privacidade total: Exame em ambiente reservado com profissionais especializados",
        "Procedimentos adaptados: Avaliação seguindo protocolos específicos para mulheres",
        "Reagendamento: Facilidade para reagendar em casos especiais (menstruação, gravidez, etc.)",
        "Suporte: Equipe preparada para esclarecer dúvidas sobre critérios femininos"
      ]
    },
    specialProgram: {
      highlight: "Programa Especial de Alistamento Feminino",
      description: "Você faz parte de um momento histórico! Este é o primeiro programa de alistamento temporário com vagas específicas para mulheres no Exército Brasileiro. Processo adaptado às especificidades femininas com total respeito e profissionalismo."
    }
  };
}