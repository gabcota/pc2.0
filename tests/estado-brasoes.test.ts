import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transformSync } from 'esbuild';
import ts from 'typescript';
import { ESTADO_PM, getBrasaoUrl } from '../client/src/utils/estadoPM';

// Render the actual image JSX, including images inside dialogs. No auth bypass
// or calls to geolocation, candidate, payment or SMS services are involved.
for (const filename of ['HealthRegistrationPage', 'CapturaPage', 'LoginPosPagentoPage', 'ConfirmarDadosPage']) {
  const contents = readFileSync(`client/src/pages/${filename}.tsx`, 'utf8');
  const source = ts.createSourceFile(`${filename}.tsx`, contents, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const images: string[] = [];
  function visit(node: ts.Node) {
    if (ts.isJsxSelfClosingElement(node) && node.tagName.getText(source) === 'img' &&
        node.attributes.properties.some(attr => ts.isJsxAttribute(attr) &&
          attr.name.getText(source) === 'src' && attr.initializer?.getText(source) === '{brasaoUrl}')) {
      images.push(node.getText(source));
    }
    ts.forEachChild(node, visit);
  }
  visit(source);

  test(`${filename}: todos os brasões usam a identidade estadual, incluindo modais e marcas d'água`, () => {
    assert.ok(images.length > 0, 'Imagem estadual encontrada no JSX real');
    assert.doesNotMatch(contents, /src=["'][^"']*pp-sem-fundo/);
    for (const image of images) {
      const { code } = transformSync(`(${image})`, { loader: 'jsx' });
      const render = new Function('React', 'brasaoUrl', 'sigla', 'i', `return ${code}`);
      for (const estado of [...Object.values(ESTADO_PM), null]) {
        const url = getBrasaoUrl(estado);
        const html = renderToStaticMarkup(render(React, url, estado?.sigla ?? 'PP', 0));
        assert.ok(html.includes(`src="${url}"`), `${estado?.uf ?? 'sem UF'}: ${url}`);
        if (estado?.uf !== 'SP') assert.ok(!html.includes('PPSP.png'));
        assert.doesNotMatch(html, /\/brasoes\/PM[A-Z]+\./);
      }
    }
  });
}
