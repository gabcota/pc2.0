import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync } from 'node:fs';
import { COMPANY_DATA, DOMAIN_TRACKING, resolveTracking, injectTrackingIntoHtml, buildSitemap } from '../server/domainTracking';
import { GUIA_SERVIDOR_PENAL_COMPANY as company } from '../shared/guiaServidorPenalCompany';

function withHost<T>(hostname: string, run: () => T): T {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { hostname } } });
  try { return run(); } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else Reflect.deleteProperty(globalThis, 'window');
  }
}
const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
Object.defineProperty(globalThis, 'window', {
  configurable: true, value: { location: { hostname: company.hostname } },
});
let getSiteConfig: typeof import('../client/src/lib/siteConfig').getSiteConfig;
try {
  ({ getSiteConfig } = await import('../client/src/lib/siteConfig'));
} finally {
  if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow);
  else Reflect.deleteProperty(globalThis, 'window');
}

for (const hostname of [company.hostname, `www.${company.hostname}`]) {
  test(`${hostname}: identidade Fager sem herdar cadastro ou medição alheios`, () => {
    const config = withHost(hostname, () => getSiteConfig());
    for (const [key, value] of Object.entries(company)) {
      assert.equal(config[key as keyof typeof config], value, key);
    }
    for (const key of ['dataAbertura', 'capitalSocial', 'naturezaJuridica', 'cnae',
      'situacaoCadastral', 'opcaoSimples', 'oabNumero', 'gtagId', 'gadsConversionSendTo', 'utmifyPixelId']) {
      assert.equal(config[key as keyof typeof config], undefined, key);
    }
    assert.equal(config.siteName, company.brand);
    assert.match(config.disclaimer, /independente.*não possui vínculo/);
    const tracking = resolveTracking(hostname)!;
    assert.equal(tracking.domain, company.hostname);
    assert.equal(tracking.title, company.razaoSocial);
    assert.equal(tracking.gtmId, undefined);
    assert.equal(tracking.gtagId, undefined);
    assert.ok(existsSync(`client/public${tracking.faviconPath}`));
    assert.ok(existsSync(`client/public${tracking.ogImage}`));
  });
  test(`${hostname}: metadados, contato e endereço corretos`, () => {
    const html = injectTrackingIntoHtml('<html><head><title>Anterior</title><!-- __TRACKING__ --></head></html>', hostname, '/');
    for (const value of [company.razaoSocial, company.cnpjFormatted, company.email,
      company.telefone, company.hostname, company.cidade, company.cep, 'Casa']) {
      assert.ok(html.includes(value), value);
    }
    assert.doesNotMatch(html, /Konig|Regnum|Barbosa|Tio Beke|GTM-|googletagmanager\.com/);
    assert.ok(html.includes(company.canonicalUrl));
  });
}
test('sitemap e registro da empresa isolados dos demais domínios', () => {
  for (const path of ['/', '/sobre', '/privacidade', '/termos', '/cookies'])
    assert.ok(buildSitemap(company.hostname).includes(`<loc>https://www.${company.hostname}${path}</loc>`));
  const registered = COMPANY_DATA[company.hostname];
  assert.equal(registered.cnpj, '00.000.326/0001-19');
  assert.equal(registered.phone, company.telefone);
  assert.equal(registered.emailContato, company.email);
  assert.equal(registered.stateCode, 'SP');
  const sameSignal = new Set(Object.values(DOMAIN_TRACKING)
    .filter(t => t.analyticsCore === 'signal.8e4a1c73').map(t => t.domain));
  assert.deepEqual([...sameSignal], [company.hostname]);
  assert.equal(resolveTracking('editalpenal.click')?.title, 'Konig Producoes LTDA');
});
