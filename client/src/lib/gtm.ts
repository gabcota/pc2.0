import { getUtmParams, setGoogleUserData } from '@/lib/googleAnalytics';

/**
 * Campos de usuário normalizados + identificadores de clique, prontos
 * para entrar no dataLayer.push. Campos vazios são omitidos.
 */
function buildUserPayload(): Record<string, any> {
  let userData: Record<string, any> = {};
  try { userData = JSON.parse(localStorage.getItem('userData') || '{}'); } catch { /* ignora */ }

  const email        = (userData.email        || '').toLowerCase().trim();
  const telefone     = userData.telefone       || '';
  const nomeCompleto = userData.nomeCompleto   || '';
  const cep          = (userData.cep           || '').replace(/\D/g, '');
  const cpf          = userData.cpf            || '';
  const logradouro   = userData.logradouro     || '';
  const numero       = userData.numero         || '';
  const cidade       = userData.cidade         || '';
  const uf           = (userData.uf            || '').toLowerCase();

  const phoneDigits = telefone.replace(/\D/g, '');
  // Número BR sem código de país tem 10-11 dígitos (DD + número).
  // Só considera o +55 já incluso se tiver 12+ dígitos — evita confundir DD 55 (RS) com código de país.
  const phoneE164 =
    phoneDigits.length >= 12 && phoneDigits.startsWith('55') ? `+${phoneDigits}` :
    phoneDigits.length >= 10                                 ? `+55${phoneDigits}` : '';

  const cpfDigits = cpf.replace(/\D/g, '');

  const nameParts = nomeCompleto.trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName  = nameParts.slice(1).join(' ') || '';
  const street    = logradouro ? (numero ? `${logradouro}, ${numero}` : logradouro) : '';

  const utmParams = getUtmParams();

  return {
    ...(email        ? { email }                  : {}),
    ...(phoneE164    ? { phone: phoneE164 }        : {}),
    ...(firstName    ? { first_name: firstName }   : {}),
    ...(lastName     ? { last_name:  lastName  }   : {}),
    ...(nomeCompleto ? { name: nomeCompleto }      : {}),
    ...(street       ? { street }                  : {}),
    ...(cidade       ? { city: cidade }            : {}),
    ...(uf           ? { region: uf }              : {}),
    ...(cep          ? { cep }                     : {}),
    ...(cpfDigits    ? { external_id: cpfDigits }  : {}),
    ...(utmParams.gclid  ? { gclid:  utmParams.gclid }  : {}),
    ...(utmParams.gbraid ? { gbraid: utmParams.gbraid } : {}),
  };
}

/**
 * Núcleo comum dos eventos de conversão do GTM.
 * Guards (dataLayer ausente, dedup por chave), montagem do payload e
 * ordem garantida do user_data via gtag antes do push.
 *
 * A chave de dedup vem PRONTA do chamador — permite dedupar pela
 * transação do próprio evento (purchase) ou pelo pedido do front
 * (first_upsell), conforme o caso.
 */
function fireGtmEvent(
  eventName: string,
  dedupeKey: string,
  params: { transactionId: string; value: number },
): void {
  try {
    if (!(window as any).dataLayer) {
      console.log(`[GTM] dataLayer não encontrado — domínio sem GTM, pulando ${eventName}`);
      return;
    }

    const { transactionId, value } = params;

    if (localStorage.getItem(dedupeKey)) {
      console.warn(`[GTM] ${eventName} já enviado (${dedupeKey}):`, transactionId);
      return;
    }

    // Marca imediatamente para evitar duplo disparo durante o await assíncrono
    localStorage.setItem(dedupeKey, 'true');

    const pushEvent = () => {
      (window as any).dataLayer.push({
        event: eventName,
        transaction_id: transactionId,
        value,
        currency: 'BRL',
        ...buildUserPayload(),
      });
      console.log(`[GTM] ${eventName} disparado:`, transactionId, value);
    };

    // user_data setado via gtag ANTES do push — ordem garantida pelo .finally()
    setGoogleUserData()
      .catch(e => console.warn('[GTM] Erro ao enviar user_data:', e))
      .finally(pushEvent);

  } catch (e) {
    console.warn(`[GTM] Erro ao disparar ${eventName}:`, e);
  }
}

/**
 * Empurra evento de compra confirmada para o window.dataLayer (GTM).
 *
 * ⚠ MUDANÇA (30/08): chamar SOMENTE na confirmação da compra do FRONT.
 * Upsells NÃO chamam mais esta função — usam fireGtmFirstUpsell.
 * (Com contagem "Uma" isso não altera os números atuais: o upsell já
 * colapsava na mesma conversão do clique.)
 *
 * Variáveis disponíveis no painel GTM após este push:
 *   event          → "purchase_completed"
 *   transaction_id → ID da transação PIX
 *   value          → valor em BRL (número)
 *   currency       → "BRL"
 *   email/phone/name/cep/external_id/gclid/gbraid → ver buildUserPayload
 *
 * Deduplicação: uma vez por transaction_id (chave gtm_purchase_sent:<id>).
 * No-op silencioso se window.dataLayer não existir (domínio sem GTM).
 */
export function fireGtmPurchase(params: { transactionId: string; value: number }): void {
  fireGtmEvent('purchase_completed', `gtm_purchase_sent:${params.transactionId}`, params);
}

/**
 * Empurra evento de PRIMEIRO upsell confirmado (event = "first_upsell_completed").
 *
 * Regras de disparo:
 *   - Chamar na confirmação de TODO upsell (1º, 2º, 3º…) — a função se
 *     resolve sozinha: a dedup é pela transação do FRONT (o pedido), então
 *     só o primeiro upsell do pedido emite de fato; os demais são ignorados.
 *   - transactionId = transação do PRÓPRIO upsell (vira orderId da conversão).
 *   - frontTransactionId = transação da compra do front (chave de dedup).
 *
 * No Google Ads esta conversão é SECUNDÁRIA (observação): sinal de LTV por
 * kw ("clique virou comprador de kit completo"), fora da coluna Conversões
 * e do lance.
 *
 * Deduplicação: uma vez por pedido (chave gtm_first_upsell_sent:<frontId>).
 */
export function fireGtmFirstUpsell(params: {
  transactionId: string;
  value: number;
  frontTransactionId: string;
}): void {
  fireGtmEvent(
    'first_upsell_completed',
    `gtm_first_upsell_sent:${params.frontTransactionId}`,
    { transactionId: params.transactionId, value: params.value },
  );
}