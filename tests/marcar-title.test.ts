import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import { ESTADO_PM, type EstadoPMData } from '../client/src/utils/estadoPM';

// Renderiza o JSX real do título, sem carregar os efeitos ou as APIs da página.
const page = readFileSync(
  new URL('../client/src/pages/HealthRegistrationPage.tsx', import.meta.url),
  'utf8',
);
const heading = page.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
assert.ok(heading, 'Título da página /marcar encontrado');
const { code } = transformSync(`(<h1>${heading}</h1>)`, { loader: 'jsx' });
const renderHeading = new Function('React', 'estadoPM', 'sigla', `return ${code}`);

function title(estado: EstadoPMData | null): string {
  return renderToStaticMarkup(renderHeading(React, estado, estado?.sigla ?? 'PP'))
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

for (const [uf, estado] of Object.entries(ESTADO_PM)) {
  test(`/marcar: título aberto com a identidade de ${uf}`, () => {
    assert.equal(
      title(estado),
      `Concurso aberto PP-${uf} 2026: 2.600 vagas para Policial Penal e Agente Administrativo da ${estado.nomeCompleto}.`,
    );
  });
}

test('/marcar: Minas Gerais usa o nome completo solicitado', () => {
  assert.equal(ESTADO_PM.MG.nomeCompleto, 'Polícia Penal do Estado de Minas Gerais');
  assert.match(title(ESTADO_PM.MG), /^Concurso aberto PP-MG 2026:/);
  assert.ok(title(ESTADO_PM.MG).endsWith('Polícia Penal do Estado de Minas Gerais.'));
});

test('/marcar: mudança de estado não mantém São Paulo no título', () => {
  assert.match(title(ESTADO_PM.SP), /PP-SP.*Estado de São Paulo/);
  for (const estado of [ESTADO_PM.MG, ESTADO_PM.RJ, ESTADO_PM.DF, null]) {
    assert.doesNotMatch(title(estado), /PP-SP|São Paulo/);
  }
});

test('/marcar: localização desconhecida usa identificação genérica', () => {
  assert.equal(
    title(null),
    'Concurso aberto PP 2026: 2.600 vagas para Policial Penal e Agente Administrativo da Polícia Penal.',
  );
});
