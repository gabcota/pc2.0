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
 */
function fireGtmEvent(
  eventName: string,
  dedupePrefix: string,
  params: { transactionId: string; value: number },
): void {
  try {
    if (!(window as any).dataLayer) {
      console.log(`[GTM] dataLayer não encontrado — domínio sem GTM, pulando ${eventName}`);
      return;
    }

    const { transactionId, value } = params;

    const dedupeKey = `${dedupePrefix}:${transactionId}`;
    if (localStorage.getItem(dedupeKey)) {
      console.warn(`[GTM] ${eventName} já enviado para esta transação:`, transactionId);
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
 * Variáveis disponíveis no painel GTM após este push:
 *   event          → "purchase_completed"
 *   transaction_id → ID da transação PIX
 *   value          → valor em BRL (número)
 *   currency       → "BRL"
 *   email          → e-mail do candidato (texto puro)
 *   phone          → telefone E.164 ex: +5511999999999
 *   name           → nome completo
 *   cep            → CEP apenas dígitos
 *   external_id    → CPF apenas dígitos (identity matching entre plataformas)
 *   gclid          → Google Click ID (se presente no utm_params do localStorage)
 *   gbraid         → Google BRAID (se presente no utm_params do localStorage)
 *
 * Deduplicação: dispara apenas uma vez por transaction_id (chave gtm_purchase_sent:<id>).
 * No-op silencioso se window.dataLayer não existir (domínio sem GTM configurado).
 *
 * Deve ser chamado na CONFIRMAÇÃO do pagamento — de toda transação,
 * incluindo cada upsell (cada um com seu próprio transactionId/value).
 */
export function fireGtmPurchase(params: { transactionId: string; value: number }): void {
  fireGtmEvent('purchase_completed', 'gtm_purchase_sent', params);
}

/**
 * Empurra evento de início de checkout (geração do PIX) para o GTM.
 * Mesmo payload do purchase_completed, com event = "begin_checkout".
 *
 * Regras de disparo:
 *   - Chamar na EXIBIÇÃO do QR code do FRONT (inscrição) — não no clique
 *     do botão que inicia a geração, e NUNCA nos upsells.
 *   - Usar o MESMO transactionId que irá no purchase_completed do front,
 *     para o Google Ads correlacionar as duas conversões.
 *
 * Deduplicação independente da compra (chave gtm_begin_checkout_sent:<id>):
 * QR regenerado para a mesma transação não dispara de novo, e o disparo
 * do begin_checkout não impede o purchase_completed posterior.
 */
export function fireGtmBeginCheckout(params: { transactionId: string; value: number }): void {
  fireGtmEvent('begin_checkout', 'gtm_begin_checkout_sent', params);
}