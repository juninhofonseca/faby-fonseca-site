import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_GRID_BYTES,
  MAX_ORIGINAL_BYTES,
  assertAlt,
  assertCategory,
  assertFeaturedCategories,
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

test('aceita três categorias em destaque ativas e distintas', () => {
  const featured = ['casamentos', 'ensaios', 'familia'];

  assert.deepEqual(
    assertFeaturedCategories(featured, [
      'casamentos',
      'ensaios',
      'familia',
      'newborn',
      'eventos',
    ]),
    featured,
  );
});

test('rejeita quantidade diferente de três categorias em destaque', () => {
  assert.throws(
    () => assertFeaturedCategories(['casamentos', 'ensaios'], ['casamentos', 'ensaios']),
    /exatamente 3/,
  );
  assert.throws(
    () => assertFeaturedCategories([], []),
    /exatamente 3/,
  );
});

test('rejeita categoria em destaque repetida', () => {
  assert.throws(
    () =>
      assertFeaturedCategories(
        ['casamentos', 'ensaios', 'casamentos'],
        ['casamentos', 'ensaios', 'familia'],
      ),
    /repetir/,
  );
});

test('rejeita categoria em destaque inexistente ou inativa', () => {
  assert.throws(
    () =>
      assertFeaturedCategories(
        ['casamentos', 'ensaios', 'newborn'],
        ['casamentos', 'ensaios', 'familia'],
      ),
    /inexistente ou inativa/,
  );
});

test('rejeita slug inválido em categoria em destaque', () => {
  assert.throws(
    () =>
      assertFeaturedCategories(
        ['casamentos', 'ensaios', 'Família'],
        ['casamentos', 'ensaios', 'familia'],
      ),
    /slugs válidos/,
  );
});
