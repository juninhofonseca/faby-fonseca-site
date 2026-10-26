import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_GRID_BYTES,
  MAX_ORIGINAL_BYTES,
  assertActiveCategoryCount,
  assertAlt,
  assertCategory,
  assertFeaturedCategories,
  assertHeroDimensions,
  assertSlugMatchesFolder,
  assertSobreBody,
  exceedsGridBudget,
  exceedsLimit,
  findDuplicateSlugs,
  isDotfile,
  isGridVariant,
  isKnownPlaceholderHash,
  isSupportedImage,
  parseSrcSet,
} from '../../scripts/content-rules.mjs';
import { comparePhotoOrder } from '../../src/lib/gallery-order.mjs';

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

test('rejeita corpo do Sobre vazio ou acima do limite', () => {
  assert.throws(() => assertSobreBody(''), /obrigatório/);
  assert.throws(() => assertSobreBody('   '), /obrigatório/);
  assert.throws(() => assertSobreBody('a'.repeat(4001)), /4000/);
  assert.equal(assertSobreBody('Texto válido.'), 'Texto válido.');
});

test('exige largura e altura mínimas de 2400 px no hero', () => {
  assert.doesNotThrow(() => assertHeroDimensions(4898, 3266));
  assert.throws(() => assertHeroDimensions(2399, 3266), /largura e altura/);
  assert.throws(() => assertHeroDimensions(4898, 2399), /largura e altura/);
});

test('exige exatamente cinco categorias ativas', () => {
  const five = Array.from({ length: 5 }, (_, index) => ({
    slug: `categoria-${index}`,
    active: true,
  }));

  assert.equal(assertActiveCategoryCount(five).length, 5);
  assert.throws(() => assertActiveCategoryCount(five.slice(0, 4)), /exatamente 5/);
  assert.throws(
    () => assertActiveCategoryCount([...five, { slug: 'extra', active: true }]),
    /exatamente 5/,
  );
});

test('exige slug igual ao nome da pasta', () => {
  assert.doesNotThrow(() => assertSlugMatchesFolder('casamentos', 'casamentos'));
  assert.throws(() => assertSlugMatchesFolder('casamento', 'casamentos'), /nome da pasta/);
});

test('identifica arquivos iniciados por ponto', () => {
  assert.equal(isDotfile('.gitkeep'), true);
  assert.equal(isDotfile('foto.jpg'), false);
});

test('reconhece o hash do placeholder provisório', () => {
  assert.equal(
    isKnownPlaceholderHash(
      '67d6c4a1ca5d5913ad77649cefdee41b77dfd8ac36e36b4210c2ee561af3f315',
    ),
    true,
  );
  assert.equal(isKnownPlaceholderHash('0'.repeat(64)), false);
});

test('ordena fotos por order, data e título', () => {
  const first = { order: 10, publishedAt: new Date('2026-09-12'), title: 'B' };
  const second = { order: 10, publishedAt: new Date('2026-09-13'), title: 'A' };
  const third = { order: 20, publishedAt: undefined, title: 'C' };

  assert.ok(comparePhotoOrder(first, second) < 0);
  assert.deepEqual([third, second, first].sort(comparePhotoOrder), [first, second, third]);
});

test('foto sem publishedAt conta como 0 no desempate', () => {
  const dated = { order: 10, publishedAt: new Date('2026-01-01'), title: 'A' };
  const undated = { order: 10, publishedAt: undefined, title: 'B' };

  assert.ok(comparePhotoOrder(undated, dated) < 0);
});

test('título decide quando order e data empatam', () => {
  const a = { order: 10, publishedAt: new Date('2026-01-01'), title: 'A' };
  const b = { order: 10, publishedAt: new Date('2026-01-01'), title: 'B' };

  assert.ok(comparePhotoOrder(a, b) < 0);
});
