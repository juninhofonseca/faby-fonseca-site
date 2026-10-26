import { test, expect } from '@playwright/test';

const SLUGS = ['casamentos', 'ensaios', 'familia', 'newborn', 'eventos'] as const;

test.describe('Galeria por categoria', () => {
  test('lista Todos e as cinco categorias na ordem definida', async ({ page }) => {
    await page.goto('/portfolio/');

    await expect(page.locator('[data-category-link]')).toHaveText([
      'Todos',
      'Casamentos',
      'Ensaios',
      'Família',
      'Newborn',
      'Eventos',
    ]);
  });

  test('abre em Todos com todas as seções visíveis', async ({ page }) => {
    await page.goto('/portfolio/');

    for (const slug of SLUGS) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }

    await expect(page.locator('[data-category-link="todos"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('[data-budget-cta]')).toHaveAttribute('href', '/contato/');
  });

  test('filtra sem recarregar e atualiza a URL', async ({ page }) => {
    await page.goto('/portfolio/');
    await page.evaluate(() => {
      (window as Window & { __noReload?: boolean }).__noReload = true;
    });

    await page.getByRole('link', { name: 'Ensaios' }).click();

    await expect(page).toHaveURL(/categoria=ensaios/);
    await expect(page.locator('[data-gallery-section="ensaios"]')).toBeVisible();
    await expect(page.locator('[data-gallery-section="casamentos"]')).toBeHidden();
    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(page.locator('[data-budget-cta]')).toHaveAttribute(
      'href',
      '/contato/?categoria=ensaios',
    );

    const noReload = await page.evaluate(
      () => (window as Window & { __noReload?: boolean }).__noReload === true,
    );
    expect(noReload).toBe(true);
  });

  test('clicar em Todos volta a exibir todas as seções e limpa a query', async ({ page }) => {
    await page.goto('/portfolio/?categoria=ensaios');
    await expect(page.locator('[data-gallery-section="casamentos"]')).toBeHidden();

    await page.getByRole('link', { name: 'Todos' }).click();

    await expect(page).toHaveURL(/\/portfolio\/$/);
    for (const slug of SLUGS) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }
    await expect(page.locator('[data-category-link="todos"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('link direto abre a categoria pedida', async ({ page }) => {
    await page.goto('/portfolio/?categoria=ensaios');

    await expect(page.locator('[data-gallery-section="ensaios"]')).toBeVisible();
    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('slug inválido cai em Todos', async ({ page }) => {
    await page.goto('/portfolio/?categoria=nao-existe');

    for (const slug of SLUGS) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }
    await expect(page.locator('[data-category-link="todos"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('botão voltar restaura a visão anterior', async ({ page }) => {
    await page.goto('/portfolio/');
    await page.getByRole('link', { name: 'Ensaios' }).click();
    await expect(page.locator('[data-gallery-section="casamentos"]')).toBeHidden();

    await page.goBack();

    await expect(page).toHaveURL(/\/portfolio\/$/);
    for (const slug of SLUGS) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }
  });

  test('categoria sem fotos mostra estado vazio', async ({ page }) => {
    await page.goto('/portfolio/?categoria=newborn');

    await expect(page.locator('[data-gallery-section="newborn"]')).toBeVisible();
    await expect(
      page.locator('[data-gallery-section="newborn"] .empty-state'),
    ).toBeVisible();
  });

  test('não cria rolagem horizontal em 360, 640, 768 e 1280 px', async ({ page }) => {
    for (const width of [360, 640, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/portfolio/');

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow, `largura ${width}px`).toBeLessThanOrEqual(1);
    }
  });

  test('funciona sem JavaScript exibindo todas as categorias', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    await page.goto('/portfolio/?categoria=ensaios');

    for (const slug of SLUGS) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }

    await expect(page.locator('[data-category-link="todos"]')).toHaveAttribute(
      'href',
      '/portfolio/',
    );
    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'href',
      '/portfolio/?categoria=ensaios',
    );

    await context.close();
  });
});
