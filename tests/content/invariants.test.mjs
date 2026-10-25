import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_GRID_BYTES,
  MAX_ORIGINAL_BYTES,
  assertAlt,
  assertCategory,
  exceedsGridBudget,
  exceedsLimit,
  findDuplicateSlugs,
  isGridVariant,
  isSupportedImage,
  parseSrcSet,
} from '../../scripts/content-rules.mjs';

test('rejeita texto alternativo vazio', () => {
  assert.throws(() => assertAlt(''), /obrigatório/);
  assert.throws(() => assertAlt('   '), /obrigatório/);
});

test('rejeita texto alternativo acima de 160 caracteres', () => {
  assert.throws(() => assertAlt('a'.repeat(161)), /160/);
  assert.equal(assertAlt('a'.repeat(160)).length, 160);
});

test('rejeita categoria inexistente', () => {
  assert.throws(
    () => assertCategory('inexistente', ['casamentos', 'ensaios']),
    /inexistente/,
  );
  assert.doesNotThrow(() =>
    assertCategory('casamentos', ['casamentos', 'ensaios']),
  );
});

test('rejeita formatos de imagem não suportados', () => {
  assert.equal(isSupportedImage('foto.gif'), false);
  assert.equal(isSupportedImage('foto.JPG'), true);
  assert.equal(isSupportedImage('foto.webp'), true);
});

test('rejeita original acima de 10 MB', () => {
  assert.equal(exceedsLimit(MAX_ORIGINAL_BYTES + 1, MAX_ORIGINAL_BYTES), true);
  assert.equal(exceedsLimit(MAX_ORIGINAL_BYTES, MAX_ORIGINAL_BYTES), false);
});

test('encontra slugs duplicados', () => {
  assert.deepEqual(findDuplicateSlugs(['a', 'b', 'a']), ['a']);
  assert.deepEqual(findDuplicateSlugs(['a', 'b']), []);
});

test('interpreta srcset e identifica variantes de grade', () => {
  const entries = parseSrcSet(
    '/_astro/a.webp 480w, /_astro/b.webp 960w, /_astro/c.webp 1600w',
  );

  assert.equal(entries.length, 3);
  assert.deepEqual(
    entries.filter(isGridVariant).map((entry) => entry.width),
    [480, 960],
  );
});

test('rejeita variante de grade acima de 300 KB', () => {
  assert.equal(exceedsGridBudget(MAX_GRID_BYTES + 1), true);
  assert.equal(exceedsGridBudget(MAX_GRID_BYTES), false);
});
