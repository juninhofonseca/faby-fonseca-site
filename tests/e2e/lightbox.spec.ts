import { test, expect } from '@playwright/test';

test.describe('Visualização ampliada', () => {
  test('abre a foto correta e navega em ciclo', async ({ page }) => {
    await page.goto('/portfolio/?categoria=casamentos');

    const cards = page.locator(
      '[data-gallery-section="casamentos"] [data-photo-card]',
    );
    await expect(cards).toHaveCount(3);

    const fullSource = await cards.nth(1).getAttribute('data-full-src');
    await cards.nth(1).click();

    const dialog = page.locator('[data-lightbox]');
    await expect(dialog).toBeVisible();
    await expect(page.locator('[data-lightbox-image]')).toHaveAttribute(
      'src',
      fullSource ?? '',
    );
    await expect(page.locator('[data-lightbox-position]')).toHaveText(
      'Foto 2 de 3',
    );

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-lightbox-position]')).toHaveText(
      'Foto 3 de 3',
    );

    await page.keyboard.press('ArrowRight');
    await expect(page.locator('[data-lightbox-position]')).toHaveText(
      'Foto 1 de 3',
    );

    await page.keyboard.press('ArrowLeft');
    await expect(page.locator('[data-lightbox-position]')).toHaveText(
      'Foto 3 de 3',
    );
  });

  test('fecha com Esc e devolve o foco ao card', async ({ page }) => {
    await page.goto('/portfolio/?categoria=casamentos');

    const card = page.locator(
      '[data-gallery-section="casamentos"] [data-photo-card]',
    ).first();

    await card.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('[data-lightbox]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('[data-lightbox]')).toBeHidden();
    await expect(card).toBeFocused();
  });

  test('fecha pelo botão', async ({ page }) => {
    await page.goto('/portfolio/?categoria=casamentos');

    await page
      .locator('[data-gallery-section="casamentos"] [data-photo-card]')
      .first()
      .click();

    await expect(page.locator('[data-lightbox]')).toBeVisible();
    await page.locator('[data-lightbox-close]').click();
    await expect(page.locator('[data-lightbox]')).toBeHidden();
  });

  test('mantém o foco dentro do diálogo ao navegar por Tab', async ({ page }) => {
    await page.goto('/portfolio/?categoria=casamentos');

    await page
      .locator('[data-gallery-section="casamentos"] [data-photo-card]')
      .first()
      .click();

    await expect(page.locator('[data-lightbox]')).toBeVisible();

    for (let index = 0; index < 10; index += 1) {
      await page.keyboard.press('Tab');
    }

    const focusInside = await page.evaluate(() => {
      const dialog = document.querySelector('[data-lightbox]');
      return dialog?.contains(document.activeElement) ?? false;
    });

    expect(focusInside).toBe(true);
  });
});
