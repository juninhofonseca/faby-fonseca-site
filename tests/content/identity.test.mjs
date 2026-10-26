import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const stylesDir = 'src/styles';
const tokens = readFileSync(path.join(stylesDir, 'tokens.css'), 'utf8');
const globalCss = readFileSync(path.join(stylesDir, 'global.css'), 'utf8');

function color(name) {
  const match = tokens.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `Token --color-${name} não encontrado.`);
  return match[1];
}

function luminance(hex) {
  const channels = hex
    .replace('#', '')
    .match(/.{2}/g)
    .map((value) => Number.parseInt(value, 16) / 255)
    .map((value) => (value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4));

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(foreground, background) {
  const lighter = Math.max(luminance(foreground), luminance(background));
  const darker = Math.min(luminance(foreground), luminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

test('mantém a paleta aprovada nos tokens', () => {
  assert.equal(color('bg').toLowerCase(), '#f7f3ee');
  assert.equal(color('surface').toLowerCase(), '#efe8de');
  assert.equal(color('text').toLowerCase(), '#2b2622');
  assert.equal(color('muted').toLowerCase(), '#6b615a');
  assert.equal(color('brand').toLowerCase(), '#b5715a');
  assert.equal(color('accent').toLowerCase(), '#8e5238');
});

test('atinge contraste AA nos pares usados', () => {
  const pairs = [
    ['text', 'bg', 4.5],
    ['muted', 'bg', 4.5],
    ['muted', 'surface', 4.5],
    ['accent', 'bg', 4.5],
    ['accent', 'surface', 4.5],
    ['accent-contrast', 'accent', 4.5],
    ['brand', 'bg', 3],
    ['border-strong', 'bg', 3],
  ];

  for (const [foreground, background, minimum] of pairs) {
    const ratio = contrast(color(foreground), color(background));
    assert.ok(
      ratio >= minimum,
      `${foreground} sobre ${background}: ${ratio.toFixed(2)}:1 (mínimo ${minimum}:1).`,
    );
  }
});

test('não usa #B5715A como cor de texto pequeno', () => {
  assert.doesNotMatch(globalCss, /(?:^|\s)color:\s*var\(--color-brand\)/im);
  assert.doesNotMatch(globalCss, /(?:^|\s)color:\s*#b5715a/im);
});

test('não contém nenhuma das cores roxas do tema padrão', () => {
  const purples = [
    '#7C3AED',
    '#8B5CF6',
    '#A855F7',
    '#6D28D9',
    '#5B21B6',
    '#4C1D95',
    '#9333EA',
    '#C084FC',
  ];

  const css = readdirSync(stylesDir)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(path.join(stylesDir, file), 'utf8'))
    .join('\n')
    .toLowerCase();

  for (const purple of purples) {
    assert.equal(css.includes(purple.toLowerCase()), false, `Cor roxa encontrada: ${purple}.`);
  }
});
