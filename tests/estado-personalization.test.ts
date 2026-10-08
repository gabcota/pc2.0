import assert from 'node:assert/strict';
import test from 'node:test';
import { ESTADO_PM, getEstadoPMFromStorage, normalizeToUF } from '../client/src/utils/estadoPM';

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
