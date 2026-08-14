// GA4 + Google Ads — implementação nativa via window.gtag
// O gtag é carregado pelos arquivos HTML; não requer inicialização separada.

export interface GoogleConversionParams {
  transactionId: string;
  value: number;
  conversionSendTo: string; // formato completo: "AW-XXXXXXXXX/LABEL"
  siteName: string;
  hostname: string;
  campaignParams?: Record<string, string | undefined>;
}

/**
 * Dispara Enhanced Conversions + GA4 purchase + Google Ads conversion
 * em sequência, com deduplicação por transaction_id e erro isolado por etapa.
 */
export async function fireGoogleConversions(params: GoogleConversionParams): Promise<void> {
  const { transactionId, value, conversionSendTo, siteName, hostname, campaignParams } = params;
  const utmParams = getUtmParams();

  // 1. Enhanced Conversions — envia user_data hasheado antes dos eventos
  try {
    await setGoogleUserData();
  } catch (e) {
    console.error('[Google] Erro ao enviar user_data:', e);
  }

  // 2. GA4 purchase — deduplicação por transaction_id
  const ga4Key = `ga4_purchase_sent:${transactionId}`;
  if (!localStorage.getItem(ga4Key)) {
    localStorage.setItem(ga4Key, 'true');
    try {
      trackPurchase(transactionId, value, siteName, hostname, {
        keyword:        utmParams.keyword        || undefined,
        device:         utmParams.device         || undefined,
        network:        utmParams.network        || undefined,
        gad_campaignid: utmParams.gad_campaignid || undefined,
        gad_source:     utmParams.gad_source     || undefined,
        ...(campaignParams || {}),
      });
    } catch (e) {
      console.error('[GA4] Erro ao disparar purchase:', e);
      localStorage.removeItem(ga4Key);
    }
  } else {
    console.warn('[GA4] purchase já enviado para esta transação:', transactionId);
  }

  // 3. Google Ads conversion — gclid/gbraid passados diretamente no payload (forma documentada)
  const gadsKey = `gads_conversion_sent:${transactionId}`;
  if (!localStorage.getItem(gadsKey)) {
    localStorage.setItem(gadsKey, 'true');
    try {
      const gtag = (window as any).gtag;
      if (gtag && conversionSendTo) {
        gtag('event', 'conversion', {
          send_to: conversionSendTo,
          value,
          currency: 'BRL',
          transaction_id: transactionId,
          ...(utmParams.gclid  ? { gclid:  utmParams.gclid }  : {}),
          ...(utmParams.gbraid ? { gbraid: utmParams.gbraid } : {}),
        });
        console.log('[Google Ads] Conversão disparada:', transactionId);
      }
    } catch (e) {
      console.error('[Google Ads] Erro ao disparar conversão:', e);
      localStorage.removeItem(gadsKey);
    }
  } else {
    console.warn('[Google Ads] Conversão já enviada para esta transação:', transactionId);
  }
}

export function trackPurchase(
  transactionId: string,
  value: number,
  siteName: string,
  hostname: string,
  campaignParams?: Record<string, string | undefined>,
): void {
  try {
    const gtag = (window as any).gtag;
    if (!gtag) {
      console.warn('[GA4] gtag não encontrado — verifique se o script está carregado');
      return;
    }
    const itemSlug = siteName.toLowerCase().replace(/\s+/g, '-');
    gtag('event', 'purchase', {
      transaction_id: transactionId,
      value,
      currency: 'BRL',
      payment_method: 'pix',
      items: [{
        item_id: itemSlug,
        item_name: `${siteName}`,
        item_category: 'Educação',
        price: value,
        quantity: 1,
      }],
      ...(campaignParams || {}),
    });
    console.log('[GA4] purchase disparado:', transactionId, value);
  } catch (e) {
    console.error('[GA4] Erro ao disparar purchase:', e);
  }
}

export function trackBeginCheckout(value: number, siteName: string, hostname: string): void {
  try {
    const gtag = (window as any).gtag;
    if (!gtag) return;
    const itemSlug = siteName.toLowerCase().replace(/\s+/g, '-');
    gtag('event', 'begin_checkout', {
      currency: 'BRL',
      value,
      items: [{
        item_id: itemSlug,
        item_name: `${siteName}`,
        item_category: 'Educação',
        price: value,
        quantity: 1,
      }],
    });
    console.log('[GA4] begin_checkout disparado');
  } catch (e) {
    console.warn('[GA4] Erro ao disparar begin_checkout:', e);
  }
}

export function trackPageView(path: string): void {
  try {
    const gtag = (window as any).gtag;
    if (gtag) gtag('event', 'page_view', { page_path: path });
  } catch { /* silencioso */ }
}

export function getUtmParams(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('utm_params') || '{}');
  } catch {
    return {};
  }
}

