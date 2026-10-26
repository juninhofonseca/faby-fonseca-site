import { test, expect } from '@playwright/test';

test.describe('Política de privacidade', () => {
  test('é alcançável pelo rodapé de todas as páginas', async ({ page }) => {
    for (const path of ['/', '/portfolio/', '/contato/', '/sobre/']) {
      await page.goto(path);

      const link = page.locator('.site-footer a', { hasText: 'Política de Privacidade' });
      await expect(link).toHaveAttribute('href', '/privacidade/');

      await link.click();
      await expect(page).toHaveURL(/\/privacidade\/$/);
      await expect(page.locator('h1')).toHaveText('Política de Privacidade');
    }
  });

  test('descreve o tratamento dos dados exigido pela LGPD', async ({ page }) => {
    await page.goto('/privacidade/');

    const headings = await page.locator('h2').allTextContents();

    expect(headings).toHaveLength(11);
    expect(headings.join(' ')).toContain('Quais dados são coletados');
    expect(headings.join(' ')).toContain('Com quem os dados são compartilhados');
    expect(headings.join(' ')).toContain('Por quanto tempo');
    expect(headings.join(' ')).toContain('Seus direitos');

    const content = await page.locator('main').innerText();

    expect(content).toContain('Web3Forms');
    expect(content).toContain('LGPD');
    expect(content).toContain('não usa cookies');
    expect(content).toContain('rastreadores');
    expect(content).toContain('juninho.fonseca@gmail.com');
    expect(content).toMatch(/Versão 2026-10-25 — vigente desde 25\/10\/2026/);
  });

  test('é referenciada no consentimento do formulário', async ({ page }) => {
    await page.goto('/contato/');

    const consent = page.locator('.form-consent');

    await expect(consent.locator('a')).toHaveAttribute('href', '/privacidade/');
    await expect(consent.locator('[data-field="consent"]')).not.toBeChecked();
  });

  test('aparece no sitemap e a confirmação não aparece', async ({ request }) => {
    const sitemap = await request.get('/sitemap-index.xml');
    expect(sitemap.ok()).toBeTruthy();

    const index = await sitemap.text();
    const urls = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    expect(urls.join(' ')).toContain('sitemap-0.xml');

    const detail = await request.get('/sitemap-0.xml');
    expect(detail.ok()).toBeTruthy();
    const detailText = await detail.text();

    expect(detailText).toContain('/privacidade/');
    expect(detailText).toContain('/sobre/');
    expect(detailText).not.toContain('/contato/enviado/');
  });
});
