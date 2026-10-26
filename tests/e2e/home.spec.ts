import { test, expect } from '@playwright/test';

const INSTAGRAM_URL = 'https://www.instagram.com/faby.fonseca.fotografia/';

test.describe('Página inicial', () => {
  test('apresenta destaque, texto e caminhos de conversão', async ({ page }) => {
    await page.goto('/');

    const hero = page.locator('[data-home-hero]');
    await expect(hero.getByRole('heading', { level: 1 })).toHaveText(
      'Histórias reais, registradas com sensibilidade',
    );
    await expect(hero).toContainText('Casamentos, ensaios, família, newborn e eventos.');

    await expect(page.locator('[data-home-cta="portfolio"]')).toHaveAttribute(
      'href',
      '/portfolio/',
    );
    await expect(page.locator('[data-home-cta="orcamento"]')).toHaveAttribute(
      'href',
      '/contato/',
    );
    await expect(
      page.locator('[data-home-cta="orcamento-final"]'),
    ).toHaveAttribute('href', '/contato/');

    await expect(page).toHaveTitle('Faby Fonseca Fotografia');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Fotografia de casamentos/,
    );
  });

  test('exibe o cabeçalho com logo, menu e CTA acessível', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('[data-site-header]');
    await expect(header.locator('.site-logo__name')).toHaveText('Faby Fonseca');
    await expect(header.locator('.site-logo__role')).toHaveText('Fotografia');
    await expect(header.getByRole('link', { name: 'Início' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await expect(header.getByRole('link', { name: 'Portfólio' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'Contato' })).toBeVisible();

    const cta = page.locator('[data-header-cta]');
    await expect(cta).toHaveAttribute('href', '/contato/');
    const box = await cta.boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });

  test('carrega a foto de destaque com prioridade, dimensões e alt', async ({
    page,
  }) => {
    await page.goto('/');

    const image = page.locator('[data-home-hero-media] img');
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute('alt', /Retrato colorido de Faby Fonseca/);
    await expect(image).toHaveAttribute('loading', 'eager');
    await expect(image).toHaveAttribute('fetchpriority', 'high');
    await expect(image).toHaveAttribute('width', /^\d+$/);
    await expect(image).toHaveAttribute('height', /^\d+$/);

    const srcset = await image.getAttribute('srcset');
    expect(srcset).toContain('480w');
  });

  test('mostra exatamente três categorias em destaque na ordem', async ({ page }) => {
    await page.goto('/');

    const cards = page.locator('[data-home-category]');
    await expect(cards).toHaveCount(3);
    await expect(cards).toHaveText([/Casamentos/, /Ensaios/, /Família/]);

    await expect(cards.nth(0)).toHaveAttribute(
      'href',
      '/portfolio/?categoria=casamentos',
    );
    await expect(cards.nth(1)).toHaveAttribute(
      'href',
      '/portfolio/?categoria=ensaios',
    );
    await expect(cards.nth(2)).toHaveAttribute(
      'href',
      '/portfolio/?categoria=familia',
    );

    for (const card of await cards.all()) {
      await expect(card).toContainText('Ver trabalhos');
      await expect(card.locator('h3')).toBeVisible();
    }
  });

  test('carrega as miniaturas das categorias sob demanda', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('[data-home-category] img');
    await expect(images).toHaveCount(3);

    for (const image of await images.all()) {
      await expect(image).toHaveAttribute('loading', 'lazy');
      const alt = await image.getAttribute('alt');
      expect(alt?.trim().length).toBeGreaterThan(0);
    }
  });

  test('abre a categoria correta ao clicar no cartão', async ({ page }) => {
    await page.goto('/');

    await page.locator('[data-home-category="ensaios"]').click();

    await expect(page).toHaveURL(/\/portfolio\/\?categoria=ensaios/);
    await expect(page.locator('[data-gallery-section="ensaios"]')).toBeVisible();
    await expect(page.locator('[data-category-link="ensaios"]')).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  test('apresenta o resumo da Faby com link para a página Sobre', async ({ page }) => {
    await page.goto('/');

    const about = page.locator('[data-home-about]');
    await expect(about.getByRole('heading', { level: 2 })).toHaveText('Sobre a Faby');
    await expect(about.locator('p.home-about__text')).toHaveCount(1);
    await expect(about).toContainText('A fotografia é a minha forma de guardar');

    const link = page.locator('[data-home-sobre-link]');
    await expect(link).toHaveAttribute('href', '/sobre/');
    await expect(link).toContainText('Conhecer a Faby');
  });

  test('linka o Instagram na home e no rodapé de todas as páginas', async ({ page }) => {
    for (const route of ['/', '/portfolio/', '/contato/', '/sobre/', '/privacidade/']) {
      await page.goto(route);

      const footerLink = page.locator('[data-footer-instagram]');
      await expect(footerLink, `rodapé de ${route}`).toHaveAttribute(
        'href',
        INSTAGRAM_URL,
      );
      await expect(footerLink).toHaveAttribute('target', '_blank');
      await expect(footerLink).toHaveAttribute('rel', /noopener/);
    }

    await page.goto('/');
    const homeLink = page.locator('[data-instagram-link]');
    await expect(homeLink).toHaveAttribute('href', INSTAGRAM_URL);
    await expect(homeLink).toContainText('@faby.fonseca.fotografia');
    await expect(homeLink).toHaveAttribute('target', '_blank');
    await expect(homeLink).toHaveAttribute('rel', /noopener/);
  });

  test('não carrega conteúdo embutido do Instagram', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('script[src*="instagram"]')).toHaveCount(0);
  });

  test('mantém hierarquia de títulos e imagens com alt', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main h2')).toHaveCount(3);

    const alts = await page
      .locator('main img')
      .evaluateAll((images) => images.map((image) => image.getAttribute('alt')));

    expect(alts.length).toBeGreaterThan(0);
    expect(alts.every((alt) => Boolean(alt && alt.trim()))).toBe(true);
  });

  test('não cria rolagem horizontal em 360, 640, 768 e 1280 px', async ({ page }) => {
    for (const width of [360, 640, 768, 1280]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );

      expect(overflow, `largura ${width}px`).toBeLessThanOrEqual(1);
    }
  });

  test('funciona sem JavaScript', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 800 },
    });
    const page = await context.newPage();

    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.locator('[data-home-category]')).toHaveCount(3);
    await expect(page.locator('[data-instagram-link]')).toBeVisible();
    await expect(page.locator('[data-home-sobre-link]')).toBeVisible();
    await expect(page.locator('[data-home-cta="orcamento-final"]')).toBeVisible();

    await context.close();
  });
});
