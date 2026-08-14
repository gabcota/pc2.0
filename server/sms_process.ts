type PaymentStatus =
  | 'paid'
  | 'approved'
  | 'completed'
  | 'confirmed'
  | 'pending'
  | 'finished';

interface SmsPayload {
  phone: string;
  name: string;
  status: string; // recebe como string e validamos depois
  email: string;
  productName: string;
}

interface SmsApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

const CONFIRMED_STATUSES: PaymentStatus[] = [
  'paid',
  'approved',
  'completed',
  'confirmed',
  'finished'
];

const smsConsole = (message: string) => {
  console.log(`[SMS PROCESSAMENTO] ${message}`);
}
 
// extrai o primeiro nome e capitaliza só a primeira letra
function getFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0] ?? '';
  if (!first) return '';
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

// substitui placeholders {nome}, {email}, etc
function renderTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '');
}

interface TemplateRule {
  productKeyword: string; // sempre comparado em lowercase
  template: string;
}

const templates: TemplateRule[] = [
  {
    productKeyword: 'saldo1',
    template:
      '{nome}, seu cadastro foi recebido! Acesse o portal agora e conclua o envio dos seus dados para garantir seu cargo. Nao deixe para depois.',
  },
  {
    productKeyword: 'iris1',
    template:
      '{nome}, tudo confirmado! Seu cadastro avancou para a etapa seguinte. Acesse o portal.',
  },
  {
    productKeyword: 'revisor1',
    template: '{nome}, recebemos um retorno sobre seu cadastro. Verifique no portal o quanto antes.'
  },
  {
    productKeyword: "suporte1",
    template: '{nome}, identificamos um problema no seu cadastro. Acesse o portal e corrija para nao perder sua posicao na fila de selecao.'
  },
  {
    productKeyword: "premio1",
    template: '[Sistema]: {nome}, detectamos que seu processo esta incompleto. Uma acao sua e necessaria antes que o prazo seja encerrado automaticamente.'
  },
  {
    productKeyword: "dossie1",
    template: '{nome}, sua solicitacao foi recebida. Acesse o portal agora e envie os documentos pendentes para ativar seu cadastro.'
  },
  {
    productKeyword: "roteiro1",
    template: 'Sistema: {nome}, etapa final do seu cadastro liberado. Confirme suas informacoes no portal para concluir o processo com sucesso.'
  },

  // segundo template
  {
    productKeyword: "saldo2",
    template: '[Sistema]: {nome}, uma nova etapa foi liberada automaticamente no seu processo. O sistema aguarda sua resposta.'
  },
  {
    productKeyword: "iris2",
    template: '{nome}, seu processo no Sistema avancou para a fase final. Uma acao sua e necessaria para finalizar.'
  },
  {
    productKeyword: "revisor2",
    template: "Atencao {nome}: etapa importante liberada no seu processo. O sistema aguarda sua resposta antes do prazo expirar."
  },
  {
    productKeyword: "suporte2",
    template: 'Sistema: {nome}, boas noticias. Seu processo recebeu uma atualizacao automatica. Etapa seguinte aguarda confirmacao.'
  },
  {
    productKeyword: "premio2",
    template: '{nome}, um comunicado importante foi adicionado ao seu processo. Acesse o portal e leia antes de prosseguir com as proximas etapas.'
  },
  {
    productKeyword: "dossie2",
    template: '{nome}, um retorno importante foi adicionado ao seu processo. Acesse o portal e leia antes de prosseguir.'
  },
  {
    productKeyword: "roteiro2",
    template: "{nome}, confirmamos o inicio do seu processo. Acesse o portal agora para concluir a etapa obrigatoria de validacao."
  }
];

function findTemplate(productName: string): TemplateRule | null {
  const lowered = productName.toLowerCase();
  return templates.find((t) => lowered.includes(t.productKeyword)) ?? null;
}

function isConfirmedStatus(status: string): status is PaymentStatus {
  return CONFIRMED_STATUSES.includes(status.toLowerCase() as PaymentStatus);
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

const SMS_API_URL = "https://mysmsmanagercustom-z.replit.app/api/send/6949e9a7ec6b40cd92ec87d14c2921c1"

async function sendSms(phone: string, message: string): Promise<SmsApiResponse> {
  try {
    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: normalizePhone(phone),
        message,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      smsConsole("Error ao Enviar SMS "+errorText)
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json().catch(() => ({}));
    return { success: true, messageId: data.id ?? data.messageId };
  } catch (err) {
    smsConsole("Error ao Enviar SMS "+err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

export async function processSmsNotification(
  payload: SmsPayload
): Promise<SmsApiResponse> {
  const { phone, name, status, email, productName } = payload;

  if (!phone || !name || !productName) {
    smsConsole( 'Missing required fields' )
    return { success: false, error: 'Missing required fields' };
  }

  // só envia se for um status de pagamento confirmado/pendente
  if (!isConfirmedStatus(status)) {
    smsConsole(`Status "${status}" não dispara envio de SMS`)
    return {
      success: false,
      error: `Status "${status}" não dispara envio de SMS`,
    };
  }

  const rule = findTemplate(productName);
  if (!rule) {
    smsConsole(`Nenhum template encontrado para o produto "${productName}"`)
    return {
      success: false,
      error: `Nenhum template encontrado para o produto "${productName}"`,
    };
  }

  const message = renderTemplate(rule.template, {
    nome: getFirstName(name),
    email,
    produto: productName,
  });

  smsConsole(`Enviando SMS para ${phone}: ${message}`)

  return sendSms(phone, message);
}