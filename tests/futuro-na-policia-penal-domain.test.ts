import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import {
  COMPANY_DATA, DOMAIN_TRACKING, resolveTracking,
  injectTrackingIntoHtml, buildSitemap,
} from '../server/domainTracking';
import { FUTURO_NA_POLICIA_PENAL_COMPANY as company } from '../shared/futuroNaPoliciaPenalCompany';

function withHost<T>(hostname: string, run: () => T): T {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
  Object.defineProperty(globalThis, 'window', {
    configurable: true, value: { location: { hostname } },
  });
  try { return run(); } finally {
    if (original) Object.defineProperty(globalThis, 'window', original);
    else Reflect.deleteProperty(globalThis, 'window');
  }
}

// The site-config module exports a browser-initialized singleton.
const imported = withHost(company.hostname, () => import('../client/src/lib/siteConfig'));
// Keep the browser stub until the asynchronous module has evaluated.
const original = Object.getOwnPropertyDescriptor(globalThis, 'window');
Object.defineProperty(globalThis, 'window', {
  configurable: true, value: { location: { hostname: company.hostname } },
});
let getSiteConfig: typeof import('../client/src/lib/siteConfig').getSiteConfig;
try {
  ({ getSiteConfig } = await imported);
} finally {
  if (original) Object.defineProperty(globalThis, 'window', original);
  else Reflect.deleteProperty(globalThis, 'window');
}

for (const hostname of [company.hostname, `www.${company.hostname}`]) {
  test(`${hostname}: cadastro completo, sem dados de outra empresa`, () => {
    const config = withHost(hostname, () => getSiteConfig());
    for (const [key, value] of Object.entries(company)) {
      assert.equal(config[key as keyof typeof config], value, key);
    }
    assert.equal(config.siteName, company.brand);
    assert.equal(config.cnae, undefined);
    assert.equal(config.gtagId, undefined);
    assert.equal(config.gadsConversionSendTo, undefined);
    assert.equal(config.utmifyPixelId, undefined);
    assert.equal(config.oabNumero, undefined);
    assert.match(config.disclaimer, /independente.*não possui vínculo/);

    const tracking = resolveTracking(hostname)!;
    assert.ok(tracking);
    assert.equal(tracking.domain, company.hostname);
    assert.equal(tracking.title, company.razaoSocial);
    assert.equal(tracking.gtmId, undefined);
    assert.equal(tracking.gtagId, undefined);
    assert.ok(tracking.description.includes(company.cnpjFormatted));
    assert.equal(tracking.analyticsCore, 'signal.92f0d6ac');
    assert.ok(existsSync(`client/public${tracking.faviconPath}`));
    assert.ok(existsSync(`client/public${tracking.ogImage}`));
  });

  test(`${hostname}: metadados e dados estruturados usam o domínio e a empresa corretos`, () => {
    const html = injectTrackingIntoHtml(
      '<html><head><title>Anterior</title><!-- __TRACKING__ --></head></html>',
      hostname, '/',
    );
    for (const value of [company.razaoSocial, company.cnpjFormatted,
      company.email, company.telefone, company.hostname, company.cidade]) {
      assert.ok(html.includes(value), value);
    }
    assert.doesNotMatch(html, /Konig|Regnum|64\.184\.597|GTM-|googletagmanager\.com/);
    assert.match(html, /FAQPage/);
    assert.ok(html.includes(company.canonicalUrl));
  });
}

test('sitemap, cadastro da empresa e identidade de medição permanecem isolados', () => {
  const sitemap = buildSitemap(company.hostname);
  for (const path of ['/', '/sobre', '/privacidade', '/termos', '/cookies']) {
    assert.ok(sitemap.includes(`<loc>https://www.${company.hostname}${path}</loc>`));
  }
  const registered = COMPANY_DATA[company.hostname];
  assert.equal(registered.cnpj, company.cnpjFormatted);
  assert.equal(registered.phone, company.telefone);
  assert.equal(registered.emailContato, company.email);
  assert.equal(registered.stateCode, 'RO');
  const sameSignalDomains = new Set(Object.values(DOMAIN_TRACKING)
    .filter(t => t.analyticsCore === 'signal.92f0d6ac').map(t => t.domain));
  assert.deepEqual([...sameSignalDomains], [company.hostname]);
  assert.equal(resolveTracking('editalpenal.click')?.title, 'Konig Producoes LTDA');
  assert.equal(withHost('editalpenal.click', () => getSiteConfig()).cnpj, '64184597000154');
});
