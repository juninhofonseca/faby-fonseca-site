import { test, expect } from '@playwright/test';

test.describe('Página Sobre', () => {
  test('abre pela home e mostra o texto completo', async ({ page }) => {
    await page.goto('/');

    const link = page.locator('[data-home-sobre-link]');
    await expect(link).toContainText('Conhecer a Faby');
    await link.click();

    await expect(page).toHaveURL(/\/sobre\/$/);
    await expect(page.locator('[data-about-page] h1')).toHaveText('Sobre a Faby');
    await expect(page.locator('[data-about-page]')).toContainText(
      'A fotografia é a minha forma de guardar o que passa rápido',
    );
    await expect(page.locator('[data-about-page]')).toContainText(
      'Meu trabalho é acompanhar cada história com calma e atenção',
    );
    await expect(page.locator('[data-about-page]')).toContainText(
      'Atualizado em 25/10/2026',
    );
  });

  test('oferece caminhos para o portfólio e o orçamento', async ({ page }) => {
    await page.goto('/sobre/');

    await expect(page.locator('[data-about-cta="portfolio"]')).toHaveAttribute(
      'href',
      '/portfolio/',
    );
    await expect(page.locator('[data-about-cta="orcamento"]')).toHaveAttribute(
      'href',
      '/contato/',
    );
  });

  test('é alcançável pelo rodapé de todas as páginas', async ({ page }) => {
    for (const path of ['/', '/portfolio/', '/contato/', '/privacidade/']) {
      await page.goto(path);

      const link = page.locator('[data-footer-link="sobre"]');
      await expect(link, `rodapé de ${path}`).toHaveAttribute('href', '/sobre/');
      await expect(link).toContainText('Sobre');
    }
  });

  test('tem metadados próprios, canônicos e Open Graph', async ({ page }) => {
    await page.goto('/sobre/');

    await expect(page).toHaveTitle('Sobre | Faby Fonseca Fotografia');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Conheça Faby Fonseca/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      /\/sobre\/$/,
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Sobre | Faby Fonseca Fotografia',
    );
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
      'content',
      'article',
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      /\/og\/default\.jpg$/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content',
      'summary_large_image',
    );
  });

  test('consta no sitemap e a confirmação de contato não consta', async ({ request }) => {
    const sitemap = await request.get('/sitemap-0.xml');
    expect(sitemap.ok()).toBeTruthy();

    const text = await sitemap.text();
    expect(text).toContain('/sobre/');
    expect(text).not.toContain('/contato/enviado/');
  });

  test('não cria rolagem horizontal em 360, 640, 768 e 1280 px', async ({ page }) => {
    for (const width of [360, 640, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/sobre/');

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow, `largura ${width}px`).toBeLessThanOrEqual(1);
    }
  });
});