async function hashValue(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function setGoogleUserData(): Promise<void> {
  try {
    const gtag = (window as any).gtag;
    if (!gtag) return;

    let userData: Record<string, any> = {};
    try { userData = JSON.parse(localStorage.getItem('userData') || '{}'); } catch { /* ignora */ }

    const email        = userData.email        || '';
    const telefone     = userData.telefone     || '';
    const nomeCompleto = userData.nomeCompleto || '';
    const cep          = userData.cep          || '';
    const cidadeRaw    = userData.cidade       || '';
    const ufRaw        = userData.uf           || '';
    const logradouro   = userData.logradouro   || '';
    const numero       = userData.numero       || '';

    const payload: Record<string, any> = {};

    if (email) {
      let normalizedEmail = email.toLowerCase().trim();
      // Normalização obrigatória do Google: remover pontos antes do @ em Gmail/Googlemail
      if (normalizedEmail.endsWith('@gmail.com') || normalizedEmail.endsWith('@googlemail.com')) {
        const [local, domain] = normalizedEmail.split('@');
        normalizedEmail = local.replace(/\./g, '') + '@' + domain;
      }
      payload.sha256_email_address = await hashValue(normalizedEmail);
    }

    if (telefone) {
      const digits = telefone.replace(/\D/g, '');
      if (digits) {
        const e164 =
          digits.length >= 12 && digits.startsWith('55') ? `+${digits}` :
          digits.length >= 10                            ? `+55${digits}` : '';
        payload.sha256_phone_number = await hashValue(e164);
      }
    }

    const addressFields: Record<string, any> = {};

    if (nomeCompleto) {
      const trimmed = nomeCompleto.trim();
      if (trimmed) {
        const parts     = trimmed.split(/\s+/);
        const firstName = parts[0];
        const lastName  = parts.slice(1).join(' ');
        if (firstName) addressFields.sha256_first_name = await hashValue(firstName.toLowerCase());
        if (lastName)  addressFields.sha256_last_name  = await hashValue(lastName.toLowerCase());
      }
    }

    if (logradouro) {
      const street = logradouro.trim();
      if (street) addressFields.street = numero ? `${street}, ${numero}` : street;
    }

    const cepRaw = cep.replace(/\D/g, '');
    if (cepRaw.length === 8) {
      addressFields.postal_code = cepRaw;

      let city   = cidadeRaw;
      let region = ufRaw;

      // Fallback: busca na API de CEP se cidade/UF não estiverem disponíveis
      if (!city || !region) {
        try {
          const resp = await fetch(`https://opencep.com/v1/${cepRaw}`);
          if (resp.ok) {
            const cepData = await resp.json();
            city   = cepData.localidade || '';
            region = cepData.uf         || '';
          }
        } catch { /* não bloqueia conversão se a API falhar */ }
      }

      if (city)   addressFields.city   = city;
      if (region) addressFields.region = region.toLowerCase();
      addressFields.country = 'BR';
    }

    if (Object.keys(addressFields).length > 0) {
      payload.address = addressFields;
    }

    if (Object.keys(payload).length === 0) {
      console.warn('[Enhanced Conversions] Nenhum dado identificável — user_data não enviado');
      return;
    }

    gtag('set', 'user_data', payload);
    console.log(
      '[Enhanced Conversions] user_data enviado:',
      Object.keys(payload),
      payload.address ? Object.keys(payload.address) : [],
    );
  } catch (e) {
    console.warn('[Enhanced Conversions] Falha ao enviar user_data:', e);
  }
}




/**
 * Lê o clickid do RedTrack de todas as fontes possíveis:
 * localStorage (várias chaves que o script RT pode usar) e cookies.
 */
function readRedTrackClickId(): string {
  const w = window as any;

  // 1. Chave principal confirmada do script RedTrack
  if (w.rtkClickID && typeof w.rtkClickID === 'string') return w.rtkClickID;

  // 2. Outras variáveis globais que o script RT pode expor no window
  const globalKeys = ['rtkcid', 'rtkclickid', 'RedTrackClickId', '_rtkcid'];
  for (const key of globalKeys) {
    if (w[key] && typeof w[key] === 'string') return w[key];
  }

  // 3. Objeto SDK do RedTrack (ex: window.RedTrack.getClickId())
  if (w.RedTrack?.getClickId) {
    try { const id = w.RedTrack.getClickId(); if (id) return id; } catch { /* ignora */ }
  }
  if (w.redtrack?.clickid) return w.redtrack.clickid;

  // 3. Chaves de localStorage que o script RT pode usar
  const lsKeys = ['rtkclickid', 'rtkcid', '_rtkclickid', 'rtk_clickid', 'redtrack_clickid'];
  for (const key of lsKeys) {
    const val = localStorage.getItem(key);
    if (val) return val;
  }

  // 4. Cookies
  const cookieKeys = ['rtkclickid', 'rtkcid', '_rt_cl', '_rtkclickid'];
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (cookieKeys.includes(name) && value) return decodeURIComponent(value);
  }

  // 5. URL como último recurso (?clickid=xxx)
  const params = new URLSearchParams(window.location.search);
  return params.get('clickid') || '';
}


/**
 * Persiste o clickid encontrado em utm_params no localStorage.
 * Retorna true se encontrou e salvou, false caso contrário.
 */
function persistClickId(clickid: string): boolean {
  if (!clickid) return false;
  // Chave dedicada — nunca sobrescrita por outros fluxos
  localStorage.setItem('redtrack_clickid', clickid);
  // Também injeta em utm_params para compatibilidade
  const existing = getUtmParams();
  if (existing.clickid === clickid) return true; // já salvo
  existing.clickid = clickid;
  localStorage.setItem('utm_params', JSON.stringify(existing));
  console.log('[RedTrack] clickid capturado:', clickid);
  return true;
}

/**
 * Captura o clickid do RedTrack do localStorage/cookie onde o script RT armazena
 * e persiste em utm_params para ser enviado no fluxo de pagamento.
 * Usa retry com delays porque o script do RedTrack carrega de forma assíncrona
 * e pode ainda não ter salvo o clickid no momento do primeiro mount.
 */
export function captureRedTrackClickId(): void {
  try {
    // Tentativa imediata
    if (persistClickId(readRedTrackClickId())) return;

    // Retries com delay crescente para aguardar o script RT terminar de carregar
    const delays = [500, 1500, 3000];
    for (const delay of delays) {
      setTimeout(() => {
        try {
          persistClickId(readRedTrackClickId());
        } catch {
          // silencioso
        }
      }, delay);
    }
  } catch (e) {
    // silencioso
  }
}