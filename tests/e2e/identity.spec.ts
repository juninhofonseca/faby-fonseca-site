import { test, expect } from '@playwright/test';

test.describe('Identidade visual', () => {
  test('aplica paleta, tipografia e theme-color', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute(
      'content',
      '#F7F3EE',
    );

    const bodyStyles = await page.evaluate(() => {
      const body = getComputedStyle(document.body);
      const heading = getComputedStyle(document.querySelector('h1') as HTMLElement);
      const link = getComputedStyle(
        document.querySelector('[data-home-sobre-link]') as HTMLElement,
      );

      return {
        background: body.backgroundColor,
        color: body.color,
        bodyFont: body.fontFamily,
        headingFont: heading.fontFamily,
        linkColor: link.color,
      };
    });

    expect(bodyStyles.background).toBe('rgb(247, 243, 238)');
    expect(bodyStyles.color).toBe('rgb(43, 38, 34)');
    expect(bodyStyles.bodyFont).toContain('Inter');
    expect(bodyStyles.headingFont).toContain('Cormorant Garamond');
    expect(bodyStyles.linkColor).toBe('rgb(142, 82, 56)');
  });

  test('não contém as cores roxas do tema na folha de estilo', async ({ page, request }) => {
    await page.goto('/');

    const stylesheets = await page.$$eval('link[rel="stylesheet"]', (links) =>
      links.map((link) => (link as HTMLLinkElement).href),
    );

    let css = '';
    for (const href of stylesheets) {
      const response = await request.get(href);
      expect(response.ok()).toBeTruthy();
      css += await response.text();
    }

    expect(css.toLowerCase()).not.toMatch(/#(7c3aed|8b5cf6|a855f7|6d28d9|5b21b6|4c1d95|9333ea|c084fc)/);
  });

  test('carrega fontes apenas do próprio domínio', async ({ page, baseURL }) => {
    const fontRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'font') fontRequests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(fontRequests.length).toBeGreaterThan(0);
    for (const url of fontRequests) {
      expect(url.startsWith(baseURL ?? 'http://localhost:4321')).toBe(true);
    }
  });

  test('não cria rolagem horizontal em 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('define título, descrição, canônico e Open Graph por página', async ({ page }) => {
    const pages = [
      { path: '/', title: 'Faby Fonseca Fotografia', type: 'website' },
      { path: '/portfolio/', title: 'Portfólio | Faby Fonseca Fotografia', type: 'website' },
      { path: '/contato/', title: 'Contato | Faby Fonseca Fotografia', type: 'website' },
      {
        path: '/privacidade/',
        title: 'Política de Privacidade | Faby Fonseca Fotografia',
        type: 'article',
      },
    ];

    for (const item of pages) {
      await page.goto(item.path);

      await expect(page).toHaveTitle(item.title);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        'content',
        /.{20,}/,
      );
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href',
        new RegExp(`${item.path.replaceAll('/', '\\/')}$`),
      );
      await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
        'content',
        item.title,
      );
      await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
        'content',
        item.type,
      );
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        'content',
        /\/og\/default\.jpg$/,
      );
    }
  });

  test('mantém os endereços atuais respondendo', async ({ request }) => {
    for (const path of [
      '/',
      '/portfolio/',
      '/contato/',
      '/contato/enviado/',
      '/privacidade/',
      '/sobre/',
    ]) {
      const response = await request.get(path);
      expect(response.status(), path).toBe(200);
    }
  });
});
