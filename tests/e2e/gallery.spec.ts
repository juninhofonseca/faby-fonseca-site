import { test, expect } from '@playwright/test';

test.describe('Galeria por categoria', () => {
  test('lista as categorias na ordem definida', async ({ page }) => {
    await page.goto('/portfolio/');

    await expect(page.locator('[data-category-link]')).toHaveText([
      'Casamentos',
      'Ensaios',
      'Família',
      'Newborn',
      'Eventos',
    ]);
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

    const noReload = await page.evaluate(
      () => (window as Window & { __noReload?: boolean }).__noReload === true,
    );
    expect(noReload).toBe(true);
  });

  test('link direto abre a categoria pedida', async ({ page }) => {
    await page.goto('/portfolio/?categoria=ensaios');

    await expect(page.locator('[data-gallery-section="ensaios"]')).toBeVisible();
    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('slug inválido cai na primeira categoria', async ({ page }) => {
    await page.goto('/portfolio/?categoria=nao-existe');

    await expect(page.locator('[data-gallery-section="casamentos"]')).toBeVisible();
  });

  test('categoria sem fotos mostra estado vazio', async ({ page }) => {
    await page.goto('/portfolio/?categoria=newborn');

    await expect(page.locator('[data-gallery-section="newborn"]')).toBeVisible();
    await expect(
      page.locator('[data-gallery-section="newborn"] .empty-state'),
    ).toBeVisible();
  });

  test('não cria rolagem horizontal em 360, 768 e 1280 px', async ({ page }) => {
    for (const width of [360, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/portfolio/');

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
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

    // Site estático: sem JavaScript a query string não é resolvida no servidor.
    // O aprimoramento progressivo mantém todo o conteúdo acessível.
    for (const slug of ['casamentos', 'ensaios', 'familia', 'newborn', 'eventos']) {
      await expect(page.locator(`[data-gallery-section="${slug}"]`)).toBeVisible();
    }

    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'href',
      '/portfolio/?categoria=ensaios',
    );

    await context.close();
  });
});
