import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { ESTADO_PM, BRASAO_PADRAO_URL, getBrasaoUrl, getEstadoPMFromStorage, normalizeToUF } from '../client/src/utils/estadoPM';

const estados: Record<string, string> = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas',
  BA: 'Bahia', CE: 'Ceará', DF: 'Distrito Federal', ES: 'Espírito Santo',
  GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso', MS: 'Mato Grosso do Sul',
  MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima',
  SC: 'Santa Catarina', SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
};

function estadoSalvo(data: unknown) {
  const original = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: { getItem: () => data === null ? null : JSON.stringify(data) },
  });
  try {
    return getEstadoPMFromStorage();
  } finally {
    if (original) Object.defineProperty(globalThis, 'localStorage', original);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  }
}

test('cobre exatamente as 27 unidades federativas', () => {
  assert.deepEqual(Object.keys(ESTADO_PM).sort(), Object.keys(estados).sort());
});

for (const [uf, nome] of Object.entries(estados)) {
  test(`${uf}: nome, sigla e localização dos dois provedores`, () => {
    const identidade = ESTADO_PM[uf];
    assert.equal(identidade.uf, uf);
    assert.equal(identidade.sigla, `PP-${uf}`);
    assert.ok(identidade.nomeCompleto.includes(nome));
    assert.equal(normalizeToUF(uf.toLowerCase()), uf);
    assert.equal(normalizeToUF(`  ${nome.toUpperCase()}  `), uf);
    assert.equal(estadoSalvo({ regionCode: uf }), identidade);
    assert.equal(estadoSalvo({ region: nome }), identidade);
    assert.equal(estadoSalvo({ regionName: nome }), identidade);
    assert.equal(estadoSalvo({ region: uf, regionName: nome }), identidade);
  });
}

test('reconhece o Distrito Federal sem chamá-lo de estado', () => {
  assert.equal(normalizeToUF('Federal District'), 'DF');
  assert.equal(ESTADO_PM.DF.nomeCompleto, 'Polícia Penal do Distrito Federal');
});

test('prefere a UF normalizada e atualiza sem reter a localização anterior', () => {
  assert.equal(estadoSalvo({ regionCode: 'SP', regionName: 'Rio de Janeiro' })?.uf, 'SP');
  assert.equal(estadoSalvo({ regionCode: 'RJ' })?.uf, 'RJ');
  assert.equal(estadoSalvo({ region: 'Federal District' })?.uf, 'DF');
});

test('localização ausente ou desconhecida não presume São Paulo', () => {
  assert.equal(estadoSalvo(null), null);
  assert.equal(estadoSalvo({}), null);
  assert.equal(estadoSalvo({ region: 'Unknown', regionCode: 'XX' }), null);
  assert.equal(normalizeToUF(''), null);
});

for (const uf of ['AC', 'AP']) {
  test(`${uf}: usa o brasão estadual fornecido em PNG com transparência`, () => {
    const url = getBrasaoUrl(ESTADO_PM[uf]);
    assert.equal(url, `/brasoes/PP${uf}.png`);
    const png = readFileSync(`client/public${url}`);
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    // PNG color type 6 (RGBA) or 4 (grayscale + alpha).
    assert.ok([4, 6].includes(png[25]));
  });
}

test('brasões de todas as UFs e o emblema genérico apontam para arquivos existentes', () => {
  for (const estado of Object.values(ESTADO_PM)) {
    assert.ok(existsSync(`client/public${getBrasaoUrl(estado)}`), `Brasão indisponível: ${estado.uf}`);
  }
  assert.equal(getBrasaoUrl(null), BRASAO_PADRAO_URL);
  assert.equal(getBrasaoUrl(undefined), BRASAO_PADRAO_URL);
  assert.equal(getBrasaoUrl(ESTADO_PM.AL), BRASAO_PADRAO_URL);
  assert.ok(existsSync(`client/public${BRASAO_PADRAO_URL}`));
});

test('alternar estados não reutiliza o brasão de outra UF', () => {
  for (const uf of ['SP', 'AC', 'AP', 'RJ', 'DF', 'AL', 'AC']) {
    const estado = estadoSalvo({ regionCode: uf });
    assert.equal(estado?.sigla, `PP-${uf}`);
    assert.equal(getBrasaoUrl(estado), uf === 'AL' ? BRASAO_PADRAO_URL : `/brasoes/PP${uf}.png`);
  }
  assert.equal(getBrasaoUrl(estadoSalvo(null)), BRASAO_PADRAO_URL);
});
